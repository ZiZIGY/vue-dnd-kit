<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import ActivationItem from './ActivationItem.vue';
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="grid">
        <ActivationItem
          label="Instant"
          description="No activation — drag starts immediately on pointer down"
        />

        <ActivationItem
          label="Distance: 8px"
          description="Move 8px before drag starts (prevents accidental drags)"
          :activation="{ distance: 8 }"
        />

        <ActivationItem
          label="Delay: 500ms"
          description="Hold 500ms before drag starts (good for mobile / touch)"
          :activation="{ delay: 0.5 }"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 560px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
