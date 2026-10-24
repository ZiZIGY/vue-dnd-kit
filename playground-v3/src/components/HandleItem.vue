<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ itemId: string }>();
  const el = useTemplateRef<HTMLElement>('el');
  const handle = useTemplateRef<HTMLElement>('handle');
  makeDraggable(el, { id: () => props.itemId, handle });
</script>

<template>
  <div
    ref="el"
    class="chip"
    :data-id="itemId"
  >
    <span
      ref="handle"
      data-testid="grip"
      aria-label="Drag handle"
      >⠿</span
    >
    With handle
  </div>
</template>
