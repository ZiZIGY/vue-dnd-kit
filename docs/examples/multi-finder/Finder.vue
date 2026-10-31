<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDroppable, makeSelectionArea, useDnD, type Key } from '@vue-dnd-kit/core';
import FileTile from './FileTile.vue';
import FolderTile from './FolderTile.vue';
import { FILES, FOLDERS, type FileItem } from './files';

const home = ref(FILES.map((file) => ({ ...file })));
const folders = ref(FOLDERS.map((folder) => ({ ...folder, files: [...folder.files] })));
/** The folder shown, `null` for Home. */
const cwd = ref<string | null>(null);
const folder = computed(() => folders.value.find((entry) => entry.id === cwd.value));
const files = computed(() => folder.value?.files ?? home.value);

const filesOf = (place: string | null) => (place ? folders.value.find((entry) => entry.id === place)!.files : home.value);

/** The last move, for Undo. */
const last = ref<{ ids: Key[]; from: string | null; to: string | null } | null>(null);

const { selection } = useDnD();
const move = (ids: Key[], from: string | null, to: string | null) => {
  const source = filesOf(from);
  const moving = source.filter((file) => ids.includes(file.id));
  if (!moving.length) return;
  const stay = source.filter((file) => !ids.includes(file.id));
  if (from) folders.value.find((entry) => entry.id === from)!.files = stay;
  else home.value = stay;
  filesOf(to).push(...moving);
  last.value = { ids, from, to };
  selection.clear();
};
const undo = () => {
  if (!last.value) return;
  const { ids, from, to } = last.value;
  move(ids, to, from);
  last.value = null;
};
const nameOf = (place: string | null) => (place ? folders.value.find((entry) => entry.id === place)!.name : 'Home');

// Click picks one file, Ctrl/Cmd- or Shift-click adds or removes one.
const pick = (file: FileItem, event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey) selection.toggle(file.id);
  else selection.set([file.id]);
};

const open = (id: string | null) => {
  cwd.value = id;
  selection.clear();
};

// A band drawn on the empty space selects the files it ends up around.
const area = useTemplateRef<HTMLElement>('area');
const { isSelecting, style } = makeSelectionArea(area, { strategy: 'select', accept: 'file' });

// Inside a folder, Home in the path takes files back.
const crumb = useTemplateRef<HTMLElement>('crumb');
const { isOver: overHome } = makeDroppable(crumb, {
  id: 'home',
  accept: 'file',
  disabled: () => !cwd.value,
  onDrop: (event) => move(event.active.ids, cwd.value, null),
});
</script>

<template>
  <div class="window">
    <div class="toolbar">
      <span class="lights" aria-hidden="true"><i /><i /><i /></span>
      <nav class="path">
        <button ref="crumb" type="button" class="crumb" :class="{ over: overHome }" @click="open(null)">Home</button>
        <template v-if="folder">
          <span aria-hidden="true">›</span>
          <strong>{{ folder.name }}</strong>
        </template>
      </nav>
    </div>

    <div ref="area" class="area">
      <ul class="grid">
        <template v-if="!folder">
          <FolderTile
            v-for="entry in folders"
            :key="entry.id"
            :folder="entry"
            @open="open(entry.id)"
            @move="(ids) => move(ids, null, entry.id)"
          />
        </template>
        <FileTile v-for="file in files" :key="file.id" :file="file" @pick="(event) => pick(file, event)" />
      </ul>
      <p v-if="folder && !files.length" class="empty">Drag files here from Home</p>
      <div v-if="isSelecting" class="band" :style="style" />
    </div>

    <div class="status">
      <template v-if="last">
        Moved {{ last.ids.length === 1 ? '1 item' : `${last.ids.length} items` }} to {{ nameOf(last.to) }}
        <button type="button" class="undo" @click="undo">Undo</button>
      </template>
      <template v-else>
        {{ selection.ids.size ? `${selection.ids.size} selected` : files.length === 1 ? '1 item' : `${files.length} items` }}
      </template>
    </div>
  </div>
</template>

<style scoped>
.window {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 2%, Canvas);
  font-size: 13px;
  box-shadow: 0 20px 40px -24px rgb(0 0 0 / 0.5);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  background: color-mix(in srgb, currentColor 4%, Canvas);
}

.lights {
  display: flex;
  gap: 6px;
}

.lights i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ef4444;
}

.lights i:nth-child(2) {
  background: #f59e0b;
}

.lights i:nth-child(3) {
  background: #22c55e;
}

.path {
  display: flex;
  align-items: center;
  gap: 6px;
}

.crumb {
  padding: 3px 8px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.crumb:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

/* Files from a folder are over Home. */
.crumb.over {
  background: color-mix(in srgb, #42b883 20%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

/* The selection area: a band needs a position to be placed in. */
.area {
  position: relative;
  /* A fixed height: the window keeps its size as files come and go. */
  height: 300px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  margin: 40px 0 0;
  text-align: center;
  opacity: 0.5;
}

.band {
  border: 1px solid #42b883;
  border-radius: 3px;
  background: color-mix(in srgb, #42b883 15%, transparent);
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  border-top: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  font-size: 12px;
  opacity: 0.8;
}

.undo {
  padding: 2px 8px;
  border: 0;
  border-radius: 5px;
  background: #42b883;
  color: #04130c;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
</style>
