import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      include: [resolve(__dirname, 'src')],
      exclude: [resolve(__dirname, 'node_modules'), resolve(__dirname, 'vite.config.ts')],
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueDndKitUtilities',
      fileName: (format) => `vue-dnd-kit-utilities.${format === 'es' ? 'es' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@vue-dnd-kit/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@vue-dnd-kit/core': 'VueDndKitCore',
        },
      },
    },
    sourcemap: false,
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ['vue'],
  },
});
