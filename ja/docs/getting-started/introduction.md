---
title: "イントロダクション"
description: "Vue DnD Kit は Vue 3 のためのドラッグ＆ドロップです。並べ替え可能なリスト、カンバンボード、ツリー、マルチドラッグ、ドロップゾーンを、アニメーションとアクセシビリティ込みですぐに使えます。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/getting-started/introduction"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Vue DnD Kit は Vue 3 のためのドラッグ＆ドロップです。並べ替え可能なリスト、カンバンボード、ツリー、マルチドラッグ、コピー、ドロップゾーンを、アニメーション付き、キーボード対応、スクリーンリーダーへの読み上げ付きで、あなた自身のマークアップのまま、すぐに使えます。

<example height="27rem" hint="立ち寄り先を日をまたいで移動してみましょう。下のチップがほかの操作を示しています" name="at-a-glance" title="ひと目でわかる">



</example>

このデモ独自のコードは 1 つもありません。リストはその場で並べ替わり、列どうしは立ち寄り先をやり取りし（1 つの `group`）、選択はまとめて移動し（`selected`）、:kbd{value="Alt"} は移動をコピーに変え（`clone`）、キーボードはそのすべてを位置ごとに行います。デモは立ち寄り先を描画し、いくつかのオプションを渡しているだけです。

## これは何か

**コンポーザブル**の集まりと 1 つの**プロバイダー**コンポーネントです。要素は自分で描画し、そのテンプレート参照をコンポーザブルに渡すだけで、残りはライブラリが引き受けます。ポインター・タッチ・キーボードの入力、ターゲットの検出、並べ替え、アニメーション、自動スクロール、そしてスクリーンリーダーへの状況の伝達です。

```vue [Day.vue]
<script setup lang="ts">
const listRef = useTemplateRef<HTMLElement>('list');
// `items` is the draft: it reorders while you drag. On drop, `day.stops` gets the new order.
const { items } = makeSortableList(listRef, { items: toRef(props.day, 'stops'), group: 'trip' });
</script>

<template>
  <ul ref="list">
    <StopCard v-for="stop in items" :key="stop.id" :stop="stop" />
  </ul>
</template>
```

ライブラリ自身が描画するのは、浮かんで動く**オーバーレイ**だけです。オーバーレイはデフォルトで、ドラッグ中の要素のクローンです。マークアップとスタイルはあなたのものです。ライブラリが加えるのは、ARIA 属性と、ドラッグの状態にスタイルを付けるためのいくつかの `data-dnd-*` 属性だけです。

## できること

- **並べ替え可能なリストとグリッド**。縦、横、グリッドで、ドラッグ中にリアルタイムで並べ替わります。
- **アイテムを共有するリスト**：カンバンボード、コピーを送り出すパレット、入れ替え、何をどこに置けるかのルール。
- **ツリー**：横へのドラッグや行へのホバーによるネスト、深さの制限、ルール。
- **マルチドラッグ**：選択の方法は自由（Ctrl/Cmd＋クリック、範囲選択）。まとめて 1 つのブロックとして移動します。
- **ドロップゾーン**：受け入れのルールと、確認、拒否、自分で適用できるドロップ。
- **デフォルトでアニメーション**：アイテムは新しい位置へスライドし、ドロップしたアイテムは自分の位置に着地し、キャンセルすると元の位置に戻ります。
- **アクセシビリティ**：位置ごとに動かすキーボードドラッグ、ライブでの読み上げ、ARIA 属性。
- **仮想リスト**：TanStack Virtual または VueUse で、数千行にも対応します。
- **センサーとアクション**：独自の入力デバイスと、コードからスクリプトで行うドラッグ。
- **DevTools**：すべてのリストのライブマップ、ジョイスティック、各ドラッグのログを備えたタブ。

## ほかとの違い

- **ドロップまで、データはあなたのもの。** 描画するのは配列の*ドラフト*です。ドラッグ中に動くのはドラフトだけで、ドロップ時にライブラリが新しい順序をあなたの ref に書き込むか、自分で適用するための `e.result` を渡します（ストア、サーバー、元に戻す操作）。
- **ラッパーコンポーネントなし。** 行はあなたの要素で、ref と 1 回の呼び出しがあれば十分です。そのため、UI キット（Nuxt UI、Vuetify、自作のもの）のコンポーネントもそのままドラッグできます。
- **デフォルトでアニメーション、それでいて邪魔をしない。** 並べ替え、着地、キャンセルは最初からアニメーションします。オフにしたり、調整したり、GSAP や motion に任せたりできます。
- **キーボードは後付けではない。** すべてのドラッグは <kbd value="Space">



</kbd>

 と矢印キーで行え、移動は読み上げられ、フォーカスは元の場所に戻ります。
- **アプリ全体にプロバイダーは 1 つ。** エリアがページの一部に独自のルール（軸、境界、グリッド、長めの押下）を与えるため、ネストした機能にネストしたプロバイダーは必要ありません。
- **入力は差し替え可能。** ポインターとキーボードはセンサーです。ゲームパッドや音声コマンド用に独自のセンサーを書いたり、`@vue-dnd-kit/actions` でコードからアイテムを動かしたりできます。

## 全体の構成

<table>
<thead>
  <tr>
    <th>
      パーツ
    </th>
    
    <th>
      役割
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      ドラッグを管理します：入力、オーバーレイ、選択、自動スクロール、読み上げ。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
       / <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      並べ替え可能なリストと、その行。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      深さ付きのフラットな形で描画されるツリー。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
       / <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      自由なドラッグとドロップゾーン。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      ページの一部に適用するルール：軸、境界、スナップ、自動スクロール、アクティベーション。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      範囲選択。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD
      </code>
      
       / <code>
        useDnDMonitor
      </code>
    </td>
    
    <td>
      ドラッグの状態とイベント。プロバイダーの下ならどこでも使えます。
    </td>
  </tr>
</tbody>
</table>

<tip>

v2 から移行しますか？API が変わりました。`useDnDProvider` は `useDnD` に、`makeConstraintArea` と `makeAutoScroll` は `makeDragArea` になりました。並べ替え可能なリストは組み込みになりました。

</tip>

## 動作要件

- Vue **3.5** 以降。
- モダンブラウザー：Chrome と Edge 104+、Safari 15.4+、Firefox 104+。
- SSR と Nuxt に対応：オーバーレイとライブリージョンはクライアントでマウントされます。

次は[インストール](https://zizigy.github.io/docs/getting-started/installation)して、[クイックスタート](https://zizigy.github.io/docs/getting-started/quick-start)で最初のリストを作りましょう。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
