import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist/types',
      cleanVueFileName: true,
      staticImport: true,
      insertTypesEntry: true,
      copyDtsFiles: false,
      beforeWriteFile: (filePath, content) => {
        let newPath = filePath
          .replace('/src/components/', '/components/')
          .replace('/src/', '/');

        return {
          filePath: newPath,
          content: content,
        };
      },
      
    }),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueDndKitComponents',
      formats: ['es', 'umd'],
      fileName: (format) => `vue-dnd-kit-components.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@vue-dnd-kit/core', '@vueuse/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@vue-dnd-kit/core': 'VueDndKitCore',
          '@vueuse/core': 'VueUse',
        },
        exports: 'named',
      },
    },
    cssCodeSplit: false,
    cssMinify: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@vue-dnd-kit/core': resolve(__dirname, '../core/src'),
      '@vue-dnd-kit/components': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
    },
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: ['vue'],
    exclude: ['@vue-dnd-kit/core'],
  },
});

// export default defineConfig({
//   build: {
//     emptyOutDir: false,
//     lib: {
//       entry: path.resolve(__dirname, 'src/main.ts'),
//       formats: ['es'],
//       name: 'UiLib',
//     },
//     rollupOptions: {
//       external: ['vue'],
//       output: {
//         globals: {
//           Vue: 'vue',
//         },
//       },
//     },
//   },
//   plugins: [vue(), dts()],
// });
