---
layout: home
title: Vue DnD Kit
titleTemplate: A modern, lightweight, and high-performance drag and drop library for Vue 3

hero:
  name: Vue DnD Kit
  text: Drag & Drop for Vue 3
  tagline: A modern, lightweight, and high-performance drag and drop library for Vue 3
  sub: A set of composables to build anything — custom drag overlays, containers that react to hover, selection zones with multi-drag out of the box, with full control over rendering and behavior.
  image:
    src: https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg
    alt: Vue DnD Kit
  actions:
    - theme: brand
      text: Get Started
      link: /v2/guide/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/ZiZIGY/vue-dnd-kit

features:
  - title: High Performance
    description: Optimized for smooth interactions even with large lists and complex interfaces
    icon: mdi:rocket-launch
  - title: Composable API
    description: Built with Vue 3's Composition API for maximum flexibility and reusability
    icon: mdi:puzzle-outline
  - title: Accessible
    description: Full keyboard navigation and screen reader support for inclusive interfaces
    icon: mdi:accessibility
  - title: Extensible
    description: Create custom drag overlays, sensors, and collision detection algorithms
    icon: mdi:wrench
  - title: Precise Control
    description: Fine-grained control over drag start, move, and drop behaviors
    icon: mdi:target
  - title: Lightweight
    description: Minimal bundle size impact with no external dependencies
    icon: mdi:package-variant
---

<style> :root { --vp-home-hero-image-background-image: linear-gradient(-45deg, #42b883 50%, #35495e 50%); --vp-home-hero-image-filter: blur(72px); } .VPHero .image-bg { opacity: 0.5; transition: opacity 1s ease; } .VPHero .image-container { transform: scale(1.2); } .VPHero .image-container::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; background: var(--vp-home-hero-image-background-image); filter: blur(120px); opacity: 0.3; z-index: -1; animation: pulse 4s ease-in-out infinite; } html:not(.dark) .VPHero .image-container::after { opacity: 0.2; } @keyframes pulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; } 50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.4; } } .VPHero .image-container:hover::after { animation: none; opacity: 0.5; filter: blur(90px); transition: all 0.5s ease; } </style>

[data-vue-dnd-kit-draggable="true"] {
  touch-action: none;
}
