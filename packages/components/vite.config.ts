import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      beforeWriteFile: (filePath, content) => {
        const fixedContent = content.replace(
          /from ['"]\.\.\/types['"];/g,
          'from "../types";'
        );
        return {
          filePath: filePath.replace('/src/', '/'),
          content: fixedContent,
        };
      },
      copyDtsFiles: true,
      insertTypesEntry: true,
      cleanVueFileName: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueDndKitComponents',
      formats: ['es', 'cjs'],
      fileName: (format) => `vue-dnd-kit-components.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@vue-dnd-kit/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@vue-dnd-kit/core': 'VueDndKitCore',
        },
        exports: 'named',
      },
    },
    cssCodeSplit: false,
    cssMinify: true,
    sourcemap: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@vue-dnd-kit/core': resolve(__dirname, '../core/src'),
      '@vue-dnd-kit/components': resolve(__dirname, './src'),
    },
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: ['vue'],
    exclude: ['@vue-dnd-kit/core'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
