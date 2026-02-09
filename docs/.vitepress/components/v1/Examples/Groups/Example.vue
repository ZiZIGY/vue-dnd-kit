<script setup lang="ts">
  import ExampleContainer from '../../ExampleContainer.vue';
  import Droppable from './Droppable.vue';
  import Draggable from './Draggable.vue';
  import { ref } from 'vue';

  const dropped = ref<string | null>(null);
</script>

<template>
  <ExampleContainer>
    <div class="container">
      <Draggable
        v-if="!dropped"
        :groups="['a']"
      />

      <div class="droppable-container">
        <Droppable
          :groups="['b']"
          @drop="dropped = 'b'"
        >
          <Draggable
            v-if="dropped === 'b'"
            :groups="['b']"
            @end="dropped = null"
          />
        </Droppable>

        <Droppable
          :groups="['a']"
          @drop="dropped = 'a'"
        >
          <Draggable
            v-if="dropped === 'a'"
            :groups="['a']"
            @end="dropped = null"
          />
        </Droppable>
      </div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .container {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
  .droppable-container {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
</style>
