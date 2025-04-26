# useDragContainer

`useDragContainer` is a core composable that allows registering a custom container where dragged elements will be displayed. This composable gives users complete freedom to customize how dragged elements appear during drag operations.

## API Reference

### Usage

```ts
const result = useDragContainer();
```

The `useDragContainer` composable doesn't accept any parameters.

### Return Value

`useDragContainer` returns an object with the following properties:

| Property         | Type                       | Description                                           |
| ---------------- | -------------------------- | ----------------------------------------------------- |
| elementRef       | `Ref<HTMLElement \| null>` | Template ref to attach to the container element       |
| draggingElements | `Map<Element, any>`        | Map of all currently dragged elements                 |
| pointerPosition  | `Object`                   | Current and initial pointer positions during dragging |
| isDragging       | `ComputedRef<boolean>`     | Whether a drag operation is currently active          |

#### pointerPosition Object

The `pointerPosition` object includes:

| Property       | Type                  | Description                                |
| -------------- | --------------------- | ------------------------------------------ |
| start          | `Ref<IPoint \| null>` | Starting position when drag began          |
| current        | `Ref<IPoint \| null>` | Current pointer position during dragging   |
| offset.percent | `Ref<IPoint \| null>` | Offset as percentage of element dimensions |
| offset.pixel   | `Ref<IPoint \| null>` | Offset in pixels                           |

## Important Notes

1. The `elementRef` must be bound to your container element in the template.

2. The container is automatically registered with the DnD system on mount and unregistered on unmount.

3. For proper positioning of dragged elements, use the values from `pointerPosition`.

4. If you create multiple drag containers, the most recently mounted one will be active.

5. Containers typically use `pointer-events: none` to prevent interfering with normal interactions.

6. To handle multi-select effectively, check `draggingElements.size` to determine how many elements are being dragged.

7. The container should typically be positioned fixed or absolute and cover the entire viewport to ensure dragged elements are visible anywhere.

8. For performance reasons, apply `will-change: transform` to elements that will move during dragging.

9. You may want to conditionally show the container only when `isDragging` is true to improve performance.
