<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import FreeBoard from '../components/FreeBoard.vue';

  // Own provider: the keys are provider-wide (the snapping is the board's drag area).
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
    <DnDProvider :keyboard="keyboard">
      <FreeBoard />
    </DnDProvider>
  </section>
</template>
