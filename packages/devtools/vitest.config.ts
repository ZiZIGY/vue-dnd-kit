import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    // The core's sources, as in tsconfig.json (exact matches: the bridge is a subpath).
    alias: [
      { find: /^@vue-dnd-kit\/core$/, replacement: resolve(__dirname, '../core/src/index.ts') },
      { find: /^@vue-dnd-kit\/core\/devtools$/, replacement: resolve(__dirname, '../core/src/devtools/index.ts') },
      { find: /^@vue-dnd-kit\/actions$/, replacement: resolve(__dirname, '../actions/src/index.ts') },
    ],
    // The core's own node_modules must not bring a second Vue or VueUse.
    dedupe: ['vue', '@vueuse/core'],
  },
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.ts'],
  },
});
