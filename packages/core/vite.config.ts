import { defineConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The library, and the devtools bridge (`@vue-dnd-kit/core/devtools`). The two share no
 * chunk: `index.js` stays one file (see `ownCopies`).
 */
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  devtools: resolve(__dirname, 'src/devtools/index.ts'),
};

const BRIDGE = '/src/devtools/';
const COPY = '?devtools';

/**
 * The library modules the bridge runs (the clone code) are copies of its own: imported
 * from the bridge, a module gets another id, and so do the modules it imports. Rollup
 * would put a module both entries import in a chunk they share.
 */
const ownCopies = (): Plugin => ({
  name: 'vue-dnd-kit:devtools-own-copies',
  apply: 'build',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (!importer || !source.startsWith('.')) return null;
    const path = importer.replace(/\\/g, '/');
    if (!path.includes(BRIDGE) && !path.endsWith(COPY)) return null;
    const resolved = await this.resolve(source, importer.replace(COPY, ''), { ...options, skipSelf: true });
    if (!resolved || resolved.external || resolved.id.replace(/\\/g, '/').includes(BRIDGE)) return resolved;
    return `${resolved.id}${COPY}`;
  },
});

export default defineConfig({
  publicDir: false,
  plugins: [
    ownCopies(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      include: [resolve(__dirname, 'src')],
      exclude: ['**/*.test.ts'],
      // One self-contained .d.ts per entry (only `vue` and `@vueuse/core` imports): no
      // extensionless relative imports, which `node16`/`nodenext` can't resolve.
      rollupTypes: true,
      // The same declarations as .d.cts for the `require` condition: a .d.ts is
      // ESM in a `"type": "module"` package (publint, arethetypeswrong).
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
      external: ['vue', /^@vueuse\//],
      // Vue and VueUse have no side effects: the bridge's copy of `utils/dom` (for the
      // clones) doesn't keep a bare `import '@vueuse/core'`.
      treeshake: { moduleSideEffects: 'no-external' },
    },
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
  },
});
