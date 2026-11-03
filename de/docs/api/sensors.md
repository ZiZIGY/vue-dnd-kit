---
title: "Sensoren"
description: "Was Eingaben zu Drags macht – die eingebauten Sensoren für Zeiger und Tastatur und die API, um eigene zu schreiben."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<api-signature names="pointerSensor, keyboardSensor, defineSensor, useSensor">



</api-signature>

Ein Sensor sagt nur „ziehe dieses Element von hier“, dann, wohin es sich bewegt hat und dass es
abgelegt oder abgebrochen wurde; den Rest prüft der Provider (was gezogen werden darf,
Aktivierung, immer nur ein Drag gleichzeitig). Siehe
[Sensoren und programmatisches Ziehen](https://zizigy.github.io/docs/guides/sensors).

Unten zieht ein kleiner eigener Sensor (gestartet mit `useSensor`) die Figuren des Bretts von
der Minikarte aus, neben den Sensoren des Providers.

<example height="28rem" hint="Ziehe einen Punkt auf der Minikarte: Seine Figur bewegt sich" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## Aktivierung

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## Der Drag

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
