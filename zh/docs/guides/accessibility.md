---
title: "无障碍"
description: "键盘拖拽、屏幕阅读器播报和 ARIA 属性都是内置的。本页介绍它们的作用、如何用任何语言编写播报文本，以及如何提供无需拖拽的移动方式。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

本页的所有功能都默认开启。用 Tab 键移到一个日程项上，按 <kbd value="Space">



</kbd>

，用方向键移动它，再按一次 <kbd value="Space">



</kbd>

，或按 <kbd value="Escape">



</kbd>

 把它放回原处。面板会用你选择的语言显示屏幕阅读器收到的内容。

<example height="28.5rem" hint="用 Tab 移到一个项上：Space、方向键、Space。切换语言" name="a11y-announcer">



</example>

通常留给你来做的是：为项提供可读的文本，以及为完全无法拖拽的人提供移动项的按钮。

## 键盘

<table>
<thead>
  <tr>
    <th>
      按键
    </th>
    
    <th>
      操作
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      拿起获得焦点的项；放下它。
    </td>
  </tr>
  
  <tr>
    <td>
      方向键
    </td>
    
    <td>
      移动它：在列表中按位置移动，在树中按行和深度移动，在自由拖拽中按 <code>
        keyboard.step
      </code>
      
       像素移动。
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      取消拖拽——指针拖拽也可以。
    </td>
  </tr>
</tbody>
</table>

- 在列表中，朝同一分组的另一个列表方向按方向键，会把项移到那里。
- 在自由拖拽中，:kbd{value="Shift"} 会加大步长。`makeDraggable(el, { keyboardMode: 'droppables' })` 则让方向键在接收该项的目标之间跳转。
- 键盘拖拽从获得焦点的可拖拽元素或它的手柄开始——从不从其内部的按钮或输入框开始，所以它们保留自己的按键。
- 键盘拖拽会把项滚动到可见范围内，而不是在边缘自动滚动。
- 放置之后，焦点回到该项上，即使它的行在另一个列表中被重新渲染。

### 其他按键

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

绑定匹配 `event.code`（`'Space'`、`'KeyD'`）或 `event.key`（`'Enter'`）。`step` 是自由拖拽中每按一次方向键移动的像素数（默认 25）。`:keyboard="false"` 关闭键盘拖拽，:kbd{value="Escape"} 仍然可以取消任何拖拽。更改按键时，也要更改 `screen-reader-instructions`。

## ARIA 属性

让每个快捷方式依次获得焦点，或关闭这些属性，观察库设置了什么。拖动其中一个，可以看到按钮上的 `aria-pressed` 出现又消失。

<example height="27rem" hint="用 Tab 遍历各个快捷方式；切换属性开关" name="a11y-attributes">



</example>

每个可拖拽元素和可排序项都会获得以下属性，**除非你自己设置了它们**：

<table>
<thead>
  <tr>
    <th>
      属性
    </th>
    
    <th>
      值
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
      ，当元素本身不可获得焦点时（<code>
        <div>
      </code>
      
      ；而不是 <code>
        <a href>
      </code>
      
       或 <code>
        <button>
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        role
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
      ，<code>
        <button>
      </code>
      
       除外，它本身就是按钮。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-roledescription
      </code>
    </td>
    
    <td>
      <code>
        draggable
      </code>
      
      ，可排序项上为 <code>
        sortable
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      provider 的操作说明，追加在已有的 id 旁边（提示框的 id 会保留）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       或 <code>
        false
      </code>
      
      ：项是否被禁用（也包括被禁用的拖拽区域所禁用）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      在具有 <code>
        button
      </code>
      
       角色的元素上，被拖拽期间为 <code>
        true
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

项上的 `attributes: false` 会实时移除库设置的属性。面板会读回这些属性：`aria-describedby` 指向 provider 的操作说明，屏幕阅读器会在项的名称之后读出它。

### 可拖拽的链接和按钮

`aria-roledescription` 会替换角色的名称：屏幕阅读器会说“Inbox, sortable”，而不是“Inbox, button”。对于角色很重要的元素，自己设置它；库不会去动它：

```vue [Shortcut.vue]
<script setup lang="ts">
makeSortableItem(el, {
  item: () => props.shortcut,
  // Enter follows the link: only Space picks it up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});
</script>

<template>
  <a ref="el" :href="shortcut.href" role="link" aria-roledescription="draggable link">
    {{ shortcut.title }}
  </a>
</template>
```

- 链接照常工作：点击会打开它，但结束拖拽的那次点击永远不会到达它。:kbd{value="Enter"} 本会开始拖拽，所以 `canDrag` 拒绝了它，浏览器就会跟随链接。
- `<button>` 也保留它的点击，库既不添加 `role` 也不添加 `tabindex`。
- 项**内部**的按钮、链接和输入框不会开始指针拖拽，所以一行可以包含它自己的操作。

### 手柄：做成真正的按钮

```vue [Track.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ track: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track, handle: '.grip' });
</script>

<template>
  <li ref="el" class="track">
    {{ track.title }}
    <button type="button" class="grip" :aria-label="`Drag ${track.title}`">⠿</button>
  </li>
</template>
```

有 `handle` 时，属性加在手柄上，键盘拖拽也从它开始（上面的 **Archive** 快捷方式）。`<button>` 本身可以获得焦点，而且本来就是按钮，所以不需要 `tabindex` 或 `role`。给它一个 `aria-label`：抓手图标本身没有名称，“Drag Midnight Drive”比“button”传达的信息更多。

<tip>

在整个键盘拖拽期间，手柄一直保持焦点，而它所在的行就是空位。用 `opacity: 0` 清空空位，而不是在手柄上使用 `visibility: hidden` 或 `display: none`：隐藏的元素会失去焦点。放置后库会把焦点还给它，但在此期间屏幕阅读器可能会读出“body”。

</tip>

## 播报

provider 中的实时区域会播报每一次拿起、移动、放置和取消。可排序列表会说明项的位置：*“Picked up item t2 at position 2 of 5 in list playlist.”* 移动在拖拽停留 500 ms 后才播报，所以快速的指针拖拽不会被逐个位置地读出来。演示的面板会记录 provider 收到的每一条文本，包括指针拖拽途中经过的移动。

内置文本是英文的，除非你给它们设置 `label`，否则用 id 来称呼各个对象。项、列表、树和放置目标都接受 `label`：

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*"Picked up Blue in Green at position 2 of 5 in Playlist."* 这些 label 也会传到你自己的文本和监听器中：`active.label`、`over.label`、`active.items` 的每一项，以及 context 中的 `position.label` 和 `partner.label`。

如果要换一种语言或换一种说法，就像日程那样自己编写文本。每条文本都会收到事件和一个 `context`：内置文本会播报的 `position`（`list`、从 0 开始的 `index`、`length`、列表的 `label`），以及 `count`、`copy` 和交换时的 `partner`。

```ts [index.vue]
const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

const announcements = computed<Partial<Announcements>>(() => {
  const t = LANGUAGES[lang.value]!;
  return {
    onDragStart: ({ active }, { position }) => position && t.start(titleOf(active.id), position.index + 1, position.length),
    onDragOver: ({ active }, { position }) => position && t.move(titleOf(active.id), position.index + 1, position.length),
    onDragEnd: ({ active }, { position }) => position && t.drop(titleOf(active.id), position.index + 1, position.length),
    onDragCancel: ({ active }, { position }) => position && t.cancel(titleOf(active.id), position.index + 1),
    onDragResume: ({ active }) => t.resume(titleOf(active.id)),
  };
});
```

```vue [index.vue]
<DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
```

<table>
<thead>
  <tr>
    <th>
      <code>
        context
      </code>
    </th>
    
    <th>
      开始时
    </th>
    
    <th>
      移动时
    </th>
    
    <th>
      结束时
    </th>
    
    <th>
      取消时
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      拿起的位置
    </td>
    
    <td>
      将要落到的位置；在列表之外时没有
    </td>
    
    <td>
      落到的位置
    </td>
    
    <td>
      返回的位置
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        partner
      </code>
    </td>
    
    <td>
      
    </td>
    
    <td>
      交换：与之交换的项，以及它现在的位置
    </td>
    
    <td>
      同上，在放置之后
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      、<code>
        copy
      </code>
    </td>
    
    <td>
      有多少项，以及拖拽是否为复制
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      事件
    </th>
    
    <th>
      播报时机
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
      项被拿起。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      项移到另一个地方（列表中的一个位置、另一个目标），在拖拽停留 500 ms 后。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      项被放下。新顺序已经写入。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      拖拽被取消，或放置被拒绝：项回到了原处。
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
      
      ：拖拽继续（见<a href="/docs/guides/drop-decisions">
        决定放置
      </a>
      
      ）。
    </td>
  </tr>
</tbody>
</table>

- 文本会替换该事件的播报；`undefined` 保留默认；`''` 什么都不说。没有写出的事件保留默认值，比如可排序列表的位置。
- `screenReaderInstructions` 是每个可拖拽元素用 `aria-describedby` 指向的文本。两个 prop 都是响应式的：演示会实时切换语言。
- `:announcements="false"` 让该区域静音，例如在你通过自己的实时区域播报时。

<note>

对于其他语言，提供全部五条文本和操作说明：缺少的每一条都会用英文播报，可排序列表的位置也是如此。同时设置页面的 `lang`，让屏幕阅读器选用正确的语音。

</note>

## 无需拖拽的移动

有些人完全无法拖拽。WCAG 2.5.7 要求提供一种通过单次点击来移动项的方式。使用每一行上的箭头和勾选按钮：它们无需拖拽就能移动书本，焦点也留在你所在的位置。

<example height="27.5rem" hint="用键盘操作箭头按钮，或拖动抓手" name="a11y-move-buttons">



</example>

按钮改变数据；列表负责呈现移动。列表开启 `animateChanges` 后，各行会像拖拽时一样滑动（对于要求减少动态效果的用户则保持不动）：

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animateChanges: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};
```

```vue [ReadingList.vue]
<p class="status" role="status">{{ message }}</p>
```

### 保持焦点

在 DOM 中移动元素会让它失去焦点，所以刚刚按下的按钮会失去焦点。在行移动完成后把焦点还给它：

```ts [BookRow.vue]
const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Back on the same button, or on the other one when this one is now disabled.
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};
```

消失的行（勾选按钮把一本书标记为已读）会把焦点一起带走：把焦点移到下一行，或最后一行。拖拽不需要这些：库会把焦点放回被放下的项本身，即使它在另一个列表中被重新渲染。

<tip>

`@vue-dnd-kit/actions` 则会把每个按钮变成真正的键盘拖拽：`moveItem(id, { index })` 会被播报，经过 `onBeforeDrop` 和 `onDrop`，带有动画，并把焦点保持在项上。见[程序化拖拽](https://zizigy.github.io/docs/guides/sensors#programmatic-drags)。

</tip>

## 触摸

触摸拖拽在 200 ms 长按之后开始。在此之前移动超过 5 px 会改为滚动页面，所以列表仍然可以滚动。用 provider 的 `activation` 调整这两个值，并根据 `useDnD().activation.progress` 画出长按圆环：见 [provider](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag)。触摸拖拽开始时会短暂振动；`:haptics="false"` 关闭它。

## 减少动态效果

在 `prefers-reduced-motion: reduce` 下，库自己的动画不会运行：排序时项直接跳到它们的位置，放置时浮层不会飞行，`animateChanges` 的变化立即出现。你自己的动画函数仍会运行，并带有 `reducedMotion: true`，所以由你决定：跳过它们，或保留一个短暂的淡入淡出。见[动画](https://zizigy.github.io/docs/guides/animations)。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
