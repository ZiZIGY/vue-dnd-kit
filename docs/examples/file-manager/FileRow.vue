<script setup lang="ts">
import { useTemplateRef } from 'vue';
import FileIcon from './FileIcon.vue';
import RenameField from './RenameField.vue';
import { KINDS, formatDate, formatSize, isFolder, items, kindOf, type Entry } from './files';
import { useFileItem } from './useFileItem';

/** An entry of the list view, in the columns of the view's header (`--columns`). */
const props = defineProps<{ entry: Entry; tabbable: boolean }>();
const emit = defineEmits<{ pick: [event: MouseEvent]; open: []; menu: [event: MouseEvent] }>();

const el = useTemplateRef<HTMLElement>('el');
const { selected, isOpen, gulps, renaming } = useFileItem(el, () => props.entry);
</script>

<template>
  <li
    ref="el"
    class="row"
    :class="{ selected, open: isOpen }"
    :data-id="entry.id"
    role="option"
    :aria-selected="selected"
    :tabindex="tabbable ? 0 : -1"
    @click="emit('pick', $event)"
    @dblclick="emit('open')"
    @contextmenu.prevent.stop="emit('menu', $event)"
  >
    <span class="name">
      <span class="icon"><FileIcon :entry="entry" :open="isOpen" :gulps="gulps" /></span>
      <RenameField v-if="renaming" :entry="entry" @done="el?.focus()" />
      <span v-else class="text">{{ entry.name }}</span>
    </span>
    <span class="cell modified">{{ formatDate(entry.modified) }}</span>
    <span class="cell size">{{ isFolder(entry) ? items(entry.children.length) : formatSize(entry.size) }}</span>
    <span class="cell kind">{{ KINDS[kindOf(entry)].label }}</span>
  </li>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: var(--columns);
  align-items: center;
  gap: 12px;
  height: 34px;
  padding: 0 12px 0 8px;
  border-radius: 8px;
  /* Its own background: the overlay's copy of the row isn't see-through. */
  background: Canvas;
  outline: none;
  cursor: default;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.row:nth-child(even) {
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.row:hover {
  background: color-mix(in srgb, currentColor 6%, Canvas);
}

.row:focus-visible {
  box-shadow: inset 0 0 0 2px #42b883;
}

.row.selected {
  background: color-mix(in srgb, #42b883 22%, Canvas);
}

/* A folder that takes what is held over it. */
.row.open {
  background: color-mix(in srgb, #42b883 30%, Canvas);
  box-shadow: inset 0 0 0 2px #42b883;
}

.name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 13px;
}

.icon {
  flex: none;
  width: 22px;
  height: 22px;
}

.text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cell {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
}

.size {
  font-variant-numeric: tabular-nums;
  text-align: right;
}

/* The grabbed row's slot, and the other picked rows waiting in place. */
.row[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.row[data-dnd-placeholder] > *,
.row[data-dnd-dragging] {
  opacity: 0.35;
}

/* Over a folder the drop goes into it: the slot only keeps the rows still. */
.row[data-dnd-placeholder='into'] {
  box-shadow: none;
}

.row[data-dnd-placeholder='into'] > * {
  opacity: 0;
}

/* The view hides the columns it has no room for (see FileView.vue). */
@container files (max-width: 560px) {
  .kind {
    display: none;
  }
}

@container files (max-width: 400px) {
  .modified {
    display: none;
  }
}
</style>
