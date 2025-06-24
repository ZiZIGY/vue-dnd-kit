<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { CSSProperties } from 'vue';

  const props = defineProps<{
    tag: keyof HTMLElementTagNameMap;
    children?: any[];
    style?: CSSProperties;
  }>();

  const { elementRef, handleDragStart } = useDraggable({
    groups: ['components', 'tree'],
    data: {
      type: 'created',
      tag: props.tag,
      children: props.children,
      style: props.style,
      visible: true,
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown="handleDragStart"
  >
    <slot />
  </div>
</template>
