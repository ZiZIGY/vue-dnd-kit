<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

type Layer = { id: string; name: string; kind: 'text' | 'shape' | 'image'; visible: boolean; locked: boolean };
const props = defineProps<{ layer: Layer }>();

const el = useTemplateRef<HTMLElement>('el');
// Dragged by its grip only: the eye and the lock stay plain buttons. A locked layer
// can't be dragged (`disabled`), but the others still move past it.
makeSortableItem(el, {
  item: () => props.layer,
  handle: '.grip',
  disabled: () => props.layer.locked,
});

const ICONS = {
  text: 'M5 6h14M12 6v13',
  shape: 'M4 4h16v16H4z',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4',
};
</script>

<template>
  <li ref="el" class="layer" :class="{ 'is-hidden': !layer.visible, locked: layer.locked }">
    <button type="button" class="grip" :aria-label="`Move ${layer.name}`">
      <svg viewBox="0 0 10 16" aria-hidden="true">
        <circle v-for="dot in 6" :key="dot" :cx="dot % 2 ? 2 : 8" :cy="Math.ceil(dot / 2) * 5 - 2" r="1.5" />
      </svg>
    </button>
    <svg class="kind" viewBox="0 0 24 24" aria-hidden="true"><path :d="ICONS[layer.kind]" /></svg>
    <span class="name">{{ layer.name }}</span>
    <button type="button" class="toggle" :aria-pressed="!layer.visible" :aria-label="`Hide ${layer.name}`" @click="layer.visible = !layer.visible">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
        <path v-if="!layer.visible" d="M4 20L20 4" />
      </svg>
    </button>
    <button type="button" class="toggle" :aria-pressed="layer.locked" :aria-label="`Lock ${layer.name}`" @click="layer.locked = !layer.locked">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path :d="layer.locked ? 'M8 11V8a4 4 0 0 1 8 0v3' : 'M8 11V8a4 4 0 0 1 7.5-2'" />
      </svg>
    </button>
  </li>
</template>

<style scoped>
.layer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 6px 0 4px;
  border-radius: 8px;
  /* The panel's colour: the overlay, a copy of the row, isn't see-through. */
  background: color-mix(in srgb, currentColor 4%, Canvas);
  font-size: 13px;
  user-select: none;
}

.layer:hover {
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

/* The slot the dragged layer will land in. */
.layer[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 10%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 60%, transparent);
}

.layer[data-dnd-placeholder] > * {
  visibility: hidden;
}

.layer.is-hidden .kind,
.layer.is-hidden .name {
  opacity: 0.4;
}

button {
  display: grid;
  flex: none;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  cursor: pointer;
}

button:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

button:focus-visible {
  outline: 2px solid #42b883;
}

.grip {
  width: 20px;
  opacity: 0.4;
  cursor: grab;
}

.grip svg {
  width: 8px;
  height: 14px;
  fill: currentColor;
}

/* Locked: the grip has nothing to drag. */
.locked .grip {
  opacity: 0.12;
  cursor: default;
}

.kind,
.toggle svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.kind {
  flex: none;
  stroke: #42b883;
}

.name {
  flex: 1;
  min-width: 0;
}

.toggle {
  opacity: 0.35;
}

.toggle[aria-pressed='true'],
.layer:hover .toggle {
  opacity: 0.85;
}
</style>
