---
title: "makeDroppable"
description: "要素をドロップターゲットにします。何を受け入れるかのルールと、ドロップのためのフックを持ちます。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/make-droppable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDroppable">



</api-signature>

```ts
const zone = useTemplateRef<HTMLElement>('zone');
const { isOver, isAccepting } = makeDroppable(zone, {
  accept: 'image',
  onDrop: (e) => move(e.active.id),
});
```

[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop)と[ドロップの判断](https://zizigy.github.io/docs/guides/drop-decisions)を参照してください。

<example height="26rem" hint="ファイルを、それを受け入れるゾーンにドロップしてください" name="droppable">



</example>

## オプション

<api-table name="DroppableOptions">



</api-table>

## 返り値

<api-table name="DroppableReturn">



</api-table>

## 受け入れのルール

<api-table name="AcceptRule">



</api-table>

<api-table name="AcceptContext">



</api-table>

<api-table name="AcceptMode">



</api-table>

## ページの外から

ページの外から来るドラッグから `external` が受け取るもの、そしてそのようなドラッグが運ぶもの（`e.external`）。[ファイルとほかのアプリ](https://zizigy.github.io/docs/guides/native)を参照してください。

<api-table name="ExternalAccept">



</api-table>

<api-table name="ExternalData">



</api-table>

<api-table name="ExternalFile">



</api-table>

## 位置

<api-table name="Placement">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
