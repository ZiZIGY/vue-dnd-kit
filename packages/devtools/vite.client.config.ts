import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The tab (`client/`), prebuilt into `dist/client`: the dev server serves it as it is
 * (`src/vite.ts`, the Nuxt module), under any path (relative URLs). Runs after the
 * library's build, which empties `dist`.
 */
export default defineConfig({
  root: resolve(__dirname, 'client'),
  base: './',
  plugins: [vue()],
  build: {
    outDir: resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
  },
});
