/**
 * The "Vue DnD Kit" tab in the Nuxt DevTools, when the app has `@vue-dnd-kit/devtools`.
 * In development only: the dev server serves the tab (the package's prebuilt app, with
 * its own middleware), the Nuxt DevTools get it as a custom tab (an iframe of that route),
 * and a client plugin makes the page report to it (`DnDDevtools`, before the app mounts).
 * Production builds get nothing of it.
 */

import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { addPluginTemplate } from '@nuxt/kit';
import { addCustomTab } from '@nuxt/devtools-kit';
import type { Nuxt } from '@nuxt/schema';
import type { IncomingMessage, ServerResponse } from 'node:http';

export const DEVTOOLS_PACKAGE = '@vue-dnd-kit/devtools';

/** What the module takes from `@vue-dnd-kit/devtools/vite`. */
export interface DevtoolsServer {
  TAB_ROUTE: string;
  serveTab(): (request: IncomingMessage, response: ServerResponse, next: (error?: unknown) => void) => void;
}

/** `@vue-dnd-kit/devtools/vite` as the app resolves it; `null` when the app doesn't have it. */
export const loadDevtools = async (rootDir: string): Promise<DevtoolsServer | null> => {
  let entry: string;
  try {
    entry = createRequire(join(rootDir, 'package.json')).resolve(`${DEVTOOLS_PACKAGE}/vite`);
  } catch {
    return null;
  }
  return (await import(pathToFileURL(entry).href)) as DevtoolsServer;
};

/** The client plugin: the page reports to the tab from before the app mounts. */
const PLUGIN = `import { defineNuxtPlugin } from '#imports';
import { DnDDevtools } from '${DEVTOOLS_PACKAGE}';

export default defineNuxtPlugin({
  name: 'vue-dnd-kit:devtools',
  enforce: 'pre',
  setup: (nuxtApp) => {
    nuxtApp.vueApp.use(DnDDevtools);
  },
});
`;

/**
 * Sets the tab up for `nuxt` when it runs in development and the app has the devtools
 * package (`load` finds it). Returns whether it did.
 */
export async function setupDevtools(nuxt: Nuxt, load = loadDevtools): Promise<boolean> {
  if (!nuxt.options.dev) return false;
  const devtools = await load(nuxt.options.rootDir);
  if (!devtools) return false;
  const route = devtools.TAB_ROUTE;
  nuxt.hook('vite:serverCreated', (server, { isClient }) => {
    if (isClient) server.middlewares.use(route.slice(0, -1), devtools.serveTab());
  });
  addCustomTab(
    {
      name: 'vue-dnd-kit',
      title: 'Vue DnD Kit',
      icon: `${route}icon.svg`,
      view: { type: 'iframe', src: route },
    },
    nuxt,
  );
  addPluginTemplate({ filename: 'vue-dnd-kit-devtools.client.mjs', mode: 'client', getContents: () => PLUGIN });
  return true;
}
