import type { ExampleFile } from '#examples';

/**
 * Opens an example in StackBlitz as a small Vite + Vue project: its files go to `src/`
 * as they are (`index.vue` becomes `App.vue`), next to a `main.ts` that mounts it.
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

  await sdk.openProject(
    {
      title: `Vue DnD Kit — ${title}`,
      description: `Example "${name}" from the Vue DnD Kit docs`,
      template: 'node',
      files: {
        ...source,
        'src/main.ts': "import { createApp } from 'vue';\nimport App from './App.vue';\n\ncreateApp(App).mount('#app');\n",
        'index.html':
          '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Vue DnD Kit</title>\n    <style>body { font-family: system-ui, sans-serif; margin: 2rem; }</style>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n',
        'vite.config.ts':
          "import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\n\nexport default defineConfig({ plugins: [vue()] });\n",
        'package.json': JSON.stringify(
          {
            name: `vue-dnd-kit-${name}`,
            private: true,
            type: 'module',
            scripts: { dev: 'vite', build: 'vite build' },
            dependencies: { vue: '^3.5.0', '@vue-dnd-kit/core': '^3.0.0' },
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
