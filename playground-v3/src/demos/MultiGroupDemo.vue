<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useDnD, type SortableDropEvent } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import { describeLists, makeTasks, nextId } from '../data';
  import type { Task } from '../types';

  // Alt copies (the provider's copyModifier): the whole block as copies.
  const clone = (task: Task): Task => ({ ...task, id: nextId(task.id) });

  // `multiple` is left at its default, 'group': the other selected items leave their
  // places and travel with the dragged one, so the list shows the drop result while hovering.
  const lists = reactive({
    a: { id: 'group-a', title: 'Group A', tasks: makeTasks('a', 8).map((task) => (['a2', 'a4'].includes(task.id) ? { ...task, type: 'bug' } : task)) },
    b: { id: 'group-b', title: 'Group B', tasks: makeTasks('b', 3) },
    bugs: { id: 'bugs', title: 'Bugs only', tasks: [] as Task[] },
    first: { id: 'first', title: 'Takes the first', tasks: [] as Task[] },
    row: { id: 'row', title: 'Horizontal', tasks: makeTasks('x', 6) },
    grid: { id: 'cells', title: 'Grid', tasks: makeTasks('c', 9) },
  });
  const last = ref('');
  const record = (event: SortableDropEvent<Task>) => {
    last.value = `to:${event.to.list} accepted:${event.accepted.join(',')} rejected:${event.rejected.join(',')}`;
  };
  const { selection } = useDnD();
</script>

<template>
  <p>Ctrl/Cmd+click to select, then drag one of the selected items.</p>
  <section>
    <h2>Group (default): the others travel with the dragged item</h2>
    <div class="demo-row">
      <DemoList
        :list="lists.a"
        :options="{ group: 'group', clone, onDrop: record }"
        selectable
      />
      <DemoList
        :list="lists.b"
        :options="{ group: 'group', clone, onDrop: record }"
        selectable
      />
      <DemoList
        :list="lists.bugs"
        :options="{ group: { name: 'group', put: ({ types }) => types.includes('bug') }, acceptMode: 'some', onDrop: record }"
      />
      <DemoList
        :list="lists.first"
        :options="{ group: 'group', onBeforeDrop: (event) => event.keys.slice(0, 1), onDrop: record }"
      />
    </div>
  </section>
  <section>
    <h2>Horizontal</h2>
    <DemoList
      class="horizontal"
      :list="lists.row"
      :options="{ strategy: 'horizontal' }"
      selectable
    />
  </section>
  <section>
    <h2>Grid</h2>
    <DemoList
      class="grid"
      :list="lists.grid"
      :options="{ strategy: 'grid' }"
      selectable
    />
  </section>
  <button
    data-testid="clear"
    @click="selection.clear()"
  >
    Clear selection
  </button>
  <pre data-testid="last">{{ last }}</pre>
  <pre data-testid="state">{{ describeLists(Object.values(lists)) }}</pre>
</template>
