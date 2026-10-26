# Sortable lists: makeSortableList + makeSortableItem

A list component calls `makeSortableList` and renders the returned draft `items`. Each
row component calls `makeSortableItem`. While dragging, the draft reorders live: the
dragged row becomes the placeholder in its new slot and the others slide (FLIP). On drop,
the new arrays are written to your refs (or handed to you).

## Kanban: lists that exchange items

```vue
<!-- Board.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Column from './Column.vue';

const columns = ref([
  { id: 'todo', title: 'To do', tasks: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] },
  { id: 'done', title: 'Done', tasks: [] },
]);
</script>

<template>
  <DnDProvider>
    <div class="board">
      <Column v-for="column in columns" :key="column.id" :column="column" />
    </div>
  </DnDProvider>
</template>
```

```vue
<!-- Column.vue -->
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Card from './Card.vue';

const props = defineProps<{ column: { id: string; title: string; tasks: Task[] } }>();
const listRef = useTemplateRef<HTMLElement>('list');
const { items, isOver, isAccepting } = makeSortableList(listRef, {
  id: props.column.id,                     // read once; names the list in drop events
  items: toRef(props.column, 'tasks'),     // a writable ref into the (reactive) column
  group: 'board',                          // same name = items move between these lists
});
</script>

<template>
  <section>
    <h3>{{ column.title }}</h3>
    <!-- Give empty lists a min-height so they still take drops. -->
    <ul ref="list" class="cards" :class="{ over: isOver }" style="min-height: 48px">
      <Card v-for="task in items" :key="task.id" :task="task" />
    </ul>
  </section>
</template>
```

```vue
<!-- Card.vue -->
<script setup lang="ts">
const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');
const { isDragging, isPlaceholder, selected, index } = makeSortableItem(el, { item: () => props.task });
</script>
<template><li ref="el">{{ task.title }}</li></template>
```

## makeSortableList options

| Option | Default | Notes |
| --- | --- | --- |
| `items` | — | **Required.** A writable ref (the library writes drops), or a getter, computed or readonly ref (you write them: see *Controlled lists*). |
| `getKey` | `item.id` (the item itself for primitives) | Must be unique within the group. |
| `id` | `useId()` | Read once. Shows up as `from.list` and `to.list` and as `result` keys. |
| `group` | own group | `'name'` or `{ name, pull: true \| false \| 'clone', put: true \| false \| (ctx) => boolean }`. Read once. |
| `strategy` | `'vertical'` | `'vertical' \| 'horizontal' \| 'grid'` (grids and wrapping rows). |
| `behavior` | `'sort'` | `'swap'`: the dragged item exchanges places with the hovered one. |
| `placeholder` | `'item'` | `'indicator'`: the list doesn't move, and you draw a line from `indicator`. |
| `multiple` | `'group'` | Multi-drag mode: `'group' \| 'gaps' \| 'stack'` (see [multi-drag](multi-drag.md)). |
| `sort` | `true` | `false`: no reordering inside this list (palettes). |
| `clone` | — | `(item) => copy` with a **new key**. Required for copying (`pull: 'clone'`, or Alt). |
| `createItem` | — | `(active) => item \| undefined`. Takes plain `makeDraggable` drags in. |
| `dropOutside` | `'placeholder'` (`'cancel'` with the indicator) | Drop outside every target: keep the placeholder's position, `'cancel'`, or `'remove'` the items. |
| `acceptMode` | `'all'` | Multi-drag of mixed types: `'all'` or `'some'` must pass `group.put`. |
| `overlay` | — | Overlay component for this list's items (see [overlay](overlay.md)). |
| `modifiers` | — | E.g. `[restrictToVerticalAxis]`. |
| `animation` | provider's | FLIP while sorting. |
| `animate` | provider's (`false`) | Animate data changes that no drag made. |
| `autoScroll` | provider's | Per list. |
| `disabled` | `false` | No drags from, or drops into, this list. |
| `onBeforeDrop` | — | `(e) => boolean \| Key[] \| Promise<…>`: decide. |
| `onDrop` | — | `(e) => void`: told, **before** the write. |

Returns `{ id, items, isOver, isAccepting, indicator, activeKey, activeIndex, activeSize, captureLayout }`.

## makeSortableItem options

Pass `id` (a getter) or `item` (a getter, keyed with the list's `getKey`). Also:
`handle`, `disabled`, `type`, `data`, `overlay`, `modifiers`, `activation`, `canDrag`,
`attributes` (as on `makeDraggable`). There is no `keyboard` option: arrow keys move by slots.

Returns:
- `isDragging`: this item is part of the drag (true for every dragged item in a multi-drag).
- `isPlaceholder`: this element is a slot a dragged item will land in. Style it as the "hole".
- `selected`: writable, bound to the provider's selection.
- `indicator`: in indicator mode, the list's indicator while it is attached to this item, otherwise `null`.
- `index`: index in the rendered draft.

## The drop event and its order

`onBeforeDrop` → `onDrop` → the default write → the overlay lands → `@drag-end` / monitor `onDragEnd`.

```ts
interface SortableDropEvent<T> {
  keys: Key[];               // dragged keys, the grabbed one first
  items: T[];                // dragged items (copies for mode 'copy', created item for 'insert')
  accepted: Key[]; rejected: Key[];
  from: { list: Key | null; index: number };   // list null: a plain draggable from outside
  to: { list: Key; index: number };            // index -1: the items were removed
  sameList: boolean;
  mode: 'move' | 'copy' | 'swap' | 'insert';
  partner?: { key; item; from; to };           // swap: the item exchanged with
  result: ReadonlyMap<Key, T[]>;               // new arrays of every list the drop changes
  preventDefault(): void;                      // skip the write (into every list in result)
  readonly defaultPrevented: boolean;
}
```

- `onDrop` is called on the target list. When items leave their list, the source list's
  `onDrop` is called too, with `to.index === -1`.
- `onBeforeDrop` returning `false` rejects (the items fly back). An array of keys accepts
  only those. A throw rejects too. It may be `async`: the overlay waits where it was dropped.

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => e.items.every((task) => !task.locked),
  onDrop: (e) => {
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

## Controlled lists (Pinia, server state, immutable data)

A read-only source is never written. Prevent the default and apply `result`:

```ts
const store = useBoardStore();
const { items } = makeSortableList(listRef, {
  id: 'todo',
  group: 'board',
  items: () => store.lists.todo,                 // getter: read-only
  onDrop: (e) => {
    e.preventDefault();
    for (const [listId, next] of e.result) store.setList(listId, next);
  },
});
```

Saving to a server first: do it in an async `onBeforeDrop`. Apply `result` **before**
the promise resolves, and the overlay lands in the new order. If the request fails,
apply nothing and return `true`: the drop goes through unapplied and the items fly back.

```ts
onBeforeDrop: async (e) => {
  e.preventDefault();
  try {
    await api.move(e.keys, e.to);
    store.apply(e.result);
  } catch {}
  return true;
},
```

Development builds warn when a read-only list's drop is left to the library (nothing
would change).

## Copying, palettes, external items

```ts
// Palette: copies out, takes nothing in, doesn't reorder.
makeSortableList(paletteRef, {
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },
  sort: false,
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});

// Target: holding Alt while dragging between lists of the group also copies.
makeSortableList(canvasRef, { items: blocks, group: 'blocks', clone: (b) => ({ ...b, id: crypto.randomUUID() }) });

// Accept plain draggables (makeDraggable) from anywhere:
makeSortableList(listRef, {
  items: tasks,
  createItem: (active) => ({ id: crypto.randomUUID(), title: (active.data as Chip).title }),
});
```

`group.put` can be a function: `put: ({ keys, items, types, from, to }) => items.length <= 3`.

## Swap

```ts
makeSortableList(gridRef, { items: tiles, strategy: 'grid', behavior: 'swap' });
```

The swap is live: moving back onto the item, or off the list, reverts it. Lists of one
group that both swap exchange items between them (`group.pull: true` and `put` are needed
on both sides). A multi-drag sorts instead of swapping. The drop event has `mode: 'swap'`
and `partner`.

## Indicator mode (a drop line)

```ts
// List
const { items, indicator } = makeSortableList(listRef, { items: rows, placeholder: 'indicator' });
// Row
const { indicator } = makeSortableItem(el, { item: () => props.row });
```

```vue
<li ref="el" :class="indicator && `drop-${indicator.side}`">…</li>
<style>
.drop-before { box-shadow: inset 0 2px 0 #3b82f6; }
.drop-after  { box-shadow: inset 0 -2px 0 #3b82f6; }
</style>
```

`indicator` is `{ list, index, key, side: 'before' | 'after' | 'inside', depth?, parentKey? }`.
`key` is `null` in an empty list (show the line in the list instead). Dropping outside
cancels by default.

## Removing items

- **Trash zone:** `makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`.
- **Drop outside removes:** `dropOutside: 'remove'`. `onBeforeDrop` is asked first.
- Both call the source list's `onDrop` with `to.index === -1` and a `result` without the items.

## Grids and horizontal lists

`strategy: 'grid'` works for CSS grids and wrapping flex rows, including items of
different sizes. `'horizontal'` is for a single row. With `overlayFit: 'slot'`
(default), the overlay takes the size of the slot it's over, so a card dragged into a
column of wider cards widens.
