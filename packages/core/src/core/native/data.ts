/**
 * What the browser's drags carry (`DataTransfer`), as the library reads it: while a drag
 * is held over the page only the types are known (and the files' MIME types), the data
 * comes with the drop. Also how a window of the app hands its items to another one.
 */

import type { DragItem, ExternalAccept, ExternalData, ExternalFile } from '../../types';

/** The items of a drag out of a window of the app, as JSON (readable at the drop). */
export const ITEMS_TYPE = 'application/x-vue-dnd-kit';

/**
 * The same, readable while the drag is held: browsers show the types of a drag before the
 * drop, never its data, so the items ride in a type's name, hex-encoded (types are
 * lowercased). Up to `HINT_LIMIT` characters; past that, only the group name.
 */
const HINT_PREFIX = 'application/x-vue-dnd-kit.';
const HINT_LIMIT = 32_000;

/** The items of a window's drag, as another window reads them. */
export interface RemotePayload {
  group: string;
  items: Array<Pick<DragItem, 'id' | 'item' | 'data' | 'label' | 'type'>>;
}

const toHex = (text: string) => [...new TextEncoder().encode(text)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const fromHex = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index++) bytes[index] = parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  return new TextDecoder().decode(bytes);
};

/** Puts a window's items on its drag (`dragstart`); `false` when they can't be written as JSON. */
export const writeRemote = (transfer: DataTransfer, payload: RemotePayload): boolean => {
  let json: string;
  try {
    json = JSON.stringify(payload);
  } catch {
    return false;
  }
  transfer.setData(ITEMS_TYPE, json);
  const hint = toHex(json);
  transfer.setData(HINT_PREFIX + (hint.length <= HINT_LIMIT ? hint : toHex(JSON.stringify({ group: payload.group, items: [] }))), '1');
  return true;
};

/** The items another window's drag carries, from the names of its types (while it is held). */
export const readRemoteHint = (types: readonly string[]): RemotePayload | null => {
  const hint = types.find((type) => type.startsWith(HINT_PREFIX));
  if (!hint) return null;
  try {
    const payload = JSON.parse(fromHex(hint.slice(HINT_PREFIX.length))) as RemotePayload;
    return typeof payload.group === 'string' && Array.isArray(payload.items) ? payload : null;
  } catch {
    return null;
  }
};

/** The same, from its data (at the drop). */
export const readRemote = (transfer: DataTransfer): RemotePayload | null => {
  try {
    const payload = JSON.parse(transfer.getData(ITEMS_TYPE)) as RemotePayload;
    return typeof payload.group === 'string' && Array.isArray(payload.items) ? payload : null;
  } catch {
    return null;
  }
};

/** A drag the browser carries: files, links, text, an app's own types, or a window's items. */
export const carries = (transfer: DataTransfer | null): transfer is DataTransfer => !!transfer?.types.length;

/** What a drag held over the page carries, before its data comes (`ExternalData`). */
export const readHeld = (transfer: DataTransfer, group?: string): ExternalData => {
  const types = [...transfer.types];
  const fileTypes = [...transfer.items].filter((item) => item.kind === 'file').map((item) => item.type);
  return {
    types,
    // Some browsers list no items while the drag is held: one file for the `Files` type then.
    fileTypes: fileTypes.length || !types.includes('Files') ? fileTypes : [''],
    files: [],
    urls: [],
    text: '',
    html: '',
    getData: () => '',
    dropped: false,
    group,
  };
};

const tokensOf = (accept: string | readonly string[]) =>
  (typeof accept === 'string' ? accept.split(',') : accept).map((token) => token.trim().toLowerCase()).filter(Boolean);

/** Whether `files` of `ExternalAccept` takes `file`. A name not known yet passes the extensions. */
export const takesFile = (rule: ExternalAccept['files'], file: ExternalFile): boolean => {
  if (!rule) return false;
  if (rule === true) return true;
  if (typeof rule === 'function') return rule(file);
  const tokens = tokensOf(rule);
  const type = file.type.toLowerCase();
  return (
    !tokens.length ||
    tokens.some((token) => {
      if (token.startsWith('.')) return file.name === undefined || file.name.toLowerCase().endsWith(token);
      return token.endsWith('/*') ? type.startsWith(token.slice(0, -1)) : type === token;
    })
  );
};

/**
 * Whether a target with `rule` takes the drag `external` from outside the page: files it
 * takes (all of them, and one only without `multiple`), links, text or a type it lists.
 */
export const takesExternal = (rule: ExternalAccept | undefined, external: ExternalData): boolean => {
  if (!rule || external.group) return false;
  const { types } = external;
  if (rule.types?.some((type) => types.includes(type.toLowerCase()))) return true;
  const files = external.dropped ? external.files.map((file) => ({ type: file.type, name: file.name, size: file.size })) : external.fileTypes.map((type) => ({ type }));
  if (types.includes('Files') && rule.files) {
    if (rule.multiple === false && files.length > 1) return false;
    if (files.length && files.every((file) => takesFile(rule.files, file))) return true;
  }
  if (rule.links && types.includes('text/uri-list')) return true;
  return !!rule.text && types.includes('text/plain') && !types.includes('Files');
};

/**
 * Reads the data of a dropped drag into `external`: the files `rule` takes (folders left
 * out), the links, the text and the HTML. Only in the `drop` event: the browser empties
 * the `DataTransfer` after it.
 */
export const readDropped = (external: ExternalData, transfer: DataTransfer, rule: ExternalAccept | undefined): void => {
  const files = [...transfer.items]
    .filter((item) => item.kind === 'file' && !item.webkitGetAsEntry?.()?.isDirectory)
    .map((item) => item.getAsFile())
    .filter((file): file is File => !!file);
  const data = new Map<string, string>();
  for (const type of transfer.types) if (type !== 'Files') data.set(type, transfer.getData(type));
  const uriList = data.get('text/uri-list') ?? '';
  Object.assign(external, {
    files: rule?.files ? files.filter((file) => takesFile(rule.files, { type: file.type, name: file.name, size: file.size })) : [],
    urls: uriList
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#')),
    text: data.get('text/plain') ?? '',
    html: data.get('text/html') ?? '',
    getData: (type: string) => data.get(type.toLowerCase()) ?? '',
    dropped: true,
  } satisfies Partial<ExternalData>);
};

/**
 * The items of a drag from outside: one per file (`type: ['file']`, its MIME type as
 * `data`), else one for what it carries (`'link'`, `'text'`, `'data'`).
 */
export const externalItems = (id: string, external: ExternalData): DragItem[] => {
  if (external.fileTypes.length) {
    return external.fileTypes.map((type, index) => ({ id: `${id}:${index}`, data: { type }, type: ['file'] }));
  }
  const { types } = external;
  const kind = types.includes('text/uri-list') ? 'link' : types.includes('text/plain') ? 'text' : 'data';
  return [{ id, data: { types }, type: [kind] }];
};

/** What people call a drag from outside: "2 files", "a link". */
export const externalLabel = (external: ExternalData): string => {
  const count = external.fileTypes.length;
  if (count) return count === 1 ? 'a file' : `${count} files`;
  const { types } = external;
  return types.includes('text/uri-list') ? 'a link' : types.includes('text/plain') ? 'text' : 'data';
};
