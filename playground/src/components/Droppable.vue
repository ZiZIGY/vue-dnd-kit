<script setup lang="ts" generic="T">
  import {
    makeDroppable,
    makeSelectionArea,
    useDnDProvider,
  } from '../../../packages/core/src/external';
  import type { IDragEvent } from '../../../packages/core/src/external/types';
  import { useTemplateRef } from 'vue';

  const props = withDefaults(
    defineProps<{
      items: T[];
      orientation?: 'vertical' | 'horizontal';
      /** Optional: when provided, return value (e.g. Promise) is passed to core for async/confirm flows */
      onDrop?: (event: IDragEvent) => void | Promise<void>;
    }>(),
    { orientation: 'vertical' }
  );

  const emit = defineEmits<{
    drop: [event: IDragEvent];
  }>();

  const node = useTemplateRef<HTMLElement>('droppableRef');

  const { state } = useDnDProvider();

  const { style } = makeSelectionArea(node as any);

  const { isAllowed } = makeDroppable(
    node as any,
    {
      events: {
        onEnter() {},
        async onDrop(e) {
          const result = props.onDrop?.(e);
          emit('drop', e);
          return result;
        },
        onLeave() {},
      },
    },
    () => [props.items]
  );
</script>

<template>
  <div
    ref="droppableRef"
    class="droppable"
    :class="{
      'is-allowed': isAllowed && state === 'dragging',
      'is-not-allowed': !isAllowed && state === 'dragging',
    }"
  >
    <slot />
    <div :style="style"></div>
  </div>
</template>

<style scoped>
  .droppable {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    position: relative;
    transition: border-color 0.3s ease;
  }
  .droppable.is-allowed {
    border-color: green;
  }
  .droppable.is-not-allowed {
    border-color: red;
  }
</style>
