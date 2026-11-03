---
title: "DnDProvider"
description: "掌管拖拽的组件——为渲染在它内部的所有内容负责输入、浮层、选中集合、自动滚动和实时区域。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/dnd-provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="DnDProvider">



</api-signature>

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider :animation="{ duration: 200 }" @drag-end="save">
    <RouterView />
    <template #overlay="{ items, over, accepted }">
      <!-- optional: a custom overlay for every drag -->
    </template>
  </DnDProvider>
</template>
```

每个组合式函数都必须在渲染于 provider **内部**的组件中运行。目标是整个应用只用一个 provider：页面的各部分通过 [`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area) 获得自己的规则。参见 [provider 指南](https://zizigy.github.io/docs/guides/provider)。

大多数 props 在 provider 需要时才读取：改变其中一个，下一次拖拽就会使用新值。

<example height="37rem" hint="切换一个 prop，然后拖动一个任务：用鼠标、长按、按住 Alt 或 Shift，或在获得焦点的任务上按 Space" name="api-provider-props">



</example>

### 浮层渲染在哪里

`overlayTo` 把浮层移出 `body`：移进一个模态 `<dialog>`，它位于页面上所有其他内容之上。关闭开关，你拖动的行就会消失在对话框下面。[浮层指南](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto)说明了什么时候需要它。

<example height="22rem" hint="打开对话框并拖动一列；然后关闭开关再拖一次" name="overlay-dialog">



</example>

## Props

<api-table name="DnDProviderProps">



</api-table>

## 事件

<table>
<thead>
  <tr>
    <th>
      事件
    </th>
    
    <th>
      载荷
    </th>
    
    <th>
      触发时机
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag-start
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      拖拽已开始（在激活之后）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-move
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      拖拽期间指针移动了（每帧最多一次）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-over
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      拖拽下方的目标发生了变化。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-end
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
    </td>
    
    <td>
      放置已完成并已写入。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-cancel
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      拖拽被取消，或放置被拒绝。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-resume
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       返回了 <code>
        'continue'
      </code>
      
      ：没有发生放置，拖拽继续进行。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-settle
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
      
       或 <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      拖拽的浮层已经落位：参数是 <code>
        drag-end
      </code>
      
       或 <code>
        drag-cancel
      </code>
      
       收到的那个事件。
    </td>
  </tr>
</tbody>
</table>

同样的事件，再加上 `onBeforeDrop`，可以通过 [`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd) 在 provider 之下的任何地方使用。它们的载荷见[事件页面](https://zizigy.github.io/docs/api/events)。

## `#overlay` 插槽

为每一次没有自己浮层组件的拖拽渲染跟随指针的内容（参见[浮层指南](https://zizigy.github.io/docs/guides/overlay)）。什么都不渲染时会退回到克隆。

<api-table name="OverlaySlotProps">



</api-table>

## 键盘

<api-table name="KeyboardOptions">



</api-table>

## 自动滚动

<api-table name="AutoScrollOptions">



</api-table>

## 触感反馈

<api-table name="HapticsOptions">



</api-table>

<api-table name="HapticPattern">



</api-table>

## 播报

<api-table name="Announcements">



</api-table>

<api-table name="AnnouncementContext">



</api-table>

<api-table name="AnnouncedPosition">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
