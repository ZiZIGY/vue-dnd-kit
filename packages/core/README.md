# Vue DnD Kit - Core Package

[![Release](https://img.shields.io/badge/status-release-green.svg)](https://github.com/zizigy/vue-dnd-kit)
[![npm version](https://img.shields.io/npm/v/@vue-dnd-kit/core.svg)](https://www.npmjs.com/package/@vue-dnd-kit/core)

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/v2/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  Core package of the Vue Drag & Drop library with composables and provider-based API.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

<p align="center">
  Inspired by <a href="https://dndkit.com/" target="_blank">React DnD Kit</a>, adapted for Vue.js
</p>

---

## About

**Vue DnD Kit** — lightweight drag & drop library for Vue 3. Built around a provider (`DnDProvider`) and composables: `makeDraggable`, `makeDroppable`, `makeSelectionArea`, `makeConstraintArea`.

- **Lightweight** — small bundle size, no extra dependencies (Vue as peer only)
- **Flexible** — works with any layout and design system
- **Accessible** — full keyboard support (start, move, cancel, drop)
- **TypeScript** — fully typed

---

## Features

- **Composables API** — `makeDraggable`, `makeDroppable`, `makeSelectionArea`, `makeConstraintArea`
- **Provider-based** — `DnDProvider` + `useDnDProvider` for state access
- **Keyboard support** — Enter/Space for start and drop, arrows for movement, Escape to cancel
- **Modifier keys** — drag only when modifier held (e.g. Ctrl)
- **Custom overlay** — custom drag preview via slot or `render` option

---

## Installation

```bash
npm install @vue-dnd-kit/core
```

```bash
yarn add @vue-dnd-kit/core
```

```bash
pnpm add @vue-dnd-kit/core
```

**Peer dependency:** Vue 3

---

## License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)

---

<p align="center">🎉 Congratulations on the official release! 🎉</p>
<p align="center">Made with ❤️ for the Vue.js community</p>
