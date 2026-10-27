<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useKeyModifier, useTimeoutFn } from '@vueuse/core';
import { makeSortableList } from '@vue-dnd-kit/core';
import Task from './Task.vue';

const tasks = ref([
  { id: 1, title: 'Freeze the API', done: true, owner: 'Ana', locked: true },
  { id: 2, title: 'Write the changelog', done: false, owner: 'Ben' },
  { id: 3, title: 'Record the demo', done: false, owner: 'Kim' },
  { id: 4, title: 'Tweet about it', done: false, owner: 'Ana' },
]);
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: tasks });

const shiftOnly = ref(true);
const shift = useKeyModifier('Shift');

// Shakes the hint when `canDrag` turns a press down.
const nudged = ref(false);
const { start } = useTimeoutFn(() => (nudged.value = false), 400, { immediate: false });
const nudge = () => {
  nudged.value = true;
  start();
};
</script>

<template>
  <div class="checklist">
    <header>
      <strong>Launch checklist</strong>
      <label class="switch">
        <input v-model="shiftOnly" type="checkbox" />
        <span class="track" />
        Shift to drag
      </label>
    </header>
    <ul ref="list" class="list">
      <Task v-for="task in items" :key="task.id" :task="task" :shift-only="shiftOnly" @refused="nudge" />
    </ul>
    <p class="hint" :class="{ nudged, off: !shiftOnly }">
      Hold <kbd :class="{ down: shift }">⇧ Shift</kbd> and drag a row
    </p>
  </div>
</template>

<style scoped>
.checklist {
  width: min(380px, 100%);
  margin: 0 auto;
  padding: 14px;
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 2px 12px;
  font-size: 14px;
}

.switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.switch input {
  position: absolute;
  opacity: 0;
}

.track {
  position: relative;
  width: 30px;
  height: 18px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 18%, transparent);
  transition: background 0.2s;
}

.track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: Canvas;
  transition: translate 0.2s;
}

.switch input:checked + .track {
  background: #42b883;
}

.switch input:checked + .track::after {
  translate: 12px 0;
}

.switch input:focus-visible + .track {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hint {
  margin: 12px 0 0;
  font-size: 12px;
  text-align: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.hint.off {
  opacity: 0;
}

.hint.nudged {
  animation: shake 0.4s;
}

kbd {
  padding: 2px 6px;
  border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
  border-bottom-width: 2px;
  border-radius: 5px;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  transition:
    background 0.1s,
    color 0.1s;
}

kbd.down {
  border-color: #42b883;
  background: #42b883;
  color: #fff;
}

@keyframes shake {
  25% {
    translate: -5px 0;
  }
  50% {
    translate: 5px 0;
  }
  75% {
    translate: -3px 0;
  }
}
</style>
