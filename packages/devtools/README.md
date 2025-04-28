# Vue Drag & Drop Library - DevTools Package

[![Release](https://img.shields.io/badge/status-release-green.svg)](https://github.com/zizigy/vue-dnd-kit)

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  DevTools package of the Vue Drag & Drop library with enhanced debugging capabilities.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

<p align="center">
  Extends Vue DevTools with specialized panels for debugging drag and drop operations
</p>

## Enhanced Debugging

Vue DnD Kit DevTools provides specialized debugging tools for your drag and drop applications:

- 🔍 **Store state visualization** - inspect the complete state of your DnD system
- 📊 **Visual feedback** - see your drag elements, drop zones, and their relationships
- 🔄 **Real-time updates** - observe state changes as they happen during interactions
- 🧪 **Testing aid** - quickly identify issues in complex drag and drop scenarios

## Powerful Inspector Panels

The DevTools package extends Vue DevTools with multiple specialized panels:

- 📱 **Full Store Overview**

  - Complete visibility into the DnD store
  - Access to all internal state values
  - Reactive updates as operations occur

- 🖱️ **Pointer Tracking**

  - Monitor cursor/touch position
  - View start and current positions
  - Inspect pixel and percentage offsets

- 🧩 **Elements Inspector**

  - View all registered draggable elements
  - Track visibility status
  - Monitor selection state

- 🎯 **Drop Zones Panel**

  - Inspect registered drop zones
  - Check visibility and hover states
  - Debug zone constraints

- 📦 **Container Tools**

  - View active containers
  - Monitor component references
  - Debug container relationships

- 👆 **Hover States**

  - Track elements under the cursor
  - Monitor intersection states
  - Debug hover-related issues

## Installation

Choose your preferred package manager:

```bash
npm install @vue-dnd-kit/devtools @vue-dnd-kit/core @vueuse/core
```

```bash
yarn add @vue-dnd-kit/devtools @vue-dnd-kit/core @vueuse/core
```

```bash
pnpm install @vue-dnd-kit/devtools @vue-dnd-kit/core @vueuse/core
```

## Setup

Register the DevTools extension in your main.ts/js file:

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import VueDnDKitPlugin from '@vue-dnd-kit/core';
import VueDnDKitDevtools from '@vue-dnd-kit/devtools';

const app = createApp(App);
app.use(VueDnDKitPlugin);
app.use(VueDnDKitDevtools);
app.mount('#app');
```

## Usage

Once installed and registered, the DevTools extension will automatically:

1. Register with Vue DevTools
2. Add a "DnD Kit" panel to the inspector
3. Display real-time state information as you interact with your application

No additional code is required in your components to enable the debugging features.

## 📄 License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)

---

<p align="center">🔍 Enhance your debugging experience!</p>
<p align="center">Made with ❤️ for the Vue.js community</p>
