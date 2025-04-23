---
layout: home
title: Vue DnD Kit
titleTemplate: A modern, lightweight, and high-performance drag and drop library for Vue 3

hero:
  name: Vue DnD Kit
  text: Drag & Drop for Vue 3
  tagline: A modern, lightweight, and high-performance drag and drop library for Vue 3
  image:
    src: https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg
    alt: Vue DnD Kit
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/zizigy/vue-dnd-kit

features:
  - icon: 🚀
    title: High Performance
    details: Optimized for smooth interactions even with large lists and complex interfaces
  - icon: 🧩
    title: Composable API
    details: Built with Vue 3's Composition API for maximum flexibility and reusability
  - icon: ♿
    title: Accessible
    details: Full keyboard navigation and screen reader support for inclusive interfaces
  - icon: 🔌
    title: Extensible
    details: Create custom drag overlays, sensors, and collision detection algorithms
  - icon: 🎯
    title: Precise Control
    details: Fine-grained control over drag start, move, and drop behaviors
  - icon: 📦
    title: Lightweight
    details: Minimal bundle size impact with no external dependencies
---

<script setup>
import DnDDemo from './.vitepress/components/DnDDemo.vue'
import DnDList from './.vitepress/components/DnDList.vue'
</script>

<DnDDemo />

::: tip Keyboard & Mouse Navigation
Try interacting with the demo above:

**Mouse:**

- Click and drag elements with your mouse
- Drop them in the target zone

**Keyboard:**

- Use **Tab** to focus on the draggable element
- Press **Space** to start dragging
- Use **Arrow keys** to move the element
- Press **Enter** to drop in the target zone
- Press **Escape** to cancel dragging

You can seamlessly switch between mouse and keyboard at any time during the drag operation!
:::

## Sortable Lists Made Easy

Vue DnD Kit makes it simple to create sortable interfaces. Try reordering the items below:

<DnDList />

## Seamless Animation Support

Vue DnD Kit is designed to work perfectly with Vue's built-in transition system and third-party animation libraries:

- **Vue Transitions**: Full support for `<Transition>` and `<TransitionGroup>` components
- **GSAP Integration**: Works seamlessly with GreenSock Animation Platform
- **Motion One**: Compatible with Motion One for physics-based animations
- **CSS Animations**: Easily apply CSS animations during drag operations
- **Custom Animation Hooks**: Add your own animation logic at any point in the drag lifecycle

## Ecosystem Integration

Vue DnD Kit is designed to play nicely with the Vue ecosystem and other popular libraries:

- **Pinia/Vuex**: Easily integrate with state management solutions
- **UI Libraries**: Compatible with Vuetify, PrimeVue, Element Plus, and more
- **Headless UI**: Perfect companion for headless UI libraries like VueUse
- **Tailwind CSS**: Easily style your drag and drop interfaces with utility classes

## Accessibility First

Vue DnD Kit is built with accessibility in mind. All draggable elements work seamlessly with keyboard navigation, making your interfaces accessible to everyone:

- **Tab** navigation between draggable elements
- **Space** to start dragging
- **Arrow keys** to move elements
- **Enter** to drop in target zones
- **Escape** to cancel dragging operations

You can seamlessly switch between mouse and keyboard interactions at any point during the drag operation, providing flexibility for all users regardless of their preferred input method.

This ensures your drag and drop interfaces are usable by people who rely on assistive technologies or prefer keyboard navigation.

## Why Vue DnD Kit?

Vue DnD Kit provides a modern solution for implementing drag and drop interfaces in Vue 3 applications. Unlike other libraries, it's built from the ground up with performance, accessibility, and developer experience in mind.

### Key Features

- **Flexible Architecture**: Create simple drag and drop interfaces or complex sortable lists
- **Keyboard Support**: Full keyboard navigation for accessibility
- **Custom Drag Overlays**: Complete control over the visual appearance during drag
- **Performant**: Optimized for minimal re-renders and smooth animations
- **TypeScript Support**: Full type definitions for improved developer experience
- **Customizable Sensors**: Support for mouse, touch, and keyboard interactions
- **Seamless Input Switching**: Switch between mouse and keyboard at any time
- **Animation Friendly**: Works perfectly with Vue transitions and animation libraries

## Installation

```bash
# npm
npm install @vue-dnd-kit/core @vueuse/core

# yarn
yarn add @vue-dnd-kit/core @vueuse/core

# pnpm
pnpm add @vue-dnd-kit/core @vueuse/core
```

## Ecosystem

- **@vue-dnd-kit/core**: Core functionality for drag and drop operations
- **@vue-dnd-kit/utils** (coming soon): Utility functions for common patterns
- **@vue-dnd-kit/components** (coming soon): Ready-to-use components for common use cases

## License

[MIT License](https://github.com/zizigy/vue-dnd-kit/blob/main/LICENSE) © 2024 ZiZiGY

<style> :root { --vp-home-hero-image-background-image: linear-gradient(-45deg, #42b883 50%, #35495e 50%); --vp-home-hero-image-filter: blur(72px); } /* Уменьшаем базовую прозрачность фона */ .VPHero .image-bg { opacity: 0.5; /* было 0.8 */ transition: opacity 1s ease; } .VPHero .image-container { transform: scale(1.2); } /* Настраиваем свечение для светлой и темной темы */ .VPHero .image-container::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; background: var(--vp-home-hero-image-background-image); filter: blur(120px); opacity: 0.3; /* было 0.6 */ z-index: -1; animation: pulse 4s ease-in-out infinite; } /* Настройка для светлой темы */ html:not(.dark) .VPHero .image-container::after { opacity: 0.2; /* Еще меньше прозрачности для светлой темы */ } @keyframes pulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; /* Уменьшили с 0.6 */ } 50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.4; /* Уменьшили с 0.8 */ } } /* Свечение при наведении тоже делаем мягче */ .VPHero .image-container:hover::after { animation: none; opacity: 0.5; /* было 0.8 */ filter: blur(90px); transition: all 0.5s ease; } </style>
