<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Flag from './Flag.vue';
import FlagOverlay from './FlagOverlay.vue';

const WORD = 'SPRING';
// The word's letters, shuffled. Colored in the word's order: spelled, they make a rainbow.
const flags = ref([...'RSIGPN'].map((letter) => ({ id: letter, letter, hue: (WORD.indexOf(letter) * 55 + 340) % 360 })));
const spelled = computed(() => flags.value.map((flag) => flag.letter).join('') === WORD);

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: flags, strategy: 'horizontal', overlay: FlagOverlay });
</script>

<template>
  <div class="garland">
    <ol ref="list" class="string">
      <Flag v-for="flag in items" :key="flag.id" :flag="flag" />
    </ol>
    <p class="goal" :class="{ spelled }">{{ spelled ? 'Spelled!' : `Spell ${WORD}` }}</p>
  </div>
</template>

<style scoped>
.garland {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* The flags hang from a string. */
.string {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 0 14px;
  border-top: 2px solid color-mix(in srgb, currentColor 35%, transparent);
  list-style: none;
}

.goal {
  margin: 0;
  font: 600 12px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  opacity: 0.6;
}

.goal.spelled {
  color: #42b883;
  opacity: 1;
}
</style>
