<script setup lang="ts">
import { computed, inject } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import { EDITOR, SNAP } from './editor';
import { guidesFor, NO_GUIDES, snapValues, union, type Box } from './geometry';

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
type Handle = (typeof HANDLES)[number];

const editor = inject(EDITOR)!;
const { view, selected } = editor;
const { selection, status } = useDnD();

const toScreen = (box: Box) => ({
  left: `${view.x + box.x * view.zoom}px`,
  top: `${view.y + box.y * view.zoom}px`,
  width: `${box.width * view.zoom}px`,
  height: `${box.height * view.zoom}px`,
});

const boxes = computed(() => selected.value.map(editor.boxOf));
const bounds = computed(() => union(boxes.value));
const single = computed(() => (selected.value.length === 1 ? selected.value[0]! : null));
// While a drag runs, the clones in the overlay show where the layers are.
const shown = computed(() => bounds.value && status.value !== 'dragging' && status.value !== 'dropping');
// Hovered on the canvas or in the layers panel: an outline, unless it is selected anyway.
const hoverBox = computed(() => {
  const layer = editor.hovered.value ? editor.find(editor.hovered.value) : null;
  return layer && !selection.has(layer.id) && status.value === 'idle' ? editor.boxOf(layer) : null;
});

// ─── Resizing ──────────────────────────────────────────────────────────────────
// Handles are plain pointer events: a resize changes a layer's box, it moves nothing anywhere.

let gestures = 0;

const resize = (handle: Handle, event: PointerEvent) => {
  const layer = single.value;
  if (!layer || event.button !== 0) return;
  event.preventDefault();
  const grip = event.currentTarget as HTMLElement;
  grip.setPointerCapture(event.pointerId);
  const start = editor.boxOf(layer);
  const frame = editor.parentOf(layer.id);
  const targets = editor.snapTargets([layer.id]);
  const origin = { x: event.clientX, y: event.clientY };
  // One undo step for the whole gesture.
  const key = `resize-${++gestures}`;

  const move = ({ clientX, clientY, shiftKey }: PointerEvent) => {
    const dx = (clientX - origin.x) / view.zoom;
    const dy = (clientY - origin.y) / view.zoom;
    // The edges the handle holds follow the pointer and snap to the other layers' lines.
    const snap = (value: number, axis: 'x' | 'y') =>
      shiftKey ? value : value + snapValues([value], targets, axis, SNAP / view.zoom);
    let left = start.x;
    let top = start.y;
    let right = start.x + start.width;
    let bottom = start.y + start.height;
    if (handle.includes('w')) left = Math.min(snap(left + dx, 'x'), right - 1);
    if (handle.includes('e')) right = Math.max(snap(right + dx, 'x'), left + 1);
    if (handle.includes('n')) top = Math.min(snap(top + dy, 'y'), bottom - 1);
    if (handle.includes('s')) bottom = Math.max(snap(bottom + dy, 'y'), top + 1);
    // A corner with Shift keeps the proportions, from the opposite corner.
    if (shiftKey && handle.length === 2) {
      const ratio = start.width / start.height;
      let width = right - left;
      let height = bottom - top;
      if (width / start.width > height / start.height) height = width / ratio;
      else width = height * ratio;
      if (handle.includes('w')) left = right - width;
      else right = left + width;
      if (handle.includes('n')) top = bottom - height;
      else bottom = top + height;
    }
    const box = { x: Math.round(left), y: Math.round(top), width: Math.round(right) - Math.round(left), height: Math.round(bottom) - Math.round(top) };
    editor.update(layer, { ...box, x: box.x - (frame?.x ?? 0), y: box.y - (frame?.y ?? 0) }, key);
    editor.guides.value = guidesFor(box, targets);
  };
  const end = () => {
    editor.guides.value = NO_GUIDES;
    grip.removeEventListener('pointermove', move);
    grip.removeEventListener('pointerup', end);
    grip.removeEventListener('pointercancel', end);
  };
  grip.addEventListener('pointermove', move);
  grip.addEventListener('pointerup', end);
  grip.addEventListener('pointercancel', end);
};
</script>

<template>
  <div class="selection" aria-hidden="true">
    <div v-if="hoverBox" class="hover" :style="toScreen(hoverBox)" />
    <template v-if="shown">
      <template v-if="boxes.length > 1">
        <div v-for="(box, index) in boxes" :key="index" class="member" :style="toScreen(box)" />
      </template>
      <div class="bounds" :style="toScreen(bounds!)">
        <template v-if="single">
          <span v-for="handle in HANDLES" :key="handle" class="grip" :class="handle" @pointerdown="resize(handle, $event)" />
        </template>
        <span class="dimensions">{{ Math.round(bounds!.width) }} × {{ Math.round(bounds!.height) }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.selection {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hover,
.member,
.bounds {
  position: absolute;
  box-sizing: border-box;
}

.hover {
  box-shadow: 0 0 0 1.5px #0d99ff;
}

.member {
  box-shadow: 0 0 0 1px rgb(13 153 255 / 0.6);
}

.bounds {
  box-shadow: 0 0 0 1px #0d99ff;
}

/* Corners are white squares on the corners; the edges are grips just outside the sides,
   felt rather than seen. The inside of the box is left to dragging, however small it is. */
.grip {
  position: absolute;
  pointer-events: auto;
  touch-action: none;
}

.nw,
.ne,
.se,
.sw {
  z-index: 1;
  width: 8px;
  height: 8px;
  margin: -4px;
  border: 1px solid #0d99ff;
  border-radius: 2px;
  box-sizing: border-box;
  background: #fff;
}

.nw {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

.ne {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

.se {
  right: 0;
  bottom: 0;
  cursor: nwse-resize;
}

.sw {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

.n,
.s {
  right: 0;
  left: 0;
  height: 8px;
  cursor: ns-resize;
}

.n {
  top: -8px;
}

.s {
  bottom: -8px;
}

.e,
.w {
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
}

.e {
  right: -8px;
}

.w {
  left: -8px;
}

/* Fingers: larger squares, mostly outside the box. */
@media (pointer: coarse) {
  .nw,
  .ne,
  .se,
  .sw {
    width: 16px;
    height: 16px;
    margin: -12px;
  }
}

.dimensions {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  padding: 2px 5px;
  border-radius: 4px;
  background: #0d99ff;
  color: #fff;
  font: 500 10px/1.3 ui-monospace, Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transform: translateX(-50%);
}
</style>
