# Draggable Zone

An element can be **both a draggable and a droppable** at the same time. Register both `makeDraggable` and `makeDroppable` on the same `ref`. Use `placementMargins` to split the element into zones: pointer near the edges sorts, pointer in the center nests.

<script setup>
import Example from '@examples-v2/DraggableZone/Example.vue';
</script>

## Demo

<Example />

Each row is a dual-role element. The handle (⠿) makes it draggable. The same element is also a droppable. The pointer position decides what happens:

- **Top / bottom edge** — purple insert line → sort node among its siblings
- **Center** — indigo glow → nest node as a child of this folder

## How it works

```ts
// Same ref for both composables
const rowRef = useTemplateRef<HTMLElement>('rowRef');

// Draggable with edge zones defined by placementMargins
const { isDragOver: placement } = makeDraggable(rowRef, {
  dragHandle: '.drag-handle',
  placementMargins: { top: 12, bottom: 12 }, // edge = top and bottom 12px
}, () => [props.index, props.siblings]);

// Droppable that fires only when pointer is in the center zone
const { isDragOver: isOver } = makeDroppable(
  rowRef,
  { events: { onDrop: (e) => emit('drop', e) } },
  () => props.node.children,
);
```

### Internal mechanism

`hover.ts` detects the dual-role situation (`isDualRole` branch) and activates only **one** side depending on placement:

| Pointer position | Active side | `hoveredDraggable` | `dropZone` |
| --- | --- | --- | --- |
| Top / bottom edge | Draggable | set to row | `null` |
| Center | Droppable | `null` | set to row |

This means a single drop handler covers both cases with `hoveredDraggable?.items ?? dropZone?.items`:

```ts
function handleDrop(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const srcArr = e.draggedItems[0]?.items as TreeNode[];
  // Edge → hoveredDraggable.items = sibling array (sort)
  // Center → dropZone.items = node.children (nest)
  const tgtArr = (e.hoveredDraggable?.items ?? e.dropZone?.items) as TreeNode[];
  if (!srcArr || !tgtArr) return;

  applyToTree(srcArr, r.sourceItems as TreeNode[]);
  if (!r.sameList) applyToTree(tgtArr, r.targetItems as TreeNode[]);
}
```

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/DraggableZone/Example.vue)
- [DualNode.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/DraggableZone/DualNode.vue)
- [RootZone.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/DraggableZone/RootZone.vue)

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — `placementMargins` option
- [makeDroppable](/v2/guide/core/make-droppable) — `events.onDrop`
- [Tree example](/v2/examples/tree) — tree with a separate children droppable per node
