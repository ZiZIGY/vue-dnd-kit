import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@vue-dnd-kit/core': resolve(
        __dirname,
        '../packages/core/dist/vue-dnd-kit-core.es.js'
      ),
      '@vue-dnd-kit/utilities': resolve(
        __dirname,
        '../packages/utilities/dist/vue-dnd-kit-utilities.es.js'
      ),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
    port: 4000,
    watch: {
      ignored: ['**/node_modules/**', '**/docs/**'],
      usePolling: false,
    },
  },
  optimizeDeps: {
    exclude: ['@vue-dnd-kit/core', '@vue-dnd-kit/utilities'],
  },
});
