export interface IKanbanColumn {
  title?: string;
  [key: string]: any;
  items: any[];
}

export interface ITableColumn {
  key: string;
  name: string;
}
