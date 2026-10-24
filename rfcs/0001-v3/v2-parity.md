# vue-dnd-kit v2 → v3 parity inventory

Read-only research on branch `v3` @ `2e4663f` (core 2.4.7, utilities 1.0.0, nuxt 1.0.2). Uncommitted edits to `.claude/settings.local.json` and `docs/v2/guide/changelog.md` were ignored. Uncommitted edits to `packages/core/package.json` (adds `@vueuse/core`) and `vite.config.ts` (externalises `@vueuse/*`) are noted where they matter.

**Path prefixes:**

| Prefix | Path |
|---|---|
| `C/` | `packages/core/src/` |
| `E/` | `docs/.vitepress/components/v2/Examples/` |
| `D/` | `docs/v2/` |
| `P/` | `playground/src/` |
| `N/` | `packages/nuxt/` |
| `U/` | `packages/utilities/` |

**Markers:**
- **(p)** marks my proposal, not an agreed v3 decision.
- **drop** means the item is removed in v3.

### v3 vocabulary used in the "v3 mapping" column

**Decided:**
- `DnDProvider` with an `#overlay` slot.
- Composables: `makeDraggable`, `makeDroppable`, `makeSortableList`, `makeSortableItem`, `makeSortableTree`, `makeSelectionArea`.
- Draft order and FLIP animation.
- `onBeforeDrop` and `onDrop`.
- `clone(item)` and `createItem`.
- Modes: move, copy, swap, remove.
- Multi-drag: stack or gaps.
- Placeholder: ghost or indicator.
- Modifiers: `snapToGrid`, `restrictToParent`, `restrictToWindow`, `restrictToScrollableAncestor`, `restrictToElement`, `lockAxis`, `snapCenterToCursor`.
- Activation defaults: mouse 4px, touch 200ms.
- Keyboard moves by items; announcements.

**Proposed (p):**

| Name | What it is |
|---|---|
| `useDnD()` | Read-only reactive state: `status`, `active`, `over`, `pointer`, `modifiers`. |
| `status` | `'idle' \| 'activating' \| 'dragging' \| 'dropping' \| 'animating' \| 'selecting'` |
| `type` / `accept` / `acceptMode` | Replaces groups (§2 G1). |
| `handle` | Drag handle option. |
| `autoScroll` | Auto-scroll config. |
| `keyboard` | Keyboard config. |
| `overlayTo` | Overlay teleport target. |
| `animation` | Animation config. |
| `selection` | `v-model` of ids. |
| `useDnDMonitor()` | Global event subscription. |
| `#overlay` slot props | `{ items, ids, active, over, accepted, status, mode }` |

---

## 0. Headline findings

1. **No auto-scroll in the v3 decision list.** v2 has a container composable (`makeAutoScroll`) and a viewport prop (`autoScrollViewport`). v3 needs it built in (§2 G2).
2. **Groups need a replacement.** v2 has draggable `groups`, droppable `groups`, `groupMatch`, `onValidate`, and selection-area `groups`. The proposal is `type`/`accept`/`acceptMode`, with `onBeforeDrop` absorbing `onValidate` (§2 G1).
3. **Several provider-level capabilities have no v3 home:**
   - Read-only provider state (games compute valid targets from `draggingMap`).
   - Per-zone overlay swapping (`preview.render`).
   - Shadow-DOM bridging (`injectionKey`).
   - A drag gated by a modifier key (`modifier`).
   - Activation progress UI (`delay.progress`, `distanceProgress`).
   - Free-form (non-list) keyboard drag.
4. **Semantic change: async decline.** In v2, `onDrop` resolving `false` keeps the drag **alive** after pointerup; the item keeps following the cursor until the next click. In v3, `false` means an animated return. The migration guide must call this out.
5. **The v2 drag pipeline has several state-machine holes.** No `pointercancel` handling, no button filtering, second-pointerup reset, sync-throw leaves the session stuck, keyboard `'decline'` handled as accept. A touch delay plus scroll can strand the session in `activating` or `dragging` (§5).
6. **The CJS build is broken.** The ES bundle has a top-level CSS-injection side effect and no `sideEffects` field, which works against v3's tree-shaking goal.
7. **Many docs disagree with the code.** About 30 items are listed in §5.3; the migration guide must describe what v2 *actually* did.

---

## 1. Inventory

### 1.1 Packages, build, distribution

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `@vue-dnd-kit/core` 2.4.7 | Composables + provider. ES + "CJS" bundles; CSS injected by JS | `packages/core/package.json`, `vite.config.ts` | Same name, major 3. Single tree-shakeable entry with `"sideEffects": false`. ESM only, or a real `.cjs` (p) | Bump major |
| `@vue-dnd-kit/utilities` 1.0.0 | Only `makeSnappedOverlayPosition` | `U/src/index.ts` | **drop**, replaced by the `snapToGrid` modifier | Uninstall; see §1.13 |
| `@vue-dnd-kit/nuxt` 1.0.2 | Auto-imports and global components | `N/src/module.ts` | Updated for v3 (§4) | Bump to the v3-compatible version |
| Peer `vue ^3.5.13` | — | `packages/core/package.json` | Keep `^3.5` | — |
| Zero dependencies | Docs advertise "Vue only" | `D/guide/installation.md:10`, `README.md:38` | `@vueuse/core` dependency (decided; already staged uncommitted) | Remove "zero deps" claims |
| CSS injected at import | Inserts `.dnd-kit-preview*` rules into `<head>` on module evaluation | `packages/core/vite.config.ts:13`; dist `*.es.js:1` | Inline styles on overlay nodes, or an opt-in CSS file (p). No import-time side effect (tree-shaking, CSP, SSR) | Users overriding `.dnd-kit-preview*` must move to the v3 class/attribute names |
| `injectionKey` = string `'VueDnDKitProvider'` | Provide/inject key; exported | `C/internal/utils/namespaces.ts:20`; `C/external/index.ts:15` | Private `Symbol` (p). Public bridge `provideDnDContext(app, ctx)` / `useDnDContext()` (p) for shadow roots and separate apps | Shadow-DOM bridges must switch API |
| `export type * from './types'` | Exposes internal entity and map types | `C/external/index.ts:21` | Export only public option/return/context types | Imports of internal types break |
| Option/return interfaces not exported | `IMakeDraggableOptions`, `IMakeDroppableOptions`, `ISelectionAreaOptions`, return types; `IMakeConstraintAreaOptions` not re-exported | `makeDraggable.ts:27,41`; `makeDroppable.ts:15,27`; `makeSelectionArea.ts:17`; `makeConstraintArea.ts:6` | Export every `*Options` / `*Return` type | — |

### 1.2 Public exports (`C/external/index.ts`)

| Export | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `DnDProvider` | Context root, overlay host, document listeners | `external/components/DnDProvider.vue` | `DnDProvider` (decided) | Props and slot renamed (§1.3) |
| `DragPreview` | Default overlay renderer (clone or `render`), `grid` prop | `external/components/DragPreview.vue` | **drop** as a public component. The default DOM-clone overlay is built in; customise with `#overlay` | Remove `<DragPreview>` from `#preview` slots |
| `makeDraggable` | Registers a draggable element | `external/composables/makeDraggable.ts` | `makeDraggable` for free drag; `makeSortableItem` for list items | Payload tuple removed |
| `makeDroppable` | Registers a drop zone | `external/composables/makeDroppable.ts` | `makeDroppable` for free zones and trash; `makeSortableList` for lists | `onDrop` + helpers → library-managed |
| `makeSelectionArea` | Rubber-band selection | `external/composables/makeSelectionArea.ts` | `makeSelectionArea`, bound to ids (decided) | `onSelected(HTMLElement[])` → ids |
| `makeConstraintArea` | Axis lock and bounds for descendants' overlay | `external/composables/makeConstraintArea.ts` | **drop**, replaced by modifiers `restrictToElement` / `restrictToParent` / `lockAxis` | Move config from the container to the draggable/list/provider `modifiers` |
| `makeAutoScroll` | Auto-scroll for one container | `external/composables/makeAutoScroll.ts` | **Gap G2**: built-in `autoScroll` (p) | — |
| `useDnDProvider` | Returns `IDnDProviderExternal` | `external/composables/useDnDProvider.ts` | **Gap G5**: `useDnD()` read-only (p) | — |
| `injectionKey` | Raw internal provider access | `internal/utils/namespaces.ts:20` | **Gap G9**: bridge API (p) | — |
| `IAutoScrollOptions` (+ all types) | — | `external/types/placement.d.ts:30` | See §1.14 | — |
| *(not exported)* `DefaultOverlay.vue` | Back-compat wrapper of DragPreview | `external/components/DefaultOverlay.vue` | **drop** | Dead code |
| *(not exported)* `createSensor` builder | Chainable collision builder; unused at runtime | `internal/sensors/sensor.ts:102-330` | **drop**, or a public `collisionDetection` option (p) | Never public |

### 1.3 DnDProvider

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| Prop `autoScrollViewport?: IAutoScrollOptions \| true \| false \| null` | Window auto-scroll near viewport edges | `types/provider.d.ts:102`; `internal/composables/useDnDProviderEvents.ts:18-35`; `useViewportAutoScroll.ts` | `autoScroll` prop (p), **on by default**, covers the viewport and scrollable ancestors | `true` → default; options object → `autoScroll` options; `false` → `autoScroll: false` |
| Prop `previewTo?: string \| false \| null` | Teleport target for the overlay | `DnDProvider.vue:27`; `useDnDProviderState.ts:191-194` | `overlayTo` (p) | In v2, falsy still teleports to `body` (docs claim "in-place") |
| Props `style` / `class` (`any`) | `v-bind="props"` onto `.dnd-kit-preview-container`. Used to make the overlay 50% opaque | `DnDProvider.vue:28`; `E/Copy/Example.vue`, `E/SortingLists/Example.vue`, `E/Swap/Example.vue` | Style inside `#overlay`, or `overlayClass` (p) | v2 also leaks `previewTo` / `autoScrollViewport` as DOM attributes |
| Default slot | App content | `DnDProvider.vue:25` | Same | — |
| Slot `#preview="{ preview }"` | Replace the overlay. `preview` = `provider.preview.render ?? DragPreview` | `DnDProvider.vue:29-31` | `#overlay` slot (decided); props `{ items, … }` (p) | Rename; there is no `preview` component prop |
| Overlay container | `.dnd-kit-preview-container`: fixed, top-left 0, `pointer-events:none`, `z-index:9999`, `cursor:grabbing` (no effect while `pointer-events:none`) | `DnDProvider.vue:36-44` | Same shape; set the cursor on `<html>` during drag (p) | — |
| SSR guard | Teleport disabled until `onMounted` | `DnDProvider.vue:16-17,27` | Keep | — |
| `provide(injectionKey, provider)` | Shares context | `DnDProvider.vue:21` | Symbol key + bridge API (p) | — |
| Document listeners | `pointerdown`; `pointerup`/`pointermove` added on every pointerdown; `keydown`, `keyup`, `blur` (never fires), `scroll` (capture) | `useDnDProviderEvents.ts:37-52`; `logic/pointer.ts:249-250` | Pointer listeners only after a valid press on a draggable; add `pointercancel`, `window` blur, `visibilitychange` | See §5 |
| Single provider per context ("do not nest") | — | `D/guide/core/dnd-provider.md:5-22` vs `D/guide/changelog.md:231` ("multiple independent providers") | Decide (p): multiple sibling providers allowed; a nested provider is an isolated scope; no shared module state (v2 shares `dom.ts:4-6`) | Clarify |
| `useDnDProviderEvents` viewport-scroll watcher | Recreates `useViewportAutoScroll` when the prop changes | `useDnDProviderEvents.ts:18-35` | Internal | — |

### 1.4 Provider state (`useDnDProvider()` → `IDnDProviderExternal`, `C/external/types/provider.d.ts:51-82`)

| Field | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `state: Ref<TDnDState>` | `'dragging'\|'selecting'\|'activating'\|'pending'\|null\|undefined`; idle = `undefined` | `provider.d.ts:89-95`; `utils/session.ts:21` | `useDnD().status` (p) with explicit `'idle'`; `'pending'` → `'dropping'` | `state === undefined` → `status === 'idle'`. Docs used a non-existent `'idle'` (§5.3) |
| `pointer: Ref<{start,current,offset}>` | Viewport coordinates; `offset` is the grab ratio 0–1 | `types/pointer.d.ts`; `utils/pointer.ts:12-36` | `useDnD().pointer` (p), read-only | Writes are no longer allowed |
| `entities.draggableMap` | `Map<El, IDraggableEntity>` | `useDnDProviderState.ts:70-72` | **drop** (internal id registry) | Use `useDnD()` / overlay slot |
| `entities.droppableMap` | `Map<El, IDroppableEntity>` | same | **drop** | — |
| `entities.selectableAreaMap` / `constraintsAreaMap` | Registries | same | **drop** | — |
| `entities.draggingMap` | Dragged elements → entity snapshot (`initialRect`, `initialOuterHTML`, `payload`, `data`, `render`) | `utils/pointer.ts:41-79` | `useDnD().active.items` / `ids` (p); `#overlay` slot `items` | Checkers/Chess/CustomOverlay read `draggingMap.keys()` + `draggableMap.get(el).data()` |
| `entities.selectedSet: Set<El>` | Global selection across lists | `makeDraggable.ts:79-90` | Selection `v-model` of ids (p) | DOM nodes → ids |
| `entities.selectionBase` | Snapshot for toggle strategy | `logic/pointer.ts:271` | Internal | — |
| `entities.initiatingDraggable` | Element that started the drag (activation UI) | `logic/pointer.ts:284` | `useDnD().active.primaryId` (p) | Activation example |
| `entities.selectingArea` | Active selection area element | `logic/pointer.ts:269` | `isSelecting` from `makeSelectionArea` | — |
| `entities.modifiersDraggableSet` / `modifiersSelectableAreaSet` | Visible, enabled, modifier-satisfied items | `useDnDProviderState.ts:107-123` | Internal | — |
| `entities.allowedDroppableSet` / `allowedDraggableSet` | Group-compatible visible targets during drag | `useDnDProviderState.ts:83-106`; `utils/groups.ts` | Internal; exposed per target as `isAccepting` (p) | — |
| `entities.visibleDraggableSet` / `visibleDroppableSet` / `visibleSelectableAreaSet` | IntersectionObserver visibility | `utils/observer.ts` | Internal | — |
| `keyboard.keys.pressedKeys: Ref<Set<string>>` | Currently held `KeyboardEvent.code`s | `useDnDProviderState.ts:55`; `logic/keyboard.ts:36,142` | `useDnD().modifiers { alt, shift, ctrl, meta }` (p) | Playground Alt-copy reads it (`P/sections/CopySection.vue:30`). v3 copy-on-Alt is built in |
| `keyboard.keys.forDrag/forDrop/forCancel/forMove/forMoveFaster` | Mutable key bindings (defaults Enter/Space, Escape, arrows+WASD, Shift) | `useDnDProviderState.ts:32-47` | `DnDProvider :keyboard="{ keys: {...} }"` (p) | Mutating the provider object → prop |
| `keyboard.step` (8) / `moveFaster` (×4) | Pixel step per key press | `useDnDProviderState.ts:66-67` | Sortables move by items (decided). Free drag: `keyboard.step` (p) | — |
| `scrollPosition` | Window scroll mirror | `logic/scroll.ts:11-12` | **drop** | — |
| `delay { progress, startTime }` | Delay-activation progress 0–1 | `utils/drag-activation.ts:120-167` | `useDnD().activation.progress` (p) — **Gap G7** | — |
| `distanceProgress` | Distance-activation progress 0–1 | `useDnDProviderState.ts:149-158` | Same as `delay` (merged progress) | — |
| `preview.ref` | Overlay container element | `DnDProvider.vue:12` | Internal | — |
| `preview.position` | Overlay x/y after constraints | `useDnDProviderState.ts:174-189` | `#overlay` slot `x,y` / `style` (p) | Custom overlays positioned themselves |
| `preview.size: ShallowRef<DOMRect>` | Measured overlay size (written by DragPreview or the user) | `DragPreview.vue:14-20` | Internal (ResizeObserver) | Users no longer write it |
| `preview.render: Ref<Component>` | **Global** overlay override used by the default slot. Never filled from `makeDraggable.render` | `useDnDProviderState.ts:170`; `DnDProvider.vue:19` | `#overlay` slot reading `over` (p) — **Gap G4** | ChangingOverlay / playground Overlay swapped it from `onEnter`/`onLeave` |
| `preview.to` | Teleport target (setter recurses) | `useDnDProviderState.ts:191-194` | `overlayTo` prop | — |
| `hovered.draggable/droppable: Map<El, IPlacement>` | Current hover targets + placement | `logic/hover.ts:47-177` | `useDnD().over` (p) | — |
| `collision.throttle: Ref<number>` | Collision throttle ms (default 0); undocumented except in useDnDProvider | `logic/pointer.ts:37-51` | **drop** (rAF-batched by default), or a `collisionThrottle` prop (p) | — |
| `autoScrollViewport` (computed prop mirror) | — | `useDnDProviderState.ts:196` | **drop** | — |
| *(internal)* `lib.*` observers, `rectCache` | — | `internal/types/provider.d.ts:21-30` | Internal | Only reachable via `injectionKey` |

### 1.5 makeDraggable

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| Overloads `(ref)`, `(ref, payload)`, `(ref, options, payload?)` | Function-or-options second argument | `makeDraggable.ts:48-74` | `makeDraggable(ref, options)` / `makeSortableItem(ref, options)` | Payload argument removed |
| `ref: TDnDNodeRef` (element or component instance) | Resolved **once** in `onMounted` | `utils/dom.ts:11-19`; `makeDraggable.ts:110-112` | `MaybeRefOrGetter<El \| Component \| null>`, watched (`unrefElement`). Fixes `v-if` / ref swaps | — |
| `id?: string` | Stable id for virtual lists; random if omitted | `makeDraggable.ts:31,77,137-148` | **Required** on `makeSortableItem` (ids drive draft, selection, virtualization); optional on free `makeDraggable` | Pass the item key |
| `disabled?: boolean \| Ref<boolean>` | Not draggable; **descendants inherit it** (ancestor disabled ⇒ disabled) | `makeDraggable.ts:125`; `utils/disabled.ts:21-33` | `disabled: MaybeRefOrGetter<boolean>` on items and lists. Inheritance: keep for nested sortables (p) | A getter is now valid (v2 treated a function as truthy) |
| `groups?: string[] \| Ref` | Draggable's groups; `[]` = wildcard | `makeDraggable.ts:126`; `utils/groups.ts:14-21` | `type` (p, §2 G1) | `groups:['a']` → `type:'a'` |
| `dragHandle?: string \| Ref<string>` | Selector; pointer must start inside the handle. Keyboard ignores it | `utils/drag-activation.ts:9-22`; `logic/keyboard.ts:106` | `handle: string \| Ref<El>` (p). Auto-apply `touch-action:none` to the handle (p) | Rename |
| `modifier?: {keys, method:'every'\|'some'}` | Drag only while the keys are held | `utils/provider.ts:17-47` | **Gap G6** | — |
| `activation.distance: number \| Ref` | Euclidean radius in px | `utils/drag-activation.ts:36-39` | `activation` per pointer type; defaults mouse 4px (decided) | — |
| `activation.distance: {x?, y?, condition?:'any'\|'both'}` | Per-axis threshold | `drag-activation.ts:41-54` | `activation.mouse.distance: number \| {x,y}` (p) | Keep or drop per-axis — decide |
| `activation.delay: number \| Ref` | **Seconds** (docs say ms) | `drag-activation.ts:142` | `activation.touch.delay` in **ms**, default 200 (decided) + `tolerance` (p) | Multiply v2 values by 1000 |
| `activation.condition` (internal, default `'both'` with delay+distance) | Combine rule; not in the public options type | `types/entities.d.ts:170-180`; `drag-activation.ts:84` | **drop** (per-pointer-type config replaces it) | — |
| `events` | See §1.7 | `types/entities.d.ts:111-128` | — | — |
| `render?: Component` | Per-item overlay component (no props; reads `useDnDProvider`). Docs require `markRaw` | `DragPreview.vue:49-52`; `D/guide/pitfalls.md:56-67` | `#overlay` slot iterating `items` (decided slot), or a per-item `overlay` component option (p) — **Gap G3** | `markRaw` no longer needed |
| `placementMargins?: {top,right,bottom,left}` | Centre zone for dual-role draggable+droppable | `logic/hover.ts:62-98`; `utils/placement.ts:53-99` | Tree hover-to-nest (decided); generic dual-role → **Gap G11** | — |
| `data?: () => unknown` | Custom payload → `draggedItems[i].data`, `hoveredDraggable.data` | `utils/events.ts:62-66,80,150` | `data: MaybeRefOrGetter<unknown>` on `makeDraggable` (p). Sortable items carry the item itself | — |
| Payload `() => [index, items]` | List position for helpers / `draggedItems` | `utils/events.ts:68-104` | **drop**; membership = `makeSortableList({ items })` + item `id` | Delete index/items props plumbing |
| Return `selected: WritableComputedRef<boolean>` | Read/write selection (checkboxes) | `makeDraggable.ts:79-90` | `isSelected` (writable?) + selection `v-model` (p) | — |
| Return `isDragging` | Element is in `draggingMap` | `makeDraggable.ts:92-96` | `isDragging` (+ `isPlaceholder` / `isActive`, p) | — |
| Return `isAllowed` | Element is a group-compatible hover target | `makeDraggable.ts:98-102` | **drop** (internal) | Unused in all examples |
| Return `isDragOver: IPlacement \| undefined` | Placement flags when hovered (sort indicators) | `makeDraggable.ts:104-108` | Sortables: library moves items / indicator mode. Free: `isOver` + `placement` (p) | Hand-made top/bottom indicators become obsolete |
| Side effect: `data-dnd-kit-draggable="<id>"` | Hit-testing and virtual remap | `makeDraggable.ts:118` | `data-dnd-id` (p) | — |
| Side effect: prevent native `dragstart/drag/dragend` | Blocks HTML5 DnD on the element | `makeDraggable.ts:114-116` | Keep; also `draggable="false"` on images/links (p) | — |
| Side effect: IntersectionObserver registration | Only visible elements participate | `makeDraggable.ts:120`; `utils/observer.ts` | Keep or replace (see §1.16) | — |

### 1.6 makeDroppable

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| Overloads `(ref)`, `(ref, payload)`, `(ref, options, payload?)` | — | `makeDroppable.ts:32-59` | `makeDroppable(ref, options)`; lists → `makeSortableList(ref, { items })` | — |
| `disabled` | Zone ignores drops; descendants inherit | `makeDroppable.ts:81`; `utils/disabled.ts:36-48` | `disabled: MaybeRefOrGetter<boolean>` | — |
| `groups` | Zone groups; `[]` = accepts anything | `makeDroppable.ts:82` | `accept` (p, §2 G1) | — |
| `groupMatch?: 'every' \| 'some'` | All vs some of the dragged items must match. `'some'` filters invalid items at drop | `makeDroppable.ts:22,83`; `logic/pointer.ts:66-140`; `utils/groups.ts:31-56` | `acceptMode: 'all' \| 'some'` (p) | — |
| `events` (`onEnter`, `onLeave`, `onDrop`, `onValidate`) | See §1.7 | `types/entities.d.ts:139-156` | — | — |
| `data?: () => unknown` | → `dropZone.data` | `utils/events.ts:124` | `data` (p) | Never used in docs examples |
| Payload `() => T[]` | Zone's array for helpers | `utils/events.ts:120-123` | **drop** (`makeSortableList.items`) | Docs show a wrong tuple payload (§5.3) |
| Return `isAllowed` | Zone accepts the current drag (groups, visible) | `makeDroppable.ts:61-65` | `isAccepting` / `canDrop` (p) | — |
| Return `isDragOver: IPlacement \| undefined` | Hovered + placement | `makeDroppable.ts:67-71` | `isOver` (+ `placement`, p) | — |
| Side effect: `data-dnd-kit-droppable=""` | Hit-testing | `makeDroppable.ts:77` | `data-dnd-droppable` (p) | — |

### 1.7 Events, event object, drop protocol

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `onSelfDragStart` | On the initiating element when the drag starts (pointer: `event.target.closest`) | `utils/events.ts:245-256`; `logic/pointer.ts:231,297,303` | `onDragStart` on `makeDraggable` / `makeSortableItem` / `makeSortableList` (p) | Never fires for shadow-DOM draggables in v2 (§5) |
| `onSelfDragMove` | Every move / key step | `logic/pointer.ts:239`; `logic/keyboard.ts:79` | `onDragMove` (p), rAF-throttled | — |
| `onSelfDragEnd` | Accepted drop, **including drop outside any zone or on a disabled zone** | `logic/pointer.ts:173-178,56-59` | `onDragEnd({ dropped:boolean, cancelled })` (p) | v2 gave no "dropped nowhere" signal |
| `onSelfDragCancel` | Escape, or async reject | `logic/keyboard.ts:44-48`; `logic/pointer.ts:114-118,153-158` | `onDragCancel` (p) | — |
| `onDragStart/Move/End/Cancel` | Fires on **all dragged** entities (docs: "element under cursor") | `utils/events.ts:193-202` vs `types/entities.d.ts:118-122` | **drop** (redundant with self events); global `useDnDMonitor` (p) | Behaviour never matched the docs |
| `onHover` / `onLeave` (draggable) | Cursor entered/left this draggable | `utils/events.ts:225-243` | Free drag: `isOver`; sortables: internal | — |
| `onEnter` / `onLeave` (droppable) | Zone enter/leave. `onLeave` also fires **after `onDrop`** and on cancel | `utils/events.ts:205-222,259-282`; `logic/pointer.ts:177` | `onDragEnter` / `onDragLeave` (p) + `isOver` | Highlight logic → `isOver` |
| `onDrop(e)` sync | Drop on the hovered zone. `false` = decline | `logic/pointer.ts:143,168-170` | `onDrop(ctx)` for side effects only; the library writes `Ref<T[]>` (decided) | Delete `suggest*` + assignment code |
| `onDrop` → `Promise<void\|boolean>` | `'pending'` state; resolve `false` = **decline, drag stays alive after pointerup**; reject = cancel | `logic/pointer.ts:145-166` | `onBeforeDrop` async: `false` → animated return (decided); reject → same + `onDragCancel` (p) | **Semantic change**: no "sticky" drag |
| `onValidate(e)` | Only when `groupMatch:'some'` and some items are invalid. Returns `void` (valid only), `false` (decline), `IDragItem[]`, or a Promise | `logic/pointer.ts:94-133`; `types/entities.d.ts:141-153` | `onBeforeDrop({ accepted, rejected })` returning `true \| false \| ids[]` (p) | Merge into `onBeforeDrop` |
| `onSelected(selected: HTMLElement[])` | Selection pointerup | `logic/pointer.ts:180-187` | `v-model:selection` / `onSelectionChange(ids)` (p) | Elements → ids |
| `IDragEvent.draggedItems: IDragItem[]` | `{index, item, items, data}`, sorted by index, **same source list only** | `utils/events.ts:53-104` | ctx `items: T[]`, `ids`, `from` (list), `fromIndexes` (p) | — |
| `IDragEvent.dropZone` | `{items, placement, data}` of the hovered zone (parent fallback on dual-role edge) | `utils/events.ts:116-126`; `logic/hover.ts:86-97` | ctx `to` (list), `toIndex` (p) | — |
| `IDragEvent.hoveredDraggable` | `{element, placement, index, item, items, data}` | `utils/events.ts:129-164` | ctx `over` (p) | — |
| `IDragEvent.provider` | Public provider | `utils/events.ts:171` | `useDnD()` (p) | — |
| `IDragEvent.helpers` | §1.8 | `logic/operations.ts:337-359` | **drop** | — |
| `IDropValidateEvent` | `{validItems, invalidItems, dropZone, hoveredDraggable}` | `types/entities.d.ts:130-137` | `onBeforeDrop` ctx `accepted` / `rejected` (p) | — |
| `TDropResult` | `'accept'\|'cancel'\|'decline'` (exported, internal) | `types/provider.d.ts:97` | **drop** | — |

### 1.8 Helpers (`event.helpers`, `C/internal/logic/operations.ts`)

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `insertAt(items, i, toInsert)` | Pure insert | `operations.ts:46-49` | **drop**, or export as a util (p) | Never used in examples |
| `removeAt(items, i, count)` | Pure remove | `:51-55` | **drop** | — |
| `removeIndexes(items, idx[])` | Pure multi-remove | `:58-65` | **drop** | Playground KanbanSection / ZoneDropSection workaround |
| `swapAt(items, i, j)` | Pure swap | `:67-73` | **drop** | — |
| `getInsertSide(placement, orientation)` | `'before'\|'after'\|null` | `:78-93` | **drop** (internal) | — |
| `isAtZoneStart` / `isAtZoneEnd` | Placement at a zone edge | `:95-113` | **drop** | — |
| `suggestSort(orientation='vertical')` | Sort/transfer; target = `hoveredDraggable.items ?? dropZone.items`; centre placement → nested zone; multi-drag batch | `:125-221` | `mode:'move'` (default) + live draft (decided); `layout` replaces `orientation` | `onDrop` body deleted |
| `suggestSwap()` | Single swap; **multi-drag group exchange** (docs say it returns null) | `:223-302` | `mode:'swap'` with live preview (decided). Multi-drag swap semantics → decide (§2 G16) | — |
| `suggestCopy(orientation)` | Inserts the **same references** (type says shallow copies) | `:304-319` | `mode:'copy'` / palette list + `clone(item)` (decided) | `clone` is mandatory for distinct objects |
| `suggestRemove()` | Removes from the source | `:321-333` | Trash `makeDroppable` with remove semantics (decided) | Checkers misused it to read the dragged item |
| Result fields `sourceItems`, `targetItems`, `sameList`, `targetIndex`, `sourceIndexes`, `draggedItems`, `mode:'insert'\|'append'\|'prepend'`, `copiedItems`, `removedItems` | Apply-yourself results | `types/operations.d.ts:14-65` | `onDrop` ctx `{ from, to, fromIndexes, toIndex, items, mode }` (p) | Identity-routing code (`srcItems === listA.value`) disappears |

### 1.9 makeSelectionArea

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `modifier` (default `{keys:['ControlLeft'], method:'every'}`) | Keys required to start the rubber band | `makeSelectionArea.ts:45-48` | `modifierKey` (p), default Ctrl **or Meta on macOS** | v2 ignored ControlRight and Meta |
| `strategy: 'toggle' \| 'select'` (default toggle) | XOR vs selectionBase, or replace | `utils/selection.ts:156-171` | Keep `strategy` (p) | — |
| `events.onSelected` | Fires on pointerup | `logic/pointer.ts:180-187` | `v-model:selection` (p) | — |
| `disabled` | — | `makeSelectionArea.ts:50` | `disabled` | — |
| `groups` | Only group-compatible draggables are selectable | `utils/selection.ts:120-147` | `filter: (id) => boolean` or `accept` (p) | — |
| Return `isSelecting` | `nodeRef.value === selectingArea` (broken with component refs) | `makeSelectionArea.ts:32-34` | `isSelecting` | — |
| Return `style` | Inline absolute rect (hard-coded blue border/background), clamped to the container | `utils/selection.ts:55-88` | `rect` (`{x,y,w,h}`) + `style` (p); no hard-coded colours | — |
| Ctrl+press + tiny move toggles the item under the cursor | Near-zero box intersects it. A perfectly still click does nothing (`updateSelectionByBox` runs only on pointermove) | `utils/selection.ts:113-173`; `logic/pointer.ts:243-245` | Explicit Ctrl/Meta-click toggle + Shift-range (p) | Undocumented, accidental |
| Ctrl+press on an item inside an area starts selection, not drag | Selection wins precedence | `logic/pointer.ts:262-273` | Keep (document) | — |
| Nested selection areas | Items belong to their nearest area | `utils/selection.ts:13-19,130-136` | Keep | — |
| Disabled / invisible items skipped | — | `utils/selection.ts:124,138` | Keep; virtual lists need id-based selection (decided) | — |
| Selection anchor follows **window** scroll | — | `logic/scroll.ts:20-31` | Also scroll containers (p) | — |
| Selection **cleared at drag start**; dragging an unselected item clears selection | — | `utils/pointer.ts:61-65,104-109` | Keep selection after drop/cancel (p, configurable) | — |
| Selection spans lists (global set) | Drag then only takes same-list items (`events.ts:91`) | — | Multi-source multi-drag (p, §2 G13) | — |

### 1.10 makeConstraintArea

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `axis: 'x'\|'y'\|'both'` | Locks the overlay to the source element's current top/left | `utils/constraints.ts:31-46,111-119` | `lockAxis('x'\|'y')` modifier | — |
| `restrictToArea: boolean` | Clamps the overlay inside the area rect | `utils/constraints.ts:51-78,122-130` | `restrictToElement(ref)` / `restrictToParent()` | — |
| Declarative scope | Applies to any draggable whose **closest ancestor** is the area | `utils/constraints.ts:10-26` | Modifiers per draggable/list/provider (p) | Move config from the container to the consumer |
| Overlay-only | The collision pointer stays unconstrained (`updatePointerWithConstraints` unused) | `utils/constraints.ts:139-167` | Decide: modifiers move the collision point too (p, recommended) | — |
| Return `{}` | — | `makeConstraintArea.ts:36` | — | — |
| Attribute `data-dnd-kit-constraint-area` | — | `makeConstraintArea.ts:23` | **drop** | — |

### 1.11 Auto-scroll

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `makeAutoScroll(container, opts)` | Scrolls the container while the overlay centre is within the threshold | `makeAutoScroll.ts:17-63` | Built-in auto-scroll of scrollable ancestors (p, §2 G2) | — |
| Requires `container` to be **the hovered droppable** | Since 2.4.6. Nested zones inside the container block it | `makeAutoScroll.ts:46-58` | Ancestor scroll containers of the hovered target (p) | Hidden requirement removed |
| `threshold: number \| {top,right,bottom,left}` (default 50) | Per-side band | `utils/auto-scroll.ts:11-36` | `autoScroll.threshold` (p); ratio or px | — |
| `speed` (default **10 px/frame @144fps**; docs: multiplier 1) | Constant speed, no proximity ramp | `utils/auto-scroll.ts:61,90` | `autoScroll.speed` + acceleration by proximity (p) | Re-tune values |
| `disabled` (read once) | — | `utils/auto-scroll.ts:61` | Reactive `autoScroll: false` | — |
| Return `isScrolling` | — | `makeAutoScroll.ts:22` | `useDnD().isAutoScrolling` (p) | — |
| Viewport mode (`autoScrollViewport`) | Window scroll | `useViewportAutoScroll.ts` | Same system | — |
| Re-collision on any scroll (capture) | Keeps hover correct while scrolling | `logic/scroll.ts:5-18` | Keep | — |

### 1.12 DragPreview / overlay rendering

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| Renders only when `state==='dragging'` | Hidden during `'pending'` (README says it stays visible) | `DragPreview.vue:37` | Overlay visible through `'dropping'`, then animates (decided) | — |
| Default clone | `<component :is="node.tagName" v-html="initialOuterHTML">` with `initialRect` size. Nested same-tag wrapper; duplicate ids and `data-dnd-kit-draggable` | `DragPreview.vue:53-61`; `utils/pointer.ts:41-51` | DOM clone (decided). Use `cloneNode(true)`, strip ids/attributes, copy canvas/input state, handle `<tr>`/`<li>` (p, §2 G17) | — |
| Per-item `render` component | — | `DragPreview.vue:49-52` | `#overlay` slot per item (p) | — |
| Default slot `{ draggingMap }` | Custom per-item rendering inside the positioned wrapper | `DragPreview.vue:44` | `#overlay="{ items }"` (p) | Animation example copied DragPreview just to wrap items |
| Prop `grid: number \| {x,y}` | Visual-only snap of **viewport** coordinates | `DragPreview.vue:5-32` | `snapToGrid(size, { origin })` modifier (decided + p) | Snap was viewport-relative; GridCanvas workaround |
| `.dnd-kit-preview` (transform-origin, will-change) | Styling hook | `DragPreview.vue:67-71` | `[data-dnd-overlay]` (p) | — |
| Measures `preview.size` once per mount; never reset | — | `DragPreview.vue:14-20` | ResizeObserver, internal | — |
| Transition-friendly root `v-if` | `<Transition><DragPreview/></Transition>` pattern | `D/guide/core/drag-preview.md:69-110` | Built-in pickup/drop animations + hook (decided) | — |
| Multi-drag rendering | Stacked clones of every dragged element | `DragPreview.vue:45-62` | `multiDrag:'stack'` (default) / `'gaps'` (decided); count badge (p) | — |

### 1.13 Utilities package

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `makeSnappedOverlayPosition(position, {grid} \| {gridX, gridY})` | Computed snapped coordinates for custom overlays | `U/src/makeSnappedOverlayPosition.ts` | `snapToGrid(n)` / `snapToGrid({x,y})` modifier | Docs import it from **core** (wrong); never used by any example |
| `TSnapOverlayOptions` | Discriminated union | same | Modifier options type | — |

### 1.14 Exported types (`C/external/types/*.d.ts`)

| Group | Types | v3 mapping |
|---|---|---|
| Coordinates / pointer | `ICoordinates`, `TPointerState` | Keep `ICoordinates`; pointer read-only type |
| Provider | `IDnDProviderExternal`, `IDnDProviderProps`, `TDnDState`, `TDropResult`, `IDelay`, `ICollision`, `IHovered`, `THoveredMap` | `UseDnDReturn`, `DnDProviderProps`, `DnDStatus` (p); the rest drop |
| Event | `IDragEvent<DragT,ZoneT>`, `IDragItem`, `IDropZoneContext`, `IHoveredDraggableContext`, `IDropValidateEvent` | `SortableDropContext<T>`, `BeforeDropContext<T>`, `DragContext<T>` (p) |
| Entities (internal leak) | `IEntities`, `IDraggableEntity`, `IDraggingEntity`, `IDroppableEntity`, `ISelectableAreaEntity`, `IConstraintsAreaEntity`, `IBaseEntity` | **drop** |
| Options pieces | `IBaseOptions`, `IModifier`, `IModifierOptions`, `TModifierKeys`, `TModifierMethod`, `IDragActivationOptions`, `IDragActivation`, `TCondition`, `IDraggableEvents`, `IDroppableEvents`, `ISelectableAreaEvents`, `TSelectableAreaStrategy`, `TDragAxis`, `IPlacementMargins`, `IAutoScrollOptions` | Replace with full `Make*Options` per composable |
| Placement | `IPlacement`, `TPlacementOrientation`, `TInsertSide`, `IPlacementHelpers` | `placement` on `isOver` (p); orientation → `layout` |
| Payload / refs | `TDraggablePayload`, `TDroppablePayload`, `TDnDNode`, `TDnDNodeRef` | **drop** payloads; `MaybeElementRef` from VueUse |
| Helper results | `IHelpers`, `ISuggestSortResult`, `ISuggestSwapResult`, `ISuggestCopyResult`, `ISuggestRemoveResult` | **drop** |
| Broken in `.d.ts` | `Component` is used but not imported (`entities.d.ts:186`); `IPlacement` is used but not imported (`provider.d.ts:40`) | Type-test the published `.d.ts` |

### 1.15 DOM contract and global side effects

| Item | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| `data-dnd-kit-draggable="<id>"` | Draggable marker + id (virtual remap) | `makeDraggable.ts:118`; `utils/events.ts:43` | `data-dnd-id` (p) | User CSS/selectors must be renamed |
| `data-dnd-kit-droppable=""` | Zone marker | `makeDroppable.ts:77` | `data-dnd-droppable` (p) | — |
| `data-dnd-kit-select-area=""` | Selection-area marker | `makeSelectionArea.ts:41` | `data-dnd-selection-area` (p) | — |
| `data-dnd-kit-constraint-area=""` | Constraint marker | `makeConstraintArea.ts:23` | **drop** | — |
| `data-dnd-kit-container` | Defined, never used | `namespaces.ts:9,17` | **drop** | — |
| *(none)* state attributes | v2 sets no `data-dragging` / `data-over` / … (users toggle classes from refs) | — | `data-dnd-dragging`, `data-dnd-placeholder`, `data-dnd-over`, `data-dnd-selected`, `data-dnd-dropping` (p) | Enables pure-CSS styling |
| `.dnd-kit-preview-container`, `.dnd-kit-preview` | Overlay classes | `DnDProvider.vue:28,37`; `DragPreview.vue:38,68` | `[data-dnd-overlay]` (p) | — |
| `body.style.userSelect='none'` during drag/selection | Prevents text selection | `utils/dom.ts:101-112` | Keep; restore exactly | — |
| Window `contextmenu` / `selectstart` / `touchstart` / `touchmove` `preventDefault` | Suppress long-press menu and scroll (touch listeners are passive → ineffective) | `utils/dom.ts:108-111` | `touch-action` on handles + non-passive listener on the source (p) | — |
| Resets `body.style.touchAction` / `overscrollBehavior` to `''` | Clobbers user styles on every pointerup | `utils/dom.ts:121-122`; `logic/pointer.ts:196` | Never touch styles you didn't set | — |
| Native HTML5 DnD prevented on draggables | — | `makeDraggable.ts:114-116` | Keep | — |

### 1.16 Implicit behaviours users rely on (not in the API surface)

| Behaviour | What it does | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| Collision phase 1: `elementFromPoint` + ancestor walk | Topmost hit; respects z-index/modals; deepest zone first | `sensors/default-collision.ts:76-102` | Keep "topmost hit" for free droppables; sortable uses its own strategy (p) | — |
| Phase 1b: nearest item inside the hovered zone | AABB overlap ≥10%, then distance-to-box (fixes lateral drift, 2.4.5) | `default-collision.ts:118-155` | Sortable collision must keep "no teleport to list start/end on lateral drift" — regression test | — |
| Phase 2: overlay-AABB fallback | When nothing is under the cursor | `default-collision.ts:157-187` | Decide (p: keep for "drop near the zone") | — |
| Nested zones: deepest wins | Ancestor-walk order | `default-collision.ts:89-98` | Nested sortables/kanban need the same | — |
| Dual-role edge/centre split + parent fallback zone | Edge = sort among siblings; centre = nest | `logic/hover.ts:62-98` | Tree hover-to-nest; offset depth (decided) | — |
| Exclude dragged items and their descendants from targets | Cannot drop into self | `sensors/steps.ts:78-109` | By ids/subtree in the tree model (p); no DOM heuristic | — |
| "Sibling-subtree exclusion" heuristic | Stops dropping into own children when the row and children live in an unregistered wrapper | `sensors/steps.ts:87-106` | **drop**; the tree knows the subtree | — |
| Disabled inheritance | A disabled ancestor disables descendants (per role) | `utils/disabled.ts` | Decide; document (p: keep) | Undocumented in v2 |
| IntersectionObserver visibility gating | Off-screen/clipped elements ignored. **Zero-size zones never "visible"**; new nodes invisible for one frame | `utils/observer.ts:17-36` | Do not gate empty lists; compute on demand (p) | — |
| Virtual-list remap by `id` | Remounted element takes over the drag entry | `makeDraggable.ts:137-148`; `utils/events.ts:38-49` | Id-based registry (decided) | — |
| Shadow DOM | `composedPath()[0]` for press target; shared provider via `injectionKey` | `logic/pointer.ts:252-254`; `D/guide/core/use-dnd-provider.md:114-147` | **Gap G9** | — |
| Grab offset preserved | Overlay keeps the pointer's relative grab point (ratio × overlay size) | `utils/constraints.ts:95-97` | Keep; `snapCenterToCursor` modifier overrides (decided) | — |
| Drop outside zones = "accept" | `onSelfDragEnd`, no cancel; item just reappears | `logic/pointer.ts:56-57` | Drop outside → cancel → fly back (decided animation) | — |
| Decline keeps drag alive after pointerup | Pointer-up drop declined; next click drops | `logic/pointer.ts:161-164,214-215` | **drop** (`onBeforeDrop` false → return) | Semantic change |
| Keyboard drag | Synthetic pointer at the element centre; arrows move px; collision per key; uses selection; ignores handle/activation | `logic/keyboard.ts` | Keyboard moves by items + announcements (decided); free drag px step (p) | — |
| Click without activation = full drag session | `onSelfDragStart`/`End` fire and the overlay flashes for one frame | `logic/pointer.ts:288-305` | Default activation (mouse 4px, touch 200ms) fixes it | — |
| Interactive children are not excluded | Pressing an input/button inside a draggable starts a drag | `logic/pointer.ts:258-306` | Ignore `input`, `textarea`, `select`, `button`, `[contenteditable]` unless they are the handle (p) | — |
| Selection drags every selected element | Including disabled, other-group or stale (unmounted) nodes | `utils/pointer.ts:56-66` | Filter by accept/disabled; ids (p) | — |

### 1.17 Documented patterns and guide pages

| Pattern / page | What it teaches | Where | v3 mapping | Migration note |
|---|---|---|---|---|
| Quick start / installation | Provider + `makeDraggable` + `makeDroppable`; `useTemplateRef` | `D/guide/quick-start.md`, `installation.md`, `README.md:58-112` | Provider + `makeSortableList` + `makeSortableItem` + `v-for` draft | Rewrite |
| "Component must be a child of DnDProvider" | Inject limitation | `D/guide/patterns.md:130-157`; `pitfalls.md:33-52` | Same limitation; consider `makeSortableList` working in the provider's own component via lazy registration (p) | — |
| `items` (payload) vs `data` | Two payload channels | `patterns.md:5-22` | `items` Ref on the list; `data` on free draggables | Mostly obsolete |
| `hoveredDraggable?.items ?? dropZone?.items` | Pick the target array | `patterns.md:24-35` | Obsolete (library resolves the target) | — |
| Identity checks (`srcItems === listA.value`) | Route results to lists | `patterns.md:37-51` | Obsolete | — |
| `sameList` "don't apply twice" | — | `patterns.md:53-67` | Obsolete | — |
| Kanban column vs card discrimination | One handler, two layers | `patterns.md:69-99` | Nested sortables (decided) + `accept` | — |
| Reactive `disabled` | Ref toggling | `patterns.md:117-128` | `MaybeRefOrGetter` | — |
| Multi-drag batch via `suggestSort` | — | `patterns.md:159-170` | Built-in multi-drag | — |
| v-model tree (`applyToTree` vs `defineModel` + emit bubbling) | Recursive ownership | `patterns.md:172-264`; `techniques.md:128-199` | `makeSortableTree({ items })` | Obsolete |
| `render` vs `#preview` | Per-item vs global overlay | `patterns.md:268-279` | `#overlay` slot | — |
| Pitfall: fixed/absolute wrapper breaks collision | — | `pitfalls.md:5-29` | Verify v3 overlay is independent of layout; drop the pitfall | — |
| Pitfall: `markRaw` on render | — | `pitfalls.md:56-67` | Obsolete | — |
| Pitfall: replace, don't mutate (contradicted by techniques) | — | `pitfalls.md:71-87` vs `techniques.md:170-173` | Obsolete (library writes) | — |
| Pitfall: don't transition `transform` on the overlay | — | `pitfalls.md:91-102`; `drag-preview.md:124-126` | Built-in animation; document the overlay-style contract | — |
| Technique: dual-role element | `placementMargins` | `techniques.md:13-54` | Tree hover-to-nest | Obsolete |
| Technique: selection + droppable on the same element | — | `techniques.md:57-125` | `makeSelectionArea` + `makeSortableList` on one ref (support it) | — |
| Technique: v-model group with in-place source splice | Cross-component transfer | `techniques.md:128-199` | Nested sortables with `Ref<T[]>` per list (library writes both) | — |
| Mobile CSS (`touch-action:none` on the handle) | — | `D/examples/mobile.md` | Default touch 200ms; library applies `touch-action` (p) | — |
| Keyboard: focusable, `aria-grabbed`, key rebinding | — | `D/examples/keyboard.md` | Built-in ARIA + announcements; `keyboard` prop | — |
| Promise drop model | resolve false / void / reject | `D/examples/promise-drop.md:27-41` | `onBeforeDrop` | Semantic change (§0 #4) |
| Group validation | `groupMatch` + `onValidate` | `D/examples/group-validation.md` | `acceptMode` + `onBeforeDrop` (p) | — |
| Virtual lists need `id` | — | `D/guide/core/make-draggable.md:194-214`; `D/examples/performance.md` | Ids mandatory; TanStack/VueUse adapters (decided) | — |
| Shadow DOM bridge | `inject(injectionKey)` + `app.provide` | `D/guide/core/use-dnd-provider.md:114-147`; `changelog.md:168-213` | **Gap G9** | — |
| SSR (Nuxt) | Slot SSR, logic after hydration | `D/guide/nuxt.md:63-65` | Keep | — |

---

## 2. Gaps: v2 capabilities NOT covered by the v3 decisions

| # | v2 capability (evidence) | Why it is a gap | Proposal |
|---|---|---|---|
| **G1** (H) | **Groups and accept rules**: draggable `groups`, droppable `groups` (`[]` = wildcard), `groupMatch:'every'\|'some'`, `onValidate`, selection-area `groups`, live `isAllowed`/`isAccepting` (`utils/groups.ts`, `logic/pointer.ts:66-140`, `utils/selection.ts:120-147`) | Asked explicitly; not decided | **Draggable side:** `type?: string \| string[]` (on `makeDraggable`/`makeSortableItem`, or list-level default `itemType`). Omitted = wildcard (v2 parity). **Drop side:** `accept?: string \| string[] \| '*' \| ((ctx:{ items:T[]; types:string[]; from; to; index? }) => boolean)` — **sync**, evaluated live; drives `isAccepting`, draft insertion and the "blocked" state. Omitted = accept all. **`acceptMode?: 'all' \| 'some'`**: v2 `groupMatch` (`all` default). **Partial accept:** with `'some'`, `onBeforeDrop(ctx)` receives `ctx.accepted` / `ctx.rejected` and may return `true` (accepted only), `false` (fly back), or an id array (exact subset); async allowed. This replaces `onValidate`. Rejected items fly back (multi-drag return animation). **Sortable shorthand:** `group: 'cards'` = `type` + `accept` on a list; plus `pull?: boolean \| 'clone' \| fn` and `put?: boolean \| fn` for source-side rules (a palette = `pull:'clone'`, maps to copy mode). **Selection:** `makeSelectionArea({ accept })` reuses the same matcher. Exposed reactive: `isAccepting` on lists/droppables, `useDnD().over.accepted`. |
| **G2** (H) | **Auto-scroll**: `makeAutoScroll` (threshold per side, speed, disabled, `isScrolling`) + provider `autoScrollViewport` | Not in the decision list | Built-in, **on by default**: scroll the nearest scrollable ancestors of the hovered target, then the viewport. Provider `autoScroll?: boolean \| { threshold?: number \| Sides; speed?: number; acceleration?: number }`, overridable per list. Expose `isAutoScrolling`. Required for keyboard-by-items (scroll the target into view) and virtualization |
| **G3** (M) | **Per-draggable overlay component** (`render`), with different visuals per item type (`E/CustomOverlay/*`) | The overlay is "DOM clone + slot" — per-item? | `#overlay="{ items, active }"` with `items` carrying `{ id, item, data, type, el }` so templates branch per type; optional `overlay: Component` per `makeDraggable`/`makeSortableItem` (p) |
| **G4** (M) | **Overlay that reacts to the hovered zone** (`preview.render` swapped in `onEnter`/`onLeave`; `E/ChangingOverlay`, `P/sections/OverlaySection.vue`) | No context in the slot | Slot props `over: { id, type, data, accepted }`, `status`, `mode` (move/copy/swap), so the swap is declarative |
| **G5** (H) | **Read-only provider state** for custom UI: valid-target highlighting computed from the dragged piece (`E/Checkers`, `E/Chess` read `draggingMap` + `draggableMap.get().data()`), activation progress, `state` gating, pending spinners | v3 lists composables only | `useDnD()` returning `{ status, active: { ids, items, data, primaryId }, over, pointer, modifiers, activation: { progress }, isAutoScrolling }`, read-only (`shallowReadonly`) |
| **G6** (L) | **Modifier-gated drag**: `modifier: { keys, method }` on a draggable (`E/Modifier`) | v3 uses Alt only for copy | `activation.requireKeys?: ('alt'\|'shift'\|'ctrl'\|'meta')[]` or a generic `canDrag?: (e: PointerEvent \| KeyboardEvent) => boolean` (p). Note the conflict with Alt=copy |
| **G7** (L) | **Activation progress and options**: `delay.progress`, `distanceProgress`, per-axis distance, `condition` (`E/Activation`) | Only defaults decided | `activation: { mouse: { distance }, touch: { delay, tolerance }, pen: {...} }` per item/list/provider; `useDnD().activation.progress` (0–1); `onActivationStart/Abort` (p) |
| **G8** (M) | **Keyboard for free drag (non-list)** — arrows move by px (`logic/keyboard.ts`); custom bindings (`D/examples/keyboard.md:79-97`) | "Keyboard moves by items" only covers lists | Sortables: by items. `makeDraggable` + droppables: cycle through **accepting droppables** (Tab/arrows by spatial nearest), and px step only with modifiers (p). Keep a `keyboard.keys` override and per-provider `keyboard: false` |
| **G9** (M) | **Shadow DOM + separate Vue apps** sharing one provider (`injectionKey`, `composedPath`; `P/sections/ShadowDomSection.vue`) | Not mentioned | Exported `provideDnDContext(app)` / `useDnDContext()` bridge. Shadow-aware hit-testing (`shadowRoot.elementFromPoint` recursion), `composedPath` everywhere. Keep a playground regression |
| **G10** (M) | **Free drag & drop / data-only** draggables + zones (board games, zone membership maps; `E/BaseDrop`, `E/CustomOverlay`, `E/Checkers`) | Covered by `makeDraggable`/`makeDroppable` names, but semantics undefined | Define `makeDraggable({ id, data, type, handle, disabled, modifiers })` → `{ isDragging }`; `makeDroppable({ accept, data, onBeforeDrop, onDrop, onDragEnter, onDragLeave })` → `{ isOver, isAccepting }`; animation on drop to the zone optional |
| **G11** (L) | **Generic dual-role element** (draggable that is also a drop target outside trees: kanban column is draggable + accepts cards; `E/DraggableZone`, `P/components/DraggableZone.vue`) | Tree hover-to-nest covers trees only | Nested sortables cover kanban. Allow `makeSortableItem` + `makeDroppable` on the same element with centre/edge priority `dropInsideMargin` (p) |
| **G12** (M) | **Placement flags for custom indicators** on free targets (`isDragOver.top/left/...`) | Indicator mode is sortable-only | `isOver` + `placement` (p) on `makeDroppable`/`makeDraggable` |
| **G13** (M) | **Cross-list selection** (global `selectedSet`) — in v2 a multi-source drag silently moves only the primary list (`utils/events.ts:91`) | v3 multi-drag rules don't mention multi-source | Support multi-source drags (each id knows its list), or restrict selection to one list per drag and document (p: support; the draft removes from all sources) |
| **G14** (L) | **`onSelected` + selection strategies** (`toggle`/`select`), modifier keys for selection, writable per-item `selected` (checkbox) | "Bound to ids" only | `makeSelectionArea(ref, { selection: Ref<Set<Id>>, strategy, modifierKey, accept })`; item `isSelected` writable (p) |
| **G15** (L) | **Overlay teleport target + overlay styling props** (`previewTo`, provider `style`/`class`) | Not mentioned | `overlayTo` prop; style via the slot |
| **G16** (L) | **Multi-drag swap = group exchange** (`operations.ts:256-301`, `P/sections/SwapSection.vue:51`) | Swap mode semantics undefined for multi-drag | Decide: disable swap for multi-drag, or keep group exchange with live preview (p: disable + document) |
| **G17** (M) | **Clone fidelity**: v2 clone = `outerHTML` (loses canvas, input values, `<tr>` context, inherited CSS vars) | "DOM clone default" unspecified | `cloneNode(true)`; copy canvas bitmaps / form values; wrap `tr` in table/tbody with column widths; copy inherited CSS custom properties; strip `id` / `data-dnd-*` (p). **Sortable table rows are not in the layout list — add or document** |
| **G18** (L) | **Collision throttle** (`collision.throttle`) and the custom collision builder (internal `createSensor`) | Not mentioned | Drop the throttle (rAF batching). Optional `collisionDetection` strategy option for free droppables (p) |
| **G19** (L) | **Multiple providers on one page** (changelog v2.0.0) | Not mentioned | Support sibling providers; no module-global state |
| **G20** (L) | **Disabled inheritance** (ancestor-disabled ⇒ descendants) | Not mentioned | Keep for nested sortables; document |
| **G21** (L) | **Drop outside any zone** reported as success (`onSelfDragEnd`) | v3 cancel/fly-back implies a change | `onDragEnd({ dropped:false })` + fly back; `dropOutside: 'cancel' \| 'remove'` (p) for trash-less removal |
| **G22** (L) | **Global event hooks** on every draggable (`onDragStart/Move/End/Cancel`) | Only list callbacks decided | `useDnDMonitor({ onDragStart, onDragOver, onDragEnd, onDragCancel })` (p) — also feeds analytics and announcements |
| **G23** (L) | **Escape cancels; Enter/Space drop; keys rebindable** | Announcements decided; bindings not | `keyboard.keys` prop; ignore `event.repeat`; skip editable targets |
| **G24** (L) | **Horizontal/vertical orientation** chosen per call (`suggestSort('horizontal')`) | Layouts decided, API not | `layout: 'vertical' \| 'horizontal' \| 'grid' \| 'auto'` on the list (p); auto-detect from the first two rects |

---

## 3. Examples rewrite list

**Status key:**
- **Trivial**: becomes a few lines in v3.
- **Rewrite**: still valuable; uses new APIs.
- **Obsolete**: superseded; drop or merge.
- **New**: v3 feature with no v2 example.

| v2 page (`D/examples/…`) → folder (`E/…`) | v3 feature it will demonstrate | Status |
|---|---|---|
| `sorting-lists.md` → `SortingLists/` | `makeSortableList` + `makeSortableItem`, draft `v-for`, cross-list move, FLIP, placeholder ghost | **Trivial** (headline example) |
| `swap.md` → `Swap/` | `mode:'swap'` with live preview | **Trivial** |
| `copy.md` → `Copy/` | Palette list (`pull:'clone'` / copy option) + `clone(item)` + Alt-to-copy; sort inside the target | **Trivial**; add Alt demo (playground CopySection) |
| `tree.md` → `Tree/` | `makeSortableTree`: depth by horizontal offset + hover-to-nest, max depth, collapse | **Rewrite** |
| `draggable-zone.md` → `DraggableZone/` | (dual-role trick) | **Obsolete** → merge into Tree |
| `v-model-group.md` → `VModelTree/` | Nested sortables: kanban columns (horizontal) + cards (vertical), `Ref<T[]>` per list, `accept` | **Rewrite** as "Kanban" |
| `groups.md` → `Groups/` | `type` / `accept`, `isAccepting` highlight, wildcard items | **Trivial** (fix the idle bug) |
| `group-validation.md` → `GroupValidation/` | `acceptMode:'some'` + async `onBeforeDrop` partial accept with modal; rejected items fly back | **Rewrite** |
| `promise-drop.md` → `PromiseDrop/` | Async `onBeforeDrop`; `false` → animated return; `status==='dropping'` spinner; overlay stays visible | **Rewrite** (semantic change) |
| `multi-selection.md` → `MultiSelection/` | `makeSelectionArea` bound to ids, checkbox `isSelected`, multi-drag stack | **Rewrite** |
| `selection-strategy.md` → `SelectionStrategy/` | Selection `strategy` toggle/select | **Trivial** (if strategy kept) |
| `keyboard.md` → `Keyboard/` | Keyboard by items, announcements override, key rebinding | **Rewrite** |
| `activation.md` → `Activation/` | Mouse 4px / touch 200ms defaults, per-pointer config, `activation.progress` | **Rewrite** (needs G7) |
| `modifier.md` → `Modifier/` | Modifier-gated drag (G6), or Alt=copy explanation | **Rewrite** or **Obsolete** (decide G6) |
| `drag-handle.md` → `DragHandle/` | `handle` option (+ auto `touch-action`) | **Trivial** |
| `disabled.md` → `Disabled/` | Reactive `disabled` on items and lists | **Trivial** |
| `mobile.md` (no demo) | Touch defaults, handle vs whole-item scroll | **Rewrite** text; add a demo |
| `base-drop.md` → `BaseDrop/` | Free `makeDraggable` + `makeDroppable`, nested zones (deepest wins), drop animation into the zone | **Trivial** |
| `custom-overlay.md` (orphan) → `CustomOverlay/` | `#overlay` slot branching per item type | **Rewrite**; merge with custom-render |
| `custom-render.md` → reuses `CustomOverlay/` | Same | **Obsolete** (duplicate) |
| `changing-overlay.md` → `ChangingOverlay/` | `#overlay` reads `over` / `accepted` (G4); copy into a zone | **Rewrite** |
| `overlay-transition.md` → `OverlayTransition/` | Built-in pickup/drop animation; custom function hook | **Obsolete** as manual → "Animation hooks" |
| `animation.md` → `Animation/` | Disable/replace animations with a function hook (motion-v/GSAP) | **Obsolete** as manual FLIP → **Rewrite** as the hooks demo |
| `constraint-area.md` → `ConstraintArea/` (+ unused `Example.vue`) | Modifiers: `restrictToElement`, `restrictToParent`, `lockAxis`; add `restrictToWindow`, `restrictToScrollableAncestor`, `snapCenterToCursor` | **Rewrite** as "Modifiers" |
| `snap-grid.md` → `SnapGrid/` | `snapToGrid` modifier with origin (fixes the viewport-relative grid) | **Trivial** |
| `auto-scroll.md` → `AutoScroll/` | Built-in auto-scroll config, nested scroll containers, viewport | **Trivial** (if G2 adopted) |
| `performance.md` → `Performance/` | Virtualization: VueUse `useVirtualList` **and** TanStack Virtual; 10k items; drag across unmount | **Rewrite** (split into 2 examples) |
| `checkers.md` → `Checkers/` | Free drag + `accept` function per cell + `useDnD().active` for valid targets + capture removal | **Rewrite** (showcase for G1/G5) |
| `chess.md` → `Chess/` | Same as checkers | **Rewrite** or merge with Checkers |
| Guide `techniques.md` (3 embedded demos) | Dual-role → tree; selection → multi-selection; v-model group → kanban | **Obsolete** page; fold into examples |
| Guide `patterns.md` | Identity checks, `sameList`, `applyToTree` | **Obsolete**; becomes the "v2 handler → v3 config" migration section |
| Playground `ConfirmSection` | `onBeforeDrop` confirm | Covered by promise-drop |
| Playground `CopySection` | Alt-copy via `pressedKeys` | → Copy example |
| Playground `KanbanSection` | Nested sortables | → Kanban |
| Playground `OverlaySection` | Overlay by zone | → ChangingOverlay |
| Playground `ShadowDomSection` | Shadow DOM shared provider | **Keep as regression** (G9) |
| Playground `SwapSection` | Multi-drag group swap | G16 decision |
| Playground `TreeSection` | Tree with sort/swap toggle | → Tree (decide swap in trees) |
| Playground `VirtualSection` | VueUse virtual + id | → Performance |
| Playground `ZoneDropSection` | Drop into an empty zone | → empty-list drop target test |
| Playground "sort" tab (deleted `SortSection`, 100 items) | Large list sort | Restore as a perf regression |

**New v3 examples with no v2 equivalent:**
- Horizontal list.
- Uniform grid.
- Variable-size grid (masonry-like).
- External draggable into a list (`createItem` temporary item).
- Trash droppable (remove mode).
- Placeholder modes (ghost opacity / custom / indicator line).
- Multi-drag stack vs gaps.
- Cancel/reject fly-back incl. multi-drag.
- TanStack Virtual.
- Accept rules gallery.
- Nested sortables 3 levels.
- Sortable table rows (if G17 is adopted).
- Nuxt starter.
- Announcements/i18n.

---

## 4. Nuxt module

### 4.1 What it does today (`N/src/module.ts`, `N/src/runtime/plugin.client.ts`)

| Item | Detail | Where |
|---|---|---|
| Meta | `name '@vue-dnd-kit/nuxt'`, `configKey 'vueDndKit'`, `compatibility.nuxt '^4.0.0'`, `defaults {}` (no options) | `module.ts:17-24` |
| Client plugin | `addPlugin(runtime/plugin.client)`. The plugin is an **empty** `defineNuxtPlugin(() => {})`, described as an "SSR boundary marker" | `module.ts:28`; `plugin.client.ts:1-6` |
| Export discovery | `resolvePath('@vue-dnd-kit/core')` → reads the **built bundle** text → `mlly.findExports` → names minus `default` and `_*` | `module.ts:31-36` |
| Components | `addComponent({ name, export: name, filePath: '@vue-dnd-kit/core' })` for `DnDProvider`, `DragPreview` | `module.ts:14,39-47` |
| Auto-imports | `addImportsSources({ from: '@vue-dnd-kit/core', imports: <all other exports> })` → `makeDraggable`, `makeDroppable`, `makeSelectionArea`, `makeConstraintArea`, `makeAutoScroll`, `useDnDProvider`, **`injectionKey`** (a generic global name) | `module.ts:50-53` |
| Not handled | Types (docs: import manually), `@vue-dnd-kit/utilities`, options, prefix, transpile | `D/guide/nuxt.md:67-73` |
| Peers / deps | `@vue-dnd-kit/core ^2.0.0` (docs say `^2.4.0`), `nuxt ^4`; deps `@nuxt/kit ^4.4.2`, `mlly` | `N/package.json:41-48` |
| Tests | Scripts reference vitest; no test files exist | `N/package.json:37-39` |
| Docs bugs | Layout puts `<DragPreview />` in DnDProvider's **default slot**, which renders a second, non-teleported preview in the page. Uses `makeDraggable(el, { payload: … })`, but `payload` is not an option | `D/guide/nuxt.md:40-61`; `N/README.md:37-59` |

### 4.2 Required changes for v3

1. **Peers:** `@vue-dnd-kit/core: ^3.0.0`. Decide Nuxt `^3.13 \|\| ^4` (p) vs `^4` only. `@vueuse/core` arrives through core. If `@vueuse/nuxt` is present, avoid duplicate auto-imports.
2. **Stop scanning the dist bundle with mlly.**
   - A tree-shakeable v3 build with chunked re-exports (`export * from './chunk-x.js'`) makes `findExports` return star exports without names. It also breaks when `resolvePath` hits a CJS or `.d.ts` entry.
   - Use a **static, versioned export manifest** instead (p): either core ships `@vue-dnd-kit/core/meta` (`{ composables, components, modifiers, types }`), or the module hard-codes the list per major and has a test that compares it to core's index.
3. **Components:** register only `DnDProvider`; DragPreview is dropped.
   - Add a `prefix` option (p), default none (e.g. `prefix: 'Dnd'`).
   - Register the overlay slot helpers only if v3 ships such components.
4. **Auto-imports:**
   - Composables: `makeDraggable`, `makeDroppable`, `makeSortableList`, `makeSortableItem`, `makeSortableTree`, `makeSelectionArea`, plus `useDnD` / `useDnDMonitor` if adopted.
   - Modifiers are generic names (`snapToGrid`, `lockAxis`, `restrictToWindow`, …), so make them opt-in or namespaced: an `autoImports: { composables: true, modifiers: false }` option (p), or export a `dndModifiers` namespace object.
   - **Do not** auto-import `injectionKey` or any bridge API.
5. **Types:** register type-only auto-imports (`addImports({ name, from, type: true })`) for `SortableDropContext`, `BeforeDropContext`, option types (p). Update the docs.
6. **Remove** the empty `plugin.client.ts`.
   - Ensure the `#overlay` Teleport stays client-only after hydration (keep v2's `isMounted` guard).
   - Add an SSR test: page HTML contains list items; no hydration mismatch with the draft `v-for`.
7. **Options:** `configKey: 'dnd'` or keep `'vueDndKit'`. Options: `prefix`, `autoImports`, `components`.
   - Global provider defaults (animation, activation, keyboard announcements) could go through `app.config` / `runtimeConfig.public` (p, optional).
8. **Docs and README:** remove `<DragPreview/>`, fix the payload example, add a `layouts/default.vue` example with `#overlay`, and add a v2→v3 migration note.
9. **Tests:** `@nuxt/test-utils` e2e covering auto-import resolution, the SSR render, and one drag in the browser.

---

## 5. v2 bugs v3 must not repeat

### 5.1 From the earlier review (all verified)

| # | Bug | file:line | v3 requirement / test |
|---|---|---|---|
| 1 | Activation `delay` is **seconds**; docs say ms (`D/guide/core/make-draggable.md:49,94`, `D/examples/activation.md:53-66`) | `C/internal/utils/drag-activation.ts:142` | ms everywhere; unit test on `delay: 200` |
| 2 | Keyboard drop treats the string result as truthy: `const ok = await handleDropAndFinish(); if (ok) finishDragSession()`. `'decline'` and `'cancel'` also run end events and reset | `C/internal/logic/keyboard.ts:56-61` | Exhaustive `switch` on the drop result; shared code path for pointer and keyboard |
| 3 | Async drop + second pointerup resets the session. While `'pending'`, the `pointerup` listener is still attached; the state is neither dragging nor selecting, so it falls through to `resetDnDSession` + listener removal | `C/internal/logic/pointer.ts:195-223` (fall-through 220-222) | Ignore input while `'dropping'`; an explicit state machine |
| 4 | `previewTo` computed setter assigns to itself (infinite recursion) | `C/internal/composables/useDnDProviderState.ts:191-194` | No writable computed over props |
| 5 | `blur` listener on `document` never fires (blur doesn't bubble), so `pressedKeys` stays stuck after Alt-Tab (Alt-gated drags and copy stay "on") | `C/internal/composables/useDnDProviderEvents.ts:41,51` | `window` blur + `visibilitychange`; derive modifiers from `event.altKey` etc. on each pointer event |
| 6 | No `button` / `isPrimary` filtering: right-click, middle-click, a second touch or a pen barrel button start drags | `C/internal/logic/pointer.ts:248-306` | Only `button===0 && isPrimary` (configurable) |
| 7 | No `pointercancel`. On touch, the browser cancels for scroll; the session stays `activating` (delay timer then **starts a drag**) or `dragging` with no pointerup | `C/internal/composables/useDnDProviderEvents.ts:37-43`; `logic/pointer.ts:249-250` | Handle `pointercancel` + `lostpointercapture`; use `setPointerCapture`; cancel activation on movement beyond `tolerance` |
| 8 | Enter/Space inside inputs/buttons/contenteditable within a draggable starts a drag **and** `preventDefault`s typing | `C/internal/logic/keyboard.ts:90-112` | Only when `event.target` is the draggable or its handle; skip editable targets |
| 9 | `touchAction` / `overscrollBehavior` clobbered: `enableInteractions` restores values that were never saved, so they reset to `''`. It runs on **every pointerup anywhere** | `C/internal/utils/dom.ts:5-6,117-122`; `C/internal/logic/pointer.ts:196` | Only restore what was set; scope to an active session |
| 10 | `selectedSet` not cleaned on unmount (stale detached nodes get dragged next time); `draggingMap` also not cleaned | `C/external/composables/makeDraggable.ts:151-158`; `C/internal/utils/pointer.ts:61-64` | Id-based selection; remove on unmount (unless virtualized and kept by id) |
| 11 | `isSelecting` broken with component refs: compares `nodeRef.value` (instance) with an element | `C/external/composables/makeSelectionArea.ts:32-34` | Always compare resolved elements (`unrefElement`) |
| 12 | CJS build exports nothing usable: `dist/*.cjs.js` under `"type":"module"` is parsed as ESM | `packages/core/package.json:7,39,46`; `packages/core/vite.config.ts:30-31` | ESM-only, or emit `.cjs`; publint + arethetypeswrong in CI |
| 13 | Missing type imports in shipped `.d.ts` (`Component`, `IPlacement`), copied verbatim by `copyDtsFiles` | `C/external/types/entities.d.ts:186`; `C/external/types/provider.d.ts:40`; `vite.config.ts:23` | Generate `.d.ts` from `.ts`; type-check dist in CI |
| 14 | `render` component made reactive (stored in a reactive Map; `preview.render` is a deep `ref`), so docs force `markRaw` | `C/external/composables/makeDraggable.ts:124`; `C/internal/composables/useDnDProviderState.ts:170` | `shallowRef` / `markRaw` internally for components and DOM nodes |
| 15 | O(N²) collision filters: `filterNotDescendantOfDragged` spreads `draggingMap` and `draggableMap` per candidate; `isEffectivelyDisabled*` scans every visible element per node; Phase 1b/2 run these per move. `modifiersDraggableSet` is O(V²) per pointerdown | `C/internal/sensors/steps.ts:82-109`; `C/internal/utils/disabled.ts:21-48`; `C/internal/sensors/default-collision.ts:127-131,160-165`; `C/internal/composables/useDnDProviderState.ts:115-123` | Precompute per session (dragged subtree set, disabled-ancestor cache); benchmark 5k items |

### 5.2 Additional library bugs found in this review

| # | Bug | file:line | v3 requirement |
|---|---|---|---|
| 16 | A **sync throw** in `onDrop` / `onValidate` rejects `pointerUp`. `resetDnDSession` never runs, so the state stays `'dragging'` with listeners attached | `C/internal/logic/pointer.ts:95,143,195-223` | `try/finally` around user callbacks; on error → cancel + return animation |
| 17 | Keyboard has no `'pending'` guard. Enter/Space during an async drop can start a **second** drag; Escape cannot cancel a pending drop or an activation | `C/internal/logic/keyboard.ts:38-40,90` | State machine gates all inputs |
| 18 | No `event.repeat` filter. Holding Enter/Space starts a drag, then the auto-repeat immediately drops it | `C/internal/logic/keyboard.ts:54` | Ignore repeats for start/drop |
| 19 | Custom `forMove` keys outside the hard-coded `MOVE_MAP` are silently ignored | `C/internal/logic/keyboard.ts:21-30,64` | Bindings map action → keys |
| 20 | Window-level `touchstart`/`touchmove` `preventDefault` listeners are passive by default, so they are ineffective (console warnings) | `C/internal/utils/dom.ts:110-111` | `{ passive:false }` on the source element; `touch-action` on handles |
| 21 | `disableInteractions` is not idempotent and uses module-global state. Nested calls (keyboard drag + pointerdown, two providers) save `'none'` as the original, so `user-select` stays stuck | `C/internal/utils/dom.ts:4-6,101-106` | Per-session ref-counted restore |
| 22 | `enableInteractions()` runs before the async drop resolves. Text selection is re-enabled while the drag is still live (decline path) | `C/internal/logic/pointer.ts:196` | Restore only on session end |
| 23 | `pointerup`/`pointermove` document listeners are added on **every** pointerdown, even outside draggables | `C/internal/logic/pointer.ts:249-250` | Attach only after a valid press |
| 24 | No default activation: a plain click runs a full drag session (`onSelfDragStart`/`End`, one-frame overlay) | `C/internal/logic/pointer.ts:288-305` | Default thresholds (decided) |
| 25 | `onSelfDragStart` uses `event.target`, not `composedPath()`, so it never fires for shadow-DOM draggables (contradicts changelog 2.3.0) | `C/internal/utils/events.ts:24-29,251` | Use the resolved initiating element everywhere |
| 26 | Collision `elementFromPoint` + `parentElement` walk can't see inside shadow roots | `C/internal/sensors/default-collision.ts:80-97` | Recurse into `shadowRoot.elementFromPoint`; walk via `getRootNode().host` |
| 27 | Overlay hidden during `'pending'` (README: "Preview stays visible until resolved") | `C/external/components/DragPreview.vue:37` vs `README.md:35` | Overlay persists through `'dropping'` |
| 28 | `preview.size` is measured once per mount, never reset or observed. The first frames of the next drag use the previous item's size (offset jump); docs/comments claim a ResizeObserver | `C/external/components/DragPreview.vue:14-20`; `C/internal/composables/useDnDProviderState.ts:172-181`; `C/internal/sensors/steps.ts:28-37` | ResizeObserver; reset per session |
| 29 | `previewTo` falsy still teleports to `body` (docs: in-place) | `C/external/components/DnDProvider.vue:27` | Honour `false` |
| 30 | `v-bind="props"` leaks `previewTo` / `autoScrollViewport` as DOM attributes on the overlay container | `C/external/components/DnDProvider.vue:28` | Bind only class/style |
| 31 | `cursor: grabbing` on a `pointer-events:none` container has no effect | `C/external/components/DnDProvider.vue:42` | Set the cursor on the root during drag |
| 32 | Refs are resolved once in `onMounted`. Elements behind `v-if`, or swapped refs, never register; detached nodes linger (`P/components/TreeItemBuggy.vue`) | `makeDraggable.ts:110-112`; `makeDroppable.ts:73-75`; `makeSelectionArea.ts:38-40`; `makeConstraintArea.ts:19-21` | Watch the element ref; re-register |
| 33 | Most options are snapshotted at mount (`events`, `render`, `placementMargins`, `id`, auto-scroll `speed`/`threshold`/`disabled`); only Refs nested in the reactive Map unwrap | `makeDraggable.ts:122-135`; `C/internal/utils/auto-scroll.ts:61-62` | `MaybeRefOrGetter` everywhere, read lazily |
| 34 | Unmount doesn't remove the `data-dnd-kit-*` attribute or the native drag-prevent listeners | `makeDraggable.ts:114-118,151-158`; `makeDroppable.ts:77,91-97` | Symmetric teardown |
| 35 | Multi-source multi-drag: items selected in other lists are dropped from `draggedItems` but stay in `draggingMap` (shown in overlay, `isDragging`). Handlers move a subset; GroupValidation/SelectionStrategy corrupt data | `C/internal/utils/events.ts:84-101`; `C/internal/logic/operations.ts:205-219` | G13 |
| 36 | Data-only (no payload) multi-drag returns only the initiating item | `C/internal/utils/events.ts:62-66` | — |
| 37 | `suggestCopy` returns the same references ("shallow copies" in types) | `C/internal/logic/operations.ts:315` vs `C/external/types/operations.d.ts:50` | `clone(item)` mandatory in copy mode (decided) |
| 38 | `suggestSwap` docs say null for multi-drag; the code does a group exchange | `C/external/types/operations.d.ts:170` vs `operations.ts:256-301` | G16 |
| 39 | `onDragStart/Move/End/Cancel` fire on the dragged items, not on the hovered element as documented | `C/internal/utils/events.ts:193-202` vs `C/external/types/entities.d.ts:118-122`, `D/guide/core/make-draggable.md:111-115` | Drop or define precisely |
| 40 | `makeAutoScroll` runs only if the container itself is the hovered droppable. Nested droppables inside it (tree, nested lists) block scrolling; component refs never match | `C/external/composables/makeAutoScroll.ts:46-49` | G2 (ancestor-based) |
| 41 | Auto-scroll speed is constant (no proximity ramp); the default is 10 px/frame at 144fps, docs say multiplier 1 and "closer = faster" | `C/internal/utils/auto-scroll.ts:61,90` | Proximity acceleration; document units |
| 42 | Axis lock uses the source element's **live** rect. If the source moves (v3 draft reorder!) the locked axis drifts | `C/internal/utils/constraints.ts:111,117-118` | Lock to the start position |
| 43 | Constraint/grid apply to the overlay only; collision uses the raw pointer (`updatePointerWithConstraints` unused), so the overlay is clamped but the hit point is outside | `C/internal/utils/constraints.ts:139-167`; `C/external/components/DragPreview.vue:27-32` | Modifiers transform the collision point too (or document it) |
| 44 | Grid snap is viewport-absolute (misaligned with any container; scroll/resize breaks the workaround) | `C/external/components/DragPreview.vue:22-32`; `E/SnapGrid/GridCanvas.vue:11-23` | `snapToGrid` relative to a container origin |
| 45 | Selection anchor compensates only window scroll, not the scroll container | `C/internal/logic/scroll.ts:20-31` | Track scroll per container |
| 46 | Selection default modifier is `ControlLeft` only (no ControlRight/Meta) | `C/external/composables/makeSelectionArea.ts:45-48` | Platform-aware default |
| 47 | Clone renders `<TAG v-html=outerHTML>`: a nested duplicate element, duplicate `id`s, a `data-dnd-kit-draggable` attribute on the clone; `initialHTML` captured but unused | `C/external/components/DragPreview.vue:53-61`; `C/internal/utils/pointer.ts:45-50` | G17 |
| 48 | Hover maps are deleted and re-set on every move, so all dependents re-run each pointermove. `getDragEvent` (calling every payload fn) is rebuilt several times per move even with no handlers | `C/internal/logic/hover.ts:55-56`; `C/internal/utils/events.ts:108-202`; `C/internal/logic/pointer.ts:236-241` | Diff before writing; lazy event objects |
| 49 | Collision runs only on pointermove/scroll. Layout changes under a static pointer (and v3 draft reorders!) are not re-evaluated | `C/internal/logic/pointer.ts:236-237`; `C/internal/logic/scroll.ts:15-18` | Re-run after DOM flush, with hysteresis to avoid oscillation |
| 50 | IntersectionObserver gating is async (new nodes are invisible for about one frame) and zero-size zones are never visible, so an empty list can't be a target | `C/internal/utils/observer.ts:24-29`; `useDnDProviderState.ts:84-90` | Empty lists accept drops (min hit area) |
| 51 | Dropping on a disabled hovered zone (or outside) reports `'accept'` | `C/internal/logic/pointer.ts:56-59` | Cancel + return |
| 52 | Pressing on a disabled/modifier-blocked nested draggable doesn't fall back to the enclosing draggable | `C/internal/logic/pointer.ts:258-281` | Walk up to the nearest eligible draggable |
| 53 | String `injectionKey` (collision-prone); Nuxt auto-imports it globally | `C/internal/utils/namespaces.ts:20`; `N/src/module.ts:50-53` | Symbol; not auto-imported |
| 54 | Import-time CSS injection; no `sideEffects` field | `packages/core/vite.config.ts:13`; `packages/core/package.json` | Side-effect-free entry |
| 55 | `onScopeDispose` is called inside a watcher callback when the viewport auto-scroll prop changes (no active scope after setup) | `C/internal/composables/useDnDProviderEvents.ts:18-33`; `C/internal/composables/useViewportAutoScroll.ts:76` | `effectScope` per feature |
| 56 | Overlay position = pointer − grab-ratio × **overlay** size. With multi-drag stacks (taller overlay) the grab point shifts away from the cursor | `C/internal/utils/constraints.ts:93-97` | Grab offset in px relative to the primary item |
| 57 | Dead code shipped: `logic/payload.ts`, `utils/keyboard.ts`, `updatePointerWithConstraints`, `pickClosestToPointer`, `getRelativeCoordinates`, `checkIsSelectableArea`, `isNotDirectClick`, `getAutoScrollDirection`, `isClient`, `CONTAINER` attribute, `DefaultOverlay.vue`, `sensors/sensor.ts` builder | Various | Lint for unused exports |

### 5.3 Docs ↔ implementation mismatches (the migration guide must describe real v2 behaviour)

| Doc claim | Reality | Where |
|---|---|---|
| `activation.delay` in ms | Seconds | `D/guide/core/make-draggable.md:49,94`; `D/examples/activation.md:53-66` vs `drag-activation.ts:142` |
| Numeric `distance` = "either axis exceeds" | Euclidean radius | `D/examples/activation.md:31`; `make-draggable.md:93` vs `drag-activation.ts:36-39` |
| `onDragStart/…` fire on the element under the cursor | Fire on the dragged items | `make-draggable.md:111-115` vs `events.ts:193-202` |
| Droppable payload `() => [items, { id }]` | Must return the array (playground TreeItem copied the bug) | `D/guide/core/make-droppable.md:116`; `P/components/TreeItem.vue:46` |
| makeDroppable options table lists only `disabled`/`groups`/`events` | Also `groupMatch`, `data`, `onValidate` | `make-droppable.md:33-45` |
| `previewTo` falsy = render in place | Always teleports (`\|\| 'body'`) | `D/guide/core/dnd-provider.md:29` vs `DnDProvider.vue:27` |
| Auto-scroll `speed` default 1 (multiplier); "closer = faster" | Default 10 px/frame; constant | `dnd-provider.md:36`; `make-auto-scroll.md:44,53` vs `auto-scroll.ts:61,90` |
| makeAutoScroll runs whenever dragging | Only when the container is the hovered droppable | `make-auto-scroll.md:51` vs `makeAutoScroll.ts:46-58` |
| `preview.render` = active draggable's `render` | Never set by the library; it is a global override | `D/guide/core/use-dnd-provider.md:40,105`; `dnd-provider.md:87` vs `DnDProvider.vue:19` |
| DragPreview updates `preview.size` when content changes; default CSS has `transition: all .3s` | Measured once per mount; no transition rule | `D/guide/core/drag-preview.md:15,117-121` vs `DragPreview.vue:14-20,67-71` |
| Preview stays visible during async drop | Hidden in `'pending'` | `README.md:35` vs `DragPreview.vue:37` |
| `ISuggestSortResult.mode: 'before'\|'after'` | `'insert'\|'append'\|'prepend'` | `D/guide/patterns.md:110` vs `operations.d.ts:23` |
| "Never mutate arrays in place" | Techniques recommends an in-place `splice` | `D/guide/pitfalls.md:71-87` vs `D/guide/techniques.md:170-173` |
| `copiedItems` are shallow copies | Same references | `operations.d.ts:50` vs `operations.ts:315` |
| Swap returns null for multi-drag | Group exchange | `operations.d.ts:170` vs `operations.ts:256` |
| `makeSnappedOverlayPosition` imported from core | It lives in `@vue-dnd-kit/utilities`; the page is an orphan (not in nav) | `D/guide/core/make-snapped-overlay-position.md:72-75,124-127`; `docs/.vitepress/config.mts` |
| Nuxt layout puts `<DragPreview />` inside DnDProvider | Renders a second, un-teleported preview | `D/guide/nuxt.md:40-46`; `N/README.md:37-45` |
| Nuxt `makeDraggable(el, { payload })` | `payload` is the 3rd argument | `D/guide/nuxt.md:53-55`; `N/README.md:50-53` |
| Nuxt compat core `^2.4.0` | Peer `^2.0.0` | `D/guide/nuxt.md:80` vs `N/package.json:46` |
| "Do not nest/use multiple providers" vs "multiple independent providers on one page" | Contradictory | `dnd-provider.md:12,22` vs `changelog.md:231` |
| "All pointer handlers use `composedPath()[0]`" | `onSelfDragStart` path uses `event.target` | `changelog.md:178` vs `events.ts:27` |
| "Added grid layout example" (2.2.0) | No grid example exists | `changelog.md:219` |
| "Zero dependencies" | v3 adds `@vueuse/core` | `README.md:38`; `installation.md:10`; `introduction.md:7` |
| Utilities README: reactive `isDragging` / `isSelected` helpers | Only `makeSnappedOverlayPosition` | `U/README.md:26-30` |
| Root README links `packages/core/CHANGELOG.md` | File doesn't exist | `README.md:21` |
| Groups example: `state !== 'idle'` | `'idle'` isn't a state, so every zone shows "blocked" at rest | `D/examples/groups.md:57`; `E/Groups/Zone.vue:25` |
| Checkers: `disabled: () => …` | Function is truthy, so always disabled; not used in code | `D/examples/checkers.md:30-38` |
| Modifier page registers `makeDraggable` twice on one element; claims Copy does Alt-copy | Second call overwrites the first; no Alt-copy demo | `D/examples/modifier.md:57-82` |
| Constraint demos "need separate providers" | Unnecessary | `D/examples/constraint-area.md:33` |
| Custom overlay TSX needs `defineComponent` vs a bare function works | Contradictory | `D/examples/custom-overlay.md:128-131` vs `custom-render.md:112-118` |
| Performance "up to 5 000" | UI goes to 100 000 | `D/examples/performance.md:3,13` vs `E/Performance/Example.vue:21` |
| Changing-overlay `#preview` slot with an `overZone` prop | Not implemented (described code is the unused `AlchemyZone.vue`) | `D/examples/changing-overlay.md:21-82` |
| Sorting-lists `makeDraggable(itemRef)` without payload | Breaks `suggestSort` | `D/examples/sorting-lists.md:88` |

### 5.4 Example and playground defects (do not port)

- **ExampleContainer `backdrop-filter`:** it turns the container into the containing block for fixed children, so the GroupValidation dialog covers the whole example (`ExampleContainer.vue:73`; `E/GroupValidation/Zone.vue:225`).
- **Unused or broken example files:**
  - `E/VModelTree/GroupItem.vue` (imports a non-existent type).
  - `E/ChangingOverlay/AlchemyZone.vue`.
  - `E/ConstraintArea/Example.vue`.
- **Leftover or broken text in examples:**
  - Leftover text inside the overlays (`E/CustomOverlay/NoteOverlay.vue:24`, `TaskOverlay.vue:27`).
  - The "Drop here" hint can never show (`E/CustomOverlay/Zone.vue:29`, `E/Swap/TeamList.vue:58-63`).
- **Chess:** checkmate detection ignores the castling rules (`E/Chess/ChessGame.vue:181`).
- **Playground `Droppable` calls `@drop` twice:** it has both an `onDrop` prop and `emit('drop')`. Its `async onDrop` forces `'pending'` on every drop (`P/components/Droppable.vue:15,20-21,39-43`).
- **Playground App shell:**
  - The default `sort` tab is empty (`P/App.vue:27,47,69-77`).
  - `overlay-to` is the wrong prop name (`P/App.vue:51`).
- **Playground Kanban:** no `sameList` guard, so a column can be lost (`P/sections/KanbanSection.vue:54-58`).
- **Playground Overlay:** a drop into a `:items="[]"` zone deletes the item (`P/sections/OverlaySection.vue:73-81`).
- **Playground Shadow DOM:** the inner app is never unmounted (`P/sections/ShadowDomSection.vue:180-200`).
- **Playground imports source by relative path despite the dist aliases:** the compiled `vite.config.js` shadows `vite.config.ts`.

---

## 6. v2 internals worth carrying into v3 (design notes)

- **Topmost-hit semantics.** `elementFromPoint` handles modals and z-order for free. Keep it for free droppables, and make it shadow-aware.
- **Lateral-drift regression (2.4.5).** The nearest item by distance-to-box prevents "teleport to list start/end". Encode it as a test for the sortable strategy.
- **Virtual-list continuity (2.3.0).** Ids carry the drag through unmount/remount. Make ids the primary key everywhere: draft, selection, overlay and announcements.
- **Same-session invariants to enforce in v3's state machine:**
  - One active session.
  - Inputs ignored during `dropping` / `animating`.
  - Every exit path (drop, reject, cancel, error, pointercancel, blur, unmount of provider) restores the DOM and emits exactly one terminal event.
