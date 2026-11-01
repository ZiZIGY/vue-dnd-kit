<script setup lang="ts">
import { computed, inject } from 'vue';
import type { DragItem, DragMode, DropDestination } from '@vue-dnd-kit/core';
import { KINDS } from './blocks';
import { EDITOR } from './editor';

/**
 * The page's `overOverlay`: while a drag is over the page, the drag's own overlay (the copy
 * of the blocks, `<slot />`) gets a count and a note of what the drop does: a copy, a new
 * block, a move into another block.
 */
const props = defineProps<{ items: DragItem[]; mode: DragMode; to: DropDestination | null }>();
const editor = inject(EDITOR)!;

// A new block: a kind dragged from the menu or the sidebar, by its `type`.
const adding = computed(() => props.items[0]?.type.includes('new-block'));

const note = computed(() => {
  const verb = props.mode === 'copy' ? 'Copy' : adding.value ? 'Add' : null;
  const parent = props.to?.parentKey == null ? undefined : editor.get(String(props.to.parentKey));
  if (!parent) return verb; // a plain move at the page's top level needs no words
  const name = parent.text.trim() || KINDS[parent.kind].name;
  return `${verb ? `${verb} into` : 'Into'} “${name.length > 28 ? `${name.slice(0, 26)}…` : name}”`;
});
</script>

<template>
  <div class="ghost">
    <slot />
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
    <span v-if="note" class="note">{{ note }}</span>
  </div>
</template>

<style scoped>
/* Fills the box, like the overlay it wraps. */
.ghost {
  position: relative;
  width: 100%;
  height: 100%;
}

.count {
  position: absolute;
  top: -9px;
  right: -9px;
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: #42b883;
  color: #04130c;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px -4px rgb(0 0 0 / 0.5);
}

.note {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  max-width: 100%;
  overflow: hidden;
  padding: 4px 9px;
  border-radius: 6px;
  background: #18181b;
  color: #fafafa;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-shadow: 0 8px 18px -8px rgb(0 0 0 / 0.6);
}
</style>
