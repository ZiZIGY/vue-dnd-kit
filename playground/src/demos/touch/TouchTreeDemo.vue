<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue';
  import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
  import TouchStatus from './TouchStatus.vue';
  import TouchTreeRow from './TouchTreeRow.vue';
  import { createTouchTree, serializeTouchTree, type TouchNode } from './data';

  /**
   * A tree on a narrow screen. The level follows the horizontal offset of the finger:
   * one indentation step right nests under the folder above, one step left moves out.
   * The step is wide enough for a thumb, and depth is capped so rows stay readable.
   */
  const INDENTATION = 32;

  const tree = ref<TouchNode[]>(createTouchTree());
  const collapsed = ref(new Set<Key>());
  const rootRef = useTemplateRef<HTMLElement>('root');
  const { items, projected } = makeSortableTree(rootRef, {
    id: 'touch-tree',
    items: tree,
    indentation: INDENTATION,
    nesting: 'offset',
    maxDepth: 3,
    collapsed,
    // Notes can't contain anything.
    canNest: (_node, parent) => parent.type === 'folder',
  });

  const toggle = (key: Key) => {
    if (collapsed.value.has(key)) collapsed.value.delete(key);
    else collapsed.value.add(key);
  };

  const structure = computed(() => serializeTouchTree(tree.value));
</script>

<template>
  <section class="touch-demo">
    <h2>Tree</h2>
    <p class="hint">Long-press a row, then slide right to nest it under the folder above or left to move it out.</p>
    <TouchStatus />
    <div
      ref="root"
      class="tree"
      data-testid="touch-tree"
    >
      <TouchTreeRow
        v-for="node in items"
        :key="node.key"
        :node="node"
        :indentation="INDENTATION"
        @toggle="toggle"
      />
    </div>
    <pre
      class="state"
      data-testid="touch-tree-structure"
      >{{ structure }}</pre
    >
    <pre
      class="state"
      data-testid="touch-tree-projected"
      >{{
      projected ? `${projected.depth}:${projected.parentKey ?? 'root'}` : ''
    }}</pre>
  </section>
</template>

<style scoped>
  .touch-demo {
    max-width: 480px;
    margin: 0 auto;
  }

  h2 {
    margin: 0 0 4px;
  }

  .hint {
    margin: 0 0 8px;
    color: #4b5563;
  }

  /* Wrapped: a line wider than the phone would let the whole page pan sideways. */
  .state {
    white-space: pre-wrap;
    word-break: break-all;
  }

  .tree {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px;
    background: #e5e7eb;
    border-radius: 12px;
  }
</style>
