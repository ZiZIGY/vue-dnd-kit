<script setup lang="ts">
  import { DnDProvider, snapToGrid } from '@vue-dnd-kit/core';
  import FreeBoard from '../components/FreeBoard.vue';

  // Own provider: modifiers are provider-wide, and nested providers ignore each other.
  const modifiers = [snapToGrid({ x: 20, y: 20, smooth: { duration: 80 } })];
  // G also grabs ("rebinding" example); drop and cancel keep their defaults.
  const keyboard = { keys: { start: ['Space', 'Enter', 'KeyG'] } };
</script>

<template>
  <section>
    <h2>Free drag</h2>
    <p>
      Pieces snap to a 20px grid drawn from the board. Red and Blue use
      <code>keyboard: 'droppables'</code> (arrows jump between accepting zones); Free moves by
      25px per arrow (Shift: 100px); Shift needs Shift held for pointer drags. G also picks up.
    </p>
    <DnDProvider
      :modifiers="modifiers"
      :keyboard="keyboard"
    >
      <FreeBoard />
    </DnDProvider>
  </section>
</template>
