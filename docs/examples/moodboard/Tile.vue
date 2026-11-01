<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { labelOf, toOutside, type Card } from './cards';

const props = defineProps<{ card: Card }>();

const el = useTemplateRef<HTMLElement>('el');
// `native`: a mouse drag is the browser's own, so the card can leave the page: into another
// app, onto the desktop, into this page in another window.
makeSortableItem(el, {
  item: () => props.card,
  label: () => labelOf(props.card),
  native: { data: () => toOutside(props.card) },
});
</script>

<template>
  <li ref="el" class="tile" :class="card.kind">
    <template v-if="card.kind === 'image'">
      <img :src="card.src" :alt="card.name" draggable="false" />
      <span class="caption">{{ card.name }}</span>
    </template>
    <template v-else-if="card.kind === 'link'">
      <span class="badge">Link</span>
      <span class="title">{{ card.title }}</span>
      <span class="url">{{ card.url }}</span>
    </template>
    <template v-else-if="card.kind === 'note'">
      <p>{{ card.text }}</p>
    </template>
    <template v-else-if="card.kind === 'swatch'">
      <span class="chip" :style="{ background: card.color }" />
      <span class="title">{{ card.name }}</span>
      <span class="url">{{ card.color }}</span>
    </template>
    <template v-else>
      <span class="plus">+</span>
      <span class="title">{{ card.label }}</span>
    </template>
  </li>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
  overflow: hidden;
  padding: 12px;
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 6%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font-size: 12px;
  cursor: grab;
  user-select: none;
}

.tile:hover {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 22%, transparent);
}

/* The slot a card lands in. */
.tile[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 10%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 60%, transparent);
}

.tile[data-dnd-placeholder] > * {
  opacity: 0.35;
}

.image {
  padding: 0;
}

.image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.caption {
  position: relative;
  margin: 8px;
  padding: 3px 8px;
  align-self: flex-start;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.45);
  color: #fff;
  font-size: 11px;
}

.badge {
  align-self: flex-start;
  margin-bottom: auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, #3b82f6 18%, transparent);
  color: #2563eb;
  font: 600 10px/1.4 ui-monospace, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

.title {
  font-weight: 600;
  font-size: 13px;
}

.url {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.55;
  font: 11px/1.3 ui-monospace, Menlo, Consolas, monospace;
}

.note {
  justify-content: flex-start;
  background: color-mix(in srgb, #facc15 22%, Canvas);
}

.note p {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
}

.chip {
  flex: 1;
  margin: -12px -12px 6px;
}

.incoming {
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #42b883;
  background: color-mix(in srgb, #42b883 8%, Canvas);
  color: #42b883;
}

.plus {
  font-size: 28px;
  line-height: 1;
}
</style>
