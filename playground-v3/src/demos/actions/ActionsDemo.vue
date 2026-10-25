<script setup lang="ts">
  import { reactive, shallowRef } from 'vue';
  import type { Coordinates } from '@vue-dnd-kit/core';
  import { useDnDActions } from '@vue-dnd-kit/actions';
  import ActionList from './ActionList.vue';
  import { describeLists, makeTasks } from '../../data';
  import type { Task } from '../../types';

  const todo = reactive({
    id: 'todo',
    title: 'Todo',
    tasks: makeTasks('t', 4).map((task) => (task.id === 't3' ? { ...task, title: 'T3 (locked)', type: 'locked' } : task)),
  });
  const done = reactive({ id: 'done', title: 'Done', tasks: makeTasks('d', 2) });
  const result = shallowRef('-');
  const report = (text: string) => (result.value = text);

  /** Done takes no locked task: `moveItem` resolves `false` and the item flies back. */
  const refuseLocked = (event: { items: Task[] }) => !event.items.some((task) => task.type === 'locked');

  const { startDrag } = useDnDActions();
  const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const centerOf = (selector: string): Coordinates | null => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
  };

  /** A scripted pointer drag: the first task glides over to Done, settles at its top and drops. */
  const scripted = async () => {
    const first = todo.tasks[0];
    const from = first && centerOf(`[data-testid="todo"] [data-id="${first.id}"]`);
    const to = centerOf('[data-testid="done"] [data-id]') ?? centerOf('[data-testid="done"]');
    const drag = first && from && to ? startDrag(first.id, { from }) : null;
    if (!drag || !from || !to) return void (result.value = 'scripted: busy');
    const steps = 8;
    for (let step = 1; step <= steps; step++) {
      await drag.moveTo({ x: from.x + ((to.x - from.x) * step) / steps, y: from.y + ((to.y - from.y) * step) / steps });
      await pause(30);
    }
    await drag.moveTo({ list: 'done', index: 0 });
    result.value = `scripted: ${(await drag.drop()) ? 'moved' : 'refused'}`;
  };
</script>

<template>
  <p>
    <code>@vue-dnd-kit/actions</code>: the buttons move items with <code>moveItem</code> (a whole drag: animated,
    announced, through <code>onBeforeDrop</code>; Done refuses locked tasks), ⌨ picks an item up for the keyboard
    (<code>startDrag</code>), and the scripted drag glides a task over with the pointer API.
  </p>
  <button
    data-testid="scripted"
    @click="scripted"
  >
    Scripted drag: first task to Done
  </button>
  <p>
    Last action: <output data-testid="actions-result">{{ result }}</output>
  </p>
  <div class="demo-row">
    <ActionList
      :list="todo"
      :other="done"
      :report="report"
    />
    <ActionList
      :list="done"
      :other="todo"
      :options="{ onBeforeDrop: refuseLocked }"
      :report="report"
    />
  </div>
  <pre data-testid="actions-order">{{ describeLists([todo, done]) }}</pre>
</template>
