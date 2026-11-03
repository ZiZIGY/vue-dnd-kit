---
title: "Списки с общими элементами"
description: "Списки одной группы перемещают, копируют и меняют местами элементы — вся колонка принимает броски, pull и put решают, что входит и выходит, палитры копируют, а управляемые списки применяют каждый бросок к стору с историей отмены."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/shared-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="31rem" hint="Переносите истории между списками; выключите и включите зону сброса" name="sprint-planning">



</example>

## Группа

Списки с одинаковым именем `group` обмениваются элементами. По умолчанию каждый список — сам
себе группа.

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import StoryCard from './StoryCard.vue';

type Story = { id: string; title: string; points: number };
const props = defineProps<{ column: { id: string; title: string; stories: Story[] } }>();

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,                     // names the list in drop events
  items: toRef(props.column, 'stories'),   // a writable ref into the reactive column
  group: 'planning',                       // same name: stories move between these lists
});
</script>

<template>
  <section :class="{ over: isOver }">
    <h3>{{ column.title }}</h3>
    <ul ref="list">
      <StoryCard v-for="story in items" :key="story.id" :story="story" />
    </ul>
  </section>
</template>
```

```vue [index.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'backlog', title: 'Backlog', stories: [{ id: 's1', title: 'Saved searches', points: 5 }] },
  { id: 'sprint', title: 'Sprint 14', stories: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

- Каждая колонка здесь — компонент, как обычно и бывает с колонками. Один компонент может
создать и несколько списков, например постоянные Todo и Done рядом: каждая карточка входит
в список, чей элемент её содержит.
- `toRef(props.column, 'stories')` записываемый, потому что родитель передаёт реактивный
объект. Бросок записывает оба массива — тот, который история покинула, и тот, в который
вошла, — и очки обеих колонок пересчитываются.
- `id` появляется в событиях броска как `from.list` и `to.list` и служит ключом в `e.result` —
новых массивах всех списков, которые меняет бросок. `id` и `group` читаются один раз.
- Ключи должны быть уникальны во всей группе.

`onDrop` списка выполняется для бросков **в** него. Перенос из `backlog` в `sprint` вызывает
`onDrop` списка `sprint`, а его `e.result` содержит новые массивы обоих списков.

## Вся колонка принимает броски: `dropzone`

Короткий список в высокой колонке оставляет пустое место под последней карточкой. С
`dropzone` броски за список принимает другой элемент: здесь — вся колонка. История,
отпущенная ниже последней, приземляется в конец. Истории остаются в `<ul>`; растёт только
область, которая принимает броски. Демо обводит эту область во время драга: выключите её, и
историю будет принимать только сам список.

```ts [Column.vue]
const zone = useTemplateRef<HTMLElement>('zone');
const { items } = makeSortableList(list, {
  items: toRef(props.column, 'stories'),
  group: 'planning',
  dropzone: zone,   // or a getter: () => (wholeColumn.value ? zone.value : undefined)
});
```

<tip>

Без `dropzone` пустому списку всё равно нужен размер, чтобы принимать броски: задайте ему
`min-height`.

</tip>

## Что входит и выходит: `pull` и `put`

`group` принимает и объект. `pull` говорит, что может покинуть список, `put` — что может в него
войти:

<example height="36rem" hint="Перетаскивайте файлы между списками: каждый говорит, принимает ли он их, и если нет, то почему" name="group-rules">



</example>

<table>
<thead>
  <tr>
    <th>
      Опция
    </th>
    
    <th>
      Значения
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pull
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (по умолчанию): элементы могут уходить. <code>
        false
      </code>
      
      : не могут. <code>
        'clone'
      </code>
      
      : уходят копии, элементы остаются.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        put
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (по умолчанию): элементы могут входить. <code>
        false
      </code>
      
      : ничего не входит. Тип или типы (<code>
        'image'
      </code>
      
      , <code>
        ['image', 'video']
      </code>
      
      ): входят элементы этих типов. Функция: решаете вы, для каждого драга.
    </td>
  </tr>
</tbody>
</table>

```ts [index.vue]
// Inbox: gives, takes nothing.
group: { name: 'files', pull: true, put: false }

// Templates: gives copies, takes nothing, keeps its order.
group: { name: 'files', pull: 'clone', put: false }, sort: false

// Images: takes images only.
group: { name: 'files', put: 'image' }
```

Типы — это опции `type` перетаскиваемых элементов (`makeSortableItem(el, { item, type })`);
элементы без неё считаются именем группы. С типами в `put` каждый перетаскиваемый элемент
должен иметь один из них (с `acceptMode: 'some'` входят те, у кого он есть).

Функция `put` получает `{ keys, items, types, from, to }`: перетаскиваемые ключи и элементы, их
типы, список, из которого они пришли (`null` для обычных перетаскиваемых элементов), и этот
список. Перемещения внутри списка разрешены всегда: Inbox по-прежнему сортирует собственные
файлы.

Над списком, который отклоняет драг, слот возвращается туда, где драг начался, так что
списки показывают, что сделал бы бросок: ничего. Бросок туда отменяется, и элемент летит
обратно. `isAccepting` списка во время такого драга равен `false`, а `isOver` над ним всё равно
`true`: так каждый список в демо знает, что сказать.

Слот возвращается на место и над собственной целью вне списков, например над корзиной: бросок
там принадлежит цели, и списки сохраняют элемент, если её `onDrop` его не забирает
(`event.source.remove()`). Цели внутри списков (бросок в элемент) и вокруг них (панель, в
которой лежат списки) оставляют слот там, где он есть.

```ts [RuleList.vue]
const { items, isOver, isAccepting } = makeSortableList(el, { … });
const { active } = useDnD();
const verdict = computed(() => (active.value ? (isAccepting.value ? 'takes' : 'refuses') : null));
```

### Лимиты

Список, который вмещает не больше трёх файлов, — Shortlist:

```ts [index.vue]
const shortlist = reactive({
  files: [/* … */],
  group: { name: 'files', put: ({ keys }: SortablePutContext) => shortlist.files.length + keys.length <= 3 },
});
```

Он читает собственные элементы, когда драг спрашивает. Заполните его, и он отклонит следующий
файл, с причиной в заголовке.

Когда перетаскиваются несколько выделенных элементов разных типов, `acceptMode` говорит,
должны ли пройти `put` `'all'` (по умолчанию) или `'some'` из них. С `'some'` прошедшие
приземляются, а остальные летят обратно. См. [мульти-драг](https://zizigy.github.io/docs/guides/multi-drag#taking-only-some).

### Одна группа на список

Список принадлежит одной группе: `group` принимает одно имя, никогда не несколько. Списки
группы делят каждый драг (свои черновики, что перетаскивается, какие из них его принимают),
поэтому элементы никогда не переходят между группами. Когда элементы должны ходить только в
некоторые стороны, поместите списки в одну группу и пусть `put` решает по `from` — списку,
из которого пришёл драг:

```ts [index.vue]
// Review takes tasks from both teams. A team takes tasks back from Review,
// never from the other team.
const fromReview = ({ from }: SortablePutContext) => from === 'review';

makeSortableList(review, { id: 'review', items: reviewTasks, group: 'tasks' });
makeSortableList(frontend, { id: 'frontend', items: frontendTasks, group: { name: 'tasks', put: fromReview } });
makeSortableList(backend, { id: 'backend', items: backendTasks, group: { name: 'tasks', put: fromReview } });
```

<note>

Если вы пришли из SortableJS: там `put: ['a', 'b']` называет группы, из которых список
принимает элементы. Здесь массив в `put` перечисляет **типы** элементов, которые список
принимает. Чтобы принимать элементы из других списков, дайте им одну группу и решайте по
`from`, как выше.

</note>

## Копирование: палитры и клавиша Alt

<example height="26rem" hint="Перетаскивайте из палитры; драг с Alt копирует; бросьте за пределы панели Page, чтобы удалить" name="palette">



</example>

```ts [Palette.vue]
makeSortableList(list, {
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                           // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

```ts [Sheet.vue]
makeSortableList(list, {
  items: blocks,
  group: 'blocks',
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),  // for Alt-drags
  dropOutside: 'remove',                                      // drag off the Page panel to delete
});
```

- `pull: 'clone'` копирует каждый драг из списка. Оригинал остаётся, а копия едет и
приземляется.
- Удержание <kbd value="Alt">



</kbd>

 во время драга тоже копирует, из любого списка с функцией
`clone`: она и делает копию. Смените клавишу опцией провайдера `copyModifier` или отключите
её значением `null`.
- В обоих случаях списку, из которого берётся элемент, нужен `clone`. Он должен вернуть копию
с **новым ключом**. Без `clone` ничего не копируется.
- У события броска `mode: 'copy'`, а `e.items` — это копии. Компонент оверлея тоже получает
`mode`, чтобы показывать «+» при копировании (см. [оверлей](https://zizigy.github.io/docs/guides/overlay)).

## Обмен местами между списками

Два списка одной группы, у которых обоих `behavior: 'swap'`, обмениваются элементами:
перетаскиваемый элемент занимает место того, что под ним, а тот переходит в список
перетаскиваемого. Ему должно быть разрешено покинуть свой список (`pull: true`) и войти в
другой (`put`). Дежурный график в [сортируемых списках](https://zizigy.github.io/docs/guides/sortable-lists#swap-instead-of-shift)
меняет местами элементы двух своих колонок.

## Обычные перетаскиваемые элементы

Список принимает элементы, перетаскиваемые с `makeDraggable` (чип, шаблон, файл из дерева),
если у него есть `createItem`. `group.put` решает и за них, с `from: null`. См.
[обычные перетаскиваемые элементы в список](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list).

## Бросок вне целей

Что происходит, когда драг заканчивается вообще не над целью, решает `dropOutside` списка:

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      Элементы
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
      
       (по умолчанию)
    </td>
    
    <td>
      Приземляются туда, где слот был показан последним.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Летят обратно. По умолчанию при <code>
        placeholder: 'indicator'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      Покидают свой список: утащите за пределы, чтобы удалить. Так делает страница в демо палитры.
    </td>
  </tr>
</tbody>
</table>

`'remove'` сначала спрашивает `onBeforeDrop` списка. Затем `onDrop` списка выполняется с
`to.index === -1`, а `e.result` содержит список без этих элементов. Корзина, которая принимает
броски, работает так же: см. [зоны удаления](https://zizigy.github.io/docs/guides/drag-and-drop#trash-zones).

## Управляемые списки

Списки могут читать стор, которым не владеют: Pinia, серверное состояние, иммутабельные
данные. Передайте `items` геттером (или `computed`, или readonly ref): библиотека никогда в
него не пишет. Вызовите `e.preventDefault()` в `onDrop` и примените `e.result` сами:

<example height="26rem" hint="Пересаживайте гостей между столами, затем отменяйте ходы по одному" name="seating-undo">



</example>

```ts [Table.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  items: () => props.seating.state.tables[props.id]!,   // read-only
  group: 'seating',
  onDrop: (e) => {
    e.preventDefault();                                   // no write
    props.seating.apply(e.result, `${e.items[0]?.name} → ${props.title}`);
  },
});
```

```ts [store.ts]
const apply = (result: ReadonlyMap<Key, Guest[]>, label: string) => {
  const before = [...result.keys()].map((id): [Key, Guest[]] => [id, state.tables[id]!]);
  for (const [id, guests] of result) state.tables[id] = guests;
  state.history.unshift({ label, before });
};

const undo = () => {
  const last = state.history.shift();
  for (const [id, guests] of last?.before ?? []) state.tables[id] = guests;
};
```

- `e.result` сопоставляет каждому списку, который меняет бросок, его новый массив: оба стола
после переноса, один — после перестановки. Это новые массивы, так что стор может хранить
старые для отмены.
- Черновик следует за стором: примените `result` в `onDrop` (или до того, как разрешится
асинхронный `onBeforeDrop`), и оверлей приземлится в новом порядке.
- `preventDefault()` пропускает запись во все списки из `result`. Если ничего не применить,
списки остаются как были, а элементы летят обратно.
- Dev-сборки предупреждают, когда бросок в список только для чтения оставлен библиотеке:
ничего бы не изменилось.

Чтобы сохранить на сервер до того, как бросок приземлится, или сначала спросить пользователя,
см. [решение о броске](https://zizigy.github.io/docs/guides/drop-decisions). Все опции списка — в
[API makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
