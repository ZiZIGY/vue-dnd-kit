# Techniques

Practical patterns and techniques for building real drag-and-drop UIs with vue-dnd-kit.

<script setup>
import DraggableZoneExample from '@examples-v2/DraggableZone/Example.vue';
import MultiSelectionExample from '@examples-v2/MultiSelection/Example.vue';
import VModelExample from '@examples-v2/VModelTree/VModelExample.vue';
</script>

---

## 1. Dual-role element (Draggable Zone)

An element can act as **both a draggable and a droppable** at the same time. Register `makeDraggable` and `makeDroppable` on the same `ref`.

The key option is `placementMargins` — it splits the element into edge zones and a center zone:

| Pointer position | Active role | Effect |
| --- | --- | --- |
| Top / bottom edge | Draggable | Sort among siblings (insert line) |
| Center | Droppable | Nest inside this node (glow) |

<DraggableZoneExample />

### Dual-role: key code

```ts
const nodeRef = useTemplateRef<HTMLElement>('nodeRef');

// Edge zone → sort siblings
const { isDragging, isDragOver: placement } = makeDraggable(
  nodeRef,
  {
    dragHandle: '.drag-handle',
    placementMargins: { top: 12, bottom: 12 },
  },
  () => [props.index, props.siblings]
);

// Center zone → nest inside this node
const { isDragOver: isOver } = makeDroppable(
  nodeRef,
  { events: { onDrop: (e) => emit('drop', e) } },
  () => props.node.children
);
```

The `placementMargins` value defines how many pixels from the top/bottom edge are considered the "sort" zone. Everything outside that margin is the "drop" zone.

### Why use it

Without this technique, leaf nodes (no children) have no droppable element in the DOM, so dropping onto them is impossible. Making each node dual-role solves this — you can drop onto any node regardless of whether it has children.

---

## 2. Selection area (box select + multi-drag)

`makeSelectionArea` adds a rubber-band selection box to a container. Hold **Ctrl** and drag to draw a rectangle — all items intersecting it become selected. Then drag any selected item to move all of them at once.

<MultiSelectionExample />

### Selection area: key code

```ts
const listRef = useTemplateRef<HTMLElement>('listRef');

// Activate box-select on Ctrl + drag
const { isSelecting, style: selectionStyle } = makeSelectionArea(listRef, {
  modifier: {
    keys: ['ControlLeft', 'ControlRight'],
    method: 'some', // activate if ANY of the keys is held
  },
});

// Same container is also a droppable
makeDroppable(
  listRef,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (!r) return;
        items.value = r.sourceItems as Item[];
      },
    },
  },
  () => items.value
);
```

Render the selection rectangle using the `style` returned by `makeSelectionArea`:

```vue
<div ref="listRef" class="list">
  <div v-if="isSelecting" class="selection-rect" :style="selectionStyle" />
  <TaskItem v-for="..." />
</div>
```

```css
.selection-rect {
  position: absolute; /* list must be position: relative */
  border: 1.5px solid var(--vp-c-brand-1);
  background: rgba(62, 175, 124, 0.1);
  pointer-events: none;
  z-index: 10;
}
```

Items use `selected` from `makeDraggable` to reflect and control their selection state:

```ts
const { isDragging, isDragOver, selected } = makeDraggable(
  itemRef,
  { dragHandle: '.handle' },
  () => [props.index, props.items]
);
```

```vue
<!-- Checkbox stays in sync with box-select -->
<input v-model="selected" type="checkbox" />
```

---

## 3. v-model pattern for groups

Each group component owns its items via `defineModel`. Parent just passes `v-model` — no handlers, no shared state, no coordination.

<VModelExample />

### v-model group: key code

**Data** — one array, items can hold children at any depth:

```ts
interface Item {
  id: string;
  title: string;
  color?: string;
  children?: Item[];   // nested group
}
```

**Parent** — just `v-model` per column:

```vue
<div v-for="col in columns" class="column">
  <VModelGroup v-model="col.items" />
</div>
```

**VModelGroup** — droppable zone, fully self-contained:

```ts
const items = defineModel<Item[]>({ required: true });

makeDroppable(el, {
  groups: ['item'],
  events: {
    onDrop(e) {
      const r = e.helpers.suggestSort('vertical');
      if (!r) return;

      items.value = r.targetItems as Item[];

      if (!r.sameList) {
        // e.draggedItems[0].items IS the reactive array of the source group —
        // mutating it in-place triggers Vue reactivity on that group directly.
        const src = e.draggedItems[0].items as Item[];
        src.splice(0, src.length, ...(r.sourceItems as Item[]));
      }
    },
  },
}, () => items.value);
```

**VModelItem** — draggable leaf, renders a nested `VModelGroup` when `item.children` exists:

```vue
<!-- Circular dep resolved via defineAsyncComponent -->
const VModelGroup = defineAsyncComponent(() => import('./VModelGroup.vue'));

<div ref="el">
  {{ item.title }}
  <VModelGroup v-if="item.children" v-model="item.children" />
</div>
```

Same-group sort and cross-group transfer handled entirely inside the components — no parent handlers or shared state needed.

### When to use

| Scenario | Approach |
| --- | --- |
| Flat groups / kanban | `v-model` + in-place source mutation (this pattern) |
| Deeply nested tree | same pattern, items with `children` auto-recurse |

---

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — `placementMargins`, `dragHandle`, `selected`
- [makeDroppable](/v2/guide/core/make-droppable) — `events.onDrop`
- [makeSelectionArea](/v2/guide/core/make-selection-area) — box select API
- [Patterns & Concepts](/v2/guide/patterns) — `suggestSort`, identity checks, v-model deep-dive
- [Draggable Zone example](/v2/examples/draggable-zone) — full source for dual-role tree
- [Multi Selection example](/v2/examples/multi-selection) — full source for selection area
