---
title: "Анимации"
description: "Элементы скользят при сортировке, бросок приземляется в свой слот, а изменения данных тоже могут анимироваться. Настройте каждую анимацию, анимируйте оверлей, слот и списки через CSS или подключите motion или GSAP."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Три вещи анимируются сами: элементы, скользящие при сортировке, оверлей, приземляющийся при
броске, и — если вы это включите — изменения ваших данных, сделанные не драгом. Каждая
принимает одни и те же значения, на провайдере или ближе к тому, что она анимирует:

<table>
<thead>
  <tr>
    <th>
      Опция
    </th>
    
    <th>
      Где
    </th>
    
    <th>
      По умолчанию
    </th>
    
    <th>
      Что анимирует
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        animation
      </code>
    </td>
    
    <td>
      провайдер, список, дерево
    </td>
    
    <td>
      включена, 200 ms
    </td>
    
    <td>
      Скольжение элементов на новые места при сортировке, при броске и при отмене.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      провайдер, перетаскиваемый элемент, сортируемый элемент, список, дерево (<code>
        overDropAnimation
      </code>
      
       у цели)
    </td>
    
    <td>
      включена, 250 ms
    </td>
    
    <td>
      Приземление оверлея в свой слот или полёт обратно при отмене.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      провайдер, список, дерево
    </td>
    
    <td>
      <strong>
        выключена
      </strong>
    </td>
    
    <td>
      Изменения ваших данных, сделанные не драгом: элементы добавлены, удалены, перемещены или отфильтрованы, строки дерева показаны или скрыты.
    </td>
  </tr>
</tbody>
</table>

Каждая принимает `true` (тайминг по умолчанию), `false` (выключено), `{ duration, easing }` или
функцию, которая анимирует сама:

```vue
<DnDProvider
  :animation="{ duration: 180, easing: 'cubic-bezier(.2, .8, .2, 1)' }"
  :drop-animation="{ duration: 300 }"
  animate-changes
>
```

Собственные `animation` и `animateChanges` списка или дерева важнее, чем у провайдера; про
`dropAnimation` см. [для элемента и для цели](#per-item-and-per-target). Остальное движение —
ваше: оверлей, слот и списки — элементы с
[data-атрибутами и ref](https://zizigy.github.io/docs/guides/styling), и двигают их CSS или библиотека анимаций.

## Сортировка

Во время драга черновик списка перестраивается, и элементы скользят на новые места. Рука ниже
задаёт своему списку обе опции: выберите `animation` и сортируйте карты, выберите
`dropAnimation` и отпустите одну.

<example height="24rem" hint="Выберите тайминги, сортируйте карты, отпустите одну за пределами стола" name="anim-sort">



</example>

```ts [Hand.vue]
const springy: LayoutAnimation = ({ element, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  return element.animate(
    [{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: '0 0' }],
    { duration: 500, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
  );
};

const animation = shallowRef<LayoutAnimation>(true); // true, { duration: 600 }, springy or false
const dropAnimation = shallowRef<DropAnimation>(true); // true, { duration: 700 }, toss or false

const { items } = makeSortableList(table, {
  items: cards,
  strategy: 'horizontal',
  dropOutside: 'cancel', // let go off the table: the card flies back
  animation,
  dropAnimation,
});
```

Это FLIP на CSS-свойстве `translate`, через Web Animations API. `translate` складывается с
любым вашим `transform`, так что позиционирование строк виртуального списка остаётся
нетронутым. Когда элемент снова сдвигается до конца анимации, следующая начинается с того
места, где он показан. Та же анимация двигает элементы при броске и при отмене.

`animation` списка принимает значение или ref, который читается для каждого перемещения:
ref переключает её, как выше. Функция там — это анимация, а не геттер.

<warning>

Не оборачивайте сортируемые элементы в `<TransitionGroup>`: каждое перемещение анимировалось бы
дважды. Для изменений, сделанных не драгом, включите [`animateChanges`](#data-changes-animatechanges).

</warning>

## Бросок

При броске оверлей летит с места, где вы отпустили, в слот элемента; при отмене — обратно
туда, откуда элемент начал. В руке выше выберите `dropAnimation`, затем утащите карту со стола
и отпустите: бросок отменяется, и она летит обратно. `toss` — отдельная функция:

```ts [Hand.vue]
/** The overlay arcs to its slot, as if tossed. */
const toss: DropAnimation = ({ overlay, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  // No visible slot to land on: fade out where it is.
  if (!to) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
  const place = (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`;
  const rise = Math.min(120, Math.hypot(to.left - from.left, to.top - from.top) / 2);
  return overlay.animate(
    [
      { transform: place(from.left, from.top), width: `${from.width}px`, height: `${from.height}px` },
      { transform: place((from.left + to.left) / 2, Math.min(from.top, to.top) - rise), offset: 0.45 },
      { transform: place(to.left, to.top), width: `${to.width}px`, height: `${to.height}px` },
    ],
    { duration: 550, easing: 'ease-in-out', fill: 'forwards' },
  );
};
```

Рука передаёт её своему списку. На провайдере она приземляет каждый драг:

```vue
<DnDProvider :drop-animation="toss">
```

- Блок приземляется со своей позицией (`transform`) и размером (`width`, `height`): содержимое
заново раскладывается в размере слота и никогда не масштабируется.
- Когда у элемента после броска нет видимого слота (он прокручен за пределы или брошен в папку
или зону удаления), `to` равен `null`. Тогда по умолчанию оверлей растворяется, сжимаясь в
зону, на которую его бросили (`into`), или на месте.
- При мульти-драге клоны остальных элементов приземляются в свои слоты сами, с таймингом по
умолчанию, если `dropAnimation` — функция. В зону они уходят один за другим, а блок — после
них (см. [файлы и папки](https://zizigy.github.io/docs/guides/multi-drag#into-a-folder)).
- `dropAnimation` читается при каждом броске: ref переключает её для следующего, как в руке,
и так же — проп провайдера, привязанный к ref.
- Прокрутка во время приземления не сбивает его с пути. Блок — `position: fixed`, поэтому он
следует за тем, на что приземляется (слот, зона, иначе цель, на которую его бросили), своим
CSS `translate`, поверх `transform`, который двигает анимация. В своей анимации двигайте
`transform`, как выше, а не `translate`.
- Следующий драг не ждёт: каждый бросок приземляется в собственном блоке, пока идут новые
драги. Нажатие на приземляющийся блок ловит его в полёте, и драг продолжается с того места,
где он находится. `onDragSettle` сообщает, когда оверлей драга добрался до места: корзина
ниже тогда закрывает крышку.

Во время драга оверлей к тому же принимает размер слота, в который приземлится
(`overlayFit: 'slot'`, по умолчанию), так что броску редко нужно менять размер. См.
[оверлей](https://zizigy.github.io/docs/guides/overlay#size-overlayfit).

### Для элемента и для цели

`dropAnimation` провайдера — значение по умолчанию. Перетаскиваемый элемент, сортируемый элемент
или список (для своих элементов) могут задать собственную, а цель может сказать последнее слово
о том, что в неё приземляется: `makeDroppable(el, { overDropAnimation })`, `overDropAnimation` списка
или дерева. Для каждого броска берётся первая заданная:

1. Анимация цели (при отмене цели нет).
2. Собственная анимация перетаскиваемого элемента.
3. Анимация его списка.
4. Анимация провайдера.

Ниже корзина, ваза и полка задают каждая свою. Полка приземляет свои товары с отскоком, у вазы
собственное медленное приземление, а корзина забирает брошенное на неё в свою иконку: товар
остаётся на полке, так что его слот там — не место для приземления. Под полкой подсвечивается
та анимация, с которой приземляется каждый драг.

<example height="24rem" hint="Переставьте кружку, затем вазу; потом бросьте любую из них в корзину" name="anim-cart">



</example>

```ts [Shop.vue]
// 3. The list's, for its items without one of their own.
makeSortableList(shelf, {
  items: products,
  strategy: 'horizontal',
  dropAnimation: { duration: 450, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
});
```

```ts [Product.vue]
// 2. The item's own: it wins over its list's.
makeSortableItem(el, {
  item: () => props.product,
  dropAnimation: props.product.fragile ? { duration: 1100, easing: 'ease-in-out' } : undefined,
});
```

```ts [Cart.vue]
// 1. The target's: it wins over both.
const intoCart: DropAnimation = ({ overlay, from, reducedMotion }) => {
  const end = icon.value?.getBoundingClientRect();
  if (!end || reducedMotion) return;
  // Into the icon, shrinking: the box scales around its top left corner.
  const scale = end.height / from.height;
  const animation = overlay.animate(
    [
      { transform: `translate3d(${from.left}px, ${from.top}px, 0)` },
      {
        transform: `translate3d(${end.left + (end.width - from.width * scale) / 2}px, ${end.top}px, 0) scale(${scale})`,
        opacity: 0,
      },
    ],
    { duration: 450, easing: 'cubic-bezier(.55, 0, .75, .2)', fill: 'forwards' },
  );
  animation.finished.then(() => landed.value++, () => {}); // the icon bounces
  return animation;
};

makeDroppable(el, { id: 'cart', overDropAnimation: intoCart, onDrop: … });
```

`false` тоже считается заданной: цель с `overDropAnimation: false` оставляет оверлей там, где его
бросили. Функция получает цель как `over`, так что одна функция может обрабатывать цели
по-разному.

### Собственное приземление содержимого

Бросок также ждёт анимации внутри оверлея, которые идут в момент его начала: CSS-анимации и
переходы, которые компонент оверлея запускает при `status: 'dropping'`. Над корзиной фото
сминается; после броска оно летит в корзину, и бросок заканчивается, когда оно внутри:

<example height="27rem" hint="Перетащите фото в корзину; Undo возвращает его" name="anim-trash">



</example>

```ts [TrashBin.vue]
makeDroppable(el, {
  id: 'trash',
  // The overlay reads it as `over.data`: it aims the photo at the bin's mouth.
  data: () => ({ bin: bin.value }),
  overOverlay: Crumple,
  // The box stays where it was let go: its content does the landing.
  overDropAnimation: false,
  onDrop: (event) => emit('drop', event), // the gallery calls `event.source?.remove()`
});

// Its landing is over: the photo is in, the lid shuts.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.over?.id === 'trash') shut.value++;
  },
});
```

```vue [Crumple.vue]
<template>
  <div class="crumple">
    <!-- `fall` is set at the drop: `--dx` and `--dy`, from the photo to the bin in `over.data`. -->
    <div class="paper" :class="{ falling: fall }" :style="fall">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.paper { clip-path: polygon(…); rotate: -8deg; scale: 0.7; }
.paper.falling { animation: fall 0.55s forwards; }
@keyframes fall {
  to { translate: var(--dx) var(--dy); rotate: -120deg; scale: 0.12; opacity: 0; }
}
</style>
```

Завершённые анимации и бесконечные циклы не учитываются, и бросок ждёт не дольше двух секунд.

## Изменения данных: `animateChanges`

Перетащите плитку, затем перемешайте, добавьте и удалите несколько. Драг анимируется по
умолчанию; изменения от кнопок анимируются, потому что сетка включает `animateChanges`.

<example height="22.75rem" hint="Перетаскивайте, перемешивайте, добавляйте, удаляйте" name="animate">



</example>

```ts
makeSortableList(listRef, { items: swatches, animateChanges: true });
```

Выключенная по умолчанию, `animateChanges` анимирует то, что меняет ваш массив без драга: сортировку,
перемешивание, перенос между списками одной группы, добавленный, удалённый или отфильтрованный
элемент. В дереве она также охватывает строки, которые узел показывает или скрывает при
раскрытии и сворачивании. `<DnDProvider animate-changes>` включает её для всех списков и деревьев.

Её части можно настроить по отдельности:

```ts
animateChanges: { duration: 250, move: true, enter: true, leave: { duration: 150 } },
```

<table>
<thead>
  <tr>
    <th>
      Часть
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
        move
      </code>
    </td>
    
    <td>
      Элементы, сменившие места, скользят, как с <code>
        animation
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      Появившиеся элементы проявляются на месте.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        leave
      </code>
    </td>
    
    <td>
      Копия ушедшего элемента растворяется там, где он был, слегка сжимаясь. Она помечена <code>
        data-dnd-leaving
      </code>
      
       и удаляется по окончании.
    </td>
  </tr>
</tbody>
</table>

`duration` и `easing` применяются ко всем частям; каждая часть принимает `true`, опции, `false`
или функцию. Анимируются только элементы рядом с видимой областью, так что строки, которые
виртуальный список не смонтировал, пропускаются. Опция читается при изменении `items`, поэтому
её может переключать ref, как переключатель в демо.

## Оверлей: подъём, наклон, посадка

Блок оверлея говорит, что он делает: `data-dnd-overlay="dragging"`, пока следует за
указателем, `"dropping"`, пока приземляется. Блок двигает и задаёт ему размер библиотека.
Внутри него `data-dnd-overlay-content` держит всё, что показывает оверлей, — один клон или
целую стопку, — и анимируете его вы. Возьмите кандидата: оверлей приподнимается и
наклоняется; отпустите — ложится ровно, приземляясь.

<example height="24.5rem" hint="Возьмите кандидата, перетащите в Hired, отпустите" name="anim-container">



</example>

```vue [index.vue]
<template>
  <DnDProvider overlay-class="pipeline-hand">…</DnDProvider>
</template>

<!-- Not scoped: the overlay's content element is the library's, outside this component. -->
<style>
.pipeline-hand {
  transition:
    rotate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    scale 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

[data-dnd-overlay='dragging'] > .pipeline-hand {
  rotate: 3deg;
  scale: 1.05;
}

/* Where the lift starts: the box appears already `dragging`. */
@starting-style {
  [data-dnd-overlay='dragging'] > .pipeline-hand {
    rotate: 0deg;
    scale: 1;
  }
}
</style>
```

- `overlay-class` ставит ваши классы на содержимое оверлея этого провайдера: и текущего драга,
и тех, что ещё приземляются. Tailwind тоже его принимает (`starting:` пишет `@starting-style`).
- Переходу нужно начало, а блок появляется уже в состоянии `dragging`: `@starting-style` даёт
подъёму его «до». Когда блок становится `dropping`, переход идёт обратно, и бросок ждёт его
окончания.
- Само содержимое анимируется так же, в своём компоненте: карточка в руке и колонки
[доски](https://zizigy.github.io/docs/examples/board) наклоняются, когда их берут
(`[data-dnd-overlay='dragging'] .column` с `@starting-style`). Ключевые кадры тоже работают:
они проигрываются с начала состояния.
- **Компонент оверлея** получает `status` как проп: его переходы могут следовать за ним.
Заметка из [демо слота провайдера](https://zizigy.github.io/docs/guides/overlay#the-providers-overlay-slot)
выпрямляется с `transition: rotate 0.25s`, когда `status` становится `'dropping'`.
- Сам блок (`[data-dnd-overlay]`) не трогайте: переход на нём отставал бы от указателя, а его
`transform` и размер пишет библиотека.

## Слот и списки

Перетаскиваемый элемент остаётся в своём списке как **слот**, в который приземлится, с пометкой
`data-dnd-placeholder`. Его списки тоже знают о драге: `isAccepting`, пока идёт драг, который
они принимают, `isOver`, пока он над ними. В воронке выше каждая колонка готовится, как только
вы берёте кандидата, та, что под карточкой, подсвечивается, её счётчик подпрыгивает, а слот
открывается и дышит.

```vue [Lane.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.lane.id,
  items: toRef(props.lane, 'people'),
  group: 'pipeline',
  dropzone: zone,
});
</script>

<template>
  <section ref="zone" class="lane" :class="{ ready: isAccepting, over: isOver }">
    <h3>
      {{ lane.title }}
      <!-- A new element for every count: its animation plays on each change. -->
      <span :key="items.length" class="count">{{ items.length }}</span>
    </h3>
    <ul ref="list">…</ul>
  </section>
</template>

<style scoped>
.lane { transition: background-color 0.25s, box-shadow 0.25s; }
.lane.ready { box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 35%, transparent); }
.lane.over { background: color-mix(in srgb, #42b883 8%, transparent); box-shadow: inset 0 0 0 1.5px #42b883; }
.count { animation: bump 0.3s ease-out; }
</style>
```

```css [Candidate.vue]
/* The slot opens where it appears, then breathes until the card lands. */
.candidate[data-dnd-placeholder] {
  animation: open 0.2s ease-out, breathe 1.2s ease-in-out 0.2s infinite;
}
```

- `items` — черновик: его `length` учитывает карточку, как только её слот входит в колонку,
поэтому счётчик меняется во время драга.
- Слот, переходящий в другой список, там — новый элемент, поэтому его ключевые кадры
проигрываются снова.
- Сами списки плавно растут и сжимаются, когда слот входит и уходит, а вместе с ними и то, что
вокруг (`animateSize`, включено по умолчанию; с `false` они меняются скачком). Оставьте их
размеры этому: список, размер которого вы меняете во время драга, сдвигает цели под
указателем. Свечение, обводка, цвета и `scale` безопасны.

## Свои анимации

Каждая опция принимает и функцию. Она получает контекст, запускает анимацию и возвращает её
`Animation`, промис, который завершается по её окончании, или ничего. Драг заканчивается вместе
с анимацией броска, а уходящая копия удаляется вместе со своей анимацией, но ни то, ни другое
не ждёт дольше секунды сверх `options.duration` (250 ms для броска, 200 ms для остальных).

```ts
// animation, animateChanges.move: an item moved from `from` to `to`
({ key, element, from, to, options, reason, signal, reducedMotion }) => Animation | Promise | void
// dropAnimation: `to` is null when there is no visible slot; `into` is the zone it went into
({ overlay, from, to, into, reason, active, options, reducedMotion }) => …
// animateChanges.enter: the element is already in place
({ key, element, to, options, reducedMotion }) => …
// animateChanges.leave: `element` is a copy where the item was, removed when you finish
({ key, element, from, options, reducedMotion }) => …
```

`reason` говорит, почему: `'drag'` или `'change'` для перемещения, `'drop'` или `'cancel'` для
оверлея. `options` содержит тайминг опции, так что функция может следовать за `duration`,
который вы задали рядом с ней.

Три правила держат свои анимации в согласии с библиотекой:

- **Анимируйте translate** от `from - to` до нуля, а не `transform`. Он складывается с
трансформациями, которые ставят на строки виртуальные списки или ваш CSS, а драги измеряют
элементы без него.
- **Учитывайте signal.** Он срабатывает, когда элемент снова сдвигается до конца анимации.
Сразу остановите анимацию и очистите её стили: раскладка измеряется сразу после этого.
Возвращённую `Animation` отменят за вас.
- **Приземляйте в слот позицией и размером** (`width`, `height`), а не `scale`: содержимое
оверлея заново раскладывается в размере слота. Там, где слота для приземления нет, сжатие
подходит: по умолчанию оверлей уменьшается в зону (`into`), а корзина выше — в свою иконку.

### motion

Гирлянда ниже работает на [motion](https://motion.dev/docs/vue): флажки и бросок пружинят
через функции провайдера, а компонент оверлея раскачивается в зависимости от скорости
указателя.

<example height="17rem" hint="Быстро потаскайте флажок из стороны в сторону, затем отпустите" name="anim-motion">



</example>

```vue [index.vue]
<script setup lang="ts">
import { animate } from 'motion-v';
import { DnDProvider, type DropAnimationContext, type LayoutAnimationContext } from '@vue-dnd-kit/core';

const spring = { type: 'spring', duration: 0.5, bounce: 0.3 } as const;

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const controls = animate(element, { translate: [`${from.left - to.left}px ${from.top - to.top}px`, '0px 0px'] }, spring);
  signal.addEventListener('abort', () => {
    controls.stop();
    element.style.translate = '';
  });
  return controls.finished;
};

const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return animate(overlay, { opacity: 0 }, { duration: 0.18 }).finished;
  return animate(
    overlay,
    { x: [from.left, to.left], y: [from.top, to.top], width: [from.width, to.width], height: [from.height, to.height] },
    spring,
  ).finished;
};
</script>

<template>
  <DnDProvider :animation="move" :drop-animation="drop">
    <Garland />
  </DnDProvider>
</template>
```

Компонент оверлея рендерится под провайдером, поэтому в нём работает `useDnD()`. Он следует
за указателем через motion value:

```vue [FlagOverlay.vue]
<script setup lang="ts">
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion-v';
import { useDnD, type DnDStatus, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();

const { pointer } = useDnD();
const x = useMotionValue(pointer.value?.x ?? 0);
watch(() => pointer.value?.x, (value) => value !== undefined && x.set(value));
const swing = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [-25, 0, 25]), { stiffness: 300, damping: 14 });
const calm = useReducedMotion();
</script>

<template>
  <!-- Held by its top edge: `transform-origin: 50% 0` in its CSS. -->
  <motion.div
    class="flag-overlay"
    :style="{ rotate: calm ? 0 : swing }"
    :animate="{ scale: status === 'dropping' || calm ? 1 : 1.1 }"
  >
    …
  </motion.div>
</template>
```

### GSAP

```ts [gsap-animations.ts]
import gsap from 'gsap';
import type {
  DropAnimationContext,
  EnterAnimationContext,
  LayoutAnimationContext,
  LeaveAnimationContext,
  Rect,
} from '@vue-dnd-kit/core';

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const tween = gsap.fromTo(
    element,
    { translate: `${from.left - to.left}px ${from.top - to.top}px` },
    { translate: '0px 0px', duration: 0.4, ease: 'power3.out' },
  );
  signal.addEventListener('abort', () => tween.revert());
  return tween.then();
};

const box = (rect: Rect) => ({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });

const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return gsap.to(overlay, { opacity: 0, duration: 0.2 }).then();
  return gsap.fromTo(overlay, box(from), { ...box(to), duration: 0.45, ease: 'back.out(1.2)' }).then();
};

const enter = ({ element, reducedMotion }: EnterAnimationContext) =>
  gsap.from(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.35 }).then();

const leave = ({ element, reducedMotion }: LeaveAnimationContext) =>
  gsap.to(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.25 }).then();

export const gsapAnimations = { animation: move, dropAnimation: drop, animateChanges: { move, enter, leave } };
```

```vue
<DnDProvider v-bind="gsapAnimations">
```

Полные типы опций — в [Анимациях](https://zizigy.github.io/docs/api/animations).

## Уменьшение движения

С `prefers-reduced-motion: reduce` собственные анимации библиотеки не выполняются: элементы и
оверлей сразу встают на места, а оверлей не плавно меняет размер между слотами. Ваши функции
выполняются всегда, с `reducedMotion: true`, так что решают они: пропустить движение или
оставить короткое затухание, как рецепты выше.

Ваш CSS — ваша забота. Помещайте подъёмы, наклоны и пульсации в
`@media (prefers-reduced-motion: no-preference)`, как демо на этой странице, а смену цветов
оставляйте снаружи: она показывает, куда попадёт бросок.

## Изменения раскладки не от библиотеки

Когда во время драга строки двигает что-то другое — виртуализатор, заново измеряющий строки,
загрузка изображения, — вызовите `captureLayout()` списка прямо перед тем, как изменение
отрендерится. Он измеряет строки там, где они есть, и после следующего рендера анимирует их на
новые места. Вне драга он ничего не делает. См. [Виртуальные списки](https://zizigy.github.io/docs/guides/virtual-lists).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
