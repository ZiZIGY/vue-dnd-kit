<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  work: { id: string; title: string; kind: 'epic' | 'story' | 'task'; children?: unknown[] };
  /** The tree's depth; 0 in the backlog. */
  depth: number;
}>();
const el = useTemplateRef<HTMLElement>('el');
// The same row in the tree and in the list: `item` is keyed by whichever owns it.
makeSortableItem(el, { item: () => props.work });

// What the node carries, even where its children aren't shown (in the backlog).
const nested = computed(() => {
  const count = props.work.children?.length ?? 0;
  if (!count) return '';
  if (props.work.kind === 'epic') return count === 1 ? '1 story' : `${count} stories`;
  return count === 1 ? '1 task' : `${count} tasks`;
});
</script>

<template>
  <li ref="el" class="work" :class="work.kind" :style="{ '--indent': `${depth * 20}px` }">
    <span class="kind">{{ work.kind }}</span>
    <span class="title">{{ work.title }}</span>
    <span v-if="nested" class="nested">{{ nested }}</span>
  </li>
</template>

<style scoped>
.work {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  margin-left: var(--indent);
  padding: 0 10px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.work:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.work.epic .title {
  font-weight: 650;
}

/* The slot, at the depth it will land at. */
.work[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 8%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 70%, transparent);
}

.work[data-dnd-placeholder] > * {
  visibility: hidden;
}

.kind {
  width: 38px;
  font: 600 9px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.5;
}

.epic .kind {
  color: #8b7cf6;
  opacity: 1;
}

.story .kind {
  color: #42b883;
  opacity: 1;
}

.title {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.nested {
  padding: 3px 6px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
}
</style>
