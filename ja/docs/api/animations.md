---
title: "アニメーション"
description: "アニメーションのオプションとフック。並べ替え、ドロップ、そしてドラッグ以外による変更。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

プロバイダーの `animation`（並べ替え中のレイアウトの移動）、`dropAnimation`（オーバーレイの着地）、`animateChanges`（ドラッグ以外によるデータの変更）は、`false`、オプション、または独自の関数（GSAP や motion 用）を受け付けます。リストとツリーは `animation` と `animateChanges` を上書きできます。ドラッグ可能な要素、アイテム、リストは独自の `dropAnimation` を、ドロップターゲットは `overDropAnimation` を持てます。[アニメーション](https://zizigy.github.io/docs/guides/animations)を参照してください。

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

下の各レーンはそれぞれ独立したプロバイダーで、`animation`、`dropAnimation`、`animateChanges` に同じ種類の値を渡しています（`animateChanges` は `move` で関数を受け取ります）。

<example height="27rem" hint="シャッフルするか、各レーンで行をドラッグしてみましょう" name="api-animation-shapes">



</example>

## オプション

<api-table name="AnimationOptions">



</api-table>

## 並べ替え

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## ドロップ

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## データの変更

<api-table name="AutoAnimation">



</api-table>

<api-table name="AutoAnimationOptions">



</api-table>

<api-table name="EnterAnimation">



</api-table>

<api-table name="EnterAnimationContext">



</api-table>

<api-table name="LeaveAnimation">



</api-table>

<api-table name="LeaveAnimationContext">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
