---
title: "makeSelectionArea"
description: "Um retângulo de seleção que seleciona os draggables que toca — arraste um deles e a seleção inteira vai junto."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/make-selection-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSelectionArea">



</api-signature>

```vue
<script setup lang="ts">
const area = useTemplateRef<HTMLElement>('area');
const { isSelecting, style } = makeSelectionArea(area);
</script>

<template>
  <div ref="area" class="area">
    <!-- items -->
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>
```

Pressionar o espaço vazio da área inicia o retângulo. Veja
[Multi-drag e seleção](https://zizigy.github.io/docs/guides/multi-drag).

<example height="27rem" hint="Desenhe um retângulo no espaço vazio, depois arraste uma forma selecionada" name="api-selection-area">



</example>

## Opções

<api-table name="SelectionAreaOptions">



</api-table>

## Retorno

<api-table name="SelectionAreaReturn">



</api-table>

## Valores

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
