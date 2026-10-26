# 术语表：简体中文（zh）

## 语气与排版

- 称呼读者用“你”，与 Vue 中文文档一致。指令用祈使句：“传入……”“渲染……”“包裹……”。
- 句子简短直接，与英文一致。不增不减，不“改进”原意。
- 中文与英文、数字、行内代码之间加一个半角空格：`在 DnDProvider 中`、`` 返回 `items` ``、`200 ms`。
  全角标点与英文之间不加空格：`` 传入 `id`，然后…… ``。
- 中文语境用全角标点：，。：；！？（）、；引号用“”。括号里全是英文或代码时也用全角括号。
- 段落和列表项不折行（中文里换行会渲染成空格）。
- 加粗内容的首尾不放标点；加粗的代码两侧留空格：``用 **`data-dnd-no-clone`** 标记``。
- 代码、API 名、选项、事件、文件和包名保持原样，用 `code`。
- frontmatter 的值不以反引号开头，不用半角 `: `。

## 术语

| English | 中文 | 说明 |
| --- | --- | --- |
| drag and drop | 拖放 | 标题与总称 |
| a drag（一次操作） | 拖拽 | “拖拽开始时”“当前拖拽” |
| to drag | 拖拽、拖动 | |
| drop（名词） | 放置 | “放置时”“放置被拒绝” |
| to drop / to let go, release | 放下 / 松开 | |
| drop target | 放置目标 | 列表、树、放置区都是放置目标 |
| drop zone, droppable | 放置区 | API 为 `makeDroppable` |
| draggable（名词） | 可拖拽元素；`draggable` | “普通的可拖拽元素” |
| item | 项 | 数据项、列表项；DOM 元素用“元素” |
| element | 元素 | DOM 元素 |
| row / card / tile | 行 / 卡片 / 图块 | |
| overlay | 浮层 | 跟随指针的那个盒子 |
| clone | 克隆 | 默认浮层：被拖拽元素的克隆 |
| placeholder | 占位元素、占位 | `data-dnd-placeholder` |
| slot（项将落入的位置） | 位置、空位 | 不译作“插槽”；“插槽”只指 Vue 插槽（`#overlay` 插槽、默认插槽） |
| to land（浮层） | 落位、落到 | “浮层落到它的位置上” |
| to fly back | 飞回原处 | |
| sortable list / sortable item | 可排序列表 / 可排序项 | |
| to reorder / sorting | 重新排序 / 排序 | |
| draft | 草稿 | 拖拽时渲染的 `items` |
| handle | 拖拽手柄、手柄 | `handle` |
| multi-drag | 多项拖拽 | |
| selection | 选中集合；选择 | provider 的选中 id 集合 |
| rubber band, band | 框选、选框 | |
| grabbed item / active item | 抓起的项 / 当前项 | |
| pickup, to pick up | 拿起 | “拿起时” |
| provider | provider | `DnDProvider` |
| composable | 组合式函数 | 与 Vue 中文文档一致 |
| template ref | 模板引用 | |
| ref / getter / computed | ref / getter / computed | |
| props / prop | props / prop | |
| slot（Vue） | 插槽 | |
| sensor | 传感器 | |
| modifier | 修饰器 | |
| collision detection | 碰撞检测 | `collision` |
| hit-testing | 命中测试 | |
| auto-scroll | 自动滚动 | |
| drag area / selection area | 拖拽区域 / 选择区域 | `makeDragArea` / `makeSelectionArea` |
| tree / node / root / subtree | 树 / 节点 / 根节点 / 子树 | |
| depth / to nest / folder | 深度 / 嵌套 / 文件夹 | |
| parent / children / siblings | 父节点 / 子节点 / 兄弟节点 | |
| collapsed / expanded | 折叠 / 展开 | |
| group | 分组 | “同一分组的列表” |
| copy / palette | 复制 / 面板 | 面板：只往外复制的列表 |
| swap / shift | 交换 / 平移 | |
| accept / refuse, reject | 接受 / 拒绝 | |
| cancel | 取消 | |
| kanban board | 看板 | |
| trash zone / trash can | 回收区 / 垃圾桶 | |
| indicator / insertion line | 指示器 / 插入线 | |
| strategy | 策略 | |
| activation (constraint) | 激活（约束） | |
| long press | 长按 | |
| pointer / mouse / touch / pen | 指针 / 鼠标 / 触摸 / 触控笔 | |
| keyboard drag | 键盘拖拽 | |
| screen reader | 屏幕阅读器 | |
| live region | 实时区域（live region） | |
| announcement | 播报 | `announcements`：给屏幕阅读器的文本 |
| haptics | 触感反馈 | 振动 |
| monitor | 监听器 | `useDnDMonitor` |
| hook | 钩子 | `onBeforeDrop`、`onDrop` |
| controlled list | 受控列表 | |
| the default write | 默认写入 | |
| virtual list / virtualizer | 虚拟列表 / 虚拟化器 | |
| axis / bounds / snap to a grid | 轴 / 边界 / 吸附到网格 | |
| viewport | 视口 | |
| event / callback / handler | 事件 / 回调 / 处理函数 | |
| option | 选项 | |
| store | store | Pinia |
| hydration mismatch | 激活不匹配 | 与 Vue 中文文档一致 |
| development build / production build | 开发构建 / 生产构建 | |
