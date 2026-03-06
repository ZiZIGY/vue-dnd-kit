<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import DraggableItem from './DraggableItem.vue';

  const currentZone = ref<'left' | 'right'>('left');
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="layout">
        <Zone
          label="Zone A"
          @drop="currentZone = 'left'"
        >
          <DraggableItem v-if="currentZone === 'left'">
            Drag me by the handle
          </DraggableItem>
        </Zone>

        <Zone
          label="Zone B"
          @drop="currentZone = 'right'"
        >
          <DraggableItem v-if="currentZone === 'right'">
            Drag me by the handle
          </DraggableItem>
        </Zone>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .layout {
    display: flex;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    .layout {
      flex-direction: column;
    }
  }
</style>
