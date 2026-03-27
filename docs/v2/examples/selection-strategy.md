# Selection Strategy

`makeSelectionArea` accepts a `strategy` option that controls how elements are added to the selection while the rubber-band box moves.

<script setup>
import Example from '@examples-v2/SelectionStrategy/Example.vue';
</script>

## Demo

<Example />

Hold **Ctrl** and drag inside either zone to start rubber-band selection. Notice the difference as you move the box back over already-selected items.

## `toggle` (default)

Selection is **XORed** against the state at the moment drag started (`selectionBase`). If an item was already selected when the drag began, dragging over it again **deselects** it. Dragging away and back toggles it again. Great for additive/subtractive multi-select where you want to refine a selection without losing previously picked items.

## `select`

Only elements **currently inside** the box are selected. The moment the box moves away from an item it is deselected. Simple, predictable — what you see in the box is exactly what's selected.

## Usage

```ts
// toggle — default, same as omitting the option
const { isSelecting, style } = makeSelectionArea(el, {
  strategy: 'toggle',
  modifier: { keys: ['ControlLeft', 'ControlRight'], method: 'some' },
});

// select — "live" selection, only current box contents
const { isSelecting, style } = makeSelectionArea(el, {
  strategy: 'select',
  modifier: { keys: ['ControlLeft', 'ControlRight'], method: 'some' },
});
```

Render the selection rectangle with the returned `style`:

```vue
<div ref="el" style="position: relative">
  <div v-if="isSelecting" class="sel-rect" :style="style" />
  <MyItem v-for="(item, i) in items" ... />
</div>
```

```css
.sel-rect {
  position: absolute;
  border: 1.5px solid var(--vp-c-brand-1);
  background: rgba(62, 175, 124, 0.1);
  border-radius: 4px;
  pointer-events: none;
  z-index: 10;
}
```

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/SelectionStrategy/Example.vue)
- [SelectionZone.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/SelectionStrategy/SelectionZone.vue)
- [SelectionItem.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/SelectionStrategy/SelectionItem.vue)

## See also

- [Multi Selection](/v2/examples/multi-selection) — checkboxes + rubber-band together
- [makeSelectionArea](/v2/guide/core/make-selection-area) — full options reference
