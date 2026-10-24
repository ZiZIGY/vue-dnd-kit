import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      include: [resolve(__dirname, 'src')],
      exclude: ['**/*.test.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue', /^@vueuse\//],
    },
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
  },
});
