/** The rules: legal moves with check, castling, en passant and promotion (always to a queen). */

export type Color = 'w' | 'b';
export type Kind = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

export interface Piece {
  id: string;
  color: Color;
  kind: Kind;
  square: string;
  moved: boolean;
}

/** A position never changes: every move makes a new one. */
export interface Position {
  pieces: Piece[];
  turn: Color;
  /** The square a pawn skipped with its double step: a pawn beside it may take it there. */
  enPassant: string | null;
}

export const NAMES: Record<Kind, string> = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };
export const VALUES: Record<Kind, number> = { K: 0, Q: 9, R: 5, B: 3, N: 3, P: 1 };

const FILES = 'abcdefgh';
const at = (file: number, rank: number) => `${FILES[file]}${rank + 1}`;
const coords = (square: string) => ({ file: FILES.indexOf(square[0]!), rank: Number(square[1]) - 1 });
const inside = (file: number, rank: number) => file >= 0 && file < 8 && rank >= 0 && rank < 8;
const opponent = (color: Color): Color => (color === 'w' ? 'b' : 'w');

/** a8 to h1: the order the board is drawn in. */
export const SQUARES = Array.from({ length: 64 }, (_, i) => at(i % 8, 7 - Math.floor(i / 8)));
export const isDark = (square: string) => (coords(square).file + coords(square).rank) % 2 === 0;

const BACK: Kind[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

export const newGame = (): Position => ({
  pieces: (['w', 'b'] as const).flatMap((color) =>
    [...FILES].flatMap((letter, file) => [
      { id: `${color}${BACK[file]}${letter}`, color, kind: BACK[file]!, square: at(file, color === 'w' ? 0 : 7), moved: false },
      { id: `${color}P${letter}`, color, kind: 'P' as Kind, square: at(file, color === 'w' ? 1 : 6), moved: false },
    ]),
  ),
  turn: 'w',
  enPassant: null,
});

type Steps = Array<[number, number]>;
const STEPS: Record<'N' | 'K', Steps> = {
  N: [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]],
  K: [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
};
const RAYS: Record<'R' | 'B' | 'Q', Steps> = {
  R: [[1, 0], [-1, 0], [0, 1], [0, -1]],
  B: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
  Q: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
};

/** Squares the piece moves to, or with `attacks` the squares it threatens. No castling, checks ignored. */
const reach = (position: Position, piece: Piece, attacks = false): string[] => {
  const pieceAt = (file: number, rank: number) => position.pieces.find((other) => other.square === at(file, rank));
  const { file, rank } = coords(piece.square);
  const squares: string[] = [];
  if (piece.kind === 'P') {
    const dir = piece.color === 'w' ? 1 : -1;
    for (const side of [-1, 1]) {
      if (!inside(file + side, rank + dir)) continue;
      const square = at(file + side, rank + dir);
      const target = pieceAt(file + side, rank + dir);
      if (attacks || (target && target.color !== piece.color) || square === position.enPassant) squares.push(square);
    }
    if (!attacks && inside(file, rank + dir) && !pieceAt(file, rank + dir)) {
      squares.push(at(file, rank + dir));
      if (rank === (piece.color === 'w' ? 1 : 6) && !pieceAt(file, rank + 2 * dir)) squares.push(at(file, rank + 2 * dir));
    }
  } else if (piece.kind === 'N' || piece.kind === 'K') {
    for (const [df, dr] of STEPS[piece.kind]) {
      if (inside(file + df, rank + dr) && pieceAt(file + df, rank + dr)?.color !== piece.color) squares.push(at(file + df, rank + dr));
    }
  } else {
    for (const [df, dr] of RAYS[piece.kind]) {
      for (let f = file + df, r = rank + dr; inside(f, r); f += df, r += dr) {
        const other = pieceAt(f, r);
        if (other?.color !== piece.color) squares.push(at(f, r));
        if (other) break;
      }
    }
  }
  return squares;
};

const attacked = (position: Position, square: string, by: Color) =>
  position.pieces.some((piece) => piece.color === by && reach(position, piece, true).includes(square));

export const inCheck = (position: Position, color: Color) =>
  attacked(position, position.pieces.find((piece) => piece.kind === 'K' && piece.color === color)!.square, opponent(color));

/** Plays a move without asking whether it is legal. */
const apply = (position: Position, piece: Piece, to: string) => {
  const from = coords(piece.square);
  const dest = coords(to);
  // En passant: the pawn goes to the empty square behind the one it takes.
  const captured =
    position.pieces.find((other) => other.square === to) ??
    (piece.kind === 'P' && to === position.enPassant ? position.pieces.find((other) => other.square === at(dest.file, from.rank)) : undefined);
  const promoted = piece.kind === 'P' && (dest.rank === 0 || dest.rank === 7);
  const pieces = position.pieces
    .filter((other) => other !== captured)
    .map((other): Piece => (other === piece ? { ...other, square: to, moved: true, kind: promoted ? 'Q' : other.kind } : { ...other }));
  // Castling: the king moves two files, and the rook jumps over it.
  if (piece.kind === 'K' && Math.abs(dest.file - from.file) === 2) {
    const rook = pieces.find((other) => other.square === at(dest.file > from.file ? 7 : 0, from.rank))!;
    rook.square = at((from.file + dest.file) / 2, from.rank);
    rook.moved = true;
  }
  const next: Position = {
    pieces,
    turn: opponent(position.turn),
    enPassant: piece.kind === 'P' && Math.abs(dest.rank - from.rank) === 2 ? at(from.file, (from.rank + dest.rank) / 2) : null,
  };
  return { next, captured: captured ?? null };
};

const cache = new WeakMap<Position, Map<string, Set<string>>>();

/** Where the piece may go: none when it isn't its side's turn. Cached per position. */
export const legalMoves = (position: Position, id: string): Set<string> => {
  const known = cache.get(position) ?? cache.set(position, new Map()).get(position)!;
  if (known.has(id)) return known.get(id)!;
  const piece = position.pieces.find((other) => other.id === id);
  const moves = new Set<string>();
  if (piece && piece.color === position.turn) {
    for (const to of reach(position, piece)) if (!inCheck(apply(position, piece, to).next, piece.color)) moves.add(to);
    if (piece.kind === 'K' && !piece.moved && !inCheck(position, piece.color)) {
      const { rank } = coords(piece.square);
      // The rook's file, and the squares between: empty, the first two safe for the king.
      for (const [rookFile, between] of [[7, [5, 6]], [0, [3, 2, 1]]] as const) {
        const rook = position.pieces.find((other) => other.square === at(rookFile, rank));
        const empty = between.every((file) => !position.pieces.some((other) => other.square === at(file, rank)));
        const safe = between.slice(0, 2).every((file) => !attacked(position, at(file, rank), opponent(piece.color)));
        if (rook?.kind === 'R' && !rook.moved && empty && safe) moves.add(at(between[1], rank));
      }
    }
  }
  known.set(id, moves);
  return moves;
};

/** `null` while the game goes on. */
export const outcome = (position: Position): 'checkmate' | 'stalemate' | null => {
  if (position.pieces.some((piece) => legalMoves(position, piece.id).size)) return null;
  return inCheck(position, position.turn) ? 'checkmate' : 'stalemate';
};

/** Plays a legal move: the new position, the piece taken and the move in algebraic notation. */
export const play = (position: Position, id: string, to: string) => {
  const piece = position.pieces.find((other) => other.id === id)!;
  const { next, captured } = apply(position, piece, to);
  const fileJump = coords(to).file - coords(piece.square).file;
  let san: string;
  if (piece.kind === 'K' && Math.abs(fileJump) === 2) san = fileJump > 0 ? 'O-O' : 'O-O-O';
  else if (piece.kind === 'P') san = `${captured ? `${piece.square[0]}x` : ''}${to}${to[1] === '8' || to[1] === '1' ? '=Q' : ''}`;
  else {
    // Another piece of the kind could go there too: name the file, else the rank, else both.
    const rivals = position.pieces.filter(
      (other) => other !== piece && other.kind === piece.kind && legalMoves(position, other.id).has(to),
    );
    const sameFile = rivals.some((other) => other.square[0] === piece.square[0]);
    const sameRank = rivals.some((other) => other.square[1] === piece.square[1]);
    const from = !rivals.length ? '' : !sameFile ? piece.square[0] : !sameRank ? piece.square[1] : piece.square;
    san = `${piece.kind}${from}${captured ? 'x' : ''}${to}`;
  }
  const mark = outcome(next) === 'checkmate' ? '#' : inCheck(next, next.turn) ? '+' : '';
  return { next, captured, san: san + mark };
};
