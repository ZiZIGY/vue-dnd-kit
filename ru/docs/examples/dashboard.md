---
title: "Дашборд"
description: "Виджеты на сетке — перемещаются за заголовки, меняют размер за углы по ячейке за раз, стоят в строках высотой по содержимому, а на узких экранах колонок меньше."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/dashboard"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="38rem" hint="Перетащите виджет за заголовок, измените его размер за угол, напишите что-нибудь в заметках" name="dashboard" title="Дашборд">



</example>

## На что обратить внимание

- **Dashboard.vue**: сетка — один сортируемый список со `strategy: 'grid'`, которая сортирует
виджеты разного размера. Число колонок он считает по собственной ширине (`useElementSize`):
четыре, три или две. Его строки не ниже 92 px и растут вместе с содержимым, а
`grid-auto-flow: dense` заполняет дыры, которые оставляет изменение размера.
- **Widget.vue**: виджет перемещается за заголовок (`handle`), поэтому его содержимое остаётся
свободным: задачи отмечаются, заметки принимают текст. Его угол — отдельный перетаскиваемый
элемент, и он меняет размер виджета.
- **WidgetBody.vue**: то, что показывают виджеты. Напишите что-нибудь в заметках: строка растёт
вместе с текстом, а виджеты рядом — вместе со строкой. Никто их не измеряет: это собственная
раскладка сетки, а библиотека читает размеры такими, какие они есть, когда начинается драг.
- **widgets.ts**: виджеты, их размеры в ячейках и числа сетки.

Разверните пример: у сетки становится четыре колонки, а виджет, ставший уже на маленьком
экране, снова получает прежнюю ширину.

## Изменение размера: угол — перетаскиваемый элемент

Угол лежит внутри виджета, а нажатие перетаскивает ближайший перетаскиваемый элемент — угол, а
не виджет. У него нет оверлея, и он никогда не двигается. Вместо этого растёт виджет.

```ts [Widget.vue]
makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  activation: { touch: { distance: 4 } }, // a finger resizes at once, not after a long press
  attributes: false,                       // no tab stop: Shift + arrows on the header resize
});
```

Размер следует за указателем: насколько тот сдвинулся с момента нажатия, в целых ячейках. Пока
угол удерживается, сетка показывает этот размер, а остальные её виджеты освобождают место.

```ts [Widget.vue]
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});
```

Бросок сохраняет этот размер: монитор слышит `onDragEnd` угла. <kbd value="Escape">



</kbd>

 вместо этого
отменяет драг, и виджет возвращается к своему размеру.

```ts [Widget.vue]
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});
```

## Сетка не участвует в изменении размера

Угол — не виджет, и сетка бы его отклонила: бросок на цель, которая отклоняет драг, — это
отмена. Поэтому, пока перетаскивается угол, сетка `disabled`, и бросок угла не приходится ни на
какую цель.

```ts [Dashboard.vue]
const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  strategy: 'grid',
  label: 'Dashboard',
  disabled: () => !!active.value?.type.includes('resize'),
});
```

## Размеры, которые подстраиваются

Виджет сохраняет размер, который ему дали. Когда колонок меньше, он никогда не шире сетки
(`Math.min(w, columns)`) и получает свою ширину обратно, когда у сетки снова есть место. У строк
есть минимальная высота, а не высота: решает содержимое, и все виджеты строки растягиваются до
самого высокого.

## Клавиатура

Перейдите табом к заголовку виджета и нажмите <kbd value="Space">



</kbd>

, чтобы взять виджет. Стрелки
двигают его среди остальных, <kbd value="Space">



</kbd>

 бросает его, <kbd value="Escape">



</kbd>

 возвращает
на место. Когда заголовок в фокусе, <kbd value="Shift">



</kbd>

 со стрелками меняют размер виджета по
ячейке за раз, а скринридеры слышат его новый размер.

Подробнее: [стратегии](https://zizigy.github.io/docs/guides/sortable-lists#strategies) ·
[ручки](https://zizigy.github.io/docs/guides/sortable-lists#handles) ·
[без оверлея](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[useDnDMonitor()](https://zizigy.github.io/docs/guides/provider#listen-to-every-drag-usedndmonitor) ·
[календарь на неделю](https://zizigy.github.io/docs/examples/calendar)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
