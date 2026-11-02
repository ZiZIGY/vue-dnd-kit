---
title: "Gestor de archivos"
description: "Un disco en la nube — vistas de cuadrícula y de lista, un rectángulo de selección, carpetas que aceptan drops en todas partes y se abren al pasar por encima, Alt para copiar, una papelera con Undo, y archivos soltados desde tu escritorio."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/examples/file-manager"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Dibuja un rectángulo alrededor de unos archivos y suéltalos en una carpeta; Alt copia" name="file-manager" title="Gestor de archivos">



</example>

## Qué observar

- **FileView.vue**: la carpeta abierta es una sola lista ordenable, que se muestra como una
cuadrícula de mosaicos o una lista de filas. El rectángulo de selección, los clics y las teclas
seleccionan; un arrastre se lleva la selección.
- **useFolderDrop.ts**: cada carpeta en pantalla es un destino de drop: los mosaicos, las filas
del árbol, los favoritos, las migas de la ruta, la papelera. Dice por qué rechaza un arrastre, y
se traga los archivos cuando han entrado.
- **FilesOverlay.vue**: lo que sigue al puntero, hecho con las props que recibe todo overlay: un
montón de los mosaicos reales con un contador, un «+» mientras Alt copia, y lo que haría el drop.
- **SidebarRow.vue**: una carpeta cerrada del árbol se abre cuando un arrastre se detiene sobre
ella, para que sus subcarpetas puedan aceptar el drop. **Favorites.vue** es una lista ordenable
propia, cuyas filas también son destinos de drop.
- **useDesktopDrop.ts**: archivos arrastrados desde tu equipo. Es el arrastrar y soltar del
navegador, no el de la biblioteca, gestionado junto a él.
- **drive.ts**: el estado y cada cambio, con Undo. **index.vue**: el provider, con las teclas
reasignadas y sus anuncios.

## Una lista, dos vistas

La cuadrícula y la lista son la misma lista ordenable. Sus opciones son getters, que se leen
cuando empieza un arrastre: la estrategia sigue a la vista, y una carpeta ordenada por una columna
(`sort: false`) no se reordena. Los arrastres siguen entrando en sus carpetas.

```ts [FileView.vue]
const { items } = makeSortableList(list, {
  items: drive.entries,   // the open folder, sorted by a column or in your own order
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  sort: () => drive.sort.value.key === 'manual',
  multiple: 'gaps',       // the other picked files wait in place, as in Finder
  clone: drive.duplicateOf, // Alt-drag leaves the files and drops "Budget copy.xlsx"
  dropzone: area,         // the empty space takes drops too
  animateChanges: true,   // a new sort, a new folder, files sent to the Trash slide and fade
});
```

- `drive.entries` es un computed modificable: la biblioteca escribe cada drop a través de su
`set`, y el `onDrop` de la lista guarda antes el disco, para Undo.
- La ventana crea una vista nueva para cada carpeta (`:key` en `FileView`), así que abrir una no es
un cambio de la lista que `animateChanges` tenga que reproducir.

## Seleccionar

El provider guarda la selección; la vista decide cómo se hace. Una pulsación en el espacio vacío
dibuja un rectángulo: sola, reemplaza la selección; con Mayús, Ctrl o Cmd pulsado, invierte los
mosaicos que cruza. La estrategia es un getter, que se lee cuando empieza un rectángulo:

```ts [FileView.vue]
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});

// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
};
```

Los clics siguen al Finder: un clic elige uno, Ctrl/Cmd-clic lo añade o lo quita, Mayús-clic toma
el tramo desde el último. Las flechas mueven una sola parada de tabulación por los archivos (un
`tabindex` itinerante, que la biblioteca no toca), Mayús+flechas amplían, Enter abre, F2 renombra,
Supr envía a la papelera, escribir salta a un nombre. El provider le devuelve Enter a la app: solo
Espacio agarra un archivo.

```vue [index.vue]
<script setup lang="ts">
// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };
</script>

<template>
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
```

## Las carpetas aceptan drops en todas partes

`useFolderDrop` convierte cualquier elemento en una carpeta que acepta archivos. Un mosaico
también es un ítem ordenable de la cuadrícula: ahí el destino solo cuenta en el centro del
mosaico, y cerca de sus bordes la cuadrícula hace sitio. `accept` rechaza la carpeta en la que
están los archivos, y una carpeta dentro de sí misma; un mosaico rechazado deja que la cuadrícula
ordene sobre él como sobre cualquier otro.

```ts [useFolderDrop.ts]
const { id, isOver, isAccepting } = makeDroppable(target, {
  disabled: () => !folder(),
  data: () => drive.placeOf(folder()!),   // { name, trash, why }: the overlay reads it as `over.data`
  accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
  onDrop: (event) => drive.dropInto(event, folder()!),
});

// The files are in once the overlay has landed in the folder: it gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
  },
});
```

`dropInto` mueve los archivos, o los copia cuando `event.mode` es `'copy'` (Alt pulsado sobre una
lista con `clone`). Un movimiento llama a `event.source.remove()`: la cuadrícula suelta los
archivos, y su `onDrop` se ejecuta con `to.index === -1`.

```ts [drive.ts]
const dropInto = (event: DnDEvent, target: FolderEntry) => {
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
  record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
  if (copying) return put(target, dragged.map(copyEntry), current.value);
  put(target, dragged, current.value);
  // The grid lets them go: the library writes the open folder without them.
  event.source?.remove();
  selection.delete(...event.active.ids);
};
```

Un favorito es a la vez un ítem ordenable (en `Favorites.vue`, una lista de su propio grupo) y un
destino de drop: `FavoriteRow.vue` le pasa el componente de la fila a `makeSortableItem`, que lee
su elemento raíz, y `SidebarRow.vue` convierte ese mismo elemento en una carpeta. Cerca de sus
bordes, un favorito arrastrado se ordena; los archivos soltados sobre él entran en su carpeta.

### Carpetas que se abren solas

Una carpeta cerrada del árbol se abre cuando un arrastre se detiene sobre ella, como en el Finder:
`isOver` se mantiene un momento, y la fila se despliega. Sus subcarpetas se montan en pleno
arrastre y aceptan drops al momento.

```ts [SidebarRow.vue]
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), 700);
});
```

## El overlay

`FilesOverlay.vue` es el `overlay` de la lista. Desde la cuadrícula apila `DragPreview`, los clones
reales de los mosaicos elegidos: al soltarlo en un hueco, cada uno aterriza en su propio mosaico;
al soltarlos en una carpeta, entran uno tras otro. Una fila es tan ancha como la lista, así que la
lista centra la caja en el puntero (`snapCenterToCursor`) y el overlay le cuelga un chip pequeño.
El overlay es una función, que Vue toma como componente funcional: pasa las props que lee y dice
cuál de los dos dibujar.

```ts [FileView.vue]
overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
  h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
```

Bajo el montón, una píldora dice qué haría soltar, según el `data` de la carpeta: "Move to
Photos", "Copy to Photos" mientras se pulsa Alt (`mode`), o en rojo por qué no, donde `accepted`
es `false`.

```ts [FilesOverlay.vue]
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
```

Los `announcements` del provider leen el mismo `data`, así que un lector de pantalla oye "Over
Photos. Drop to move 3 items there", o "Already in Documents". Nombran los archivos, donde los
textos integrados dirían sus claves.

## Archivos desde tu escritorio

Arrastra archivos desde tu equipo a la ventana: se suben a la carpeta bajo el puntero (un mosaico,
una fila de la barra lateral, una miga), o si no a la abierta, y las fotos se muestran. La
biblioteca arrastra elementos de la página; los archivos de fuera llegan con el arrastrar y soltar
propio del navegador, `dragover` y `drop`, gestionado junto a ella:

```ts [useDesktopDrop.ts]
const dragover = (event: DragEvent) => {
  if (!carriesFiles(event)) return;
  // Cancelled, a `dragover` says the drop is welcome here.
  event.preventDefault();
  const folder = folderAt(event); // under the pointer: an element with a folder's `data-id`
  // …nothing goes into the Trash…
  drive.uploadTarget.value = folder.id; // that folder opens, as for the library's drags
};
```

## Undo, la papelera y lo demás

- Cada cambio guarda antes una copia del disco; el Undo del toast (o Ctrl/Cmd+Z) vuelve a ella. La
papelera es una carpeta fuera del árbol: lo que contiene recuerda de dónde vino, y Put Back lo
devuelve ahí.
- `ContextMenu.vue` (un clic derecho, Mayús+F10 o el botón «⋯») actúa sobre la selección, o sobre
la carpeta abierta: Rename en el sitio, Duplicate, Add to Favorites, Move to Trash, Empty Trash.
- La ventana llena el escenario cuando la amplías, y el panel de información se abre junto a los
archivos. En un teléfono la barra lateral es un cajón; un toque abre una carpeta y una pulsación
larga agarra un archivo.

Más información: [Multi-drag y selección](https://zizigy.github.io/docs/guides/multi-drag) ·
[Soltar dentro de un ítem ordenable](https://zizigy.github.io/docs/guides/drag-and-drop#drop-into-a-sortable-item) ·
[`DragPreview`](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[Cambios de datos: `animateChanges`](https://zizigy.github.io/docs/guides/animations#data-changes-animatechanges) ·
[Accesibilidad](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
