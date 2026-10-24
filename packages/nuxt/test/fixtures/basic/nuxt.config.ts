import { fileURLToPath } from 'node:url';
import VueDnDKit from '../../../src/module';

// The core is used from source, like playground-v3 does; its own node_modules
// provide @vueuse/core, while Vue must stay the app's single copy.
const core = (path: string) => fileURLToPath(new URL(`../../../../core/${path}`, import.meta.url));

export default defineNuxtConfig({
  modules: [VueDnDKit],
  vueDndKit: { autoImports: { modifiers: true } },
  alias: {
    '@vue-dnd-kit/core': core('src/index.ts'),
    '@vueuse/core': core('node_modules/@vueuse/core'),
    '@vueuse/shared': core('node_modules/@vueuse/shared'),
  },
  build: { transpile: ['@vueuse/core', '@vueuse/shared'] },
  vite: { resolve: { dedupe: ['vue'] } },
  devtools: { enabled: false },
  telemetry: false,
  compatibilityDate: 'latest',
});
