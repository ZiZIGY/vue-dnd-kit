import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Library sources, not the build: edits show up immediately.
      '@vue-dnd-kit/core': resolve(__dirname, '../packages/core/src/index.ts'),
    },
    // The core's own node_modules must not provide a second copy of Vue or VueUse.
    dedupe: ['vue', '@vueuse/core'],
  },
  server: {
    // Separate ports let parallel worktrees run e2e without hitting each other's server.
    port: Number(process.env.PLAYGROUND_PORT ?? 4100),
    strictPort: true,
    fs: { allow: ['..'] },
  },
});
