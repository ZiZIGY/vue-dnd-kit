<script setup lang="ts">
  import { DnDProvider, DragPreview } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import ChessGame from './ChessGame.vue';
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <template #preview>
        <DragPreview />
      </template>
      <ChessGame />
    </DnDProvider>
  </ExampleContainer>
</template>
