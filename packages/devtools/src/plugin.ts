/**
 * The page's side of the devtools. Started once per page, before the apps mount: it
 * connects the core's devtools bridge (providers set up from then on report to it), adds
 * the tab to the Vue DevTools where our Vite plugin serves it (`tab.ts`), and answers the
 * tab over the page's channel (`protocol.ts`). The agent, which follows the providers and
 * sends the tab what it shows, is loaded when a tab first watches this page: until then
 * the page only records its providers.
 */

import { connectDevtools, type DevtoolsBridge } from '@vue-dnd-kit/core/devtools';
import { CHANNEL, PAGE_KEY, type PageMessage, type TabMessage } from './protocol';
import { addTab } from './tab';
import type { Agent } from './agent/agent';

interface Running {
  bridge: DevtoolsBridge;
  channel: BroadcastChannel | null;
  agent: Promise<Agent> | null;
}

let running: Running | null = null;

const pageId = () =>
  `page-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

/** Starts the page's side (once). */
export function start(): void {
  if (running) return;
  const bridge = connectDevtools();
  const current: Running = (running = { bridge, channel: null, agent: null });
  addTab();
  if (typeof BroadcastChannel === 'undefined') return;

  const page = pageId();
  (globalThis as Record<string, unknown>)[PAGE_KEY] = page;
  const channel = (current.channel = new BroadcastChannel(CHANNEL));
  const post = (message: PageMessage) => {
    try {
      channel.postMessage(message);
    } catch (error) {
      console.error(error);
    }
  };
  const announce = () => post({ type: 'page', page, title: document.title, url: location.href });
  const agent = () => (current.agent ??= import('./agent/agent').then(({ createAgent }) => createAgent(bridge, page, post)));

  channel.onmessage = ({ data }: MessageEvent<TabMessage>) => {
    if (data.type === 'hello') return announce();
    if (data.page !== page) return;
    if (data.type === 'watch') void agent().then((loaded) => loaded.watched(data.tab));
    else void agent().then((loaded) => loaded.command(data.command));
  };
  announce();
  addEventListener('pagehide', () => post({ type: 'bye', page }));
}

/** Stops the page's side (tests, hot reload): the agent, the channel, the bridge. */
export async function stop(): Promise<void> {
  const current = running;
  if (!current) return;
  running = null;
  current.channel?.close();
  delete (globalThis as Record<string, unknown>)[PAGE_KEY];
  (await current.agent)?.stop();
  current.bridge.disconnect();
}
