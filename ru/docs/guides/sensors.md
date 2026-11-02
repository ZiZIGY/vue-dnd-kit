---
title: "Сенсоры и программное перетаскивание"
description: "Как ввод становится драгом — сенсоры указателя и клавиатуры, условия активации, canDrag, собственные сенсоры и драги, которые вы задаёте скриптом через @vue-dnd-kit/actions."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Сенсор превращает ввод в драги. Он лишь говорит провайдеру «перетащи этот элемент отсюда», затем
куда сдвинулся ввод и был ли бросок или отмена. Остальное делает провайдер, одинаково для всех
сенсоров: один драг за раз, отказ отключённым элементам, условия активации, сортировка,
автоскролл, объявления, <kbd value="Escape">



</kbd>

 и весь бросок.

## Встроенные сенсоры

<table>
<thead>
  <tr>
    <th>
      Сенсор
    </th>
    
    <th>
      Ввод
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerSensor
      </code>
    </td>
    
    <td>
      Мышь, касание и перо, через Pointer Events. Захватывает указатель, не даёт странице выделять текст или прокручиваться под драгом касанием и поглощает клик, который следует за драгом.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      <kbd value="Space">
        
      </kbd>
      
       и <kbd value="Enter">
        
      </kbd>
      
       берут и бросают, стрелки двигают, <kbd value="Escape">
        
      </kbd>
      
       отменяет — любой драг, в том числе драг указателем.
    </td>
  </tr>
</tbody>
</table>

Оба работают по умолчанию. `sensors` провайдера заменяет список:

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, joystick.sensor]">
```

Чтобы отключить перетаскивание с клавиатуры, лучше используйте `:keyboard="false"`, а не
убирайте `keyboardSensor`: сенсор клавиатуры — это ещё и то, что отменяет любой драг по
<kbd value="Escape">



</kbd>

. Его клавиши переназначаются через `keyboard.keys` (см.
[Доступность](https://zizigy.github.io/docs/guides/accessibility#the-keyboard)).

## Условия активации

Нажатие не начинает драг сразу: оно ждёт своего условия активации, так что клик остаётся
кликом, а свайп по-прежнему может прокручивать страницу. Переключите правила этого списка и
нажмите на строку:

<example height="34.5rem" hint="Удерживайте строку, пока кольцо не замкнётся, или переключите правило" name="activation-modes">



</example>

У условия три поля:

<table>
<thead>
  <tr>
    <th>
      Поле
    </th>
    
    <th>
      Драг начинается…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        distance
      </code>
    </td>
    
    <td>
      Когда указатель сдвинулся на столько px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay
      </code>
    </td>
    
    <td>
      Когда нажатие длится столько ms. Вместе с <code>
        distance
      </code>
      
       — что наступит раньше.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        tolerance
      </code>
    </td>
    
    <td>
      С <code>
        delay
      </code>
      
      : насколько указатель может сдвинуться за это время. Сверх этого нажатие сдаётся, чтобы страница могла прокручиваться. По умолчанию 5 px, если нет <code>
        distance
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Если своих условий нет, у каждого типа указателя своё значение по умолчанию:

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
      Мышь
    </td>
    
    <td>
      После сдвига на 4 px. Сразу при нажатии на <code>
        handle
      </code>
      
      , если не задано условие для мыши.
    </td>
  </tr>
  
  <tr>
    <td>
      Перо
    </td>
    
    <td>
      После сдвига на 4 px.
    </td>
  </tr>
  
  <tr>
    <td>
      Касание
    </td>
    
    <td>
      После нажатия в 200 ms. Сдвиг больше чем на 5 px до этого отменяет нажатие, и страница вместо этого прокручивается.
    </td>
  </tr>
</tbody>
</table>

### Где их задавать

Для каждого типа указателя — `mouse`, `touch`, `pen` — на провайдере, области перетаскивания или
элементе. Для каждого типа важнее собственное условие элемента, затем его области, затем
провайдера:

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 250, tolerance: 5 } }">
```

```ts
// Inbox.vue: the rules of every drag that starts inside the panel.
makeDragArea(panel, { activation: () => MODES[mode.value].activation });

// One item: a longer press by touch, the area's rule for the mouse.
makeSortableItem(el, { item: () => props.task, activation: { touch: { delay: 400, tolerance: 8 } } });
```

Опции читаются в начале нажатия, поэтому геттер или ref переключают их вживую, как в демо.
Перетаскивание с клавиатуры начинается сразу. [Собственный сенсор](#a-sensor-of-your-own)
запрашивает своё условие или то, что настроено для типа указателя.

### Кольцо долгого нажатия

Пока нажатие ждёт, `useDnD().status` равен `'activating'`, а `activation.progress` идёт от 0 до
1 — по времени с `delay`, по пройденному расстоянию с `distance`. Демо рисует кольцо там, где
началось нажатие:

```vue [Inbox.vue]
<script setup lang="ts">
const { status, activation } = useDnD();
</script>

<template>
  <svg v-if="status === 'activating'" class="ring" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="17" pathLength="1" :stroke-dasharray="`${activation.progress.value} 1`" />
  </svg>
</template>
```

Дайте кольцу `pointer-events: none`: оно находится под указателем, а драг проверяет попадание по
тому, что там. Нажатие, которое сдаётся — сдвинулось дальше своего `tolerance` или отпущено
слишком рано, — сразу возвращает `status` в `'idle'`.

### Ручки начинают сразу

С `handle` драг начинает только ручка, и нажатие мышью на неё перетаскивает сразу: захват за
ручку не с чем перепутать. Нажатие, отпущенное там, где началось, остаётся кликом, так что
ручка может открывать меню по `click` (указатель захватывается, только когда сдвинется).
Касание всё равно ждёт долгого нажатия, если только ручка не может прокручивать страницу. Дайте ей `touch-action: none`, а элементу — небольшое расстояние:

```ts [Message.vue]
makeSortableItem(el, {
  item: () => props.chat,
  handle: '.grip',
  // The grip has `touch-action: none`: a touch on it can't scroll, so it drags after 4 px.
  activation: { touch: { distance: 4 } },
});
```

Условие для мыши, заданное на элементе, его области или провайдере, действует и на ручки.
Сделайте ручку `<button>`, как в демо: она получает фокус, так что с неё начинается и
перетаскивание с клавиатуры.

## Только некоторые нажатия

`canDrag` — ещё один фильтр на перетаскиваемых и сортируемых элементах. Он получает событие ввода
и отвечает `true` или `false` для этого нажатия. Здесь драгу указателем нужен
<kbd value="Shift">



</kbd>

; клавиатура перетаскивает как обычно:

<example height="28rem" hint="Перетащите строку с Shift и без; отметьте чекбокс, выберите владельца" name="can-drag">



</example>

```ts [Task.vue]
makeSortableItem(el, {
  item: () => props.task,
  // Never: the row is locked (and says so to screen readers with aria-disabled).
  disabled: () => !!props.task.locked,
  // Per press: pointer drags only with Shift held; the keyboard as usual.
  canDrag: (event) => {
    if (!props.shiftOnly || event instanceof KeyboardEvent || event.shiftKey) return true;
    emit('refused');
    return false;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      Опция
    </th>
    
    <th>
      Когда спрашивается
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
        disabled
      </code>
    </td>
    
    <td>
      Вживую, и выставляется как <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      Элементы, которые вообще не могут двигаться: заблокированные, только для чтения.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        canDrag
      </code>
    </td>
    
    <td>
      Один раз на нажатие, с его событием
    </td>
    
    <td>
      Правила про ввод: зажатая клавиша, кнопка, тип указателя.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Куда приходится нажатие
    </td>
    
    <td>
      Элементы, которые начинают драг только с одной части.
    </td>
  </tr>
</tbody>
</table>

`canDrag` спрашивается до условия активации, с `pointerdown` или `keydown`. Тип указателя — ещё
одно правило, которое он может задать:

```ts
// Mouse and pen drag; a touch on the row always scrolls the page.
canDrag: (event) => !(event instanceof PointerEvent && event.pointerType === 'touch'),
```

Интерактивные потомки — кнопки, поля ввода, чекбоксы, редактируемые поля — никогда не начинают
драг указателем, так что внутри перетаскиваемого элемента они продолжают работать, как чекбокс
и меню владельца в демо. С `handle` драг начинает только ручка.

## Собственный сенсор

Геймпад, экранный джойстик, голосовые команды: всё, что может указать на элемент и двигаться,
может управлять драгом. Этот геймпад — сенсор. Удерживайте <kbd value="A">



</kbd>

 над героем, чтобы
взять его, управляйте крестовиной, повторное <kbd value="A">



</kbd>

 бросает, <kbd value="B">



</kbd>

 отменяет.
Мышь и клавиатура рядом с ним по-прежнему работают:

<example height="30rem" hint="Удерживайте A над героем, затем удерживайте стрелку: герой движется по списку" name="joystick">



</example>

`defineSensor` даёт сенсору имя и `setup`, который получает сторону провайдера, один раз на
провайдер:

```ts [joystick.ts]
const sensor = defineSensor({
  name: 'joystick',
  // Once per provider, in the browser. The cleanup runs when the provider unmounts.
  setup(ctx) {
    context = ctx;
    return () => {
      context = null;
      drag = null;
    };
  },
});
```

Нажатие запрашивает у провайдера драг через `activate()`. Цель проверяется как настоящее
нажатие: это должен быть перетаскиваемый элемент этого провайдера, не отключённый и не кнопка
внутри него:

```ts [joystick.ts]
/** A goes down: drops a running drag, or starts a hold over what is under the cursor. */
const press = () => {
  if (drag?.state === 'dragging') return void drag.drop();
  const at = point();
  const target = document.elementFromPoint(at.x, at.y);
  if (!target || !context) return;
  drag = context.activate({
    target, // checked like a real press: a draggable of this provider, not disabled
    point: at,
    type: 'pointer', // follows points: lists sort under it, containers auto-scroll
    activation: { delay: 300 }, // `useDnD().activation.progress` runs meanwhile
    onEnd: (ended) => {
      if (drag === ended) drag = null;
    },
  }); // null: nothing to drag there
};
```

Затем драг движется вместе с крестовиной, а A или B его завершают:

```ts [joystick.ts]
const move = (dx: number, dy: number) => {
  cursor.value = { x: cursor.value.x + dx, y: cursor.value.y + dy }; // clamped in the demo
  drag?.move(point()); // pending: checks the tolerance; dragging: moves
};

const release = () => {
  if (drag?.state === 'pending') drag.cancel(); // A let go before the hold is over
};

const cancel = () => drag?.cancel();
```

Добавьте сенсор в `sensors` провайдера, как это делает демо, или запустите его на время жизни
компонента через `useSensor(joystick.sensor)`. Точки — в координатах вьюпорта: демо хранит свой
курсор в координатах сцены, чтобы он прокручивался вместе со страницей, и переводит его в
`point()`.

### Что получает сенсор

`setup(context)` получает сторону провайдера:

<table>
<thead>
  <tr>
    <th>
      Член
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
        props
      </code>
    </td>
    
    <td>
      Пропсы провайдера (<code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      …). Читайте их, когда нужно: они могут меняться.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      Статус драга провайдера, каким бы сенсором ни шёл драг.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag
      </code>
    </td>
    
    <td>
      Текущий драг провайдера, ожидающий или идущий, каким бы сенсором он ни был начат. <code>
        null
      </code>
      
      , если драга нет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activate(options)
      </code>
    </td>
    
    <td>
      Запрашивает драг. Возвращает <code>
        SensorDrag
      </code>
      
       или <code>
        null
      </code>
      
      , если драг начать нельзя.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Отменяет драг провайдера или ожидающее нажатие.
    </td>
  </tr>
</tbody>
</table>

`activate()` принимает:

<table>
<thead>
  <tr>
    <th>
      Опция
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
        target
      </code>
    </td>
    
    <td>
      Куда пришёлся ввод: элемент внутри перетаскиваемого элемента или id перетаскиваемого элемента. Элемент проверяется как настоящее нажатие (ручка, не интерактивный потомок); id пропускает проверки.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        point
      </code>
    </td>
    
    <td>
      Где начинается драг, в координатах вьюпорта. По умолчанию — центр перетаскиваемого элемента.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        type
      </code>
    </td>
    
    <td>
      <code>
        'pointer'
      </code>
      
       (по умолчанию): следует за точками, проверяет попадание по целям, использует автоскролл. <code>
        'keyboard'
      </code>
      
      : двигается по элементам, прокручивает к целям, в конце возвращает фокус.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      Условие (<code>
        { delay: 300 }
      </code>
      
      ) или тип указателя (<code>
        'touch'
      </code>
      
      ), чтобы использовать настроенное для него. По умолчанию — нет, драг начинается сразу.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        event
      </code>
    </td>
    
    <td>
      Событие ввода, передаётся в <code>
        canDrag
      </code>
      
       элемента (без него <code>
        canDrag
      </code>
      
       не спрашивается). <code>
        pointerType
      </code>
      
       касания делает драг драгом касанием (вибрация).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onStart(drag)
      </code>
    </td>
    
    <td>
      Драг начался, после своей активации.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnd(drag)
      </code>
    </td>
    
    <td>
      Драг окончен: прерван, брошен или отменён — кем угодно.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onResume(drag)
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       ответил <code>
        'continue'
      </code>
      
      : драг продолжается, и <code>
        move
      </code>
      
      , <code>
        drop
      </code>
      
       и <code>
        cancel
      </code>
      
       снова действуют.
    </td>
  </tr>
</tbody>
</table>

Возвращаемый `SensorDrag`:

<table>
<thead>
  <tr>
    <th>
      Член
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
        type
      </code>
    </td>
    
    <td>
      Id перетаскиваемого элемента и <code>
        'pointer'
      </code>
      
       или <code>
        'keyboard'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        state
      </code>
    </td>
    
    <td>
      <code>
        'pending'
      </code>
      
       (ждёт активации), <code>
        'dragging'
      </code>
      
      , затем <code>
        'ended'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        started
      </code>
    </td>
    
    <td>
      Драг начался, даже если с тех пор закончился.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        move(point)
      </code>
    </td>
    
    <td>
      Ввод сдвинулся. В ожидании проверяет допуск; во время драга двигает драг.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        step(direction)
      </code>
    </td>
    
    <td>
      Перетаскивание с клавиатуры: один шаг стрелки, <code>
        'up' | 'down' | 'left' | 'right'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        place({ list, index })
      </code>
    </td>
    
    <td>
      Ставит элемент в позицию сортируемого списка, как это делают перемещения с клавиатуры. Разрешается в <code>
        false
      </code>
      
      , если ни один список не принимает его туда.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop()
      </code>
    </td>
    
    <td>
      Бросает. Разрешается в <code>
        true
      </code>
      
      , если бросок прошёл, когда он приземлился.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Отменяет: элемент летит обратно, или ожидающее нажатие оставляется.
    </td>
  </tr>
</tbody>
</table>

Вызовы, которые больше не имеют смысла — перемещение после конца, второй `drop()`, —
игнорируются. Полные типы: [Сенсоры](https://zizigy.github.io/docs/api/sensors).

<tip>

Чтобы обернуть встроенный сенсор, запустите его `setup` с собственным контекстом. Создайте его
через `Object.create(context, { activate: { value: myActivate } })`, а не через spread, чтобы
живые геттеры (`status`, `drag`, `props`) продолжали работать.

</tip>

## Программное перетаскивание

`@vue-dnd-kit/actions` перемещает элементы из кода: кнопки «Move up», меню, горячие клавиши,
отмена, обучающие туры, тесты. Он построен на публичном API сенсоров, и его драги — настоящие:
озвучиваются и анимируются, проходят через `onBeforeDrop`, `onDrop`, `e.result` и
`preventDefault()`, по правилам провайдера (один драг за раз, отключённые элементы, `accept` и
`group.put`).

<example height="31.5rem" hint="Наведите на трек, чтобы увидеть его стрелки, перемешайте или запустите скриптовый драг" name="actions">



</example>

```bash
npm i @vue-dnd-kit/actions
```

### moveItem: один вызов — одно перемещение

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';

const { moveItem } = useDnDActions(); // in setup, under a provider

await moveItem('card-1', { index: 0 }); // to the top of its list
await moveItem('card-1', { list: 'done' }); // to the end of another list
await moveItem('card-1', { list: 'done', index: 2 }); // to a place in another list
```

- `list` — `id` сортируемого списка. Без него элемент остаётся в своём списке.
- `index` — где окажется элемент, считая без самого элемента, и ограничен размером списка. Без
него элемент идёт в конец.
- Разрешается в `true`, если бросок прошёл, и в `false`, если элемент не отрендерен или
отключён, ни один список не принимает его туда или бросок отклонён.
- Вызовы встают в очередь: каждый ждёт, пока провайдер освободится, так что быстрый второй клик
не теряется. Перемешивание в демо — пять вызовов подряд.
- Он выполняется как перетаскивание с клавиатуры, поэтому озвучивается, а фокус остаётся на
элементе.
- Только списки: у позиций в дереве есть ещё и глубина.

Строку с кнопками перемещения см. в [Доступности](https://zizigy.github.io/docs/guides/accessibility#moving-without-dragging).

### startDrag: скриптовый драг

```ts
const { startDrag } = useDnDActions();

const drag = startDrag('card-1'); // null when it can't start now
if (drag) {
  await drag.moveTo(document.querySelector('#trash')!); // onto an element
  await drag.moveTo({ x: 400, y: 120 }); // to a point, in viewport coordinates
  await drag.moveTo({ list: 'done', index: 2 }); // to a list position
  await drag.drop(); // true when the drop went through; or drag.cancel()
}
```

`moveTo` разрешается, когда перемещение отрендерилось, `drop` — когда бросок приземлился. Кнопка
«Play a scripted drag» в демо плавно ведёт последний трек вверх маленькими шагами `moveTo`, затем
бросает его наверху. `startDrag(id, { from: { x, y } })` берёт элемент в точке вместо его
центра.

### Передать драг клавиатуре

`startDrag(id, { type: 'keyboard' })` берёт элемент как перетаскивание с клавиатуры. Ваш код
может двигать его через `await drag.step('down')` или оставить это пользователю: сенсор
клавиатуры управляет каждым перетаскиванием с клавиатуры, кто бы его ни начал. Так получается
пункт меню «Move»:

<example height="26rem" hint="Откройте меню строки: стрелки или перенос на другую неделю" name="move-menu">



</example>

```ts [Row.vue]
const { moveItem, startDrag } = useDnDActions();

// One move in one call: picked up, put there and dropped, announced and animated.
const toOther = () => moveItem(props.task.id, { list: props.other.id, index: 0 });
// A keyboard drag, handed to the arrow keys: Space or Enter drops, Escape cancels.
const withKeys = () => {
  el.value?.focus();
  startDrag(props.task.id, { type: 'keyboard' });
};
```

Стрелки двигают строку по слотам, <kbd value="ArrowLeft">



</kbd>

 и <kbd value="ArrowRight">



</kbd>

 — на
другую неделю (списки разделяют `group`). Когда драг заканчивается, фокус возвращается на
строку. Подсказки клавиш под доской подсвечиваются, пока `useDnD().active.value?.sensor` равен
`'keyboard'`.

### Вне компонентов

`useDnDActions()` запускает один сенсор, по имени `actions`, в провайдере выше. Чтобы управлять
провайдером из стора или тестового окружения либо под собственным именем, создайте действия в
сенсоре, который запускаете сами:

```ts
import { defineSensor } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';

export let tour: DnDActions | undefined;
export const tourSensor = defineSensor({
  name: 'tour',
  setup: (context) => void (tour = createDnDActions(context)),
});
```

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
```

Затем вызывайте `await tour?.moveItem('card-1', { list: 'done' })` откуда угодно. При серверном
рендеринге ничего не перетаскивается: `moveItem` разрешается в `false`, а `startDrag` возвращает
`null`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
