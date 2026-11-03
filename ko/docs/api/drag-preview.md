---
title: "DragPreview와 오버레이 props"
description: "여러 항목을 직접 배치하는 커스텀 오버레이를 위한, 드래그 중인 항목의 클론. 그리고 오버레이 컴포넌트가 받는 props."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="타일을 선택하고 그중 하나를 드래그하세요. Alt를 누르면 복사합니다" name="api-drag-preview">



</example>

## DragPreview

<api-signature name="DragPreview">



</api-signature>

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

클론은 집을 때 만들어집니다. 집은 항목과, 드롭 순서상 그 옆에 있는 다른 항목들의 클론으로,
프로바이더의 `overlayPreviews`만큼 만들어집니다(기본값 5). 그 밖의 항목에 대해서는 `DragPreview`가
기본 슬롯을 렌더링하거나 아무것도 렌더링하지 않습니다. 드롭하면 각 미리보기가 자기 항목으로
날아가고, 영역(폴더, 휴지통)에 드롭하면 미리보기가 하나씩 차례로 그 안으로 들어갑니다.
[오버레이 가이드](https://zizigy.github.io/docs/guides/overlay)를 참고하세요.

<api-table name="DragPreviewProps">



</api-table>

## 오버레이 props

오버레이 컴포넌트(draggable, 정렬 가능한 항목, 리스트, 트리의 `overlay` 옵션)와 프로바이더의
`#overlay` 슬롯이 받는 것입니다.

<api-table name="OverlaySlotProps">



</api-table>

<api-table name="OverlayProps">



</api-table>

<api-table name="DropDestination">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
