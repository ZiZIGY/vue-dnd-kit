---
title: "Drag and drop"
description: "Free dragging with makeDraggable and drop targets with makeDroppable — typed targets that take some drags and refuse others, a floor plan, trash zones, folders inside a list, and plain items a list takes in."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/drag-and-drop"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Use `makeDraggable` and `makeDroppable` for anything that isn't a sortable list: waste
into bins, furniture on a floor plan, files into folders, a trash can, a chess board.

<example height="29rem" hint="Sort the waste into the bins; no bin takes the battery" name="recycling">



</example>

## A draggable

```vue [WasteItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ waste: { id: string; name: string; type: string } }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,      // read back as `active.id`
  type: () => props.waste.type,  // matched by the targets' `accept`
  data: () => props.waste,       // anything: `active.data`
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">{{ waste.name }}</div>
</template>
```

Pass the id from your data, as a getter. The default id comes from `useId()` and is new
for every component instance, so it means nothing to the rest of your app. Options are read
when they are needed, so a getter or a ref keeps them current.

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      What it does
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      Who is dragged, what it carries, and what the targets' <code>
        accept
      </code>
      
       matches.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      A selector or an element inside: only it starts a drag. See <a href="/docs/guides/sortable-lists#handles">
        handles
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      No drag starts.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlay
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (default): a copy follows the pointer. A component: your own preview. <code>
        false
      </code>
      
      : the element moves itself (<a href="#without-an-overlay">
        below
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
    
    <td>
      Lock the drag to <code>
        'x'
      </code>
      
       or <code>
        'y'
      </code>
      
      , snap it, keep it in bounds: see <a href="/docs/guides/constraints">
        constraints
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardMode
      </code>
    </td>
    
    <td>
      How the arrows move it: by pixels (default) or from target to target (<a href="#keyboard">
        below
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
      
      , <code>
        canDrag
      </code>
    </td>
    
    <td>
      When a press becomes a drag: see <a href="/docs/guides/sensors">
        sensors
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        attributes
      </code>
    </td>
    
    <td>
      <code>
        role
      </code>
      
      , <code>
        tabindex
      </code>
      
       and <code>
        aria-*
      </code>
      
       for keyboards and screen readers (default <code>
        true
      </code>
      
      ).
    </td>
  </tr>
</tbody>
</table>

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
        isDragging
      </code>
    </td>
    
    <td>
      This element is being dragged.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Writable, bound to the provider's <a href="/docs/guides/multi-drag">
        selection
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      The drag offset, for <code>
        overlay: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
    </td>
    
    <td>
      The id in use.
    </td>
  </tr>
</tbody>
</table>

Buttons, inputs and other interactive children don't start a pointer drag, so they keep
working inside a draggable. All options are in the [makeDraggable API](https://zizigy.github.io/docs/api/make-draggable).

## A drop target

```vue [Bin.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[] }>();
const emit = defineEmits<{ drop: [id: Key] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,   // 'glass', ['paper', 'cardboard'], a function…
  onDrop: (event) => emit('drop', event.active.id),
});
</script>

<template>
  <section ref="el" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" />
  </section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Returns
    </th>
    
    <th>
      <code>
        true
      </code>
      
       when
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isOver
      </code>
    </td>
    
    <td>
      The drag is over this target, whether it takes the drag or not.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAccepting
      </code>
    </td>
    
    <td>
      Something is being dragged and this target takes it: light up the valid targets.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placement
      </code>
    </td>
    
    <td>
      Not a boolean: <code>
        { top, right, bottom, left }
      </code>
      
      , the halves of the target the pointer is in, or <code>
        null
      </code>
      
       when it isn't hovered. Use it for "before / after this card".
    </td>
  </tr>
</tbody>
</table>

`isOver` without `isAccepting` means the drag is over a target that refuses it. Show it,
as the bins above do: a drop there is cancelled and the item flies back. The bins that
can't take the item fade while it travels; more looks in [styling](https://zizigy.github.io/docs/guides/styling#drop-targets-yes-and-no).

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      What it does
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      Read back as <code>
        over.id
      </code>
      
       and <code>
        over.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
    
    <td>
      Which drags it takes (<a href="#which-drags-a-target-takes">
        next section
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      It takes nothing, and drags pass over it.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        priority
      </code>
    </td>
    
    <td>
      Higher wins when targets overlap without nesting (default 0).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
    </td>
    
    <td>
      The drag came in or went out.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , <code>
        onDrop
      </code>
    </td>
    
    <td>
      Decide on the drop, then apply it (<a href="#the-drop">
        below
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Which drags a target takes

A draggable's `type` is matched against a target's `accept`:

<table>
<thead>
  <tr>
    <th>
      <code>
        accept
      </code>
    </th>
    
    <th>
      Takes
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      omitted or <code>
        '*'
      </code>
    </td>
    
    <td>
      Everything.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'glass'
      </code>
    </td>
    
    <td>
      Draggables of type <code>
        glass
      </code>
      
      , and untyped ones.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ['paper', 'cardboard']
      </code>
    </td>
    
    <td>
      Either type, and untyped ones.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ({ active, items, types }) => boolean
      </code>
    </td>
    
    <td>
      Whatever your function says.
    </td>
  </tr>
</tbody>
</table>

A draggable without a `type` fits any string rule. `type` can be an array too
(`['paper', 'large']`): one matching type is enough. A function decides on anything about
the drag. The compost bin above reads the items' data, not their type:

```ts [waste.ts]
{
  id: 'compost',
  accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
}
```

`accept` is read live, while the drag looks for its target: pass a ref to change it.

When several items are dragged at once, `acceptMode` says how many must fit: `'all'`
(default) or `'some'`. With `'some'`, return the ids to keep from `onBeforeDrop`, and the
others fly back. See [drop decisions](https://zizigy.github.io/docs/guides/drop-decisions).

## The drop

`onDrop` of a plain drop target is where **you** change your data. The library moves
nothing on its own:

```vue [index.vue]
<script setup lang="ts">
/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
</template>
```

<table>
<thead>
  <tr>
    <th>
      Event field
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
      The drag: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
       (<code>
        { id, data, type, item }
      </code>
      
       each), <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      This target: <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        accepted
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
      
      , <code>
        delta
      </code>
    </td>
    
    <td>
      Where the pointer is, and how far it moved from the start.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Where the dragged box sits in this target (<a href="#leave-it-where-it-was-dropped">
        next section
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        source
      </code>
    </td>
    
    <td>
      Set when the items come from a sortable list: <code>
        { list, remove() }
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`active.ids` holds every dragged id, the grabbed one first. The order is `onBeforeDrop`
(decide), `onDrop` (apply), then the provider's `drag-end`. To hear every drag of the
page in one place, use `useDnDMonitor` (see [the provider](https://zizigy.github.io/docs/guides/provider)). To
ask before a drop, keep the drag going, or accept only some items, see
[drop decisions](https://zizigy.github.io/docs/guides/drop-decisions).

## Leave it where it was dropped

A floor plan, a canvas, a board: the item stays where you let go. Every event carries
`position`, the `left` / `top` that put an absolutely positioned item where it was
dropped.

<example height="28rem" hint="Drag furniture into the room, move it around, or put it back" name="room-planner">



</example>

```ts [Planner.vue]
const room = useTemplateRef<HTMLElement>('room');
makeDroppable(room, {
  id: 'room',
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    // Clamped, so a piece let go half outside stays inside the walls.
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});
```

```vue [Piece.vue]
<div ref="el" class="piece" :style="{ left: `${piece.x}px`, top: `${piece.y}px` }">…</div>
```

`position` is the top-left corner of the dragged box in `over`, measured from its padding
edge, with its scroll added: the room's border, its walls, doesn't count. It is `null`
over nothing.

<tip>

Don't compute the spot from `active.rect` and `delta`: that misses the target's border
and scroll. Grids, bounds and axis locks for such boards are in
[constraints](https://zizigy.github.io/docs/guides/constraints).

</tip>

## Without an overlay

By default a copy of the element follows the pointer, and the element stays in place: the
furniture in storage works that way. With `overlay: false` there is no copy, and the
element moves itself by the `transform` the drag returns: the furniture in the room.

```ts [Piece.vue]
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),   // a value or a ref, read when the drag starts
});

const style = computed(() => ({
  left: `${props.piece.x}px`,
  top: `${props.piece.y}px`,
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
```

- `position` is then the element's own corner, so the drop handler stays the same.
- The element is under the pointer while it moves; finding the target, the library looks
through it. Raise it above its neighbours while it is dragged (`z-index`).
- It scrolls with the page, the overlay doesn't: `transform` takes off what its container
moved since the drag started, so it stays under the pointer when the page scrolls.
- It moves inside its own container: an `overflow: hidden` parent clips it, and its
stacking context decides what it passes over. The overlay has neither problem.

For a custom preview instead of the copy, see [the overlay](https://zizigy.github.io/docs/guides/overlay).

## Trash zones

A drag that starts in a sortable list carries `e.source`. Call `remove()` and the list
drops the items:

<example height="34rem" hint="Drag a notification to Done or Delete, then undo" name="triage">



</example>

```ts [Triage.vue]
const triage = (bin: 'done' | 'deleted') => (e: DnDEvent) => {
  bins[bin].push(...e.active.items.map((entry) => entry.item as Notice));
  e.source?.remove();
};

makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });
```

- `e.active.items[i].item` is the list's item itself. Keep it, and an undo puts it back
where it was.
- The list's own `onDrop` then runs with `to.index === -1`, and `e.result` holds the list
without the items.
- The overlay shrinks into the zone, as the item is no longer shown anywhere.
- A list can also remove what is dropped outside of everything: see
[`dropOutside`](https://zizigy.github.io/docs/guides/shared-lists#dropping-outside).

<note>

With the keyboard, the arrows move a list's item between the slots of its list and the
lists of its group; past the end of the lists, the next press carries it on to the drop
target that way, here the trash, and the opposite arrow brings it back. A button, a menu or
the `Delete` key is still quicker for many people: offer one too.

</note>

## Drop into a sortable item

A row of a sortable list can be a drop target too: a folder that takes bookmarks, a group
that takes tasks. Put a droppable on the item's element:

<example height="28rem" hint="Drop a link on the middle of a folder; near its edges it sorts. Open a folder to drag links out" name="bookmarks">



</example>

```ts [FolderRow.vue]
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link)); // Bookmarks adds them
    e.source?.remove();   // take them out of the list they came from
  },
});
```

An open folder shows its links as a list of the same group, which takes links only: they
sort there, and drag back out to the top level or into another folder.

While the list would sort the drag, such a target counts only in the **middle** of its
item (25 to 75% along the list's axis). There the drop goes into the item, and the list
doesn't move. Near the edges, the list sorts as usual.

- A target whose `accept` refuses the drag is skipped: the list sorts over the item as
over any other. The folders take only links, so a dragged folder sorts past the others.
- A target never receives its own drag.
- With the keyboard, an arrow stops on the folder first; the next press in the same
direction goes on past it.
- The item is no longer shown after the drop, so the overlay shrinks into the folder
instead of flying back.
- Over the folder the list keeps the dragged row's slot where it was, so nothing shifts
under the pointer. The slot gets `data-dnd-placeholder="into"` then: the drop doesn't go
there, so hide it if you like (`[data-dnd-placeholder='into'] { opacity: 0 }`).

The [file manager](https://zizigy.github.io/docs/examples/file-manager) does the same in a grid, with nested
folders.

## Plain draggables into a list

A sortable list takes in items dragged with `makeDraggable` when it knows how to make an
item from them:

<example height="26rem" hint="Drag a block into the agenda; the times follow the drag" name="day-planner">



</example>

```ts [Agenda.vue]
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});
```

While the draggable is over the list, the created item sits in the draft and is rendered
by your template like any other row: the agenda's times already count it. It becomes real
on drop (`mode: 'insert'`, `from.list === null`), and the overlay lands on it.

- Return `undefined` to refuse. Lists without `createItem` ignore plain draggables.
- Give the new item a key of its own: the block stays in the palette.
- With the keyboard, an arrow toward the list takes the draggable in, level with it, and
the next arrows move it by slots.

## Files from the computer

Files dragged in from the desktop or a file manager aren't the library's drags: the browser
carries them. A drop target takes them with `external`, and the drop brings them in
`e.external`:

<example height="22rem" hint="Drag image or PDF files from your computer onto the zones" name="file-drop">



</example>

```ts [AvatarDrop.vue]
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});
```

- `files` reads like `<input accept>`: MIME types (`image/*`, `application/pdf`) and
extensions (`.md`). `true` takes any file, a function decides file by file. `links` and
`text` take what other apps and tabs drag, `types` any other MIME type.
- The drag runs as a drag of the provider: `isOver`, `isAccepting`, the events and the
announcements work as for any other. Targets without `external` ignore it. There is no
overlay: the browser draws the dragged image.
- While the files are held over the page, the browser tells their types only
(`e.external.fileTypes`). Their names, sizes and contents come with the drop, and
extensions are checked then. Folders are left out; with `multiple: false`, a drag of
several files is refused.

Lists take files, links and text too, and make room for them while they are held. Items can
also leave the page, into another app or another window of yours: see
[files and other apps](https://zizigy.github.io/docs/guides/native).

<tip>

Keyboard and screen reader users can't drag files. Offer an `<input type="file">` next to
the zone, as the demo does with Browse.

</tip>

## Keyboard

A focused draggable picks up with <kbd value="Space">



</kbd>

 or <kbd value="Enter">



</kbd>

, drops with
the same keys, and <kbd value="Escape">



</kbd>

 cancels. Between, the arrows move it:

<table>
<thead>
  <tr>
    <th>
      <code>
        keyboardMode
      </code>
    </th>
    
    <th>
      An arrow
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'pixels'
      </code>
      
       (default)
    </td>
    
    <td>
      Moves it by 25 px, the provider's <code>
        keyboard.step
      </code>
      
      . With <kbd value="Shift">
        
      </kbd>
      
      , four times as far. The furniture moves that way.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'droppables'
      </code>
    </td>
    
    <td>
      Jumps to the closest target in that direction that takes it. The waste jumps from bin to bin, and skips the bins that refuse it.
    </td>
  </tr>
</tbody>
</table>

```ts
makeDraggable(el, { id: () => props.waste.id, type: () => props.waste.type, keyboardMode: 'droppables' });
```

The keys can be rebound on the provider. More in [accessibility](https://zizigy.github.io/docs/guides/accessibility).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
