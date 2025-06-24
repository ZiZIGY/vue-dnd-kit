import { defineConfig } from 'vitepress';
import { resolve } from 'path';

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
  ],
  description:
    'Vue DnD Kit - a modern, lightweight, and high-performance drag and drop ecosystem for Vue 3',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      {
        text: 'Examples',
        link: '/examples/basic/simple-drag',
      },
      { text: 'About', link: '/about' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Core Package',
          collapsed: false,
          items: [
            { text: 'useDraggable', link: '/guide/core/use-draggable' },
            { text: 'useDroppable', link: '/guide/core/use-droppable' },
            { text: 'useSelection', link: '/guide/core/use-selection' },
            {
              text: 'useDragContainer',
              link: '/guide/core/use-drag-container',
            },
            {
              text: 'DnDOperations',
              link: '/guide/core/dnd-operations',
            },
            {
              text: 'Collision Detection',
              link: '/guide/core/collision-detection',
            },
          ],
        },
        {
          text: 'Components Package',
          collapsed: false,
          items: [
            { text: 'Sortable', link: '/guide/components/sortable' },
            { text: 'Dashboard', link: '/guide/components/dashboard' },

            { text: 'Kanban', link: '/guide/components/kanban' },
            { text: 'Table', link: '/guide/components/table' },
            { text: 'Tree', link: '/guide/components/tree' },
          ],
        },
        {
          text: 'DevTools Package',
          collapsed: false,
          items: [{ text: 'Usage', link: '/guide/devtools/usage' }],
        },
      ],
      '/examples/': [
        {
          text: 'Basic Examples',
          collapsed: false,
          items: [
            { text: 'Simple Drag', link: '/examples/basic/simple-drag' },
            {
              text: 'Multi-Selection',
              link: '/examples/basic/multi-selection',
            },
            { text: 'Drag to Zone', link: '/examples/basic/drag-to-zone' },
            { text: 'Drag Handle', link: '/examples/basic/drag-handle' },
            {
              text: 'Adding Keyboard Support',
              link: '/examples/basic/keyboard-support',
            },
            {
              text: 'Drag Overlay',
              link: '/examples/basic/drag-overlay',
            },
            {
              text: 'Disabled',
              link: '/examples/basic/disabled-elements',
            },
          ],
        },
        {
          text: 'Advanced Examples',
          collapsed: false,
          items: [
            {
              text: 'Changing Overlay',
              link: '/examples/advanced/changing-overlay',
            },
            {
              text: 'Changing Layers',
              link: '/examples/advanced/changing-layers',
            },
            {
              text: 'Nesting Zones',
              link: '/examples/advanced/nesting-zones',
            },
            {
              text: 'Grouping',
              link: '/examples/advanced/grouping',
            },
            {
              text: 'Custom Sensor',
              link: '/examples/advanced/custom-sensor',
            },
          ],
        },
        {
          text: 'Real-World Examples',
          collapsed: false,
          items: [
            {
              text: 'Reordering Items',
              link: '/examples/real-world/reordering-items',
            },
            {
              text: 'Morph SVG',
              link: '/examples/real-world/morph-svg',
            },
            {
              text: 'Animating Elements',
              link: '/examples/real-world/animating',
            },
            {
              text: 'Sorting Lists',
              link: '/examples/real-world/sorting-lists',
            },
            {
              text: 'Tree',
              link: '/examples/real-world/tree',
            },
            {
              text: 'Async Drop Promise',
              link: '/examples/real-world/promise-drop',
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
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
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
    resolve: {
      alias: {
        '@vue-dnd-kit/core': resolve(
          __dirname,
          '../../packages/core/src/index.ts'
        ),
        '@vue-dnd-kit/components': resolve(
          __dirname,
          '../../packages/components'
        ),
        '@vue-dnd-kit/utils': resolve(
          __dirname,
          '../../packages/utils/src/index.ts'
        ),
        '@vue-dnd-kit/devtools': resolve(
          __dirname,
          '../../packages/devtools/src/index.ts'
        ),
        '@components': resolve(__dirname, './components'),
        '@examples': resolve(__dirname, './components/Examples'),
        '@assets': resolve(__dirname, './public'),
      },
    },
  },
});
