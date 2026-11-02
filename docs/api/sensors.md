---
title: "Sensors"
description: "What turns input into drags — the built-in pointer and keyboard sensors, and the API to write your own."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<api-signature names="pointerSensor, keyboardSensor, defineSensor, useSensor">



</api-signature>

A sensor only says "drag this item from here", then where it moved and that it dropped or
was cancelled; the provider checks the rest (what may be dragged, activation, one drag at a
time). See [Sensors and programmatic drags](https://zizigy.github.io/docs/guides/sensors).

Below, a small custom sensor (run with `useSensor`) drags the board's pieces from its minimap, next to the provider's own sensors.

<example height="28rem" hint="Drag a dot on the minimap: its piece moves" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## Activation

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## The drag

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
