<script setup lang="ts">
import { computed, nextTick, provide, useTemplateRef, watch } from 'vue';
import Square from './Square.vue';
import PieceArt from './PieceArt.vue';
import { SQUARES, VALUES, type Color } from './chess';
import { GAME, createGame } from './game';

const game = createGame();
provide(GAME, game);
const { position, history, result, check } = game;

const NAME = { w: 'White', b: 'Black' } as const;
const status = computed(() => {
  const turn = position.value.turn;
  if (result.value === 'checkmate') return `Checkmate · ${NAME[turn === 'w' ? 'b' : 'w']} wins`;
  if (result.value === 'stalemate') return 'Stalemate · Draw';
  return check.value ? `Check · ${NAME[turn]} to move` : `${NAME[turn]} to move`;
});

/** What each side has taken, the biggest first, and its lead in material. */
const taken = (color: Color) =>
  history.value
    .flatMap((turn) => (turn.captured && turn.captured.color !== color ? [turn.captured] : []))
    .sort((a, b) => VALUES[b.kind] - VALUES[a.kind]);
const score = (color: Color) => taken(color).reduce((sum, piece) => sum + VALUES[piece.kind], 0);
const lead = (color: Color) => score(color) - score(color === 'w' ? 'b' : 'w');

const moves = computed(() =>
  Array.from({ length: Math.ceil(history.value.length / 2) }, (_, i) => history.value.slice(i * 2, i * 2 + 2)),
);
const list = useTemplateRef<HTMLElement>('list');
watch(history, async () => {
  await nextTick();
  list.value?.scrollTo({ top: list.value.scrollHeight, behavior: 'smooth' });
});
</script>

<template>
  <div class="chess">
    <div class="board">
      <Square v-for="square in SQUARES" :key="square" :square="square" />
    </div>

    <aside class="side">
      <div v-for="color in ['b', 'w'] as const" :key="color" class="player" :class="[color, { turn: !result && position.turn === color }]">
        <span class="avatar"><PieceArt kind="K" :color="color" /></span>
        <strong>{{ NAME[color] }}</strong>
        <span class="taken">
          <PieceArt v-for="piece in taken(color)" :key="piece.id" :kind="piece.kind" :color="piece.color" />
          <small v-if="lead(color) > 0">+{{ lead(color) }}</small>
        </span>
      </div>

      <p class="status" :class="{ alert: check || result }">{{ status }}</p>

      <ol ref="list" class="moves">
        <li v-for="(pair, i) in moves" :key="i" :class="{ latest: i === moves.length - 1 }">
          <span class="number">{{ i + 1 }}.</span>
          <span v-for="turn in pair" :key="turn.san + turn.to">{{ turn.san }}</span>
        </li>
        <li v-if="!moves.length" class="empty">Drag a white piece to start.</li>
      </ol>

      <div class="buttons">
        <button type="button" :disabled="!history.length" @click="game.undo">Undo</button>
        <button type="button" class="primary" @click="game.reset">New game</button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.chess {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

/* As wide as there is room for next to the panel; on a phone the panel goes below. */
.board {
  display: grid;
  flex: 1 1 300px;
  grid-template: repeat(8, 1fr) / repeat(8, 1fr);
  max-width: 440px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 10px;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 0.15),
    0 24px 48px -20px rgb(0 0 0 / 0.55);
}

.side {
  display: flex;
  flex: 1 1 190px;
  flex-direction: column;
  gap: 10px;
  max-width: 220px;
  min-height: 0;
}

/* Black on top, White at the bottom, as the board is seen. */
.player {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 2px 10px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.player.w {
  order: 3;
}

.player.turn {
  border-color: #42b883;
  box-shadow: 0 0 0 3px color-mix(in srgb, #42b883 18%, transparent);
}

.avatar {
  grid-row: span 2;
  width: 34px;
  height: 34px;
  padding: 3px;
  box-sizing: border-box;
  border-radius: 9px;
  background: #789a5b;
}

.player strong {
  font-size: 13px;
}

.taken {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 18px;
}

/* Outlined in the text colour: black pieces stay visible on a dark page. */
.taken .art {
  width: 16px;
  height: 16px;
  margin-right: -4px;
  filter: drop-shadow(0 0 1px color-mix(in srgb, currentColor 70%, transparent));
}

.taken small {
  margin-left: 8px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.status {
  order: 1;
  margin: 0;
  padding: 7px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  font: 600 12px/1.3 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
}

.status.alert {
  background: color-mix(in srgb, #ff3b30 16%, transparent);
  color: #ff5a4f;
}

.moves {
  order: 2;
  flex: 1;
  min-height: 120px;
  max-height: 228px;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  list-style: none;
}

.moves li {
  display: grid;
  grid-template-columns: 28px 1fr 1fr;
  padding: 6px;
  border-radius: 6px;
}

.moves li:nth-child(even) {
  background: color-mix(in srgb, currentColor 4%, transparent);
}

.moves .latest span:last-child {
  color: #42b883;
  font-weight: 600;
}

.moves .number {
  opacity: 0.45;
}

.moves .empty {
  display: block;
  padding: 18px 8px;
  font-family: inherit;
  text-align: center;
  opacity: 0.5;
}

.buttons {
  order: 4;
  display: flex;
  gap: 6px;
}

.buttons button {
  flex: 1;
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

.buttons button.primary {
  background: #42b883;
  color: #fff;
}

.buttons button:disabled {
  opacity: 0.45;
  cursor: default;
}
</style>
