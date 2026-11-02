---
title: "Listas que comparten ítems"
description: "Las listas de un mismo grupo mueven, copian e intercambian ítems — toda la columna acepta drops, pull y put deciden qué entra y qué sale, las paletas copian y las listas controladas aplican cada drop a un store con historial para deshacer."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/shared-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="31rem" hint="Mueve historias entre las listas; desactiva y vuelve a activar la zona de drop" name="sprint-planning">



</example>

## Un grupo

Las listas con el mismo nombre de `group` intercambian ítems. Por defecto, cada lista es un grupo
por sí sola.

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import StoryCard from './StoryCard.vue';

type Story = { id: string; title: string; points: number };
const props = defineProps<{ column: { id: string; title: string; stories: Story[] } }>();

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,                     // names the list in drop events
  items: toRef(props.column, 'stories'),   // a writable ref into the reactive column
  group: 'planning',                       // same name: stories move between these lists
});
</script>

<template>
  <section :class="{ over: isOver }">
    <h3>{{ column.title }}</h3>
    <ul ref="list">
      <StoryCard v-for="story in items" :key="story.id" :story="story" />
    </ul>
  </section>
</template>
```

```vue [index.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'backlog', title: 'Backlog', stories: [{ id: 's1', title: 'Saved searches', points: 5 }] },
  { id: 'sprint', title: 'Sprint 14', stories: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

- Aquí cada columna es un componente, como suelen serlo las columnas. Un componente también puede
crear varias listas, un Todo y un Done fijos uno al lado del otro: cada tarjeta se une a la
lista cuyo elemento la contiene.
- `toRef(props.column, 'stories')` es modificable porque el padre pasa un objeto reactivo. El drop
escribe ambos arrays, el que dejó la historia y aquel en el que entró, y los puntos de las dos
columnas se actualizan.
- `id` aparece en los eventos de drop como `from.list` y `to.list`, y es la clave de `e.result`,
los nuevos arrays de cada lista que cambia el drop. `id` y `group` se leen una sola vez.
- Las claves deben ser únicas en todo el grupo.

El `onDrop` de una lista se ejecuta para los drops **dentro** de ella. Mover de `backlog` a
`sprint` llama al `onDrop` de la lista `sprint`, y su `e.result` contiene los nuevos arrays de
ambas listas.

## Toda la columna acepta drops: `dropzone`

Una lista corta en una columna alta deja espacio vacío debajo de la última tarjeta. Con
`dropzone`, otro elemento acepta los drops en nombre de la lista: aquí, toda la columna. Una
historia soltada debajo de la última aterriza al final. Las historias se quedan en el `<ul>`;
solo crece la zona que acepta drops. La demo resalta esa zona mientras arrastras: desactívala y
solo la propia lista acepta la historia.

```ts [Column.vue]
const zone = useTemplateRef<HTMLElement>('zone');
const { items } = makeSortableList(list, {
  items: toRef(props.column, 'stories'),
  group: 'planning',
  dropzone: zone,   // or a getter: () => (wholeColumn.value ? zone.value : undefined)
});
```

<tip>

Sin `dropzone`, una lista vacía sigue necesitando un tamaño para aceptar drops: dale un
`min-height`.

</tip>

## Qué entra y qué sale: `pull` y `put`

`group` también acepta un objeto. `pull` indica qué puede salir de una lista, `put` qué puede
entrar:

<example height="36rem" hint="Arrastra archivos entre las listas: cada una dice si los acepta y, si no, por qué" name="group-rules">



</example>

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Valores
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pull
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (por defecto): los ítems pueden salir. <code>
        false
      </code>
      
      : no pueden. <code>
        'clone'
      </code>
      
      : salen copias y los ítems se quedan.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        put
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (por defecto): los ítems pueden entrar. <code>
        false
      </code>
      
      : no entra nada. Una función: decides en cada arrastre.
    </td>
  </tr>
</tbody>
</table>

```ts [index.vue]
// Inbox: gives, takes nothing.
group: { name: 'files', pull: true, put: false }

// Templates: gives copies, takes nothing, keeps its order.
group: { name: 'files', pull: 'clone', put: false }, sort: false

// Images: takes images only.
group: { name: 'files', put: ({ types }) => types.every((type) => type === 'image') }
```

Una función `put` recibe `{ keys, items, types, from, to }`: las claves y los ítems arrastrados,
sus tipos, la lista de la que vienen (`null` para los elementos arrastrables simples) y esta
lista. `types` son las opciones `type` de los ítems arrastrados
(`makeSortableItem(el, { item, type })`); los ítems sin tipo cuentan como el nombre del grupo.
Los movimientos dentro de una lista siempre están permitidos: Inbox sigue ordenando sus propios
archivos.

Sobre una lista que rechaza el arrastre, el hueco vuelve a donde empezó el arrastre, así que las
listas muestran lo que haría un drop: nada. Un drop ahí se cancela y el ítem vuelve a su sitio.
El `isAccepting` de la lista es `false` durante un arrastre así, y `isOver` sigue siendo `true`
sobre ella: así sabe cada lista de la demo qué decir.

El hueco también vuelve a casa sobre un destino de drop propio fuera de las listas, como una
papelera: el drop ahí es del destino, y las listas conservan el ítem a menos que su `onDrop` lo
saque (`event.source.remove()`). Los destinos dentro de las listas (un drop dentro de un ítem) y
alrededor de ellas (un panel que contiene las listas) dejan el hueco donde está.

```ts [RuleList.vue]
const { items, isOver, isAccepting } = makeSortableList(el, { … });
const { active } = useDnD();
const verdict = computed(() => (active.value ? (isAccepting.value ? 'takes' : 'refuses') : null));
```

### Límites

Una lista que guarda tres archivos como máximo, la Shortlist:

```ts [index.vue]
const shortlist = reactive({
  files: [/* … */],
  group: { name: 'files', put: ({ keys }: SortablePutContext) => shortlist.files.length + keys.length <= 3 },
});
```

Lee sus propios ítems cuando un arrastre pregunta. Llénala y rechazará el siguiente archivo, con el
motivo en su cabecera.

Cuando se arrastran varios ítems seleccionados de distintos tipos, `acceptMode` indica si deben
pasar `put` `'all'` (por defecto) o `'some'`. Con `'some'`, los que pasan aterrizan y los demás
vuelven a su sitio. Consulta [multi-drag](https://zizigy.github.io/docs/guides/multi-drag#taking-only-some).

## Copiar: paletas y la tecla Alt

<example height="26rem" hint="Arrastra desde la paleta; arrastrar con Alt copia; suelta fuera del panel Page para quitar" name="palette">



</example>

```ts [Palette.vue]
makeSortableList(list, {
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                           // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

```ts [Sheet.vue]
makeSortableList(list, {
  items: blocks,
  group: 'blocks',
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),  // for Alt-drags
  dropOutside: 'remove',                                      // drag off the Page panel to delete
});
```

- `pull: 'clone'` copia cada arrastre que sale de la lista. El original se queda, y la copia viaja
y aterriza.
- Mantener <kbd value="Alt">



</kbd>

 mientras arrastras también copia, desde cualquier lista con una
función `clone`: es la que hace la copia. Cambia la tecla con el `copyModifier` del provider, o
desactívala con `null`.
- En ambos casos, la lista de la que sale el ítem necesita `clone`. Debe devolver la copia con una
**clave nueva**. Sin `clone`, no se copia nada.
- El evento de drop tiene `mode: 'copy'`, y `e.items` son las copias. Un componente de overlay
también recibe `mode`, para mostrar un «+» al copiar (consulta [el overlay](https://zizigy.github.io/docs/guides/overlay)).

## Intercambiar entre listas

Dos listas de un mismo grupo que tienen ambas `behavior: 'swap'` intercambian ítems entre sí: el
ítem arrastrado ocupa el sitio del que tiene debajo, y este pasa a la lista del arrastrado. Debe
poder salir de su lista (`pull: true`) y entrar en la otra (`put`). La rotación de guardias de
[listas ordenables](https://zizigy.github.io/docs/guides/sortable-lists#swap-instead-of-shift) intercambia entre sus dos
columnas.

## Elementos arrastrables simples

Una lista acoge ítems arrastrados con `makeDraggable` (un chip, una plantilla, un archivo de un
árbol) cuando tiene `createItem`. `group.put` también decide sobre ellos, con `from: null`.
Consulta [elementos arrastrables simples en una lista](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list).

## Soltar fuera

Lo que pasa cuando un arrastre termina sin ningún destino debajo lo decide el `dropOutside` de la
lista:

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      Los ítems
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
      
       (por defecto)
    </td>
    
    <td>
      Aterrizan donde se mostró el hueco por última vez.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Vuelven a su sitio. Es el valor por defecto con <code>
        placeholder: 'indicator'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      Salen de su lista: arrastrar fuera borra. La página de la demo de la paleta lo hace.
    </td>
  </tr>
</tbody>
</table>

`'remove'` pregunta primero al `onBeforeDrop` de la lista. Después se ejecuta el `onDrop` de la
lista con `to.index === -1`, y `e.result` contiene la lista sin los ítems. Una papelera que acepta
drops funciona igual: consulta [zonas de papelera](https://zizigy.github.io/docs/guides/drag-and-drop#trash-zones).

## Listas controladas

Las listas pueden leer un store que no es suyo: Pinia, estado del servidor, datos inmutables.
Pasa `items` como getter (o un `computed`, o una ref de solo lectura): la biblioteca nunca escribe
en él. Llama a `e.preventDefault()` en `onDrop` y aplica `e.result` tú mismo:

<example height="26rem" hint="Mueve invitados entre las mesas y luego deshaz, un movimiento cada vez" name="seating-undo">



</example>

```ts [Table.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  items: () => props.seating.state.tables[props.id]!,   // read-only
  group: 'seating',
  onDrop: (e) => {
    e.preventDefault();                                   // no write
    props.seating.apply(e.result, `${e.items[0]?.name} → ${props.title}`);
  },
});
```

```ts [store.ts]
const apply = (result: ReadonlyMap<Key, Guest[]>, label: string) => {
  const before = [...result.keys()].map((id): [Key, Guest[]] => [id, state.tables[id]!]);
  for (const [id, guests] of result) state.tables[id] = guests;
  state.history.unshift({ label, before });
};

const undo = () => {
  const last = state.history.shift();
  for (const [id, guests] of last?.before ?? []) state.tables[id] = guests;
};
```

- `e.result` asocia cada lista que cambia el drop con su nuevo array: las dos mesas tras un
movimiento, una tras una reordenación. Son arrays nuevos, así que el store puede guardar los
antiguos para deshacer.
- El borrador sigue al store: aplica `result` en `onDrop` (o antes de que se resuelva un
`onBeforeDrop` asíncrono) y el overlay aterriza en el nuevo orden.
- `preventDefault()` omite la escritura en todas las listas de `result`. Si no lo aplicas en
ningún sitio, las listas se quedan como estaban y los ítems vuelven a su sitio.
- Las builds de desarrollo avisan cuando el drop de una lista de solo lectura se deja a la
biblioteca: no cambiaría nada.

Para guardar en un servidor antes de que el drop aterrice, o para preguntar antes al usuario,
consulta [decidir un drop](https://zizigy.github.io/docs/guides/drop-decisions). Todas las opciones de las listas están
en la [API de makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
