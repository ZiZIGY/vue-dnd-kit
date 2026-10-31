export interface Task {
  id: string;
  title: string;
  tall?: boolean;
  /** Item type for accept rules (`group.put`, `acceptMode`). */
  type?: string;
  /** Grid cell span: columns x rows. */
  span?: [number, number];
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

/** An entry of the drop-into demo: a group (it has `children`) takes the tasks dropped into it. */
export interface Entry {
  id: string;
  title: string;
  children?: Task[];
  /** A group that takes nothing: the list sorts over it like over a task. */
  locked?: boolean;
  /** Most children a group holds: a drop that would overflow it is refused (`onBeforeDrop`). */
  limit?: number;
}

export interface EntryList {
  id: string;
  entries: Entry[];
}
