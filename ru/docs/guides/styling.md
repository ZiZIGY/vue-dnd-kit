---
title: "Стилизация"
description: "Каждое состояние драга, со стилями — data-атрибуты для чистого CSS, ref для классов, цели, которые говорят «да» или «нет», оверлей и страница во время драга, стили по умолчанию, Tailwind и UI-киты."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/styling"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Библиотека почти ничего не стилизует. Каждое состояние драга доходит до вас двумя путями: как
атрибут `data-dnd-*` — для чистого CSS, и как ref, который возвращает композабл, — для классов
и условной разметки. Используйте то, что подходит вашему стеку, или оба.

## Data-атрибуты

У строк ниже нет вообще никаких классов состояния: весь внешний вид берётся из атрибутов.
Панель перечисляет атрибуты на странице по мере их появления и исчезновения. Выделите две
строки с <kbd value="Ctrl">



</kbd>

 или <kbd value="Meta">



</kbd>

 и перетащите их: появятся и остальные
элементы мульти-драга.

<example height="25rem" hint="Перетащите строку, затем выделите две через Ctrl/⌘-клик и перетащите их" name="dnd-attributes">



</example>

<table>
<thead>
  <tr>
    <th>
      Атрибут
    </th>
    
    <th>
      На чём
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
        data-dnd-placeholder
      </code>
    </td>
    
    <td>
      сортируемый элемент
    </td>
    
    <td>
      Он — слот, в который приземлится перетаскиваемый элемент. <code>
        "into"
      </code>
      
      , пока драг над <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        целью внутри элемента
      </a>
      
      : бросок идёт туда, а слот только держит своё место.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging
      </code>
    </td>
    
    <td>
      сортируемый элемент
    </td>
    
    <td>
      Он перетаскивается, но остаётся на месте: остальные элементы мульти-драга в режиме <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging="pointer"
      </code>
      
       или <code>
        "keyboard"
      </code>
    </td>
    
    <td>
      <code>
        <html>
      </code>
    </td>
    
    <td>
      Весь драг.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay="dragging"
      </code>
      
       или <code>
        "dropping"
      </code>
    </td>
    
    <td>
      блок оверлея
    </td>
    
    <td>
      Всегда. <code>
        dropping
      </code>
      
       — пока он приземляется и пока ждёт асинхронный <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay-content
      </code>
    </td>
    
    <td>
      содержимое оверлея
    </td>
    
    <td>
      Всегда: элемент, который заполняет блок и держит то, что он показывает. Его анимируете вы; он получает <code>
        overlayClass
      </code>
      
       провайдера.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-leaving
      </code>
    </td>
    
    <td>
      копия, оставленная <code>
        animate
      </code>
    </td>
    
    <td>
      Пока ушедший элемент растворяется.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-no-clone
      </code>
    </td>
    
    <td>
      <strong>
        ставите вы
      </strong>
    </td>
    
    <td>
      Исключает элемент из копии в оверлее: тултип, меню, бейдж.
    </td>
  </tr>
</tbody>
</table>

```css [TaskRow.vue]
/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
}

/* The copy in the overlay, while it travels. */
[data-dnd-overlay='dragging'] .row {
  box-shadow: 0 0 0 1.5px #42b883, 0 14px 24px -10px rgb(0 0 0 / 0.55);
}
```

```vue [TaskRow.vue]
<li ref="el" class="row" :aria-selected="selected">
  <span class="title">{{ task.title }}</span>
  <button type="button" data-dnd-no-clone @click.stop="task.done = !task.done">✓</button>
</li>
```

- Копия строки в оверлее сохраняет её классы и атрибуты, включая scope-атрибут Vue, поэтому
`[data-dnd-overlay] .row` работает в собственном `<style scoped>` строки. У копии нет
собственных пометок `data-dnd-*`: копия слота — не слот.
- У выделения нет атрибута. Отразите ref `selected` в атрибут (`aria-selected` выше) или
используйте класс.
- Обычные перетаскиваемые элементы и цели (`makeDraggable`, `makeDroppable`) не получают
атрибутов состояния `data-dnd-*`: стилизуйте их через их ref.

## Возвращаемые ref

Те же состояния в виде ref, плюс те, что есть у списков и целей. Каждая строка и список ниже
выводят ref, которые сейчас истинны, и их классы берутся из них. Icebox отклоняет срочные
задачи: перетащите одну над ним.

<example height="24rem" hint="Перетащите задачу в другой список; Ctrl/⌘-клик выделяет несколько" name="dnd-refs">



</example>

```vue [RefRow.vue]
<script setup lang="ts">
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }">…</li>
</template>

<style scoped>
.row.selected { box-shadow: 0 0 0 1.5px #3b82f6; }
.row.placeholder { opacity: 1; box-shadow: inset 0 0 0 1.5px #42b883; }   /* beats the default 40% */
.row.placeholder .title { visibility: hidden; }
</style>
```

```vue [RefList.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(el, { items, group });
</script>

<template>
  <section :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">…</section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Композабл
    </th>
    
    <th>
      Состояние
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isPlaceholder
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        index
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        activeKey
      </code>
      
      , <code>
        activeIndex
      </code>
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
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        transform
      </code>
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
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        placement
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD()
      </code>
    </td>
    
    <td>
      <code>
        status
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        pointer
      </code>
      
      , <code>
        activation.progress
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
</tbody>
</table>

- `isPlaceholder`: этот элемент — слот, в который приземлится перетаскиваемый элемент. При
мульти-драге в режиме `'group'` слоты элементов, едущих следом, тоже плейсхолдеры.
- `isDragging`: элемент — часть драга: каждый перетаскиваемый элемент при мульти-драге.
- `isAccepting`: что-то перетаскивается, и эта цель это принимает. Подсвечивайте места, где
возможен бросок.
- `isOver`: драг над этой целью, принимает она его или нет. `isOver && !isAccepting` — отказ:
покажите его.
- `indicator`: где проходит линия броска в [режиме индикатора](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line).
- `activation.progress`: от 0 до 1, пока идёт долгое нажатие касанием или `delay`. Заполняйте
по нему кольцо.

## Цели: да и нет

У цели во время драга четыре вида: она принимает драг; принимает, и указатель на ней;
отклоняет; отклоняет, и указатель на ней. Покажите все четыре и сообщите об этом и на
перетаскиваемом элементе.

<example height="23rem" hint="Перетащите цвет над палитрами: подходящая приглашает его, остальные — нет" name="drop-highlights">



</example>

```ts [Palette.vue]
const { isOver, isAccepting } = makeDroppable(el, { accept: props.tone, onDrop });

const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
```

```css [Palette.vue]
.palette.accepting { border-style: dashed; border-color: #42b883; }          /* an invitation */
.palette.over { border-color: #42b883; background: color-mix(in srgb, #42b883 14%, Canvas); }
.palette.refusing { opacity: 0.45; }                                          /* out of the way */
.palette.refused { border-color: #f43f5e; animation: shake 0.3s; }            /* a drop here is cancelled */
```

Перетаскиваемый образец цвета — это слот `#overlay` провайдера. Он получает `over` и
`accepted`: `accepted` равен `false` над целью, которая отклоняет драг.

```vue [index.vue]
<template #overlay="{ active, over, accepted }">
  <div
    class="lifted"
    :class="{ yes: over && accepted, no: over && !accepted }"
    :style="{ background: (active.data as { color: string }).color }"
  >
    <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
  </div>
</template>
```

Вне оверлея то же самое говорит `useDnD().over.value?.accepted`. Подробнее о компонентах
оверлея — в [оверлее](https://zizigy.github.io/docs/guides/overlay).

## Оверлей и страница

Остальное в драге покрывают два атрибута: `data-dnd-overlay` на блоке оверлея и
`data-dnd-dragging` на `<html>`, `"pointer"` или `"keyboard"`. Полоса над заметками читает
второй и говорит, какие клавиши работают. Включите медленное сохранение: оверлей остаётся
`dropping` там, где вы отпустили, пока не разрешится `onBeforeDrop`, и показывает это.

<example height="27rem" hint="Перетащите заметку мышью, затем с клавиатуры; включите медленное сохранение" name="overlay-theme">



</example>

```css [index.vue]
.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle { display: none; }

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard { display: inline; }
```

```css [StickyNote.vue]
[data-dnd-overlay='dragging'] .note {
  box-shadow: 0 0 0 2px #42b883, 0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save. */
[data-dnd-overlay='dropping'] .note { opacity: 0.85; }
[data-dnd-overlay='dropping'] .saving { display: flex; }
```

- `dropping` охватывает приземление и ожидание асинхронного `onBeforeDrop`. Пока он ждёт,
`<html>` выходит из режима драга: курсор страницы и выделение текста возвращаются, так что
диалог подтверждения работает как обычно.
- Стилизуйте то, что **внутри** блока. Сам блок библиотека двигает через `transform` и задаёт
ему размер через `width` и `height`. Его элемент содержимого, `[data-dnd-overlay-content]`,
заполняет блок и принадлежит вам: поднимайте и наклоняйте там весь оверлей (см.
[анимации](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)).
- У корня копии инлайн `transform: none`: поворачивайте или увеличивайте его через `rotate` и
`scale`. На нём работают и переходы, и ключевые кадры: см.
[анимации](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).
- Копия показывает элемент как есть и не угадывает фон. Строке, которую рисует список (`<li>` в
белом `<ul>`, строка таблицы), он нужен: `[data-dnd-overlay] .row { background: Canvas; }`.
- Копия лежит в `<div>`, который несёт кастомные свойства, унаследованные элементом (цвета
темы, `--tw-*`), так что в оверлее они по-прежнему действуют, а собственные правила копии
(`in-data-[dnd-overlay]:ring-2`) всё так же их перебивают. Выбирайте копию по её классу, а не
по глубине в блоке.

## Стили по умолчанию

Провайдер внедряет несколько правил один раз на документ. Они обёрнуты в `:where()`, поэтому
их специфичность нулевая, и любое ваше правило побеждает:

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
:where(html[data-dnd-dragging]), :where(html[data-dnd-dragging] *) {
  user-select: none !important;
  overflow-anchor: none !important;
}
:where(html[data-dnd-dragging='pointer']), :where(html[data-dnd-dragging='pointer'] *) {
  cursor: var(--dnd-cursor, grabbing) !important;
  -webkit-touch-callout: none !important;
}
```

<table>
<thead>
  <tr>
    <th>
      Правило
    </th>
    
    <th>
      Зачем
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Слот на 40 %
    </td>
    
    <td>
      Чтобы список выглядел нормально вообще без CSS. Каждое демо выше его переопределяет.
    </td>
  </tr>
  
  <tr>
    <td>
      Оставшиеся на местах элементы на 40 %
    </td>
    
    <td>
      То же, для мульти-драга в режиме <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Без <code>
        user-select
      </code>
    </td>
    
    <td>
      Драг не выделяет текст, над которым проходит.
    </td>
  </tr>
  
  <tr>
    <td>
      Без <code>
        overflow-anchor
      </code>
    </td>
    
    <td>
      Страница не прокручивается, чтобы удержать в поле зрения движущуюся строку.
    </td>
  </tr>
  
  <tr>
    <td>
      Курсор драга
    </td>
    
    <td>
      Во время драга указателем, везде. <code>
        grabbing
      </code>
      
      , если у взятого элемента нет собственного курсора: <code>
        ns-resize
      </code>
      
       ручки изменения размера, <code>
        move
      </code>
      
      , изображение сохраняют свой на весь драг (<code>
        grab
      </code>
      
      , <code>
        pointer
      </code>
      
       и подобные всё равно превращаются в <code>
        grabbing
      </code>
      
      ). <code>
        cursor: grab
      </code>
      
       на перетаскиваемых элементах добавляете вы. Задайте <code>
        --dnd-cursor
      </code>
      
       на <code>
        <html>
      </code>
      
       для другого курсора по умолчанию.
    </td>
  </tr>
  
  <tr>
    <td>
      Без touch callout
    </td>
    
    <td>
      iOS не открывает меню ссылки при долгом нажатии.
    </td>
  </tr>
</tbody>
</table>

`:default-styles="false"` на провайдере их отключает. Библиотека по-прежнему помечает
`<html>`, по-прежнему сбрасывает выделение текста в начале драга и не даёт начать новое до его конца: пропадает
только CSS. Правила внедряются один раз, первым провайдером, которому они нужны, и остаются:
отключайте их на каждом провайдере страницы.

```vue
<DnDProvider :default-styles="false">
```

## Tailwind CSS

Атрибуты работают как варианты: `data-[…]` для самого элемента, произвольный вариант — для
предка.

```vue [TaskRow.vue]
<li
  ref="el"
  class="rounded-lg bg-white shadow-sm
         data-[dnd-placeholder]:bg-transparent data-[dnd-placeholder]:opacity-100
         data-[dnd-placeholder]:outline-dashed
         [[data-dnd-overlay=dragging]_&]:shadow-xl"
  :class="{ 'ring-2 ring-emerald-500': selected }"
>
```

```vue [Hint.vue]
<p class="hidden [html[data-dnd-dragging=keyboard]_&]:block">Arrows move · Space drops</p>
```

<note>

Внешний вид от библиотеки (непрозрачность 40 %) лежит в собственном каскадном слое
`vue-dnd-kit`, объявленном раньше всех остальных. Утилиты Tailwind v4 и построенные на нём
UI-киты тоже живут в слоях, и их слои идут позже, так что они побеждают без `!`. CSS вне слоёв
побеждает в любом случае.

</note>

В Tailwind v4 `in-data-[dnd-overlay=dragging]:shadow-xl` — более короткая запись варианта для
предка.

<warning>

В scoped CSS Vue `:global()` забирает весь селектор: `:global(html[data-dnd-dragging]) .hint`
компилируется в один `html[data-dnd-dragging]` и скрывает страницу. Пишите предка без него,
`html[data-dnd-dragging] .hint`: Vue добавляет scope только к последней части.

</warning>

## UI-киты

- Композаблы принимают не только элемент, но и компонент: `useTemplateRef` на карточке или
элементе списка из кита работает, и библиотека читает его корневой элемент.
- Передавайте состояние в собственные пропсы кита там, где они есть (`:active="selected"`,
`:color="isOver ? 'primary' : undefined"`), а остальное — классами.
- У элементов списков в китах часто нет собственного фона: его рисует список. Их копия в
оверлее тогда прозрачна. Задайте ей фон:```css
[data-dnd-overlay] .v-list-item { background: rgb(var(--v-theme-surface)); }
```
- Копия не включает рябь от нажатий Vuetify, Quasar, PrimeVue и Naive UI. Помечайте всё
остальное, что не должно ехать с ней, тултип или кнопку меню, атрибутом
`data-dnd-no-clone`.

## Чего не делать

- Не ставьте CSS `transition` на `transform` или `translate` сортируемых элементов: библиотека
анимирует их сама и отменяет такие переходы, пока измеряет.
- Не оборачивайте сортируемые элементы в `<TransitionGroup>`: перемещения анимировались бы
дважды. Используйте `animate` списка.
- Не анимируйте `height`, `margin` или `padding` строк в [виртуальном списке](/docs/guides/virtual-lists).
- А вот переходы, которые вы добавляете вокруг драгов, отключайте при
`prefers-reduced-motion: reduce`. Свои библиотека уже отключает.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
