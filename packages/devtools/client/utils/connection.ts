/**
 * The tab's side of the channel (`src/protocol.ts`): the pages it can watch, the one it
 * watches, and what that page sends (state, mini-map, copies, CSS, preview, log). A tab
 * in the DevTools of a page watches that page; a tab in a window of its own watches the
 * page that announced itself last, or the one chosen in the list.
 */

import { shallowReactive, shallowRef } from 'vue';
import {
  CHANNEL,
  PAGE_KEY,
  WATCH_INTERVAL,
  type Command,
  type DetailView,
  type LogEntry,
  type MapFrame,
  type NodeRef,
  type PageMessage,
  type ProviderView,
  type TabMessage,
} from '../../src/protocol';

export interface PageInfo {
  page: string;
  title: string;
  url: string;
}

/** Most log entries kept in the tab. */
const KEPT = 1000;

const tab = `tab-${Math.random().toString(36).slice(2, 10)}`;

/** The page the tab runs in, when it runs in the DevTools of a page of the same origin. */
const hostPage = (): string | null => {
  try {
    const id = (window.top as unknown as Record<string, unknown> | null)?.[PAGE_KEY];
    return typeof id === 'string' ? id : null;
  } catch {
    return null;
  }
};

interface Store {
  pages: PageInfo[];
  page: string | null;
  /** The page's state came in once at least. */
  ready: boolean;
  providers: ProviderView[];
  detail: DetailView | null;
  picking: boolean;
  /** The node shown in details, chosen in the tree or the map. */
  selected: NodeRef | null;
}

/** Shallow: what the page sends is replaced as a whole, and stays plain data (it is sent back in commands). */
export const store = shallowReactive<Store>({
  pages: [],
  page: null,
  ready: false,
  providers: [],
  detail: null,
  picking: false,
  selected: null,
});

/** Sent often: not deep reactive. */
export const frame = shallowRef<MapFrame | null>(null);
export const preview = shallowRef<{ html: string; size: { w: number; h: number } } | null>(null);
export const css = shallowRef('');
export const log = shallowRef<LogEntry[]>([]);
/** Copies of elements by id (`copies` messages); `copiesVersion` changes with them. */
export const copies = new Map<number, string>();
export const copiesVersion = shallowRef(0);

let channel: BroadcastChannel | null = null;

const post = (message: TabMessage) => channel?.postMessage(message);

/** Runs `command` in the watched page. A copy as JSON: a reactive proxy in it couldn't be sent. */
export const send = (command: Command): void => {
  if (store.page) post({ type: 'command', tab, page: store.page, command: JSON.parse(JSON.stringify(command)) as Command });
};

const reset = () => {
  store.ready = false;
  store.providers = [];
  store.detail = null;
  store.picking = false;
  frame.value = null;
  preview.value = null;
  log.value = [];
  copies.clear();
};

/** Watches `page` from now on. */
export const choose = (page: string | null): void => {
  if (store.page === page) return;
  store.page = page;
  reset();
  if (!page) return;
  post({ type: 'watch', tab, page });
  // A reloaded page: the node shown stays shown (if it is there again).
  if (store.selected) send({ type: 'select', node: store.selected });
};

const receive = (message: PageMessage) => {
  if (message.type === 'page') {
    const info = { page: message.page, title: message.title, url: message.url };
    store.pages = [...store.pages.filter((entry) => entry.page !== message.page), info];
    const host = hostPage();
    // The page around the tab; else the newest one, unless one is watched already.
    if (host ? message.page === host : !store.pages.some((entry) => entry.page === store.page)) choose(message.page);
    return;
  }
  if (message.type === 'bye') {
    store.pages = store.pages.filter((entry) => entry.page !== message.page);
    if (store.page === message.page) choose(hostPage() ? null : (store.pages.at(-1)?.page ?? null));
    return;
  }
  if (message.page !== store.page) return;
  switch (message.type) {
    case 'state':
      store.providers = message.providers;
      store.detail = message.detail;
      store.ready = true;
      break;
    case 'frame':
      frame.value = message.frame;
      break;
    case 'copies':
      for (const [id, html] of message.copies) copies.set(id, html);
      copiesVersion.value++;
      break;
    case 'styles':
      css.value = message.css;
      break;
    case 'preview':
      preview.value = message.html && message.size ? { html: message.html, size: message.size } : null;
      break;
    case 'log': {
      const entries = message.clear ? message.entries : [...log.value, ...message.entries];
      log.value = entries.length > KEPT ? entries.slice(-KEPT) : entries;
      break;
    }
    case 'pick':
      store.picking = message.on;
      if (message.picked) select(message.picked);
      break;
  }
};

/** Shows `node` in details (and highlights it on the page). */
export const select = (node: NodeRef | null): void => {
  store.selected = node;
  send({ type: 'select', node });
};

/** Opens the channel: asks the pages to announce themselves, then says it watches one, every second. */
export function connect(): void {
  if (channel || typeof BroadcastChannel === 'undefined') return;
  channel = new BroadcastChannel(CHANNEL);
  channel.onmessage = ({ data }: MessageEvent<PageMessage>) => receive(data);
  post({ type: 'hello', tab });
  setInterval(() => {
    if (store.page) post({ type: 'watch', tab, page: store.page });
    else post({ type: 'hello', tab });
  }, WATCH_INTERVAL);
}
