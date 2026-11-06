<script setup lang="ts">
import { computed, shallowRef, useTemplateRef, watch } from 'vue';
import { makeDraggable, makeSortableItem, useDnD, useDnDMonitor, type Coordinates } from '@vue-dnd-kit/core';
import WidgetBody from './WidgetBody.vue';
import { GAP, MAX_ROWS, ROW, clamp, type Size, type Widget } from './widgets';

const props = defineProps<{ widget: Widget; columns: number; cell: number }>();
const emit = defineEmits<{ resize: [size: Size] }>();

const el = useTemplateRef<HTMLElement>('el');
const head = useTemplateRef<HTMLElement>('head');
const corner = useTemplateRef<HTMLElement>('corner');

// The widget is a sortable item, moved by its header: the rest of it stays free for its
// content (the notes take text, the tasks get ticked).
makeSortableItem(el, { item: () => props.widget, handle: head, label: () => props.widget.title });

// The corner is a draggable of its own inside the widget: a press drags the closest one. It
// has no overlay and never moves: the widget grows instead, a cell at a time.
const cornerId = () => `${props.widget.id}-corner`;
const { isDragging: resizing } = makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  // A finger resizes at once instead of after a long press (with `touch-action: none` below).
  activation: { touch: { distance: 4 } },
  // Not a tab stop of its own: on the focused header, Shift + arrows resize.
  attributes: false,
});

const { active, pointer } = useDnD();

// Where the pointer was when the corner was picked up.
const from = shallowRef<Coordinates | null>(null);
watch(resizing, (on) => (from.value = on && pointer.value ? { ...pointer.value } : null));

/** How many cells `size` px covers, gaps included. */
const cellsIn = (size: number, cell: number) => Math.round((size + GAP) / (cell + GAP));
/** The widget's size in px for a size in cells. */
const pixels = (cells: number, cell: number) => cells * cell + (cells - 1) * GAP;

const own = computed<Size>(() => ({ w: Math.min(props.widget.w, props.columns), h: props.widget.h }));

/** The size the corner asks for: as many cells as the pointer went past the widget's size. */
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});

/** What the grid shows: the corner's size while it is dragged, else the widget's own. */
const size = computed(() => preview.value ?? own.value);

// The corner's drop keeps its size. Escape cancels the drag: the widget goes back to its own.
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});

const STEPS: Record<string, [number, number]> = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
};

/** Shift + arrows on the header resize the widget; without Shift, Space picks it up. */
const onKey = (press: KeyboardEvent) => {
  const step = STEPS[press.key];
  if (!press.shiftKey || !step || active.value) return;
  press.preventDefault();
  emit('resize', {
    w: clamp(size.value.w + step[0], 1, props.columns),
    h: clamp(size.value.h + step[1], 1, MAX_ROWS),
  });
};
</script>

<template>
  <article
    ref="el"
    class="widget"
    :class="[widget.kind, { resizing }]"
    :style="{ gridColumn: `span ${size.w}`, gridRow: `span ${size.h}` }"
  >
    <header ref="head" class="head" @keydown="onKey">
      <svg class="grip" viewBox="0 0 10 16" aria-hidden="true">
        <circle cx="3" cy="3" r="1.3" /><circle cx="7" cy="3" r="1.3" />
        <circle cx="3" cy="8" r="1.3" /><circle cx="7" cy="8" r="1.3" />
        <circle cx="3" cy="13" r="1.3" /><circle cx="7" cy="13" r="1.3" />
      </svg>
      <h3 class="title">{{ widget.title }}</h3>
      <span class="size">{{ size.w }} × {{ size.h }}</span>
    </header>
    <WidgetBody :widget="widget" />
    <div ref="corner" class="corner" aria-hidden="true" />
  </article>
</template>

<style scoped>
.widget {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  /* Its own background: the overlay, a copy of the widget, isn't see-through. */
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 6px;
  border-radius: 12px 12px 0 0;
  cursor: grab;
  user-select: none;
}

.head:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.grip {
  width: 8px;
  height: 13px;
  flex: none;
  fill: currentColor;
  opacity: 0.35;
}

.title {
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.size {
  margin-left: auto;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0;
  transition: opacity 0.15s;
}

.widget:hover .size,
.head:focus-visible .size,
.resizing .size {
  opacity: 0.55;
}

/* The corner: two short diagonal strokes, bigger to the finger than they look. */
.corner {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  border-radius: 0 0 12px 0;
  background:
    linear-gradient(135deg, transparent 55%, color-mix(in srgb, currentColor 35%, transparent) 55% 62%, transparent 62%),
    linear-gradient(135deg, transparent 72%, color-mix(in srgb, currentColor 35%, transparent) 72% 79%, transparent 79%);
  cursor: nwse-resize;
  touch-action: none;
  opacity: 0.6;
}

.widget:hover .corner,
.resizing .corner {
  opacity: 1;
}

.resizing {
  border-color: #42b883;
  box-shadow: 0 0 0 1px #42b883;
}

/* The slot the dragged widget will land in. */
.widget[data-dnd-placeholder] {
  opacity: 1;
  border-style: dashed;
  border-color: color-mix(in srgb, currentColor 30%, transparent);
  background: color-mix(in srgb, currentColor 5%, Canvas);
}

.widget[data-dnd-placeholder] > * {
  visibility: hidden;
}

[data-dnd-overlay] .widget {
  box-shadow: 0 18px 36px -18px rgb(0 0 0 / 0.5);
}
</style>
