<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ app: { id: string; name: string; color: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.app });
</script>

<template>
  <div ref="el" class="tile">
    <span class="icon" :style="{ background: app.color }">{{ app.name[0] }}</span>
    <span class="name">{{ app.name }}</span>
  </div>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  user-select: none;
}

.icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  color: #fff;
  font: 700 26px/1 system-ui, sans-serif;
  box-shadow: inset 0 -2px 0 rgb(0 0 0 / 0.15);
}

.name {
  font-size: 12px;
  opacity: 0.75;
}

.tile:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
  border-radius: 12px;
}
</style>
