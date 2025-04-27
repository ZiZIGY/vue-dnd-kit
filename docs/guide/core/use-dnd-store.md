# useDnDStore

`useDnDStore` provides access to the global drag and drop state store. This is a singleton store (similar to Pinia but lightweight and specialized) that manages all draggable elements, drop zones, and the current drag state.

While the basic drag and drop functionality works without directly accessing this store, it's useful for advanced customization scenarios, such as implementing custom animations, creating complex drag visualizations, or adding specialized behaviors.

## Usage

```ts
import { useDnDStore } from '@vue-dnd-kit/core';

const store = useDnDStore();
```

## API Reference

### Store Properties

| Property         | Type                                  | Description                                             |
| ---------------- | ------------------------------------- | ------------------------------------------------------- |
| draggingElements | `Ref<Map<Element, IDraggingElement>>` | Map of currently dragging elements                      |
| isDragging       | `ComputedRef<boolean>`                | Whether any element is currently being dragged          |
| elementsMap      | `Ref<Map<Element, IDragElement>>`     | Map of all registered draggable elements                |
| selectedElements | `Ref<Set<Element>`                    | Map of all selected elements (for multi-drag)           |
| zonesMap         | `Ref<Map<Element, IDropZone>>`        | Map of all registered drop zones                        |
| visibleZones     | `Ref<Set<Element>>`                   | Set of drop zones currently visible in viewport         |
| visibleElements  | `Ref<Set<Element>>`                   | Set of draggable elements currently visible in viewport |
| pointerPosition  | `Object`                              | Current and initial pointer positions                   |
| keyboard         | `Object`                              | State of keyboard keys (using VueUse's useMagicKeys)    |
| hovered          | `Object`                              | Currently hovered zone and element                      |
| activeContainer  | `Object`                              | Active overlay container component and reference        |

### Pointer Position Object

```ts
pointerPosition: {
  start: Ref<IPoint | null>,      // Initial position when drag started
  current: Ref<IPoint | null>,    // Current position during drag
  offset: {
    percent: Ref<IPoint | null>,  // Offset as percentage of element size
    pixel: Ref<IPoint | null>,    // Offset in pixels
  }
}
```

### Hovered Object

```ts
hovered: {
  zone: Ref<Element | null>,     // Currently hovered drop zone
  element: Ref<Element | null>   // Currently hovered draggable element
}
```

### Keyboard Object

```ts
keyboard: {
  w: Ref<boolean>,     // Whether 'w' key is pressed
  s: Ref<boolean>,     // Whether 's' key is pressed
  a: Ref<boolean>,     // Whether 'a' key is pressed
  d: Ref<boolean>,     // Whether 'd' key is pressed
  ctrl: Ref<boolean>,  // Whether Control key is pressed
  shift: Ref<boolean>, // Whether Shift key is pressed
  alt: Ref<boolean>,   // Whether Alt key is pressed
  meta: Ref<boolean>   // Whether Meta key is pressed
}
```

## Important Notes

1. The store is automatically used by `useDraggable` and `useDroppable` - you don't need to access it directly for basic drag and drop operations.
2. The store follows a singleton pattern - all calls to `useDnDStore()` return the same instance.
3. All properties are reactive, allowing you to create computed properties or watch for changes.
4. The store uses IntersectionObserver internally to track which elements are visible in the viewport.
5. You can access the store from any component without additional setup or provider components.
6. The store is primarily intended for advanced customization and extension of the drag and drop system.
7. Internal methods like `handleDragElementIntersection` and `handleDropZoneIntersection` are not recommended for direct use as they're part of the library's internal infrastructure.
