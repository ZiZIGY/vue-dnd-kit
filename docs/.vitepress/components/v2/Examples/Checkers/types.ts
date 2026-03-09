export interface Piece {
  id: number;
  row: number;
  col: number;
  color: 'red' | 'black';
  isKing: boolean;
}
