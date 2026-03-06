<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import type { Block } from './BlockItem.vue';

  defineOptions({ inheritAttrs: false });

  const props = defineProps<{
    items: Block[];
  }>();

  const emit = defineEmits<{
    (e: 'drop', event: IDragEvent): void;
  }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  makeDroppable(
    zoneRef,
    {
      events: {
        onDrop(e) {
          emit('drop', e);
        },
      },
    },
    () => props.items
  );
</script>

<template>
  <div
    ref="zoneRef"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

