<script setup lang="ts">
  /**
   * TreeItemBuggy — demonstrates the "leaf node drop" bug.
   *
   * BUG: makeDroppable is registered on `childrenRef`, which is conditionally
   * rendered via v-if (only when children exist). For leaf nodes, `childrenRef`
   * is never mounted → IntersectionObserver never fires → zone is never active.
   * Dropping onto a leaf node silently fails.
   */
  import { useTemplateRef } from 'vue';
  import { makeDraggable, makeDroppable } from '../../../packages/core/src/external';
  import type { IDragEvent } from '../../../packages/core/src/external/types';
  import type { TreeNode } from '../types';

  const props = defineProps<{
    node: TreeNode;
    index: number;
    siblings: TreeNode[];
  }>();

  const emit = defineEmits<{ drop: [event: IDragEvent] }>();

  const nodeRef = useTemplateRef<HTMLElement>('nodeRef');
  const childrenRef = useTemplateRef<HTMLElement>('childrenRef');

  makeDraggable(nodeRef as any, { dragHandle: '.tree-handle' }, () => [props.index, props.siblings]);

  // ⚠️ BUG: registered on childrenRef — but for leaf nodes this element
  // is removed from DOM via v-if, so the zone is never registered.
  const { isAllowed } = makeDroppable(
    childrenRef as any,
    { events: { onDrop: (e) => emit('drop', e) } },
    () => [props.node.children]
  );
</script>

<template>
  <div ref="nodeRef" class="buggy-node">
    <div class="buggy-node__header">
      <button class="tree-handle">⠿</button>
      <span class="buggy-label">{{ node.label }}</span>
      <span v-if="!node.children.length" class="leaf-badge">leaf</span>
    </div>

    <!--
      v-if means this element is NEVER in the DOM for leaf nodes.
      makeDroppable on childrenRef → zone is never registered → drops rejected.
    -->
    <div
      v-if="node.children.length"
      ref="childrenRef"
      class="buggy-node__children"
      :class="{ 'buggy-node__children--allowed': isAllowed }"
    >
      <TreeItemBuggy
        v-for="(child, i) in node.children"
        :key="child.id"
        :node="child"
        :index="i"
        :siblings="node.children"
        @drop="$emit('drop', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  .buggy-node {
    user-select: none;
  }

  .buggy-node__header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.5rem;
    border-radius: 6px;
    transition: background 0.1s;
  }
  .buggy-node__header:hover {
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
  }

  .buggy-label {
    font-size: 0.875rem;
    color: #111827;
  }

  .leaf-badge {
    font-size: 0.65rem;
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
    border-radius: 4px;
    padding: 0 4px;
    margin-left: auto;
  }

  .buggy-node__children {
    margin-left: 1.5rem;
    padding-left: 0.75rem;
    border-left: 2px solid #e5e7eb;
    min-height: 8px;
    transition: border-color 0.15s;
  }
  .buggy-node__children--allowed {
    border-color: #3b82f6;
    background: #eff6ff;
    border-radius: 0 0 4px 4px;
  }
</style>
