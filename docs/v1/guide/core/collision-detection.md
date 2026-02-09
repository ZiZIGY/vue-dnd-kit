# Collision Detection System

The collision detection system is a core component of the @vue-dnd-kit/core library that determines when and where draggable elements interact with drop zones.

## How Collision Detection Works

The collision detection system in the library consists of several key components:

### Detection Process

1. **Activation**: When dragging begins, the sensor is activated
2. **Detection Loop**: An animation frame loop (requestAnimationFrame) is initiated that periodically checks for collisions
3. **Detection Algorithm**: An algorithm (default or custom) is applied to determine overlapping elements
4. **Validation and Filtering**: Results are validated and filtered to exclude invalid interactions
5. **Result Processing**: State is updated and appropriate events are triggered

### Default Detection Algorithm

The built-in `defaultCollisionDetection` algorithm considers:

- **Element Overlap**: Calculates the percentage of overlap between the draggable element and potential drop zones
- **Pointer Position**: Prioritizes elements under the mouse pointer
- **Nesting Depth**: Considers the nesting level when working with hierarchical structures
- **Center Distance**: When overlap percentages are similar, chooses the closest element

### Sorting and Selection Process

The algorithm sorts potential collision zones using the following criteria:

1. If the pointer is inside a zone:

   - Priority is given to elements with greater nesting depth
   - Priority is given to elements containing the mouse pointer

2. If the pointer is outside the zone:
   - Priority is given to elements with a greater overlap percentage
   - When overlap percentages are close (difference ≤ 1%), the element with the closest center is selected

## Custom Collision Detection

The library allows you to create custom collision detection algorithms for specific tasks:

### Defining a Custom Sensor

You can replace the standard collision detection algorithm by providing a function in the parameters:

```js
// Example in simplified form
useDraggable({
  sensor: {
    setup: (store) => {
      // Your custom collision detection algorithm
      // Should return HTMLElement | HTMLElement[] | null
      return yourCustomDetectionLogic(store);
    },
    throttle: 100, // Optional call frequency limit (ms)
  },
});
```

### Example: Using document.elementsFromPoint()

Here's a simple example of a custom collision detection function using the browser's built-in `document.elementsFromPoint()` method:

```js
useDraggable({
  sensor: {
    setup: (store) => {
      // Get current pointer position from the store
      const x = store.pointerPosition.current.value?.x ?? 0;
      const y = store.pointerPosition.current.value?.y ?? 0;

      // Use the browser's native method to get all elements at the pointer position
      const elements = document.elementsFromPoint(x, y);

      // Return all elements at that position (the library will handle filtering)
      return elements.length > 0 ? elements : null;
    },
    // Add some throttling to improve performance
    throttle: 50,
  },
});
```

This example shows how you can leverage the browser's native APIs to create a simple but effective collision detection mechanism. The library will then handle filtering out invalid targets and applying group validation.

### What Your Detection Function Should Do

A custom detection function should:

1. Receive the current drag state (store)
2. Perform your own collision detection logic
3. Return the HTML element(s) with which collision occurs, or null

### Working with Groups

The system automatically checks group compatibility, so you don't need to handle this aspect in your custom function - the library will take care of it during the validation phase.

## Advanced Features

### Performance Optimization

To ensure smooth operation with a large number of elements:

- Throttling is used to limit the frequency of collision checks
- You can configure the check frequency via the `throttle` option

### Special Case Handling

The system accounts for:

- Dragging multiple selected elements
- **Preventing nested drops**: Automatically checks for DOM nesting relationships to prevent dropping elements into their own descendants or themselves
- Validating group compatibility to check drag permissions
- Prioritizing elements based on DOM hierarchy and nesting depth

## Conclusion

The collision detection system in Vue DnD Kit provides a flexible and powerful mechanism for precisely determining interactions between draggable elements. In most cases, the standard algorithm will work perfectly, but for complex cases, you can always implement your own detection logic.
