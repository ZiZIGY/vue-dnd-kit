<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import AppIcon from './AppIcon.vue';

const props = defineProps<{ app: { id: string; name: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.app });
</script>

<template>
  <div ref="el" class="tile">
    <AppIcon :id="app.id" />
    <span class="name">{{ app.name }}</span>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  user-select: none;
}

.name {
  font-size: 12px;
  opacity: 0.75;
}

.tile:focus-visible {
  outline: none;
}

.tile:focus-visible .icon {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

/* The slot the dragged app will land in. */
.tile[data-dnd-placeholder] {
  opacity: 1;
}

.tile[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  top: 0;
  left: 2px;
  width: 60px;
  height: 60px;
  border: 1.5px dashed color-mix(in srgb, currentColor 35%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.tile[data-dnd-placeholder] .name {
  opacity: 0;
}
</style>
