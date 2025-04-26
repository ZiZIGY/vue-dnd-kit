# Core Package

The `@vue-dnd-kit/core` package is the foundation of the Vue DnD Kit ecosystem. It provides essential functionality for implementing drag and drop interfaces in your Vue applications.

## What's Included

The Core package includes:

- **Drag & Drop Logic**: The fundamental system for tracking drag operations
- **State Management**: A global store for drag and drop state
- **Composable APIs**: Vue composables for creating draggable elements and drop zones
- **Selection Management**: Tools for implementing multi-select and drag
- **Grouping System**: Control which elements can interact with which drop zones
- **Array Utilities**: Helper functions for common operations during drops

## Key Features

- 🔄 **Reactive**: Built with Vue's reactivity system at its core
- 🎯 **Intuitive API**: Familiar composable-based API that integrates with Vue 3
- 🔌 **Extensible**: Designed to be extended with custom behaviors and sensors
- 🎛️ **Fine Control**: Complete control over drag behaviors and animations
- 🧩 **Modular**: Use only what you need from the ecosystem
- 🧠 **Smart Defaults**: Works out of the box with sensible defaults

## Core Composables

- `useDraggable`: Create draggable elements
- `useDroppable`: Create drop zones
- `useDnDStore`: Access the global drag and drop state
- `useSelection`: Implement multi-select functionality

## Utilities

- `DnDOperations`: Helper functions for array manipulation during drag operations

## Conceptual Overview

Vue DnD Kit uses a system of **draggable elements** and **drop zones** connected through a central **store**. Elements can be dragged and dropped between zones, with the library handling pointer events, visual feedback, and data updates.

### Groups

Groups define compatibility between draggable elements and drop zones. A draggable can only be dropped in zones that accept at least one of its groups.

### Data Flow

1. User interacts with a draggable element
2. Drag operation begins, updating the global store
3. As the element moves, the library tracks position and intersections
4. When dragging ends, event handlers perform the desired operations
5. Array utilities help update your data structures

## Getting Started

To start using Vue DnD Kit Core, check out these resources:

- [Installation Guide](/guide/installation)
- [Quick Start Guide](/guide/quick-start)
- [useDraggable Documentation](/guide/core/use-draggable)
- [useDroppable Documentation](/guide/core/use-droppable)

For more detailed documentation on specific composables and utilities, explore the sidebar navigation.
