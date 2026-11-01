<script setup lang="ts">
import { computed, inject, nextTick, useId, useTemplateRef, watch } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Square from './Square.vue';
import PieceArt from './PieceArt.vue';
import PromotionPicker from './PromotionPicker.vue';
import Tray from './Tray.vue';
import { SQUARES, VALUES, type Color, type Piece } from './chess';
import { GAME } from './game';
import { glide } from './glide';
import { useAutoplay } from './autoplay';

const game = inject(GAME)!;
const { position, history, result, check, vsBot, replay, planned, promoting, choice } = game;
const root = useTemplateRef<HTMLElement>('root');
const board = useTemplateRef<HTMLElement>('board');
const autoplay = useAutoplay(game, root);
const { status, active, over } = useDnD();

const NAME = { w: 'White', b: 'Black' } as const;
const headline = computed(() => {
  const turn = position.value.turn;
  if (promoting.value) return 'Pick a piece · Esc to cancel';
  if (replay.value.length) return `Replay · ${replay.value.length} to go`;
  if (result.value === 'checkmate') return `Checkmate · ${NAME[turn === 'w' ? 'b' : 'w']} wins`;
  if (result.value === 'stalemate') return 'Stalemate · Draw';
  if (result.value === 'material') return 'Draw · Nobody can mate';
  if (check.value) return `Check · ${NAME[turn]} to move`;
  return vsBot.value && turn === 'b' ? 'The bot is thinking…' : `${NAME[turn]} to move`;
});

/** What each side has taken, the biggest first, and its lead in material. */
const taken = (color: Color) =>
  history.value
    .flatMap((turn) => (turn.captured && turn.captured.color !== color ? [turn.captured] : []))
    .sort((a, b) => VALUES[b.kind] - VALUES[a.kind]);
const score = (color: Color) => taken(color).reduce((sum, piece) => sum + VALUES[piece.kind], 0);
const lead = (color: Color) => score(color) - score(color === 'w' ? 'b' : 'w');

// An arrow from the piece's square to the square under it, in the board's 8×8 units.
const point = (square: string) => ({ x: 'abcdefgh'.indexOf(square[0]!) + 0.5, y: 8.5 - Number(square[1]) });
const arrow = computed(() => {
  const from = (active.value?.data as Piece | undefined)?.square;
  const to = over.value ? String(over.value.id) : null;
  // Code moves show theirs only once on target.
  if (!from || !to || from === to || (planned.value && !over.value!.accepted)) return null;
  return { from: point(from), to: point(to), legal: over.value!.accepted };
});
const head = useId();

// Buttons wait for the board to be still: no drag, no landing, no move played by code.
const busy = computed(() => status.value !== 'idle' || !!planned.value || !!replay.value.length);
// Undo and a new game glide the pieces to their squares, out of the trays too.
const undo = () => glide(root.value, game.undo);
const reset = () => glide(root.value, game.reset);

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
  <div ref="root" class="chess">
    <div ref="board" class="board">
      <Square v-for="square in SQUARES" :key="square" :square="square" />
      <svg v-if="arrow" class="arrow" :class="{ legal: arrow.legal }" viewBox="0 0 8 8" aria-hidden="true">
        <defs>
          <marker :id="head" viewBox="0 0 4 4" refX="2" refY="2" markerWidth="2.6" markerHeight="2.6" orient="auto">
            <path d="M0 0 4 2 0 4z" />
          </marker>
        </defs>
        <line :x1="arrow.from.x" :y1="arrow.from.y" :x2="arrow.to.x" :y2="arrow.to.y" :marker-end="`url(#${head})`" />
      </svg>
      <PromotionPicker
        v-if="promoting"
        :key="promoting"
        v-model:choice="choice"
        :square="promoting"
        @answer="game.answerPromotion"
      />
    </div>

    <aside class="side">
      <div v-for="color in ['b', 'w'] as const" :key="color" class="player" :class="[color, { turn: !result && position.turn === color }]">
        <span class="avatar"><PieceArt kind="K" :color="color" /></span>
        <strong>{{ NAME[color] }}</strong>
        <button
          v-if="color === 'b'"
          type="button"
          class="bot"
          :aria-pressed="vsBot"
          title="Black is played by a bot"
          @click="vsBot = !vsBot"
        >
          Bot
        </button>
        <span class="captures">
          <Tray :pieces="taken(color)" :board="board" />
          <small v-if="lead(color) > 0">+{{ lead(color) }}</small>
        </span>
      </div>

      <p class="status" :class="{ alert: check || result }">{{ headline }}</p>

      <ol ref="list" class="moves">
        <li v-for="(pair, i) in moves" :key="i" :class="{ latest: i === moves.length - 1 }">
          <span class="number">{{ i + 1 }}.</span>
          <span v-for="turn in pair" :key="turn.san + turn.to">{{ turn.san }}</span>
        </li>
        <li v-if="!moves.length" class="empty">Drag a white piece to start.</li>
      </ol>

      <div class="buttons">
        <button type="button" :disabled="busy || !history.length" @click="undo">Undo</button>
        <button v-if="replay.length" type="button" @click="autoplay.stop">Stop</button>
        <button v-else type="button" :disabled="busy || !history.length" @click="autoplay.replay">Replay</button>
        <button type="button" class="primary" :disabled="busy" @click="reset">New game</button>
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
  position: relative;
  display: grid;
  flex: 1 1 300px;
  grid-template: repeat(8, 1fr) / repeat(8, 1fr);
  max-width: 440px;
  aspect-ratio: 1;
  border-radius: 10px;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 0.15),
    0 24px 48px -20px rgb(0 0 0 / 0.55);
}

/* Rounded corner squares, not a clipped board: pieces fly in and out of it. */
.board > :nth-child(1) {
  border-top-left-radius: 10px;
}

.board > :nth-child(8) {
  border-top-right-radius: 10px;
}

.board > :nth-child(57) {
  border-bottom-left-radius: 10px;
}

.board > :nth-child(64) {
  border-bottom-right-radius: 10px;
}

.arrow {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  color: rgb(255 59 48 / 0.75);
  pointer-events: none;
}

.arrow.legal {
  color: rgb(255 170 0 / 0.8);
}

.arrow line {
  stroke: currentColor;
  stroke-width: 0.16;
  stroke-linecap: round;
}

.arrow path {
  fill: currentColor;
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
  grid-template-columns: auto 1fr auto;
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

.bot {
  padding: 3px 8px;
  border: 0;
  border-radius: 99px;
  background: none;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 20%, transparent);
  color: inherit;
  font: 600 11px/1.2 system-ui, sans-serif;
  opacity: 0.6;
  cursor: pointer;
}

.bot[aria-pressed='true'] {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1px #42b883;
  color: #42b883;
  opacity: 1;
}

.captures {
  display: flex;
  grid-column: 2 / -1;
  align-items: center;
  min-height: 18px;
}

.captures small {
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.buttons button {
  padding: 8px 10px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

.buttons button.primary {
  grid-column: 1 / -1;
  background: #42b883;
  color: #fff;
}

.buttons button:disabled {
  opacity: 0.45;
  cursor: default;
}
</style>
