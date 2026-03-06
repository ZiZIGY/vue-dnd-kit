# Drag Activation

The `activation` option on `makeDraggable` controls when a pointer-down becomes a drag. Use it to prevent accidental drags and improve touch usability.

<script setup>
import Example from '@examples-v2/Activation/Example.vue';
</script>

## Demo

<Example />

The green bar shows activation progress. For **Distance**, it fills as you move the pointer. For **Delay**, it fills while you hold down.

## Options

```ts
makeDraggable(ref, {
  activation: {
    distance?: number | { x?: number; y?: number; condition?: 'any' | 'both' };
    delay?: number;
  }
});
```

### `distance`

Minimum pointer movement in pixels before the drag starts.

```ts
// Simple — same threshold on both axes, drag if either axis exceeds it
makeDraggable(ref, { activation: { distance: 8 } });

// Per-axis — only horizontal movement activates drag
makeDraggable(ref, {
  activation: {
    distance: { x: 10, y: 0 },
  },
});

// condition: 'both' — both x and y must exceed threshold
makeDraggable(ref, {
  activation: {
    distance: { x: 5, y: 5, condition: 'both' },
  },
});
```

The default `condition` is `'any'` — either axis exceeding the threshold is enough.

### `delay`

Time in milliseconds the pointer must be held before drag starts.

```ts
// Hold 300ms before drag starts (good for mobile / long-press)
makeDraggable(ref, { activation: { delay: 300 } });
```

### Combining both

```ts
// Drag only starts if held 200ms AND moved 5px
makeDraggable(ref, {
  activation: {
    delay: 200,
    distance: 5,
  },
});
```

## Activation state

While the threshold is being evaluated, `provider.state.value === 'activating'`. You can read progress:

```ts
const provider = useDnDProvider();

// 0–1 progress of delay threshold
const delayProgress = computed(() => provider.delay.progress);

// 0–1 progress of distance threshold
const distProgress = computed(() => provider.distanceProgress.value);
```

Use these to show a progress indicator (hold bar, fill ring, etc.).

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Activation/Example.vue)
- [ActivationItem.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Activation/ActivationItem.vue)

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — full options reference
- [useDnDProvider](/v2/guide/core/use-dnd-provider) — `state`, `delay`, `distanceProgress`
