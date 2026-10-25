import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // The core's sources, not a build: tests run against the code next door.
      '@vue-dnd-kit/core': resolve(__dirname, '../core/src/index.ts'),
    },
    // The core's own node_modules must not provide a second copy of Vue or VueUse.
    dedupe: ['vue', '@vueuse/core'],
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
  },
});
