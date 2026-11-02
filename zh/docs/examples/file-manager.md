---
title: "文件管理器"
description: "一个云盘——网格视图和列表视图、框选、在任何地方都能接收放置并在悬停时打开的文件夹、按住 Alt 复制、可以 Undo 的废纸篓，以及从桌面拖进来的文件。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/examples/file-manager"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="框选一些文件，把它们放到一个文件夹上；按住 Alt 可复制" name="file-manager" title="文件管理器">



</example>

## 看点

- **FileView.vue**：打开的文件夹是一个可排序列表，显示为图块网格或行列表。框选、单击和按键负责选择；拖拽会带走选中集合。
- **useFolderDrop.ts**：屏幕上的每个文件夹都是放置目标：图块、树中的行、收藏、路径中的各级面包屑、废纸篓。它会说明自己为什么拒绝某次拖拽，并在文件进去后“吞下”它们。
- **FilesOverlay.vue**：跟随指针的内容，由每个浮层都会收到的 props 构建：一叠真实图块和一个计数，按住 Alt 复制时显示“+”，以及放置会做什么。
- **SidebarRow.vue**：拖拽停在树中某个折叠的文件夹上时，它会展开，这样它的子文件夹就能接收放置。**Favorites.vue** 本身是一个可排序列表，它的行也是放置目标。
- **useDesktopDrop.ts**：从你的电脑拖进来的文件。这是浏览器的拖放，而不是本库的，在本库旁边处理。
- **drive.ts**：状态和每一次改动，支持 Undo。**index.vue**：provider，带有重新绑定的按键和它的播报。

## 一个列表，两种视图

网格和列表是同一个可排序列表。它的选项是 getter，在拖拽开始时读取：策略跟随视图，按某一列排序的文件夹（`sort: false`）不会重新排序。拖拽仍然可以放进它的文件夹中。

```ts [FileView.vue]
const { items } = makeSortableList(list, {
  items: drive.entries,   // the open folder, sorted by a column or in your own order
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  sort: () => drive.sort.value.key === 'manual',
  multiple: 'gaps',       // the other picked files wait in place, as in Finder
  clone: drive.duplicateOf, // Alt-drag leaves the files and drops "Budget copy.xlsx"
  dropzone: area,         // the empty space takes drops too
  animateChanges: true,   // a new sort, a new folder, files sent to the Trash slide and fade
});
```

- `drive.entries` 是一个可写的 computed：库通过它的 `set` 写回每次放置，列表的 `onDrop` 会先保存云盘状态，以便 Undo。
- 窗口为每个文件夹创建一个新视图（`FileView` 上的 `:key`），所以打开文件夹并不是列表的变化，`animateChanges` 不会为它播放动画。

## 选择

provider 保存选中集合；视图决定人们如何进行选择。在空白处按下会画出选框：单独使用时它替换选中集合，按住 Shift、Ctrl 或 Cmd 时它切换所经过图块的选中状态。策略是一个 getter，在选框开始时读取：

```ts [FileView.vue]
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});

// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
};
```

单击的行为与 Finder 一致：单击选中一个，Ctrl/Cmd 单击添加或移除它，Shift 单击选中从上一个开始的一段。方向键在文件之间移动唯一的 Tab 停靠点（漫游 `tabindex`，库不会干预），Shift+方向键扩展选择，Enter 打开，F2 重命名，Delete 移到废纸篓，输入文字跳到对应名称。provider 把 Enter 还给应用：只有 Space 能拿起文件。

```vue [index.vue]
<script setup lang="ts">
// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };
</script>

<template>
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
```

## 文件夹在任何地方都接收放置

`useFolderDrop` 能把任何元素变成接收文件的文件夹。图块同时也是网格的可排序项：在那里，目标只在图块的中间生效，靠近边缘时网格会让出空位。`accept` 拒绝文件当前所在的文件夹，也拒绝把文件夹放进它自己；被拒绝的图块会让网格像在其他图块上方一样在它上方排序。

```ts [useFolderDrop.ts]
const { id, isOver, isAccepting } = makeDroppable(target, {
  disabled: () => !folder(),
  data: () => drive.placeOf(folder()!),   // { name, trash, why }: the overlay reads it as `over.data`
  accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
  onDrop: (event) => drive.dropInto(event, folder()!),
});

// The files are in once the overlay has landed in the folder: it gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
  },
});
```

`dropInto` 移动文件，或在 `event.mode` 为 `'copy'` 时复制它们（在带 `clone` 的列表上方按住 Alt）。移动会调用 `event.source.remove()`：网格放走这些文件，它的 `onDrop` 以 `to.index === -1` 运行。

```ts [drive.ts]
const dropInto = (event: DnDEvent, target: FolderEntry) => {
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
  record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
  if (copying) return put(target, dragged.map(copyEntry), current.value);
  put(target, dragged, current.value);
  // The grid lets them go: the library writes the open folder without them.
  event.source?.remove();
  selection.delete(...event.active.ids);
};
```

收藏项同时是可排序项（在 `Favorites.vue` 中，属于它自己分组的列表）和放置目标：`FavoriteRow.vue` 把行组件交给 `makeSortableItem`，后者读取它的根元素，`SidebarRow.vue` 则把同一个元素变成文件夹。靠近边缘时，被拖拽的收藏项会排序；放到它上面的文件会进入它的文件夹。

### 弹簧文件夹

拖拽停在树中某个折叠的文件夹上时，它会展开，就像 Finder 那样：`isOver` 保持片刻后，这一行展开。它的子文件夹在拖拽中途挂载，并立即接收放置。

```ts [SidebarRow.vue]
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), 700);
});
```

## 浮层

`FilesOverlay.vue` 是列表的 `overlay`。从网格拖动时，它把 `DragPreview`（所选图块的真实克隆）叠成一叠：放到某个位置时，每个克隆落到自己的图块上；放进文件夹时，它们一个接一个进去。一行和列表一样宽，所以列表把盒子居中到指针上（`snapCenterToCursor`），浮层在它旁边挂一个小标签。浮层是一个函数，Vue 会把它当作函数式组件：它传递自己读取的 props，并决定画两者中的哪一个。

```ts [FileView.vue]
overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
  h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
```

这叠图块下方的胶囊根据文件夹的 `data` 说明松开会发生什么：“Move to Photos”，按住 Alt 时为“Copy to Photos”（`mode`），或在 `accepted` 为 `false` 时用红色说明原因。

```ts [FilesOverlay.vue]
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
```

provider 的 `announcements` 读取同样的 `data`，所以屏幕阅读器会听到“Over Photos. Drop to move 3 items there”或“Already in Documents”。它们说出文件名，而内置文本会说出文件的 key。

## 来自桌面的文件

把电脑上的文件拖到窗口上：它们会上传到指针下方的文件夹（图块、侧边栏中的行、面包屑），否则上传到打开的文件夹，照片会显示出来。本库拖拽的是页面上的元素；来自外部的文件通过浏览器自己的拖放（`dragover` 和 `drop`）到达，在本库旁边处理：

```ts [useDesktopDrop.ts]
const dragover = (event: DragEvent) => {
  if (!carriesFiles(event)) return;
  // Cancelled, a `dragover` says the drop is welcome here.
  event.preventDefault();
  const folder = folderAt(event); // under the pointer: an element with a folder's `data-id`
  // …nothing goes into the Trash…
  drive.uploadTarget.value = folder.id; // that folder opens, as for the library's drags
};
```

## Undo、废纸篓和其他

- 每次改动之前都会保存一份云盘副本；提示消息中的 Undo（或 Ctrl/Cmd+Z）会回到这份副本。废纸篓是树之外的一个文件夹：其中的内容记得自己来自哪里，Put Back 会把它放回去。
- `ContextMenu.vue`（右键单击、Shift+F10 或“⋯”按钮）作用于选中集合或打开的文件夹：就地 Rename、Duplicate、Add to Favorites、Move to Trash、Empty Trash。
- 展开时窗口会占满舞台，信息面板在文件旁边打开。在手机上，侧边栏是一个抽屉；轻点打开文件夹，长按拿起文件。

延伸阅读：[多项拖拽与选择](https://zizigy.github.io/docs/guides/multi-drag) · [放进可排序项](https://zizigy.github.io/docs/guides/drag-and-drop#drop-into-a-sortable-item) · [`DragPreview`](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) · [数据变化：`animateChanges`](https://zizigy.github.io/docs/guides/animations#data-changes-animatechanges) · [无障碍](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
