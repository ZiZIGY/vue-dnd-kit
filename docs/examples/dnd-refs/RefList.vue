<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList, type SortableGroupOptions } from '@vue-dnd-kit/core';
import RefRow from './RefRow.vue';

type Task = { id: string; title: string; urgent?: boolean };
const props = defineProps<{ list: { id: string; title: string; group: SortableGroupOptions; tasks: Task[] } }>();

const el = useTemplateRef<HTMLElement>('el');
const { items, isOver, isAccepting } = makeSortableList(el, {
  id: props.list.id,
  items: toRef(props.list, 'tasks'),
  group: props.list.group,
});
</script>

<template>
  <section class="list" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <header>
      <strong>{{ list.title }}</strong>
      <code v-if="isAccepting">isAccepting</code>
      <code v-if="isOver" :class="{ bad: !isAccepting }">isOver</code>
    </header>
    <ul ref="el" class="rows">
      <RefRow v-for="task in items" :key="task.id" :task="task" />
    </ul>
  </section>
</template>

<style scoped>
.list {
  flex: 1;
  min-width: 0;
  max-width: 270px;
  padding: 10px;
  border: 1.5px solid color-mix(in srgb, currentColor 11%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s;
}

/* A drag is on, and this list takes it. */
.list.accepting {
  border-style: dashed;
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

.list.over {
  border-style: solid;
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 7%, Canvas);
}

/* Over it, but it refuses the drag: a drop here is cancelled. */
.list.refused {
  border-color: #f43f5e;
  background: color-mix(in srgb, #f43f5e 7%, Canvas);
}

header {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 20px;
  margin: 0 2px 10px;
  font-size: 13px;
}

strong {
  margin-right: auto;
}

code {
  padding: 2px 5px;
  border-radius: 5px;
  background: color-mix(in srgb, #42b883 18%, transparent);
  color: #42b883;
  font: 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
}

code.bad {
  background: color-mix(in srgb, #f43f5e 18%, transparent);
  color: #f43f5e;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 172px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
