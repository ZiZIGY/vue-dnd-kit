/**
 * Live examples: every folder of `examples/` is one example. Its `index.vue` is the demo,
 * and every file in it (`.vue`, `.ts`, `.css`) is shown as source, highlighted at build
 * time. The demo and the code shown are the same files, so they never drift apart.
 *
 * Generates `#examples`: `examples[name] = { component, files }`, both lazy, so a page only
 * loads the examples it renders. `files()` resolves to `{ name, lang, code, html }[]`, the
 * entry first.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { addTemplate, addVitePlugin, createResolver, defineNuxtModule, updateTemplates } from '@nuxt/kit';
import { createHighlighter } from 'shiki';
import { codeDark, codeLight } from '../shiki/themes';
import { watchDirs } from '../tools/watch';

const LANGS: Record<string, string> = { '.vue': 'vue', '.ts': 'ts', '.css': 'css', '.json': 'json' };
const ENTRY = 'index.vue';

interface ExampleFile {
  name: string;
  lang: string;
  code: string;
  html: string;
}

const listFiles = (dir: string, base = dir): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return listFiles(path, base);
    return LANGS[extname(entry)] ? [relative(base, path).replaceAll('\\', '/')] : [];
  });

export default defineNuxtModule({
  meta: { name: 'docs-examples' },
  async setup(_, nuxt) {
    const { resolve: resolvePath } = createResolver(import.meta.url);
    const root = resolve(resolvePath('..'), 'examples');
    const highlighter = await createHighlighter({ themes: [codeLight, codeDark], langs: Object.values(LANGS) });

    const names = () =>
      existsSync(root) ? readdirSync(root).filter((name) => existsSync(join(root, name, ENTRY))).sort() : [];

    const filesOf = (name: string): ExampleFile[] => {
      const dir = join(root, name);
      const files = listFiles(dir).sort((a, b) => (a === ENTRY ? -1 : b === ENTRY ? 1 : a.localeCompare(b)));
      return files.map((file) => {
        const lang = LANGS[extname(file)]!;
        const code = readFileSync(join(dir, file), 'utf8').replace(/\r\n/g, '\n').trimEnd();
        const html = highlighter.codeToHtml(code, {
          lang,
          themes: { light: 'dnd-light', dark: 'dnd-dark' },
          defaultColor: false,
        });
        return { name: file, lang, code, html };
      });
    };

    // An example's sources are a virtual module, made when it is asked for: a folder added
    // while the dev server runs has them at once (templates added then would never be written).
    const SOURCES = 'virtual:docs-example-sources/';
    const RESOLVED = `\0${SOURCES}`;
    const rootPath = root.replaceAll('\\', '/');
    addVitePlugin({
      name: 'docs-example-sources',
      resolveId: (id) => (id.startsWith(SOURCES) ? RESOLVED + id.slice(SOURCES.length) : undefined),
      load: (id) =>
        id.startsWith(RESOLVED) ? `export default ${JSON.stringify(filesOf(id.slice(RESOLVED.length)))};` : undefined,
      // An edited file: its example's sources are made again, and the page shows them.
      handleHotUpdate({ file, server }) {
        if (!file.startsWith(`${rootPath}/`)) return;
        const name = file.slice(rootPath.length + 1).split('/')[0];
        const module = server.moduleGraph.getModuleById(RESOLVED + name);
        if (!module) return;
        server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      },
    });

    const index = addTemplate({
      filename: 'examples/index.mjs',
      getContents: () => {
        const entries = names().map((name) => {
          const component = JSON.stringify(join(root, name, ENTRY).replaceAll('\\', '/'));
          const files = JSON.stringify(SOURCES + name);
          return `  ${JSON.stringify(name)}: { component: () => import(${component}), files: () => import(${files}).then((m) => m.default) },`;
        });
        return `export const examples = {\n${entries.join('\n')}\n};\n`;
      },
    });
    addTemplate({
      filename: 'examples/index.d.mts',
      getContents: () =>
        [
          "import type { Component } from 'vue';",
          'export interface ExampleFile { name: string; lang: string; code: string; html: string }',
          'export declare const examples: Record<string, { component: () => Promise<{ default: Component }>; files: () => Promise<ExampleFile[]> }>;',
        ].join('\n'),
    });
    nuxt.options.alias['#examples'] = index.dst;

    // New (or removed) examples join (or leave) the index. Edits of their files are HMR's.
    watchDirs('docs-examples-watch', [root], (path, event) => {
      if (event === 'change' || (!path.endsWith(ENTRY) && !event.endsWith('Dir'))) return;
      return updateTemplates({ filter: (template) => template.filename === 'examples/index.mjs' });
    });
  },
});
