<script setup lang="ts">
  import { ref } from 'vue';
  import {
    Table,
    TableHead,
    TableBody,
    Draggable,
  } from '@vue-dnd-kit/components';
  import { DnDOperations, useDnDStore } from '@vue-dnd-kit/core';

  import Drag from './components/Drag.vue';

  // const columns = ref([
  //   { key: 'code', name: 'Код' },
  //   { key: 'name', name: 'Название' },
  //   { key: 'category', name: 'Категория' },
  //   { key: 'price', name: 'Цена' },
  // ]);

  // const tableData = ref([
  //   { code: '1001', name: 'Продукт 1', category: 'Категория A', price: 99 },
  //   { code: '1002', name: 'Продукт 2', category: 'Категория B', price: 149 },
  //   { code: '1003', name: 'Продукт 3', category: 'Категория A', price: 249 },
  // ]);

  // const formatCurrency = (value) => {
  //   return new Intl.NumberFormat('ru-RU', {
  //     style: 'currency',
  //     currency: 'RUB',
  //   }).format(value);
  // };

  const store = useDnDStore();
</script>

<template>
  {{ store.keyboard }}
  <Drag
    v-for="item in 1_000"
    :key="item"
  >
    drag me
  </Drag>
</template>

<style>
  pre {
    position: fixed;
    top: 0;
    left: 0;
    height: 100svh;
    text-align: left;
    max-width: 300px;
    overflow: auto;
  }

  .column-header {
    font-weight: bold;
    margin-bottom: 12px;
    padding: 8px;
  }
</style>
