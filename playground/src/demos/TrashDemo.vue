<script setup lang="ts">
  import { reactive, useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import DemoList from '../components/DemoList.vue';
  import { describeLists, makeTasks } from '../data';

  const list = reactive({ id: 'bin-list', title: 'Items', tasks: makeTasks('x', 5) });
  const removable = reactive({ id: 'remove-list', title: 'Drop outside removes', tasks: makeTasks('y', 3) });

  const trash = useTemplateRef<HTMLElement>('trash');
  const { isOver } = makeDroppable(trash, {
    id: 'trash',
    // The source resolver of the sortable group marks the dragged items for removal.
    onDrop: (event) => event.source?.remove(),
  });
</script>

<template>
  <p>Drop items on the trash (Ctrl/Cmd+click to select several). In the second list, dropping anywhere outside removes.</p>
  <div class="demo-row">
    <DemoList
      :list="list"
      :options="{ group: 'bin' }"
      selectable
    />
    <div
      ref="trash"
      class="drop-target"
      data-testid="trash"
      :data-over="isOver || undefined"
    >
      Trash
    </div>
    <DemoList
      :list="removable"
      :options="{ dropOutside: 'remove' }"
    />
  </div>
  <pre data-testid="state">{{ describeLists([list, removable]) }}</pre>
</template>
