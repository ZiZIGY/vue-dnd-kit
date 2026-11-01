/** The drive's state and everything that changes it, shared by the parts of the window. */
import { computed, onScopeDispose, ref, shallowRef, type InjectionKey } from 'vue';
import { useDnD, type DnDEvent, type Key } from '@vue-dnd-kit/core';
import {
  KINDS,
  copyEntry,
  createHome,
  createTrash,
  describe,
  folder,
  isFolder,
  items,
  kindOf,
  newId,
  pathTo,
  sizeOf,
  snapshot,
  uniqueName,
  type Entry,
  type FileEntry,
  type FolderEntry,
} from './files';

export type View = 'grid' | 'list';
export type SortKey = 'manual' | 'name' | 'kind' | 'size' | 'modified';

/** The `data` of every folder target: what the overlay says over it. */
export interface DropPlace {
  name: string;
  trash: boolean;
  /** Why the drag can't go in (the folder it is in, a folder into itself), or `null`. */
  why: string | null;
}

/** Photos the browser can show: they get a thumbnail. */
const THUMBNAIL = /^image\/(png|jpe?g|gif|webp|avif|svg\+xml)$/;

const COMPARE: Record<Exclude<SortKey, 'manual'>, (a: Entry, b: Entry) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }),
  kind: (a, b) => KINDS[kindOf(a)].label.localeCompare(KINDS[kindOf(b)].label) || COMPARE.name(a, b),
  size: (a, b) => sizeOf(a) - sizeOf(b),
  modified: (a, b) => a.modified - b.modified,
};

/** "Budget.xlsx" → "Budget copy.xlsx" */
const copyName = (name: string) => name.replace(/(\.\w+)?$/, ' copy$1');

export function createDrive() {
  const { selection, active } = useDnD();
  const home = ref(createHome());
  const trash = ref(createTrash(home.value));
  /** Folder ids, in the sidebar's order. */
  const favorites = ref(home.value.children.slice(0, 3).map((entry) => entry.id));

  // ─── Where we are ───────────────────────────────────────────────────────────

  const find = (id: string): FolderEntry | undefined => (id === trash.value.id ? trash.value : pathTo(home.value, id).at(-1));
  const currentId = ref(home.value.children[0]!.id);
  const current = computed(() => find(currentId.value) ?? home.value);
  const inTrash = computed(() => current.value.id === trash.value.id);
  const path = computed(() => (inTrash.value ? [trash.value] : pathTo(home.value, current.value.id)));

  const history = ref<string[]>([]);
  const future = ref<string[]>([]);
  /** Folder being renamed, inline. */
  const renaming = ref<string | null>(null);

  const go = (id: string) => {
    currentId.value = id;
    renaming.value = null;
    selection.clear();
  };
  const open = (target: FolderEntry) => {
    if (target.id === currentId.value) return;
    history.value.push(currentId.value);
    future.value = [];
    go(target.id);
  };
  /** Steps through the history, past folders that are gone meanwhile. */
  const step = (from: string[], to: string[]) => {
    let id: string | undefined;
    while ((id = from.pop()) && !find(id));
    if (!id) return;
    to.push(currentId.value);
    go(id);
  };
  const back = () => step(history.value, future.value);
  const forward = () => step(future.value, history.value);
  const up = () => {
    const parent = path.value.at(-2);
    if (parent) open(parent);
  };

  // ─── What the view shows ────────────────────────────────────────────────────

  const view = ref<View>('grid');
  const sort = ref<{ key: SortKey; dir: 1 | -1 }>({ key: 'manual', dir: 1 });
  /** Sorts by a column, and by the same one again the other way. Sizes and dates start with the biggest, the newest. */
  const sortBy = (key: SortKey) => {
    const { value } = sort;
    sort.value = value.key === key ? { key, dir: value.dir === 1 ? -1 : 1 } : { key, dir: key === 'size' || key === 'modified' ? -1 : 1 };
  };

  /**
   * The open folder's entries: the grid's `items`. Sorted by a column, folders first;
   * the library writes each drop back through `set`.
   */
  const entries = computed<Entry[]>({
    get: () => {
      const { key, dir } = sort.value;
      const children = current.value.children;
      if (key === 'manual') return children;
      return [...children].sort((a, b) => Number(isFolder(b)) - Number(isFolder(a)) || dir * COMPARE[key](a, b));
    },
    set: (next) => (current.value.children = next),
  });
  const selected = computed(() => entries.value.filter((entry) => selection.has(entry.id)));

  // ─── Undo ───────────────────────────────────────────────────────────────────

  interface Saved {
    text: string;
    home: FolderEntry;
    trash: FolderEntry;
    favorites: string[];
  }
  const undos = shallowRef<Saved[]>([]);
  /** The toast: the last change, with Undo. `key` restarts its timer. */
  const notice = ref<{ text: string; undo: boolean; key: number } | null>(null);
  let notices = 0;
  const notify = (text: string, undo = false) => (notice.value = { text, undo, key: ++notices });

  /** Called before every change: Undo goes back to this. */
  const record = (text: string, toast = true) => {
    undos.value = [...undos.value, { text, home: snapshot(home.value), trash: snapshot(trash.value), favorites: [...favorites.value] }];
    if (toast) notify(text, true);
  };
  const undo = () => {
    const saved = undos.value.at(-1);
    if (!saved) return;
    undos.value = undos.value.slice(0, -1);
    home.value = saved.home;
    trash.value = saved.trash;
    favorites.value = saved.favorites;
    if (!find(currentId.value)) currentId.value = home.value.id;
    renaming.value = null;
    selection.clear();
    notify(`Undone: ${saved.text}`);
  };

  // ─── Changes ────────────────────────────────────────────────────────────────

  const isTrash = (target: FolderEntry) => target.id === trash.value.id;

  /** Puts `moving` into `target`, renamed where it has the name already. The Trash keeps where they were. */
  const put = (target: FolderEntry, moving: Entry[], from: FolderEntry) => {
    for (const entry of moving) {
      if (isTrash(target)) entry.origin = from.id;
      else delete entry.origin;
      entry.name = uniqueName(target.children, entry.name);
      target.children.push(entry);
    }
  };
  const remove = (from: FolderEntry, gone: Entry[]) => {
    const ids = new Set(gone.map((entry) => entry.id));
    from.children = from.children.filter((entry) => !ids.has(entry.id));
  };

  /** Why the dragged entries can't go into `target`, or `null` when they can. */
  const whyNot = (ids: Key[], target: FolderEntry): string | null => {
    if (target.id === current.value.id) return `Already in ${target.name}`;
    if (pathTo(home.value, target.id).some((step) => ids.includes(step.id))) return 'A folder can’t go into itself';
    return null;
  };
  /** A folder target's `data`, live: the overlay reads it as `over.data`. */
  const placeOf = (target: FolderEntry): DropPlace => ({
    name: target.name,
    trash: isTrash(target),
    why: active.value ? whyNot(active.value.ids, target) : null,
  });

  /**
   * A drop on a folder: in the tree, a tile, a crumb or the Trash. Every drag starts in the
   * open folder, so the dragged entries are in `entries`. Alt copies (`event.mode`), except
   * into and out of the Trash.
   */
  const dropInto = (event: DnDEvent, target: FolderEntry) => {
    const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
    const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
    record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
    if (copying) return put(target, dragged.map(copyEntry), current.value);
    put(target, dragged, current.value);
    // The grid lets them go: the library writes the open folder without them.
    event.source?.remove();
    selection.delete(...event.active.ids);
  };

  /** A copy beside the original, "Budget copy.xlsx": Alt-drag in the grid, Duplicate. */
  const duplicateOf = (entry: Entry): Entry => ({ ...copyEntry(entry), name: uniqueName(current.value.children, copyName(entry.name)) });

  const duplicate = (list: Entry[]) => {
    record(`Duplicated ${describe(list)}`);
    const children = current.value.children;
    const copies = list.map((entry) => {
      const copy = duplicateOf(entry);
      children.splice(children.findIndex((child) => child.id === entry.id) + 1, 0, copy);
      return copy;
    });
    selection.set(copies.map((copy) => copy.id));
  };

  const moveToTrash = (list: Entry[]) => {
    if (!list.length || inTrash.value) return;
    record(`Moved ${describe(list)} to the Trash`);
    remove(current.value, list);
    put(trash.value, list, current.value);
    selection.clear();
  };
  /** Back to the folders they were deleted from, or to My Drive when those are gone. */
  const putBack = (list: Entry[]) => {
    record(`Put back ${describe(list)}`);
    remove(trash.value, list);
    for (const entry of list) put(find(entry.origin ?? '') ?? home.value, [entry], trash.value);
    selection.clear();
  };
  const deleteForever = (list: Entry[]) => {
    record(`Deleted ${describe(list)}`);
    remove(trash.value, list);
    selection.clear();
  };
  const emptyTrash = () => {
    record(`Deleted ${items(trash.value.children.length)}`);
    trash.value.children = [];
    selection.clear();
  };

  const rename = (entry: Entry, name: string) => {
    renaming.value = null;
    const next = name.trim().replaceAll('/', '-');
    if (!next || next === entry.name) return;
    record(`Renamed “${entry.name}” to “${next}”`, false);
    entry.name = uniqueName(current.value.children, next, entry);
  };

  const newFolder = () => {
    record('New folder', false);
    const created = folder(uniqueName(current.value.children, 'Untitled folder'));
    current.value.children.push(created);
    selection.set([created.id]);
    renaming.value = created.id;
  };

  // Photos dropped in from the desktop show themselves: their object URLs live as long as the window.
  const urls: string[] = [];
  onScopeDispose(() => urls.forEach((url) => URL.revokeObjectURL(url)));

  const upload = (files: File[], target: FolderEntry) => {
    record(`Uploaded ${files.length === 1 ? `“${files[0]!.name}”` : items(files.length)} to ${target.name}`);
    const added = files.map((file): FileEntry => {
      const url = THUMBNAIL.test(file.type) ? URL.createObjectURL(file) : undefined;
      if (url) urls.push(url);
      return { kind: 'file', id: newId(), name: file.name, size: file.size, modified: file.lastModified, url };
    });
    put(target, added, current.value);
    if (target.id === current.value.id) selection.set(added.map((entry) => entry.id));
  };

  // ─── Favorites ──────────────────────────────────────────────────────────────

  /** The sidebar's sortable list: folders in the Trash leave it. */
  const favoriteFolders = computed<FolderEntry[]>({
    get: () => favorites.value.flatMap((id) => (id === trash.value.id ? [] : (find(id) ?? []))),
    set: (next) => (favorites.value = next.map((entry) => entry.id)),
  });
  const isFavorite = (entry: Entry) => favorites.value.includes(entry.id);
  const toggleFavorite = (target: FolderEntry) => {
    record(isFavorite(target) ? `Removed ${target.name} from Favorites` : `Added ${target.name} to Favorites`, false);
    favorites.value = isFavorite(target) ? favorites.value.filter((id) => id !== target.id) : [...favorites.value, target.id];
  };

  // ─── The window's own state ─────────────────────────────────────────────────

  /** The info pane is open. */
  const info = ref(false);
  /** The context menu, where it opened: it acts on the selection, or on the open folder. */
  const menu = ref<{ x: number; y: number } | null>(null);
  /** The folder files from the desktop would go into: the native drop's target. */
  const uploadTarget = ref<string | null>(null);

  return {
    home, trash, current, currentId, inTrash, path, find, isTrash,
    history, future, open, back, forward, up,
    view, sort, sortBy, entries, selected, renaming,
    undos, notice, notify, record, undo,
    whyNot, placeOf, dropInto, duplicateOf, duplicate, moveToTrash, putBack, deleteForever, emptyTrash,
    rename, newFolder, upload,
    favoriteFolders, isFavorite, toggleFavorite,
    info, menu, uploadTarget,
  };
}

export type Drive = ReturnType<typeof createDrive>;
export const DRIVE: InjectionKey<Drive> = Symbol('drive');
