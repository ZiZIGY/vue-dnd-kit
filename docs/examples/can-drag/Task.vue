<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  task: { id: number; title: string; done: boolean; owner: string; locked?: boolean };
  shiftOnly: boolean;
}>();
const emit = defineEmits<{ refused: [] }>();
const el = useTemplateRef<HTMLElement>('el');

makeSortableItem(el, {
  item: () => props.task,
  // Never: the row is locked (and says so to screen readers with aria-disabled).
  disabled: () => !!props.task.locked,
  // Per press: pointer drags only with Shift held; the keyboard as usual.
  canDrag: (event) => {
    if (!props.shiftOnly || event instanceof KeyboardEvent || event.shiftKey) return true;
    emit('refused');
    return false;
  },
});
</script>

<template>
  <li ref="el" class="task" :class="{ done: task.done, locked: task.locked }">
    <!-- Controls inside a draggable keep working: a press on them never starts a drag. -->
    <input v-model="task.done" type="checkbox" :aria-label="`Done: ${task.title}`" />
    <span class="title">{{ task.title }}</span>
    <span v-if="task.locked" class="lock">locked</span>
    <select v-else v-model="task.owner" :aria-label="`Owner of ${task.title}`">
      <option v-for="owner in ['Ana', 'Ben', 'Kim']" :key="owner">{{ owner }}</option>
    </select>
  </li>
</template>

<style scoped>
.task {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 9%, transparent);
  cursor: grab;
  user-select: none;
}

.task.locked {
  cursor: not-allowed;
  background: color-mix(in srgb, currentColor 4%, Canvas);
}

.task:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.task[data-dnd-placeholder] {
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 50%, transparent);
  background: color-mix(in srgb, #42b883 7%, Canvas);
}

.task[data-dnd-placeholder] > * {
  visibility: hidden;
}

[data-dnd-overlay] .task {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 16px 28px -14px rgb(0 0 0 / 0.5);
}

input[type='checkbox'] {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #42b883;
  cursor: pointer;
}

.title {
  flex: 1;
  min-width: 0;
  padding: 4px 0;
  font-size: 13px;
}

select {
  padding: 3px 6px;
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 6px;
  background: Canvas;
  color: inherit;
  font: 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

select:focus-visible {
  outline: 2px solid #42b883;
}

.done .title {
  text-decoration: line-through;
  opacity: 0.5;
}

.lock {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.7;
}
</style>
