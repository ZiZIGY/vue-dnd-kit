<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import ScrollList from './ScrollList.vue';

  interface Item {
    id: number;
    name: string;
  }

  const items = ref<Item[]>(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
  );

  function handleDrop(e: IDragEvent) {
    const result = e.helpers.suggestSort('vertical');
    if (!result) return;
    items.value = result.sourceItems as Item[];
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="layout">
        <p class="hint">Drag items near the top or bottom edge to trigger auto-scroll.</p>
        <ScrollList
          :items="items"
          :on-drop="handleDrop"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .layout {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .hint {
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    margin: 0;
  }
</style>
