import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The page's side, `@vue-dnd-kit/devtools/auto` (a side effect: it imports the page's
 * entry) and the Vite plugin (it runs in Node). The tab is built on its own
 * (`vite.client.config.ts`, into `dist/client`).
 */
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  auto: resolve(__dirname, 'src/auto.ts'),
  vite: resolve(__dirname, 'src/vite.ts'),
};

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      include: [resolve(__dirname, 'src')],
      // tsconfig's `paths` serve development (one Vue, the core's sources): imports stay as written.
      pathsToAliases: false,
      // One self-contained .d.ts per entry (only `vue` and `vite` imports).
      rollupTypes: true,
      // The same declarations as .d.cts for the `require` condition (publint, arethetypeswrong).
      afterBuild: () => {
        for (const name of Object.keys(entries)) {
          copyFileSync(resolve(__dirname, `dist/${name}.d.ts`), resolve(__dirname, `dist/${name}.d.cts`));
        }
      },
    }),
  ],
  build: {
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // The core (and its bridge), the actions and the DevTools API come from the app;
      // Node's modules and Vite from the dev server.
      external: ['vue', 'vite', /^node:/, /^@vue\/devtools-api/, /^@vue-dnd-kit\/(core|actions)/],
    },
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
  },
});
