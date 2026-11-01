<script setup lang="ts">
import { useTemplateRef } from 'vue';
import FileIcon from './FileIcon.vue';
import RenameField from './RenameField.vue';
import { formatSize, isFolder, items, type Entry } from './files';
import { useFileItem } from './useFileItem';

/** An entry of the grid view. The view handles its clicks and keys (`pick`, `open`, `menu`). */
const props = defineProps<{ entry: Entry; tabbable: boolean }>();
const emit = defineEmits<{ pick: [event: MouseEvent]; open: []; menu: [event: MouseEvent] }>();

const el = useTemplateRef<HTMLElement>('el');
const { selected, isOpen, gulps, renaming } = useFileItem(el, () => props.entry);
</script>

<template>
  <li
    ref="el"
    class="tile"
    :class="{ selected, open: isOpen }"
    :data-id="entry.id"
    role="option"
    :aria-selected="selected"
    :tabindex="tabbable ? 0 : -1"
    @click="emit('pick', $event)"
    @dblclick="emit('open')"
    @contextmenu.prevent.stop="emit('menu', $event)"
  >
    <span class="thumb"><FileIcon :entry="entry" :open="isOpen" :gulps="gulps" /></span>
    <RenameField v-if="renaming" :entry="entry" class="field" @done="el?.focus()" />
    <span v-else class="name" :title="entry.name">{{ entry.name }}</span>
    <span class="meta">{{ isFolder(entry) ? items(entry.children.length) : formatSize(entry.size) }}</span>
  </li>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 0;
  padding: 8px 4px 9px;
  border-radius: 12px;
  outline: none;
  cursor: default;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.thumb {
  display: grid;
  place-items: center;
  width: var(--icon);
  height: var(--icon);
  padding: 5px;
  border-radius: 12px;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
}

.tile:hover .thumb {
  background: color-mix(in srgb, currentColor 6%, transparent);
}

.name {
  display: -webkit-box;
  overflow: hidden;
  max-width: 100%;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.35;
  text-align: center;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.field {
  font-size: 12.5px;
  text-align: center;
}

.meta {
  font: 10.5px/1.2 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

/* Selected, as in Finder: a well behind the icon, the name in a pill. */
.selected .thumb {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.selected .name {
  background: #42b883;
  color: #04130c;
}

.tile:focus-visible .thumb {
  box-shadow: 0 0 0 2px #42b883;
}

/* A folder that takes what is held over it. */
.open .thumb {
  background: color-mix(in srgb, #42b883 22%, transparent);
  box-shadow: 0 0 0 2px #42b883;
}

/* The grabbed tile's slot: a dashed outline where it will land. */
.tile[data-dnd-placeholder] {
  opacity: 1;
  outline: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  outline-offset: -2px;
}

.tile[data-dnd-placeholder] > * {
  opacity: 0.3;
}

/* Over a folder the drop goes into it: the slot only keeps the grid still, so it shows nothing. */
.tile[data-dnd-placeholder='into'] {
  outline-color: transparent;
}

.tile[data-dnd-placeholder='into'] > * {
  opacity: 0;
}

/* The other picked tiles wait in place, faded, until the drop moves them. */
.tile[data-dnd-dragging] {
  opacity: 0.35;
}

/* Their copies in the overlay are cards: a pile of them reads as one. */
[data-dnd-overlay] .tile {
  outline: none;
  background: color-mix(in srgb, currentColor 5%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}
</style>
