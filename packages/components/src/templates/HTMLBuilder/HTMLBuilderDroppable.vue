<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';
  import type { IHTMLBuilderElement } from './types';
  import { handleDropArea } from './utils';

  const { source } = defineProps<{
    source: IHTMLBuilderElement['children'];
  }>();

  const { elementRef } = useDroppable({
    groups: ['components'],
    data: computed(() => ({
      source,
    })),
    events: {
      onDrop: (store, payload) => {
        handleDropArea(store, payload, source);
      },
    },
  });
</script>

<template>
  <div ref="elementRef">
    <slot />
  </div>
</template>
