import { computed, ref, shallowRef, type InjectionKey } from 'vue';
import type { Key } from '@vue-dnd-kit/core';
import { inCheck, isLastRank, legalMoves, newGame, outcome, play, takes, whyNot, type Kind, type Piece, type Position } from './chess';

export interface Turn {
  san: string;
  /** The piece that moved, from where to where: a replay plays it again. */
  id: string;
  from: string;
  to: string;
  promotion: Kind | null;
  captured: Piece | null;
  /** The position before the move: undo goes back to it. */
  before: Position;
}

/** A move that code plays with a drag: the bot's, a replay's, the rook's step of a castling. */
export interface Plan {
  id: string;
  to: string;
  promotion?: Kind | null;
}

/** What a promotion question answers to the square's `onBeforeDrop`. */
export type PromotionAnswer = 'accept' | 'reject' | 'continue';

/** The game's state, shared with the board, the squares, the pieces and their overlays. */
export function createGame() {
  const position = shallowRef(newGame());
  const history = shallowRef<Turn[]>([]);
  /** Black is played by the bot. */
  const vsBot = ref(false);
  /** The moves a replay has still to play. */
  const replay = shallowRef<Plan[]>([]);
  /** The move code is playing right now, from its pause before the drag to the drop. */
  const planned = shallowRef<Plan | null>(null);

  const result = computed(() => outcome(position.value));
  const last = computed(() => history.value.at(-1) ?? null);
  /** The square of the king in check. */
  const check = computed(() => {
    const { pieces, turn } = position.value;
    return inCheck(position.value, turn) ? pieces.find((piece) => piece.kind === 'K' && piece.color === turn)!.square : null;
  });
  /** Your hands may pick a piece up: not while code plays, nor the bot's pieces. */
  const yourTurn = computed(
    () => !planned.value && !replay.value.length && !position.value.rookStep && !(vsBot.value && position.value.turn === 'b'),
  );

  const pieceAt = (square: string) => position.value.pieces.find((piece) => piece.square === square);
  const canMove = (id: Key, to: string) => legalMoves(position.value, String(id)).has(to);
  const promotes = (id: Key, to: string) =>
    isLastRank(to) && position.value.pieces.find((piece) => piece.id === id)?.kind === 'P';

  // ─── Promotion ───────────────────────────────────────────────────────────────

  /** The square a pawn waits on while you pick its new piece; the picker shows. */
  const promoting = shallowRef<string | null>(null);
  /** The piece picked, or pointed at in the picker: the overlay shows it, the move makes it. */
  const choice = ref<Kind>('Q');
  let reply: ((answer: PromotionAnswer) => void) | null = null;

  /** Asks which piece the pawn becomes. The square's `onBeforeDrop` returns this promise. */
  const askPromotion = (square: string): Promise<PromotionAnswer> => {
    choice.value = planned.value?.promotion ?? 'Q';
    // A move played by code brings its choice along.
    if (planned.value) return Promise.resolve('accept');
    promoting.value = square;
    return new Promise((resolve) => (reply = resolve));
  };

  /** The picker's answer: a piece, or `'reject'` (the pawn flies back), or `'continue'` (keep dragging). */
  const answerPromotion = (answer: Kind | 'reject' | 'continue') => {
    if (answer !== 'reject' && answer !== 'continue') choice.value = answer;
    promoting.value = null;
    reply?.(answer === 'reject' || answer === 'continue' ? answer : 'accept');
    reply = null;
  };

  // ─── Moves ───────────────────────────────────────────────────────────────────

  const move = (id: string, to: string) => {
    const before = position.value;
    const from = before.pieces.find((piece) => piece.id === id)!.square;
    const promotion = promotes(id, to) ? choice.value : null;
    const { next, captured, san } = play(before, id, to, promotion ?? undefined);
    position.value = next;
    // The rook's step ends a castling, which the king's step has written down.
    if (before.rookStep) return;
    history.value = [...history.value, { san, id, from, to, promotion, captured, before }];
  };

  const undo = () => {
    const turn = history.value.at(-1);
    if (!turn) return;
    position.value = turn.before;
    history.value = history.value.slice(0, -1);
    // Against the bot, your move goes back with its answer.
    if (vsBot.value && position.value.turn === 'b') undo();
  };

  const reset = () => {
    position.value = newGame();
    history.value = [];
  };

  return {
    position,
    history,
    vsBot,
    replay,
    planned,
    result,
    last,
    check,
    yourTurn,
    pieceAt,
    canMove,
    promotes,
    takes: (id: Key, to: string) => takes(position.value, String(id), to),
    whyNot: (id: Key, to: string) => whyNot(position.value, String(id), to),
    promoting,
    choice,
    askPromotion,
    answerPromotion,
    move,
    undo,
    reset,
  };
}

export type Game = ReturnType<typeof createGame>;
export const GAME: InjectionKey<Game> = Symbol('game');
