<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable, useSensor, type Coordinates } from '@vue-dnd-kit/core';
import BoardPiece from './BoardPiece.vue';
import { createMinimapSensor } from './minimap';

const SCALE = 0.4;
const pieces = ref([
  { id: 'circle', x: 36, y: 40, color: '#42b883' },
  { id: 'square', x: 150, y: 96, color: '#3b82f6' },
  { id: 'pill', x: 220, y: 30, color: '#f59e0b' },
]);

// The board takes drops: a piece stays where it was let go, whichever sensor dragged it.
const board = useTemplateRef<HTMLElement>('board');
makeDroppable(board, {
  id: 'board',
  onDrop: ({ active, position }) => {
    const piece = pieces.value.find((item) => item.id === active.id);
    if (piece && position) Object.assign(piece, { x: Math.round(position.x), y: Math.round(position.y) });
  },
});

// Runs next to the provider's own sensors for as long as this component lives.
const minimap = createMinimapSensor(() => board.value, SCALE);
useSensor(minimap.sensor);

const mini = useTemplateRef<HTMLElement>('mini');
const local = (event: PointerEvent): Coordinates => {
  const box = mini.value!.getBoundingClientRect();
  return { x: event.clientX - box.left, y: event.clientY - box.top };
};
const onDown = (event: PointerEvent) => {
  const id = (event.target as HTMLElement).dataset.piece;
  if (!id || !minimap.press(id, local(event))) return;
  mini.value!.setPointerCapture(event.pointerId);
};
</script>

<template>
  <div class="desk">
    <div class="row">
      <div ref="board" class="board">
        <BoardPiece v-for="piece in pieces" :key="piece.id" :piece="piece" />
      </div>
      <figure>
        <div
          ref="mini"
          class="minimap"
          aria-hidden="true"
          @pointerdown="onDown"
          @pointermove="minimap.move(local($event))"
          @pointerup="minimap.release()"
          @pointercancel="minimap.cancel()"
        >
          <span
            v-for="piece in pieces"
            :key="piece.id"
            class="dot"
            :class="piece.id"
            :data-piece="piece.id"
            :style="{ left: `${piece.x * SCALE}px`, top: `${piece.y * SCALE}px`, background: piece.color }"
          />
          <span
            v-if="minimap.cursor.value"
            class="cursor"
            :style="{ left: `${minimap.cursor.value.x}px`, top: `${minimap.cursor.value.y}px` }"
          />
        </div>
        <figcaption>minimap · drag a dot</figcaption>
      </figure>
    </div>
    <ol class="log" aria-label="Sensor log">
      <li v-for="(line, index) in minimap.log.value" :key="`${index}${line}`">{{ line }}</li>
    </ol>
  </div>
</template>

<style scoped>
.desk {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 434px;
  max-width: 100%;
  margin: 0 auto;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 14px;
}

.board {
  position: relative;
  width: 300px;
  height: 190px;
  border-radius: 12px;
  background:
    radial-gradient(color-mix(in srgb, currentColor 14%, transparent) 1px, transparent 1px) 0 0 / 16px 16px,
    color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

figure {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
}

.minimap {
  position: relative;
  width: 120px;
  height: 76px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 50%, transparent);
  touch-action: none;
  user-select: none;
}

.dot {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  cursor: grab;
}

/* The pieces' shapes, at the minimap's scale. */
.dot.circle {
  border-radius: 50%;
}

.dot.pill {
  width: 26px;
  border-radius: 9px;
}

.cursor {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #42b883;
  border-radius: 50%;
  translate: -50% -50%;
  pointer-events: none;
}

figcaption {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.log {
  height: 88px;
  margin: 0;
  padding: 8px 10px;
  overflow: hidden;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, Canvas);
  font: 11px/1.45 ui-monospace, Menlo, Consolas, monospace;
  list-style: none;
}

.log li {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
}

.log li:first-child {
  color: #42b883;
  opacity: 1;
}
</style>
