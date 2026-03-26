import { defineConfig } from 'vitepress';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import Components from 'unplugin-vue-components/vite';
import MotionResolver from 'motion-v/resolver';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue DnD Kit',
  base: '/vue-dnd-kit/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/refs/heads/v2/public/logo.svg',
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
    logo: 'https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/refs/heads/v2/public/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Documentation',
        items: [
          { text: 'v2 (Actual)', link: '/v2/guide/introduction' },
          { text: 'v1', link: '/v1/guide/introduction' },
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
          text: 'Core',
          items: [
            { text: 'DnDProvider', link: '/v2/guide/core/dnd-provider' },
            { text: 'useDnDProvider', link: '/v2/guide/core/use-dnd-provider' },
            { text: 'DragPreview', link: '/v2/guide/core/drag-preview' },
            { text: 'makeDraggable', link: '/v2/guide/core/make-draggable' },
            { text: 'makeDroppable', link: '/v2/guide/core/make-droppable' },
            {
              text: 'makeSelectionArea',
              link: '/v2/guide/core/make-selection-area',
            },
            {
              text: 'makeConstraintArea',
              link: '/v2/guide/core/make-constraint-area',
            },
            {
              text: 'makeAutoScroll',
              link: '/v2/guide/core/make-auto-scroll',
            },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Patterns & Concepts', link: '/v2/guide/patterns' },
            { text: 'Pitfalls & Best Practices', link: '/v2/guide/pitfalls' },
            { text: 'Techniques', link: '/v2/guide/techniques' },
          ],
        },
        {
          text: 'Examples',
          items: [
            { text: 'Base Drop', link: '/v2/examples/base-drop' },
            { text: 'Drag Handle', link: '/v2/examples/drag-handle' },
            { text: 'Groups', link: '/v2/examples/groups' },
            { text: 'Group Validation', link: '/v2/examples/group-validation' },
            { text: 'Multi Selection', link: '/v2/examples/multi-selection' },
            { text: 'Keyboard Navigation', link: '/v2/examples/keyboard' },
            { text: 'Mobile & Touch', link: '/v2/examples/mobile' },
            { text: 'Disabled', link: '/v2/examples/disabled' },
            { text: 'Custom Render per Draggable', link: '/v2/examples/custom-render' },
            { text: 'Sorting Lists', link: '/v2/examples/sorting-lists' },
            { text: 'Swap', link: '/v2/examples/swap' },
            { text: 'Copy', link: '/v2/examples/copy' },
            { text: 'Changing Overlay', link: '/v2/examples/changing-overlay' },
            { text: 'Async Drop (Promise)', link: '/v2/examples/promise-drop' },
            { text: 'Tree / Nesting', link: '/v2/examples/tree' },
            { text: 'v-model Group', link: '/v2/examples/v-model-group' },
            { text: 'Constraint Area', link: '/v2/examples/constraint-area' },
            { text: 'Auto Scroll', link: '/v2/examples/auto-scroll' },
            { text: 'Drag Activation', link: '/v2/examples/activation' },
            { text: 'Drag Modifier', link: '/v2/examples/modifier' },
            { text: 'Draggable Zone', link: '/v2/examples/draggable-zone' },
            { text: 'Overlay Transition', link: '/v2/examples/overlay-transition' },
            { text: 'Drag Animation', link: '/v2/examples/animation' },
            { text: 'Snap to Grid', link: '/v2/examples/snap-grid' },
            { text: 'Checkers', link: '/v2/examples/checkers' },
            { text: 'Chess', link: '/v2/examples/chess' },
          ],
        },
        {
          text: 'Performance',
          items: [
            { text: 'Raw vs Virtualized', link: '/v2/examples/performance' },
          ],
        },
        {
          text: 'Releases',
          items: [
            { text: 'Changelog', link: '/v2/guide/changelog' },
          ],
        },
      ],
      '/v2/examples/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/v2/guide/introduction' },
            { text: 'Installation', link: '/v2/guide/installation' },
            { text: 'Quick Start', link: '/v2/guide/quick-start' },
          ],
        },
        {
          text: 'Core',
          items: [
            { text: 'DnDProvider', link: '/v2/guide/core/dnd-provider' },
            { text: 'useDnDProvider', link: '/v2/guide/core/use-dnd-provider' },
            { text: 'DragPreview', link: '/v2/guide/core/drag-preview' },
            { text: 'makeDraggable', link: '/v2/guide/core/make-draggable' },
            { text: 'makeDroppable', link: '/v2/guide/core/make-droppable' },
            {
              text: 'makeSelectionArea',
              link: '/v2/guide/core/make-selection-area',
            },
            {
              text: 'makeConstraintArea',
              link: '/v2/guide/core/make-constraint-area',
            },
            {
              text: 'makeAutoScroll',
              link: '/v2/guide/core/make-auto-scroll',
            },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Patterns & Concepts', link: '/v2/guide/patterns' },
            { text: 'Pitfalls & Best Practices', link: '/v2/guide/pitfalls' },
            { text: 'Techniques', link: '/v2/guide/techniques' },
          ],
        },
        {
          text: 'Examples',
          items: [
            { text: 'Base Drop', link: '/v2/examples/base-drop' },
            { text: 'Drag Handle', link: '/v2/examples/drag-handle' },
            { text: 'Groups', link: '/v2/examples/groups' },
            { text: 'Group Validation', link: '/v2/examples/group-validation' },
            { text: 'Multi Selection', link: '/v2/examples/multi-selection' },
            { text: 'Keyboard Navigation', link: '/v2/examples/keyboard' },
            { text: 'Mobile & Touch', link: '/v2/examples/mobile' },
            { text: 'Disabled', link: '/v2/examples/disabled' },
            { text: 'Custom Render per Draggable', link: '/v2/examples/custom-render' },
            { text: 'Sorting Lists', link: '/v2/examples/sorting-lists' },
            { text: 'Swap', link: '/v2/examples/swap' },
            { text: 'Copy', link: '/v2/examples/copy' },
            { text: 'Changing Overlay', link: '/v2/examples/changing-overlay' },
            { text: 'Async Drop (Promise)', link: '/v2/examples/promise-drop' },
            { text: 'Tree / Nesting', link: '/v2/examples/tree' },
            { text: 'v-model Group', link: '/v2/examples/v-model-group' },
            { text: 'Constraint Area', link: '/v2/examples/constraint-area' },
            { text: 'Auto Scroll', link: '/v2/examples/auto-scroll' },
            { text: 'Drag Activation', link: '/v2/examples/activation' },
            { text: 'Drag Modifier', link: '/v2/examples/modifier' },
            { text: 'Draggable Zone', link: '/v2/examples/draggable-zone' },
            { text: 'Overlay Transition', link: '/v2/examples/overlay-transition' },
            { text: 'Drag Animation', link: '/v2/examples/animation' },
            { text: 'Snap to Grid', link: '/v2/examples/snap-grid' },
            { text: 'Checkers', link: '/v2/examples/checkers' },
            { text: 'Chess', link: '/v2/examples/chess' },
          ],
        },
        {
          text: 'Performance',
          items: [
            { text: 'Raw vs Virtualized', link: '/v2/examples/performance' },
          ],
        },
        {
          text: 'Releases',
          items: [
            { text: 'Changelog', link: '/v2/guide/changelog' },
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
    plugins: [
      tailwindcss(),
      Components({
        dts: true,
        resolvers: [MotionResolver()],
      }),
    ],
    ssr: {
      noExternal: [],
    },
    optimizeDeps: {
      exclude: ['gsap', '@vue-dnd-kit/core'],
    },
    build: {
      rollupOptions: {
        external: ['gsap'],
      },
    },
    resolve: {
      alias: {
        '@vue-dnd-kit/core': resolve(
          __dirname,
          '../../packages/core/dist/vue-dnd-kit-core.es.js'
        ),
        '@components': resolve(__dirname, './components'),
        '@examples': resolve(__dirname, './components/v1/Examples'),
        '@examples-v2': resolve(__dirname, './components/v2/Examples'),
        '@assets': resolve(__dirname, './public'),
      },
    },
  },
});
