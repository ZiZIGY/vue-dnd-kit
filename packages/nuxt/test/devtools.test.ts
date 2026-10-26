import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Nuxt } from '@nuxt/schema';
import { addPluginTemplate } from '@nuxt/kit';
import { addCustomTab } from '@nuxt/devtools-kit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadDevtools, setupDevtools, type DevtoolsServer } from '../src/devtools';

vi.mock('@nuxt/kit', () => ({ addPluginTemplate: vi.fn() }));
vi.mock('@nuxt/devtools-kit', () => ({ addCustomTab: vi.fn() }));

type Hook = (...args: unknown[]) => void;

/** A Nuxt with the hooks the module registers. */
const fakeNuxt = (dev: boolean) => {
  const hooks = new Map<string, Hook>();
  const nuxt = { options: { dev, rootDir: '/app' }, hook: (name: string, hook: Hook) => hooks.set(name, hook) } as unknown as Nuxt;
  return { nuxt, hooks };
};

const devtools: DevtoolsServer = { TAB_ROUTE: '/__vue-dnd-kit-devtools/', serveTab: () => () => {} };

let dir = '';
afterEach(() => {
  vi.clearAllMocks();
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = '';
});

describe('the Nuxt DevTools tab', () => {
  it('in development, with @vue-dnd-kit/devtools: served, added to the Nuxt DevTools, and the page reports to it', async () => {
    const { nuxt, hooks } = fakeNuxt(true);
    expect(await setupDevtools(nuxt, async () => devtools)).toBe(true);
    expect(addCustomTab).toHaveBeenCalledWith(
      { name: 'vue-dnd-kit', title: 'Vue DnD Kit', icon: '/__vue-dnd-kit-devtools/icon.svg', view: { type: 'iframe', src: '/__vue-dnd-kit-devtools/' } },
      nuxt,
    );
    // The client's dev server serves the tab.
    const use = vi.fn();
    hooks.get('vite:serverCreated')!({ middlewares: { use } }, { isClient: false, isServer: true });
    expect(use).not.toHaveBeenCalled();
    hooks.get('vite:serverCreated')!({ middlewares: { use } }, { isClient: true, isServer: false });
    expect(use).toHaveBeenCalledWith('/__vue-dnd-kit-devtools', expect.any(Function));
    // A client plugin installs the page's side.
    const [template] = vi.mocked(addPluginTemplate).mock.calls[0]! as [{ filename: string; mode: string; getContents: () => string }];
    expect(template).toMatchObject({ filename: 'vue-dnd-kit-devtools.client.mjs', mode: 'client' });
    expect(template.getContents()).toContain("import { DnDDevtools } from '@vue-dnd-kit/devtools';");
    expect(template.getContents()).toContain('nuxtApp.vueApp.use(DnDDevtools)');
  });

  it('nothing in production, or without @vue-dnd-kit/devtools', async () => {
    const load = vi.fn(async () => devtools);
    expect(await setupDevtools(fakeNuxt(false).nuxt, load)).toBe(false);
    expect(load).not.toHaveBeenCalled();
    expect(await setupDevtools(fakeNuxt(true).nuxt, async () => null)).toBe(false);
    expect(addCustomTab).not.toHaveBeenCalled();
    expect(addPluginTemplate).not.toHaveBeenCalled();
  });

  it('finds the package where the app resolves it', async () => {
    dir = mkdtempSync(join(tmpdir(), 'dnd-nuxt-'));
    writeFileSync(join(dir, 'package.json'), '{}');
    expect(await loadDevtools(dir)).toBeNull();
    const pkg = join(dir, 'node_modules', '@vue-dnd-kit', 'devtools');
    mkdirSync(join(pkg, 'dist'), { recursive: true });
    writeFileSync(
      join(pkg, 'package.json'),
      JSON.stringify({ name: '@vue-dnd-kit/devtools', exports: { './vite': { require: './dist/vite.cjs', import: './dist/vite.mjs' } } }),
    );
    writeFileSync(join(pkg, 'dist', 'vite.cjs'), "exports.TAB_ROUTE = '/__vue-dnd-kit-devtools/'; exports.serveTab = () => () => {};");
    const loaded = await loadDevtools(dir);
    expect(loaded?.TAB_ROUTE).toBe('/__vue-dnd-kit-devtools/');
  });
});
