---
title: "クイックスタート"
description: "3 つのファイルで作る並べ替え可能なリスト。プロバイダー、リスト、そしてその行です。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/getting-started/quick-start"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

これが動作する完成形です。行をドラッグするか、Tab で行にフォーカスして <kbd value="Space">



</kbd>

 を押し、矢印キーで動かしてから、もう一度 <kbd value="Space">



</kbd>

 を押してください。

<example name="quick-start" title="クイックスタート">



</example>

## ステップごとに

<steps level="3">

### アプリをプロバイダーで囲む

`DnDProvider` がドラッグを管理します。すべてのコンポーザブルは、プロバイダーの**内側に描画される**コンポーネントで実行する必要があります。プロバイダーをテンプレートに含むコンポーネントではありません。

### リストを作る

`makeSortableList` はリストの要素とあなたの配列を受け取ります。返り値の `items` は、ドラッグ中にリアルタイムで並べ替わるドラフトです。あなたの配列ではなくドラフトを描画し、行のキーには id を使ってください。

### 行を作る

各行は、自分の要素と描画するアイテムを渡して `makeSortableItem` を呼び出します。行のキーは `item.id` から取られます。

</steps>

ドロップが完了すると、`tasks` に新しい順序が入ります。これは普通の `ref` なので、アプリの他の部分も、ほかの変更と同じようにこの変更を受け取ります。

<tip>

Pinia、サーバーのデータ、イミュータブルなデータを使っていますか？ref の代わりにゲッターを渡し、`onDrop` で `e.preventDefault()` を呼んで、`e.result` を自分で適用してください。

</tip>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
