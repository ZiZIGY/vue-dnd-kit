<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, restrictToFirstScrollableAncestor } from '@vue-dnd-kit/core';
import type { CalendarEvent } from './calendar';
import type { DragData } from './placement';

const props = defineProps<{ event: CalendarEvent; edge: 'start' | 'end' }>();
const el = useTemplateRef<HTMLElement>('el');

// An edge is a draggable of its own inside the event's: a press drags the closest one. It has
// no overlay (the event grows instead, see EventBlock), moves up and down only, and stays in
// the hours in view, which auto-scroll when it nears their ends.
makeDraggable(el, {
  id: () => `${props.event.id}-${props.edge}`,
  type: 'edge',
  data: (): DragData => ({ kind: 'edge', event: props.event, edge: props.edge }),
  overlay: false,
  axis: 'y',
  modifiers: [restrictToFirstScrollableAncestor],
  // Not a tab stop of its own: on a focused event, Shift + arrows change its end.
  attributes: false,
});
</script>

<template>
  <div ref="el" class="edge" :class="`edge-${edge}`" aria-hidden="true" />
</template>

<style scoped>
/* EDGE_PX tall, centred on the event's edge. */
.edge {
  position: absolute;
  right: 4px;
  left: 2px;
  z-index: 1;
  height: 8px;
  cursor: ns-resize;
}

.edge-start {
  top: -4px;
}

.edge-end {
  bottom: -4px;
}
</style>
