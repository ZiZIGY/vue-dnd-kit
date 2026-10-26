<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDragArea, makeDroppable, snapToGrid, useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
import Note from './Note.vue';

const GRID = 24;
const notes = ref([
  { id: 'draft', label: 'Draft', color: '#f59e0b', x: 48, y: 48 },
  { id: 'review', label: 'Review', color: '#3b82f6', x: 240, y: 120 },
  { id: 'ship', label: 'Ship', color: '#42b883', x: 96, y: 192 },
]);

const axis = ref<'x' | 'y' | undefined>();
const snap = ref(true);
const bounded = ref(true);

const board = useTemplateRef<HTMLElement>('board');
// Rules for every drag that starts on the board, read when a drag starts: an axis lock,
// the board's edges, a grid.
makeDragArea(board, {
  axis,
  restrictToArea: bounded,
  modifiers: () => (snap.value ? [snapToGrid(GRID)] : []),
});

// The board is also the drop target: a note stays where it is dropped.
makeDroppable(board, { id: 'board' });
useDnDMonitor({
  onDragEnd({ active, over, delta }) {
    const note = notes.value.find((item) => item.id === active.id);
    if (!note || over?.id !== 'board') return;
    note.x = Math.round(active.rect.left + delta.x - over.rect.left);
    note.y = Math.round(active.rect.top + delta.y - over.rect.top);
  },
});

// The line a note slides along while the axis is locked.
const { active } = useDnD();
const guide = computed(() => {
  const note = notes.value.find((item) => item.id === active.value?.id);
  if (!note || !axis.value) return null;
  return axis.value === 'x' ? { top: `${note.y + 22}px` } : { left: `${note.x + 60}px` };
});

const AXES = [
  { label: 'Free', value: undefined },
  { label: 'X', value: 'x' },
  { label: 'Y', value: 'y' },
] as const;
</script>

<template>
  <div class="constraints">
    <div class="controls">
      <div class="segmented" role="group" aria-label="Axis">
        <button
          v-for="option in AXES"
          :key="option.label"
          type="button"
          :aria-pressed="axis === option.value"
          @click="axis = option.value"
        >
          {{ option.label }}
        </button>
      </div>
      <button type="button" class="toggle" :aria-pressed="snap" @click="snap = !snap">Snap to grid</button>
      <button type="button" class="toggle" :aria-pressed="bounded" @click="bounded = !bounded">Bounds</button>
    </div>
    <div ref="board" class="board" :class="{ snap, bounded, dragging: !!active }">
      <div v-if="guide" class="guide" :class="axis" :style="guide" />
      <Note v-for="note in notes" :key="note.id" :note="note" />
    </div>
  </div>
</template>

<style scoped>
.constraints {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 576px;
  margin: 0 auto;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 12px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

.segmented button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

.toggle {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 15%, transparent);
  opacity: 0.6;
}

.toggle[aria-pressed='true'] {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1px #42b883;
  color: #42b883;
  opacity: 1;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The board's frame is a shadow, not a border: the notes' offsets start at its very edge. */
.board {
  position: relative;
  height: 288px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent);
  transition: box-shadow 0.2s;
}

.board.snap {
  background-image:
    linear-gradient(to right, color-mix(in srgb, currentColor 8%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, currentColor 8%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
}

.board.bounded.dragging {
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.guide {
  position: absolute;
  pointer-events: none;
}

.guide.x {
  left: 0;
  right: 0;
  border-top: 1.5px dashed #42b883;
}

.guide.y {
  top: 0;
  bottom: 0;
  border-left: 1.5px dashed #42b883;
}
</style>
