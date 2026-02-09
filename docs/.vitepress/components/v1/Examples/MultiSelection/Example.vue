<script setup lang="ts">
  import ExampleContainer from '../../ExampleContainer.vue';
  import Draggable from './Draggable.vue';
</script>

<template>
  <ExampleContainer>
    <div class="draggable-container">
      <Draggable />
      <Draggable />
      <Draggable />
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .draggable-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
