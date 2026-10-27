<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import DragCard from './DragCard.vue';
</script>

<template>
  <!-- No drop target here: let go, and each card goes back where it was. -->
  <DnDProvider>
    <div class="cards">
      <DragCard title="Grab it anywhere" code="makeDraggable(el)" />
      <DragCard title="Grab the handle" code="{ handle: grip }" handle />
      <DragCard title="It moves itself" code="{ overlay: false }" self />
      <DragCard title="Not now" code="{ disabled: true }" disabled />
    </div>
  </DnDProvider>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  gap: 14px;
}

@media (max-width: 480px) {
  .cards {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
