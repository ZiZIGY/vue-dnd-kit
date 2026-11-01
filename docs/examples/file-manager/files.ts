/** The drive's data: files and folders, the sample content, and helpers with no state. */

export interface FileEntry {
  kind: 'file';
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  /** Last change, as a timestamp. */
  modified: number;
  /** A thumbnail: an object URL for photos dropped in from the desktop. */
  url?: string;
  /** In the trash: the folder it was deleted from, for Put Back. */
  origin?: string;
}

export interface FolderEntry {
  kind: 'folder';
  id: string;
  name: string;
  modified: number;
  /** Folders and files, in the order the manual arrangement shows them. */
  children: Entry[];
  origin?: string;
}

export type Entry = FileEntry | FolderEntry;

export const isFolder = (entry: Entry): entry is FolderEntry => entry.kind === 'folder';

// ─── Kinds ──────────────────────────────────────────────────────────────────────

export type Kind =
  | 'folder'
  | 'image'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'archive'
  | 'code'
  | 'text'
  | 'audio'
  | 'video'
  | 'other';

const EXTENSIONS: Record<string, Kind> = {
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', heic: 'image', svg: 'image',
  pdf: 'pdf',
  doc: 'document', docx: 'document', pages: 'document', rtf: 'document',
  xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet', numbers: 'spreadsheet',
  key: 'presentation', ppt: 'presentation', pptx: 'presentation',
  zip: 'archive', rar: 'archive', '7z': 'archive', gz: 'archive',
  html: 'code', css: 'code', js: 'code', ts: 'code', vue: 'code', json: 'code',
  md: 'text', txt: 'text',
  mp3: 'audio', wav: 'audio', m4a: 'audio', flac: 'audio',
  mp4: 'video', mov: 'video', webm: 'video',
};

/** What the Kind column says, and the colour of the file's badge. */
export const KINDS: Record<Kind, { label: string; color: string }> = {
  folder: { label: 'Folder', color: '#3b82f6' },
  image: { label: 'Image', color: '#ec4899' },
  pdf: { label: 'PDF document', color: '#ef4444' },
  document: { label: 'Document', color: '#2563eb' },
  spreadsheet: { label: 'Spreadsheet', color: '#16a34a' },
  presentation: { label: 'Presentation', color: '#f97316' },
  archive: { label: 'Archive', color: '#a16207' },
  code: { label: 'Source code', color: '#8b5cf6' },
  text: { label: 'Text', color: '#64748b' },
  audio: { label: 'Audio', color: '#e11d48' },
  video: { label: 'Video', color: '#0891b2' },
  other: { label: 'File', color: '#71717a' },
};

export const extension = (name: string): string => (name.includes('.') ? name.split('.').pop()!.toLowerCase() : '');

export const kindOf = (entry: Entry): Kind => (isFolder(entry) ? 'folder' : (EXTENSIONS[extension(entry.name)] ?? 'other'));

// ─── The sample drive ───────────────────────────────────────────────────────────

let lastId = 0;
/** Keys of their own: names repeat (copies, a file in two folders). */
export const newId = (): string => `entry-${++lastId}`;

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** A time `days` (and `hours`) before now, so the dates read "Today", "Yesterday"... */
const ago = (days: number, hours = 0) => Date.now() - days * DAY - hours * HOUR;

const file = (name: string, size: number, modified: number): FileEntry => ({ kind: 'file', id: newId(), name, size, modified });

export const folder = (name: string, children: Entry[] = [], modified = Date.now()): FolderEntry => ({
  kind: 'folder',
  id: newId(),
  name,
  modified,
  children,
});

export const createHome = (): FolderEntry =>
  folder('My Drive', [
    folder('Documents', [
      folder('Invoices', [file('invoice-2026-09.pdf', 64_200, ago(32)), file('invoice-2026-10.pdf', 61_900, ago(2, 3))], ago(2, 3)),
      folder('Contracts', [file('lease-agreement.pdf', 412_000, ago(140))], ago(140)),
      file('Quarterly report.docx', 96_200, ago(0, 2)),
      file('Budget 2026.xlsx', 48_500, ago(1, 5)),
      file('Roadmap.key', 2_400_000, ago(3)),
      file('Meeting notes.md', 3_100, ago(0, 5)),
      file('Resume.pdf', 182_000, ago(41)),
      file('Cover letter.docx', 21_000, ago(41)),
      file('Expenses.csv', 9_400, ago(6)),
      file('Pitch deck.pptx', 5_800_000, ago(9)),
      file('Tax return 2025.pdf', 338_000, ago(73)),
      file('Scan.png', 1_240_000, ago(1, 9)),
    ], ago(0, 2)),
    folder('Photos', [
      folder('Iceland', [file('Glacier.jpg', 4_100_000, ago(90)), file('Aurora.jpg', 3_600_000, ago(90)), file('Black beach.jpg', 3_900_000, ago(89))], ago(89)),
      file('Sunset.jpg', 2_900_000, ago(12)),
      file('Portrait.heic', 1_800_000, ago(4)),
      file('Garden.jpg', 3_200_000, ago(18)),
      file('Cat.png', 870_000, ago(1, 2)),
    ], ago(1, 2)),
    folder('Projects', [
      folder('Website', [file('index.html', 6_400, ago(7)), file('styles.css', 4_900, ago(7)), file('App.vue', 2_300, ago(0, 1))], ago(0, 1)),
      file('logo.svg', 9_800, ago(25)),
      file('site-backup.zip', 12_400_000, ago(60)),
      file('Demo.mov', 48_000_000, ago(9)),
    ], ago(0, 1)),
    folder('Music', [file('Morning demo.mp3', 6_200_000, ago(15)), file('Voice memo.m4a', 1_100_000, ago(2))], ago(2)),
    folder('Archive', [], ago(200)),
    file('README.md', 2_048, ago(30)),
  ]);

export const TRASH = 'trash';

/** The Trash is a folder outside the tree; what is in it remembers where it came from. */
export const createTrash = (home: FolderEntry): FolderEntry => ({
  ...folder('Trash', [{ ...file('Old draft.docx', 18_300, ago(8)), origin: home.children[0]!.id }]),
  id: TRASH,
});

// ─── The tree ───────────────────────────────────────────────────────────────────

/** The folders from `root` down to the one with this id, or `[]`. */
export const pathTo = (root: FolderEntry, id: string): FolderEntry[] => {
  if (root.id === id) return [root];
  for (const entry of root.children) {
    const path = isFolder(entry) ? pathTo(entry, id) : [];
    if (path.length) return [root, ...path];
  }
  return [];
};

/** Bytes in a file, or in everything inside a folder. */
export const sizeOf = (entry: Entry): number =>
  isFolder(entry) ? entry.children.reduce((sum, child) => sum + sizeOf(child), 0) : entry.size;

/** "Budget 2026.xlsx", or "Budget 2026 2.xlsx" when the folder has one already. */
export const uniqueName = (siblings: Entry[], name: string, self?: Entry): string => {
  const taken = new Set(siblings.filter((entry) => entry !== self).map((entry) => entry.name.toLowerCase()));
  const dot = name.lastIndexOf('.');
  const [base, ext] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, ''];
  let next = name;
  for (let n = 2; taken.has(next.toLowerCase()); n++) next = `${base} ${n}${ext}`;
  return next;
};

/** A copy with keys of its own, its content too. */
export const copyEntry = (entry: Entry): Entry =>
  isFolder(entry) ? { ...entry, id: newId(), children: entry.children.map(copyEntry) } : { ...entry, id: newId() };

/** The same tree in new objects, keys kept: what Undo goes back to. */
export const snapshot = <T extends Entry>(entry: T): T =>
  (isFolder(entry) ? { ...entry, children: entry.children.map(snapshot) } : { ...entry }) as T;

// ─── Words ──────────────────────────────────────────────────────────────────────

export const items = (count: number): string => (count === 1 ? '1 item' : `${count} items`);

/** "cv.pdf", or "3 items". */
export const describe = (entries: Entry[]): string => (entries.length === 1 ? `“${entries[0]!.name}”` : items(entries.length));

export const formatSize = (bytes: number): string => {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${Math.round(bytes / 1e3)} KB`;
  return `${bytes} bytes`;
};

const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** "Today at 9:41 AM", "Yesterday at 6:02 PM", "Mar 3, 2026". */
export const formatDate = (timestamp: number): string => {
  const days = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(timestamp).setHours(0, 0, 0, 0)) / DAY);
  if (days === 0) return `Today at ${time.format(timestamp)}`;
  if (days === 1) return `Yesterday at ${time.format(timestamp)}`;
  return date.format(timestamp);
};
