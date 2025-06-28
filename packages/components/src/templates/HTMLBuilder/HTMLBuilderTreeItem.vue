<script setup lang="ts">
  import { useDnDStore, useDraggable } from '@vue-dnd-kit/core';
  import { computed } from 'vue';
  import { IHTMLBuilderElement } from './types';
  import HTMLBuilderTree from './HTMLBuilderTree.vue';
  import { useHTMLBuilderStore } from './utils';

  const props = defineProps<{
    source: IHTMLBuilderElement[];
    index: number;
    component: IHTMLBuilderElement;
  }>();

  const builderStore = useHTMLBuilderStore();

  const hasChildren = computed(() => {
    return props.component.children && Array.isArray(props.component.children);
  });

  const isActive = computed(() => {
    return builderStore.activeElement.value?.id === props.component.id;
  });

  const isExpanded = defineModel<boolean>('isExpanded');

  const selectElement = () => {
    builderStore.activeElement.value = props.component;
  };

  const deleteElement = () => {
    props.source.splice(props.index, 1);

    if (builderStore.activeElement.value?.id === props.component.id) {
      builderStore.activeElement.value = null;
    }
  };

  const store = useDnDStore();

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    groups: ['tree'],
    data: computed(() => ({
      source: props.source,
      index: props.index,
    })),
  });
</script>

<template>
  <div
    ref="elementRef"
    @pointerdown.stop="
      (event: PointerEvent) => store.keyboard.shift.value && handleDragStart(event)
    "
    class="tree-item"
    :class="{ active: isActive, dragging: isDragging }"
    @click.stop="selectElement"
  >
    <div class="tree-item-content">
      <button
        v-if="hasChildren"
        class="tree-toggle-button"
        @click.stop="isExpanded = !isExpanded"
      >
        <span class="toggle-icon">{{ isExpanded ? '▼' : '►' }}</span>
      </button>
      <span
        v-else
        class="tree-item-spacer"
      ></span>

      <div class="tree-item-icon">
        <span
          v-if="component.tag === 'div'"
          class="icon-box"
          >□</span
        >
        <span
          v-else-if="component.tag === 'p'"
          class="icon-text"
          >¶</span
        >
        <span
          v-else-if="component.tag === 'span'"
          class="icon-span"
          >T</span
        >
        <span
          v-else-if="component.tag === 'img'"
          class="icon-img"
          >🖼</span
        >
        <span
          v-else
          class="icon-default"
          >&lt;/&gt;</span
        >
      </div>

      <div class="tree-item-label">
        <span class="tree-item-tag">{{ component.tag }}</span>
        <span
          v-if="component.id"
          class="tree-item-id"
          >{{ component.id.substring(0, 6) }}</span
        >
      </div>

      <div class="tree-item-actions">
        <button
          class="tree-action-button visibility-toggle"
          @click.stop="component.visible = !component.visible"
          :title="component.visible ? 'Hide element' : 'Show element'"
        >
          <span>{{ component.visible ? '👁️' : '👁️‍🗨️' }}</span>
        </button>
        <button
          class="tree-action-button delete-button"
          @click.stop="deleteElement"
          title="Delete element"
        >
          <span>🗑️</span>
        </button>
      </div>
    </div>

    <div
      v-if="hasChildren && isExpanded"
      class="tree-children-container"
    >
      <div class="tree-children-content">
        <HTMLBuilderTree
          v-if="component.children"
          :components="component.children"
        />
      </div>
    </div>
  </div>
</template>
