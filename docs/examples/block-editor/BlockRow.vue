<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
import BlockContent from './BlockContent.vue';
import type { Block } from './blocks';

const props = defineProps<{ node: FlatNode<Block>; indent: number }>();
const emit = defineEmits<{ toggle: [key: Key] }>();

const el = useTemplateRef<HTMLElement>('el');
// Only the handle drags, so the text stays editable and selectable. The handle takes the
// keyboard too: Space picks the block up, the arrows move it (left and right: in and out
// of a toggle), Space drops it.
const { indicator } = makeSortableItem(el, { id: () => props.node.key, handle: '.grip' });

// The drop line starts where text starts at the depth the block lands at (28px: the handle's
// gutter); a drop into this toggle lights the toggle up instead.
const line = computed(() => {
  const at = indicator.value;
  if (!at || at.side === 'inside') return null;
  return { side: at.side, left: `${((at.depth ?? 0) - props.node.depth) * props.indent + 28}px` };
});
const into = computed(() => indicator.value?.side === 'inside');
</script>

<template>
  <div ref="el" class="block" :class="[`is-${node.item.kind}`, { into }]" :style="{ '--indent': `${node.depth * indent}px` }">
    <button type="button" class="grip" aria-label="Move block" data-dnd-no-clone>
      <svg viewBox="0 0 10 16" aria-hidden="true">
        <circle v-for="dot in 6" :key="dot" :cx="dot % 2 ? 2 : 8" :cy="Math.ceil(dot / 2) * 5 - 2" r="1.5" />
      </svg>
    </button>
    <BlockContent :block="node.item" :open="!node.collapsed" @toggle="emit('toggle', node.key)" />
    <span v-if="line" class="line" :class="line.side" :style="{ left: line.left }" />
  </div>
</template>

<style scoped>
.block {
  position: relative;
  margin-left: var(--indent);
  padding: 3px 6px 3px 28px;
  border-radius: 6px;
  /* Its own background, the page's: the overlay is a copy of the block. */
  background: Canvas;
}

.grip {
  position: absolute;
  top: 6px;
  left: 4px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  opacity: 0;
  cursor: grab;
  transition:
    opacity 0.15s,
    background 0.15s;
}

/* Lined up with the first line of text. */
.is-heading .grip {
  top: 15px;
}

.is-divider .grip {
  top: 50%;
  translate: 0 -50%;
}

.block:hover .grip,
.grip:focus-visible {
  opacity: 0.45;
}

.grip:hover,
.grip:focus-visible {
  opacity: 0.9;
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.grip:focus-visible {
  outline: 2px solid #42b883;
}

.grip svg {
  width: 10px;
  height: 16px;
  fill: currentColor;
}

/* On touch screens nothing hovers: the handles stay in sight. */
@media (hover: none) {
  .grip {
    opacity: 0.35;
  }
}

/* The page stays still while a block travels: it waits, faded, where it was. */
.block[data-dnd-placeholder] {
  opacity: 0.35;
}

.block.into {
  background: color-mix(in srgb, #42b883 14%, Canvas);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

/* Where the drop goes: between this block and the next, from the depth it lands at. */
.line {
  position: absolute;
  right: 0;
  height: 3px;
  border-radius: 2px;
  background: #42b883;
  pointer-events: none;
}

.line.before {
  top: -2px;
}

.line.after {
  bottom: -2px;
}

/* The copy in the overlay: no indentation, a little see-through, like a ghost. */
[data-dnd-overlay] .block {
  margin-left: 0;
  box-shadow:
    0 12px 28px -12px rgb(0 0 0 / 0.5),
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  opacity: 0.9;
}
</style>
