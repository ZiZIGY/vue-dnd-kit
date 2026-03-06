<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Column from './Column.vue';

  interface Item {
    id: number;
    name: string;
  }

  const firstColumn = ref<Item[]>([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

  const secondColumn = ref<Item[]>([
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
  ]);

  function applySort(e: IDragEvent) {
    const result = e.helpers.suggestSort('vertical');
    if (!result) return;

    const srcItems = e.draggedItems[0]?.items as Item[] | undefined;
    const tgtItems = (e.hoveredDraggable?.items ?? e.dropZone?.items) as
      | Item[]
      | undefined;

    if (!srcItems) return;

    if (srcItems === firstColumn.value) {
      firstColumn.value = result.sourceItems as Item[];
    } else if (srcItems === secondColumn.value) {
      secondColumn.value = result.sourceItems as Item[];
    }

    if (!result.sameList && tgtItems) {
      if (tgtItems === firstColumn.value) {
        firstColumn.value = result.targetItems as Item[];
      } else if (tgtItems === secondColumn.value) {
        secondColumn.value = result.targetItems as Item[];
      }
    }
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider :style="{ opacity: 0.5 }">
      <div class="sorting-lists">
        <Column
          :items="firstColumn"
          :on-drop="applySort"
        />
        <Column
          :items="secondColumn"
          :on-drop="applySort"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .sorting-lists {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .dropzone {
    position: relative;
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.08);
  }

  .list-move {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-leave-active {
    position: absolute;
    pointer-events: none;
  }
</style>
