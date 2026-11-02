---
title: "Migrating from v2"
description: "Move a v2 app to v3 — what changed and why, the upgrade, a map from every v2 API to its v3 replacement, before-and-after code for the common cases, and the pitfalls."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 is a rewrite of v2. The model stays: one provider, and composables you call on your own
elements. But most names and options changed, sorting moved into the library, and the drop
handler you wrote for each list goes away. This page maps each part of v2 to v3, then shows
the common cases before and after.

## What changed

- **Sorting is built in.** In v2 a list was a drop zone, its rows were draggables with an
`[index, items]` payload, and you sorted in `onDrop` with `e.helpers.suggestSort()`. In v3,
`makeSortableList` and `makeSortableItem` do it: the list renders a **draft** of your array
that reorders while you drag, and the drop writes the new array into your ref. Most v2 drop
handlers are deleted, not ported.
- **Things move by themselves.** Rows slide to their new places (FLIP), the overlay lands on
its slot on drop and flies back on cancel. `<TransitionGroup>` goes away.
- **Still one package.** `@vue-dnd-kit/core` holds lists, trees, multi-drag, modifiers,
sensors and the collision functions. The Nuxt module stays; `@vue-dnd-kit/actions`
(programmatic drags) and `@vue-dnd-kit/devtools` are new and optional.
- **A real overlay.** It is teleported to `body` and shows a deep clone, sized to the slot it
will land in. Overlay components get the drag as props instead of reading the provider's
internals.
- **Ids, not elements.** The selection, the events and the drag state are keyed by ids from
your data. There are no maps of DOM elements to read.
- **Types and accept rules** replace `groups` for plain draggables and targets. Lists trade
items by `group` name.
- **Decisions before the drop.** `onBeforeDrop` accepts, refuses, keeps the drag going or
takes some of the items. `onDrop` only applies.
- **Sensors.** Pointer and keyboard input are sensors. Activation is set per pointer kind,
and touch drags start with a long press, so lists keep scrolling under a finger.
- **Areas.** `makeDragArea` replaces `makeConstraintArea` and `makeAutoScroll`, and
auto-scroll works in every scroll container without code.
- **Accessibility is on by default**: ARIA attributes, focus that comes back after the drop,
and screen reader announcements.

## Upgrade

While v3 is in beta, it is published under the npm tag `next`. `latest` stays on v2 until
3.0.0, so an install without the tag still gets v2.

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@next
```

```bash [yarn]
yarn add @vue-dnd-kit/core@next
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@next
```

```bash [bun]
bun add @vue-dnd-kit/core@next
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      Package
    </th>
    
    <th>
      v2 (<code>
        latest
      </code>
      
      )
    </th>
    
    <th>
      v3 (<code>
        next
      </code>
      
      )
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.0.0-beta
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.0.0-beta
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.0.0-beta, optional
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.0.0-beta, optional
    </td>
  </tr>
</tbody>
</table>

- Pin the exact beta version in `package.json`: betas can still change.
- Vue **3.5** or newer. v2 had no dependencies; v3 has one, `@vueuse/core` (14 or 15).
- Browsers: Chrome and Edge 104+, Safari 15.4+, Firefox 104+.
- v2 and v3 share a package name, so an app moves to v3 in one go. There is no
compatibility layer. The v2 docs stay available from the version menu at the top of the
page.

A good order of work:

1. Upgrade the packages and rename the provider's props ([below](#the-provider)).
2. Turn each sortable list into `makeSortableList` and `makeSortableItem`, and delete its drop
handler.
3. Port the plain draggables and drop zones.
4. Port custom previews to overlay components or the provider's `#overlay` slot.
5. Replace `makeConstraintArea` and `makeAutoScroll` with `makeDragArea`, or with nothing.
6. Delete the v2 workarounds: `tabindex` and `aria-grabbed` on draggables, `touch-action: none`
on whole items, `<TransitionGroup>` around rows, `markRaw` around preview components.

## Old to new

**No equivalent** in a table means v3 has nothing of that name; the cell says what to use
instead.

### At a glance

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      <code>
        DnDProvider
      </code>
      
      , with new props and an <code>
        #overlay
      </code>
      
       slot.
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
        makeDraggable
      </code>
      
       for free dragging; <code>
        makeSortableItem
      </code>
      
       for the rows of a list.
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
        makeDroppable
      </code>
      
       for plain drop targets; <code>
        makeSortableList
      </code>
      
       or <code>
        makeSortableTree
      </code>
      
       for lists and trees.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      Nothing: auto-scroll is automatic. <code>
        makeDragArea
      </code>
      
       or a list's <code>
        autoScroll
      </code>
      
       tunes it.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      <code>
        useDnD
      </code>
      
       for the state, <code>
        useDnDMonitor
      </code>
      
       for the events.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
       and <code>
        provideDnDContext(app, context)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      : now the clone of one dragged item, for overlays of your own.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      , <code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      The <code>
        snapToGrid
      </code>
      
       modifier.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      , <code>
        suggestSwap
      </code>
      
      , <code>
        suggestCopy
      </code>
      
      , <code>
        suggestRemove
      </code>
    </td>
    
    <td>
      Built into lists: see <a href="#sorting">
        sorting
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

### The provider

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      , off unless set
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      : <strong>
        on by default
      </strong>
      
      , for the window and every scroll container. <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
      , or <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      , by default rendered inside the provider
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      : a selector or an element, <code>
        'body'
      </code>
      
       by default.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #preview="{ preview }"
      </code>
      
       slot
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       slot, with the drag as props: <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        to
      </code>
      
      . See <a href="#the-overlay">
        the overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      , <code>
        forDrop
      </code>
      
      , <code>
        forCancel
      </code>
      
       (set on <code>
        useDnDProvider()
      </code>
      
      )
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      : 25 px by default, for free drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      , <code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
      
       The arrows move; <kbd value="Shift">
        
      </kbd>
      
       makes the steps of a free drag four times bigger.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
      
       <code>
        collision
      </code>
      
       picks how the target is found: <code>
        pointerFirst
      </code>
      
       (default), <code>
        pointerWithin
      </code>
      
      , <code>
        rectIntersection
      </code>
      
      , <code>
        closestCenter
      </code>
      
      , <code>
        closestCorners
      </code>
      
       or a function of yours.
    </td>
  </tr>
  
  <tr>
    <td>
      One provider per page, never nested
    </td>
    
    <td>
      Nesting works: the closest provider owns an item. One provider for the app is still the goal.
    </td>
  </tr>
</tbody>
</table>

New props with no v2 counterpart: `activation`, `modifiers`, `sensors`, `animation`,
`dropAnimation`, `animateChanges`, `haptics`, `copyModifier`, `overlayFit`, `overlayClass`,
`overlayTransition`, `overlayPreviews`, `announcements`, `screenReaderInstructions` and
`defaultStyles`. The provider also emits `drag-start`, `drag-move`, `drag-over`, `drag-end`,
`drag-cancel` and `drag-settle`. All of them are in [the provider guide](https://zizigy.github.io/docs/guides/provider).

### Reading the state: `useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      : <code>
        'dragging'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'selecting'
      </code>
      
      , <code>
        'pending'
      </code>
      
       or <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      : <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       or <code>
        'selecting'
      </code>
      
      . <code>
        'pending'
      </code>
      
       (an async drop) is <code>
        'dropping'
      </code>
      
      ; <code>
        null
      </code>
      
       is <code>
        'idle'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      , after modifiers. Every event also has <code>
        delta
      </code>
      
      , the offset from the start.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
       (elements)
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
       (ids): <code>
        has
      </code>
      
      , <code>
        add
      </code>
      
      , <code>
        delete
      </code>
      
      , <code>
        toggle
      </code>
      
      , <code>
        set
      </code>
      
      , <code>
        clear
      </code>
      
      , <code>
        ids
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      , <code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      : <code>
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
        delay.progress
      </code>
      
      , <code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      , from <code>
        0
      </code>
      
       to <code>
        1
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      , <code>
        preview.size
      </code>
      
      , <code>
        preview.render
      </code>
      
      , <code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
      
       The library places and sizes the overlay. Use <code>
        overlayTo
      </code>
      
      , the <code>
        #overlay
      </code>
      
       slot or overlay components.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      , <code>
        droppableMap
      </code>
      
      , the <code>
        visible…Set
      </code>
      
      s, <code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      New: <code>
        useDnD().cancel()
      </code>
      
      , <code>
        position
      </code>
      
      , <code>
        isAutoScrolling
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

The events moved to `useDnDMonitor`: see [events and drop decisions](#events-and-drop-decisions).
Full shapes in the [useDnD API](https://zizigy.github.io/docs/api/use-dnd).

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      : no third argument. The rows of a list use <code>
        makeSortableItem(ref, { item })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      , needed in virtual lists
    </td>
    
    <td>
      <code>
        id
      </code>
      
      : pass it from your data, as a getter. The default comes from <code>
        useId()
      </code>
      
       and is new for every component instance.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      : a value, a ref or a getter. Read back as <code>
        active.data
      </code>
      
       and <code>
        active.items[i].data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      , matched by the targets' <code>
        accept
      </code>
      
      . See <a href="#groups">
        groups
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      : a selector or an element ref.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      : a gate for each press.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      <code>
        activation
      </code>
      
       per pointer kind: <code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      . With <code>
        distance
      </code>
      
       and <code>
        delay
      </code>
      
       both, the drag starts at whichever comes first.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
      
       One <code>
        distance
      </code>
      
       per pointer kind.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      : the component gets the drag as props. See <a href="#the-overlay">
        the overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
      
       A drop target on a sortable item counts in its middle (25 to 75%); trees nest with <code>
        nesting: 'hover'
      </code>
      
      . See <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        drop into a sortable item
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      , <code>
        onSelfDragMove
      </code>
      
      , <code>
        onSelfDragEnd
      </code>
      
      , <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent
      </strong>
      
       on the draggable: <code>
        useDnDMonitor
      </code>
      
      , or <code>
        watch(isDragging)
      </code>
      
      . See <a href="#events-and-drop-decisions">
        events
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
      , and its <code>
        onDragStart
      </code>
      
      … for drags over it
    </td>
    
    <td>
      A <code>
        makeDroppable
      </code>
      
       on the same element: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Returns <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
    </td>
    
    <td>
      The same.
    </td>
  </tr>
  
  <tr>
    <td>
      Returns <code>
        isDragOver
      </code>
    </td>
    
    <td>
      Sortable items return <code>
        indicator
      </code>
      
       (with <code>
        placeholder: 'indicator'
      </code>
      
      ) and <code>
        isPlaceholder
      </code>
      
      ; targets return <code>
        placement
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Returns <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent
      </strong>
      
       on draggables. Targets return <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      New: <code>
        label
      </code>
      
      , <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        overlay: false
      </code>
      
       with the returned <code>
        transform
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        attributes
      </code>
      
      , <code>
        native
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      . A zone that holds a list is a <code>
        makeSortableList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      : <code>
        '*'
      </code>
      
      , a type, a list of types, or a function.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      : options of their own, no <code>
        events
      </code>
      
       object.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
      , which could return <code>
        false
      </code>
      
       or a promise
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       decides, <code>
        onDrop
      </code>
      
       applies. See <a href="#events-and-drop-decisions">
        drop decisions
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , returning the ids to keep.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      , read back as <code>
        over.data
      </code>
      
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
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Returns <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Returns <code>
        isDragOver
      </code>
      
      : <code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
       (a boolean), and <code>
        placement
      </code>
      
      : <code>
        { top, right, bottom, left }
      </code>
      
      , the halves the pointer is in. There is no <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      New: <code>
        id
      </code>
      
      , <code>
        label
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        overOverlay
      </code>
      
      , <code>
        overDropAnimation
      </code>
      
      , <code>
        external
      </code>
      
       (files from the computer).
    </td>
  </tr>
</tbody>
</table>

### The drop event

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        IDragEvent
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      : <code>
        { id, item, data, label, type }
      </code>
      
       each, the grabbed one first. Lists get <code>
        e.items
      </code>
      
       and <code>
        e.keys
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      , <code>
        .items
      </code>
    </td>
    
    <td>
      Lists: <code>
        e.from
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      : <code>
        items
      </code>
      
      , <code>
        placement
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      : <code>
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
      
      . Lists: <code>
        e.to
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent
      </strong>
      
      : lists work out <code>
        e.to.index
      </code>
      
       themselves.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      Lists write the drop; <code>
        e.result
      </code>
      
       holds the new array of every list it changes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
       on the list; <code>
        e.partner
      </code>
      
       is the item it traded with.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       or the copy key (<kbd value="Alt">
        
      </kbd>
      
      ), with the list's <code>
        clone
      </code>
      
      ; <code>
        e.mode
      </code>
      
       is <code>
        'copy'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        e.source.remove()
      </code>
      
       in a drop target, or the list's <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      , <code>
        removeAt
      </code>
      
      , <code>
        removeIndexes
      </code>
      
      , <code>
        swapAt
      </code>
      
      , <code>
        getInsertSide
      </code>
      
      , <code>
        isAtZoneStart
      </code>
      
      , <code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
      
       Lists don't need them; for a plain target, change your data as you like.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      New: <code>
        e.pointer
      </code>
      
      , <code>
        e.delta
      </code>
      
      , <code>
        e.position
      </code>
      
       (where to put an item dropped on a board), <code>
        e.mode
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Sorting

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      A <code>
        makeDroppable
      </code>
      
       list with <code>
        () => items
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      A <code>
        makeDraggable
      </code>
      
       row with <code>
        () => [index, items]
      </code>
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Render your array
    </td>
    
    <td>
      Render the returned <code>
        items
      </code>
      
      : the draft that reorders while you drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      , <code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
       (default), <code>
        'horizontal'
      </code>
      
       or <code>
        'grid'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Identity checks to find the source and target arrays, then assigning <code>
        sourceItems
      </code>
      
       and <code>
        targetItems
      </code>
    </td>
    
    <td>
      Nothing: the drop writes every list it changes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      Built in. <code>
        animateChanges: true
      </code>
      
       animates changes no drag made (adding, removing, shuffling).
    </td>
  </tr>
  
  <tr>
    <td>
      An insertion line from <code>
        isDragOver.top
      </code>
      
      , <code>
        .bottom
      </code>
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
       and the item's <code>
        indicator.side
      </code>
      
      . See <a href="/docs/guides/sortable-lists#an-insertion-line">
        an insertion line
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      A copy-only palette (<code>
        suggestCopy()
      </code>
      
       and a <code>
        copyOnly
      </code>
      
       flag)
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      , <code>
        sort: false
      </code>
      
       and <code>
        clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      A trash zone with <code>
        suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
      , or <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia or immutable data: assign the result yourself
    </td>
    
    <td>
      <code>
        items
      </code>
      
       as a getter, then <code>
        e.preventDefault()
      </code>
      
       in <code>
        onDrop
      </code>
      
       and apply <code>
        e.result
      </code>
      
      . See <a href="/docs/guides/shared-lists#controlled-lists">
        controlled lists
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      A recursive tree: a droppable per folder and <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      : one container, rows rendered flat with their depth. See <a href="/docs/guides/trees">
        trees
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Nested groups with <code>
        v-model
      </code>
      
       (a droppable per group)
    </td>
    
    <td>
      A list inside a list, all in one <code>
        group
      </code>
      
      , each with <code>
        items: defineModel()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Virtual lists: <code>
        id
      </code>
      
       on every draggable
    </td>
    
    <td>
      Feed the draft to the virtualizer, <code>
        id: () => props.item.id
      </code>
      
       on the rows. See <a href="/docs/guides/virtual-lists">
        virtual lists
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

The code before and after is [below](#a-sortable-list). Everything about lists is in
[sortable lists](https://zizigy.github.io/docs/guides/sortable-lists) and [lists that share items](https://zizigy.github.io/docs/guides/shared-lists).

### Groups

v2 had one `groups` option for everything. v3 splits it in two:

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev', 'ops']
      </code>
      
       on a zone
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
      , or a function: <code>
        ({ active, items, types }) => boolean
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
      , or none
    </td>
    
    <td>
      <code>
        type
      </code>
      
       or <code>
        accept
      </code>
      
       left out. The v2 rules hold: an untyped draggable fits any rule, and a target without <code>
        accept
      </code>
      
       takes everything.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       on a list zone and its rows
    </td>
    
    <td>
      <code>
        group: 'board'
      </code>
      
       on <code>
        makeSortableList
      </code>
      
      . <code>
        group: { name, pull, put }
      </code>
      
       says what may leave and enter.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       on <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

A list without `group` is a group of its own and trades with no other list. In v2, a zone
without groups took everything. See [which drags a target takes](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes).

### The overlay

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      A preview rendered in the provider, teleported with <code>
        previewTo
      </code>
    </td>
    
    <td>
      Always teleported, to <code>
        body
      </code>
      
       or to <code>
        overlayTo
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      A clone: the same tag, its <code>
        innerHTML
      </code>
      
       and its size
    </td>
    
    <td>
      A deep clone: form values, <code>
        <canvas>
      </code>
      
       pixels, inherited styles and table cells come along. Mark what stays behind with <code>
        data-dnd-no-clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
      
      , which reads <code>
        useDnDProvider().entities
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      , which gets <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
       and <code>
        to
      </code>
      
       as props. No <code>
        markRaw
      </code>
      
      ; use a <code>
        shallowRef
      </code>
      
       to switch it.
    </td>
  </tr>
  
  <tr>
    <td>
      The <code>
        #preview
      </code>
      
       slot, positioned from <code>
        preview.position
      </code>
    </td>
    
    <td>
      The <code>
        #overlay
      </code>
      
       slot: the library places and sizes the box. Rendering nothing falls back to the clone.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      The <code>
        #overlay
      </code>
      
       slot, or a <code>
        shallowRef
      </code>
      
       passed as <code>
        overlay
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      A new look over a zone, from <code>
        onEnter
      </code>
      
       and <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        overOverlay
      </code>
      
       on <code>
        makeDroppable
      </code>
      
       or a list, or read <code>
        over
      </code>
      
       in the overlay component. See <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        targets that change the overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      The overlay props' <code>
        items
      </code>
      
      ; <code>
        <DragPreview :id="item.id" />
      </code>
      
       renders one clone.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      The <code>
        snapToGrid
      </code>
      
       modifier. It snaps where targets are found and the drop's <code>
        position
      </code>
      
       too, not only the picture.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <Transition>
      </code>
      
       or motion's <code>
        AnimatePresence
      </code>
      
       around <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        overlay-class
      </code>
      
       with <code>
        @starting-style
      </code>
      
       for the pickup, <code>
        dropAnimation
      </code>
      
       for the landing, <code>
        overlayTransition
      </code>
      
       between components. See <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        lift, tilt, settle
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      <code>
        [data-dnd-overlay]
      </code>
      
       (<code>
        "dragging"
      </code>
      
      , <code>
        "dropping"
      </code>
      
      ) on the box, <code>
        [data-dnd-overlay-content]
      </code>
      
       inside it.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.size
      </code>
      
      , kept up to date by hand
    </td>
    
    <td>
      The box takes the size of the slot it will land in (<code>
        overlayFit
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      The preview disappears on drop
    </td>
    
    <td>
      It lands on its slot, or flies back on cancel.
    </td>
  </tr>
</tbody>
</table>

More in [the overlay guide](https://zizigy.github.io/docs/guides/overlay).

### Selection and multi-drag

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        selected
      </code>
      
      , returned by <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        selected
      </code>
      
      , returned by <code>
        makeDraggable
      </code>
      
       and <code>
        makeSortableItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      , a set of elements
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      , keyed by id.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      : Ctrl (<code>
        ControlLeft
      </code>
      
      ) held by default
    </td>
    
    <td>
      No key by default: a press on the area's empty space draws the band. <code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       brings Ctrl back.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier.keys
      </code>
      
       as <code>
        KeyboardEvent.code
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
       (<code>
        'Control'
      </code>
      
      , <code>
        'Shift'
      </code>
      
      ) or <code>
        .code
      </code>
      
       (<code>
        'ControlLeft'
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      , <code>
        'select'
      </code>
    </td>
    
    <td>
      The same.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
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
      The same.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort()
      </code>
      
       moving the selection as a batch
    </td>
    
    <td>
      Lists move it. <code>
        multiple: 'group'
      </code>
      
       (default), <code>
        'gaps'
      </code>
      
       or <code>
        'stack'
      </code>
      
       says what the other items do on the way.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       for mixed selections
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       and <code>
        onBeforeDrop
      </code>
      
       returning ids. See <a href="/docs/guides/multi-drag#taking-only-some">
        taking only some
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

More in [multi-drag and selection](https://zizigy.github.io/docs/guides/multi-drag).

### Axes, bounds and snapping

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      , for the drags that start inside it. <code>
        axis
      </code>
      
       also works on a draggable, a list, a tree or an item.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      <code>
        axis
      </code>
      
       left out.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
      , or the modifiers <code>
        restrictToParent
      </code>
      
       and <code>
        restrictToElement(el)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      A provider per region, to keep rules apart
    </td>
    
    <td>
      One provider and a <code>
        makeDragArea
      </code>
      
       per region. Its items can still move anywhere.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       or <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      , in <code>
        modifiers
      </code>
      
       on the provider, an area, a list or a draggable.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      New: <code>
        restrictToWindowEdges
      </code>
      
      , <code>
        restrictToFirstScrollableAncestor
      </code>
      
      , <code>
        snapCenterToCursor
      </code>
      
      , and modifiers of your own.
    </td>
  </tr>
</tbody>
</table>

More in [axes, bounds and grids](https://zizigy.github.io/docs/guides/constraints).

### Auto-scroll

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      , off by default
    </td>
    
    <td>
      On by default, for the window and every scroll container. <code>
        :auto-scroll="false"
      </code>
      
       turns it off.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      Nothing: any <code>
        overflow: auto
      </code>
      
       or <code>
        scroll
      </code>
      
       element scrolls. To tune one: <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       or the list's <code>
        autoScroll
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        threshold
      </code>
      
       in px, or per side
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      : a fraction of the container's size (<code>
        0.2
      </code>
      
      ), between 24 and 96 px. <strong>
        No equivalent
      </strong>
      
       for per-side thresholds.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
      
      , a multiplier
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
       (25 px per frame) and <code>
        acceleration
      </code>
      
       (10).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        isAutoScrolling
      </code>
      
      , from <code>
        makeDragArea
      </code>
      
       or <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Keyboard and accessibility

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex="0"
      </code>
      
       on every draggable
    </td>
    
    <td>
      Set for you, with <code>
        role
      </code>
      
      , <code>
        aria-roledescription
      </code>
      
      , <code>
        aria-describedby
      </code>
      
      , <code>
        aria-disabled
      </code>
      
       and <code>
        aria-pressed
      </code>
      
      . Your own attributes win.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        :aria-grabbed="isDragging"
      </code>
      
       by hand
    </td>
    
    <td>
      Remove it: <code>
        aria-pressed
      </code>
      
       follows the drag.
    </td>
  </tr>
  
  <tr>
    <td>
      Keys set on <code>
        useDnDProvider().keyboard.keys
      </code>
    </td>
    
    <td>
      The provider's <code>
        keyboard
      </code>
      
       prop. Bindings match <code>
        event.code
      </code>
      
       or <code>
        event.key
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Arrows move the preview by <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      Free drags: <code>
        keyboard.step
      </code>
      
       px. Lists: by slots, and into the next list of the group. <code>
        keyboardMode: 'droppables'
      </code>
      
       jumps between targets.
    </td>
  </tr>
  
  <tr>
    <td>
      Rebinding the arrows (<code>
        forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      )
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      No announcements
    </td>
    
    <td>
      A live region speaks every pickup, move, drop and cancel. <code>
        label
      </code>
      
       names things; <code>
        announcements
      </code>
      
       and <code>
        screenReaderInstructions
      </code>
      
       reword them.
    </td>
  </tr>
</tbody>
</table>

More in [accessibility](https://zizigy.github.io/docs/guides/accessibility).

### Events and drop decisions

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Draggable <code>
        events.onSelfDragStart
      </code>
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      , checking <code>
        active.ids
      </code>
      
      . For a class, <code>
        isDragging
      </code>
      
       is enough.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      The monitor's <code>
        onDragMove
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      , dropped or cancelled
    </td>
    
    <td>
      The monitor's <code>
        onDragEnd
      </code>
      
       (a drop) and <code>
        onDragCancel
      </code>
      
      . <code>
        onDragSettle
      </code>
      
       hears both, once the overlay has landed.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      The monitor's <code>
        onDragCancel
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Draggable <code>
        onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
      , and its <code>
        onDragStart
      </code>
      
      … for drags over it
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       on the element: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      . Rows of a list need nothing.
    </td>
  </tr>
  
  <tr>
    <td>
      Droppable <code>
        events.onEnter
      </code>
      
      , <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Droppable <code>
        events.onDrop
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       decides, then <code>
        onDrop
      </code>
      
       applies. <code>
        onDrop
      </code>
      
       is synchronous, and what it returns is ignored.
    </td>
  </tr>
  
  <tr>
    <td>
      Droppable <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , with <code>
        acceptMode: 'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      New: the provider's <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
      , and the monitor's <code>
        onDragOver
      </code>
      
      , <code>
        onBeforeDrop
      </code>
      
       and <code>
        onDragResume
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

A v2 `onDrop` could return a value, or a promise of one, to decide the drop. In v3 that is the
job of `onBeforeDrop`, on lists, trees, drop targets and monitors:

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        onDrop
      </code>
      
       returns
    </th>
    
    <th>
      v3 <code>
        onBeforeDrop
      </code>
      
       returns
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Nothing, or <code>
        true
      </code>
      
      : the drop goes through
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       or nothing.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      : this drop is declined, the drag stays active
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      . <strong>
        <code>
          false
        </code>
        
         now refuses the drop.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      A rejected promise, or a throw: the drag is cancelled
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       or <code>
        false
      </code>
      
      . A throw rejects too.
    </td>
  </tr>
  
  <tr>
    <td>
      A promise; meanwhile <code>
        state
      </code>
      
       is <code>
        'pending'
      </code>
    </td>
    
    <td>
      A promise; meanwhile <code>
        status
      </code>
      
       is <code>
        'dropping'
      </code>
      
       and the overlay waits with <code>
        data-dnd-overlay="dropping"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       returns <code>
        IDragItem[]
      </code>
    </td>
    
    <td>
      An array of ids: only those drop, the others fly back.
    </td>
  </tr>
</tbody>
</table>

Monitors answer first, then the target. Then the target's `onDrop` runs, a list writes its
new arrays, and `onDragEnd` follows. More in [deciding a drop](https://zizigy.github.io/docs/guides/drop-decisions)
and the [events API](https://zizigy.github.io/docs/api/events).

### Types

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
       (targets, monitors), <code>
        SortableDropEvent
      </code>
      
       (lists), <code>
        DnDEndEvent
      </code>
      
       (<code>
        onDragEnd
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        No equivalent.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      , <code>
        ISuggestSwapResult
      </code>
      
      , <code>
        ISuggestCopyResult
      </code>
      
      , <code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      : <code>
        result
      </code>
      
      , <code>
        to
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        partner
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      , in <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        Placement
      </code>
      
      , without <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
      , what <code>
        useDnD()
      </code>
      
       returns.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      , <code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      Callbacks in <code>
        DraggableOptions
      </code>
      
      , <code>
        DroppableOptions
      </code>
      
      , and <code>
        DnDMonitor
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@next @vue-dnd-kit/core@next
```

<table>
<thead>
  <tr>
    <th>
      v2 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x)
    </th>
    
    <th>
      v3 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.0.0-beta)
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Auto-imports <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeConstraintArea
      </code>
      
      , <code>
        makeAutoScroll
      </code>
      
      , <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      Auto-imports <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableItem
      </code>
      
      , <code>
        makeSortableTree
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeDragArea
      </code>
      
      , <code>
        useDnD
      </code>
      
      , <code>
        useDnDMonitor
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      No types auto-imported
    </td>
    
    <td>
      The main types are (<code>
        DnDEvent
      </code>
      
      , <code>
        SortableDropEvent
      </code>
      
      , <code>
        OverlayProps
      </code>
      
      …). Generic ones (<code>
        Key
      </code>
      
      , <code>
        Active
      </code>
      
      , <code>
        Over
      </code>
      
      ) are imported by hand.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Modifiers, collision functions and sensors on request: <code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
       and <code>
        DragPreview
      </code>
      
       global
    </td>
    
    <td>
      The same, with a <code>
        prefix
      </code>
      
       option.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview />
      </code>
      
       in the layout, inside the provider
    </td>
    
    <td>
      Remove it: the provider renders the overlay. <code>
        DragPreview
      </code>
      
       takes an <code>
        id
      </code>
      
       and belongs inside overlay components.
    </td>
  </tr>
  
  <tr>
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       3; Nuxt 4.
    </td>
  </tr>
</tbody>
</table>

`modules: ['@vue-dnd-kit/nuxt']` in `nuxt.config.ts` stays as it was. See
[installation](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Before and after

### A draggable and a drop zone

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- The card gets `tabindex`, `role` and the `aria-*` attributes by itself. A `<button>` handle
is focusable, and keyboard drags start from it.
- `groups` became `type` on the draggable and `accept` on the target. The callbacks left the
`events` object.
- `isOver` without `isAccepting` is a target that refuses the drag: a drop there flies back.

### A sortable list

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- Render `items`, the draft: it reorders while you drag. `tasks` gets the new order on drop,
and `defineModel` emits `update:modelValue`.
- No index, no payload, no `onDrop`, no `<TransitionGroup>`: the rows slide by themselves.
- The dragged row stays in the list as the slot it will land in. Style it with `isPlaceholder`
or `[data-dnd-placeholder]` instead of hiding it.

### Lists that share items

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

The drop writes both arrays, the one the task left and the one it entered. `TaskItem.vue` is
the one from the sortable list above. A palette that hands out copies was `suggestCopy()`
and a `copyOnly` flag; now it is a list:

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

For a Pinia store or other state you don't write directly, pass `items` as a getter, call
`e.preventDefault()` in `onDrop` and apply `e.result`: see
[controlled lists](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

### A custom overlay

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- The component gets the drag as props: `items` (every dragged item, the grabbed one first),
`over`, `accepted`, `status`, `mode` and `to`. Declare only the ones you read. For a list's
rows, the list item is `items[0].item`.
- Pass it as it is. Switch it with a `shallowRef`, never a deep `ref`.

The provider's slot changes the same way, and your component no longer positions itself:

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

A pop-in that wrapped `DragPreview` in a `<Transition>` becomes `overlay-class` with
`@starting-style`: see [lift, tilt, settle](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).

### A drop you confirm

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

A list asks the same way, and a promise lets you open a dialog of your own. The overlay
waits where it was let go until the promise settles:

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

A zone that took only the matching part of a mixed selection (`groupMatch: 'some'`):

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

Lists do this without code: with `acceptMode: 'some'`, the items their `group.put` takes land,
and the others fly back.

## Pitfalls when upgrading

- **Install with @next.** Without the tag, npm installs v2.
- **Render the draft.** A list renders the `items` that `makeSortableList` returns, not your
array. Rendering your array, nothing moves until the drop.
- **Don't sort twice.** Delete the `suggestSort` code from lists: a list writes each drop into
a writable `items` ref after its `onDrop`. To apply it yourself, call `e.preventDefault()`
and use `e.result`.
- **false refuses the drop.** In v2, an `onDrop` that resolved `false` kept the drag going.
In v3, return `'continue'` from `onBeforeDrop`. A promise returned from `onDrop` is ignored.
- **Lists share only within a group.** A list without one trades with no other list.
- **Key rows by id.** `:key="index"` animates the wrong rows. Pass ids from your data too: a
default id is new for every component instance.
- **No <TransitionGroup>, no transition on transform.** The library moves the rows
itself, and moves would animate twice.
- **Undo the touch workaround.** `touch-action: none` on a whole item keeps the page from
scrolling under a finger; v3 starts touch drags with a long press instead. Keep it on a
handle that should drag at once, with `activation: { touch: { distance: 4 } }`.
- **Remove stale attributes.** The library sets `tabindex`, `role` and the `aria-*` it needs
and never overrides yours, so a leftover `role` or `aria-grabbed` stays as you left it.
- **Restyle the overlay.** `.dnd-kit-preview` is gone: style what is inside
`[data-dnd-overlay='dragging']`, never the box's `transform`. Give the root of an overlay
component `width: 100%; height: 100%`, and take `<DragPreview />` out of your layouts.
- **Auto-scroll is on.** Pass `:auto-scroll="false"` where v2 never scrolled.
- **A band needs no key.** `makeSelectionArea` draws from a plain press on its empty space. Add
a `modifier` to keep v2's Ctrl.
- **One provider, areas inside.** Items can't cross providers. A page that used a provider per
region to keep their rules apart needs one provider and a `makeDragArea` per region.
- **Two arguments.** `makeDraggable` and `makeDroppable` take a ref and an options object, no
payload.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
