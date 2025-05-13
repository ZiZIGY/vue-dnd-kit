<script setup lang="ts">
  import { computed, CSSProperties } from 'vue';
  import { useDragContainer } from '../composables/useDragContainer';

  const { elementRef, pointerPosition, isDragging, draggingElements } =
    useDragContainer();

  const { styles } = defineProps<{
    styles?: CSSProperties;
  }>();

  const computedStyle = computed<CSSProperties>(() => ({
    transform: `translate3d(${
      (pointerPosition.current.value?.x ?? 0) -
      (pointerPosition.offset.pixel.value?.x ?? 0)
    }px, ${
      (pointerPosition.current.value?.y ?? 0) -
      (pointerPosition.offset.pixel.value?.y ?? 0)
    }px, 0)`,
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
    ...styles,
  }));
</script>

<template>
  <div
    v-if="isDragging"
    ref="elementRef"
    :style="computedStyle"
  >
    <template
      v-for="[node, element] in draggingElements"
      :key="element.id"
    >
      <component
        v-if="element.layer"
        :is="element.layer"
        :node="node"
        :data="element.data"
        :id="element.id"
        :groups="element.groups"
      />
      <div
        v-else
        v-html="element.initialHTML"
        :style="{
          width: `${element.initialRect?.width}px`,
          height: `${element.initialRect?.height}px`,
        }"
      />
    </template>
  </div>
</template>
