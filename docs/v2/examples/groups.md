# Groups

Groups let draggable items and droppable zones declare which "channels" they belong to. Dragging only works between compatible parties — incompatible zones are silently ignored.

<script setup>
import Example from '@examples-v2/Groups/Example.vue';
</script>

## Demo

<Example />

Drag **Fix auth bug** (group `dev`) — only **Inbox** and **Dev queue** accept it; **Design queue** stays blocked. Drag **Update icons** (group `design`) and the opposite happens. Drag **Write release notes** (no group) and all three zones accept it.

## Rules

| Draggable groups | Zone groups | Result |
|---|---|---|
| `[]` (global) | `[]` (global) | ✓ accepted |
| `[]` (global) | `['dev']` | ✓ accepted |
| `['dev']` | `[]` (global) | ✓ accepted |
| `['dev']` | `['dev']` | ✓ accepted |
| `['dev']` | `['design']` | ✗ blocked |

An empty array on **either** side means "global" — compatible with everything. A non-empty array on **both** sides requires at least one shared group.

## Setup

```ts
// Draggable item tagged as 'dev'
makeDraggable(itemRef, {
  groups: ['dev'],
});

// Zone that accepts all (no restriction)
makeDroppable(zoneRef);

// Zone that only accepts 'dev' items
makeDroppable(devZoneRef, {
  groups: ['dev'],
});

// Zone that only accepts 'design' items — 'dev' items are blocked
makeDroppable(designZoneRef, {
  groups: ['design'],
});
```

## Visual feedback with `isAllowed`

`makeDroppable` returns an `isAllowed` computed ref — `true` while a drag is active and the dragged items are compatible with this zone. Combine it with the provider state to show a live indicator:

```ts
const { isAllowed } = makeDroppable(zoneRef, { groups: ['dev'] });

const provider = useDnDProvider();
const isDragging = computed(() => provider.state.value !== 'idle');

const status = computed(() => {
  if (!isDragging.value) return 'idle';
  return isAllowed.value ? 'allowed' : 'blocked';
});
```

```vue
<div :class="`zone--${status}`">
  <span v-if="status === 'allowed'">✓ drop here</span>
  <span v-else-if="status === 'blocked'">✗ wrong group</span>
</div>
```

## See also

- [makeDraggable](/v2/guide/core/make-draggable) — `groups` option
- [makeDroppable](/v2/guide/core/make-droppable) — `groups` + `isAllowed`
- [useDnDProvider](/v2/guide/core/use-dnd-provider) — `state` for global drag detection

## Source

- [Example.vue](https://github.com/zizigy/vue-dnd-kit/blob/master/docs/.vitepress/components/v2/Examples/Groups/Example.vue)
