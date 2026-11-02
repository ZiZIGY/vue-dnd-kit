---
title: "makeDraggable"
description: "要素をドラッグ可能にします。自由にドラッグしたり、それを受け入れるドロップターゲットへドラッグしたりできます。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/make-draggable"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
function makeDraggable<TData = unknown>(
  target: MaybeElementRef,
  options?: DraggableOptions<TData>,
): DraggableReturn;
```

```ts
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, { id: 'card', type: 'card', data: { title } });
```

[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop)を参照してください。並べ替え可能なアイテムもドラッグ可能な要素です：[`makeSortableItem`](https://zizigy.github.io/docs/api/make-sortable-item) は同じオプションに加えて、さらに多くのオプションを受け付けます。

<example height="22rem" hint="各カードをドラッグしてみましょう。離すと元の位置に戻ります" name="draggable">



</example>

## オプション

<api-table name="DraggableOptions">



</api-table>

## 返り値

<api-table name="DraggableReturn">



</api-table>

## ページの外へ

`native` のドラッグがページの外へ運ぶもの。[ファイルとほかのアプリ](https://zizigy.github.io/docs/guides/native#out-of-the-page)を参照してください。

<api-table name="NativeDragOptions">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
