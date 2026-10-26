<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ card: { id: string; title: string; tag: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.card });
</script>

<template>
  <li ref="el" class="card">
    <span class="tag" :style="{ background: card.tag }" />
    {{ card.title }}
  </li>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 1px 0 color-mix(in srgb, currentColor 12%, transparent), 0 0 0 1px color-mix(in srgb, currentColor 8%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.tag {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
