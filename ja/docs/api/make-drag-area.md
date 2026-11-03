---
title: "makeDragArea"
description: "要素の内側で始まるドラッグのルール（軸、境界、グリッド、自動スクロール、アクティベーション）を、アプリ全体で 1 つのプロバイダーのもとで設定します。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/make-drag-area"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="makeDragArea">



</api-signature>

```ts
const board = useTemplateRef<HTMLElement>('board');
makeDragArea(board, { restrictToArea: true, modifiers: [snapToGrid(24)] });
```

内側のエリアは `disabled` を継承します。それ以外のルールはすべて最も近いエリアから取られます。[軸、境界、グリッド](https://zizigy.github.io/docs/guides/constraints)を参照してください。

エリアの中のチップはそのルールに従い、外にあるチップは自由にドラッグできます。

<example height="36rem" hint="エリアのルールを切り替えてから、その中のチップをドラッグしてみましょう" name="api-drag-area">



</example>

## オプション

<api-table name="DragAreaOptions">



</api-table>

## 返り値

<api-table name="DragAreaReturn">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
