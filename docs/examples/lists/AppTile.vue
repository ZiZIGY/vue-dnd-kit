<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { icons } from './icons';

const props = defineProps<{ app: { id: string; name: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.app });

const icon = computed(() => icons[props.app.id]!);
</script>

<template>
  <div ref="el" class="tile">
    <span class="icon" :style="{ background: `linear-gradient(160deg, ${icon.colors[0]}, ${icon.colors[1]})` }">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path v-for="path in icon.paths" :key="path" :d="path" />
      </svg>
    </span>
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

.icon {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.35),
    inset 0 -2px 0 rgb(0 0 0 / 0.12),
    0 8px 18px -10px rgb(0 0 0 / 0.6);
}

svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
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
