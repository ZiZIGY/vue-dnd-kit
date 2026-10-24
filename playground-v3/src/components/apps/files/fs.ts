import type { InjectionKey, Ref } from 'vue';
import type { DnDEvent } from '@vue-dnd-kit/core';

export interface FolderNode {
  id: string;
  name: string;
  children: FolderNode[];
}

export interface FileItem {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
}

/** The root folder: shown above the tree and as the first breadcrumb, not part of the tree. */
export const HOME = 'home';

const folder = (id: string, name: string, children: FolderNode[] = []): FolderNode => ({ id, name, children });
const file = (id: string, name: string, size: number): FileItem => ({ id, name, size });

export const createFolders = (): FolderNode[] => [
  folder('documents', 'Documents', [folder('invoices', 'Invoices'), folder('contracts', 'Contracts')]),
  folder('photos', 'Photos', [folder('trips', 'Trips')]),
  folder('projects', 'Projects', [folder('website', 'Website')]),
  folder('archive', 'Archive'),
];

export const createFiles = (): Record<string, FileItem[]> => ({
  [HOME]: [file('readme', 'README.md', 2_048)],
  documents: [
    file('cv', 'cv.pdf', 182_000),
    file('budget', 'budget.xlsx', 48_500),
    file('notes', 'notes.md', 3_100),
    file('report', 'report.docx', 96_200),
    file('slides', 'pitch.pptx', 2_400_000),
    file('letter', 'letter.docx', 21_000),
    file('plan', 'plan.xlsx', 33_000),
  ],
  invoices: [file('inv-01', 'invoice-01.pdf', 64_000), file('inv-02', 'invoice-02.pdf', 61_000)],
  contracts: [],
  photos: [
    file('beach', 'beach.jpg', 3_200_000),
    file('sunset', 'sunset.jpg', 2_900_000),
    file('cat', 'cat.png', 870_000),
  ],
  trips: [file('alps', 'alps.jpg', 4_100_000)],
  projects: [file('logo', 'logo.svg', 9_800), file('bundle', 'site.zip', 12_400_000)],
  website: [file('index', 'index.html', 6_400), file('styles', 'styles.css', 4_900)],
  archive: [],
});

/** Folder ids in tree order (depth first). */
export const folderIds = (nodes: readonly FolderNode[]): string[] =>
  nodes.flatMap((node) => [node.id, ...folderIds(node.children)]);

/** Path of folders from a root to `id`, or `[]` when `id` isn't in the tree. */
export const findPath = (nodes: readonly FolderNode[], id: string): FolderNode[] => {
  for (const node of nodes) {
    if (node.id === id) return [node];
    const below = findPath(node.children, id);
    if (below.length) return [node, ...below];
  }
  return [];
};

/** `documents(invoices,contracts),photos(trips),…` for assertions. */
export const serializeFolders = (nodes: readonly FolderNode[]): string =>
  nodes.map((node) => (node.children.length ? `${node.id}(${serializeFolders(node.children)})` : node.id)).join(',');

export const extension = (name: string): string => name.slice(name.lastIndexOf('.') + 1).toLowerCase();

export const formatSize = (bytes: number): string => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
};

/**
 * State and actions of the file manager, shared by its views. The tree and the grid
 * live in components of their own: each sortable list provides the context its items
 * register with, so two lists can't be created in one component.
 */
export interface FileManagerContext {
  folders: Ref<FolderNode[]>;
  files: Record<string, FileItem[]>;
  /** Files of the open folder: the grid's `items` (a writable computed). */
  currentFiles: Ref<FileItem[]>;
  current: Readonly<Ref<string>>;
  lastAction: Ref<string>;
  nameOf(folderId: string): string;
  open(folderId: string): void;
  /** Moves the dragged files into `folderId` (drop on a tree row, a crumb or a folder tile). */
  moveInto(event: DnDEvent, folderId: string): void;
  /** True while files (not folders) are being dragged. */
  draggingFiles: Readonly<Ref<boolean>>;
}

export const FILE_MANAGER: InjectionKey<FileManagerContext> = Symbol('file-manager');
