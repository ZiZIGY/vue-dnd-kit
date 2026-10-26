/**
 * `@vue-dnd-kit/devtools`: devtools for Vue DnD Kit, as a "Vue DnD Kit" tab in the Nuxt
 * DevTools and in the Vue DevTools of `vite-plugin-vue-devtools` (or a window of its
 * own): a joystick that drags any item for real, a live mini-map of every list, tree and
 * drop target, live editing of the options, the providers' registry and state, and a log
 * of the drags. This entry runs in the app: it makes the page report to the tab. The tab
 * is served by the Vite plugin (`@vue-dnd-kit/devtools/vite`) or the Nuxt module.
 *
 * Production builds drop it: every entry point checks `process.env.NODE_ENV` first, so
 * bundlers remove the page's side and everything it loads.
 */

import type { App, Plugin } from 'vue';
import { start } from './plugin';

/** Bundlers replace it: development builds keep the devtools, production drops them. */
declare const process: { env: { NODE_ENV?: string } };

const enabled = () => process.env.NODE_ENV !== 'production' && typeof window !== 'undefined';

/**
 * Makes the page report to the devtools tab, as `app.use(DnDDevtools)` does. Call it
 * before `app.mount()`: providers set up earlier are not seen. Every provider of the page
 * is shown, whichever app it renders in. Does nothing in production builds and on the
 * server.
 */
export function setupDnDDevtools(_app?: App): void {
  if (enabled()) start();
}

/**
 * The same without an app: what `import '@vue-dnd-kit/devtools/auto'` does (and what the
 * Vite plugin injects). Call it before the apps mount. Does nothing in production builds
 * and on the server.
 */
export function autoSetupDnDDevtools(): void {
  if (enabled()) start();
}

/**
 * The plugin: `app.use(DnDDevtools)` before `app.mount()`. Then open the "Vue DnD Kit" tab
 * of the Nuxt DevTools or the Vue DevTools (`vite-plugin-vue-devtools`). Does nothing in
 * production builds.
 */
export const DnDDevtools: Plugin = {
  install: (app: App) => setupDnDDevtools(app),
};
