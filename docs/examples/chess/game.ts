import { computed, shallowRef, type InjectionKey } from 'vue';
import type { Key } from '@vue-dnd-kit/core';
import { inCheck, legalMoves, newGame, outcome, play, type Piece, type Position } from './chess';

export interface Turn {
  san: string;
  from: string;
  to: string;
  captured: Piece | null;
  /** The position before the move: undo goes back to it. */
  before: Position;
}

/** The game's state, shared with the squares and the pieces. */
export function createGame() {
  const position = shallowRef(newGame());
  const history = shallowRef<Turn[]>([]);

  const result = computed(() => outcome(position.value));
  const last = computed(() => history.value.at(-1) ?? null);
  /** The square of the king in check. */
  const check = computed(() => {
    const { pieces, turn } = position.value;
    return inCheck(position.value, turn) ? pieces.find((piece) => piece.kind === 'K' && piece.color === turn)!.square : null;
  });

  const pieceAt = (square: string) => position.value.pieces.find((piece) => piece.square === square);
  const canMove = (id: Key, to: string) => legalMoves(position.value, String(id)).has(to);

  const move = (id: string, to: string) => {
    const before = position.value;
    const from = before.pieces.find((piece) => piece.id === id)!.square;
    const { next, captured, san } = play(before, id, to);
    position.value = next;
    history.value = [...history.value, { san, from, to, captured, before }];
  };

  const undo = () => {
    const turn = history.value.at(-1);
    if (!turn) return;
    position.value = turn.before;
    history.value = history.value.slice(0, -1);
  };

  const reset = () => {
    position.value = newGame();
    history.value = [];
  };

  return { position, history, result, last, check, pieceAt, canMove, move, undo, reset };
}

export type Game = ReturnType<typeof createGame>;
export const GAME: InjectionKey<Game> = Symbol('game');
