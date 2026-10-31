<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ itemId: string; label: string; disabled?: boolean; noOverlay?: boolean }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeDraggable(el, {
    id: () => props.itemId,
    disabled: () => props.disabled,
    overlay: !props.noOverlay,
  });
</script>

<template>
  <div
    ref="el"
    class="chip"
    :data-id="itemId"
  >
    {{ label }}
  </div>
</template>
