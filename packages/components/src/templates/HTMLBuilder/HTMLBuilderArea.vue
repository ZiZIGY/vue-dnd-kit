<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';
  import type { IHTMLBuilderElement } from './types';
  import { computed } from 'vue';
  import HTMLBuilderDraggable from './HTMLBuilderDraggable.vue';
  import { handleDropArea } from './utils';

  const { components } = defineProps<{
    components: IHTMLBuilderElement[];
  }>();

  const { elementRef } = useDroppable({
    data: computed(() => ({
      source: components,
    })),
    groups: ['components'],
    events: {
      onDrop: (store, payload) => {
        handleDropArea(store, payload, components);
      },
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="html-builder-area-container"
  >
    <div class="html-builder-area-header">
      <span class="html-builder-area-title">Canvas</span>
    </div>
    <div class="html-builder-area-content">
      <template
        v-for="(component, index) in components"
        :key="`component-${component.id}`"
      >
        <HTMLBuilderDraggable
          v-show="component.visible"
          :component="component"
          :source="components"
          :index="index"
        />
      </template>
    </div>
    <div
      v-if="!components.length"
      class="html-builder-area-empty"
    >
      <div class="html-builder-area-placeholder"> Drag components here </div>
    </div>
  </div>
</template>
