<script setup lang="ts">
  /** The providers' registry as a tree (`lib/tree.ts`), filtered by label; a node chosen shows in details. */
  import { computed, reactive, ref } from 'vue';
  import { select, send, store } from '../lib/connection';
  import { buildTree, sameNode, type TreeNode } from '../lib/tree';

  const filter = ref('');
  /** Nodes folded by the user (all open by default). */
  const folded = reactive(new Set<string>());
  const roots = computed(() => buildTree(store.providers, filter.value));

  /** The visible rows, with their depth. */
  const rows = computed(() => {
    const result: Array<{ node: TreeNode; depth: number }> = [];
    const walk = (nodes: TreeNode[], depth: number) => {
      for (const node of nodes) {
        result.push({ node, depth });
        if (node.children && !folded.has(node.key)) walk(node.children, depth + 1);
      }
    };
    walk(roots.value, 0);
    return result;
  });

  const toggle = (key: string) => (folded.has(key) ? folded.delete(key) : folded.add(key));
</script>

<template>
  <div class="tree">
    <input v-model="filter" class="filter" placeholder="Filter by id" />
    <div class="rows" role="tree" data-testid="tree">
      <p v-if="!rows.length" class="empty">{{ store.ready ? 'No provider.' : 'Waiting for the page…' }}</p>
      <div
        v-for="{ node, depth } in rows"
        :key="node.key"
        class="row"
        role="treeitem"
        :class="{ active: sameNode(node.node, store.selected), group: !node.node }"
        :style="{ paddingLeft: `${4 + depth * 12}px` }"
        :data-label="node.label"
        @click="node.node ? select(node.node) : toggle(node.key)"
        @dblclick="node.node && send({ type: 'reveal', node: node.node })"
      >
        <button v-if="node.children" class="fold" @click.stop="toggle(node.key)">{{ folded.has(node.key) ? '▸' : '▾' }}</button>
        <span v-else class="fold" />
        <span class="label">{{ node.label }}</span>
        <span v-for="chip in node.chips" :key="chip.label" class="chip" :class="chip.color" :title="chip.title">{{ chip.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .tree {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .filter {
    margin: 6px;
  }

  .rows {
    flex: 1;
    overflow: auto;
    padding-bottom: 8px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 22px;
    padding-right: 6px;
    cursor: pointer;
    white-space: nowrap;
  }

  .row:hover {
    background: var(--bg-mute);
  }

  .row.active {
    background: var(--accent-soft);
  }

  .row.group .label {
    color: var(--text-soft);
  }

  .fold {
    width: 12px;
    flex: none;
    border: 0;
    padding: 0;
    background: none;
    color: var(--text-mute);
  }

  /* Whole: a long row scrolls the tree sideways. */
  .label {
    flex: none;
  }

  .chip {
    flex: none;
  }
</style>
