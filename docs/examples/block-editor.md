---
title: "Block editor"
description: "A Notion-like page — blocks dragged by their handles and nested sideways, a selection box that moves several at once, new blocks dragged out of a \"/\" menu or a sidebar, copies with Alt, and Undo for all of it."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/examples/block-editor"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Drag ⋮⋮ to move a block, sideways to nest it; type / for new blocks" name="block-editor" title="Block editor">



</example>

Every block has a handle (⋮⋮) and a "+" in the margin. Type in any block: Enter starts the
next one, Tab nests it, "/" opens the menu of new blocks, and Markdown works ("## ", "- ",
"<span>



</span>

 "). Draw a box in the margin to select several blocks, then drag them together. Expand the
frame: on a wide screen the blocks to add and the page's outline get sidebars of their own.

## What to look at

- **Page.vue**: the page is one sortable tree, with `placeholder: 'indicator'`: the page stays
still while you drag, and a line shows where the blocks land and at which level. The sheet
around the blocks is its `dropzone`, so a drop below the last block lands at the end.
- **BlockRow.vue**: one block. Only its handle drags (`handle`), so the text stays editable
and selectable. The handle is a button: a click selects the block and opens its menu, Space
picks the block up for the keyboard.
- **BlockText.vue** and **Editable.vue**: plain `contenteditable` text with the keys of an
editor. Typing goes from the DOM into the model; the model goes back into the DOM only when
something else changed it (Undo, a merge), so the caret never jumps.
- **editor.ts**: the document and every edit to it, with no drag and drop in it: split, merge,
indent, duplicate, turn into, and a history that takes back drops and typing alike.

## Nesting by dragging sideways

```ts [Page.vue]
const { items } = makeSortableTree(root, {
  id: 'page',
  items: editor.blocks,
  group: 'blocks',
  placeholder: 'indicator',
  nesting: 'offset',        // sideways: every 24px is a level
  indentation: INDENT,
  maxDepth: MAX_DEPTH,
  canNest: (_block, parent) => !!KINDS[parent.kind].nests,
  collapsed: editor.collapsed,
  clone: copyBlock,         // Alt-drag copies a block with what is nested in it
  createItem: (active) => createBlock((active.data as { kind: BlockKind }).kind),
  animateChanges: true,
  overOverlay: BlockGhost,
  dropzone: sheet,
  onDrop, // see Undo, below
});
```

`nesting: 'offset'` takes the level from the drag's sideways offset only: hovering the middle of
a paragraph doesn't drop into it, as in a document editor. `canNest` says which blocks take
nested blocks (paragraphs, lists, to-dos, toggles, quotes, callouts; not headings, code or
images), and when the block above refuses, the line stays at the deepest level that passes. A closed toggle
(`collapsed`) still takes blocks: a line one level in under it puts them inside, first.

Each row draws the line from its `indicator`, from the level the drop lands at. Numbered lists
count from `items`, so "2." and "a." follow every drop and every Tab. `animateChanges: true` makes the
changes no drag makes slide and fade too: Enter, Tab, Delete, Undo, a toggle opening.

```ts [BlockRow.vue]
const { indicator, selected } = makeSortableItem(el, {
  id: () => props.node.key,
  handle: '.handle',
  // A mouse press on a handle drags at once; after 4px instead, a click stays a click.
  activation: { mouse: { distance: 4 } },
  // Enter opens the block's menu; Space picks the block up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});

const line = computed(() => {
  const at = indicator.value;
  if (!at || at.side === 'inside') return null;
  return { side: at.side, left: `${((at.depth ?? 0) - props.node.depth) * props.indent}px` };
});
```

## Selecting several

The page is a selection area: a box drawn from its margins selects the blocks it touches.
`strategy: 'select'` makes a click on the empty margin clear the selection, and `accept` keeps
the box to blocks. A click on a handle selects its block, Shift-click a run of blocks,
Ctrl/Cmd-click one more; Escape in a text selects its block. Then:

```ts [Page.vue]
const { isSelecting, style } = makeSelectionArea(scroller, {
  strategy: 'select',
  accept: 'blocks',                     // the rows' type: their group's name
  disabled: () => menu.value !== null,  // a press closes the menu first
});
```

Drag one selected block and the others come along: the tree moves them as one run, each with
what is nested in it, in reading order. Delete removes them, Ctrl/Cmd+D duplicates them, and
the handle's menu turns them into another kind. The arrows go from handle to handle, Shift
adds to the selection.

## New blocks from a menu

"+" in the margin and "/" in a block open the same menu. A click adds the block below; each
option is also a plain draggable, which the tree's `createItem` turns into a new block where it
is dropped. The sidebar of wide screens lists the same options, and there Space picks one up
for the keyboard: an arrow toward the page takes it in.

```ts [InsertOption.vue]
makeDraggable(el, {
  id: () => `new-${props.kind}${props.option ? '-option' : ''}`,
  type: 'new-block',
  data: () => ({ kind: props.kind }),
  attributes: () => !props.option, // in the menu, an option of its listbox
});
```

While an option travels, the menu fades out so the page shows where it goes, and it closes once
the new block has landed:

```ts [Page.vue]
useDnDMonitor({
  onDragStart: ({ active }) => (lifted.value = !!popover.value?.contains(active.element)),
  onDragSettle: () => {
    if (!lifted.value) return;
    lifted.value = false;
    menu.value = null;
  },
});
```

## What the drop will do

**BlockGhost.vue** is the tree's `overOverlay`: while a drag is over the page, it wraps the
drag's own overlay (`<slot />`, the clone of the blocks or of the option) with a count and a
note. `to.parentKey` names the block the drop would go into, and `mode` says when it copies.

```vue [BlockGhost.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; mode: DragMode; to: DropDestination | null }>();

// A new block: a kind dragged from the menu or the sidebar, by its `type`.
const adding = computed(() => props.items[0]?.type.includes('new-block'));

const note = computed(() => {
  const verb = props.mode === 'copy' ? 'Copy' : adding.value ? 'Add' : null;
  const parent = props.to?.parentKey == null ? undefined : editor.get(String(props.to.parentKey));
  if (!parent) return verb; // a plain move at the page's top level needs no words
  return `${verb ? `${verb} into` : 'Into'} “${parent.text}”`; // "Copy into “Open questions”"
});
</script>

<template>
  <div class="ghost">
    <slot />
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
    <span v-if="note" class="note">{{ note }}</span>
  </div>
</template>
```

## Undo

The tree writes each drop into `editor.blocks`, a writable ref. Its `onDrop` runs just before
that write, so it records the page as it was, and Undo takes the drop back. Every other edit
records itself the same way; the keystrokes typed in one block make a single step.

```ts [Page.vue]
onDrop: (event) => {
  editor.record(); // the library writes the drop after this: Undo takes it back
  const first = event.items[0]!.id;
  if (event.mode === 'insert') editor.focus(first, 'start');
  else editor.focusHandle(first);
},
```

```ts [editor.ts]
/** Called before every change: the state it changes goes on the undo stack. */
const record = () => {
  past.value = [...past.value.slice(-99), capture()];
  future.value = [];
  typing = null;
};
```

The history holds copies of the blocks with their ids, so a block keeps its row and its
selection across Undo and Redo. After a drop, a new block takes the caret, and a moved one
gives the focus to its handle: its row moved in the page, which drops the focus, and the
shortcuts go on working from the handle.

## Keyboard and screen readers

Escape in a text selects the block and focuses its handle. From there Space picks it up, the
arrows move the line (left and right: a level out or in), Space drops it; Enter opens its menu,
Delete removes it. The provider's `announcements` speak blocks by their kind and text ("Picked
up to-do list “Freeze the API”"), and the top bar's status line speaks what the buttons and
shortcuts do.

Read more: [Trees](https://zizigy.github.io/docs/guides/trees) ·
[Multi-drag and selection](https://zizigy.github.io/docs/guides/multi-drag#rubber-band-selection) ·
[Plain draggables into a list](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list) ·
[Targets that change the overlay](https://zizigy.github.io/docs/guides/overlay#targets-that-change-the-overlay) ·
[When a press becomes a drag](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag) ·
[Accessibility](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
