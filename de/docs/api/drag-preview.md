---
title: "DragPreview und Overlay-Props"
description: "Der Klon eines gezogenen Elements, für eigene Overlays, die mehrere Elemente selbst anordnen – und die Props, die Overlay-Komponenten bekommen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="Wähle Kacheln aus und ziehe eine davon. Alt kopiert" name="api-drag-preview">



</example>

## DragPreview

<api-signature name="DragPreview">



</api-signature>

```vue [StackOverlay.vue]
<script setup lang="ts">
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

defineProps<{ items: DragItem[] }>();
</script>

<template>
  <div class="stack">
    <DragPreview v-for="item in items.slice(0, 3)" :id="item.id" :key="item.id" />
  </div>
</template>
```

Klone werden beim Aufnehmen erstellt: vom gegriffenen Element und von den anderen, die in
Drop-Reihenfolge daneben liegen, so viele wie `overlayPreviews` des Providers (standardmäßig 5).
Für jedes andere Element rendert `DragPreview` seinen Default-Slot oder nichts. Beim Drop fliegt
jede Vorschau zu ihrem eigenen Element; bei einem Drop in eine Zone (einen Ordner, einen Papierkorb)
gehen die Vorschauen eine nach der anderen hinein. Siehe den Leitfaden [Das Overlay](https://zizigy.github.io/docs/guides/overlay).

<api-table name="DragPreviewProps">



</api-table>

## Overlay-Props

Was eine Overlay-Komponente (die Option `overlay` von ziehbaren Elementen, sortierbaren
Elementen, Listen und Bäumen) und der Slot `#overlay` des Providers bekommen.

<api-table name="OverlaySlotProps">



</api-table>

<api-table name="OverlayProps">



</api-table>

<api-table name="DropDestination">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
