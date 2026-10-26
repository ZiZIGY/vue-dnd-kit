import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOCALE, LOCALES } from './i18n/locales';
import { monoDark, monoLight } from './shiki/mono';

const fromRoot = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));

/** Routes of the English docs (`content/en/docs/**`), as Nuxt Content paths them: numeric prefixes dropped. */
const docsRoutes = (dir = fileURLToPath(new URL('./content/en/docs', import.meta.url)), base = '/docs'): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const name = entry.replace(/^\d+\./, '').replace(/\.md$/, '');
    if (statSync(path).isDirectory()) return docsRoutes(path, `${base}/${name}`);
    if (!entry.endsWith('.md')) return [];
    return [name === 'index' ? base : `${base}/${name}`];
  });

/** Every page in every language: untranslated pages exist too (in English, flagged). */
const prerenderRoutes = () =>
  LOCALES.flatMap(({ code }) => {
    const prefix = code === DEFAULT_LOCALE ? '' : `/${code}`;
    return [prefix || '/', ...docsRoutes().map((route) => `${prefix}${route}`)];
  });

/** GitHub Pages serves the site under the repository name. */
const BASE_URL = '/vue-dnd-kit/';
/** Origin only: Site Config, i18n and the AI-ready files add `BASE_URL` themselves. */
const ORIGIN = 'https://zizigy.github.io';

export default defineNuxtConfig({
  // Nuxt UI before Content: its prose components must be registered first.
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/seo', './modules/examples', './modules/api'],

  compatibilityDate: '2026-10-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  app: {
    baseURL: BASE_URL,
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${BASE_URL}favicon.svg` }],
    },
  },

  // The library's sources, as the playground uses them: the docs always show the current code.
  alias: {
    '@vue-dnd-kit/core': fromRoot('packages/core/src/index.ts'),
    '@vue-dnd-kit/actions': fromRoot('packages/actions/src/index.ts'),
  },

  vite: {
    resolve: {
      // The packages' own node_modules must not bring a second Vue or VueUse.
      dedupe: ['vue', '@vueuse/core'],
    },
    optimizeDeps: {
      // Nuxt UI's editor (tiptap) isn't used here; its collaboration peer isn't installed.
      exclude: ['@tiptap/extension-drag-handle-vue-3'],
      include: ['@vue/devtools-core', '@stackblitz/sdk'],
    },
    server: { fs: { allow: [fromRoot('')] } },
  },

  experimental: {
    viewTransition: true,
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  ui: {
    theme: { colors: ['primary', 'neutral', 'success', 'warning', 'error', 'info'] },
  },

  icon: {
    // The first prerendered pages load the whole local collection at once.
    fetchTimeout: 10_000,
    // Icons named in Markdown and .navigation.yml are bundled too.
    clientBundle: { scan: { globInclude: ['app/**/*.vue', 'app/**/*.ts', 'content/**/*.md', 'content/**/*.yml'] } },
  },

  fonts: {
    // Both families come from Google Fonts: the other providers are never asked.
    providers: { fontshare: false, adobe: false, bunny: false, fontsource: false },
    families: [
      { name: 'Onest', provider: 'google', weights: [400, 500, 600] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500] },
    ],
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          // Every key Nuxt UI uses (`light` too), or its own colourful themes fill the gaps.
          theme: { default: monoLight, light: monoLight, dark: monoDark },
          langs: ['vue', 'ts', 'js', 'json', 'bash', 'css', 'html', 'md', 'yaml', 'diff'],
        },
      },
    },
  },

  mdc: {
    highlight: {
      theme: { default: 'dnd-mono-light', light: 'dnd-mono-light', dark: 'dnd-mono-dark' },
      themes: [monoLight, monoDark],
    },
  },

  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    strategy: 'prefix_except_default',
    // The origin only: i18n adds `app.baseURL` to the hreflang links itself.
    baseUrl: ORIGIN,
    langDir: 'locales',
    locales: LOCALES.map(({ code, language, name }) => ({ code, language, name, file: `${code}.json` })),
    // A static site can't redirect on the server, and switching the locale on the client
    // would re-render the English page in another language. The English home redirects
    // before hydration instead (pages/index.vue), unless a language was picked.
    detectBrowserLanguage: false,
  },

  site: {
    // Without the path: Site Config adds `app.baseURL` itself.
    url: ORIGIN,
    name: 'Vue DnD Kit',
    description: 'Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.',
    defaultLocale: DEFAULT_LOCALE,
  },

  // A project site on GitHub Pages lives under a path: robots.txt belongs to the domain root.
  robots: { robotsTxt: false },
  ogImage: { enabled: false },
  linkChecker: { enabled: false },


  nitro: {
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes(),
      // A page and its payload share a cache entry: on Windows, writing it from two
      // renders at once fails (EPERM on rename). CI builds on Linux in parallel.
      concurrency: process.platform === 'win32' ? 1 : undefined,
    },
  },
});
