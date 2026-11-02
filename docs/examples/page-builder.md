---
title: "Page builder"
description: "A landing page assembled by drag and drop — sections from a palette that turn into the real thing over the page, elements moved between columns, a layers tree on the same data, inline editing, device widths and undo."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/examples/page-builder"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="45rem" hint="Drag a section or an element onto the page; double-click a text to edit it" name="page-builder" title="Page builder">



</example>

Expand the frame to the full screen: the palette docks on the left, the layers on the right,
and the page takes the room in between. Narrower, they share a drawer opened from the top bar.

## What to look at

- **Canvas.vue**: the page is a sortable list of sections with `placeholder: 'indicator'`. It
stays still while a section travels, and a line between two sections says where it goes:
sliding 500px sections out of the way on every slot would shake the whole page. `dropzone`
hands the drop to the whole canvas, so a section let go beside or below the page still lands.
- **ColumnList.vue**: every column of every section is a list of the group `blocks`. Elements
move between columns and sections and sort live: the page shows the result while you drag.
Each column is a component of its own, and the columns are lists inside the items of
another list.
- **Palette.vue**: the section templates are a list of the page's group with `pull: 'clone'`,
`put: false` and `sort: false`: it hands out copies and takes nothing back. The elements below
them (**ElementChip.vue**) are plain draggables, and a column makes the block with
`createItem`.
- **Layers.vue**: the same page as a sortable tree, on the same data. A row moved there moves
on the page, and the other way round.
- **builder.ts**: the page, the selection, the device and the history. Drops write the page
through the lists; the toolbar's buttons and the shortcuts change it here. Each change is a
step of undo.

## A section in hand is the real section

**SectionGhost.vue** is the overlay of both the page's sections and the palette's templates.
Over the page (`to.list` is the page's list), it renders the section itself, at the page's width,
scaled down under the pointer. When the drop is decided (`status: 'dropping'`), it scales back
to 1 while the box flies to the section's place: it lands on it exactly. The drop waits for that
transition, so nothing jumps at the end.

```vue [SectionGhost.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; status: DnDStatus; to: DropDestination | null }>();
const section = computed(() => props.items[0]!.item as Section);
const fromPalette = computed(() => !find(section.value.id));
const onPage = computed(() => props.to?.list === PAGE);

const look = computed(() => {
  if (fromPalette.value && !onPage.value) return 'card'; // still the palette's card
  return props.status === 'dropping' ? 'landing' : 'ghost';
});
</script>

<template>
  <DragPreview v-if="look === 'card'" :id="items[0]!.id" :style="{ width: '100%', height: '100%' }" />
  <div v-else class="replica" :class="look" :style="{ width: `${pageWidth}px`, '--shrink': shrink }">
    <SectionView :section="section" />
  </div>
</template>

<style scoped>
.replica { transform-origin: 0 0; scale: var(--shrink); transition: scale 0.25s ease; }
.replica.landing { scale: 1; }
</style>
```

Away from the page, a template stays what it was in the palette: `DragPreview` shows the
library's copy of its card. The section's place on the page is the slot: while you drag it waits
there, faded; dropped, its new place stays empty until the overlay has landed on it.

```css [PageSection.vue]
.page-section[data-dnd-placeholder] { opacity: 0; }
html[data-dnd-dragging] .page-section[data-dnd-placeholder] { opacity: 0.35; }
```

Each section draws the line from its own `indicator`, and says what the drop does: *Move
Features here*, or *Add Pricing here* for a template.

## Elements: in the colors of the section they go into

Blocks are dragged by their whole body; a section by the grip of its tag, as its body is
content to click and drag. **BlockGhost.vue**, the overlay of blocks and chips, reads the
column it would go into from `to` and takes its section's colors: a button over the dark footer
turns light before you let go. The box has the size of the block's slot there (`overlayFit: 'slot'`, the default), and the block lays out in it as it will after the drop.

```ts [BlockGhost.vue]
// The column it would go into (`to.list` is the column's id): its section's tone.
const look = computed(() => {
  const at = props.to && find(String(props.to.list));
  return at ? { ...TONES[SECTIONS[at.section.kind].tone], ...typeScale(pageWidth.value) } : null;
});
```

A chip of the palette is a plain draggable that carries its kind. Each column makes a block from
it, and the new block sits in the column, rendered by the column's own template, until you let
go or move on:

```ts [ColumnList.vue]
makeSortableList(list, {
  id: props.column.id,
  items: blocks,
  group: 'blocks',
  overlay: BlockGhost,
  createItem: (active) => {
    const kind = (active.data as ChipData | undefined)?.kind;
    return kind ? createBlock(BLOCKS[kind].spec) : undefined;
  },
});
```

`blocks` is a writable `computed` over `props.column.blocks` rather than `toRef`: undo puts new
objects in the page, and the column must follow them.

## Templates: copies out, nothing in

```ts [Palette.vue]
makeSortableList(list, {
  id: 'templates',
  items: templates,
  group: { name: 'sections', pull: 'clone', put: false },
  sort: false,
  clone: (template) => createSection(template.kind), // new ids all the way down
  overlay: SectionGhost,
});
```

The templates are real sections, so their cards show them (zoomed out) and the overlay can
render them. A click on a card, or <kbd value="Enter">



</kbd>

, adds the section after the selected one:
the page can be built without dragging at all.

## Layers: the same page as a tree

```ts [Layers.vue]
makeSortableTree(tree, {
  id: LAYERS,
  items: sections as Ref<LayerNode[]>,
  // Keys of their own: the canvas's lists already drag these ids.
  getKey: (node) => `layer-${node.id}`,
  getChildren: (node) => (isSection(node) ? node.columns : isColumn(node) ? node.blocks : undefined),
  setChildren: (node, children) => { … },
  // Blocks go into columns, nothing into blocks, sections stay at the top.
  canNest: (node, parent) => levelOf(node) === levelOf(parent) + 1,
  maxDepth: 2,
  placeholder: 'indicator',
  // A tree takes any row at its top level: a block let go there flies back.
  onBeforeDrop: (event) => (event.to.parentKey !== null || event.items.every(isSection) ? 'accept' : 'reject'),
});
```

Keys are shared by the whole provider, so the rows get keys of their own. The columns are rows
too, `disabled`: they take blocks and stay where they are. Where a block can't go, between two
sections, its line turns red. Hovering a row outlines its node on the page; selecting a node on
the page opens its section here and scrolls its row into view.

## Editing in place, and the keyboard

A block drags from anywhere on it, so its texts aren't editable until you double-click it: then
they are `contenteditable`, and `canDrag` turns the drags down so a press places the caret.
**EditableText.vue** writes the DOM from the model only while the text isn't being edited, so
the caret never jumps, and undo still shows.

The provider keeps <kbd value="Space">



</kbd>

 for drags and leaves <kbd value="Enter">



</kbd>

 to the editor:

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'], drop: ['Space', 'Enter'], cancel: ['Escape'] } }"
  :announcements="announcements"
  :screen-reader-instructions="instructions"
>
```

Tab to a block: <kbd value="Space">



</kbd>

 picks it up and the arrows move it through its column and
into the next ones; <kbd value="Enter">



</kbd>

 edits it. A section moves by its grip the same way, or by
the arrows of its toolbar. <kbd value="Ctrl">



</kbd>

 <kbd value="Z">



</kbd>

 undoes, <kbd value="Delete">



</kbd>


removes, <kbd value="Ctrl">



</kbd>

 <kbd value="D">



</kbd>

 duplicates. Screen readers hear "the Hero section,
position 3 of 7 on the page" rather than ids.

## Undo, and changes without a drag

Every drop is one step of the history: a monitor saves the page once the lists have written it.

```ts [Builder.vue]
useDnDMonitor({ onDragEnd: () => builder.commit() });
```

Undo puts a snapshot back. The lists have `animateChanges` on, so what the snapshot moved slides there,
as do the sections the toolbar moves up and down; added sections fade in and deleted ones out.

Read more: [Sortable lists](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line) ·
[Lists that share items](https://zizigy.github.io/docs/guides/shared-lists) · [Trees](https://zizigy.github.io/docs/guides/trees) ·
[The overlay](https://zizigy.github.io/docs/guides/overlay) · [Animations](https://zizigy.github.io/docs/guides/animations) ·
[Accessibility](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
