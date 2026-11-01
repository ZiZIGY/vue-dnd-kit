<script setup lang="ts">
import { computed, inject, ref, useTemplateRef } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { makeDragArea, makeDroppable, makeSelectionArea, useDnD, useDnDMonitor, type Modifier } from '@vue-dnd-kit/core';
import Artboard from './Artboard.vue';
import GuideLines from './GuideLines.vue';
import SelectionBox from './SelectionBox.vue';
import Shape from './Shape.vue';
import ToolButton from './ToolButton.vue';
import { EDITOR, MOD, SNAP } from './editor';
import { guidesFor, NO_GUIDES, offsetBox, snapBox, type Point } from './geometry';
import { useLayerDrop } from './useLayerDrop';

const editor = inject(EDITOR)!;
const { view, panning } = editor;
const { selection, status } = useDnD();
const viewport = useTemplateRef<HTMLElement>('viewport');

// ─── Drags ─────────────────────────────────────────────────────────────────────

// Smart guides: a modifier of our own. It gets the drag's offset in screen pixels, works out
// where the dragged layers would be in the world, and pulls them onto the closest line of
// another layer within reach. The overlay, the drop target and the drop all follow it.
const smartGuides: Modifier = ({ transform, active }) => {
  const moving = editor.boundsOf(active.ids);
  if (!moving) return transform;
  const { zoom } = view;
  const box = offsetBox(moving, transform.x / zoom, transform.y / zoom);
  const targets = editor.snapTargets(active.ids);
  return {
    x: transform.x + snapBox(box, targets, 'x', SNAP / zoom) * zoom,
    y: transform.y + snapBox(box, targets, 'y', SNAP / zoom) * zoom,
  };
};

// The rules for every drag that starts on the canvas, frames and layers alike: the guides.
// While the hand tool pans, nothing drags.
makeDragArea(viewport, { modifiers: [smartGuides], disabled: panning });

// The guides drawn: the lines the dragged layers sit on, after the modifiers (`delta`).
useDnDMonitor({
  onDragMove({ active, delta }) {
    const moving = editor.boundsOf(active.ids);
    if (!moving) return;
    const box = offsetBox(moving, delta.x / view.zoom, delta.y / view.zoom);
    editor.guides.value = guidesFor(box, editor.snapTargets(active.ids));
  },
  onDragEnd: () => (editor.guides.value = NO_GUIDES),
  onDragCancel: () => (editor.guides.value = NO_GUIDES),
});

// The canvas takes the layers and tools dropped outside the frames.
makeDroppable(viewport, {
  id: 'canvas',
  data: { name: 'Canvas' },
  accept: ['layer', 'frame'],
  dropAnimation: false,
  onDrop: useLayerDrop(() => null),
});

// A band drawn on the empty canvas selects whole frames and loose layers (the frames' own
// bands select inside them). Shift adds to the selection.
const { isSelecting, style: band } = makeSelectionArea(viewport, {
  strategy: () => (editor.shiftHeld.value ? 'toggle' : 'select'),
  disabled: panning,
});

// ─── View ──────────────────────────────────────────────────────────────────────

useResizeObserver(viewport, ([entry]) => editor.setViewport(entry!.contentRect.width, entry!.contentRect.height));

const pointIn = (event: MouseEvent): Point => {
  const rect = viewport.value!.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
};

// The wheel pans; with Ctrl or Cmd (a trackpad pinch too) it zooms around the pointer.
// Not while a drag runs: the layers it moves were measured at the zoom it started with.
const wheel = (event: WheelEvent) => {
  if (status.value === 'dragging') return;
  const lines = event.deltaMode === 1 ? 16 : 1;
  if (event.ctrlKey || event.metaKey) {
    const step = Math.max(-50, Math.min(50, event.deltaY * lines));
    editor.zoomBy(Math.exp(-step * 0.008), pointIn(event));
  } else if (event.shiftKey && !event.deltaX) {
    editor.panBy(-event.deltaY * lines, 0);
  } else {
    editor.panBy(-event.deltaX * lines, -event.deltaY * lines);
  }
};

// Panning: with the hand tool, Space held, or the middle button.
const grabbing = ref(false);
const pan = (event: PointerEvent) => {
  event.preventDefault();
  const element = viewport.value!;
  element.setPointerCapture(event.pointerId);
  grabbing.value = true;
  let last = { x: event.clientX, y: event.clientY };
  const move = (next: PointerEvent) => {
    editor.panBy(next.clientX - last.x, next.clientY - last.y);
    last = { x: next.clientX, y: next.clientY };
  };
  const end = () => {
    grabbing.value = false;
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', end);
    element.removeEventListener('pointercancel', end);
  };
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', end);
  element.addEventListener('pointercancel', end);
};

// Before anything else sees the press (capture): a pan, or a press on empty space, the
// canvas or a frame's, which starts afresh unless Shift adds to the selection.
const press = (event: PointerEvent) => {
  if (panning.value || event.button === 1) return pan(event);
  if (event.button !== 0 || (event.target as Element).closest('[data-layer]')) return;
  if (!event.shiftKey) selection.clear();
};

// Focus moving to a layer out of view scrolls the canvas to it: that becomes a pan, so the
// world stays where the view says it is.
const scrolled = () => {
  const element = viewport.value!;
  editor.panBy(-element.scrollLeft, -element.scrollTop);
  element.scrollLeft = 0;
  element.scrollTop = 0;
};

// The world: frames and loose layers, the front one last in the DOM so it paints on top.
const shown = computed(() => editor.layers.value.filter((layer) => !layer.hidden).reverse());
const percent = computed(() => `${Math.round(view.zoom * 100)}%`);
// Dots every 24 units of the world, every 48 when zoomed far out.
const dots = computed(() => {
  const step = (view.zoom < 0.5 ? 48 : 24) * view.zoom;
  return { backgroundSize: `${step}px ${step}px`, backgroundPosition: `${view.x}px ${view.y}px` };
});
</script>

<template>
  <div class="canvas">
    <div
      ref="viewport"
      class="viewport"
      :class="{ panning, grabbing }"
      :style="dots"
      tabindex="0"
      aria-label="Canvas"
      @pointerdown.capture="press"
      @wheel.prevent="wheel"
      @scroll="scrolled"
    >
      <div class="world" :style="{ transform: `translate(${view.x}px, ${view.y}px)` }">
        <template v-for="layer in shown" :key="layer.id">
          <Artboard v-if="layer.kind === 'frame'" :frame="layer" />
          <Shape v-else :shape="layer" />
        </template>
      </div>
      <div v-if="isSelecting" class="band" :style="band" />
    </div>

    <SelectionBox />
    <GuideLines />

    <div class="zoom" role="group" aria-label="Zoom">
      <ToolButton icon="minus" label="Zoom out" :shortcut="`${MOD} −`" tip="above" @click="editor.zoomBy(1 / 1.25)" />
      <button type="button" class="percent" aria-label="Zoom to 100%" @click="editor.zoomBy(1 / view.zoom)">
        {{ percent }}
      </button>
      <ToolButton icon="plus" label="Zoom in" :shortcut="`${MOD} +`" tip="above" @click="editor.zoomBy(1.25)" />
      <ToolButton icon="fit" label="Zoom to fit" shortcut="Shift 1" tip="above" @click="editor.fit()" />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: clip;
}

/* Dots on the canvas, moving and scaling with it, as a design tool draws them. */
.viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: var(--dc-canvas);
  background-image: radial-gradient(circle, var(--dc-dots) 1px, transparent 1.2px);
  outline: none;
  touch-action: none;
}

.viewport:focus-visible {
  box-shadow: inset 0 0 0 2px #0d99ff;
}

.panning {
  cursor: grab;
}

.grabbing {
  cursor: grabbing;
}

/* Over the hand tool, layers don't take the pointer: a press anywhere pans. */
.panning .world {
  pointer-events: none;
}

.world {
  position: absolute;
  top: 0;
  left: 0;
}

.band {
  border: 1px solid #0d99ff;
  background: rgb(13 153 255 / 0.1);
}

.zoom {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--dc-line);
  border-radius: 10px;
  background: var(--dc-panel);
  box-shadow: 0 6px 20px -8px rgb(0 0 0 / 0.35);
}

.percent {
  min-width: 46px;
  height: 30px;
  padding: 0 4px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font: 500 11px/1 ui-monospace, Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}

.percent:hover {
  background: var(--dc-hover);
}

.percent:focus-visible {
  outline: 2px solid #0d99ff;
}
</style>
