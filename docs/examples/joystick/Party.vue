<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Hero from './Hero.vue';

const heroes = ref([
  { id: 'knight', name: 'Brienne', role: 'Knight', level: 12, hue: 210 },
  { id: 'mage', name: 'Ilyas', role: 'Mage', level: 9, hue: 270 },
  { id: 'rogue', name: 'Vex', role: 'Rogue', level: 11, hue: 330 },
  { id: 'cleric', name: 'Odette', role: 'Cleric', level: 8, hue: 45 },
  { id: 'ranger', name: 'Tamsin', role: 'Ranger', level: 10, hue: 140 },
]);
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: heroes });
</script>

<template>
  <section class="party">
    <h3>Party order</h3>
    <ol ref="list" class="list">
      <Hero v-for="(hero, index) in items" :key="hero.id" :hero="hero" :slot-number="index + 1" />
    </ol>
  </section>
</template>

<style scoped>
.party {
  width: min(260px, 100%);
}

h3 {
  margin: 0 0 10px 4px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
