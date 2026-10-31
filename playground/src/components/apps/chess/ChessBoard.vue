<script setup lang="ts">
  import { computed, provide, ref, shallowRef } from 'vue';
  import { useDnD } from '@vue-dnd-kit/core';
  import ChessSquare from './ChessSquare.vue';
  import { CHESS, GLYPHS, SQUARES, createPieces, legalMoves, placement, type Color, type Piece } from './chess';

  const pieces = ref<Piece[]>(createPieces());
  const turn = shallowRef<Color>('w');
  const moves = ref<string[]>([]);
  const captured = ref<Piece[]>([]);
  const winner = shallowRef<Color | null>(null);

  const pieceAt = (square: string) => pieces.value.find((piece) => piece.square === square);

  // Legal squares come straight from the drag state: whatever piece is held right now.
  const { active } = useDnD();
  const held = computed(() => pieces.value.find((piece) => piece.id === active.value?.id) ?? null);
  const legal = computed(() => (held.value ? legalMoves(held.value, pieceAt) : new Set<string>()));

  const move = (pieceId: string, to: string) => {
    const piece = pieces.value.find((item) => item.id === pieceId);
    if (!piece) return;
    const from = piece.square;
    const target = pieceAt(to);
    if (target) {
      captured.value.push(target);
      pieces.value = pieces.value.filter((item) => item !== target);
    }
    piece.square = to;
    // Reaching the last rank: always a queen.
    if (piece.kind === 'P' && (to[1] === '8' || to[1] === '1')) piece.kind = 'Q';
    moves.value.push(`${from}${target ? 'x' : '-'}${to}`);
    if (target?.kind === 'K') winner.value = piece.color;
    else turn.value = turn.value === 'w' ? 'b' : 'w';
  };

  const reset = () => {
    pieces.value = createPieces();
    turn.value = 'w';
    moves.value = [];
    captured.value = [];
    winner.value = null;
  };

  provide(CHESS, {
    pieceAt,
    legal,
    source: computed(() => held.value?.square ?? null),
    turn,
    over: computed(() => winner.value !== null),
    move,
  });

  const name = (color: Color) => (color === 'w' ? 'White' : 'Black');
  const status = computed(() => (winner.value ? `${name(winner.value)} wins` : `${name(turn.value)} to move`));
  const takenBy = (color: Color) => captured.value.filter((piece) => piece.color !== color);
  const fullMoves = computed(() =>
    Array.from({ length: Math.ceil(moves.value.length / 2) }, (_, index) => moves.value.slice(index * 2, index * 2 + 2)),
  );
</script>

<template>
  <div class="ch">
    <div class="ch-board-wrap">
      <div class="ch-ranks">
        <span
          v-for="rank in 8"
          :key="rank"
          >{{ 9 - rank }}</span
        >
      </div>
      <div
        class="ch-board"
        data-testid="chessboard"
      >
        <ChessSquare
          v-for="square in SQUARES"
          :key="square"
          :square="square"
        />
      </div>
      <div class="ch-files">
        <span
          v-for="file in 'abcdefgh'"
          :key="file"
          >{{ file }}</span
        >
      </div>
    </div>
    <aside class="ch-side">
      <p
        class="ch-status"
        :class="{ done: winner }"
        data-testid="chess-status"
      >
        {{ status }}
      </p>
      <div
        v-for="color in ['w', 'b'] as const"
        :key="color"
        class="ch-taken"
        :data-testid="`taken-${color}`"
      >
        <small>{{ name(color) }} took</small>
        <span
          v-for="piece in takenBy(color)"
          :key="piece.id"
          :class="piece.color === 'w' ? 'white' : 'black'"
          >{{ GLYPHS[piece.kind] }}</span
        >
      </div>
      <ol
        class="ch-moves"
        data-testid="chess-moves"
      >
        <li
          v-for="(pair, index) in fullMoves"
          :key="index"
        >
          {{ pair.join(' ') }}
        </li>
      </ol>
      <button
        type="button"
        data-testid="new-game"
        @click="reset"
      >
        New game
      </button>
    </aside>
  </div>
  <pre data-testid="chess-fen">{{ placement(pieces) }} {{ turn }}</pre>
</template>

<style scoped>
  .ch {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .ch-board-wrap {
    display: grid;
    grid-template-columns: 20px 512px;
    grid-template-rows: 512px 20px;
  }

  .ch-board {
    display: grid;
    grid-template-columns: repeat(8, 64px);
    grid-template-rows: repeat(8, 64px);
    overflow: hidden;
    border-radius: var(--ui-radius);
    box-shadow:
      0 0 0 1px var(--ui-border-accented),
      var(--ui-shadow-overlay);
  }

  .ch-ranks {
    display: grid;
    grid-template-rows: repeat(8, 64px);
    align-items: center;
    color: var(--ui-text-dimmed);
    font-family: var(--font-mono);
    font-size: 12px;
  }

  .ch-files {
    grid-column: 2;
    display: grid;
    grid-template-columns: repeat(8, 64px);
    color: var(--ui-text-dimmed);
    font-family: var(--font-mono);
    font-size: 12px;
    text-align: center;
  }

  .ch-side {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 240px;
  }

  .ch-status {
    margin: 0;
    padding: 8px 12px;
    border-radius: var(--ui-radius);
    background: var(--ui-surface);
    box-shadow: inset 0 0 0 1px var(--ui-border-accented);
    color: var(--ui-text-highlighted);
    font-weight: 600;
  }

  .ch-status.done {
    background: var(--ui-primary-soft);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-primary) 50%, transparent);
    color: var(--ui-primary);
  }

  .ch-taken {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    min-height: 28px;
    font: 22px/1 'Segoe UI Symbol', 'DejaVu Sans', serif;
  }

  .ch-taken small {
    width: 100%;
    color: var(--ui-text-muted);
    font: 12px var(--font-sans);
  }

  /* The pieces keep their colors; an outline in the page's text color keeps them on any page. */
  .ch-taken .white {
    color: #fff;
    text-shadow:
      0 0 1px #1f2937,
      0 0 1px #1f2937;
  }

  .ch-taken .black {
    color: #1f2937;
    text-shadow:
      0 0 1px var(--ui-text-dimmed),
      0 0 1px var(--ui-text-dimmed);
  }

  .ch-moves {
    min-height: 120px;
    max-height: 220px;
    margin: 0;
    padding: 8px 8px 8px 32px;
    overflow: auto;
    border-radius: var(--ui-radius);
    background: var(--ui-surface);
    box-shadow: inset 0 0 0 1px var(--ui-border-accented);
    color: var(--ui-text);
    font: 13px var(--font-mono);
  }

  .ch-moves li::marker {
    color: var(--ui-text-dimmed);
  }

  button {
    align-self: flex-start;
    padding: 6px 14px;
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-sm);
    background: var(--ui-bg);
    color: var(--ui-text);
    font: inherit;
    cursor: pointer;
  }

  button:hover {
    background: var(--ui-bg-elevated);
  }
</style>
