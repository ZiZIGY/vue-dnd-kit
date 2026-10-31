<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const el = useTemplateRef<HTMLElement>('el');
  const { isOver } = makeDroppable(el, { id: 'zone' });
</script>

<template>
  <div
    ref="el"
    class="drop-target"
    data-testid="zone"
    :data-over="isOver || undefined"
  >
    Zone
  </div>
</template>
