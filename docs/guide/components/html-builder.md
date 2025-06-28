# HTML Builder

A powerful visual HTML structure builder with drag-and-drop capabilities.

<script setup>
// No example import as we link to external demo
</script>

## Overview

The HTML Builder component provides a comprehensive visual interface for creating and manipulating HTML structures through an intuitive drag-and-drop system, complete with a component palette, tree view, and configuration panel.

<div class="example-placeholder">
  <p>This component has a dedicated external demo due to its complexity.</p>
  <p><a href="https://zizigy.github.io/html-builder/" target="_blank">View HTML Builder Demo</a></p>
</div>

## Implementation

### Basic Usage

```vue
<script setup lang="ts">
  import { ref } from 'vue';
  import { HTMLBuilderBase } from '{your component path}/HTMLBuilder';
</script>

<template>
  <HTMLBuilderBase />
</template>
```

## Features

- **Visual HTML Construction**: Create complex HTML structures without writing code
- **Component Palette**: Pre-defined components that can be dragged to the canvas
- **Tree View**: Visual representation of the HTML hierarchy with drag-and-drop support
- **Property Panel**: Configure element styles, attributes, and content
- **Drag and Drop**: Intuitive interface for structuring elements
- **Multi-selection**: Select multiple elements for bulk operations
- **Keyboard Shortcuts**: Enhanced productivity with keyboard controls
- **Element Visibility Toggle**: Show/hide elements without deleting them

## Installation

```bash
pnpm dlx @vue-dnd-kit/components add HTMLBuilder
```

## Import

```ts
// Import all modules
import {
  HTMLBuilderBase,
  HTMLBuilderTree,
  HTMLBuilderComponents,
  HTMLBuilderConfig,
} from '{your component path}/HTMLBuilder';

// Or import just what you need
import { HTMLBuilderBase } from '{your component path}/HTMLBuilder';
```

## Features Demonstrated

### Component Structure

The HTML Builder consists of several sub-components:

- **HTMLBuilderBase**: Main component with the canvas area
- **HTMLBuilderTree**: Tree view of the HTML structure
- **HTMLBuilderComponents**: Component palette for dragging elements
- **HTMLBuilderConfig**: Configuration panel for properties
- **HTMLBuilderDraggable**: Wrapper for draggable elements

### Keyboard Controls

- **Shift**: Required to move elements
- **Escape**: Cancel element selection
- **Ctrl**: Swap elements instead of transfer when dragging

### Element Operations

- **Add**: Drag components from the palette to the canvas
- **Move**: Drag elements within the canvas or tree view
- **Delete**: Remove elements with the delete button
- **Hide/Show**: Toggle element visibility
- **Configure**: Edit properties through the config panel

## Use Cases

- **Web Page Builders**: Create visual web page editors
- **Form Builders**: Design complex form layouts
- **Email Template Builders**: Design responsive email templates
- **CMS Content Editors**: Provide visual editing for CMS systems
- **Prototyping Tools**: Quick prototyping of interface layouts

## Additional Resources

- [GitHub Repository](https://github.com/ZiZIGY/html-builder)
- [Live Demo](https://zizigy.github.io/html-builder/)
