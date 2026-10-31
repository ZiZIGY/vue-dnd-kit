export type Kind = 'pdf' | 'png' | 'txt' | 'zip' | 'fig' | 'mp4';

export interface FileItem {
  id: string;
  name: string;
  kind: Kind;
}

export interface Folder {
  id: string;
  name: string;
  files: FileItem[];
}

export const FOLDERS: Folder[] = [
  { id: 'design', name: 'Design', files: [{ id: 'f9', name: 'logo.fig', kind: 'fig' }] },
  { id: 'invoices', name: 'Invoices', files: [] },
  { id: 'videos', name: 'Videos', files: [] },
];

export const FILES: FileItem[] = [
  { id: 'f1', name: 'invoice-0412.pdf', kind: 'pdf' },
  { id: 'f2', name: 'hero.png', kind: 'png' },
  { id: 'f3', name: 'notes.txt', kind: 'txt' },
  { id: 'f4', name: 'invoice-0413.pdf', kind: 'pdf' },
  { id: 'f5', name: 'mockup.fig', kind: 'fig' },
  { id: 'f6', name: 'demo.mp4', kind: 'mp4' },
  { id: 'f7', name: 'assets.zip', kind: 'zip' },
  { id: 'f8', name: 'avatar.png', kind: 'png' },
];
