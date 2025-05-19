# Async Drop Validation with Promises

This example demonstrates how to implement asynchronous drop validation using Promises in Vue DnD Kit. This pattern is useful when you need to confirm drops with user interaction or validate drops against an API.

<script setup>
import Example from '@examples/PromiseDrop/Example.vue';
</script>

## Overview

Sometimes you need to validate or confirm a drop operation before it completes. Vue DnD Kit supports returning a Promise from the `onDrop` event handler, which can resolve to `true` or `false` to indicate whether the drop should be accepted.

In this example, when you drop the element, a confirmation dialog appears. The drop only completes if the user clicks "OK".

<Example/>

## How It Works

This example uses Vue DnD Kit's Promise support in the `onDrop` event handler to create an asynchronous validation flow. The drop operation waits for the Promise to resolve before completing or cancelling.

## Example Code

### Main Example Component

```vue
<script setup lang="ts">
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';

  const {
    elementRef: draggableRef,
    handleDragStart,
    isDragging,
  } = useDraggable();

  const { elementRef: droppableRef, isOvered } = useDroppable({
    events: {
      onDrop() {
        return new Promise((resolve) => {
          const result = confirm('Are you sure?');
          resolve(result);
        });
      },
    },
  });
</script>

<template>
  <div class="container">
    <div
      ref="draggableRef"
      class="draggable"
      :class="{ 'is-dragging': isDragging }"
      @pointerdown="handleDragStart"
    >
      Draggable
    </div>

    <div
      ref="droppableRef"
      class="droppable"
      :class="{ 'is-overed': isOvered }"
    >
      Droppable
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .draggable {
    padding: 1rem;
    border-radius: 6px;
    background-color: rgba(62, 175, 124);
  }

  .is-dragging {
    opacity: 0.5;
  }

  .droppable {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
  }

  .droppable.is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }
</style>
```

## Key Implementation Details

### Promise-based Drop Validation

The core functionality is implemented in the `onDrop` event handler:

```js
onDrop() {
  return new Promise((resolve) => {
    const result = confirm('Are you sure?');
    resolve(result);
  });
}
```

This code:

1. Returns a new Promise from the `onDrop` handler
2. Shows a confirmation dialog to the user
3. Resolves the Promise with `true` if the user confirms, or `false` if they cancel
4. The drag and drop system waits for this Promise to resolve before completing the drop

### Real-world Applications

You can extend this pattern for various use cases:

```js
onDrop: async (store, payload) => {
  // API validation
  try {
    const isValid = await api.validateDrop(payload.items[0].data);
    return isValid;
  } catch (error) {
    console.error('Validation failed:', error);
    return false;
  }
};
```

```js
onDrop: async () => {
  // Custom confirmation UI
  return await showCustomDialog({
    title: 'Confirm Drop',
    message: 'Are you sure you want to move this item?',
  });
};
```

## Practical Applications

This technique is valuable for:

- User confirmation before destructive actions
- API validation before accepting drops
- Complex business rule validation
- Integration with external services
- Multi-step drop workflows

## Additional Considerations

### Error Handling

When working with Promises, proper error handling is important:

```js
onDrop: async () => {
  try {
    const result = await someAsyncValidation();
    return result;
  } catch (error) {
    console.error('Validation failed:', error);
    // You might want to show an error message to the user
    return false;
  }
};
```

### User Experience

Consider these UX aspects when implementing async validation:

1. Show loading indicators for longer operations
2. Provide clear feedback about validation results
3. Handle timeout cases gracefully
4. Consider accessibility in custom confirmation UIs

### Performance

For optimal performance:

- Cache validation results when possible
- Set appropriate timeouts for async operations
- Consider using `isLazyAllowed` for expensive validations
- Implement request cancellation for abandoned drops

## Conclusion

Promise-based drop validation in Vue DnD Kit provides a powerful way to implement complex validation logic and user interactions in your drag and drop interfaces. Whether you need simple user confirmation or complex API validation, the async drop pattern gives you the flexibility to handle these requirements elegantly.

This pattern integrates seamlessly with Vue DnD Kit's event system while maintaining clean, readable code and providing a smooth user experience.
