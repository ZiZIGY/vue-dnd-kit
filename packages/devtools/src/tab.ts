/**
 * The "Vue DnD Kit" tab in the Vue DevTools of `vite-plugin-vue-devtools`: added where our
 * Vite plugin (`@vue-dnd-kit/devtools/vite`) serves the tab, which it tells the page
 * (`__VUE_DND_KIT_DEVTOOLS_TAB__`, before the app's scripts run). Without that plugin
 * nothing is added: the Nuxt module adds the tab to the Nuxt DevTools itself.
 */

import { TAB_KEY } from './protocol';

/** Adds the tab to the Vue DevTools (once; the DevTools keep tabs by name). */
export const addTab = (): void => {
  const src = (globalThis as Record<string, unknown>)[TAB_KEY];
  if (typeof src !== 'string') return;
  import('@vue/devtools-api')
    .then(({ addCustomTab }) =>
      addCustomTab({
        name: 'vue-dnd-kit',
        title: 'Vue DnD Kit',
        // A path is an image to the DevTools.
        icon: `${src}icon.svg`,
        view: { type: 'iframe', src },
        category: 'app',
      }),
    )
    .catch((error: unknown) => console.error(error));
};
