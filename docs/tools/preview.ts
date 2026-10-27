/**
 * Serves the static site (`.output/public`, from `nuxt generate`) under the path GitHub Pages
 * gives it, `/vue-dnd-kit/`: every page asks for `/vue-dnd-kit/_nuxt/…`, which a plain static
 * server at `/` (`npx serve`) answers with 404s.
 *
 *   node tools/preview.ts            http://localhost:4173/vue-dnd-kit/
 *   PORT=5000 node tools/preview.ts
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The site's `app.baseURL` (nuxt.config.ts), without the trailing slash. */
const BASE = '/vue-dnd-kit';
const root = fileURLToPath(new URL('../.output/public', import.meta.url));
const port = Number(process.env.PORT ?? 4173);

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml',
  '.wasm': 'application/wasm',
  '.sql': 'text/plain; charset=utf-8',
};

/** The file a path stands for: a folder's `index.html`; `null` when there is none. */
const fileOf = async (path: string): Promise<string | null> => {
  const file = join(root, normalize(path));
  if (!file.startsWith(root + sep) && file !== root) return null;
  try {
    return (await stat(file)).isDirectory() ? join(file, 'index.html') : file;
  } catch {
    return null;
  }
};

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  if (pathname === '/' || pathname === BASE) {
    response.writeHead(302, { location: `${BASE}/` }).end();
    return;
  }
  const file = pathname.startsWith(`${BASE}/`) ? await fileOf(decodeURIComponent(pathname.slice(BASE.length))) : null;
  try {
    const body = await readFile(file ?? join(root, '404.html'));
    response.writeHead(file ? 200 : 404, { 'content-type': TYPES[file ? extname(file) : '.html'] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(port, () => console.log(`Preview: http://localhost:${port}${BASE}/`));
