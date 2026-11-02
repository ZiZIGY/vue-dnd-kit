---
title: "Constructor de páginas"
description: "Una landing page montada con arrastrar y soltar — secciones desde una paleta que se convierten en lo real sobre la página, elementos movidos entre columnas, un árbol de capas sobre los mismos datos, edición en línea, anchos de dispositivo y deshacer."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/examples/page-builder"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="45rem" hint="Arrastra una sección o un elemento a la página; haz doble clic en un texto para editarlo" name="page-builder" title="Constructor de páginas">



</example>

Amplía el marco a pantalla completa: la paleta se fija a la izquierda, las capas a la derecha, y la
página ocupa el espacio entre ambas. Más estrecho, comparten un cajón que se abre desde la barra
superior.

## Qué observar

- **Canvas.vue**: la página es una lista ordenable de secciones con `placeholder: 'indicator'`.
Se queda quieta mientras viaja una sección, y una línea entre dos secciones dice adónde va:
apartar secciones de 500 px en cada hueco haría temblar toda la página. `dropzone` le pasa el
drop a todo el lienzo, así que una sección soltada al lado o debajo de la página aterriza igual.
- **ColumnList.vue**: cada columna de cada sección es una lista del grupo `blocks`. Los elementos
se mueven entre columnas y secciones y se ordenan en vivo: la página muestra el resultado
mientras arrastras. Cada columna es un componente propio, y las columnas son listas dentro de
los ítems de otra lista.
- **Palette.vue**: las plantillas de sección son una lista del grupo de la página con
`pull: 'clone'`, `put: false` y `sort: false`: reparte copias y no acepta nada de vuelta. Los
elementos de debajo (**ElementChip.vue**) son elementos arrastrables simples, y una columna
crea el bloque con `createItem`.
- **Layers.vue**: la misma página como árbol ordenable, sobre los mismos datos. Una fila movida
ahí se mueve en la página, y al revés.
- **builder.ts**: la página, la selección, el dispositivo y el historial. Los drops escriben la
página a través de las listas; los botones de la barra de herramientas y los atajos la cambian
aquí. Cada cambio es un paso de deshacer.

## Una sección en la mano es la sección real

**SectionGhost.vue** es el overlay tanto de las secciones de la página como de las plantillas de
la paleta. Sobre la página (`to.list` es la lista de la página), renderiza la propia sección, al
ancho de la página, reducida bajo el puntero. Cuando se decide el drop (`status: 'dropping'`),
vuelve a escala 1 mientras la caja vuela al sitio de la sección: aterriza exactamente sobre ella. El
drop espera a esa transición, así que nada salta al final.

```vue [SectionGhost.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; status: DnDStatus; to: DropDestination | null }>();
const section = computed(() => props.items[0]!.item as Section);
const fromPalette = computed(() => !find(section.value.id));
const onPage = computed(() => props.to?.list === PAGE);

const look = computed(() => {
  if (fromPalette.value && !onPage.value) return 'card'; // still the palette's card
  return props.status === 'dropping' ? 'landing' : 'ghost';
});
</script>

<template>
  <DragPreview v-if="look === 'card'" :id="items[0]!.id" :style="{ width: '100%', height: '100%' }" />
  <div v-else class="replica" :class="look" :style="{ width: `${pageWidth}px`, '--shrink': shrink }">
    <SectionView :section="section" />
  </div>
</template>

<style scoped>
.replica { transform-origin: 0 0; scale: var(--shrink); transition: scale 0.25s ease; }
.replica.landing { scale: 1; }
</style>
```

Lejos de la página, una plantilla sigue siendo lo que era en la paleta: `DragPreview` muestra la
copia de su tarjeta que hace la biblioteca. El sitio de la sección en la página es el hueco:
mientras arrastras espera ahí, atenuado; al soltarla, su nuevo sitio se queda vacío hasta que el
overlay ha aterrizado en él.

```css [PageSection.vue]
.page-section[data-dnd-placeholder] { opacity: 0; }
html[data-dnd-dragging] .page-section[data-dnd-placeholder] { opacity: 0.35; }
```

Cada sección dibuja la línea a partir de su propio `indicator`, y dice lo que hace el drop: *Move
Features here*, o *Add Pricing here* para una plantilla.

## Elementos: con los colores de la sección a la que van

Los bloques se arrastran desde todo su cuerpo; una sección, por el asa de su etiqueta, porque su
cuerpo es contenido en el que hacer clic y arrastrar. **BlockGhost.vue**, el overlay de los
bloques y los chips, lee en `to` la columna en la que entraría y toma los colores de su sección:
un botón sobre el pie de página oscuro se vuelve claro antes de que sueltes. La caja tiene el tamaño
del hueco del bloque ahí (`overlayFit: 'slot'`, el valor por defecto), y el bloque se maqueta en
ella como lo hará después del drop.

```ts [BlockGhost.vue]
// The column it would go into (`to.list` is the column's id): its section's tone.
const look = computed(() => {
  const at = props.to && find(String(props.to.list));
  return at ? { ...TONES[SECTIONS[at.section.kind].tone], ...typeScale(pageWidth.value) } : null;
});
```

Un chip de la paleta es un elemento arrastrable simple que lleva su tipo. Cada columna crea un
bloque a partir de él, y el bloque nuevo se coloca en la columna, renderizado por la plantilla
propia de la columna, hasta que sueltas o sigues adelante:

```ts [ColumnList.vue]
makeSortableList(list, {
  id: props.column.id,
  items: blocks,
  group: 'blocks',
  overlay: BlockGhost,
  createItem: (active) => {
    const kind = (active.data as ChipData | undefined)?.kind;
    return kind ? createBlock(BLOCKS[kind].spec) : undefined;
  },
});
```

`blocks` es un `computed` modificable sobre `props.column.blocks` en lugar de un `toRef`: deshacer
pone objetos nuevos en la página, y la columna tiene que seguirlos.

## Plantillas: salen copias, no entra nada

```ts [Palette.vue]
makeSortableList(list, {
  id: 'templates',
  items: templates,
  group: { name: 'sections', pull: 'clone', put: false },
  sort: false,
  clone: (template) => createSection(template.kind), // new ids all the way down
  overlay: SectionGhost,
});
```

Las plantillas son secciones reales, así que sus tarjetas las muestran (reducidas) y el overlay
puede renderizarlas. Un clic en una tarjeta, o <kbd value="Enter">



</kbd>

, añade la sección después de la
seleccionada: la página se puede construir sin arrastrar nada.

## Capas: la misma página como árbol

```ts [Layers.vue]
makeSortableTree(tree, {
  id: LAYERS,
  items: sections as Ref<LayerNode[]>,
  // Keys of their own: the canvas's lists already drag these ids.
  getKey: (node) => `layer-${node.id}`,
  getChildren: (node) => (isSection(node) ? node.columns : isColumn(node) ? node.blocks : undefined),
  setChildren: (node, children) => { … },
  // Blocks go into columns, nothing into blocks, sections stay at the top.
  canNest: (node, parent) => levelOf(node) === levelOf(parent) + 1,
  maxDepth: 2,
  placeholder: 'indicator',
  // A tree takes any row at its top level: a block let go there flies back.
  onBeforeDrop: (event) => (event.to.parentKey !== null || event.items.every(isSection) ? 'accept' : 'reject'),
});
```

Las claves las comparte todo el provider, así que las filas reciben claves propias. Las columnas
también son filas, `disabled`: aceptan bloques y se quedan donde están. Donde un bloque no puede
ir, entre dos secciones, su línea se pone roja. Pasar por encima de una fila resalta su nodo en la
página; seleccionar un nodo en la página abre su sección aquí y desplaza su fila hasta que se ve.

## Editar en el sitio, y el teclado

Un bloque se arrastra desde cualquier punto, así que sus textos no son editables hasta que haces
doble clic en él: entonces son `contenteditable`, y `canDrag` rechaza los arrastres para que una
pulsación coloque el cursor. **EditableText.vue** escribe el DOM desde el modelo solo mientras el
texto no se está editando, así que el cursor nunca salta, y deshacer se sigue viendo.

El provider reserva <kbd value="Space">



</kbd>

 para los arrastres y deja <kbd value="Enter">



</kbd>

 al editor:

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'], drop: ['Space', 'Enter'], cancel: ['Escape'] } }"
  :announcements="announcements"
  :screen-reader-instructions="instructions"
>
```

Llega a un bloque con Tab: <kbd value="Space">



</kbd>

 lo agarra y las flechas lo mueven por su columna y
hacia las siguientes; <kbd value="Enter">



</kbd>

 lo edita. Una sección se mueve por su asa de la misma
forma, o con las flechas de su barra de herramientas. <kbd value="Ctrl">



</kbd>

 <kbd value="Z">



</kbd>

 deshace,
<kbd value="Delete">



</kbd>

 borra, <kbd value="Ctrl">



</kbd>

 <kbd value="D">



</kbd>

 duplica. Los lectores de pantalla
oyen "the Hero section, position 3 of 7 on the page" en lugar de ids.

## Deshacer, y cambios sin arrastre

Cada drop es un paso del historial: un monitor guarda la página una vez que las listas la han
escrito.

```ts [Builder.vue]
useDnDMonitor({ onDragEnd: () => builder.commit() });
```

Deshacer vuelve a poner una instantánea. Las listas tienen `animate` activado, así que lo que movió
la instantánea se desliza hasta ahí, igual que las secciones que la barra de herramientas sube y
baja; las secciones añadidas aparecen con un fundido y las borradas desaparecen con otro.

Más información: [Listas ordenables](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line) ·
[Listas que comparten ítems](https://zizigy.github.io/docs/guides/shared-lists) · [Árboles](https://zizigy.github.io/docs/guides/trees) ·
[El overlay](https://zizigy.github.io/docs/guides/overlay) · [Animaciones](https://zizigy.github.io/docs/guides/animations) ·
[Accesibilidad](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
