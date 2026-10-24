export interface Task {
  id: string;
  title: string;
  tall?: boolean;
  /** Item type for accept rules (`group.put`, `acceptMode`). */
  type?: string;
  /** Grid cell span: columns x rows. */
  span?: [number, number];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
