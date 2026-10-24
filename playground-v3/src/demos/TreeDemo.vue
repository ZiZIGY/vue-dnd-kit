<script setup lang="ts">
  import { computed, ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableList, makeSortableTree, type Key, type TreeNesting } from '@vue-dnd-kit/core';
  import TreeRow from '../components/TreeRow.vue';
  import FileListRow from '../components/FileListRow.vue';
  import { createFileTree, serializeTree, type FileNode } from '../fileTree';

  const INDENTATION = 24;
  // The tree and the clipboard list exchange nodes.
  const GROUP = 'files';

  const tree = ref<FileNode[]>(createFileTree());
  const collapsed = ref(new Set<Key>(['docs']));
  const clipboard = ref<FileNode[]>([{ id: 'notes', name: 'notes.txt', type: 'file' }]);
  const lastDrop = shallowRef('');
  const nesting = shallowRef<TreeNesting>('both');
  const rejectDrops = shallowRef(false);

  const rootRef = useTemplateRef<HTMLElement>('root');
  const { items, projected } = makeSortableTree(rootRef, {
    id: 'tree',
    items: tree,
    group: GROUP,
    indentation: INDENTATION,
    // Options are read on every move, so a getter switches the mode live.
    get nesting() {
      return nesting.value;
    },
    maxDepth: 2,
    collapsed,
    // Files can't contain anything.
    canNest: (_node, parent) => parent.type === 'folder',
    onBeforeDrop: () => !rejectDrops.value,
    onDrop: (event) => {
      const place = (parentKey: Key | null, index: number) => `${parentKey ?? 'root'}[${index}]`;
      lastDrop.value = `${event.keys[0]} ${event.from.list}:${place(event.from.parentKey, event.from.index)} -> ${place(event.to.parentKey, event.to.index)}`;
    },
  });

  const clipboardRef = useTemplateRef<HTMLElement>('clipboard');
  const { items: clipboardItems } = makeSortableList(clipboardRef, {
    id: 'clipboard',
    items: clipboard,
    group: GROUP,
  });

  const toggle = (key: Key) => {
    if (collapsed.value.has(key)) collapsed.value.delete(key);
    else collapsed.value.add(key);
  };

  const structure = computed(() => serializeTree(tree.value));
</script>

<template>
  <section>
    <h2>Tree</h2>
    <p class="hint">
      Drag sideways to change the level, or hover the middle of a folder to drop into it. Max depth 2; files take no
      children. Nodes move to and from the clipboard with their subtree.
    </p>
    <div class="options">
      <label
        v-for="mode in ['both', 'offset', 'hover'] as const"
        :key="mode"
      >
        <input
          v-model="nesting"
          type="radio"
          name="nesting"
          :value="mode"
          :data-testid="`nesting-${mode}`"
        />
        {{ mode }}
      </label>
      <label>
        <input
          v-model="rejectDrops"
          type="checkbox"
          data-testid="reject"
        />
        reject drops (onBeforeDrop → false)
      </label>
    </div>
    <div class="layout">
      <div>
        <h3>Clipboard</h3>
        <ul
          ref="clipboard"
          class="list clipboard"
          data-testid="clipboard-list"
        >
          <FileListRow
            v-for="file in clipboardItems"
            :key="file.id"
            :file="file"
          />
        </ul>
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

  .options {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
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
