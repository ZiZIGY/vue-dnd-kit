<script setup lang="ts">
  import { useDnDStore, useDraggable } from '@vue-dnd-kit/core';
  import type { IHTMLBuilderElement } from './types';
  import { computed, onMounted } from 'vue';
  import { useHTMLBuilderStore } from './utils';
  import HTMLBuilderDroppable from './HTMLBuilderDroppable.vue';

  const { source, index, component } = defineProps<{
    component: IHTMLBuilderElement;
    source: IHTMLBuilderElement[];
    index: number;
  }>();

  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    groups: ['components'],
    data: computed(() => ({
      source,
      index,
    })),
    events: {
      onStart: () => document.getSelection()?.removeAllRanges(),
    },
  });

  const store = useDnDStore();

  const builderStore = useHTMLBuilderStore();

  const handleFocus = () => (builderStore.activeElement.value = component);

  onMounted(() => {
    if (builderStore.autoFocus.value) {
      elementRef.value?.focus();
      handleFocus();
    }
  });
</script>

<template>
  <component
    :is="component.tag"
    ref="elementRef"
    :style="component.style"
    @pointerdown.stop="(event: PointerEvent) => store.keyboard.shift.value && handleDragStart(event)"
    @focus="handleFocus"
    tabindex="-1"
    class="html-builder-draggable"
    :class="{ 'is-dragging': isDragging, 'is-overed': isOvered }"
  >
    <HTMLBuilderDroppable
      v-if="component.children"
      :source="component.children"
      class="html-builder-droppable"
    >
      <HTMLBuilderDraggable
        v-for="(child, childIndex) in component.children"
        :key="`component-${child.id}-${childIndex}`"
        :component="child"
        :source="component.children"
        :index="childIndex"
      />
    </HTMLBuilderDroppable>
  </component>
</template>
