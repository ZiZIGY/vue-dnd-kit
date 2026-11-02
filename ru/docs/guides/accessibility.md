---
title: "Доступность"
description: "Перетаскивание с клавиатуры, объявления для скринридеров и ARIA-атрибуты встроены. Что они делают, как сформулировать их на любом языке и как дать возможность перемещать без перетаскивания."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Всё на этой странице включено по умолчанию. Перейдите клавишей Tab к пункту повестки, нажмите
<kbd value="Space">



</kbd>

, подвигайте его стрелками и снова нажмите <kbd value="Space">



</kbd>

 или
<kbd value="Escape">



</kbd>

, чтобы вернуть на место. Панель показывает, что сообщается скринридеру,
на выбранном вами языке.

<example height="28.5rem" hint="Перейдите к пункту клавишей Tab: Space, стрелки, Space. Переключите язык" name="a11y-announcer">



</example>

Что обычно остаётся на вас: понятные тексты для элементов и кнопки, которые перемещают их, для
людей, которые вообще не могут перетаскивать.

## Клавиатура

<table>
<thead>
  <tr>
    <th>
      Клавиша
    </th>
    
    <th>
      Действие
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
      Взять элемент в фокусе; бросить его.
    </td>
  </tr>
  
  <tr>
    <td>
      Стрелки
    </td>
    
    <td>
      Двигать его: по слотам в списках, по строкам и глубине в деревьях, на <code>
        keyboard.step
      </code>
      
       пикселей при свободном перетаскивании.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Отменить драг — в том числе драг указателем.
    </td>
  </tr>
</tbody>
</table>

- В списке стрелка в сторону другого списка той же группы переносит элемент туда.
- При свободном перетаскивании <kbd value="Shift">



</kbd>

 увеличивает шаги.
`makeDraggable(el, { keyboard: 'droppables' })` вместо этого заставляет стрелки прыгать между
целями, которые принимают элемент.
- Перетаскивание с клавиатуры начинается с перетаскиваемого элемента в фокусе или его ручки —
никогда с кнопки или поля внутри него, так что те сохраняют свои клавиши.
- Перетаскивание с клавиатуры прокручивает элемент в зону видимости вместо автоскролла у краёв.
- После броска фокус возвращается на элемент, даже если его строка заново отрендерилась в
другом списке.

### Другие клавиши

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

Привязки сверяются с `event.code` (`'Space'`, `'KeyD'`) или `event.key` (`'Enter'`). `step` —
пикселей на одно нажатие стрелки при свободном перетаскивании (по умолчанию 25).
`:keyboard="false"` отключает перетаскивание с клавиатуры, а <kbd value="Escape">



</kbd>

 по-прежнему
отменяет любой драг. Меняя клавиши, поменяйте и `screen-reader-instructions`.

## ARIA-атрибуты

Поставьте фокус на каждый ярлык или выключите атрибуты и смотрите, что ставит библиотека.
Перетащите один, чтобы увидеть, как `aria-pressed` появляется и исчезает на кнопке.

<example height="27rem" hint="Пройдите по ярлыкам клавишей Tab; переключите атрибуты" name="a11y-attributes">



</example>

Каждый перетаскиваемый и сортируемый элемент получает эти атрибуты, **если вы не задали их
сами**:

<table>
<thead>
  <tr>
    <th>
      Атрибут
    </th>
    
    <th>
      Значение
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
      
      , если элемент ещё не фокусируемый (<code>
        <div>
      </code>
      
      ; но не <code>
        <a href>
      </code>
      
       или <code>
        <button>
      </code>
      
      ).
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
      
      , кроме <code>
        <button>
      </code>
      
      , который и так кнопка.
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
      
       или <code>
        sortable
      </code>
      
       на сортируемых элементах.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      Инструкции провайдера, добавленные к уже имеющимся id (id тултипа сохраняется).
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
      
       или <code>
        false
      </code>
      
      : отключён ли элемент (в том числе отключённой областью перетаскивания).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      , пока элемент перетаскивается, на элементах с ролью <code>
        button
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`attributes: false` на элементе убирает то, что поставила библиотека, вживую. Панель
считывает атрибуты обратно: `aria-describedby` указывает на инструкции провайдера, которые
скринридер читает после имени элемента.

### Перетаскиваемые ссылки и кнопки

`aria-roledescription` заменяет название роли: скринридер говорит «Inbox, sortable» вместо
«Inbox, button». Для элемента, у которого роль важна, задайте свою; библиотека её не тронет:

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

- Ссылка продолжает работать: клик открывает её, но клик, которым заканчивается драг, до неё
не доходит. <kbd value="Enter">



</kbd>

 начал бы драг, поэтому `canDrag` отклоняет его, и браузер
переходит по ссылке.
- `<button>` тоже сохраняет свой клик, и библиотека не добавляет ни `role`, ни `tabindex`.
- Кнопки, ссылки и поля **внутри** элемента не начинают драг указателем, так что строка может
содержать собственные действия.

### Ручки: делайте их настоящими кнопками

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

С `handle` атрибуты ставятся на ручку, и перетаскивание с клавиатуры начинается с неё (ярлык
**Archive** выше). `<button>` фокусируется и уже является кнопкой, поэтому ему не нужны
`tabindex` и `role`. Дайте ему `aria-label`: у иконки-ручки нет собственного имени, а «Drag
Midnight Drive» говорит больше, чем «button».

<tip>

Ручка держит фокус весь драг с клавиатуры, пока её строка служит слотом. Опустошайте слот через
`opacity: 0`, а не `visibility: hidden` или `display: none` на ручке: скрытый элемент теряет
фокус. Библиотека вернёт его после броска, но скринридер в промежутке может сказать «body».

</tip>

## Объявления

Live-регион в провайдере озвучивает каждый захват, перемещение, бросок и отмену. Сортируемые
списки говорят, где находится элемент: *«Picked up item t2 at position 2 of 5 in list
playlist.»* Перемещения озвучиваются, когда драг замер на 500 ms, так что быстрый драг
указателем не зачитывается слот за слотом. Панель в демо записывает каждый текст, который
получает провайдер, включая перемещения, которые драг указателем проходит по пути.

Встроенные тексты — на английском и называют всё по id, если вы не дадите `label`. Его
принимают элементы, списки, деревья и цели:

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*«Picked up Blue in Green at position 2 of 5 in Playlist.»* Эти названия доходят и до ваших
собственных текстов и мониторов: `active.label`, `over.label`, каждый из `active.items`, а в
контексте — `position.label` и `partner.label`.

Для другого языка или других слов напишите тексты сами, как это делает повестка. Каждый текст
получает событие и `context`: `position`, которую озвучил бы встроенный текст (`list`, `index`
с 0, `length`, `label` списка), а также `count`, `copy` и `partner` при обмене местами.

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
      При старте
    </th>
    
    <th>
      Во время перемещения
    </th>
    
    <th>
      В конце
    </th>
    
    <th>
      При отмене
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
      Где элемент взяли
    </td>
    
    <td>
      Где он приземлился бы; нет вне списков
    </td>
    
    <td>
      Где он приземлился
    </td>
    
    <td>
      Куда он вернулся
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
      Обмен местами: элемент, с которым обменялись, и где он сейчас
    </td>
    
    <td>
      То же, после броска
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      , <code>
        copy
      </code>
    </td>
    
    <td>
      Сколько элементов и копирует ли драг
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
      Событие
    </th>
    
    <th>
      Озвучивается, когда
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
      Элемент взят.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      Элемент переходит в другое место (слот списка, другую цель), когда драг замер на 500 ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      Он брошен. Новый порядок уже записан.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Драг отменён или бросок отклонён: элемент вернулся.
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
      
      : драг продолжается (см. <a href="/docs/guides/drop-decisions">
        решение о броске
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

- Текст заменяет объявление события; `undefined` оставляет вариант по умолчанию; `''` не
озвучивает ничего. События, которые вы не указали, сохраняют значения по умолчанию, например
позиции сортируемых списков.
- `screenReaderInstructions` — текст, на который каждый перетаскиваемый элемент ссылается через
`aria-describedby`. Оба пропа реактивны: демо переключает язык на лету.
- `:announcements="false"` заглушает регион, например когда вы озвучиваете через собственный.

<note>

Для другого языка задайте все пять текстов и инструкции: каждый, который вы не укажете,
озвучивается на английском, включая позиции в сортируемых списках. Задайте и `lang` страницы,
чтобы скринридер выбрал правильный голос.

</note>

## Перемещение без перетаскивания

Некоторые люди вообще не могут перетаскивать. WCAG 2.5.7 требует способа перемещать элементы
одиночными кликами. Используйте стрелки и галочку на каждой строке: они перемещают книги без
драга, а фокус остаётся там, где вы.

<example height="27.5rem" hint="Используйте кнопки-стрелки с клавиатуры или перетащите за ручку" name="a11y-move-buttons">



</example>

Кнопка меняет данные; список отрисовывает перемещение. С `animate` на списке строки скользят
так же, как при драге (и стоят на месте у пользователей, которые просят уменьшить движение):

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animate: true });

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

### Сохраните фокус

Перемещение элемента в DOM забирает с него фокус, так что только что нажатая кнопка его теряет.
Верните его, когда строка переместилась:

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

Строка, которая исчезает (галочка отмечает книгу прочитанной), уносит фокус с собой: переведите
его на следующую строку или на последнюю. Драгам ничего этого не нужно: библиотека сама
возвращает фокус на брошенный элемент, даже если он заново рендерится в другом списке.

<tip>

`@vue-dnd-kit/actions` вместо этого превращает каждую кнопку в настоящее перетаскивание с
клавиатуры: `moveItem(id, { index })` озвучивается, проходит через `onBeforeDrop` и `onDrop`,
анимируется и сохраняет фокус на элементе. См.
[программное перетаскивание](https://zizigy.github.io/docs/guides/sensors#programmatic-drags).

</tip>

## Касание

Драг касанием начинается после долгого нажатия в 200 ms. Сдвиг больше чем на 5 px до этого
прокручивает страницу, так что списки остаются прокручиваемыми. Настройте оба значения через
`activation` провайдера и нарисуйте кольцо долгого нажатия по `useDnD().activation.progress`:
см. [провайдер](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag). Драг касанием коротко
вибрирует при старте; `:haptics="false"` это отключает.

## Уменьшение движения

С `prefers-reduced-motion: reduce` собственные анимации библиотеки не выполняются: элементы
при сортировке сразу прыгают на места, оверлей не летит при броске, а изменения `animate`
появляются мгновенно. Ваши собственные функции анимации по-прежнему выполняются, с
`reducedMotion: true`, так что решаете вы: пропустить их или оставить короткое затухание. См.
[анимации](https://zizigy.github.io/docs/guides/animations).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
