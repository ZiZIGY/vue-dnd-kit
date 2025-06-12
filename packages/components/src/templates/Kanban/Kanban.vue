<script setup lang="ts" generic="T extends Record<string, unknown>">
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { columns, groups = ['kanban-columns'] } = defineProps<{
    columns: T[];
    groups?: string[];
  }>();

  const { elementRef } = useDroppable({
    groups,
    data: computed(() => ({
      source: columns,
    })),
    events: {
      onDrop: (store) => {
        if (store.hovered.element.value) DnDOperations.applyTransfer(store);
      },
    },
  });
</script>

<template>
  <ul
    class="vue-dnd-kanban"
    ref="elementRef"
  >
    <slot :columns="columns" />
  </ul>
</template>

<style src="./styles.css" />
