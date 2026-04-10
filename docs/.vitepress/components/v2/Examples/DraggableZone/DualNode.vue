<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeDraggable, makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';

  export interface TreeNode {
    id: string;
    label: string;
    children: TreeNode[];
  }

  const props = defineProps<{
    node: TreeNode;
    index: number;
    siblings: TreeNode[];
    depth?: number;
  }>();

  const emit = defineEmits<{ (e: 'drop', event: IDragEvent): void }>();

  const isOpen = ref(true);
  const depth = props.depth ?? 0;

  // ── Dual-role row ─────────────────────────────────────────────────────────
  // The same element is registered with BOTH makeDraggable and makeDroppable.
  // placementMargins splits the row into three zones:
  //   top 12px    → placement.top  (sort: insert before)
  //   bottom 12px → placement.bottom (sort: insert after)
  //   center      → isOver becomes true (nest: drop into node.children)
  // hover.ts isDualRole branch ensures only ONE side activates at a time.
  // For edge drops, hover.ts falls back to childrenRef (the parent's children
  // container) as the active droppable so that onDrop fires for sort.
  const rowRef = useTemplateRef<HTMLElement>('rowRef');
  const childrenRef = useTemplateRef<HTMLElement>('childrenRef');

  const { isDragging, isDragOver: placement } = makeDraggable(
    rowRef,
    {
      dragHandle: '.drag-handle',
      placementMargins: { top: 12, bottom: 12 },
    },
    () => [props.index, props.siblings]
  );

  // Center drop → nest into this node's children
  const { isDragOver: isOver } = makeDroppable(
    rowRef,
    { events: { onDrop: (e) => emit('drop', e) } },
    () => props.node.children
  );

  // Children container: always in DOM (v-show) so makeDroppable registers on mount.
  // Acts as the fallback droppable for edge (sort) drops when the pointer is over
  // a child row edge — hover.ts selects this as zones[1] in the isDualRole branch.
  makeDroppable(
    childrenRef,
    { events: { onDrop: (e) => emit('drop', e) } },
    () => props.node.children
  );
</script>

<template>
  <div
    class="node"
    :class="{ 'node--dragging': isDragging }"
  >
    <!-- Insert-before indicator -->
    <div
      v-if="placement?.top"
      class="insert-line insert-line--top"
      :style="{ left: `${depth * 1.25 + 2}rem` }"
    />

    <!-- Dual-role row -->
    <div
      ref="rowRef"
      class="node-row"
      :class="{ 'node-row--nest': isOver }"
      :style="{ paddingLeft: `${depth * 1.25 + 0.5}rem` }"
    >
      <span class="drag-handle">⠿</span>

      <button
        v-if="node.children.length"
        class="toggle"
        @click.stop="isOpen = !isOpen"
      >
        <span :class="['toggle-icon', { 'toggle-icon--open': isOpen }]">▸</span>
      </button>
      <span
        v-else
        class="toggle toggle--leaf"
      />

      <span class="node-icon">
        <template v-if="node.children.length">
          {{ isOpen ? '📂' : '📁' }}
        </template>
        <template v-else>📄</template>
      </span>

      <span class="node-label">{{ node.label }}</span>
    </div>

    <!-- Insert-after indicator -->
    <div
      v-if="placement?.bottom"
      class="insert-line insert-line--bottom"
      :style="{ left: `${depth * 1.25 + 2}rem` }"
    />

    <!-- Children container: v-show keeps it in DOM so makeDroppable is always
         registered. It serves as the fallback droppable zone for sort drops
         when the pointer hovers over a child row's edge (isDualRole edge case). -->
    <div
      ref="childrenRef"
      v-show="isOpen && node.children.length"
      class="children"
    >
      <DualNode
        v-for="(child, i) in node.children"
        :key="child.id"
        :node="child"
        :index="i"
        :siblings="node.children"
        :depth="depth + 1"
        @drop="emit('drop', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  .node {
    position: relative;
  }

  .node-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    padding-right: 0.5rem;
    border-radius: 6px;
    cursor: default;
    transition: background 0.1s, box-shadow 0.15s;
    min-height: 2rem;
  }

  .node-row:hover {
    background: rgba(148, 163, 184, 0.08);
  }

  /* Center hover: nest indicator */
  .node-row--nest {
    background: rgba(99, 102, 241, 0.08);
    box-shadow: inset 0 0 0 1.5px rgba(99, 102, 241, 0.45);
  }

  .drag-handle {
    cursor: grab;
    color: rgba(148, 163, 184, 0.4);
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
    padding: 0 2px;
    transition: color 0.15s;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .node-row:hover .drag-handle {
    color: rgba(148, 163, 184, 0.8);
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .toggle {
    background: none;
    border: none;
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
    color: rgba(148, 163, 184, 0.6);
    border-radius: 3px;
    transition: background 0.1s;
  }

  .toggle:hover {
    background: rgba(148, 163, 184, 0.12);
    color: var(--vp-c-text-1);
  }

  .toggle--leaf {
    cursor: default;
    pointer-events: none;
  }

  .toggle-icon {
    font-size: 0.65rem;
    display: inline-block;
    transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toggle-icon--open {
    transform: rotate(90deg);
  }

  .node-icon {
    font-size: 0.9rem;
    flex-shrink: 0;
    line-height: 1;
  }

  .node-label {
    font-size: 0.82rem;
    color: var(--vp-c-text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .node--dragging > .node-row {
    opacity: 0;
  }

  /* ── Children ──────────────────────────────────────────────────────────── */
  .children {
    margin-left: 1rem;
    padding-left: 0.75rem;
    border-left: 1.5px solid rgba(148, 163, 184, 0.18);
    border-radius: 0 0 4px 0;
  }

  /* ── Insert lines ──────────────────────────────────────────────────────── */
  .insert-line {
    position: absolute;
    right: 0;
    height: 2px;
    background: rgba(99, 102, 241, 0.8);
    pointer-events: none;
    z-index: 10;
    border-radius: 1px;
  }

  .insert-line--top {
    top: 0;
  }
  .insert-line--bottom {
    bottom: 0;
  }
</style>
