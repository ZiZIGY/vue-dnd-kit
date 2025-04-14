import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['node_modules/**', 'src/**/*.spec.ts'],
      staticImport: true,
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueDndKitCore',
      fileName: (format) => `vue-dnd-kit-core.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@vue-dnd-kit/core': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
    },
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: ['vue'],
    exclude: ['@vueuse/core'],
  },
});
