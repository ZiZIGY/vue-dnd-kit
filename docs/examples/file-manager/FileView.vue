<script setup lang="ts">
import { computed, h, inject, ref, useTemplateRef, watch } from 'vue';
import { makeSelectionArea, makeSortableList, snapCenterToCursor, useDnD, type OverlayProps } from '@vue-dnd-kit/core';
import FileRow from './FileRow.vue';
import FilesOverlay from './FilesOverlay.vue';
import FileTile from './FileTile.vue';
import Glyph from './Glyph.vue';
import { DRIVE, type SortKey } from './drive';
import { describe, isFolder, type Entry } from './files';

/**
 * The open folder, as a grid of tiles or a list of rows: one sortable list, a rubber band,
 * and the clicks and keys of a file manager. The window makes a new one for every folder.
 */
const drive = inject(DRIVE)!;
const { selection, status } = useDnD();
const area = useTemplateRef<HTMLElement>('area');
const list = useTemplateRef<HTMLElement>('list');
const grid = computed(() => drive.view.value === 'grid');

const { items } = makeSortableList(list, {
  items: drive.entries,
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  // Sorted by a column, the column decides the order: drags only go into folders.
  sort: () => drive.sort.value.key === 'manual',
  // The other picked files wait in place until the drop, as in Finder.
  multiple: 'gaps',
  // Alt-drag leaves the files where they are and drops copies: "Budget copy.xlsx".
  clone: drive.duplicateOf,
  // The whole view takes drops, its empty space too.
  dropzone: area,
  // A function is a functional component: the overlay, told whether it carries rows or tiles.
  overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
    h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
  // A row is as wide as the list: its box is centered on the pointer, and the overlay hangs a chip off it.
  modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
  // Changes no drag made slide and fade too: a new sort, a new folder, files sent to the Trash.
  animate: true,
  onDrop: (event) => {
    // Into a folder, `dropInto` has saved it for Undo; a drop where it was changes nothing.
    if (event.to.index === -1 || !event.result.size) return;
    if (event.mode === 'copy') drive.record(`Duplicated ${describe(event.items)}`);
    else drive.record(`Arranged ${describe(event.items)}`, false);
  },
});

// A press on the empty space draws a band. With Shift, Ctrl or Cmd held it adds to the
// selection (the tiles it crosses flip); without, it replaces it.
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});
let touch = false;
// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
  touch = event.pointerType === 'touch';
};

// ─── Picking ──────────────────────────────────────────────────────────────────

/** Where Shift-click and Shift+arrows select from. */
let anchor: string | null = null;
/** The one entry Tab stops at (a roving tabindex): arrows move it. */
const focusId = ref<string | null>(null);
const tabStop = computed(() => items.value.find((entry) => entry.id === focusId.value)?.id ?? items.value[0]?.id);

/** `extend`: from the anchor to `entry` (Shift). `toggle`: add or remove it (Ctrl/Cmd). Otherwise `entry` alone. */
const select = (entry: Entry, { extend = false, toggle = false } = {}) => {
  const ids = items.value.map((item) => item.id);
  if (extend && anchor && ids.includes(anchor)) {
    const [from, to] = [ids.indexOf(anchor), ids.indexOf(entry.id)].sort((a, b) => a - b);
    selection.set(ids.slice(from, to! + 1));
  } else {
    if (toggle) selection.toggle(entry.id);
    else selection.set([entry.id]);
    anchor = entry.id;
  }
  focusId.value = entry.id;
};

const openEntry = (entry: Entry) => {
  // Folders open (not in the Trash, where nothing does); files show their info.
  if (isFolder(entry) && !drive.inTrash.value) drive.open(entry);
  else drive.info.value = true;
};

// A tap opens a folder, as on a phone; a long press picks it up.
const pick = (entry: Entry, event: MouseEvent) =>
  touch && isFolder(entry) ? openEntry(entry) : select(entry, { extend: event.shiftKey, toggle: event.ctrlKey || event.metaKey });

/** The menu acts on the selection: a right click on an entry outside it picks that one. */
const openMenu = (point: { x: number; y: number }, entry?: Entry) => {
  if (!entry) selection.clear();
  else if (!selection.has(entry.id)) select(entry);
  drive.menu.value = point;
};

// ─── Keys ─────────────────────────────────────────────────────────────────────

const focusEntry = (entry: Entry) => {
  focusId.value = entry.id;
  list.value?.querySelector<HTMLElement>(`[data-id="${entry.id}"]`)?.focus();
};

let typed = '';
let typedAt = 0;

const onKeydown = (event: KeyboardEvent) => {
  // Space picks the focused entry up (the provider's `keyboard`); the keys of a keyboard drag
  // and of the name being edited aren't ours.
  if (status.value === 'dragging' || event.target instanceof HTMLInputElement) return;
  const all = items.value;
  const at = all.findIndex((entry) => entry.id === tabStop.value);
  const entry = all[at];
  if (!entry) return;
  const mod = event.ctrlKey || event.metaKey;
  const columns = grid.value && list.value ? getComputedStyle(list.value).gridTemplateColumns.split(' ').length : 1;
  const steps: Record<string, number> = grid.value
    ? { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns, Home: -at, End: all.length }
    : { ArrowUp: -1, ArrowDown: 1, Home: -at, End: all.length };

  if (event.key in steps && !event.altKey) {
    event.preventDefault();
    const next = all[Math.min(Math.max(at + steps[event.key]!, 0), all.length - 1)]!;
    // Arrows select as they go, Shift+arrows extend; with Ctrl/Cmd only the focus moves.
    if (!mod) select(next, { extend: event.shiftKey });
    focusEntry(next);
  } else if (event.key === 'Enter') {
    openEntry(entry);
  } else if (event.key === 'F2' && !drive.inTrash.value) {
    selection.set([entry.id]);
    drive.renaming.value = entry.id;
  } else if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    if (drive.inTrash.value) drive.deleteForever(drive.selected.value);
    else drive.moveToTrash(drive.selected.value);
  } else if (mod && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    selection.set(all.map((item) => item.id));
  } else if (event.key === 'Escape' && selection.ids.size) {
    // Handled: the expanded stage around the demo stays open.
    event.preventDefault();
    selection.clear();
  } else if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
    event.preventDefault();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    openMenu({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, entry);
  } else if (event.key.length === 1 && !mod && !event.altKey) {
    // Typing a name jumps to it.
    typed = (event.timeStamp - typedAt < 800 ? typed : '') + event.key.toLowerCase();
    typedAt = event.timeStamp;
    const match = all.find((item) => item.name.toLowerCase().startsWith(typed));
    if (match) {
      select(match);
      focusEntry(match);
    }
  }
};

// The focused entry went away (to the Trash, into a folder): its neighbour takes the focus,
// so the keys go on working.
watch(
  items,
  (now, before) => {
    if (!focusId.value || now.some((entry) => entry.id === focusId.value) || document.activeElement !== document.body) return;
    const next = now[Math.min(before.findIndex((entry) => entry.id === focusId.value), now.length - 1)];
    if (next) focusEntry(next);
  },
  { flush: 'post' },
);

const onFocusin = (event: FocusEvent) => {
  const id = (event.target as HTMLElement).closest<HTMLElement>('[data-id]')?.dataset.id;
  if (id) focusId.value = id;
};

// ─── The list's header ────────────────────────────────────────────────────────

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'modified', label: 'Date modified' },
  { key: 'size', label: 'Size' },
  { key: 'kind', label: 'Kind' },
];
</script>

<template>
  <div
    ref="area"
    class="area"
    :class="{ icons: grid }"
    @pointerdown.capture="onPress"
    @contextmenu.prevent="openMenu({ x: $event.clientX, y: $event.clientY })"
  >
    <div v-if="!grid && items.length" class="columns">
      <button
        v-for="column in COLUMNS"
        :key="column.key"
        type="button"
        class="column"
        :class="[column.key, { sorted: drive.sort.value.key === column.key }]"
        @click="drive.sortBy(column.key)"
      >
        {{ column.label }}
        <Glyph v-if="drive.sort.value.key === column.key" :name="drive.sort.value.dir === 1 ? 'up' : 'down'" class="arrow" />
      </button>
    </div>

    <ul
      ref="list"
      class="entries"
      role="listbox"
      aria-multiselectable="true"
      :aria-label="drive.current.value.name"
      @keydown="onKeydown"
      @focusin="onFocusin"
    >
      <component
        :is="grid ? FileTile : FileRow"
        v-for="entry in items"
        :key="entry.id"
        :entry="entry"
        :tabbable="entry.id === tabStop"
        @pick="(event: MouseEvent) => pick(entry, event)"
        @open="openEntry(entry)"
        @menu="(event: MouseEvent) => openMenu({ x: event.clientX, y: event.clientY }, entry)"
      />
    </ul>

    <div v-if="!items.length" class="empty">
      <span class="badge"><Glyph :name="drive.inTrash.value ? 'trash' : 'upload'" /></span>
      <strong>{{ drive.inTrash.value ? 'The Trash is empty' : 'This folder is empty' }}</strong>
      <span>{{ drive.inTrash.value ? 'What you delete waits here until you empty it.' : 'Drag files here from another folder, or from your desktop.' }}</span>
    </div>

    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>

<style scoped>
/* The selection area and the drop zone: positioned, so the band can be placed in it. */
.area {
  --columns: minmax(0, 1fr) 156px 84px 124px;
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 10px 12px 16px;
  container: files / inline-size;
  animation: show 0.2s ease-out;
}

/* A folder opens: its entries come in. */
@keyframes show {
  from {
    opacity: 0;
    translate: 0 6px;
  }
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Icons grow with the view, times the status bar's slider (`--zoom`). */
.icons .entries {
  --icon: calc(68px * var(--zoom, 1));
  --tile: calc(var(--icon) + 40px);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--tile), 1fr));
  gap: 6px 4px;
}

@container files (min-width: 1000px) {
  .icons .entries {
    --icon: calc(88px * var(--zoom, 1));
    --tile: calc(var(--icon) + 48px);
  }
}

/* The list's header: the same columns as the rows, stuck to the top while it scrolls. */
.columns {
  position: sticky;
  top: -10px;
  z-index: 1;
  display: grid;
  grid-template-columns: var(--columns);
  gap: 12px;
  margin: -10px -12px 4px;
  padding: 0 24px 0 12px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  background: color-mix(in srgb, currentColor 2%, Canvas);
}

.column {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: 600 11.5px/1 system-ui, sans-serif;
  white-space: nowrap;
  opacity: 0.55;
  cursor: pointer;
}

.column:hover,
.column.sorted {
  opacity: 1;
}

.column:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
  border-radius: 4px;
}

.column.size {
  justify-content: flex-end;
}

.arrow {
  font-size: 12px;
  color: #42b883;
}

.empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px;
  text-align: center;
  pointer-events: none;
}

.empty .badge {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-bottom: 6px;
  border: 1.5px dashed color-mix(in srgb, currentColor 25%, transparent);
  border-radius: 16px;
  font-size: 22px;
  opacity: 0.6;
}

.empty strong {
  font-size: 14px;
}

.empty span:last-child {
  max-width: 260px;
  font-size: 12.5px;
  line-height: 1.45;
  opacity: 0.55;
}

.band {
  border: 1px solid #42b883;
  border-radius: 4px;
  background: color-mix(in srgb, #42b883 14%, transparent);
}

@container files (max-width: 560px) {
  .entries,
  .columns {
    --columns: minmax(0, 1fr) 140px 76px;
  }

  .column.kind {
    display: none;
  }
}

@container files (max-width: 400px) {
  .icons .entries {
    --icon: calc(58px * var(--zoom, 1));
    --tile: calc(var(--icon) + 34px);
  }

  .entries,
  .columns {
    --columns: minmax(0, 1fr) 76px;
  }

  .column.modified {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .area {
    animation: none;
  }
}
</style>
