---
title: "Сенсоры"
description: "Что превращает ввод в драги — встроенные сенсоры указателя и клавиатуры и API для собственных."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<api-signature names="pointerSensor, keyboardSensor, defineSensor, useSensor">



</api-signature>

Сенсор лишь говорит «тащи этот элемент отсюда», затем — куда он сдвинулся и что его бросили или
отменили; остальное проверяет провайдер (что можно перетаскивать, активацию, один драг за раз).
См. [сенсоры и программное перетаскивание](https://zizigy.github.io/docs/guides/sensors).

Ниже небольшой собственный сенсор (запущенный через `useSensor`) перетаскивает фигуры доски с
миникарты, рядом с собственными сенсорами провайдера.

<example height="28rem" hint="Перетащите точку на миникарте: её фигура движется" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## Активация

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## Драг

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
