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

    // Main navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      // { text: 'Examples', link: '/examples/basic' },
      { text: 'About', link: '/about' },
    ],

    // Simplified sidebar structure
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
            { text: 'DnDOperations', link: '/guide/core/dnd-operations' },
          ],
        },
        {
          text: 'DevTools',
          collapsed: false,
          items: [{ text: 'Usage', link: '/guide/devtools/usage' }],
        },
        // Temporarily hiding incomplete sections
        // {
        //   text: 'Components',
        //   collapsed: false,
        //   items: [
        //     { text: 'DragOverlay', link: '/guide/components/drag-overlay' },
        //     { text: 'Sortable', link: '/guide/components/sortable' },
        //     { text: 'DragHandle', link: '/guide/components/drag-handle' },
        //     { text: 'DropIndicator', link: '/guide/components/drop-indicator' },
        //     { text: 'MultiDrag', link: '/guide/components/multi-drag' },
        //   ],
        // },
        // {
        //   text: 'Utils',
        //   collapsed: false,
        //   items: [
        //     { text: 'Sensors', link: '/guide/utils/sensors' },
        //     {
        //       text: 'Collision Detection',
        //       link: '/guide/utils/collision-detection',
        //     },
        //     { text: 'Geometry', link: '/guide/utils/geometry' },
        //     { text: 'Auto-Scroll', link: '/guide/utils/auto-scroll' },
        //     { text: 'Animation', link: '/guide/utils/animation' },
        //   ],
        // },
        // {
        //   text: 'DevTools',
        //   collapsed: false,
        //   items: [
        //     { text: 'DnDInspector', link: '/guide/devtools/dnd-inspector' },
        //     {
        //       text: 'PerformanceMonitor',
        //       link: '/guide/devtools/performance-monitor',
        //     },
        //   ],
        // },
        // {
        //   text: 'Advanced Topics',
        //   collapsed: false,
        //   items: [
        //     {
        //       text: 'TypeScript Integration',
        //       link: '/guide/advanced/typescript',
        //     },
        //     { text: 'Custom Sensors', link: '/guide/advanced/custom-sensors' },
        //     {
        //       text: 'Performance Optimization',
        //       link: '/guide/advanced/performance',
        //     },
        //   ],
        // },
      ],
      '/examples/': [
        {
          text: 'Basic Examples',
          collapsed: false,
          items: [
            { text: 'Basic Drag & Drop', link: '/examples/basic' },
            // Temporarily hiding incomplete examples
            // { text: 'Sortable List', link: '/examples/sortable' },
            // {
            //   text: 'Multiple Containers',
            //   link: '/examples/multiple-containers',
            // },
          ],
        },
        // {
        //   text: 'Advanced Examples',
        //   collapsed: false,
        //   items: [
        //     { text: 'Multi-Drag', link: '/examples/multi-drag' },
        //     { text: 'Keyboard Navigation', link: '/examples/keyboard' },
        //     { text: 'Custom Animations', link: '/examples/animations' },
        //     { text: 'Nested Sortable', link: '/examples/nested-sortable' },
        //   ],
        // },
        // {
        //   text: 'Real-world Examples',
        //   collapsed: false,
        //   items: [
        //     { text: 'Kanban Board', link: '/examples/kanban' },
        //     { text: 'File Manager', link: '/examples/file-manager' },
        //     { text: 'Form Builder', link: '/examples/form-builder' },
        //   ],
        // },
      ],
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zizigy/vue-dnd-kit' },
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 ZIZIGY',
    },

    // Search configuration
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
          '../../packages/components/src/index.ts'
        ),
        '@vue-dnd-kit/utils': resolve(
          __dirname,
          '../../packages/utils/src/index.ts'
        ),
        '@vue-dnd-kit/devtools': resolve(
          __dirname,
          '../../packages/devtools/src/index.ts'
        ),
      },
    },
  },
});
