---
title: "Оверлей"
description: "Что следует за указателем во время драга — клон по умолчанию и как его стилизовать, компоненты оверлея, которые меняются по ходу драга, несколько элементов сразу, его размер и где он рендерится."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/overlay"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Пока вы перетаскиваете, за указателем следует блок — **оверлей**. Сам перетаскиваемый
элемент остаётся на месте, как слот, в который он приземлится. При броске оверлей летит в
этот слот и исчезает.

Оверлей телепортируется в `body`, за пределы ваших компонентов. По умолчанию он показывает
клон перетаскиваемого элемента.

<example height="22rem" hint="Введите что-нибудь в строку, отметьте её, затем перетащите за ручку: копия сохраняет значения и график" name="overlay">



</example>

## Стандартный клон

Клон снимается при захвате, до того как что-либо сдвинется. Это глубокая копия элемента:

- Значения полей форм и пиксели `<canvas>` копируются.
- Вычисленные стили, которые элемент потерял бы вне своего списка, встраиваются инлайн:
унаследованные шрифты и цвета, стили, которые применяются через предков (`.list li { … }`),
ширины ячеек таблицы. Строка таблицы оборачивается в собственную таблицу.
- `id` и атрибуты `data-dnd-*` удаляются, а клон получает `aria-hidden`.
- Рябь и другие эффекты нажатия UI-китов (Vuetify, Quasar, PrimeVue, Naive UI) не
копируются.

В таблице выше строка, в которую вы что-то ввели, едет со своим текстом, суммой, отметкой и
графиком — в собственной таблице, ячейки которой сохраняют ширины настоящих.

Помечайте всё остальное, что не должно ехать с клоном, атрибутом **data-dnd-no-clone**:
кнопку меню, тултип, отметку выделения. Кнопка удаления в каждой строке остаётся на месте:

```vue [ExpenseRow.vue]
<tr ref="el" class="row">
  …
  <td><button type="button" aria-label="Remove" data-dnd-no-clone @click="emit('remove')">×</button></td>
</tr>
```

### Фон не угадывается

Клон показывает элемент как есть. Строка без собственного фона, потому что его рисует список
(`<li>` в белом `<ul>`, `v-list-item`, строка таблицы), даёт **прозрачный** клон. Задайте ему
фон списка в CSS, здесь — на ячейках:

```vue [ExpenseRow.vue]
<style scoped>
[data-dnd-overlay] .row td {
  background: color-mix(in srgb, currentColor 4%, Canvas);
}
</style>
```

Клон сохраняет классы и атрибуты элемента, включая scope-атрибут Vue, поэтому правило
работает и в scoped-стилях строки, и в глобальной таблице стилей. Другой выход — фон на самой
строке. Иконки и плитки, которые должны парить, остаются прозрачными намеренно.

## Стилизация блока

Блок — это элемент с `data-dnd-overlay`. Он `position: fixed`, поверх всего
(`z-index: 9999`), `pointer-events: none` и `inert`, а значение атрибута говорит, что он
делает:

<table>
<thead>
  <tr>
    <th>
      <code>
        data-dnd-overlay
      </code>
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
        "dragging"
      </code>
    </td>
    
    <td>
      Следует за указателем.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        "dropping"
      </code>
    </td>
    
    <td>
      Приземляется в свой слот, летит обратно или ждёт асинхронного <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Приподнятый вид во время драга, который исчезает при приземлении:

```css
[data-dnd-overlay='dragging'] .row td {
  box-shadow: 0 14px 20px -16px rgb(0 0 0 / 0.7);
}
```

Блок двигается через `transform` и получает размер как `width` и `height`: стилизуйте то, что
внутри него, а не сам блок. Клон заполняет его, с `width: 100%`, `height: 100%` и
`transform: none` на своём корне: поворачивайте и увеличивайте его свойствами `rotate` и `scale`, которые
анимируют и переходы, и ключевые кадры. Рецепты — в [анимациях](https://zizigy.github.io/docs/guides/animations).

## Компоненты оверлея

Чтобы показать что-то кроме клона, передайте компонент. Он рендерится внутри блока и получает
драг в виде пропсов, которые меняются по ходу драга: где драг, принимает ли его это место,
копирует ли бросок, и сам бросок.

<example height="26.5rem" hint="Перетащите тикет над колонками: Done принимает одобренные и ставит на них штамп; удерживайте Alt, чтобы скопировать" name="overlay-live">



</example>

```vue [TicketOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem, DragMode, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();
const ticket = computed(() => props.items[0]?.item as Ticket);

const state = computed(() => {
  if (props.status === 'dropping') return props.over ? 'landed' : 'back'; // a cancel flies back
  if (!props.over) return 'free';
  return props.accepted ? 'ok' : 'refused';
});
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="ticket-overlay" :data-state="state">
    {{ ticket.title }}
    <span v-if="mode === 'copy'" class="copy">+ copy</span>
  </div>
</template>

<style scoped>
.ticket-overlay { width: 100%; height: 100%; }
.ticket-overlay[data-state='refused'] { background: color-mix(in srgb, #ef4444 8%, Canvas); }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Проп
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
      Драг (<code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , …).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        items
      </code>
    </td>
    
    <td>
      Все перетаскиваемые элементы, взятый первым: <code>
        { id, item, data, type }
      </code>
      
      . <code>
        item
      </code>
      
       — элемент списка для сортируемых драгов.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Цель под драгом; пока бросок приземляется — цель, на которую он приземляется. <code>
        null
      </code>
      
       над пустым местом и пока отклонённый или отменённый драг летит обратно. <code>
        over.id
      </code>
      
       сортируемого списка — <code>
        id
      </code>
      
       списка: колонки выше используют свои названия.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accepted
      </code>
    </td>
    
    <td>
      Принимает ли <code>
        over
      </code>
      
       драг: окрашивайте оверлей в красный, если нет.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'dragging'
      </code>
      
      , затем <code>
        'dropping'
      </code>
      
      , пока он приземляется.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        mode
      </code>
    </td>
    
    <td>
      <code>
        'move'
      </code>
      
      , <code>
        'copy'
      </code>
      
       (Alt зажат при драге из списка с <code>
        clone
      </code>
      
       или драг из палитры), <code>
        'swap'
      </code>
      
       или <code>
        'insert'
      </code>
      
       (обычный перетаскиваемый элемент идёт в список).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        to
      </code>
    </td>
    
    <td>
      Куда бросок положил бы элементы сейчас: <code>
        { list, index }
      </code>
      
      , а в дереве ещё <code>
        parentKey
      </code>
      
       и <code>
        depth
      </code>
      
      . <code>
        null
      </code>
      
      , когда он не положил бы их ни в какой список, например над обычной целью. См. <a href="#where-the-drop-would-go-to">
        куда пойдёт бросок
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Пропсы — это `OverlayProps`; объявляйте только те, которые читаете. Передайте компонент
тому, что перетаскивается:

```ts
import TicketOverlay from './TicketOverlay.vue';

makeSortableList(listRef, { items: tickets, overlay: TicketOverlay });   // every item of the list
makeSortableItem(el, { item: () => props.ticket, overlay: TicketOverlay }); // this item
makeDraggable(el, { id: 'chip', overlay: TicketOverlay });                // a plain draggable
```

Компонент можно передать как есть, в `shallowRef`, чтобы его переключать (в том числе посреди
драга: оверлей меняется сразу), или функцией, которую Vue принимает за функциональный компонент:
`overlay: (props) => <TicketOverlay {...props} compact />` в TSX. Никогда не кладите его в
глубокий `ref` или `reactive`: Vue сделает компонент реактивным и выдаст предупреждение.

Корень компонента оверлея должен заполнять блок (`width: 100%; height: 100%`): блок получает
размер слота и анимирует его при броске. Фиксированный размер на корне вместо этого сохраняет
этот размер внутри блока.

## Слот `#overlay` провайдера

Для каждого драга без собственного компонента оверлей рендерит слот провайдера. Определите
его один раз, рядом с корнем приложения, и его получат все списки и перетаскиваемые элементы
приложения. Здесь у заметок свой призрак, а фото возвращаются к клону:

<example height="26rem" hint="Перетащите заметку, затем фото" name="overlay-slot">



</example>

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, status }">
    <NoteGhost v-if="items[0]?.type.includes('note')" :items="items" :status="status" />
  </template>
</DnDProvider>
```

Слот получает те же пропсы, что и компонент оверлея. Когда он ничего не рендерит (`v-if`
выше), драг возвращается к клону. Различайте драги по `type`: тип сортируемого элемента — имя
его группы, если элемент не задаёт собственный (`makeSortableItem(el, { type })`).

## Цели, которые меняют оверлей

Цель может задать, что показывает оверлей, пока над ней драг, который она принимает.
`makeDroppable`, списки и деревья принимают `overOverlay` (`overlay` списка или дерева — для
его собственных элементов). Над папкой чип перетаскиваемых писем превращается в то, что
сделает бросок:

<example height="34rem" hint="Отметьте два письма, перетащите одно на Archive и отпустите" name="overlay-folders">



</example>

```ts [Folder.vue]
makeDroppable(el, {
  id: () => props.folder.id,
  data: () => props.folder,
  overOverlay: MovePill,
  onDrop: (event) => emit('move', event.active.ids),
});
```

Компонент цели получает те же пропсы, что и любой компонент оверлея, в том числе `over`, а
собственный оверлей драга (его компонент, слот провайдера или клон) — как свой слот по
умолчанию. `MovePill` опускает слот, поэтому заменяет чип:

```vue [MovePill.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();
// The folder under the drag: its `data`.
const folder = computed(() => props.over?.data as Folder | undefined);
</script>

<template>
  <!-- Fills the box like any overlay component. -->
  <div class="pill-box">
    <span v-if="folder" class="pill">Move {{ items.length }} to {{ folder.name }}</span>
  </div>
</template>
```

Отрендерите `<slot />`, чтобы сохранить собственный оверлей драга и обернуть его. Так делает
Done на доске из [компонентов оверлея](#overlay-components) выше: над Done одобренный тикет
сохраняет собственный оверлей, Done ставит на него штамп, а тикет из другой колонки при броске
получает конфетти.

```ts [Column.vue]
makeSortableList(listRef, {
  items: tickets,
  group: { name: 'release', put },
  overlay: TicketOverlay, // the tickets' own, in every column
  overOverlay: strict ? DoneOverlay : undefined, // Done's, around it
});
```

```vue [DoneOverlay.vue]
<template>
  <div class="done">
    <slot /> <!-- TicketOverlay -->
    <span class="stamp">Shipped</span>
    <span v-if="status === 'dropping' && arrives" class="confetti">…</span>
  </div>
</template>
```

- Он показывается, только пока цель принимает драг, и остаётся, пока на неё приземляется
бросок. Когда драг покидает цель, возвращается собственный оверлей драга.
- Смена идёт кроссфейдом. Как именно — задаёт `overlayTransition` провайдера: `false` меняет
сразу, объект — это пропсы `<Transition>` вокруг содержимого (`name`, `mode`, JS-хуки для GSAP
или motion). Без `mode: 'out-in'` на мгновение видны оба: дайте уходящему
`position: absolute` в `.<name>-leave-active`.
- Бросок ждёт конфетти: CSS-анимации и переходы, которые идут в оверлее, пока он
приземляется, доигрываются до конца, но не дольше двух секунд.
- У драга с `overlay: false` нет оверлея ни над какой целью.

Папки к тому же приземляют плашку по-своему — в иконку папки: у цели тоже может быть
`overDropAnimation`. См. [анимации](https://zizigy.github.io/docs/guides/animations#per-item-and-per-target).

## Куда пойдёт бросок: `to`

`to` сообщает оверлею, куда бросок положил бы элементы сейчас, — так же, как это скажет `to`
события броска: список и индекс в нём, а в дереве — родителя и глубину. Он меняется, когда
сдвигается слот. Страница этого меню сайта говорит, в какой раздел она попадёт и в какую
строку:

<example height="27rem" hint="Перетащите страницу над разделами, затем в сторону, чтобы изменить её глубину" name="overlay-move-path">



</example>

```vue [MoveOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, DropDestination } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; to: DropDestination | null }>();
const page = computed(() => props.items[0]!.item as MenuNode);
// `parentKey` is the section the page would go into, `null` at the top level.
const where = computed(() => (props.to ? pathOf(menu.value, props.to.parentKey) : null));
</script>

<template>
  <div class="move">
    <div class="row">{{ page.title }}</div>
    <p v-if="to && where" class="where">Move to <b>{{ where }}</b>, row {{ to.index + 1 }}</p>
  </div>
</template>
```

Вне всех целей `to` — по-прежнему место слота: по умолчанию бросок там оставляет элементы на
месте слота (`dropOutside: 'placeholder'`). Он равен `null`, когда бросок не положил бы их ни в
какой список: над обычной целью, над списком, который их отклоняет, вне целей с
`dropOutside: 'cancel'` или `'remove'`.

## Что побеждает

Для каждого драга — первое, что подходит:

1. `overOverlay` цели (и списка или дерева тоже), пока драг над ней и она его принимает.
То, что показалось бы иначе, становится её слотом по умолчанию.
2. Собственный `overlay` элемента (`makeSortableItem`, `makeDraggable`).
3. `overlay` его списка или дерева.
4. Слот `#overlay` провайдера, если он что-то рендерит.
5. Стандартный клон. При мульти-драге — колонка или стопка клонов: см.
[мульти-драг](https://zizigy.github.io/docs/guides/multi-drag#the-default-overlay).

Есть ли у драга оверлей вообще (`overlay: false`), решается в его начале. Какой компонент
показывается, читается на лету: его меняет ref, переключённый посреди драга, а также вход в
цель со своим оверлеем или выход из неё.

## `DragPreview`: клон в вашей раскладке

`DragPreview` рендерит клон одного перетаскиваемого элемента, сделанный библиотекой. Компонент
оверлея может разложить несколько таких клонов или обрамить один. Кликайте по книгам, чтобы
выбрать их, затем перетащите одну: оверлей раскладывает настоящие клоны веером.

<example height="24rem" hint="Перетащите одну из трёх выбранных книг; кликайте по книгам, чтобы выбрать другие" name="overlay-fan">



</example>

```vue [FanOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[] }>();
const fan = computed(() =>
  props.items.slice(0, 4).map((entry, index) => ({
    entry,
    angle: index === 0 ? 0 : (index % 2 ? -1 : 1) * Math.ceil(index / 2) * 10,
  })),
);
</script>

<template>
  <div class="fan">
    <div v-for="{ entry, angle } in fan" :key="entry.id" class="card" :style="{ transform: `rotate(${angle}deg)` }">
      <DragPreview :id="entry.id" class="face" :style="{ width: '100%', height: '100%' }">
        <div class="blank" /> <!-- an item without a clone -->
      </DragPreview>
    </div>
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>
```

- Клоны есть для взятого элемента и других рядом с ним в порядке броска, столько, сколько
задаёт `overlayPreviews` провайдера (по умолчанию 5, `'all'` — для всех), если они
отрендерены в момент захвата. Для любого другого элемента `DragPreview` рендерит свой слот
по умолчанию.
- Превью имеет размер своего элемента на момент захвата, заданный инлайн. Задавайте размер
через `style`, который пробрасывается дальше (класс его не перекроет), как выше.
- При сортируемом мульти-драге (`multiple: 'group'` или `'gaps'`) каждое превью при броске
приземляется в слот своего элемента. Поворачивайте его обёртки через `transform` (а не
свойство `rotate`): приземление по пути его снимает. Внешний вид элемента (скругления, тень)
задавайте на самом превью, как это делает `class="face"`: обёртки остаются в блоке.

В [руководстве по мульти-драгу](https://zizigy.github.io/docs/guides/multi-drag#a-custom-overlay-for-several-items)
есть оверлей, который показывает счётчик и заголовки вместо клонов.

## Размер: `overlayFit`

Над списком с элементами другого размера блок принимает размер слота, в который приземлится.
Это переключает `overlayFit` провайдера; на [странице DnDProvider](https://zizigy.github.io/docs/api/dnd-provider) есть
демо с узким и широким списками.

<table>
<thead>
  <tr>
    <th>
      <code>
        overlayFit
      </code>
      
       (провайдер)
    </th>
    
    <th>
      Блок
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'slot'
      </code>
      
       (по умолчанию)
    </td>
    
    <td>
      Принимает размер слота, в который приземлится, плавно подстраиваясь под него. Над широким списком он расширяется.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'source'
      </code>
    </td>
    
    <td>
      Сохраняет размер перетаскиваемого элемента.
    </td>
  </tr>
</tbody>
</table>

С `'slot'` блок меняет размер вокруг указателя, который остаётся в той же доле блока.
Содержимое никогда не масштабируется: оно заново раскладывается в новом размере, так что
flex-ряд, как у задач в том демо, выглядит правильно при любой ширине. Слот, стилизованный намного
меньше элемента, например тонкая линия, не сжимает блок по этой оси.

Бросок делает то же при любой настройке: блок летит к элементу, на который приземляется, и
анимируется к **его** размеру, а содержимое по пути заново раскладывается. Когда элемент
выглядит по-разному в двух списках (компактный чип в палитре, полная карточка на доске), клон
источника заново раскладывается в размере цели и может выглядеть там сжатым или растянутым.
Два способа сохранить его правильным:

- Дайте элементу **раскладку, которая работает в обоих размерах**, как у строк задач, или
одинаковый размер во всех списках, куда он может приземлиться.
- Рендерите **вид цели** в компоненте оверлея. Он получает `over`, поэтому может переключаться
на вид того списка, над которым находится, и заполняет блок при любом размере.

## Где он рендерится: `overlayTo`

Провайдер телепортирует оверлей в `body`. Модальный `<dialog>` (открытый через `showModal()`)
находится в верхнем слое, над всем в `body`, поэтому оверлей там был бы скрыт под ним.
Направьте `overlayTo` на селектор или элемент внутри диалога. На
[странице DnDProvider](https://zizigy.github.io/docs/api/dnd-provider#where-the-overlay-renders) есть диалог, чтобы
попробовать с этим и без этого:

```vue [index.vue]
<script setup lang="ts">
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const open = ref(false);
// While the dialog is open, the overlay renders inside it.
const overlayTo = computed(() => (open.value ? '#columns-dialog' : 'body'));

const show = () => {
  dialog.value?.showModal();
  open.value = true;
};
</script>

<template>
  <DnDProvider :overlay-to="overlayTo">
    <button type="button" @click="show">Edit columns</button>
    <dialog id="columns-dialog" ref="dialog" @close="open = false">
      <ColumnList v-model:columns="columns" />
    </dialog>
  </DnDProvider>
</template>
```

- Цель должна быть на странице, когда провайдер рендерит оверлей, то есть после его
монтирования. Закрытый `<dialog>` на странице есть: он просто скрыт. Пока он закрыт,
переключайтесь обратно на `body`, чтобы оверлей других драгов был виден.
- Блок — `position: fixed`. `transform`, `filter` или `contain` на цели или её предках делают
её системой отсчёта блока вместо вьюпорта, поэтому не ставьте их на диалог.
- Стили клона вычисляются для того места, где он показан: в shadow root направьте `overlayTo`
внутрь него, и клон сохранит стили shadow root.

## Без оверлея

У `makeDraggable(el, { overlay: false })` блока нет вовсе: двигается сам элемент, через
возвращённый `transform`.

```ts
const { transform } = makeDraggable(el, { overlay: false });
const style = computed(() =>
  transform.value ? { translate: `${transform.value.x}px ${transform.value.y}px` } : undefined,
);
```

См. [drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay). Как приземляется драг с
блоком, задаёт его `dropAnimation`: цели (`overDropAnimation`), элемента (или его списка) или провайдера. См.
[анимации](https://zizigy.github.io/docs/guides/animations#the-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
