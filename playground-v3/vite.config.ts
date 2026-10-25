import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ui from '@nuxt/ui/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    // Nuxt UI for the kits/nuxt-ui.html page only. Auto-imports are off (the kit page
    // imports components explicitly), so the plugin never rewrites the main
    // playground's files: it resolves Nuxt UI's virtual modules and runs Tailwind,
    // which only touches CSS that imports `tailwindcss` (kits/nuxt-ui/main.css).
    ui({
      router: false,
      autoImport: false,
      components: false,
      dts: false,
      icon: {
        clientBundle: {
          // Bundled from @iconify-json/lucide: no runtime requests to the Iconify API.
          icons: [
            'i-lucide-grip-vertical',
            'i-lucide-ellipsis-vertical',
            'i-lucide-chevron-right',
            'i-lucide-chevron-down',
            'i-lucide-folder',
            'i-lucide-file',
            'i-lucide-info',
            'i-lucide-sun',
            'i-lucide-moon',
            'i-lucide-trash-2',
            'i-lucide-arrow-right',
          ],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      // Library sources, not the build: edits show up immediately.
      '@vue-dnd-kit/core': resolve(__dirname, '../packages/core/src/index.ts'),
    },
    // The core's own node_modules must not provide a second copy of Vue or VueUse.
    dedupe: ['vue', '@vueuse/core'],
  },
  build: {
    // One page per UI kit: their global CSS (Tailwind preflight, Vuetify's reset)
    // never reaches the main playground.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vuetify: resolve(__dirname, 'kits/vuetify.html'),
        'nuxt-ui': resolve(__dirname, 'kits/nuxt-ui.html'),
      },
    },
  },
  server: {
    // Separate ports let parallel worktrees run e2e without hitting each other's server.
    port: Number(process.env.PLAYGROUND_PORT ?? 4100),
    strictPort: true,
    fs: { allow: ['..'] },
  },
});
