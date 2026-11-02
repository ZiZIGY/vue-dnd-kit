---
title: "The overlay"
description: "What follows the pointer while you drag — the default clone and how to style it, overlay components that change as you drag, several items at once, its size, and where it renders."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/overlay"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

While you drag, a box follows the pointer: the **overlay**. The dragged element itself
stays where it was, as the slot it will land in. On drop, the overlay flies to that slot
and disappears.

The overlay is teleported to `body`, outside your components. By default it shows a clone
of the dragged element.

<example height="22rem" hint="Type in a row, tick it, then drag it by its grip: the copy keeps the values and the chart" name="overlay">



</example>

## The default clone

The clone is taken at pickup, before anything moves. It is a deep copy of the element:

- Form values and `<canvas>` pixels are copied.
- The computed styles the element would lose outside its list are inlined: inherited
fonts and colors, styles that match through ancestors (`.list li { … }`), table cell
widths. A table row comes wrapped in a table of its own.
- `id`s and `data-dnd-*` attributes are stripped, and the clone is `aria-hidden`.
- Ripples and other press effects of UI kits (Vuetify, Quasar, PrimeVue, Naive UI) are
left out.

In the table above, a row you typed in travels with its text, its amount, its tick and its
chart, in a table of its own whose cells keep the widths of the real ones.

Mark anything else that shouldn't travel with **data-dnd-no-clone**: a menu button, a
tooltip, a selection mark. The remove button of each row stays behind:

```vue [ExpenseRow.vue]
<tr ref="el" class="row">
  …
  <td><button type="button" aria-label="Remove" data-dnd-no-clone @click="emit('remove')">×</button></td>
</tr>
```

### Backgrounds aren't guessed

The clone shows the element as it is. A row that has no background of its own, because its
list paints it (an `<li>` in a white `<ul>`, a `v-list-item`, a table row), gives a
**see-through** clone. Give it the list's background in CSS, here on the cells:

```vue [ExpenseRow.vue]
<style scoped>
[data-dnd-overlay] .row td {
  background: color-mix(in srgb, currentColor 4%, Canvas);
}
</style>
```

The clone keeps the element's classes and attributes, Vue's scope attribute included, so
the rule works in the row's scoped style as well as in a global stylesheet. The other way
out is a background on the row itself. Icons and tiles meant to float stay transparent on
purpose.

## Styling the box

The box is the element with `data-dnd-overlay`. It is `position: fixed`, on top
(`z-index: 9999`), `pointer-events: none` and `inert`, and its value says what it is doing:

<table>
<thead>
  <tr>
    <th>
      <code>
        data-dnd-overlay
      </code>
    </th>
    
    <th>
      When
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        "dragging"
      </code>
    </td>
    
    <td>
      It follows the pointer.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        "dropping"
      </code>
    </td>
    
    <td>
      It lands on its slot, flies back, or waits for an async <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

A lifted look while dragging, gone as it lands:

```css
[data-dnd-overlay='dragging'] .row td {
  box-shadow: 0 14px 20px -16px rgb(0 0 0 / 0.7);
}
```

The box moves with `transform` and takes its size as `width` and `height`: style what is
inside it, not the box. The clone fills it, with `width: 100%`, `height: 100%` and
`transform: none` set on its root: turn or grow it with the `rotate` and `scale` properties, which
transitions and keyframes both animate. Recipes in [animations](https://zizigy.github.io/docs/guides/animations).

## Overlay components

To show something other than the clone, pass a component. It renders inside the box and
gets the drag as props, which change while you drag: where the drag is, whether that place
takes it, whether the drop copies, and the drop itself.

<example height="26.5rem" hint="Drag a ticket over the columns: Done takes approved ones and stamps them; hold Alt to copy" name="overlay-live">



</example>

```vue [TicketOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem, DragMode, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();
const ticket = computed(() => props.items[0]?.item as Ticket);

const state = computed(() => {
  if (props.status === 'dropping') return props.over ? 'landed' : 'back'; // a cancel flies back
  if (!props.over) return 'free';
  return props.accepted ? 'ok' : 'refused';
});
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="ticket-overlay" :data-state="state">
    {{ ticket.title }}
    <span v-if="mode === 'copy'" class="copy">+ copy</span>
  </div>
</template>

<style scoped>
.ticket-overlay { width: 100%; height: 100%; }
.ticket-overlay[data-state='refused'] { background: color-mix(in srgb, #ef4444 8%, Canvas); }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Prop
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
        active
      </code>
    </td>
    
    <td>
      The drag (<code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , …).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        items
      </code>
    </td>
    
    <td>
      Every dragged item, the grabbed one first: <code>
        { id, item, data, type }
      </code>
      
      . <code>
        item
      </code>
      
       is the list item for sortable drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      The target under the drag; while a drop lands, the target it lands on. <code>
        null
      </code>
      
       over nothing and while a refused or cancelled drag flies back. A sortable list's <code>
        over.id
      </code>
      
       is the list's <code>
        id
      </code>
      
      : the columns above use their names.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accepted
      </code>
    </td>
    
    <td>
      Whether <code>
        over
      </code>
      
       takes the drag: tint the overlay red when it doesn't.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'dragging'
      </code>
      
      , then <code>
        'dropping'
      </code>
      
       while it lands.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        mode
      </code>
    </td>
    
    <td>
      <code>
        'move'
      </code>
      
      , <code>
        'copy'
      </code>
      
       (Alt held on a drag from a list with <code>
        clone
      </code>
      
      , or a drag from a palette), <code>
        'swap'
      </code>
      
      , or <code>
        'insert'
      </code>
      
       (a plain draggable going into a list).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        to
      </code>
    </td>
    
    <td>
      Where a drop would put the items now: <code>
        { list, index }
      </code>
      
      , and in a tree also <code>
        parentKey
      </code>
      
       and <code>
        depth
      </code>
      
      . <code>
        null
      </code>
      
       when it would put them in no list, e.g. over a plain target. See <a href="#where-the-drop-would-go-to">
        where the drop would go
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

The props are `OverlayProps`; declare only the ones you read. Pass the component to whatever
is dragged:

```ts
import TicketOverlay from './TicketOverlay.vue';

makeSortableList(listRef, { items: tickets, overlay: TicketOverlay });   // every item of the list
makeSortableItem(el, { item: () => props.ticket, overlay: TicketOverlay }); // this item
makeDraggable(el, { id: 'chip', overlay: TicketOverlay });                // a plain draggable
```

A component can be passed as it is, in a `shallowRef` to switch it (mid-drag too: the overlay
changes at once), or as a function, which Vue takes as a functional component:
`overlay: (props) => <TicketOverlay {...props} compact />` in TSX. Never put it in a deep
`ref` or `reactive`: Vue would make the component reactive and warn.

The root of an overlay component should fill the box (`width: 100%; height: 100%`): the box
takes the size of the slot and animates it on drop. A fixed size on the root keeps that size
inside the box instead.

## The provider's `#overlay` slot

For every drag without a component of its own, the provider's slot renders the overlay.
Define it once, next to your app's root, and every list and draggable in the app gets it.
Here notes get a ghost of their own, and photos fall back to the clone:

<example height="26rem" hint="Drag a note, then a photo" name="overlay-slot">



</example>

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, status }">
    <NoteGhost v-if="items[0]?.type.includes('note')" :items="items" :status="status" />
  </template>
</DnDProvider>
```

The slot gets the same props as an overlay component. When it renders nothing (the
`v-if` above), the drag falls back to the clone. Tell drags apart by `type`: a sortable
item's type is its group's name unless it sets its own (`makeSortableItem(el, { type })`).

## Targets that change the overlay

A drop target can say what the overlay shows while a drag it takes is over it.
`makeDroppable`, lists and trees take an `overOverlay` (a list's or tree's `overlay` is
for its own items). Over a folder, the chip of the dragged messages turns into
what the drop will do:

<example height="34rem" hint="Tick two messages, drag one over Archive and let go" name="overlay-folders">



</example>

```ts [Folder.vue]
makeDroppable(el, {
  id: () => props.folder.id,
  data: () => props.folder,
  overOverlay: MovePill,
  onDrop: (event) => emit('move', event.active.ids),
});
```

The target's component gets the same props as any overlay component, `over` among them,
and the drag's own overlay (its component, the provider's slot or the clone) as its default
slot. `MovePill` leaves the slot out, so it replaces the chip:

```vue [MovePill.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();
// The folder under the drag: its `data`.
const folder = computed(() => props.over?.data as Folder | undefined);
</script>

<template>
  <!-- Fills the box like any overlay component. -->
  <div class="pill-box">
    <span v-if="folder" class="pill">Move {{ items.length }} to {{ folder.name }}</span>
  </div>
</template>
```

Render `<slot />` to keep the drag's own overlay and wrap it. That is what Done does in the
board of [overlay components](#overlay-components) above: over Done, an approved ticket
keeps its own overlay, Done stamps it, and a ticket from another column gets confetti when
it is dropped.

```ts [Column.vue]
makeSortableList(listRef, {
  items: tickets,
  group: { name: 'release', put },
  overlay: TicketOverlay, // the tickets' own, in every column
  overOverlay: strict ? DoneOverlay : undefined, // Done's, around it
});
```

```vue [DoneOverlay.vue]
<template>
  <div class="done">
    <slot /> <!-- TicketOverlay -->
    <span class="stamp">Shipped</span>
    <span v-if="status === 'dropping' && arrives" class="confetti">…</span>
  </div>
</template>
```

- It shows only while the target accepts the drag, and stays while the drop lands on it.
Leaving the target brings the drag's own overlay back.
- The change crossfades. The provider's `overlayTransition` sets how: `false` swaps at once,
an object is the props of a `<Transition>` around the content (`name`, `mode`, JS hooks
for GSAP or motion). Without `mode: 'out-in'` both show for a moment: give the leaving one
`position: absolute` in `.<name>-leave-active`.
- The drop waits for the confetti: CSS animations and transitions that run in the overlay
as it lands play to their end, for two seconds at most.
- A drag with `overlay: false` has no overlay over any target.

The folders also land the pill their own way, into the folder's icon: a target can have an
`overDropAnimation` too. See [animations](https://zizigy.github.io/docs/guides/animations#per-item-and-per-target).

## Where the drop would go: `to`

`to` tells an overlay where a drop would put the items now, as the drop event's `to` will:
the list and the index there, and in a tree the parent and the depth. It changes as the slot
moves. A page of this site menu says which section it would go into, and at which row:

<example height="27rem" hint="Drag a page over the sections, then sideways to change its depth" name="overlay-move-path">



</example>

```vue [MoveOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, DropDestination } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; to: DropDestination | null }>();
const page = computed(() => props.items[0]!.item as MenuNode);
// `parentKey` is the section the page would go into, `null` at the top level.
const where = computed(() => (props.to ? pathOf(menu.value, props.to.parentKey) : null));
</script>

<template>
  <div class="move">
    <div class="row">{{ page.title }}</div>
    <p v-if="to && where" class="where">Move to <b>{{ where }}</b>, row {{ to.index + 1 }}</p>
  </div>
</template>
```

Outside every target, `to` is still the slot's place: by default a drop there keeps the items
where the slot is (`dropOutside: 'placeholder'`). It is `null` when the drop would put them in
no list: over a plain target, over a list that refuses them, outside with
`dropOutside: 'cancel'` or `'remove'`.

## What wins

For each drag, the first one that applies:

1. The drop target's `overOverlay` (a list's or tree's too), while the drag is over it
and it accepts the drag. What would show otherwise is its default slot.
2. The item's own `overlay` (`makeSortableItem`, `makeDraggable`).
3. Its list's or tree's `overlay`.
4. The provider's `#overlay` slot, unless it renders nothing.
5. The default clone. In a multi-drag, a column or a pile of clones: see
[multi-drag](https://zizigy.github.io/docs/guides/multi-drag#the-default-overlay).

Whether a drag has an overlay at all (`overlay: false`) is decided when it starts. Which
component shows is read live: a ref switched mid-drag swaps it, and so does entering or
leaving a target with an overlay of its own.

## `DragPreview`: the clone in your layout

`DragPreview` renders the library's clone of one dragged item. An overlay component can
lay out several of them, or put a frame around one. Click books to pick them, then drag
one: the overlay fans out the real clones.

<example height="24rem" hint="Drag one of the three picked books; click books to pick others" name="overlay-fan">



</example>

```vue [FanOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[] }>();
const fan = computed(() =>
  props.items.slice(0, 4).map((entry, index) => ({
    entry,
    angle: index === 0 ? 0 : (index % 2 ? -1 : 1) * Math.ceil(index / 2) * 10,
  })),
);
</script>

<template>
  <div class="fan">
    <div v-for="{ entry, angle } in fan" :key="entry.id" class="card" :style="{ transform: `rotate(${angle}deg)` }">
      <DragPreview :id="entry.id" class="face" :style="{ width: '100%', height: '100%' }">
        <div class="blank" /> <!-- an item without a clone -->
      </DragPreview>
    </div>
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>
```

- Clones exist for the grabbed item and the others next to it in drop order, as many as the
provider's `overlayPreviews` (5 by default, `'all'` for every one), if they are rendered at
pickup. For any other item, `DragPreview` renders its default slot.
- A preview has its item's size at pickup, set inline. Size it with `style`, which falls
through (a class can't override it), as above.
- In a sortable multi-drag (`multiple: 'group'` or `'gaps'`), each preview lands on its own
item's slot on drop. Turn its wrappers with `transform` (not the `rotate` property): the
landing undoes it on the way. Put the item's look (corners, shadow) on the preview
itself, as `class="face"` does: the wrappers stay in the box.

The [multi-drag guide](https://zizigy.github.io/docs/guides/multi-drag#a-custom-overlay-for-several-items) has an
overlay that shows a count and the titles instead of the clones.

## Size: `overlayFit`

Over a list of other sizes, the box takes the size of the slot it will land in. The provider's
`overlayFit` switches it; the [DnDProvider page](https://zizigy.github.io/docs/api/dnd-provider) has a demo with a
narrow and a wide list.

<table>
<thead>
  <tr>
    <th>
      <code>
        overlayFit
      </code>
      
       (provider)
    </th>
    
    <th>
      The box
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'slot'
      </code>
      
       (default)
    </td>
    
    <td>
      Takes the size of the slot it will land in, gliding to it. Over the wide list, it widens.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'source'
      </code>
    </td>
    
    <td>
      Keeps the dragged element's size.
    </td>
  </tr>
</tbody>
</table>

With `'slot'`, the box resizes around the pointer, which stays at the same fraction of the
box. The content is never scaled: it re-lays out at the new size, so a flex row like the
tasks of that demo looks right at any width. A slot styled much smaller than the item, such as a
thin line, doesn't shrink the box along that axis.

A drop does the same with either setting: the box flies to the landing element and
animates to **its** size, and the content re-lays out on the way. When an item looks
different in two lists (a compact chip in a palette, a full card on a board), the clone of
the source re-lays out at the target's size, and may look squeezed or stretched there. Two
ways to keep it right:

- Give the item a **layout that works at both sizes**, as the task rows do, or the same
size in every list it can land in.
- Render the **target's look** in an overlay component. It gets `over`, so it can switch
to the look of the list it is over, and it fills the box at any size.

## Where it renders: `overlayTo`

The provider teleports the overlay to `body`. A modal `<dialog>` (opened with
`showModal()`) sits on the top layer, above everything in `body`, so an overlay there would
be hidden under it. Point `overlayTo` at a selector or an element inside the dialog. The
[DnDProvider page](https://zizigy.github.io/docs/api/dnd-provider#where-the-overlay-renders) has a dialog to try it
with and without:

```vue [index.vue]
<script setup lang="ts">
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const open = ref(false);
// While the dialog is open, the overlay renders inside it.
const overlayTo = computed(() => (open.value ? '#columns-dialog' : 'body'));

const show = () => {
  dialog.value?.showModal();
  open.value = true;
};
</script>

<template>
  <DnDProvider :overlay-to="overlayTo">
    <button type="button" @click="show">Edit columns</button>
    <dialog id="columns-dialog" ref="dialog" @close="open = false">
      <ColumnList v-model:columns="columns" />
    </dialog>
  </DnDProvider>
</template>
```

- The target must be in the page when the provider renders the overlay, after it mounts. A
closed `<dialog>` is: it is only hidden. Switch back to `body` while it is closed, so the
overlay of other drags shows.
- The box is `position: fixed`. A `transform`, `filter` or `contain` on the target or its
ancestors makes it the box's frame instead of the viewport, so keep them off the dialog.
- The clone's styles are computed for where it is shown: in a shadow root, point
`overlayTo` inside it and the clone keeps the shadow root's styles.

## No overlay

`makeDraggable(el, { overlay: false })` has no box at all: the element itself moves,
through the returned `transform`.

```ts
const { transform } = makeDraggable(el, { overlay: false });
const style = computed(() =>
  transform.value ? { translate: `${transform.value.x}px ${transform.value.y}px` } : undefined,
);
```

See [drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay). How a drag with a box
lands is its `dropAnimation`: the drop target's (`overDropAnimation`), the item's (or its list's), or the
provider's. See
[animations](https://zizigy.github.io/docs/guides/animations#the-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
