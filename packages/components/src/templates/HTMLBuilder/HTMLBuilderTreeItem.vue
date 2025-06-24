<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { computed, ref } from 'vue';
  import { IHTMLBuilderElement } from './types';
  import HTMLBuilderTree from './HTMLBuilderTree.vue';
  import { useHTMLBuilderStore } from './utils';

  const props = defineProps<{
    source: IHTMLBuilderElement[];
    index: number;
    component: IHTMLBuilderElement;
  }>();

  const isExpanded = ref(true);
  const builderStore = useHTMLBuilderStore();

  const hasChildren = computed(() => {
    return (
      props.component.children &&
      Array.isArray(props.component.children) &&
      props.component.children.length > 0
    );
  });

  const isActive = computed(() => {
    return builderStore.activeElement.value?.id === props.component.id;
  });

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
  };

  const selectElement = () => {
    builderStore.activeElement.value = props.component;
  };

  const { elementRef, handleDragStart } = useDraggable({
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
    class="tree-item"
    :class="{ active: isActive }"
    @click.stop="selectElement"
  >
    <div class="tree-item-content">
      <button
        v-if="hasChildren"
        class="tree-toggle-button"
        @click.stop="toggleExpand"
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

      <div
        class="tree-item-label"
        @pointerdown.stop="handleDragStart"
      >
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
      </div>
    </div>

    <div
      v-if="hasChildren && isExpanded"
      class="tree-children-container"
    >
      <div class="tree-children-line"></div>
      <div class="tree-children-content">
        <HTMLBuilderTree
          v-if="component.children"
          :components="component.children"
        />
      </div>
    </div>
  </div>
</template>
