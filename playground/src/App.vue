<script setup lang="ts">
  import { ref } from 'vue';
  import Test from './components/Test.vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const data = ref([
    {
      id: 1,
      name: 'test',
    },
    {
      id: 2,
      name: 'test2',
    },
    {
      id: 3,
      name: 'test3',
    },
  ]);

  const store = useDnDProvider();
</script>

<template>
  <Test
    v-for="(item, index) in data"
    :key="item.id"
    :name="item.name"
    :index="index"
    :id="item.id"
    :source="data"
  />

  <pre>{{ store }}</pre>
</template>

<style>
  pre {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    height: 100svh;
    overflow: auto;
  }

  body {
    height: 200svh;
  }
</style>
