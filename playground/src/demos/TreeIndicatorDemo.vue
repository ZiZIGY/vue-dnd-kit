<script setup lang="ts">
  import { computed, ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableTree, type Key, type TreeNesting } from '@vue-dnd-kit/core';
  import TreeLineRow from '../components/TreeLineRow.vue';
  import FileList from '../components/FileList.vue';
  import { createFileTree, serializeTree, type FileNode } from '../fileTree';

  const INDENTATION = 24;
  // The inbox (a regular list) and the tree exchange nodes.
  const GROUP = 'line-files';

  const tree = ref<FileNode[]>(createFileTree());
  const collapsed = ref(new Set<Key>(['docs']));
  const inbox = ref<FileNode[]>([
    { id: 'notes', name: 'notes.txt', type: 'file' },
    { id: 'todo', name: 'todo.md', type: 'file' },
    { id: 'logo', name: 'logo.svg', type: 'file' },
  ]);
  const lastDrop = shallowRef('');
  const nesting = shallowRef<TreeNesting>('both');

  const rootRef = useTemplateRef<HTMLElement>('root');
  const { items, indicator } = makeSortableTree(rootRef, {
    id: 'line-tree',
    items: tree,
    group: GROUP,
    // The tree stays still; each row draws the line from its `indicator` (TreeLineRow).
    placeholder: 'indicator',
    indentation: INDENTATION,
    // A ref: the radio buttons switch the mode live.
    nesting,
    maxDepth: 2,
    collapsed,
    canNest: (_node, parent) => parent.type === 'folder',
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
  const line = computed(() => {
    const value = indicator.value;
    return value ? `${value.side}:${value.key}:${value.depth}:${value.parentKey ?? 'root'}` : '';
  });
</script>

<template>
  <section>
    <h2>Tree with an indicator line</h2>
    <p class="hint">
      The tree doesn't move: a line shows where the drop goes, starting at the indentation of its level (drag sideways
      to change it). Hovering the middle of a folder highlights it: the drop goes inside. Dropping outside cancels.
      Ctrl/Cmd+click selects several nodes. With the keyboard, Right from the inbox takes the line into the tree.
    </p>
    <div class="options">
      <label
        v-for="mode in ['both', 'offset', 'hover'] as const"
        :key="mode"
      >
        <input
          v-model="nesting"
          type="radio"
          name="line-nesting"
          :value="mode"
          :data-testid="`nesting-${mode}`"
        />
        {{ mode }}
      </label>
    </div>
    <div class="layout">
      <div>
        <h3>Inbox</h3>
        <FileList
          v-model="inbox"
          list-id="inbox"
          :group="GROUP"
          class="inbox"
          data-testid="inbox-list"
        />
      </div>
      <div>
        <h3>Files</h3>
        <div
          ref="root"
          class="tree"
          data-testid="tree-root"
        >
          <TreeLineRow
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
    <pre data-testid="inbox">{{ serializeTree(inbox) }}</pre>
    <pre data-testid="line">{{ line }}</pre>
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

  .inbox {
    width: 200px;
  }

  .tree {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 360px;
    padding: 8px;
    background: var(--ui-bg-muted);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
  }

  .hint {
    max-width: 600px;
    color: var(--ui-text-muted);
  }
</style>
