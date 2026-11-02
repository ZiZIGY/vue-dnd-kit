---
title: "Migrating from v2 · Vue DnD Kit"
description: "Move a v2 app to v3 — what changed and why, the upgrade, a map from every v2 API to its v3 replacement, before-and-after code for the common cases, and the pitfalls."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/migrating-from-v2"
meta:
  "og:description": "Move a v2 app to v3 — what changed and why, the upgrade, a map from every v2 API to its v3 replacement, before-and-after code for the common cases, and the pitfalls."
  "og:title": "Migrating from v2 · Vue DnD Kit"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Documentación/Primeros pasos

# Migrating from v2

Move a v2 app to v3 — what changed and why, the upgrade, a map from every v2 API to its v3 replacement, before-and-after code for the common cases, and the pitfalls.

[Editar esta página](https://github.com/ZiZIGY/vue-dnd-kit/edit/v3/docs/content/en/1.getting-started/4.migrating-from-v2.md)

Esta página aún no está traducida. Estás leyendo el original en inglés.

v3 is a rewrite of v2. The model stays: one provider, and composables you call on your own elements. But most names and options changed, sorting moved into the library, and the drop handler you wrote for each list goes away. This page maps each part of v2 to v3, then shows the common cases before and after.

## What changed

- ****Sorting is built in.**** In v2 a list was a drop zone, its rows were draggables with an `**[index, items]**` payload, and you sorted in `**onDrop**` with `**e.helpers.suggestSort()**`. In v3, `**makeSortableList**` and `**makeSortableItem**` do it: the list renders a ****draft**** of your array that reorders while you drag, and the drop writes the new array into your ref. Most v2 drop handlers are deleted, not ported.
- ****Things move by themselves.**** Rows slide to their new places (FLIP), the overlay lands on its slot on drop and flies back on cancel. `**<TransitionGroup>**` goes away.
- ****Still one package.**** `**@vue-dnd-kit/core**` holds lists, trees, multi-drag, modifiers, sensors and the collision functions. The Nuxt module stays; `**@vue-dnd-kit/actions**` (programmatic drags) and `**@vue-dnd-kit/devtools**` are new and optional.
- ****A real overlay.**** It is teleported to `**body**` and shows a deep clone, sized to the slot it will land in. Overlay components get the drag as props instead of reading the provider's internals.
- ****Ids, not elements.**** The selection, the events and the drag state are keyed by ids from your data. There are no maps of DOM elements to read.
- ****Types and accept rules**** replace `**groups**` for plain draggables and targets. Lists trade items by `**group**` name.
- ****Decisions before the drop.**** `**onBeforeDrop**` accepts, refuses, keeps the drag going or takes some of the items. `**onDrop**` only applies.
- ****Sensors.**** Pointer and keyboard input are sensors. Activation is set per pointer kind, and touch drags start with a long press, so lists keep scrolling under a finger.
- ****Areas.**** `**makeDragArea**` replaces `**makeConstraintArea**` and `**makeAutoScroll**`, and auto-scroll works in every scroll container without code.
- ****Accessibility is on by default****: ARIA attributes, focus that comes back after the drop, and screen reader announcements.

## Upgrade

While v3 is in beta, it is published under the npm tag `**next**`. `**latest**` stays on v2 until 3.0.0, so an install without the tag still gets v2.

```
npm i @vue-dnd-kit/core@next
```

| **Package** | **v2 (**`**latest**`**)** | **v3 (**`**next**`**)** |
| --- | --- | --- |
| `**@vue-dnd-kit/core**` | 2.4.x | 3.0.0-beta |
| `**@vue-dnd-kit/nuxt**` | 1.x | 3.0.0-beta |
| `**@vue-dnd-kit/actions**` | — | 1.0.0-beta, optional |
| `**@vue-dnd-kit/devtools**` | — | 3.0.0-beta, optional |

- Pin the exact beta version in `**package.json**`: betas can still change.
- Vue ****3.5**** or newer. v2 had no dependencies; v3 has one, `**@vueuse/core**` (14 or 15).
- Browsers: Chrome and Edge 104+, Safari 15.4+, Firefox 104+.
- v2 and v3 share a package name, so an app moves to v3 in one go. There is no compatibility layer. The v2 docs stay available from the version menu at the top of the page.

A good order of work:

1. Upgrade the packages and rename the provider's props ([**below**](#the-provider)).
2. Turn each sortable list into `**makeSortableList**` and `**makeSortableItem**`, and delete its drop handler.
3. Port the plain draggables and drop zones.
4. Port custom previews to overlay components or the provider's `**#overlay**` slot.
5. Replace `**makeConstraintArea**` and `**makeAutoScroll**` with `**makeDragArea**`, or with nothing.
6. Delete the v2 workarounds: `**tabindex**` and `**aria-grabbed**` on draggables, `**touch-action: none**` on whole items, `**<TransitionGroup>**` around rows, `**markRaw**` around preview components.

## Old to new

****No equivalent**** in a table means v3 has nothing of that name; the cell says what to use instead.

### At a glance

| **v2** | **v3** |
| --- | --- |
| `**DnDProvider**` | `**DnDProvider**`, with new props and an `**#overlay**` slot. |
| `**makeDraggable**` | `**makeDraggable**` for free dragging; `**makeSortableItem**` for the rows of a list. |
| `**makeDroppable**` | `**makeDroppable**` for plain drop targets; `**makeSortableList**` or `**makeSortableTree**` for lists and trees. |
| `**makeSelectionArea**` | `**makeSelectionArea**`. |
| `**makeConstraintArea**` | `**makeDragArea**`. |
| `**makeAutoScroll**` | Nothing: auto-scroll is automatic. `**makeDragArea**` or a list's `**autoScroll**` tunes it. |
| `**useDnDProvider**` | `**useDnD**` for the state, `**useDnDMonitor**` for the events. |
| `**injectionKey**` | `**useDnDContext()**` and `**provideDnDContext(app, context)**`. |
| `**DragPreview**` | `**DragPreview**`: now the clone of one dragged item, for overlays of your own. |
| `**makeSnappedOverlayPosition**`, `**<DragPreview :grid>**` | The `**snapToGrid**` modifier. |
| `**e.helpers.suggestSort**`, `**suggestSwap**`, `**suggestCopy**`, `**suggestRemove**` | Built into lists: see [**sorting**](#sorting). |

### The provider

| **v2** | **v3** |
| --- | --- |
| `**autoScrollViewport**`, off unless set | `**autoScroll**`: ****on by default****, for the window and every scroll container. `**{ threshold, maxSpeed, acceleration }**`, or `**false**`. |
| `**previewTo**`, by default rendered inside the provider | `**overlayTo**`: a selector or an element, `**'body'**` by default. |
| `**#preview="{ preview }"**` slot | `**#overlay**` slot, with the drag as props: `**items**`, `**active**`, `**over**`, `**accepted**`, `**status**`, `**mode**`, `**to**`. See [**the overlay**](#the-overlay). |
| `**keyboard.keys.forDrag**`, `**forDrop**`, `**forCancel**` (set on `**useDnDProvider()**`) | `**:keyboard="{ keys: { start, drop, cancel } }"**`. |
| `**keyboard.step**` | `**:keyboard="{ step }"**`: 25 px by default, for free drags. |
| `**keyboard.keys.forMove**`, `**forMoveFaster**`, `**keyboard.moveFaster**` | ****No equivalent.**** The arrows move; `Shift` makes the steps of a free drag four times bigger. |
| `**collision.throttle**` | ****No equivalent.**** `**collision**` picks how the target is found: `**pointerFirst**` (default), `**pointerWithin**`, `**rectIntersection**`, `**closestCenter**`, `**closestCorners**` or a function of yours. |
| One provider per page, never nested | Nesting works: the closest provider owns an item. One provider for the app is still the goal. |

New props with no v2 counterpart: `**activation**`, `**modifiers**`, `**sensors**`, `**animation**`, `**dropAnimation**`, `**animateChanges**`, `**haptics**`, `**copyModifier**`, `**overlayFit**`, `**overlayClass**`, `**overlayTransition**`, `**overlayPreviews**`, `**announcements**`, `**screenReaderInstructions**` and `**defaultStyles**`. The provider also emits `**drag-start**`, `**drag-move**`, `**drag-over**`, `**drag-end**`, `**drag-cancel**` and `**drag-settle**`. All of them are in [**the provider guide**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/provider).

### Reading the state: `**useDnD**`

| `**useDnDProvider()**` | **v3** |
| --- | --- |
| `**state**`: `**'dragging'**`, `**'activating'**`, `**'selecting'**`, `**'pending'**` or `**null**` | `**useDnD().status**`: `**'idle'**`, `**'activating'**`, `**'dragging'**`, `**'dropping'**` or `**'selecting'**`. `**'pending'**` (an async drop) is `**'dropping'**`; `**null**` is `**'idle'**`. |
| `**pointer.value.current**` | `**useDnD().pointer**`, after modifiers. Every event also has `**delta**`, the offset from the start. |
| `**entities.draggingMap**` | `**useDnD().active**`: `**id**`, `**ids**`, `**items**`, `**data**`, `**type**`, `**element**`, `**rect**`. |
| `**entities.selectedSet**` (elements) | `**useDnD().selection**` (ids): `**has**`, `**add**`, `**delete**`, `**toggle**`, `**set**`, `**clear**`, `**ids**`. |
| `**hovered.droppable**`, `**hovered.draggable**` | `**useDnD().over**`: `**id**`, `**data**`, `**element**`, `**rect**`, `**accepted**`. |
| `**delay.progress**`, `**distanceProgress**` | `**useDnD().activation.progress**`, from `**0**` to `**1**`. |
| `**preview.position**`, `**preview.size**`, `**preview.render**`, `**preview.to**` | ****No equivalent.**** The library places and sizes the overlay. Use `**overlayTo**`, the `**#overlay**` slot or overlay components. |
| `**entities.draggableMap**`, `**droppableMap**`, the `**visible…Set**`s, `**scrollPosition**` | ****No equivalent.**** |
| — | New: `**useDnD().cancel()**`, `**position**`, `**isAutoScrolling**`. |

The events moved to `**useDnDMonitor**`: see [**events and drop decisions**](#events-and-drop-decisions). Full shapes in the [**useDnD API**](https://zizigy.github.io/vue-dnd-kit/es/docs/api/use-dnd).

### `**makeDraggable**`

| **v2** | **v3** |
| --- | --- |
| `**makeDraggable(ref, options, payload)**` | `**makeDraggable(ref, options)**`: no third argument. The rows of a list use `**makeSortableItem(ref, { item })**`. |
| `**id**`, needed in virtual lists | `**id**`: pass it from your data, as a getter. The default comes from `**useId()**` and is new for every component instance. |
| `**data: () => card**` | `**data**`: a value, a ref or a getter. Read back as `**active.data**` and `**active.items[i].data**`. |
| `**groups: ['dev']**` | `**type: 'dev'**`, matched by the targets' `**accept**`. See [**groups**](#groups). |
| `**dragHandle: '.handle'**` | `**handle**`: a selector or an element ref. |
| `**disabled**` | `**disabled**`. |
| `**modifier: { keys, method }**` | `**canDrag: (event) => event.altKey**`: a gate for each press. |
| `**activation: { distance, delay }**` | `**activation**` per pointer kind: `**{ mouse: { distance }, touch: { delay, tolerance }, pen }**`. With `**distance**` and `**delay**` both, the drag starts at whichever comes first. |
| `**activation.distance: { x, y, condition }**` | ****No equivalent.**** One `**distance**` per pointer kind. |
| `**render: markRaw(Preview)**` | `**overlay: Preview**`: the component gets the drag as props. See [**the overlay**](#the-overlay). |
| `**placementMargins**` | ****No equivalent.**** A drop target on a sortable item counts in its middle (25 to 75%); trees nest with `**nesting: 'hover'**`. See [**drop into a sortable item**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/drag-and-drop#drop-into-a-sortable-item). |
| `**events.onSelfDragStart**`, `**onSelfDragMove**`, `**onSelfDragEnd**`, `**onSelfDragCancel**` | ****No equivalent**** on the draggable: `**useDnDMonitor**`, or `**watch(isDragging)**`. See [**events**](#events-and-drop-decisions). |
| `**events.onHover**`, `**onLeave**`, and its `**onDragStart**`… for drags over it | A `**makeDroppable**` on the same element: `**onDragEnter**`, `**onDragLeave**`. |
| Returns `**isDragging**`, `**selected**` | The same. |
| Returns `**isDragOver**` | Sortable items return `**indicator**` (with `**placeholder: 'indicator'**`) and `**isPlaceholder**`; targets return `**placement**`. |
| Returns `**isAllowed**` | ****No equivalent**** on draggables. Targets return `**isAccepting**`. |
| — | New: `**label**`, `**axis**`, `**modifiers**`, `**keyboardMode**`, `**overlay: false**` with the returned `**transform**`, `**dropAnimation**`, `**attributes**`, `**native**`. |

### `**makeDroppable**`

| **v2** | **v3** |
| --- | --- |
| `**makeDroppable(ref, options, () => items)**` | `**makeDroppable(ref, options)**`. A zone that holds a list is a `**makeSortableList**`. |
| `**groups**` | `**accept**`: `**'*'**`, a type, a list of types, or a function. |
| `**groupMatch: 'every'**`, `**'some'**` | `**acceptMode: 'all'**`, `**'some'**`. |
| `**events.onEnter**`, `**events.onLeave**` | `**onDragEnter**`, `**onDragLeave**`: options of their own, no `**events**` object. |
| `**events.onDrop**`, which could return `**false**` or a promise | `**onBeforeDrop**` decides, `**onDrop**` applies. See [**drop decisions**](#events-and-drop-decisions). |
| `**events.onValidate**` | `**onBeforeDrop**`, returning the ids to keep. |
| `**data**` | `**data**`, read back as `**over.data**`. |
| `**disabled**` | `**disabled**`. |
| Returns `**isAllowed**` | `**isAccepting**`. |
| Returns `**isDragOver**`: `**{ top, right, bottom, left, center }**` | `**isOver**` (a boolean), and `**placement**`: `**{ top, right, bottom, left }**`, the halves the pointer is in. There is no `**center**`. |
| — | New: `**id**`, `**label**`, `**priority**`, `**overOverlay**`, `**overDropAnimation**`, `**external**` (files from the computer). |

### The drop event

| **v2 **`**IDragEvent**` | **v3** |
| --- | --- |
| `**e.draggedItems**` | `**e.active.items**`: `**{ id, item, data, label, type }**` each, the grabbed one first. Lists get `**e.items**` and `**e.keys**`. |
| `**e.draggedItems[0].data**` | `**e.active.data**`. |
| `**e.draggedItems[i].index**`, `**.items**` | Lists: `**e.from**`, `**{ list, index }**`. |
| `**e.dropZone**`: `**items**`, `**placement**`, `**data**` | `**e.over**`: `**id**`, `**data**`, `**element**`, `**rect**`, `**accepted**`. Lists: `**e.to**`, `**{ list, index }**`. |
| `**e.hoveredDraggable**` | ****No equivalent****: lists work out `**e.to.index**` themselves. |
| `**e.helpers.suggestSort()**` | Lists write the drop; `**e.result**` holds the new array of every list it changes. |
| `**e.helpers.suggestSwap()**` | `**behavior: 'swap'**` on the list; `**e.partner**` is the item it traded with. |
| `**e.helpers.suggestCopy()**` | `**group: { name, pull: 'clone' }**` or the copy key (`Alt`), with the list's `**clone**`; `**e.mode**` is `**'copy'**`. |
| `**e.helpers.suggestRemove()**` | `**e.source.remove()**` in a drop target, or the list's `**dropOutside: 'remove'**`. |
| `**result.sameList**` | `**e.sameList**`. |
| `**e.helpers.insertAt**`, `**removeAt**`, `**removeIndexes**`, `**swapAt**`, `**getInsertSide**`, `**isAtZoneStart**`, `**isAtZoneEnd**` | ****No equivalent.**** Lists don't need them; for a plain target, change your data as you like. |
| `**e.provider**` | `**useDnD()**`. |
| — | New: `**e.pointer**`, `**e.delta**`, `**e.position**` (where to put an item dropped on a board), `**e.mode**`. |

### Sorting

| **v2** | **v3** |
| --- | --- |
| A `**makeDroppable**` list with `**() => items**` | `**makeSortableList(listRef, { items })**`. |
| A `**makeDraggable**` row with `**() => [index, items]**` | `**makeSortableItem(el, { item: () => props.task })**`. |
| Render your array | Render the returned `**items**`: the draft that reorders while you drag. |
| `**suggestSort('vertical')**`, `**suggestSort('horizontal')**` | `**strategy: 'vertical'**` (default), `**'horizontal'**` or `**'grid'**`. |
| Identity checks to find the source and target arrays, then assigning `**sourceItems**` and `**targetItems**` | Nothing: the drop writes every list it changes. |
| `**<TransitionGroup>**` | Built in. `**animateChanges: true**` animates changes no drag made (adding, removing, shuffling). |
| An insertion line from `**isDragOver.top**`, `**.bottom**` | `**placeholder: 'indicator'**` and the item's `**indicator.side**`. See [**an insertion line**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/sortable-lists#an-insertion-line). |
| `**suggestSwap()**` | `**behavior: 'swap'**`. |
| A copy-only palette (`**suggestCopy()**` and a `**copyOnly**` flag) | `**group: { name, pull: 'clone', put: false }**`, `**sort: false**` and `**clone**`. |
| A trash zone with `**suggestRemove()**` | `**makeDroppable(trash, { onDrop: (e) => e.source?.remove() })**`, or `**dropOutside: 'remove'**`. |
| Pinia or immutable data: assign the result yourself | `**items**` as a getter, then `**e.preventDefault()**` in `**onDrop**` and apply `**e.result**`. See [**controlled lists**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/shared-lists#controlled-lists). |
| A recursive tree: a droppable per folder and `**applyToTree**` | `**makeSortableTree**`: one container, rows rendered flat with their depth. See [**trees**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/trees). |
| Nested groups with `**v-model**` (a droppable per group) | A list inside a list, all in one `**group**`, each with `**items: defineModel()**`. |
| Virtual lists: `**id**` on every draggable | Feed the draft to the virtualizer, `**id: () => props.item.id**` on the rows. See [**virtual lists**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/virtual-lists). |

The code before and after is [**below**](#a-sortable-list). Everything about lists is in [**sortable lists**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/sortable-lists) and [**lists that share items**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/shared-lists).

### Groups

v2 had one `**groups**` option for everything. v3 splits it in two:

| **v2** | **v3** |
| --- | --- |
| `**makeDraggable(el, { groups: ['dev'] })**` | `**makeDraggable(el, { type: 'dev' })**`. |
| `**makeDroppable(el, { groups: ['dev'] })**` | `**makeDroppable(el, { accept: 'dev' })**`. |
| `**groups: ['dev', 'ops']**` on a zone | `**accept: ['dev', 'ops']**`, or a function: `**({ active, items, types }) => boolean**`. |
| `**groups: []**`, or none | `**type**` or `**accept**` left out. The v2 rules hold: an untyped draggable fits any rule, and a target without `**accept**` takes everything. |
| `**groupMatch: 'every'**`, `**'some'**` | `**acceptMode: 'all'**`, `**'some'**`. |
| `**groups**` on a list zone and its rows | `**group: 'board'**` on `**makeSortableList**`. `**group: { name, pull, put }**` says what may leave and enter. |
| `**groups**` on `**makeSelectionArea**` | `**accept**`. |

A list without `**group**` is a group of its own and trades with no other list. In v2, a zone without groups took everything. See [**which drags a target takes**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/drag-and-drop#which-drags-a-target-takes).

### The overlay

| **v2** | **v3** |
| --- | --- |
| A preview rendered in the provider, teleported with `**previewTo**` | Always teleported, to `**body**` or to `**overlayTo**`. |
| A clone: the same tag, its `**innerHTML**` and its size | A deep clone: form values, `**<canvas>**` pixels, inherited styles and table cells come along. Mark what stays behind with `**data-dnd-no-clone**`. |
| `**render: markRaw(Preview)**`, which reads `**useDnDProvider().entities**` | `**overlay: Preview**`, which gets `**items**`, `**active**`, `**over**`, `**accepted**`, `**status**`, `**mode**` and `**to**` as props. No `**markRaw**`; use a `**shallowRef**` to switch it. |
| The `**#preview**` slot, positioned from `**preview.position**` | The `**#overlay**` slot: the library places and sizes the box. Rendering nothing falls back to the clone. |
| `**useDnDProvider().preview.render.value = …**` | The `**#overlay**` slot, or a `**shallowRef**` passed as `**overlay**`. |
| A new look over a zone, from `**onEnter**` and `**onLeave**` | `**overOverlay**` on `**makeDroppable**` or a list, or read `**over**` in the overlay component. See [**targets that change the overlay**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/overlay#targets-that-change-the-overlay). |
| `**<DragPreview v-slot="{ draggingMap }">**` | The overlay props' `**items**`; `**<DragPreview :id="item.id" />**` renders one clone. |
| `**<DragPreview :grid>**`, `**makeSnappedOverlayPosition**` | The `**snapToGrid**` modifier. It snaps where targets are found and the drop's `**position**` too, not only the picture. |
| `**<Transition>**` or motion's `**AnimatePresence**` around `**DragPreview**` | `**overlay-class**` with `**@starting-style**` for the pickup, `**dropAnimation**` for the landing, `**overlayTransition**` between components. See [**lift, tilt, settle**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/animations#the-overlay-lift-tilt-settle). |
| `**.dnd-kit-preview**` | `**[data-dnd-overlay]**` (`**"dragging"**`, `**"dropping"**`) on the box, `**[data-dnd-overlay-content]**` inside it. |
| `**preview.size**`, kept up to date by hand | The box takes the size of the slot it will land in (`**overlayFit**`). |
| The preview disappears on drop | It lands on its slot, or flies back on cancel. |

More in [**the overlay guide**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/overlay).

### Selection and multi-drag

| **v2** | **v3** |
| --- | --- |
| `**selected**`, returned by `**makeDraggable**` | `**selected**`, returned by `**makeDraggable**` and `**makeSortableItem**`. |
| `**entities.selectedSet**`, a set of elements | `**useDnD().selection**`, keyed by id. |
| `**makeSelectionArea**`: Ctrl (`**ControlLeft**`) held by default | No key by default: a press on the area's empty space draws the band. `**modifier: { keys: ['Control'], method: 'every' }**` brings Ctrl back. |
| `**modifier.keys**` as `**KeyboardEvent.code**` | `**KeyboardEvent.key**` (`**'Control'**`, `**'Shift'**`) or `**.code**` (`**'ControlLeft'**`). |
| `**strategy: 'toggle'**`, `**'select'**` | The same. |
| `**groups**` | `**accept**`. |
| `**events.onSelected(elements)**` | `**onSelected(ids)**`. |
| `**disabled**` | The same. |
| `**suggestSort()**` moving the selection as a batch | Lists move it. `**multiple: 'group'**` (default), `**'gaps'**` or `**'stack'**` says what the other items do on the way. |
| `**onValidate**` for mixed selections | `**acceptMode: 'some'**` and `**onBeforeDrop**` returning ids. See [**taking only some**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/multi-drag#taking-only-some). |

More in [**multi-drag and selection**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/multi-drag).

### Axes, bounds and snapping

| **v2** | **v3** |
| --- | --- |
| `**makeConstraintArea(el, { axis: 'x' })**` | `**makeDragArea(el, { axis: 'x' })**`, for the drags that start inside it. `**axis**` also works on a draggable, a list, a tree or an item. |
| `**axis: 'both'**` | `**axis**` left out. |
| `**restrictToArea: true**` | `**makeDragArea(el, { restrictToArea: true })**`, or the modifiers `**restrictToParent**` and `**restrictToElement(el)**`. |
| A provider per region, to keep rules apart | One provider and a `**makeDragArea**` per region. Its items can still move anywhere. |
| `**<DragPreview :grid="20">**`, `**makeSnappedOverlayPosition**` | `**snapToGrid(20)**` or `**snapToGrid({ x, y, origin, smooth })**`, in `**modifiers**` on the provider, an area, a list or a draggable. |
| — | New: `**restrictToWindowEdges**`, `**restrictToFirstScrollableAncestor**`, `**snapCenterToCursor**`, and modifiers of your own. |

More in [**axes, bounds and grids**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/constraints).

### Auto-scroll

| **v2** | **v3** |
| --- | --- |
| `**<DnDProvider :autoScrollViewport="true">**`, off by default | On by default, for the window and every scroll container. `**:auto-scroll="false"**` turns it off. |
| `**makeAutoScroll(el, { threshold, speed })**` | Nothing: any `**overflow: auto**` or `**scroll**` element scrolls. To tune one: `**makeDragArea(el, { autoScroll: { … } })**` or the list's `**autoScroll**`. |
| `**threshold**` in px, or per side | `**threshold**`: a fraction of the container's size (`**0.2**`), between 24 and 96 px. ****No equivalent**** for per-side thresholds. |
| `**speed**`, a multiplier | `**maxSpeed**` (25 px per frame) and `**acceleration**` (10). |
| `**disabled: true**` | `**autoScroll: false**`. |
| `**isScrolling**` | `**isAutoScrolling**`, from `**makeDragArea**` or `**useDnD()**`. |

### Keyboard and accessibility

| **v2** | **v3** |
| --- | --- |
| `**tabindex="0"**` on every draggable | Set for you, with `**role**`, `**aria-roledescription**`, `**aria-describedby**`, `**aria-disabled**` and `**aria-pressed**`. Your own attributes win. |
| `**:aria-grabbed="isDragging"**` by hand | Remove it: `**aria-pressed**` follows the drag. |
| Keys set on `**useDnDProvider().keyboard.keys**` | The provider's `**keyboard**` prop. Bindings match `**event.code**` or `**event.key**`. |
| Arrows move the preview by `**keyboard.step**` | Free drags: `**keyboard.step**` px. Lists: by slots, and into the next list of the group. `**keyboardMode: 'droppables'**` jumps between targets. |
| Rebinding the arrows (`**forMove**`, `**forMoveFaster**`) | ****No equivalent.**** |
| No announcements | A live region speaks every pickup, move, drop and cancel. `**label**` names things; `**announcements**` and `**screenReaderInstructions**` reword them. |

More in [**accessibility**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/accessibility).

### Events and drop decisions

| **v2** | **v3** |
| --- | --- |
| Draggable `**events.onSelfDragStart**` | `**useDnDMonitor({ onDragStart })**`, checking `**active.ids**`. For a class, `**isDragging**` is enough. |
| `**onSelfDragMove**` | The monitor's `**onDragMove**`. |
| `**onSelfDragEnd**`, dropped or cancelled | The monitor's `**onDragEnd**` (a drop) and `**onDragCancel**`. `**onDragSettle**` hears both, once the overlay has landed. |
| `**onSelfDragCancel**` | The monitor's `**onDragCancel**`. |
| Draggable `**onHover**`, `**onLeave**`, and its `**onDragStart**`… for drags over it | `**makeDroppable**` on the element: `**onDragEnter**`, `**onDragLeave**`. Rows of a list need nothing. |
| Droppable `**events.onEnter**`, `**onLeave**` | `**onDragEnter**`, `**onDragLeave**`. |
| Droppable `**events.onDrop**` | `**onBeforeDrop**` decides, then `**onDrop**` applies. `**onDrop**` is synchronous, and what it returns is ignored. |
| Droppable `**events.onValidate**` | `**onBeforeDrop**`, with `**acceptMode: 'some'**`. |
| — | New: the provider's `**@drag-start**` … `**@drag-settle**`, and the monitor's `**onDragOver**`, `**onBeforeDrop**` and `**onDragResume**`. |

A v2 `**onDrop**` could return a value, or a promise of one, to decide the drop. In v3 that is the job of `**onBeforeDrop**`, on lists, trees, drop targets and monitors:

| **v2 **`**onDrop**`** returns** | **v3 **`**onBeforeDrop**`** returns** |
| --- | --- |
| Nothing, or `**true**`: the drop goes through | `**'accept'**`, `**true**` or nothing. |
| `**false**`: this drop is declined, the drag stays active | `**'continue'**`. **`**false**`** now refuses the drop.**** |
| A rejected promise, or a throw: the drag is cancelled | `**'reject'**` or `**false**`. A throw rejects too. |
| A promise; meanwhile `**state**` is `**'pending'**` | A promise; meanwhile `**status**` is `**'dropping'**` and the overlay waits with `**data-dnd-overlay="dropping"**`. |
| `**onValidate**` returns `**IDragItem[]**` | An array of ids: only those drop, the others fly back. |

Monitors answer first, then the target. Then the target's `**onDrop**` runs, a list writes its new arrays, and `**onDragEnd**` follows. More in [**deciding a drop**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/drop-decisions) and the [**events API**](https://zizigy.github.io/vue-dnd-kit/es/docs/api/events).

### Types

| **v2** | **v3** |
| --- | --- |
| `**IDragEvent**` | `**DnDEvent**` (targets, monitors), `**SortableDropEvent**` (lists), `**DnDEndEvent**` (`**onDragEnd**`). |
| `**IDragItem**` | `**DragItem**`. |
| `**IDropZoneContext**` | `**Over**`. |
| `**IHoveredDraggableContext**` | ****No equivalent.**** |
| `**ISuggestSortResult**`, `**ISuggestSwapResult**`, `**ISuggestCopyResult**`, `**ISuggestRemoveResult**` | `**SortableDropEvent**`: `**result**`, `**to**`, `**mode**`, `**partner**`. |
| `**IDropValidateEvent**` | `**DnDEvent**`, in `**onBeforeDrop**`. |
| `**IPlacement**` | `**Placement**`, without `**center**`. |
| `**ICoordinates**` | `**Coordinates**`. |
| `**IDragActivationOptions**` | `**ActivationOptions**`. |
| `**IAutoScrollOptions**` | `**AutoScrollOptions**`. |
| `**TDnDState**` | `**DnDStatus**`. |
| `**IDnDProviderExternal**` | `**DnDState**`, what `**useDnD()**` returns. |
| `**IDraggableEvents**`, `**IDroppableEvents**` | Callbacks in `**DraggableOptions**`, `**DroppableOptions**`, and `**DnDMonitor**`. |

### Nuxt

```
npm i @vue-dnd-kit/nuxt@next @vue-dnd-kit/core@next
```

| **v2 (**`**@vue-dnd-kit/nuxt**`** 1.x)** | **v3 (**`**@vue-dnd-kit/nuxt**`** 3.0.0-beta)** |
| --- | --- |
| Auto-imports `**makeDraggable**`, `**makeDroppable**`, `**makeSelectionArea**`, `**makeConstraintArea**`, `**makeAutoScroll**`, `**useDnDProvider**` | Auto-imports `**makeDraggable**`, `**makeDroppable**`, `**makeSortableList**`, `**makeSortableItem**`, `**makeSortableTree**`, `**makeSelectionArea**`, `**makeDragArea**`, `**useDnD**`, `**useDnDMonitor**`. |
| No types auto-imported | The main types are (`**DnDEvent**`, `**SortableDropEvent**`, `**OverlayProps**`…). Generic ones (`**Key**`, `**Active**`, `**Over**`) are imported by hand. |
| — | Modifiers, collision functions and sensors on request: `**vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }**`. |
| `**DnDProvider**` and `**DragPreview**` global | The same, with a `**prefix**` option. |
| `**<DragPreview />**` in the layout, inside the provider | Remove it: the provider renders the overlay. `**DragPreview**` takes an `**id**` and belongs inside overlay components. |
| Peer `**@vue-dnd-kit/core**` 2 | Peer `**@vue-dnd-kit/core**` 3; Nuxt 4. |

`**modules: ['@vue-dnd-kit/nuxt']**` in `**nuxt.config.ts**` stays as it was. See [**installation**](https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/installation#nuxt).

## Before and after

### A draggable and a drop zone

****v2****

Card.vue

```
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

Zone.vue

```
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

****v3****

Card.vue

```
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

Zone.vue

```
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

- The card gets `**tabindex**`, `**role**` and the `**aria-***` attributes by itself. A `**<button>**` handle is focusable, and keyboard drags start from it.
- `**groups**` became `**type**` on the draggable and `**accept**` on the target. The callbacks left the `**events**` object.
- `**isOver**` without `**isAccepting**` is a target that refuses the drag: a drop there flies back.

### A sortable list

****v2****

TaskList.vue

```
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

TaskItem.vue

```
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

****v3****

TaskList.vue

```
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

TaskItem.vue

```
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

- Render `**items**`, the draft: it reorders while you drag. `**tasks**` gets the new order on drop, and `**defineModel**` emits `**update:modelValue**`.
- No index, no payload, no `**onDrop**`, no `**<TransitionGroup>**`: the rows slide by themselves.
- The dragged row stays in the list as the slot it will land in. Style it with `**isPlaceholder**` or `**[data-dnd-placeholder]**` instead of hiding it.

### Lists that share items

****v2****

Board.vue

```
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

****v3****

Column.vue

```
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

Board.vue

```
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

The drop writes both arrays, the one the task left and the one it entered. `**TaskItem.vue**` is the one from the sortable list above. A palette that hands out copies was `**suggestCopy()**` and a `**copyOnly**` flag; now it is a list:

Palette.vue

```
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

For a Pinia store or other state you don't write directly, pass `**items**` as a getter, call `**e.preventDefault()**` in `**onDrop**` and apply `**e.result**`: see [**controlled lists**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/shared-lists#controlled-lists).

### A custom overlay

****v2****

TaskItem.vue

```
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

TaskOverlay.vue

```
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

****v3****

TaskItem.vue

```
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

TaskOverlay.vue

```
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

- The component gets the drag as props: `**items**` (every dragged item, the grabbed one first), `**over**`, `**accepted**`, `**status**`, `**mode**` and `**to**`. Declare only the ones you read. For a list's rows, the list item is `**items[0].item**`.
- Pass it as it is. Switch it with a `**shallowRef**`, never a deep `**ref**`.

The provider's slot changes the same way, and your component no longer positions itself:

****v2****

App.vue

```
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

****v3****

App.vue

```
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

A pop-in that wrapped `**DragPreview**` in a `**<Transition>**` becomes `**overlay-class**` with `**@starting-style**`: see [**lift, tilt, settle**](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/animations#the-overlay-lift-tilt-settle).

### A drop you confirm

****v2****

Zone.vue

```
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

****v3****

Zone.vue

```
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

A list asks the same way, and a promise lets you open a dialog of your own. The overlay waits where it was let go until the promise settles:

Column.vue

```
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

A zone that took only the matching part of a mixed selection (`**groupMatch: 'some'**`):

****v2****

Zone.vue

```
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

****v3****

Zone.vue

```
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

Lists do this without code: with `**acceptMode: 'some'**`, the items their `**group.put**` takes land, and the others fly back.

## Pitfalls when upgrading

- ****Install with **`**@next**`**.**** Without the tag, npm installs v2.
- ****Render the draft.**** A list renders the `**items**` that `**makeSortableList**` returns, not your array. Rendering your array, nothing moves until the drop.
- ****Don't sort twice.**** Delete the `**suggestSort**` code from lists: a list writes each drop into a writable `**items**` ref after its `**onDrop**`. To apply it yourself, call `**e.preventDefault()**` and use `**e.result**`.
- **`**false**`** refuses the drop.**** In v2, an `**onDrop**` that resolved `**false**` kept the drag going. In v3, return `**'continue'**` from `**onBeforeDrop**`. A promise returned from `**onDrop**` is ignored.
- ****Lists share only within a **`**group**`**.**** A list without one trades with no other list.
- ****Key rows by id.**** `**:key="index"**` animates the wrong rows. Pass ids from your data too: a default id is new for every component instance.
- ****No **`**<TransitionGroup>**`**, no **`**transition**`** on **`**transform**`**.**** The library moves the rows itself, and moves would animate twice.
- ****Undo the touch workaround.**** `**touch-action: none**` on a whole item keeps the page from scrolling under a finger; v3 starts touch drags with a long press instead. Keep it on a handle that should drag at once, with `**activation: { touch: { distance: 4 } }**`.
- ****Remove stale attributes.**** The library sets `**tabindex**`, `**role**` and the `**aria-***` it needs and never overrides yours, so a leftover `**role**` or `**aria-grabbed**` stays as you left it.
- ****Restyle the overlay.**** `**.dnd-kit-preview**` is gone: style what is inside `**[data-dnd-overlay='dragging']**`, never the box's `**transform**`. Give the root of an overlay component `**width: 100%; height: 100%**`, and take `**<DragPreview />**` out of your layouts.
- ****Auto-scroll is on.**** Pass `**:auto-scroll="false"**` where v2 never scrolled.
- ****A band needs no key.**** `**makeSelectionArea**` draws from a plain press on its empty space. Add a `**modifier**` to keep v2's Ctrl.
- ****One provider, areas inside.**** Items can't cross providers. A page that used a provider per region to keep their rules apart needs one provider and a `**makeDragArea**` per region.
- ****Two arguments.**** `**makeDraggable**` and `**makeDroppable**` take a ref and an options object, no payload.

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/es#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"es-ES","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/es","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/migrating-from-v2#webpage","@type":"WebPage","description":"Move a v2 app to v3 — what changed and why, the upgrade, a map from every v2 API to its v3 replacement, before-and-after code for the common cases, and the pitfalls.","name":"Migrating from v2","url":"https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/migrating-from-v2","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/es#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/migrating-from-v2"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
