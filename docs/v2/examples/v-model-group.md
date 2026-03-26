# v-model Group

The `v-model` group pattern lets each droppable zone manage its own items via `defineModel` — no parent handlers, no shared state, no coordination overhead. Cross-group transfers happen automatically through in-place splice on the reactive source array.

<script setup>
import VModelExample from '@examples-v2/VModelTree/VModelExample.vue';
</script>

## Demo

<VModelExample />

Drag tasks between columns · drag column headers to reorder columns.

The entire board is a **single flat array** — columns are just items that happen to have `children`.

## Why use this pattern

The traditional approach to multi-list DnD keeps all arrays in the parent and passes event handlers down. Every drop fires an `emit`, the parent figures out which lists changed, and updates its state. This couples every group component to the parent's logic.

With the `v-model` pattern each `VModelGroup` owns its list via `defineModel`. The `onDrop` handler mutates **only its own ref** for the target side, and for the source side it mutates the source reactive array **in-place** via `splice`. Vue picks up the splice automatically — no parent involved.

```
Board (ref<Item[]>)
  └─ VModelGroup (v-model = board, direction="horizontal", group="column")
       ├─ VModelItem (column: Todo)
       │    └─ VModelGroup (v-model = item.children, group="task")
       │         ├─ VModelItem (task)
       │         └─ VModelItem (task)
       ├─ VModelItem (column: In Progress)
       │    └─ VModelGroup (v-model = item.children, group="task")
       └─ VModelItem (column: Done)
            └─ VModelGroup (v-model = item.children, group="task")
```

## How it works

### Data shape

One recursive type covers both columns and tasks:

```ts
interface Item {
  id: string;
  title: string;
  color?: string;
  children?: Item[]; // present → column, absent → leaf task
}
```

### VModelGroup — self-contained droppable zone

```ts
const items = defineModel<Item[]>({ required: true });

makeDroppable(
  el,
  {
    groups: [group], // 'column' at root level, 'task' inside each column
    events: {
      onDrop(e) {
        const r = e.helpers.suggestSort(direction === 'horizontal' ? 'horizontal' : 'vertical');
        if (!r) return;

        // Update this zone's list (target side)
        items.value = r.targetItems as Item[];

        if (!r.sameList) {
          // e.draggedItems[0].items IS the reactive array of the source VModelGroup.
          // Mutating it in-place triggers Vue reactivity on that component directly —
          // no parent handler, no emit, no shared store.
          const src = e.draggedItems[0].items as Item[];
          src.splice(0, src.length, ...(r.sourceItems as Item[]));
        }
      },
    },
  },
  () => items.value
);
```

The key insight: `e.draggedItems[0].items` is the **exact same reactive array** that the source `VModelGroup` passed as the third argument to `makeDroppable`. Splicing it directly is equivalent to `sourceGroup.items.value = newArray` — but without any reference to the source component.

### VModelItem — draggable with optional nested group

```ts
const { isDragging, isDragOver } = makeDraggable(
  el,
  {
    groups: [props.item.children ? 'column' : 'task'],
    dragHandle: props.item.children ? '.item-row' : undefined,
  },
  () => [props.index, props.items]
);
```

```vue
<div ref="el" class="item">
  <div class="item-row">{{ item.title }}</div>

  <!-- Nested group renders automatically when item has children -->
  <VModelGroup
    v-if="item.children"
    v-model="item.children"
    group="task"
  />
</div>
```

### Group separation

| Element | `groups` | Accepts drops from |
| --- | --- | --- |
| Root `VModelGroup` | `['column']` | items with `groups: ['column']` |
| Inner `VModelGroup` | `['task']` | items with `groups: ['task']` |
| Column `VModelItem` | `['column']` | only sortable among other columns |
| Task `VModelItem` | `['task']` | only sortable among tasks |

Columns can't be dragged into task slots and vice versa — enforced by group names alone, no extra validation needed.

### Root usage

One array, one component:

```vue
<DnDProvider>
  <VModelGroup
    v-model="board"
    direction="horizontal"
    group="column"
  />
</DnDProvider>
```

## Source

- [VModelExample.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/VModelTree/VModelExample.vue)
- [VModelGroup.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/VModelTree/VModelGroup.vue)
- [VModelItem.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/VModelTree/VModelItem.vue)

## See also

- [Techniques Guide](/v2/guide/techniques) — v-model group pattern explained in context
- [Patterns & Concepts](/v2/guide/patterns) — `suggestSort`, identity checks, `sameList`
- [makeDroppable](/v2/guide/core/make-droppable) — `events.onDrop`, `groups`
- [makeDraggable](/v2/guide/core/make-draggable) — `groups`, `dragHandle`
- [Tree / Nesting example](/v2/examples/tree) — tree with a root-level drop handler
