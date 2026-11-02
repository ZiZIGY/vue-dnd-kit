---
title: "Styling"
description: "Every state of a drag, styled — data attributes for plain CSS, refs for classes, targets that say yes or no, the overlay and the page while you drag, the default styles, Tailwind and UI kits."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/styling"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

The library styles almost nothing. Each state of a drag reaches you two ways: as a
`data-dnd-*` attribute, for plain CSS, and as a ref the composable returns, for classes
and conditional markup. Use whichever suits your stack, or both.

## The data attributes

The rows below have no state classes at all: every look comes from an attribute. The
panel lists the attributes on the page as they come and go. Select two rows with
<kbd value="Ctrl">



</kbd>

 or <kbd value="Meta">



</kbd>

 and drag them: the others of a multi-drag show
up too.

<example height="25rem" hint="Drag a row, then Ctrl/⌘-click two and drag them" name="dnd-attributes">



</example>

<table>
<thead>
  <tr>
    <th>
      Attribute
    </th>
    
    <th>
      On
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
        data-dnd-placeholder
      </code>
    </td>
    
    <td>
      a sortable item
    </td>
    
    <td>
      It is the slot a dragged item will land in. <code>
        "into"
      </code>
      
       while the drag is over a <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        drop target inside an item
      </a>
      
      : the drop goes there, and the slot only holds its place.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging
      </code>
    </td>
    
    <td>
      a sortable item
    </td>
    
    <td>
      It is dragged but stays in place: the other items of a multi-drag in <code>
        'gaps'
      </code>
      
       mode.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging="pointer"
      </code>
      
       or <code>
        "keyboard"
      </code>
    </td>
    
    <td>
      <code>
        <html>
      </code>
    </td>
    
    <td>
      For the whole drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay="dragging"
      </code>
      
       or <code>
        "dropping"
      </code>
    </td>
    
    <td>
      the overlay box
    </td>
    
    <td>
      Always. <code>
        dropping
      </code>
      
       while it lands, and while an async <code>
        onBeforeDrop
      </code>
      
       waits.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay-content
      </code>
    </td>
    
    <td>
      the overlay's content
    </td>
    
    <td>
      Always: the element that fills the box and holds what it shows. Yours to animate; it takes the provider's <code>
        overlayClass
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-leaving
      </code>
    </td>
    
    <td>
      a copy left by <code>
        animateChanges
      </code>
    </td>
    
    <td>
      While an item that left fades out.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-no-clone
      </code>
    </td>
    
    <td>
      <strong>
        set by you
      </strong>
    </td>
    
    <td>
      Leaves the element out of the overlay's copy: a tooltip, a menu, a badge.
    </td>
  </tr>
</tbody>
</table>

```css [TaskRow.vue]
/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
}

/* The copy in the overlay, while it travels. */
[data-dnd-overlay='dragging'] .row {
  box-shadow: 0 0 0 1.5px #42b883, 0 14px 24px -10px rgb(0 0 0 / 0.55);
}
```

```vue [TaskRow.vue]
<li ref="el" class="row" :aria-selected="selected">
  <span class="title">{{ task.title }}</span>
  <button type="button" data-dnd-no-clone @click.stop="task.done = !task.done">✓</button>
</li>
```

- The overlay's copy of a row keeps its classes and attributes, Vue's scope attribute
included, so `[data-dnd-overlay] .row` works in the row's own `<style scoped>`. The
copy has no `data-dnd-*` marks of its own: a copy of the slot is not a slot.
- Selection has no attribute. Mirror the `selected` ref into one (`aria-selected` above),
or use a class.
- Plain draggables and drop targets (`makeDraggable`, `makeDroppable`) get no `data-dnd-*`
state attributes: style them with their refs.

## The returned refs

The same states as refs, plus the ones the lists and targets have. Each row and list
below prints the refs that are true right now, and its classes come from them. The
Icebox refuses urgent tasks: drag one over it.

<example height="24rem" hint="Drag a task to the other list; Ctrl/⌘-click selects several" name="dnd-refs">



</example>

```vue [RefRow.vue]
<script setup lang="ts">
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }">…</li>
</template>

<style scoped>
.row.selected { box-shadow: 0 0 0 1.5px #3b82f6; }
.row.placeholder { opacity: 1; box-shadow: inset 0 0 0 1.5px #42b883; }   /* beats the default 40% */
.row.placeholder .title { visibility: hidden; }
</style>
```

```vue [RefList.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(el, { items, group });
</script>

<template>
  <section :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">…</section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Composable
    </th>
    
    <th>
      State
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isPlaceholder
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        index
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        activeKey
      </code>
      
      , <code>
        activeIndex
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        transform
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        placement
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD()
      </code>
    </td>
    
    <td>
      <code>
        status
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        pointer
      </code>
      
      , <code>
        activation.progress
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
</tbody>
</table>

- `isPlaceholder`: this element is the slot a dragged item will land in. In a multi-drag
in `'group'` mode, the slots of the items travelling along are placeholders too.
- `isDragging`: the item is part of the drag: every dragged item in a multi-drag.
- `isAccepting`: something is being dragged, and this target takes it. Light up the places
where a drop is possible.
- `isOver`: the drag is over this target, whether it takes it or not. `isOver && !isAccepting`
is a refusal: show it.
- `indicator`: where the drop line goes in [indicator mode](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line).
- `activation.progress`: from 0 to 1 while a touch long press or a `delay` runs. Fill a
ring with it.

## Drop targets: yes and no

A target has four looks while a drag runs: it takes the drag, it takes it and the pointer
is on it, it refuses it, it refuses it and the pointer is on it. Show all four, and say
it on the dragged item too.

<example height="23rem" hint="Drag a colour over the palettes: the right one invites it, the others don't" name="drop-highlights">



</example>

```ts [Palette.vue]
const { isOver, isAccepting } = makeDroppable(el, { accept: props.tone, onDrop });

const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
```

```css [Palette.vue]
.palette.accepting { border-style: dashed; border-color: #42b883; }          /* an invitation */
.palette.over { border-color: #42b883; background: color-mix(in srgb, #42b883 14%, Canvas); }
.palette.refusing { opacity: 0.45; }                                          /* out of the way */
.palette.refused { border-color: #f43f5e; animation: shake 0.3s; }            /* a drop here is cancelled */
```

The dragged swatch is the provider's `#overlay` slot. It gets `over` and `accepted`:
`accepted` is `false` over a target that refuses the drag.

```vue [index.vue]
<template #overlay="{ active, over, accepted }">
  <div
    class="lifted"
    :class="{ yes: over && accepted, no: over && !accepted }"
    :style="{ background: (active.data as { color: string }).color }"
  >
    <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
  </div>
</template>
```

Outside the overlay, `useDnD().over.value?.accepted` says the same. More on overlay
components in [the overlay](https://zizigy.github.io/docs/guides/overlay).

## The overlay and the page

Two attributes cover the rest of a drag: `data-dnd-overlay` on the overlay box, and
`data-dnd-dragging` on `<html>`, `"pointer"` or `"keyboard"`. The bar above the notes
reads the second one, and says which keys work. Turn on the slow save: the overlay stays
`dropping` where you let go, until `onBeforeDrop` resolves, and shows it.

<example height="27rem" hint="Drag a note with the mouse, then with the keyboard; turn on the slow save" name="overlay-theme">



</example>

```css [index.vue]
.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle { display: none; }

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard { display: inline; }
```

```css [StickyNote.vue]
[data-dnd-overlay='dragging'] .note {
  box-shadow: 0 0 0 2px #42b883, 0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save. */
[data-dnd-overlay='dropping'] .note { opacity: 0.85; }
[data-dnd-overlay='dropping'] .saving { display: flex; }
```

- `dropping` covers the landing and the wait of an async `onBeforeDrop`. While it waits,
`<html>` is out of drag mode: the page's cursor and text selection are back, so a
confirmation dialog works as usual.
- Style what is **inside** the box. The library moves the box itself with `transform`
and sizes it with `width` and `height`. Its content element, `[data-dnd-overlay-content]`,
fills it and is yours: lift and tilt the whole overlay there (see
[animations](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)).
- The copy's root has `transform: none` inline: turn or grow it with `rotate` and `scale`.
Transitions and keyframes both run on it: see
[animations](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).
- The copy shows the element as it is and guesses no background. A row the list paints
(an `<li>` in a white `<ul>`, a table row) needs one: `[data-dnd-overlay] .row { background: Canvas; }`.
- The copy sits in a `<div>` that carries the custom properties the element inherited
(theme colors, `--tw-*`), so they still apply in the overlay, and the copy's own rules
(`in-data-[dnd-overlay]:ring-2`) still beat them. Select the copy by its class, not by
its depth in the box.

## Default styles

The provider injects a few rules once per document. They are wrapped in `:where()`, so
their specificity is zero and any rule of yours wins:

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
:where(html[data-dnd-dragging]), :where(html[data-dnd-dragging] *) {
  user-select: none !important;
  overflow-anchor: none !important;
}
:where(html[data-dnd-dragging='pointer']), :where(html[data-dnd-dragging='pointer'] *) {
  cursor: var(--dnd-cursor, grabbing) !important;
  -webkit-touch-callout: none !important;
}
```

<table>
<thead>
  <tr>
    <th>
      Rule
    </th>
    
    <th>
      Why
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      The slot at 40%
    </td>
    
    <td>
      So a list looks right with no CSS at all. Every demo above overrides it.
    </td>
  </tr>
  
  <tr>
    <td>
      Items left behind at 40%
    </td>
    
    <td>
      The same, for a multi-drag in <code>
        'gaps'
      </code>
      
       mode.
    </td>
  </tr>
  
  <tr>
    <td>
      No <code>
        user-select
      </code>
    </td>
    
    <td>
      A drag doesn't select the text it passes over.
    </td>
  </tr>
  
  <tr>
    <td>
      No <code>
        overflow-anchor
      </code>
    </td>
    
    <td>
      The page doesn't scroll to keep a moving row in view.
    </td>
  </tr>
  
  <tr>
    <td>
      The drag's cursor
    </td>
    
    <td>
      During a pointer drag, everywhere. <code>
        grabbing
      </code>
      
      , unless the grabbed element has a cursor of its own: a resize handle's <code>
        ns-resize
      </code>
      
      , a <code>
        move
      </code>
      
      , an image keep theirs for the whole drag (<code>
        grab
      </code>
      
      , <code>
        pointer
      </code>
      
       and the like still turn into <code>
        grabbing
      </code>
      
      ). <code>
        cursor: grab
      </code>
      
       on draggable items is yours to add. Set <code>
        --dnd-cursor
      </code>
      
       on <code>
        <html>
      </code>
      
       for another default.
    </td>
  </tr>
  
  <tr>
    <td>
      No touch callout
    </td>
    
    <td>
      iOS doesn't open the link menu under a long press.
    </td>
  </tr>
</tbody>
</table>

`:default-styles="false"` on the provider leaves them out. The library still marks
`<html>`, and still clears the text selection when a drag starts and blocks new selections
until it ends: only the CSS is gone. The rules are injected once, by the first provider that
wants them, and stay: turn them off on every provider of the page.

```vue
<DnDProvider :default-styles="false">
```

## Tailwind CSS

The attributes work as variants: `data-[…]` for the element itself, an arbitrary
variant for an ancestor.

```vue [TaskRow.vue]
<li
  ref="el"
  class="rounded-lg bg-white shadow-sm
         data-[dnd-placeholder]:bg-transparent data-[dnd-placeholder]:opacity-100
         data-[dnd-placeholder]:outline-dashed
         [[data-dnd-overlay=dragging]_&]:shadow-xl"
  :class="{ 'ring-2 ring-emerald-500': selected }"
>
```

```vue [Hint.vue]
<p class="hidden [html[data-dnd-dragging=keyboard]_&]:block">Arrows move · Space drops</p>
```

<note>

The library's looks (the 40% opacities) sit in a cascade layer of their own,
`vue-dnd-kit`, declared before any other. Tailwind v4's utilities and the UI kits built on
it live in layers too, and theirs come later, so they win without `!`. Unlayered CSS wins
anyway.

</note>

In Tailwind v4, `in-data-[dnd-overlay=dragging]:shadow-xl` is a shorter way to write the
ancestor variant.

<warning>

In Vue's scoped CSS, `:global()` takes the whole selector: `:global(html[data-dnd-dragging]) .hint`
compiles to `html[data-dnd-dragging]` alone, and hides the page. Write the ancestor
without it, `html[data-dnd-dragging] .hint`: Vue scopes only the last part.

</warning>

## UI kits

- The composables take a component as well as an element: `useTemplateRef` on a kit's
card or list item works, and the library reads its root element.
- Pass state to the kit's own props where it has them (`:active="selected"`,
`:color="isOver ? 'primary' : undefined"`), and the rest as classes.
- A kit's list items often have no background of their own: the list paints it. Their
copy in the overlay is then see-through. Give it one:```css
[data-dnd-overlay] .v-list-item { background: rgb(var(--v-theme-surface)); }
```
- The copy leaves out the press ripples of Vuetify, Quasar, PrimeVue and Naive UI. Mark
anything else that shouldn't travel, a tooltip or a menu button, with
`data-dnd-no-clone`.

## Don't

- Don't put a CSS `transition` on `transform` or `translate` of sortable items: the
library animates them itself, and cancels such transitions while it measures.
- Don't wrap sortable items in `<TransitionGroup>`: moves would animate twice. Use the
list's `animateChanges`.
- Don't animate `height`, `margin` or `padding` of rows in a [virtual list](/docs/guides/virtual-lists).
- Do stop the transitions you add around drags under `prefers-reduced-motion: reduce`.
The library already stops its own.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
