---
title: "Estilos"
description: "Cada estado de un arrastre, con estilo — atributos data para CSS simple, refs para clases, destinos que dicen sí o no, el overlay y la página mientras arrastras, los estilos por defecto, Tailwind y kits de UI."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/styling"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

La biblioteca casi no da estilo a nada. Cada estado de un arrastre te llega de dos formas: como un
atributo `data-dnd-*`, para CSS simple, y como una ref que devuelve el composable, para clases y
marcado condicional. Usa la que encaje con tu stack, o ambas.

## Los atributos data

Las filas de abajo no tienen ninguna clase de estado: cada aspecto sale de un atributo. El panel
muestra los atributos de la página a medida que aparecen y desaparecen. Selecciona dos filas con
<kbd value="Ctrl">



</kbd>

 o <kbd value="Meta">



</kbd>

 y arrástralas: también aparecen los demás de un
multi-drag.

<example height="25rem" hint="Arrastra una fila; luego haz Ctrl/⌘-clic en dos y arrástralas" name="dnd-attributes">



</example>

<table>
<thead>
  <tr>
    <th>
      Atributo
    </th>
    
    <th>
      En
    </th>
    
    <th>
      Cuándo
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        data-dnd-placeholder
      </code>
    </td>
    
    <td>
      un ítem ordenable
    </td>
    
    <td>
      Es el hueco donde aterrizará un ítem arrastrado. <code>
        "into"
      </code>
      
       mientras el arrastre está sobre un <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        destino de drop dentro de un ítem
      </a>
      
      : el drop va ahí, y el hueco solo guarda su sitio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging
      </code>
    </td>
    
    <td>
      un ítem ordenable
    </td>
    
    <td>
      Se está arrastrando pero se queda en su sitio: los demás ítems de un multi-drag en modo <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging="pointer"
      </code>
      
       o <code>
        "keyboard"
      </code>
    </td>
    
    <td>
      <code>
        <html>
      </code>
    </td>
    
    <td>
      Durante todo el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay="dragging"
      </code>
      
       o <code>
        "dropping"
      </code>
    </td>
    
    <td>
      la caja del overlay
    </td>
    
    <td>
      Siempre. <code>
        dropping
      </code>
      
       mientras aterriza, y mientras espera un <code>
        onBeforeDrop
      </code>
      
       asíncrono.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay-content
      </code>
    </td>
    
    <td>
      el contenido del overlay
    </td>
    
    <td>
      Siempre: el elemento que llena la caja y contiene lo que muestra. Animarlo te toca a ti; recibe el <code>
        overlayClass
      </code>
      
       del provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-leaving
      </code>
    </td>
    
    <td>
      una copia dejada por <code>
        animateChanges
      </code>
    </td>
    
    <td>
      Mientras se desvanece un ítem que se fue.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-no-clone
      </code>
    </td>
    
    <td>
      <strong>
        lo pones tú
      </strong>
    </td>
    
    <td>
      Deja el elemento fuera de la copia del overlay: un tooltip, un menú, una insignia.
    </td>
  </tr>
</tbody>
</table>

```css [TaskRow.vue]
/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
}

/* The copy in the overlay, while it travels. */
[data-dnd-overlay='dragging'] .row {
  box-shadow: 0 0 0 1.5px #42b883, 0 14px 24px -10px rgb(0 0 0 / 0.55);
}
```

```vue [TaskRow.vue]
<li ref="el" class="row" :aria-selected="selected">
  <span class="title">{{ task.title }}</span>
  <button type="button" data-dnd-no-clone @click.stop="task.done = !task.done">✓</button>
</li>
```

- La copia de una fila en el overlay conserva sus clases y atributos, incluido el atributo de
scope de Vue, así que `[data-dnd-overlay] .row` funciona en el propio `<style scoped>` de la
fila. La copia no tiene marcas `data-dnd-*` propias: una copia del hueco no es un hueco.
- La selección no tiene atributo. Refleja la ref `selected` en uno (`aria-selected` arriba), o
usa una clase.
- Los elementos arrastrables simples y los destinos de drop (`makeDraggable`, `makeDroppable`) no
reciben atributos de estado `data-dnd-*`: dales estilo con sus refs.

## Las refs devueltas

Los mismos estados como refs, más los que tienen las listas y los destinos. Cada fila y cada
lista de abajo muestra las refs que son verdaderas en este momento, y sus clases salen de ellas.
Icebox rechaza las tareas urgentes: arrastra una sobre ella.

<example height="24rem" hint="Arrastra una tarea a la otra lista; Ctrl/⌘-clic selecciona varias" name="dnd-refs">



</example>

```vue [RefRow.vue]
<script setup lang="ts">
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }">…</li>
</template>

<style scoped>
.row.selected { box-shadow: 0 0 0 1.5px #3b82f6; }
.row.placeholder { opacity: 1; box-shadow: inset 0 0 0 1.5px #42b883; }   /* beats the default 40% */
.row.placeholder .title { visibility: hidden; }
</style>
```

```vue [RefList.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(el, { items, group });
</script>

<template>
  <section :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">…</section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Composable
    </th>
    
    <th>
      Estado
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isPlaceholder
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        index
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        activeKey
      </code>
      
      , <code>
        activeIndex
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        transform
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        placement
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD()
      </code>
    </td>
    
    <td>
      <code>
        status
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        pointer
      </code>
      
      , <code>
        activation.progress
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
</tbody>
</table>

- `isPlaceholder`: este elemento es el hueco donde aterrizará un ítem arrastrado. En un
multi-drag en modo `'group'`, los huecos de los ítems que viajan con él también son
placeholders.
- `isDragging`: el ítem forma parte del arrastre; cada ítem arrastrado en un multi-drag.
- `isAccepting`: se está arrastrando algo y este destino lo acepta. Resalta los sitios donde es
posible un drop.
- `isOver`: el arrastre está sobre este destino, lo acepte o no. `isOver && !isAccepting` es un
rechazo: muéstralo.
- `indicator`: dónde va la línea del drop en [modo indicador](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line).
- `activation.progress`: de 0 a 1 mientras dura una pulsación larga táctil o un `delay`. Llena un
anillo con él.

## Destinos de drop: sí y no

Un destino tiene cuatro aspectos mientras dura un arrastre: acepta el arrastre, lo acepta y el
puntero está encima, lo rechaza, lo rechaza y el puntero está encima. Muestra los cuatro, y dilo
también en el ítem arrastrado.

<example height="23rem" hint="Arrastra un color sobre las paletas: la correcta lo invita, las demás no" name="drop-highlights">



</example>

```ts [Palette.vue]
const { isOver, isAccepting } = makeDroppable(el, { accept: props.tone, onDrop });

const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
```

```css [Palette.vue]
.palette.accepting { border-style: dashed; border-color: #42b883; }          /* an invitation */
.palette.over { border-color: #42b883; background: color-mix(in srgb, #42b883 14%, Canvas); }
.palette.refusing { opacity: 0.45; }                                          /* out of the way */
.palette.refused { border-color: #f43f5e; animation: shake 0.3s; }            /* a drop here is cancelled */
```

La muestra arrastrada es el slot `#overlay` del provider. Recibe `over` y `accepted`: `accepted`
es `false` sobre un destino que rechaza el arrastre.

```vue [index.vue]
<template #overlay="{ active, over, accepted }">
  <div
    class="lifted"
    :class="{ yes: over && accepted, no: over && !accepted }"
    :style="{ background: (active.data as { color: string }).color }"
  >
    <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
  </div>
</template>
```

Fuera del overlay, `useDnD().over.value?.accepted` dice lo mismo. Más sobre los componentes de
overlay en [el overlay](https://zizigy.github.io/docs/guides/overlay).

## El overlay y la página

Dos atributos cubren el resto de un arrastre: `data-dnd-overlay` en la caja del overlay, y
`data-dnd-dragging` en `<html>`, `"pointer"` o `"keyboard"`. La barra que hay encima de las notas
lee el segundo y dice qué teclas funcionan. Activa el guardado lento: el overlay se queda en
`dropping` donde soltaste, hasta que se resuelve `onBeforeDrop`, y lo muestra.

<example height="27rem" hint="Arrastra una nota con el ratón y luego con el teclado; activa el guardado lento" name="overlay-theme">



</example>

```css [index.vue]
.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle { display: none; }

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard { display: inline; }
```

```css [StickyNote.vue]
[data-dnd-overlay='dragging'] .note {
  box-shadow: 0 0 0 2px #42b883, 0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save. */
[data-dnd-overlay='dropping'] .note { opacity: 0.85; }
[data-dnd-overlay='dropping'] .saving { display: flex; }
```

- `dropping` cubre el aterrizaje y la espera de un `onBeforeDrop` asíncrono. Mientras espera,
`<html>` sale del modo de arrastre: vuelven el cursor y la selección de texto de la página, así
que un diálogo de confirmación funciona como siempre.
- Da estilo a lo que hay **dentro** de la caja. La biblioteca mueve la propia caja con
`transform` y le da tamaño con `width` y `height`. Su elemento de contenido,
`[data-dnd-overlay-content]`, la llena y es tuyo: levanta e inclina ahí el overlay entero
(consulta [animaciones](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)).
- La raíz de la copia tiene `transform: none` en línea: gírala o agrándala con `rotate` y
`scale`. En ella funcionan tanto las transiciones como los keyframes: consulta
[animaciones](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).
- La copia muestra el elemento tal como es y no adivina ningún fondo. Una fila que pinta la lista
(un `<li>` en un `<ul>` blanco, una fila de tabla) necesita uno:
`[data-dnd-overlay] .row { background: Canvas; }`.
- La copia va dentro de un `<div>` que lleva las propiedades personalizadas que el elemento
heredaba (colores del tema, `--tw-*`), así que siguen aplicándose en el overlay, y las reglas
propias de la copia (`in-data-[dnd-overlay]:ring-2`) siguen ganándoles. Selecciona la copia por
su clase, no por su profundidad dentro de la caja.

## Estilos por defecto

El provider inyecta unas pocas reglas, una vez por documento. Van envueltas en `:where()`, así que
su especificidad es cero y cualquier regla tuya gana:

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
:where(html[data-dnd-dragging]), :where(html[data-dnd-dragging] *) {
  user-select: none !important;
  overflow-anchor: none !important;
}
:where(html[data-dnd-dragging='pointer']), :where(html[data-dnd-dragging='pointer'] *) {
  cursor: var(--dnd-cursor, grabbing) !important;
  -webkit-touch-callout: none !important;
}
```

<table>
<thead>
  <tr>
    <th>
      Regla
    </th>
    
    <th>
      Por qué
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      El hueco al 40 %
    </td>
    
    <td>
      Para que una lista se vea bien sin nada de CSS. Todas las demos de arriba la sobrescriben.
    </td>
  </tr>
  
  <tr>
    <td>
      Los ítems que se quedan atrás al 40 %
    </td>
    
    <td>
      Lo mismo, para un multi-drag en modo <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Sin <code>
        user-select
      </code>
    </td>
    
    <td>
      Un arrastre no selecciona el texto por el que pasa.
    </td>
  </tr>
  
  <tr>
    <td>
      Sin <code>
        overflow-anchor
      </code>
    </td>
    
    <td>
      La página no se desplaza para mantener a la vista una fila en movimiento.
    </td>
  </tr>
  
  <tr>
    <td>
      El cursor del arrastre
    </td>
    
    <td>
      Durante un arrastre de puntero, en todas partes. <code>
        grabbing
      </code>
      
      , a menos que el elemento agarrado tenga un cursor propio: el <code>
        ns-resize
      </code>
      
       de un asa de redimensionar, un <code>
        move
      </code>
      
       o una imagen conservan el suyo durante todo el arrastre (<code>
        grab
      </code>
      
      , <code>
        pointer
      </code>
      
       y similares se siguen convirtiendo en <code>
        grabbing
      </code>
      
      ). <code>
        cursor: grab
      </code>
      
       en los ítems arrastrables lo añades tú. Pon <code>
        --dnd-cursor
      </code>
      
       en <code>
        <html>
      </code>
      
       para otro cursor por defecto.
    </td>
  </tr>
  
  <tr>
    <td>
      Sin menú contextual táctil
    </td>
    
    <td>
      iOS no abre el menú de enlaces bajo una pulsación larga.
    </td>
  </tr>
</tbody>
</table>

`:default-styles="false"` en el provider las omite. La biblioteca sigue marcando `<html>`, y sigue
borrando la selección cuando empieza un arrastre e impidiendo nuevas hasta que termina: solo desaparece el CSS. Las
reglas se inyectan una vez, el primer provider que las quiere, y se quedan: desactívalas en todos
los providers de la página.

```vue
<DnDProvider :default-styles="false">
```

## Tailwind CSS

Los atributos funcionan como variantes: `data-[…]` para el propio elemento, una variante
arbitraria para un ancestro.

```vue [TaskRow.vue]
<li
  ref="el"
  class="rounded-lg bg-white shadow-sm
         data-[dnd-placeholder]:bg-transparent data-[dnd-placeholder]:opacity-100
         data-[dnd-placeholder]:outline-dashed
         [[data-dnd-overlay=dragging]_&]:shadow-xl"
  :class="{ 'ring-2 ring-emerald-500': selected }"
>
```

```vue [Hint.vue]
<p class="hidden [html[data-dnd-dragging=keyboard]_&]:block">Arrows move · Space drops</p>
```

<note>

Los estilos de la biblioteca (las opacidades del 40 %) están en una cascade layer propia,
`vue-dnd-kit`, declarada antes que ninguna otra. Las utilidades de Tailwind v4 y los kits de UI
construidos sobre él también viven en layers, que van después, así que ganan sin `!`. El CSS sin
layer gana de todos modos.

</note>

En Tailwind v4, `in-data-[dnd-overlay=dragging]:shadow-xl` es una forma más corta de escribir la
variante de ancestro.

<warning>

En el CSS scoped de Vue, `:global()` se lleva el selector entero: `:global(html[data-dnd-dragging]) .hint`
se compila como `html[data-dnd-dragging]` a secas, y oculta la página. Escribe el ancestro sin él,
`html[data-dnd-dragging] .hint`: Vue solo aplica el scope a la última parte.

</warning>

## Kits de UI

- Los composables aceptan tanto un componente como un elemento: `useTemplateRef` sobre una
tarjeta o un ítem de lista de un kit funciona, y la biblioteca lee su elemento raíz.
- Pasa el estado a las props propias del kit cuando las tenga (`:active="selected"`,
`:color="isOver ? 'primary' : undefined"`), y el resto como clases.
- Los ítems de lista de un kit a menudo no tienen fondo propio: lo pinta la lista. Su copia en el
overlay es entonces transparente. Dale uno:```css
[data-dnd-overlay] .v-list-item { background: rgb(var(--v-theme-surface)); }
```
- La copia deja fuera los ripples de pulsación de Vuetify, Quasar, PrimeVue y Naive UI. Marca
cualquier otra cosa que no deba viajar, un tooltip o un botón de menú, con
`data-dnd-no-clone`.

## Qué no hacer

- No pongas una `transition` CSS en el `transform` o el `translate` de los ítems ordenables: la
biblioteca los anima ella misma, y cancela esas transiciones mientras mide.
- No envuelvas los ítems ordenables en `<TransitionGroup>`: los movimientos se animarían dos
veces. Usa el `animateChanges` de la lista.
- No animes `height`, `margin` ni `padding` de las filas de una
[lista virtual](/docs/guides/virtual-lists).
- Eso sí, detén bajo `prefers-reduced-motion: reduce` las transiciones que añadas alrededor de
los arrastres. La biblioteca ya detiene las suyas.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
