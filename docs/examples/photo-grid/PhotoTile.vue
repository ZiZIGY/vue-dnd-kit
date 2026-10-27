<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

type Photo = { id: string; place: string; hue: number; size: 'big' | 'wide' | 'tall' | 'small' };
const props = defineProps<{ photo: Photo }>();

const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.photo });

// A made-up landscape: sky, sun and two hills in the photo's hue.
const scene = computed(() => {
  const h = props.photo.hue;
  return {
    '--scene': [
      `radial-gradient(circle at 72% 30%, hsl(${h + 40} 95% 80%) 0 8%, transparent 9%)`,
      `radial-gradient(120% 60% at 20% 110%, hsl(${h} 45% 28%) 0 60%, transparent 61%)`,
      `radial-gradient(90% 55% at 90% 110%, hsl(${h} 40% 38%) 0 60%, transparent 61%)`,
      `linear-gradient(180deg, hsl(${h + 20} 70% 72%), hsl(${h - 10} 60% 50%))`,
    ].join(', '),
  };
});
</script>

<template>
  <figure ref="el" class="photo" :class="photo.size" :style="scene" :aria-label="photo.place">
    <figcaption>{{ photo.place }}</figcaption>
  </figure>
</template>

<style scoped>
.photo {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin: 0;
  overflow: hidden;
  border-radius: 10px;
  background: var(--scene);
  cursor: grab;
  user-select: none;
}

.wide {
  grid-column: span 2;
}

.tall {
  grid-row: span 2;
}

.big {
  grid-column: span 2;
  grid-row: span 2;
}

.photo:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

figcaption {
  width: 100%;
  padding: 16px 8px 6px;
  background: linear-gradient(transparent, rgb(0 0 0 / 0.45));
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.small figcaption {
  display: none;
}

/* The slot the dragged photo will land in. */
.photo[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, currentColor 6%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
}

.photo[data-dnd-placeholder] > * {
  visibility: hidden;
}
</style>
