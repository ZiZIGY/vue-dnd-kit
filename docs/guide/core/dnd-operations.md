# DnDOperations

`DnDOperations` is a utility class that provides array manipulation methods for drag and drop operations. It handles common array operations like moving, copying, and swapping items between arrays, with special convenience methods that work directly with the drag and drop store.

## Purpose

When implementing drag and drop functionality, you often need to update arrays (like lists, grids, or collections) after a drop operation. The `DnDOperations` class provides standardized methods to handle these array manipulations consistently, regardless of your specific data structures.

## Basic Usage

```ts
import { DnDOperations } from '@vue-dnd-kit/core';

// In a drop handler
const { elementRef } = useDroppable({
  groups: ['items'],
  data: { source: targetArray },
  events: {
    onDrop: (store) => {
      // Move the dragged item to this drop zone
      DnDOperations.applyTransfer(store);
    },
  },
});
```

## API Reference

### Basic Array Operations

These methods operate directly on arrays without requiring the drag and drop store:

#### remove

```ts
static remove(source?: any[], index?: number): any
```

Removes an item from an array at the specified index and returns the removed item.

#### insert

```ts
static insert(target?: any[], index?: number, item?: any): void
```

Inserts an item into an array at the specified index.

#### move

```ts
static move(source?: any[], sourceIndex?: number, target?: any[], targetIndex?: number): void
```

Moves an item from one position to another, possibly between different arrays.

#### swap

```ts
static swap(source?: any[], sourceIndex?: number, target?: any[], targetIndex?: number): void
```

Swaps two items between arrays.

#### copy

```ts
static copy(source?: any[], index?: number, target?: any[], targetIndex?: number): void
```

Copies an item from one array to another without removing it from the source.

### Store-Based Operations

These convenience methods automatically extract data from the drag and drop store:

#### applyTransfer

```ts
static applyTransfer(store: IDnDStore): void
```

Moves all dragging elements to the currently hovered element or zone.

#### applyCopy

```ts
static applyCopy(store: IDnDStore): void
```

Copies all dragging elements to the currently hovered element or zone without removing them from their source.

#### applySwap

```ts
static applySwap(store: IDnDStore): void
```

Swaps the dragging element with the hovered element. Falls back to a move operation if multiple elements are dragging or if hovering over a zone.

#### applyRemove

```ts
static applyRemove(store: IDnDStore): void
```

Removes all dragging elements from their source arrays.

#### applyInsert

```ts
static applyInsert(store: IDnDStore, items: any[]): void
```

Inserts the provided items at the location of the currently hovered element or at the end of the hovered zone.

## Common Use Cases

### 1. Moving items between lists

```ts
// In a droppable's onDrop handler
onDrop: (store) => {
  DnDOperations.applyTransfer(store);
};
```

### 2. Copying items to a new list

```ts
// In a droppable's onDrop handler
onDrop: (store) => {
  DnDOperations.applyCopy(store);
};
```

### 3. Swapping items in a grid or list

```ts
// In a droppable's onDrop handler
onDrop: (store) => {
  DnDOperations.applySwap(store);
};
```

### 4. Deleting items (via drag to a "trash" zone)

```ts
// In a trash zone's onDrop handler
onDrop: (store) => {
  DnDOperations.applyRemove(store);
};
```

## Important Notes

1. All methods safely handle undefined or null values by simply returning early.

2. The store-based operations automatically extract source and target information from the drag and drop store.

3. For `applyTransfer`, `applyCopy`, and `applySwap` to work properly, both draggable elements and drop zones must have the correct data structure:

   ```ts
   data: {
     source: myArray, // The array containing the item
     index: 0         // The index of the item in the array
   }
   ```

4. The operations update the arrays in-place, ensuring that Vue's reactivity system detects the changes.

5. `applySwap` only works with a single dragged element; it falls back to a move operation for multiple elements.
