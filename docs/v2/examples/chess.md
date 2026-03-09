# Chess

A fully playable chess game built on Vue DnD Kit v2. Same architecture as Checkers — every cell is an independent droppable zone, all game logic lives in plain TypeScript.

<script setup>
import Example from '@examples-v2/Chess/Example.vue';
</script>

<Example />

## How it works

```text
DnDProvider
  └── 8×8 grid of ChessCell (makeDroppable)
        └── ChessPiece (makeDraggable)  — rendered when a piece occupies the cell
```

While dragging, `useDnDProvider()` exposes the dragged piece so `ChessGame` can pre-compute all valid target squares and highlight them. Squares where the king would be in check after the move are excluded.

## Piece movement

Each piece carries its index and the shared `pieces` array as the drag payload:

```vue
<script setup lang="ts">
  import { makeDraggable } from '@vue-dnd-kit/core';

  const { isDragging } = makeDraggable(
    el,
    { data: () => props.piece },
    () => [index.value, props.pieces]
  );
</script>
```

## Move validation

`canReach` handles the geometry for each piece type. `validateMove` wraps it with a check-safety simulation:

```ts
function canReach(piece, toRow, toCol, board): boolean {
  // can't land on own piece
  const target = pieceAt(toRow, toCol, board);
  if (target?.color === piece.color) return false;

  switch (piece.type) {
    case 'pawn':   /* forward + diagonal capture */
    case 'knight': /* L-shape */
    case 'bishop': /* diagonal + path clear */
    case 'rook':   /* straight + path clear */
    case 'queen':  /* both */
    case 'king':   /* one step any direction */
  }
}

function validateMove(piece, toRow, toCol): boolean {
  if (!canReach(piece, toRow, toCol, pieces.value)) return false;
  if (wouldBeInCheck(piece, toRow, toCol)) return false;
  return true;
}
```

## Check detection

`wouldBeInCheck` simulates the board after a move and checks if the moving side's king is attacked:

```ts
function wouldBeInCheck(piece, toRow, toCol): boolean {
  const simBoard = pieces.value
    .filter((p) => p.id !== piece.id && !(p.row === toRow && p.col === toCol))
    .concat([{ ...piece, row: toRow, col: toCol }]);
  return isInCheck(piece.color, simBoard);
}

function isInCheck(color, board): boolean {
  const king = board.find((p) => p.color === color && p.type === 'king');
  const opponent = color === 'white' ? 'black' : 'white';
  return board.some((p) => p.color === opponent && canReach(p, king.row, king.col, board));
}
```

## Checkmate & stalemate

After every move the opponent's legal moves are counted. If there are none:

```ts
if (!hasLegalMoves(opponent)) {
  winner.value = isInCheck(opponent, pieces.value)
    ? currentTurn.value  // checkmate
    : 'draw';            // stalemate
}
```

## Pawn promotion

Pawns reaching the last rank are automatically promoted to a queen:

```ts
const promoted =
  piece.type === 'pawn' &&
  ((piece.color === 'white' && toRow === 0) || (piece.color === 'black' && toRow === 7));

// ...map: promoted ? 'queen' : p.type
```

## See also

- [Checkers](/v2/examples/checkers) — the same per-cell droppable pattern with simpler rules.
- [DragPreview](/v2/guide/core/drag-preview) — customizing the floating preview.

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Chess/Example.vue)
- [ChessGame.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Chess/ChessGame.vue)
- [ChessCell.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Chess/ChessCell.vue)
- [ChessPiece.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Chess/ChessPiece.vue)
- [types.ts](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Chess/types.ts)
