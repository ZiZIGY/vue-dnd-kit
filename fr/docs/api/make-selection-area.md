---
title: "makeSelectionArea"
description: "Un rectangle de sélection qui sélectionne les éléments déplaçables qu'il touche — faites glisser l'un d'eux, et toute la sélection se déplace."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/make-selection-area"
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

Un appui sur l'espace vide de la zone lance le rectangle. Voir
[Multi-drag et sélection](https://zizigy.github.io/docs/guides/multi-drag).

<example height="27rem" hint="Tracez un rectangle sur l'espace vide, puis faites glisser une forme sélectionnée" name="api-selection-area">



</example>

## Options

<api-table name="SelectionAreaOptions">



</api-table>

## Valeur de retour

<api-table name="SelectionAreaReturn">



</api-table>

## Valeurs

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
