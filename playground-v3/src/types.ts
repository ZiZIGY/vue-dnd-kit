export interface Task {
  id: string;
  title: string;
  tall?: boolean;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
