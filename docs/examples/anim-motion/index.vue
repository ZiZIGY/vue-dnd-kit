<script setup lang="ts">
import { animate } from 'motion-v';
import { DnDProvider, type DropAnimationContext, type LayoutAnimationContext } from '@vue-dnd-kit/core';
import Garland from './Garland.vue';

const spring = { type: 'spring', duration: 0.5, bounce: 0.3 } as const;

/** Flags spring to their new places, on the CSS `translate` property. */
const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const controls = animate(element, { translate: [`${from.left - to.left}px ${from.top - to.top}px`, '0px 0px'] }, spring);
  // The flag moves again before it arrives: stop and clear at once, the library measures next.
  signal.addEventListener('abort', () => {
    controls.stop();
    element.style.translate = '';
  });
  return controls.finished;
};

/** The overlay springs onto its slot: its position and its size. */
const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return animate(overlay, { opacity: 0 }, { duration: 0.18 }).finished;
  return animate(
    overlay,
    { x: [from.left, to.left], y: [from.top, to.top], width: [from.width, to.width], height: [from.height, to.height] },
    spring,
  ).finished;
};
</script>

<template>
  <DnDProvider :animation="move" :drop-animation="drop">
    <Garland />
  </DnDProvider>
</template>
