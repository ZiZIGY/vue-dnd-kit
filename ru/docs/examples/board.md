---
title: "Доска проекта"
description: "Продуктовая доска в духе Linear и Trello — колонки, которые можно переставлять, WIP-лимиты, вопрос перед Done, множественное выделение с панелью выделения, фильтры, сквозь которые работают драги, корзина с Undo и панель карточки, чьи кнопки Status проигрывают настоящие драги."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/board"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Перетаскивайте карточки и колонки; клик открывает карточку, Ctrl/Cmd-клик выделяет её" name="board" title="Доска проекта">



</example>

## На что обратить внимание

- **Board.vue**: колонки — отдельный горизонтальный сортируемый список (`strategy: 'horizontal'`, `axis: 'x'`), а каждая колонка — сортируемый элемент, который перетаскивают за
заголовок (`handle`). В развёрнутом виде доска занимает весь экран; на телефоне она
прокручивается вбок.
- **Column.vue**: карточки всех колонок — одна `group` с правилами колонки: её WIP-лимитом,
вопросом перед Done и фильтрами. Счётчик в её заголовке подсвечивает карточки, которые принёс
бы драг.
- **Card.vue**: сортируемый элемент с `type: 'card'`, поэтому корзина принимает карточки, а не
колонки. Клик открывает карточку, Ctrl/Cmd-клик выделяет её (`selected`); с клавиатуры Space
берёт её, Enter открывает, а X выделяет.
- **store.ts**: данные и правила доски, без всякого drag and drop, предоставленные выше
`DnDProvider`, чтобы их читал и оверлей.

## Правила колонки

Каждая колонка передаёт своему списку четыре правила. `put` видит сразу все карточки
мульти-драга: колонка берёт их все, если они помещаются в её лимит, или ни одной. Над
заполненной колонкой слот остаётся там, где начался драг, колонка краснеет, а карточки в руке
говорят почему. `onBeforeDrop` спрашивает, прежде чем карточки попадут в Done, а `animateChanges`
сдвигает карточки, которые появляются и исчезают без драга: фильтр, Add card, Undo.

```ts [Column.vue]
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: () => props.column.cards.filter(board.matches),
  group: { name: 'cards', put: ({ keys }) => board.fits(props.column, keys) },
  overlay: CardOverlay,
  animateChanges: true,
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? board.ask(event.items) : 'accept'),
  onDrop: (event) => {
    event.preventDefault();
    board.apply(event);
  },
});
```

## Фильтры и броски, которые применяет доска

Поиск и люди на панели инструментов фильтруют карточки, и каждый драг продолжает работать с тем,
что показано. Каждый список читает свою колонку через геттер, отфильтрованной, поэтому
библиотека никогда её не записывает: `onDrop` вызывает `preventDefault()` и передаёт доске
`e.result` — новые отфильтрованные карточки каждой колонки, которую изменил бросок. Доска
возвращает их на места, которые занимали показанные карточки, а карточки, скрытые фильтрами,
остаются там, где были.

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

## Карточки в руке

**CardOverlay.vue** — `overlay` карточек. Взятая карточка приподнимается и наклоняется,
остальное выделение лежит под ней — оно собрано из клонов `DragPreview`, повёрнутых через
`transform` их обёрток, — а сверху стоит счётчик. Под карточками подсказка говорит, что сделает
отпускание, по `over` и `accepted` оверлея: *Move 2 cards to In review*, *Complete*, *Delete* или
*In review is full · 2 max*. При броске в колонку каждый клон приземляется в свой слот; над
корзиной стопка сжимается, а после броска туда карточки уходят в неё одна за другой.

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

Колонка, которую тащат за заголовок, — стандартный клон, наклонённый свойством `rotate`, пока
`data-dnd-overlay` равен `dragging`.

## Done сначала спрашивает

Бросок в Done возвращает промис из `onBeforeDrop`: карточки ждут там, где их отпустили, пока
**ConfirmDialog.vue** спрашивает. *Move to Done* отвечает `'accept'`, Cancel и Escape —
`'reject'` (карточки летят обратно), а *Keep dragging* — `'continue'`: карточки снова следуют за
указателем, и следующий клик их бросает. Когда карточки приземлились (`onDragSettle`), в Done
появляется их галочка, и прогресс спринта сдвигается.

```ts [Board.vue]
useDnDMonitor({
  onDragSettle: (event) => {
    const target = event.over ? board.column(event.over.id) : undefined;
    if ('dropped' in event && target?.confirm && event.source?.list !== target.id) board.complete(event.accepted);
  },
});
```

## Несколько карточек, корзина и Undo

Выделенные карточки едут вместе: перетащите одну, и с ней поедет каждая выделенная карточка, из
любой колонки. Панель выделения перемещает их, удаляет или снимает выделение (Escape тоже).
**Trash.vue** — обычная цель, которая принимает только карточки; она удаляет их с доски, как и
кнопки Delete, так что уведомление может вернуть каждую туда, где она была.

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

## Перемещение без драга

На панели карточки есть кнопки Status, а на панели выделения — по кнопке на колонку. Они
перемещают карточки через `@vue-dnd-kit/actions`: `moveItem` проигрывает настоящее
перетаскивание карточки с клавиатуры, и выделенная карточка приводит с собой всё выделение. Оно
озвучивается и анимируется, как ваше, и лимит колонки и вопрос Done действуют на него, как на
любой драг.

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

## Клавиатура и скринридеры

Карточку берёт только Space, так что Enter свободен, чтобы её открывать; инструкции говорят об
этом. Стрелки двигают карточку по слотам и поперёк — в следующую колонку, которая её принимает:
заполненная пропускается, а за последней колонкой следующее нажатие несёт карточку дальше, в
корзину. Объявления называют карточки и колонки вместо id: *«Picked up VDK-45, Haptics on Android
tablets. Todo, position 6 of 6.»*, *«In review is full: its limit is 2 cards.»*

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'] } }"
  screen-reader-instructions="Space picks up a card or a column, the arrow keys move it, Space drops it, Escape cancels. Enter opens a card, X selects it."
  :announcements="announcements"
  :haptics="{ enter: true, refuse: true }"
>
```

Подробнее: [списки с общими элементами](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists) ·
[решение о броске](https://zizigy.github.io/docs/guides/drop-decisions) · [мульти-драг](https://zizigy.github.io/docs/guides/multi-drag) ·
[оверлей](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[программные драги](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) ·
[доступность](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
