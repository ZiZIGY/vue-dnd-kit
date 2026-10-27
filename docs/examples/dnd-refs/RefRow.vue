<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string; urgent?: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, {
  item: () => props.task,
  type: () => (props.task.urgent ? 'urgent' : 'task'),
});

const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
};
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }" @click="onClick">
    <span class="title">
      <i v-if="task.urgent" class="urgent" aria-label="Urgent" />
      {{ task.title }}
    </span>
    <!-- The refs that are true right now. -->
    <span class="refs">
      <code v-if="isPlaceholder">isPlaceholder</code>
      <code v-if="isDragging">isDragging</code>
      <code v-if="selected">selected</code>
    </span>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  min-height: 38px;
  box-sizing: border-box;
  padding: 7px 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.row.selected {
  background: color-mix(in srgb, #3b82f6 14%, Canvas);
  box-shadow: 0 0 0 1.5px #3b82f6;
}

/* `opacity: 1` beats the library's default 40% for the slot. */
.row.placeholder {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 60%, transparent);
}

.row.placeholder .title {
  visibility: hidden;
}

.title {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.urgent {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f43f5e;
}

.refs {
  display: flex;
  gap: 4px;
}

code {
  padding: 2px 5px;
  border-radius: 5px;
  background: color-mix(in srgb, #42b883 18%, transparent);
  color: #42b883;
  font: 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
}

.selected code {
  background: color-mix(in srgb, #3b82f6 18%, transparent);
  color: #60a5fa;
}
</style>
