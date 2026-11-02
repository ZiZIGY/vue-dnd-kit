---
title: "makeSelectionArea"
description: "닿는 draggable을 선택하는 선택 사각형. 그중 하나를 드래그하면 선택 전체가 함께 움직입니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/make-selection-area"
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

영역의 빈 공간을 누르면 사각형이 시작됩니다. 사각형은 직접 렌더링하세요.
[멀티 드래그와 선택](https://zizigy.github.io/docs/guides/multi-drag)을 참고하세요.

<example height="27rem" hint="빈 공간에 사각형을 그린 뒤 선택된 도형을 드래그하세요" name="api-selection-area">



</example>

## 옵션

<api-table name="SelectionAreaOptions">



</api-table>

## 반환값

<api-table name="SelectionAreaReturn">



</api-table>

## 값

<api-table name="SelectionStrategy">



</api-table>

<api-table name="SelectionModifier">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
