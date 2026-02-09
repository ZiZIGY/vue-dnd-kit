<script setup lang="ts">
  import ExampleContainer from '../../ExampleContainer.vue';
  import Draggable from './Draggable.vue';
  import Layer from './Layer.vue';
</script>

<template>
  <ExampleContainer>
    <div class="example-container">
      <Draggable> im default </Draggable>
      <Draggable :layer="Layer"> im with custom layer </Draggable>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .example-container {
    display: flex;
    gap: 12px;
    flex-direction: column;
  }
</style>
