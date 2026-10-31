<script setup lang="ts">
  import FitBoard from './FitBoard.vue';
</script>

<template>
  <p class="lead">
    Drag a card into the other list. The overlay box is sized by the provider: with <code>'slot'</code> it glides to
    the size of the target list's items (and the drop needs no resize), with <code>'source'</code> it never changes.
    The clone re-lays out at the new size; an overlay component follows it by filling the box.
  </p>
  <div class="boards">
    <FitBoard fit="slot" />
    <FitBoard fit="source" />
  </div>
</template>

<style scoped>
  .lead {
    max-width: 760px;
  }

  .boards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
  }
</style>
