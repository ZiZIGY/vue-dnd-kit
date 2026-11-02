---
title: "Конструктор страниц"
description: "Лендинг, собранный перетаскиванием — секции из палитры, которые над страницей превращаются в настоящие, элементы, перемещаемые между колонками, дерево слоёв на тех же данных, редактирование на месте, ширины устройств и отмена."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/page-builder"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="45rem" hint="Перетащите секцию или элемент на страницу; двойной клик по тексту — чтобы его редактировать" name="page-builder" title="Конструктор страниц">



</example>

Разверните рамку примера на весь экран: палитра встанет слева, слои справа, а страница займёт
место между ними. Когда экран уже, они делят выдвижную панель, которая открывается из верхней
панели.

## На что обратить внимание

- **Canvas.vue**: страница — сортируемый список секций с `placeholder: 'indicator'`. Она стоит
на месте, пока секция в пути, а линия между двумя секциями говорит, куда та встанет: сдвигать
500-пиксельные секции на каждом слоте значило бы трясти всю страницу. `dropzone` отдаёт бросок
всему холсту, так что секция, отпущенная сбоку или ниже страницы, всё равно приземляется.
- **ColumnList.vue**: каждая колонка каждой секции — список группы `blocks`. Элементы
перемещаются между колонками и секциями и сортируются вживую: страница показывает результат,
пока вы тащите. Каждая колонка — отдельный компонент, а колонки — списки внутри элементов
другого списка.
- **Palette.vue**: шаблоны секций — список группы страницы с `pull: 'clone'`, `put: false` и
`sort: false`: он раздаёт копии и ничего не берёт обратно. Элементы под ними
(**ElementChip.vue**) — обычные перетаскиваемые элементы, и колонка делает из них блок через
`createItem`.
- **Layers.vue**: та же страница в виде сортируемого дерева, на тех же данных. Строка,
перемещённая там, перемещается и на странице, и наоборот.
- **builder.ts**: страница, выделение, устройство и история. Броски записывают страницу через
списки; кнопки панели инструментов и сочетания клавиш меняют её здесь. Каждое изменение — шаг
отмены.

## Секция в руке — настоящая секция

**SectionGhost.vue** — оверлей и секций страницы, и шаблонов палитры. Над страницей (`to.list`
— список страницы) он рендерит саму секцию, шириной со страницу, уменьшенную под указателем.
Когда бросок решён (`status: 'dropping'`), он возвращает масштаб к 1, пока блок летит на место
секции: и приземляется ровно на неё. Бросок ждёт этого перехода, так что в конце ничего не
прыгает.

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

Вдали от страницы шаблон остаётся тем, чем был в палитре: `DragPreview` показывает копию его
карточки, сделанную библиотекой. Место секции на странице — это слот: пока вы тащите, он ждёт
там, приглушённый; после броска её новое место остаётся пустым, пока на него не приземлится
оверлей.

```css [PageSection.vue]
.page-section[data-dnd-placeholder] { opacity: 0; }
html[data-dnd-dragging] .page-section[data-dnd-placeholder] { opacity: 0.35; }
```

Каждая секция рисует линию по своему `indicator` и говорит, что делает бросок: *Move Features
here* или *Add Pricing here* для шаблона.

## Элементы: в цветах секции, куда они идут

Блоки тащат за всё тело; секцию — за ручку её метки, так как её тело — содержимое, которое
кликают и тащат. **BlockGhost.vue**, оверлей блоков и чипов, читает из `to` колонку, в которую
он попадёт, и берёт цвета её секции: кнопка над тёмным футером светлеет ещё до того, как вы
отпустите. Блок оверлея получает размер слота блока там (`overlayFit: 'slot'`, по умолчанию), и
блок раскладывается в нём так, как будет после броска.

```ts [BlockGhost.vue]
// The column it would go into (`to.list` is the column's id): its section's tone.
const look = computed(() => {
  const at = props.to && find(String(props.to.list));
  return at ? { ...TONES[SECTIONS[at.section.kind].tone], ...typeScale(pageWidth.value) } : null;
});
```

Чип палитры — обычный перетаскиваемый элемент, который несёт свой тип. Каждая колонка делает из
него блок, и новый блок стоит в колонке, отрендеренный собственным шаблоном колонки, пока вы не
отпустите или не двинетесь дальше:

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

`blocks` — записываемый `computed` поверх `props.column.blocks`, а не `toRef`: отмена кладёт на
страницу новые объекты, и колонка должна следовать за ними.

## Шаблоны: копии наружу, внутрь ничего

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

Шаблоны — настоящие секции, так что их карточки показывают их (уменьшенными), а оверлей может их
отрендерить. Клик по карточке или <kbd value="Enter">



</kbd>

 добавляет секцию после выделенной:
страницу можно собрать вообще без перетаскивания.

## Слои: та же страница деревом

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

Ключи общие для всего провайдера, поэтому у строк собственные ключи. Колонки — тоже строки,
`disabled`: они принимают блоки и остаются на месте. Там, куда блоку нельзя, между двумя
секциями, его линия краснеет. Наведение на строку обводит её узел на странице; выделение узла на
странице открывает здесь его секцию и прокручивает его строку в видимую область.

## Редактирование на месте и клавиатура

Блок тащится из любого места, поэтому его тексты не редактируются, пока вы не кликнете по нему
дважды: тогда они становятся `contenteditable`, а `canDrag` отклоняет драги, так что нажатие
ставит курсор. **EditableText.vue** пишет DOM из модели, только пока текст не редактируется,
так что курсор никогда не прыгает, а отмена всё равно видна.

Провайдер оставляет <kbd value="Space">



</kbd>

 для драгов, а <kbd value="Enter">



</kbd>

 — редактору:

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'], drop: ['Space', 'Enter'], cancel: ['Escape'] } }"
  :announcements="announcements"
  :screen-reader-instructions="instructions"
>
```

Перейдите табом к блоку: <kbd value="Space">



</kbd>

 берёт его, а стрелки двигают его по колонке и в
следующие; <kbd value="Enter">



</kbd>

 редактирует его. Секция двигается за свою ручку так же или
стрелками своей панели инструментов. <kbd value="Ctrl">



</kbd>

 <kbd value="Z">



</kbd>

 отменяет,
<kbd value="Delete">



</kbd>

 удаляет, <kbd value="Ctrl">



</kbd>

 <kbd value="D">



</kbd>

 дублирует. Скринридеры слышат
«the Hero section, position 3 of 7 on the page», а не id.

## Отмена и изменения без драга

Каждый бросок — один шаг истории: монитор сохраняет страницу, как только списки её записали.

```ts [Builder.vue]
useDnDMonitor({ onDragEnd: () => builder.commit() });
```

Отмена возвращает снимок. У списков включён `animate`, так что то, что сдвинул снимок,
скользит туда, как и секции, которые панель инструментов двигает вверх и вниз; добавленные
секции проявляются, а удалённые растворяются.

Подробнее: [сортируемые списки](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line) ·
[списки с общими элементами](https://zizigy.github.io/docs/guides/shared-lists) · [деревья](https://zizigy.github.io/docs/guides/trees) ·
[оверлей](https://zizigy.github.io/docs/guides/overlay) · [анимации](https://zizigy.github.io/docs/guides/animations) ·
[доступность](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
