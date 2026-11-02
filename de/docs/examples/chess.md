---
title: "Schach"
description: "Ein Schachbrett – gültige Züge leuchten auf, die Figur in der Hand sagt, warum ein Feld abgelehnt wird, ein Bauer fragt, was er wird, und ein Bot spielt mit echten Drags zurück."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/examples/chess"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="36rem" hint="Ziehe eine weiße Figur oder nimm Tab und Space; der Bot spielt Schwarz" name="chess" title="Schach">



</example>

## Worauf du achten solltest

- **Square.vue**: Jedes der 64 Felder ist ein Drop-Ziel, dessen `accept` eine Funktion ist. Sie
wird gefragt, während eine Figur gezogen wird, also nimmt das Feld nur die gültigen Züge dieser
Figur an; ein Drop anderswo wird abgelehnt, und die Figur fliegt zurück. Die gültigen Felder
leuchten über `isAccepting` auf: Kein eigener Zustand des Spiels verfolgt den Drag.
- **Piece.vue**: ein einfaches ziehbares Element, `disabled`, wenn seine Seite nicht am Zug ist.
`keyboardMode: 'droppables'` lässt die Pfeiltasten zwischen den Feldern springen, die die Figur
annehmen: ihren gültigen Zügen, sonst nichts. `snapCenterToCursor` hält die Figur zentriert
unter dem Zeiger, und ein Touch zieht sofort (`activation`). `canDrag` hält deine Hände von den
Figuren des Bots und vom Brett fern, solange Code spielt, ohne etwas abzuschalten: Von Code
gestartete Drags haben kein Eingabe-Event, also wird `canDrag` für sie nicht gefragt.
- **chess.ts** und **game.ts**: die Regeln und die Partie, ganz ohne Drag and Drop: gültige
Züge mit Schach, Rochade, En passant, Umwandlung, Remis mangels Material, die Notation, Undo.
Ein Zug in `onDrop` erzeugt eine neue Stellung, und das Overlay landet auf der gezogenen Figur.

## Die Figur in der Hand

**PieceOverlay.vue** ist die `overlay`-Komponente der Figuren. Sie liest die Props, die jedes
Overlay bekommt, und sagt, was ein Drop auf dem Feld darunter tun würde: Über einem abgelehnten
Feld (`over` gesetzt, `accepted` false) wird die Figur rot und nennt den Grund, über einem
Schlagzug zeigt sie eine Zielscheibe und was sie schlägt. Sobald der Drop entschieden ist
(`status: 'dropping'`), verschwindet der Hinweis, und die Figur setzt sich.

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

`Board.vue` zeichnet einen Pfeil von dem Feld, von dem die Figur kam, zu dem Feld darunter, aus
`active` und `over` von `useDnD()`. Die `haptics` des Providers lassen einen Touch-Drag auf einem
gültigen Feld vibrieren und wenn ein Drop abgelehnt wird; die `announcements` in `index.vue`
sprechen dieselben Gründe: „f7, pinned“.

## Umwandlung: ein Drop, der auf eine Antwort wartet

Über der letzten Reihe zeigt ein Bauer in der Hand die Figur, die er wird: Das eigene `overOverlay`
des Feldes (`PromotionOverlay.vue`) tritt an die Stelle des Overlays der Figur. Beim Loslassen
gibt das `onBeforeDrop` des Feldes ein Promise zurück, und das Overlay wartet auf dem Feld,
während **PromotionPicker.vue**, ein einfaches Element der Seite daneben, fragt, welche Figur.
Eine Figur antwortet `'accept'`, Escape oder Cancel `'reject'` (der Bauer fliegt zurück), und Keep
dragging `'continue'`: Der Bauer folgt wieder dem Zeiger, und der nächste Klick legt ihn ab und
fragt erneut.

```ts [Square.vue]
makeDroppable(el, {
  id: props.square,
  accept: ({ active }) => game.canMove(active.id, props.square),
  // Shown instead of the piece's overlay while a pawn is over the last rank.
  overOverlay: computed(() =>
    held.value?.kind === 'P' && isLastRank(props.square) ? PromotionOverlay : undefined,
  ),
  // A promise: the drop waits on the square until the picker answers.
  onBeforeDrop: ({ active }) =>
    game.promotes(active.id, props.square) ? game.askPromotion(props.square) : 'accept',
  onDrop: ({ active }) => game.move(String(active.id), props.square),
});
```

Das `onBeforeDrop` eines Drop-Ziels bekommt das einfache Drag-Event und wird nur gefragt, wenn
sein `accept` den Drag angenommen hat; das einer sortierbaren Liste bekommt das
`SortableDropEvent` der Liste, mit dem `result` des Drops. Das `overOverlay` des Ziels wird nach
`onDrop` noch einmal gelesen, für die Landung: Es prüft den Bauern, wie er aufgenommen wurde
(`active.data`), nicht die Partie, in der er dann schon eine Dame ist.

## Der Bot, Wiederholungen und die Rochade: Drags, die Code spielt

**autoplay.ts** spielt Züge mit `@vue-dnd-kit/actions`: die des Bots (`bot.ts`, ein gieriger),
die von **Replay** und den Turmschritt jeder Rochade, auch deiner. Jeder ist ein echter Drag:
aufgenommen, Frame für Frame über das Brett geführt, über `accept` und `onDrop` des Feldes
abgelegt, angesagt und animiert wie deine. Eine geskriptete Umwandlung bringt ihre Figur mit, der
Auswahldialog öffnet sich also nicht; Escape bricht einen geskripteten Drag ab wie jeden anderen.

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

Die Rochade wird in zwei Zügen gespielt, wie von Hand: Der König geht zwei Linien weit, dann wird
sein Turm über ihn gezogen, der Turm springt also nie.

## Schlagen, Undo und eine neue Partie

Geschlagene Figuren kommen in das **Tray.vue** ihrer Seite: eine sortierbare Liste, die nur für
ihr `animateChanges` verwendet wird (`disabled`, dort wird nichts gezogen). Ihr `enter` ist eine
Funktion: Eine neue Figur fliegt von dem Feld herein, auf dem sie geschlagen wurde, und die
anderen machen Platz.

```ts [Tray.vue]
makeSortableList(tray, {
  items: () => props.pieces,
  getKey: (piece) => `taken-${piece.id}`,
  disabled: true,
  animateChanges: { enter: flyIn, leave: false },
});
```

Undo und New game ändern die Stellung ohne Drag, also animiert **glide.ts** sie von Hand
(FLIP): Jede Figur fliegt von dort, wo sie war, auf einem Feld oder in einer Ablage, dorthin, wo
sie jetzt ist. Gegen den Bot nimmt Undo deinen Zug zusammen mit seiner Antwort zurück.

Mehr dazu: [Über einen Drop entscheiden](https://zizigy.github.io/docs/guides/drop-decisions) ·
[Das Overlay](https://zizigy.github.io/docs/guides/overlay#targets-that-change-the-overlay) ·
[Programmatisches Ziehen](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) ·
[Datenänderungen: `animateChanges`](https://zizigy.github.io/docs/guides/animations#data-changes-animatechanges) ·
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
