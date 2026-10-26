/**
 * The tab as the page sees it: a `BroadcastChannel` stand-in (instances of one name hear
 * each other's messages, structured-cloned as the browser does: what can't be sent fails
 * here too), and a tab on it that watches the page and keeps what it is sent.
 */

import { vi } from 'vitest';
import type { Command, PageMessage, TabMessage } from '../src/protocol';

type Listener = ((event: { data: unknown }) => void) | null;

/** `BroadcastChannel`, in one process: delivered in a microtask, never to the sender. */
export class FakeChannel {
  static open: FakeChannel[] = [];
  onmessage: Listener = null;
  constructor(readonly name: string) {
    FakeChannel.open.push(this);
  }
  postMessage(data: unknown) {
    const copy = structuredClone(data);
    for (const other of FakeChannel.open) {
      if (other !== this && other.name === this.name) queueMicrotask(() => other.onmessage?.({ data: copy }));
    }
  }
  close() {
    FakeChannel.open = FakeChannel.open.filter((channel) => channel !== this);
  }
}

export const installChannel = () => {
  FakeChannel.open = [];
  vi.stubGlobal('BroadcastChannel', FakeChannel);
};

export interface Tab {
  /** Every message of the page, in order. */
  messages: PageMessage[];
  /** The last message of a type. */
  last<T extends PageMessage['type']>(type: T): Extract<PageMessage, { type: T }> | undefined;
  /** Waits for a message of `type` that `check` accepts, after the ones already in. */
  next<T extends PageMessage['type']>(type: T, check?: (message: Extract<PageMessage, { type: T }>) => boolean): Promise<Extract<PageMessage, { type: T }>>;
  /** Waits until `check` holds for the messages so far. */
  until(check: (messages: PageMessage[]) => boolean): Promise<void>;
  /** The log entries sent, announcements left out. */
  logged(): string[];
  send(command: Command): void;
  close(): void;
}

/** A tab on the channel: says hello, watches the page that answers. */
export const openTab = async (): Promise<Tab> => {
  const channel = new FakeChannel('vue-dnd-kit-devtools');
  const messages: PageMessage[] = [];
  let page = '';
  channel.onmessage = ({ data }) => {
    const message = data as PageMessage;
    if (message.type === 'page') page ||= message.page;
    messages.push(message);
  };
  const post = (message: TabMessage) => channel.postMessage(message);
  post({ type: 'hello', tab: 'tab-1' });
  await vi.waitFor(() => {
    if (!page) throw new Error('no page');
  });
  post({ type: 'watch', tab: 'tab-1', page });
  const ofType = <T extends PageMessage['type']>(type: T) =>
    messages.filter((message): message is Extract<PageMessage, { type: T }> => message.type === type);
  const tab: Tab = {
    messages,
    last: (type) => ofType(type).at(-1),
    async next(type, check = () => true) {
      const from = messages.length;
      return vi.waitFor(
        () => {
          const found = messages.slice(from).find((message) => message.type === type && check(message as never));
          if (!found) throw new Error(`no ${type} message`);
          return found as never;
        },
        { timeout: 3000 },
      );
    },
    until: (check) =>
      vi.waitFor(
        () => {
          if (!check(messages)) throw new Error('not yet');
        },
        { timeout: 3000 },
      ),
    logged: () =>
      ofType('log')
        .flatMap((message) => message.entries)
        .filter((entry) => entry.title !== 'announcement')
        .map((entry) => `${entry.title}: ${entry.subtitle}`),
    send: (command) => post({ type: 'command', tab: 'tab-1', page, command }),
    close: () => channel.close(),
  };
  await tab.next('state');
  return tab;
};
