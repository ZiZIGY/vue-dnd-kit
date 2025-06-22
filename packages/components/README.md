# Vue Drag & Drop Library - Components Package

[![Beta](https://img.shields.io/badge/status-beta-yellow.svg)](https://github.com/zizigy/vue-dnd-kit)

> ⚠️ **Warning**: This project is in active development (beta). The API may change between minor versions. Not recommended for production use until version 1.0.0.

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/">
    <img src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg" width="400" alt="Vue Drag & Drop Logo">
  </a>
</p>

<p align="center">
  Ready-to-use components for the Vue Drag & Drop library with Kanban, Table, Tree, and more.
</p>

<p align="center">
  <a href="https://zizigy.github.io/vue-dnd-kit/" target="_blank">
    <img src="https://img.shields.io/badge/Documentation-Visit-blue?style=flat-square" alt="Documentation">
  </a>
</p>

<p align="center">
  Inspired by the popular <a href="https://dndkit.com/" target="_blank">React DnD Kit</a> library, adapted for Vue.js
</p>

## Project Status

This project is in active development. We're working toward a stable API, but until version 1.0.0, there may be breaking changes.

Roadmap:

- [x] Basic drag & drop components
- [x] Table component
- [x] Kanban board
- [x] Tree component
- [x] SortableList
- [ ] FormBuilder
- [ ] HTMLBuilder
- [x] Dashboard
- [ ] Grid
- [ ] Tests
- [ ] Stable API (version 1.0.0)

## Features

### Component Presets

- 📋 **Table Component**

  - Customizable structure
  - Flexible column handling
  - Minimal styling for easy customization
  - Full control over drag & drop behavior

- 📊 **Kanban Board**

  - Simple column and item structure
  - Unopinionated styling
  - Flexible data handling
  - Customizable drag & drop logic

- 🌳 **Tree Component**

  - Hierarchical tree structure with unlimited nesting levels
  - Expandable/collapsible tree nodes
  - Visual indicators for items with and without children
  - Drag and drop functionality for reordering and moving items
  - Empty zone highlighting for drop targets

- 🧩 **Base Components**

  - Draggable
  - Droppable
  - DragHandle

### Design Philosophy

- 🎨 **Minimal Styling**

  - Components come with minimal styling
  - Full freedom to implement your own design
  - No CSS dependencies
  - Easy to integrate with any UI framework

- 🔧 **Maximum Flexibility**

  - Components don't enforce specific data structures
  - Custom event handling
  - Write your own drag & drop logic
  - Extend components as needed

### Integration

- 🔌 **Framework Integration**
  - Vue 3 Composition API
  - TypeScript support
  - Works with Nuxt.js
  - Compatible with any styling approach

## Installation

Choose your preferred package manager:

```bash
npm install @vue-dnd-kit/components @vue-dnd-kit/core
```

```bash
yarn add @vue-dnd-kit/components @vue-dnd-kit/core
```

```bash
pnpm install @vue-dnd-kit/components @vue-dnd-kit/core
```

## CLI

Vue DnD Kit provides a CLI to quickly install components.

We recommend using [pnpm](https://pnpm.io/) to run the CLI:

```bash
# List available components
pnpm dlx @vue-dnd-kit/components list

# Add a component to your project
pnpm dlx @vue-dnd-kit/components add <component-name>

# Add a component to a specific directory
pnpm dlx @vue-dnd-kit/components add <component-name> --dir src/shared/components

# Debug information (for developers)
pnpm dlx @vue-dnd-kit/components debug
```

> **Note:** Some Node.js versions may have compatibility issues when using `npx`. We recommend using `pnpm dlx` or `yarn dlx` instead of `npx`.

### Available Commands

- `list`: Show available components
- `add <component-name>`: Add a component to your project
  - Options:
    - `-d, --dir <directory>`: Directory to install the component (default: `src/components`)
- `debug`: Debug information (for developers)

### Available Components

- `Table` - Draggable table with sortable rows and columns
- `Kanban` - Kanban board with draggable columns and items
- `Tree` - Hierarchical tree structure with drag and drop functionality

## 📄 License

[MIT](LICENSE) © [ZiZiGY](https://github.com/ZiZiGY)

---

<p align="center">Made with ❤️ for the Vue.js community</p>
