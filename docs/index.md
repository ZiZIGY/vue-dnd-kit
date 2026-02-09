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
      text: Documentation v1
      link: /v1/guide/introduction
    - theme: alt
      text: Documentation v2
      link: /v2/guide/introduction
---

<style> :root { --vp-home-hero-image-background-image: linear-gradient(-45deg, #42b883 50%, #35495e 50%); --vp-home-hero-image-filter: blur(72px); } /* Уменьшаем базовую прозрачность фона */ .VPHero .image-bg { opacity: 0.5; /* было 0.8 */ transition: opacity 1s ease; } .VPHero .image-container { transform: scale(1.2); } /* Настраиваем свечение для светлой и темной темы */ .VPHero .image-container::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 80%; background: var(--vp-home-hero-image-background-image); filter: blur(120px); opacity: 0.3; /* было 0.6 */ z-index: -1; animation: pulse 4s ease-in-out infinite; } /* Настройка для светлой темы */ html:not(.dark) .VPHero .image-container::after { opacity: 0.2; /* Еще меньше прозрачности для светлой темы */ } @keyframes pulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; /* Уменьшили с 0.6 */ } 50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.4; /* Уменьшили с 0.8 */ } } /* Свечение при наведении тоже делаем мягче */ .VPHero .image-container:hover::after { animation: none; opacity: 0.5; /* было 0.8 */ filter: blur(90px); transition: all 0.5s ease; }

[data-vue-dnd-kit-draggable="true"] {
  touch-action: none;
}
</style>
