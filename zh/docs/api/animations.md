---
title: "动画"
description: "动画的选项和钩子——排序、放置，以及非拖拽引起的变化。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

provider 的 `animation`（排序时的布局移动）、`dropAnimation`（浮层落位）和 `animateChanges`（非拖拽引起的数据变化）接受 `false`、选项，或你自己的函数——用于 GSAP 或 motion。列表和树可以覆盖 `animation` 和 `animateChanges`；可拖拽元素、项和列表可以带上自己的 `dropAnimation`，放置目标则可以带上 `overDropAnimation`。参见[动画](https://zizigy.github.io/docs/guides/animations)。

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

下面的每条泳道都是一个独立的 provider，它的 `animation`、`dropAnimation` 和 `animateChanges`（后者在 `move` 中接受函数）都使用同一种取值形式。

<example height="27rem" hint="打乱顺序，或在每条泳道中拖动一行" name="api-animation-shapes">



</example>

## 选项

<api-table name="AnimationOptions">



</api-table>

## 排序

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## 放置

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## 数据变化

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
