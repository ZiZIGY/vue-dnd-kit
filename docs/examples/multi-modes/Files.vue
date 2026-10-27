<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList, useDnD, type MultipleMode } from '@vue-dnd-kit/core';
import FileItem from './FileItem.vue';

const files = ref([
  { id: 'brief', name: 'brief.pdf', kind: 'pdf', size: '220 KB' },
  { id: 'logo', name: 'logo.svg', kind: 'img', size: '8 KB' },
  { id: 'budget', name: 'budget.xlsx', kind: 'xls', size: '64 KB' },
  { id: 'hero', name: 'hero.png', kind: 'img', size: '1.2 MB' },
  { id: 'notes', name: 'notes.md', kind: 'doc', size: '3 KB' },
  { id: 'deck', name: 'deck.key', kind: 'pdf', size: '9.8 MB' },
  { id: 'avatar', name: 'avatar.jpg', kind: 'img', size: '140 KB' },
  { id: 'terms', name: 'terms.md', kind: 'doc', size: '12 KB' },
]);

const MODES: MultipleMode[] = ['group', 'gaps', 'stack'];
const mode = ref<MultipleMode>('group');
const layout = ref<'list' | 'grid'>('list');

const list = useTemplateRef<HTMLElement>('list');
// Both are read when a drag starts: switch them between drags.
const { items } = makeSortableList(list, {
  items: files,
  multiple: mode,
  strategy: () => (layout.value === 'grid' ? 'grid' : 'vertical'),
});

// The click rules are the app's: a click selects one file, Ctrl/Cmd-click adds or
// removes one, Shift-click selects the run from the last clicked file.
const { selection } = useDnD();
let anchor: string | null = null;
const pick = (id: string, event: MouseEvent) => {
  const ids = items.value.map((file) => file.id);
  if (event.shiftKey && anchor) {
    const [a, b] = [ids.indexOf(anchor), ids.indexOf(id)];
    selection.set(ids.slice(Math.min(a, b), Math.max(a, b) + 1));
    return;
  }
  if (event.ctrlKey || event.metaKey) selection.toggle(id);
  else selection.set([id]);
  anchor = id;
};
selection.set(['logo', 'hero', 'notes']);
</script>

<template>
  <div class="files">
    <div class="controls">
      <div class="segmented" role="group" aria-label="multiple">
        <button
          v-for="value in MODES"
          :key="value"
          type="button"
          :aria-pressed="mode === value"
          @click="mode = value"
        >
          '{{ value }}'
        </button>
      </div>
      <div class="segmented" role="group" aria-label="Layout">
        <button type="button" :aria-pressed="layout === 'list'" @click="layout = 'list'">List</button>
        <button type="button" :aria-pressed="layout === 'grid'" @click="layout = 'grid'">Grid</button>
      </div>
    </div>
    <ul ref="list" :class="layout">
      <FileItem v-for="file in items" :key="file.id" :file="file" :tile="layout === 'grid'" @pick="pick(file.id, $event)" />
    </ul>
    <p class="status">
      {{ selection.ids.size }} selected
      <button type="button" class="clear" :disabled="!selection.ids.size" @click="selection.clear()">Clear</button>
    </p>
  </div>
</template>

<style scoped>
.files {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

.segmented button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

ul {
  width: min(100%, 360px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.clear {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.clear:disabled {
  cursor: default;
  opacity: 0.4;
}
</style>
