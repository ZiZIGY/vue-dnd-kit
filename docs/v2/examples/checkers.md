# Checkers

A fully playable checkers game built on Vue DnD Kit v2. Each cell on the board is an independent droppable zone — no special board logic required from the library.

<script setup>
import Example from '@examples-v2/Checkers/Example.vue';
</script>

<Example />

## How it works

The key idea: **every dark cell is its own `makeDroppable` zone**. The game logic lives entirely outside the library — in a plain `handleMove` function.

```text
DnDProvider
  └── 8×8 grid of CheckerCell (makeDroppable)
        └── CheckerPiece (makeDraggable)  — rendered when a piece occupies the cell
```

## Draggable piece

Each piece carries its index and the shared `pieces` array as the drag payload. `disabled` prevents dragging opponent pieces:

```vue
<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ piece: Piece; pieces: Piece[]; currentTurn: 'red' | 'black' }>();

  const el = useTemplateRef<HTMLElement>('el');
  const index = computed(() => props.pieces.findIndex((p) => p.id === props.piece.id));

  const { isDragging } = makeDraggable(
    el,
    { disabled: () => props.piece.color !== props.currentTurn },
    () => [index.value, props.pieces]
  );
</script>
```

## Droppable cell — identifying the dragged piece

`suggestRemove()` extracts the dragged piece from the source `pieces` array without mutating state. The cell then emits the attempted move upward:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const props = defineProps<{ row: number; col: number; piece: Piece | null; pieces: Piece[] }>();
  const emit = defineEmits<{ move: [{ piece: Piece; toRow: number; toCol: number }] }>();

  const el = useTemplateRef<HTMLElement>('el');

  makeDroppable(
    el,
    {
      events: {
        onDrop(e) {
          const r = e.helpers.suggestRemove();
          if (!r?.removedItems.length) return;
          const piece = r.removedItems[0] as Piece;
          emit('move', { piece, toRow: props.row, toCol: props.col });
        },
      },
    },
    () => (props.piece ? [props.piece] : [])
  );
</script>
```

::: tip Why `suggestRemove`?
The draggable's payload is `[index, pieces]`, so `suggestRemove()` returns `removedItems[0]` — the actual piece object — without needing a separate `data` field or any extra state.
:::

## Game logic

All validation and state mutation happens in a single `handleMove` function. The library only delivers "what was dropped where" — the rest is plain TypeScript:

```ts
function handleMove({ piece, toRow, toCol }) {
  const { ok, capturedId } = validateMove(piece, toRow, toCol);
  if (!ok) return;

  const isKing =
    piece.isKing ||
    (piece.color === 'red' && toRow === 0) ||
    (piece.color === 'black' && toRow === 7);

  pieces.value = pieces.value
    .filter((p) => p.id !== capturedId)
    .map((p) => (p.id === piece.id ? { ...p, row: toRow, col: toCol, isKing } : p));

  currentTurn.value = currentTurn.value === 'red' ? 'black' : 'red';
}
```

## See also

- [Sorting Lists](/v2/examples/sorting-lists) — list-based drag and drop with `suggestSort`.
- [DragPreview](/v2/guide/core/drag-preview) — customizing the floating preview.

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Checkers/Example.vue)
- [CheckersGame.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Checkers/CheckersGame.vue)
- [CheckerCell.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Checkers/CheckerCell.vue)
- [CheckerPiece.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Checkers/CheckerPiece.vue)
- [types.ts](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Checkers/types.ts)
