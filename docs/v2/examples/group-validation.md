# Group Validation

By default a zone only becomes accessible when **all** dragged items match its groups (`groupMatch: 'every'`). Set `groupMatch: 'some'` to allow the zone even when only part of the selection is compatible — invalid items are handled automatically.

<script setup>
import Example from '../../.vitepress/components/v2/Examples/GroupValidation/Example.vue';
</script>

<Example />

Try multi-selecting both **frontend** and **backend** tasks, then dropping them on each zone to see the difference.

## `groupMatch` option

```ts
makeDroppable(zoneRef, {
  groups: ['frontend'],
  groupMatch: 'every', // default — ALL items must match
});

makeDroppable(zoneRef, {
  groups: ['frontend'],
  groupMatch: 'some',  // zone accessible if ANY item matches
});
```

| `groupMatch` | Zone accessible when dragging mixed selection? | What lands on drop? |
|---|---|---|
| `'every'` (default) | No — zone stays blocked | N/A |
| `'some'` | Yes — zone is allowed | Only compatible items (invalid silently filtered) |

## Default behavior — silent filter

Without an `onValidate` handler, incompatible items are simply dropped. Only items whose groups match the zone's groups land on drop:

```ts
// Zone accepts 'frontend'. User drags [frontend-task, backend-task].
// → Zone is accessible (some = frontend-task matches)
// → onDrop receives only [frontend-task]

makeDroppable(zoneRef, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop(e) {
      // e.draggedItems contains ONLY the compatible items
      e.draggedItems.forEach((di) => {
        const id = di.data as string;
        taskZone.value[id] = 'frontend-queue';
      });
    },
  },
});
```

## `onValidate` — async control before drop

Add `onValidate` to intercept the mismatch and decide what to do. The handler fires **before** `onDrop` and can return a Promise — the drag state becomes `'pending'` while you wait (e.g. for a user to confirm in a modal).

```ts
makeDroppable(zoneRef, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onValidate(e) {
      // e.validItems   — items matching zone groups
      // e.invalidItems — items that don't match

      return new Promise((resolve) => {
        showModal({
          message: `${e.invalidItems.length} item(s) don't match. What should we do?`,
          onDropCompatibleOnly: () => resolve(undefined),          // default: drop validItems only
          onDropAll:            () => resolve([...e.validItems, ...e.invalidItems]), // drop everything
          onCancel:             () => resolve(false),              // decline — drag stays active
        });
      });
    },

    onDrop(e) {
      // Receives exactly the items resolved by onValidate
      e.draggedItems.forEach((di) => { /* ... */ });
    },
  },
});
```

### Return values of `onValidate`

| Return | Effect |
|---|---|
| `void` / `undefined` | Drop only `validItems` (same as no handler) |
| `false` | Decline — drag stays active, user can try another zone |
| `IDragItem[]` | Drop exactly this array (you decide which items and in what order) |
| `Promise<...>` | Async — drag state becomes `'pending'` while awaiting; resolves to any of the above |

## Full type signature

```ts
import type { IDragItem, IDropValidateEvent } from '@vue-dnd-kit/core';

interface IDropValidateEvent {
  validItems: IDragItem[];
  invalidItems: IDragItem[];
  dropZone: IDropZoneContext | undefined;
  hoveredDraggable?: IHoveredDraggableContext;
}

// in IDroppableEvents:
onValidate?: (
  event: IDropValidateEvent
) => void | false | IDragItem[] | Promise<void | false | IDragItem[]>;
```

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/GroupValidation/Example.vue)
