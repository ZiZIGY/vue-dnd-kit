---
title: "Panel de control"
description: "Widgets en una cuadrícula — se mueven por su cabecera, se redimensionan por su esquina de celda en celda, en filas tan altas como su contenido, con menos columnas en pantallas estrechas."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/examples/dashboard"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="38rem" hint="Arrastra un widget por su cabecera, redimensiónalo por su esquina, escribe en las notas" name="dashboard" title="Panel de control">



</example>

## Qué observar

- **Dashboard.vue**: la cuadrícula es una sola lista ordenable con `strategy: 'grid'`, que ordena
widgets de distintos tamaños. Cuenta sus columnas a partir de su propio ancho (`useElementSize`):
cuatro, tres o dos. Sus filas miden al menos 92 px de alto y crecen con su contenido, y
`grid-auto-flow: dense` rellena los agujeros que deja un redimensionado.
- **Widget.vue**: un widget se mueve por su cabecera (`handle`), así que su contenido queda libre:
las tareas se marcan, las notas admiten texto. Su esquina es un elemento arrastrable propio, y lo
redimensiona.
- **WidgetBody.vue**: lo que muestran los widgets. Escribe en las notas: la fila crece con el
texto, y los widgets de al lado con la fila. Nada los mide: es la propia disposición de la
cuadrícula, y la biblioteca lee los tamaños tal como están cuando empieza un arrastre.
- **widgets.ts**: los widgets, sus tamaños en celdas y los números de la cuadrícula.

Amplía la demo: la cuadrícula pasa a tener cuatro columnas, y un widget que se estrechó en una
pantalla pequeña vuelve a tener el ancho que tenía.

## Redimensionar: la esquina es un elemento arrastrable

La esquina está dentro del widget, y una pulsación arrastra el elemento arrastrable más cercano: la
esquina, no el widget. No tiene overlay y nunca se mueve. Lo que crece es el widget.

```ts [Widget.vue]
makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  activation: { touch: { distance: 4 } }, // a finger resizes at once, not after a long press
  attributes: false,                       // no tab stop: Shift + arrows on the header resize
});
```

El tamaño sigue al puntero: lo lejos que ha ido desde la pulsación, en celdas enteras. La cuadrícula
muestra ese tamaño mientras se sujeta la esquina, y sus otros widgets le hacen sitio.

```ts [Widget.vue]
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});
```

El drop lo conserva: un monitor oye el `onDragEnd` de la esquina. <kbd value="Escape">



</kbd>

 cancela el
arrastre en su lugar, y el widget vuelve a su propio tamaño.

```ts [Widget.vue]
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});
```

## La cuadrícula se queda fuera del redimensionado

Una esquina no es un widget, y la cuadrícula la rechazaría: el drop sobre un destino que rechaza un
arrastre es una cancelación. Así que, mientras se arrastra una esquina, la cuadrícula está
`disabled`, y el drop de la esquina no cae sobre ningún destino.

```ts [Dashboard.vue]
const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  strategy: 'grid',
  label: 'Dashboard',
  disabled: () => !!active.value?.type.includes('resize'),
});
```

## Tamaños que se adaptan

Un widget conserva el tamaño que se le dio. Con menos columnas nunca es más ancho que la cuadrícula
(`Math.min(w, columns)`), y recupera su ancho cuando la cuadrícula vuelve a tener sitio. Las filas
tienen una altura mínima, no una altura: decide el contenido, y todos los widgets de una fila se
estiran hasta el más alto.

## El teclado

Llega con Tab a la cabecera de un widget y pulsa <kbd value="Space">



</kbd>

 para agarrar el widget. Las
flechas lo mueven entre los demás, <kbd value="Space">



</kbd>

 lo suelta, <kbd value="Escape">



</kbd>

 lo devuelve a
su sitio. Con la cabecera enfocada, <kbd value="Shift">



</kbd>

 y las flechas redimensionan el widget de
celda en celda, y los lectores de pantalla oyen su nuevo tamaño.

Más información: [Estrategias](https://zizigy.github.io/docs/guides/sortable-lists#strategies) ·
[Asas](https://zizigy.github.io/docs/guides/sortable-lists#handles) ·
[Sin overlay](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[useDnDMonitor()](https://zizigy.github.io/docs/guides/provider#listen-to-every-drag-usedndmonitor) ·
[Calendario semanal](https://zizigy.github.io/docs/examples/calendar)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
