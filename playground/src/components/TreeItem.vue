<script setup lang="ts">
  /**
   * TreeItem — recursive tree node.
   *
   * Each node is:
   *  • A DRAGGABLE within its siblings array (for sorting/moving within a level).
   *  • Its children container is a DROPPABLE zone (for dropping INTO this node).
   *
   * This separation means:
   *  - Hover near a node → insert before/after in its parent (hoveredDraggable.items = siblings)
   *  - Hover inside children zone → insert into this node's children (dropZone.items = node.children)
   */
  import { ref, computed, useTemplateRef } from 'vue';
  import { makeDraggable, makeDroppable } from '../../../packages/core/src/external';
  import type { IDragEvent } from '../../../packages/core/src/external/types';
  import type { TreeNode } from '../types';

  const props = defineProps<{
    node: TreeNode;
    index: number;
    /** The array this node lives in (used as draggable payload). */
    siblings: TreeNode[];
  }>();

  const emit = defineEmits<{ drop: [event: IDragEvent] }>();

  const expanded = ref(true);

  // ── Node element: draggable within siblings ───────────────────────────────
  const nodeRef = useTemplateRef<HTMLElement>('nodeRef');
  const { isDragging, isDragOver } = makeDraggable(
    nodeRef as any,
    { dragHandle: '.tree-handle' },
    () => [props.index, props.siblings],
  );

  // ── Children container: droppable zone for child nodes ────────────────────
  const childrenRef = useTemplateRef<HTMLElement>('childrenRef');
  const { isAllowed: isChildrenAllowed } = makeDroppable(
    childrenRef as any,
    { events: { onDrop: (e) => emit('drop', e) } },
    () => [props.node.children],
  );

  const placement = computed(() => isDragOver.value);
</script>

<template>
  <div
    ref="nodeRef"
    class="tree-node"
    :class="{ 'tree-node--dragging': isDragging }"
  >
    <!-- Before indicator -->
    <div
      v-if="placement?.top"
      class="tree-indicator tree-indicator--top"
    />

    <div class="tree-node__header">
      <button class="tree-handle">⠿</button>
      <button
        v-if="node.children.length"
        class="tree-toggle"
        @click.stop="expanded = !expanded"
      >
        {{ expanded ? '▾' : '▸' }}
      </button>
      <span
        v-else
        class="tree-toggle tree-toggle--leaf"
      >·</span>
      <span class="tree-label">{{ node.label }}</span>
    </div>

    <!-- After indicator -->
    <div
      v-if="placement?.bottom"
      class="tree-indicator tree-indicator--bottom"
    />

    <!-- Children drop zone -->
    <div
      v-show="expanded"
      ref="childrenRef"
      class="tree-node__children"
      :class="{ 'tree-node__children--allowed': isChildrenAllowed }"
    >
      <TreeItem
        v-for="(child, i) in node.children"
        :key="child.id"
        :node="child"
        :index="i"
        :siblings="node.children"
        @drop="$emit('drop', $event)"
      />
      <div
        v-if="!node.children.length"
        class="tree-node__empty"
      >
        Drop here
      </div>
    </div>
  </div>
</template>

<style scoped>
  .tree-node {
    position: relative;
    user-select: none;
  }
  .tree-node--dragging {
    opacity: 0.4;
  }

  .tree-node__header {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.35rem 0.5rem;
    border-radius: 6px;
    cursor: default;
    transition: background 0.1s;
  }
  .tree-node__header:hover {
    background: #f3f4f6;
  }

  .tree-handle {
    cursor: grab;
    background: none;
    border: none;
    padding: 0 4px;
    color: #9ca3af;
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .tree-handle:active {
    cursor: grabbing;
  }

  .tree-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    width: 16px;
    color: #6b7280;
    flex-shrink: 0;
    padding: 0;
  }
  .tree-toggle--leaf {
    cursor: default;
    color: #d1d5db;
  }

  .tree-label {
    font-size: 0.875rem;
    color: #111827;
  }

  .tree-node__children {
    margin-left: 1.5rem;
    padding-left: 0.75rem;
    border-left: 2px solid #e5e7eb;
    min-height: 8px;
    transition: border-color 0.15s;
  }
  .tree-node__children--allowed {
    border-color: #3b82f6;
    background: #eff6ff;
    border-radius: 0 0 4px 4px;
  }

  .tree-node__empty {
    font-size: 0.75rem;
    color: #9ca3af;
    padding: 0.25rem 0.5rem;
    font-style: italic;
  }

  .tree-indicator {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #3b82f6;
    pointer-events: none;
    z-index: 5;
    border-radius: 1px;
  }
  .tree-indicator--top {
    top: 0;
  }
  .tree-indicator--bottom {
    bottom: 0;
  }
</style>
