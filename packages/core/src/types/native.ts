/**
 * The browser's own drag and drop (HTML5): drags from outside the page into its targets
 * (`external`), drags of the library's items out of it (`native`), and between windows.
 */

import type { Active } from './drag';

/**
 * A file of a drag from outside, as `ExternalAccept.files` is asked about it. While the
 * files are held over the page the browser tells their types only: `name` and `size`
 * come at the drop.
 */
export interface ExternalFile {
  /** Its MIME type (`image/png`); `''` when the browser can't tell. */
  type: string;
  name?: string;
  size?: number;
}

/**
 * What a drop target, list or tree takes from drags that come from outside the page: files
 * from the desktop, a link or text from another app or tab (`external`).
 */
export interface ExternalAccept {
  /**
   * Files: `true` takes any. Or as `<input accept>` has it: MIME types (`image/*`,
   * `application/pdf`) and extensions (`.md`), a string with commas or a list; extensions
   * are checked at the drop. Or a function asked about each file (`false` refuses it).
   * Folders are never taken.
   */
  files?: boolean | string | readonly string[] | ((file: ExternalFile) => boolean);
  /** Several files at once (default `true`); `false` refuses a drag of more than one. */
  multiple?: boolean;
  /** Links (`text/uri-list`): an address dragged from another tab, a link from a page. */
  links?: boolean;
  /** Plain text (`text/plain`): a selection dragged from another app. */
  text?: boolean;
  /** Other MIME types it takes, exactly as other apps offer them. */
  types?: readonly string[];
}

/**
 * A drag from outside the page (`Active.external`, `DnDEvent.external`). While it is held
 * the browser tells what it carries, not the data: the files, links and text come at the
 * drop (`dropped`).
 */
export interface ExternalData {
  /** The MIME types it offers (`Files`, `text/uri-list`, `text/plain`, an app's own). */
  types: readonly string[];
  /** The MIME types of its files, one per file (`''` when the browser can't tell). */
  fileTypes: readonly string[];
  /** At the drop: the files the target takes (folders and refused files left out). */
  files: readonly File[];
  /** At the drop: its links (`text/uri-list`). */
  urls: readonly string[];
  /** At the drop: its plain text. */
  text: string;
  /** At the drop: its HTML. */
  html: string;
  /** At the drop: the data of any type it offers (`''` before, and for a type it doesn't offer). */
  getData(type: string): string;
  /** It was dropped: the data above is there. */
  dropped: boolean;
  /**
   * Items of the library dragged in from another window of the app (`native`): the name of
   * their sortable group. The lists of that group take them as if they came from one of
   * their own lists; `active.items` has them.
   */
  group?: string;
}

/**
 * A draggable or sortable item that a mouse can drag out of the page (`native`): onto the
 * desktop, into another app, another tab, another window of the app.
 */
export interface NativeDragOptions {
  /**
   * What other apps and pages get: MIME type → text, e.g. `{ 'text/plain': title,
   * 'text/uri-list': url }`. Read when the drag starts. Sortable items also carry
   * themselves, for the lists of their group in another window of the app.
   */
  data?: (active: Active) => Record<string, string>;
  /**
   * What the drag lets the place it is dropped on do (`effectAllowed`). Default
   * `'copyMove'`: a move takes the items out of their list here, a copy leaves them.
   */
  effect?: 'copy' | 'move' | 'link' | 'copyMove' | 'copyLink' | 'linkMove' | 'all';
}
