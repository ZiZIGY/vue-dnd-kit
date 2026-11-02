<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
  import { useDnD, type OverlayProps } from '@vue-dnd-kit/core';
  import { createScene, createWaterRenderer } from './water';
  import { SPLASH, compose, createJelly, createSplash, type Splash } from './droplet';

  // The water's overlay: it leaves the seed's own (its default slot) out and shows a
  // droplet, drawn by a shader (water.ts). In the drag it trails the pointer like jelly;
  // on `dropping` it splashes. The drop waits for the overlay's animations, and the
  // splash's clock is one: an animation of the canvas that the shader reads.
  const props = defineProps<OverlayProps>();
  const { pointer } = useDnD();
  const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
  const drawn = ref(true);
  const splashing = ref(false);

  let clock: Animation | null = null;
  let thrown: Splash | null = null;
  // Dropped on the water (a cancelled drag flies back with no target).
  const dropped = computed(() => props.status === 'dropping' && !!props.over);
  const splash = () => {
    if (clock || !canvas.value) return;
    thrown = createSplash();
    splashing.value = true;
    clock = canvas.value.animate([{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], {
      duration: SPLASH,
      fill: 'forwards',
    });
  };
  watch(dropped, (now) => now && splash(), { flush: 'post' });

  /** `rgb()` or `color(srgb …)`, as browsers compute a `color-mix()`, in 0–1. */
  const rgbOf = (color: string): number[] => {
    const [r = 0, g = 0, b = 0] = color.match(/[\d.]+/g)?.map(Number) ?? [];
    return color.startsWith('color(') ? [r, g, b] : [r / 255, g / 255, b / 255];
  };

  /** Where the seed is held in the overlay's box: the drop forms there, under the pointer. */
  const grab = ref<{ left: string; top: string }>();

  // Unmounted, the droplet may still be on screen: a change of overlay fades it out.
  // It draws on until it has left the page; a GL context lost before shows a blank canvas.
  let unmounted = false;
  onUnmounted(() => (unmounted = true));
  onMounted(() => {
    const element = canvas.value!;
    const box = element.parentElement!.getBoundingClientRect();
    if (pointer.value) grab.value = { left: `${pointer.value.x - box.left}px`, top: `${pointer.value.y - box.top}px` };
    // The canvas's `color` is the water under it: what the drop shows through.
    const renderer = createWaterRenderer(element, rgbOf(getComputedStyle(element).color));
    drawn.value = !!renderer;
    if (dropped.value) splash();
    if (!renderer) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const jelly = createJelly();
    const scene = createScene();
    const born = performance.now();
    let last = born;
    const tick = (now: number) => {
      if (unmounted && !element.isConnected) return renderer.destroy();
      requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      // Dropped, it is done with the pointer: that is the next drag's.
      if (!clock && !calm) jelly.step(pointer.value, dt);
      compose(scene, {
        age: (now - born) / 1000,
        lag: jelly.lag,
        splash: clock && thrown ? { throw: thrown, time: Number(clock.currentTime ?? 0) / 1000 } : null,
        calm,
      });
      renderer.draw(scene);
    };
    requestAnimationFrame(tick);
  });
</script>

<template>
  <div
    class="droplet"
    data-overlay-kind="droplet"
    :data-state="status"
    :data-splash="splashing || undefined"
  >
    <canvas
      ref="canvas"
      aria-hidden="true"
      :style="grab"
    />
    <!-- Without WebGL: a plain drop. -->
    <span
      v-if="!drawn"
      class="plain"
      :style="grab"
    />
  </div>
</template>

<style scoped>
  .droplet {
    position: relative;
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 320px;
    height: 220px;
    translate: -50% -50%;
    pointer-events: none;
    /* Read by the shader: the water zone under the drop (WaterZone.vue, while over it). */
    color: color-mix(in srgb, #3b82f6 18%, var(--ui-bg));
  }

  .plain {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    width: 34px;
    height: 34px;
    background: #3b82f6;
    border-radius: 0 50% 50% 50%;
    rotate: 45deg;
  }
</style>
