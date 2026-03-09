# Tree / Nesting

Draggable file-tree with two behaviors in one drop handler:

- **Sort** — drag a node between siblings (insert before / after)
- **Nest** — drop a node inside a folder to move it into that folder's children

<script setup>
import Example from '../../.vitepress/components/v2/Examples/Tree/Example.vue';
</script>

<Example />

## How it works

The trick is distinguishing *where* the pointer lands during a drop:

| Pointer lands on… | `e.hoveredDraggable` | `e.dropZone` | Effect |
|---|---|---|---|
| A sibling node row | the hovered node | the parent zone | **sort** among siblings |
| An empty folder zone | `undefined` | the folder zone | **nest** into folder |

Both cases resolve to a target array via:

```ts
const tgtArr = e.hoveredDraggable?.items ?? e.dropZone?.items;
```

`hoveredDraggable.items` is the sibling array (sort). `dropZone.items` is the folder's children array (nest).

## Component structure

```
Example.vue
├── RootZone.vue        ← droppable, payload = root array
└── TreeItem.vue        ← recursive
    ├── node row        ← draggable, payload = [index, siblings]
    └── children zone   ← droppable, payload = node.children
```

**TreeItem.vue** plays two roles at once:

```vue
<script setup lang="ts">
const { isDragging, isDragOver: rowPlacement } = makeDraggable(
  rowRef,
  { dragHandle: '.drag-handle' },
  () => [props.index, props.siblings]   // items = siblings array
);

const { isDragOver: childrenOver } = makeDroppable(
  childrenRef,
  { events: { onDrop: (e) => emit('drop', e) } },
  () => props.node.children             // items = this folder's children
);
</script>
```

## Drop handler

```ts
function handleDrop(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const srcArr = e.draggedItems[0]?.items as TreeNode[] | undefined;
  const tgtArr = (e.hoveredDraggable?.items ?? e.dropZone?.items) as TreeNode[] | undefined;
  if (!srcArr || !tgtArr) return;

  applyToTree(srcArr, r.sourceItems as TreeNode[]);
  if (!r.sameList) {
    applyToTree(tgtArr, r.targetItems as TreeNode[]);
  }
}
```

`applyToTree` does an identity-based walk to find which array to replace:

```ts
function applyToTree(oldArr: TreeNode[], newArr: TreeNode[]) {
  if (oldArr === tree.value) {
    tree.value = newArr;          // root level
  } else {
    findAndReplace(tree.value, oldArr, newArr);
  }
}

function findAndReplace(nodes: TreeNode[], oldArr: TreeNode[], newArr: TreeNode[]): boolean {
  for (const node of nodes) {
    if (node.children === oldArr) {   // identity check — O(depth)
      node.children = newArr;
      return true;
    }
    if (findAndReplace(node.children, oldArr, newArr)) return true;
  }
  return false;
}
```

## `v-show` vs `v-if` for children zone

The children container uses `v-show`, not `v-if`:

```vue
<div ref="childrenRef" v-show="isOpen" class="children">
```

`v-if` would **unmount** the element when collapsed — `makeDroppable` would never fire `onMounted`, leaving the zone unregistered. With `v-show` the element stays in the DOM but `display: none` prevents the `IntersectionObserver` from adding it to the visible droppable set, so collapsed folders never accidentally receive drops.

## Insertion line indicators

`makeDraggable` returns `isDragOver` (an `IPlacement` ref) for the **draggable** element — not just for drop zones. Use it to show visual insert-before / insert-after lines:

```vue
<div v-if="rowPlacement?.top"    class="insert-line insert-line--top" />
<!-- row itself -->
<div v-if="rowPlacement?.bottom" class="insert-line insert-line--bottom" />
```

`IPlacement.top = true` → pointer is in the top half → insert before.
`IPlacement.bottom = true` → pointer is in the bottom half → insert after.

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Tree/Example.vue)
- [RootZone.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Tree/RootZone.vue)
- [TreeItem.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Tree/TreeItem.vue)
