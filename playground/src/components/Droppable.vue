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
      /** Optional: return false or Promise<false> to decline drop and keep drag active; reject() to cancel with events */
      onDrop?: (event: IDragEvent) => void | boolean | Promise<void | boolean>;
    }>(),
    { orientation: 'vertical' }
  );

  const emit = defineEmits<{
    (e: 'drop' | 'enter' | 'leave', event: IDragEvent): void;
  }>();

  const node = useTemplateRef<HTMLElement>('droppableRef');

  const { state } = useDnDProvider();

  const { style } = makeSelectionArea(node as any);

  const { isAllowed } = makeDroppable(
    node as any,
    {
      events: {
        onEnter(e) {
          emit('enter', e);
        },
        async onDrop(e) {
          const result = props.onDrop?.(e);
          emit('drop', e);
          return result;
        },
        onLeave(e) {
          emit('leave', e);
        },
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
