<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import Favorites from './Favorites.vue';
import Glyph from './Glyph.vue';
import SidebarRow from './SidebarRow.vue';
import { DRIVE } from './drive';
import { formatSize, isFolder, sizeOf, type FolderEntry } from './files';

/** Favorites, the folder tree and the Trash: every row takes drops. */
const drive = inject(DRIVE)!;

/** Folders whose subfolders show. The open folder always shows: the folders above it open. */
const expanded = ref(new Set<string>());
watch(drive.path, (path) => path.slice(0, -1).forEach((step) => expanded.value.add(step.id)), { immediate: true });
const toggle = (id: string) => (expanded.value.has(id) ? expanded.value.delete(id) : expanded.value.add(id));

/** The tree, flat: the rows that show, with their depth. */
const rows = computed(() => {
  const shown: Array<{ folder: FolderEntry; depth: number }> = [];
  const visit = (folder: FolderEntry, depth: number) => {
    shown.push({ folder, depth });
    if (expanded.value.has(folder.id)) folder.children.filter(isFolder).forEach((child) => visit(child, depth + 1));
  };
  visit(drive.home.value, 0);
  return shown;
});

const QUOTA = 2e9;
const used = computed(() => sizeOf(drive.home.value) + sizeOf(drive.trash.value));
</script>

<template>
  <nav class="sidebar" aria-label="Places">
    <div class="brand">
      <span class="logo"><Glyph name="drive" /></span>
      Drive
    </div>

    <h3 class="heading">Favorites</h3>
    <Favorites />

    <h3 class="heading">Locations</h3>
    <TransitionGroup tag="div" name="tree" class="tree">
      <SidebarRow
        v-for="{ folder, depth } in rows"
        :key="folder.id"
        :folder="folder"
        :depth="depth"
        :glyph="depth ? undefined : 'drive'"
        :expandable="folder.children.some(isFolder)"
        :expanded="expanded.has(folder.id)"
        @toggle="toggle(folder.id)"
      />
    </TransitionGroup>
    <SidebarRow :folder="drive.trash.value" glyph="trash" :count="drive.trash.value.children.length" />

    <div class="storage">
      <div class="meter"><span :style="{ width: `${Math.max(2, (used / QUOTA) * 100)}%` }" /></div>
      {{ formatSize(used) }} of {{ formatSize(QUOTA) }} used
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-height: 0;
  padding: 12px 8px;
  overflow: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 6px 6px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.logo {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: linear-gradient(150deg, #5fd3a0, #2f9e6e);
  color: #fff;
  font-size: 15px;
}

.heading {
  margin: 14px 10px 5px;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.45;
}

.tree {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 1px;
}

/* Subfolders slide in as a folder opens. */
.tree-enter-from {
  opacity: 0;
  translate: 0 -6px;
}

.tree-enter-active {
  transition:
    opacity 0.2s,
    translate 0.2s;
}

.tree-move {
  transition: transform 0.2s;
}

.storage {
  margin: auto 6px 0;
  padding-top: 16px;
  font-size: 11px;
  opacity: 0.6;
}

.meter {
  overflow: hidden;
  height: 4px;
  margin-bottom: 7px;
  border-radius: 2px;
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #42b883;
  transition: width 0.4s;
}

@media (prefers-reduced-motion: reduce) {
  .tree-enter-active,
  .tree-move {
    transition: none;
  }
}
</style>
