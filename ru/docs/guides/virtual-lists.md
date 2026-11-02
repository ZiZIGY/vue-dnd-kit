---
title: "Виртуальные списки"
description: "Сортируйте тысячи строк с TanStack Virtual или useVirtualList из VueUse — передайте виртуализатору черновик, задайте строкам ключи по id и держите перетаскиваемую строку смонтированной."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/virtual-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Сортировка управляется данными: черновик `items` — новый массив при каждой перестановке, у строк
ключи по элементу, а анимациям нужны только смонтированные строки. Поэтому подходит любой
виртуализатор, который рендерит из массива, — передайте ему черновик вместо своего массива.

<example height="32.5rem" hint="10 000 строк, в DOM — горстка: перетащите одну или прокручивайте во время драга" name="virtual-list">



</example>

## Правила

1. Передавайте виртуализатору **черновик items**, а не исходный массив.
2. **Задавайте строкам ключи по ключу элемента**, никогда по индексу. Официальные примеры
TanStack и VueUse используют ключ по индексу; измените это.
3. Передавайте id в `makeSortableItem` **геттером**, `{ id: () => props.item.id }`: виртуализатор
может передать компоненту строки другой элемент.
4. Храните большие массивы в **shallowRef**. Библиотека никогда не обходит ваши данные вглубь.
5. Держите плейсхолдер того же размера, что и строку: скрывайте его содержимое, а не схлопывайте
его.
6. Задайте overscan хотя бы в 5 строк (VueUse: хотя бы 1), чтобы строки были смонтированы до
того, как до них дойдёт автоскролл.
7. Не анимируйте `height`, `margin` или `padding` строк и не ставьте `will-change` на
скроллер.

## useVirtualList из VueUse

Демо выше. У всех строк одинаковая высота, и математика VueUse остаётся O(1):

```vue [TaskList.vue]
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { useVirtualList } from '@vueuse/core';
import { makeSortableList } from '@vue-dnd-kit/core';

const ROW = 44;
const tasks = shallowRef(makeTasks(10_000));

// The outer element is the sortable list: `containerProps` owns the scroller's ref.
const listRef = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(listRef, { items: tasks });

// Fed with the draft `items`, so the rows move while you drag.
const { list, containerProps, wrapperProps } = useVirtualList(items, { itemHeight: ROW, overscan: 8 });
</script>

<template>
  <div ref="list">
    <div v-bind="containerProps" style="height: 308px">
      <div v-bind="wrapperProps">
        <!-- Keyed by id, not by index as in VueUse's docs. -->
        <Row v-for="{ data } in list" :key="data.id" :task="data" :height="ROW" />
      </div>
    </div>
  </div>
</template>
```

- `itemHeight` — настоящая высота строки, включая рамки. Не ставьте отступы между строками:
VueUse их не учитывает.
- Сортируемый список — внешний элемент, потому что `containerProps` привязывает собственный
`ref` к скроллеру. Автоскролл всё равно находит скроллер: он прокручивает контейнеры под
указателем.
- VueUse не умеет держать строку смонтированной: перетаскиваемая строка размонтируется, когда
вы прокручиваете её за пределы. Это нормально, см. [Что остаётся смонтированным](#what-stays-mounted).

## TanStack Virtual

TanStack измеряет каждую строку, так что строки могут быть такой высоты, какой требует
содержимое. Он также может держать перетаскиваемую строку смонтированной, как бы далеко вы от
неё ни прокрутили:

<example height="34.5rem" hint="Перетащите заметку чуть ниже списка и задержите: перетаскиваемая строка остаётся закреплённой" name="virtual-tanstack">



</example>

```vue [NoteList.vue]
<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue';
import { defaultRangeExtractor, useVirtualizer, type Range } from '@tanstack/vue-virtual';
import { makeSortableList } from '@vue-dnd-kit/core';

const notes = shallowRef(makeNotes(5_000));

// The scroller is the sortable list: the library sorts it and auto-scrolls it.
const scrollRef = useTemplateRef<HTMLElement>('scroll');
const { items, activeIndex, captureLayout } = makeSortableList(scrollRef, { items: notes });

// One computed that reads the draft once: TanStack memoizes the measurements and the range
// on `getItemKey` and `rangeExtractor`, so they must be new functions after every reorder.
const virtualizer = useVirtualizer(
  computed(() => {
    const arr = items.value;
    const pin = activeIndex.value;
    return {
      count: arr.length,
      getScrollElement: () => scrollRef.value,
      estimateSize: () => 92,
      overscan: 6,
      getItemKey: (index: number) => arr[index]!.id,
      // The dragged row stays mounted, however far you scroll from it.
      rangeExtractor: (range: Range) => {
        const indexes = defaultRangeExtractor(range);
        return pin < 0 || indexes.includes(pin) ? indexes : [...indexes, pin].sort((a, b) => a - b);
      },
      // Measurements land after the library's animation pass: animate them too.
      onChange: () => captureLayout(),
    };
  }),
);
const rows = computed(() => virtualizer.value.getVirtualItems());
const measure = (el: unknown) => virtualizer.value.measureElement(el as HTMLElement | null);
</script>

<template>
  <div ref="scroll" style="height: 340px; overflow: auto; contain: strict">
    <div :style="{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }">
      <div
        v-for="row in rows"
        :key="(row.key as string)"
        :ref="measure"
        :data-index="row.index"
        :style="{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${row.start}px)` }"
      >
        <NoteRow :note="items[row.index]!" />
      </div>
    </div>
  </div>
</template>
```

Что делает каждая часть:

<table>
<thead>
  <tr>
    <th>
      Часть
    </th>
    
    <th>
      Зачем
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        count
      </code>
      
       и <code>
        getItemKey
      </code>
      
       из <code>
        items
      </code>
    </td>
    
    <td>
      Виртуализатор рендерит черновик, поэтому строки двигаются во время драга.
    </td>
  </tr>
  
  <tr>
    <td>
      Один <code>
        computed
      </code>
      
       вокруг опций
    </td>
    
    <td>
      <code>
        getItemKey
      </code>
      
       и <code>
        rangeExtractor
      </code>
      
       должны быть новыми функциями после каждой перестановки, иначе TanStack сохраняет старые измерения и диапазон.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        measureElement
      </code>
      
       с <code>
        data-index
      </code>
    </td>
    
    <td>
      Каждая строка измеряется при рендере: <code>
        estimateSize
      </code>
      
       — лишь первая прикидка.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rangeExtractor
      </code>
      
       с <code>
        activeIndex
      </code>
    </td>
    
    <td>
      Добавляет перетаскиваемую строку в отрендеренный диапазон, когда она прокручивается за его пределы. <code>
        activeIndex
      </code>
      
       равен <code>
        -1
      </code>
      
      , когда не перетаскивается ни одна строка этого списка.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onChange: () => captureLayout()
      </code>
    </td>
    
    <td>
      Повторное измерение сдвигает строки уже после того, как библиотека анимировала перестановку. <code>
        captureLayout()
      </code>
      
       анимирует и этот сдвиг. Вне драга он ничего не делает.
    </td>
  </tr>
</tbody>
</table>

Когда перетаскиваемая строка покидает диапазон? Её слот следует за указателем, пока указатель
над списком. Уведите указатель чуть ниже списка и задержите там: автоскролл продолжается, слот
остаётся на месте и вскоре оказывается далеко над строками на экране. Закрепление держит его
смонтированным, так что бросок приземляется на настоящий элемент. Список с
`placeholder: 'indicator'` держит перетаскиваемую строку на месте весь драг, так что там это
ещё важнее.

- Для закрепления строки должны позиционироваться по одной, абсолютно, как выше. Виртуализатор,
который рендерит один блок с отступами, не может добавить строку где-то далеко.
- Компонент строки передаёт свой id геттером: `makeSortableItem(el, { id: () => props.note.id })`.
- Оставьте `anchorTo: 'start'` TanStack, значение по умолчанию. С `lanes` используйте
`@tanstack/virtual-core` 3.19 или новее (`@tanstack/vue-virtual` его устанавливает).

## Виртуальные колонки канбана

Каждая колонка — отдельный сортируемый список и отдельный виртуализатор, а списки разделяют
`group`. Три колонки по 1000 карточек рендерят несколько десятков:

<example height="34rem" hint="Перенесите карточку между колонками по 1000 карточек" name="virtual-kanban">



</example>

У карточки, пришедшей из другой колонки, в этой колонке ещё нет измерения. Оцените её по
настоящему размеру перетаскиваемой карточки, `activeSize`, прочитанному в том же computed:

```ts [Column.vue]
const { items, activeIndex, activeSize, captureLayout } = makeSortableList(scrollRef, {
  id: props.column.id,
  items: props.column.cards, // a shallowRef per column
  group: 'board',
});

const virtualizer = useVirtualizer(
  computed(() => {
    const arr = items.value;
    const pin = activeIndex.value;
    const size = activeSize.value;
    return {
      count: arr.length,
      getScrollElement: () => scrollRef.value,
      // A card coming from another column gets its real height before it is measured.
      estimateSize: (index: number) => (index === pin && size ? size.height + GAP : 72),
      // …getItemKey, rangeExtractor and onChange as above
    };
  }),
);
```

- Передавайте каждой колонке её данные как `shallowRef`: список записывает в него свои броски, а
1000 карточек не получают глубоких прокси.
- `activeSize` — размер перетаскиваемого элемента в начале драга. Добавьте то, что ваш слот
ставит вокруг карточки: здесь промежуток под ней (`GAP`) — это padding слота, так что
виртуализатор тоже его измеряет.
- Заголовок считает `items.length`, черновик: число меняется в тот момент, когда карточка
входит или уходит.

## Что остаётся смонтированным

Перетаскиваемая строка может размонтироваться во время драга: она прокрутилась за пределы
диапазона, или виртуализатор переиспользовал её компонент. Драг это переживает. Оверлей
продолжает показывать элемент, выделение хранится по id, а элемент приземляется туда, куда его
ставит черновик. Анимации затрагивают только смонтированные строки.

Где виртуализатор это позволяет, всё же держите перетаскиваемую строку смонтированной, как
рецепт TanStack делает через `rangeExtractor`. Список говорит, какая это строка:

<table>
<thead>
  <tr>
    <th>
      Возвращает список
    </th>
    
    <th>
      Для чего
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        items
      </code>
    </td>
    
    <td>
      Черновик: передайте его виртуализатору.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeIndex
      </code>
    </td>
    
    <td>
      Индекс строки, которую нужно держать смонтированной, в черновике этого списка; <code>
        -1
      </code>
      
      , если её здесь нет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeKey
      </code>
    </td>
    
    <td>
      Ключ этой строки; <code>
        null
      </code>
      
      , если её здесь нет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeSize
      </code>
    </td>
    
    <td>
      Размер перетаскиваемой строки в начале драга: оценивайте по нему входящую строку.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        captureLayout()
      </code>
    </td>
    
    <td>
      Вызывайте прямо перед изменением раскладки, которое сделала не библиотека (повторное измерение). Он анимирует строки с того места, где они были. Вне драга он ничего не делает.
    </td>
  </tr>
</tbody>
</table>

## Деревья

`makeSortableTree` возвращает плоский `items` из видимых строк, так что дерево виртуализируется
как список: ключи по `node.key`, а `activeIndex` и `activeKey` называют строку, которую нужно
держать смонтированной. См. [Деревья](https://zizigy.github.io/docs/guides/trees).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
