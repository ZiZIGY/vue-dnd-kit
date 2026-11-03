---
title: "makeSortableList"
description: "コンテナーを並べ替え可能なリストにします。ドラッグ中に並べ替わるドラフトが、ドロップ時に書き戻されます。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/make-sortable-list"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableList">



</api-signature>

```ts
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: tasks, group: 'board' });
```

リストの行は [`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) を呼び出します。[並べ替え可能なリスト](https://zizigy.github.io/docs/guides/sortable-lists)と[アイテムを共有するリスト](https://zizigy.github.io/docs/guides/shared-lists)を参照してください。

<example height="34rem" hint="オプションを切り替えてから、タイルをドラッグしてください" name="sortable-options">



</example>

## オプション

<api-table name="SortableListOptions">



</api-table>

## 返り値

<api-table name="SortableListReturn">



</api-table>

## グループ

<api-table name="SortableGroupOptions">



</api-table>

<api-table name="SortablePutContext">



</api-table>

## ドロップイベント

`onBeforeDrop` と `onDrop` が受け取るもの。

<api-table name="SortableDropEvent">



</api-table>

## インジケーター

`placeholder: 'indicator'` モードで `indicator` が保持するもの。

<api-table name="SortableIndicator">



</api-table>

## 値

<api-table name="SortableItems">



</api-table>

<api-table name="SortableStrategy">



</api-table>

<api-table name="SortableBehavior">



</api-table>

<api-table name="SortablePlaceholder">



</api-table>

<api-table name="MultipleMode">



</api-table>

<api-table name="DropOutside">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
