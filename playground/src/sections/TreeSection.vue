<script setup lang="ts">
  /**
   * TreeSection — recursive tree with sort and swap.
   *
   * Key insight: hoveredDraggable.items tells us WHICH sibling array the hovered
   * node lives in. dropZone.items tells us which children zone received the drop.
   * These can differ: hovering near a node edge → parent's children array;
   * hovering inside the node's children zone → that node's children array.
   *
   * A single handleDrop + applyToTree covers all nesting levels.
   */
  import { ref } from 'vue';
  import type { IDragEvent } from '../../../packages/core/src/external/types';
  import type { TreeNode } from '../types';
  import Droppable from '../components/Droppable.vue';
  import TreeItem from '../components/TreeItem.vue';

  const mode = ref<'sort' | 'swap'>('sort');

  const tree = ref<TreeNode[]>([
    {
      id: 't1',
      label: 'Frontend',
      children: [
        {
          id: 't1-1',
          label: 'Components',
          children: [
            { id: 't1-1-1', label: 'Button.vue', children: [] },
            { id: 't1-1-2', label: 'Input.vue', children: [] },
          ],
        },
        {
          id: 't1-2',
          label: 'Views',
          children: [{ id: 't1-2-1', label: 'Home.vue', children: [] }],
        },
      ],
    },
    {
      id: 't2',
      label: 'Backend',
      children: [
        { id: 't2-1', label: 'routes.ts', children: [] },
        { id: 't2-2', label: 'db.ts', children: [] },
      ],
    },
    { id: 't3', label: 'README.md', children: [] },
  ]);

  // ── Apply new array back to the correct node in the tree ─────────────────────
  function applyToTree(oldArr: TreeNode[], newArr: TreeNode[]) {
    if (oldArr === tree.value) {
      tree.value = newArr;
    } else {
      findAndReplace(tree.value, oldArr, newArr);
    }
  }

  function findAndReplace(
    nodes: TreeNode[],
    oldArr: TreeNode[],
    newArr: TreeNode[]
  ): boolean {
    for (const node of nodes) {
      if (node.children === oldArr) {
        node.children = newArr;
        return true;
      }
      if (findAndReplace(node.children, oldArr, newArr)) return true;
    }
    return false;
  }

  // ── Single drop handler for ALL levels ───────────────────────────────────────
  // The event carries: draggedItems[0].items = source sibling array
  //                    hoveredDraggable?.items = target sibling array (nearest element)
  //                    dropZone?.items = target children zone array
  function handleDrop(e: IDragEvent) {
    if (mode.value === 'swap') {
      handleSwap(e);
    } else {
      handleSort(e);
    }
  }

  function handleSort(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;

    const srcArr = e.draggedItems[0]?.items as TreeNode[];
    const tgtArr = (e.hoveredDraggable?.items ??
      e.dropZone?.items) as TreeNode[];
    if (!srcArr || !tgtArr) return;

    applyToTree(srcArr, r.sourceItems as TreeNode[]);
    if (!r.sameList) {
      applyToTree(tgtArr, r.targetItems as TreeNode[]);
    }
  }

  function handleSwap(e: IDragEvent) {
    if (!e.hoveredDraggable) return;

    const r = e.helpers.suggestSwap();
    if (!r) return;

    const srcArr = e.draggedItems[0]?.items as TreeNode[];
    const tgtArr = e.hoveredDraggable.items as TreeNode[];

    applyToTree(srcArr, r.sourceItems as TreeNode[]);
    if (!r.sameList) {
      applyToTree(tgtArr, r.targetItems as TreeNode[]);
    }
  }
</script>

<template>
  <div>
    <div class="tree-controls">
      <p class="hint">
        Drag nodes to <b>sort</b> within a level or <b>move between levels</b>.
        Drop inside an expanded node's children zone to nest.
      </p>
      <div class="mode-toggle">
        <button
          :class="{ active: mode === 'sort' }"
          @click="mode = 'sort'"
        >
          Sort / Transfer
        </button>
        <button
          :class="{ active: mode === 'swap' }"
          @click="mode = 'swap'"
        >
          Swap
        </button>
      </div>
    </div>

    <!--
      Root Droppable: handles drops at the root level.
      Its items = tree.value (the root siblings array).
    -->
    <Droppable
      :items="tree"
      @drop="handleDrop"
    >
      <div class="tree-root">
        <TreeItem
          v-for="(node, i) in tree"
          :key="node.id"
          :node="node"
          :index="i"
          :siblings="tree"
          @drop="handleDrop"
        />
      </div>
    </Droppable>
  </div>
</template>

<style scoped>
  .tree-controls {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .mode-toggle {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
  }
  .mode-toggle button {
    padding: 0.3rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    font-size: 0.8rem;
    color: #374151;
    transition: all 0.15s;
  }
  .mode-toggle button.active {
    background: #3b82f6;
    color: #fff;
    border-color: #3b82f6;
  }

  .tree-root {
    padding: 0.5rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    min-height: 80px;
  }
</style>
