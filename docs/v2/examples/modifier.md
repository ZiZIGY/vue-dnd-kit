# Drag Modifier

The `modifier` option on `makeDraggable` requires one or more keyboard keys to be held before a drag can start. Use it for mode-switching (e.g. Alt+drag to copy, Ctrl+drag to move).

<script setup>
import Example from '@examples-v2/Modifier/Example.vue';
</script>

## Demo

<Example />

The green card drags freely. The purple card requires **Alt** to be held — try dragging it without Alt (nothing happens), then hold Alt and drag.

## Options

```ts
makeDraggable(ref, {
  modifier: {
    keys: string[];          // key codes that must be (pressed/not)
    method: 'every' | 'some'; // 'every' = all keys must be held, 'some' = any key
  }
});
```

### `keys`

Array of [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) values. Examples:
- `'AltLeft'`, `'AltRight'` — left/right Alt
- `'ControlLeft'`, `'ControlRight'` — Ctrl
- `'ShiftLeft'`, `'ShiftRight'` — Shift
- `'MetaLeft'` — Cmd (Mac)

### `method`

- `'every'` — **all** listed keys must be held (default for conjunctions)
- `'some'` — **any** of the listed keys is sufficient

### Examples

```ts
// Either Alt key — drag only when Alt is held
makeDraggable(ref, {
  modifier: { keys: ['AltLeft', 'AltRight'], method: 'some' },
});

// Must hold both Ctrl and Shift
makeDraggable(ref, {
  modifier: { keys: ['ControlLeft', 'ShiftLeft'], method: 'every' },
});
```

## Common patterns

### Alt to copy

Use `modifier` on a second draggable registered on the same element to enable copy-drag:

```ts
// Normal drag (move)
makeDraggable(ref, {
  events: { onSelfDragEnd: (e) => applyMove(e) },
});

// Alt+drag (copy) — in practice use a single draggable with key check in the handler
makeDraggable(ref, {
  modifier: { keys: ['AltLeft', 'AltRight'], method: 'some' },
  events: { onSelfDragEnd: (e) => applyCopy(e) },
});
```

See the [Copy example](/v2/examples/copy) for a working copy implementation.

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Modifier/Example.vue)
- [ModifierCard.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Modifier/ModifierCard.vue)

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — full options reference
- [Copy example](/v2/examples/copy) — copy with Alt key
