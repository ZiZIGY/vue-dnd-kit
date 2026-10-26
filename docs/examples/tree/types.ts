export interface FileNode {
  id: string;
  name: string;
  folder?: boolean;
  children?: FileNode[];
}
