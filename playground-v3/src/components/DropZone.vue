<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, type Key } from '@vue-dnd-kit/core';

  const props = defineProps<{ zoneId: string }>();
  const emit = defineEmits<{ drop: [id: Key] }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { isOver } = makeDroppable(el, {
    id: () => props.zoneId,
    onDrop: (event) => emit('drop', event.active.id),
  });
</script>

<template>
  <div
    ref="el"
    class="zone"
    :class="{ over: isOver }"
  >
    <slot>{{ zoneId }}</slot>
  </div>
</template>
