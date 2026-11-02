---
title: "Tablero de proyecto"
description: "Un tablero de producto al estilo de Linear y Trello — columnas que reordenas, límites WIP, una pregunta antes de Done, selección múltiple con una barra de selección, filtros a través de los que funcionan los arrastres, una papelera con Undo, y un panel de tarjeta cuyos botones Status hacen arrastres reales."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/examples/board"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Arrastra tarjetas y columnas; haz clic en una tarjeta para abrirla, Ctrl/Cmd-clic para seleccionarla" name="board" title="Tablero de proyecto">



</example>

## Qué observar

- **Board.vue**: las columnas forman su propia lista ordenable horizontal (`strategy: 'horizontal'`, `axis: 'x'`), y cada columna es un ítem ordenable que se arrastra por su cabecera
(`handle`). Ampliado, el tablero llena la pantalla; en un teléfono se desplaza de lado.
- **Column.vue**: las tarjetas de todas las columnas son un solo `group`, con las reglas de la
columna: su límite WIP, la pregunta antes de Done y los filtros. El indicador de su cabecera
ilumina las tarjetas que un arrastre traería.
- **Card.vue**: un ítem ordenable de `type: 'card'`, así que la papelera acepta tarjetas y no
columnas. Un clic la abre, Ctrl/Cmd-clic la selecciona (`selected`); con el teclado, Espacio la
agarra, Enter la abre y X la selecciona.
- **store.ts**: los datos y las reglas del tablero, sin nada de arrastrar y soltar, provistos
por encima del `DnDProvider` para que el overlay también los lea.

## Las reglas de una columna

Cada columna le pasa cuatro reglas a su lista. `put` ve todas las tarjetas de un multi-drag a la
vez: la columna las acepta todas si caben bajo su límite, o ninguna. Sobre una columna llena, el
hueco se queda donde empezó el arrastre, la columna se pone roja y las tarjetas en la mano dicen
por qué. `onBeforeDrop` pregunta antes de que entren tarjetas en Done, y `animateChanges` desliza las
tarjetas que llegan y se van sin arrastre: un filtro, Add card, Undo.

```ts [Column.vue]
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: () => props.column.cards.filter(board.matches),
  group: { name: 'cards', put: ({ keys }) => board.fits(props.column, keys) },
  overlay: CardOverlay,
  animateChanges: true,
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? board.ask(event.items) : 'accept'),
  onDrop: (event) => {
    event.preventDefault();
    board.apply(event);
  },
});
```

## Filtros, y drops que aplica el tablero

La búsqueda y las personas de la barra de herramientas filtran las tarjetas, y cada arrastre sigue
funcionando sobre lo que se muestra. Cada lista lee su columna con un getter, filtrada, así que la
biblioteca nunca la escribe: `onDrop` llama a `preventDefault()` y le pasa al tablero `e.result`,
las nuevas tarjetas filtradas de cada columna que cambió el drop. El tablero las vuelve a poner en
los sitios que tenían las tarjetas visibles, y las tarjetas que ocultan los filtros se quedan donde
estaban.

```ts [store.ts]
const merge = (all: Card[], shown: Card[]) => {
  const queue = [...shown];
  const merged: Card[] = [];
  for (const entry of all) {
    if (!matches(entry)) merged.push(entry);
    else if (queue.length) merged.push(queue.shift()!);
  }
  // Cards that came in from another column and found no place left: at the end.
  return [...merged, ...queue];
};
```

## Las tarjetas en la mano

**CardOverlay.vue** es el `overlay` de las tarjetas. La tarjeta agarrada se levanta y se inclina,
el resto de una selección queda debajo, hecho con clones de `DragPreview` girados por el
`transform` de sus envoltorios, y encima va un contador. Bajo las tarjetas, una indicación dice
qué haría soltar, según el `over` y el `accepted` del overlay: *Move 2 cards to In review*,
*Complete*, *Delete*, o *In review is full · 2 max*. Al soltarlo en una columna, cada clon aterriza
en su propio hueco; sobre la papelera el montón se encoge, y al soltarlas ahí las tarjetas entran
una tras otra.

```ts [CardOverlay.vue]
const hint = computed(() => {
  if (props.status !== 'dragging' || !props.over) return null;
  const many = props.items.length > 1 ? ` ${props.items.length} cards` : '';
  if (props.over.id === 'trash') return { tone: 'danger', icon: 'trash', text: `Delete${many}` };
  const column = board.column(props.over.id);
  if (!column) return null;
  if (!props.accepted) return { tone: 'danger', icon: 'limit', text: `${column.title} is full · ${column.limit} max` };
  if (board.find(props.items[0]!.id)?.column.id === column.id) return null;
  if (column.confirm) return { tone: 'done', column, text: `Complete${many}` };
  return { tone: '', column, text: `Move${many} to ${column.title}` };
});
```

Una columna arrastrada por su cabecera es el clon por defecto, inclinado con la propiedad `rotate`
mientras `data-dnd-overlay` vale `dragging`.

## Done pregunta primero

Un drop en Done devuelve una promesa desde `onBeforeDrop`: las tarjetas esperan donde se soltaron
mientras **ConfirmDialog.vue** pregunta. *Move to Done* responde `'accept'`, Cancel y Escape
`'reject'` (las tarjetas vuelven a su sitio), y *Keep dragging* `'continue'`: las tarjetas vuelven
a seguir al puntero, y el siguiente clic las suelta. Cuando las tarjetas han aterrizado
(`onDragSettle`), su marca aparece en Done y avanza el progreso del sprint.

```ts [Board.vue]
useDnDMonitor({
  onDragSettle: (event) => {
    const target = event.over ? board.column(event.over.id) : undefined;
    if ('dropped' in event && target?.confirm && event.source?.list !== target.id) board.complete(event.accepted);
  },
});
```

## Varias tarjetas, la papelera y Undo

Las tarjetas seleccionadas viajan juntas: arrastra una, y todas las seleccionadas la acompañan,
desde cualquier columna. La barra de selección las mueve, las borra o vacía la selección (Escape
también). **Trash.vue** es un destino de drop simple que solo acepta tarjetas; las borra del
tablero, como hacen los botones Delete, para que el aviso pueda devolver cada una a donde estaba.

```ts [Trash.vue]
makeDroppable(el, {
  id: 'trash',
  accept: 'card',
  onDrop: (event) => {
    board.remove(event.active.ids);
    selection.delete(...event.active.ids);
  },
});
```

## Mover sin arrastrar

El panel de una tarjeta tiene botones Status, y la barra de selección tiene un botón por columna.
Mueven tarjetas con `@vue-dnd-kit/actions`: `moveItem` hace un arrastre real con teclado de la
tarjeta, y una tarjeta seleccionada se lleva la selección. Se anuncia y se anima como los tuyos, y
el límite de la columna y la pregunta de Done se le aplican como a cualquier arrastre.

```ts [store.ts]
export function useMove() {
  const board = inject(BOARD)!;
  const { moveItem } = useDnDActions();
  return (ids: Key[], target: Column) => {
    if (!board.fits(target, ids)) return board.notify(`${target.title} is full: ${target.limit} cards at most`);
    void moveItem(ids[0]!, { list: target.id });
  };
}
```

## Teclado y lectores de pantalla

Solo Espacio agarra una tarjeta, así que Enter queda libre para abrirla; las instrucciones lo
dicen. Las flechas mueven una tarjeta de hueco en hueco, y en horizontal a la siguiente columna que
la acepte: una llena se salta, y pasada la última columna la siguiente pulsación lleva la tarjeta a
la papelera. Los anuncios nombran tarjetas y columnas en lugar de ids:
*"Picked up VDK-45, Haptics on Android tablets. Todo, position 6 of 6."*,
*"In review is full: its limit is 2 cards."*

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'] } }"
  screen-reader-instructions="Space picks up a card or a column, the arrow keys move it, Space drops it, Escape cancels. Enter opens a card, X selects it."
  :announcements="announcements"
  :haptics="{ enter: true, refuse: true }"
>
```

Más información: [Listas que comparten ítems](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists) ·
[Decidir un drop](https://zizigy.github.io/docs/guides/drop-decisions) · [Multi-drag](https://zizigy.github.io/docs/guides/multi-drag) ·
[El overlay](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[Arrastres programáticos](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) ·
[Accesibilidad](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
