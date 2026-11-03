---
title: "Переход с v2"
description: "Перенос приложения с v2 на v3 — что изменилось и почему, обновление, соответствие каждого API v2 его замене в v3, код до и после для типичных случаев и подводные камни."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — это переписанная v2. Модель осталась прежней: один провайдер и композаблы, которые вы
вызываете на своих элементах. Но большинство имён и опций изменилось, сортировка переехала в
библиотеку, а обработчик броска, который вы писали для каждого списка, больше не нужен. Эта
страница сопоставляет каждую часть v2 с v3, а затем показывает типичные случаи до и после.

## Что изменилось

- **Сортировка встроена.** В v2 список был зоной сброса, его строки — перетаскиваемыми
элементами с данными `[index, items]`, а сортировали вы в `onDrop` через
`e.helpers.suggestSort()`. В v3 это делают `makeSortableList` и `makeSortableItem`: список
рендерит **черновик** вашего массива, который перестраивается во время драга, а бросок
записывает новый массив в ваш ref. Большинство обработчиков броска из v2 удаляются, а не
переносятся.
- **Всё движется само.** Строки плавно встают на новые места (FLIP), оверлей при броске
приземляется на свой слот, а при отмене летит обратно. `<TransitionGroup>` больше не нужен.
- **По-прежнему один пакет.** В `@vue-dnd-kit/core` есть списки, деревья, мульти-драг,
модификаторы, сенсоры и функции определения коллизий. Nuxt-модуль остаётся;
`@vue-dnd-kit/actions` (программное перетаскивание) и `@vue-dnd-kit/devtools` — новые и
необязательные.
- **Настоящий оверлей.** Он телепортируется в `body` и показывает глубокий клон размером со
слот, на который приземлится. Компоненты оверлея получают драг через пропсы, а не читают
внутренности провайдера.
- **Id, а не элементы.** Выделение, события и состояние драга привязаны к id из ваших данных.
Никаких карт DOM-элементов читать не нужно.
- **Типы и правила accept** заменяют `groups` для обычных перетаскиваемых элементов и целей.
Списки обмениваются элементами по имени `group`.
- **Решения до броска.** `onBeforeDrop` принимает бросок, отклоняет его, продолжает драг или
берёт часть элементов. `onDrop` только применяет.
- **Сенсоры.** Ввод указателем и с клавиатуры — это сенсоры. Активация задаётся для каждого типа
указателя, а драги касанием начинаются с долгого нажатия, поэтому списки продолжают
прокручиваться под пальцем.
- **Области.** `makeDragArea` заменяет `makeConstraintArea` и `makeAutoScroll`, а автоскролл
работает в любом скролл-контейнере без кода.
- **Доступность включена по умолчанию**: ARIA-атрибуты, фокус, который возвращается после
броска, и озвучивание для скринридеров.

## Обновление

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@^3
```

```bash [yarn]
yarn add @vue-dnd-kit/core@^3
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@^3
```

```bash [bun]
bun add @vue-dnd-kit/core@^3
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      Пакет
    </th>
    
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.x, необязательный
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.x, необязательный
    </td>
  </tr>
</tbody>
</table>

- Приложение, у которого в `package.json` стоит `"@vue-dnd-kit/core": "^2…"`, остаётся на v2,
пока диапазон не станет `^3`.
- Vue **3.5** или новее. У v2 не было зависимостей; у v3 одна — `@vueuse/core` (14 или 15).
- Браузеры: Chrome и Edge 104+, Safari 15.4+, Firefox 104+.
- У v2 и v3 одно имя пакета, поэтому приложение переходит на v3 целиком. Слоя совместимости
нет. Документация v2 по-прежнему доступна в меню версий вверху страницы.

Хороший порядок работы:

1. Обновите пакеты и переименуйте пропсы провайдера ([ниже](#the-provider)).
2. Превратите каждый сортируемый список в `makeSortableList` и `makeSortableItem` и удалите его
обработчик броска.
3. Перенесите обычные перетаскиваемые элементы и зоны сброса.
4. Перенесите свои превью в компоненты оверлея или в слот `#overlay` провайдера.
5. Замените `makeConstraintArea` и `makeAutoScroll` на `makeDragArea` или ни на что.
6. Удалите обходные решения v2: `tabindex` и `aria-grabbed` на перетаскиваемых элементах,
`touch-action: none` на элементах целиком, `<TransitionGroup>` вокруг строк, `markRaw` вокруг
компонентов превью.

## Старое и новое

**Нет аналога** в таблице означает, что в v3 нет ничего с таким именем; в ячейке сказано, что
использовать вместо этого.

### Вкратце

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      <code>
        DnDProvider
      </code>
      
      , с новыми пропсами и слотом <code>
        #overlay
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable
      </code>
      
       для свободного перетаскивания; <code>
        makeSortableItem
      </code>
      
       для строк списка.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       для обычных целей; <code>
        makeSortableList
      </code>
      
       или <code>
        makeSortableTree
      </code>
      
       для списков и деревьев.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      Ничего: автоскролл работает сам. Его настраивает <code>
        makeDragArea
      </code>
      
       или <code>
        autoScroll
      </code>
      
       списка.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      <code>
        useDnD
      </code>
      
       для состояния, <code>
        useDnDMonitor
      </code>
      
       для событий.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
       и <code>
        provideDnDContext(app, context)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      : теперь это клон одного перетаскиваемого элемента, для ваших собственных оверлеев.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      , <code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      Модификатор <code>
        snapToGrid
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      , <code>
        suggestSwap
      </code>
      
      , <code>
        suggestCopy
      </code>
      
      , <code>
        suggestRemove
      </code>
    </td>
    
    <td>
      Встроены в списки: см. <a href="#sorting">
        сортировку
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Провайдер

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      , выключен, пока не задан
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      : <strong>
        включён по умолчанию
      </strong>
      
      , для окна и любого скролл-контейнера. <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       или <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      , по умолчанию рендерится внутри провайдера
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      : селектор или элемент, по умолчанию <code>
        'body'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Слот <code>
        #preview="{ preview }"
      </code>
    </td>
    
    <td>
      Слот <code>
        #overlay
      </code>
      
       с драгом в пропсах: <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        to
      </code>
      
      . См. <a href="#the-overlay">
        оверлей
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      , <code>
        forDrop
      </code>
      
      , <code>
        forCancel
      </code>
      
       (задавались в <code>
        useDnDProvider()
      </code>
      
      )
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      : по умолчанию 25 px, для свободных драгов.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      , <code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
      
       Двигают стрелки; <kbd value="Shift">
        
      </kbd>
      
       делает шаги свободного драга в четыре раза больше.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
      
       <code>
        collision
      </code>
      
       выбирает, как находится цель: <code>
        pointerFirst
      </code>
      
       (по умолчанию), <code>
        pointerWithin
      </code>
      
      , <code>
        rectIntersection
      </code>
      
      , <code>
        closestCenter
      </code>
      
      , <code>
        closestCorners
      </code>
      
       или ваша функция.
    </td>
  </tr>
  
  <tr>
    <td>
      Один провайдер на страницу, никогда не вложенный
    </td>
    
    <td>
      Вложение работает: элементом владеет ближайший провайдер. Цель по-прежнему — один провайдер на приложение.
    </td>
  </tr>
</tbody>
</table>

Новые пропсы, у которых нет аналога в v2: `activation`, `modifiers`, `sensors`, `animation`,
`dropAnimation`, `animateChanges`, `haptics`, `copyModifier`, `overlayFit`, `overlayClass`,
`overlayTransition`, `overlayPreviews`, `announcements`, `screenReaderInstructions` и
`defaultStyles`. Провайдер также эмитит `drag-start`, `drag-move`, `drag-over`, `drag-end`,
`drag-cancel`, `drag-resume` и `drag-settle`. Все они описаны в [руководстве по провайдеру](https://zizigy.github.io/docs/guides/provider).

### Чтение состояния: `useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      : <code>
        'dragging'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'selecting'
      </code>
      
      , <code>
        'pending'
      </code>
      
       или <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      : <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       или <code>
        'selecting'
      </code>
      
      . <code>
        'pending'
      </code>
      
       (асинхронный бросок) — это <code>
        'dropping'
      </code>
      
      ; <code>
        null
      </code>
      
       — это <code>
        'idle'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      , после модификаторов. У каждого события есть ещё <code>
        delta
      </code>
      
       — смещение от начала.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
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
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
       (элементы)
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
       (id): <code>
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
      
      , <code>
        ids
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      , <code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      : <code>
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
        delay.progress
      </code>
      
      , <code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      , от <code>
        0
      </code>
      
       до <code>
        1
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      , <code>
        preview.size
      </code>
      
      , <code>
        preview.render
      </code>
      
      , <code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
      
       Библиотека сама размещает оверлей и задаёт ему размер. Используйте <code>
        overlayTo
      </code>
      
      , слот <code>
        #overlay
      </code>
      
       или компоненты оверлея.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      , <code>
        droppableMap
      </code>
      
      , наборы <code>
        visible…Set
      </code>
      
      , <code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Новое: <code>
        useDnD().cancel()
      </code>
      
      , <code>
        position
      </code>
      
      , <code>
        isAutoScrolling
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

События переехали в `useDnDMonitor`: см. [события и решения о броске](#events-and-drop-decisions).
Полные структуры — в [API useDnD](https://zizigy.github.io/docs/api/use-dnd).

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      : без третьего аргумента. Строки списка используют <code>
        makeSortableItem(ref, { item })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      , нужен в виртуальных списках
    </td>
    
    <td>
      <code>
        id
      </code>
      
      : передавайте его из своих данных, геттером. Значение по умолчанию берётся из <code>
        useId()
      </code>
      
       и новое для каждого экземпляра компонента.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      : значение, ref или геттер. Читается обратно как <code>
        active.data
      </code>
      
       и <code>
        active.items[i].data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      , с которым сверяется <code>
        accept
      </code>
      
       целей. См. <a href="#groups">
        группы
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      : селектор или ref элемента.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      : проверка на каждое нажатие.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      <code>
        activation
      </code>
      
       для каждого типа указателя: <code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      . Если заданы и <code>
        distance
      </code>
      
      , и <code>
        delay
      </code>
      
      , драг начинается по тому, что наступит раньше.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
      
       Один <code>
        distance
      </code>
      
       на тип указателя.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      : компонент получает драг через пропсы. См. <a href="#the-overlay">
        оверлей
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
      
       Цель на сортируемом элементе засчитывается в его середине (от 25 до 75 %); деревья вкладывают через <code>
        nesting: 'hover'
      </code>
      
      . См. <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        бросок в сортируемый элемент
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      , <code>
        onSelfDragMove
      </code>
      
      , <code>
        onSelfDragEnd
      </code>
      
      , <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога
      </strong>
      
       на перетаскиваемом элементе: <code>
        useDnDMonitor
      </code>
      
       или <code>
        watch(isDragging)
      </code>
      
      . См. <a href="#events-and-drop-decisions">
        события
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
       и его <code>
        onDragStart
      </code>
      
      … для драгов над ним
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       на том же элементе: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Возвращает <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
    </td>
    
    <td>
      То же самое.
    </td>
  </tr>
  
  <tr>
    <td>
      Возвращает <code>
        isDragOver
      </code>
    </td>
    
    <td>
      Сортируемые элементы возвращают <code>
        indicator
      </code>
      
       (с <code>
        placeholder: 'indicator'
      </code>
      
      ) и <code>
        isPlaceholder
      </code>
      
      ; цели возвращают <code>
        placement
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Возвращает <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога
      </strong>
      
       у перетаскиваемых элементов. Цели возвращают <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Новое: <code>
        label
      </code>
      
      , <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        overlay: false
      </code>
      
       с возвращаемым <code>
        transform
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        attributes
      </code>
      
      , <code>
        native
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      . Зона, в которой лежит список, — это <code>
        makeSortableList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      : <code>
        '*'
      </code>
      
      , тип, список типов или функция.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      : самостоятельные опции, без объекта <code>
        events
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
      , который мог вернуть <code>
        false
      </code>
      
       или промис
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       решает, <code>
        onDrop
      </code>
      
       применяет. См. <a href="#events-and-drop-decisions">
        решения о броске
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , возвращающий id, которые нужно оставить.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      , читается обратно как <code>
        over.data
      </code>
      
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
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Возвращает <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Возвращает <code>
        isDragOver
      </code>
      
      : <code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
       (boolean) и <code>
        placement
      </code>
      
      : <code>
        { top, right, bottom, left }
      </code>
      
       — половины, в которых находится указатель. <code>
        center
      </code>
      
       нет.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Новое: <code>
        id
      </code>
      
      , <code>
        label
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        overOverlay
      </code>
      
      , <code>
        overDropAnimation
      </code>
      
      , <code>
        external
      </code>
      
       (файлы с компьютера).
    </td>
  </tr>
</tbody>
</table>

### Событие броска

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        IDragEvent
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      : у каждого <code>
        { id, item, data, label, type }
      </code>
      
      , взятый элемент первым. Списки получают <code>
        e.items
      </code>
      
       и <code>
        e.keys
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      , <code>
        .items
      </code>
    </td>
    
    <td>
      Списки: <code>
        e.from
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      : <code>
        items
      </code>
      
      , <code>
        placement
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      : <code>
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
      
      . Списки: <code>
        e.to
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога
      </strong>
      
      : списки сами вычисляют <code>
        e.to.index
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      Списки записывают бросок; <code>
        e.result
      </code>
      
       содержит новый массив каждого списка, который он меняет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
       у списка; <code>
        e.partner
      </code>
      
       — элемент, с которым произошёл обмен.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       или клавиша копирования (<kbd value="Alt">
        
      </kbd>
      
      ), вместе с <code>
        clone
      </code>
      
       списка; <code>
        e.mode
      </code>
      
       равен <code>
        'copy'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        e.source.remove()
      </code>
      
       в цели или <code>
        dropOutside: 'remove'
      </code>
      
       у списка.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      , <code>
        removeAt
      </code>
      
      , <code>
        removeIndexes
      </code>
      
      , <code>
        swapAt
      </code>
      
      , <code>
        getInsertSide
      </code>
      
      , <code>
        isAtZoneStart
      </code>
      
      , <code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
      
       Спискам они не нужны; у обычной цели меняйте данные как хотите.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Новое: <code>
        e.pointer
      </code>
      
      , <code>
        e.delta
      </code>
      
      , <code>
        e.position
      </code>
      
       (куда поставить элемент, брошенный на доску), <code>
        e.mode
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Сортировка

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Список на <code>
        makeDroppable
      </code>
      
       с <code>
        () => items
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Строка на <code>
        makeDraggable
      </code>
      
       с <code>
        () => [index, items]
      </code>
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Рендерить свой массив
    </td>
    
    <td>
      Рендерить возвращённый <code>
        items
      </code>
      
      : черновик, который перестраивается во время драга.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      , <code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
       (по умолчанию), <code>
        'horizontal'
      </code>
      
       или <code>
        'grid'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Сравнение по ссылке, чтобы найти исходный и целевой массивы, затем присваивание <code>
        sourceItems
      </code>
      
       и <code>
        targetItems
      </code>
    </td>
    
    <td>
      Ничего: бросок записывает каждый список, который меняет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      Встроено. <code>
        animateChanges: true
      </code>
      
       анимирует изменения, сделанные не драгом (добавление, удаление, перемешивание).
    </td>
  </tr>
  
  <tr>
    <td>
      Линия вставки по <code>
        isDragOver.top
      </code>
      
      , <code>
        .bottom
      </code>
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
       и <code>
        indicator.side
      </code>
      
       элемента. См. <a href="/docs/guides/sortable-lists#an-insertion-line">
        линию вставки
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Палитра только для копирования (<code>
        suggestCopy()
      </code>
      
       и флаг <code>
        copyOnly
      </code>
      
      )
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      , <code>
        sort: false
      </code>
      
       и <code>
        clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Зона-корзина с <code>
        suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
       или <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia или неизменяемые данные: результат присваиваете сами
    </td>
    
    <td>
      <code>
        items
      </code>
      
       как геттер, затем <code>
        e.preventDefault()
      </code>
      
       в <code>
        onDrop
      </code>
      
       и применение <code>
        e.result
      </code>
      
      . См. <a href="/docs/guides/shared-lists#controlled-lists">
        управляемые списки
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Рекурсивное дерево: зона сброса на каждую папку и <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      : один контейнер, строки рендерятся плоско со своей глубиной. См. <a href="/docs/guides/trees">
        деревья
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Вложенные группы с <code>
        v-model
      </code>
      
       (зона сброса на каждую группу)
    </td>
    
    <td>
      Список внутри списка, все в одной <code>
        group
      </code>
      
      , у каждого <code>
        items: defineModel()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Виртуальные списки: <code>
        id
      </code>
      
       на каждом перетаскиваемом элементе
    </td>
    
    <td>
      Передайте черновик виртуализатору, <code>
        id: () => props.item.id
      </code>
      
       на строках. См. <a href="/docs/guides/virtual-lists">
        виртуальные списки
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Код до и после — [ниже](#a-sortable-list). Всё о списках — в
[сортируемых списках](https://zizigy.github.io/docs/guides/sortable-lists) и [списках с общими элементами](https://zizigy.github.io/docs/guides/shared-lists).

### Группы

В v2 была одна опция `groups` на всё. v3 разделяет её на две:

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev', 'ops']
      </code>
      
       на зоне
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
       или функция: <code>
        ({ active, items, types }) => boolean
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
       или ничего
    </td>
    
    <td>
      <code>
        type
      </code>
      
       или <code>
        accept
      </code>
      
       не заданы. Правила v2 сохраняются: перетаскиваемый элемент без типа подходит под любое правило, а цель без <code>
        accept
      </code>
      
       принимает всё.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       на зоне списка и его строках
    </td>
    
    <td>
      <code>
        group: 'board'
      </code>
      
       у <code>
        makeSortableList
      </code>
      
      . <code>
        group: { name, pull, put }
      </code>
      
       говорит, что может уходить и входить.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       у <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Список без `group` — сам себе группа и не обменивается элементами ни с каким другим списком. В
v2 зона без групп принимала всё. См. [какие драги принимает цель](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes).

### Оверлей

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Превью, отрендеренное в провайдере и телепортированное через <code>
        previewTo
      </code>
    </td>
    
    <td>
      Всегда телепортируется: в <code>
        body
      </code>
      
       или в <code>
        overlayTo
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Клон: тот же тег, его <code>
        innerHTML
      </code>
      
       и его размер
    </td>
    
    <td>
      Глубокий клон: значения полей форм, пиксели <code>
        <canvas>
      </code>
      
      , унаследованные стили и ячейки таблиц переносятся. То, что должно остаться, помечайте <code>
        data-dnd-no-clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
      
      , который читает <code>
        useDnDProvider().entities
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      , который получает <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
       и <code>
        to
      </code>
      
       как пропсы. Без <code>
        markRaw
      </code>
      
      ; чтобы переключать его, используйте <code>
        shallowRef
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Слот <code>
        #preview
      </code>
      
      , позиционируемый по <code>
        preview.position
      </code>
    </td>
    
    <td>
      Слот <code>
        #overlay
      </code>
      
      : библиотека сама размещает блок и задаёт ему размер. Если ничего не рендерить, используется клон.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      Слот <code>
        #overlay
      </code>
      
       или <code>
        shallowRef
      </code>
      
      , переданный как <code>
        overlay
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Новый вид над зоной, из <code>
        onEnter
      </code>
      
       и <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        overOverlay
      </code>
      
       у <code>
        makeDroppable
      </code>
      
       или списка, либо читайте <code>
        over
      </code>
      
       в компоненте оверлея. См. <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        цели, которые меняют оверлей
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      <code>
        items
      </code>
      
       в пропсах оверлея; <code>
        <DragPreview :id="item.id" />
      </code>
      
       рендерит один клон.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      Модификатор <code>
        snapToGrid
      </code>
      
      . Он привязывает к сетке и место, где ищутся цели, и <code>
        position
      </code>
      
       броска, а не только картинку.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <Transition>
      </code>
      
       или <code>
        AnimatePresence
      </code>
      
       из motion вокруг <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        overlay-class
      </code>
      
       с <code>
        @starting-style
      </code>
      
       для захвата, <code>
        dropAnimation
      </code>
      
       для приземления, <code>
        overlayTransition
      </code>
      
       между компонентами. См. <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        подъём, наклон, посадку
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      <code>
        [data-dnd-overlay]
      </code>
      
       (<code>
        "dragging"
      </code>
      
      , <code>
        "dropping"
      </code>
      
      ) на блоке, <code>
        [data-dnd-overlay-content]
      </code>
      
       внутри него.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.size
      </code>
      
      , который обновляли вручную
    </td>
    
    <td>
      Блок принимает размер слота, на который приземлится (<code>
        overlayFit
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      Превью исчезает при броске
    </td>
    
    <td>
      Оно приземляется на свой слот или летит обратно при отмене.
    </td>
  </tr>
</tbody>
</table>

Подробнее — в [руководстве по оверлею](https://zizigy.github.io/docs/guides/overlay).

### Выделение и мульти-драг

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        selected
      </code>
      
      , возвращаемый <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        selected
      </code>
      
      , возвращаемый <code>
        makeDraggable
      </code>
      
       и <code>
        makeSortableItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      , набор элементов
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      , по id.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      : по умолчанию нужно держать Ctrl (<code>
        ControlLeft
      </code>
      
      )
    </td>
    
    <td>
      По умолчанию никакой клавиши: нажатие на пустом месте области рисует рамку. <code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       возвращает Ctrl.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier.keys
      </code>
      
       как <code>
        KeyboardEvent.code
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
       (<code>
        'Control'
      </code>
      
      , <code>
        'Shift'
      </code>
      
      ) или <code>
        .code
      </code>
      
       (<code>
        'ControlLeft'
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      , <code>
        'select'
      </code>
    </td>
    
    <td>
      То же самое.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
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
      То же самое.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort()
      </code>
      
      , перемещающий выделение пачкой
    </td>
    
    <td>
      Его перемещают списки. <code>
        multiple: 'group'
      </code>
      
       (по умолчанию), <code>
        'gaps'
      </code>
      
       или <code>
        'stack'
      </code>
      
       говорит, что по пути делают остальные элементы.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       для смешанных выделений
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       и <code>
        onBeforeDrop
      </code>
      
      , возвращающий id. См. <a href="/docs/guides/multi-drag#taking-only-some">
        принять только часть
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Подробнее — в [мульти-драге и выделении](https://zizigy.github.io/docs/guides/multi-drag).

### Оси, границы и привязка

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      , для драгов, которые начинаются внутри неё. <code>
        axis
      </code>
      
       работает и у перетаскиваемого элемента, списка, дерева или элемента списка.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      <code>
        axis
      </code>
      
       не задан.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
       или модификаторы <code>
        restrictToParent
      </code>
      
       и <code>
        restrictToElement(el)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Провайдер на каждую область, чтобы разделить правила
    </td>
    
    <td>
      Один провайдер и <code>
        makeDragArea
      </code>
      
       на каждую область. Её элементы по-прежнему могут перемещаться куда угодно.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       или <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      , в <code>
        modifiers
      </code>
      
       у провайдера, области, списка или перетаскиваемого элемента.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Новое: <code>
        restrictToWindowEdges
      </code>
      
      , <code>
        restrictToFirstScrollableAncestor
      </code>
      
      , <code>
        snapCenterToCursor
      </code>
      
       и ваши собственные модификаторы.
    </td>
  </tr>
</tbody>
</table>

Подробнее — в [осях, границах и сетках](https://zizigy.github.io/docs/guides/constraints).

### Автоскролл

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      , по умолчанию выключен
    </td>
    
    <td>
      Включён по умолчанию, для окна и любого скролл-контейнера. <code>
        :auto-scroll="false"
      </code>
      
       выключает его.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      Ничего: прокручивается любой элемент с <code>
        overflow: auto
      </code>
      
       или <code>
        scroll
      </code>
      
      . Чтобы настроить один: <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       или <code>
        autoScroll
      </code>
      
       списка.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        threshold
      </code>
      
       в px или для каждой стороны
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      : доля размера контейнера (<code>
        0.2
      </code>
      
      ), от 24 до 96 px. <strong>
        Нет аналога
      </strong>
      
       для порогов по сторонам.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
      
      , множитель
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
       (25 px за кадр) и <code>
        acceleration
      </code>
      
       (10).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        isAutoScrolling
      </code>
      
      , из <code>
        makeDragArea
      </code>
      
       или <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Клавиатура и доступность

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex="0"
      </code>
      
       на каждом перетаскиваемом элементе
    </td>
    
    <td>
      Ставится за вас, вместе с <code>
        role
      </code>
      
      , <code>
        aria-roledescription
      </code>
      
      , <code>
        aria-describedby
      </code>
      
      , <code>
        aria-disabled
      </code>
      
       и <code>
        aria-pressed
      </code>
      
      . Ваши собственные атрибуты важнее.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        :aria-grabbed="isDragging"
      </code>
      
       вручную
    </td>
    
    <td>
      Удалите: <code>
        aria-pressed
      </code>
      
       следует за драгом.
    </td>
  </tr>
  
  <tr>
    <td>
      Клавиши в <code>
        useDnDProvider().keyboard.keys
      </code>
    </td>
    
    <td>
      Проп <code>
        keyboard
      </code>
      
       провайдера. Привязки сопоставляются с <code>
        event.code
      </code>
      
       или <code>
        event.key
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Стрелки двигают превью на <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      Свободные драги: на <code>
        keyboard.step
      </code>
      
       px. Списки: по слотам и в следующий список группы. <code>
        keyboardMode: 'droppables'
      </code>
      
       перескакивает между целями.
    </td>
  </tr>
  
  <tr>
    <td>
      Переназначение стрелок (<code>
        forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      )
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Никаких объявлений
    </td>
    
    <td>
      Live-регион озвучивает каждый захват, перемещение, бросок и отмену. <code>
        label
      </code>
      
       даёт имена; <code>
        announcements
      </code>
      
       и <code>
        screenReaderInstructions
      </code>
      
       меняют формулировки.
    </td>
  </tr>
</tbody>
</table>

Подробнее — в [доступности](https://zizigy.github.io/docs/guides/accessibility).

### События и решения о броске

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
       перетаскиваемого элемента
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      , с проверкой <code>
        active.ids
      </code>
      
      . Для класса достаточно <code>
        isDragging
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      <code>
        onDragMove
      </code>
      
       монитора.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      , при броске или отмене
    </td>
    
    <td>
      <code>
        onDragEnd
      </code>
      
       монитора (бросок) и <code>
        onDragCancel
      </code>
      
      . <code>
        onDragSettle
      </code>
      
       слышит оба, когда оверлей приземлился.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      <code>
        onDragCancel
      </code>
      
       монитора.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
       перетаскиваемого элемента и его <code>
        onDragStart
      </code>
      
      … для драгов над ним
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       на элементе: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      . Строкам списка ничего не нужно.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        onLeave
      </code>
      
       зоны сброса
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
       зоны сброса
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       решает, затем <code>
        onDrop
      </code>
      
       применяет. <code>
        onDrop
      </code>
      
       синхронный, и то, что он возвращает, игнорируется.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
      
       зоны сброса
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , с <code>
        acceptMode: 'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Новое: <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
       провайдера и <code>
        onDragOver
      </code>
      
      , <code>
        onBeforeDrop
      </code>
      
       и <code>
        onDragResume
      </code>
      
       монитора.
    </td>
  </tr>
</tbody>
</table>

В v2 `onDrop` мог вернуть значение или промис значения, чтобы решить судьбу броска. В v3 это
работа `onBeforeDrop` — у списков, деревьев, целей и мониторов:

<table>
<thead>
  <tr>
    <th>
      v2: <code>
        onDrop
      </code>
      
       возвращает
    </th>
    
    <th>
      v3: <code>
        onBeforeDrop
      </code>
      
       возвращает
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Ничего или <code>
        true
      </code>
      
      : бросок проходит
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       или ничего.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      : этот бросок отклонён, драг остаётся активным
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      . <strong>
        Теперь <code>
          false
        </code>
        
         отклоняет бросок.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Отклонённый промис или исключение: драг отменяется
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       или <code>
        false
      </code>
      
      . Исключение тоже отклоняет.
    </td>
  </tr>
  
  <tr>
    <td>
      Промис; тем временем <code>
        state
      </code>
      
       равен <code>
        'pending'
      </code>
    </td>
    
    <td>
      Промис; тем временем <code>
        status
      </code>
      
       равен <code>
        'dropping'
      </code>
      
      , а оверлей ждёт с <code>
        data-dnd-overlay="dropping"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       возвращает <code>
        IDragItem[]
      </code>
    </td>
    
    <td>
      Массив id: бросаются только они, остальные летят обратно.
    </td>
  </tr>
</tbody>
</table>

Сначала отвечают мониторы, затем цель. Потом выполняется `onDrop` цели, список записывает свои
новые массивы, и следует `onDragEnd`. Подробнее — в [решении о броске](https://zizigy.github.io/docs/guides/drop-decisions)
и в [API событий](https://zizigy.github.io/docs/api/events).

### Типы

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
       (цели, мониторы), <code>
        SortableDropEvent
      </code>
      
       (списки), <code>
        DnDEndEvent
      </code>
      
       (<code>
        onDragEnd
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        Нет аналога.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      , <code>
        ISuggestSwapResult
      </code>
      
      , <code>
        ISuggestCopyResult
      </code>
      
      , <code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      : <code>
        result
      </code>
      
      , <code>
        to
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        partner
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      , в <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        Placement
      </code>
      
      , без <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
       — то, что возвращает <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      , <code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      Колбэки в <code>
        DraggableOptions
      </code>
      
      , <code>
        DroppableOptions
      </code>
      
       и <code>
        DnDMonitor
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@^3 @vue-dnd-kit/core@^3
```

<table>
<thead>
  <tr>
    <th>
      v2 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x)
    </th>
    
    <th>
      v3 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.x)
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Автоимпортирует <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeConstraintArea
      </code>
      
      , <code>
        makeAutoScroll
      </code>
      
      , <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      Автоимпортирует <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableItem
      </code>
      
      , <code>
        makeSortableTree
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeDragArea
      </code>
      
      , <code>
        useDnD
      </code>
      
      , <code>
        useDnDMonitor
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Типы не автоимпортируются
    </td>
    
    <td>
      Основные типы автоимпортируются (<code>
        DnDEvent
      </code>
      
      , <code>
        SortableDropEvent
      </code>
      
      , <code>
        OverlayProps
      </code>
      
      …). Общие (<code>
        Key
      </code>
      
      , <code>
        Active
      </code>
      
      , <code>
        Over
      </code>
      
      ) импортируются вручную.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Модификаторы, функции определения коллизий и сенсоры — по запросу: <code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
       и <code>
        DragPreview
      </code>
      
       глобальные
    </td>
    
    <td>
      То же самое, с опцией <code>
        prefix
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview />
      </code>
      
       в лейауте, внутри провайдера
    </td>
    
    <td>
      Удалите его: оверлей рендерит провайдер. <code>
        DragPreview
      </code>
      
       принимает <code>
        id
      </code>
      
      , и его место — внутри компонентов оверлея.
    </td>
  </tr>
  
  <tr>
    <td>
      Peer-зависимость <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      Peer-зависимость <code>
        @vue-dnd-kit/core
      </code>
      
       3; Nuxt 4.
    </td>
  </tr>
</tbody>
</table>

`modules: ['@vue-dnd-kit/nuxt']` в `nuxt.config.ts` остаётся как было. См.
[установку](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## До и после

### Перетаскиваемый элемент и зона сброса

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- Карточка сама получает `tabindex`, `role` и атрибуты `aria-*`. Ручка-`<button>` получает
фокус, и драги с клавиатуры начинаются с неё.
- `groups` стал `type` у перетаскиваемого элемента и `accept` у цели. Колбэки ушли из объекта
`events`.
- `isOver` без `isAccepting` — это цель, которая отказывает драгу: бросок туда летит обратно.

### Сортируемый список

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- Рендерите `items`, черновик: он перестраивается во время драга. `tasks` получает новый
порядок при броске, и `defineModel` эмитит `update:modelValue`.
- Ни индекса, ни данных, ни `onDrop`, ни `<TransitionGroup>`: строки встают на места сами.
- Перетаскиваемая строка остаётся в списке как слот, на который приземлится. Стилизуйте её
через `isPlaceholder` или `[data-dnd-placeholder]`, а не прячьте.

### Списки с общими элементами

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

Бросок записывает оба массива: тот, который задача покинула, и тот, в который вошла.
`TaskItem.vue` — тот же, что в сортируемом списке выше. Палитра, которая раздаёт копии, была
`suggestCopy()` и флагом `copyOnly`; теперь это список:

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

Для стора Pinia или другого состояния, которое вы не записываете напрямую, передайте `items`
геттером, вызовите `e.preventDefault()` в `onDrop` и примените `e.result`: см.
[управляемые списки](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

### Свой оверлей

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- Компонент получает драг через пропсы: `items` (все перетаскиваемые элементы, взятый —
первым), `over`, `accepted`, `status`, `mode` и `to`. Объявляйте только те, которые читаете.
Для строк списка элемент списка — это `items[0].item`.
- Передавайте его как есть. Переключайте его через `shallowRef`, никогда не через глубокий `ref`.

Слот провайдера меняется так же, и ваш компонент больше не позиционирует себя сам:

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

Появление, которое оборачивало `DragPreview` в `<Transition>`, становится `overlay-class` с
`@starting-style`: см. [подъём, наклон, посадку](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).

### Бросок, который вы подтверждаете

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

Список спрашивает так же, а промис позволяет открыть собственный диалог. Оверлей ждёт там, где
его отпустили, пока промис не завершится:

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

Зона, которая брала только подходящую часть смешанного выделения (`groupMatch: 'some'`):

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

Списки делают это без кода: с `acceptMode: 'some'` элементы, которые принимает их `group.put`,
приземляются, а остальные летят обратно.

## Подводные камни при обновлении

- **Ставьте v3 с её диапазоном.** `^3` в `package.json`: `npm update` оставляет `^2` на v2.
- **Рендерите черновик.** Список рендерит `items`, который возвращает `makeSortableList`, а не
ваш массив. Если рендерить ваш массив, до броска ничего не двигается.
- **Не сортируйте дважды.** Удалите из списков код с `suggestSort`: список записывает каждый
бросок в записываемый ref `items` после своего `onDrop`. Чтобы применить его самим, вызовите
`e.preventDefault()` и используйте `e.result`.
- **false отклоняет бросок.** В v2 `onDrop`, разрешившийся в `false`, продолжал драг. В v3
верните `'continue'` из `onBeforeDrop`. Промис, возвращённый из `onDrop`, игнорируется.
- **Списки обмениваются только внутри group.** Список без неё не обменивается ни с каким
другим списком.
- **Задавайте строкам ключи по id.** С `:key="index"` анимируются не те строки. Передавайте и id
из своих данных: id по умолчанию новый для каждого экземпляра компонента.
- **Никакого <TransitionGroup> и никакого transition на transform.** Библиотека двигает
строки сама, и перемещения анимировались бы дважды.
- **Отмените обходное решение для касаний.** `touch-action: none` на элементе целиком не даёт
странице прокручиваться под пальцем; v3 вместо этого начинает драги касанием с долгого
нажатия. Оставьте его на ручке, которая должна тащить сразу, с
`activation: { touch: { distance: 4 } }`.
- **Уберите устаревшие атрибуты.** Библиотека ставит `tabindex`, `role` и нужные ей `aria-*` и
никогда не перезаписывает ваши, так что оставшиеся `role` или `aria-grabbed` останутся такими,
какими вы их оставили.
- **Перестилизуйте оверлей.** `.dnd-kit-preview` больше нет: стилизуйте то, что внутри
`[data-dnd-overlay='dragging']`, но никогда не `transform` блока. Дайте корню компонента
оверлея `width: 100%; height: 100%` и уберите `<DragPreview />` из своих лейаутов.
- **Автоскролл включён.** Передайте `:auto-scroll="false"` там, где v2 никогда не прокручивала.
- **Рамке не нужна клавиша.** `makeSelectionArea` рисует от простого нажатия на пустом месте.
Добавьте `modifier`, чтобы сохранить Ctrl из v2.
- **Один провайдер, области внутри.** Элементы не могут переходить между провайдерами.
Странице, которая использовала провайдер на каждую область, чтобы разделить их правила, нужен
один провайдер и `makeDragArea` на каждую область.
- **Два аргумента.** `makeDraggable` и `makeDroppable` принимают ref и объект опций, без
данных (payload).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
