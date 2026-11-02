---
title: "Провайдер"
description: "DnDProvider отвечает за каждый драг под собой. Он находит цель, запускает драги, прокручивает и сообщает useDnD и useDnDMonitor обо всём, что происходит."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Один провайдер на приложение

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <RouterView />
  </DnDProvider>
</template>
```

Поставьте один `DnDProvider` повыше, в `App.vue` или в лейаут, и забудьте о нём. Каждый
композабл (`makeSortableList`, `makeDraggable`, `useDnD`…) ищет ближайший провайдер над
компонентом, в котором он вызван.

<warning>

Композабл должен вызываться в компоненте, **отрендеренном внутри** провайдера. Вызов в
компоненте, чей собственный шаблон содержит `<DnDProvider>`, бросает ошибку
`No <DnDProvider> found above this component`: `inject` во Vue видит только предков.

</warning>

## За что он отвечает

<table>
<thead>
  <tr>
    <th>
      Часть
    </th>
    
    <th>
      Что делает провайдер
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Ввод
    </td>
    
    <td>
      Превращает ввод указателем, касанием и с клавиатуры в драги (<code>
        sensors
      </code>
      
      , <code>
        activation
      </code>
      
      ), по одному за раз.
    </td>
  </tr>
  
  <tr>
    <td>
      Поиск цели
    </td>
    
    <td>
      Проверяет, какие цели под драгом (<code>
        collision
      </code>
      
      ), и сообщает им об этом.
    </td>
  </tr>
  
  <tr>
    <td>
      Оверлей
    </td>
    
    <td>
      Рендерит блок, который следует за указателем, телепортирует его в <code>
        body
      </code>
      
       и приземляет при броске.
    </td>
  </tr>
  
  <tr>
    <td>
      Выделение
    </td>
    
    <td>
      Один набор выделенных id, общий для всех списков и перетаскиваемых элементов под ним.
    </td>
  </tr>
  
  <tr>
    <td>
      Автоскролл
    </td>
    
    <td>
      Прокручивает контейнеры и окно, когда драг подходит к их краям.
    </td>
  </tr>
  
  <tr>
    <td>
      Live-регион
    </td>
    
    <td>
      Озвучивает для скринридеров захват, перемещения, бросок и отмену.
    </td>
  </tr>
</tbody>
</table>

Больше он ничего не рендерит: ваша разметка остаётся как есть.

## Опции вкратце

У каждой опции есть рабочее значение по умолчанию, так что обычно провайдеру не передают
ничего. Провайдер читает пропсы тогда, когда они ему нужны: демо ниже переключают
`collision`, `activation` и `autoScroll` на лету.

<table>
<thead>
  <tr>
    <th>
      Проп
    </th>
    
    <th>
      По умолчанию
    </th>
    
    <th>
      Что задаёт
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        collision
      </code>
    </td>
    
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      Как выбирается цель под драгом. <a href="#finding-the-target">
        Ниже
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      мышь 4 px, касание 200 ms
    </td>
    
    <td>
      Когда нажатие становится драгом, для каждого типа указателя. <a href="#when-a-press-becomes-a-drag">
        Ниже
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      включён
    </td>
    
    <td>
      Прокрутка у краёв: <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       или <code>
        false
      </code>
      
      . <a href="#auto-scroll">
        Ниже
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        haptics
      </code>
    </td>
    
    <td>
      короткая вибрация при захвате касанием
    </td>
    
    <td>
      Вибрации для драгов касанием, или <code>
        false
      </code>
      
      . <a href="#haptics-and-the-copy-key">
        Ниже
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        copyModifier
      </code>
    </td>
    
    <td>
      <code>
        'Alt'
      </code>
    </td>
    
    <td>
      Клавиша, которая, если её держать во время драга, превращает перемещение в копирование.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Правила движения для каждого драга: см. <a href="/docs/guides/constraints">
        ограничения
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animation
      </code>
      
       / <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      включены
    </td>
    
    <td>
      Скольжение элементов при сортировке / приземление оверлея: см. <a href="/docs/guides/animations">
        анимации
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animate
      </code>
    </td>
    
    <td>
      выключен
    </td>
    
    <td>
      Значение по умолчанию для списков и деревьев: анимировать изменения данных, сделанные не драгом.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Space / Enter, Escape
    </td>
    
    <td>
      Клавиши и шаг клавиатуры; <code>
        false
      </code>
      
       отключает перетаскивание с клавиатуры. См. <a href="/docs/guides/accessibility#the-keyboard">
        доступность
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sensors
      </code>
    </td>
    
    <td>
      указатель + клавиатура
    </td>
    
    <td>
      Что превращает ввод в драги: см. <a href="/docs/guides/sensors">
        сенсоры
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTo
      </code>
    </td>
    
    <td>
      <code>
        'body'
      </code>
    </td>
    
    <td>
      Куда телепортируется оверлей.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayFit
      </code>
    </td>
    
    <td>
      <code>
        'slot'
      </code>
    </td>
    
    <td>
      Размер оверлея: слота, в который он приземлится, или исходного элемента. См. <a href="/docs/guides/overlay">
        оверлей
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTransition
      </code>
    </td>
    
    <td>
      кроссфейд
    </td>
    
    <td>
      Как оверлей меняется с одного компонента на другой посреди драга: <code>
        false
      </code>
      
       или пропсы <code>
        <Transition>
      </code>
      
      . См. <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        цели, которые меняют оверлей
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayClass
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      Классы для содержимого оверлея (<code>
        [data-dnd-overlay-content]
      </code>
      
      ) — элемента, который анимируют целиком: подъём при захвате, посадка при приземлении. См. <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        оверлей: подъём, наклон, посадка
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayPreviews
      </code>
    </td>
    
    <td>
      <code>
        5
      </code>
    </td>
    
    <td>
      Мульти-драг: сколько перетаскиваемых элементов получают клон при захвате, или <code>
        'all'
      </code>
      
      . См. <a href="/docs/guides/multi-drag#the-default-overlay">
        оверлей по умолчанию
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        announcements
      </code>
    </td>
    
    <td>
      встроенные
    </td>
    
    <td>
      Тексты для скринридеров, или <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        screenReaderInstructions
      </code>
    </td>
    
    <td>
      встроенный
    </td>
    
    <td>
      Текст, на который каждый перетаскиваемый элемент ссылается через <code>
        aria-describedby
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defaultStyles
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      Внедряет CSS с нулевой специфичностью для состояний драга: см. <a href="/docs/guides/styling">
        стилизацию
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Полный список со всеми формами — в [API DnDProvider](https://zizigy.github.io/docs/api/dnd-provider). Провайдер также
эмитит `drag-start`, `drag-move`, `drag-over`, `drag-end`, `drag-cancel` и `drag-settle` — те же события,
что слышит `useDnDMonitor`.

## Читайте драг: `useDnD()`

<example height="27rem" hint="Перетащите задачу и следите за состоянием" name="provider-state">



</example>

`useDnD()` возвращает драг как реактивное состояние в любом компоненте под провайдером:

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      Поле
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
        status
      </code>
    </td>
    
    <td>
      <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
       (нажатие ждёт активации), <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       (драг не идёт, но оверлей ещё приземляется, или асинхронный <code>
        onBeforeDrop
      </code>
      
       принимает решение), <code>
        'selecting'
      </code>
      
       (рамка выделения).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      Что перетаскивается: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
       (все перетаскиваемые id, взятый первым), <code>
        items
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        sensor
      </code>
      
      . <code>
        null
      </code>
      
       в простое.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Цель под драгом: <code>
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
      
       и <code>
        accepted
      </code>
      
      . <code>
        null
      </code>
      
      , если под драгом ничего нет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      Указатель в координатах вьюпорта, после модификаторов.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.progress
      </code>
    </td>
    
    <td>
      От <code>
        0
      </code>
      
       до <code>
        1
      </code>
      
      , пока нажатие ждёт активации: рисуйте по нему кольцо.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      Автоскролл что-то прокручивает.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      Выделение провайдера: <code>
        ids
      </code>
      
      , <code>
        has
      </code>
      
      , <code>
        add
      </code>
      
      , <code>
        delete
      </code>
      
      , <code>
        toggle
      </code>
      
      , <code>
        set
      </code>
      
      , <code>
        clear
      </code>
      
      . См. <a href="/docs/guides/multi-drag">
        мульти-драг
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Отменяет текущий драг (элементы летят обратно), заряжающееся нажатие или рамку выделения.
    </td>
  </tr>
</tbody>
</table>

```vue [DropHint.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';

const { status, over } = useDnD();
const refused = computed(() => status.value === 'dragging' && over.value?.accepted === false);
</script>

<template>
  <p v-if="refused" role="status">This list doesn't take that.</p>
</template>
```

Как только решение о броске принято, `active`, `over` и `pointer` читаются как `null`, даже
пока оверлей ещё приземляется (`status` равен `'dropping'`). UI, построенный на них, никогда
не показывает старый драг рядом с новыми данными. Пока ждёт асинхронный `onBeforeDrop`,
состояние остаётся таким, каким было в момент отпускания.

Следующий драг не ждёт приземления: он начинается сразу, и `status` равен `'dragging'`, пока
вокруг него приземляется последний оверлей. Нажатие на приземляющийся оверлей ловит его
в полёте: драг продолжается с того места, где находится оверлей. `onDragSettle` сообщает,
когда оверлей драга добрался до места.

## Слушайте каждый драг: `useDnDMonitor()`

```ts
import { useDnDMonitor } from '@vue-dnd-kit/core';

useDnDMonitor({
  onDragStart: ({ active }) => {},
  onDragMove: ({ pointer, delta }) => {},
  onDragOver: ({ over }) => {},                  // the target changed
  onBeforeDrop: (e) => 'accept',                 // or 'reject', 'continue', some ids; may be async
  onDragEnd: ({ active, over, dropped, accepted, position }) => {},
  onDragCancel: ({ active }) => {},
  onDragResume: ({ active }) => {},              // onBeforeDrop answered 'continue'
  onDragSettle: ({ active, over }) => {},        // its overlay has landed
});
```

Монитор слышит каждый драг под своим провайдером, где бы тот ни начался: панель выше
записывает драги списка, не импортируя его. Монитор останавливается, когда размонтируется
компонент, который его вызвал.

<table>
<thead>
  <tr>
    <th>
      Событие
    </th>
    
    <th>
      Когда
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
      Драг начинается.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      Драг движется.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      Меняется цель под драгом.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Драг отпущен. Его ответ решает судьбу броска: см. <a href="/docs/guides/drop-decisions">
        решение о броске
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      Бросок состоялся. Сортируемые списки уже выполнили свой <code>
        onDrop
      </code>
      
       и записали новый порядок. <code>
        dropped
      </code>
      
       равен <code>
        false
      </code>
      
      , если драг закончился не над целью.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Escape, бросок на цель, которая его отклоняет, или <code>
        onBeforeDrop
      </code>
      
      , ответивший <code>
        'reject'
      </code>
      
      .
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
      
       ответил <code>
        'continue'
      </code>
      
      : ничего не брошено, и драг продолжается.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      Оверлей драга приземлился (или улетел обратно, или его поймал следующий драг), с тем же событием, что получил <code>
        onDragEnd
      </code>
      
       или <code>
        onDragCancel
      </code>
      
      . Тем временем могли начаться другие драги.
    </td>
  </tr>
</tbody>
</table>

Каждое событие несёт `active`, `over`, `pointer`, `delta` (смещение от начала),
`position` (где перетаскиваемый блок находится в `over`, см.
[drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)) и, для элементов
из сортируемого списка, `source`. Полные формы — в [API событий](https://zizigy.github.io/docs/api/events).

<note>

`onDragEnd` — место для работы «после броска»: сохранения, сброса выделения, аналитики.
Собственный `onDrop` списка выполняется **до** его записи, поэтому видит ещё старый порядок.

</note>

## Поиск цели

Выберите функцию, затем перетащите булавку или карточку над целями. Бейджи показывают, как
функция ранжирует их на этом кадре; зелёная — цель.

<example height="33rem" hint="Переключите функцию, перетащите над вложенными, маленькими и перекрывающимися целями" name="collision-lab">



</example>

На каждом кадре драга провайдер передаёт `collision` цели в игре, а она возвращает их id,
лучшие первыми. В библиотеке пять функций:

<table>
<thead>
  <tr>
    <th>
      Функция
    </th>
    
    <th>
      Ранжирует
    </th>
    
    <th>
      Подходит для
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      То, что под указателем; если там ничего нет — то, что перекрывает перетаскиваемый блок.
    </td>
    
    <td>
      По умолчанию: точно под указателем, снисходительно в промежутках.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Только то, что под указателем, самые внутренние первыми.
    </td>
    
    <td>
      Точных целей: бросок в промежуток никуда не попадает.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Все цели, которые перекрывает перетаскиваемый блок: выше <code>
        priority
      </code>
      
      , затем глубже вложенность, затем больше перекрытие.
    </td>
    
    <td>
      Больших элементов над маленькими целями, когда указатель у края элемента.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Все цели, по расстоянию от центра блока до их центров.
    </td>
    
    <td>
      Случаев, когда кто-то должен победить всегда, даже издалека: сеток и списков из элементов одного размера.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Все цели, по расстояниям между четырьмя углами.
    </td>
    
    <td>
      Колонок, стоящих рядом (канбан), целей очень разной высоты.
    </td>
  </tr>
</tbody>
</table>

Под указателем проверка попадания учитывает то, что видит пользователь: из перекрывающихся
целей попадает только верхняя (`front`, никогда `back` там, где они перекрываются), а из
вложенных первой идёт самая внутренняя (`subfolder`, затем `folder`).

### Своя функция

```ts [magnet.ts]
import type { CollisionDetection, Coordinates, Rect } from '@vue-dnd-kit/core';

/** How far the point is from the rect: 0 inside it. */
const gap = (rect: Rect, point: Coordinates) =>
  Math.hypot(
    Math.max(rect.left - point.x, 0, point.x - rect.right),
    Math.max(rect.top - point.y, 0, point.y - rect.bottom),
  );

/** What is under the pointer; in a gap, the nearest target within 40px. */
export const magnet: CollisionDetection = ({ hits, pointer, candidates }) => {
  if (hits.length) return hits;
  return candidates
    .filter((candidate) => gap(candidate.rect, pointer) <= 40)
    .sort((a, b) => gap(a.rect, pointer) - gap(b.rect, pointer))
    .map((candidate) => candidate.id);
};
```

<table>
<thead>
  <tr>
    <th>
      Аргумент
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
        pointer
      </code>
    </td>
    
    <td>
      Указатель, после модификаторов.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      Перетаскиваемый блок в том виде, в каком он показан; <code>
        null
      </code>
      
       без оверлея.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      Все цели в игре: <code>
        id
      </code>
      
      , <code>
        rect
      </code>
      
       (его видимая часть, обрезанная скролл-контейнерами), <code>
        priority
      </code>
      
      , <code>
        depth
      </code>
      
       (<code>
        0
      </code>
      
       на верхнем уровне, больше при вложенности).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      Цели под указателем, по результатам проверки попадания, лучшие первыми.
    </td>
  </tr>
</tbody>
</table>

Верните пустой массив, чтобы сказать «цели нет». Отключённые цели, цели внутри
перетаскиваемых элементов и цели, скрытые своими скролл-контейнерами, в функцию не попадают.
Цель, которая отклоняет драг, всё равно участвует: над ней `over.accepted` равен `false`, и
бросок отклоняется (цель внутри сортируемого элемента вместо этого уступает, чтобы список
сортировался над ней). Демо оборачивает выбранную функцию, чтобы записать её ранжирование:
`(args) => (ranked.value = detect(args))`.

<note>

Провайдер гасит переключения, которые запрашивает функция. Цель, которую драг только что
покинул, не может снова победить, пока указатель не сдвинется на 10 px, поэтому границы не
мерцают. Между целями, вложенными в одного родителя (промежутки колонки карточек), остаётся
последняя цель.

</note>

## Когда нажатие становится драгом

Нажатие не начинает драг сразу. `activation` задаёт для каждого типа указателя (`mouse`,
`touch`, `pen`), чего оно ждёт: расстояния `distance` в px, задержки `delay` в ms (с допуском
`tolerance`, за которым нажатие сдаётся, чтобы страница могла прокручиваться) или того, что
наступит раньше.

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      Указатель
    </th>
    
    <th>
      По умолчанию
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        mouse
      </code>
      
      , <code>
        pen
      </code>
    </td>
    
    <td>
      <code>
        { distance: 4 }
      </code>
      
      : клик остаётся кликом. Нажатие мышью на <code>
        handle
      </code>
      
       начинает драг сразу и остаётся кликом, если мышь не сдвинулась.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        touch
      </code>
    </td>
    
    <td>
      <code>
        { delay: 200, tolerance: 5 }
      </code>
      
      : долгое нажатие, чтобы списки продолжали прокручиваться под пальцем.
    </td>
  </tr>
</tbody>
</table>

Тип, который вы не указали, сохраняет значение по умолчанию. Собственная `activation`
перетаскиваемого элемента важнее, чем у [области перетаскивания](https://zizigy.github.io/docs/guides/constraints), а
та — важнее, чем у провайдера. Пока нажатие ждёт, `useDnD().status` равен `'activating'`, а
`activation.progress` идёт от `0` до `1`; Escape или `useDnD().cancel()` отменяет его.
Попробуйте условия вживую и нарисуйте по прогрессу кольцо долгого нажатия в
[сенсорах](https://zizigy.github.io/docs/guides/sensors#activation-constraints).

## Автоскролл

Перетащите канал к верху или к низу списка. Зелёные полосы — краевые зоны: чем глубже в
зону, тем быстрее прокручивается список.

<example height="37.5rem" hint="Перетащите канал в зелёные полосы" name="auto-scroll-edges">



</example>

Любой элемент с `overflow: auto` или `scroll` прокручивается сам, как и окно. Провайдер
сначала прокручивает контейнер под указателем, затем его предков, затем окно.

<table>
<thead>
  <tr>
    <th>
      Опция
    </th>
    
    <th>
      По умолчанию
    </th>
    
    <th>
      Что задаёт
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        0.2
      </code>
    </td>
    
    <td>
      Краевая зона как доля размера контейнера, от 24 до 96 px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        acceleration
      </code>
    </td>
    
    <td>
      <code>
        10
      </code>
    </td>
    
    <td>
      Скорость у самого края, в px за кадр. Она растёт с квадратом глубины в зоне, поэтому начало медленное и точное.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSpeed
      </code>
    </td>
    
    <td>
      <code>
        25
      </code>
    </td>
    
    <td>
      Максимальная скорость. За краем (указатель вне контейнера) скорость продолжает расти до неё.
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` отключает его. Направление прокручивается, только когда указатель
сдвинулся в эту сторону, поэтому элемент, взятый у края, не прокручивает сам по себе.
Списки, деревья и [области перетаскивания](https://zizigy.github.io/docs/guides/constraints) принимают собственный
`autoScroll` для своего контейнера:

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

Перетаскивание с клавиатуры никогда не использует автоскролл: вместо этого оно прокручивает
элемент в зону видимости. `isAutoScrolling` (из `useDnD()` или из области перетаскивания)
равен `true`, пока что-то прокручивается.

## Вибрация и клавиша копирования

Драг касанием коротко вибрирует при старте. `:haptics="false"` отключает это; объект
задаёт каждую вибрацию:

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      Ключ
    </th>
    
    <th>
      Вибрирует, когда
    </th>
    
    <th>
      По умолчанию
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        start
      </code>
    </td>
    
    <td>
      Долгое нажатие превращается в драг.
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (10 ms)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      Драг входит в цель, которая его принимает.
    </td>
    
    <td>
      выключено
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      Бросок состоялся.
    </td>
    
    <td>
      выключено
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      Бросок отклонён, и элементы летят обратно.
    </td>
    
    <td>
      выключено
    </td>
  </tr>
</tbody>
</table>

Каждый принимает `true` (шаблон по умолчанию), длительность в ms, шаблон «вкл/выкл» или
`false`. Вибрируют только драги, начатые касанием, а iOS Safari не умеет вибрировать вовсе.

`copyModifier` — клавиша, которая, если её держать во время драга между списками, превращает
перемещение в копирование: по умолчанию `'Alt'`, любой `KeyboardEvent.key` или `null`, чтобы
её не было. Списку, из которого берутся элементы, нужна функция `clone`; см.
[списки с общими элементами](https://zizigy.github.io/docs/guides/shared-lists).

## Несколько провайдеров

Большинству приложений нужен ровно один. Поместите список желаний под собственный провайдер
и попробуйте перенести книгу: она не может покинуть свой провайдер, а внешний монитор
перестаёт слышать список желаний.

<example height="33.5rem" hint="Перенесите книгу, затем дайте списку желаний собственный провайдер" name="provider-nested">



</example>

```vue
<DnDProvider>
  <Shelf v-model="reading" />
  <DnDProvider>
    <Shelf v-model="wishlist" />
    <EventLog />            <!-- hears the inner provider's drags only -->
  </DnDProvider>
</DnDProvider>
```

- Провайдеры независимы: драг никогда не переходит из одного в другой.
- Вложенные провайдеры допустимы. **Побеждает ближайший владелец**: элемент принадлежит
ближайшему провайдеру над ним, а внешний провайдер его игнорирует.
- У каждого провайдера своё выделение, оверлей, live-регион и мониторы.

Второй провайдер имеет смысл только для части страницы, которой нужны собственные настройки
на уровне провайдера (определение цели, клавиши клавиатуры, объявления) и элементы которой
никогда её не покидают. Если элементы не переносятся между двумя частями страницы,
проверьте, не стоят ли они под двумя провайдерами.

<tip>

Правилам для одной части страницы (доска с привязкой к сетке, лента с более долгим нажатием
касанием, панель, где ничего не перетаскивается) собственный провайдер не нужен:

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

Элементы области остаются в провайдере приложения и по-прежнему могут перемещаться куда угодно.
См. [ограничения](https://zizigy.github.io/docs/guides/constraints).

</tip>

Приложение, смонтированное в другом месте, внутри shadow root или как отдельное Vue-приложение,
может присоединиться к существующему провайдеру: передайте `useDnDContext()` в
`provideDnDContext(app, context)` перед монтированием. Проверка попадания и оверлей работают
через границы shadow root.

## SSR и Nuxt

Провайдер безопасен для SSR. Списки и элементы рендерятся на сервере, как любая другая
разметка. Оверлей и live-регион телепортируются и монтируются только на клиенте, поэтому
никогда не вызывают рассинхронизацию гидрации. Id по умолчанию берутся из `useId()` Vue и
совпадают на сервере и клиенте.

В Nuxt модуль регистрирует `DnDProvider` глобально и автоимпортирует композаблы: см.
[установку](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
