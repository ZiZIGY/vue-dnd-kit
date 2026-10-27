export interface Task {
  id: string;
  title: string;
  tag: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  /** Work-in-progress limit: the column takes no more cards than this. */
  limit?: number;
  /** Cards coming in from another column ask first. */
  confirm?: boolean;
  cards: Task[];
}

/** What the dialog answers: words that `onBeforeDrop` understands as they are. */
export type Answer = 'accept' | 'continue' | 'reject';
