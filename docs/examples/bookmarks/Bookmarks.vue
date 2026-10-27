<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import FolderRow from './FolderRow.vue';
import LinkRow from './LinkRow.vue';

type Link = { id: string; title: string; host: string; hue: number };
type Folder = { id: string; title: string; links: Link[] };

const bookmarks = ref<(Link | Folder)[]>([
  { id: 'vue', title: 'Vue', host: 'vuejs.org', hue: 153 },
  { id: 'work', title: 'Work', links: [{ id: 'figma', title: 'Figma', host: 'figma.com', hue: 12 }] },
  { id: 'mdn', title: 'MDN', host: 'developer.mozilla.org', hue: 220 },
  { id: 'reading', title: 'Reading', links: [] },
  { id: 'github', title: 'GitHub', host: 'github.com', hue: 270 },
  { id: 'caniuse', title: 'Can I use', host: 'caniuse.com', hue: 30 },
]);
const isFolder = (entry: Link | Folder): entry is Folder => 'links' in entry;

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: bookmarks });
</script>

<template>
  <section class="bookmarks">
    <h4>Bookmarks</h4>
    <ul ref="list" class="rows">
      <template v-for="entry in items" :key="entry.id">
        <FolderRow v-if="isFolder(entry)" :folder="entry" />
        <LinkRow v-else :link="entry" />
      </template>
    </ul>
  </section>
</template>

<style scoped>
.bookmarks {
  width: 340px;
  max-width: 100%;
  margin: 0 auto;
}

h4 {
  margin: 0 0 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
