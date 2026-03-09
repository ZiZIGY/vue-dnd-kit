<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';
  import type { Piece } from './types';
  import CheckerCell from './CheckerCell.vue';

  // ─── DnD state ───────────────────────────────────────────────────────────────

  const { state, entities } = useDnDProvider();

  // Piece currently being dragged (via data: () => piece on makeDraggable)
  const draggingPiece = computed<Piece | null>(() => {
    if (state.value !== 'dragging') return null;
    const [node] = entities.draggingMap.keys();
    if (!node) return null;
    return (entities.draggableMap.get(node)?.data?.() as Piece) ?? null;
  });

  // ─── Game state ───────────────────────────────────────────────────────────────

  const pieces = ref<Piece[]>([]);
  const currentTurn = ref<'red' | 'black'>('red');
  const winner = ref<'red' | 'black' | null>(null);

  const ROWS = Array.from({ length: 8 }, (_, i) => i);
  const COLS = Array.from({ length: 8 }, (_, i) => i);

  onMounted(() => {
    pieces.value = initPieces();
  });

  function initPieces(): Piece[] {
    const list: Piece[] = [];
    let id = 0;
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 8; col++)
        if ((row + col) % 2 === 1)
          list.push({ id: id++, row, col, color: 'black', isKing: false });
    for (let row = 5; row < 8; row++)
      for (let col = 0; col < 8; col++)
        if ((row + col) % 2 === 1)
          list.push({ id: id++, row, col, color: 'red', isKing: false });
    return list;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const pieceAt = (row: number, col: number): Piece | null =>
    pieces.value.find((p) => p.row === row && p.col === col) ?? null;

  const redCount = computed(() => pieces.value.filter((p) => p.color === 'red').length);
  const blackCount = computed(() => pieces.value.filter((p) => p.color === 'black').length);

  // ─── Move validation ─────────────────────────────────────────────────────────

  function validateMove(
    piece: Piece,
    toRow: number,
    toCol: number
  ): { ok: boolean; capturedId?: number } {
    if (piece.color !== currentTurn.value) return { ok: false };
    if ((toRow + toCol) % 2 === 0) return { ok: false };
    if (pieceAt(toRow, toCol)) return { ok: false };

    const dr = toRow - piece.row;
    const dc = toCol - piece.col;
    if (Math.abs(dc) !== Math.abs(dr)) return { ok: false };

    const steps = Math.abs(dr);
    const rowDir = dr > 0 ? 1 : -1;
    const colDir = dc > 0 ? 1 : -1;

    // ── Regular piece ─────────────────────────────────────────────────────────
    if (!piece.isKing) {
      const forward = piece.color === 'red' ? -1 : 1;

      if (steps === 1 && rowDir === forward) return { ok: true };

      if (steps === 2 && rowDir === forward) {
        const captured = pieceAt(piece.row + rowDir, piece.col + colDir);
        if (!captured || captured.color === piece.color) return { ok: false };
        return { ok: true, capturedId: captured.id };
      }

      return { ok: false };
    }

    // ── Flying king ───────────────────────────────────────────────────────────
    // Scan every square along the diagonal from piece to target (exclusive)
    let capturedPiece: Piece | null = null;
    let capturedStep = -1;

    for (let s = 1; s < steps; s++) {
      const mid = pieceAt(piece.row + s * rowDir, piece.col + s * colDir);
      if (!mid) continue;
      if (mid.color === piece.color) return { ok: false }; // own piece blocks
      if (capturedPiece) return { ok: false };             // two opponents in the way
      capturedPiece = mid;
      capturedStep = s;
    }

    // Simple king move — no pieces in the way
    if (!capturedPiece) return { ok: true };

    // Capture — must land at least 1 step beyond the jumped piece
    if (steps <= capturedStep) return { ok: false };
    return { ok: true, capturedId: capturedPiece.id };
  }

  // Pre-compute valid target cells while dragging
  const validTargets = computed<Set<string>>(() => {
    const p = draggingPiece.value;
    if (!p) return new Set();
    const targets = new Set<string>();
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++)
        if (validateMove(p, r, c).ok) targets.add(`${r},${c}`);
    return targets;
  });

  // ─── Apply move ───────────────────────────────────────────────────────────────

  function handleMove({ piece, toRow, toCol }: { piece: Piece; toRow: number; toCol: number }) {
    const { ok, capturedId } = validateMove(piece, toRow, toCol);
    if (!ok) return;

    const isKing =
      piece.isKing ||
      (piece.color === 'red' && toRow === 0) ||
      (piece.color === 'black' && toRow === 7);

    pieces.value = pieces.value
      .filter((p) => p.id !== capturedId)
      .map((p) => (p.id === piece.id ? { ...p, row: toRow, col: toCol, isKing } : p));

    const opponent = currentTurn.value === 'red' ? 'black' : 'red';
    if (!pieces.value.some((p) => p.color === opponent)) {
      winner.value = currentTurn.value;
      return;
    }
    currentTurn.value = opponent;
  }

  function reset() {
    pieces.value = initPieces();
    currentTurn.value = 'red';
    winner.value = null;
  }
</script>

<template>
  <div class="game">
    <!-- Status -->
    <div class="status">
      <span class="score">⚫ {{ blackCount }}</span>

      <template v-if="winner">
        <span class="winner-text">{{ winner === 'red' ? 'Red' : 'Black' }} wins!</span>
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
          {{ currentTurn === 'red' ? 'Red' : 'Black' }}'s turn
        </span>
      </template>

      <span class="score">🔴 {{ redCount }}</span>
    </div>

    <!-- Board -->
    <div class="board">
      <div
        v-for="row in ROWS"
        :key="row"
        class="board-row"
      >
        <CheckerCell
          v-for="col in COLS"
          :key="col"
          :row="row"
          :col="col"
          :piece="pieceAt(row, col)"
          :pieces="pieces"
          :is-valid-target="validTargets.has(`${row},${col}`)"
          @move="handleMove"
        />
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
    gap: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    min-height: 2rem;
  }

  .score {
    font-size: 1rem;
    min-width: 3.5rem;
    text-align: center;
  }

  .turn {
    padding: 0.25rem 0.875rem;
    border-radius: 999px;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
  }

  .turn.red {
    background: rgba(197, 48, 48, 0.15);
    color: #fc8181;
    border: 1px solid rgba(197, 48, 48, 0.35);
  }

  .turn.black {
    background: rgba(113, 128, 150, 0.15);
    color: var(--vp-c-text-1);
    border: 1px solid rgba(113, 128, 150, 0.35);
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
  }

  .board-row {
    display: flex;
  }
</style>
