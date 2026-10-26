export interface Task {
  id: string;
  title: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  /** Cards coming in from another column ask first. */
  confirm?: boolean;
  tasks: Task[];
}

/** What the dialog answers: words that `onBeforeDrop` understands as they are. */
export type Answer = 'accept' | 'continue' | 'reject';
