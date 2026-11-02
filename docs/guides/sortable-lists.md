---
title: "Sortable lists"
description: "Lists, tab strips and grids that reorder while you drag — makeSortableList renders a draft, makeSortableItem makes the rows, and the drop writes the new order into your ref. Handles, a drop line, swaps."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/sortable-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="25rem" hint="Drag a layer by its grip: the panel moves now, the artboard on drop" name="layers-panel">



</example>

## A list and its rows

A sortable list takes two components: the list, and its row.

```vue [LayersPanel.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

const layers = defineModel<Layer[]>({ required: true });
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: layers });
</script>

<template>
  <ul ref="list">
    <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
  </ul>
</template>
```

```vue [LayerRow.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ layer: Layer }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.layer });
</script>

<template>
  <li ref="el">{{ layer.name }}</li>
</template>
```

The row registers with the list it is rendered in. A component may make several lists
(two columns, a list inside a list): each row joins the one whose element holds it, the
innermost for lists inside lists.

## The draft

`makeSortableList` returns `items`, a **draft** of your array. While you drag, the draft
reorders live: the dragged row takes its new slot, and the others slide out of the way.
Your array doesn't change until the drop. Then the library writes the new order into it.

The layers panel above shows both: the panel renders `items` and moves while you drag;
the artboard reads `layers`, the array itself, and restacks only when you let go.

- Render `items`, not your array. Rendering your array, nothing moves until the drop.
- The write happens after the list's `onDrop`. In `onDrop`, your array still holds the
old order and `e.result` the new one.
- `layers` is a regular ref (here a `defineModel`, and the write emits
`update:modelValue`), so the rest of your app sees the change like any other.

```ts
makeSortableList(list, {
  items: layers,
  onDrop: (e) => {
    console.log(e.from.index, '→', e.to.index, e.result.get(e.to.list));
  },
});
```

<tip>

A store, server state or immutable data? Pass a getter or a `computed` instead of a ref.
The library won't write a read-only source: call `e.preventDefault()` and apply `e.result`
yourself. See [controlled lists](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

</tip>

## Keys

Rows are keyed by their data, never by index or by an automatic id. By default the key is
`item.id`, or the item itself for strings and numbers.

```ts
// LayersPanel.vue: your items have another key
makeSortableList(list, { items: layers, getKey: (layer) => layer.uuid });

// LayerRow.vue: `item` is keyed with the list's getKey…
makeSortableItem(el, { item: () => props.layer });
// …or pass the key yourself
makeSortableItem(el, { id: () => props.layer.uuid });
```

- Use the same key in `v-for`: `:key="layer.uuid"`. With `:key="index"` the wrong rows
animate and their state jumps between rows.
- Keys must be unique among all the lists that exchange items.
- Pass `item` and `id` as getters, so a row stays in sync when its props change.

## Handles

By default the whole row starts a drag, except the buttons, inputs and other controls in
it: the eye and the lock of a layer stay plain buttons. Pass `handle` to drag by one part
only:

```vue [LayerRow.vue]
<script setup lang="ts">
makeSortableItem(el, { item: () => props.layer, handle: '.grip' });
</script>

<template>
  <li ref="el">
    <button type="button" class="grip" :aria-label="`Move ${layer.name}`">⠿</button>
    {{ layer.name }}
  </li>
</template>
```

- `handle` is a selector inside the item, or an element ref.
- A mouse drag starts from the handle at once, without the usual 4 px. A press that
doesn't move is still a click: the handle can open a menu on `click`.
- The handle gets the drag's attributes (`role`, `tabindex`, `aria-*`), and keyboard
drags start from it.

Make the handle a `<button type="button">` with an `aria-label`: it is focusable as is,
and screen readers announce its label. A bare `<span>` with an icon also works (the
library gives it `tabindex="0"` and `role="button"`), but it has no meaningful name.

<note>

Touch drags start after a 200 ms long press, so the page can still scroll. To drag at once
from a handle, give the handle `touch-action: none` and the item
`activation: { touch: { distance: 4 } }`.

</note>

## Strategies

`strategy` says how the list is laid out, so the rows make room the right way:

<table>
<thead>
  <tr>
    <th>
      <code>
        strategy
      </code>
    </th>
    
    <th>
      For
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'vertical'
      </code>
      
       (default)
    </td>
    
    <td>
      A column of rows.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'horizontal'
      </code>
    </td>
    
    <td>
      A single row: tabs, chips, a timeline.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'grid'
      </code>
    </td>
    
    <td>
      CSS grids and wrapping flex rows, with items of different sizes too.
    </td>
  </tr>
</tbody>
</table>

A row of tabs is a horizontal list:

<example height="23rem" hint="Drag the tabs; close one, or open a new one" name="browser-tabs">



</example>

```ts [Browser.vue]
const { items } = makeSortableList(strip, {
  items: tabs,
  strategy: 'horizontal',
  axis: 'x',        // the tabs stay on their row
  animateChanges: true, // the buttons open and close tabs: slide the others then too
});
```

The tab's close button keeps working inside the draggable tab, and a click that ends a
drag doesn't select a tab. Rows slide on their own while you drag; `animateChanges` adds the same
for changes no drag made, here the buttons (see [animations](https://zizigy.github.io/docs/guides/animations)).

A grid sorts in two dimensions, with tiles of any size:

<example height="31rem" hint="Drag a photo, the big one too" name="photo-grid">



</example>

```ts [PhotoGrid.vue]
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });
```

```css
.grid { display: grid; grid-template-columns: repeat(4, 76px); grid-auto-rows: 76px; grid-auto-flow: dense; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
```

`grid-auto-flow: dense` keeps the grid packed when a big tile moves. Without it, the
grid leaves holes where a tile no longer fits, and grows a row.

## Lock the axis

```ts
makeSortableList(list, { items: layers, axis: 'y' });
```

`axis: 'y'` keeps the drag on the vertical axis, `'x'` on the horizontal one: the layers
and the tabs above use it. An item's own `axis` wins over its list's. To also keep the
drag inside the list, add the `restrictToParent` modifier. More in
[constraints](https://zizigy.github.io/docs/guides/constraints).

## Style the slot

The dragged row stays in the list as the slot it will land in, and gets
`data-dnd-placeholder`. The default style fades it to 40%, with zero specificity, so any
rule of yours wins:

```css [LayerRow.vue]
.layer[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.layer[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}
```

`makeSortableItem` returns the same state as refs, plus a few more:

<table>
<thead>
  <tr>
    <th>
      Returns
    </th>
    
    <th>
      What it is
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isPlaceholder
      </code>
    </td>
    
    <td>
      This row is the slot a dragged item will land in.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      This row is being dragged (every dragged row, in a multi-drag).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      Its index in the draft: it changes while you drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Writable, bound to the provider's selection.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        indicator
      </code>
    </td>
    
    <td>
      In <a href="#an-insertion-line">
        indicator mode
      </a>
      
      , where the line goes.
    </td>
  </tr>
</tbody>
</table>

The list returns `isOver` and `isAccepting` for its own highlight, and `activeKey` and
`activeIndex`, the dragged item and its place in this list's draft. Every state, with
live demos, is in [styling](https://zizigy.github.io/docs/guides/styling).

## Turning things off

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      What it stops
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       on an item
    </td>
    
    <td>
      This item can't be dragged. The others still move past it: lock a layer above, then drag another one over it.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       on the list
    </td>
    
    <td>
      No drags out of it, no drops into it.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sort: false
      </code>
      
       on the list
    </td>
    
    <td>
      Its items can't be reordered inside it, but can still leave it: a palette, see <a href="/docs/guides/shared-lists#what-goes-in-and-out-pull-and-put">
        lists that share items
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

All of them take a getter or a ref, and apply to the next drag:

```ts [LayerRow.vue]
makeSortableItem(el, { item: () => props.layer, handle: '.grip', disabled: () => props.layer.locked });
```

A row that must stay first or last, whatever the others do, isn't an item at all: render
it outside the list. The Background layer of the panel sits below the `<ul>`.

## Show some of the items

A search box, a tag: `filter` shows the items it returns `true` for, and a drag sorts among
those. The others stay in your array, in their places:

<example height="27rem" hint="Pick a tag or search, then drag a task: the array keeps the hidden ones in place" name="filtered-list">



</example>

```ts [Backlog.vue]
const query = ref('');
const tag = ref<Tag | null>(null);

const { items } = makeSortableList(list, {
  items: tasks,
  filter: (task) => (!tag.value || task.tag === tag.value) && task.title.includes(query.value),
});
```

- `items` holds the matching items: render it as usual. The filter is reactive: typing in
the search box updates the list at once.
- The drop writes the whole array. Each hidden item stays right after the shown item it
followed; when that one is the one that moved, it stays after the nearest one before it
that didn't.
- `e.to.index` and the list's `activeIndex` count the shown items. `e.result` holds the
whole array, hidden items included.

<note>

A `computed` that filters your array and is passed as `items` works too, but it is read
only: you would apply `e.result` yourself and work out where the hidden items go. `filter`
does both.

</note>

## An insertion line

With `placeholder: 'indicator'`, the list stays still while you drag, and a line shows
where the drop goes. You draw the line:

<example height="27rem" hint="Drag an issue: a line shows where it goes" name="issue-table">



</example>

```ts [IssueTable.vue]
const { items, indicator } = makeSortableList(body, { items: issues, placeholder: 'indicator' });
```

```vue [IssueRow.vue]
<script setup lang="ts">
const { indicator } = makeSortableItem(el, { item: () => props.issue });
</script>

<template>
  <div ref="el" class="row" :class="indicator && `drop-${indicator.side}`">…</div>
</template>

<style scoped>
.row.drop-before::before { content: ''; position: absolute; top: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
.row.drop-after::before { content: ''; position: absolute; bottom: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
</style>
```

<table>
<thead>
  <tr>
    <th>
      <code>
        indicator
      </code>
      
       field
    </th>
    
    <th>
      What it holds
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        list
      </code>
    </td>
    
    <td>
      The list the drop goes into.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      The insertion index in the list as rendered.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        key
      </code>
    </td>
    
    <td>
      The item the line is attached to; <code>
        null
      </code>
      
       in an empty list (draw it in the list then).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        side
      </code>
    </td>
    
    <td>
      <code>
        'before'
      </code>
      
       or <code>
        'after'
      </code>
      
       that item; <code>
        'swap'
      </code>
      
       in a list that <a href="#swap-instead-of-shift">
        swaps
      </a>
      
      . Trees add <code>
        'inside'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
      
      , <code>
        parentKey
      </code>
    </td>
    
    <td>
      Trees only: where the drop lands. See <a href="/docs/guides/trees#an-insertion-line">
        trees
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

- The list's `indicator` is set while the line is in that list (the table prints it), and
an item's `indicator` while the line is attached to that item.
- The dragged row stays where it was, marked as the placeholder: fade it.
- The keyboard moves the line, too.
- A drop outside every target cancels in this mode (`dropOutside: 'cancel'`), as the list
never showed another order.
- The overlay covers part of the row under it. Make it a little see-through, and the line
shows through: `[data-dnd-overlay] .row { opacity: 0.85 }`.

## Swap instead of shift

With `behavior: 'swap'`, the dragged item trades places with the one under it, and the
others stay put:

<example height="29rem" hint="Swap two people, across the columns too; try On drop" name="on-call">



</example>

```ts [Rotation.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'rotation',
  behavior: 'swap',
  placeholder: () => props.placeholder,   // 'item' (live) or 'indicator' (on drop)
  onDrop: (e) => {
    if (e.partner) emit('swap', `${e.items[0]?.name} ⇄ ${e.partner.item.name}`);
  },
});
```

- **Live** (`placeholder: 'item'`, default): the swap shows while you drag. Moving back,
or off the list, undoes it.
- **On drop** (`placeholder: 'indicator'`): nothing moves until the drop. The indicator
marks the item the drop exchanges with, `side: 'swap'`: outline that item instead of
drawing a line. The arrows move the mark from item to item; back on the dragged item,
there is none.

```vue [PersonCell.vue]
<li ref="el" :class="{ target: indicator?.side === 'swap' }">…</li>
```

The drop event has `mode: 'swap'` and `partner`, the item it traded with: its `key`,
`item`, and its own `from` and `to`. Two lists of one group swap between them when both
have `behavior: 'swap'`, as the two columns do. The hovered item then moves into the
other list, so it must be allowed out (`group.pull`) and in (`group.put`): see
[lists that share items](https://zizigy.github.io/docs/guides/shared-lists). A multi-drag sorts instead of
swapping.

## Keyboard

Focus a row, or its handle, and press <kbd value="Space">



</kbd>

 or <kbd value="Enter">



</kbd>

 to pick
it up. The arrows along the list move it by one slot, in grids up and down go to the next
row, and the arrows across the list move it to the next list of its group. Past the end of
a list, the arrow goes on into the next list that way (lists stacked one above another),
else onto a drop target there, a trash zone. Press
<kbd value="Space">



</kbd>

 or <kbd value="Enter">



</kbd>

 again to drop, <kbd value="Escape">



</kbd>

 to put it
back. Every demo on this page works that way. The screen reader texts are in
[accessibility](https://zizigy.github.io/docs/guides/accessibility).

## Animations

Rows slide to their new places while you drag, and the dropped row lands on its slot. The
list itself grows or shrinks to its new size as rows come in and leave (`animateSize`). That
is on by default and needs no code. Don't wrap rows in `<TransitionGroup>`: moves would
animate twice. Don't put a CSS `transition` on the rows' `transform` either. For changes
no drag made (adding, removing, shuffling), turn on the list's `animateChanges` option, as the
tabs do. See [animations](https://zizigy.github.io/docs/guides/animations).

The full option list is in the [makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list) and
[makeSortableItem](https://zizigy.github.io/docs/api/make-sortable-item) API.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
