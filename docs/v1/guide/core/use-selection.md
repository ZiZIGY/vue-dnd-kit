# useSelection

`useSelection` is a specialized composable for managing multi-select and multi-drag operations. It's extracted into a separate utility to keep the core `useDraggable` implementation lean while providing powerful selection management when needed.

## Usage

```ts
import { useDraggable, useSelection } from '@vue-dnd-kit/core';
import { ref } from 'vue';

// First create a draggable element
const { elementRef } = useDraggable({
  /* options */
});

// Then add selection functionality to it
const { isSelected, handleSelect, handleToggleSelect } =
  useSelection(elementRef);
```

## API Reference

### Parameters

```ts
useSelection(elementRef: Ref<HTMLElement | null>)
```

| Parameter  | Type                       | Description                               |
| ---------- | -------------------------- | ----------------------------------------- |
| elementRef | `Ref<HTMLElement \| null>` | Reference to the element to be selectable |

### Return Value

`useSelection` returns an object with the following properties:

| Property           | Type                   | Description                               |
| ------------------ | ---------------------- | ----------------------------------------- |
| isSelected         | `ComputedRef<boolean>` | Whether the element is currently selected |
| isParentOfSelected | `ComputedRef<boolean>` | Whether any child elements are selected   |
| handleSelect       | `() => void`           | Function to select this element           |
| handleUnselect     | `() => void`           | Function to unselect this element         |
| handleToggleSelect | `() => void`           | Function to toggle selection state        |

## Selection Behavior

`useSelection` implements smart selection logic that handles parent-child relationships:

1. When selecting an element that has selected children, the children are automatically unselected
2. When selecting an element that has a selected parent, the parent is automatically unselected
3. This prevents conflicting selection states within the same DOM hierarchy

## Important Notes

1. `useSelection` provides only the basic selection management functions and does not handle keyboard modifiers by itself.

2. For implementing advanced selection behaviors that respond to keyboard modifiers (Shift, Ctrl, etc.), you'll need to combine `useSelection` with `useDnDStore`:

   ```ts
   import { useDnDStore } from '@vue-dnd-kit/core';

   const store = useDnDStore();

   // Now you can check keyboard states in your event handlers
   // store.keyboard.ctrl.value, store.keyboard.shift.value, etc.
   ```

3. Selected elements can be dragged together when using the appropriate drag operations.

4. Selection state is preserved between drag operations.

5. The composable automatically handles parent-child selection conflicts to maintain a consistent selection state.
