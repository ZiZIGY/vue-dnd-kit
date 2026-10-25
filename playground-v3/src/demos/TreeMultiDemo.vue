<script setup lang="ts">
  import { computed, ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
  import TreeRow from '../components/TreeRow.vue';
  import FileList from '../components/FileList.vue';
  import { createFileTree, serializeTree, type FileNode } from '../fileTree';

  const INDENTATION = 24;
  const GROUP = 'multi-files';

  const tree = ref<FileNode[]>(createFileTree());
  const collapsed = ref(new Set<Key>());
  const clipboard = ref<FileNode[]>([{ id: 'notes', name: 'notes.txt', type: 'file' }]);
  const lastDrop = shallowRef('');

  const rootRef = useTemplateRef<HTMLElement>('root');
  const { items, projected } = makeSortableTree(rootRef, {
    id: 'multi-tree',
    items: tree,
    group: GROUP,
    indentation: INDENTATION,
    // The deepest descendant of the whole selection counts.
    maxDepth: 2,
    collapsed,
    // Only folders take children, and docs/ only Markdown: every selected node must fit.
    canNest: (node, parent) => parent.type === 'folder' && (parent.id !== 'docs' || node.name.endsWith('.md')),
    onDrop: (event) => {
      const place = (parentKey: Key | null, index: number) => `${parentKey ?? 'root'}[${index}]`;
      lastDrop.value = `${event.keys.join('+')} -> ${place(event.to.parentKey, event.to.index)}`;
    },
  });

  const toggle = (key: Key) => {
    if (collapsed.value.has(key)) collapsed.value.delete(key);
    else collapsed.value.add(key);
  };

  const structure = computed(() => serializeTree(tree.value));
</script>

<template>
  <section>
    <h2>Tree multi-drag</h2>
    <p class="hint">
      Ctrl/Cmd+click to select several nodes. They travel as one block, each with its subtree, and land side by side at
      one level, in document order. A node inside another selected one rides along in its subtree. Max depth 2 counts
      the deepest descendant of the block; docs/ takes only Markdown files.
    </p>
    <div class="layout">
      <div>
        <h3>Clipboard</h3>
        <FileList
          v-model="clipboard"
          list-id="multi-clipboard"
          :group="GROUP"
          class="clipboard"
          data-testid="clipboard-list"
        />
      </div>
      <div>
        <h3>Files</h3>
        <div
          ref="root"
          class="tree"
          data-testid="tree-root"
        >
          <TreeRow
            v-for="node in items"
            :key="node.key"
            :node="node"
            :indentation="INDENTATION"
            selectable
            @toggle="toggle"
          />
        </div>
      </div>
    </div>
    <pre data-testid="tree">{{ structure }}</pre>
    <pre data-testid="clipboard">{{ serializeTree(clipboard) }}</pre>
    <pre data-testid="projected">{{ projected ? `${projected.depth}:${projected.parentKey ?? 'root'}` : '' }}</pre>
    <pre data-testid="drop">{{ lastDrop }}</pre>
  </section>
</template>

<style scoped>
  .layout {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .layout h3 {
    margin: 0 0 8px;
  }

  .clipboard {
    width: 200px;
  }

  .tree {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 360px;
    padding: 8px;
    background: #e5e7eb;
    border-radius: 8px;
  }

  .hint {
    max-width: 560px;
    color: #4b5563;
  }
</style>
