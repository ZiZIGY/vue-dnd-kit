---
title: "DragPreview とオーバーレイの props"
description: "ドラッグ中のアイテムのクローン。複数のアイテムを自分でレイアウトするカスタムオーバーレイ向けです。あわせて、オーバーレイコンポーネントが受け取る props について。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/drag-preview"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="29rem" hint="タイルを選択して、そのうちの 1 つをドラッグしてみましょう。Alt でコピーになります" name="api-drag-preview">



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

クローンは持ち上げた時点で、掴んだアイテムと、ドロップ順でその隣にあるほかのアイテムについて、プロバイダーの `overlayPreviews` の数だけ作られます（デフォルトは 5）。それ以外のアイテムでは、`DragPreview` はデフォルトスロットを描画するか、何も描画しません。ドロップすると、各プレビューはそれぞれのアイテムへ飛んでいきます。ゾーン（フォルダーやゴミ箱）にドロップした場合は、プレビューが 1 つずつ順にそのゾーンへ入ります。[オーバーレイのガイド](https://zizigy.github.io/docs/guides/overlay)を参照してください。

<api-table name="DragPreviewProps">



</api-table>

## オーバーレイの props

オーバーレイコンポーネント（ドラッグ可能な要素、並べ替え可能なアイテム、リスト、ツリーの `overlay` オプション）とプロバイダーの `#overlay` スロットが受け取るもの。

<api-table name="OverlaySlotProps">



</api-table>

<api-table name="OverlayProps">



</api-table>

<api-table name="DropDestination">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
