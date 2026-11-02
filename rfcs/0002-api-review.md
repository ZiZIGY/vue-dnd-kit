# Ревью публичного API перед RC

Дата: 02.11.2026. Предмет: `@vue-dnd-kit/core` 3.0.0-beta.1 плюс незакоммиченные изменения ветки `v3` (`label`, `filter`, несколько списков в компоненте, `external`/`native`, `[data-dnd-overlay-content]`/`overlayClass`, `animateSize`). Прошёл всё, что экспортирует `src/index.ts`, типы `src/types/*.ts` и composables в `src/core/` и `src/sortable/`. JSDoc сверял с кодом выборочно: в первую очередь новые опции и колбэки.

Итог: **A — 13 пунктов, B — 11, C — 15.** Пять главных: A1 (`native` обходит `canDrag`), A2 (`onDrop` зоны не знает о частичном приёме), A4 (свой `selection` у рамки не участвует в мульти-drag), A5 (`defaultStyles: false` выключает не только внешний вид), B1 (`overlay`/`dropAnimation` зоны и списка называют разные вещи).

## Решения (02.11.2026)

Мейнтейнер принял:
- A2 — вариант (а): `onDrop` зоны получает `DnDEndEvent` с `accepted` и новым `rejected` (он же в `DnDEndEvent`).
- Переименования:
  - B1: `overlay`/`dropAnimation` зоны → `overOverlay`/`overDropAnimation`;
  - B4: `ExternalData.dropped` → `ready`;
  - B2: `animate` → `animateChanges`;
  - B3: `keyboard` draggable → `keyboardMode`.

  B5 (`modifier`) остаётся как есть.
- Добавления:
  - A11: `activation` у списков и деревьев;
  - B6: `group.put` с типами-строками и `SortableGroupOptions<T>`;
  - B8: `data` у списков и деревьев;
  - B10: стили поведения внедряются всегда, `defaultStyles: false` убирает только внешний вид.
- A4: опция `selection` у `makeSelectionArea` удалена.
- Исправлены те же дни: A1, A3, A5–A7, A9, A10, A12, A13. A8 — дописан JSDoc элемента; смысл `isDragging` у области не менялся.

Ниже — исходный текст ревью.

A2 — пробел, который надо закрыть до RC, но форму исправления выбирает мейнтейнер: варианты и рекомендация в самом пункте. Номера строк в `src/types/` даны на 02.11.2026: JSDoc там параллельно правит другой агент, строки могут съехать.

## A. Дефекты и несоответствия: исправить до RC

**A1. Drag мышью у `native` не спрашивает `canDrag`.** `core/sensors/host.ts:125` отдаёт drag мышью `native`-элемента мосту HTML5 до проверки `canDrag` в строке 126, а мост (`core/native/bridge.ts:105-114`) ставит `draggable="true"` и проверяет только `disabled` и место нажатия. Поэтому `canDrag: (e) => e.shiftKey` вместе с `native: true` не работает: мышью элемент тянется и без Shift. `activation` здесь тоже не действует: порог задаёт браузер.
*Исправление:* в `onPointerDown` моста добавить `if (found.entry.canDrag && !found.entry.canDrag(event)) return;`. В JSDoc `DraggableOptions.native` (`types/draggable.ts:98`) дописать, что для мыши порог активации задаёт браузер.

**A2. Частичный приём у обычной цели: `onDrop` не знает, какие элементы приняты. Нужно решение мейнтейнера о форме.**

*Что происходит.*
- `onBeforeDrop` зоны или монитора может вернуть подмножество ключей (`types/drag.ts:149`).
- `core/manager/session.ts:501-507` вызывает `onDrop` зоны с `DnDEvent`, где нет ни `accepted`, ни `rejected`, а `e.active.items` и `e.active.ids` по-прежнему содержат весь drag.
- Подмножество есть только в `DnDEndEvent.accepted`. Его собирают уже после `onDrop` (строки 508-513), и получают его только мониторы в `onDragEnd`. Тип — `onDrop?(event: DnDEvent)` (`types/draggable.ts:190`).
- `e.source.remove()` при этом работает верно: удаление считается в `onDragEnd` по `event.accepted` (`sortable/drop.ts:296-301`). Пробел только в том, что видит код пользователя.
- У списков пробела нет: в `SortableDropEvent` есть `accepted` и `rejected` (пример `docs/examples/drop-partial/Column.vue:31-37`).
- В v2, по данным агента гайда миграции, зона получала только принятые элементы. Он обошёл пробел повторной фильтрацией в `onDrop`.

*Варианты.*
- **(а) `onDrop` получает `accepted` и `rejected`, как событие списка.** Событие — `DnDEndEvent` плюс новое поле `rejected: Key[]`; `rejected` добавить и в сам `DnDEndEvent`, чтобы мониторы видели то же.
  - Плюсы: надмножество, ничего не ломает. Форма та же, что у `SortableDropEvent` (там `items` — тоже весь drag, а подмножество — в `accepted`/`rejected`). Сохраняется инвариант «`active` — это drag целиком» в `onDrop`, мониторах, overlay и `onDragEnd`. Есть данные для «2 записаны, 1 вернулся».
  - Минусы: перебирать принятые элементы нужно самому: `e.active.items.filter((i) => e.accepted.includes(i.id))`.
- **(б) в `onDrop` сузить `e.active.items`/`ids` до принятых.**
  - Плюсы: как в v2; код, который перебирает `items`, работает без изменений.
  - Минусы: у одного drag в `onDrop` один `active`, а в мониторах, overlay и `onDragEnd` — другой. Непонятно, чем становится `active.id`, если отклонили сам захваченный элемент. Отклонённые теряются. Тихая смена смысла поля.
- **(в) как (а) и дополнительно удобное поле с принятыми элементами** (`acceptedItems: DragItem[]`).
  - Плюсы: удобно.
  - Минусы: ещё одно поле, которого нет у списков; `items` у списков тогда стоило бы выровнять тоже.

*Рекомендую (а).* Реализация: собрать `endEvent` (с `rejected`) до вызова `onDrop` в `session.ts:501-513`, передать его в `onDrop` зоны и сменить тип на `DnDEndEvent`. В гайде миграции соответствие v2 `items` → `e.active.items.filter((i) => e.accepted.includes(i.id))`. Код ядра я не менял.

**A3. Провайдер не эмитит `dragResume`.** `DnDProvider.ts:84-91, 107-114` эмитит `dragStart/Move/Over/End/Cancel/Settle`, а `DnDMonitor.onDragResume` (`types/drag.ts:200`) и `Announcements.onDragResume` есть.
*Исправление:* добавить emit `dragResume`.

**A4. Свой `selection` у `makeSelectionArea` не управляет мульти-drag.** Мульти-drag берёт ключи только из выделения провайдера (`core/manager/session.ts:121-125`). `selected` у draggable и sortable-элемента тоже читает только его (`makeDraggable.ts:259-265`). JSDoc `SelectionAreaOptions.selection` (`types/selection.ts:32`) говорит лишь «Defaults to the provider's selection», а RFC §4.5 обещал, что подойдёт и свой `Ref`.
*Исправление:* написать в JSDoc, что рамка пишет в этот `Set`, но мульти-drag и `selected` читают выделение провайдера. Другой вариант — убрать опцию; это решение мейнтейнера.

**A5. `defaultStyles: false` выключает и поведение.** Внедряемый лист (`core/styles.ts:18-27`) кроме `opacity` содержит `overflow-anchor: none` (на нём держится виртуализация, RFC §9 и §11), курсор drag `var(--dnd-cursor, grabbing)` и `-webkit-touch-callout: none` (долгое нажатие на iOS). JSDoc (`types/provider.ts:210`) называет только «placeholder opacity, no text selection».
*Исправление:* перечислить в JSDoc всё, что выключается. Как разделить внешний вид и поведение — см. B10.

**A6. В JSDoc-заголовках неполный список исключений «значение или ref».**
- Список (`types/sortable.ts:159`): упомянуты только `overlay` и `animation`, а `overOverlay`, `dropAnimation` и `overDropAnimation` (строки 193-210) тоже принимают только значение или ref. В заголовке дерева (`types/tree.ts:79-81`) список полный.
- Элемент (`types/sortable.ts:342`): упомянут только `overlay`, пропущен `dropAnimation` (строка 357).

**A7. JSDoc `Announcements` оторван от типа.** Абзац `types/provider.ts:12-17` (live region, 500 мс, `undefined`/`''`, «цель при взятии не анонсируется») стоит над `AnnouncedPosition`, и у того сразу следом свой JSDoc. IDE показывает его не там. Место абзаца — над `Announcements` (строка 53).

**A8. `isDragging` значит разное.**
- `DraggableReturn.isDragging` остаётся `true`, пока overlay садится (`makeDraggable.ts:249`), и это теперь написано в JSDoc (`types/draggable.ts:105`).
- `SortableItemReturn.isDragging` устроен так же (`makeSortableItem.ts:114`), но JSDoc (`types/sortable.ts:394`) о посадке молчит.
- `DragAreaReturn.isDragging` — «until its drop is decided» (`types/area.ts:51`).

Дописать в JSDoc элемента про посадку. Решить, выравнивать ли смысл у области. *JSDoc `disabled` у списка и дерева, который я сначала отмечал здесь, другой агент уже дописал (`types/sortable.ts:292`, `types/tree.ts:198`).*

**A9. Перо на ручке.** `ActivationOptions` (`types/primitives.ts:122`) говорит «mouse/pen `{ distance: 4 }` (immediate on a handle)», `SensorActivation.activation` (`types/sensor.ts:57-58`) — «mouse and pen 4px, at once on a handle». В коде сразу стартует только мышь: `core/sensors/activation.ts:31`, условие `kind === 'mouse'`. RFC §10 верен.
*Исправление:* поправить JSDoc.

**A10. `external` без `createItem` молча ничего не делает.** Список и дерево без `createItem` drag извне не берут (`sortable/modes/insert.ts:25`). JSDoc это упоминает («which it needs»), но dev-предупреждения нет, хотя на `pull: 'clone'` без `clone` оно есть (`makeSortableList.ts:152-160`). При этом само предупреждение про `clone` (строка 155) не обёрнуто в `process.env.NODE_ENV !== 'production'`, как все остальные (`sortable/drop.ts:203`, `core/manager/registry.ts:183`).
*Исправление:* добавить dev-предупреждение для `external` без `createItem`; предупреждение про `clone` оставить только в dev-сборке.

**A11. Нет `activation` на уровне списка и дерева.** RFC §10 обещал «ограничения задаются на провайдере, списке или элементе». В коде `activation` есть у провайдера, области (`types/area.ts:41`) и элемента (`types/sortable.ts:376`), а у `SortableListOptions`/`SortableTreeOptions` нет. Списки передают элементам `overlay`, `dropAnimation`, `modifiers` и `axis` (`makeSortableList.ts:34-48`), но не `activation`. RFC я привёл к коду.
*Исправление (рекомендую):* добавить `activation` списку и дереву как значение по умолчанию для элементов, тем же путём, что `modifiers` и `axis`. Изменение не ломающее.

**A12. Отмена рамки сверяет только `event.code`.** В `makeSelectionArea.ts:347-349` клавиша отмены ищется только по `event.code`, а сенсор клавиатуры принимает `code` или `key` (`core/sensors/keyboard.ts:26-28`). Отмена, привязанная по `key` (`'q'`), прерывает drag, но не рамку. А JSDoc `KeyboardOptions.keys` (`types/provider.ts:73-77`), который уже дописал другой агент, обещает обе формы.
*Исправление:* взять общий `matches`.

**A13. Контракт типов: в compile-time списке не хватает типов.** В `types.test.ts:73-180` нет `AnnouncementContext`, `AnnouncedPosition`, `DragAreaOptions` и `DragAreaReturn`, хотя `index.ts` их экспортирует: если такой тип пропадёт из экспорта, тест этого не заметит. *Два других пункта отсюда уже исправлены в рабочей копии: `SnapToGridOptions` переехал в `types/collision.ts:73`, у пропов провайдера появились значения по умолчанию и JSDoc `screenReaderInstructions`.*

## B. Нужно решение мейнтейнера

**B1. `overlay`/`dropAnimation` у зоны и у списка — разные роли под одним именем.**
- У draggable, элемента, списка и дерева `overlay`/`dropAnimation` относятся к drag этого источника (`types/draggable.ts:60,66`; `types/sortable.ts:193,205`).
- У `makeDroppable` те же имена описывают цель: что показывать над ней и как садиться в неё (`types/draggable.ts:171,178`).
- У списка и дерева роль цели называется `overOverlay`/`overDropAnimation` (`types/sortable.ts:199,210`).

Получается `makeDroppable({ overlay })` ≡ `makeSortableList({ overOverlay })`.
- *Вариант а:* переименовать у зоны в `overOverlay`/`overDropAnimation`. Плюсы: одно имя — одна роль во всём API, по имени видно, что это роль цели. Минусы: имя длиннее; у зоны роль всего одна; ломает код бета-пользователей и примеры.
- *Вариант б:* оставить как есть, в документации — таблица ролей.

Рекомендую (а), пока идёт бета.

**B2. `animation` / `animate` / `animateSize`.** У списка и дерева три почти одинаковых имени (`types/sortable.ts:270-283`), у провайдера два (`types/provider.ts:127,135`). `animate` анимирует изменения данных, которые сделал не drag; внутри функция так и называется — `animateChanges` (`sortable/group.ts:53`).
- *Предложение:* `animate` → `animateChanges` (или `changeAnimation`). Плюсы: не путается с `animation`. Минусы: ломающее, длиннее.
- *Отдельно, не ломающее:* у провайдера нет общего значения `animateSize`, хотя у `animate` оно есть. Добавить проп `animateSize` для симметрии. Сейчас умолчания асимметричны: `animate` выключен, `animateSize` включён.

**B3. `keyboard` с разными смыслами.** У провайдера `keyboard: KeyboardOptions | false` — клавиши и шаг (`types/provider.ts:147`). У draggable `keyboard: 'pixels' | 'droppables'` — режим стрелок (`types/draggable.ts:83`).
- *Предложение:* у draggable назвать `keyboardMode` или сделать `keyboard: { mode }`. Плюсы: имя не перегружено. Минусы: ломающее, опция редкая.

**B4. `dropped` и `accepted` с разными смыслами.**
- `DnDEndEvent.dropped` — «drag закончился над целью» (`types/drag.ts:130`). `ExternalData.dropped` — «данные уже доступны» (`types/native.ts:65`); на него опирается `createItem`: «at the drop… (`active.external.dropped`)», `types/sortable.ts:252`. `ExternalData` появился на этой неделе, переименовать дёшево: `hasData` или `ready`. Рекомендую.
- `accepted` — boolean в `Over` и `OverlaySlotProps` (`types/drag.ts:65`, `types/provider.ts:240`), но `Key[]` в `DnDEndEvent` и `SortableDropEvent` (`types/drag.ts:132`, `types/sortable.ts:93`). Если в A2 выбрать вариант (а), `accepted` и `rejected` в событии цели совпадут по форме с событием списка. Переименование стоит дороже, чем даёт; предлагаю оставить и упомянуть в документации.

**B5. `modifier` и `modifiers`.** `SelectionAreaOptions.modifier` — это клавиши, которые надо держать (`types/selection.ts:35`), а `modifiers` во всём остальном API — функции-модификаторы transform. Есть ещё `copyModifier` (клавиша) у провайдера.
- *Предложение:* `modifier` → `modifierKeys`. Плюсы: нет коллизии с `modifiers`. Минусы: ломающее; имя унаследовано из v2.

**B6. Правило приёма у списка беднее, чем у зоны.** `group.put` — только `boolean | функция` (`types/sortable.ts:70`), а `accept` у зоны принимает и типы-строки (`types/drag.ts:164`). `SortableGroupOptions`/`SortablePutContext.items: unknown[]` не обобщены по `T`.
- *Предложение (не ломающее):* разрешить `put: string | string[]` с тем же матчером типов и сделать `SortableGroupOptions<T>`.

**B7. Мост HTML5 живёт вне `sensors`.** `useNativeDrags` запускается всегда (`DnDProvider.ts:117`): если убрать `pointerSensor` из `sensors`, drag мышью у `native` и drag извне всё равно работают. Между тем `sensors` по документации — «What turns input into drags».
- *Вариант а:* оформить мост как `nativeSensor` в `sensors` по умолчанию. Плюсы: одна модель, его можно убрать или обернуть. Минусы: мост ведёт ещё и drag извне страницы, а это не ввод на draggable; churn API.
- *Вариант б:* оставить и упомянуть в JSDoc `sensors`.

**B8. Список и дерево беднее зоны как цели.** У них нет `data` (над списком `over.data === undefined`, `makeSortableList.ts:246-255`) и нет `onDragEnter`/`onDragLeave`.
- *Предложение (не ломающее):* добавить `data` для паритета с `makeDroppable`.

**B9. `filter` у дерева.** У списка `filter` есть, у дерева нет, а поиск по дереву — частый сценарий. Нужно решить, входит ли это в 3.0.

**B10. Разделить `defaultStyles`** (см. A5). Например, `defaultStyles: 'behavior'` оставляет курсор, `overflow-anchor`, `user-select` и touch-callout, но убирает `opacity`. Или правила поведения внедряются всегда. Плюсы: `false` больше не ломает виртуализацию и iOS. Минусы: ещё одно значение опции.

**B11. Форма `id` в возвращаемых значениях.** `DraggableReturn.id` и `DroppableReturn.id` — `ComputedRef<Key>` (`types/draggable.ts:104,203`), у списка и дерева — `Key` (`types/sortable.ts:315`, `types/tree.ts:211`), у `SortableItemReturn` `id` нет. Тип оси `'x' | 'y'` повторён инлайн пять раз; можно ввести `DragAxis`. Мелочь: решить, выравнивать ли сейчас.

## C. Проверено, в порядке

1. **Правило реактивности соблюдено.** Значение, ref или геттер везде, кроме опций, где функция сама по себе значение (`overlay`, `overOverlay`, `accept`, `animation`, `dropAnimation`, `overDropAnimation`): там значение или ref. `id` и `group` списков и деревьев читаются один раз. Функции передаются как есть. `animate`, `external` и `native` принимают геттер, и это корректно: их значения — не функции. Исключение одно: заголовки JSDoc из A6.
2. **`label`** есть у всех пяти composables, тип один (`MaybeReadonlyRefOrGetter<string | undefined>`). Метка доходит до `active.label`, `items[].label`, `over.label` (списки передают её своей зоне, `makeSortableList.ts:248`), `AnnouncedPosition.label`. Стандартные тексты говорят её вместо id (`core/a11y.ts:7-9`).
3. **`external` и `native` названы последовательно:** `external` — у цели, списка и дерева, `native` — у draggable и элемента. Тип общий, `ExternalAccept` повторяет `<input accept>`. Между окнами связь идёт по имени группы (`ExternalData.group`). `droppedOutside` приходит только в `DnDEndEvent`, и при `'move'` элементы уходят из списка через тот же `source.remove()` (`core/manager/session.ts:523-540`).
4. **`axis`** одинаков по типу и смыслу у draggable, элемента, списка, дерева и области. Применяется последним (`core/modifiers.ts:32-49`), приоритеты задокументированы.
5. **`disabled`** везде `MaybeReadonlyRefOrGetter<boolean>`. Элемент наследует его от списка и от отключённой области.
6. **Несколько списков в компоненте.** `contextOf` выбирает самый внутренний список, чей элемент содержит элемент item (`makeSortableList.ts:64-77`). Предупреждения о двух списках в коде больше нет. JSDoc списка и `makeSortableItem` это описывают.
7. **`filter`** совпадает с JSDoc. Скрытые элементы остаются за своим видимым соседом (`withHidden`, `makeSortableList.ts:120-147`), `to.index` и `activeIndex` считают только показанные.
8. **`animateSize`** по умолчанию `true`, читается при каждом изменении и берёт тайминг `animation`. Поэтому `animation: false` выключает и его (`sortable/resize.ts:57`). Это ожидаемо, но стоит сказать одной фразой в документации.
9. **Overlay.** Бокс `[data-dnd-overlay="dragging|dropping"]`, внутри `[data-dnd-overlay-content]` с `overlayClass` (`core/DragOverlay.ts:229-230`), и так и у бокса drag, и у боксов посадки. Drop ждёт анимаций содержимого. `data-dnd-placeholder="into"` ставится, пока drop уходит в цель внутри элемента (`makeSortableItem.ts:100-102`).
10. **Хвостов `files`/`onFiles`** нет ни в `packages/`, ни в `docs/`.
11. **Экспорты.** Список значений зафиксирован в `types.test.ts:36-69`, внутренние вещи (`DnDManager`, `Announcer`, `SortableScope`, `SmoothModifier`) не торчат, `DnDContext` непрозрачен. Вход `./devtools` прямо помечен как внутренний контракт плагина (`devtools/index.ts:1-4`). Недостающих экспортов не нашёл: каждый тип, на который ссылается публичный, экспортирован.
12. **Порядок колбэков.** Мониторы пользователя решают первыми, затем `onBeforeDrop` цели, затем `onDrop`, запись, `onDragEnd` и `onDragSettle`. Совпадает с JSDoc `DnDMonitor` и `SortableDropEvent`. Строковые ответы `BeforeDropResult` (`'accept' | 'reject' | 'continue'`) последовательны.
13. **Разная форма событий оправдана.** `SortableDropEvent` — про данные (`keys`, `items`, `from/to`, `result`), `DnDEvent` — про геометрию drag. Ключи в sortable называются `key`, в ядре — `id`; соглашение выдержано.
14. **`overlay: false` у sortable-элемента** исключён типом. Это верно: элемент остаётся плейсхолдером.
15. **Умолчания** `dropOutside: 'placeholder'`, `overlayFit: 'slot'`, `multiple: 'group'`, `copyModifier: 'Alt'`, `overlayPreviews: 5`, `haptics.start` совпадают с решениями RFC §16 и JSDoc.
