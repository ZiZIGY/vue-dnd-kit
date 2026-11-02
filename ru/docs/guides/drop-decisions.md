---
title: "Решение о броске"
description: "Принять, отклонить или отложить бросок — правила во время драга или при отпускании, часть мульти-драга, диалог, сервер, который должен сначала согласиться, мониторы с правом вето и броски вне всех целей."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/drop-decisions"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Перетащите карточку в **Done**. Бросок ждёт вашего ответа: переместить карточку, продолжить
тащить её в другое место или отменить.

<example height="25rem" hint="Перетащите карточку в Done" name="drop-confirm">



</example>

## onBeforeDrop

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => (e.items.some((task) => task.locked) ? 'reject' : 'accept'),
});
```

Списки, деревья, цели (`makeDroppable`) и мониторы (`useDnDMonitor`) принимают
`onBeforeDrop`. Он выполняется, когда драг отпущен, до каких-либо изменений, и его ответ
решает:

<table>
<thead>
  <tr>
    <th>
      Ответ
    </th>
    
    <th>
      Что происходит
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       или ничего
    </td>
    
    <td>
      Бросок проходит.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'reject'
      </code>
      
       или <code>
        false
      </code>
    </td>
    
    <td>
      Броска нет: элементы летят обратно. Брошенная ошибка тоже отклоняет.
    </td>
  </tr>
  
  <tr>
    <td>
      Массив ключей
    </td>
    
    <td>
      Бросаются только эти элементы; остальные летят обратно.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'continue'
      </code>
    </td>
    
    <td>
      Броска нет, и драг продолжается.
    </td>
  </tr>
  
  <tr>
    <td>
      Промис любого из этих ответов
    </td>
    
    <td>
      Оверлей ждёт там, где его отпустили, пока промис не завершится.
    </td>
  </tr>
</tbody>
</table>

Списки и деревья передают `SortableDropEvent`: `keys`, `items`, `from`, `to`, `mode`, `sameList` и
`result` — новые массивы всех списков, которые меняет бросок. Цели и мониторы получают общий
`DnDEvent`: `active`, `over`, `position` и `source`. См. [события](https://zizigy.github.io/docs/api/events).

## Правило во время драга или при отпускании

Email и Chat принимают вложения не больше 10 МБ. Перетащите **demo.mov** над каждым: Email
отклоняет его, пока вы наводите, Chat принимает и отправляет обратно, когда вы отпускаете.

<example height="27rem" hint="Перетащите файл больше 10 МБ в каждое место" name="drop-rules">



</example>

```ts [Column.vue]
// Asked while dragging: a refused drag never enters the list.
group: { name: 'attachments', put: ({ items }) => fits(items as Attachment[]) },

// Asked on release: the drag enters the list, then flies back.
onBeforeDrop: (e) => (fits(e.items) ? 'accept' : 'reject'),
```

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      <code>
        group.put
      </code>
      
       (или <code>
        accept
      </code>
      
       цели)
    </th>
    
    <th>
      <code>
        onBeforeDrop
      </code>
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Спрашивается
    </td>
    
    <td>
      Во время драга, как только драг доходит до списка.
    </td>
    
    <td>
      Один раз, когда драг отпущен.
    </td>
  </tr>
  
  <tr>
    <td>
      Пользователь видит
    </td>
    
    <td>
      Список сразу отказывает: слот не открывается, <code>
        isAccepting
      </code>
      
       равен <code>
        false
      </code>
      
      , <code>
        over.accepted
      </code>
      
       равен <code>
        false
      </code>
      
      .
    </td>
    
    <td>
      Слот открывается как обычно; при отпускании элементы летят обратно.
    </td>
  </tr>
  
  <tr>
    <td>
      Знает
    </td>
    
    <td>
      Что перетаскивается: <code>
        keys
      </code>
      
      , <code>
        items
      </code>
      
      , <code>
        types
      </code>
      
      , <code>
        from
      </code>
      
      , <code>
        to
      </code>
      
      .
    </td>
    
    <td>
      Весь бросок: <code>
        to.index
      </code>
      
      , <code>
        sameList
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        result
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Может
    </td>
    
    <td>
      Сказать да или нет.
    </td>
    
    <td>
      Дождаться промиса, принять часть ключей, продолжить драг.
    </td>
  </tr>
</tbody>
</table>

Используйте `group.put` для того, что известно по одним элементам (тип, флаг, количество):
пользователь узнаёт это до того, как отпустит. Используйте `onBeforeDrop` для того, что зависит
от места, ответа пользователя или сервера. Собственные правила цели идут первыми: над списком
или целью, которая отклоняет драг, бросок отменяется, а её `onBeforeDrop` не спрашивается.

### Принять часть элементов

Некоторые правила можно проверить только при отпускании, на сервере. Места на этот воркшоп
бронируют и другие: при отпускании список спрашивает у сервера, сколько мест осталось, и берёт
столько перетащенных людей. Отметьте нескольких и перетащите их вместе.

<example height="28.5rem" hint="Отметьте трёх человек, перетащите одного из них на воркшоп" name="drop-partial">



</example>

```ts [Column.vue]
makeSortableList(list, {
  items: toRef(props.column, 'people'),
  group: 'workshop',
  // Some keys: those land, the others fly back to where they came from.
  onBeforeDrop: async (e) => {
    const { free } = await seatsLeft(props.column.people.length); // the overlay waits
    return e.keys.slice(0, free);
  },
  onDrop: (e) => {
    selection.delete(...e.accepted); // the ones sent back stay selected
    notice.value = `${e.accepted.length} booked, ${e.rejected.length} back to the waiting list`;
  },
});
```

При [мульти-драге](https://zizigy.github.io/docs/guides/multi-drag) возвращённые ключи приземляются вместе, а остальные
летят обратно на свои места. `onDrop` затем видит их в `e.accepted` и `e.rejected`, а его
`e.result` — окончательный. Пустой массив не принимает ничего: бросок отклоняется.

## Продолжить драг: 'continue'

`'continue'` отменяет бросок, а не драг. Ответьте **Keep dragging** в диалоге выше: элемент
остаётся в руке с того места, где был, страница возвращается в режим драга, и пользователь
продолжает.

- С мышью или пером элемент следует за указателем без зажатой кнопки. Следующее отпускание —
клик — бросает его, и этот клик никогда не доходит до страницы под ним.
- Касание снова берёт элемент там, куда опустился палец; поднятый палец бросает его.
- Перетаскивание с клавиатуры продолжается: стрелки двигают элемент, <kbd value="Space">



</kbd>

 или
<kbd value="Enter">



</kbd>

 бросают его.
- <kbd value="Escape">



</kbd>

 отменяет его, как любой драг.
- Следующий бросок снова спрашивает `onBeforeDrop`.

Мониторы слышат `onDragResume`, а скринридеры — что элемент не брошен и всё ещё движется
(текст переопределяется через `announcements.onDragResume` провайдера).

```ts
useDnDMonitor({
  onDragResume() {
    hint.value = 'Still dragging: click to drop, Esc to cancel';
  },
});
```

## Спросить пользователя

`onBeforeDrop` может вернуть промис. Откройте диалог и разрешите промис кнопкой, которую выберет
пользователь:

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'release',
  onBeforeDrop: (e) => (props.column.confirm && !e.sameList ? props.ask(e) : 'accept'),
});
```

```ts [Board.vue]
type Answer = 'accept' | 'continue' | 'reject';
const question = shallowRef<{ title: string; resolve: (answer: Answer) => void } | null>(null);

/** Opens the dialog: `onBeforeDrop` waits for the button the user picks. */
const ask = (e: SortableDropEvent<Task>) =>
  new Promise<Answer>((resolve) => {
    question.value = { title: e.items[0]!.title, resolve };
  });
```

Пока промис ожидает:

- оверлей ждёт там, где его отпустили, с пометкой `data-dnd-overlay="dropping"`;
- `useDnD()` хранит состояние на момент отпускания, а `status` равен `'dropping'`;
- страница выходит из режима драга: курсор и выделение текста возвращаются, так что диалог
работает как обычно;
- никакой другой драг начаться не может.

<tip>

Модальный `<dialog>`, открытый через `showModal()`, находится в верхнем слое, над ожидающим
оверлеем. Превратите его событие `cancel` (<kbd value="Escape">



</kbd>

) в `'reject'`, как это делает
пример.

</tip>

## Порядок хуков

Переставьте заметки, бросьте одну в корзину, затем переключите ответ и сделайте это снова.
Панель перечисляет хуки последнего броска в том порядке, в котором они выполнились.

<example height="27.5rem" hint="Переместите заметку или удалите одну, затем переключите ответ на reject или continue" name="drop-hooks">



</example>

1. `onBeforeDrop` каждого `useDnDMonitor`, по очереди. `'reject'` или `'continue'` прекращает
опрос; ключи сужают бросок.
2. `onBeforeDrop` цели: списка или дерева, куда идут элементы, или цели броска.
3. `onDrop` только цели: список, который элементы покидают ради другого, не спрашивается, а его
новый массив лежит в `e.result` цели. Когда элементы удаляются (зона удаления,
`dropOutside: 'remove'`), выполняется `onDrop` их списка, с `to.index`, равным `-1`.
4. Запись по умолчанию: каждый список, который меняет бросок, получает свой новый массив.
5. `onDragEnd` провайдера (`@drag-end`) и мониторов. Затем оверлей приземляется, и
`onDragSettle` (`@drag-settle`) сообщает об этом.

Отклонённый бросок вместо этого переходит к `onDragCancel` (`@drag-cancel`), и элементы летят
обратно. `'continue'` тоже прекращает опрос, с `onDragResume`: драг продолжается, а следующий
бросок спрашивает снова.

Мониторы решают раньше цели, так что вето никогда не приходит после того, как список уже
применил собственный бросок. Поэтому монитор — место для правил, касающихся каждого броска в
приложении:

```ts [Monitor.vue]
const { syncing } = useSync();

// Read-only while syncing: every drop under the provider flies back.
useDnDMonitor({
  onBeforeDrop: () => (syncing.value ? 'reject' : 'accept'),
});
```

## onDrop: сообщается до записи

```ts
makeSortableList(listRef, {
  items: tasks,
  onDrop: (e) => {
    // `tasks` still holds the old order, `e.result` the new one.
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

`onDrop` списка выполняется, как только бросок принят, синхронно, прямо перед тем как список его
записывает. Чтобы действовать после записи, используйте `@drag-end` провайдера или
`useDnDMonitor({ onDragEnd })`. На обычной цели `onDrop` — место, где вы меняете свои данные:
библиотека ничего за неё не перемещает.

## Сторы и серверы: управляемые списки

```ts
const store = useBoardStore();
const { items } = makeSortableList(listRef, {
  id: 'todo',
  group: 'board',
  items: () => store.lists.todo, // a getter: read-only
  onDrop: (e) => {
    e.preventDefault();
    for (const [listId, next] of e.result) store.setList(listId, next);
  },
});
```

Библиотека записывает бросок только в записываемый ref. В геттер, `computed` или `readonly` ref
она никогда не пишет: вызовите `e.preventDefault()` и примените `e.result` сами — новые массивы
всех списков, которые меняет бросок, по id списка. `preventDefault()` пропускает запись во все
из них, поскольку запись только в часть потеряла бы или продублировала элементы. Dev-сборки
предупреждают, когда бросок в список только для чтения оставлен библиотеке.

### Сначала сохранить на сервер

Переместите карточку, когда сервер **flaky** (каждый второй запрос падает) или **down**.
Карточка ждёт с бейджем, пока идёт запрос, затем приземляется или летит обратно, если запрос
не удался.

<example height="31.5rem" hint="Перемещайте карточки, затем переключите сервер на flaky или down" name="drop-server">



</example>

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  // A getter: the library never writes it. The drop is applied below, once saved.
  items: () => board[props.id]!,
  group: 'sprint',
  onBeforeDrop: async (e) => {
    e.preventDefault();
    try {
      await saveMove(e.keys, e.to);
    } catch {
      return 'reject'; // nothing applied: the card flies back
    }
    for (const [id, tasks] of e.result) board[id] = tasks; // lands in its new place
    return 'accept';
  },
});
```

Примените `e.result` до того, как промис разрешится, и оверлей приземлится в новом порядке.
Когда запрос падает, ничего не применяйте и отклоните: элементы летят обратно, а мониторы
слышат `onDragCancel`.

Бейдж берётся из слота `#overlay` провайдера, который рендерит оверлей каждого драга.
`DragPreview` показывает обычную копию карточки, а бейдж лежит поверх, пока идёт запрос:

```vue [index.vue]
<DnDProvider>
  <Board />
  <template #overlay="{ active }">
    <div class="carried">
      <DragPreview :id="active.id" />
      <span v-if="saving" class="saving">Saving…</span>
    </div>
  </template>
</DnDProvider>
```

## Бросок вне всех целей

Вытащите приложение из дока и отпустите, в каждом режиме.

<example height="24.5rem" hint="Вытащите приложение из дока и отпустите" name="drop-outside">



</example>

```ts [Dock.vue]
const { items } = makeSortableList(dock, {
  items: apps,
  strategy: 'horizontal',
  dropOutside: () => props.dropOutside,
  // Called on the list the items leave, with `to.index` -1, when they are removed.
  onDrop: (e) => {
    if (e.to.index === -1) notice.value = `Removed ${e.items.map((app) => app.name).join(', ')}`;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      Бросок вне всех целей…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
    </td>
    
    <td>
      Приземляется туда, где плейсхолдер: на последнее место, которое показывал список. По умолчанию.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Отменяется: элементы летят обратно. По умолчанию при <code>
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
      Удаляет элементы из их списка. Сначала спрашивается <code>
        onBeforeDrop
      </code>
      
       списка, а его <code>
        onDrop
      </code>
      
       получает <code>
        to.index
      </code>
      
      , равный <code>
        -1
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Опция читается при броске, поэтому её может переключать ref или геттер. Зона удаления делает то
же самое намеренно: `makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`. См.
[drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
