<script setup lang="ts">
  import Draggable from '../Draggable.vue';
  import Droppable from '../Droppable.vue';
  import { IDnDStore } from '@vue-dnd-kit/core/';

  interface ColumnDefinition {
    key: string;
    name: string;
  }

  defineProps<{
    columns: ColumnDefinition[];
    data: any[];
  }>();

  const emit = defineEmits<{
    (e: 'drop', store: IDnDStore): void;
  }>();

  const onDrop = (store: IDnDStore) => {
    emit('drop', store);
  };
</script>

<template>
  <Droppable
    tag="tbody"
    @drop="onDrop"
  >
    <Draggable
      v-for="(row, rowIndex) in data"
      :key="rowIndex"
      class="dnd-kit-table-row"
      tag="tr"
      :prevent-root-drag="false"
      :source="data"
      :index="rowIndex"
    >
      <td
        v-for="column in columns"
        :key="column.key"
        class="dnd-kit-table-cell"
      >
        <slot
          name="cell"
          :row="row"
          :column="column"
          :value="row[column.key]"
        >
          {{ row[column.key] }}
        </slot>
      </td>
    </Draggable>
  </Droppable>
</template>
