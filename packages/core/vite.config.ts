import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The library, and the devtools bridge (`@vue-dnd-kit/core/devtools`). The bridge takes
 * only types from the library, so the two share no chunk: `index.js` stays one file.
 */
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  devtools: resolve(__dirname, 'src/devtools/index.ts'),
};

export default defineConfig({
  publicDir: false,
  plugins: [
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
    },
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
  },
});
