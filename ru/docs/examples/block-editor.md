---
title: "Блочный редактор"
description: "Страница в духе Notion — блоки перетаскиваются за ручки и вкладываются движением вбок, рамка выделения двигает несколько сразу, новые блоки вытаскиваются из меню «/» или боковой панели, копии — с Alt, и Undo для всего этого."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/block-editor"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Тащите ⋮⋮, чтобы переместить блок, вбок — чтобы вложить его; введите / для новых блоков" name="block-editor" title="Блочный редактор">



</example>

У каждого блока есть ручка (⋮⋮) и «+» на полях. Пишите в любом блоке: Enter начинает следующий,
Tab вкладывает его, «/» открывает меню новых блоков, и работает Markdown («## », «- », «<span>



</span>

 »).
Нарисуйте рамку на полях, чтобы выделить несколько блоков, затем перетащите их вместе. Разверните
рамку примера: на широком экране блоки для добавления и оглавление страницы получают собственные
боковые панели.

## На что обратить внимание

- **Page.vue**: страница — одно сортируемое дерево с `placeholder: 'indicator'`: страница
стоит на месте, пока вы тащите, а линия показывает, куда и на какой уровень приземлятся блоки.
Лист вокруг блоков — его `dropzone`, так что бросок ниже последнего блока приземляется в конец.
- **BlockRow.vue**: один блок. Тащит только его ручка (`handle`), так что текст остаётся
редактируемым и выделяемым. Ручка — кнопка: клик выделяет блок и открывает его меню, Space
берёт блок для перетаскивания с клавиатуры.
- **BlockText.vue** и **Editable.vue**: обычный текст с `contenteditable` и клавишами
редактора. Ввод идёт из DOM в модель; модель возвращается в DOM, только когда её изменило
что-то другое (Undo, слияние), так что курсор никогда не прыгает.
- **editor.ts**: документ и каждая его правка, без всякого drag and drop: разбить, слить,
сдвинуть уровень, дублировать, превратить в другой тип, и история, которая отменяет броски и
ввод одинаково.

## Вложение движением вбок

```ts [Page.vue]
const { items } = makeSortableTree(root, {
  id: 'page',
  items: editor.blocks,
  group: 'blocks',
  placeholder: 'indicator',
  nesting: 'offset',        // sideways: every 24px is a level
  indentation: INDENT,
  maxDepth: MAX_DEPTH,
  canNest: (_block, parent) => !!KINDS[parent.kind].nests,
  collapsed: editor.collapsed,
  clone: copyBlock,         // Alt-drag copies a block with what is nested in it
  createItem: (active) => createBlock((active.data as { kind: BlockKind }).kind),
  animateChanges: true,
  overOverlay: BlockGhost,
  dropzone: sheet,
  onDrop, // see Undo, below
});
```

`nesting: 'offset'` берёт уровень только из бокового смещения драга: наведение на середину
абзаца не бросает в него, как в редакторе документов. `canNest` говорит, какие блоки принимают
вложенные (абзацы, списки, задачи, тогглы, цитаты, выноски; не заголовки, код или изображения), и
когда блок выше отказывает, линия остаётся на самом глубоком уровне, который проходит. Закрытый
тоггл (`collapsed`) всё равно принимает блоки: линия на уровень глубже под ним кладёт их внутрь,
первыми.

Каждая строка рисует линию по своему `indicator`, по уровню, на который приземляется бросок.
Нумерованные списки считают по `items`, так что «2.» и «a.» следуют за каждым броском и каждым
Tab. `animateChanges: true` заставляет скользить и растворяться и изменения, сделанные не драгом: Enter,
Tab, Delete, Undo, раскрытие тоггла.

```ts [BlockRow.vue]
const { indicator, selected } = makeSortableItem(el, {
  id: () => props.node.key,
  handle: '.handle',
  // A mouse press on a handle drags at once; after 4px instead, a click stays a click.
  activation: { mouse: { distance: 4 } },
  // Enter opens the block's menu; Space picks the block up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});

const line = computed(() => {
  const at = indicator.value;
  if (!at || at.side === 'inside') return null;
  return { side: at.side, left: `${((at.depth ?? 0) - props.node.depth) * props.indent}px` };
});
```

## Выделение нескольких

Страница — область выделения: рамка, нарисованная от её полей, выделяет блоки, которых касается.
`strategy: 'select'` делает так, что клик по пустым полям снимает выделение, а `accept`
ограничивает рамку блоками. Клик по ручке выделяет её блок, Shift-клик — ряд блоков,
Ctrl/Cmd-клик — ещё один; Escape в тексте выделяет его блок. Затем:

```ts [Page.vue]
const { isSelecting, style } = makeSelectionArea(scroller, {
  strategy: 'select',
  accept: 'blocks',                     // the rows' type: their group's name
  disabled: () => menu.value !== null,  // a press closes the menu first
});
```

Перетащите один выделенный блок, и остальные поедут с ним: дерево двигает их одним рядом,
каждый с тем, что в него вложено, в порядке чтения. Delete удаляет их, Ctrl/Cmd+D дублирует, а
меню ручки превращает их в другой тип. Стрелки переходят от ручки к ручке, Shift добавляет к
выделению.

## Новые блоки из меню

«+» на полях и «/» в блоке открывают одно и то же меню. Клик добавляет блок ниже; каждый пункт к
тому же — обычный перетаскиваемый элемент, который `createItem` дерева превращает в новый блок
там, где его бросили. Боковая панель широких экранов перечисляет те же пункты, и там Space берёт
пункт для перетаскивания с клавиатуры: стрелка в сторону страницы забирает его туда.

```ts [InsertOption.vue]
makeDraggable(el, {
  id: () => `new-${props.kind}${props.option ? '-option' : ''}`,
  type: 'new-block',
  data: () => ({ kind: props.kind }),
  attributes: () => !props.option, // in the menu, an option of its listbox
});
```

Пока пункт в пути, меню растворяется, чтобы страница показывала, куда он идёт, и закрывается,
когда новый блок приземлился:

```ts [Page.vue]
useDnDMonitor({
  onDragStart: ({ active }) => (lifted.value = !!popover.value?.contains(active.element)),
  onDragSettle: () => {
    if (!lifted.value) return;
    lifted.value = false;
    menu.value = null;
  },
});
```

## Что сделает бросок

**BlockGhost.vue** — `overOverlay` дерева: пока драг над страницей, он оборачивает собственный
оверлей драга (`<slot />`, клон блоков или пункта) счётчиком и заметкой. `to.parentKey` называет
блок, в который попадёт бросок, а `mode` говорит, когда он копирует.

```vue [BlockGhost.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; mode: DragMode; to: DropDestination | null }>();

// A new block: a kind dragged from the menu or the sidebar, by its `type`.
const adding = computed(() => props.items[0]?.type.includes('new-block'));

const note = computed(() => {
  const verb = props.mode === 'copy' ? 'Copy' : adding.value ? 'Add' : null;
  const parent = props.to?.parentKey == null ? undefined : editor.get(String(props.to.parentKey));
  if (!parent) return verb; // a plain move at the page's top level needs no words
  return `${verb ? `${verb} into` : 'Into'} “${parent.text}”`; // "Copy into “Open questions”"
});
</script>

<template>
  <div class="ghost">
    <slot />
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
    <span v-if="note" class="note">{{ note }}</span>
  </div>
</template>
```

## Undo

Дерево записывает каждый бросок в `editor.blocks`, записываемый ref. Его `onDrop` выполняется
прямо перед этой записью, поэтому запоминает страницу такой, какой она была, и Undo отменяет
бросок. Любая другая правка запоминает себя так же; нажатия клавиш в одном блоке составляют один
шаг.

```ts [Page.vue]
onDrop: (event) => {
  editor.record(); // the library writes the drop after this: Undo takes it back
  const first = event.items[0]!.id;
  if (event.mode === 'insert') editor.focus(first, 'start');
  else editor.focusHandle(first);
},
```

```ts [editor.ts]
/** Called before every change: the state it changes goes on the undo stack. */
const record = () => {
  past.value = [...past.value.slice(-99), capture()];
  future.value = [];
  typing = null;
};
```

История хранит копии блоков с их id, так что блок сохраняет свою строку и выделение при Undo и
Redo. После броска курсор получает новый блок, а перемещённый отдаёт фокус своей ручке: его
строка переместилась по странице, из-за чего фокус теряется, а сочетания клавиш продолжают
работать с ручки.

## Клавиатура и скринридеры

Escape в тексте выделяет блок и ставит фокус на его ручку. Оттуда Space берёт его, стрелки
двигают линию (влево и вправо — на уровень наружу или внутрь), Space бросает; Enter открывает его
меню, Delete удаляет. `announcements` провайдера называют блоки по типу и тексту («Picked up
to-do list “Freeze the API”»), а строка состояния в верхней панели озвучивает, что делают кнопки
и сочетания клавиш.

Подробнее: [деревья](https://zizigy.github.io/docs/guides/trees) ·
[мульти-драг и выделение](https://zizigy.github.io/docs/guides/multi-drag#rubber-band-selection) ·
[обычные перетаскиваемые элементы в список](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list) ·
[цели, которые меняют оверлей](https://zizigy.github.io/docs/guides/overlay#targets-that-change-the-overlay) ·
[когда нажатие становится драгом](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag) ·
[доступность](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
