---
title: "Listas ordenables"
description: "Listas, barras de pestañas y cuadrículas que se reordenan mientras arrastras — makeSortableList renderiza un borrador, makeSortableItem crea las filas y el drop escribe el nuevo orden en tu ref. Asas, línea de inserción, intercambios."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/sortable-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="25rem" hint="Arrastra una capa por su asa: el panel se mueve ya, el lienzo al soltar" name="layers-panel">



</example>

## Una lista y sus filas

Una lista ordenable necesita dos componentes: la lista y su fila.

```vue [LayersPanel.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

const layers = defineModel<Layer[]>({ required: true });
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: layers });
</script>

<template>
  <ul ref="list">
    <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
  </ul>
</template>
```

```vue [LayerRow.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ layer: Layer }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.layer });
</script>

<template>
  <li ref="el">{{ layer.name }}</li>
</template>
```

La fila se registra en la lista dentro de la que se renderiza. Un componente puede crear varias
listas (dos columnas, una lista dentro de otra): cada fila se une a aquella cuyo elemento la
contiene, la más interior en listas anidadas.

## El borrador

`makeSortableList` devuelve `items`, un **borrador** de tu array. Mientras arrastras, el borrador
se reordena en vivo: la fila arrastrada ocupa su nuevo hueco y las demás se apartan. Tu array no
cambia hasta el drop. Entonces la biblioteca escribe en él el nuevo orden.

El panel de capas de arriba muestra las dos cosas: el panel renderiza `items` y se mueve mientras
arrastras; el lienzo lee `layers`, el propio array, y solo se reapila cuando sueltas.

- Renderiza `items`, no tu array. Si renderizas tu array, nada se mueve hasta el drop.
- La escritura ocurre después del `onDrop` de la lista. En `onDrop`, tu array todavía tiene el
orden anterior y `e.result` el nuevo.
- `layers` es una ref normal (aquí un `defineModel`, y la escritura emite `update:modelValue`),
así que el resto de tu app ve el cambio como cualquier otro.

```ts
makeSortableList(list, {
  items: layers,
  onDrop: (e) => {
    console.log(e.from.index, '→', e.to.index, e.result.get(e.to.list));
  },
});
```

<tip>

¿Un store, estado del servidor o datos inmutables? Pasa un getter o un `computed` en lugar de una
ref. La biblioteca no escribe en una fuente de solo lectura: llama a `e.preventDefault()` y aplica
`e.result` tú mismo. Consulta [listas controladas](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

</tip>

## Claves

Las filas se identifican por sus datos, nunca por índice ni por un id automático. Por defecto la
clave es `item.id`, o el propio ítem para strings y números.

```ts
// LayersPanel.vue: your items have another key
makeSortableList(list, { items: layers, getKey: (layer) => layer.uuid });

// LayerRow.vue: `item` is keyed with the list's getKey…
makeSortableItem(el, { item: () => props.layer });
// …or pass the key yourself
makeSortableItem(el, { id: () => props.layer.uuid });
```

- Usa la misma clave en `v-for`: `:key="layer.uuid"`. Con `:key="index"` se animan las filas
equivocadas y su estado salta de una fila a otra.
- Las claves deben ser únicas entre todas las listas que intercambian ítems.
- Pasa `item` e `id` como getters, para que una fila siga sincronizada cuando cambian sus props.

## Asas

Por defecto toda la fila inicia un arrastre, salvo los botones, inputs y demás controles que
contiene: el ojo y el candado de una capa siguen siendo botones normales. Pasa `handle` para
arrastrar solo desde una parte:

```vue [LayerRow.vue]
<script setup lang="ts">
makeSortableItem(el, { item: () => props.layer, handle: '.grip' });
</script>

<template>
  <li ref="el">
    <button type="button" class="grip" :aria-label="`Move ${layer.name}`">⠿</button>
    {{ layer.name }}
  </li>
</template>
```

- `handle` es un selector dentro del ítem, o una ref de elemento.
- Un arrastre con ratón empieza desde el asa de inmediato, sin los 4 px habituales. Una
pulsación que no se mueve sigue siendo un clic: el asa puede abrir un menú en `click`.
- El asa recibe los atributos del arrastre (`role`, `tabindex`, `aria-*`), y los arrastres con
teclado empiezan desde ella.

Haz que el asa sea un `<button type="button">` con un `aria-label`: puede recibir el foco tal
cual, y los lectores de pantalla anuncian su etiqueta. Un `<span>` sin más con un icono también
funciona (la biblioteca le da `tabindex="0"` y `role="button"`), pero no tiene un nombre con
sentido.

<note>

Los arrastres táctiles empiezan tras una pulsación larga de 200 ms, para que la página pueda
seguir desplazándose. Para arrastrar al instante desde un asa, dale al asa `touch-action: none` y
al ítem `activation: { touch: { distance: 4 } }`.

</note>

## Estrategias

`strategy` indica cómo está dispuesta la lista, para que las filas hagan sitio de la forma
correcta:

<table>
<thead>
  <tr>
    <th>
      <code>
        strategy
      </code>
    </th>
    
    <th>
      Para
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'vertical'
      </code>
      
       (por defecto)
    </td>
    
    <td>
      Una columna de filas.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'horizontal'
      </code>
    </td>
    
    <td>
      Una sola fila: pestañas, chips, una línea de tiempo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'grid'
      </code>
    </td>
    
    <td>
      Cuadrículas CSS y filas flex que saltan de línea, también con ítems de distintos tamaños.
    </td>
  </tr>
</tbody>
</table>

Una fila de pestañas es una lista horizontal:

<example height="23rem" hint="Arrastra las pestañas; cierra una o abre una nueva" name="browser-tabs">



</example>

```ts [Browser.vue]
const { items } = makeSortableList(strip, {
  items: tabs,
  strategy: 'horizontal',
  axis: 'x',        // the tabs stay on their row
  animate: true,    // the buttons open and close tabs: slide the others then too
});
```

El botón de cerrar de la pestaña sigue funcionando dentro de la pestaña arrastrable, y un clic que
termina un arrastre no selecciona ninguna pestaña. Las filas se deslizan solas mientras
arrastras; `animate` añade lo mismo para los cambios que no hizo ningún arrastre, aquí los
botones (consulta [animaciones](https://zizigy.github.io/docs/guides/animations)).

Una cuadrícula ordena en dos dimensiones, con mosaicos de cualquier tamaño:

<example height="31rem" hint="Arrastra una foto, también la grande" name="photo-grid">



</example>

```ts [PhotoGrid.vue]
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });
```

```css
.grid { display: grid; grid-template-columns: repeat(4, 76px); grid-auto-rows: 76px; grid-auto-flow: dense; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
```

`grid-auto-flow: dense` mantiene la cuadrícula compacta cuando se mueve un mosaico grande. Sin él,
la cuadrícula deja huecos donde un mosaico ya no cabe y crece una fila.

## Bloquear el eje

```ts
makeSortableList(list, { items: layers, axis: 'y' });
```

`axis: 'y'` mantiene el arrastre en el eje vertical, `'x'` en el horizontal: las capas y las
pestañas de arriba lo usan. El `axis` propio de un ítem gana al de su lista. Para mantener además
el arrastre dentro de la lista, añade el modificador `restrictToParent`. Más en
[restricciones](https://zizigy.github.io/docs/guides/constraints).

## Dar estilo al hueco

La fila arrastrada se queda en la lista como el hueco donde aterrizará, y recibe
`data-dnd-placeholder`. El estilo por defecto la atenúa al 40 %, con especificidad cero, así que
cualquier regla tuya gana:

```css [LayerRow.vue]
.layer[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.layer[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}
```

`makeSortableItem` devuelve el mismo estado como refs, y algunos más:

<table>
<thead>
  <tr>
    <th>
      Devuelve
    </th>
    
    <th>
      Qué es
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isPlaceholder
      </code>
    </td>
    
    <td>
      Esta fila es el hueco donde aterrizará un ítem arrastrado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      Esta fila se está arrastrando (cada fila arrastrada, en un multi-drag).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      Su índice en el borrador: cambia mientras arrastras.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Modificable, ligado a la selección del provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        indicator
      </code>
    </td>
    
    <td>
      En <a href="#an-insertion-line">
        modo indicador
      </a>
      
      , dónde va la línea.
    </td>
  </tr>
</tbody>
</table>

La lista devuelve `isOver` e `isAccepting` para su propio resaltado, y `activeKey` y
`activeIndex`, el ítem arrastrado y su lugar en el borrador de esta lista. Todos los estados, con
demos en vivo, están en [estilos](https://zizigy.github.io/docs/guides/styling).

## Desactivar cosas

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Qué impide
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       en un ítem
    </td>
    
    <td>
      Este ítem no se puede arrastrar. Los demás siguen pasando por delante de él: bloquea una capa arriba y luego arrastra otra por encima.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       en la lista
    </td>
    
    <td>
      Ningún arrastre sale de ella, ningún drop entra.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sort: false
      </code>
      
       en la lista
    </td>
    
    <td>
      Sus ítems no se pueden reordenar dentro, pero sí pueden salir: una paleta, consulta <a href="/docs/guides/shared-lists#what-goes-in-and-out-pull-and-put">
        listas que comparten ítems
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Todas aceptan un getter o una ref, y se aplican al siguiente arrastre:

```ts [LayerRow.vue]
makeSortableItem(el, { item: () => props.layer, handle: '.grip', disabled: () => props.layer.locked });
```

Una fila que debe quedarse primera o última, hagan lo que hagan las demás, no es un ítem:
renderízala fuera de la lista. La capa Background del panel está debajo del `<ul>`.

## Mostrar solo algunos ítems

Un cuadro de búsqueda, una etiqueta: `filter` muestra los ítems para los que devuelve `true`, y un
arrastre ordena entre esos. Los demás se quedan en tu array, en su sitio:

<example height="27rem" hint="Elige una etiqueta o busca, y arrastra una tarea: el array mantiene las ocultas en su sitio" name="filtered-list">



</example>

```ts [Backlog.vue]
const query = ref('');
const tag = ref<Tag | null>(null);

const { items } = makeSortableList(list, {
  items: tasks,
  filter: (task) => (!tag.value || task.tag === tag.value) && task.title.includes(query.value),
});
```

- `items` contiene los ítems que coinciden: renderízalo como siempre. El filtro es reactivo:
escribir en el cuadro de búsqueda actualiza la lista al momento.
- El drop escribe el array entero. Cada ítem oculto se queda justo después del ítem visible al que
seguía; si ese es el que se movió, se queda después del más cercano anterior a él que no se
movió.
- `e.to.index` y el `activeIndex` de la lista cuentan los ítems visibles. `e.result` contiene el
array entero, con los ítems ocultos.

<note>

Un `computed` que filtra tu array y se pasa como `items` también funciona, pero es de solo
lectura: tendrías que aplicar `e.result` tú mismo y calcular dónde van los ítems ocultos.
`filter` hace las dos cosas.

</note>

## Una línea de inserción

Con `placeholder: 'indicator'`, la lista se queda quieta mientras arrastras, y una línea muestra
adónde va el drop. La línea la dibujas tú:

<example height="27rem" hint="Arrastra una incidencia: una línea muestra adónde va" name="issue-table">



</example>

```ts [IssueTable.vue]
const { items, indicator } = makeSortableList(body, { items: issues, placeholder: 'indicator' });
```

```vue [IssueRow.vue]
<script setup lang="ts">
const { indicator } = makeSortableItem(el, { item: () => props.issue });
</script>

<template>
  <div ref="el" class="row" :class="indicator && `drop-${indicator.side}`">…</div>
</template>

<style scoped>
.row.drop-before::before { content: ''; position: absolute; top: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
.row.drop-after::before { content: ''; position: absolute; bottom: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Campo de <code>
        indicator
      </code>
    </th>
    
    <th>
      Qué contiene
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        list
      </code>
    </td>
    
    <td>
      La lista en la que cae el drop.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      El índice de inserción en la lista tal como se renderiza.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        key
      </code>
    </td>
    
    <td>
      El ítem al que va unida la línea; <code>
        null
      </code>
      
       en una lista vacía (dibújala entonces en la lista).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        side
      </code>
    </td>
    
    <td>
      <code>
        'before'
      </code>
      
       o <code>
        'after'
      </code>
      
       de ese ítem; <code>
        'swap'
      </code>
      
       en una lista que <a href="#swap-instead-of-shift">
        intercambia
      </a>
      
      . Los árboles añaden <code>
        'inside'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
      
      , <code>
        parentKey
      </code>
    </td>
    
    <td>
      Solo árboles: dónde cae el drop. Consulta <a href="/docs/guides/trees#an-insertion-line">
        árboles
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

- El `indicator` de la lista tiene valor mientras la línea está en esa lista (la tabla lo
muestra), y el de un ítem mientras la línea está unida a ese ítem.
- La fila arrastrada se queda donde estaba, marcada como placeholder: atenúala.
- El teclado también mueve la línea.
- Un drop fuera de cualquier destino cancela en este modo (`dropOutside: 'cancel'`), ya que la
lista nunca mostró otro orden.
- El overlay tapa parte de la fila que tiene debajo. Hazlo un poco transparente y la línea se verá
a través: `[data-dnd-overlay] .row { opacity: 0.85 }`.

## Intercambiar en vez de desplazar

Con `behavior: 'swap'`, el ítem arrastrado cambia el sitio con el que tiene debajo, y los demás
no se mueven:

<example height="29rem" hint="Intercambia a dos personas, también entre columnas; prueba On drop" name="on-call">



</example>

```ts [Rotation.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'rotation',
  behavior: 'swap',
  placeholder: () => props.placeholder,   // 'item' (live) or 'indicator' (on drop)
  onDrop: (e) => {
    if (e.partner) emit('swap', `${e.items[0]?.name} ⇄ ${e.partner.item.name}`);
  },
});
```

- **En vivo** (`placeholder: 'item'`, por defecto): el intercambio se ve mientras arrastras.
Volver atrás, o salir de la lista, lo deshace.
- **Al soltar** (`placeholder: 'indicator'`): nada se mueve hasta el drop. El indicador marca el
ítem con el que el drop hace el intercambio, `side: 'swap'`: resalta el contorno de ese ítem en
lugar de dibujar una línea. Las flechas mueven la marca de ítem en ítem; de vuelta sobre el ítem
arrastrado, no hay ninguna.

```vue [PersonCell.vue]
<li ref="el" :class="{ target: indicator?.side === 'swap' }">…</li>
```

El evento de drop tiene `mode: 'swap'` y `partner`, el ítem con el que se intercambió: su `key`,
su `item` y sus propios `from` y `to`. Dos listas de un mismo grupo intercambian entre sí cuando
ambas tienen `behavior: 'swap'`, como hacen las dos columnas. El ítem que está debajo pasa
entonces a la otra lista, así que debe poder salir (`group.pull`) y entrar (`group.put`):
consulta [listas que comparten ítems](https://zizigy.github.io/docs/guides/shared-lists). Un multi-drag ordena en lugar
de intercambiar.

## Teclado

Pon el foco en una fila, o en su asa, y pulsa <kbd value="Space">



</kbd>

 o <kbd value="Enter">



</kbd>

 para
agarrarla. Las flechas a lo largo de la lista la mueven un hueco, en las cuadrículas arriba y
abajo pasan a la fila siguiente, y las flechas transversales a la lista la mueven a la siguiente
lista de su grupo. Pasado el final de una lista, la flecha sigue hacia la siguiente lista en esa
dirección (listas apiladas una encima de otra) o, si no la hay, hacia un destino de drop que esté
ahí, una papelera. Pulsa <kbd value="Space">



</kbd>

 o <kbd value="Enter">



</kbd>

 otra vez para soltarla, y
<kbd value="Escape">



</kbd>

 para devolverla a su sitio. Todas las demos de esta página funcionan así. Los
textos para lectores de pantalla están en [accesibilidad](https://zizigy.github.io/docs/guides/accessibility).

## Animaciones

Las filas se deslizan a sus nuevos sitios mientras arrastras, y la fila soltada aterriza en su
hueco. La propia lista crece o se encoge hasta su nuevo tamaño cuando entran y salen filas
(`animateSize`). Está activado por defecto y no necesita código. No envuelvas las filas en
`<TransitionGroup>`: los movimientos se animarían dos veces. Tampoco pongas una `transition` CSS
en el `transform` de las filas. Para los cambios que no hizo ningún arrastre (añadir, quitar,
barajar), activa la opción `animate` de la lista, como hacen las pestañas. Consulta
[animaciones](https://zizigy.github.io/docs/guides/animations).

La lista completa de opciones está en la API de [makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list)
y [makeSortableItem](https://zizigy.github.io/docs/api/make-sortable-item).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
