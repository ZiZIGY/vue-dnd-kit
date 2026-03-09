<script setup lang="ts">
  import { DnDProvider, DragPreview } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import CheckersGame from './CheckersGame.vue';
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <template #preview>
        <DragPreview />
      </template>
      <CheckersGame />
    </DnDProvider>
  </ExampleContainer>
</template>
