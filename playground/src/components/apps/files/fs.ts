import type { InjectionKey, Ref, WritableComputedRef } from 'vue';
import type { DnDEvent, DragItem } from '@vue-dnd-kit/core';

export interface FileItem {
  kind: 'file';
  id: string;
  name: string;
  /** Bytes. */
  size: number;
}

export interface FolderNode {
  kind: 'folder';
  id: string;
  name: string;
  /** Folders and files in the order the grid shows them; the tree shows the folders. */
  children: Entry[];
}

export type Entry = FileItem | FolderNode;

/** The root folder: shown above the tree and as the first breadcrumb, not part of the tree. */
export const HOME = 'home';

const folder = (id: string, name: string, children: Entry[] = []): FolderNode => ({ kind: 'folder', id, name, children });
const file = (id: string, name: string, size: number): FileItem => ({ kind: 'file', id, name, size });

export const createRoot = (): FolderNode =>
  folder(HOME, 'Home', [
    folder('documents', 'Documents', [
      folder('invoices', 'Invoices', [file('inv-01', 'invoice-01.pdf', 64_000), file('inv-02', 'invoice-02.pdf', 61_000)]),
      folder('contracts', 'Contracts'),
      file('cv', 'cv.pdf', 182_000),
      file('budget', 'budget.xlsx', 48_500),
      file('notes', 'notes.md', 3_100),
      file('report', 'report.docx', 96_200),
      file('slides', 'pitch.pptx', 2_400_000),
      file('letter', 'letter.docx', 21_000),
      file('plan', 'plan.xlsx', 33_000),
    ]),
    folder('photos', 'Photos', [
      folder('trips', 'Trips', [file('alps', 'alps.jpg', 4_100_000)]),
      file('beach', 'beach.jpg', 3_200_000),
      file('sunset', 'sunset.jpg', 2_900_000),
      file('cat', 'cat.png', 870_000),
    ]),
    folder('projects', 'Projects', [
      folder('website', 'Website', [file('index', 'index.html', 6_400), file('styles', 'styles.css', 4_900)]),
      file('logo', 'logo.svg', 9_800),
      file('bundle', 'site.zip', 12_400_000),
    ]),
    folder('archive', 'Archive'),
    file('readme', 'README.md', 2_048),
  ]);

export const isFolder = (entry: Entry): entry is FolderNode => entry.kind === 'folder';

/** What the tree shows of a folder: its sub-folders. */
export const subfolders = (node: FolderNode): FolderNode[] => node.children.filter(isFolder);

/**
 * The tree writes a folder's sub-folders back in their new order. Files stay where they
 * are; a folder that moved in goes before the next one that stays, or last.
 */
export const mergeFolders = (children: Entry[], folders: FolderNode[]): Entry[] => {
  const merged: Entry[] = [];
  let next = 0;
  for (const entry of children) {
    const at = isFolder(entry) ? folders.indexOf(entry) : -2;
    if (at === -2) merged.push(entry);
    else if (at >= next) {
      merged.push(...folders.slice(next, at + 1));
      next = at + 1;
    }
  }
  return [...merged, ...folders.slice(next)];
};

/** The folder and every folder below it, depth first. */
export const walk = function* (node: FolderNode): Generator<FolderNode> {
  yield node;
  for (const child of subfolders(node)) yield* walk(child);
};

export const findFolder = (root: FolderNode, id: string): FolderNode | undefined =>
  [...walk(root)].find((node) => node.id === id);

/** Path of folders from a top-level folder to `id`, or `[]` (Home, or not in the tree). */
export const findPath = (nodes: readonly FolderNode[], id: string): FolderNode[] => {
  for (const node of nodes) {
    if (node.id === id) return [node];
    const below = findPath(subfolders(node), id);
    if (below.length) return [node, ...below];
  }
  return [];
};

/** Takes the entries with these ids out of their folders, in tree order (a taken folder keeps its content). */
export const takeEntries = (node: FolderNode, ids: ReadonlySet<string>): Entry[] => {
  const taken: Entry[] = [];
  const kept: Entry[] = [];
  for (const entry of node.children) {
    if (ids.has(entry.id)) taken.push(entry);
    else {
      kept.push(entry);
      if (isFolder(entry)) taken.push(...takeEntries(entry, ids));
    }
  }
  if (kept.length !== node.children.length) node.children = kept;
  return taken;
};

/** `documents(invoices,contracts),photos(trips),…` for assertions. */
export const serializeFolders = (nodes: readonly FolderNode[]): string =>
  nodes.map((node) => (subfolders(node).length ? `${node.id}(${serializeFolders(subfolders(node))})` : node.id)).join(',');

export const extension = (name: string): string => name.slice(name.lastIndexOf('.') + 1).toLowerCase();

export const formatSize = (bytes: number): string => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
};

/** Where a folder takes drops: a grid tile, a tree row, a breadcrumb, the sidebar's Home. */
export type FolderPlace = 'tile' | 'row' | 'crumb' | 'sidebar';

/**
 * Key of a folder's tree row. The folder's grid tile is draggable too, and ids are unique
 * per provider: the tile has the folder's id, the row this one.
 */
export const rowKey = (folderId: string): string => `tree:${folderId}`;

/** Id of the file or folder a dragged item (grid tile or tree row) stands for. */
export const entryId = (item: DragItem): string => (item.item as Entry | undefined)?.id ?? String(item.id);

/**
 * State and actions of the file manager, shared by its views. The tree and the grid
 * live in components of their own: each sortable list provides the context its items
 * register with, so two lists can't be created in one component.
 */
export interface FileManagerContext {
  root: Ref<FolderNode>;
  /** Top-level folders: the tree's `items` (it writes them back between Home's files). */
  folders: WritableComputedRef<FolderNode[]>;
  /** Folders and files of the open folder: the grid's `items` (a writable computed). */
  currentEntries: WritableComputedRef<Entry[]>;
  current: Readonly<Ref<string>>;
  lastAction: Ref<string>;
  nameOf(folderId: string): string;
  open(folderId: string): void;
  /** Whether a dragged entry (grid tile or tree row) may go into `folderId`, dropped on `place`. */
  canMove(item: DragItem, folderId: string, place: FolderPlace): boolean;
  /** Moves the dragged entries into `folderId` (a drop on a folder tile, a tree row, a crumb or Home). */
  moveInto(event: DnDEvent, folderId: string): void;
}

export const FILE_MANAGER: InjectionKey<FileManagerContext> = Symbol('file-manager');
