<script setup lang="ts">
import type { TransitionProps } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Shop from './Shop.vue';

// How one overlay turns into another (the product chip into the cart's thumbnail and
// back): the new one pops in, the old one shrinks away on top of it.
const pop = (element: Element, keyframes: Keyframe[], done: () => void) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
  (element as HTMLElement).animate(keyframes, { duration: 220, easing: 'cubic-bezier(0.3, 1.4, 0.5, 1)' }).finished.then(done, done);
};
const morph: TransitionProps = {
  css: false,
  onEnter: (element, done) => pop(element, [{ opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 }], done),
  onLeave: (element, done) => {
    // Out of the flow, so both fit in the overlay box while they change.
    Object.assign((element as HTMLElement).style, { position: 'absolute', inset: '0' });
    pop(element, [{ opacity: 1 }, { opacity: 0, scale: 0.5 }], done);
  },
};
</script>

<template>
  <DnDProvider :overlay-transition="morph">
    <Shop />
  </DnDProvider>
</template>
