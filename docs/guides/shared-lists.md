---
title: "Lists that share items"
description: "Lists in one group move, copy and swap items — the whole column takes drops, pull and put decide what goes in and out, palettes copy, and controlled lists apply each drop to a store with an undo history."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/shared-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="31rem" hint="Move stories between the lists; switch the drop area off and on" name="sprint-planning">



</example>

## A group

Lists with the same `group` name exchange items. By default every list is a group of its
own.

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import StoryCard from './StoryCard.vue';

type Story = { id: string; title: string; points: number };
const props = defineProps<{ column: { id: string; title: string; stories: Story[] } }>();

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,                     // names the list in drop events
  items: toRef(props.column, 'stories'),   // a writable ref into the reactive column
  group: 'planning',                       // same name: stories move between these lists
});
</script>

<template>
  <section :class="{ over: isOver }">
    <h3>{{ column.title }}</h3>
    <ul ref="list">
      <StoryCard v-for="story in items" :key="story.id" :story="story" />
    </ul>
  </section>
</template>
```

```vue [index.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'backlog', title: 'Backlog', stories: [{ id: 's1', title: 'Saved searches', points: 5 }] },
  { id: 'sprint', title: 'Sprint 14', stories: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

- Each column is a component here, as columns usually are. One component may also make
several lists, a fixed Todo and Done side by side: each card joins the list whose
element holds it.
- `toRef(props.column, 'stories')` is writable because the parent passes a reactive
object. The drop writes both arrays, the one the story left and the one it entered, and
the points of both columns follow.
- `id` shows up in drop events as `from.list` and `to.list`, and keys `e.result`, the new
arrays of every list the drop changes. `id` and `group` are read once.
- Keys must be unique across the whole group.

A list's `onDrop` runs for the drops **into** it. A move from `backlog` to `sprint` calls
the `sprint` list's `onDrop`, and its `e.result` holds the new arrays of both lists.

## The whole column takes drops: `dropzone`

A short list in a tall column leaves empty space below the last card. With `dropzone`,
another element takes the drops for the list: here the whole column. A story let go
below the last one lands at the end. The stories stay in the `<ul>`; only the area that
takes drops grows. The demo outlines that area while you drag: switch it off, and only
the list itself takes the story.

```ts [Column.vue]
const zone = useTemplateRef<HTMLElement>('zone');
const { items } = makeSortableList(list, {
  items: toRef(props.column, 'stories'),
  group: 'planning',
  dropzone: zone,   // or a getter: () => (wholeColumn.value ? zone.value : undefined)
});
```

<tip>

Without a `dropzone`, an empty list still needs a size to take drops: give it a
`min-height`.

</tip>

## What goes in and out: `pull` and `put`

`group` also takes an object. `pull` says what may leave a list, `put` what may come in:

<example height="36rem" hint="Drag files between the lists: each one says if it takes them, and why not" name="group-rules">



</example>

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Values
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pull
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (default): items can leave. <code>
        false
      </code>
      
      : they can't. <code>
        'clone'
      </code>
      
      : copies leave, the items stay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        put
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (default): items can come in. <code>
        false
      </code>
      
      : nothing comes in. A type or types (<code>
        'image'
      </code>
      
      , <code>
        ['image', 'video']
      </code>
      
      ): items of those types come in. A function: you decide per drag.
    </td>
  </tr>
</tbody>
</table>

```ts [index.vue]
// Inbox: gives, takes nothing.
group: { name: 'files', pull: true, put: false }

// Templates: gives copies, takes nothing, keeps its order.
group: { name: 'files', pull: 'clone', put: false }, sort: false

// Images: takes images only.
group: { name: 'files', put: 'image' }
```

Types are the `type` options of the dragged items (`makeSortableItem(el, { item, type })`);
items without one count as the group's name. With types in `put`, every dragged item must
have one of them (with `acceptMode: 'some'`, the ones that do come in).

A `put` function gets `{ keys, items, types, from, to }`: the dragged keys and items,
their types, the list they come from (`null` for plain draggables) and this list. Moves
inside a list are always allowed: the Inbox still sorts its own files.

Over a list that refuses the drag, the slot goes back to where the drag started, so the
lists show what a drop would do: nothing. A drop there is cancelled and the item flies
back. The list's `isAccepting` is `false` during such a drag, and `isOver` still `true`
over it: that is how each list in the demo knows what to say.

The slot goes home over a drop target of its own outside the lists too, such as a trash
can: the drop there is the target's, and the lists keep the item unless its `onDrop` takes
it out (`event.source.remove()`). Targets inside the lists (a drop into an item) and
around them (a panel holding the lists) leave the slot where it is.

```ts [RuleList.vue]
const { items, isOver, isAccepting } = makeSortableList(el, { … });
const { active } = useDnD();
const verdict = computed(() => (active.value ? (isAccepting.value ? 'takes' : 'refuses') : null));
```

### Limits

A list that holds three files at most, the Shortlist:

```ts [index.vue]
const shortlist = reactive({
  files: [/* … */],
  group: { name: 'files', put: ({ keys }: SortablePutContext) => shortlist.files.length + keys.length <= 3 },
});
```

It reads its own items when a drag asks. Fill it, and it refuses the next file, with the
reason in its header.

When several selected items of different types are dragged, `acceptMode` says whether
`'all'` (default) or `'some'` of them must pass `put`. With `'some'`, the ones that pass
land and the others fly back. See [multi-drag](https://zizigy.github.io/docs/guides/multi-drag#taking-only-some).

### One group per list

A list belongs to one group: `group` takes one name, never several. The lists of a group
share each drag (their drafts, what is dragged, which of them take it), so items never move
between groups. When items should flow only some ways, put the lists in one group and let
`put` decide by `from`, the list a drag comes from:

```ts [index.vue]
// Review takes tasks from both teams. A team takes tasks back from Review,
// never from the other team.
const fromReview = ({ from }: SortablePutContext) => from === 'review';

makeSortableList(review, { id: 'review', items: reviewTasks, group: 'tasks' });
makeSortableList(frontend, { id: 'frontend', items: frontendTasks, group: { name: 'tasks', put: fromReview } });
makeSortableList(backend, { id: 'backend', items: backendTasks, group: { name: 'tasks', put: fromReview } });
```

<note>

Coming from SortableJS: there `put: ['a', 'b']` names the groups a list takes items from.
Here an array in `put` lists the **types** of the items a list takes. To take items from
other lists, give them one group and decide by `from`, as above.

</note>

## Copy: palettes and the Alt key

<example height="26rem" hint="Drag from the palette; Alt-drag copies; drop outside the Page panel to remove" name="palette">



</example>

```ts [Palette.vue]
makeSortableList(list, {
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                           // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

```ts [Sheet.vue]
makeSortableList(list, {
  items: blocks,
  group: 'blocks',
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),  // for Alt-drags
  dropOutside: 'remove',                                      // drag off the Page panel to delete
});
```

- `pull: 'clone'` copies every drag out of the list. The original stays, and the copy
travels and lands.
- Holding <kbd value="Alt">



</kbd>

 while dragging copies too, from any list with a `clone`
function: it makes the copy. Change the key with the provider's `copyModifier`, or turn it
off with `null`.
- Either way, the list the item comes from needs `clone`. It must return the copy with a
**new key**. Without `clone`, nothing is copied.
- The drop event has `mode: 'copy'`, and `e.items` are the copies. An overlay component
gets `mode` too, to show a "+" while copying (see [the overlay](https://zizigy.github.io/docs/guides/overlay)).

## Swap between lists

Two lists of one group that both have `behavior: 'swap'` exchange items between them: the
dragged item takes the hovered one's place, and the hovered one moves into the dragged
one's list. It must be allowed out of its list (`pull: true`) and into the other
(`put`). The on-call rotation in [sortable lists](https://zizigy.github.io/docs/guides/sortable-lists#swap-instead-of-shift)
swaps across its two columns.

## Plain draggables

A list takes items dragged with `makeDraggable` (a chip, a template, a file from a tree)
when it has `createItem`. `group.put` decides on them too, with `from: null`. See
[plain draggables into a list](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list).

## Dropping outside

What happens when a drag ends over no target at all is the list's `dropOutside`:

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      The items
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
      
       (default)
    </td>
    
    <td>
      Land where the slot was last shown.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Fly back. The default with <code>
        placeholder: 'indicator'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      Leave their list: drag off to delete. The page of the palette demo does it.
    </td>
  </tr>
</tbody>
</table>

`'remove'` asks the list's `onBeforeDrop` first. Then the list's `onDrop` runs with
`to.index === -1`, and `e.result` holds the list without the items. A trash can that takes
drops works the same way: see [trash zones](https://zizigy.github.io/docs/guides/drag-and-drop#trash-zones).

## Controlled lists

The lists can read a store they don't own: Pinia, server state, immutable data. Pass
`items` as a getter (or a `computed`, or a readonly ref): the library never writes it.
Call `e.preventDefault()` in `onDrop` and apply `e.result` yourself:

<example height="26rem" hint="Move guests between the tables, then undo, one move at a time" name="seating-undo">



</example>

```ts [Table.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  items: () => props.seating.state.tables[props.id]!,   // read-only
  group: 'seating',
  onDrop: (e) => {
    e.preventDefault();                                   // no write
    props.seating.apply(e.result, `${e.items[0]?.name} → ${props.title}`);
  },
});
```

```ts [store.ts]
const apply = (result: ReadonlyMap<Key, Guest[]>, label: string) => {
  const before = [...result.keys()].map((id): [Key, Guest[]] => [id, state.tables[id]!]);
  for (const [id, guests] of result) state.tables[id] = guests;
  state.history.unshift({ label, before });
};

const undo = () => {
  const last = state.history.shift();
  for (const [id, guests] of last?.before ?? []) state.tables[id] = guests;
};
```

- `e.result` maps every list the drop changes to its new array: both tables after a move,
one after a reorder. They are new arrays, so the store can keep the old ones for undo.
- The draft follows the store: apply `result` in `onDrop` (or before an async
`onBeforeDrop` resolves), and the overlay lands in the new order.
- `preventDefault()` skips the write into every list in `result`. Applied nowhere, the
lists stay as they were and the items fly back.
- Development builds warn when a read-only list's drop is left to the library: nothing
would change.

To save to a server before the drop lands, or to ask the user first, see
[drop decisions](https://zizigy.github.io/docs/guides/drop-decisions). All list options are in the
[makeSortableList API](https://zizigy.github.io/docs/api/make-sortable-list).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
