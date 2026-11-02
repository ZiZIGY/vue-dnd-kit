---
title: "Drag and drop"
description: "Свободное перетаскивание с makeDraggable и цели с makeDroppable — типизированные цели, которые принимают одни драги и отклоняют другие, план комнаты, зоны удаления, папки внутри списка и обычные элементы, которые принимает список."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/drag-and-drop"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Используйте `makeDraggable` и `makeDroppable` для всего, что не является сортируемым списком:
мусор в баки, мебель на плане комнаты, файлы в папки, корзина, шахматная доска.

<example height="29rem" hint="Рассортируйте мусор по бакам; батарейку не берёт ни один бак" name="recycling">



</example>

## Перетаскиваемый элемент

```vue [WasteItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ waste: { id: string; name: string; type: string } }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,      // read back as `active.id`
  type: () => props.waste.type,  // matched by the targets' `accept`
  data: () => props.waste,       // anything: `active.data`
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">{{ waste.name }}</div>
</template>
```

Передавайте id из ваших данных, геттером. Id по умолчанию берётся из `useId()` и новый для
каждого экземпляра компонента, поэтому остальному приложению он ни о чём не говорит. Опции
читаются тогда, когда они нужны, так что геттер или ref держат их актуальными.

<table>
<thead>
  <tr>
    <th>
      Опция
    </th>
    
    <th>
      Что делает
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      Кто перетаскивается, что он несёт и с чем сверяется <code>
        accept
      </code>
      
       целей.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Селектор или элемент внутри: только он начинает драг. См. <a href="/docs/guides/sortable-lists#handles">
        ручки
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Драг не начинается.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlay
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (по умолчанию): за указателем следует копия. Компонент: ваше собственное превью. <code>
        false
      </code>
      
      : элемент двигается сам (<a href="#without-an-overlay">
        ниже
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
    
    <td>
      Зафиксировать драг по <code>
        'x'
      </code>
      
       или <code>
        'y'
      </code>
      
      , привязать к сетке, удержать в границах: см. <a href="/docs/guides/constraints">
        ограничения
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardMode
      </code>
    </td>
    
    <td>
      Как его двигают стрелки: по пикселям (по умолчанию) или от цели к цели (<a href="#keyboard">
        ниже
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
      
      , <code>
        canDrag
      </code>
    </td>
    
    <td>
      Когда нажатие становится драгом: см. <a href="/docs/guides/sensors">
        сенсоры
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        attributes
      </code>
    </td>
    
    <td>
      <code>
        role
      </code>
      
      , <code>
        tabindex
      </code>
      
       и <code>
        aria-*
      </code>
      
       для клавиатуры и скринридеров (по умолчанию <code>
        true
      </code>
      
      ).
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Возвращает
    </th>
    
    <th>
      Что это
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      Этот элемент перетаскивается.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Записываемый, связан с <a href="/docs/guides/multi-drag">
        выделением
      </a>
      
       провайдера.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      Смещение драга, для <code>
        overlay: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
    </td>
    
    <td>
      Используемый id.
    </td>
  </tr>
</tbody>
</table>

Кнопки, поля ввода и другие интерактивные потомки не начинают драг указателем, поэтому
внутри перетаскиваемого элемента они продолжают работать. Все опции — в
[API makeDraggable](https://zizigy.github.io/docs/api/make-draggable).

## Цель

```vue [Bin.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[] }>();
const emit = defineEmits<{ drop: [id: Key] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,   // 'glass', ['paper', 'cardboard'], a function…
  onDrop: (event) => emit('drop', event.active.id),
});
</script>

<template>
  <section ref="el" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" />
  </section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Возвращает
    </th>
    
    <th>
      <code>
        true
      </code>
      
      , когда
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isOver
      </code>
    </td>
    
    <td>
      Драг над этой целью, принимает она его или нет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAccepting
      </code>
    </td>
    
    <td>
      Что-то перетаскивается, и эта цель это принимает: подсвечивайте подходящие цели.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placement
      </code>
    </td>
    
    <td>
      Не булево значение: <code>
        { top, right, bottom, left }
      </code>
      
       — половины цели, в которых находится указатель, или <code>
        null
      </code>
      
      , когда над ней ничего нет. Используйте его для «перед / после этой карточки».
    </td>
  </tr>
</tbody>
</table>

`isOver` без `isAccepting` означает, что драг над целью, которая его отклоняет. Покажите это,
как баки выше: бросок туда отменяется, и элемент летит обратно. Баки, которые не могут
принять элемент, тускнеют, пока он движется; больше вариантов — в
[стилизации](https://zizigy.github.io/docs/guides/styling#drop-targets-yes-and-no).

<table>
<thead>
  <tr>
    <th>
      Опция
    </th>
    
    <th>
      Что делает
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      Читаются как <code>
        over.id
      </code>
      
       и <code>
        over.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
    
    <td>
      Какие драги она принимает (<a href="#which-drags-a-target-takes">
        следующий раздел
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Она ничего не принимает, и драги проходят над ней.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        priority
      </code>
    </td>
    
    <td>
      Побеждает большее, когда цели перекрываются без вложенности (по умолчанию 0).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
    </td>
    
    <td>
      Драг вошёл или вышел.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , <code>
        onDrop
      </code>
    </td>
    
    <td>
      Решить судьбу броска, затем применить его (<a href="#the-drop">
        ниже
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Какие драги принимает цель

`type` перетаскиваемого элемента сверяется с `accept` цели:

<table>
<thead>
  <tr>
    <th>
      <code>
        accept
      </code>
    </th>
    
    <th>
      Принимает
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      не задан или <code>
        '*'
      </code>
    </td>
    
    <td>
      Всё.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'glass'
      </code>
    </td>
    
    <td>
      Перетаскиваемые элементы типа <code>
        glass
      </code>
      
       и элементы без типа.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ['paper', 'cardboard']
      </code>
    </td>
    
    <td>
      Любой из двух типов и элементы без типа.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ({ active, items, types }) => boolean
      </code>
    </td>
    
    <td>
      То, что скажет ваша функция.
    </td>
  </tr>
</tbody>
</table>

Перетаскиваемый элемент без `type` подходит под любое строковое правило. `type` может быть и
массивом (`['paper', 'large']`): достаточно одного совпавшего типа. Функция решает по чему
угодно в драге. Бак для компоста выше читает данные элементов, а не их тип:

```ts [waste.ts]
{
  id: 'compost',
  accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
}
```

`accept` читается вживую, пока драг ищет цель: передайте ref, чтобы его менять.

Когда перетаскиваются сразу несколько элементов, `acceptMode` говорит, сколько из них должны
подойти: `'all'` (по умолчанию) или `'some'`. С `'some'` верните из `onBeforeDrop` id, которые
нужно оставить, а остальные полетят обратно. См. [решение о броске](https://zizigy.github.io/docs/guides/drop-decisions).

## Бросок

`onDrop` обычной цели — место, где данные меняете **вы**. Сама библиотека ничего не
перемещает:

```vue [index.vue]
<script setup lang="ts">
/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
</template>
```

<table>
<thead>
  <tr>
    <th>
      Поле события
    </th>
    
    <th>
      Что в нём
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      Драг: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
       (каждый — <code>
        { id, data, type, item }
      </code>
      
      ), <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Эта цель: <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        accepted
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
      
      , <code>
        delta
      </code>
    </td>
    
    <td>
      Где указатель и насколько он сдвинулся от начала.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Где перетаскиваемый блок находится в этой цели (<a href="#leave-it-where-it-was-dropped">
        следующий раздел
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        source
      </code>
    </td>
    
    <td>
      Задан, когда элементы пришли из сортируемого списка: <code>
        { list, remove() }
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`active.ids` содержит все перетаскиваемые id, взятый первым. Порядок такой: `onBeforeDrop`
(решить), `onDrop` (применить), затем `drag-end` провайдера. Чтобы слышать каждый драг
страницы в одном месте, используйте `useDnDMonitor` (см. [провайдер](https://zizigy.github.io/docs/guides/provider)).
Чтобы спросить перед броском, продолжить драг или принять только часть элементов, см.
[решение о броске](https://zizigy.github.io/docs/guides/drop-decisions).

## Оставить там, где бросили

План комнаты, холст, доска: элемент остаётся там, где вы его отпустили. Каждое событие несёт
`position` — `left` / `top`, которые ставят абсолютно позиционированный элемент туда, где его
бросили.

<example height="28rem" hint="Перетащите мебель в комнату, подвигайте её или верните обратно" name="room-planner">



</example>

```ts [Planner.vue]
const room = useTemplateRef<HTMLElement>('room');
makeDroppable(room, {
  id: 'room',
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    // Clamped, so a piece let go half outside stays inside the walls.
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});
```

```vue [Piece.vue]
<div ref="el" class="piece" :style="{ left: `${piece.x}px`, top: `${piece.y}px` }">…</div>
```

`position` — левый верхний угол перетаскиваемого блока в `over`, отсчитанный от края его
padding, с учётом прокрутки: рамка комнаты, её стены, не учитывается. Над пустым местом он
равен `null`.

<tip>

Не вычисляйте место из `active.rect` и `delta`: так теряются рамка и прокрутка цели. Сетки,
границы и фиксация оси для таких досок — в [ограничениях](https://zizigy.github.io/docs/guides/constraints).

</tip>

## Без оверлея

По умолчанию за указателем следует копия элемента, а сам элемент остаётся на месте: так
работает мебель на складе. С `overlay: false` копии нет, и элемент двигается сам, по
`transform`, который возвращает драг: так работает мебель в комнате.

```ts [Piece.vue]
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),   // a value or a ref, read when the drag starts
});

const style = computed(() => ({
  left: `${props.piece.x}px`,
  top: `${props.piece.y}px`,
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
```

- Тогда `position` — угол самого элемента, так что обработчик броска не меняется.
- Элемент находится под указателем, пока движется; при поиске цели библиотека смотрит сквозь
него. Поднимите его над соседями, пока он перетаскивается (`z-index`).
- Он прокручивается вместе со страницей, а оверлей — нет: `transform` вычитает то, на сколько
сдвинулся его контейнер с начала драга, так что при прокрутке страницы он остаётся под указателем.
- Он движется внутри своего контейнера: родитель с `overflow: hidden` его обрезает, а его
контекст наложения решает, над чем он проходит. У оверлея нет ни той, ни другой проблемы.

Для своего превью вместо копии см. [оверлей](https://zizigy.github.io/docs/guides/overlay).

## Зоны удаления

Драг, который начинается в сортируемом списке, несёт `e.source`. Вызовите `remove()`, и
список уберёт элементы:

<example height="34rem" hint="Перетащите уведомление в Done или Delete, затем отмените" name="triage">



</example>

```ts [Triage.vue]
const triage = (bin: 'done' | 'deleted') => (e: DnDEvent) => {
  bins[bin].push(...e.active.items.map((entry) => entry.item as Notice));
  e.source?.remove();
};

makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });
```

- `e.active.items[i].item` — сам элемент списка. Сохраните его, и отмена вернёт его на
прежнее место.
- Затем собственный `onDrop` списка выполняется с `to.index === -1`, а `e.result` содержит
список без этих элементов.
- Оверлей сжимается в зону, потому что элемент больше нигде не показан.
- Список может и сам убирать то, что брошено вне всего: см.
[`dropOutside`](https://zizigy.github.io/docs/guides/shared-lists#dropping-outside).

<note>

С клавиатуры стрелки перемещают элемент списка между слотами его списка и списками его
группы; за концом списков следующее нажатие несёт его дальше, к цели в этом направлении — здесь к
корзине, — а стрелка в обратную сторону возвращает его назад. Кнопка, меню или клавиша `Delete` для многих всё же быстрее: предложите
и их.

</note>

## Бросок в сортируемый элемент

Строка сортируемого списка тоже может быть целью: папка, которая принимает закладки, группа,
которая принимает задачи. Поставьте droppable на элемент строки:

<example height="28rem" hint="Бросьте ссылку на середину папки; у её краёв идёт сортировка. Откройте папку, чтобы вытащить ссылки" name="bookmarks">



</example>

```ts [FolderRow.vue]
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link)); // Bookmarks adds them
    e.source?.remove();   // take them out of the list they came from
  },
});
```

Открытая папка показывает свои ссылки списком той же группы, который принимает только ссылки:
они сортируются там, и их можно вытащить обратно на верхний уровень или в другую папку.

Пока список сортировал бы драг, такая цель учитывается только в **середине** своего элемента
(от 25 до 75 % по оси списка). Там бросок попадает в элемент, и список не двигается. У краёв
список сортирует как обычно.

- Цель, чей `accept` отклоняет драг, пропускается: список сортирует над этим элементом, как
над любым другим. Папки принимают только ссылки, поэтому перетаскиваемая папка сортируется мимо остальных.
- Цель никогда не получает собственный драг.
- С клавиатуры стрелка сначала останавливается на папке; следующее нажатие в ту же сторону
проходит мимо неё.
- После броска элемент больше не показан, поэтому оверлей сжимается в папку, а не летит
обратно.
- Над папкой список оставляет слот перетаскиваемой строки на прежнем месте, чтобы под
указателем ничего не сдвигалось. Слот получает тогда `data-dnd-placeholder="into"`: бросок
туда не попадёт, так что его можно скрыть (`[data-dnd-placeholder='into'] { opacity: 0 }`).

[Файловый менеджер](https://zizigy.github.io/docs/examples/file-manager) делает то же самое в сетке, с вложенными
папками.

## Обычные перетаскиваемые элементы в список

Сортируемый список принимает элементы, перетаскиваемые с `makeDraggable`, если знает, как
сделать из них элемент:

<example height="26rem" hint="Перетащите блок в расписание; время подстраивается под драг" name="day-planner">



</example>

```ts [Agenda.vue]
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});
```

Пока перетаскиваемый элемент над списком, созданный элемент находится в черновике и
рендерится вашим шаблоном, как любая другая строка: время в расписании уже его учитывает.
Настоящим он становится при броске (`mode: 'insert'`, `from.list === null`), и оверлей
приземляется на него.

- Верните `undefined`, чтобы отказать. Списки без `createItem` игнорируют обычные
перетаскиваемые элементы.
- Дайте новому элементу собственный ключ: блок остаётся в палитре.
- С клавиатуры стрелка в сторону списка забирает перетаскиваемый элемент на его уровне, а
следующие стрелки двигают его по слотам.

## Файлы с компьютера

Файлы, перетащенные с рабочего стола или из файлового менеджера, — не драги библиотеки: их
несёт браузер. Цель принимает их с `external`, а бросок приносит их в `e.external`:

<example height="22rem" hint="Перетащите изображения или PDF-файлы с компьютера на зоны" name="file-drop">



</example>

```ts [AvatarDrop.vue]
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});
```

- `files` читается как `<input accept>`: MIME-типы (`image/*`, `application/pdf`) и
расширения (`.md`). `true` принимает любой файл, функция решает по каждому файлу. `links` и
`text` принимают то, что перетаскивают другие приложения и вкладки, `types` — любой другой
MIME-тип.
- Драг идёт как драг провайдера: `isOver`, `isAccepting`, события и объявления работают как
для любого другого. Цели без `external` его игнорируют. Оверлея нет: перетаскиваемое
изображение рисует браузер.
- Пока файлы держат над страницей, браузер сообщает только их типы (`e.external.fileTypes`).
Имена, размеры и содержимое приходят с броском, и тогда же проверяются расширения. Папки
пропускаются; с `multiple: false` драг нескольких файлов отклоняется.

Списки тоже принимают файлы, ссылки и текст и освобождают для них место, пока их держат.
Элементы могут и покидать страницу — в другое приложение или в другое ваше окно: см.
[файлы и другие приложения](https://zizigy.github.io/docs/guides/native).

<tip>

Пользователи клавиатуры и скринридеров не могут перетаскивать файлы. Поставьте рядом с зоной
`<input type="file">`, как демо делает с кнопкой Browse.

</tip>

## Клавиатура

Перетаскиваемый элемент в фокусе берётся клавишей <kbd value="Space">



</kbd>

 или <kbd value="Enter">



</kbd>

,
бросается теми же клавишами, а <kbd value="Escape">



</kbd>

 отменяет драг. В промежутке его двигают
стрелки:

<table>
<thead>
  <tr>
    <th>
      <code>
        keyboardMode
      </code>
    </th>
    
    <th>
      Стрелка
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'pixels'
      </code>
      
       (по умолчанию)
    </td>
    
    <td>
      Сдвигает его на 25 px, <code>
        keyboard.step
      </code>
      
       провайдера. С <kbd value="Shift">
        
      </kbd>
      
       — в четыре раза дальше. Так двигается мебель.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'droppables'
      </code>
    </td>
    
    <td>
      Прыгает к ближайшей цели в этом направлении, которая его принимает. Мусор прыгает от бака к баку и пропускает баки, которые его отклоняют.
    </td>
  </tr>
</tbody>
</table>

```ts
makeDraggable(el, { id: () => props.waste.id, type: () => props.waste.type, keyboardMode: 'droppables' });
```

Клавиши можно переназначить на провайдере. Подробнее — в [доступности](https://zizigy.github.io/docs/guides/accessibility).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
