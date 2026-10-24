<script setup lang="ts">
  import { computed, provide, reactive, ref, shallowRef, useTemplateRef } from 'vue';
  import { useDnD, type DnDEvent } from '@vue-dnd-kit/core';
  import FolderTree from './FolderTree.vue';
  import FileGrid from './FileGrid.vue';
  import FolderButton from './FolderButton.vue';
  import { useFolderDrop } from './useFolderDrop';
  import {
    FILE_MANAGER,
    HOME,
    createFiles,
    createFolders,
    findPath,
    folderIds,
    serializeFolders,
    type FileItem,
    type FileManagerContext,
    type FolderNode,
  } from './fs';

  const folders = ref<FolderNode[]>(createFolders());
  const files = reactive<Record<string, FileItem[]>>(createFiles());
  const current = shallowRef('documents');
  const lastAction = shallowRef('');
  const { selection, active } = useDnD();

  const nameOf = (id: string) => (id === HOME ? 'Home' : (findPath(folders.value, id).at(-1)?.name ?? id));
  const plural = (count: number) => (count === 1 ? '1 file' : `${count} files`);

  const currentFiles = computed<FileItem[]>({
    get: () => files[current.value] ?? [],
    set: (next) => (files[current.value] = next),
  });
  const path = computed(() => (current.value === HOME ? [] : findPath(folders.value, current.value)));
  const selectedCount = computed(() => currentFiles.value.filter((file) => selection.has(file.id)).length);

  const open = (folderId: string) => {
    if (folderId === current.value) return;
    current.value = folderId;
    selection.clear();
  };

  const moveInto = (event: DnDEvent, folderId: string) => {
    const ids = new Set(event.active.ids);
    // In the order they had in the folder, not in the order they were selected.
    const moved = currentFiles.value.filter((file) => ids.has(file.id));
    if (!moved.length) return;
    // The grid drops them from the open folder once the drop is committed...
    event.source?.remove();
    // ...and they are appended to the target folder.
    files[folderId] = [...(files[folderId] ?? []), ...moved];
    selection.delete(...moved.map((file) => file.id));
    lastAction.value = `Moved ${moved.length === 1 ? moved[0]!.name : plural(moved.length)} to ${nameOf(folderId)}`;
  };

  const context: FileManagerContext = {
    folders,
    files,
    currentFiles,
    current,
    lastAction,
    nameOf,
    open,
    moveInto,
    draggingFiles: computed(() => active.value?.type.includes('file') ?? false),
  };
  provide(FILE_MANAGER, context);

  const home = useTemplateRef<HTMLElement>('home');
  const { isOver: overHome, isAccepting: homeAccepting } = useFolderDrop(home, () => HOME, 'sidebar', context);

  // Data dump for the specs: one `folder:file,file` line per folder.
  const describeFiles = computed(() =>
    [HOME, ...folderIds(folders.value)]
      .map((id) => `${id}:${(files[id] ?? []).map((file) => file.id).join(',')}`)
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
            variant="crumb"
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
              variant="crumb"
            />
          </template>
        </template>
      </div>
      <FileGrid />
      <footer class="fm-status">
        <span data-testid="fs-summary"
          >{{ plural(currentFiles.length) }}<template v-if="selectedCount"> · {{ selectedCount }} selected</template></span
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
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgb(15 23 42 / 0.08);
  }

  .fm-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 230px;
    padding: 10px 8px;
    overflow: auto;
    background: #f8fafc;
    border-right: 1px solid #e2e8f0;
  }

  .fm-home {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 10px;
    border-radius: 6px;
    color: #334155;
    cursor: pointer;
  }

  .fm-home.current {
    background: #dbeafe;
    color: #1e3a8a;
    font-weight: 600;
  }

  .fm-home.accepting {
    box-shadow: inset 0 0 0 1px #93c5fd;
  }

  .fm-home.target {
    background: #2563eb;
    color: #fff;
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
    border-bottom: 1px solid #e2e8f0;
  }

  .fm-crumbs strong {
    padding: 4px 8px;
  }

  .fm-sep {
    color: #94a3b8;
  }

  .fm-status {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    height: 32px;
    padding: 0 12px;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 12px;
  }

  .fm-debug {
    display: flex;
    gap: 32px;
  }
</style>
