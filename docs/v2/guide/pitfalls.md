# Pitfalls & Best Practices

Common mistakes and how to avoid them.

## Fixed or absolute child breaks the overlay

**Symptom:** Drag overlay appears but collision detection stops working — items never highlight or accept drops.

**Cause:** `DnDProvider` renders a `Teleport` container (`dnd-kit-preview-container`) with `position: fixed`. If you wrap `DnDProvider`'s content in a `position: fixed` or `position: absolute` element, that element is pulled out of the normal document flow. The preview container's size collapses to **0×0**, making every collision check fail.

```vue
<!-- BAD: fixed child of DnDProvider content -->
<DnDProvider>
  <div style="position: fixed; inset: 0"> <!-- ← breaks collision -->
    <YourDraggableList />
  </div>
</DnDProvider>
```

```vue
<!-- GOOD: fixed wrapper outside DnDProvider, or use normal flow -->
<div style="position: fixed; inset: 0">
  <DnDProvider>
    <YourDraggableList />
  </DnDProvider>
</div>
```

If you need the draggables inside a scrollable fixed container, put `DnDProvider` inside that container, not the other way around.

---

## Calling `make*` composables outside `DnDProvider`

`makeDraggable`, `makeDroppable`, `makeConstraintArea`, `makeAutoScroll`, and `useDnDProvider` all call `inject` internally. They must be called inside a component that is rendered as a **descendant** of `DnDProvider` in the Vue component tree.

```vue
<!-- BAD: composable is in a sibling or parent of DnDProvider -->
<script setup>
  makeDraggable(ref); // inject fails — no DnDProvider above
</script>
<template>
  <DnDProvider>...</DnDProvider>
</template>
```

```vue
<!-- GOOD: component is rendered inside DnDProvider -->
<DnDProvider>
  <MyDraggable /> <!-- make* called inside this component -->
</DnDProvider>
```

---

## Not using `markRaw` on render components

When passing a component to `makeDraggable`'s `render` option, wrap it with `markRaw()`. Without it, Vue makes the component object deeply reactive, which causes unexpected re-renders and a Vue warning.

```ts
// BAD
makeDraggable(ref, { render: MyOverlay });

// GOOD
import { markRaw } from 'vue';
makeDraggable(ref, { render: markRaw(MyOverlay) });
```

---

## Mutating items arrays directly instead of replacing

The library detects changes by identity (`===`). Always return new arrays from `suggestSort`, `suggestSwap`, etc. — never mutate in place.

```ts
// BAD — splice mutates the array, library won't detect the change correctly
function onDrop(e) {
  const r = e.helpers.suggestSort('vertical');
  items.value.splice(0); // ← mutation
}

// GOOD — replace with the new array from the helper
function onDrop(e) {
  const r = e.helpers.suggestSort('vertical');
  if (r) items.value = r.targetItems as Item[];
}
```

---

## Overlay `transform` transition causes lag

Adding `transition: transform` to `.dnd-kit-preview` makes the overlay position animate instead of snapping to the cursor. This creates a visible "lag" that feels unresponsive.

```css
/* BAD: overlay trails behind cursor */
.dnd-kit-preview {
  transition: transform 0.2s ease;
}
```

If you want an enter/leave animation, use a [custom overlay component with Vue `<Transition>`](/v2/examples/overlay-transition) and animate `scale`/`opacity` instead.

---

## See also

- [Patterns & Concepts](/v2/guide/patterns) — recommended patterns for common scenarios
- [Overlay Transition](/v2/examples/overlay-transition) — animating the overlay correctly
