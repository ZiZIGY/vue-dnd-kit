<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ sticker: { id: string; text: string; color: string; x: number; y: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// No rules of its own: the area it is in decides.
const { isDragging } = makeDraggable(el, { id: () => props.sticker.id });
</script>

<template>
  <div
    ref="el"
    class="sticker"
    :class="{ dragging: isDragging }"
    :style="{ left: `${sticker.x}px`, top: `${sticker.y}px`, '--color': sticker.color }"
  >
    {{ sticker.text }}
  </div>
</template>

<style scoped>
.sticker {
  position: absolute;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: 96px;
  height: 48px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--color) 18%, Canvas);
  box-shadow:
    inset 0 0 0 1.5px var(--color),
    0 4px 10px -6px rgb(0 0 0 / 0.5);
  font-size: 13px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
}

.sticker:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.sticker.dragging {
  opacity: 0.3;
}

[data-dnd-overlay] .sticker {
  box-shadow:
    inset 0 0 0 1.5px var(--color),
    0 14px 26px -10px rgb(0 0 0 / 0.6);
}
</style>
