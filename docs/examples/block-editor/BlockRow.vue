<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';
import BlockContent from './BlockContent.vue';
import { describe, type Block } from './blocks';
import { EDITOR } from './editor';

const props = defineProps<{ node: FlatNode<Block>; indent: number; number: number }>();
/** A click on the handle: the page decides what it selects. */
const emit = defineEmits<{ pick: [event: MouseEvent] }>();
const editor = inject(EDITOR)!;

const el = useTemplateRef<HTMLElement>('el');
// Only the handle drags, so the text stays editable and selectable. The handle takes the
// keyboard too: Space picks the block up, the arrows move the line (left and right: a level
// out or in), Space drops it.
const { indicator, selected } = makeSortableItem(el, {
  id: () => props.node.key,
  handle: '.handle',
  // A mouse press on a handle drags at once; after 4px instead, a click opens the block's
  // menu without picking the block up first. So does Enter.
  activation: { mouse: { distance: 4 } },
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});

// The line starts where the text starts at the level the drop lands at.
const line = computed(() => {
  const at = indicator.value;
  if (!at || at.side === 'inside') return null;
  return { side: at.side, left: `${((at.depth ?? 0) - props.node.depth) * props.indent}px` };
});
</script>

<template>
  <div
    ref="el"
    class="row"
    :class="[`is-${node.item.kind}`, { selected }]"
    :data-row="node.key"
    :style="{ marginLeft: `${node.depth * indent}px` }"
  >
    <!-- Left of the block, shown on hover. Not part of the copy that follows the pointer. -->
    <div class="gutter" data-dnd-no-clone>
      <button
        type="button"
        class="add"
        tabindex="-1"
        aria-label="Add a block below"
        title="Add a block below"
        @click="editor.menu.value = { type: 'insert', id: node.item.id }"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
      </button>
      <button
        type="button"
        class="handle"
        :data-handle="node.key"
        :aria-label="`Drag ${describe(node.item)}`"
        aria-haspopup="menu"
        title="Drag to move · Click for options"
        @click="emit('pick', $event)"
      >
        <svg viewBox="0 0 10 16" aria-hidden="true">
          <circle v-for="dot in 6" :key="dot" :cx="dot % 2 ? 2 : 8" :cy="Math.ceil(dot / 2) * 5 - 2" r="1.5" />
        </svg>
      </button>
    </div>

    <BlockContent :block="node.item" :open="!node.collapsed" :number="number" :depth="node.depth" />
    <span v-if="line" class="line" :class="line.side" :style="{ left: line.left }" />
  </div>
</template>

<style scoped>
.row {
  --accent: #42b883;
  /* Where the first line of text sits: the gutter lines up with it. */
  --first-line: 26px;
  --top: 3px;
  position: relative;
  padding: var(--top) 2px 3px;
  border-radius: 6px;
  /* The page's background: the copy that follows the pointer is a clone of the row. */
  background: Canvas;
  transition: background-color 0.15s;
}

.is-h1 {
  --first-line: 36px;
  --top: 22px;
}

.is-h2 {
  --first-line: 30px;
  --top: 16px;
}

.is-h3 {
  --first-line: 26px;
  --top: 10px;
}

.is-callout,
.is-code {
  --first-line: 50px;
  --top: 5px;
}

.is-image {
  --first-line: 40px;
}

.row.selected {
  background: color-mix(in srgb, var(--accent) 16%, Canvas);
}

.gutter {
  position: absolute;
  top: calc(var(--top) + (var(--first-line) - 24px) / 2);
  right: 100%;
  display: flex;
  gap: 1px;
  padding-right: 4px;
  opacity: 0;
  transition: opacity 0.12s;
}

.row:hover .gutter,
.row:focus-within .gutter,
.row.selected .gutter {
  opacity: 1;
}

/* While something is dragged (the library marks the page), the handles keep out of sight. */
html[data-dnd-dragging] .row:not(:focus-within) .gutter {
  opacity: 0;
}

.add,
.handle {
  display: grid;
  place-items: center;
  width: 22px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  opacity: 0.4;
  transition:
    opacity 0.12s,
    background-color 0.12s;
}

.add {
  cursor: pointer;
}

.handle {
  width: 18px;
  cursor: grab;
  touch-action: none;
}

.add:hover,
.handle:hover,
.handle:focus-visible {
  opacity: 0.85;
  background: color-mix(in srgb, currentColor 9%, transparent);
}

.handle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.add svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}

.handle svg {
  width: 9px;
  height: 15px;
  fill: currentColor;
}

/* On touch screens nothing hovers: the handles stay in sight. */
@media (hover: none) {
  .gutter {
    opacity: 1;
  }

  .add,
  .handle {
    opacity: 0.3;
  }
}

/* The page stays still while blocks travel: they wait, faded, where they were. */
.row[data-dnd-placeholder],
.row[data-dnd-dragging] {
  opacity: 0.35;
}

/* Where the drop goes: between this block and the next, from the level it lands at. */
.line {
  position: absolute;
  right: 0;
  z-index: 1;
  height: 3px;
  border-radius: 2px;
  background: var(--accent);
  pointer-events: none;
}

/* A dot at its start, like a pin: where the text will begin. */
.line::before {
  content: '';
  position: absolute;
  top: -2.5px;
  left: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.line.before {
  top: -2px;
}

.line.after {
  bottom: -2px;
}

/* The copy in the overlay: no indentation, lifted off the page, the line seen through it. */
[data-dnd-overlay] .row {
  margin-left: 0;
  box-shadow:
    0 14px 30px -14px rgb(0 0 0 / 0.45),
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  opacity: 0.82;
}

@media (prefers-reduced-motion: reduce) {
  .row,
  .gutter,
  .add,
  .handle {
    transition: none;
  }
}
</style>
