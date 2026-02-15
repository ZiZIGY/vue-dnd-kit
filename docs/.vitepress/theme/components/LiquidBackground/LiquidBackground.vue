<script lang="ts" setup>
  import type { HTMLAttributes } from 'vue';
  import { Mesh, Program, Renderer, Triangle } from 'ogl';
  import { onMounted, onUnmounted, ref } from 'vue';

  const props = defineProps<{ class?: HTMLAttributes['class'] }>();

  const containerRef = ref<HTMLDivElement | null>(null);

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 1, 1];
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  };

  function getThemeColors() {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const bg = style.getPropertyValue('--vp-c-bg').trim() || '#f8f9fa';
    const lens1 = style.getPropertyValue('--bg-lens-1').trim() || '#42b883';
    const lens2 = style.getPropertyValue('--bg-lens-2').trim() || '#5ab8c8';
    const lens3 = style.getPropertyValue('--bg-lens-3').trim() || '#9080d0';
    const lens4 = style.getPropertyValue('--bg-lens-4').trim() || '#e0a058';
    return {
      bg,
      color1: lens1,
      color2: lens2,
      color3: lens3,
      color4: lens4,
    };
  }

  const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColorBg;
uniform float uAccentStrength;
uniform float uDarken;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  vec3 colDark=uColorBg;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float phase=0.5+0.5*sin(blendX*2.5+t*0.4);
  float phase2=0.5+0.5*sin(blendX*2.5+t*0.35+1.5);
  vec3 colLav=mix(uColor1,uColor2,phase);
  vec3 colOrg=mix(uColor3,uColor4,phase2);
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);
  col=mix(colDark,col,uAccentStrength);
  col*=uDarken;
  col=clamp(col,0.0,1.0);
  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

  let rafId = 0;
  let renderer: Renderer | null = null;
  let mesh: Mesh | null = null;
  let program: Program | null = null;
  let themeObserver: MutationObserver | null = null;
  let startTime = 0;

  function applyThemeColors() {
    if (!program) return;
    const c = getThemeColors();
    const u = program.uniforms;
    (u.uColor1 as { value: Float32Array }).value.set(hexToRgb(c.color1));
    (u.uColor2 as { value: Float32Array }).value.set(hexToRgb(c.color2));
    (u.uColor3 as { value: Float32Array }).value.set(hexToRgb(c.color3));
    (u.uColor4 as { value: Float32Array }).value.set(hexToRgb(c.color4));
    (u.uColorBg as { value: Float32Array }).value.set(hexToRgb(c.bg));
  }

  onMounted(() => {
    const container = containerRef.value;
    if (!container) return;

    const rendererOpts = {
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    };
    renderer = new Renderer(rendererOpts);
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    container.appendChild(canvas);

    const colors = getThemeColors();
    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: 1.0 },
        uColorBalance: { value: 0.0 },
        uWarpStrength: { value: 1.0 },
        uWarpFrequency: { value: 5.0 },
        uWarpSpeed: { value: 8.0 },
        uWarpAmplitude: { value: 50.0 },
        uBlendAngle: { value: 0.0 },
        uBlendSoftness: { value: 0.05 },
        uRotationAmount: { value: 500.0 },
        uNoiseScale: { value: 2.0 },
        uGrainAmount: { value: 0.08 },
        uGrainScale: { value: 2.0 },
        uGrainAnimated: { value: 0.0 },
        uContrast: { value: 1.5 },
        uGamma: { value: 1.0 },
        uSaturation: { value: 1.0 },
        uCenterOffset: { value: new Float32Array([0, 0]) },
        uZoom: { value: 0.9 },
        uColor1: { value: new Float32Array(hexToRgb(colors.color1)) },
        uColor2: { value: new Float32Array(hexToRgb(colors.color2)) },
        uColor3: { value: new Float32Array(hexToRgb(colors.color3)) },
        uColor4: { value: new Float32Array(hexToRgb(colors.color4)) },
        uColorBg: { value: new Float32Array(hexToRgb(colors.bg)) },
        uAccentStrength: { value: 0.28 },
        uDarken: { value: 0.85 },
      },
    });

    mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      if (!container || !renderer) return;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      if (program) {
        const res = (program.uniforms.iResolution as { value: Float32Array })
          .value;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
      }
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    startTime = performance.now();
    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop);
      if (program && mesh && renderer) {
        (program.uniforms.iTime as { value: number }).value =
          (t - startTime) * 0.001;
        renderer.render({ scene: mesh });
      }
    };
    rafId = requestAnimationFrame(loop);

    themeObserver = new MutationObserver(applyThemeColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  });

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    themeObserver?.disconnect();
    themeObserver = null;
    const container = containerRef.value;
    if (container && renderer?.gl?.canvas) {
      try {
        container.removeChild(renderer.gl.canvas);
      } catch {
        // ignore
      }
    }
    renderer = null;
    mesh = null;
    program = null;
  });
</script>

<template>
  <div
    ref="containerRef"
    class="relative size-full overflow-hidden block"
    :class="[props?.class]"
  />
</template>
