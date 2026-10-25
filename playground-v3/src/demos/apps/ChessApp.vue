<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ChessBoard from '../../components/apps/chess/ChessBoard.vue';
</script>

<template>
  <section>
    <h2 class="ch-heading">Chess</h2>
    <p class="ch-hint">
      Drag a piece: its legal squares light up, and any other square sends it back. With the keyboard, Space picks a
      piece up and the arrows jump between its legal squares. Simplified rules: no check, castling or en passant;
      taking the king wins.
    </p>
    <!-- Own provider: the default overlay (a clone of the piece) and its own drag state. -->
    <DnDProvider>
      <ChessBoard />
    </DnDProvider>
  </section>
</template>

<style scoped>
  .ch-heading {
    margin: 0 0 4px;
  }

  .ch-hint {
    max-width: 760px;
    margin: 0 0 12px;
    color: #475569;
  }
</style>
