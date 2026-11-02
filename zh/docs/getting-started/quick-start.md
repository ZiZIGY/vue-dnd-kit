---
title: "快速上手"
description: "用三个文件实现一个可排序列表——一个 provider、一个列表和它的行。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/getting-started/quick-start"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

下面是完整的可运行示例。拖动一行；或者用 Tab 聚焦到某一行，按 <kbd value="Space">



</kbd>

，用方向键移动它，再按一次 <kbd value="Space">



</kbd>

。

<example name="quick-start" title="快速上手">



</example>

## 分步说明

<steps level="3">

### 用 provider 包裹应用

`DnDProvider` 掌管拖拽。每个组合式函数都必须在**渲染于它内部**的组件中运行——而不是在模板里包含它的那个组件中。

### 创建列表

`makeSortableList` 接收列表的元素和你的数组。它返回 `items`：一份在拖拽时实时重新排序的草稿。渲染草稿而不是你的数组，并用 id 作为行的 key。

### 创建行

每一行用自己的元素和它渲染的项调用 `makeSortableItem`。行的 key 来自 `item.id`。

</steps>

放置完成后，`tasks` 会得到新的顺序——它是一个普通的 `ref`，所以应用的其他部分会像看到任何其他变化一样看到这次变化。

<tip>

在用 Pinia、服务端数据或不可变数据？传入 getter 而不是 ref，然后在 `onDrop` 中调用 `e.preventDefault()`，自己应用 `e.result`。

</tip>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
