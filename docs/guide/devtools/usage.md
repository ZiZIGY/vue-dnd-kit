# DevTools

Vue DnD Kit includes a powerful DevTools package that helps you debug and visualize your drag and drop state in real-time. This integration works with Vue DevTools to provide enhanced inspection capabilities for your application.

## Installation

To use DevTools, first install the package:

::: code-group

```bash [yarn]
yarn add @vue-dnd-kit/devtools
```

```bash [npm]
npm install @vue-dnd-kit/devtools
```

```bash [pnpm]
pnpm add @vue-dnd-kit/devtools
```

:::

If you haven't installed the core package yet, you'll need both:

```bash
yarn add @vueuse/core @vue-dnd-kit/core @vue-dnd-kit/devtools
```

## Integration

Add the DevTools to your Vue application:

```js
// main.js or main.ts
import { createApp } from 'vue';
import App from './App.vue';
import VueDnDKitPlugin from '@vue-dnd-kit/core';
import VueDnDKitDevtools from '@vue-dnd-kit/devtools';

const app = createApp(App);

// Register the core plugin
app.use(VueDnDKitPlugin);

// Register DevTools (automatically only enabled in development mode)
app.use(VueDnDKitDevtools);

app.mount('#app');
```

The DevTools integration automatically disables itself in production builds, so you don't need to conditionally import or register it.

## Using DevTools

After installing and registering the DevTools plugin, follow these steps to access the debugging interface:

1. Open your application in a development environment
2. Open browser DevTools (F12 or right-click → Inspect)
3. Navigate to the Vue panel in DevTools
4. Look for the "DnD Store" section in the Vue DevTools sidebar

![Vue DnD Kit DevTools](/public/docs/images/devtools-screenshot.png)

## Features

The DevTools panel provides you with:

### State Inspection

- **Elements Map**: View all registered draggable elements
- **Zones Map**: See all registered drop zones
- **Pointer Position**: Track the current and initial positions during drag
- **Dragging Elements**: Inspect currently dragging elements
- **Selection State**: View selected elements for multi-drag operations

### Interactive Debugging

- Observe state changes in real-time as you interact with drag and drop elements
- Easily identify which elements are visible in the viewport
- See which drop zones are active and which are being hovered over

### Troubleshooting

DevTools makes it easy to debug common issues:

- Verify that your draggable elements and drop zones are properly registered
- Check if elements are in the expected groups
- See if drop zone and draggable elements are visible to the system
- Verify pointer position calculations
- Inspect container and hover states

## Tips for Effective Debugging

- Use unique IDs for your draggable elements and drop zones to easily identify them in DevTools
- Check the "keyboard" section to verify key presses are detected correctly
- Use the "visibleElements" and "visibleZones" lists to ensure your elements are visible
- During complex debugging, you can use the Vue DevTools "Timeline" feature to track how the DnD state changes over time
