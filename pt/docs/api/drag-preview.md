---
title: "DragPreview e props do overlay"
description: "O clone de um item arrastado, para overlays personalizados que organizam vários itens por conta própria — e as props que os componentes de overlay recebem."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="Selecione miniaturas, arraste uma delas. Alt copia" name="api-drag-preview">



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

Os clones são feitos quando o item é pego: do item pego e dos outros ao lado dele na ordem do
drop, tantos quanto o `overlayPreviews` do provider (5 por padrão). Para qualquer outro item,
`DragPreview` renderiza o seu slot padrão, ou nada. No drop, cada prévia voa até o seu próprio
item; num drop em uma zona (uma pasta, uma lixeira), as prévias entram uma depois da outra. Veja
[o guia do overlay](https://zizigy.github.io/docs/guides/overlay).

<api-table name="DragPreviewProps">



</api-table>

## Props do overlay

O que um componente de overlay (a opção `overlay` de draggables, itens ordenáveis, listas e
árvores) e o slot `#overlay` do provider recebem.

<api-table name="OverlaySlotProps">



</api-table>

`OverlayProps` é o mesmo tipo, para `defineProps<OverlayProps>()`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
