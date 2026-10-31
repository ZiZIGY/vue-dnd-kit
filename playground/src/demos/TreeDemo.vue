<script setup lang="ts">
  import { computed, ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableTree, restrictToVerticalAxis, type Key, type TreeNesting } from '@vue-dnd-kit/core';
  import TreeRow from '../components/TreeRow.vue';
  import FileList from '../components/FileList.vue';
  import FilePalette from '../components/FilePalette.vue';
  import ExternalChip from '../components/ExternalChip.vue';
  import { createFileTree, serializeTree, type FileNode } from '../fileTree';

  const INDENTATION = 24;
  // The tree, the templates and the clipboard list exchange nodes.
  const GROUP = 'files';

  const tree = ref<FileNode[]>(createFileTree());
  const collapsed = ref(new Set<Key>(['docs']));
  const clipboard = ref<FileNode[]>([{ id: 'notes', name: 'notes.txt', type: 'file' }]);
  const templates: FileNode[] = [
    { id: 'tpl-file', name: 'untitled.txt', type: 'file' },
    { id: 'tpl-folder', name: 'new-folder', type: 'folder', children: [{ id: 'tpl-readme', name: 'README.md', type: 'file' }] },
  ];
  // A plain draggable from outside: the tree makes a file for it (`createItem`).
  const chip = { id: 'chip-note', title: 'note.md' };
  const lastDrop = shallowRef('');
  const nesting = shallowRef<TreeNesting>('both');
  const rejectDrops = shallowRef(false);
  const lockAxis = shallowRef(false);

  // Every copy and created node gets a key of its own: `tpl-folder-1`, its child `tpl-readme-2`.
  let next = 0;
  const copyNode = (node: FileNode): FileNode => ({
    ...node,
    id: `${node.id}-${++next}`,
    children: node.children?.map(copyNode),
  });

  const rootRef = useTemplateRef<HTMLElement>('root');
  const { items, projected } = makeSortableTree(rootRef, {
    id: 'tree',
    items: tree,
    group: GROUP,
    indentation: INDENTATION,
    // Options take refs and getters: the radio buttons switch the mode live.
    nesting,
    maxDepth: 2,
    collapsed,
    // Files can't contain anything.
    canNest: (_node, parent) => parent.type === 'folder',
    // Alt+drag duplicates a node; a copied folder brings its subtree.
    clone: copyNode,
    createItem: (active): FileNode => {
      const source = active.data as typeof chip;
      return { id: `${source.id}-${++next}`, name: source.title, type: 'file' };
    },
    // Read when a drag starts. The depth then only changes by hovering the middle of a folder.
    modifiers: () => (lockAxis.value ? [restrictToVerticalAxis] : undefined),
    onBeforeDrop: () => !rejectDrops.value,
    onDrop: (event) => {
      const place = (parentKey: Key | null, index: number) => `${parentKey ?? 'root'}[${index}]`;
      const mode = event.mode === 'move' ? '' : `${event.mode} `;
      lastDrop.value = `${mode}${event.keys[0]} ${event.from.list ?? 'outside'}:${place(event.from.parentKey, event.from.index)} -> ${place(event.to.parentKey, event.to.index)}`;
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
    <h2>Tree</h2>
    <p class="hint">
      Drag sideways to change the level, or hover the middle of a folder to drop into it. Max depth 2; files take no
      children. Nodes move to and from the clipboard with their subtree. Templates are copied into the tree (a folder
      with its contents), Alt+drag duplicates a node, and the chip becomes a new file where it is dropped.
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
      <label>
        <input
          v-model="lockAxis"
          type="checkbox"
          data-testid="lock-axis"
        />
        vertical axis only (modifiers)
      </label>
    </div>
    <div class="layout">
      <div class="side">
        <h3>Clipboard</h3>
        <!-- Its own component: a list made next to the tree in this one would give the tree's rows its context. -->
        <FileList
          v-model="clipboard"
          list-id="clipboard"
          :group="GROUP"
          class="side-list"
          data-testid="clipboard-list"
        />
        <h3>Templates</h3>
        <FilePalette
          list-id="templates"
          :group="GROUP"
          :templates="templates"
          :clone="copyNode"
          class="side-list"
          data-testid="palette-list"
        />
        <h3>From outside</h3>
        <ExternalChip :chip="chip" />
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

  .side h3:not(:first-child) {
    margin-top: 16px;
  }

  .options {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }

  .side-list {
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
    max-width: 560px;
    color: var(--ui-text-muted);
  }
</style>
