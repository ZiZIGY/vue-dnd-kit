import { VALUES, attacked, legalMoves, opponent, play, type Position } from './chess';
import type { Plan } from './game';

/**
 * A greedy bot that looks one move ahead: it mates when it can, takes the most it can,
 * promotes, gives check, and doesn't leave the piece it moves where it can be taken.
 * Chance decides between equal moves.
 */
export function botMove(position: Position): Plan | null {
  let best: Plan | null = null;
  let bestScore = -Infinity;
  for (const piece of position.pieces) {
    for (const to of legalMoves(position, piece.id)) {
      const { next, captured, san } = play(position, piece.id, to);
      let score = Math.random();
      if (san.endsWith('#')) score += 1000;
      if (captured) score += VALUES[captured.kind] * 10;
      if (san.includes('=')) score += 80;
      if (san.endsWith('+')) score += 2;
      if (attacked(next, to, opponent(piece.color))) score -= VALUES[piece.kind] * 10;
      if (score > bestScore) {
        bestScore = score;
        best = { id: piece.id, to, promotion: 'Q' };
      }
    }
  }
  return best;
}
