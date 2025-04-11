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
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
    cssCodeSplit: false,
    cssMinify: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
