---
title: "센서"
description: "입력을 드래그로 바꾸는 것. 내장 포인터 센서와 키보드 센서, 그리고 직접 센서를 만드는 API."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<api-signature names="pointerSensor, keyboardSensor, defineSensor, useSensor">



</api-signature>

센서가 알리는 것은 "이 항목을 여기서부터 드래그"라는 요청, 그다음 어디로 움직였는지, 그리고
드롭했는지 취소되었는지뿐입니다. 나머지(무엇을 드래그할 수 있는지, 활성화, 한 번에 하나의 드래그)는
프로바이더가 검사합니다. [센서와 프로그래밍 방식 드래그](https://zizigy.github.io/docs/guides/sensors)를 참고하세요.

아래에서는 작은 커스텀 센서(`useSensor`로 실행)가 프로바이더의 기본 센서와 함께, 미니맵에서 보드 위의
도형을 드래그합니다.

<example height="28rem" hint="미니맵의 점을 드래그하면 해당 도형이 움직입니다" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## 활성화

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## 드래그

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
