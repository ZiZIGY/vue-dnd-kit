<script setup>
  import { ref } from 'vue';
  import { Table, TableHead, TableBody } from '@vue-dnd-kit/components';
  import { DnDOperations, useDnDStore } from '@vue-dnd-kit/core';

  const columns = ref([
    { key: 'code', name: 'Код' },
    { key: 'name', name: 'Название' },
    { key: 'category', name: 'Категория' },
    { key: 'price', name: 'Цена' },
  ]);

  const tableData = ref([
    { code: '1001', name: 'Продукт 1', category: 'Категория A', price: 99 },
    { code: '1002', name: 'Продукт 2', category: 'Категория B', price: 149 },
    { code: '1003', name: 'Продукт 3', category: 'Категория A', price: 249 },
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(value);
  };

  const store = useDnDStore();
</script>

<template>
  <div class="example-container">
    <h2>Пример таблицы с перетаскиванием</h2>
    <Table>
      <TableHead
        :columns="columns"
        @update:columns="columns = $event"
        @drop="DnDOperations.applyTransfer"
      />

      <TableBody
        :columns="columns"
        :data="tableData"
        @drop="DnDOperations.applyTransfer"
      >
        <template #cell="{ row, column, value }">
          <div v-if="column.key === 'price'">
            {{ formatCurrency(value) }}
          </div>
          <div v-else>
            {{ value }}
          </div>
        </template>
      </TableBody>
    </Table>
  </div>
</template>

<style scoped>
  .example-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
