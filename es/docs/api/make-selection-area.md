---
title: "makeSelectionArea"
description: "Un rectángulo de selección que selecciona los elementos arrastrables que toca — arrastra uno de ellos y toda la selección viaja junta."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/make-selection-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeSelectionArea(
  target: MaybeElementRef,
  options?: SelectionAreaOptions,
): SelectionAreaReturn;
```

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

Pulsar sobre el espacio vacío del área inicia el rectángulo; el rectángulo lo renderizas tú.
Consulta [Multi-drag y selección](https://zizigy.github.io/docs/guides/multi-drag).

<example height="27rem" hint="Dibuja un rectángulo en el espacio vacío y luego arrastra una forma seleccionada" name="api-selection-area">



</example>

## Opciones

<api-table name="SelectionAreaOptions">



</api-table>

## Valor devuelto

<api-table name="SelectionAreaReturn">



</api-table>

## Valores

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
