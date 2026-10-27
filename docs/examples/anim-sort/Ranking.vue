<script setup lang="ts">
import { computed, ref, shallowRef, useTemplateRef } from 'vue';
import { makeSortableList, type LayoutAnimation } from '@vue-dnd-kit/core';
import RankRow from './RankRow.vue';

/** A function of your own: the rows overshoot their place a little, then settle. */
const springy: LayoutAnimation = ({ element, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  return element.animate(
    [{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: '0 0' }],
    { duration: 500, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
  );
};

const OPTIONS: { label: string; animation: LayoutAnimation }[] = [
  { label: 'true', animation: true },
  { label: '{ duration: 600 }', animation: { duration: 600 } },
  { label: 'springy()', animation: springy },
  { label: 'false', animation: false },
];
const choice = shallowRef(OPTIONS[0]!);

const ideas = ref([
  { id: 'search', title: 'Faster search', votes: 128 },
  { id: 'dark', title: 'Dark mode', votes: 96 },
  { id: 'export', title: 'Export to PDF', votes: 71 },
  { id: 'offline', title: 'Offline mode', votes: 54 },
  { id: 'api', title: 'Public API', votes: 33 },
]);

const list = useTemplateRef<HTMLElement>('list');
// `animation` takes a value or a ref (a function is an animation, not a getter):
// a computed switches it for the next move.
const { items } = makeSortableList(list, {
  items: ideas,
  animation: computed(() => choice.value.animation),
});
</script>

<template>
  <div class="ranking">
    <div class="options" role="group" aria-label="animation">
      <button
        v-for="option in OPTIONS"
        :key="option.label"
        type="button"
        :aria-pressed="choice === option"
        @click="choice = option"
      >
        {{ option.label }}
      </button>
    </div>
    <ol ref="list" class="rows">
      <RankRow v-for="idea in items" :key="idea.id" :idea="idea" />
    </ol>
  </div>
</template>

<style scoped>
.ranking {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: min(100%, 340px);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
