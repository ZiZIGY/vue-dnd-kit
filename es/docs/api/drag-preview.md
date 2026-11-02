---
title: "DragPreview y props del overlay"
description: "El clon de un ítem arrastrado, para overlays personalizados que colocan ellos mismos varios ítems — y las props que reciben los componentes de overlay."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="Selecciona mosaicos y arrastra uno de ellos. Alt copia" name="api-drag-preview">



</example>

## DragPreview

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

Los clones se toman al agarrar: del ítem agarrado y de los demás junto a él en el orden del drop,
tantos como indique el `overlayPreviews` del provider (5 por defecto). Para cualquier otro ítem,
`DragPreview` renderiza su slot por defecto, o nada. Al soltar, cada vista previa vuela a su
propio ítem; al soltar en una zona (una carpeta, una papelera), las vistas previas entran una tras otra. Consulta
la [guía del overlay](https://zizigy.github.io/docs/guides/overlay).

<api-table name="DragPreviewProps">



</api-table>

## Props del overlay

Lo que reciben un componente de overlay (la opción `overlay` de los elementos arrastrables, los
ítems ordenables, las listas y los árboles) y el slot `#overlay` del provider.

<api-table name="OverlaySlotProps">



</api-table>

`OverlayProps` es el mismo tipo, para `defineProps<OverlayProps>()`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
