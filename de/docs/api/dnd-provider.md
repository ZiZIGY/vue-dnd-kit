---
title: "DnDProvider"
description: "Die Komponente, die den Drag verantwortet – Eingabe, Overlay, Auswahl, Auto-Scroll und die Live-Region – für alles, was in ihr gerendert wird."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/dnd-provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

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

Jedes Composable muss in einer Komponente laufen, die **innerhalb** eines Providers gerendert
wird. Ziel ist ein einziger Provider für die ganze App: Teile der Seite bekommen mit
[`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area) eigene Regeln. Siehe den Leitfaden
[Der Provider](https://zizigy.github.io/docs/guides/provider).

Die meisten Props werden gelesen, wenn der Provider sie braucht: Ändere eine, und der nächste
Drag verwendet sie.

<example height="37rem" hint="Schalte eine Prop um, dann ziehe eine Aufgabe: mit der Maus, gehalten, mit Alt oder Shift oder mit Space auf einer fokussierten Aufgabe" name="api-provider-props">



</example>

### Wo das Overlay gerendert wird

`overlayTo` holt das Overlay aus `body` heraus: in ein modales `<dialog>`, das über allem anderen
auf der Seite liegt. Schalte den Schalter aus, und die Zeilen, die du ziehst, verschwinden unter
dem Dialog. Der [Overlay-Leitfaden](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto) erklärt,
wann das nötig ist.

<example height="22rem" hint="Öffne den Dialog und ziehe eine Spalte; schalte dann den Schalter aus und ziehe noch einmal" name="overlay-dialog">



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
      Wann
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
      Ein Drag hat begonnen (nach seiner Aktivierung).
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
      Der Zeiger hat sich während eines Drags bewegt (höchstens einmal pro Frame).
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
      Das Ziel unter dem Drag hat sich geändert.
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
      Ein Drop wurde ausgeführt und geschrieben.
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
      Der Drag wurde abgebrochen oder der Drop abgelehnt.
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
      
       oder <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      Das Overlay des Drags ist gelandet: das, was <code>
        drag-end
      </code>
      
       oder <code>
        drag-cancel
      </code>
      
       bekommen hat.
    </td>
  </tr>
</tbody>
</table>

Dieselben Events, dazu `onBeforeDrop` und `onDragResume`, stehen mit
[`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd) überall unterhalb des Providers zur Verfügung. Ihre Payloads
findest du unter [Events](https://zizigy.github.io/docs/api/events).

## Slot `#overlay`

Rendert, was dem Zeiger folgt, für jeden Drag ohne eigene Overlay-Komponente (siehe den Leitfaden
[Das Overlay](https://zizigy.github.io/docs/guides/overlay)). Rendert der Slot nichts, kommt der Klon zum Einsatz.

<api-table name="OverlaySlotProps">



</api-table>

## Tastatur

<api-table name="KeyboardOptions">



</api-table>

## Auto-Scroll

<api-table name="AutoScrollOptions">



</api-table>

## Haptik

<api-table name="HapticsOptions">



</api-table>

## Ansagen

<api-table name="Announcements">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
