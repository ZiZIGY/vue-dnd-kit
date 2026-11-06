---
title: "El provider"
description: "DnDProvider gestiona todos los arrastres que hay debajo. Encuentra el destino, inicia los arrastres, desplaza y cuenta a useDnD y useDnDMonitor todo lo que pasa."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Un provider para la app

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <RouterView />
  </DnDProvider>
</template>
```

Pon un `DnDProvider` arriba del todo, en `App.vue` o en un layout, y olvídate de él. Cada
composable (`makeSortableList`, `makeDraggable`, `useDnD`…) busca el provider más cercano por
encima del componente en el que se ejecuta.

<warning>

Un composable debe ejecutarse en un componente **renderizado dentro** del provider. Llamarlo en
el componente cuya propia plantilla contiene `<DnDProvider>` lanza
`No <DnDProvider> found above this component`: el `inject` de Vue solo ve a los ancestros.

</warning>

## Lo que gestiona

<table>
<thead>
  <tr>
    <th>
      Parte
    </th>
    
    <th>
      Lo que hace el provider
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Entrada
    </td>
    
    <td>
      Convierte la entrada de puntero, táctil y de teclado en arrastres (<code>
        sensors
      </code>
      
      , <code>
        activation
      </code>
      
      ), un arrastre a la vez.
    </td>
  </tr>
  
  <tr>
    <td>
      Encontrar el destino
    </td>
    
    <td>
      Hace la prueba de colisión con los destinos de drop bajo el arrastre (<code>
        collision
      </code>
      
      ) y se lo comunica.
    </td>
  </tr>
  
  <tr>
    <td>
      El overlay
    </td>
    
    <td>
      Renderiza la caja que sigue al puntero, teletransportada a <code>
        body
      </code>
      
      , y la hace aterrizar al soltar.
    </td>
  </tr>
  
  <tr>
    <td>
      La selección
    </td>
    
    <td>
      Un único conjunto de ids seleccionados, compartido por todas las listas y elementos arrastrables que tiene debajo.
    </td>
  </tr>
  
  <tr>
    <td>
      Desplazamiento automático
    </td>
    
    <td>
      Desplaza los contenedores y la ventana cuando un arrastre se acerca a sus bordes.
    </td>
  </tr>
  
  <tr>
    <td>
      La región viva
    </td>
    
    <td>
      Anuncia a los lectores de pantalla los agarres, movimientos, drops y cancelaciones.
    </td>
  </tr>
</tbody>
</table>

No renderiza nada más: tu marcado se queda como está.

## Las opciones de un vistazo

Cada opción tiene un valor por defecto que funciona, así que el provider normalmente no recibe
ninguna. El provider lee sus props en el momento en que las necesita: las demos de abajo cambian
`collision`, `activation` y `autoScroll` en vivo.

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Por defecto
    </th>
    
    <th>
      Qué ajusta
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        collision
      </code>
    </td>
    
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      Cómo se elige el destino bajo el arrastre. <a href="#finding-the-target">
        Más abajo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      ratón 4 px, táctil 200 ms
    </td>
    
    <td>
      Cuándo una pulsación se convierte en arrastre, según el tipo de puntero. <a href="#when-a-press-becomes-a-drag">
        Más abajo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      activado
    </td>
    
    <td>
      Desplazamiento en los bordes: <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       o <code>
        false
      </code>
      
      . <a href="#auto-scroll">
        Más abajo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        haptics
      </code>
    </td>
    
    <td>
      una vibración corta al agarrar con el dedo
    </td>
    
    <td>
      Vibraciones de los arrastres táctiles, o <code>
        false
      </code>
      
      . <a href="#haptics-and-the-copy-key">
        Más abajo
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        copyModifier
      </code>
    </td>
    
    <td>
      <code>
        'Alt'
      </code>
    </td>
    
    <td>
      Tecla que, mantenida durante el arrastre, convierte un movimiento en una copia.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Reglas de movimiento para todos los arrastres: consulta las <a href="/docs/guides/constraints">
        restricciones
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animation
      </code>
      
       / <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      activado
    </td>
    
    <td>
      Los ítems que se deslizan al ordenar / el aterrizaje del overlay: consulta las <a href="/docs/guides/animations">
        animaciones
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      desactivado
    </td>
    
    <td>
      Valor por defecto de listas y árboles: animar los cambios de datos que no hizo ningún arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Space / Enter, Escape
    </td>
    
    <td>
      Teclas y paso del teclado; <code>
        false
      </code>
      
       desactiva los arrastres con teclado. Consulta la <a href="/docs/guides/accessibility#the-keyboard">
        accesibilidad
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sensors
      </code>
    </td>
    
    <td>
      puntero + teclado
    </td>
    
    <td>
      Lo que convierte la entrada en arrastres: consulta los <a href="/docs/guides/sensors">
        sensores
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTo
      </code>
    </td>
    
    <td>
      <code>
        'body'
      </code>
    </td>
    
    <td>
      Adónde se teletransporta el overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayFit
      </code>
    </td>
    
    <td>
      <code>
        'slot'
      </code>
    </td>
    
    <td>
      Tamaño del overlay: el del hueco donde aterrizará, o el del origen. Consulta <a href="/docs/guides/overlay">
        el overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTransition
      </code>
    </td>
    
    <td>
      un fundido cruzado
    </td>
    
    <td>
      Cómo cambia el overlay de un componente a otro durante el arrastre: <code>
        false
      </code>
      
      , o props de <code>
        <Transition>
      </code>
      
      . Consulta <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        los destinos que cambian el overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayClass
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      Clases para el contenido del overlay (<code>
        [data-dnd-overlay-content]
      </code>
      
      ), el elemento que se anima entero: un levantar al agarrar, un asentar al aterrizar. Consulta <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        el overlay: levantar, inclinar, asentar
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayPreviews
      </code>
    </td>
    
    <td>
      <code>
        5
      </code>
    </td>
    
    <td>
      Multi-drag: cuántos ítems arrastrados reciben un clon al agarrar, o <code>
        'all'
      </code>
      
      . Consulta <a href="/docs/guides/multi-drag#the-default-overlay">
        el overlay por defecto
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        announcements
      </code>
    </td>
    
    <td>
      integrados
    </td>
    
    <td>
      Textos para lectores de pantalla, o <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        screenReaderInstructions
      </code>
    </td>
    
    <td>
      integrado
    </td>
    
    <td>
      El texto al que apunta cada elemento arrastrable con <code>
        aria-describedby
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defaultStyles
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      Inyecta CSS de especificidad cero para los estados de arrastre: consulta los <a href="/docs/guides/styling">
        estilos
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

La lista completa, con todas las formas, está en la [API de DnDProvider](https://zizigy.github.io/docs/api/dnd-provider).
El provider también emite `drag-start`, `drag-move`, `drag-over`, `drag-end`, `drag-cancel`,
`drag-resume` y `drag-settle`, los mismos eventos que escucha `useDnDMonitor`.

## Leer el arrastre: `useDnD()`

<example height="27rem" hint="Arrastra una tarea y observa el estado" name="provider-state">



</example>

`useDnD()` devuelve el arrastre como estado reactivo, en cualquier componente bajo el provider:

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      Campo
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
        status
      </code>
    </td>
    
    <td>
      <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
       (una pulsación que espera su activación), <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       (no hay ningún arrastre en curso, pero un overlay todavía aterriza, o decide un <code>
        onBeforeDrop
      </code>
      
       asíncrono), <code>
        'selecting'
      </code>
      
       (un rectángulo de selección).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      Lo que se arrastra: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
       (todos los ids arrastrados, empezando por el que se agarró), <code>
        items
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        sensor
      </code>
      
      . <code>
        null
      </code>
      
       en reposo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      El destino bajo el arrastre: <code>
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
      
       y <code>
        accepted
      </code>
      
      . <code>
        null
      </code>
      
       si no hay nada debajo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      El puntero en coordenadas del viewport, después de los modificadores.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.progress
      </code>
    </td>
    
    <td>
      De <code>
        0
      </code>
      
       a <code>
        1
      </code>
      
       mientras una pulsación espera su activación: dibuja un anillo con él.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      El desplazamiento automático está moviendo algo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      La selección del provider: <code>
        ids
      </code>
      
      , <code>
        has
      </code>
      
      , <code>
        add
      </code>
      
      , <code>
        delete
      </code>
      
      , <code>
        toggle
      </code>
      
      , <code>
        set
      </code>
      
      , <code>
        clear
      </code>
      
      . Consulta <a href="/docs/guides/multi-drag">
        multi-drag
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancela el arrastre en curso (los ítems vuelven a su sitio), una pulsación que está esperando o un rectángulo de selección.
    </td>
  </tr>
</tbody>
</table>

```vue [DropHint.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';

const { status, over } = useDnD();
const refused = computed(() => status.value === 'dragging' && over.value?.accepted === false);
</script>

<template>
  <p v-if="refused" role="status">This list doesn't take that.</p>
</template>
```

En cuanto se decide un drop, `active`, `over` y `pointer` valen `null`, incluso mientras el
overlay sigue aterrizando (`status` vale `'dropping'`). La UI derivada de ellos nunca
muestra el arrastre anterior junto a los datos nuevos. Mientras un `onBeforeDrop` asíncrono
espera, el estado se queda como estaba al soltar.

El siguiente arrastre no espera a ningún aterrizaje: empieza enseguida, y `status` vale
`'dragging'` mientras el último overlay aterriza a su alrededor. Una pulsación sobre un overlay
que está aterrizando lo atrapa en pleno vuelo: el arrastre continúa desde donde está el overlay.
`onDragSettle` avisa cuando el overlay de un arrastre ha llegado a su sitio.

## Escuchar todos los arrastres: `useDnDMonitor()`

```ts
import { useDnDMonitor } from '@vue-dnd-kit/core';

useDnDMonitor({
  onDragStart: ({ active }) => {},
  onDragMove: ({ pointer, delta }) => {},
  onDragOver: ({ over }) => {},                  // the target changed
  onBeforeDrop: (e) => 'accept',                 // or 'reject', 'continue', some ids; may be async
  onDragEnd: ({ active, over, dropped, accepted, position }) => {},
  onDragCancel: ({ active }) => {},
  onDragResume: ({ active }) => {},              // onBeforeDrop answered 'continue'
  onDragSettle: ({ active, over }) => {},        // its overlay has landed
});
```

Un monitor escucha todos los arrastres bajo su provider, empiecen donde empiecen: el panel de
arriba registra los arrastres de la lista sin importarla. Se detiene cuando se desmonta el
componente que lo llamó.

<table>
<thead>
  <tr>
    <th>
      Evento
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
        onDragStart
      </code>
    </td>
    
    <td>
      Empieza un arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      El arrastre se mueve.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      Cambia el destino bajo el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Se suelta el arrastre. Su respuesta decide el drop: consulta <a href="/docs/guides/drop-decisions">
        decidir un drop
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      El drop se completó. Las listas ordenables ya ejecutaron su <code>
        onDrop
      </code>
      
       y escribieron el nuevo orden. <code>
        dropped
      </code>
      
       es <code>
        false
      </code>
      
       cuando terminó sin ningún destino debajo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Escape, un drop sobre un destino que lo rechaza, o un <code>
        onBeforeDrop
      </code>
      
       que respondió <code>
        'reject'
      </code>
      
      .
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
      
      : no se soltó nada y el arrastre continúa.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      El overlay del arrastre ha aterrizado (o ha vuelto a su sitio, o lo atrapó el siguiente arrastre), con el evento que recibió <code>
        onDragEnd
      </code>
      
       u <code>
        onDragCancel
      </code>
      
      . Mientras tanto pueden haber empezado otros arrastres.
    </td>
  </tr>
</tbody>
</table>

Cada evento lleva `active`, `over`, `pointer`, `delta` (el desplazamiento desde el inicio),
`position` (dónde queda la caja arrastrada dentro de `over`, consulta
[arrastrar y soltar](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)) y, para los ítems
de una lista ordenable, `source`. Las formas completas están en la [API de eventos](https://zizigy.github.io/docs/api/events).

<note>

`onDragEnd` es el sitio para el trabajo «después del drop»: guardar, limpiar la selección,
analítica. El `onDrop` propio de una lista se ejecuta **antes** de su escritura, así que todavía
ve el orden anterior.

</note>

## Encontrar el destino

Elige una función y arrastra el pin o la tarjeta sobre los destinos. Las insignias muestran cómo
los clasifica la función en este frame; la verde es el destino.

<example height="33rem" hint="Cambia la función y arrastra sobre los destinos anidados, pequeños y superpuestos" name="collision-lab">



</example>

En cada frame de un arrastre, el provider le da a `collision` los destinos de drop en juego, y
ella devuelve sus ids, el mejor primero. La biblioteca trae cinco funciones:

<table>
<thead>
  <tr>
    <th>
      Función
    </th>
    
    <th>
      Clasifica
    </th>
    
    <th>
      Buena para
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      Lo que está bajo el puntero; si no hay nada, lo que solapa la caja arrastrada.
    </td>
    
    <td>
      El valor por defecto: precisa bajo el puntero, tolerante en los huecos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Solo lo que está bajo el puntero, el más interior primero.
    </td>
    
    <td>
      Destinos precisos: un hueco no suelta en ningún sitio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Cada destino que solapa la caja arrastrada: mayor <code>
        priority
      </code>
      
      , luego anidamiento más profundo, luego mayor solapamiento.
    </td>
    
    <td>
      Ítems grandes sobre destinos pequeños, cuando el puntero está en el borde del ítem.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Cada destino, por la distancia del centro de la caja al suyo.
    </td>
    
    <td>
      Siempre gana algo, incluso lejos: cuadrículas y listas de ítems del mismo tamaño.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Cada destino, por las distancias entre las cuatro esquinas.
    </td>
    
    <td>
      Columnas una al lado de otra (kanban), destinos de alturas muy distintas.
    </td>
  </tr>
</tbody>
</table>

Bajo el puntero, la prueba de colisión respeta lo que ve el usuario: de los destinos superpuestos
solo se acierta el de encima (`front`, nunca `back` donde se solapan), y de los anidados el más
interior va primero (`subfolder`, luego `folder`).

### Una función propia

```ts [magnet.ts]
import type { CollisionDetection, Coordinates, Rect } from '@vue-dnd-kit/core';

/** How far the point is from the rect: 0 inside it. */
const gap = (rect: Rect, point: Coordinates) =>
  Math.hypot(
    Math.max(rect.left - point.x, 0, point.x - rect.right),
    Math.max(rect.top - point.y, 0, point.y - rect.bottom),
  );

/** What is under the pointer; in a gap, the nearest target within 40px. */
export const magnet: CollisionDetection = ({ hits, pointer, candidates }) => {
  if (hits.length) return hits;
  return candidates
    .filter((candidate) => gap(candidate.rect, pointer) <= 40)
    .sort((a, b) => gap(a.rect, pointer) - gap(b.rect, pointer))
    .map((candidate) => candidate.id);
};
```

<table>
<thead>
  <tr>
    <th>
      Argumento
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
        pointer
      </code>
    </td>
    
    <td>
      El puntero, después de los modificadores.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      La caja arrastrada tal como se muestra, <code>
        null
      </code>
      
       sin overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      Cada destino en juego: <code>
        id
      </code>
      
      , <code>
        rect
      </code>
      
       (su parte visible, recortada por los contenedores desplazables), <code>
        priority
      </code>
      
      , <code>
        depth
      </code>
      
       (<code>
        0
      </code>
      
       arriba del todo, mayor cuando está anidado).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      Los destinos bajo el puntero, según la prueba de colisión, el mejor primero.
    </td>
  </tr>
</tbody>
</table>

Devuelve un array vacío para «ningún destino». Los destinos desactivados, los destinos dentro de
los ítems arrastrados y los destinos ocultos por sus contenedores desplazables nunca llegan a la
función. Un destino que rechaza el arrastre sigue compitiendo: sobre él, `over.accepted` es
`false` y el drop se rechaza (un destino dentro de un ítem ordenable se aparta en su lugar, para
que la lista ordene por encima). La demo envuelve la función elegida para registrar su
clasificación: `(args) => (ranked.value = detect(args))`.

<note>

El provider amortigua los cambios que pide la función. Un destino que el arrastre acaba de
abandonar no puede volver a ganar hasta que el puntero se haya movido 10 px, para que los bordes
no parpadeen. Entre los destinos anidados en un padre (los huecos de una columna de tarjetas), se
mantiene el último destino.

</note>

## Cuándo una pulsación se convierte en arrastre

Una pulsación no arrastra de inmediato. `activation` define, por tipo de puntero (`mouse`,
`touch`, `pen`), qué espera: una `distance` en px, un `delay` en ms (con una `tolerance` a partir
de la cual la pulsación se abandona, para que la página pueda desplazarse), o lo que ocurra
primero de los dos.

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      Puntero
    </th>
    
    <th>
      Por defecto
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        mouse
      </code>
      
      , <code>
        pen
      </code>
    </td>
    
    <td>
      <code>
        { distance: 4 }
      </code>
      
      : un clic sigue siendo un clic. Una pulsación de ratón sobre un asa (<code>
        handle
      </code>
      
      ) empieza de inmediato, y sigue siendo un clic si no se mueve.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        touch
      </code>
    </td>
    
    <td>
      <code>
        { delay: 200, tolerance: 5 }
      </code>
      
      : una pulsación larga, para que las listas sigan desplazándose bajo el dedo.
    </td>
  </tr>
</tbody>
</table>

Un tipo que omitas conserva su valor por defecto. La `activation` propia de un elemento
arrastrable gana a la de un [área de arrastre](https://zizigy.github.io/docs/guides/constraints), que gana a la del
provider. Mientras una pulsación espera, `useDnD().status` es `'activating'` y
`activation.progress` va de `0` a `1`; Escape o `useDnD().cancel()` la abandonan. Prueba las
restricciones en vivo y dibuja un anillo de pulsación larga a partir del progreso en
[sensores](https://zizigy.github.io/docs/guides/sensors#activation-constraints).

## Desplazamiento automático

Arrastra un canal hacia arriba o hacia abajo de la lista. Las franjas verdes son las zonas de
borde: cuanto más te adentras en una, más rápido se desplaza la lista.

<example height="37.5rem" hint="Arrastra un canal hasta las franjas verdes" name="auto-scroll-edges">



</example>

Cualquier elemento con `overflow: auto` o `scroll` se desplaza solo, y la ventana también. El
provider desplaza primero el contenedor bajo el puntero, luego sus ancestros y luego la ventana.

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Por defecto
    </th>
    
    <th>
      Qué ajusta
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        0.2
      </code>
    </td>
    
    <td>
      La zona de borde, como fracción del tamaño del contenedor, entre 24 y 96 px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        acceleration
      </code>
    </td>
    
    <td>
      <code>
        10
      </code>
    </td>
    
    <td>
      La velocidad justo en el borde, en px por frame. Crece con el cuadrado de la profundidad dentro de la zona, así que el arranque es lento y preciso.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSpeed
      </code>
    </td>
    
    <td>
      <code>
        25
      </code>
    </td>
    
    <td>
      La velocidad máxima. Más allá del borde (el puntero fuera del contenedor), la velocidad sigue creciendo hasta ella.
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` lo desactiva. Una dirección solo se desplaza cuando el puntero se ha movido
hacia ella, así que un ítem agarrado cerca de un borde no se desplaza solo. Las listas, los
árboles y las [áreas de arrastre](https://zizigy.github.io/docs/guides/constraints) aceptan su propio `autoScroll` para su
contenedor:

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

Los arrastres con teclado nunca usan el desplazamiento automático: en su lugar desplazan el ítem
hasta hacerlo visible. `isAutoScrolling` (de `useDnD()`, o de un área de arrastre) es `true`
mientras algo se desplaza.

## Vibración y la tecla de copia

Un arrastre táctil vibra brevemente al empezar. `:haptics="false"` lo desactiva; un objeto ajusta
cada vibración:

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      Clave
    </th>
    
    <th>
      Vibra cuando
    </th>
    
    <th>
      Por defecto
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        start
      </code>
    </td>
    
    <td>
      La pulsación larga se convierte en arrastre.
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (10 ms)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      El arrastre entra en un destino que lo acepta.
    </td>
    
    <td>
      desactivado
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      El drop se completa.
    </td>
    
    <td>
      desactivado
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      El drop se rechaza y los ítems vuelven a su sitio.
    </td>
    
    <td>
      desactivado
    </td>
  </tr>
</tbody>
</table>

Cada una acepta `true` (el patrón por defecto), una duración en ms, un patrón de encendido y
apagado, o `false`. Solo vibran los arrastres iniciados con el dedo, y Safari en iOS no puede
vibrar en absoluto.

`copyModifier` es la tecla que, mantenida durante un arrastre entre listas, convierte el
movimiento en una copia: `'Alt'` por defecto, cualquier `KeyboardEvent.key`, o `null` para
ninguna. La lista de la que salen los ítems necesita una función `clone`; consulta
[listas que comparten ítems](https://zizigy.github.io/docs/guides/shared-lists).

## Varios providers

La mayoría de las apps necesitan exactamente uno. Pon la lista de deseos bajo su propio provider
e intenta mover un libro al otro lado: no puede salir de su provider, y el monitor exterior deja
de oír la lista de deseos.

<example height="33.5rem" hint="Mueve un libro al otro lado y luego dale a la lista de deseos su propio provider" name="provider-nested">



</example>

```vue
<DnDProvider>
  <Shelf v-model="reading" />
  <DnDProvider>
    <Shelf v-model="wishlist" />
    <EventLog />            <!-- hears the inner provider's drags only -->
  </DnDProvider>
</DnDProvider>
```

- Los providers son independientes: un arrastre nunca pasa de uno a otro.
- Se permiten providers anidados. **Gana el dueño más cercano**: un ítem pertenece al provider más
cercano por encima de él, y el provider exterior lo ignora.
- Cada provider tiene su propia selección, su overlay, su región viva y sus monitores.

Un segundo provider solo tiene sentido para una parte de la página que necesita sus propios
ajustes a nivel de provider (colisión, teclas del teclado, anuncios) y cuyos ítems nunca salen de
ella. Si los ítems no pueden moverse entre dos partes de tu página, comprueba que no estén bajo
dos providers.

<tip>

Las reglas para una parte de la página (un tablero que se ajusta a una cuadrícula, un feed con una
pulsación táctil más larga, un panel donde no se arrastra nada) no necesitan su propio provider:

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

Sus ítems se quedan en el provider de la app y pueden seguir moviéndose a cualquier sitio.
Consulta las [restricciones](https://zizigy.github.io/docs/guides/constraints).

</tip>

Una app montada en otro sitio, dentro de un shadow root o como una app de Vue aparte, puede unirse
a un provider existente: pasa `useDnDContext()` a `provideDnDContext(app, context)` antes de
montarla. La prueba de colisión y el overlay funcionan a través de los shadow roots.

## Otras ventanas de la app

Una app puede mostrar parte de sí misma en otra ventana: un popup que abre con `window.open`, un
panel desacoplado, una ventana de Document Picture-in-Picture. Se renderiza allí con un teleport,
bajo el mismo provider. Abre la lista de deseos en una ventana y ordénala allí: el overlay está en
el popup.

<example height="26rem" hint="Abre la lista de deseos en una ventana y luego ordénala allí" name="provider-windows">



</example>

Indica la ventana cuando la abras:

```ts
const dnd = useDnD();

function detach() {
  const popup = window.open('', 'inspector', 'popup,width=420,height=560')!;
  const release = dnd.addWindow(popup);       // listen there, until it closes
  popup.addEventListener('pagehide', release);
  target.value = popup.document.body;         // <Teleport :to="target">…</Teleport>
}
```

- Los arrastres funcionan en esa ventana igual que en la página: empiezan allí, ordenan y
encuentran sus destinos, la desplazan automáticamente y muestran el overlay en su `<body>`. Los
ejecutan los frames de esa ventana, así que una página oculta detrás del popup no los ralentiza.
- Un arrastre con puntero o con teclado se queda en la ventana en la que empezó: el navegador envía
la entrada de una ventana solo a esa ventana. Los ítems con [`native`](https://zizigy.github.io/docs/guides/native) pasan
de una ventana a otra, llevados por el arrastrar y soltar del propio navegador.
- Un componente renderizado en la ventana al montarse se encuentra por sí solo. El contenido que un
teleport mueve allí más tarde (un panel que se desacopla) no: para eso está `addWindow`.
- El provider inyecta sus estilos en la ventana y la libera cuando se cierra.
- Un [sensor propio](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own) escucha en todas las ventanas con
`context.onWindow((view) => useEventListener(view.document, …))`.

## SSR y Nuxt

El provider es seguro para SSR. Las listas y los ítems se renderizan en el servidor como cualquier
otro marcado. El overlay y la región viva se teletransportan y se montan solo en el cliente, así
que nunca causan un error de hidratación. Los ids por defecto vienen de `useId()` de Vue y
coinciden entre servidor y cliente.

En Nuxt, el módulo registra `DnDProvider` globalmente e importa automáticamente los composables:
consulta la [instalación](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
