<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';
  import type { Piece, Color, PieceType } from './types';
  import ChessCell from './ChessCell.vue';

  // ─── DnD state ───────────────────────────────────────────────────────────────

  const { state, entities } = useDnDProvider();

  const draggingPiece = computed<Piece | null>(() => {
    if (state.value !== 'dragging') return null;
    const [node] = entities.draggingMap.keys();
    if (!node) return null;
    return (entities.draggableMap.get(node)?.data?.() as Piece) ?? null;
  });

  // ─── Game state ───────────────────────────────────────────────────────────────

  const pieces = ref<Piece[]>([]);
  const currentTurn = ref<Color>('white');
  const winner = ref<Color | 'draw' | null>(null);

  const ROWS = Array.from({ length: 8 }, (_, i) => i);
  const COLS = Array.from({ length: 8 }, (_, i) => i);

  onMounted(() => {
    pieces.value = initPieces();
  });

  function initPieces(): Piece[] {
    const list: Piece[] = [];
    let id = 0;
    const backRank: PieceType[] = [
      'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
    ];

    // Black back rank (row 0)
    backRank.forEach((type, col) => {
      list.push({ id: id++, row: 0, col, type, color: 'black', hasMoved: false });
    });
    // Black pawns (row 1)
    for (let col = 0; col < 8; col++) {
      list.push({ id: id++, row: 1, col, type: 'pawn', color: 'black', hasMoved: false });
    }
    // White pawns (row 6)
    for (let col = 0; col < 8; col++) {
      list.push({ id: id++, row: 6, col, type: 'pawn', color: 'white', hasMoved: false });
    }
    // White back rank (row 7)
    backRank.forEach((type, col) => {
      list.push({ id: id++, row: 7, col, type, color: 'white', hasMoved: false });
    });

    return list;
  }

  // ─── Board helpers ────────────────────────────────────────────────────────────

  function pieceAt(row: number, col: number, board?: Piece[]): Piece | null {
    return (board ?? pieces.value).find((p) => p.row === row && p.col === col) ?? null;
  }

  function isPathClear(piece: Piece, toRow: number, toCol: number, board: Piece[]): boolean {
    const dr = toRow - piece.row;
    const dc = toCol - piece.col;
    const rowDir = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const colDir = dc === 0 ? 0 : dc > 0 ? 1 : -1;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    for (let s = 1; s < steps; s++) {
      if (pieceAt(piece.row + s * rowDir, piece.col + s * colDir, board)) return false;
    }
    return true;
  }

  // ─── Move validation (ignores check) ─────────────────────────────────────────

  function canReach(piece: Piece, toRow: number, toCol: number, board: Piece[]): boolean {
    const target = pieceAt(toRow, toCol, board);
    if (target && target.color === piece.color) return false;

    const dr = toRow - piece.row;
    const dc = toCol - piece.col;
    if (dr === 0 && dc === 0) return false;

    switch (piece.type) {
      case 'pawn': {
        const dir = piece.color === 'white' ? -1 : 1;
        // Forward 1
        if (dc === 0 && dr === dir && !target) return true;
        // Forward 2 from start
        if (
          dc === 0 &&
          dr === 2 * dir &&
          !piece.hasMoved &&
          !target &&
          !pieceAt(piece.row + dir, piece.col, board)
        )
          return true;
        // Diagonal capture
        if (Math.abs(dc) === 1 && dr === dir && target && target.color !== piece.color) return true;
        return false;
      }
      case 'knight':
        return (
          (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
          (Math.abs(dr) === 1 && Math.abs(dc) === 2)
        );
      case 'bishop':
        return Math.abs(dr) === Math.abs(dc) && isPathClear(piece, toRow, toCol, board);
      case 'rook':
        return (dr === 0 || dc === 0) && isPathClear(piece, toRow, toCol, board);
      case 'queen':
        return (
          (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) &&
          isPathClear(piece, toRow, toCol, board)
        );
      case 'king': {
        // Normal king move
        if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) return true;
        // Castling: king hasn't moved, moves exactly 2 squares horizontally
        if (dr !== 0 || Math.abs(dc) !== 2 || piece.hasMoved) return false;
        const colDir = dc > 0 ? 1 : -1;
        const rookCol = dc > 0 ? 7 : 0;
        const rook = pieceAt(piece.row, rookCol, board);
        if (!rook || rook.type !== 'rook' || rook.color !== piece.color || rook.hasMoved)
          return false;
        // Path between king and rook must be clear
        const minCol = Math.min(piece.col, rookCol);
        const maxCol = Math.max(piece.col, rookCol);
        for (let c = minCol + 1; c < maxCol; c++)
          if (pieceAt(piece.row, c, board)) return false;
        return true;
      }
    }
  }

  // ─── Check detection ──────────────────────────────────────────────────────────

  function isInCheck(color: Color, board: Piece[]): boolean {
    const king = board.find((p) => p.color === color && p.type === 'king');
    if (!king) return false;
    const opponent = color === 'white' ? 'black' : 'white';
    return board.some((p) => p.color === opponent && canReach(p, king.row, king.col, board));
  }

  function wouldBeInCheck(piece: Piece, toRow: number, toCol: number): boolean {
    const simBoard = pieces.value
      .filter((p) => p.id !== piece.id && !(p.row === toRow && p.col === toCol))
      .concat([{ ...piece, row: toRow, col: toCol, hasMoved: true }]);
    return isInCheck(piece.color, simBoard);
  }

  // ─── Full move validation ─────────────────────────────────────────────────────

  function validateMove(piece: Piece, toRow: number, toCol: number): boolean {
    if (piece.color !== currentTurn.value) return false;
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    if (!canReach(piece, toRow, toCol, pieces.value)) return false;

    // Castling extra checks: can't castle while in check or through an attacked square
    if (piece.type === 'king' && Math.abs(toCol - piece.col) === 2) {
      if (isInCheck(piece.color, pieces.value)) return false;
      const colDir = toCol > piece.col ? 1 : -1;
      const passThroughBoard = pieces.value
        .filter((p) => p.id !== piece.id)
        .concat([{ ...piece, col: piece.col + colDir }]);
      if (isInCheck(piece.color, passThroughBoard)) return false;
    }

    if (wouldBeInCheck(piece, toRow, toCol)) return false;
    return true;
  }

  function hasLegalMoves(color: Color): boolean {
    for (const p of pieces.value.filter((p) => p.color === color)) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const t = pieceAt(r, c);
          if (t && t.color === color) continue;
          if (canReach(p, r, c, pieces.value) && !wouldBeInCheck(p, r, c)) return true;
        }
      }
    }
    return false;
  }

  // ─── Computed highlights ──────────────────────────────────────────────────────

  const validTargets = computed<Set<string>>(() => {
    const p = draggingPiece.value;
    if (!p) return new Set();
    const targets = new Set<string>();
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++)
        if (validateMove(p, r, c)) targets.add(`${r},${c}`);
    return targets;
  });

  const checkedKingPos = computed<string | null>(() => {
    if (winner.value) return null;
    const king = pieces.value.find((p) => p.color === currentTurn.value && p.type === 'king');
    if (!king) return null;
    return isInCheck(currentTurn.value, pieces.value) ? `${king.row},${king.col}` : null;
  });

  // ─── Apply move ───────────────────────────────────────────────────────────────

  function handleMove({ piece, toRow, toCol }: { piece: Piece; toRow: number; toCol: number }) {
    if (!validateMove(piece, toRow, toCol)) return;

    // Pawn promotion → auto-queen
    const promoted =
      piece.type === 'pawn' &&
      ((piece.color === 'white' && toRow === 0) || (piece.color === 'black' && toRow === 7));

    // Castling: also move the rook
    const isCastling = piece.type === 'king' && Math.abs(toCol - piece.col) === 2;
    const colDir = toCol > piece.col ? 1 : -1;
    const rookFromCol = colDir > 0 ? 7 : 0;
    const rookToCol = toCol - colDir; // rook lands on the other side of the king

    pieces.value = pieces.value
      .filter((p) => !(p.row === toRow && p.col === toCol && p.id !== piece.id))
      .map((p) => {
        if (p.id === piece.id)
          return { ...p, row: toRow, col: toCol, hasMoved: true, type: promoted ? 'queen' : p.type };
        if (isCastling && p.row === piece.row && p.col === rookFromCol && p.type === 'rook')
          return { ...p, col: rookToCol, hasMoved: true };
        return p;
      });

    const opponent: Color = currentTurn.value === 'white' ? 'black' : 'white';

    if (!hasLegalMoves(opponent)) {
      winner.value = isInCheck(opponent, pieces.value) ? currentTurn.value : 'draw';
      return;
    }

    currentTurn.value = opponent;
  }

  function reset() {
    pieces.value = initPieces();
    currentTurn.value = 'white';
    winner.value = null;
  }
</script>

<template>
  <div class="game">
    <!-- Status -->
    <div class="status">
      <template v-if="winner">
        <span class="winner-text">
          {{ winner === 'draw' ? 'Stalemate — Draw!' : `${winner === 'white' ? 'White' : 'Black'} wins!` }}
        </span>
        <button
          class="reset-btn"
          @click="reset"
        >
          New game
        </button>
      </template>
      <template v-else>
        <span
          class="turn"
          :class="currentTurn"
        >
          {{ currentTurn === 'white' ? 'White' : 'Black' }}'s turn
        </span>
        <span
          v-if="checkedKingPos"
          class="check-badge"
        >
          Check!
        </span>
      </template>
    </div>

    <!-- Board -->
    <div class="board">
      <!-- File labels top -->
      <div class="labels-row">
        <div
          v-for="col in COLS"
          :key="col"
          class="label-cell"
        >
          {{ String.fromCharCode(97 + col) }}
        </div>
      </div>

      <div class="board-inner">
        <!-- Rank labels + rows -->
        <div
          v-for="row in ROWS"
          :key="row"
          class="board-row"
        >
          <div class="rank-label">{{ 8 - row }}</div>
          <ChessCell
            v-for="col in COLS"
            :key="col"
            :row="row"
            :col="col"
            :piece="pieceAt(row, col)"
            :pieces="pieces"
            :is-valid-target="validTargets.has(`${row},${col}`)"
            :is-in-check="checkedKingPos === `${row},${col}`"
            @move="handleMove"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .game {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    min-height: 2rem;
  }

  .turn {
    padding: 0.25rem 0.875rem;
    border-radius: 999px;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
  }

  .turn.white {
    background: rgba(240, 217, 181, 0.25);
    color: var(--vp-c-text-1);
    border: 1px solid rgba(240, 217, 181, 0.5);
  }

  .turn.black {
    background: rgba(113, 128, 150, 0.15);
    color: var(--vp-c-text-1);
    border: 1px solid rgba(113, 128, 150, 0.35);
  }

  .check-badge {
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    background: rgba(220, 38, 38, 0.15);
    color: #f87171;
    border: 1px solid rgba(220, 38, 38, 0.4);
    animation: pulse 0.8s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    from { opacity: 0.7; }
    to { opacity: 1; }
  }

  .winner-text {
    font-size: 1rem;
    font-weight: 700;
    color: var(--vp-c-brand-1);
  }

  .reset-btn {
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(148, 163, 184, 0.1);
    color: var(--vp-c-text-1);
    font-size: 0.8rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .reset-btn:hover {
    background: rgba(148, 163, 184, 0.2);
  }

  .board {
    border: 4px solid #3d2b1f;
    border-radius: 4px;
    overflow: hidden;
    box-shadow:
      0 0 0 2px #7c5a3e,
      0 12px 40px rgba(0, 0, 0, 0.5);
    background: #3d2b1f;
  }

  .labels-row {
    display: flex;
    padding-left: 22px;
  }

  .label-cell {
    width: 60px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(240, 217, 181, 0.6);
    font-family: monospace;
  }

  .board-inner {
    display: flex;
    flex-direction: column;
  }

  .board-row {
    display: flex;
    align-items: center;
  }

  .rank-label {
    width: 22px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(240, 217, 181, 0.6);
    font-family: monospace;
  }

  @media (max-width: 520px) {
    .label-cell {
      width: 40px;
    }

    .rank-label {
      width: 16px;
      height: 40px;
      font-size: 0.55rem;
    }

    .labels-row {
      padding-left: 16px;
    }
  }
</style>
