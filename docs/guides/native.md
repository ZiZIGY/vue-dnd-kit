---
title: "Files and other apps"
description: "The browser's own drag and drop, as drags of the library — files, links and text from other apps into drop targets and lists that make room for them, items dragged out of the page, and between windows of your app."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/native"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

The library's drags live inside the page. The browser has a drag and drop of its own that
crosses the page's edges: files from the desktop, a link from another tab, text from another
app, and items of yours dragged out to all of those. The library runs those drags too, as
drags of the provider: targets light up, lists make room, the events and the screen reader
texts are the usual ones.

<example height="34rem" hint="Drop images, links or text from other apps; drag a card out, or into this page in a second window" name="moodboard">



</example>

## From outside the page

A target takes such drags with `external`, saying what it takes. Targets without it ignore
them.

```ts [Board.vue]
const { items } = makeSortableList(grid, {
  items: cards,
  group: 'moodboard',
  strategy: 'grid',
  external: { files: 'image/*', links: true, text: true },
  createItem: fromOutside,
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        external
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
      <code>
        files
      </code>
    </td>
    
    <td>
      Files: <code>
        true
      </code>
      
       any, MIME types and extensions as <code>
        <input accept>
      </code>
      
       reads them (<code>
        'image/*, .md'
      </code>
      
      ), or a function asked file by file. Folders never.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        multiple
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
      
      : one file at a time. A drag of several is refused.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        links
      </code>
    </td>
    
    <td>
      Links (<code>
        text/uri-list
      </code>
      
      ): an address from another tab, a link from a page.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        text
      </code>
    </td>
    
    <td>
      Plain text: a selection from another app.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      Other MIME types, exactly as other apps offer them.
    </td>
  </tr>
</tbody>
</table>

`makeDroppable` takes the same option: a zone that takes an avatar image is in
[drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop#files-from-the-computer).

### What the drag carries

The browser keeps the data of a drag to itself until it is dropped. While it is held, the
page only learns what kinds of data it carries. `active.external` and `e.external` say
what is known:

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      While held
    </th>
    
    <th>
      At the drop
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      The MIME types it offers: <code>
        Files
      </code>
      
      , <code>
        text/uri-list
      </code>
      
      …
    </td>
    
    <td>
      The same
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fileTypes
      </code>
    </td>
    
    <td>
      One MIME type per file
    </td>
    
    <td>
      The same
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Empty
    </td>
    
    <td>
      The files the target takes, as <code>
        File
      </code>
      
      s
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        urls
      </code>
      
      , <code>
        text
      </code>
      
      , <code>
        html
      </code>
    </td>
    
    <td>
      Empty
    </td>
    
    <td>
      Its links, its text, its HTML
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        getData(type)
      </code>
    </td>
    
    <td>
      <code>
        ''
      </code>
    </td>
    
    <td>
      The data of any type it offers
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ready
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
  </tr>
</tbody>
</table>

### Into a list

A list makes room for it as for a plain draggable: with `createItem`, which is asked twice:
while the drag is held, for the item that shows where it goes, and at the drop, with the
data, for what goes in. A list of items inserts them all at that place: a card per image.

```ts [cards.ts]
export const fromOutside = (active: Active): Card | Card[] | undefined => {
  const { external } = active;
  if (!external) return undefined;
  // While it is held: a tile that says what is coming.
  if (!external.ready) return { id: 'incoming', kind: 'incoming', label: incoming(external) };
  // At the drop: a card each.
  if (external.files.length) {
    return external.files.map((file) => ({ id: uid(), kind: 'image', src: URL.createObjectURL(file), name: file.name }));
  }
  if (external.urls.length) return external.urls.map((url) => ({ id: uid(), kind: 'link', url, title: host(url) }));
  const text = external.text.trim();
  return text ? { id: uid(), kind: 'note', text } : undefined;
};
```

- The incoming tile is a row of your list like any other: the list renders it, the rows
around it slide out of its way, `onDrop` gets the real ones.
- Trees take such drags too, one node at a time: a folder node with a child per file holds
several.
- The drop event has `e.external` with the data, in the list's `onDrop` as in the monitors'.

## Out of the page

With `native`, a mouse drag of an item is the browser's own drag, so it can leave the page:
onto the desktop, into an editor, a chat, another tab.

```ts [Tile.vue]
makeSortableItem(el, {
  item: () => props.card,
  native: { data: () => toOutside(props.card) },
});
```

```ts [cards.ts]
case 'link':
  return { 'text/uri-list': card.url, 'text/plain': card.url };
case 'note':
  return { 'text/plain': card.text };
```

- `data` gives other apps the item as MIME types and text: `text/plain`, `text/uri-list`,
`text/html`. Read when the drag starts. Without it, `native: true` carries the `label` as
text.
- On the page, the drag works as any other: targets, lists that make room, the drop. The
browser draws the dragged image instead of the overlay, and the element stays in place
(`transform` stays `null` with `overlay: false`).
- Touch and keyboard drags of the item stay the library's: the browser has no drag of its own
for them.
- `effect` (`effectAllowed`) says what the place it is dropped on may do: `'copyMove'` by
default. A drop elsewhere ends the drag with `droppedOutside`, `'move'`, `'copy'` or
`'link'`, in `onDragEnd`. A move takes the items out of their list; a copy leaves them.

`makeDraggable` takes `native` the same way.

## Between windows

An item with `native` also carries itself: the lists of its group in another window of your
app take it as if it came from one of their own lists. Open the moodboard in a second window
and drag a card across.

- While it is held, the other window already has the item: its list shows it in place.
- At the drop it goes in, and here it leaves its list (the drop was a move). Hold
<kbd value="Ctrl">



</kbd>

 (<kbd value="Option">



</kbd>

 on a Mac) to copy it instead.
- A list with `createItem` is asked for such items too, with `active.external.group` set and
the items in `active.items[].item`: return them, or copies with keys of that window.
Without `createItem`, they go in as they are.
- Items travel as JSON: dates become strings, functions are left out.

## Limits

- The data comes with the drop only, never before: plan the item that shows while a drag is
held without it.
- Dragging files is for mouse and trackpad users. Offer an `<input type="file">` next to the
zone too.
- One provider of the page takes drags from outside: the first that has a target for them.
- In Firefox, an item moved into another list during the drag and then dropped in another
window doesn't hear about that drop: it stays where it was here.
- An item whose JSON passes 16 KB still goes to another window, but that window shows it only
at the drop.

The API is in [makeDroppable](https://zizigy.github.io/docs/api/make-droppable#from-outside-the-page) and
[makeDraggable](https://zizigy.github.io/docs/api/make-draggable#out-of-the-page).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
