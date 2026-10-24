import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      include: [resolve(__dirname, 'src')],
      exclude: ['**/*.test.ts'],
      // One self-contained index.d.ts (only `vue` and `@vueuse/core` imports): no
      // extensionless relative imports, which `node16`/`nodenext` can't resolve.
      rollupTypes: true,
      // The same declarations as .d.cts for the `require` condition: a .d.ts is
      // ESM in a `"type": "module"` package (publint, arethetypeswrong).
      afterBuild: () => {
        copyFileSync(resolve(__dirname, 'dist/index.d.ts'), resolve(__dirname, 'dist/index.d.cts'));
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue', /^@vueuse\//],
    },
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
  },
});
