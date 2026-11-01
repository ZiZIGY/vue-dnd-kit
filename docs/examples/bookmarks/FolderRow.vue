<script setup lang="ts">
import { ref, toRef, useTemplateRef } from 'vue';
import { makeDroppable, makeSortableItem, makeSortableList } from '@vue-dnd-kit/core';
import LinkRow from './LinkRow.vue';
import type { Folder, Link } from './bookmarks';

const props = defineProps<{ folder: Folder }>();
const emit = defineEmits<{ add: [links: Link[]] }>();

const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

// The same element takes links. While the list sorts, only the middle of the row counts:
// a link let go there goes into the folder; near its edges the list sorts as usual. It
// refuses folders, so a folder dragged over it just sorts.
const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link));
    e.source?.remove(); // and out of the list they came from
  },
});

// Open, the folder's links are a list of the same group: they sort, and drag back out.
// It takes links only: a folder never goes into a folder.
const open = ref(false);
const inner = useTemplateRef<HTMLElement>('inner');
const { items: links } = makeSortableList(inner, {
  items: toRef(props.folder, 'links'),
  group: { name: 'bookmarks', put: ({ types }) => types.every((type) => type === 'link') },
});
</script>

<template>
  <li ref="el" class="row" :class="{ over: isOver }">
    <div class="head">
      <button type="button" class="toggle" :aria-expanded="open" :aria-label="`Show ${folder.title}`" @click="open = !open">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
      </button>
      <svg class="folder" viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="isOver" d="M3 19V6a1.5 1.5 0 0 1 1.5-1.5h4l2 2h7A1.5 1.5 0 0 1 19 8v2M3 19l3-8h16l-3 8z" />
        <path v-else d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2h9A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      </svg>
      <span class="title">{{ folder.title }}</span>
      <span class="count">{{ folder.links.length }}</span>
    </div>
    <ul v-if="open" ref="inner" class="links" :data-empty="links.length ? undefined : 'Empty: drop links here'">
      <LinkRow v-for="link in links" :key="link.id" :link="link" />
    </ul>
  </li>
</template>

<style scoped>
.row {
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
  transition:
    outline-color 0.15s,
    background 0.15s;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* A link is over the middle of the folder: the drop goes in. The ring shows around the
   dragged link, which covers the row. */
.row.over {
  outline: 2px solid #42b883;
  outline-offset: 3px;
  background: color-mix(in srgb, #42b883 12%, Canvas);
}

.row[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
  background: transparent;
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;
}

.head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px 0 6px;
}

.toggle {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.toggle:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.toggle svg {
  width: 14px;
  height: 14px;
  transition: rotate 0.15s;
}

.toggle[aria-expanded='true'] svg {
  rotate: 90deg;
}

svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.folder {
  width: 20px;
  height: 20px;
  stroke: #f59e0b;
}

.title {
  font-weight: 600;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 40px;
  margin: 0;
  padding: 0 8px 8px 34px;
  list-style: none;
}

/* An open folder with no links: room to drop one in. */
.links[data-empty]::before {
  content: attr(data-empty);
  display: grid;
  place-items: center;
  height: 40px;
  border: 1.5px dashed color-mix(in srgb, currentColor 18%, transparent);
  border-radius: 8px;
  font-size: 12px;
  opacity: 0.55;
}
</style>
