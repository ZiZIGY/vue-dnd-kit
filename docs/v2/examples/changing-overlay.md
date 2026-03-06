# Changing Overlay Container

This example shows how to customize the **drag preview container** in Vue DnD Kit v2 and how to switch its visual style depending on what you are dragging and where you are dragging it.

<script setup>
import Example from '@examples-v2/ChangingOverlay/Example.vue';
</script>

## Demo

<Example />

## What this example does

- On the left you have a **list of reagents** (H, O, Na, Cl).
- On the right there is a single **reaction zone**.
- Dragging reagents into the zone uses **copy semantics** — the source list never changes, the zone just accumulates copies.
- When you click **Run reaction**, the example evaluates a few simple reactions (H₂O, H₂, O₂, NaCl, mixtures) and shows a result with a short explanation.
- While you drag, the preview shows a **periodic‑style tile** and contextual hints about how to combine reagents.

## Custom preview via `DnDProvider` slot

`DnDProvider` renders a fixed preview container and, by default, uses `DragPreview`. You can replace it using the `#preview` slot:

```vue
<DnDProvider>
  <YourContent />

  <template #preview="{ preview }">
    <!-- default behavior would be: <component :is="preview" /> -->
    <AlchemyOverlay />
  </template>
</DnDProvider>
```

In this example, the preview slot always renders `AlchemyOverlay`, which reads the provider context using `useDnDProvider()`:

```ts
import { useDnDProvider } from '@vue-dnd-kit/core';

const { state, preview, entities } = useDnDProvider();
```

`AlchemyOverlay`:

- Shows only when `state === 'dragging'`.
- Uses `preview.position.value` to position itself with `transform: translate3d(x, y, 0)`.
- Iterates over `entities.draggingMap` to render the current drag payload.
- Renders a compact periodic tile by default and a larger one when the cursor is over the reaction zone (the parent passes `overZone` via a prop).

## Detecting the active zone

The reaction zone is a `makeDroppable` wrapper that emits simple events:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits<{
    (e: 'hover', zone: 'reaction' | null): void;
    (e: 'dropped', event: IDragEvent): void;
  }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  const { isDragOver } = makeDroppable(zoneRef, {
    events: {
      onEnter() {
        emit('hover', 'reaction');
      },
      onLeave() {
        emit('hover', null);
      },
      onDrop(e) {
        emit('hover', null);
        emit('dropped', e);
      },
    },
  });
</script>
```

The parent keeps an `overZone` ref and passes it down into `AlchemyOverlay`. That way the preview can switch between generic and reaction‑specific hints just by looking at a single prop. The same drop handler also appends copies of reagents to the `reactionItems` array — the source list on the left never changes.

## Copy vs move

Most sortable examples use **move semantics**: items are removed from the source list and inserted into the target. Here we intentionally use **copy**:

- The reagents on the left (H, O, Na, Cl) are always available.
- Each drop only pushes a new entry into `reactionItems`:

```ts
function handleDrop(e: IDragEvent) {
  for (const d of e.draggedItems) {
    const payload = d.item as Reagent | undefined;
    if (!payload) continue;

    reactionItems.value.push({
      id: `${payload.id}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      symbol: payload.symbol,
      name: payload.name,
    });
  }
}
```

This pattern is useful when you model **inputs to a process** (like a reaction, filter pipeline, or query builder) and want to keep the original palette of building blocks intact.

## Reaction logic

When you click **Run reaction**, the example inspects how many of each symbol ended up in the reaction zone:

```ts
const counts = computed(() => {
  const map: Record<string, number> = {};
  for (const item of reactionItems.value) {
    map[item.symbol] = (map[item.symbol] ?? 0) + 1;
  }
  return map;
});
```

Then a simple school‑level set of reactions is applied:

| Reagents in zone              | Result  | Explanation                        |
|-------------------------------|---------|------------------------------------|
| 2 × H and 1 × O               | `H₂O`   | Water                              |
| H only (at least 2)           | `H₂`   | Hydrogen gas                       |
| O only (at least 2)           | `O₂`   | Oxygen gas                         |
| Na and Cl only                | `NaCl` | Sodium chloride (table salt)      |
| 2 × H and ≥1 O (plus others)  | mixture | Oxyhydrogen mixture (explosive mix) |
| Na and Cl with extra reagents | mixture | Salt plus other reagents mixed in |
| Anything else                 | mixture | Unbalanced mixture with generic hint |

## Using `useDnDProvider` directly

You can also change the default preview **without** using the slot, by calling `useDnDProvider()` in any descendant and updating the preview config:

```ts
import { markRaw, onMounted } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';
import AlchemyOverlay from './AlchemyOverlay.vue';

const provider = useDnDProvider();

onMounted(() => {
  // Replace DragPreview globally for this provider
  provider.preview.render.value = markRaw(AlchemyOverlay);

  // Optionally teleport preview to a custom container
  provider.preview.to.value = '#my-preview-root'; // or 'body', '#app', etc.
});
```

- `preview.render` controls which component `DnDProvider` uses when it needs a preview.
- `preview.to` controls the Teleport target (same semantics as the `previewTo` prop on `DnDProvider`).
- You can still wrap that component in the `#preview` slot if you need an extra container.

## Source

- [Changing Overlay example component](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/ChangingOverlay/Example.vue)