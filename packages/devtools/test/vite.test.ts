// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { HtmlTagDescriptor, ResolvedConfig, ViteDevServer } from 'vite';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { serveTab, vueDnDKitDevtools, TAB_ROUTE } from '../src/vite';

type Handler = (request: IncomingMessage, response: ServerResponse, next: (error?: unknown) => void) => void;

/** A response that keeps what is written: status, headers and body. */
const respond = () => {
  const stream = new PassThrough();
  const chunks: Buffer[] = [];
  stream.on('data', (chunk: Buffer) => chunks.push(chunk));
  const headers: Record<string, string> = {};
  const response = Object.assign(stream, {
    statusCode: 200,
    setHeader: (name: string, value: string) => void (headers[name.toLowerCase()] = value),
  }) as unknown as ServerResponse;
  const done = new Promise<string>((resolve) => stream.on('finish', () => resolve(Buffer.concat(chunks).toString())));
  return { response, headers, done };
};

/** Requests `url` (as `connect` hands it under the route); `null` when it goes on to `next`. */
const request = async (handler: Handler, url: string, originalUrl = url) => {
  const { response, headers, done } = respond();
  let passed = false;
  handler({ url, originalUrl } as unknown as IncomingMessage, response, () => (passed = true));
  if (passed) return null;
  return { body: await done, headers, status: response.statusCode };
};

let dir = '';
afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = '';
});

describe('serving the prebuilt tab', () => {
  it('serves its files under the route, and nothing outside it', async () => {
    dir = mkdtempSync(join(tmpdir(), 'dnd-devtools-'));
    mkdirSync(join(dir, 'assets'));
    writeFileSync(join(dir, 'index.html'), '<!doctype html><title>tab</title>');
    writeFileSync(join(dir, 'assets', 'index.js'), 'export {}');
    writeFileSync(join(dir, '..', 'secret.txt'), 'no');
    const serve = serveTab(dir);
    expect(await request(serve, '/')).toMatchObject({ body: '<!doctype html><title>tab</title>', headers: { 'content-type': 'text/html; charset=utf-8' } });
    expect(await request(serve, '/assets/index.js?v=1')).toMatchObject({ body: 'export {}', headers: { 'content-type': 'text/javascript; charset=utf-8' } });
    expect(await request(serve, '/missing.js')).toBeNull();
    expect(await request(serve, '/../secret.txt')).toBeNull();
    expect(await request(serve, '/%2e%2e/secret.txt')).toBeNull();
    rmSync(join(dir, '..', 'secret.txt'));
  });
});

describe('the Vite plugin', () => {
  const setUp = (options?: Parameters<typeof vueDnDKitDevtools>[0], base = '/') => {
    const plugin = vueDnDKitDevtools(options);
    (plugin.configResolved as (config: ResolvedConfig) => void)({ base } as ResolvedConfig);
    return plugin;
  };
  const tags = (plugin: ReturnType<typeof vueDnDKitDevtools>) => (plugin.transformIndexHtml as () => HtmlTagDescriptor[])();

  it('runs on the dev server only, and puts the tab and the page reporting to it in the page', () => {
    const plugin = setUp({}, '/app/');
    expect(plugin.apply).toBe('serve');
    expect(tags(plugin)).toEqual([
      { tag: 'script', injectTo: 'head-prepend', children: 'window.__VUE_DND_KIT_DEVTOOLS_TAB__ = "/app/__vue-dnd-kit-devtools/";' },
      { tag: 'script', attrs: { type: 'module', src: '/app/@id/virtual:vue-dnd-kit-devtools' }, injectTo: 'head' },
    ]);
    const resolveId = plugin.resolveId as (id: string) => string | null;
    const load = plugin.load as (id: string) => string | null;
    expect(load(resolveId('virtual:vue-dnd-kit-devtools')!)).toContain('autoSetupDnDDevtools();');
    expect(resolveId('vue')).toBeNull();
    // Without the page's side: only where the tab is.
    expect(tags(setUp({ inject: false }))).toHaveLength(1);
  });

  it('serves the tab: from its sources in this repository when the app compiles Vue files, else prebuilt', async () => {
    const serve = (plugins: string[]) => {
      const plugin = setUp();
      const middlewares: Array<[string, Handler]> = [];
      const server = { config: { base: '/', plugins: plugins.map((name) => ({ name })) }, middlewares: { use: (route: string, handler: Handler) => middlewares.push([route, handler]) } };
      (plugin.configureServer as (server: ViteDevServer) => void)(server as unknown as ViteDevServer);
      expect(middlewares[0]![0]).toBe(TAB_ROUTE.slice(0, -1));
      return middlewares[0]![1];
    };
    const sources = serve(['vite:vue']);
    const page = await request(sources, '/', TAB_ROUTE);
    expect(page!.body).toMatch(/<script type="module" src="\/@vite\/client"><\/script><script type="module" src="\/@fs\/.+\/client\/main\.ts"><\/script>/);
    expect((await request(sources, '/icon.svg', `${TAB_ROUTE}icon.svg`))!.headers['content-type']).toBe('image/svg+xml');
    // The route without its slash: the tab's relative URLs need it.
    expect(await request(sources, '/', TAB_ROUTE.slice(0, -1))).toMatchObject({ status: 302 });

    const prebuilt = vi.fn();
    serve([])({ url: '/nothing-here.js', originalUrl: `${TAB_ROUTE}nothing-here.js` } as unknown as IncomingMessage, {} as ServerResponse, prebuilt);
    expect(prebuilt).toHaveBeenCalled();
  });
});
