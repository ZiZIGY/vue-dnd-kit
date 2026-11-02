---
title: "Calendario semanal"
description: "Una agenda semanal — eventos que se mueven entre días y cuartos de hora, se estiran por sus bordes, se dibujan en el tiempo libre, pasan a todo el día, se planifican desde una lista de tareas, con deshacer."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/examples/calendar"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="44rem" hint="Mueve o estira un evento, o dibuja uno en el tiempo libre" name="calendar" title="Calendario semanal">



</example>

## Qué observar

- **EventBlock.vue**: un evento en las horas es un elemento arrastrable simple cuyo overlay,
**EventOverlay.vue**, dice dónde aterrizaría: "Wed 10:30 – 11:15". Los eventos que se solapan
se colocan uno al lado del otro (`layoutDay` en `placement.ts`).
- **Edge.vue**: los bordes superior e inferior de un evento son elementos arrastrables propios.
Arrastra uno y el evento se estira, de cuarto de hora en cuarto de hora.
- **DayColumn.vue**: las horas de cada día son un destino de drop, y bajo sus eventos también hay
un elemento arrastrable: pulsa en el tiempo libre y arrastra para dibujar un evento nuevo, luego
escribe su título.
- **AllDayCell.vue** y **Tasks.vue**: suelta un evento en la celda de todo el día de un día y
pierde su hora; suéltalo en la lista de tareas y pierde su día. Las tareas (**EventChip.vue**)
se arrastran a la semana y conservan su duración.
- **Week.vue**: el área de arrastre de las horas y su propio modificador, los movimientos con
teclado, la línea de la hora actual.
- **calendar.ts**: los eventos y un historial para deshacer. Cada cambio pasa por una sola
función, y el toast ofrece deshacerlo.

Amplía el ejemplo: si hay sitio, un panel lateral muestra el mes, los calendarios que mostrar u
ocultar, y las tareas como lista. En un teléfono la semana se convierte en tres días, y una
pulsación larga arrastra.

## Una respuesta para cada drop

Lo que haría un drop se pregunta en cuatro sitios: la etiqueta del overlay, el fantasma que una
tarea muestra en el día de debajo, lo que oyen los lectores de pantalla y el propio drop. Todos
llaman a `placeOf`, así que nunca discrepan. Cada destino de drop lleva lo que es en su `data`, y
`position` es dónde está la caja arrastrada dentro de él: su borde superior es la hora.

```ts [placement.ts]
export function placeOf(event: CalendarEvent, over: Over | null, position: Coordinates | null): Place | null {
  const target = over?.accepted ? (over.data as Target) : null;
  if (!target) return null;
  if (target.kind === 'tasks') return { day: null, start: null };
  if (target.kind === 'all-day') return { day: target.day, start: null };
  if (!position) return null;
  return { day: target.day, start: clamp(minutesAt(position.y), 0, DAY_MINUTES - event.duration) };
}
```

El overlay la lee en vivo, desde `useDnD().position`, y conserva su última respuesta mientras
aterriza:

```ts [EventOverlay.vue]
const { position } = useDnD();
const place = shallowRef(placeOf(event.value, props.over, position.value));
watchEffect(() => {
  if (props.status === 'dragging') place.value = placeOf(event.value, props.over, position.value);
});
```

Un evento conserva su id, su `data` y su overlay esté donde esté: un bloque en las horas, un chip
de todo el día o entre las tareas. Si se suelta en otro sitio, lo renderiza otro componente, y el
overlay aterriza igualmente en el nuevo elemento.

## El modificador propio de las horas

`makeDragArea` da a los arrastres que empiezan en las horas (un evento, un borde, el tiempo libre)
un modificador propio. Sobre los días, la caja se mueve por días enteros, tantos como cruzó el
puntero, así que un evento junto a otro conserva su sitio en el día; su borde superior se ajusta a
los cuartos de hora del día en que empezó. `containerRect` es ese día donde está ahora: sigue al
scroll, y el ajuste se mantiene mientras las horas se desplazan solas bajo un arrastre.

```ts [Week.vue]
const snapToWeek: Modifier = ({ transform, overlayRect, containerRect, origin }) => {
  const days = grid.value?.getBoundingClientRect();
  if (!days || !containerRect) return transform;
  const width = days.width / props.days.length;
  const column = (x: number) => Math.floor((x - days.left) / width);
  const pointer = origin.x + transform.x;
  const x = pointer < days.left || pointer >= days.right ? transform.x : (column(pointer) - column(origin.x)) * width;
  const top = overlayRect.top - containerRect.top;
  return { x, y: transform.y + Math.round(top / STEP_PX) * STEP_PX - top };
};

makeDragArea(grid, { modifiers: [snapToWeek], autoScroll: { threshold: 0.12 } });
```

El `autoScroll` del área estrecha el borde que desplaza las horas, para todos los arrastres sobre
ellas: la fila de todo el día, justo encima, sigue siendo fácil de alcanzar. Las tareas y los
eventos de todo el día empiezan fuera del área y se mueven libremente; el día de debajo muestra un
fantasma donde aterrizarían.

## Estirar: un borde es un elemento arrastrable

Un borde está dentro del elemento de su evento, y una pulsación arrastra el elemento arrastrable
más cercano: el borde. No tiene overlay, solo se mueve arriba y abajo, y se queda en las horas
visibles.

```ts [Edge.vue]
makeDraggable(el, {
  id: () => `${props.event.id}-${props.edge}`,
  type: 'edge',
  data: (): DragData => ({ kind: 'edge', event: props.event, edge: props.edge }),
  overlay: false,
  axis: 'y',
  modifiers: [restrictToFirstScrollableAncestor],
  attributes: false, // no tab stop: Shift + arrows change the end of a focused event
});
```

El borde en sí no se mueve. Lo que crece es el evento, desde donde está el borde en el día, leído
de `position` igual que lo leerá el drop:

```ts [EventBlock.vue]
const time = computed(() =>
  resizing.value && position.value
    ? resizeTo(props.event, resizing.value, position.value)
    : { start: props.event.start!, duration: props.event.duration },
);
```

## Dibujar en el tiempo libre

Bajo los eventos, cada día tiene una franja, y la franja es un elemento arrastrable sin overlay.
Nunca se mueve: lo lejos que fue su caja (`position`) es lo lejos que fue el puntero desde la
pulsación, ajustado a cuartos de hora por el área. El día muestra el evento nuevo mientras se
dibuja, y su drop lo crea.

```ts [DayColumn.vue]
makeDraggable(lane, {
  id: () => `new-${props.day}`,
  type: 'new',
  data: (): DragData => ({ kind: 'new', day: props.day, from: from.value }),
  overlay: false,
  axis: 'y',
  attributes: false, // the New event button is the keyboard's way
});
```

El `accept` del día es una función: acepta cualquier evento, y solo sus propios bordes y franjas.
Las celdas de todo el día y la lista de tareas aceptan `'event'`, una cadena, así que los tipos
`edge` y `new` se rechazan ahí sin una línea de código. El drop es un solo manejador:

```ts [DayColumn.vue]
onDrop: ({ active, over, position }) => {
  const data = active.data as DragData;
  if (!position) return;
  if (data.kind === 'event') {
    const place = placeOf(data.event, over, position);
    if (place) calendar.place(data.event.id, place);
  } else if (data.kind === 'edge') {
    calendar.resize(data.event.id, resizeTo(data.event, data.edge, position));
  } else {
    const { start, duration } = rangeOf(data.from, data.from + position.y);
    calendar.create(props.day, start, duration);
  }
},
```

## El teclado

Llega a un evento con Tab y agárralo con Espacio: el monitor de la semana responde a las flechas,
`getKeyboardCoordinates`, con el siguiente cuarto de hora (con Mayús, una hora) o el siguiente
día. Los arrastres con teclado no se desplazan solos, así que cerca de un extremo de las horas
visibles la flecha las desplaza en su lugar. Las tareas y los eventos de todo el día saltan de
destino en destino (`keyboard: 'droppables'`) hasta que están sobre las horas.

```ts [Week.vue]
useDnDMonitor({
  getKeyboardCoordinates: (key, { pointer, direction }) => {
    // …only over the hours
    const dy = direction.y * STEP_PX * (key.shiftKey ? 4 : 1);
    const next = { x: pointer.x + direction.x * (grid.value.offsetWidth / props.days.length), y: pointer.y + dy };
    if (canScroll && (next.y < view.top + HOUR_PX || next.y > view.bottom - HOUR_PX)) {
      hours.scrollTop += dy;
      return { x: next.x, y: pointer.y };
    }
    return next;
  },
});
```

Los `announcements` del provider en `index.vue` dicen qué se agarró y cómo moverlo; la semana dice
la hora a medida que las flechas la cambian ("Tuesday, 10:30 to 11:15"), y el toast lo que cambió
un drop. Sobre un evento con el foco, Supr lo borra, y Ctrl+Z deshace cualquier cambio.

Más información: [Un modificador propio](https://zizigy.github.io/docs/guides/constraints#your-own-modifier) ·
[Reglas para una parte de la página](https://zizigy.github.io/docs/guides/constraints#rules-for-a-part-of-the-page) ·
[Dejarlo donde se soltó](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped) ·
[Sin overlay](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[Componentes de overlay](https://zizigy.github.io/docs/guides/overlay#overlay-components) ·
[Accesibilidad](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
