---
title: "Шахматы"
description: "Шахматная доска — допустимые ходы подсвечиваются, фигура в руке говорит, почему поле отклонено, пешка спрашивает, кем ей стать, а бот отвечает настоящими драгами."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/chess"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="36rem" hint="Перетащите белую фигуру или используйте Tab и Space; бот играет чёрными" name="chess" title="Шахматы">



</example>

## На что обратить внимание

- **Square.vue**: каждое из 64 полей — цель, чей `accept` — функция. Её спрашивают, пока
фигуру тащат, так что поле принимает только допустимые ходы этой фигуры; бросок куда-либо ещё
отклоняется, и фигура летит обратно. Допустимые поля подсвечиваются по `isAccepting`: никакое
собственное состояние игры не следит за драгом.
- **Piece.vue**: обычный перетаскиваемый элемент, `disabled`, когда ход не его стороны.
`keyboard: 'droppables'` заставляет стрелки прыгать между полями, которые принимают фигуру:
её допустимыми ходами, и ничем больше. `snapCenterToCursor` держит фигуру по центру под
указателем, а касание тащит сразу (`activation`). `canDrag` не даёт вам трогать фигуры бота и
доску, пока играет код, ничего не отключая: у драгов, начатых кодом, нет события ввода, поэтому
`canDrag` для них не спрашивается.
- **chess.ts** и **game.ts**: правила и партия, без всякого drag and drop: допустимые ходы с
шахом, рокировка, взятие на проходе, превращение, ничья из-за недостатка материала, нотация,
отмена. Ход в `onDrop` создаёт новую позицию, и оверлей приземляется на сходившую фигуру.

## Фигура в руке

**PieceOverlay.vue** — компонент `overlay` фигур. Он читает пропсы, которые получает любой
оверлей, и говорит, что сделал бы бросок на поле под ним: над отклонённым полем (`over` задан,
`accepted` равен false) фигура краснеет и называет причину, над взятием показывает мишень и то,
что она берёт. Когда бросок решён (`status: 'dropping'`), подсказка исчезает и фигура
опускается.

```ts [PieceOverlay.vue]
const props = defineProps<{
  active: Active;
  over: Over | null;
  accepted: boolean;
  status: DnDStatus;
}>();

const hint = computed(() => {
  const square = props.over ? String(props.over.id) : null;
  if (props.status !== 'dragging' || !square || square === piece.value.square) return null;
  if (props.accepted) {
    const taken = game.takes(piece.value.id, square);
    return taken ? { type: 'capture', text: `Takes ${NAMES[taken.kind]}` } : null;
  }
  // "Pinned", "King in check", "Not a legal move"
  return { type: 'refused', text: game.whyNot(piece.value.id, square) };
});
```

`Board.vue` рисует стрелку от поля, с которого пришла фигура, к полю под ней, по `active` и
`over` из `useDnD()`. `haptics` провайдера даёт вибрацию при драге касанием на допустимом поле и
когда бросок отклонён; `announcements` в `index.vue` произносят те же причины: «f7, pinned».

## Превращение: бросок, который ждёт ответа

Над последней горизонталью пешка в руке показывает фигуру, в которую превращается: собственный
`overlay` поля (`PromotionOverlay.vue`) занимает место оверлея фигуры. При отпускании
`onBeforeDrop` поля возвращает промис, и оверлей ждёт на поле, пока **PromotionPicker.vue**,
обычный элемент страницы рядом с ним, спрашивает, какая фигура. Фигура отвечает `'accept'`,
Escape или Cancel — `'reject'` (пешка летит обратно), а Keep dragging — `'continue'`: пешка
снова следует за указателем, а следующий клик бросает её и спрашивает снова.

```ts [Square.vue]
makeDroppable(el, {
  id: props.square,
  accept: ({ active }) => game.canMove(active.id, props.square),
  // Shown instead of the piece's overlay while a pawn is over the last rank.
  overlay: computed(() =>
    held.value?.kind === 'P' && isLastRank(props.square) ? PromotionOverlay : undefined,
  ),
  // A promise: the drop waits on the square until the picker answers.
  onBeforeDrop: ({ active }) =>
    game.promotes(active.id, props.square) ? game.askPromotion(props.square) : 'accept',
  onDrop: ({ active }) => game.move(String(active.id), props.square),
});
```

`onBeforeDrop` цели получает обычное событие драга и спрашивается, только когда её `accept`
принял драг; `onBeforeDrop` сортируемого списка получает `SortableDropEvent` списка с `result`
броска. `overlay` цели читается ещё раз после `onDrop`, для приземления: он проверяет пешку такой,
какой её взяли (`active.data`), а не партию, где к тому времени это уже ферзь.

## Бот, повторы и рокировка: драги, которые проигрывает код

**autoplay.ts** играет ходы через `@vue-dnd-kit/actions`: ходы бота (`bot.ts`, жадного), ходы
**Replay** и шаг ладьи при каждой рокировке, включая вашу. Каждый — настоящий драг: фигуру берут,
ведут над доской кадр за кадром, бросают через `accept` и `onDrop` поля, он озвучивается и
анимируется, как ваши. Заскриптованное превращение приносит свою фигуру с собой, так что выбор не
открывается; Escape отменяет заскриптованный драг, как любой другой.

```ts [autoplay.ts]
const { startDrag } = useDnDActions();

const drag = startDrag(id); // from the piece's center
for (let frame = 1; frame <= FRAMES; frame++) {
  const t = easeOut(frame / FRAMES);
  const point = { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
  if (!(await drag.moveTo(point))) return false; // cancelled meanwhile (Escape)
}
return drag.drop(); // true once it has landed, false if the square refused it
```

Рокировка играется двумя ходами, как руками: король идёт на два поля, затем его ладью перетаскивают
через него, так что ладья никогда не прыгает.

## Взятия, отмена и новая партия

Взятые фигуры уходят в **Tray.vue** своей стороны: сортируемый список, который используется
только ради `animate` (`disabled`, там ничего не перетаскивается). Его `enter` — функция: новая
фигура прилетает с поля, на котором её взяли, а остальные освобождают место.

```ts [Tray.vue]
makeSortableList(tray, {
  items: () => props.pieces,
  getKey: (piece) => `taken-${piece.id}`,
  disabled: true,
  animate: { enter: flyIn, leave: false },
});
```

Undo и New game меняют позицию без драга, поэтому **glide.ts** анимирует их вручную (FLIP):
каждая фигура летит оттуда, где была — с поля или из лотка, — туда, где она сейчас. Против бота
Undo отменяет ваш ход вместе с его ответом.

Подробнее: [решение о броске](https://zizigy.github.io/docs/guides/drop-decisions) ·
[оверлей](https://zizigy.github.io/docs/guides/overlay#targets-that-change-the-overlay) ·
[программные драги](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) ·
[изменения данных: `animate`](https://zizigy.github.io/docs/guides/animations#data-changes-animate) ·
[доступность](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
