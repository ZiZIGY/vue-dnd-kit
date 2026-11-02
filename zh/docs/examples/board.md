---
title: "项目看板"
description: "一个 Linear 和 Trello 风格的产品看板——可以重新排序的列、WIP 上限、移入 Done 前的询问、带选择栏的多选、拖拽照常可用的筛选、可以 Undo 的垃圾桶，以及一个卡片面板，其中的 Status 按钮执行真实的拖拽。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/examples/board"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="拖动卡片和列；单击卡片可以打开它，Ctrl/Cmd 单击可以选中" name="board" title="项目看板">



</example>

## 看点

- **Board.vue**：列本身是一个横向的可排序列表（`strategy: 'horizontal'`、`axis: 'x'`），每一列都是通过列头拖动的可排序项（`handle`）。展开后，看板占满整个屏幕；在手机上则横向滚动。
- **Column.vue**：所有列的卡片属于同一个 `group`，并带有该列的规则：WIP 上限、移入 Done 前的询问和筛选。列头的计量条会点亮拖拽将带进来的卡片。
- **Card.vue**：`type: 'card'` 的可排序项，所以垃圾桶只接收卡片，不接收列。单击打开它，Ctrl/Cmd 单击选中它（`selected`）；使用键盘时，Space 拿起它，Enter 打开它，X 选中它。
- **store.ts**：看板的数据和规则，其中没有任何拖放代码，在 `DnDProvider` 之上提供，所以浮层也能读取它们。

## 列的规则

每一列给它的列表传入四条规则。`put` 一次就能看到多项拖拽中的所有卡片：如果它们都能放进上限之内，这一列就全部接收，否则一张都不接收。在已满的列上方，空位停在拖拽开始的地方，这一列变红，手中的卡片会说明原因。`onBeforeDrop` 在卡片进入 Done 之前询问，`animate` 让不经拖拽而出现或消失的卡片滑动：筛选、Add card、Undo。

```ts [Column.vue]
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: () => props.column.cards.filter(board.matches),
  group: { name: 'cards', put: ({ keys }) => board.fits(props.column, keys) },
  overlay: CardOverlay,
  animate: true,
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? board.ask(event.items) : 'accept'),
  onDrop: (event) => {
    event.preventDefault();
    board.apply(event);
  },
});
```

## 筛选，以及由看板应用的放置

工具栏中的搜索和成员会筛选卡片，每次拖拽都在显示出来的卡片上照常进行。每个列表通过 getter 读取筛选后的列，所以库永远不会写入它：`onDrop` 调用 `preventDefault()`，把 `e.result`（这次放置所改变的每一列筛选后的新卡片）交给看板。看板把它们放回显示的卡片原先所在的位置，被筛选隐藏的卡片则留在原处。

```ts [store.ts]
const merge = (all: Card[], shown: Card[]) => {
  const queue = [...shown];
  const merged: Card[] = [];
  for (const entry of all) {
    if (!matches(entry)) merged.push(entry);
    else if (queue.length) merged.push(queue.shift()!);
  }
  // Cards that came in from another column and found no place left: at the end.
  return [...merged, ...queue];
};
```

## 手中的卡片

**CardOverlay.vue** 是卡片的 `overlay`。抓起的卡片抬起并倾斜，选中集合中的其余卡片叠在它下面，它们是由包裹元素的 `transform` 旋转的 `DragPreview` 克隆，顶部显示一个计数。卡片下方的提示根据浮层的 `over` 和 `accepted` 说明松开会发生什么：*Move 2 cards to In review*、*Complete*、*Delete* 或 *In review is full · 2 max*。放进某一列时，每个克隆都落到自己的位置上；在垃圾桶上方时这叠卡片会缩小，放进去后卡片一张接一张进入。

```ts [CardOverlay.vue]
const hint = computed(() => {
  if (props.status !== 'dragging' || !props.over) return null;
  const many = props.items.length > 1 ? ` ${props.items.length} cards` : '';
  if (props.over.id === 'trash') return { tone: 'danger', icon: 'trash', text: `Delete${many}` };
  const column = board.column(props.over.id);
  if (!column) return null;
  if (!props.accepted) return { tone: 'danger', icon: 'limit', text: `${column.title} is full · ${column.limit} max` };
  if (board.find(props.items[0]!.id)?.column.id === column.id) return null;
  if (column.confirm) return { tone: 'done', column, text: `Complete${many}` };
  return { tone: '', column, text: `Move${many} to ${column.title}` };
});
```

通过列头拖动的列使用默认克隆，在 `data-dnd-overlay` 为 `dragging` 时用 `rotate` 属性倾斜。

## Done 先询问

放进 Done 时，`onBeforeDrop` 返回一个 promise：在 **ConfirmDialog.vue** 询问期间，卡片停在松开的地方等待。*Move to Done* 回答 `'accept'`，Cancel 和 Escape 回答 `'reject'`（卡片飞回原处），*Keep dragging* 回答 `'continue'`：卡片重新跟随指针，下一次单击时放下。卡片落位后（`onDragSettle`），它们的对勾在 Done 中弹出，冲刺的进度随之前进。

```ts [Board.vue]
useDnDMonitor({
  onDragSettle: (event) => {
    const target = event.over ? board.column(event.over.id) : undefined;
    if ('dropped' in event && target?.confirm && event.source?.list !== target.id) board.complete(event.accepted);
  },
});
```

## 多张卡片、垃圾桶和 Undo

选中的卡片一起移动：拖动其中一张，所有选中的卡片都会跟上，无论来自哪一列。选择栏可以移动它们、删除它们或清除选中集合（Escape 也可以）。**Trash.vue** 是一个只接收卡片的普通放置目标；它像 Delete 按钮那样把卡片从看板中删除，这样通知就能把每张卡片放回原处。

```ts [Trash.vue]
makeDroppable(el, {
  id: 'trash',
  accept: 'card',
  onDrop: (event) => {
    board.remove(event.active.ids);
    selection.delete(...event.active.ids);
  },
});
```

## 无需拖拽的移动

卡片面板中有 Status 按钮，选择栏中每一列都有一个按钮。它们用 `@vue-dnd-kit/actions` 移动卡片：`moveItem` 对这张卡片执行一次真实的键盘拖拽，选中的卡片会带上整个选中集合。它会像你自己的拖拽一样被播报和动画，列的上限和 Done 的询问对它同样适用。

```ts [store.ts]
export function useMove() {
  const board = inject(BOARD)!;
  const { moveItem } = useDnDActions();
  return (ids: Key[], target: Column) => {
    if (!board.fits(target, ids)) return board.notify(`${target.title} is full: ${target.limit} cards at most`);
    void moveItem(ids[0]!, { list: target.id });
  };
}
```

## 键盘和屏幕阅读器

只有 Space 能拿起卡片，所以 Enter 可以用来打开它；操作说明中写明了这一点。方向键按位置移动卡片，也能把它移到下一个接收它的列：已满的列会被跳过，越过最后一列后再按一次，卡片就会进入垃圾桶。播报用卡片和列的名称而不是 id：*"Picked up VDK-45, Haptics on Android tablets. Todo, position 6 of 6."*、*"In review is full: its limit is 2 cards."*

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'] } }"
  screen-reader-instructions="Space picks up a card or a column, the arrow keys move it, Space drops it, Escape cancels. Enter opens a card, X selects it."
  :announcements="announcements"
  :haptics="{ enter: true, refuse: true }"
>
```

延伸阅读：[共享项的列表](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists) · [决定放置](https://zizigy.github.io/docs/guides/drop-decisions) · [多项拖拽](https://zizigy.github.io/docs/guides/multi-drag) · [浮层](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) · [程序化拖拽](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) · [无障碍](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
