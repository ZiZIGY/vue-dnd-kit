---
title: "makeSortableTree"
description: "コンテナーを、深さ付きのフラットな形で描画される並べ替え可能なツリーにします。横方向へのドラッグやノードへのホバーでネストします。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/make-sortable-tree"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableTree">



</api-signature>

```ts
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, { items: files, indentation: 20, collapsed });
```

各行は `id: () => node.key` を指定して [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) を呼び出します。[ツリー](https://zizigy.github.io/docs/guides/trees)を参照してください。

<example height="26rem" hint="オプションを切り替えてから、行を横にドラッグしてみましょう" name="api-tree-options">



</example>

## オプション

<api-table name="SortableTreeOptions">



</api-table>

## 返り値

<api-table name="SortableTreeReturn">



</api-table>

## フラットなノード

<api-table name="FlatNode">



</api-table>

## 投影

<api-table name="TreeProjection">



</api-table>

<api-table name="TreeNesting">



</api-table>

## ドロップイベント

<api-table name="SortableTreeDropEvent">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
