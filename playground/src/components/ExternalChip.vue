<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ chip: { id: string; title: string; type?: string } }>();
  const el = useTemplateRef<HTMLElement>('el');
  // A plain draggable: not part of any list.
  makeDraggable(el, { id: () => props.chip.id, data: () => props.chip, type: () => props.chip.type });
</script>

<template>
  <span
    ref="el"
    class="ext-chip"
    :data-id="chip.id"
  >
    {{ chip.title }}
  </span>
</template>
