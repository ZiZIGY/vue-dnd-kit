<script setup lang="ts">
import { computed, provide, ref, shallowRef } from 'vue';
import { useDnD, type DnDEvent, type Key } from '@vue-dnd-kit/core';
import FileGrid from './FileGrid.vue';
import FolderRow from './FolderRow.vue';
import { FILES, copyEntry, createHome, describe, isFolder, items, pathTo, walk, type Entry, type FolderEntry } from './files';

const home = ref(createHome());
const current = shallowRef(home.value.children.find(isFolder)!);
const entries = computed<Entry[]>({
  get: () => current.value.children,
  set: (next) => (current.value.children = next),
});
const lastAction = ref('');
const { selection } = useDnD();

const open = (folder: FolderEntry) => {
  current.value = folder;
  selection.clear();
};

// Not into the folder they are in, nor a folder into itself or a folder inside it.
const canDrop = (ids: Key[], folder: FolderEntry) =>
  folder.id !== current.value.id && !pathTo(home.value, folder.id).some((step) => ids.includes(step.id));

// A folder is a plain drop target: `event.mode` says whether Alt turned the drag into a copy.
const dropInto = (event: DnDEvent, folder: FolderEntry) => {
  const copying = event.mode === 'copy';
  // Every drag starts in the grid: the dragged entries, in the open folder's order.
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  if (copying) {
    folder.children.push(...dragged.map((entry) => copyEntry(entry)));
  } else {
    folder.children.push(...dragged);
    // The grid they came from lets them go.
    event.source?.remove();
    selection.delete(...event.active.ids);
  }
  lastAction.value = `${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${folder.name}`;
};

provide(FILES, { current, entries, lastAction, open, canDrop, dropInto });

const folders = computed(() => [...walk(home.value)]);
const path = computed(() => pathTo(home.value, current.value.id));
const selectedCount = computed(() => entries.value.filter((entry) => selection.has(entry.id)).length);
</script>

<template>
  <div class="files">
    <div class="window">
      <nav class="sidebar" aria-label="Folders">
        <h4>Locations</h4>
        <FolderRow v-for="{ folder, depth } in folders" :key="folder.id" :folder="folder" :depth="depth" />
      </nav>
      <section class="main">
        <header>
          <nav class="crumbs" aria-label="Path">
            <template v-for="(step, index) in path" :key="step.id">
              <svg v-if="index" class="chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
              <button type="button" :aria-current="step.id === current.id ? 'page' : undefined" @click="open(step)">
                {{ step.name }}
              </button>
            </template>
          </nav>
          <span class="tip"><kbd>Alt</kbd> drag to copy</span>
        </header>
        <FileGrid />
        <footer>
          <span>{{ items(entries.length) }}<template v-if="selectedCount"> · {{ selectedCount }} selected</template></span>
          <span class="last">{{ lastAction }}</span>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* A container: the window stacks when the example is narrow, not the screen. */
.files {
  container-type: inline-size;
}

.window {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  box-sizing: border-box;
  width: min(100%, 780px);
  height: 400px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: Canvas;
  box-shadow: 0 24px 48px -28px rgb(0 0 0 / 0.5);
  font-size: 13px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 12px 8px;
  overflow: auto;
  border-right: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  background: color-mix(in srgb, currentColor 4%, Canvas);
}

h4 {
  margin: 2px 10px 8px;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.5;
}

.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

header,
footer {
  display: flex;
  flex: none;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
}

header {
  height: 46px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
}

.crumbs {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.crumbs button {
  padding: 4px 7px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font: inherit;
  white-space: nowrap;
  opacity: 0.6;
  cursor: pointer;
}

.crumbs button:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.crumbs button[aria-current] {
  font-weight: 600;
  opacity: 1;
}

.chevron {
  flex: none;
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.35;
}

.tip {
  margin-left: auto;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0.55;
}

kbd {
  margin-right: 3px;
  padding: 1px 5px;
  border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
  border-bottom-width: 2px;
  border-radius: 4px;
  font: 10px/1.4 ui-monospace, Menlo, Consolas, monospace;
}

footer {
  justify-content: space-between;
  height: 30px;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

footer > span:first-child {
  white-space: nowrap;
  opacity: 0.55;
}

.last {
  overflow: hidden;
  color: #42b883;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@container (max-width: 460px) {
  .window {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 132px minmax(0, 1fr);
    height: 520px;
  }

  .sidebar {
    border-right: 0;
    border-bottom: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  }

  .tip {
    display: none;
  }
}
</style>
