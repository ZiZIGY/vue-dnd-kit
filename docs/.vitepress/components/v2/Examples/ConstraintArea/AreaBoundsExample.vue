<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import ConstraintBox from './ConstraintBox.vue';
  import DragChip from './DragChip.vue';
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <ConstraintBox
        :restrict-to-area="true"
        label="Constraint area"
        class="bounds-box"
      >
        <DragChip>Drag me</DragChip>
      </ConstraintBox>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .bounds-box {
    min-height: 200px;
  }
</style>
