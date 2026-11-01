<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import BlockGhost from './BlockGhost.vue';
import PageBlock from './PageBlock.vue';
import { useBuilder } from './builder';
import { BLOCKS, createBlock, type ChipData, type Column } from './page';

const props = defineProps<{ column: Column }>();
const builder = useBuilder();
const { hovered } = builder;

// The column's blocks, written back into the column on drop. A computed rather than
// `toRef`: undo puts new objects in the page, this column's among them.
const blocks = computed({
  get: () => props.column.blocks,
  set: (value) => (props.column.blocks = value),
});

const list = useTemplateRef<HTMLElement>('list');
const { active } = useDnD();
// Every column of every section is a list of one group: blocks move between all of them,
// and sort live, so the page shows the result while you drag.
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: blocks,
  group: 'blocks',
  // A section in hand passes over the columns: they step aside. With `createItem`, they
  // would take it for a chip, refuse it, and hide the page's line under them.
  disabled: () => !!active.value?.type.includes('sections'),
  // A block in hand, and a chip over a column: the real block, in the section's colors.
  overlay: BlockGhost,
  animate: true,
  // The palette's chips are plain draggables: the column makes the block their `data` names.
  createItem: (active) => {
    const kind = (active.data as ChipData | undefined)?.kind;
    return kind ? createBlock(BLOCKS[kind].spec) : undefined;
  },
  onDrop: (event) => builder.select(event.items[0]!.id),
});
</script>

<template>
  <div
    ref="list"
    class="column"
    :class="{ empty: !items.length, ready: isAccepting, over: isOver && isAccepting, hovered: hovered === column.id }"
    :data-node="column.id"
  >
    <PageBlock v-for="block in items" :key="block.id" :block="block" />
  </div>
</template>

<style scoped>
/* The editor's marks are outlines and a tint on top: a column's own look (a card) stays. */
.column {
  position: relative;
  border-radius: 6px;
  outline: 1px solid transparent;
  outline-offset: -1px;
  transition: outline-color 0.15s;
}

.column::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgb(66 184 131 / 0.08);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

/* An empty column keeps a place to drop into, and says so. */
.column.empty {
  justify-content: center;
  min-height: 64px;
  outline: 1px dashed color-mix(in srgb, var(--ink) 25%, transparent);
}

.column.empty::after {
  content: 'Drop elements here';
  color: var(--body);
  font-size: 12px;
  text-align: center;
}

/* A block in hand: every column can take it, the one under it most of all. */
.column.ready {
  outline: 1px dashed rgb(66 184 131 / 0.55);
}

.column.over {
  outline: 1.5px solid #42b883;
}

.column.over::before {
  opacity: 1;
}

.column.hovered {
  outline: 1px solid rgb(66 184 131 / 0.8);
}
</style>
