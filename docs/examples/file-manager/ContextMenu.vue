<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Glyph, { type GlyphName } from './Glyph.vue';
import { DRIVE } from './drive';
import { isFolder } from './files';

/**
 * The menu of a right click, Shift+F10 or the toolbar's "More": for the selection, or for
 * the open folder when nothing is selected. Arrows move, Enter picks, Escape closes.
 */
const drive = inject(DRIVE)!;
const { selection } = useDnD();

interface Item {
  label: string;
  glyph: GlyphName;
  run: () => void;
  keys?: string;
  danger?: boolean;
}

const groups = computed((): Item[][] => {
  const picked = drive.selected.value;
  const one = picked.length === 1 ? picked[0]! : null;
  const folder = one && isFolder(one) ? one : null;
  const info: Item = { label: 'Get Info', glyph: 'info', run: () => (drive.info.value = true) };

  if (drive.inTrash.value) {
    if (!picked.length) {
      return drive.trash.value.children.length ? [[{ label: 'Empty Trash', glyph: 'trash', danger: true, run: drive.emptyTrash }]] : [[info]];
    }
    return [
      [{ label: 'Put Back', glyph: 'restore', run: () => drive.putBack(picked) }, info],
      [{ label: 'Delete Forever', glyph: 'trash', keys: 'Del', danger: true, run: () => drive.deleteForever(picked) }],
    ];
  }
  if (!picked.length) {
    return [
      [{ label: 'New Folder', glyph: 'folder-plus', run: drive.newFolder }],
      [
        { label: 'Select All', glyph: 'select', keys: 'Ctrl A', run: () => selection.set(drive.entries.value.map((entry) => entry.id)) },
        drive.view.value === 'grid'
          ? { label: 'View as List', glyph: 'list', run: () => (drive.view.value = 'list') }
          : { label: 'View as Grid', glyph: 'grid', run: () => (drive.view.value = 'grid') },
        info,
      ],
    ];
  }
  return [
    [...(folder ? [{ label: 'Open', glyph: 'open', keys: 'Enter', run: () => drive.open(folder) } as Item] : []), info],
    [
      ...(one ? [{ label: 'Rename', glyph: 'pencil', keys: 'F2', run: () => (drive.renaming.value = one.id) } as Item] : []),
      { label: 'Duplicate', glyph: 'copy', run: () => drive.duplicate(picked) },
      ...(folder
        ? [{ label: drive.isFavorite(folder) ? 'Remove from Favorites' : 'Add to Favorites', glyph: 'star', run: () => drive.toggleFavorite(folder) } as Item]
        : []),
    ],
    [{ label: 'Move to Trash', glyph: 'trash', keys: 'Del', danger: true, run: () => drive.moveToTrash(picked) }],
  ];
});

// ─── Placing it, focus, closing ──────────────────────────────────────────────

const menu = useTemplateRef<HTMLElement>('menu');
/** In the window's coordinates, kept inside it: the menu opens up or left near its edges. */
const place = ref({ left: '0px', top: '0px' });
/** What had the focus: it gets it back when the menu closes. */
const opener = document.activeElement as HTMLElement | null;

const close = () => {
  drive.menu.value = null;
  if (opener?.isConnected) opener.focus();
};
const run = (item: Item) => {
  close();
  item.run();
};

const buttons = () => [...(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
const onKeydown = (event: KeyboardEvent) => {
  const all = buttons();
  const at = all.indexOf(document.activeElement as HTMLElement);
  const next = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: all.length - 1 }[event.key];
  if (next !== undefined) {
    event.preventDefault();
    all[(next + all.length) % all.length]?.focus();
  } else if (event.key === 'Escape' || event.key === 'Tab') {
    event.preventDefault();
    close();
  }
};

// A press anywhere else closes it.
const onPointerdown = (event: PointerEvent) => {
  if (!menu.value?.contains(event.target as Node)) drive.menu.value = null;
};

onMounted(() => {
  const element = menu.value!;
  const frame = (element.offsetParent ?? document.body).getBoundingClientRect();
  const { x, y } = drive.menu.value!;
  const left = x + element.offsetWidth > frame.right - 6 ? x - element.offsetWidth : x;
  const top = y + element.offsetHeight > frame.bottom - 6 ? y - element.offsetHeight : y;
  place.value = {
    left: `${Math.max(6, left - frame.left)}px`,
    top: `${Math.max(6, top - frame.top)}px`,
  };
  buttons()[0]?.focus();
  document.addEventListener('pointerdown', onPointerdown, true);
});
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerdown, true));
</script>

<template>
  <div ref="menu" class="menu" role="menu" aria-label="Actions" :style="place" @keydown="onKeydown" @contextmenu.prevent>
    <template v-for="(group, index) in groups" :key="index">
      <div v-if="index" class="separator" role="separator" />
      <button v-for="item in group" :key="item.label" type="button" role="menuitem" :class="{ danger: item.danger }" @click="run(item)">
        <Glyph :name="item.glyph" class="glyph" />
        {{ item.label }}
        <kbd v-if="item.keys">{{ item.keys }}</kbd>
      </button>
    </template>
  </div>
</template>

<style scoped>
.menu {
  position: absolute;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: 190px;
  padding: 5px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow:
    0 2px 4px rgb(0 0 0 / 0.06),
    0 16px 40px -8px rgb(0 0 0 / 0.35);
  font-size: 13px;
  animation: open 0.14s ease-out;
  transform-origin: top left;
}

@keyframes open {
  from {
    opacity: 0;
    scale: 0.96;
  }
}

button {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 30px;
  padding: 0 9px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  white-space: nowrap;
  cursor: default;
}

button:hover,
button:focus-visible {
  outline: none;
  background: #42b883;
  color: #04130c;
}

button.danger {
  color: #e5484d;
}

button.danger:hover,
button.danger:focus-visible {
  background: #e5484d;
  color: #fff;
}

.glyph {
  font-size: 15px;
  opacity: 0.8;
}

kbd {
  margin-left: auto;
  padding-left: 18px;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.separator {
  height: 1px;
  margin: 4px 8px;
  background: color-mix(in srgb, currentColor 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .menu {
    animation: none;
  }
}
</style>
