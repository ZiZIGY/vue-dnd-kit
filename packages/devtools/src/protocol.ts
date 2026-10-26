/**
 * What the page (the agent, `agent/`) and the tab (`client/`) tell each other: plain data
 * over a `BroadcastChannel` of the page's origin. The tab is a page of the dev server, the
 * same origin as the app, whether it runs in the DevTools (an iframe) or in a window of
 * its own; several tabs may watch one page, and one tab may choose among several pages.
 *
 * Shared by the agent and the tab app: types and constants only.
 */

export const CHANNEL = 'vue-dnd-kit-devtools';
/** Where the dev server serves the tab (under Vite's `base`). */
export const TAB_ROUTE = '/__vue-dnd-kit-devtools/';
/** Set in the page by the Vite plugin: the tab's URL, for the Vue DevTools (`tab.ts`). */
export const TAB_KEY = '__VUE_DND_KIT_DEVTOOLS_TAB__';
/** Set by the page: its id, for a tab that runs in it (the DevTools in the page). */
export const PAGE_KEY = '__VUE_DND_KIT_DEVTOOLS_PAGE__';
/** A tab says it still watches this often; a page stops sending once it hasn't heard of one for `WATCH_TIMEOUT`. */
export const WATCH_INTERVAL = 1000;
export const WATCH_TIMEOUT = 3500;

export type Key = string | number;
export type Literal = string | number | boolean | null;

/**
 * A value as the tab shows it: JSON-like data, with what can't be sent (functions,
 * elements, `undefined`, maps, sets, cycles, the rest of a long list) as tagged objects.
 */
export type Preview = Literal | Preview[] | { [key: string]: Preview };
/** The tag of a special value in a `Preview`: `{ [TAG]: 'function', label: 'onDrop' }`. */
export const TAG = '__dnd';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ─── Views of the page ─────────────────────────────────────────────────────────

/** An option with its editor. */
export interface OptionView {
  name: string;
  /** What the library uses now. */
  value: Preview;
  /** As the code gives it. */
  code: Preview;
  overridden: boolean;
  /** Values offered as buttons. */
  choices?: Literal[];
  /**
   * Other values: a number, a text, a JSON object (`template` fills it), or names of the
   * library's own functions (`names`; `several` for a list: modifiers).
   */
  input?: 'number' | 'text' | 'json' | 'names';
  template?: Preview;
  names?: string[];
  several?: boolean;
  /** The library's default, when the option is unset. */
  fallback?: string;
}

/** What an override applies to (as `OverrideTarget` of the bridge). */
export type TargetRef = { kind: 'provider' } | { kind: 'list' | 'draggable' | 'droppable'; id: Key };

export interface OverrideView {
  target: TargetRef;
  option: string;
  value: Preview;
}

export interface DraggableView {
  id: Key;
  /** Its list or tree; `null` for a plain draggable. */
  list: Key | null;
  type: string[];
  disabled: boolean;
  selected: boolean;
  dragging: boolean;
}

export interface DroppableView {
  id: Key;
  accept: string;
  priority: number;
  disabled: boolean;
  over: boolean;
  accepting: boolean | null;
  options: OptionView[];
}

export interface ListView {
  id: Key;
  kind: 'list' | 'tree';
  group: string;
  count: number;
  /** Keys in order (the draft while dragging), the first `MAX_KEYS`. */
  keys: Key[];
  drafting: boolean;
  disabled: boolean;
  controlled: boolean;
  over: boolean;
  accepting: boolean | null;
  options: OptionView[];
}

export interface SessionView {
  status: string;
  active: { id: Key; ids: Key[]; type: string[]; sensor: string } | null;
  over: { id: Key; accepted: boolean } | null;
  mode: string;
  pointer: { x: number; y: number } | null;
  settling: boolean;
  autoScrolling: boolean;
  announcement: string;
}

export interface ProviderView {
  id: string;
  label: string;
  status: string;
  options: OptionView[];
  lists: ListView[];
  /** Plain drop targets (lists' are in `lists`). */
  droppables: DroppableView[];
  /** Mounted draggables, sortable items too. */
  draggables: DraggableView[];
  selection: Key[];
  session: SessionView;
  overrides: OverrideView[];
}

/** A node of the tab's tree: what it shows details of. */
export type NodeRef =
  | { provider: string; kind: 'provider' | 'session' }
  | { provider: string; kind: 'list' | 'draggable' | 'droppable'; id: Key };

export interface Section {
  name: string;
  fields: Array<[string, Preview]>;
}

export interface DetailView {
  node: NodeRef;
  mounted: boolean;
  sections: Section[];
  /** A draggable's options (lists, drop targets and providers have theirs in their view). */
  options: OptionView[];
}

// ─── Mini-map ──────────────────────────────────────────────────────────────────

export interface ItemFrame {
  id: Key;
  rect: Rect;
  /** Its copy (`CopiesMessage`). */
  copy: number;
  placeholder: boolean;
  dragging: boolean;
  selected: boolean;
  disabled: boolean;
}

export interface ZoneFrame {
  provider: string;
  /** The list or drop target; `null` for the plain draggables outside every zone. */
  id: Key | null;
  kind: 'list' | 'tree' | 'droppable' | 'free';
  rect: Rect;
  /** Copy of the zone without its items, inside the classes of its ancestors (page CSS matches it). */
  shell: number;
  over: boolean;
  accepting: boolean | null;
  disabled: boolean;
  items: ItemFrame[];
}

export interface MapFrame {
  zones: ZoneFrame[];
  pointer: { x: number; y: number } | null;
  /** The overlay box. */
  overlay: Rect | null;
  /** The insertion line of an `indicator` list, in page coordinates. */
  indicator: { provider: string; list: Key; rect: Rect } | null;
}

// ─── Event log ─────────────────────────────────────────────────────────────────

export interface LogEntry {
  id: number;
  time: number;
  provider: string;
  /** Drag number at the provider: the events of one drag share it. */
  drag: number | null;
  title: string;
  subtitle: string;
  level: 'default' | 'warning';
  data: Preview;
}

// ─── Messages ──────────────────────────────────────────────────────────────────

export type PageMessage =
  | { type: 'page'; page: string; title: string; url: string }
  | { type: 'bye'; page: string }
  | { type: 'state'; page: string; providers: ProviderView[]; detail: DetailView | null }
  | { type: 'frame'; page: string; frame: MapFrame }
  | { type: 'copies'; page: string; copies: Array<[number, string]> }
  | { type: 'styles'; page: string; css: string }
  /** What the overlay shows, copied (`null` without a drag). */
  | { type: 'preview'; page: string; html: string | null; size: { w: number; h: number } | null }
  | { type: 'log'; page: string; entries: LogEntry[]; clear?: boolean }
  /** Picking on the page: on, off, or what was picked. */
  | { type: 'pick'; page: string; on: boolean; picked?: NodeRef };

/** Moves of an item of a sortable list by a keyboard drag (`@vue-dnd-kit/actions`). */
export type MoveTo = 'up' | 'down' | 'start' | 'end' | { list: Key; index?: number };

export type Command =
  /** Shows a node's details, highlights its element. */
  | { type: 'select'; node: NodeRef | null }
  /** Scrolls a node's element into view and highlights it. */
  | { type: 'reveal'; node: NodeRef }
  /**
   * The joystick: where the knob is (`x`, `y` in -1…1; 0, 0 when released). Starts a drag
   * of `grab` when the provider has none.
   */
  | { type: 'stick'; x: number; y: number; grab?: { provider: string; id: Key } }
  | { type: 'drop' }
  | { type: 'cancel' }
  | { type: 'pick'; on: boolean }
  | { type: 'move'; provider: string; id: Key; to: MoveTo }
  /** `value` is what the editor made: a literal, an object, or `{ [TAG]: 'names', names }`. */
  | { type: 'override'; provider: string; target: TargetRef; option: string; value: Preview }
  /** No provider: every override of the page. */
  | { type: 'reset'; provider?: string; target?: TargetRef; option?: string }
  | { type: 'clearSelection'; provider: string }
  | { type: 'clearLog' };

export type TabMessage =
  | { type: 'hello'; tab: string }
  | { type: 'watch'; tab: string; page: string }
  | { type: 'command'; tab: string; page: string; command: Command };
