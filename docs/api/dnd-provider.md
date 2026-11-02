---
title: "DnDProvider"
description: "The component that owns the drag — input, the overlay, the selection, auto-scroll and the live region — for everything rendered inside it."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/dnd-provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="DnDProvider">



</api-signature>

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider :animation="{ duration: 200 }" @drag-end="save">
    <RouterView />
    <template #overlay="{ items, over, accepted }">
      <!-- optional: a custom overlay for every drag -->
    </template>
  </DnDProvider>
</template>
```

Every composable must run in a component rendered **inside** a provider. One provider for the
whole app is the goal: parts of the page get their own rules with
[`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area). See [the provider guide](https://zizigy.github.io/docs/guides/provider).

Most props are read when the provider needs them: change one, and the next drag uses it.

<example height="37rem" hint="Switch a prop, then drag a task: by mouse, held, with Alt or Shift, or with Space on a focused task" name="api-provider-props">



</example>

### Where the overlay renders

`overlayTo` moves the overlay out of `body`: into a modal `<dialog>`, which sits above
everything else on the page. Turn the switch off, and the rows you drag vanish under the
dialog. The [overlay guide](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto) explains when
it is needed.

<example height="22rem" hint="Open the dialog and drag a column; then turn the switch off and drag again" name="overlay-dialog">



</example>

## Props

<api-table name="DnDProviderProps">



</api-table>

## Events

<table>
<thead>
  <tr>
    <th>
      Event
    </th>
    
    <th>
      Payload
    </th>
    
    <th>
      When
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag-start
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      A drag started (after its activation).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-move
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      The pointer moved during a drag (once per frame at most).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-over
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      The target under the drag changed.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-end
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
    </td>
    
    <td>
      A drop went through and was written.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-cancel
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      The drag was cancelled or the drop refused.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-resume
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       answered <code>
        'continue'
      </code>
      
      : there was no drop, and the drag goes on.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-settle
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
      
       or <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      The drag's overlay has landed: what <code>
        drag-end
      </code>
      
       or <code>
        drag-cancel
      </code>
      
       got.
    </td>
  </tr>
</tbody>
</table>

The same events, plus `onBeforeDrop`, are available anywhere under the
provider with [`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd). Their payloads are on
[the events page](https://zizigy.github.io/docs/api/events).

## Slot `#overlay`

Renders what follows the pointer, for every drag that has no overlay component of its own
(see [the overlay guide](https://zizigy.github.io/docs/guides/overlay)). Rendering nothing falls back to the clone.

<api-table name="OverlaySlotProps">



</api-table>

## Keyboard

<api-table name="KeyboardOptions">



</api-table>

## Auto-scroll

<api-table name="AutoScrollOptions">



</api-table>

## Haptics

<api-table name="HapticsOptions">



</api-table>

<api-table name="HapticPattern">



</api-table>

## Announcements

<api-table name="Announcements">



</api-table>

<api-table name="AnnouncementContext">



</api-table>

<api-table name="AnnouncedPosition">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
