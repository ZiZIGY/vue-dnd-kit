---
title: "页面构建器"
description: "一个用拖放组装的落地页——来自面板、在页面上方变成真实内容的区块，在列之间移动的元素，基于同一份数据的图层树，行内编辑，设备宽度切换和撤销。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/examples/page-builder"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="45rem" hint="把一个区块或元素拖到页面上；双击文本即可编辑" name="page-builder" title="页面构建器">



</example>

把框架展开到全屏：面板停靠在左侧，图层在右侧，页面占据中间的空间。窗口较窄时，它们共用一个从顶栏打开的抽屉。

## 看点

- **Canvas.vue**：页面是一个由区块组成的可排序列表，使用 `placeholder: 'indicator'`。区块被拖动时页面保持不动，两个区块之间的一条线说明它将去往哪里：每经过一个位置就把 500px 高的区块挪开，会让整个页面晃动。`dropzone` 把放置交给整个画布，所以在页面旁边或下方松开的区块仍然能落位。
- **ColumnList.vue**：每个区块的每一列都是 `blocks` 分组的一个列表。元素可以在列和区块之间移动并实时排序：拖拽时页面就显示出结果。每一列都是一个独立的组件，而这些列是另一个列表的项里面的列表。
- **Palette.vue**：区块模板是页面分组中的一个列表，带有 `pull: 'clone'`、`put: false` 和 `sort: false`：它只往外分发副本，什么都不收回。模板下方的元素（**ElementChip.vue**）是普通可拖拽元素，由列通过 `createItem` 创建块。
- **Layers.vue**：同一个页面，表现为一棵基于同一份数据的可排序树。在这里移动一行，页面上也会移动，反之亦然。
- **builder.ts**：页面、选中集合、设备和历史。放置通过列表写入页面；工具栏按钮和快捷键在这里修改页面。每次改动都是一步撤销。

## 手中的区块就是真实的区块

**SectionGhost.vue** 既是页面区块的浮层，也是面板模板的浮层。在页面上方时（`to.list` 是页面的列表），它以页面的宽度渲染区块本身，并在指针下方缩小。放置一旦确定（`status: 'dropping'`），它会在盒子飞向区块位置的同时缩放回 1：恰好落在那个位置上。放置会等待这个过渡，所以结束时不会有任何跳动。

```vue [SectionGhost.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; status: DnDStatus; to: DropDestination | null }>();
const section = computed(() => props.items[0]!.item as Section);
const fromPalette = computed(() => !find(section.value.id));
const onPage = computed(() => props.to?.list === PAGE);

const look = computed(() => {
  if (fromPalette.value && !onPage.value) return 'card'; // still the palette's card
  return props.status === 'dropping' ? 'landing' : 'ghost';
});
</script>

<template>
  <DragPreview v-if="look === 'card'" :id="items[0]!.id" :style="{ width: '100%', height: '100%' }" />
  <div v-else class="replica" :class="look" :style="{ width: `${pageWidth}px`, '--shrink': shrink }">
    <SectionView :section="section" />
  </div>
</template>

<style scoped>
.replica { transform-origin: 0 0; scale: var(--shrink); transition: scale 0.25s ease; }
.replica.landing { scale: 1; }
</style>
```

离开页面时，模板仍保持它在面板中的样子：`DragPreview` 显示库对它的卡片所做的副本。区块在页面上的位置就是空位：拖拽期间它在那里淡化等待；放下后，它的新位置保持空白，直到浮层落到上面。

```css [PageSection.vue]
.page-section[data-dnd-placeholder] { opacity: 0; }
html[data-dnd-dragging] .page-section[data-dnd-placeholder] { opacity: 0.35; }
```

每个区块根据自己的 `indicator` 画出插入线，并说明放置会做什么：*Move Features here*，对于模板则是 *Add Pricing here*。

## 元素：带上将要进入的区块的配色

块通过整个块体拖动；区块则通过它标签上的抓手拖动，因为区块的主体是可以点击和拖动的内容。**BlockGhost.vue** 是块和小标签的浮层，它从 `to` 读取将要进入的列，并采用该列所在区块的配色：深色页脚上方的按钮在你松开之前就会变浅。盒子取块在那里的位置的尺寸（`overlayFit: 'slot'`，默认值），块在其中的布局与放置后一致。

```ts [BlockGhost.vue]
// The column it would go into (`to.list` is the column's id): its section's tone.
const look = computed(() => {
  const at = props.to && find(String(props.to.list));
  return at ? { ...TONES[SECTIONS[at.section.kind].tone], ...typeScale(pageWidth.value) } : null;
});
```

面板中的小标签是一个携带自身类型的普通可拖拽元素。每一列都会根据它创建一个块，新块位于列中，由列自己的模板渲染，直到你松开或移到别处：

```ts [ColumnList.vue]
makeSortableList(list, {
  id: props.column.id,
  items: blocks,
  group: 'blocks',
  overlay: BlockGhost,
  createItem: (active) => {
    const kind = (active.data as ChipData | undefined)?.kind;
    return kind ? createBlock(BLOCKS[kind].spec) : undefined;
  },
});
```

`blocks` 是基于 `props.column.blocks` 的可写 `computed`，而不是 `toRef`：撤销会把新对象放进页面，列必须跟随它们。

## 模板：只出副本，什么都不进

```ts [Palette.vue]
makeSortableList(list, {
  id: 'templates',
  items: templates,
  group: { name: 'sections', pull: 'clone', put: false },
  sort: false,
  clone: (template) => createSection(template.kind), // new ids all the way down
  overlay: SectionGhost,
});
```

模板是真实的区块，所以它们的卡片会（缩小后）显示区块，浮层也能渲染它们。单击卡片或按 <kbd value="Enter">



</kbd>

，会把区块添加到选中区块之后：完全不拖拽也能搭建页面。

## 图层：同一个页面的树形视图

```ts [Layers.vue]
makeSortableTree(tree, {
  id: LAYERS,
  items: sections as Ref<LayerNode[]>,
  // Keys of their own: the canvas's lists already drag these ids.
  getKey: (node) => `layer-${node.id}`,
  getChildren: (node) => (isSection(node) ? node.columns : isColumn(node) ? node.blocks : undefined),
  setChildren: (node, children) => { … },
  // Blocks go into columns, nothing into blocks, sections stay at the top.
  canNest: (node, parent) => levelOf(node) === levelOf(parent) + 1,
  maxDepth: 2,
  placeholder: 'indicator',
  // A tree takes any row at its top level: a block let go there flies back.
  onBeforeDrop: (event) => (event.to.parentKey !== null || event.items.every(isSection) ? 'accept' : 'reject'),
});
```

key 由整个 provider 共享，所以行有自己的 key。列也是行，并且是 `disabled`：它们接收块，自己留在原处。块不能去的地方（两个区块之间），它的线会变红。悬停在某一行上时，页面上对应的节点会显示轮廓；在页面上选中一个节点，会在这里展开它的区块，并把它的行滚动到视野中。

## 就地编辑和键盘

块可以从任何位置拖动，所以在双击之前，它的文本不可编辑：双击后文本变成 `contenteditable`，`canDrag` 拒绝拖拽，这样按下就会放置光标。**EditableText.vue** 只在文本未被编辑时才根据模型写入 DOM，所以光标从不跳动，撤销的结果也照常显示。

provider 把 <kbd value="Space">



</kbd>

 留给拖拽，把 <kbd value="Enter">



</kbd>

 留给编辑器：

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'], drop: ['Space', 'Enter'], cancel: ['Escape'] } }"
  :announcements="announcements"
  :screen-reader-instructions="instructions"
>
```

用 Tab 移到一个块上：:kbd{value="Space"} 拿起它，方向键在它所在的列中移动它，并移进后面的列；:kbd{value="Enter"} 编辑它。区块以同样的方式通过抓手移动，或通过它工具栏上的箭头移动。:kbd{value="Ctrl"} <kbd value="Z">



</kbd>

 撤销，:kbd{value="Delete"} 删除，:kbd{value="Ctrl"} <kbd value="D">



</kbd>

 复制。屏幕阅读器听到的是“the Hero section, position 3 of 7 on the page”，而不是 id。

## 撤销，以及不经拖拽的改动

每次放置都是历史中的一步：列表写入页面后，一个监听器保存页面。

```ts [Builder.vue]
useDnDMonitor({ onDragEnd: () => builder.commit() });
```

撤销会放回一个快照。列表开启了 `animate`，所以快照移动过的内容会滑到那里，工具栏上下移动的区块也是如此；添加的区块淡入，删除的区块淡出。

延伸阅读：[可排序列表](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line) · [共享项的列表](https://zizigy.github.io/docs/guides/shared-lists) · [树](https://zizigy.github.io/docs/guides/trees) · [浮层](https://zizigy.github.io/docs/guides/overlay) · [动画](https://zizigy.github.io/docs/guides/animations) · [无障碍](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
