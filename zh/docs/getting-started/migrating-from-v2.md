---
title: "从 v2 迁移"
description: "把 v2 应用迁移到 v3——改了什么以及为什么、升级步骤、每个 v2 API 到 v3 替代项的对照、常见场景的前后代码，以及容易踩的坑。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 是对 v2 的重写。模型保持不变：一个 provider，加上在你自己的元素上调用的组合式函数。但大多数名称和选项都变了，排序移进了库里，你为每个列表写的放置处理函数也不再需要。本页把 v2 的每个部分对应到 v3，然后展示常见场景的前后对比。

## 改了什么

- **排序是内置的**。在 v2 中，列表是一个放置区，它的行是带 `[index, items]` 载荷的可拖拽元素，你在 `onDrop` 中用 `e.helpers.suggestSort()` 排序。在 v3 中，由 `makeSortableList` 和 `makeSortableItem` 完成：列表渲染你的数组的一份**草稿**，它在拖拽时重新排序，放置时把新数组写进你的 ref。大多数 v2 的放置处理函数直接删除，而不是移植。
- **东西会自己动**。行滑到新位置（FLIP），浮层在放置时落到它的位置上，取消时飞回原处。`<TransitionGroup>` 不再需要。
- **仍然只有一个包**。`@vue-dnd-kit/core` 包含列表、树、多项拖拽、修饰器、传感器和碰撞检测函数。Nuxt 模块保留；`@vue-dnd-kit/actions`（程序化拖拽）和 `@vue-dnd-kit/devtools` 是新增的可选包。
- **真正的浮层**。它被传送到 `body`，显示一个深度克隆，尺寸与它将落入的位置一致。浮层组件以 props 的形式获得拖拽信息，而不是读取 provider 的内部状态。
- **用 id，而不是元素**。选中集合、事件和拖拽状态都以你数据中的 id 为键。不再需要读取 DOM 元素的映射表。
- **类型和 accept 规则**替代了普通可拖拽元素和放置目标上的 `groups`。列表按 `group` 名称互相交换项。
- **放置之前做决定**。`onBeforeDrop` 接受、拒绝、让拖拽继续，或只接收部分项。`onDrop` 只负责应用。
- **传感器**。指针和键盘输入都是传感器。激活按指针类型分别设置，触摸拖拽通过长按开始，所以列表在手指下仍能滚动。
- **区域**。`makeDragArea` 取代了 `makeConstraintArea` 和 `makeAutoScroll`，自动滚动无需代码就能在每个滚动容器中工作。
- **无障碍默认开启**：ARIA 属性、放置后焦点会回来，以及屏幕阅读器播报。

## 升级

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@^3
```

```bash [yarn]
yarn add @vue-dnd-kit/core@^3
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@^3
```

```bash [bun]
bun add @vue-dnd-kit/core@^3
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      包
    </th>
    
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.x，可选
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.x，可选
    </td>
  </tr>
</tbody>
</table>

- `package.json` 中写着 `"@vue-dnd-kit/core": "^2…"` 的应用会一直停留在 v2，直到版本范围改为 `^3`。
- Vue **3.5** 或更新版本。v2 没有依赖；v3 有一个：`@vueuse/core`（14 或 15）。
- 浏览器：Chrome 和 Edge 104+、Safari 15.4+、Firefox 104+。
- v2 和 v3 共用同一个包名，所以应用要一次性迁移到 v3。没有兼容层。v2 的文档仍可从页面顶部的版本菜单访问。

推荐的工作顺序：

1. 升级包，并重命名 provider 的 props（[见下文](#the-provider)）。
2. 把每个可排序列表改成 `makeSortableList` 和 `makeSortableItem`，并删除它的放置处理函数。
3. 移植普通的可拖拽元素和放置区。
4. 把自定义预览移植成浮层组件，或 provider 的 `#overlay` 插槽。
5. 用 `makeDragArea` 替换 `makeConstraintArea` 和 `makeAutoScroll`，或者什么都不用。
6. 删除 v2 时代的变通写法：可拖拽元素上的 `tabindex` 和 `aria-grabbed`、整个项上的 `touch-action: none`、行外面的 `<TransitionGroup>`、预览组件外面的 `markRaw`。

## 新旧对照

表格中的**无对应项**表示 v3 中没有这个名称的东西；单元格里写明了改用什么。

### 一览

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
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
      <code>
        DnDProvider
      </code>
      
      ，带有新的 props 和一个 <code>
        #overlay
      </code>
      
       插槽。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      自由拖拽用 <code>
        makeDraggable
      </code>
      
      ；列表的行用 <code>
        makeSortableItem
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      普通放置目标用 <code>
        makeDroppable
      </code>
      
      ；列表和树用 <code>
        makeSortableList
      </code>
      
       或 <code>
        makeSortableTree
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      不需要：自动滚动是自动的。用 <code>
        makeDragArea
      </code>
      
       或列表的 <code>
        autoScroll
      </code>
      
       调整它。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      状态用 <code>
        useDnD
      </code>
      
      ，事件用 <code>
        useDnDMonitor
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
       和 <code>
        provideDnDContext(app, context)
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      ：现在是单个被拖拽项的克隆，用于你自己的浮层。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      、<code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid
      </code>
      
       修饰器。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      、<code>
        suggestSwap
      </code>
      
      、<code>
        suggestCopy
      </code>
      
      、<code>
        suggestRemove
      </code>
    </td>
    
    <td>
      内置在列表中：见<a href="#sorting">
        排序
      </a>
      
      。
    </td>
  </tr>
</tbody>
</table>

### Provider

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      ，不设置就关闭
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      ：<strong>
        默认开启
      </strong>
      
      ，作用于窗口和每个滚动容器。<code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       或 <code>
        false
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      ，默认渲染在 provider 内部
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      ：选择器或元素，默认为 <code>
        'body'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #preview="{ preview }"
      </code>
      
       插槽
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       插槽，拖拽信息作为 props：<code>
        items
      </code>
      
      、<code>
        active
      </code>
      
      、<code>
        over
      </code>
      
      、<code>
        accepted
      </code>
      
      、<code>
        status
      </code>
      
      、<code>
        mode
      </code>
      
      、<code>
        to
      </code>
      
      。见<a href="#the-overlay">
        浮层
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      、<code>
        forDrop
      </code>
      
      、<code>
        forCancel
      </code>
      
      （在 <code>
        useDnDProvider()
      </code>
      
       上设置）
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      ：默认 25 px，用于自由拖拽。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      、<code>
        forMoveFaster
      </code>
      
      、<code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。方向键负责移动；:kbd{value="Shift"} 让自由拖拽的步长变为四倍。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。<code>
        collision
      </code>
      
       决定如何找到目标：<code>
        pointerFirst
      </code>
      
      （默认）、<code>
        pointerWithin
      </code>
      
      、<code>
        rectIntersection
      </code>
      
      、<code>
        closestCenter
      </code>
      
      、<code>
        closestCorners
      </code>
      
      ，或你自己的函数。
    </td>
  </tr>
  
  <tr>
    <td>
      每页一个 provider，从不嵌套
    </td>
    
    <td>
      可以嵌套：最近的 provider 掌管一个项。整个应用一个 provider 仍然是目标。
    </td>
  </tr>
</tbody>
</table>

在 v2 中没有对应项的新 props：`activation`、`modifiers`、`sensors`、`animation`、`dropAnimation`、`animateChanges`、`haptics`、`copyModifier`、`overlayFit`、`overlayClass`、`overlayTransition`、`overlayPreviews`、`announcements`、`screenReaderInstructions` 和 `defaultStyles`。provider 还会触发 `drag-start`、`drag-move`、`drag-over`、`drag-end`、`drag-cancel`、`drag-resume` 和 `drag-settle`。它们全都在 [provider 指南](https://zizigy.github.io/docs/guides/provider)中。

### 读取状态：`useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      ：<code>
        'dragging'
      </code>
      
      、<code>
        'activating'
      </code>
      
      、<code>
        'selecting'
      </code>
      
      、<code>
        'pending'
      </code>
      
       或 <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      ：<code>
        'idle'
      </code>
      
      、<code>
        'activating'
      </code>
      
      、<code>
        'dragging'
      </code>
      
      、<code>
        'dropping'
      </code>
      
       或 <code>
        'selecting'
      </code>
      
      。<code>
        'pending'
      </code>
      
      （异步放置）对应 <code>
        'dropping'
      </code>
      
      ；<code>
        null
      </code>
      
       对应 <code>
        'idle'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      ，经过修饰器之后的值。每个事件还有 <code>
        delta
      </code>
      
      ，即相对起点的偏移。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      ：<code>
        id
      </code>
      
      、<code>
        ids
      </code>
      
      、<code>
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
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      （元素）
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      （id）：<code>
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
      
      、<code>
        ids
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      、<code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      ：<code>
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
      
      、<code>
        accepted
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay.progress
      </code>
      
      、<code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      ，从 <code>
        0
      </code>
      
       到 <code>
        1
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      、<code>
        preview.size
      </code>
      
      、<code>
        preview.render
      </code>
      
      、<code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。库负责浮层的位置和尺寸。使用 <code>
        overlayTo
      </code>
      
      、<code>
        #overlay
      </code>
      
       插槽或浮层组件。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      、<code>
        droppableMap
      </code>
      
      、各个 <code>
        visible…Set
      </code>
      
      、<code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新增：<code>
        useDnD().cancel()
      </code>
      
      、<code>
        position
      </code>
      
      、<code>
        isAutoScrolling
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

事件移到了 `useDnDMonitor`：见[事件与放置决定](#events-and-drop-decisions)。完整结构见 [useDnD API](https://zizigy.github.io/docs/api/use-dnd)。

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      ：没有第三个参数。列表的行使用 <code>
        makeSortableItem(ref, { item })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      ，虚拟列表中需要
    </td>
    
    <td>
      <code>
        id
      </code>
      
      ：从你的数据中以 getter 传入。默认值来自 <code>
        useId()
      </code>
      
      ，每个组件实例都不同。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      ：值、ref 或 getter。通过 <code>
        active.data
      </code>
      
       和 <code>
        active.items[i].data
      </code>
      
       读回。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      ，由目标的 <code>
        accept
      </code>
      
       匹配。见<a href="#groups">
        分组
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      ：选择器或元素 ref。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      ：每次按下时的检查。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      按指针类型设置的 <code>
        activation
      </code>
      
      ：<code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      。同时设置 <code>
        distance
      </code>
      
       和 <code>
        delay
      </code>
      
       时，哪个先满足就从哪个开始拖拽。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。每种指针类型一个 <code>
        distance
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      ：组件以 props 的形式获得拖拽信息。见<a href="#the-overlay">
        浮层
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。可排序项上的放置目标以它的中间部分（25% 到 75%）计算；树用 <code>
        nesting: 'hover'
      </code>
      
       嵌套。见<a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        放进可排序项
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      、<code>
        onSelfDragMove
      </code>
      
      、<code>
        onSelfDragEnd
      </code>
      
      、<code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      可拖拽元素上<strong>
        无对应项
      </strong>
      
      ：使用 <code>
        useDnDMonitor
      </code>
      
       或 <code>
        watch(isDragging)
      </code>
      
      。见<a href="#events-and-drop-decisions">
        事件
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      、<code>
        onLeave
      </code>
      
      ，以及经过它上方的拖拽的 <code>
        onDragStart
      </code>
      
      …
    </td>
    
    <td>
      在同一个元素上用 <code>
        makeDroppable
      </code>
      
      ：<code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      返回 <code>
        isDragging
      </code>
      
      、<code>
        selected
      </code>
    </td>
    
    <td>
      相同。
    </td>
  </tr>
  
  <tr>
    <td>
      返回 <code>
        isDragOver
      </code>
    </td>
    
    <td>
      可排序项返回 <code>
        indicator
      </code>
      
      （配合 <code>
        placeholder: 'indicator'
      </code>
      
      ）和 <code>
        isPlaceholder
      </code>
      
      ；放置目标返回 <code>
        placement
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      返回 <code>
        isAllowed
      </code>
    </td>
    
    <td>
      可拖拽元素上<strong>
        无对应项
      </strong>
      
      。放置目标返回 <code>
        isAccepting
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新增：<code>
        label
      </code>
      
      、<code>
        axis
      </code>
      
      、<code>
        modifiers
      </code>
      
      、<code>
        keyboardMode
      </code>
      
      、<code>
        overlay: false
      </code>
      
       配合返回的 <code>
        transform
      </code>
      
      、<code>
        dropAnimation
      </code>
      
      、<code>
        attributes
      </code>
      
      、<code>
        native
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      。承载列表的区域就是一个 <code>
        makeSortableList
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      ：<code>
        '*'
      </code>
      
      、一个类型、类型列表或函数。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      、<code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      、<code>
        'some'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      、<code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      ：独立的选项，没有 <code>
        events
      </code>
      
       对象。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
      ，可以返回 <code>
        false
      </code>
      
       或 promise
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       做决定，<code>
        onDrop
      </code>
      
       负责应用。见<a href="#events-and-drop-decisions">
        放置决定
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      ，返回要保留的 id。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      ，通过 <code>
        over.data
      </code>
      
       读回。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      返回 <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      返回 <code>
        isDragOver
      </code>
      
      ：<code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      （布尔值），以及 <code>
        placement
      </code>
      
      ：<code>
        { top, right, bottom, left }
      </code>
      
      ，即指针所在的各个半边。没有 <code>
        center
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新增：<code>
        id
      </code>
      
      、<code>
        label
      </code>
      
      、<code>
        priority
      </code>
      
      、<code>
        overOverlay
      </code>
      
      、<code>
        overDropAnimation
      </code>
      
      、<code>
        external
      </code>
      
      （来自电脑的文件）。
    </td>
  </tr>
</tbody>
</table>

### 放置事件

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        IDragEvent
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      ：每一项都是 <code>
        { id, item, data, label, type }
      </code>
      
      ，抓起的项在最前。列表还会得到 <code>
        e.items
      </code>
      
       和 <code>
        e.keys
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      、<code>
        .items
      </code>
    </td>
    
    <td>
      列表：<code>
        e.from
      </code>
      
      ，<code>
        { list, index }
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      ：<code>
        items
      </code>
      
      、<code>
        placement
      </code>
      
      、<code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      ：<code>
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
      
      、<code>
        accepted
      </code>
      
      。列表：<code>
        e.to
      </code>
      
      ，<code>
        { list, index }
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      ：列表会自己算出 <code>
        e.to.index
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      列表负责写入放置结果；<code>
        e.result
      </code>
      
       包含它改变的每个列表的新数组。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      在列表上设置 <code>
        behavior: 'swap'
      </code>
      
      ；<code>
        e.partner
      </code>
      
       是与之交换的项。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       或复制键（:kbd{value="Alt"}），配合列表的 <code>
        clone
      </code>
      
      ；<code>
        e.mode
      </code>
      
       为 <code>
        'copy'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      在放置目标中调用 <code>
        e.source.remove()
      </code>
      
      ，或使用列表的 <code>
        dropOutside: 'remove'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      、<code>
        removeAt
      </code>
      
      、<code>
        removeIndexes
      </code>
      
      、<code>
        swapAt
      </code>
      
      、<code>
        getInsertSide
      </code>
      
      、<code>
        isAtZoneStart
      </code>
      
      、<code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。列表不需要它们；对普通放置目标，按你的需要修改数据。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新增：<code>
        e.pointer
      </code>
      
      、<code>
        e.delta
      </code>
      
      、<code>
        e.position
      </code>
      
      （放到画板上的项该放在哪里）、<code>
        e.mode
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

### 排序

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      一个带 <code>
        () => items
      </code>
      
       的 <code>
        makeDroppable
      </code>
      
       列表
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      一个带 <code>
        () => [index, items]
      </code>
      
       的 <code>
        makeDraggable
      </code>
      
       行
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      渲染你的数组
    </td>
    
    <td>
      渲染返回的 <code>
        items
      </code>
      
      ：拖拽时重新排序的草稿。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      、<code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
      （默认）、<code>
        'horizontal'
      </code>
      
       或 <code>
        'grid'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      用引用比较找出源数组和目标数组，再赋值 <code>
        sourceItems
      </code>
      
       和 <code>
        targetItems
      </code>
    </td>
    
    <td>
      不需要：放置会写入它改变的每个列表。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      内置。<code>
        animateChanges: true
      </code>
      
       为不经拖拽的变化（添加、删除、打乱）添加动画。
    </td>
  </tr>
  
  <tr>
    <td>
      根据 <code>
        isDragOver.top
      </code>
      
      、<code>
        .bottom
      </code>
      
       画插入线
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
       和项的 <code>
        indicator.side
      </code>
      
      。见<a href="/docs/guides/sortable-lists#an-insertion-line">
        插入线
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      只复制的面板（<code>
        suggestCopy()
      </code>
      
       加一个 <code>
        copyOnly
      </code>
      
       标志）
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      、<code>
        sort: false
      </code>
      
       和 <code>
        clone
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      用 <code>
        suggestRemove()
      </code>
      
       的回收区
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
      ，或 <code>
        dropOutside: 'remove'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia 或不可变数据：自己赋值结果
    </td>
    
    <td>
      把 <code>
        items
      </code>
      
       写成 getter，然后在 <code>
        onDrop
      </code>
      
       中调用 <code>
        e.preventDefault()
      </code>
      
       并应用 <code>
        e.result
      </code>
      
      。见<a href="/docs/guides/shared-lists#controlled-lists">
        受控列表
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      递归树：每个文件夹一个 droppable，再加 <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      ：一个容器，行带着各自的深度扁平渲染。见<a href="/docs/guides/trees">
        树
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      用 <code>
        v-model
      </code>
      
       的嵌套分组（每个分组一个 droppable）
    </td>
    
    <td>
      列表套列表，全部在同一个 <code>
        group
      </code>
      
       中，每个都用 <code>
        items: defineModel()
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      虚拟列表：每个可拖拽元素都要 <code>
        id
      </code>
    </td>
    
    <td>
      把草稿交给虚拟化器，在行上设置 <code>
        id: () => props.item.id
      </code>
      
      。见<a href="/docs/guides/virtual-lists">
        虚拟列表
      </a>
      
      。
    </td>
  </tr>
</tbody>
</table>

前后代码见[下文](#a-sortable-list)。关于列表的一切都在[可排序列表](https://zizigy.github.io/docs/guides/sortable-lists)和[共享项的列表](https://zizigy.github.io/docs/guides/shared-lists)中。

### 分组

v2 用一个 `groups` 选项处理所有情况。v3 把它拆成两个：

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      放置区上的 <code>
        groups: ['dev', 'ops']
      </code>
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
      ，或一个函数：<code>
        ({ active, items, types }) => boolean
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
      ，或不设置
    </td>
    
    <td>
      省略 <code>
        type
      </code>
      
       或 <code>
        accept
      </code>
      
      。v2 的规则仍然成立：没有类型的可拖拽元素符合任何规则，没有 <code>
        accept
      </code>
      
       的放置目标接受一切。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      、<code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      、<code>
        'some'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      列表放置区及其行上的 <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList
      </code>
      
       上的 <code>
        group: 'board'
      </code>
      
      。<code>
        group: { name, pull, put }
      </code>
      
       说明什么可以离开、什么可以进入。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
       上的 <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

没有 `group` 的列表自成一组，不与任何其他列表交换项。在 v2 中，没有 groups 的放置区接受一切。见[目标接收哪些拖拽](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes)。

### 浮层

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      在 provider 中渲染、通过 <code>
        previewTo
      </code>
      
       传送的预览
    </td>
    
    <td>
      总是被传送，到 <code>
        body
      </code>
      
       或 <code>
        overlayTo
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      一个克隆：相同的标签、它的 <code>
        innerHTML
      </code>
      
       和尺寸
    </td>
    
    <td>
      深度克隆：表单的值、<code>
        <canvas>
      </code>
      
       的像素、继承的样式和表格单元格都会带上。用 <code>
        data-dnd-no-clone
      </code>
      
       标记不需要带上的部分。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
      
      ，读取 <code>
        useDnDProvider().entities
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      ，以 props 的形式获得 <code>
        items
      </code>
      
      、<code>
        active
      </code>
      
      、<code>
        over
      </code>
      
      、<code>
        accepted
      </code>
      
      、<code>
        status
      </code>
      
      、<code>
        mode
      </code>
      
       和 <code>
        to
      </code>
      
      。不需要 <code>
        markRaw
      </code>
      
      ；切换它时用 <code>
        shallowRef
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #preview
      </code>
      
       插槽，根据 <code>
        preview.position
      </code>
      
       定位
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       插槽：库负责盒子的位置和尺寸。什么都不渲染时退回到克隆。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       插槽，或作为 <code>
        overlay
      </code>
      
       传入的 <code>
        shallowRef
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      在放置区上方换一种外观，通过 <code>
        onEnter
      </code>
      
       和 <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       或列表上的 <code>
        overOverlay
      </code>
      
      ，或在浮层组件中读取 <code>
        over
      </code>
      
      。见<a href="/docs/guides/overlay#targets-that-change-the-overlay">
        改变浮层的目标
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      浮层 props 中的 <code>
        items
      </code>
      
      ；<code>
        <DragPreview :id="item.id" />
      </code>
      
       渲染一个克隆。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      、<code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid
      </code>
      
       修饰器。它吸附的不只是画面，还有查找目标的位置和放置的 <code>
        position
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
      
       外面的 <code>
        <Transition>
      </code>
      
       或 motion 的 <code>
        AnimatePresence
      </code>
    </td>
    
    <td>
      拿起用 <code>
        overlay-class
      </code>
      
       配合 <code>
        @starting-style
      </code>
      
      ，落位用 <code>
        dropAnimation
      </code>
      
      ，组件之间用 <code>
        overlayTransition
      </code>
      
      。见<a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        抬起、倾斜、落定
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      盒子上的 <code>
        [data-dnd-overlay]
      </code>
      
      （<code>
        "dragging"
      </code>
      
      、<code>
        "dropping"
      </code>
      
      ），它内部的 <code>
        [data-dnd-overlay-content]
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.size
      </code>
      
      ，需要手动更新
    </td>
    
    <td>
      盒子取它将落入的位置的尺寸（<code>
        overlayFit
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      预览在放置时消失
    </td>
    
    <td>
      它落到自己的位置上，或在取消时飞回原处。
    </td>
  </tr>
</tbody>
</table>

更多内容见[浮层指南](https://zizigy.github.io/docs/guides/overlay)。

### 选择与多项拖拽

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        selected
      </code>
      
      ，由 <code>
        makeDraggable
      </code>
      
       返回
    </td>
    
    <td>
      <code>
        selected
      </code>
      
      ，由 <code>
        makeDraggable
      </code>
      
       和 <code>
        makeSortableItem
      </code>
      
       返回。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      ，元素的集合
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      ，以 id 为键。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      ：默认需要按住 Ctrl（<code>
        ControlLeft
      </code>
      
      ）
    </td>
    
    <td>
      默认不需要按键：在区域的空白处按下就会画出选框。<code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       可以恢复 Ctrl。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier.keys
      </code>
      
       使用 <code>
        KeyboardEvent.code
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
      （<code>
        'Control'
      </code>
      
      、<code>
        'Shift'
      </code>
      
      ）或 <code>
        .code
      </code>
      
      （<code>
        'ControlLeft'
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      、<code>
        'select'
      </code>
    </td>
    
    <td>
      相同。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      相同。
    </td>
  </tr>
  
  <tr>
    <td>
      用 <code>
        suggestSort()
      </code>
      
       批量移动选中集合
    </td>
    
    <td>
      由列表移动它。<code>
        multiple: 'group'
      </code>
      
      （默认）、<code>
        'gaps'
      </code>
      
       或 <code>
        'stack'
      </code>
      
       决定其余项在途中如何表现。
    </td>
  </tr>
  
  <tr>
    <td>
      混合选中时用 <code>
        onValidate
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       加上返回 id 的 <code>
        onBeforeDrop
      </code>
      
      。见<a href="/docs/guides/multi-drag#taking-only-some">
        只接受一部分
      </a>
      
      。
    </td>
  </tr>
</tbody>
</table>

更多内容见[多项拖拽与选择](https://zizigy.github.io/docs/guides/multi-drag)。

### 轴、边界与吸附

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      ，作用于在它内部开始的拖拽。<code>
        axis
      </code>
      
       也可用于可拖拽元素、列表、树或项。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      省略 <code>
        axis
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
      ，或修饰器 <code>
        restrictToParent
      </code>
      
       和 <code>
        restrictToElement(el)
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      每个区域一个 provider，以隔开规则
    </td>
    
    <td>
      一个 provider，每个区域一个 <code>
        makeDragArea
      </code>
      
      。区域里的项仍然可以移动到任何地方。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      、<code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       或 <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      ，放在 provider、区域、列表或可拖拽元素的 <code>
        modifiers
      </code>
      
       中。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新增：<code>
        restrictToWindowEdges
      </code>
      
      、<code>
        restrictToFirstScrollableAncestor
      </code>
      
      、<code>
        snapCenterToCursor
      </code>
      
      ，以及你自己的修饰器。
    </td>
  </tr>
</tbody>
</table>

更多内容见[轴、边界与网格](https://zizigy.github.io/docs/guides/constraints)。

### 自动滚动

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      ，默认关闭
    </td>
    
    <td>
      默认开启，作用于窗口和每个滚动容器。<code>
        :auto-scroll="false"
      </code>
      
       关闭它。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      不需要：任何 <code>
        overflow: auto
      </code>
      
       或 <code>
        scroll
      </code>
      
       的元素都会滚动。要调整某一个：<code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       或列表的 <code>
        autoScroll
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        threshold
      </code>
      
      ，单位 px，或按边设置
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      ：容器尺寸的比例（<code>
        0.2
      </code>
      
      ），介于 24 到 96 px 之间。按边设置的阈值<strong>
        无对应项
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
      
      ，一个倍数
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
      （每帧 25 px）和 <code>
        acceleration
      </code>
      
      （10）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        isAutoScrolling
      </code>
      
      ，来自 <code>
        makeDragArea
      </code>
      
       或 <code>
        useDnD()
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

### 键盘与无障碍

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      每个可拖拽元素上的 <code>
        tabindex="0"
      </code>
    </td>
    
    <td>
      自动设置，同时设置 <code>
        role
      </code>
      
      、<code>
        aria-roledescription
      </code>
      
      、<code>
        aria-describedby
      </code>
      
      、<code>
        aria-disabled
      </code>
      
       和 <code>
        aria-pressed
      </code>
      
      。你自己的属性优先。
    </td>
  </tr>
  
  <tr>
    <td>
      手动写 <code>
        :aria-grabbed="isDragging"
      </code>
    </td>
    
    <td>
      删掉它：<code>
        aria-pressed
      </code>
      
       会跟随拖拽。
    </td>
  </tr>
  
  <tr>
    <td>
      在 <code>
        useDnDProvider().keyboard.keys
      </code>
      
       上设置按键
    </td>
    
    <td>
      provider 的 <code>
        keyboard
      </code>
      
       prop。绑定匹配 <code>
        event.code
      </code>
      
       或 <code>
        event.key
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      方向键按 <code>
        keyboard.step
      </code>
      
       移动预览
    </td>
    
    <td>
      自由拖拽：每次 <code>
        keyboard.step
      </code>
      
       px。列表：按位置移动，并能移进分组中的下一个列表。<code>
        keyboardMode: 'droppables'
      </code>
      
       在放置目标之间跳转。
    </td>
  </tr>
  
  <tr>
    <td>
      重新绑定方向键（<code>
        forMove
      </code>
      
      、<code>
        forMoveFaster
      </code>
      
      ）
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      没有播报
    </td>
    
    <td>
      实时区域播报每一次拿起、移动、放置和取消。<code>
        label
      </code>
      
       为事物命名；<code>
        announcements
      </code>
      
       和 <code>
        screenReaderInstructions
      </code>
      
       改写措辞。
    </td>
  </tr>
</tbody>
</table>

更多内容见[无障碍](https://zizigy.github.io/docs/guides/accessibility)。

### 事件与放置决定

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      可拖拽元素的 <code>
        events.onSelfDragStart
      </code>
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      ，检查 <code>
        active.ids
      </code>
      
      。如果只是为了加类名，<code>
        isDragging
      </code>
      
       就够了。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      监听器的 <code>
        onDragMove
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      ，放置或取消时
    </td>
    
    <td>
      监听器的 <code>
        onDragEnd
      </code>
      
      （放置）和 <code>
        onDragCancel
      </code>
      
      。<code>
        onDragSettle
      </code>
      
       两者都能收到，在浮层落位之后。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      监听器的 <code>
        onDragCancel
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      可拖拽元素的 <code>
        onHover
      </code>
      
      、<code>
        onLeave
      </code>
      
      ，以及经过它上方的拖拽的 <code>
        onDragStart
      </code>
      
      …
    </td>
    
    <td>
      在该元素上用 <code>
        makeDroppable
      </code>
      
      ：<code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      。列表的行什么都不需要。
    </td>
  </tr>
  
  <tr>
    <td>
      droppable 的 <code>
        events.onEnter
      </code>
      
      、<code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      droppable 的 <code>
        events.onDrop
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       做决定，然后 <code>
        onDrop
      </code>
      
       负责应用。<code>
        onDrop
      </code>
      
       是同步的，它的返回值会被忽略。
    </td>
  </tr>
  
  <tr>
    <td>
      droppable 的 <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      ，配合 <code>
        acceptMode: 'some'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新增：provider 的 <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
      ，以及监听器的 <code>
        onDragOver
      </code>
      
      、<code>
        onBeforeDrop
      </code>
      
       和 <code>
        onDragResume
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

v2 的 `onDrop` 可以返回一个值或一个值的 promise 来决定放置。在 v3 中，这是 `onBeforeDrop` 的工作，可用于列表、树、放置目标和监听器：

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        onDrop
      </code>
      
       返回
    </th>
    
    <th>
      v3 <code>
        onBeforeDrop
      </code>
      
       返回
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      什么都不返回，或 <code>
        true
      </code>
      
      ：放置生效
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      、<code>
        true
      </code>
      
       或什么都不返回。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      ：这次放置被拒，拖拽保持进行
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      。<strong>
        现在 <code>
          false
        </code>
        
         会拒绝放置
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      被拒绝的 promise 或抛出异常：拖拽被取消
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       或 <code>
        false
      </code>
      
      。抛出异常也会拒绝。
    </td>
  </tr>
  
  <tr>
    <td>
      一个 promise；期间 <code>
        state
      </code>
      
       为 <code>
        'pending'
      </code>
    </td>
    
    <td>
      一个 promise；期间 <code>
        status
      </code>
      
       为 <code>
        'dropping'
      </code>
      
      ，浮层带着 <code>
        data-dnd-overlay="dropping"
      </code>
      
       等待。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       返回 <code>
        IDragItem[]
      </code>
    </td>
    
    <td>
      一个 id 数组：只有这些项会放置，其他的飞回原处。
    </td>
  </tr>
</tbody>
</table>

监听器先回答，然后是目标。接着目标的 `onDrop` 运行，列表写入它的新数组，随后是 `onDragEnd`。更多内容见[决定放置](https://zizigy.github.io/docs/guides/drop-decisions)和[事件 API](https://zizigy.github.io/docs/api/events)。

### 类型

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      （放置目标、监听器）、<code>
        SortableDropEvent
      </code>
      
      （列表）、<code>
        DnDEndEvent
      </code>
      
      （<code>
        onDragEnd
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        无对应项
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      、<code>
        ISuggestSwapResult
      </code>
      
      、<code>
        ISuggestCopyResult
      </code>
      
      、<code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      ：<code>
        result
      </code>
      
      、<code>
        to
      </code>
      
      、<code>
        mode
      </code>
      
      、<code>
        partner
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      ，在 <code>
        onBeforeDrop
      </code>
      
       中。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        Placement
      </code>
      
      ，没有 <code>
        center
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
      ，即 <code>
        useDnD()
      </code>
      
       的返回值。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      、<code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      <code>
        DraggableOptions
      </code>
      
      、<code>
        DroppableOptions
      </code>
      
       和 <code>
        DnDMonitor
      </code>
      
       中的回调。
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@^3 @vue-dnd-kit/core@^3
```

<table>
<thead>
  <tr>
    <th>
      v2（<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x）
    </th>
    
    <th>
      v3（<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.x）
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      自动导入 <code>
        makeDraggable
      </code>
      
      、<code>
        makeDroppable
      </code>
      
      、<code>
        makeSelectionArea
      </code>
      
      、<code>
        makeConstraintArea
      </code>
      
      、<code>
        makeAutoScroll
      </code>
      
      、<code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      自动导入 <code>
        makeDraggable
      </code>
      
      、<code>
        makeDroppable
      </code>
      
      、<code>
        makeSortableList
      </code>
      
      、<code>
        makeSortableItem
      </code>
      
      、<code>
        makeSortableTree
      </code>
      
      、<code>
        makeSelectionArea
      </code>
      
      、<code>
        makeDragArea
      </code>
      
      、<code>
        useDnD
      </code>
      
      、<code>
        useDnDMonitor
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      不自动导入类型
    </td>
    
    <td>
      主要类型会自动导入（<code>
        DnDEvent
      </code>
      
      、<code>
        SortableDropEvent
      </code>
      
      、<code>
        OverlayProps
      </code>
      
      …）。通用类型（<code>
        Key
      </code>
      
      、<code>
        Active
      </code>
      
      、<code>
        Over
      </code>
      
      ）需手动导入。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      修饰器、碰撞检测函数和传感器按需开启：<code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
       和 <code>
        DragPreview
      </code>
      
       全局注册
    </td>
    
    <td>
      相同，并多了一个 <code>
        prefix
      </code>
      
       选项。
    </td>
  </tr>
  
  <tr>
    <td>
      布局中、provider 内部的 <code>
        <DragPreview />
      </code>
    </td>
    
    <td>
      删掉它：浮层由 provider 渲染。<code>
        DragPreview
      </code>
      
       接收一个 <code>
        id
      </code>
      
      ，应放在浮层组件内部。
    </td>
  </tr>
  
  <tr>
    <td>
      peer 依赖 <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      peer 依赖 <code>
        @vue-dnd-kit/core
      </code>
      
       3；Nuxt 4。
    </td>
  </tr>
</tbody>
</table>

`nuxt.config.ts` 中的 `modules: ['@vue-dnd-kit/nuxt']` 保持不变。见[安装](https://zizigy.github.io/docs/getting-started/installation#nuxt)。

## 前后对比

### 一个可拖拽元素和一个放置区

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- 卡片会自动获得 `tabindex`、`role` 和 `aria-*` 属性。`<button>` 手柄可以获得焦点，键盘拖拽从它开始。
- `groups` 在可拖拽元素上变成了 `type`，在放置目标上变成了 `accept`。回调离开了 `events` 对象。
- 有 `isOver` 而没有 `isAccepting`，说明这个目标拒绝这次拖拽：在那里放置会飞回原处。

### 一个可排序列表

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- 渲染 `items`，也就是草稿：它在拖拽时重新排序。放置时 `tasks` 得到新的顺序，`defineModel` 触发 `update:modelValue`。
- 没有索引、没有载荷、没有 `onDrop`、没有 `<TransitionGroup>`：行会自己滑动。
- 被拖拽的行作为它将落入的位置留在列表中。用 `isPlaceholder` 或 `[data-dnd-placeholder]` 给它加样式，而不是把它隐藏。

### 共享项的列表

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

放置会写入两个数组：任务离开的那个和它进入的那个。`TaskItem.vue` 就是上面可排序列表中的那个。分发副本的面板过去靠 `suggestCopy()` 和一个 `copyOnly` 标志；现在它就是一个列表：

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

对于 Pinia store 或其他你不直接写入的状态，把 `items` 写成 getter，在 `onDrop` 中调用 `e.preventDefault()` 并应用 `e.result`：见[受控列表](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists)。

### 自定义浮层

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- 组件以 props 的形式获得拖拽信息：`items`（每一个被拖拽的项，抓起的项在最前）、`over`、`accepted`、`status`、`mode` 和 `to`。只声明你要读取的那些。对于列表的行，列表项是 `items[0].item`。
- 原样传入它。用 `shallowRef` 切换它，绝不要用深层 `ref`。

provider 的插槽也以同样的方式改变，你的组件不再需要自己定位：

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

把 `DragPreview` 包在 `<Transition>` 中实现的弹出效果，改为 `overlay-class` 配合 `@starting-style`：见[抬起、倾斜、落定](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)。

### 需要确认的放置

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

列表也用同样的方式询问，而 promise 让你可以打开自己的对话框。在 promise 完成之前，浮层停在松开的地方等待：

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

一个只接收混合选中集合中匹配部分的放置区（`groupMatch: 'some'`）：

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

列表不用写代码就能做到这一点：设置 `acceptMode: 'some'` 后，它们的 `group.put` 接受的项会落位，其他的飞回原处。

## 升级时的坑

- **用版本范围安装 v3**。在 `package.json` 中写 `^3`：`npm update` 会让 `^2` 停留在 v2。
- **渲染草稿**。列表渲染 `makeSortableList` 返回的 `items`，而不是你的数组。如果渲染你的数组，在放置之前什么都不会动。
- **不要排序两次**。删掉列表中的 `suggestSort` 代码：列表会在它的 `onDrop` 之后把每次放置写进可写的 `items` ref。要自己应用，就调用 `e.preventDefault()` 并使用 `e.result`。
- **false 会拒绝放置**。在 v2 中，resolve 为 `false` 的 `onDrop` 会让拖拽继续。在 v3 中，从 `onBeforeDrop` 返回 `'continue'`。从 `onDrop` 返回的 promise 会被忽略。
- **列表只在同一个 group 内共享**。没有 `group` 的列表不与任何其他列表交换项。
- **用 id 作为行的 key**。`:key="index"` 会让错误的行产生动画。也要从你的数据中传入 id：默认 id 对每个组件实例都不同。
- **不要用 <TransitionGroup>，也不要在 transform 上加 transition**。库会自己移动行，否则移动会被动画两次。
- **撤掉触摸的变通写法**。整个项上的 `touch-action: none` 会让页面无法在手指下滚动；v3 改为通过长按开始触摸拖拽。在需要立即拖动的手柄上保留它，并配合 `activation: { touch: { distance: 4 } }`。
- **移除过时的属性**。库会设置 `tabindex`、`role` 和它需要的 `aria-*`，并且从不覆盖你的属性，所以遗留的 `role` 或 `aria-grabbed` 会保持你留下的样子。
- **重新设置浮层样式**。`.dnd-kit-preview` 已经没有了：给 `[data-dnd-overlay='dragging']` 内部的内容加样式，绝不要碰盒子的 `transform`。给浮层组件的根元素设置 `width: 100%; height: 100%`，并把 `<DragPreview />` 从你的布局中移除。
- **自动滚动是开启的**。在 v2 从不滚动的地方传入 `:auto-scroll="false"`。
- **选框不需要按键**。`makeSelectionArea` 在它的空白处普通按下就会开始画框。添加一个 `modifier` 可以保留 v2 的 Ctrl。
- **一个 provider，区域放在里面**。项不能跨越 provider。过去用每个区域一个 provider 来隔开规则的页面，需要改为一个 provider 加每个区域一个 `makeDragArea`。
- **两个参数**。`makeDraggable` 和 `makeDroppable` 接收一个 ref 和一个选项对象，没有载荷。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
