<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

type Layer = { id: string; name: string; kind: 'text' | 'shape' | 'image'; visible: boolean; locked: boolean };
const layers = defineModel<Layer[]>({ required: true });

const list = useTemplateRef<HTMLElement>('list');
// `items` is the draft: the panel reorders while you drag. `layers` (the model) changes
// on drop, so the artboard, which reads it, restacks then.
const { items } = makeSortableList(list, { items: layers, axis: 'y' });
</script>

<template>
  <section class="panel">
    <h4>Layers</h4>
    <ul ref="list" class="layers">
      <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
    </ul>
    <!-- Always last, so it isn't in the list at all. -->
    <div class="background">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
      Background
    </div>
  </section>
</template>

<style scoped>
.panel {
  box-sizing: border-box;
  width: 260px;
  max-width: 100%;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
}

h4 {
  margin: 4px 6px 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
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

.background {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  margin-top: 2px;
  padding: 0 10px;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  font-size: 13px;
  opacity: 0.5;
}

svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}
</style>
