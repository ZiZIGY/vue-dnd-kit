---
title: "Accessibility"
description: "Keyboard drags, screen reader announcements and ARIA attributes are built in. Here is what they do, how to word them in any language, and how to offer moves without dragging."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Everything on this page is on by default. Tab to an agenda item, press <kbd value="Space">



</kbd>

,
move it with the arrow keys and press <kbd value="Space">



</kbd>

 again, or <kbd value="Escape">



</kbd>

 to
put it back. The panel shows what a screen reader is told, in the language you pick.

<example height="28.5rem" hint="Tab to an item: Space, arrows, Space. Switch the language" name="a11y-announcer">



</example>

What is usually left to you: readable texts for the items, and buttons that move them for
people who can't drag at all.

## The keyboard

<table>
<thead>
  <tr>
    <th>
      Key
    </th>
    
    <th>
      Action
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Pick up the focused item; drop it.
    </td>
  </tr>
  
  <tr>
    <td>
      Arrows
    </td>
    
    <td>
      Move it: by slots in lists, by rows and depth in trees, by <code>
        keyboard.step
      </code>
      
       pixels in free drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Cancel the drag — pointer drags too.
    </td>
  </tr>
</tbody>
</table>

- In a list, an arrow toward another list of the same group moves the item there.
- In a free drag, <kbd value="Shift">



</kbd>

 makes the steps bigger. `makeDraggable(el, { keyboardMode: 'droppables' })`
makes the arrows jump between the targets that accept the item instead.
- A keyboard drag starts from the focused draggable, or its handle — never from a button or a
field inside it, so those keep their own keys.
- Keyboard drags scroll the item into view instead of auto-scrolling at the edges.
- After the drop, focus goes back to the item, even when its row was re-rendered in another
list.

### Other keys

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

Bindings match `event.code` (`'Space'`, `'KeyD'`) or `event.key` (`'Enter'`). `step` is the
pixels per arrow press in free drags (25 by default). `:keyboard="false"` turns keyboard
drags off, and <kbd value="Escape">



</kbd>

 still cancels any drag. When you change the keys, change
the `screen-reader-instructions` too.

## ARIA attributes

Focus each shortcut, or turn the attributes off, and watch what the library sets. Drag one
to see `aria-pressed` come and go on the button.

<example height="27rem" hint="Tab through the shortcuts; toggle the attributes" name="a11y-attributes">



</example>

Every draggable and sortable item gets these, **unless you set them yourself**:

<table>
<thead>
  <tr>
    <th>
      Attribute
    </th>
    
    <th>
      Value
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
      , when the element isn't focusable already (a <code>
        <div>
      </code>
      
      ; not an <code>
        <a href>
      </code>
      
       or a <code>
        <button>
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        role
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
      , except on a <code>
        <button>
      </code>
      
      , which is one.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-roledescription
      </code>
    </td>
    
    <td>
      <code>
        draggable
      </code>
      
      , or <code>
        sortable
      </code>
      
       on sortable items.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      The provider's instructions, added next to the ids already there (a tooltip's survives).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       or <code>
        false
      </code>
      
      : whether the item is disabled (also by a disabled drag area).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       while it is dragged, on elements with the <code>
        button
      </code>
      
       role.
    </td>
  </tr>
</tbody>
</table>

`attributes: false` on an item removes what the library had set, live. The panel reads the
attributes back: `aria-describedby` points to the provider's instructions, which a screen
reader reads after the item's name.

### Links and buttons that drag

`aria-roledescription` replaces the name of the role: a screen reader says "Inbox,
sortable" instead of "Inbox, button". For an element whose role matters, set your own; the
library leaves it alone:

```vue [Shortcut.vue]
<script setup lang="ts">
makeSortableItem(el, {
  item: () => props.shortcut,
  // Enter follows the link: only Space picks it up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});
</script>

<template>
  <a ref="el" :href="shortcut.href" role="link" aria-roledescription="draggable link">
    {{ shortcut.title }}
  </a>
</template>
```

- A link keeps working: a click opens it, but the click that ends a drag never reaches it.
<kbd value="Enter">



</kbd>

 would start a drag, so `canDrag` turns that down and the browser follows
the link.
- A `<button>` keeps its click too, and the library adds neither `role` nor `tabindex`.
- Buttons, links and fields **inside** an item don't start pointer drags, so a row can hold
its own actions.

### Handles: make them real buttons

```vue [Track.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ track: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track, handle: '.grip' });
</script>

<template>
  <li ref="el" class="track">
    {{ track.title }}
    <button type="button" class="grip" :aria-label="`Drag ${track.title}`">⠿</button>
  </li>
</template>
```

With a `handle`, the attributes go on the handle, and keyboard drags start from it (the
**Archive** shortcut above). A `<button>` is focusable and a button already, so it needs no
`tabindex` or `role`. Give it an `aria-label`: a grip icon has no name of its own, and "Drag
Midnight Drive" says more than "button".

<tip>

The handle keeps the focus for the whole keyboard drag, while its row is the slot. Empty the
slot with `opacity: 0` rather than `visibility: hidden` or `display: none` on the handle: a
hidden element drops the focus. The library gives it back after the drop, but a screen reader
may say "body" in between.

</tip>

## Announcements

A live region in the provider speaks every pickup, move, drop and cancel. Sortable lists say
where the item is: *"Picked up item t2 at position 2 of 5 in list playlist."* Moves are
spoken once the drag has rested for 500 ms, so a fast pointer drag isn't read slot by slot.
The demo's panel logs every text the provider is given, including the moves a pointer drag
passes on its way.

The built-in texts are in English, and name things by their ids unless you give them a
`label`. Items, lists, trees and drop targets all take one:

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*"Picked up Blue in Green at position 2 of 5 in Playlist."* The labels reach your own texts
and monitors too: `active.label`, `over.label`, each of `active.items`, and in the context
`position.label` and `partner.label`.

For another language, or other words, write the texts yourself, as the agenda does. Each
text gets the event and a `context`: the `position` the built-in text would speak (`list`,
`index` from 0, `length`, the list's `label`), and `count`, `copy` and a swap's `partner`.

```ts [index.vue]
const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

const announcements = computed<Partial<Announcements>>(() => {
  const t = LANGUAGES[lang.value]!;
  return {
    onDragStart: ({ active }, { position }) => position && t.start(titleOf(active.id), position.index + 1, position.length),
    onDragOver: ({ active }, { position }) => position && t.move(titleOf(active.id), position.index + 1, position.length),
    onDragEnd: ({ active }, { position }) => position && t.drop(titleOf(active.id), position.index + 1, position.length),
    onDragCancel: ({ active }, { position }) => position && t.cancel(titleOf(active.id), position.index + 1),
    onDragResume: ({ active }) => t.resume(titleOf(active.id)),
  };
});
```

```vue [index.vue]
<DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
```

<table>
<thead>
  <tr>
    <th>
      <code>
        context
      </code>
    </th>
    
    <th>
      At the start
    </th>
    
    <th>
      While moving
    </th>
    
    <th>
      At the end
    </th>
    
    <th>
      On cancel
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Where it was picked up
    </td>
    
    <td>
      Where it would land; none outside the lists
    </td>
    
    <td>
      Where it landed
    </td>
    
    <td>
      Where it went back to
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        partner
      </code>
    </td>
    
    <td>
      
    </td>
    
    <td>
      A swap: the item exchanged with, and where it is now
    </td>
    
    <td>
      The same, after the drop
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      , <code>
        copy
      </code>
    </td>
    
    <td>
      How many items, and whether the drag copies
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Event
    </th>
    
    <th>
      Spoken when
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        onDragStart
      </code>
    </td>
    
    <td>
      The item is picked up.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      The item moves to another place (a slot of a list, another target), once the drag rests for 500 ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      It is dropped. The new order is already written.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      The drag is cancelled, or the drop refused: the item went back.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragResume
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       answered <code>
        'continue'
      </code>
      
      : the drag goes on (see <a href="/docs/guides/drop-decisions">
        deciding a drop
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

- A text replaces the event's announcement; `undefined` keeps the default; `''` says
nothing. Events you leave out keep their defaults, such as the positions of sortable lists.
- `screenReaderInstructions` is the text every draggable points to with `aria-describedby`.
Both props are reactive: the demo switches the language live.
- `:announcements="false"` silences the region, e.g. when you announce through your own.

<note>

For another language, give all five texts and the instructions: each one you leave out is
spoken in English, sortable positions included. Set the page's `lang` too, so the screen
reader picks the right voice.

</note>

## Moving without dragging

Some people can't drag at all. WCAG 2.5.7 asks for a way to move items with single
clicks. Use the arrows and the check on each row: they move the books without a drag, and
the focus stays where you are.

<example height="27.5rem" hint="Use the arrow buttons with the keyboard, or drag a grip" name="a11y-move-buttons">



</example>

A button changes the data; the list draws the move. With `animateChanges` on the list, the rows
slide as they do in a drag (and stay still for users who ask for reduced motion):

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animateChanges: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};
```

```vue [ReadingList.vue]
<p class="status" role="status">{{ message }}</p>
```

### Keep the focus

Moving an element in the DOM takes the focus away from it, so the button that was just
pressed loses it. Give it back once the row has moved:

```ts [BookRow.vue]
const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Back on the same button, or on the other one when this one is now disabled.
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};
```

A row that goes away (the check marks a book as read) takes the focus with it: move it to
the next row, or the last one. Drags need none of this: the library puts the focus back on
the dropped item itself, even when it re-renders in another list.

<tip>

`@vue-dnd-kit/actions` turns each button into a real keyboard drag instead: `moveItem(id, { index })`
is announced, goes through `onBeforeDrop` and `onDrop`, animates, and keeps the focus on the
item. See [programmatic drags](https://zizigy.github.io/docs/guides/sensors#programmatic-drags).

</tip>

## Touch

Touch drags start after a 200 ms long press. Moving more than 5 px first scrolls the page
instead, so lists stay scrollable. Tune both with the provider's `activation`, and draw a
long-press ring from `useDnD().activation.progress`: see
[the provider](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag). A touch drag vibrates
briefly when it starts; `:haptics="false"` turns that off.

## Reduced motion

With `prefers-reduced-motion: reduce`, the library's own animations don't run: items jump
to their places while sorting, the overlay doesn't fly on drop, and `animateChanges` changes
appear at once. Your own animation functions still run, with `reducedMotion: true`, so you
decide: skip them, or keep a short fade. See [animations](https://zizigy.github.io/docs/guides/animations).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
