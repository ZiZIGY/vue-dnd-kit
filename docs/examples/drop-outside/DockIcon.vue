<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ app: { id: string; name: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.app });
</script>

<template>
  <li ref="el" class="app" :aria-label="app.name">
    <span class="tile" :style="{ '--hue': app.hue }">{{ app.name[0] }}</span>
    <span class="name">{{ app.name }}</span>
  </li>
</template>

<style scoped>
.app {
  position: relative;
  flex: none;
  border-radius: 12px;
  cursor: grab;
  user-select: none;
}

.app:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

.tile {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(160deg, hsl(var(--hue) 70% 62%), hsl(var(--hue) 60% 42%));
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.15);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

/* The name floats above the dock on hover and focus, as in a real dock. */
.name {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  translate: -50% 4px;
  padding: 3px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 85%, Canvas);
  color: Canvas;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.15s,
    translate 0.15s;
}

.app:hover .name,
.app:focus-visible .name {
  translate: -50% 0;
  opacity: 1;
}

/* No tooltip on the slot, nor on the copy that follows the pointer. */
.app[data-dnd-placeholder] .name,
[data-dnd-overlay] .name {
  display: none;
}

.app[data-dnd-placeholder] {
  opacity: 1;
}

/* The slot: an empty outline, in the page's text color rather than the tile's white. */
.app[data-dnd-placeholder] .tile {
  background: color-mix(in srgb, currentColor 8%, transparent);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 30%, transparent);
  color: inherit;
  font-size: 0;
}
</style>
