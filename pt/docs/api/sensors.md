---
title: "Sensores"
description: "O que transforma entrada em arrastes — os sensores embutidos de ponteiro e de teclado, e a API para escrever os seus."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<api-signature names="pointerSensor, keyboardSensor, defineSensor, useSensor">



</api-signature>

Um sensor só diz "arraste este item a partir daqui", depois para onde ele se moveu e que ele
soltou ou foi cancelado; o provider verifica o resto (o que pode ser arrastado, a ativação, um
arraste por vez). Veja [Sensores e arrastes programáticos](https://zizigy.github.io/docs/guides/sensors).

Abaixo, um pequeno sensor personalizado (executado com `useSensor`) arrasta as peças do tabuleiro a partir do minimapa, ao lado dos sensores do próprio provider.

<example height="28rem" hint="Arraste um ponto no minimapa: a peça dele se move" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## Ativação

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## O arraste

<api-table name="SensorDrag">



</api-table>

<api-table name="SensorDragState">



</api-table>

<api-table name="SensorStepOptions">



</api-table>

<api-table name="SensorDirection">



</api-table>

<api-table name="SortablePosition">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
