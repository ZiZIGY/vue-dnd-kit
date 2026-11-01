import { onScopeDispose, watch, type Ref } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import { useDnDActions } from '@vue-dnd-kit/actions';
import { botMove } from './bot';
import { glide } from './glide';
import type { Game, Plan } from './game';

/** Frames a scripted drag takes to cross the board: about a third of a second. */
const FRAMES = 20;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const centerOf = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/**
 * Moves played by code: the bot's, a replay's, and the rook's step of every castling.
 * Each one is a real drag (`@vue-dnd-kit/actions`): the piece is picked up, glides to its
 * square, and drops through the square's `accept` and `onDrop`, announced and animated
 * exactly as a drag of yours.
 */
export function useAutoplay(game: Game, root: Readonly<Ref<HTMLElement | null>>) {
  const { status } = useDnD();
  const { startDrag } = useDnDActions();
  const squareAt = (square: string) => root.value?.querySelector(`[data-square="${square}"]`) ?? null;

  /** Picks the piece up, glides it onto the square, holds it there a moment and drops it. */
  const drag = async ({ id, to }: Plan) => {
    const piece = game.position.value.pieces.find((other) => other.id === id);
    const from = piece && squareAt(piece.square);
    const target = squareAt(to);
    const drag = from && target ? startDrag(id) : null;
    if (!drag) return false;
    const start = centerOf(from!);
    for (let frame = 1; frame <= FRAMES; frame++) {
      // Measured every frame: the page may scroll meanwhile.
      const end = centerOf(target!);
      const t = easeOut(frame / FRAMES);
      const point = { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
      // `false`: the drag is over, e.g. Escape cancelled it.
      if (!(await drag.moveTo(point))) return false;
    }
    await pause(150);
    return drag.drop();
  };

  /** The move code plays next: the rook's step of a castling, a replay's next move, the bot's. */
  const plan = (): Plan | null => {
    const { rookStep, turn } = game.position.value;
    if (rookStep) return rookStep;
    if (game.result.value) return null;
    if (game.replay.value.length) return game.replay.value[0]!;
    if (game.vsBot.value && turn === 'b') return botMove(game.position.value);
    return null;
  };

  // Once the board is gone, nothing plays any more.
  let stopped = false;
  onScopeDispose(() => (stopped = true));

  const next = async () => {
    // One at a time, and never during a drag of yours (or while its drop lands).
    if (stopped || game.planned.value || status.value !== 'idle') return;
    const move = plan();
    if (!move) return;
    game.planned.value = move;
    // A beat first: the bot "thinks", a replay lets you follow.
    await pause(game.position.value.rookStep ? 100 : 450);
    const dropped = await drag(move);
    // A drag cut short (Escape) ends a replay. The bot just tries again.
    if (game.replay.value[0] === move) game.replay.value = dropped ? game.replay.value.slice(1) : [];
    game.planned.value = null;
    void next();
  };
  watch([status, game.position, game.vsBot, game.replay], () => void next());

  /** Plays the game again from the start, move after move. */
  const replay = () => {
    game.replay.value = game.history.value.map(({ id, to, promotion }) => ({ id, to, promotion }));
    void glide(root.value, game.reset);
  };
  const stop = () => (game.replay.value = []);

  return { replay, stop };
}
