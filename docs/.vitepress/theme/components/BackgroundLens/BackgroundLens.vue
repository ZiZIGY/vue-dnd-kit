<template>
  <div
    ref="containerRef"
    :class="['w-full h-full relative overflow-hidden pointer-events-none!', ($attrs as { class?: string }).class]"
  />
</template>

<script setup lang="ts">
  import frag from './fragment.glsl?raw';
  import vert from './vertex.glsl?raw';

  import * as THREE from 'three';
  import { ref, onMounted, onUnmounted } from 'vue';

  const MAX_COLORS = 8;

  const FALLBACK_COLORS = ['#42b883', '#5ab8c8', '#9080d0', '#e0a058'];

  const containerRef = ref<HTMLElement | null>(null);
  const rendererRef = ref<THREE.WebGLRenderer | null>(null);
  const materialRef = ref<THREE.ShaderMaterial | null>(null);

  const rotationValue = ref(45);
  const autoRotateValue = ref(0);
  const pointerTarget = ref(new THREE.Vector2(0, 0));
  const pointerCurrent = ref(new THREE.Vector2(0, 0));
  const pointerSmooth = ref(8);

  let rafId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let clock: THREE.Clock | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.OrthographicCamera | null = null;
  let mesh: THREE.Mesh | null = null;
  let themeObserver: MutationObserver | null = null;

  const getProjectColors = (): string[] => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const colors: string[] = [];
    for (let i = 1; i <= MAX_COLORS; i++) {
      const c = style.getPropertyValue(`--bg-lens-${i}`).trim();
      if (c) colors.push(c);
    }
    return colors.length > 0 ? colors : FALLBACK_COLORS;
  };

  const parseCssColor = (css: string): THREE.Vector3 => {
    const rgb = css.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgb) {
      return new THREE.Vector3(
        parseInt(rgb[1], 10) / 255,
        parseInt(rgb[2], 10) / 255,
        parseInt(rgb[3], 10) / 255
      );
    }
    const h = css.replace('#', '').trim();
    if (h.length === 3) {
      return new THREE.Vector3(
        parseInt(h[0] + h[0], 16) / 255,
        parseInt(h[1] + h[1], 16) / 255,
        parseInt(h[2] + h[2], 16) / 255
      );
    }
    if (h.length >= 6) {
      return new THREE.Vector3(
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255
      );
    }
    return new THREE.Vector3(0, 0, 0);
  };

  const updateUniforms = () => {
    if (!materialRef.value) return;

    const material = materialRef.value;
    const colors = getProjectColors()
      .filter(Boolean)
      .slice(0, MAX_COLORS)
      .map(parseCssColor);
    const uColorsArray = material.uniforms.uColors.value as THREE.Vector3[];

    for (let i = 0; i < MAX_COLORS; i++) {
      if (i < colors.length) {
        uColorsArray[i].copy(colors[i]);
      } else {
        uColorsArray[i].set(0, 0, 0);
      }
    }

    material.uniforms.uColorCount.value = colors.length;
    material.uniforms.uTransparent.value = 1;

    if (rendererRef.value) {
      rendererRef.value.setClearColor(0x000000, 0);
    }
  };

  const handleResize = () => {
    if (!containerRef.value || !rendererRef.value || !materialRef.value) return;

    const w = containerRef.value.clientWidth || 1;
    const h = containerRef.value.clientHeight || 1;

    rendererRef.value.setSize(w, h, false);
    (materialRef.value.uniforms.uCanvas.value as THREE.Vector2).set(w, h);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!containerRef.value) return;

    const rect = containerRef.value.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    pointerTarget.value.set(x, y);
  };

  const animationLoop = () => {
    if (!materialRef.value || !scene || !camera || !rendererRef.value || !clock)
      return;

    const dt = clock.getDelta();
    const elapsed = clock.elapsedTime;

    materialRef.value.uniforms.uTime.value = elapsed;

    const deg = (rotationValue.value % 360) + autoRotateValue.value * elapsed;
    const rad = (deg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    (materialRef.value.uniforms.uRot.value as THREE.Vector2).set(c, s);

    const cur = pointerCurrent.value;
    const tgt = pointerTarget.value;
    const amt = Math.min(1, dt * pointerSmooth.value);
    cur.lerp(tgt, amt);
    (materialRef.value.uniforms.uPointer.value as THREE.Vector2).copy(cur);

    rendererRef.value.render(scene, camera);
    rafId = requestAnimationFrame(animationLoop);
  };

  onMounted(() => {
    if (!containerRef.value) return;

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uColorsArray = Array.from(
      { length: MAX_COLORS },
      () => new THREE.Vector3(0, 0, 0)
    );

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 1 },
        uSpeed: { value: 0.5 },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: uColorsArray },
        uTransparent: { value: 1 },
        uScale: { value: 1 },
        uFrequency: { value: 1 },
        uWarpStrength: { value: 1 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: 1 },
        uParallax: { value: 0.5 },
        uNoise: { value: 0.1 },
        uOpacity: { value: 0.75 },
      },
      premultipliedAlpha: true,
      transparent: true,
    });

    materialRef.value = material;
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
    });

    rendererRef.value = renderer;
    (renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    containerRef.value.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    handleResize();
    updateUniforms();

    themeObserver = new MutationObserver(() => {
      updateUniforms();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.value);
    } else {
      (window as any).addEventListener('resize', handleResize);
    }

    containerRef.value.addEventListener('pointermove', handlePointerMove);

    rafId = requestAnimationFrame(animationLoop);
  });

  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    themeObserver?.disconnect();
    themeObserver = null;

    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      (window as any).removeEventListener('resize', handleResize);
    }

    if (containerRef.value) {
      containerRef.value.removeEventListener('pointermove', handlePointerMove);
    }

    if (mesh) {
      mesh.geometry.dispose();
    }

    if (materialRef.value) {
      materialRef.value.dispose();
    }

    if (rendererRef.value) {
      rendererRef.value.dispose();
      if (
        rendererRef.value.domElement &&
        containerRef.value?.contains(rendererRef.value.domElement)
      ) {
        containerRef.value.removeChild(rendererRef.value.domElement);
      }
    }
  });
</script>
