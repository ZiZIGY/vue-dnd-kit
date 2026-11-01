<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { makeDraggable, useDnD } from '@vue-dnd-kit/core';
import DragGroup from './DragGroup.vue';
import ImageArt from './ImageArt.vue';
import type { Layer } from './design';
import { EDITOR } from './editor';

const props = defineProps<{ shape: Layer }>();
const editor = inject(EDITOR)!;
const { status } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
// A plain draggable. Its overlay lays every dragged layer out as on the canvas (`DragGroup`),
// from the `data` of each: where it is drawn.
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.shape.id,
  type: 'layer',
  data: () => editor.dragData(props.shape),
  overlay: DragGroup,
});

// Its clone moves in the overlay, so the layer itself steps aside, until its clone has
// landed (`isDragging` lasts until then). With Alt held, a copy is being dragged: it stays.
const moving = computed(() => isDragging.value && !editor.altHeld.value);

// Drawn at the zoom: every length is in screen pixels, so what the library measures is what
// is on screen, and the clones in the overlay come out the right size.
const style = computed(() => {
  const { zoom } = editor.view;
  const { kind, x, y, width, height, fill, radius, fontSize = 12, fontWeight, align } = props.shape;
  return {
    left: `${x * zoom}px`,
    top: `${y * zoom}px`,
    width: `${width * zoom}px`,
    height: `${height * zoom}px`,
    borderRadius: kind === 'ellipse' ? '50%' : `${radius * zoom}px`,
    ...(kind === 'text'
      ? { color: fill, fontSize: `${fontSize * zoom}px`, fontWeight, textAlign: align }
      : { background: fill }),
  };
});

// As in Figma: a press selects the layer at once, so a drag right away moves it, and a
// press on one of several selected layers drags them all. The click (no drag) then keeps
// only it; Shift adds a layer or, on a selected one, takes it out.
let wasSelected = false;
const press = (event: PointerEvent) => {
  if (event.button !== 0 || editor.panning.value) return;
  wasSelected = selected.value;
  if (!wasSelected) editor.select(props.shape.id, event.shiftKey);
};
const click = (event: MouseEvent) => {
  if (editor.panning.value) return;
  if (!event.shiftKey) editor.select(props.shape.id);
  else if (wasSelected) selected.value = false;
};
// Tabbing onto a layer selects it, so the keyboard can nudge it, align it or delete it.
const focus = () => {
  if (!selected.value) editor.select(props.shape.id);
};

const hover = (on: boolean) => {
  if (on && status.value === 'idle') editor.hovered.value = props.shape.id;
  else if (!on && editor.hovered.value === props.shape.id) editor.hovered.value = null;
};
</script>

<template>
  <div
    ref="el"
    class="shape"
    :class="[shape.kind, { moving }]"
    :style="style"
    :aria-label="`${shape.name}${selected ? ', selected' : ''}`"
    data-layer
    @pointerdown="press"
    @click="click"
    @focus="focus"
    @pointerenter="hover(true)"
    @pointerleave="hover(false)"
  >
    <span v-if="shape.kind === 'text'" class="words">{{ shape.content }}</span>
    <ImageArt v-else-if="shape.image" :art="shape.image" />
  </div>
</template>

<style scoped>
.shape {
  position: absolute;
  box-sizing: border-box;
  cursor: default;
  user-select: none;
}

.shape:focus-visible {
  outline: 2px solid #0d99ff;
  outline-offset: 3px;
}

.text {
  display: flex;
  align-items: center;
  line-height: 1.35;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.words {
  width: 100%;
}

.image {
  overflow: hidden;
}

.moving {
  visibility: hidden;
}
</style>
