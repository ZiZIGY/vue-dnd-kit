<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import BoardColumns from '../../components/apps/board/BoardColumns.vue';
  import BoardOverlay from '../../components/apps/board/BoardOverlay.vue';
</script>

<template>
  <section class="tb-app">
    <header class="tb-head">
      <h2>Product roadmap</h2>
      <p>
        Drag cards between columns and columns by their header. In progress and Review have WIP limits; moving a card
        to Done asks for confirmation. Ctrl/Cmd+click selects several cards; the trash deletes them.
      </p>
    </header>
    <!-- Own provider: the #overlay slot renders the tilted card for this board only. -->
    <DnDProvider>
      <BoardColumns />
      <template #overlay="{ items, over, accepted, status }">
        <BoardOverlay
          :items="items"
          :over="over"
          :accepted="accepted"
          :status="status"
        />
      </template>
    </DnDProvider>
  </section>
</template>

<style scoped>
  .tb-head h2 {
    margin: 0 0 4px;
  }

  .tb-head p {
    max-width: 760px;
    margin: 0 0 12px;
    color: var(--ui-text-muted);
  }
</style>
