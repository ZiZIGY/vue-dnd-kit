---
title: "makeSortableItem"
description: "並べ替え可能なリストまたはツリーの行を登録します。ドラッグでき、ほかのアイテムのために場所を空け、自分の位置に着地します。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/make-sortable-item"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeSortableItem">



</api-signature>

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isPlaceholder, index } = makeSortableItem(el, { item: () => props.task, handle: '.grip' });
```

[並べ替え可能なリスト](https://zizigy.github.io/docs/guides/sortable-lists)を参照してください。

<example height="24rem" hint="グリップで行をドラッグしてみましょう：チェックボックスはそのまま使えます" name="todo-list">



</example>

## オプション

<api-table name="SortableItemOptions">



</api-table>

## 返り値

<api-table name="SortableItemReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
