---
title: "Deciding a drop"
description: "Accept, refuse or postpone a drop — rules while dragging or on release, part of a multi-drag, a dialog, a server that must agree first, monitors that veto, and drops outside every target."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/drop-decisions"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Drag a card into **Done**. The drop waits for your answer: move the card, keep dragging it
somewhere else, or cancel.

<example height="25rem" hint="Drag a card into Done" name="drop-confirm">



</example>

## onBeforeDrop

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => (e.items.some((task) => task.locked) ? 'reject' : 'accept'),
});
```

Lists, trees, drop targets (`makeDroppable`) and monitors (`useDnDMonitor`) take an
`onBeforeDrop`. It runs when the drag is let go, before anything changes, and its answer
decides:

<table>
<thead>
  <tr>
    <th>
      Answer
    </th>
    
    <th>
      What happens
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       or nothing
    </td>
    
    <td>
      The drop goes through.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'reject'
      </code>
      
       or <code>
        false
      </code>
    </td>
    
    <td>
      No drop: the items fly back. A thrown error rejects too.
    </td>
  </tr>
  
  <tr>
    <td>
      An array of keys
    </td>
    
    <td>
      Only those items drop; the others fly back.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'continue'
      </code>
    </td>
    
    <td>
      No drop, and the drag goes on.
    </td>
  </tr>
  
  <tr>
    <td>
      A promise of any of these
    </td>
    
    <td>
      The overlay waits where it was let go until the promise settles.
    </td>
  </tr>
</tbody>
</table>

Lists and trees pass a `SortableDropEvent`: `keys`, `items`, `from`, `to`, `mode`, `sameList` and
`result`, the new arrays of every list the drop changes. Drop targets and monitors get the generic
`DnDEvent`: `active`, `over`, `position` and `source`. See [events](https://zizigy.github.io/docs/api/events).

## A rule while dragging, or on release

Email and Chat both take attachments of 10 MB at most. Drag **demo.mov** over each: Email
refuses it while you hover, Chat takes it and sends it back when you let go.

<example height="27rem" hint="Drag a file over 10 MB into each place" name="drop-rules">



</example>

```ts [Column.vue]
// Asked while dragging: a refused drag never enters the list.
group: { name: 'attachments', put: ({ items }) => fits(items as Attachment[]) },

// Asked on release: the drag enters the list, then flies back.
onBeforeDrop: (e) => (fits(e.items) ? 'accept' : 'reject'),
```

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      <code>
        group.put
      </code>
      
       (or a target's <code>
        accept
      </code>
      
      )
    </th>
    
    <th>
      <code>
        onBeforeDrop
      </code>
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Asked
    </td>
    
    <td>
      While dragging, as soon as the drag reaches the list.
    </td>
    
    <td>
      Once, when the drag is let go.
    </td>
  </tr>
  
  <tr>
    <td>
      The user sees
    </td>
    
    <td>
      The list refuses at once: no slot opens, <code>
        isAccepting
      </code>
      
       is <code>
        false
      </code>
      
      , <code>
        over.accepted
      </code>
      
       is <code>
        false
      </code>
      
      .
    </td>
    
    <td>
      The slot opens as usual; the items fly back on release.
    </td>
  </tr>
  
  <tr>
    <td>
      Knows
    </td>
    
    <td>
      What is dragged: <code>
        keys
      </code>
      
      , <code>
        items
      </code>
      
      , <code>
        types
      </code>
      
      , <code>
        from
      </code>
      
      , <code>
        to
      </code>
      
      .
    </td>
    
    <td>
      The whole drop: <code>
        to.index
      </code>
      
      , <code>
        sameList
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        result
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Can
    </td>
    
    <td>
      Say yes or no.
    </td>
    
    <td>
      Wait for a promise, accept some keys, keep the drag going.
    </td>
  </tr>
</tbody>
</table>

Use `group.put` for what is known from the items alone (a type, a flag, a count): the
user learns it before letting go. Use `onBeforeDrop` for what depends on the place, the
user's answer or the server's. The target's own rules come first: over a list or a target
that refuses the drag, the drop is cancelled and its `onBeforeDrop` isn't asked.

### Accepting some of the items

Some rules can only be checked on release, against a server. Seats of this workshop are booked
by others too: on release, the list asks the server how many are left, and takes that many of
the people dragged in. Tick a few, and drag them in together.

<example height="28.5rem" hint="Tick three people, drag one of them into the workshop" name="drop-partial">



</example>

```ts [Column.vue]
makeSortableList(list, {
  items: toRef(props.column, 'people'),
  group: 'workshop',
  // Some keys: those land, the others fly back to where they came from.
  onBeforeDrop: async (e) => {
    const { free } = await seatsLeft(props.column.people.length); // the overlay waits
    return e.keys.slice(0, free);
  },
  onDrop: (e) => {
    selection.delete(...e.accepted); // the ones sent back stay selected
    notice.value = `${e.accepted.length} booked, ${e.rejected.length} back to the waiting list`;
  },
});
```

In a [multi-drag](https://zizigy.github.io/docs/guides/multi-drag), the keys you return land together and the rest
fly back to their places. `onDrop` then sees them in `e.accepted` and `e.rejected`, and its
`e.result` is the final one. An empty array accepts nothing: the drop is refused.

## Keep dragging: 'continue'

`'continue'` cancels the drop, not the drag. Answer **Keep dragging** in the dialog above:
the item stays in hand from where it was, the page goes back into drag mode, and the user
carries on.

- With a mouse or a pen, the item follows the pointer with no button held. The next release — a
click — drops it, and that click never reaches the page underneath.
- A touch takes the item again where the finger lands; lifting the finger drops it.
- A keyboard drag goes on: the arrows move the item, <kbd value="Space">



</kbd>

 or <kbd value="Enter">



</kbd>


drop it.
- <kbd value="Escape">



</kbd>

 cancels it, as any drag.
- The next drop asks `onBeforeDrop` again.

Monitors hear `onDragResume`, and screen readers hear that the item wasn't dropped and is still
moving (override the text with the provider's `announcements.onDragResume`).

```ts
useDnDMonitor({
  onDragResume() {
    hint.value = 'Still dragging: click to drop, Esc to cancel';
  },
});
```

## Asking the user

`onBeforeDrop` may return a promise. Open a dialog, and resolve the promise with the button the
user picks:

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'release',
  onBeforeDrop: (e) => (props.column.confirm && !e.sameList ? props.ask(e) : 'accept'),
});
```

```ts [Board.vue]
type Answer = 'accept' | 'continue' | 'reject';
const question = shallowRef<{ title: string; resolve: (answer: Answer) => void } | null>(null);

/** Opens the dialog: `onBeforeDrop` waits for the button the user picks. */
const ask = (e: SortableDropEvent<Task>) =>
  new Promise<Answer>((resolve) => {
    question.value = { title: e.items[0]!.title, resolve };
  });
```

While the promise is pending:

- the overlay waits where it was let go, marked `data-dnd-overlay="dropping"`;
- `useDnD()` keeps the state it had at release, and `status` is `'dropping'`;
- the page is out of drag mode: the cursor and text selection are back, so a dialog works as
usual;
- no other drag can start.

<tip>

A modal `<dialog>` opened with `showModal()` sits in the top layer, above the waiting overlay. Turn
its `cancel` event (<kbd value="Escape">



</kbd>

) into `'reject'`, as the example does.

</tip>

## The order of the hooks

Reorder the notes, drop one in the trash, then switch an answer and do it again. The panel
lists the hooks of the last drop in the order they ran.

<example height="27.5rem" hint="Move a note or trash one, then switch an answer to reject or continue" name="drop-hooks">



</example>

1. `onBeforeDrop` of every `useDnDMonitor`, in turn. A `'reject'` or a `'continue'` ends the
asking; keys narrow the drop.
2. `onBeforeDrop` of the target: the list or tree the items go into, or the drop target.
3. `onDrop` of the target only: a list that items leave for another one isn't asked, and its new
array is in the target's `e.result`. When items are removed (a trash zone,
`dropOutside: 'remove'`), their list's `onDrop` runs, with `to.index` of `-1`.
4. The default write: each list the drop changes takes its new array.
5. `onDragEnd` of the provider (`@drag-end`) and the monitors. Then the overlay lands, and
`onDragSettle` (`@drag-settle`) says it has.

A refused drop skips to `onDragCancel` (`@drag-cancel`) instead, and the items fly back. A
`'continue'` ends the asking too, with `onDragResume`: the drag goes on, and its next drop
asks again.

Monitors decide before the target, so a veto never comes after a list has already applied a
drop of its own. That makes a monitor the place for rules about every drop of the app:

```ts [Monitor.vue]
const { syncing } = useSync();

// Read-only while syncing: every drop under the provider flies back.
useDnDMonitor({
  onBeforeDrop: () => (syncing.value ? 'reject' : 'accept'),
});
```

## onDrop: told before the write

```ts
makeSortableList(listRef, {
  items: tasks,
  onDrop: (e) => {
    // `tasks` still holds the old order, `e.result` the new one.
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

A list's `onDrop` runs once the drop is accepted, synchronously, right before the list writes it.
To act after the write, use the provider's `@drag-end` or `useDnDMonitor({ onDragEnd })`. On a
plain drop target, `onDrop` is where you change your data: the library moves nothing for it.

## Stores and servers: controlled lists

```ts
const store = useBoardStore();
const { items } = makeSortableList(listRef, {
  id: 'todo',
  group: 'board',
  items: () => store.lists.todo, // a getter: read-only
  onDrop: (e) => {
    e.preventDefault();
    for (const [listId, next] of e.result) store.setList(listId, next);
  },
});
```

The library writes a drop only into a writable ref. A getter, a `computed` or a `readonly` ref is
never written: call `e.preventDefault()` and apply `e.result` yourself — the new arrays of every
list the drop changes, by list id. `preventDefault()` skips the write into all of them, since
writing only some would lose or duplicate items. Development builds warn when a read-only list's
drop is left to the library.

### Saving to a server first

Move a card with the server **flaky** (every other request fails) or **down**. The card waits
with a badge while the request runs, then lands, or flies back if it failed.

<example height="31.5rem" hint="Move cards, then switch the server to flaky or down" name="drop-server">



</example>

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  // A getter: the library never writes it. The drop is applied below, once saved.
  items: () => board[props.id]!,
  group: 'sprint',
  onBeforeDrop: async (e) => {
    e.preventDefault();
    try {
      await saveMove(e.keys, e.to);
    } catch {
      return 'reject'; // nothing applied: the card flies back
    }
    for (const [id, tasks] of e.result) board[id] = tasks; // lands in its new place
    return 'accept';
  },
});
```

Apply `e.result` before the promise resolves, and the overlay lands in the new order. When
the request fails, apply nothing and reject: the items fly back, and monitors hear
`onDragCancel`.

The badge comes from the provider's `#overlay` slot, which renders every drag's overlay. A
`DragPreview` shows the usual copy of the card, and the badge sits on top while the request
runs:

```vue [index.vue]
<DnDProvider>
  <Board />
  <template #overlay="{ active }">
    <div class="carried">
      <DragPreview :id="active.id" />
      <span v-if="saving" class="saving">Saving…</span>
    </div>
  </template>
</DnDProvider>
```

## Dropping outside every target

Drag an app off the dock and let go, in each mode.

<example height="24.5rem" hint="Drag an app off the dock and let go" name="drop-outside">



</example>

```ts [Dock.vue]
const { items } = makeSortableList(dock, {
  items: apps,
  strategy: 'horizontal',
  dropOutside: () => props.dropOutside,
  // Called on the list the items leave, with `to.index` -1, when they are removed.
  onDrop: (e) => {
    if (e.to.index === -1) notice.value = `Removed ${e.items.map((app) => app.name).join(', ')}`;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      A drop outside every target…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
    </td>
    
    <td>
      Lands where the placeholder is: the last place the list showed. The default.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Is cancelled: the items fly back. The default with <code>
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
      Removes the items from their list. The list's <code>
        onBeforeDrop
      </code>
      
       is asked first, and its <code>
        onDrop
      </code>
      
       gets <code>
        to.index
      </code>
      
       of <code>
        -1
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

It is read at the drop, so a ref or a getter can switch it. A trash zone does the same on
purpose: `makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`. See
[drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
