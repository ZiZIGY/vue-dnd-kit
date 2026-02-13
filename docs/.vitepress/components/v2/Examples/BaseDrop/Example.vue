<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import DraggableItem from './DraggableItem.vue';

  /** true = dropped in a zone; which zone is tracked for v-if placement */
  const droppedZone = ref<'outer' | 'inner'>('outer');
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <Zone
        class="zone-outer"
        @drop="droppedZone = 'outer'"
      >
        <span class="zone-label">Outer zone</span>
        <DraggableItem v-if="droppedZone === 'outer'" />

        <Zone
          class="zone-inner"
          @drop="droppedZone = 'inner'"
        >
          <span class="zone-label">Inner zone</span>
          <DraggableItem v-if="droppedZone === 'inner'" />
        </Zone>
      </Zone>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .base-drop {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .start {
    padding: 0.5rem 0;
  }

  .zone-outer {
    min-height: 200px;
  }

  .zone-inner {
    margin-top: 1rem;
    min-height: 100px;
  }

  .zone-label {
    display: block;
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    margin-bottom: 0.5rem;
  }
</style>
