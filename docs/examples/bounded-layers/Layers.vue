<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList, restrictToParent } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

const layers = ref([
  { id: 'heading', name: 'Heading', kind: 'T' },
  { id: 'subtitle', name: 'Subtitle', kind: 'T' },
  { id: 'photo', name: 'Hero photo', kind: '▣' },
  { id: 'badge', name: 'Badge', kind: '◯' },
  { id: 'card', name: 'Card', kind: '▢' },
  { id: 'background', name: 'Background', kind: '▢' },
]);

const list = useTemplateRef<HTMLElement>('list');
// Up and down only, and never out of the panel. Held at its edge, the row still
// reaches the first and the last place: past the edge, the list follows the pointer.
const { items } = makeSortableList(list, { items: layers, axis: 'y', modifiers: [restrictToParent] });
</script>

<template>
  <section class="panel">
    <h3>Layers</h3>
    <ul ref="list" class="layers">
      <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
    </ul>
  </section>
</template>

<style scoped>
.panel {
  width: min(100%, 240px);
  margin: 0 auto;
  padding: 8px;
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

h3 {
  margin: 4px 6px 8px;
  font: 600 11px/1 system-ui, sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.55;
}

.layers {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
