import type { ExampleFile } from '#examples';
import docs from '~~/package.json';

/**
 * The library's packages: the docs run them from the sources, so they aren't among the
 * docs' dependencies (`-0`: the betas too).
 */
const LIBRARY: Record<string, string> = {
  '@vue-dnd-kit/core': '^3.0.0-0',
  '@vue-dnd-kit/actions': '^1.0.0-0',
};

/** A package at the version the docs run the examples with. */
const versionOf = (name: string) =>
  LIBRARY[name] ?? (docs.dependencies as Record<string, string>)[name] ?? (docs.devDependencies as Record<string, string>)[name] ?? 'latest';

/** The packages the files import: `zod`, `@vueuse/core/…` as `@vueuse/core`; no relative paths or aliases. */
const importsOf = (files: ExampleFile[]) => {
  const names = new Set<string>();
  for (const file of files) {
    for (const [, specifier] of file.code.matchAll(/(?:\bfrom|\bimport)\s*\(?\s*['"]([@a-z][^'"]*)['"]/gi)) {
      const parts = specifier!.split('/');
      names.add(specifier!.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!);
    }
  }
  return names;
};

/** Made with Nuxt UI: its components in a template (`<UButton>`), or the package imported (its types). */
const usesNuxtUI = (files: ExampleFile[], imports: Set<string>) =>
  imports.has('@nuxt/ui') || files.some((file) => file.name.endsWith('.vue') && /<U[A-Z]\w*[\s/>]/.test(file.code));

/**
 * The page around the example, as the docs' frame expanded to the full screen: `#app` is a
 * flex column as tall as the window, so a whole app (`flex: 1` on its root) fills it, a small
 * demo stands in its middle, and a long one scrolls.
 */
const SHELL_CSS = [
  'html, body { height: 100%; margin: 0; }',
  'body { font-family: system-ui, sans-serif; }',
  '#app { box-sizing: border-box; display: flex; flex-direction: column; justify-content: safe center; height: 100%; padding: 2rem; overflow: auto; }',
].join('\n      ');

const INDEX_HTML = (app: string) =>
  `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Vue DnD Kit</title>\n    <style>\n      ${SHELL_CSS}\n    </style>\n  </head>\n  <body>\n    ${app}\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n`;

/** A plain Vite + Vue project. */
const plain = () => ({
  files: {
    'src/main.ts': "import { createApp } from 'vue';\nimport App from './App.vue';\n\ncreateApp(App).mount('#app');\n",
    'index.html': INDEX_HTML('<div id="app"></div>'),
    'vite.config.ts': "import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\n\nexport default defineConfig({ plugins: [vue()] });\n",
  },
  dependencies: [] as string[],
});

/**
 * A Vite + Vue project with Nuxt UI, as its docs set one up: the Vite plugin (components
 * auto-imported, no router), Tailwind CSS, the Vue plugin, and `UApp` around the example.
 */
const withNuxtUI = () => ({
  files: {
    'src/main.ts':
      "import './main.css';\nimport { createApp } from 'vue';\nimport ui from '@nuxt/ui/vue-plugin';\nimport Root from './Root.vue';\n\ncreateApp(Root).use(ui).mount('#app');\n",
    'src/main.css': '@import "tailwindcss";\n@import "@nuxt/ui";\n',
    'src/Root.vue': "<script setup lang=\"ts\">\nimport App from './App.vue';\n</script>\n\n<template>\n  <UApp>\n    <App />\n  </UApp>\n</template>\n",
    'index.html': INDEX_HTML('<div id="app" class="isolate"></div>'),
    'vite.config.ts':
      "import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nimport ui from '@nuxt/ui/vite';\n\nexport default defineConfig({ plugins: [vue(), ui({ router: false })] });\n",
  },
  dependencies: ['@nuxt/ui', 'tailwindcss', '@iconify-json/lucide'],
});

/**
 * Opens an example in StackBlitz as a small Vite + Vue project: its files go to `src/`
 * as they are (`index.vue` becomes `App.vue`), next to a `main.ts` that mounts it, with
 * every package they import at the version the docs run it with. An example made with
 * Nuxt UI gets a project set up for Nuxt UI.
 */
export async function openStackBlitz(name: string, title: string, files: ExampleFile[]): Promise<void> {
  const { default: sdk } = await import('@stackblitz/sdk');
  const source = Object.fromEntries(
    files.map((file) => [
      `src/${file.name === 'index.vue' ? 'App.vue' : file.name}`,
      // The entry is App.vue in the project: imports of it follow.
      file.code.replaceAll("'./index.vue'", "'./App.vue'"),
    ]),
  );
  const imports = importsOf(files);
  const project = usesNuxtUI(files, imports) ? withNuxtUI() : plain();
  const dependencies = [...new Set(['vue', '@vue-dnd-kit/core', ...imports, ...project.dependencies])];

  await sdk.openProject(
    {
      title: `Vue DnD Kit — ${title}`,
      description: `Example "${name}" from the Vue DnD Kit docs`,
      template: 'node',
      files: {
        ...source,
        ...project.files,
        'package.json': JSON.stringify(
          {
            name: `vue-dnd-kit-${name}`,
            private: true,
            type: 'module',
            scripts: { dev: 'vite', build: 'vite build' },
            dependencies: Object.fromEntries(dependencies.sort().map((dependency) => [dependency, versionOf(dependency)])),
            devDependencies: { vite: '^7.0.0', '@vitejs/plugin-vue': '^6.0.0', typescript: '^5.9.0' },
          },
          null,
          2,
        ),
      },
    },
    { openFile: 'src/App.vue', newWindow: true },
  );
}
