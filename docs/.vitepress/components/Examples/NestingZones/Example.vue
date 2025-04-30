<script setup lang="ts">
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import Draggable from './Draggable.vue';
  import { ref } from 'vue';

  const droppedId = ref<number>(0);
</script>

<template>
  <ExampleContainer>
    <div class="container">
      <Draggable
        v-if="droppedId === 0"
        @end="droppedId = 0"
      />

      <Zone @drop="droppedId = 1">
        first zone
        <Draggable
          v-if="droppedId === 1"
          @end="droppedId = 0"
        />

        <Zone @drop="droppedId = 2">
          second zone

          <Draggable
            v-if="droppedId === 2"
            @end="droppedId = 0"
          />

          <Zone @drop="droppedId = 3">
            third zone

            <Draggable
              v-if="droppedId === 3"
              @end="droppedId = 0"
            />
          </Zone>
        </Zone>
      </Zone>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
