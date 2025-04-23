# What is Vue DnD Kit?

Vue DnD Kit is a comprehensive ecosystem of drag and drop libraries for Vue 3 applications. It provides a set of modular, high-performance tools to build complex drag and drop interfaces with minimal effort.

## Philosophy

Vue DnD Kit was built with several core principles in mind:

- **Modularity**: Use only what you need, keeping your bundle size minimal
- **Performance**: Optimized for smooth interactions, even with large lists
- **Accessibility**: Built with ARIA support and keyboard navigation
- **Developer Experience**: Intuitive APIs and comprehensive TypeScript support
- **Flexibility**: Adaptable to a wide range of use cases without being opinionated

## The Problem

Building drag and drop interfaces from scratch is challenging. You need to handle:

- Touch and mouse events across different devices
- Accessibility requirements for all users
- Performance optimization for smooth interactions
- Complex state management during drag operations
- Cross-browser compatibility issues
- Collision detection between elements
- Animation and transitions for visual feedback

Most existing solutions are either too simple for complex use cases or too opinionated, limiting your design freedom.

## The Solution

Vue DnD Kit solves these problems with a thoughtful, composable approach that gives you powerful building blocks while maintaining flexibility in how you use them.

## Ecosystem Overview

Vue DnD Kit is divided into several packages to keep your bundle size minimal:

### @vue-dnd-kit/core

The foundation package providing essential drag and drop functionality through composables like `useDraggable` and `useDroppable`.

### @vue-dnd-kit/components

Ready-to-use components for common drag and drop patterns such as sortable lists, drag overlays, and more.

### @vue-dnd-kit/utils

Utility functions for collision detection, geometry calculations, auto-scrolling, and other helpful tools.

### @vue-dnd-kit/devtools

Development tools to debug and visualize your drag and drop interfaces during development.

## Key Concepts

Vue DnD Kit revolves around a few core concepts:

- **Draggable**: Elements that can be picked up and moved
- **Droppable**: Zones where draggable elements can be placed
- **Sensors**: Detect and normalize user interactions (mouse, touch, keyboard)
- **Collision Detection**: Determine when and where elements intersect
- **DnD Store**: Manage the state of drag operations across components

These concepts work together to create a cohesive system that's both powerful and flexible.

## Comparison with Other Libraries

| Feature        | Vue DnD Kit   | react-dnd    | vue-draggable | HTML5 Drag & Drop |
| -------------- | ------------- | ------------ | ------------- | ----------------- |
| Vue 3 Support  | ✅            | ❌           | ⚠️ (partial)  | ✅                |
| TypeScript     | ✅            | ✅           | ❌            | ❌                |
| Touch Support  | ✅            | ⚠️ (plugin)  | ✅            | ❌                |
| Nested DnD     | ✅            | ✅           | ⚠️ (limited)  | ❌                |
| Accessibility  | ✅            | ✅           | ❌            | ❌                |
| Custom Sensors | ✅            | ⚠️ (limited) | ❌            | ❌                |
| API Level      | 🟢 High + Low | 🟠 Medium    | 🟢 High       | 🔴 Low            |
| Bundle Size    | 🟢 Small      | 🟠 Medium    | 🟢 Small      | ✅ Built-in       |
| Customization  | 🟢 High       | 🟢 High      | 🟠 Medium     | 🔴 Low            |

### API Level Explained

Vue DnD Kit offers a unique hybrid approach to its API:

- **High-level API**: Ready-to-use components and composables for quick implementation
- **Low-level API**: Utility classes and functions for custom implementations and advanced use cases
- **Mixed approach**: Ability to use both high and low-level APIs together for maximum flexibility

This hybrid approach means you can start with high-level components for rapid development, then gradually customize with low-level utilities as your needs evolve.

## Use Cases

Vue DnD Kit is suitable for a wide range of applications:

- **Sortable Lists**: Reorder items within a list
- **Kanban Boards**: Move items between columns
- **File Uploads**: Drag and drop files from the desktop
- **Page Builders**: Create layouts by dragging components
- **Form Builders**: Design forms by arranging form elements
- **Data Tables**: Reorder rows or columns
- **Tree Views**: Reorganize hierarchical data
- **Shopping Carts**: Drag products to a cart
