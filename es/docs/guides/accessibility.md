---
title: "Accesibilidad"
description: "Los arrastres con teclado, los anuncios para lectores de pantalla y los atributos ARIA vienen integrados. Aquí está qué hacen, cómo redactarlos en cualquier idioma y cómo ofrecer movimientos sin arrastrar."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Todo lo de esta página está activado por defecto. Llega con Tab a un punto de la agenda, pulsa
<kbd value="Space">



</kbd>

, muévelo con las flechas y vuelve a pulsar <kbd value="Space">



</kbd>

, o
<kbd value="Escape">



</kbd>

 para devolverlo a su sitio. El panel muestra lo que se le dice a un lector de
pantalla, en el idioma que elijas.

<example height="28.5rem" hint="Llega a un ítem con Tab: Space, flechas, Space. Cambia el idioma" name="a11y-announcer">



</example>

Lo que suele quedar de tu parte: textos legibles para los ítems, y botones que los muevan para
quien no puede arrastrar en absoluto.

## El teclado

<table>
<thead>
  <tr>
    <th>
      Tecla
    </th>
    
    <th>
      Acción
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Agarrar el ítem con el foco; soltarlo.
    </td>
  </tr>
  
  <tr>
    <td>
      Flechas
    </td>
    
    <td>
      Moverlo: de hueco en hueco en las listas, por filas y profundidad en los árboles, <code>
        keyboard.step
      </code>
      
       píxeles en los arrastres libres.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Cancelar el arrastre — también los de puntero.
    </td>
  </tr>
</tbody>
</table>

- En una lista, una flecha hacia otra lista del mismo grupo mueve el ítem allí.
- En un arrastre libre, <kbd value="Shift">



</kbd>

 agranda los pasos.
`makeDraggable(el, { keyboardMode: 'droppables' })` hace en cambio que las flechas salten entre los
destinos que aceptan el ítem.
- Un arrastre con teclado empieza desde el elemento arrastrable con el foco, o desde su asa —
nunca desde un botón o un campo que contenga, que así conservan sus propias teclas.
- Los arrastres con teclado desplazan el ítem hasta hacerlo visible en lugar de usar el
desplazamiento automático en los bordes.
- Tras el drop, el foco vuelve al ítem, incluso cuando su fila se volvió a renderizar en otra
lista.

### Otras teclas

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

Las asignaciones coinciden con `event.code` (`'Space'`, `'KeyD'`) o con `event.key` (`'Enter'`).
`step` son los píxeles por pulsación de flecha en los arrastres libres (25 por defecto).
`:keyboard="false"` desactiva los arrastres con teclado, y <kbd value="Escape">



</kbd>

 sigue cancelando
cualquier arrastre. Cuando cambies las teclas, cambia también `screen-reader-instructions`.

## Atributos ARIA

Pon el foco en cada acceso directo, o desactiva los atributos, y observa lo que pone la
biblioteca. Arrastra uno para ver cómo `aria-pressed` aparece y desaparece en el botón.

<example height="27rem" hint="Recorre los accesos directos con Tab; activa y desactiva los atributos" name="a11y-attributes">



</example>

Cada elemento arrastrable e ítem ordenable recibe estos atributos, **salvo que los pongas tú**:

<table>
<thead>
  <tr>
    <th>
      Atributo
    </th>
    
    <th>
      Valor
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
      , cuando el elemento no puede recibir ya el foco (un <code>
        <div>
      </code>
      
      ; no un <code>
        <a href>
      </code>
      
       ni un <code>
        <button>
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        role
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
      , salvo en un <code>
        <button>
      </code>
      
      , que ya lo es.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-roledescription
      </code>
    </td>
    
    <td>
      <code>
        draggable
      </code>
      
      , o <code>
        sortable
      </code>
      
       en los ítems ordenables.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      Las instrucciones del provider, añadidas junto a los ids que ya hay (el de un tooltip se conserva).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       o <code>
        false
      </code>
      
      : si el ítem está desactivado (también por un área de arrastre desactivada).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       mientras se arrastra, en los elementos con el rol <code>
        button
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`attributes: false` en un ítem quita en vivo lo que había puesto la biblioteca. El panel vuelve a
leer los atributos: `aria-describedby` apunta a las instrucciones del provider, que un lector de
pantalla lee después del nombre del ítem.

### Enlaces y botones que se arrastran

`aria-roledescription` sustituye el nombre del rol: un lector de pantalla dice «Inbox, sortable»
en lugar de «Inbox, button». Para un elemento cuyo rol importa, pon el tuyo; la biblioteca no lo
toca:

```vue [Shortcut.vue]
<script setup lang="ts">
makeSortableItem(el, {
  item: () => props.shortcut,
  // Enter follows the link: only Space picks it up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});
</script>

<template>
  <a ref="el" :href="shortcut.href" role="link" aria-roledescription="draggable link">
    {{ shortcut.title }}
  </a>
</template>
```

- Un enlace sigue funcionando: un clic lo abre, pero el clic que termina un arrastre nunca le
llega. <kbd value="Enter">



</kbd>

 iniciaría un arrastre, así que `canDrag` lo rechaza y el navegador
sigue el enlace.
- Un `<button>` también conserva su clic, y la biblioteca no añade ni `role` ni `tabindex`.
- Los botones, enlaces y campos **dentro** de un ítem no inician arrastres de puntero, así que una
fila puede tener sus propias acciones.

### Asas: hazlas botones de verdad

```vue [Track.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ track: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track, handle: '.grip' });
</script>

<template>
  <li ref="el" class="track">
    {{ track.title }}
    <button type="button" class="grip" :aria-label="`Drag ${track.title}`">⠿</button>
  </li>
</template>
```

Con un `handle`, los atributos van en el asa, y los arrastres con teclado empiezan desde ella (el
acceso directo **Archive** de arriba). Un `<button>` puede recibir el foco y ya es un botón, así
que no necesita `tabindex` ni `role`. Dale un `aria-label`: un icono de asa no tiene nombre propio,
y «Drag Midnight Drive» dice más que «button».

<tip>

El asa conserva el foco durante todo el arrastre con teclado, mientras su fila hace de hueco.
Vacía el hueco con `opacity: 0` en lugar de `visibility: hidden` o `display: none` en el asa: un
elemento oculto pierde el foco. La biblioteca lo devuelve tras el drop, pero un lector de
pantalla puede decir «body» entretanto.

</tip>

## Anuncios

Una región viva en el provider anuncia cada agarre, movimiento, drop y cancelación. Las listas
ordenables dicen dónde está el ítem: *«Picked up item t2 at position 2 of 5 in list playlist.»*
Los movimientos se anuncian cuando el arrastre lleva 500 ms quieto, así que un arrastre rápido de
puntero no se lee hueco a hueco. El panel de la demo registra cada texto que recibe el provider,
incluidos los movimientos por los que pasa un arrastre de puntero en su camino.

Los textos integrados están en inglés, y nombran las cosas por sus ids a menos que les des un
`label`. Los ítems, las listas, los árboles y los destinos de drop aceptan uno:

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*"Picked up Blue in Green at position 2 of 5 in Playlist."* Los labels también llegan a tus
propios textos y monitores: `active.label`, `over.label`, cada uno de `active.items`, y en el
contexto `position.label` y `partner.label`.

Para otro idioma, u otras palabras, escribe tú los textos, como hace la agenda. Cada texto recibe
el evento y un `context`: la `position` que diría el texto integrado (`list`, `index` desde 0,
`length`, el `label` de la lista), y `count`, `copy` y el `partner` de un intercambio.

```ts [index.vue]
const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

const announcements = computed<Partial<Announcements>>(() => {
  const t = LANGUAGES[lang.value]!;
  return {
    onDragStart: ({ active }, { position }) => position && t.start(titleOf(active.id), position.index + 1, position.length),
    onDragOver: ({ active }, { position }) => position && t.move(titleOf(active.id), position.index + 1, position.length),
    onDragEnd: ({ active }, { position }) => position && t.drop(titleOf(active.id), position.index + 1, position.length),
    onDragCancel: ({ active }, { position }) => position && t.cancel(titleOf(active.id), position.index + 1),
    onDragResume: ({ active }) => t.resume(titleOf(active.id)),
  };
});
```

```vue [index.vue]
<DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
```

<table>
<thead>
  <tr>
    <th>
      <code>
        context
      </code>
    </th>
    
    <th>
      Al empezar
    </th>
    
    <th>
      Durante el movimiento
    </th>
    
    <th>
      Al terminar
    </th>
    
    <th>
      Al cancelar
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Dónde se agarró
    </td>
    
    <td>
      Dónde aterrizaría; ninguna fuera de las listas
    </td>
    
    <td>
      Dónde aterrizó
    </td>
    
    <td>
      Adónde volvió
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        partner
      </code>
    </td>
    
    <td>
      
    </td>
    
    <td>
      Un intercambio: el ítem intercambiado y dónde está ahora
    </td>
    
    <td>
      Lo mismo, tras el drop
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      , <code>
        copy
      </code>
    </td>
    
    <td>
      Cuántos ítems, y si el arrastre copia
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Evento
    </th>
    
    <th>
      Se anuncia cuando
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        onDragStart
      </code>
    </td>
    
    <td>
      Se agarra el ítem.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      El ítem pasa a otro sitio (un hueco de una lista, otro destino), cuando el arrastre lleva 500 ms quieto.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      Se suelta. El nuevo orden ya está escrito.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Se cancela el arrastre, o se rechaza el drop: el ítem volvió.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragResume
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       respondió <code>
        'continue'
      </code>
      
      : el arrastre continúa (consulta <a href="/docs/guides/drop-decisions">
        decidir un drop
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

- Un texto sustituye al anuncio del evento; `undefined` mantiene el de por defecto; `''` no dice
nada. Los eventos que omitas conservan sus valores por defecto, como las posiciones de las
listas ordenables.
- `screenReaderInstructions` es el texto al que apunta cada elemento arrastrable con
`aria-describedby`. Las dos props son reactivas: la demo cambia de idioma en vivo.
- `:announcements="false"` silencia la región, por ejemplo cuando anuncias a través de la tuya.

<note>

Para otro idioma, da los cinco textos y las instrucciones: cada uno que omitas se anuncia en
inglés, incluidas las posiciones ordenables. Pon también el `lang` de la página, para que el
lector de pantalla elija la voz correcta.

</note>

## Mover sin arrastrar

Algunas personas no pueden arrastrar en absoluto. El criterio WCAG 2.5.7 pide una forma de mover
los ítems con clics simples. Usa las flechas y la marca de cada fila: mueven los libros sin
arrastre, y el foco se queda donde estás.

<example height="27.5rem" hint="Usa los botones de flecha con el teclado, o arrastra un asa" name="a11y-move-buttons">



</example>

Un botón cambia los datos; la lista dibuja el movimiento. Con `animateChanges` en la lista, las filas se
deslizan como en un arrastre (y se quedan quietas para quien pide movimiento reducido):

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animateChanges: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};
```

```vue [ReadingList.vue]
<p class="status" role="status">{{ message }}</p>
```

### Conservar el foco

Mover un elemento en el DOM le quita el foco, así que el botón que se acaba de pulsar lo pierde.
Devuélveselo una vez que la fila se ha movido:

```ts [BookRow.vue]
const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Back on the same button, or on the other one when this one is now disabled.
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};
```

Una fila que desaparece (la marca señala un libro como leído) se lleva el foco con ella: muévelo a
la fila siguiente, o a la última. Los arrastres no necesitan nada de esto: la biblioteca devuelve
ella misma el foco al ítem soltado, incluso cuando se vuelve a renderizar en otra lista.

<tip>

`@vue-dnd-kit/actions` convierte en cambio cada botón en un arrastre con teclado de verdad:
`moveItem(id, { index })` se anuncia, pasa por `onBeforeDrop` y `onDrop`, se anima y mantiene el
foco en el ítem. Consulta [arrastres programáticos](https://zizigy.github.io/docs/guides/sensors#programmatic-drags).

</tip>

## Táctil

Los arrastres táctiles empiezan tras una pulsación larga de 200 ms. Moverse más de 5 px antes
desplaza la página en su lugar, así que las listas siguen siendo desplazables. Ajusta ambas cosas
con la `activation` del provider, y dibuja un anillo de pulsación larga a partir de
`useDnD().activation.progress`: consulta [el provider](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag).
Un arrastre táctil vibra brevemente al empezar; `:haptics="false"` lo desactiva.

## Movimiento reducido

Con `prefers-reduced-motion: reduce`, las animaciones propias de la biblioteca no se ejecutan: los
ítems saltan a su sitio al ordenar, el overlay no vuela al soltar y los cambios de `animateChanges`
aparecen de golpe. Tus propias funciones de animación siguen ejecutándose, con
`reducedMotion: true`, así que decides tú: saltarlas o mantener un fundido corto. Consulta
[animaciones](https://zizigy.github.io/docs/guides/animations).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
