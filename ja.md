---
title: "Vue DnD Kit — drag and drop for Vue"
description: "Vue 3 のための並べ替え可能なリスト、カンバンボード、ツリー、マルチドラッグ。アニメーション、キーボード操作、アクセシビリティにすぐ対応。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja"
meta:
  "og:description": "Vue 3 のための並べ替え可能なリスト、カンバンボード、ツリー、マルチドラッグ。アニメーション、キーボード操作、アクセシビリティにすぐ対応。"
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — Vue 3 のためのドラッグ＆ドロップVue 3 · TypeScript · SSR

01カンバン

**カードをやり取りするボード**

02ツリー

**ひと押しでネスト**

03マルチドラッグ

**たくさんのアイテムを、一度に**

04並べ替え

**ひとりでに並べ替わるリスト**

05アニメーション

**デフォルトでアニメーション**

06A11y

space←↑↓→

**キーボードもファーストクラス**

07仮想リスト

**1 万行**

カードをドラッグしてください。または Tab でカードを選び、矢印キーで動かせます

# ドラッグ＆ドロップ、<br>Vue のために。

Vue 3 のための並べ替え可能なリスト、カンバンボード、ツリー、マルチドラッグ。アニメーション、キーボード操作、アクセシビリティにすぐ対応。

npm i @vue-dnd-kit/core

[はじめる](https://zizigy.github.io/vue-dnd-kit/ja/docs/getting-started/introduction)

無料のオープンソース。MIT ライセンス。

00仕組み

## コンポーネントではなく、<br>コンポーザブル。

マークアップもスタイルもあなたのもの。テンプレート参照をコンポーザブルに渡せば、要素がドラッグ、並べ替え、ドロップできるようになります。アニメーション、キーボード、スクリーンリーダーへの対応は済ませてあります。

- 01 `**makeSortableList**`ドラッグに合わせて並べ替わるリスト、グリッド、カンバンの列。グループ内でアイテムのやり取りも。
- 02 `**makeSortableTree**`入れ子のデータをフラットに描画：横にずらして深さを変え、フォルダーにドロップし、仮想化にも対応。
- 03 `**makeDraggable · makeDroppable**`それ以外のすべて：ボード、キャンバス、アップロード。何をどこに置けるかは、あなたのルールで。

01ドラッグ＆ドロップ

## ドラッグ＆ドロップ

ドラッグ可能な要素、ドロップターゲット、そして何をどこに置けるかのルール。ターゲットはドラッグを受け入れると光り、受け入れないものは拒否します。ドロップで何をするかはあなた次第です。

[ドキュメント](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/drag-and-drop)

Live ファイルをフォルダーに仕分けてください X ---- · Y ----

デモを読み込み中…

02並べ替え

## リストとグリッド

配列のドラフトを描画すると、ドラッグ中にリアルタイムで並べ替わります。ドロップすると、新しい順序があなたの ref に書き込まれます。縦、横、あらゆるサイズのグリッドに対応。

[ドキュメント](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/sortable-lists)

Live アプリを並べ替えるか、ドックに移してください X ---- · Y ----

デモを読み込み中…

03カンバン

## カンバンボード

同じグループのリストどうしでアイテムをやり取りします。パレットからのコピー、通常のドラッグ可能な要素の受け入れ、ずらす代わりの入れ替えも。受け取る側のリストは、ホバーに合わせて場所を空けます。

[ドキュメント](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/shared-lists)

Live カードを列の間で移動してみましょう X ---- · Y ----

デモを読み込み中…

04ツリー

## ツリー

深さ付きのフラットな形で描画するので、仮想化できます。横にドラッグして階層を変えたり、フォルダーにホバーして中にドロップしたり。深さを制限し、何をどこにネストできるかを決められます。

[ドキュメント](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/trees)

Live 横にドラッグすると深さが変わります X ---- · Y ----

デモを読み込み中…

05マルチドラッグ

## マルチドラッグ

Ctrl/Cmd クリックや枠で選んでから、1 つをドラッグします。選択全体がまとめて移動し、リストをまたいでも順番どおりに着地します。

[ドキュメント](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/multi-drag)

Live Ctrl/Cmd クリックするか枠を描いてから、ドラッグしてください X ---- · Y ----

06制約

## 軸、境界、グリッド

ドラッグエリアは、その中でドラッグされるすべてのもののルールを決めます：軸の固定、端の内側への制限、グリッドへのスナップ。しかもアプリの実行中に変更できます。

[ドキュメント](https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/constraints)

Live ルールを切り替えてから、図形をドラッグしてください X ---- · Y ----

デモを読み込み中…

07さらに

## 実際のアプリにも、そのまま。

01

### アニメーション

並べ替え中の FLIP、自分の位置に着地するドロップ、アニメーションするデータの変更。お好みで GSAP や motion も。

02

### アクセシブル

位置ごとに動かすキーボードドラッグ、ライブでの読み上げ、そしてあなたの設定を決して上書きしない ARIA 属性。

03

### 仮想リスト

TanStack Virtual と VueUse：数千行でも、並べ替えもアニメーションもそのまま。

04

### 制御モード

Pinia、サーバー、イミュータブルなデータ：デフォルトの書き込みをスキップして、結果を自分で適用できます。

08エコシステム

## 小さなコアと、よく切れるいくつかの道具。

ドラッグに必要なものはすべてコアにあります。それ以外は必要になったときに追加してください。

01

@vue-dnd-kit/devtools

### DevTools

Vue DevTools と Nuxt DevTools のタブ：ライブのミニマップ、何でもドラッグできるジョイスティック、アプリの実行中に編集できるオプション。

02

@vue-dnd-kit/actions

### プログラムによるドラッグ

「上へ移動」「Done へ移動」、ガイドツアー、テスト。読み上げもアニメーションも伴う本物のドラッグを、コードから。

03

@vue-dnd-kit/nuxt

### Nuxt モジュール

自動インポートされるコンポーザブル、グローバルコンポーネント、SSR セーフなデフォルト設定。

04

npx skills add

### AI エージェント向け

Claude Code などのアシスタントにライブラリの仕組みを教えるエージェントスキル。

npx skills add ZiZIGY/vue-dnd-kit

**01**

1,243

3 つのブラウザーでのエンドツーエンドテスト

**02**

469

ユニットテスト

**03**

21KB

ドラッグ可能な要素とドロップゾーン（gzip 圧縮後）

**04**

9

このドキュメントの対応言語

## どこから始めるか選びましょう。

[**01**<h3>**ガイドを読む**</h3>インストールから最初の並べ替え可能なリストまで、5 分で。](https://zizigy.github.io/vue-dnd-kit/ja/docs/getting-started/introduction) [**02**<h3>**サンプルを見る**</h3>コード付きのライブデモ。そのままコピーするか、StackBlitz で開けます。](https://zizigy.github.io/vue-dnd-kit/ja/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/ja#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"ja-JP","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/ja","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/ja#webpage","@type":"WebPage","description":"Vue 3 のための並べ替え可能なリスト、カンバンボード、ツリー、マルチドラッグ。アニメーション、キーボード操作、アクセシビリティにすぐ対応。","url":"https://zizigy.github.io/vue-dnd-kit/ja","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/ja#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/ja"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
