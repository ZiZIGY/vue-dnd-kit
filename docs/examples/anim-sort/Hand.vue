<script setup lang="ts">
import { ref, shallowRef, useTemplateRef } from 'vue';
import { makeSortableList, type DropAnimation, type LayoutAnimation } from '@vue-dnd-kit/core';
import Picker from './Picker.vue';
import PlayingCard from './PlayingCard.vue';

/** Sorting, a function of your own: the cards overshoot their new place a little, then settle. */
const springy: LayoutAnimation = ({ element, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  return element.animate(
    [{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: '0 0' }],
    { duration: 500, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
  );
};

/** The drop, a function of your own: the overlay arcs to its slot, as if tossed. */
const toss: DropAnimation = ({ overlay, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  // No visible slot to land on: fade out where it is.
  if (!to) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
  const place = (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`;
  const rise = Math.min(120, Math.hypot(to.left - from.left, to.top - from.top) / 2);
  return overlay.animate(
    [
      { transform: place(from.left, from.top), width: `${from.width}px`, height: `${from.height}px` },
      { transform: place((from.left + to.left) / 2, Math.min(from.top, to.top) - rise), offset: 0.45 },
      { transform: place(to.left, to.top), width: `${to.width}px`, height: `${to.height}px` },
    ],
    { duration: 550, easing: 'ease-in-out', fill: 'forwards' },
  );
};

const SORTING: { label: string; value: LayoutAnimation }[] = [
  { label: 'true', value: true },
  { label: '{ duration: 600 }', value: { duration: 600 } },
  { label: 'springy', value: springy },
  { label: 'false', value: false },
];
const LANDING: { label: string; value: DropAnimation }[] = [
  { label: 'true', value: true },
  { label: '{ duration: 700 }', value: { duration: 700 } },
  { label: 'toss', value: toss },
  { label: 'false', value: false },
];
const animation = shallowRef<LayoutAnimation>(true);
const dropAnimation = shallowRef<DropAnimation>(true);

const cards = ref([
  { id: 'A♠', rank: 'A', suit: '♠' },
  { id: 'K♥', rank: 'K', suit: '♥' },
  { id: 'Q♣', rank: 'Q', suit: '♣' },
  { id: 'J♦', rank: 'J', suit: '♦' },
  { id: '10♥', rank: '10', suit: '♥' },
]);

const table = useTemplateRef<HTMLElement>('table');
// Both options take a value or a ref (a function is an animation, not a getter): `animation`
// is read for every move, `dropAnimation` at every drop.
const { items } = makeSortableList(table, {
  items: cards,
  strategy: 'horizontal',
  // Let go off the table and the card flies back: a long flight to watch.
  dropOutside: 'cancel',
  animation,
  dropAnimation,
});
</script>

<template>
  <div class="hand">
    <div class="pickers">
      <Picker v-model="animation" name="animation" :options="SORTING" />
      <Picker v-model="dropAnimation" name="dropAnimation" :options="LANDING" />
    </div>
    <div ref="table" class="table">
      <PlayingCard v-for="card in items" :key="card.id" :card="card" />
    </div>
  </div>
</template>

<style scoped>
.hand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

/* Each option on a row: its name, then its values. */
.pickers {
  display: grid;
  grid-template-columns: auto auto;
  gap: 8px 12px;
}

.table {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 18px;
  border-radius: 18px;
  background: color-mix(in srgb, #42b883 12%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 30%, transparent);
}

@media (max-width: 520px) {
  .pickers {
    grid-template-columns: auto;
    justify-items: center;
  }
}
</style>
