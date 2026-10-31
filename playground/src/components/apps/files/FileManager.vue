<script setup lang="ts">
  import { computed, provide, ref, shallowRef, useTemplateRef } from 'vue';
  import { useDnD, type DnDEvent, type DragItem } from '@vue-dnd-kit/core';
  import FolderTree from './FolderTree.vue';
  import FileGrid from './FileGrid.vue';
  import FolderButton from './FolderButton.vue';
  import { useFolderDrop } from './useFolderDrop';
  import {
    FILE_MANAGER,
    HOME,
    createRoot,
    entryId,
    findFolder,
    findPath,
    isFolder,
    mergeFolders,
    serializeFolders,
    subfolders,
    takeEntries,
    walk,
    type Entry,
    type FileManagerContext,
    type FolderNode,
    type FolderPlace,
  } from './fs';

  const root = ref<FolderNode>(createRoot());
  const current = shallowRef('documents');
  const lastAction = shallowRef('');
  const { selection } = useDnD();

  const folderOf = (id: string) => findFolder(root.value, id);
  const nameOf = (id: string) => folderOf(id)?.name ?? id;
  /** Folder that holds each entry. */
  const parents = computed(() => {
    const map = new Map<string, string>();
    for (const node of walk(root.value)) for (const entry of node.children) map.set(entry.id, node.id);
    return map;
  });

  const openFolder = computed(() => folderOf(current.value) ?? root.value);
  const currentEntries = computed<Entry[]>({
    get: () => openFolder.value.children,
    set: (next) => (openFolder.value.children = next),
  });
  const folders = computed<FolderNode[]>({
    get: () => subfolders(root.value),
    set: (next) => (root.value.children = mergeFolders(root.value.children, next)),
  });
  const path = computed(() => findPath(folders.value, current.value));
  const selectedCount = computed(() => currentEntries.value.filter((entry) => selection.has(entry.id)).length);

  const open = (folderId: string) => {
    if (folderId === current.value) return;
    current.value = folderId;
    selection.clear();
  };

  const canMove = (item: DragItem, folderId: string, place: FolderPlace) => {
    const id = entryId(item);
    // The tree nests its own rows: its rows are no targets for its own drags.
    if (place === 'row' && item.type.includes('tree')) return false;
    // Never into the folder it is already in...
    if (parents.value.get(id) === folderId) return false;
    // ...nor a folder into itself or one of its own sub-folders.
    const moved = folderOf(id);
    return !moved || ![...walk(moved)].some((node) => node.id === folderId);
  };

  const plural = (count: number, noun: string) => (count === 1 ? `1 ${noun}` : `${count} ${noun}s`);

  const moveInto = (event: DnDEvent, folderId: string) => {
    const target = folderOf(folderId);
    if (!target) return;
    // Out of wherever they are (the open folder, or the tree), in tree order...
    const moved = takeEntries(root.value, new Set(event.active.items.map(entryId)));
    if (!moved.length) return;
    // ...and appended to the target folder.
    target.children = [...target.children, ...moved];
    selection.delete(...moved.map((entry) => entry.id));
    const kinds = new Set(moved.map((entry) => entry.kind));
    const what = moved.length === 1 ? moved[0]!.name : plural(moved.length, kinds.size > 1 ? 'item' : moved[0]!.kind);
    lastAction.value = `Moved ${what} to ${nameOf(folderId)}`;
  };

  const context: FileManagerContext = {
    root,
    folders,
    currentEntries,
    current,
    lastAction,
    nameOf,
    open,
    canMove,
    moveInto,
  };
  provide(FILE_MANAGER, context);

  const home = useTemplateRef<HTMLElement>('home');
  const { isOver: overHome, isAccepting: homeAccepting } = useFolderDrop(home, () => HOME, 'sidebar', context);

  const summary = computed(() => {
    const entries = currentEntries.value;
    const count = entries.filter(isFolder).length;
    const parts = [count && plural(count, 'folder'), plural(entries.length - count, 'file')].filter(Boolean);
    return parts.join(', ');
  });

  // Data dump for the specs: one `folder:entry,folder/,…` line per folder (sub-folders end with `/`).
  const describeFiles = computed(() =>
    [...walk(root.value)]
      .map((node) => `${node.id}:${node.children.map((entry) => (isFolder(entry) ? `${entry.id}/` : entry.id)).join(',')}`)
      .join('\n'),
  );
</script>

<template>
  <div class="fm">
    <aside class="fm-sidebar">
      <div
        ref="home"
        class="fm-home"
        :class="{ current: current === HOME, accepting: homeAccepting, target: overHome && homeAccepting }"
        data-testid="sidebar-home"
        :data-target="(overHome && homeAccepting) || undefined"
        @click="open(HOME)"
      >
        <span aria-hidden="true">⌂</span> Home
      </div>
      <FolderTree />
    </aside>
    <section class="fm-main">
      <div
        class="fm-crumbs"
        role="navigation"
        aria-label="Path"
        data-testid="crumbs"
      >
        <strong
          v-if="current === HOME"
          data-testid="crumb-current"
          >Home</strong
        >
        <template v-else>
          <FolderButton
            :folder-id="HOME"
            name="Home"
          />
          <template
            v-for="(folder, index) in path"
            :key="folder.id"
          >
            <span class="fm-sep">›</span>
            <strong
              v-if="index === path.length - 1"
              data-testid="crumb-current"
              >{{ folder.name }}</strong
            >
            <FolderButton
              v-else
              :folder-id="folder.id"
              :name="folder.name"
            />
          </template>
        </template>
      </div>
      <FileGrid />
      <footer class="fm-status">
        <span data-testid="fs-summary"
          >{{ summary }}<template v-if="selectedCount"> · {{ selectedCount }} selected</template></span
        >
        <span data-testid="fs-last">{{ lastAction }}</span>
      </footer>
    </section>
  </div>
  <div class="fm-debug">
    <pre data-testid="fs-tree">{{ serializeFolders(folders) }}</pre>
    <pre data-testid="fs-files">{{ describeFiles }}</pre>
  </div>
</template>

<style scoped>
  .fm {
    display: flex;
    width: 900px;
    height: 460px;
    overflow: hidden;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-lg);
    box-shadow: var(--ui-shadow-sm);
  }

  .fm-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 230px;
    padding: 10px 8px;
    overflow: auto;
    background: var(--ui-bg-muted);
    border-right: 1px solid var(--ui-border);
  }

  .fm-home {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 10px;
    border-radius: var(--ui-radius);
    color: var(--ui-text);
    cursor: pointer;
  }

  .fm-home.current {
    background: var(--ui-selection-soft);
    color: var(--ui-text-highlighted);
    font-weight: 600;
  }

  .fm-home.accepting {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-primary) 55%, transparent);
  }

  .fm-home.target {
    background: var(--ui-primary);
    color: var(--ui-on-primary);
  }

  .fm-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .fm-crumbs {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 44px;
    padding: 0 12px;
    border-bottom: 1px solid var(--ui-border);
  }

  .fm-crumbs strong {
    padding: 4px 8px;
    color: var(--ui-text-highlighted);
  }

  .fm-sep {
    color: var(--ui-text-dimmed);
  }

  .fm-status {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    height: 32px;
    padding: 0 12px;
    align-items: center;
    border-top: 1px solid var(--ui-border);
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-size: 12px;
  }

  .fm-debug {
    display: flex;
    gap: 32px;
  }
</style>
