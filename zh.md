---
title: "Vue DnD Kit — drag and drop for Vue"
description: "适用于 Vue 3 的可排序列表、看板、树和多项拖拽——开箱即带动画、键盘支持和无障碍。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh"
meta:
  "og:description": "适用于 Vue 3 的可排序列表、看板、树和多项拖拽——开箱即带动画、键盘支持和无障碍。"
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — 适用于 Vue 3 的拖放库Vue 3 · TypeScript · SSR

01看板

**互换卡片的看板**

02树

**轻推一下即可嵌套**

03多项拖拽

**多个项，一次移动**

04可排序

**自动排序的列表**

05动画

**默认带动效**

06无障碍

space←↑↓→

**键盘是一等公民**

07虚拟列表

**一万行数据**

拖动卡片——或者用 Tab 聚焦到一张卡片，再用方向键移动

# 拖放，<br>为 Vue 而生。

适用于 Vue 3 的可排序列表、看板、树和多项拖拽——开箱即带动画、键盘支持和无障碍。

npm i @vue-dnd-kit/core

[开始使用](https://zizigy.github.io/vue-dnd-kit/zh/docs/getting-started/introduction)

免费开源，MIT 许可证。

00工作方式

## 是组合式函数，<br>不是组件。

标记是你的，样式也是你的。把模板引用交给组合式函数，元素就能拖拽、排序和放置——动画、键盘和屏幕阅读器的工作都已替你完成。

- 01 `**makeSortableList**`拖拽时重新排序的列表、网格和看板列——还能在同一分组内交换项。
- 02 `**makeSortableTree**`嵌套数据，扁平渲染：横向轻推改变深度，放进文件夹，支持虚拟化。
- 03 `**makeDraggable · makeDroppable**`其他一切：面板、画布、上传——什么放到哪里由你自己定规则。

01拖放

## 拖放

一个可拖拽元素、一个放置目标，再加一条决定什么放到哪里的规则。目标接收拖拽时会亮起，不接收的则拒绝；放置后做什么由你决定。

[文档](https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/drag-and-drop)

Live 把文件分类放进文件夹 X ---- · Y ----

正在加载演示…

02可排序

## 列表与网格

渲染数组的一份草稿，拖拽时它会实时重新排序。放置时，新的顺序写入你的 ref。垂直、水平，或任意尺寸的网格。

[文档](https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/sortable-lists)

Live 重新排列应用，或把一个拖进程序坞 X ---- · Y ----

正在加载演示…

03看板

## 看板

同一分组的列表互相交换项。从面板复制、接收普通的可拖拽元素，或用交换代替平移——悬停时，接收的列表会让出空间。

[文档](https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/shared-lists)

Live 在列之间移动卡片 X ---- · Y ----

正在加载演示…

04树

## 树

以带深度的扁平形式渲染，因此可以虚拟化。横向拖动改变层级，或悬停在文件夹上放进去；可以限制深度，并决定什么能嵌套在哪里。

[文档](https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/trees)

Live 横向拖动可改变深度 X ---- · Y ----

正在加载演示…

05多项拖拽

## 多项拖拽

用 Ctrl/Cmd 点击或画框来选择，然后拖动其中一个：整个选中集合一起移动并按顺序落下，跨列表也可以。

[文档](https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/multi-drag)

Live Ctrl/Cmd 点击或画框选择，然后拖动 X ---- · Y ----

06约束

## 轴、边界与网格

拖拽区域为其中的所有拖拽设定规则：锁定一个轴、把拖拽限制在边界内、吸附到网格——还能在应用运行时修改它们。

[文档](https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/constraints)

Live 切换规则，然后拖动一个图形 X ---- · Y ----

正在加载演示…

07还有更多

## 为真实应用而准备。

01

### 动画

排序时的 FLIP、落到位置上的放置、带动画的数据变化。也可以引入 GSAP 或 motion。

02

### 无障碍

按位置移动的键盘拖拽、实时播报，以及永远不会覆盖你自己设置的 ARIA 属性。

03

### 虚拟列表

TanStack Virtual 和 VueUse：成千上万行，依然可排序，依然有动画。

04

### 受控模式

Pinia、服务端或不可变数据：跳过默认写入，自己应用结果。

08生态

## 小巧的核心，几件趁手的工具。

核心包就能实现所有拖拽。其余的按需添加。

01

@vue-dnd-kit/devtools

### DevTools

Vue DevTools 和 Nuxt DevTools 中的一个标签页：实时小地图、能拖动任何东西的摇杆，以及可在应用运行时编辑的选项。

02

@vue-dnd-kit/actions

### 程序化拖拽

“上移”、“移到 Done”、引导和测试——从代码发起的真实拖拽，带播报和动画。

03

@vue-dnd-kit/nuxt

### Nuxt 模块

自动导入的组合式函数、全局组件和 SSR 安全的默认设置。

04

npx skills add

### 面向 AI 智能体

一个 agent skill，教会 Claude Code 和其他助手这个库是如何工作的。

npx skills add ZiZIGY/vue-dnd-kit

**01**

1,243

在三种浏览器中运行的端到端测试

**02**

469

单元测试

**03**

21KB

可拖拽元素和放置区，gzip 后

**04**

9

本文档支持的语言

## 选择从哪里开始。

[**01**<h3>**阅读指南**</h3>从安装到你的第一个可排序列表，只需五分钟。](https://zizigy.github.io/vue-dnd-kit/zh/docs/getting-started/introduction) [**02**<h3>**浏览示例**</h3>附带代码的在线演示，可以直接复制，或在 StackBlitz 中打开。](https://zizigy.github.io/vue-dnd-kit/zh/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/zh#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"zh-CN","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/zh","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/zh#webpage","@type":"WebPage","description":"适用于 Vue 3 的可排序列表、看板、树和多项拖拽——开箱即带动画、键盘支持和无障碍。","url":"https://zizigy.github.io/vue-dnd-kit/zh","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/zh#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/zh"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
