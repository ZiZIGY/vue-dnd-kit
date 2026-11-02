---
title: "设计画布"
description: "一个类似 Figma 的编辑器——可缩放画布上的画框和图层、智能参考线、框选、按住 Alt 复制，以及作为设计树的图层面板。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/examples/design-canvas"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="43rem" hint="把一个图层拖进另一个画框；画一个选框，Shift 单击，按住 Alt 放下副本" name="design-canvas" title="设计画布">



</example>

## 看点

- **Shape.vue** 和 **Artboard.vue**：每个图层都是一个普通可拖拽元素，画框通过它的名称拖动（`handle`），里面的图层随之移动。按下会立即选中，就像在 Figma 中一样，所以拖拽带走的是 provider 的选中集合：在多个选中的图层中按住其中一个，它们会一起移动。
- **useLayerDrop.ts**：画布和每个画框都是行为相同的放置目标。在画框上方松开的图层会移进这个画框；在画布上方松开则移出画框。按住 <kbd value="Alt">



</kbd>

 时落下的是副本，图层留在原处。
- **LayersPanel.vue**：这个面板是作用于设计本身的 `makeSortableTree`。行的顺序就是堆叠顺序，把一行放进某个画框，就会把这个图层移进那个画框。
- **Canvas.vue**：智能参考线是演示自己的修饰器；`makeSelectionArea` 画出选框，`makeDragArea` 为每次从画布开始的拖拽提供规则。
- **editor.ts**、**geometry.ts** 和 **design.ts**：设计、它的历史、视图，以及吸附和对齐的计算，其中没有任何拖放代码。

## 按缩放比例绘制

画布的缩放不使用 CSS `scale()`：每个图层都以它的尺寸乘以缩放比例、以屏幕像素进行布局。于是库测量到的就是屏幕上显示的，所以放置目标、选框和浮层中的克隆都不需要特殊处理。画布内部的世界只通过平移移动，使用 `translate()`。

```ts [Shape.vue]
const style = computed(() => {
  const { zoom } = editor.view;
  const { x, y, width, height } = props.shape;
  return { left: `${x * zoom}px`, top: `${y * zoom}px`, width: `${width * zoom}px`, height: `${height * zoom}px` };
});
```

滚轮可以平移和缩放（按住 <kbd value="Ctrl">



</kbd>

 或双指捏合），按住 <kbd value="Space">



</kbd>

 拖动、抓手工具和角落里的按钮也可以：它们都是普通的指针和滚轮事件，调整大小的手柄也是如此。由于 Space 是抓手，图层只用 <kbd value="Enter">



</kbd>

 拿起（provider 的 `keyboard.keys`）。

## 在画框之间移动图层

图层是一个带有自己浮层 `DragGroup.vue` 的普通可拖拽元素。这个浮层按被拖拽图层原本的排布摆放它们：为每个图层放一个 `DragPreview`（拿起时生成的克隆），根据它的图层的 `data` 定位在它被绘制的地方。克隆移动期间，图层本身会让开，除非按住了 <kbd value="Alt">



</kbd>

。

```ts [Shape.vue]
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.shape.id,
  type: 'layer',
  data: () => editor.dragData(props.shape), // { layer, left, top }
  overlay: DragGroup,
});
```

放置时，`position` 是抓起的图层的角在目标内被松开的位置，以屏幕像素计。除以缩放比例，就得到这个图层在世界中移动了多远，每个被拖拽的图层都移动同样的距离，移进画框或移到画布上：

```ts [useLayerDrop.ts]
const corner = target ? editor.boxOf(target) : { x: -view.x / view.zoom, y: -view.y / view.zoom };
const toWorld = (x: number, y: number) => ({ x: corner.x + x / view.zoom, y: corner.y + y / view.zoom });

const from = editor.boxOf(grabbed); // the layer of `active.id`
const to = toWorld(position.x, position.y);
editor.move(active.ids, { x: to.x - from.x, y: to.y - from.y }, target, editor.altHeld.value);
```

画框接收图层，不接收画框：带着画框的拖拽会越过其他画框（`disabled`，实时读取）落到画布上。这些目标设置了 `overDropAnimation: false`，因为图层就出现在它们的克隆被松开的地方。工具栏中的工具也是普通可拖拽元素：放到画框上时，它们把自己的图层添加进画框，以放置点为中心；单击时则添加到视图中央。

```ts [Artboard.vue]
makeDroppable(body, {
  id: () => props.frame.id,
  accept: 'layer',
  disabled: () => !!active.value?.items.some((item) => item.type.includes('frame')),
  overDropAnimation: false,
  onDrop: useLayerDrop(() => props.frame),
});
```

## 智能参考线

`smartGuides` 是一个修饰器：它获取拖拽的偏移，算出被拖拽的图层在世界中会位于哪里，并把它们拉到 6 个屏幕像素之内另一个图层最近的边缘或中心上。浮层、它下方的目标以及放置都随之调整。一个监听器根据拖拽的 `delta`（经过修饰器之后的偏移）画出粉色的线和距离。

```ts [Canvas.vue]
const smartGuides: Modifier = ({ transform, active }) => {
  const moving = editor.boundsOf(active.ids);
  if (!moving) return transform; // a tool from the toolbar
  const { zoom } = view;
  const box = offsetBox(moving, transform.x / zoom, transform.y / zoom);
  const targets = editor.snapTargets(active.ids);
  return {
    x: transform.x + snapBox(box, targets, 'x', SNAP / zoom) * zoom,
    y: transform.y + snapBox(box, targets, 'y', SNAP / zoom) * zoom,
  };
};

// Every drag that starts on the canvas, frames and layers alike, gets the guides.
makeDragArea(viewport, { modifiers: [smartGuides], disabled: panning });
```

调整大小的手柄用同样的线进行吸附，并画出同样的参考线。

## 选择

在空白画布上画出的选框会选中画框和散落的图层；在画框内画出的选框则选中这个画框的图层。两者都是 `makeSelectionArea`：最内层的区域接收按下，并拥有其中的可拖拽元素。:kbd{value="Shift"} 扩展选中集合（`strategy: 'toggle'`）。

```ts [Artboard.vue]
const { isSelecting, style: band } = makeSelectionArea(body, {
  strategy: () => (editor.shiftHeld.value ? 'toggle' : 'select'),
  disabled: editor.panning,
});
```

编辑器从不同时选中一个画框和它里面的图层：如果被拖拽，这个图层会移动两次。选框在开始时会捕获指针，所以单击画框的空白处永远不会到达画框：在那里按下并在原处松开时，由 `Artboard.vue` 选中画框。

## 图层面板

树的项就是设计：带有 `children` 的画框，最上面的行在最前面。`canNest` 让画框接收图层，并让画框保持在顶层。行有自己的 key（`row:…`），因为图层的 id 属于它们在画布上的可拖拽元素；选中集合是画布的，所以行会和它的图层一起高亮。

```ts [LayersPanel.vue]
makeSortableTree(tree, {
  items: editor.layers,
  getKey: (layer) => `row:${layer.id}`,
  canNest: (layer, parent) => parent.kind === 'frame' && layer.kind !== 'frame',
  maxDepth: 1,
  animateChanges: true,
  onDrop: ({ items, from, to }) => {
    // Positions count from the frame's corner: a layer changing frames takes the
    // difference, so it stays where it is on the canvas.
  },
});
```

`onDrop` 在树被写入之前运行，所以编辑器仍然知道每个图层来自哪个画框，并为撤销保存设计。如果图层被移进一个没有覆盖它的画框，它会被裁切到视野之外：于是它改为放到画框的中央。有了 `animateChanges`，在画布上做出的改动和撤销也会让行滑动。行带有类型（`type: 'row'`），所以接收图层和工具的画布和画框会拒绝它。

## 键盘

用 Tab 移到一个图层上（它会被选中），然后 <kbd value="Enter">



</kbd>

 拿起它，方向键每次移动 10 像素（:kbd{value="Shift"}：40），:kbd{value="Enter"} 把它放进它下方的画框。不拖拽时，方向键把选中集合微移一个像素。工具也以同样的方式拿起，它的方向键在画布和画框之间跳转（`keyboardMode: 'droppables'`）。没有选中任何内容时，其他快捷键列在 Design 面板中。

延伸阅读：[拖放](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped) · [自定义修饰器](https://zizigy.github.io/docs/guides/constraints#your-own-modifier) · [页面某一部分的规则](https://zizigy.github.io/docs/guides/constraints#rules-for-a-part-of-the-page) · [框选](https://zizigy.github.io/docs/guides/multi-drag#rubber-band-selection) · [树](https://zizigy.github.io/docs/guides/trees)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
