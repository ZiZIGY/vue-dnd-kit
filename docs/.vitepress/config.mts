import { defineConfig } from 'vitepress';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue DnD Kit',
  base: '/vue-dnd-kit/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap',
      },
    ],
  ],
  description:
    'Vue DnD Kit - a modern, lightweight, and high-performance drag and drop ecosystem for Vue 3',
  themeConfig: {
    logo: 'https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Documentation',
        items: [
          { text: 'v1', link: '/v1/guide/introduction' },
          { text: 'v2', link: '/v2/guide/introduction' },
        ],
      },
    ],
    sidebar: {
      '/v1/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/v1/guide/introduction' },
            { text: 'Installation', link: '/v1/guide/installation' },
            { text: 'Quick Start', link: '/v1/guide/quick-start' },
          ],
        },
        {
          text: 'Core Package',
          collapsed: false,
          items: [
            { text: 'useDraggable', link: '/v1/guide/core/use-draggable' },
            { text: 'useDroppable', link: '/v1/guide/core/use-droppable' },
            { text: 'useSelection', link: '/v1/guide/core/use-selection' },
            {
              text: 'useDragContainer',
              link: '/v1/guide/core/use-drag-container',
            },
            { text: 'DnDOperations', link: '/v1/guide/core/dnd-operations' },
            {
              text: 'Collision Detection',
              link: '/v1/guide/core/collision-detection',
            },
          ],
        },
        {
          text: 'Components Package',
          collapsed: false,
          items: [
            { text: 'Sortable', link: '/v1/guide/components/sortable' },
            { text: 'Dashboard', link: '/v1/guide/components/dashboard' },
            { text: 'Kanban', link: '/v1/guide/components/kanban' },
            { text: 'Table', link: '/v1/guide/components/table' },
            { text: 'Tree', link: '/v1/guide/components/tree' },
          ],
        },
        {
          text: 'DevTools Package',
          collapsed: false,
          items: [{ text: 'Usage', link: '/v1/guide/devtools/usage' }],
        },
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Simple Drag', link: '/v1/examples/basic/simple-drag' },
            {
              text: 'Multi-Selection',
              link: '/v1/examples/basic/multi-selection',
            },
            { text: 'Drag to Zone', link: '/v1/examples/basic/drag-to-zone' },
            { text: 'Drag Handle', link: '/v1/examples/basic/drag-handle' },
            {
              text: 'Adding Keyboard Support',
              link: '/v1/examples/basic/keyboard-support',
            },
            { text: 'Drag Overlay', link: '/v1/examples/basic/drag-overlay' },
            { text: 'Disabled', link: '/v1/examples/basic/disabled-elements' },
            {
              text: 'Changing Overlay',
              link: '/v1/examples/advanced/changing-overlay',
            },
            {
              text: 'Changing Layers',
              link: '/v1/examples/advanced/changing-layers',
            },
            {
              text: 'Nesting Zones',
              link: '/v1/examples/advanced/nesting-zones',
            },
            { text: 'Grouping', link: '/v1/examples/advanced/grouping' },
            {
              text: 'Custom Sensor',
              link: '/v1/examples/advanced/custom-sensor',
            },
            {
              text: 'Reordering Items',
              link: '/v1/examples/real-world/reordering-items',
            },
            { text: 'Morph SVG', link: '/v1/examples/real-world/morph-svg' },
            {
              text: 'Animating Elements',
              link: '/v1/examples/real-world/animating',
            },
            {
              text: 'Sorting Lists',
              link: '/v1/examples/real-world/sorting-lists',
            },
            { text: 'Tree', link: '/v1/examples/real-world/tree' },
            {
              text: 'Async Drop Promise',
              link: '/v1/examples/real-world/promise-drop',
            },
          ],
        },
        { text: 'About', link: '/v1/about' },
      ],
      '/v2/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/v2/guide/introduction' },
            { text: 'Installation', link: '/v2/guide/installation' },
            { text: 'Quick Start', link: '/v2/guide/quick-start' },
          ],
        },
        {
          text: 'API',
          items: [
            { text: 'DnDProvider', link: '/v2/guide/dnd-provider' },
            { text: 'makeDraggable', link: '/v2/guide/make-draggable' },
            { text: 'makeDroppable', link: '/v2/guide/make-droppable' },
            {
              text: 'makeSelectionArea',
              link: '/v2/guide/make-selection-area',
            },
            {
              text: 'makeConstraintArea',
              link: '/v2/guide/make-constraint-area',
            },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zizigy/vue-dnd-kit' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 ZIZIGY',
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close',
                },
              },
            },
          },
        },
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: [],
    },
    optimizeDeps: {
      exclude: ['gsap'],
    },
    build: {
      rollupOptions: {
        external: ['gsap'],
      },
    },
    resolve: {
      alias: {
        '@components': resolve(__dirname, './components'),
        '@examples': resolve(__dirname, './components/v1/Examples'),
        '@assets': resolve(__dirname, './public'),
      },
    },
  },
});
