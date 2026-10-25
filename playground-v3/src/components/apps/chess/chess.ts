import type { ComputedRef, InjectionKey, Ref } from 'vue';

export type Color = 'w' | 'b';
export type Kind = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export interface Piece {
  id: string;
  color: Color;
  kind: Kind;
  square: string;
}

const FILES = 'abcdefgh';
const BACK_RANK: Kind[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

/** Squares from a8 to h1: the order the board is drawn in. */
export const SQUARES: string[] = Array.from({ length: 64 }, (_, index) => `${FILES[index % 8]}${8 - Math.floor(index / 8)}`);

const at = (file: number, rank: number) => `${FILES[file]}${rank + 1}`;
const coords = (square: string) => ({ file: FILES.indexOf(square[0]!), rank: Number(square[1]) - 1 });

export const isDark = (square: string): boolean => {
  const { file, rank } = coords(square);
  return (file + rank) % 2 === 0;
};

export const createPieces = (): Piece[] =>
  (['w', 'b'] as const).flatMap((color) => {
    const back = color === 'w' ? 0 : 7;
    const pawns = color === 'w' ? 1 : 6;
    return [...FILES].flatMap((letter, file) => [
      { id: `${color}${BACK_RANK[file]}-${letter}`, color, kind: BACK_RANK[file]!, square: at(file, back) },
      { id: `${color}P-${letter}`, color, kind: 'P' as Kind, square: at(file, pawns) },
    ]);
  });

const STEPS: Record<'N' | 'K', Array<[number, number]>> = {
  N: [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]],
  K: [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
};
const RAYS: Record<'Q' | 'R' | 'B', Array<[number, number]>> = {
  R: [[1, 0], [-1, 0], [0, 1], [0, -1]],
  B: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
  Q: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
};

const inside = (file: number, rank: number) => file >= 0 && file < 8 && rank >= 0 && rank < 8;

/**
 * Squares the piece may move to. A reduced rule set: every piece moves as it should and
 * captures, pawns step twice from their first rank, but there is no check, castling or
 * en passant.
 */
export const legalMoves = (piece: Piece, pieceAt: (square: string) => Piece | undefined): Set<string> => {
  const moves = new Set<string>();
  const { file, rank } = coords(piece.square);
  const free = (f: number, r: number) => inside(f, r) && !pieceAt(at(f, r));
  const enemy = (f: number, r: number) => inside(f, r) && pieceAt(at(f, r))?.color === (piece.color === 'w' ? 'b' : 'w');

  if (piece.kind === 'P') {
    const dir = piece.color === 'w' ? 1 : -1;
    if (free(file, rank + dir)) {
      moves.add(at(file, rank + dir));
      const first = piece.color === 'w' ? 1 : 6;
      if (rank === first && free(file, rank + 2 * dir)) moves.add(at(file, rank + 2 * dir));
    }
    for (const side of [-1, 1]) if (enemy(file + side, rank + dir)) moves.add(at(file + side, rank + dir));
  } else if (piece.kind === 'N' || piece.kind === 'K') {
    for (const [df, dr] of STEPS[piece.kind]) {
      if (free(file + df, rank + dr) || enemy(file + df, rank + dr)) moves.add(at(file + df, rank + dr));
    }
  } else {
    for (const [df, dr] of RAYS[piece.kind]) {
      for (let f = file + df, r = rank + dr; inside(f, r); f += df, r += dr) {
        if (free(f, r)) moves.add(at(f, r));
        else {
          if (enemy(f, r)) moves.add(at(f, r));
          break;
        }
      }
    }
  }
  return moves;
};

/** Piece placement in FEN (`rnbqkbnr/pppppppp/8/…`), for assertions. */
export const placement = (pieces: readonly Piece[]): string =>
  Array.from({ length: 8 }, (_, row) => {
    let line = '';
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const piece = pieces.find((item) => item.square === at(file, 7 - row));
      if (!piece) {
        empty++;
        continue;
      }
      if (empty) line += empty;
      empty = 0;
      line += piece.color === 'w' ? piece.kind : piece.kind.toLowerCase();
    }
    return line + (empty || '');
  }).join('/');

/** Solid glyphs for both sides (colored in CSS); U+FE0E asks for text, not emoji, presentation. */
export const GLYPHS: Record<Kind, string> = {
  K: '♚︎',
  Q: '♛︎',
  R: '♜︎',
  B: '♝︎',
  N: '♞︎',
  P: '♟︎',
};

export const NAMES: Record<Kind, string> = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };

export interface ChessContext {
  pieceAt(square: string): Piece | undefined;
  /** Where the piece being dragged may go: computed from `useDnD().active`. */
  legal: ComputedRef<Set<string>>;
  /** Square the dragged piece comes from. */
  source: ComputedRef<string | null>;
  turn: Readonly<Ref<Color>>;
  over: Readonly<Ref<boolean>>;
  move(pieceId: string, to: string): void;
}

export const CHESS: InjectionKey<ChessContext> = Symbol('chess');
