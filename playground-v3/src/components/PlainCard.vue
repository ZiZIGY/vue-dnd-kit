<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ id: string; selected: boolean }>();
  const emit = defineEmits<{ toggle: [] }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeDraggable(el, { id: () => props.id });

  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) emit('toggle');
  };
</script>

<template>
  <div
    ref="el"
    class="card small"
    :class="{ selected }"
    :data-id="id"
    @click="onClick"
  >
    {{ id }}
  </div>
</template>
