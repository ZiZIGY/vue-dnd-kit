<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';

const props = defineProps<{ node: FlatNode<{ name: string; folder?: boolean }>; indent: number }>();
const emit = defineEmits<{ toggle: [key: Key] }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <!-- While dragged, `node.depth` is the projected depth: the slot indents live. -->
  <div ref="el" class="row" :style="{ '--pad': `${6 + node.depth * indent}px` }">
    <span v-for="level in node.depth" :key="level" class="guide" :style="{ left: `${13 + (level - 1) * indent}px` }" />
    <button
      v-if="node.hasChildren"
      type="button"
      class="toggle"
      :class="{ open: !node.collapsed }"
      :aria-expanded="!node.collapsed"
      :aria-label="node.item.name"
      @click="emit('toggle', node.key)"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
    </button>
    <span v-else class="toggle" />
    <svg class="icon" :class="{ folder: node.item.folder }" viewBox="0 0 16 16" aria-hidden="true">
      <path v-if="node.item.folder" d="M2 4.5C2 3.7 2.7 3 3.5 3h3L8 4.5h4.5c.8 0 1.5.7 1.5 1.5v5.5c0 .8-.7 1.5-1.5 1.5h-9c-.8 0-1.5-.7-1.5-1.5z" />
      <path v-else d="M4 2h5l3 3v9H4zM9 2v3h3" />
    </svg>
    <span class="name">{{ node.item.name }}</span>
  </div>
</template>

<style scoped>
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px 0 var(--pad);
  border-radius: 6px;
  /* The explorer's background: the overlay, a copy of the row, isn't see-through. */
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font: 13px/1 ui-monospace, Menlo, Consolas, monospace;
  cursor: grab;
  user-select: none;
}

.row:hover {
  background: color-mix(in srgb, currentColor 7%, Canvas);
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.row[data-dnd-placeholder] {
  opacity: 1;
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;
}

.row[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 3px 4px 3px var(--pad);
  border: 1.5px dashed #42b883;
  border-radius: 6px;
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

.guide {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: color-mix(in srgb, currentColor 14%, transparent);
}

.toggle {
  display: grid;
  flex: none;
  place-items: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 0;
  border-radius: 3px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.toggle:focus-visible {
  outline: 2px solid #42b883;
}

.toggle svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.55;
  transition: rotate 0.15s;
}

.toggle.open svg {
  rotate: 90deg;
}

.icon {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: color-mix(in srgb, currentColor 55%, transparent);
  stroke-width: 1.2;
  stroke-linejoin: round;
}

.icon.folder {
  fill: color-mix(in srgb, #42b883 25%, transparent);
  stroke: #42b883;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
