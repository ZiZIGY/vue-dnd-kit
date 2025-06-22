<script setup lang="ts" generic="T">
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const { groups = ['sortable'], data } = defineProps<{
    groups?: string[];
    data: T[];
    placeholder?: string;
  }>();

  const { elementRef } = useDroppable({
    groups,
    data: computed(() => ({
      data,
    })),
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <ul
    ref="elementRef"
    class="vue-dnd-sortable"
  >
    <slot />
  </ul>
</template>

<style src="./styles.css" />
