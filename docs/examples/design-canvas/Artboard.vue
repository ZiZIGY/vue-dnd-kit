<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { makeDraggable, makeDroppable, makeSelectionArea, useDnD } from '@vue-dnd-kit/core';
import DragGroup from './DragGroup.vue';
import Shape from './Shape.vue';
import type { Layer } from './design';
import { EDITOR } from './editor';
import { useLayerDrop } from './useLayerDrop';

const props = defineProps<{ frame: Layer }>();
const editor = inject(EDITOR)!;
const { active, status } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
const name = useTemplateRef<HTMLElement>('name');
const body = useTemplateRef<HTMLElement>('body');

// A frame drags by its name, as in Figma: a press on its empty space draws a band instead.
// Its layers come along, inside its clone.
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.frame.id,
  type: 'frame',
  handle: name,
  data: () => editor.dragData(props.frame),
  overlay: DragGroup,
});
const moving = computed(() => isDragging.value && !editor.altHeld.value);

// The frame takes the layers dropped on it (and the tools that add one). A drag that carries
// a frame passes over it (`disabled`, read live): frames don't nest, it goes onto the canvas
// below. No landing animation: the layers appear right where their clones were let go.
const { isOver } = makeDroppable(body, {
  id: () => props.frame.id,
  data: () => props.frame,
  accept: 'layer',
  disabled: () => !!active.value?.items.some((item) => item.type.includes('frame')),
  dropAnimation: false,
  onDrop: useLayerDrop(() => props.frame),
});
// Lit while layers from elsewhere are over it: the drop will move them in.
const arriving = computed(
  () => isOver.value && !!active.value?.ids.every((id) => editor.parentOf(id)?.id !== props.frame.id),
);

// A band drawn in the frame selects its layers; one drawn on the canvas, whole frames.
const { isSelecting, style: band } = makeSelectionArea(body, {
  strategy: () => (editor.shiftHeld.value ? 'toggle' : 'select'),
  disabled: editor.panning,
});

const shown = computed(() => (props.frame.children ?? []).filter((layer) => !layer.hidden).reverse());

const style = computed(() => {
  const { zoom } = editor.view;
  const { x, y, width, height } = props.frame;
  return { left: `${x * zoom}px`, top: `${y * zoom}px`, width: `${width * zoom}px`, height: `${height * zoom}px` };
});

// The name selects the frame as a layer is selected (see `Shape.vue`).
let wasSelected = false;
const press = (event: PointerEvent) => {
  if (event.button !== 0 || editor.panning.value) return;
  wasSelected = selected.value;
  if (!wasSelected) editor.select(props.frame.id, event.shiftKey);
};
const click = (event: MouseEvent) => {
  if (editor.panning.value) return;
  if (!event.shiftKey) editor.select(props.frame.id);
  else if (wasSelected) selected.value = false;
};
// A press on the frame's empty space starts a band, which captures the pointer: the click
// that follows never reaches the frame. A press released where it started selects it.
const pressSpace = (event: PointerEvent) => {
  if (event.button !== 0 || editor.panning.value) return;
  const start = { x: event.clientX, y: event.clientY };
  const release = (up: PointerEvent) => {
    if (Math.hypot(up.clientX - start.x, up.clientY - start.y) < 3) editor.select(props.frame.id, up.shiftKey);
  };
  window.addEventListener('pointerup', release, { once: true });
};
const focus = () => {
  if (!selected.value) editor.select(props.frame.id);
};
const hover = (on: boolean) => {
  if (on && status.value === 'idle') editor.hovered.value = props.frame.id;
  else if (!on && editor.hovered.value === props.frame.id) editor.hovered.value = null;
};
</script>

<template>
  <div ref="el" class="artboard" :class="{ moving, arriving }" :style="style">
    <div
      ref="name"
      class="artboard-name"
      :class="{ selected }"
      :aria-label="`Frame ${frame.name}${selected ? ', selected' : ''}`"
      data-layer
      @pointerdown="press"
      @click="click"
      @focus="focus"
      @pointerenter="hover(true)"
      @pointerleave="hover(false)"
    >
      {{ frame.name }}
    </div>
    <div
      ref="body"
      class="artboard-body"
      :style="{ background: frame.fill, borderRadius: `${frame.radius * editor.view.zoom}px` }"
      @pointerdown.self="pressSpace"
    >
      <Shape v-for="layer in shown" :key="layer.id" :shape="layer" />
      <div v-if="isSelecting" class="band" :style="band" />
    </div>
  </div>
</template>

<style scoped>
.artboard {
  position: absolute;
}

/* The name sits above the frame at the same size at any zoom, as in design tools. */
.artboard-name {
  position: absolute;
  bottom: 100%;
  left: 0;
  max-width: 100%;
  overflow: hidden;
  padding: 0 0 5px;
  color: var(--dc-muted);
  font-size: 11px;
  line-height: 1.3;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: default;
  user-select: none;
  transition: color 0.12s;
}

.artboard-name:hover,
.artboard-name.selected,
.arriving .artboard-name {
  color: #0d99ff;
}

.artboard-name:focus-visible {
  border-radius: 3px;
  outline: 2px solid #0d99ff;
  outline-offset: 1px;
}

/* Its layers are clipped to it. `clip`, not `hidden`: focus moving to a layer outside its
   bounds must not scroll the frame. */
.artboard-body {
  position: absolute;
  inset: 0;
  overflow: clip;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  transition: box-shadow 0.12s;
}

.arriving .artboard-body {
  box-shadow:
    0 0 0 2px #0d99ff,
    0 1px 3px rgb(0 0 0 / 0.1);
}

.moving {
  visibility: hidden;
}

.band {
  border: 1px solid #0d99ff;
  background: rgb(13 153 255 / 0.1);
}

@media (prefers-reduced-motion: reduce) {
  .artboard-name,
  .artboard-body {
    transition: none;
  }
}
</style>
