/**
 * `@vue-dnd-kit/devtools`: a Vue DevTools plugin for Vue DnD Kit. It adds the "Vue DnD
 * Kit" inspector (providers, their draggables, drop targets, sortable lists and trees,
 * the selection and the drag session; a selected node is highlighted on the page; its
 * items can be moved and dragged from it, through `@vue-dnd-kit/actions`) and a timeline
 * layer (drag start, targets, `onBeforeDrop` verdicts, drops, cancels, announcements,
 * auto-scroll).
 *
 * Production builds drop it: every entry point checks `process.env.NODE_ENV` first, so
 * bundlers remove the plugin and `@vue/devtools-api` with it.
 */

import type { App, Plugin } from 'vue';
import { autoSetup, setup } from './plugin';

/** Bundlers replace it: development builds keep the plugin, production drops it. */
declare const process: { env: { NODE_ENV?: string } };

/**
 * Sets the plugin up for `app`, as `app.use(DnDDevtools)` does. Call it before
 * `app.mount()`: providers set up earlier are not seen. Does nothing in production
 * builds and on the server.
 */
export function setupDnDDevtools(app: App): void {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') setup(app);
}

/**
 * Sets the plugin up for every app a `DnDProvider` renders in, from now on: what
 * `import '@vue-dnd-kit/devtools/auto'` does. Call it before the apps mount. Does
 * nothing in production builds and on the server.
 */
export function autoSetupDnDDevtools(): void {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') autoSetup();
}

/**
 * The plugin: `app.use(DnDDevtools)` before `app.mount()`. Open the Vue DevTools (the
 * browser extension or `vite-plugin-vue-devtools`): the "Vue DnD Kit" inspector and
 * timeline layer are there. Does nothing in production builds.
 */
export const DnDDevtools: Plugin = {
  install: (app: App) => setupDnDDevtools(app),
};
