<script setup lang="ts">
  import ExampleContainer from '../../ExampleContainer.vue';
  import Tree from './Tree.vue';
  import { ref } from 'vue';

  interface TreeItem {
    id: string | number;
    children?: TreeItem[];
  }

  const source = ref<TreeItem[]>([
    {
      id: crypto.randomUUID(),
      children: [
        {
          id: crypto.randomUUID(),
          children: [
            {
              id: crypto.randomUUID(),
              children: [],
            },
            {
              id: crypto.randomUUID(),
              children: [],
            },
            {
              id: crypto.randomUUID(),
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      children: [
        {
          id: crypto.randomUUID(),
          children: [
            {
              id: crypto.randomUUID(),
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      children: [
        {
          id: crypto.randomUUID(),
          children: [],
        },
        {
          id: crypto.randomUUID(),
          children: [],
        },
      ],
    },
  ]);
</script>

<template>
  <ExampleContainer>
    <Tree :source="source" />
  </ExampleContainer>
</template>
