<script setup lang="ts">
  import { markRaw } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Item from './Item.vue';
  import TransitionOverlay from './TransitionOverlay.vue';

  const overlayComponent = markRaw(TransitionOverlay);

  const items = [
    { label: 'Drag me', color: '#6366f1' },
    { label: 'And me', color: '#ec4899' },
    { label: 'Or me', color: '#14b8a6' },
  ];
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <template #preview>
        <component :is="overlayComponent" />
      </template>

      <div class="row">
        <Item
          v-for="item in items"
          :key="item.label"
          :label="item.label"
          :color="item.color"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
</style>
