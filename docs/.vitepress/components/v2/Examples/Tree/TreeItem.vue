<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
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

  // ── Node row: draggable within its siblings array ─────────────────────────
  const rowRef = useTemplateRef<HTMLElement>('rowRef');

  const { isDragging, isDragOver: rowPlacement } = makeDraggable(
    rowRef,
    { dragHandle: '.drag-handle' },
    () => [props.index, props.siblings]
  );

  // ── Children container: droppable zone (accepts drops into this folder) ───
  // v-show keeps it in the DOM so makeDroppable registers on mount,
  // but display:none prevents IntersectionObserver from picking it up
  // when collapsed — so hidden zones never receive drops.
  const childrenRef = useTemplateRef<HTMLElement>('childrenRef');

  const { isDragOver: childrenOver } = makeDroppable(
    childrenRef,
    { events: { onDrop: (e) => emit('drop', e) } },
    () => props.node.children
  );
</script>

<template>
  <motion.div
    class="node"
    :class="{ 'node--dragging': isDragging }"
    :initial="{ opacity: 0, x: -6 }"
    :animate="{ opacity: isDragging ? 0 : 1, x: 0 }"
    :transition="{ duration: 0.18 }"
  >
    <!-- Insert-before indicator -->
    <div
      v-if="rowPlacement?.top"
      class="insert-line insert-line--top"
      :style="{ left: `${depth * 1.25 + 2}rem` }"
    />

    <!-- Node row (draggable via dragHandle) -->
    <div
      ref="rowRef"
      class="node-row"
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
      v-if="rowPlacement?.bottom"
      class="insert-line insert-line--bottom"
      :style="{ left: `${depth * 1.25 + 2}rem` }"
    />

    <!-- Children drop zone — always in DOM so makeDroppable registers, hidden via v-show -->
    <div
      ref="childrenRef"
      v-show="isOpen"
      class="children"
      :class="{ 'children--over': childrenOver }"
    >
      <TreeItem
        v-for="(child, i) in node.children"
        :key="child.id"
        :node="child"
        :index="i"
        :siblings="node.children"
        :depth="depth + 1"
        @drop="emit('drop', $event)"
      />
      <div
        v-if="!node.children.length"
        class="empty-hint"
      >
        empty folder
      </div>
    </div>
  </motion.div>
</template>

<style scoped>
  .node {
    position: relative;
    user-select: none;
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
    transition: background 0.1s;
    min-height: 2rem;
  }

  .node-row:hover {
    background: rgba(148, 163, 184, 0.08);
  }

  .drag-handle {
    cursor: grab;
    color: rgba(148, 163, 184, 0.4);
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
    padding: 0 2px;
    touch-action: none;
    transition: color 0.15s;
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

  /* ── Children zone ─────────────────────────────────────── */
  .children {
    margin-left: 1rem;
    padding-left: 0.75rem;
    border-left: 1.5px solid rgba(148, 163, 184, 0.18);
    min-height: 4px;
    transition: border-color 0.15s, background 0.15s;
    border-radius: 0 0 4px 0;
  }

  .children--over {
    border-left-color: rgba(99, 102, 241, 0.6);
    background: rgba(99, 102, 241, 0.05);
    border-radius: 0 4px 4px 0;
  }

  .empty-hint {
    font-size: 0.7rem;
    color: var(--vp-c-text-3);
    font-style: italic;
    padding: 0.25rem 0.5rem;
  }

  /* ── Insertion line indicators ────────────────────────── */
  .insert-line {
    position: absolute;
    right: 0;
    height: 2px;
    background: rgba(99, 102, 241, 0.8);
    pointer-events: none;
    z-index: 10;
    border-radius: 1px;
  }

  .insert-line--top { top: 0; }
  .insert-line--bottom { bottom: 0; }
</style>
