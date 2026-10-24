export interface Task {
  id: string;
  title: string;
  tall?: boolean;
}

export interface Piece {
  id: string;
  label: string;
  type?: string;
  keyboard?: 'pixels' | 'droppables';
  /** Position on the board; ignored while the piece sits in a zone. */
  x: number;
  y: number;
  zone: string | null;
  /** Pointer drags only with Shift held (`canDrag`). */
  shift?: boolean;
  /** Has an interactive child that must not start a drag. */
  button?: boolean;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
