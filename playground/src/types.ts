export interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
}

export interface KanbanCard {
  id: string;
  label: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}
