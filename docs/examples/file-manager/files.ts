import type { InjectionKey, Ref, WritableComputedRef } from 'vue';
import type { DnDEvent, Key } from '@vue-dnd-kit/core';

export interface FileEntry {
  kind: 'file';
  id: string;
  name: string;
  /** Bytes. */
  size: number;
}

export interface FolderEntry {
  kind: 'folder';
  id: string;
  name: string;
  /** Folders and files, in the order the grid shows them. */
  children: Entry[];
}

export type Entry = FileEntry | FolderEntry;

const file = (name: string, size: number): FileEntry => ({ kind: 'file', id: name, name, size });
const folder = (name: string, children: Entry[] = []): FolderEntry => ({ kind: 'folder', id: name, name, children });

export const createHome = (): FolderEntry =>
  folder('Home', [
    folder('Documents', [
      folder('Invoices', [file('invoice-04.pdf', 64_000), file('invoice-05.pdf', 61_000)]),
      folder('Contracts'),
      file('cv.pdf', 182_000),
      file('budget.xlsx', 48_500),
      file('notes.md', 3_100),
      file('report.docx', 96_200),
      file('roadmap.key', 2_400_000),
      file('letter.docx', 21_000),
      file('plan.xlsx', 33_000),
    ]),
    folder('Photos', [
      folder('Trips', [file('alps.jpg', 4_100_000)]),
      file('beach.jpg', 3_200_000),
      file('sunset.jpg', 2_900_000),
      file('cat.png', 870_000),
    ]),
    folder('Projects', [
      folder('Website', [file('index.html', 6_400), file('styles.css', 4_900)]),
      file('logo.svg', 9_800),
      file('site.zip', 12_400_000),
    ]),
    folder('Archive'),
    file('README.md', 2_048),
  ]);

export const isFolder = (entry: Entry): entry is FolderEntry => entry.kind === 'folder';

/** The folder and every folder below it, depth first. */
export function* walk(root: FolderEntry, depth = 0): Generator<{ folder: FolderEntry; depth: number }> {
  yield { folder: root, depth };
  for (const entry of root.children) if (isFolder(entry)) yield* walk(entry, depth + 1);
}

/** The folders from `root` down to the one with this id, or `[]`. */
export const pathTo = (root: FolderEntry, id: Key): FolderEntry[] => {
  if (root.id === id) return [root];
  for (const entry of root.children) {
    const path = isFolder(entry) ? pathTo(entry, id) : [];
    if (path.length) return [root, ...path];
  }
  return [];
};

let copies = 0;

/** A copy with keys of its own, its content too. `rename`: "budget copy.xlsx", for a copy beside the original. */
export const copyEntry = (entry: Entry, rename = false): Entry => {
  const name = rename ? entry.name.replace(/(\.\w+)?$/, ' copy$1') : entry.name;
  const id = `${name}~${++copies}`;
  return isFolder(entry) ? { ...entry, id, name, children: entry.children.map((child) => copyEntry(child)) } : { ...entry, id, name };
};

export const items = (count: number): string => (count === 1 ? '1 item' : `${count} items`);

/** "cv.pdf", or "3 items". */
export const describe = (entries: Entry[]): string => (entries.length === 1 ? entries[0]!.name : items(entries.length));

export const extension = (name: string): string => (name.includes('.') ? name.split('.').pop()!.toLowerCase() : '');

export const formatSize = (bytes: number): string => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
};

/** What the window shares with its tree, grid and tiles. */
export interface FileManager {
  /** The open folder. */
  current: Readonly<Ref<FolderEntry>>;
  /** Its files and folders: the grid's `items`, a writable computed. */
  entries: WritableComputedRef<Entry[]>;
  /** The last thing a drop did, for the status bar. */
  lastAction: Ref<string>;
  open(folder: FolderEntry): void;
  /** Whether the dragged entries may go into `folder`. */
  canDrop(ids: Key[], folder: FolderEntry): boolean;
  /** Moves the dragged entries into `folder`, or copies them while Alt is held. */
  dropInto(event: DnDEvent, folder: FolderEntry): void;
}

export const FILES: InjectionKey<FileManager> = Symbol('file-manager');
