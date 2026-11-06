---
title: "Provider"
description: "DnDProvider 掌管它之下的每一次拖拽。它查找目标、启动拖拽、负责滚动，并把发生的一切告诉 useDnD 和 useDnDMonitor。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## 整个应用一个 provider

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <RouterView />
  </DnDProvider>
</template>
```

在较高的层级放一个 `DnDProvider`，比如 `App.vue` 或某个布局里，然后就不用再管它了。每个组合式函数（`makeSortableList`、`makeDraggable`、`useDnD`……）都会查找它所在组件上方最近的 provider。

<warning>

组合式函数必须在**渲染于** provider **内部**的组件中运行。如果在自身模板包含 `<DnDProvider>` 的组件里调用，会抛出 `No <DnDProvider> found above this component`：Vue 的 `inject` 只能看到祖先组件。

</warning>

## 它掌管什么

<table>
<thead>
  <tr>
    <th>
      部分
    </th>
    
    <th>
      provider 做什么
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      输入
    </td>
    
    <td>
      把指针、触摸和键盘输入变成拖拽（<code>
        sensors
      </code>
      
      、<code>
        activation
      </code>
      
      ），一次一个拖拽。
    </td>
  </tr>
  
  <tr>
    <td>
      查找目标
    </td>
    
    <td>
      对拖拽下方的放置目标做命中测试（<code>
        collision
      </code>
      
      ），并通知它们。
    </td>
  </tr>
  
  <tr>
    <td>
      浮层
    </td>
    
    <td>
      渲染跟随指针的盒子，传送到 <code>
        body
      </code>
      
      ，并在放置时让它落位。
    </td>
  </tr>
  
  <tr>
    <td>
      选中集合
    </td>
    
    <td>
      一个选中 id 的集合，由它之下的所有列表和可拖拽元素共享。
    </td>
  </tr>
  
  <tr>
    <td>
      自动滚动
    </td>
    
    <td>
      拖拽靠近容器或窗口边缘时滚动它们。
    </td>
  </tr>
  
  <tr>
    <td>
      实时区域
    </td>
    
    <td>
      向屏幕阅读器播报拿起、移动、放置和取消。
    </td>
  </tr>
</tbody>
</table>

除此之外它什么都不渲染：你的标记保持原样。

## 选项一览

每个选项都有可用的默认值，所以 provider 通常不需要传任何选项。provider 在需要时才读取它的 props：下面的演示会实时切换 `collision`、`activation` 和 `autoScroll`。

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      默认值
    </th>
    
    <th>
      设置什么
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        collision
      </code>
    </td>
    
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      如何选出拖拽下方的目标。见<a href="#finding-the-target">
        下文
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      鼠标 4 px，触摸 200 ms
    </td>
    
    <td>
      按下何时变成拖拽，按指针类型分别设置。见<a href="#when-a-press-becomes-a-drag">
        下文
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      开启
    </td>
    
    <td>
      边缘滚动：<code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       或 <code>
        false
      </code>
      
      。见<a href="#auto-scroll">
        下文
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        haptics
      </code>
    </td>
    
    <td>
      触摸拿起时短暂振动
    </td>
    
    <td>
      触摸拖拽的振动，或 <code>
        false
      </code>
      
      。见<a href="#haptics-and-the-copy-key">
        下文
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        copyModifier
      </code>
    </td>
    
    <td>
      <code>
        'Alt'
      </code>
    </td>
    
    <td>
      拖拽时按住该键，移动就变成复制。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      适用于每次拖拽的移动规则：见<a href="/docs/guides/constraints">
        约束
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animation
      </code>
      
       / <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      开启
    </td>
    
    <td>
      排序时项的滑动 / 浮层落位：见<a href="/docs/guides/animations">
        动画
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      关闭
    </td>
    
    <td>
      列表和树的默认值：为非拖拽引起的数据变化添加动画。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Space / Enter、Escape
    </td>
    
    <td>
      键盘按键和步长；<code>
        false
      </code>
      
       关闭键盘拖拽。见<a href="/docs/guides/accessibility#the-keyboard">
        无障碍
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sensors
      </code>
    </td>
    
    <td>
      指针 + 键盘
    </td>
    
    <td>
      把输入变成拖拽的部件：见<a href="/docs/guides/sensors">
        传感器
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTo
      </code>
    </td>
    
    <td>
      <code>
        'body'
      </code>
    </td>
    
    <td>
      浮层传送到哪里。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayFit
      </code>
    </td>
    
    <td>
      <code>
        'slot'
      </code>
    </td>
    
    <td>
      浮层尺寸：它将落入的位置的尺寸，或源元素的尺寸。见<a href="/docs/guides/overlay">
        浮层
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTransition
      </code>
    </td>
    
    <td>
      交叉淡入淡出
    </td>
    
    <td>
      拖拽过程中浮层从一个组件换成另一个组件的方式：<code>
        false
      </code>
      
      ，或 <code>
        <Transition>
      </code>
      
       的 props。见<a href="/docs/guides/overlay#targets-that-change-the-overlay">
        改变浮层的目标
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayClass
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      浮层内容（<code>
        [data-dnd-overlay-content]
      </code>
      
      ）的类，它是作为整体添加动画的元素：拖拽拿起时抬起，落位时落定。见<a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        浮层：抬起、倾斜、落定
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayPreviews
      </code>
    </td>
    
    <td>
      <code>
        5
      </code>
    </td>
    
    <td>
      多项拖拽：拿起时有多少个被拖拽项获得克隆，或 <code>
        'all'
      </code>
      
      。见<a href="/docs/guides/multi-drag#the-default-overlay">
        默认浮层
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        announcements
      </code>
    </td>
    
    <td>
      内置
    </td>
    
    <td>
      屏幕阅读器文本，或 <code>
        false
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        screenReaderInstructions
      </code>
    </td>
    
    <td>
      内置
    </td>
    
    <td>
      每个可拖拽元素用 <code>
        aria-describedby
      </code>
      
       指向的文本。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defaultStyles
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      为拖拽状态注入零优先级的 CSS：见<a href="/docs/guides/styling">
        样式
      </a>
      
      。
    </td>
  </tr>
</tbody>
</table>

包含所有类型结构的完整列表见 [DnDProvider API](https://zizigy.github.io/docs/api/dnd-provider)。provider 还会触发 `drag-start`、`drag-move`、`drag-over`、`drag-end`、`drag-cancel`、`drag-resume` 和 `drag-settle`，与 `useDnDMonitor` 收到的事件相同。

## 读取拖拽：`useDnD()`

<example height="27rem" hint="拖拽一个任务，观察状态" name="provider-state">



</example>

`useDnD()` 以响应式状态返回当前拖拽，可在 provider 之下的任何组件中使用：

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      字段
    </th>
    
    <th>
      内容
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'idle'
      </code>
      
      、<code>
        'activating'
      </code>
      
      （按下后等待激活）、<code>
        'dragging'
      </code>
      
      、<code>
        'dropping'
      </code>
      
      （没有拖拽在进行，但仍有浮层在落位，或异步的 <code>
        onBeforeDrop
      </code>
      
       正在做决定）、<code>
        'selecting'
      </code>
      
      （框选中）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      被拖拽的内容：<code>
        id
      </code>
      
      、<code>
        ids
      </code>
      
      （所有被拖拽的 id，抓起的那个在最前）、<code>
        items
      </code>
      
      、<code>
        data
      </code>
      
      、<code>
        type
      </code>
      
      、<code>
        element
      </code>
      
      、<code>
        rect
      </code>
      
      、<code>
        sensor
      </code>
      
      。空闲时为 <code>
        null
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      拖拽下方的目标：<code>
        id
      </code>
      
      、<code>
        data
      </code>
      
      、<code>
        element
      </code>
      
      、<code>
        rect
      </code>
      
       和 <code>
        accepted
      </code>
      
      。下方没有目标时为 <code>
        null
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      指针的视口坐标，已经过修饰器处理。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.progress
      </code>
    </td>
    
    <td>
      按下等待激活期间从 <code>
        0
      </code>
      
       到 <code>
        1
      </code>
      
      ：可以用它画一个圆环。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      自动滚动正在滚动某个元素。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      provider 的选中集合：<code>
        ids
      </code>
      
      、<code>
        has
      </code>
      
      、<code>
        add
      </code>
      
      、<code>
        delete
      </code>
      
      、<code>
        toggle
      </code>
      
      、<code>
        set
      </code>
      
      、<code>
        clear
      </code>
      
      。见<a href="/docs/guides/multi-drag">
        多项拖拽
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      取消进行中的拖拽（项飞回原处）、正在蓄力的按下，或框选。
    </td>
  </tr>
</tbody>
</table>

```vue [DropHint.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';

const { status, over } = useDnD();
const refused = computed(() => status.value === 'dragging' && over.value?.accepted === false);
</script>

<template>
  <p v-if="refused" role="status">This list doesn't take that.</p>
</template>
```

放置一旦确定，`active`、`over` 和 `pointer` 就读到 `null`，即使浮层还在落位（`status` 读到 `'dropping'`）。由它们派生的 UI 永远不会把旧的拖拽和新数据一起显示。在异步的 `onBeforeDrop` 等待期间，状态保持松开时的样子。

下一次拖拽不会等待落位：它立即开始，上一个浮层在它周围落位时，`status` 读到 `'dragging'`。在正在落位的浮层上按下，就能在半空中接住它：拖拽从浮层所在的位置继续。`onDragSettle` 告诉你一次拖拽的浮层何时落定。

## 监听每一次拖拽：`useDnDMonitor()`

```ts
import { useDnDMonitor } from '@vue-dnd-kit/core';

useDnDMonitor({
  onDragStart: ({ active }) => {},
  onDragMove: ({ pointer, delta }) => {},
  onDragOver: ({ over }) => {},                  // the target changed
  onBeforeDrop: (e) => 'accept',                 // or 'reject', 'continue', some ids; may be async
  onDragEnd: ({ active, over, dropped, accepted, position }) => {},
  onDragCancel: ({ active }) => {},
  onDragResume: ({ active }) => {},              // onBeforeDrop answered 'continue'
  onDragSettle: ({ active, over }) => {},        // its overlay has landed
});
```

监听器能收到其 provider 之下的每一次拖拽，无论拖拽从哪里开始：上面的面板无需导入列表，就能记录列表的拖拽。调用它的组件卸载时，监听器随之停止。

<table>
<thead>
  <tr>
    <th>
      事件
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
        onDragStart
      </code>
    </td>
    
    <td>
      拖拽开始。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      拖拽移动。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      拖拽下方的目标改变。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      拖拽被松开。它的返回值决定放置：见<a href="/docs/guides/drop-decisions">
        决定放置
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      放置已完成。可排序列表已经运行了它们的 <code>
        onDrop
      </code>
      
       并写入了新顺序。拖拽结束时下方没有目标，则 <code>
        dropped
      </code>
      
       为 <code>
        false
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      按下 Escape、放到拒绝它的目标上，或 <code>
        onBeforeDrop
      </code>
      
       返回了 <code>
        'reject'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragResume
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       返回了 <code>
        'continue'
      </code>
      
      ：没有放置，拖拽继续。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      拖拽的浮层已经落位（或已飞回原处，或被下一次拖拽接住），参数是 <code>
        onDragEnd
      </code>
      
       或 <code>
        onDragCancel
      </code>
      
       收到的那个事件。在此期间可能已有其他拖拽开始。
    </td>
  </tr>
</tbody>
</table>

每个事件都带有 `active`、`over`、`pointer`、`delta`（相对起点的偏移）、`position`（被拖拽的盒子在 `over` 中的位置，见[拖放](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)），对来自可排序列表的项还带有 `source`。完整结构见[事件 API](https://zizigy.github.io/docs/api/events)。

<note>

`onDragEnd` 是做“放置之后”工作的地方：保存、清空选中集合、统计分析。列表自己的 `onDrop` 在写入**之前**运行，所以它看到的仍是旧顺序。

</note>

## 查找目标

选择一个函数，然后把图钉或卡片拖到各个目标上。徽标显示该函数在这一帧中对它们的排名；绿色的那个就是目标。

<example height="33rem" hint="切换函数，拖过嵌套的、较小的和重叠的目标" name="collision-lab">



</example>

在拖拽的每一帧，provider 把参与其中的放置目标交给 `collision`，它返回这些目标的 id，最佳的在前。库自带五个函数：

<table>
<thead>
  <tr>
    <th>
      函数
    </th>
    
    <th>
      排名依据
    </th>
    
    <th>
      适用于
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      指针下方的目标；没有时，取被拖拽盒子所重叠的目标。
    </td>
    
    <td>
      默认值：指针下方精确，间隙处宽容。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      只看指针下方的目标，最内层的在前。
    </td>
    
    <td>
      精确的目标：放在间隙里不会落到任何地方。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      被拖拽盒子重叠的每个目标：先比 <code>
        priority
      </code>
      
      ，再比嵌套深度，再比重叠面积。
    </td>
    
    <td>
      大的项拖到小的目标上，而指针位于项的边缘。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      所有目标，按盒子中心到目标中心的距离。
    </td>
    
    <td>
      总有一个目标胜出，即使离得很远：网格以及等尺寸项的列表。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      所有目标，按四个角之间的距离。
    </td>
    
    <td>
      并排的列（看板），高度差异很大的目标。
    </td>
  </tr>
</tbody>
</table>

在指针下方，命中测试遵循用户所见：重叠的目标中只有最上层的那个会被命中（重叠处是 `front`，从不是 `back`），嵌套的目标中最内层的在前（先 `subfolder`，再 `folder`）。

### 自定义函数

```ts [magnet.ts]
import type { CollisionDetection, Coordinates, Rect } from '@vue-dnd-kit/core';

/** How far the point is from the rect: 0 inside it. */
const gap = (rect: Rect, point: Coordinates) =>
  Math.hypot(
    Math.max(rect.left - point.x, 0, point.x - rect.right),
    Math.max(rect.top - point.y, 0, point.y - rect.bottom),
  );

/** What is under the pointer; in a gap, the nearest target within 40px. */
export const magnet: CollisionDetection = ({ hits, pointer, candidates }) => {
  if (hits.length) return hits;
  return candidates
    .filter((candidate) => gap(candidate.rect, pointer) <= 40)
    .sort((a, b) => gap(a.rect, pointer) - gap(b.rect, pointer))
    .map((candidate) => candidate.id);
};
```

<table>
<thead>
  <tr>
    <th>
      参数
    </th>
    
    <th>
      内容
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      指针，已经过修饰器处理。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      被拖拽盒子当前显示的样子，没有浮层时为 <code>
        null
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      参与其中的每个目标：<code>
        id
      </code>
      
      、<code>
        rect
      </code>
      
      （它的可见部分，已被滚动容器裁剪）、<code>
        priority
      </code>
      
      、<code>
        depth
      </code>
      
      （顶层为 <code>
        0
      </code>
      
      ，嵌套越深越大）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      指针下方的目标，来自命中测试，最佳的在前。
    </td>
  </tr>
</tbody>
</table>

返回空数组表示“没有目标”。禁用的目标、位于被拖拽项内部的目标，以及被滚动容器遮住的目标，都不会传给该函数。拒绝该拖拽的目标仍然参与竞争：拖到它上方时，`over.accepted` 为 `false`，放置会被拒绝（位于可排序项内部的目标则会让开，让列表在它上方排序）。演示包装了所选的函数来记录它的排名：`(args) => (ranked.value = detect(args))`。

<note>

provider 会抑制函数请求的切换。拖拽刚离开的目标，要等指针移动 10 px 后才能再次胜出，因此边界不会闪烁。在嵌套于同一父元素的目标之间（一列卡片的间隙里），保留上一个目标。

</note>

## 按下何时变成拖拽

按下不会立刻开始拖拽。`activation` 按指针类型（`mouse`、`touch`、`pen`）设置要等待的条件：以 px 计的 `distance`、以 ms 计的 `delay`（外加一个 `tolerance`，超出它按下就放弃，让页面可以滚动），或两者中先满足的那个。

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      指针
    </th>
    
    <th>
      默认值
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        mouse
      </code>
      
      、<code>
        pen
      </code>
    </td>
    
    <td>
      <code>
        { distance: 4 }
      </code>
      
      ：点击仍然是点击。在 <code>
        handle
      </code>
      
       上按下鼠标会立刻开始，不移动的话仍然是点击。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        touch
      </code>
    </td>
    
    <td>
      <code>
        { delay: 200, tolerance: 5 }
      </code>
      
      ：长按，这样手指下的列表仍能滚动。
    </td>
  </tr>
</tbody>
</table>

没有写出的类型保留默认值。可拖拽元素自己的 `activation` 优先于[拖拽区域](https://zizigy.github.io/docs/guides/constraints)的，后者又优先于 provider 的。按下等待期间，`useDnD().status` 为 `'activating'`，`activation.progress` 从 `0` 走到 `1`；按 Escape 或调用 `useDnD().cancel()` 会放弃它。在[传感器](https://zizigy.github.io/docs/guides/sensors#activation-constraints)中可以实时试验这些约束，并根据进度画出长按圆环。

## 自动滚动

把一个频道拖向列表的顶部或底部。绿色条带是边缘区域：越深入其中，列表滚动得越快。

<example height="37.5rem" hint="把一个频道拖进绿色条带" name="auto-scroll-edges">



</example>

任何 `overflow: auto` 或 `scroll` 的元素都会自动滚动，窗口也一样。provider 先滚动指针下方的容器，再滚动它的祖先，最后滚动窗口。

<table>
<thead>
  <tr>
    <th>
      选项
    </th>
    
    <th>
      默认值
    </th>
    
    <th>
      设置什么
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        0.2
      </code>
    </td>
    
    <td>
      边缘区域，为容器尺寸的比例，介于 24 到 96 px 之间。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        acceleration
      </code>
    </td>
    
    <td>
      <code>
        10
      </code>
    </td>
    
    <td>
      在最边缘处的速度，单位为 px/帧。它随深入区域的深度的平方增长，所以起步缓慢而精确。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSpeed
      </code>
    </td>
    
    <td>
      <code>
        25
      </code>
    </td>
    
    <td>
      最高速度。越过边缘（指针在容器之外）后，速度继续增长，直到这个值。
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` 会关闭它。只有当指针已朝某个方向移动后，才会朝那个方向滚动，所以在边缘附近拿起的项不会自己滚动。列表、树和[拖拽区域](https://zizigy.github.io/docs/guides/constraints)可以为自己的容器设置单独的 `autoScroll`：

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

键盘拖拽从不自动滚动：它会把项滚动到可见范围内。有内容在滚动时，`isAutoScrolling`（来自 `useDnD()` 或拖拽区域）为 `true`。

## 触感反馈与复制键

触摸拖拽开始时会短暂振动。`:haptics="false"` 关闭它；传入对象可以设置每一种振动：

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      键
    </th>
    
    <th>
      振动时机
    </th>
    
    <th>
      默认值
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        start
      </code>
    </td>
    
    <td>
      长按变成拖拽。
    </td>
    
    <td>
      <code>
        true
      </code>
      
      （10 ms）
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      拖拽进入接受它的目标。
    </td>
    
    <td>
      关闭
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      放置完成。
    </td>
    
    <td>
      关闭
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      放置被拒绝，项飞回原处。
    </td>
    
    <td>
      关闭
    </td>
  </tr>
</tbody>
</table>

每一项可以取 `true`（默认模式）、以 ms 计的时长、一个开/关模式数组，或 `false`。只有由触摸开始的拖拽才会振动，而 iOS Safari 完全无法振动。

`copyModifier` 是在列表之间拖拽时按住、把移动变成复制的那个键：默认为 `'Alt'`，可以是任意 `KeyboardEvent.key`，或 `null` 表示不用。项所来自的列表需要一个 `clone` 函数；见[共享项的列表](https://zizigy.github.io/docs/guides/shared-lists)。

## 多个 provider

大多数应用恰好只需要一个。把愿望清单放到它自己的 provider 下，然后试着把一本书移过去：它无法离开自己的 provider，外层的监听器也不再收到愿望清单的拖拽。

<example height="33.5rem" hint="把一本书移过去，然后给愿望清单单独一个 provider" name="provider-nested">



</example>

```vue
<DnDProvider>
  <Shelf v-model="reading" />
  <DnDProvider>
    <Shelf v-model="wishlist" />
    <EventLog />            <!-- hears the inner provider's drags only -->
  </DnDProvider>
</DnDProvider>
```

- provider 之间相互独立：拖拽永远不会从一个跨到另一个。
- 允许嵌套 provider。**最近的所有者胜出**：项属于它上方最近的 provider，外层 provider 会忽略它。
- 每个 provider 都有自己的选中集合、浮层、实时区域和监听器。

只有当页面的某一部分需要自己的 provider 级设置（碰撞检测、键盘按键、播报），并且其中的项从不离开它时，第二个 provider 才有意义。如果项无法在页面的两部分之间移动，检查它们是否处于两个 provider 之下。

<tip>

针对页面某一部分的规则（吸附的画板、触摸按下时间更长的信息流、不能拖拽任何东西的面板）不需要单独的 provider：

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

其中的项仍属于应用的 provider，依然可以移动到任何地方。见[约束](https://zizigy.github.io/docs/guides/constraints)。

</tip>

挂载在别处的应用，无论是在 shadow root 中还是作为独立的 Vue 应用，都可以加入已有的 provider：在挂载之前把 `useDnDContext()` 传给 `provideDnDContext(app, context)`。命中测试和浮层可以跨越 shadow root 工作。

## 应用的其他窗口

应用可以把自己的一部分显示在另一个窗口中：它用 `window.open` 打开的弹出窗口、分离出来的面板、Document Picture-in-Picture 窗口。它通过 Teleport 渲染到那里，仍在同一个 provider 之下。在一个窗口中打开愿望清单，并在那里排序：浮层就在弹出窗口中。

<example height="26rem" hint="在一个窗口中打开愿望清单，然后在那里排序" name="provider-windows">



</example>

打开窗口时，把这个窗口告诉 provider：

```ts
const dnd = useDnD();

function detach() {
  const popup = window.open('', 'inspector', 'popup,width=420,height=560')!;
  const release = dnd.addWindow(popup);       // listen there, until it closes
  popup.addEventListener('pagehide', release);
  target.value = popup.document.body;         // <Teleport :to="target">…</Teleport>
}
```

- 拖拽在那个窗口中和在页面上一样工作：在那里开始，排序并命中它的放置目标，让它自动滚动，并在它的 `<body>` 中显示浮层。由那个窗口的帧来运行拖拽，所以藏在弹出窗口后面的页面不会拖慢它们。
- 指针拖拽或键盘拖拽会留在它开始的窗口中：浏览器只把一个窗口的输入发给那个窗口。带有 [`native`](https://zizigy.github.io/docs/guides/native) 的项可以在窗口之间穿梭，由浏览器自己的拖放来携带。
- 挂载时就渲染到该窗口中的组件会被自动找到。Teleport 之后才移过去的内容（一个分离出来的面板）则不会：这正是 `addWindow` 的用途。
- provider 会把它的样式注入到窗口中，并在窗口关闭时放开它。
- [自定义传感器](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own)用 `context.onWindow((view) => useEventListener(view.document, …))` 在每个窗口中监听。

## SSR 与 Nuxt

provider 对 SSR 是安全的。列表和项像其他标记一样在服务端渲染。浮层和实时区域是传送出去的，只在客户端挂载，因此永远不会导致激活不匹配。默认 id 来自 Vue 的 `useId()`，在服务端和客户端之间保持一致。

在 Nuxt 中，模块会全局注册 `DnDProvider` 并自动导入组合式函数：见[安装](https://zizigy.github.io/docs/getting-started/installation#nuxt)。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
