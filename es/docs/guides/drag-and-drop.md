---
title: "Arrastrar y soltar"
description: "Arrastre libre con makeDraggable y destinos de drop con makeDroppable — destinos con tipo que aceptan unos arrastres y rechazan otros, un plano de planta, zonas de papelera, carpetas dentro de una lista e ítems sueltos que una lista acoge."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/drag-and-drop"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Usa `makeDraggable` y `makeDroppable` para todo lo que no sea una lista ordenable: residuos en
contenedores, muebles en un plano, archivos en carpetas, una papelera, un tablero de ajedrez.

<example height="29rem" hint="Clasifica los residuos en los contenedores; ninguno acepta la pila" name="recycling">



</example>

## Un elemento arrastrable

```vue [WasteItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ waste: { id: string; name: string; type: string } }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,      // read back as `active.id`
  type: () => props.waste.type,  // matched by the targets' `accept`
  data: () => props.waste,       // anything: `active.data`
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">{{ waste.name }}</div>
</template>
```

Pasa el id de tus datos como getter. El id por defecto viene de `useId()` y es nuevo en cada
instancia del componente, así que no significa nada para el resto de tu app. Las opciones se
leen cuando hacen falta, así que un getter o una ref las mantiene al día.

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Qué hace
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      Quién se arrastra, qué lleva y con qué se compara el <code>
        accept
      </code>
      
       de los destinos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Un selector o un elemento interior: solo él inicia un arrastre. Consulta las <a href="/docs/guides/sortable-lists#handles">
        asas
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      No empieza ningún arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlay
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (por defecto): una copia sigue al puntero. Un componente: tu propia vista previa. <code>
        false
      </code>
      
      : el elemento se mueve por sí mismo (<a href="#without-an-overlay">
        más abajo
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
    
    <td>
      Bloquear el arrastre en <code>
        'x'
      </code>
      
       o <code>
        'y'
      </code>
      
      , ajustarlo a una cuadrícula, mantenerlo dentro de unos límites: consulta las <a href="/docs/guides/constraints">
        restricciones
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardMode
      </code>
    </td>
    
    <td>
      Cómo lo mueven las flechas: por píxeles (por defecto) o de destino en destino (<a href="#keyboard">
        más abajo
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
      
      , <code>
        canDrag
      </code>
    </td>
    
    <td>
      Cuándo una pulsación se convierte en arrastre: consulta los <a href="/docs/guides/sensors">
        sensores
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        attributes
      </code>
    </td>
    
    <td>
      <code>
        role
      </code>
      
      , <code>
        tabindex
      </code>
      
       y <code>
        aria-*
      </code>
      
       para el teclado y los lectores de pantalla (<code>
        true
      </code>
      
       por defecto).
    </td>
  </tr>
</tbody>
</table>

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
        isDragging
      </code>
    </td>
    
    <td>
      Este elemento se está arrastrando.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Modificable, ligado a la <a href="/docs/guides/multi-drag">
        selección
      </a>
      
       del provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      El desplazamiento del arrastre, para <code>
        overlay: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
    </td>
    
    <td>
      El id en uso.
    </td>
  </tr>
</tbody>
</table>

Los botones, los inputs y los demás hijos interactivos no inician un arrastre de puntero, así que
siguen funcionando dentro de un elemento arrastrable. Todas las opciones están en la
[API de makeDraggable](https://zizigy.github.io/docs/api/make-draggable).

## Un destino de drop

```vue [Bin.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[] }>();
const emit = defineEmits<{ drop: [id: Key] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,   // 'glass', ['paper', 'cardboard'], a function…
  onDrop: (event) => emit('drop', event.active.id),
});
</script>

<template>
  <section ref="el" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" />
  </section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Devuelve
    </th>
    
    <th>
      <code>
        true
      </code>
      
       cuando
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isOver
      </code>
    </td>
    
    <td>
      El arrastre está sobre este destino, lo acepte o no.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAccepting
      </code>
    </td>
    
    <td>
      Se está arrastrando algo y este destino lo acepta: resalta los destinos válidos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placement
      </code>
    </td>
    
    <td>
      No es un booleano: <code>
        { top, right, bottom, left }
      </code>
      
      , las mitades del destino en las que está el puntero, o <code>
        null
      </code>
      
       cuando no está encima. Úsalo para «antes / después de esta tarjeta».
    </td>
  </tr>
</tbody>
</table>

`isOver` sin `isAccepting` significa que el arrastre está sobre un destino que lo rechaza.
Muéstralo, como hacen los contenedores de arriba: un drop ahí se cancela y el ítem vuelve a su
sitio. Los contenedores que no pueden aceptar el ítem se atenúan mientras viaja; más ideas en
[estilos](https://zizigy.github.io/docs/guides/styling#drop-targets-yes-and-no).

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Qué hace
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      Se leen como <code>
        over.id
      </code>
      
       y <code>
        over.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
    
    <td>
      Qué arrastres acepta (<a href="#which-drags-a-target-takes">
        siguiente sección
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      No acepta nada y los arrastres pasan por encima.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        priority
      </code>
    </td>
    
    <td>
      Gana el mayor cuando los destinos se solapan sin estar anidados (0 por defecto).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
    </td>
    
    <td>
      El arrastre entró o salió.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , <code>
        onDrop
      </code>
    </td>
    
    <td>
      Decidir el drop y luego aplicarlo (<a href="#the-drop">
        más abajo
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Qué arrastres acepta un destino

El `type` de un elemento arrastrable se compara con el `accept` de un destino:

<table>
<thead>
  <tr>
    <th>
      <code>
        accept
      </code>
    </th>
    
    <th>
      Acepta
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      omitido o <code>
        '*'
      </code>
    </td>
    
    <td>
      Todo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'glass'
      </code>
    </td>
    
    <td>
      Los elementos arrastrables de tipo <code>
        glass
      </code>
      
       y los que no tienen tipo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ['paper', 'cardboard']
      </code>
    </td>
    
    <td>
      Cualquiera de los dos tipos y los que no tienen tipo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ({ active, items, types }) => boolean
      </code>
    </td>
    
    <td>
      Lo que diga tu función.
    </td>
  </tr>
</tbody>
</table>

Un elemento arrastrable sin `type` cumple cualquier regla de tipo string. `type` también puede ser
un array (`['paper', 'large']`): basta con que coincida un tipo. Una función decide según
cualquier aspecto del arrastre. El contenedor de compost de arriba lee los datos de los ítems, no
su tipo:

```ts [waste.ts]
{
  id: 'compost',
  accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
}
```

`accept` se lee en vivo, mientras el arrastre busca su destino: pasa una ref para cambiarlo.

Cuando se arrastran varios ítems a la vez, `acceptMode` indica cuántos deben encajar: `'all'`
(por defecto) o `'some'`. Con `'some'`, devuelve desde `onBeforeDrop` los ids que quieres
conservar, y los demás vuelven a su sitio. Consulta [decidir un drop](https://zizigy.github.io/docs/guides/drop-decisions).

## El drop

El `onDrop` de un destino de drop simple es donde **tú** cambias tus datos. La biblioteca no mueve
nada por su cuenta:

```vue [index.vue]
<script setup lang="ts">
/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
</template>
```

<table>
<thead>
  <tr>
    <th>
      Campo del evento
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
        active
      </code>
    </td>
    
    <td>
      El arrastre: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
       (cada uno <code>
        { id, data, type, item }
      </code>
      
      ), <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Este destino: <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        accepted
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
      
      , <code>
        delta
      </code>
    </td>
    
    <td>
      Dónde está el puntero y cuánto se ha movido desde el inicio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Dónde queda la caja arrastrada dentro de este destino (<a href="#leave-it-where-it-was-dropped">
        siguiente sección
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        source
      </code>
    </td>
    
    <td>
      Presente cuando los ítems vienen de una lista ordenable: <code>
        { list, remove() }
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`active.ids` contiene todos los ids arrastrados, empezando por el que se agarró. El orden es
`onBeforeDrop` (decidir), `onDrop` (aplicar) y luego el `drag-end` del provider. Para escuchar
todos los arrastres de la página en un solo sitio, usa `useDnDMonitor` (consulta
[el provider](https://zizigy.github.io/docs/guides/provider)). Para preguntar antes de un drop, mantener el arrastre o
aceptar solo algunos ítems, consulta [decidir un drop](https://zizigy.github.io/docs/guides/drop-decisions).

## Dejarlo donde se soltó

Un plano de planta, un lienzo, un tablero: el ítem se queda donde lo sueltas. Cada evento lleva
`position`, el `left` / `top` que coloca un ítem con posición absoluta donde se soltó.

<example height="28rem" hint="Arrastra muebles a la habitación, muévelos o devuélvelos a su sitio" name="room-planner">



</example>

```ts [Planner.vue]
const room = useTemplateRef<HTMLElement>('room');
makeDroppable(room, {
  id: 'room',
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    // Clamped, so a piece let go half outside stays inside the walls.
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});
```

```vue [Piece.vue]
<div ref="el" class="piece" :style="{ left: `${piece.x}px`, top: `${piece.y}px` }">…</div>
```

`position` es la esquina superior izquierda de la caja arrastrada dentro de `over`, medida desde
el borde de su padding, con su scroll sumado: el borde de la habitación, sus paredes, no cuenta.
Es `null` cuando no hay nada debajo.

<tip>

No calcules el sitio a partir de `active.rect` y `delta`: así se pierden el borde y el scroll del
destino. Las cuadrículas, los límites y el bloqueo de eje para este tipo de tableros están en
[restricciones](https://zizigy.github.io/docs/guides/constraints).

</tip>

## Sin overlay

Por defecto, una copia del elemento sigue al puntero y el elemento se queda en su sitio: así
funcionan los muebles del almacén. Con `overlay: false` no hay copia, y el elemento se mueve por
sí mismo con el `transform` que devuelve el arrastre: los muebles de la habitación.

```ts [Piece.vue]
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),   // a value or a ref, read when the drag starts
});

const style = computed(() => ({
  left: `${props.piece.x}px`,
  top: `${props.piece.y}px`,
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
```

- `position` es entonces la esquina del propio elemento, así que el manejador del drop no cambia.
- El elemento está bajo el puntero mientras se mueve; al buscar el destino, la biblioteca mira a
través de él. Ponlo por encima de sus vecinos mientras se arrastra (`z-index`).
- Se desplaza con la página, el overlay no: `transform` descuenta lo que su contenedor se ha
movido desde que empezó el arrastre, así que sigue bajo el puntero cuando la página se desplaza.
- Se mueve dentro de su propio contenedor: un padre con `overflow: hidden` lo recorta, y su
contexto de apilamiento decide por encima de qué pasa. El overlay no tiene ninguno de los dos
problemas.

Para una vista previa propia en lugar de la copia, consulta [el overlay](https://zizigy.github.io/docs/guides/overlay).

## Zonas de papelera

Un arrastre que empieza en una lista ordenable lleva `e.source`. Llama a `remove()` y la lista
quita los ítems:

<example height="34rem" hint="Arrastra una notificación a Done o Delete y luego deshaz" name="triage">



</example>

```ts [Triage.vue]
const triage = (bin: 'done' | 'deleted') => (e: DnDEvent) => {
  bins[bin].push(...e.active.items.map((entry) => entry.item as Notice));
  e.source?.remove();
};

makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });
```

- `e.active.items[i].item` es el propio ítem de la lista. Guárdalo, y un deshacer lo devuelve a
donde estaba.
- El `onDrop` propio de la lista se ejecuta entonces con `to.index === -1`, y `e.result` contiene
la lista sin los ítems.
- El overlay se encoge dentro de la zona, ya que el ítem no se muestra en ningún sitio.
- Una lista también puede quitar lo que se suelta fuera de todo: consulta
[`dropOutside`](https://zizigy.github.io/docs/guides/shared-lists#dropping-outside).

<note>

Con el teclado, las flechas mueven un ítem de una lista entre los huecos de su lista y las listas
de su grupo; más allá del final de las listas, la siguiente pulsación lo lleva al destino de drop en esa
dirección, aquí la papelera, y la flecha contraria lo devuelve. Un botón, un menú o la tecla `Delete` siguen siendo más
rápidos para mucha gente: ofrece uno también.

</note>

## Soltar dentro de un ítem ordenable

Una fila de una lista ordenable también puede ser un destino de drop: una carpeta que acepta
marcadores, un grupo que acepta tareas. Pon un droppable en el elemento del ítem:

<example height="28rem" hint="Suelta un enlace en el centro de una carpeta; cerca de sus bordes, ordena. Abre una carpeta para sacar enlaces arrastrándolos" name="bookmarks">



</example>

```ts [FolderRow.vue]
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link)); // Bookmarks adds them
    e.source?.remove();   // take them out of the list they came from
  },
});
```

Una carpeta abierta muestra sus enlaces como una lista del mismo grupo, que solo acepta enlaces:
ahí se ordenan, y se pueden arrastrar de vuelta afuera, al nivel superior o a otra carpeta.

Donde la lista ordenaría el arrastre, un destino así solo cuenta en el **centro** de su ítem (del
25 al 75 % a lo largo del eje de la lista). Ahí el drop va dentro del ítem y la lista no se
mueve. Cerca de los bordes, la lista ordena como siempre.

- Un destino cuyo `accept` rechaza el arrastre se ignora: la lista ordena sobre el ítem como sobre
cualquier otro. Las carpetas solo aceptan enlaces, así que una carpeta arrastrada se ordena
pasando de largo por las demás.
- Un destino nunca recibe su propio arrastre.
- Con el teclado, una flecha se detiene primero en la carpeta; la siguiente pulsación en la misma
dirección pasa de largo.
- El ítem deja de mostrarse tras el drop, así que el overlay se encoge dentro de la carpeta en
lugar de volver a su sitio.
- Sobre la carpeta, la lista mantiene el hueco de la fila arrastrada donde estaba, así que nada
se mueve bajo el puntero. El hueco recibe entonces `data-dnd-placeholder="into"`: el drop no va
ahí, así que ocúltalo si quieres (`[data-dnd-placeholder='into'] { opacity: 0 }`).

El [gestor de archivos](https://zizigy.github.io/docs/examples/file-manager) hace lo mismo en una cuadrícula, con carpetas
anidadas.

## Elementos arrastrables simples en una lista

Una lista ordenable acoge ítems arrastrados con `makeDraggable` cuando sabe crear un ítem a partir
de ellos:

<example height="26rem" hint="Arrastra un bloque a la agenda; las horas siguen al arrastre" name="day-planner">



</example>

```ts [Agenda.vue]
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});
```

Mientras el elemento arrastrable está sobre la lista, el ítem creado está en el borrador y tu
plantilla lo renderiza como cualquier otra fila: las horas de la agenda ya lo cuentan. Se vuelve
real al soltar (`mode: 'insert'`, `from.list === null`), y el overlay aterriza sobre él.

- Devuelve `undefined` para rechazar. Las listas sin `createItem` ignoran los elementos
arrastrables simples.
- Dale al nuevo ítem una clave propia: el bloque se queda en la paleta.
- Con el teclado, una flecha hacia la lista mete el elemento arrastrable en ella, a su altura, y
las siguientes flechas lo mueven de hueco en hueco.

## Archivos desde el equipo

Los archivos arrastrados desde el escritorio o un gestor de archivos no son arrastres de la
biblioteca: los lleva el navegador. Un destino de drop los acepta con `external`, y el drop los
trae en `e.external`:

<example height="22rem" hint="Arrastra imágenes o PDF desde tu equipo a las zonas" name="file-drop">



</example>

```ts [AvatarDrop.vue]
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});
```

- `files` se lee como `<input accept>`: tipos MIME (`image/*`, `application/pdf`) y extensiones
(`.md`). `true` acepta cualquier archivo, una función decide archivo por archivo. `links` y
`text` aceptan lo que arrastran otras apps y pestañas, `types` cualquier otro tipo MIME.
- El arrastre funciona como un arrastre del provider: `isOver`, `isAccepting`, los eventos y los
anuncios funcionan como con cualquier otro. Los destinos sin `external` lo ignoran. No hay
overlay: el navegador dibuja la imagen arrastrada.
- Mientras los archivos se mantienen sobre la página, el navegador solo dice sus tipos
(`e.external.fileTypes`). Sus nombres, tamaños y contenidos llegan con el drop, y es entonces
cuando se comprueban las extensiones. Las carpetas se descartan; con `multiple: false`, un
arrastre de varios archivos se rechaza.

Las listas también aceptan archivos, enlaces y texto, y les hacen sitio mientras se mantienen.
Los ítems también pueden salir de la página, a otra app o a otra ventana tuya: consulta
[archivos y otras apps](https://zizigy.github.io/docs/guides/native).

<tip>

Quien usa el teclado o un lector de pantalla no puede arrastrar archivos. Ofrece un
`<input type="file">` junto a la zona, como hace la demo con Browse.

</tip>

## Teclado

Un elemento arrastrable con el foco se agarra con <kbd value="Space">



</kbd>

 o <kbd value="Enter">



</kbd>

, se
suelta con las mismas teclas y <kbd value="Escape">



</kbd>

 cancela. Entre medias, las flechas lo mueven:

<table>
<thead>
  <tr>
    <th>
      <code>
        keyboardMode
      </code>
    </th>
    
    <th>
      Una flecha
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'pixels'
      </code>
      
       (por defecto)
    </td>
    
    <td>
      Lo mueve 25 px, el <code>
        keyboard.step
      </code>
      
       del provider. Con <kbd value="Shift">
        
      </kbd>
      
      , cuatro veces más lejos. Así se mueven los muebles.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'droppables'
      </code>
    </td>
    
    <td>
      Salta al destino más cercano en esa dirección que lo acepte. Los residuos saltan de contenedor en contenedor y se saltan los que los rechazan.
    </td>
  </tr>
</tbody>
</table>

```ts
makeDraggable(el, { id: () => props.waste.id, type: () => props.waste.type, keyboardMode: 'droppables' });
```

Las teclas se pueden reasignar en el provider. Más en [accesibilidad](https://zizigy.github.io/docs/guides/accessibility).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
