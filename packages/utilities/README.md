# Vue DnD Kit - Utilities

[![Release](https://img.shields.io/badge/status-release-green.svg)](https://github.com/zizigy/vue-dnd-kit)
[![npm version](https://img.shields.io/npm/v/@vue-dnd-kit/utilities.svg)](https://www.npmjs.com/package/@vue-dnd-kit/utilities)

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/v2/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  Utility helpers for Vue DnD Kit — reactive flags and helpers that work with <code>@vue-dnd-kit/core</code>.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

---

## About

**@vue-dnd-kit/utilities** — small add-on for [@vue-dnd-kit/core](https://www.npmjs.com/package/@vue-dnd-kit/core). Provides composable helpers that return reactive state (e.g. “is this element being dragged?” or “is it selected?”).

- **Lightweight** — thin layer over core, no extra runtime
- **Reactive** — returns `ComputedRef<boolean>` for use in templates or watchers
- **TypeScript** — fully typed

---

## Installation

```bash
npm install @vue-dnd-kit/utilities
```

```bash
yarn add @vue-dnd-kit/utilities
```

```bash
pnpm add @vue-dnd-kit/utilities
```

**Peer dependencies:** Vue 3, `@vue-dnd-kit/core` ^2.0.0

---

## License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)
