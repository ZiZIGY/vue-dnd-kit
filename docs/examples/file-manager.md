---
title: "File manager"
description: "A cloud drive — grid and list views, a rubber band, folders that take drops everywhere and open on hover, Alt to copy, a Trash with Undo, and files dropped in from your desktop."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/examples/file-manager"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Draw a box around files, drop them on a folder; Alt copies" name="file-manager" title="File manager">



</example>

## What to look at

- **FileView.vue**: the open folder is one sortable list, shown as a grid of tiles or a list of
rows. The rubber band, the clicks and the keys select; a drag takes the selection.
- **useFolderDrop.ts**: every folder on screen is a drop target: tiles, rows of the tree,
favorites, the crumbs of the path, the Trash. It says why it refuses a drag, and gulps when
the files are in.
- **FilesOverlay.vue**: what follows the pointer, built from the props every overlay gets: a
pile of the real tiles with a count, a "+" while Alt copies, and what the drop would do.
- **SidebarRow.vue**: a closed folder of the tree opens when a drag rests on it, so its
subfolders can take the drop. **Favorites.vue** is a sortable list of its own, whose rows
are drop targets too.
- **useDesktopDrop.ts**: files dragged in from your computer. That is the browser's drag and
drop, not the library's, handled next to it.
- **drive.ts**: the state and every change, with Undo. **index.vue**: the provider, with
the keys rebound and its announcements.

## One list, two views

The grid and the list are the same sortable list. Its options are getters, read when a drag
starts: the strategy follows the view, and a folder sorted by a column (`sort: false`) doesn't
reorder. Drags still go into its folders.

```ts [FileView.vue]
const { items } = makeSortableList(list, {
  items: drive.entries,   // the open folder, sorted by a column or in your own order
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  sort: () => drive.sort.value.key === 'manual',
  multiple: 'gaps',       // the other picked files wait in place, as in Finder
  clone: drive.duplicateOf, // Alt-drag leaves the files and drops "Budget copy.xlsx"
  dropzone: area,         // the empty space takes drops too
  animateChanges: true,   // a new sort, a new folder, files sent to the Trash slide and fade
});
```

- `drive.entries` is a writable computed: the library writes each drop back through its `set`,
and the list's `onDrop` saves the drive first, for Undo.
- The window makes a new view for every folder (`:key` on `FileView`), so opening one is no
change of the list for `animateChanges` to play.

## Selecting

The provider keeps the selection; the view decides how people make it. A press on the empty
space draws a band: alone it replaces the selection, with Shift, Ctrl or Cmd held it flips the
tiles it crosses. The strategy is a getter, read when a band starts:

```ts [FileView.vue]
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});

// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
};
```

Clicks follow Finder: a click picks one, Ctrl/Cmd-click adds or removes it, Shift-click takes
the run from the last one. The arrows move a single tab stop through the files (a roving
`tabindex`, which the library leaves alone), Shift+arrows extend, Enter opens, F2 renames,
Delete sends to the Trash, typing jumps to a name. The provider gives Enter back to the app:
Space alone picks a file up.

```vue [index.vue]
<script setup lang="ts">
// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };
</script>

<template>
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
```

## Folders take drops everywhere

`useFolderDrop` makes any element a folder that takes files. A tile is also a sortable item of
the grid: there the target counts only in the middle of the tile, and near its edges the grid
makes room. `accept` refuses the folder the files are in, and a folder into itself; a refused
tile lets the grid sort over it as over any other.

```ts [useFolderDrop.ts]
const { id, isOver, isAccepting } = makeDroppable(target, {
  disabled: () => !folder(),
  data: () => drive.placeOf(folder()!),   // { name, trash, why }: the overlay reads it as `over.data`
  accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
  onDrop: (event) => drive.dropInto(event, folder()!),
});

// The files are in once the overlay has landed in the folder: it gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
  },
});
```

`dropInto` moves the files, or copies them when `event.mode` is `'copy'` (Alt held over a list
with `clone`). A move calls `event.source.remove()`: the grid lets the files go, and its
`onDrop` runs with `to.index === -1`.

```ts [drive.ts]
const dropInto = (event: DnDEvent, target: FolderEntry) => {
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
  record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
  if (copying) return put(target, dragged.map(copyEntry), current.value);
  put(target, dragged, current.value);
  // The grid lets them go: the library writes the open folder without them.
  event.source?.remove();
  selection.delete(...event.active.ids);
};
```

A favorite is a sortable item (in `Favorites.vue`, a list of its own group) and a drop target
at once: `FavoriteRow.vue` hands the row component to `makeSortableItem`, which reads its root
element, and `SidebarRow.vue` makes the same element a folder. Near its edges a dragged
favorite sorts; files dropped on it go into its folder.

### Spring-loaded folders

A closed folder of the tree opens when a drag rests on it, as in Finder: `isOver` holds for a
moment, and the row expands. Its subfolders mount mid-drag and take drops at once.

```ts [SidebarRow.vue]
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), 700);
});
```

## The overlay

`FilesOverlay.vue` is the list's `overlay`. From the grid it piles up `DragPreview`s, the real
clones of the picked tiles: dropped on a slot, each lands on its own tile; dropped into a folder,
they go in one after another. A row is as wide as the list, so the list centers the box on the
pointer (`snapCenterToCursor`) and the overlay hangs a small chip off it. The overlay is a
function, which Vue takes as a functional component: it passes on the props it reads and says
which of the two to draw.

```ts [FileView.vue]
overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
  h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
```

Under the pile, a pill says what letting go would do, from the folder's `data`: "Move to
Photos", "Copy to Photos" while Alt is held (`mode`), or in red why not, where `accepted` is
`false`.

```ts [FilesOverlay.vue]
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
```

The provider's `announcements` read the same `data`, so a screen reader hears "Over Photos.
Drop to move 3 items there", or "Already in Documents". They name the files, where the
built-in texts would say their keys.

## Files from your desktop

Drag files from your computer onto the window: they upload into the folder under the pointer
(a tile, a row of the sidebar, a crumb), else into the open one, and photos show themselves.
The library drags elements of the page; files from outside come with the browser's own drag and
drop, `dragover` and `drop`, handled next to it:

```ts [useDesktopDrop.ts]
const dragover = (event: DragEvent) => {
  if (!carriesFiles(event)) return;
  // Cancelled, a `dragover` says the drop is welcome here.
  event.preventDefault();
  const folder = folderAt(event); // under the pointer: an element with a folder's `data-id`
  // …nothing goes into the Trash…
  drive.uploadTarget.value = folder.id; // that folder opens, as for the library's drags
};
```

## Undo, the Trash, and the rest

- Every change saves a copy of the drive first; the toast's Undo (or Ctrl/Cmd+Z) goes back to
it. The Trash is a folder outside the tree: what is in it remembers where it came from, and
Put Back takes it there.
- `ContextMenu.vue` (a right click, Shift+F10 or the "⋯" button) acts on the selection, or on
the open folder: Rename in place, Duplicate, Add to Favorites, Move to Trash, Empty Trash.
- The window fills the stage when you expand it, and the info pane opens beside the files. On a
phone the sidebar is a drawer; a tap opens a folder and a long press picks a file up.

Read more: [Multi-drag and selection](https://zizigy.github.io/docs/guides/multi-drag) ·
[Drop into a sortable item](https://zizigy.github.io/docs/guides/drag-and-drop#drop-into-a-sortable-item) ·
[`DragPreview`](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[Data changes: `animateChanges`](https://zizigy.github.io/docs/guides/animations#data-changes-animatechanges) ·
[Accessibility](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
