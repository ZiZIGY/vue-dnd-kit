import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.lib.json'),
      include: [
        resolve(__dirname, 'src/external'),
        resolve(__dirname, 'src/internal'),
      ],
      exclude: [
        resolve(__dirname, 'node_modules'),
        resolve(__dirname, 'src/App.vue'),
        resolve(__dirname, 'src/main.ts'),
      ],
      rollupTypes: false,
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/external/index.ts'),
      name: 'VueDndKitCore',
      fileName: (format) => `vue-dnd-kit-core.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    dedupe: ['vue'],
  },
});
