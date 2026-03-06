<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import DualNode from './DualNode.vue';
  import RootZone from './RootZone.vue';
  import type { TreeNode } from './DualNode.vue';

  // ── Tree data ──────────────────────────────────────────────────────────────
  const makeTree = (): TreeNode[] => [
    {
      id: 'n1',
      label: 'Frontend',
      children: [
        {
          id: 'n1-1',
          label: 'components',
          children: [
            { id: 'n1-1-1', label: 'Button.vue', children: [] },
            { id: 'n1-1-2', label: 'Input.vue', children: [] },
          ],
        },
        { id: 'n1-2', label: 'App.vue', children: [] },
        { id: 'n1-3', label: 'main.ts', children: [] },
      ],
    },
    {
      id: 'n2',
      label: 'Backend',
      children: [
        { id: 'n2-1', label: 'routes.ts', children: [] },
        { id: 'n2-2', label: 'db.ts', children: [] },
      ],
    },
    { id: 'n3', label: 'package.json', children: [] },
    { id: 'n4', label: 'README.md', children: [] },
  ];

  const tree = ref<TreeNode[]>(makeTree());

  // ── Tree mutation helpers ──────────────────────────────────────────────────
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

  // ── Drop handler ───────────────────────────────────────────────────────────
  // Dual-role nodes activate differently by pointer position:
  //   Edge zone  → hoveredDraggable.items = sibling array  (sort)
  //   Center zone → dropZone.items = node.children         (nest)
  function handleDrop(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;

    const srcArr = e.draggedItems[0]?.items as TreeNode[] | undefined;
    const tgtArr = (e.hoveredDraggable?.items ?? e.dropZone?.items) as
      | TreeNode[]
      | undefined;
    if (!srcArr || !tgtArr) return;

    applyToTree(srcArr, r.sourceItems as TreeNode[]);
    if (!r.sameList) {
      applyToTree(tgtArr, r.targetItems as TreeNode[]);
    }
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="header">
        <span class="title">Project tree</span>
        <button
          class="reset-btn"
          @click="tree = makeTree()"
        >Reset</button>
      </div>

      <div class="hint">
        Drag via <strong>⠿</strong> handle ·
        hover <strong>edges</strong> to sort ·
        hover <strong>center</strong> to nest inside a folder
      </div>

      <RootZone
        :items="tree"
        @drop="handleDrop"
      >
        <DualNode
          v-for="(node, i) in tree"
          :key="node.id"
          :node="node"
          :index="i"
          :siblings="tree"
          @drop="handleDrop"
        />
      </RootZone>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  .hint {
    font-size: 0.72rem;
    color: var(--vp-c-text-3);
    margin-bottom: 0.75rem;
  }

  .reset-btn {
    font-size: 0.65rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(148, 163, 184, 0.08);
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: background 0.15s;
  }

  .reset-btn:hover {
    background: rgba(148, 163, 184, 0.16);
    color: var(--vp-c-text-1);
  }
</style>
