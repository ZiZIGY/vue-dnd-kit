<script setup lang="ts">
  import { ref } from 'vue';
  import { Tree } from '@vue-dnd-kit/components/templates/Tree';

  interface IUser {
    id: number;
    name: string;
    children?: IUser[];
  }

  const users = ref<IUser[]>([
    {
      id: 1,
      name: 'John',
      children: [
        {
          id: 2,
          name: 'Victoria',
          children: [],
        },
        {
          id: 3,
          name: 'Abraham',
          children: [
            {
              id: 4,
              name: 'Eliz',
            },
          ],
        },
      ],
    },
  ]);
</script>

<template>
  <Tree
    :data="users"
    item-key="id"
    nesting-key="children"
    v-slot="{ item }"
  >
    {{ item.name }}
  </Tree>
</template>

<style>
  pre {
    text-align: left;
    position: fixed;
    width: 300px;
    height: 100svh;
    overflow: auto;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f8fafc;
    color: #334155;
  }

  .playground {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
  }

  main {
    flex: 1;
    padding: 24px 0;
  }

  /* Сбрасываем стили из исходного файла */
  pre {
    max-width: none;
  }
</style>
