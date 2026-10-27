<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ layer: { id: string; name: string; kind: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.layer });
</script>

<template>
  <li ref="el" class="layer">
    <span class="kind">{{ layer.kind }}</span>
    {{ layer.name }}
  </li>
</template>

<style scoped>
.layer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.layer:hover {
  background: color-mix(in srgb, currentColor 7%, Canvas);
}

.layer:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

[data-dnd-overlay] .layer {
  background: color-mix(in srgb, #42b883 16%, Canvas);
  box-shadow: 0 10px 20px -10px rgb(0 0 0 / 0.6);
}

.layer[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 60%, transparent);
  color: transparent;
}

.layer[data-dnd-placeholder] .kind {
  visibility: hidden;
}

.kind {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
}
</style>
