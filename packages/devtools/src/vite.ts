/**
 * `@vue-dnd-kit/devtools/vite`: the devtools tab on Vite's dev server. The plugin serves
 * the tab at `/__vue-dnd-kit-devtools/` (under `base`) and puts two scripts in the page:
 * one tells where the tab is (the page adds it to the Vue DevTools of
 * `vite-plugin-vue-devtools`), one makes the page report to it, as
 * `import '@vue-dnd-kit/devtools/auto'` does. Development only (`vite serve`): builds are
 * left as they are.
 *
 * The tab is the package's prebuilt app (`dist/client`). In this repository, where the
 * tab's sources sit next to this file, the dev server compiles them instead (hot updates
 * included) when the app's config compiles Vue files.
 *
 * Runs in Node; nothing here reaches the page but the scripts it injects.
 */

import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { TAB_KEY, TAB_ROUTE } from './protocol';

export { TAB_ROUTE };

export interface DnDDevtoolsViteOptions {
  /**
   * Makes the page report to the tab, as `import '@vue-dnd-kit/devtools/auto'` does.
   * Default `true`; with `false`, install `DnDDevtools` yourself (`app.use`).
   */
  inject?: boolean;
}

const here = dirname(fileURLToPath(import.meta.url));

/** The prebuilt tab: next to the built plugin (`dist/client`), or the package's build from its sources. */
export const clientDir = (): string => {
  const built = resolve(here, 'client');
  return existsSync(resolve(built, 'index.html')) ? built : resolve(here, '../dist/client');
};

/** The tab's sources, in this repository only (the package publishes its build). */
const sourceDir = resolve(here, '../client');

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.map': 'application/json',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

type Next = (error?: unknown) => void;

/**
 * Serves the files of `dir` (the prebuilt tab) to requests under the tab's route (their
 * `url` without it, as `connect` hands them): `index.html` for the route itself. Requests
 * outside `dir` go on to `next`.
 */
export const serveTab =
  (dir = clientDir()) =>
  (request: IncomingMessage, response: ServerResponse, next: Next): void => {
    const path = decodeURIComponent((request.url ?? '/').split(/[?#]/)[0]!);
    const file = resolve(dir, `.${path.endsWith('/') ? `${path}index.html` : path}`);
    if (!file.startsWith(dir + sep) || !existsSync(file) || !statSync(file).isFile()) return next();
    response.setHeader('Content-Type', TYPES[extname(file)] ?? 'application/octet-stream');
    response.setHeader('Cache-Control', 'no-cache');
    createReadStream(file).pipe(response);
  };

const VIRTUAL = 'virtual:vue-dnd-kit-devtools';

/** `/base/` of the dev server, with both slashes. */
const baseOf = (base: string) => `/${base.replace(/^\.?\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');

/** The Vite plugin: the devtools tab on the dev server, and the page reporting to it. */
export function vueDnDKitDevtools(options: DnDDevtoolsViteOptions = {}): Plugin {
  const { inject = true } = options;
  let route = TAB_ROUTE;

  return {
    name: 'vue-dnd-kit:devtools',
    apply: 'serve',
    configResolved(config) {
      route = `${baseOf(config.base)}${TAB_ROUTE.slice(1)}`;
    },
    resolveId: (id) => (id === VIRTUAL ? `\0${VIRTUAL}` : null),
    load: (id) =>
      id === `\0${VIRTUAL}` ? `import { autoSetupDnDDevtools } from '@vue-dnd-kit/devtools';\nautoSetupDnDDevtools();\n` : null,
    configureServer(server) {
      const compiles = server.config.plugins.some((plugin) => plugin.name === 'vite:vue');
      const fromSources = compiles && existsSync(resolve(sourceDir, 'index.html'));
      const serve = serveTab();
      server.middlewares.use(route.slice(0, -1), (request, response, next) => {
        const path = (request.url ?? '/').split(/[?#]/)[0];
        // The route without its slash: relative URLs of the tab need it.
        if (path === '' || (request.originalUrl ?? '').split('?')[0] === route.slice(0, -1)) {
          response.statusCode = 302;
          response.setHeader('Location', route);
          return response.end();
        }
        if (!fromSources) return serve(request, response, next);
        if (path === '/icon.svg') return serveTab(resolve(sourceDir, 'public'))(request, response, next);
        if (path !== '/' && path !== '/index.html') return next();
        // The sources: the app's dev server compiles them like its own. Not through the
        // page's HTML transforms: they would put the app's scripts (ours, the DevTools') in.
        const base = baseOf(server.config.base);
        const entry = `${base}@fs/${resolve(sourceDir, 'main.ts').replace(/\\/g, '/').replace(/^\//, '')}`;
        const html = readFileSync(resolve(sourceDir, 'index.html'), 'utf-8').replace(
          /<script type="module" src="\.\/main\.ts"><\/script>/,
          `<script type="module" src="${base}@vite/client"></script><script type="module" src="${entry}"></script>`,
        );
        response.setHeader('Content-Type', TYPES['.html']!);
        response.end(html);
      });
    },
    transformIndexHtml: () => [
      // Before the app's scripts: the page adds the tab to the Vue DevTools as it starts.
      { tag: 'script', injectTo: 'head-prepend', children: `window.${TAB_KEY} = ${JSON.stringify(route)};` },
      ...(inject
        ? [{ tag: 'script', attrs: { type: 'module', src: `${route.replace(TAB_ROUTE, '/')}@id/${VIRTUAL}` }, injectTo: 'head' as const }]
        : []),
    ],
  };
}

export default vueDnDKitDevtools;
