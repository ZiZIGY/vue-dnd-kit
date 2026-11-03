---
title: "DragPreview et props de l'overlay"
description: "Le clone d'un item glissé, pour les overlays personnalisés qui disposent eux-mêmes plusieurs items — et les props que reçoivent les composants d'overlay."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="Sélectionnez des tuiles, faites-en glisser une. Alt copie" name="api-drag-preview">



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

Les clones sont pris à la saisie : celui de l'item saisi et ceux des autres, voisins dans l'ordre
du dépôt, autant que l'indique l'option `overlayPreviews` du provider (5 par défaut). Pour tout
autre item, `DragPreview` rend son slot par défaut, ou rien. Au dépôt, chaque aperçu vole vers son
propre item ; déposés dans une zone (un dossier, une corbeille), les aperçus y entrent l'un après l'autre. Voir le
[guide de l'overlay](https://zizigy.github.io/docs/guides/overlay).

<api-table name="DragPreviewProps">



</api-table>

## Props de l'overlay

Ce que reçoivent un composant d'overlay (l'option `overlay` des éléments déplaçables, des items
triables, des listes et des arbres) et le slot `#overlay` du provider.

<api-table name="OverlaySlotProps">



</api-table>

<api-table name="OverlayProps">



</api-table>

<api-table name="DropDestination">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
