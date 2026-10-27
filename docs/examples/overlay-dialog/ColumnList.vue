<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import ColumnRow from './ColumnRow.vue';

const columns = defineModel<string[]>('columns', { required: true });
const list = useTemplateRef<HTMLElement>('list');
// Strings are their own keys.
const { items } = makeSortableList(list, { items: columns, axis: 'y' });
</script>

<template>
  <ul ref="list" class="columns">
    <ColumnRow v-for="column in items" :key="column" :name="column" />
  </ul>
</template>

<style scoped>
.columns {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
