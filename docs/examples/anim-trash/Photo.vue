<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ photo: { id: string; file: string; emoji: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.photo });
</script>

<template>
  <li ref="el" class="photo">
    <span class="picture" :style="{ '--hue': photo.hue }">{{ photo.emoji }}</span>
    <span class="file">{{ photo.file }}</span>
  </li>
</template>

<style scoped>
.photo {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  cursor: grab;
  user-select: none;
}

.photo:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the photo will land in. */
.photo[data-dnd-placeholder] {
  opacity: 0.35;
}

.picture {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: 6px;
  /* On a solid color: the overlay, a copy of the photo, isn't see-through. */
  background: linear-gradient(160deg, hsl(var(--hue) 75% 62% / 0.55), hsl(calc(var(--hue) + 40) 70% 35% / 0.45)), Canvas;
  font-size: 26px;
}

.file {
  overflow: hidden;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
}
</style>
