# HTML Builder

Vue DnD Kit provides a sophisticated HTML Builder component that enables visual construction and manipulation of HTML structures through an intuitive drag-and-drop interface.

<script setup>
// No direct example import needed as we'll link to the external demo
</script>

## Overview

The HTML Builder component is a powerful tool for creating and managing HTML structures with these key features:

1. **Visual HTML Construction**: Create complex layouts without writing code
2. **Intuitive Tree View**: Manage the hierarchy of elements
3. **Component Palette**: Drag and drop pre-defined components
4. **Real-time Configuration**: Edit element properties on the fly
5. **Interactive Preview**: See your changes as you make them

## Demo

The HTML Builder component is available as a separate demo due to its complexity and size:

[**Live Demo: HTML Builder**](https://zizigy.github.io/html-builder/)

## Usage

Since the HTML Builder is a complex component with many features, it's best to use it directly from the package rather than copying its code.

### Installation

You can add the HTML Builder component to your project with:

```bash
# Using the component CLI
pnpm dlx @vue-dnd-kit/components add HTMLBuilder
```

### Basic Setup

Import and use the component in your Vue application:

```vue
<script setup>
  import { HTMLBuilderBase } from './components/HTMLBuilder';
</script>

<template>
  <HTMLBuilderBase />
</template>
```

## Key Features

### Tree Structure

The HTML Builder provides a visual tree representation of your HTML structure:

- **Element Hierarchy**: See and manage the nesting of elements
- **Element Selection**: Click on tree items to edit their properties
- **Expand/Collapse**: Toggle visibility of nested elements
- **Drag and Drop**: Reorganize elements by dragging them in the tree

### Visual Editing

The central canvas provides an interactive editing experience:

- **WYSIWYG Interface**: See your changes as you make them
- **Direct Manipulation**: Move and resize elements on the canvas
- **Element Selection**: Click elements to select them for editing
- **Visual Feedback**: Highlighted active elements and drop zones

### Component Configuration

Comprehensive property editing for HTML elements:

- **Style Properties**: Adjust dimensions, borders, colors, etc.
- **Element Attributes**: Manage IDs, classes, and other attributes
- **Content Editing**: Modify text and other content
- **Visibility Control**: Toggle element visibility

## Additional Resources

For a deeper exploration of the HTML Builder's features and capabilities, visit:

- [GitHub Repository](https://github.com/ZiZIGY/html-builder)
- [Live Demo](https://zizigy.github.io/html-builder/)

## Usage Tips

When using the HTML Builder, keep in mind these helpful shortcuts:

- **Shift**: Required to move elements
- **Escape**: Cancels the currently selected element
- **Ctrl**: Swap elements instead of transferring when dragging
- Element selection can be done by clicking on items in the tree
