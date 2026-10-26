<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

type Note = { id: string; label: string; color: string; x: number; y: number };
const props = defineProps<{ note: Note }>();
const el = useTemplateRef<HTMLElement>('el');
// The board's drag area sets the rules; the note only says it can be dragged.
const { isDragging } = makeDraggable(el, { id: () => props.note.id });
</script>

<template>
  <div
    ref="el"
    class="note"
    :class="{ dragging: isDragging }"
    :style="{ left: `${note.x}px`, top: `${note.y}px`, '--color': note.color }"
  >
    <span class="dot" />
    <span class="name">{{ note.label }}</span>
    <span class="xy">{{ note.x }},{{ note.y }}</span>
  </div>
</template>

<style scoped>
.note {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 120px;
  height: 44px;
  padding: 0 10px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    inset 3px 0 0 var(--color),
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 4px 10px -6px rgb(0 0 0 / 0.5);
  font-size: 13px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
}

.note:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* Where the note was picked up from. */
.note.dragging {
  opacity: 0.35;
}

.dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color);
}

.xy {
  margin-left: auto;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}
</style>
