import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@vue-dnd-kit/core': resolve(__dirname, '../packages/core/src'),
      '@vue-dnd-kit/components': resolve(
        __dirname,
        '../packages/components/src'
      ),
    },
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: ['vue'],
    exclude: ['@vue-dnd-kit/core', '@vue-dnd-kit/components'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    sourcemap: true,
  },
});
