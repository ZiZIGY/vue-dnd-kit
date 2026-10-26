# Trees: makeSortableTree

A tree is rendered **flat**: `items` is the list of visible nodes in order, each with
its `depth`. You indent rows yourself. Rows use `makeSortableItem` like list rows. The
depth of a drop comes from the horizontal offset of the drag and/or from hovering the
middle of a row (drop inside).

```vue
<!-- FileTree.vue -->
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import TreeRow from './TreeRow.vue';

interface FileNode { id: string; name: string; type: 'file' | 'folder'; children?: FileNode[] }

const tree = ref<FileNode[]>([
  { id: 'src', name: 'src', type: 'folder', children: [{ id: 'main', name: 'main.ts', type: 'file' }] },
  { id: 'readme', name: 'README.md', type: 'file' },
]);
const collapsed = ref(new Set<Key>());
const INDENT = 24;

const rootRef = useTemplateRef<HTMLElement>('root');
const { items, projected, indicator } = makeSortableTree(rootRef, {
  items: tree,                                  // root nodes; writable ref = library writes
  getKey: (node) => node.id,                    // default node.id
  getChildren: (node) => node.children,         // default node.children
  setChildren: (node, children) => { node.children = children; },  // the default
  indentation: INDENT,                          // px per level, for the offset projection
  nesting: 'both',                              // 'offset' | 'hover' | 'both'
  maxDepth: 3,                                  // roots are depth 0; the dragged subtree counts
  canNest: (node, parent) => parent.type === 'folder',
  collapsed,                                    // keys whose children are hidden
  clone: (node) => deepCopyWithNewIds(node),    // copies need new keys, subtree included
  onDrop: (e) => console.log(e.keys, e.from.parentKey, e.to.parentKey, e.to.index),
});

const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
</script>

<template>
  <div ref="root">
    <TreeRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" @toggle="toggle" />
  </div>
</template>
```

```vue
<!-- TreeRow.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';

const props = defineProps<{ node: FlatNode<FileNode>; indent: number }>();
const emit = defineEmits<{ toggle: [key: Key] }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <div ref="el" :style="{ paddingLeft: `${node.depth * indent}px` }">
    <button v-if="node.hasChildren" type="button" :aria-expanded="!node.collapsed" @click="emit('toggle', node.key)">
      {{ node.collapsed ? '▸' : '▾' }}
    </button>
    {{ node.item.name }}
  </div>
</template>
```

`FlatNode<T>` is `{ key, item, depth, parentKey, index (among siblings), hasChildren, collapsed }`.
The dragged node's `depth` is its **projected** depth, so the placeholder indents live.

## Options beyond the list's

| Option | Notes |
| --- | --- |
| `getChildren` / `setChildren` | How to read and write children. The default write sets `node.children`. |
| `withChildren` | `(node, children) => copy`, for `e.result` (an immutable new tree). Default `{ ...node }` + children. Pass it for class instances. |
| `indentation` | Px per level (default 24). Must match your row padding for the offset projection to feel right. |
| `nesting` | `'offset'` (drag sideways), `'hover'` (middle of a row = inside), `'both'` (default). |
| `maxDepth`, `canNest` | Limits. Both apply to the whole dragged block, descendants included. |
| `collapsed` | A `Set` of keys (ref or getter). Collapsed nodes' children aren't in `items`. |
| `placeholder: 'indicator'` | The tree stays still. Draw a line from `indicator` (`side`, `depth`, `parentKey`). `side: 'inside'` means into that row. |

All `makeSortableList` options also apply (`group`, `clone`, `createItem`,
`dropOutside`, `modifiers`, `animation`, `animate`, `onBeforeDrop`, `onDrop`, …). Lists
and trees in the same `group` exchange nodes: a node moved into a list keeps its subtree.

Returns `{ id, items, projected, indicator, isOver, isAccepting, activeKey, activeIndex, activeSize, captureLayout }`.
`projected` is `{ depth, parentKey }` while the drag is over this tree.

## Drop event

`SortableTreeDropEvent` adds `parentKey` to `from` and `to`. `to.index` is the
position among the new siblings, counted after the node was removed from its old place.
`e.result.get(treeId)` is a new root array: changed paths are copied (`withChildren`),
untouched subtrees are shared, and your nodes are never mutated. With a read-only
`items`, call `e.preventDefault()` and store `result` as for lists.

## Multi-drag in trees

Selected nodes move together as one block, each with its subtree, in document order. A
selected node inside another selected node rides along in its parent's subtree. This
also applies to the grabbed node (as in VS Code): the overlay stays on the grabbed row.

## Keyboard

Up and down move between rows. Left and right change the depth when the new neighbours
allow it. In indicator mode the line moves instead.

## Axis lock

`axis: 'y'` (or `modifiers: [restrictToVerticalAxis]`) still allows nesting: the depth
then comes only from hovering the middle of a row.
