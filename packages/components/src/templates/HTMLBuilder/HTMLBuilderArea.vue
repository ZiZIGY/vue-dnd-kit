<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';
  import type { IHTMLBuilderElement } from './types';
  import { computed } from 'vue';
  import HTMLBuilderDraggable from './HTMLBuilderDraggable.vue';
  import { handleDropArea, useHTMLBuilderStore } from './utils';
  import { onKeyStroke } from '@vueuse/core';

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

  onKeyStroke(
    'Escape',
    (e) => {
      e.preventDefault();
      builderStore.activeElement.value = null;
    },
    {
      dedupe: true,
    }
  );

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <div
    ref="elementRef"
    class="html-builder-area-container"
  >
    <div class="html-builder-area-header">
      <span class="html-builder-area-title">Canvas</span>
    </div>
    <div
      class="html-builder-area-content"
      @pointerdown.self="builderStore.activeElement.value = null"
    >
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
      <div class="html-builder-area-placeholder">
        <div>Drag components here</div>
        <div class="html-builder-tips">
          <div class="tip"><strong>Shift</strong> - to move elements</div>
          <div class="tip">Moving items in tree changes structure</div>
          <div class="tip"
            ><strong>Ctrl</strong> - swap elements instead of transfer</div
          >
          <div class="tip"
            ><strong>Escape</strong> - cancels selected element</div
          >
          <div class="tip">Click on a tree item to select it</div>
        </div>
      </div>
    </div>
  </div>
</template>
