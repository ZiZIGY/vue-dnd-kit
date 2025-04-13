<script setup lang="ts">
  import Droppable from '../Droppable.vue';
  import { IDnDStore } from '@vue-dnd-kit/core';
  import { ITableColumn } from '../../types';
  import Draggable from '../Draggable.vue';

  defineProps<{
    columns: ITableColumn[];
  }>();

  const emit = defineEmits<{
    (e: 'drop', store: IDnDStore): void;
  }>();
</script>

<template>
  <Droppable
    tag="thead"
    :source="columns"
    @drop="emit('drop', $event)"
  >
    <tr>
      <Draggable
        v-for="(column, index) in columns"
        :key="column.key"
        class="dnd-kit-table-header-cell"
        tag="th"
        :index="index"
        :source="columns"
      >
        {{ index }}
        <slot
          name="column"
          :column="column"
        >
          {{ column.name }}
        </slot>
      </Draggable>
    </tr>
  </Droppable>
</template>
