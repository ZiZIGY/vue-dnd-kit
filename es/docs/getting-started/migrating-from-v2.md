---
title: "Migrar desde la v2"
description: "Pasa una app de la v2 a la v3 — qué cambió y por qué, la actualización, un mapa de cada API de la v2 a su sustituta en la v3, código de antes y después para los casos habituales, y los escollos."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

La v3 es una reescritura de la v2. El modelo se mantiene: un provider, y composables que llamas sobre
tus propios elementos. Pero la mayoría de los nombres y de las opciones cambiaron, la ordenación pasó
a la biblioteca, y el handler de drop que escribías para cada lista desaparece. Esta página relaciona
cada parte de la v2 con la v3 y luego muestra los casos habituales antes y después.

## Qué cambió

- **La ordenación viene incluida.** En la v2, una lista era una zona de drop, sus filas eran
elementos arrastrables con un payload `[index, items]`, y ordenabas en `onDrop` con
`e.helpers.suggestSort()`. En la v3 lo hacen `makeSortableList` y `makeSortableItem`: la lista
renderiza un **borrador** de tu array que se reordena mientras arrastras, y el drop escribe el
nuevo array en tu ref. La mayoría de los handlers de drop de la v2 se borran, no se portan.
- **Las cosas se mueven solas.** Las filas se deslizan a sus nuevos sitios (FLIP), el overlay
aterriza en su hueco al soltar y vuelve a su sitio al cancelar. `<TransitionGroup>` desaparece.
- **Sigue siendo un solo paquete.** `@vue-dnd-kit/core` contiene las listas, los árboles, el
multi-drag, los modificadores, los sensores y las funciones de colisión. El módulo de Nuxt se
mantiene; `@vue-dnd-kit/actions` (arrastres programáticos) y `@vue-dnd-kit/devtools` son nuevos y
opcionales.
- **Un overlay de verdad.** Se teletransporta a `body` y muestra un clon profundo, con el tamaño del
hueco en el que aterrizará. Los componentes de overlay reciben el arrastre como props en lugar de
leer las interioridades del provider.
- **Ids, no elementos.** La selección, los eventos y el estado del arrastre usan como clave ids de
tus datos. No hay mapas de elementos del DOM que leer.
- **Los tipos y las reglas de aceptación** sustituyen a `groups` para los elementos arrastrables
simples y los destinos. Las listas intercambian ítems por el nombre de su `group`.
- **Decisiones antes del drop.** `onBeforeDrop` acepta, rechaza, mantiene el arrastre en curso o se
queda con parte de los ítems. `onDrop` solo aplica.
- **Sensores.** La entrada de puntero y la de teclado son sensores. La activación se configura por
tipo de puntero, y los arrastres táctiles empiezan con una pulsación larga, así que las listas se
siguen desplazando bajo el dedo.
- **Áreas.** `makeDragArea` sustituye a `makeConstraintArea` y `makeAutoScroll`, y el desplazamiento
automático funciona en todo contenedor desplazable sin código.
- **La accesibilidad viene activada por defecto**: atributos ARIA, un foco que vuelve tras el drop y
anuncios para lectores de pantalla.

## Actualizar

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@^3
```

```bash [yarn]
yarn add @vue-dnd-kit/core@^3
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@^3
```

```bash [bun]
bun add @vue-dnd-kit/core@^3
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      Paquete
    </th>
    
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.x, opcional
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.x, opcional
    </td>
  </tr>
</tbody>
</table>

- Una app que tiene `"@vue-dnd-kit/core": "^2…"` en su `package.json` se queda en la v2 hasta que el
rango diga `^3`.
- Vue **3.5** o posterior. La v2 no tenía dependencias; la v3 tiene una, `@vueuse/core` (14 o 15).
- Navegadores: Chrome y Edge 104+, Safari 15.4+, Firefox 104+.
- La v2 y la v3 comparten nombre de paquete, así que una app pasa a la v3 de una vez. No hay capa de
compatibilidad. La documentación de la v2 sigue disponible desde el menú de versiones de la parte
superior de la página.

Un buen orden de trabajo:

1. Actualiza los paquetes y renombra las props del provider ([más abajo](#the-provider)).
2. Convierte cada lista ordenable en `makeSortableList` y `makeSortableItem`, y borra su handler de
drop.
3. Porta los elementos arrastrables simples y las zonas de drop.
4. Porta las vistas previas personalizadas a componentes de overlay o al slot `#overlay` del
provider.
5. Sustituye `makeConstraintArea` y `makeAutoScroll` por `makeDragArea`, o por nada.
6. Borra los apaños de la v2: `tabindex` y `aria-grabbed` en los elementos arrastrables,
`touch-action: none` en ítems enteros, `<TransitionGroup>` alrededor de las filas, `markRaw`
alrededor de los componentes de vista previa.

## De lo antiguo a lo nuevo

**Sin equivalente** en una tabla significa que la v3 no tiene nada con ese nombre; la celda dice qué
usar en su lugar.

### De un vistazo

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      <code>
        DnDProvider
      </code>
      
      , con props nuevas y un slot <code>
        #overlay
      </code>
      
      .
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
        makeDraggable
      </code>
      
       para el arrastre libre; <code>
        makeSortableItem
      </code>
      
       para las filas de una lista.
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
        makeDroppable
      </code>
      
       para destinos de drop simples; <code>
        makeSortableList
      </code>
      
       o <code>
        makeSortableTree
      </code>
      
       para listas y árboles.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      Nada: el desplazamiento automático es automático. <code>
        makeDragArea
      </code>
      
       o el <code>
        autoScroll
      </code>
      
       de una lista lo ajustan.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      <code>
        useDnD
      </code>
      
       para el estado, <code>
        useDnDMonitor
      </code>
      
       para los eventos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
       y <code>
        provideDnDContext(app, context)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      : ahora el clon de un ítem arrastrado, para overlays propios.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      , <code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      El modificador <code>
        snapToGrid
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      , <code>
        suggestSwap
      </code>
      
      , <code>
        suggestCopy
      </code>
      
      , <code>
        suggestRemove
      </code>
    </td>
    
    <td>
      Integrados en las listas: consulta <a href="#sorting">
        ordenación
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

### El provider

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      , desactivado salvo que se active
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      : <strong>
        activado por defecto
      </strong>
      
      , para la ventana y todo contenedor desplazable. <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
      , o <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      , renderizado por defecto dentro del provider
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      : un selector o un elemento, <code>
        'body'
      </code>
      
       por defecto.
    </td>
  </tr>
  
  <tr>
    <td>
      Slot <code>
        #preview="{ preview }"
      </code>
    </td>
    
    <td>
      Slot <code>
        #overlay
      </code>
      
      , con el arrastre como props: <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        to
      </code>
      
      . Consulta <a href="#the-overlay">
        el overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      , <code>
        forDrop
      </code>
      
      , <code>
        forCancel
      </code>
      
       (configurados en <code>
        useDnDProvider()
      </code>
      
      )
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      : 25 px por defecto, para arrastres libres.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      , <code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
      
       Las flechas mueven; <kbd value="Shift">
        
      </kbd>
      
       hace cuatro veces más grandes los pasos de un arrastre libre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
      
       <code>
        collision
      </code>
      
       elige cómo se encuentra el destino: <code>
        pointerFirst
      </code>
      
       (por defecto), <code>
        pointerWithin
      </code>
      
      , <code>
        rectIntersection
      </code>
      
      , <code>
        closestCenter
      </code>
      
      , <code>
        closestCorners
      </code>
      
       o una función tuya.
    </td>
  </tr>
  
  <tr>
    <td>
      Un provider por página, nunca anidado
    </td>
    
    <td>
      Anidar funciona: el provider más cercano gestiona cada ítem. Un provider para toda la app sigue siendo el objetivo.
    </td>
  </tr>
</tbody>
</table>

Props nuevas sin equivalente en la v2: `activation`, `modifiers`, `sensors`, `animation`,
`dropAnimation`, `animateChanges`, `haptics`, `copyModifier`, `overlayFit`, `overlayClass`,
`overlayTransition`, `overlayPreviews`, `announcements`, `screenReaderInstructions` y
`defaultStyles`. El provider también emite `drag-start`, `drag-move`, `drag-over`, `drag-end`,
`drag-cancel`, `drag-resume` y `drag-settle`. Todo está en [la guía del provider](https://zizigy.github.io/docs/guides/provider).

### Leer el estado: `useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      : <code>
        'dragging'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'selecting'
      </code>
      
      , <code>
        'pending'
      </code>
      
       o <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      : <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       o <code>
        'selecting'
      </code>
      
      . <code>
        'pending'
      </code>
      
       (un drop asíncrono) es <code>
        'dropping'
      </code>
      
      ; <code>
        null
      </code>
      
       es <code>
        'idle'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      , tras los modificadores. Cada evento tiene además <code>
        delta
      </code>
      
      , el desplazamiento desde el inicio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
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
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
       (elementos)
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
       (ids): <code>
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
      
      , <code>
        ids
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      , <code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      : <code>
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
        delay.progress
      </code>
      
      , <code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      , de <code>
        0
      </code>
      
       a <code>
        1
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      , <code>
        preview.size
      </code>
      
      , <code>
        preview.render
      </code>
      
      , <code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
      
       La biblioteca coloca y dimensiona el overlay. Usa <code>
        overlayTo
      </code>
      
      , el slot <code>
        #overlay
      </code>
      
       o componentes de overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      , <code>
        droppableMap
      </code>
      
      , los <code>
        visible…Set
      </code>
      
      , <code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nuevo: <code>
        useDnD().cancel()
      </code>
      
      , <code>
        position
      </code>
      
      , <code>
        isAutoScrolling
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Los eventos pasaron a `useDnDMonitor`: consulta [eventos y decisiones de drop](#events-and-drop-decisions).
Las formas completas están en la [API de useDnD](https://zizigy.github.io/docs/api/use-dnd).

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      : sin tercer argumento. Las filas de una lista usan <code>
        makeSortableItem(ref, { item })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      , necesario en listas virtuales
    </td>
    
    <td>
      <code>
        id
      </code>
      
      : pásalo desde tus datos, como getter. El valor por defecto viene de <code>
        useId()
      </code>
      
       y es nuevo en cada instancia del componente.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      : un valor, una ref o un getter. Se lee como <code>
        active.data
      </code>
      
       y <code>
        active.items[i].data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      , comparado con el <code>
        accept
      </code>
      
       de los destinos. Consulta <a href="#groups">
        grupos
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      : un selector o una ref de elemento.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      : un filtro para cada pulsación.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      <code>
        activation
      </code>
      
       por tipo de puntero: <code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      . Con <code>
        distance
      </code>
      
       y <code>
        delay
      </code>
      
       a la vez, el arrastre empieza con lo que llegue primero.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
      
       Una <code>
        distance
      </code>
      
       por tipo de puntero.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      : el componente recibe el arrastre como props. Consulta <a href="#the-overlay">
        el overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
      
       Un destino de drop sobre un ítem ordenable cuenta en su parte central (del 25 al 75 %); los árboles anidan con <code>
        nesting: 'hover'
      </code>
      
      . Consulta <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        soltar dentro de un ítem ordenable
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      , <code>
        onSelfDragMove
      </code>
      
      , <code>
        onSelfDragEnd
      </code>
      
      , <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente
      </strong>
      
       en el elemento arrastrable: <code>
        useDnDMonitor
      </code>
      
      , o <code>
        watch(isDragging)
      </code>
      
      . Consulta <a href="#events-and-drop-decisions">
        eventos
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
      , y su <code>
        onDragStart
      </code>
      
      … para los arrastres que pasan por encima
    </td>
    
    <td>
      Un <code>
        makeDroppable
      </code>
      
       en el mismo elemento: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Devuelve <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
    </td>
    
    <td>
      Lo mismo.
    </td>
  </tr>
  
  <tr>
    <td>
      Devuelve <code>
        isDragOver
      </code>
    </td>
    
    <td>
      Los ítems ordenables devuelven <code>
        indicator
      </code>
      
       (con <code>
        placeholder: 'indicator'
      </code>
      
      ) e <code>
        isPlaceholder
      </code>
      
      ; los destinos devuelven <code>
        placement
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Devuelve <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente
      </strong>
      
       en los elementos arrastrables. Los destinos devuelven <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nuevo: <code>
        label
      </code>
      
      , <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        overlay: false
      </code>
      
       con el <code>
        transform
      </code>
      
       devuelto, <code>
        dropAnimation
      </code>
      
      , <code>
        attributes
      </code>
      
      , <code>
        native
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      . Una zona que contiene una lista es un <code>
        makeSortableList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      : <code>
        '*'
      </code>
      
      , un tipo, una lista de tipos o una función.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      : opciones propias, sin objeto <code>
        events
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
      , que podía devolver <code>
        false
      </code>
      
       o una promesa
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       decide, <code>
        onDrop
      </code>
      
       aplica. Consulta <a href="#events-and-drop-decisions">
        decisiones de drop
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , devolviendo los ids que se aceptan.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      , que se lee como <code>
        over.data
      </code>
      
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
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Devuelve <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Devuelve <code>
        isDragOver
      </code>
      
      : <code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
       (un booleano), y <code>
        placement
      </code>
      
      : <code>
        { top, right, bottom, left }
      </code>
      
      , las mitades en las que está el puntero. No hay <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nuevo: <code>
        id
      </code>
      
      , <code>
        label
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        overOverlay
      </code>
      
      , <code>
        overDropAnimation
      </code>
      
      , <code>
        external
      </code>
      
       (archivos del ordenador).
    </td>
  </tr>
</tbody>
</table>

### El evento de drop

<table>
<thead>
  <tr>
    <th>
      <code>
        IDragEvent
      </code>
      
       de la v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      : <code>
        { id, item, data, label, type }
      </code>
      
       cada uno, empezando por el que se agarró. Las listas reciben <code>
        e.items
      </code>
      
       y <code>
        e.keys
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      , <code>
        .items
      </code>
    </td>
    
    <td>
      Listas: <code>
        e.from
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      : <code>
        items
      </code>
      
      , <code>
        placement
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      : <code>
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
      
      . Listas: <code>
        e.to
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente
      </strong>
      
      : las listas calculan <code>
        e.to.index
      </code>
      
       por sí mismas.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      Las listas escriben el drop; <code>
        e.result
      </code>
      
       contiene el nuevo array de cada lista que cambia.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
       en la lista; <code>
        e.partner
      </code>
      
       es el ítem con el que se intercambió.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       o la tecla de copia (<kbd value="Alt">
        
      </kbd>
      
      ), con el <code>
        clone
      </code>
      
       de la lista; <code>
        e.mode
      </code>
      
       es <code>
        'copy'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        e.source.remove()
      </code>
      
       en un destino de drop, o el <code>
        dropOutside: 'remove'
      </code>
      
       de la lista.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      , <code>
        removeAt
      </code>
      
      , <code>
        removeIndexes
      </code>
      
      , <code>
        swapAt
      </code>
      
      , <code>
        getInsertSide
      </code>
      
      , <code>
        isAtZoneStart
      </code>
      
      , <code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
      
       Las listas no los necesitan; para un destino simple, cambia tus datos como quieras.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nuevo: <code>
        e.pointer
      </code>
      
      , <code>
        e.delta
      </code>
      
      , <code>
        e.position
      </code>
      
       (dónde poner un ítem soltado sobre un tablero), <code>
        e.mode
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Ordenación

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Una lista <code>
        makeDroppable
      </code>
      
       con <code>
        () => items
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Una fila <code>
        makeDraggable
      </code>
      
       con <code>
        () => [index, items]
      </code>
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Renderizar tu array
    </td>
    
    <td>
      Renderizar los <code>
        items
      </code>
      
       devueltos: el borrador que se reordena mientras arrastras.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      , <code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
       (por defecto), <code>
        'horizontal'
      </code>
      
       o <code>
        'grid'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Comprobaciones de identidad para encontrar los arrays de origen y de destino, y luego asignar <code>
        sourceItems
      </code>
      
       y <code>
        targetItems
      </code>
    </td>
    
    <td>
      Nada: el drop escribe cada lista que cambia.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      Incluido. <code>
        animateChanges: true
      </code>
      
       anima los cambios que no hizo ningún arrastre (añadir, quitar, barajar).
    </td>
  </tr>
  
  <tr>
    <td>
      Una línea de inserción a partir de <code>
        isDragOver.top
      </code>
      
      , <code>
        .bottom
      </code>
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
       y el <code>
        indicator.side
      </code>
      
       del ítem. Consulta <a href="/docs/guides/sortable-lists#an-insertion-line">
        una línea de inserción
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Una paleta que solo copia (<code>
        suggestCopy()
      </code>
      
       y un flag <code>
        copyOnly
      </code>
      
      )
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      , <code>
        sort: false
      </code>
      
       y <code>
        clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Una papelera con <code>
        suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
      , o <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia o datos inmutables: asignar tú el resultado
    </td>
    
    <td>
      <code>
        items
      </code>
      
       como getter, luego <code>
        e.preventDefault()
      </code>
      
       en <code>
        onDrop
      </code>
      
       y aplicar <code>
        e.result
      </code>
      
      . Consulta <a href="/docs/guides/shared-lists#controlled-lists">
        listas controladas
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un árbol recursivo: un droppable por carpeta y <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      : un solo contenedor, filas renderizadas en plano con su profundidad. Consulta <a href="/docs/guides/trees">
        árboles
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Grupos anidados con <code>
        v-model
      </code>
      
       (un droppable por grupo)
    </td>
    
    <td>
      Una lista dentro de una lista, todas en un mismo <code>
        group
      </code>
      
      , cada una con <code>
        items: defineModel()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Listas virtuales: <code>
        id
      </code>
      
       en cada elemento arrastrable
    </td>
    
    <td>
      Pasa el borrador al virtualizador, <code>
        id: () => props.item.id
      </code>
      
       en las filas. Consulta <a href="/docs/guides/virtual-lists">
        listas virtuales
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

El código de antes y después está [más abajo](#a-sortable-list). Todo sobre las listas está en
[listas ordenables](https://zizigy.github.io/docs/guides/sortable-lists) y [listas que comparten ítems](https://zizigy.github.io/docs/guides/shared-lists).

### Grupos

La v2 tenía una sola opción `groups` para todo. La v3 la divide en dos:

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev', 'ops']
      </code>
      
       en una zona
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
      , o una función: <code>
        ({ active, items, types }) => boolean
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
      , o ninguno
    </td>
    
    <td>
      Sin <code>
        type
      </code>
      
       ni <code>
        accept
      </code>
      
      . Las reglas de la v2 se mantienen: un elemento arrastrable sin tipo encaja en cualquier regla, y un destino sin <code>
        accept
      </code>
      
       lo acepta todo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       en la zona de una lista y en sus filas
    </td>
    
    <td>
      <code>
        group: 'board'
      </code>
      
       en <code>
        makeSortableList
      </code>
      
      . <code>
        group: { name, pull, put }
      </code>
      
       dice qué puede salir y entrar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       en <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Una lista sin `group` es un grupo propio y no intercambia con ninguna otra lista. En la v2, una zona
sin grupos lo aceptaba todo. Consulta [qué arrastres acepta un destino](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes).

### El overlay

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Una vista previa renderizada en el provider, teletransportada con <code>
        previewTo
      </code>
    </td>
    
    <td>
      Siempre teletransportado, a <code>
        body
      </code>
      
       o a <code>
        overlayTo
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un clon: la misma etiqueta, su <code>
        innerHTML
      </code>
      
       y su tamaño
    </td>
    
    <td>
      Un clon profundo: los valores de los formularios, los píxeles de <code>
        <canvas>
      </code>
      
      , los estilos heredados y las celdas de tabla vienen incluidos. Marca lo que se queda fuera con <code>
        data-dnd-no-clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
      
      , que lee <code>
        useDnDProvider().entities
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      , que recibe <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
       y <code>
        to
      </code>
      
       como props. Sin <code>
        markRaw
      </code>
      
      ; usa un <code>
        shallowRef
      </code>
      
       para cambiarlo.
    </td>
  </tr>
  
  <tr>
    <td>
      El slot <code>
        #preview
      </code>
      
      , posicionado a partir de <code>
        preview.position
      </code>
    </td>
    
    <td>
      El slot <code>
        #overlay
      </code>
      
      : la biblioteca coloca y dimensiona la caja. Si no renderiza nada, se vuelve al clon.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      El slot <code>
        #overlay
      </code>
      
      , o un <code>
        shallowRef
      </code>
      
       pasado como <code>
        overlay
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un aspecto nuevo sobre una zona, desde <code>
        onEnter
      </code>
      
       y <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        overOverlay
      </code>
      
       en <code>
        makeDroppable
      </code>
      
       o en una lista, o leer <code>
        over
      </code>
      
       en el componente de overlay. Consulta <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        destinos que cambian el overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      Los <code>
        items
      </code>
      
       de las props del overlay; <code>
        <DragPreview :id="item.id" />
      </code>
      
       renderiza un clon.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      El modificador <code>
        snapToGrid
      </code>
      
      . Ajusta a la cuadrícula el punto donde se buscan los destinos y también la <code>
        position
      </code>
      
       del drop, no solo la imagen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <Transition>
      </code>
      
       o el <code>
        AnimatePresence
      </code>
      
       de motion alrededor de <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        overlay-class
      </code>
      
       con <code>
        @starting-style
      </code>
      
       para el agarre, <code>
        dropAnimation
      </code>
      
       para el aterrizaje, <code>
        overlayTransition
      </code>
      
       entre componentes. Consulta <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        levantar, inclinar, asentar
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      <code>
        [data-dnd-overlay]
      </code>
      
       (<code>
        "dragging"
      </code>
      
      , <code>
        "dropping"
      </code>
      
      ) en la caja, <code>
        [data-dnd-overlay-content]
      </code>
      
       dentro de ella.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.size
      </code>
      
      , actualizado a mano
    </td>
    
    <td>
      La caja toma el tamaño del hueco en el que aterrizará (<code>
        overlayFit
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      La vista previa desaparece al soltar
    </td>
    
    <td>
      Aterriza en su hueco, o vuelve a su sitio al cancelar.
    </td>
  </tr>
</tbody>
</table>

Más en [la guía del overlay](https://zizigy.github.io/docs/guides/overlay).

### Selección y multi-drag

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        selected
      </code>
      
      , devuelto por <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        selected
      </code>
      
      , devuelto por <code>
        makeDraggable
      </code>
      
       y <code>
        makeSortableItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      , un conjunto de elementos
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      , con ids como clave.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      : Ctrl (<code>
        ControlLeft
      </code>
      
      ) pulsado por defecto
    </td>
    
    <td>
      Sin tecla por defecto: una pulsación en el espacio vacío del área dibuja el rectángulo. <code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       recupera Ctrl.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier.keys
      </code>
      
       como <code>
        KeyboardEvent.code
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
       (<code>
        'Control'
      </code>
      
      , <code>
        'Shift'
      </code>
      
      ) o <code>
        .code
      </code>
      
       (<code>
        'ControlLeft'
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      , <code>
        'select'
      </code>
    </td>
    
    <td>
      Lo mismo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
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
      Lo mismo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort()
      </code>
      
       moviendo la selección en bloque
    </td>
    
    <td>
      Las listas la mueven. <code>
        multiple: 'group'
      </code>
      
       (por defecto), <code>
        'gaps'
      </code>
      
       o <code>
        'stack'
      </code>
      
       dice qué hacen los demás ítems por el camino.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       para selecciones mixtas
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       y <code>
        onBeforeDrop
      </code>
      
       devolviendo ids. Consulta <a href="/docs/guides/multi-drag#taking-only-some">
        aceptar solo algunos
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Más en [multi-drag y selección](https://zizigy.github.io/docs/guides/multi-drag).

### Ejes, límites y ajuste

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      , para los arrastres que empiezan dentro de ella. <code>
        axis
      </code>
      
       también funciona en un elemento arrastrable, una lista, un árbol o un ítem.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      Sin <code>
        axis
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
      , o los modificadores <code>
        restrictToParent
      </code>
      
       y <code>
        restrictToElement(el)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un provider por región, para mantener las reglas separadas
    </td>
    
    <td>
      Un provider y un <code>
        makeDragArea
      </code>
      
       por región. Sus ítems pueden seguir moviéndose a cualquier sitio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       o <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      , en los <code>
        modifiers
      </code>
      
       del provider, de un área, de una lista o de un elemento arrastrable.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nuevo: <code>
        restrictToWindowEdges
      </code>
      
      , <code>
        restrictToFirstScrollableAncestor
      </code>
      
      , <code>
        snapCenterToCursor
      </code>
      
       y modificadores propios.
    </td>
  </tr>
</tbody>
</table>

Más en [ejes, límites y cuadrículas](https://zizigy.github.io/docs/guides/constraints).

### Desplazamiento automático

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      , desactivado por defecto
    </td>
    
    <td>
      Activado por defecto, para la ventana y todo contenedor desplazable. <code>
        :auto-scroll="false"
      </code>
      
       lo desactiva.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      Nada: cualquier elemento con <code>
        overflow: auto
      </code>
      
       o <code>
        scroll
      </code>
      
       se desplaza. Para ajustar uno: <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       o el <code>
        autoScroll
      </code>
      
       de la lista.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        threshold
      </code>
      
       en px, o por lado
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      : una fracción del tamaño del contenedor (<code>
        0.2
      </code>
      
      ), entre 24 y 96 px. <strong>
        Sin equivalente
      </strong>
      
       para umbrales por lado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
      
      , un multiplicador
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
       (25 px por frame) y <code>
        acceleration
      </code>
      
       (10).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        isAutoScrolling
      </code>
      
      , de <code>
        makeDragArea
      </code>
      
       o de <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Teclado y accesibilidad

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex="0"
      </code>
      
       en cada elemento arrastrable
    </td>
    
    <td>
      Se pone por ti, con <code>
        role
      </code>
      
      , <code>
        aria-roledescription
      </code>
      
      , <code>
        aria-describedby
      </code>
      
      , <code>
        aria-disabled
      </code>
      
       y <code>
        aria-pressed
      </code>
      
      . Tus propios atributos tienen prioridad.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        :aria-grabbed="isDragging"
      </code>
      
       a mano
    </td>
    
    <td>
      Quítalo: <code>
        aria-pressed
      </code>
      
       sigue el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      Teclas configuradas en <code>
        useDnDProvider().keyboard.keys
      </code>
    </td>
    
    <td>
      La prop <code>
        keyboard
      </code>
      
       del provider. Las asignaciones coinciden con <code>
        event.code
      </code>
      
       o <code>
        event.key
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Las flechas mueven la vista previa <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      Arrastres libres: <code>
        keyboard.step
      </code>
      
       px. Listas: de hueco en hueco, y hacia la siguiente lista del grupo. <code>
        keyboardMode: 'droppables'
      </code>
      
       salta entre destinos.
    </td>
  </tr>
  
  <tr>
    <td>
      Reasignar las flechas (<code>
        forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      )
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Sin anuncios
    </td>
    
    <td>
      Una región viva anuncia cada agarre, movimiento, drop y cancelación. <code>
        label
      </code>
      
       pone nombre a las cosas; <code>
        announcements
      </code>
      
       y <code>
        screenReaderInstructions
      </code>
      
       cambian su redacción.
    </td>
  </tr>
</tbody>
</table>

Más en [accesibilidad](https://zizigy.github.io/docs/guides/accessibility).

### Eventos y decisiones de drop

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
       del elemento arrastrable
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      , comprobando <code>
        active.ids
      </code>
      
      . Para una clase, basta con <code>
        isDragging
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      El <code>
        onDragMove
      </code>
      
       del monitor.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      , soltado o cancelado
    </td>
    
    <td>
      El <code>
        onDragEnd
      </code>
      
       del monitor (un drop) y <code>
        onDragCancel
      </code>
      
      . <code>
        onDragSettle
      </code>
      
       escucha ambos, una vez que el overlay ha aterrizado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      El <code>
        onDragCancel
      </code>
      
       del monitor.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
       del elemento arrastrable, y su <code>
        onDragStart
      </code>
      
      … para los arrastres que pasan por encima
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       en el elemento: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      . Las filas de una lista no necesitan nada.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        onLeave
      </code>
      
       del droppable
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
       del droppable
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       decide, luego <code>
        onDrop
      </code>
      
       aplica. <code>
        onDrop
      </code>
      
       es síncrono, y lo que devuelve se ignora.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
      
       del droppable
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , con <code>
        acceptMode: 'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nuevo: los <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
       del provider, y los <code>
        onDragOver
      </code>
      
      , <code>
        onBeforeDrop
      </code>
      
       y <code>
        onDragResume
      </code>
      
       del monitor.
    </td>
  </tr>
</tbody>
</table>

Un `onDrop` de la v2 podía devolver un valor, o una promesa de uno, para decidir el drop. En la v3
esa es la tarea de `onBeforeDrop`, en listas, árboles, destinos de drop y monitores:

<table>
<thead>
  <tr>
    <th>
      <code>
        onDrop
      </code>
      
       de la v2 devuelve
    </th>
    
    <th>
      <code>
        onBeforeDrop
      </code>
      
       de la v3 devuelve
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Nada, o <code>
        true
      </code>
      
      : el drop se completa
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       o nada.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      : este drop se descarta, el arrastre sigue activo
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      . <strong>
        <code>
          false
        </code>
        
         ahora rechaza el drop.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Una promesa rechazada, o una excepción: el arrastre se cancela
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       o <code>
        false
      </code>
      
      . Una excepción también rechaza.
    </td>
  </tr>
  
  <tr>
    <td>
      Una promesa; mientras tanto <code>
        state
      </code>
      
       es <code>
        'pending'
      </code>
    </td>
    
    <td>
      Una promesa; mientras tanto <code>
        status
      </code>
      
       es <code>
        'dropping'
      </code>
      
       y el overlay espera con <code>
        data-dnd-overlay="dropping"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       devuelve <code>
        IDragItem[]
      </code>
    </td>
    
    <td>
      Un array de ids: solo esos se sueltan, los demás vuelven a su sitio.
    </td>
  </tr>
</tbody>
</table>

Los monitores responden primero, luego el destino. Después se ejecuta el `onDrop` del destino, una
lista escribe sus nuevos arrays y le sigue `onDragEnd`. Más en [decidir un drop](https://zizigy.github.io/docs/guides/drop-decisions)
y en la [API de eventos](https://zizigy.github.io/docs/api/events).

### Tipos

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
       (destinos, monitores), <code>
        SortableDropEvent
      </code>
      
       (listas), <code>
        DnDEndEvent
      </code>
      
       (<code>
        onDragEnd
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        Sin equivalente.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      , <code>
        ISuggestSwapResult
      </code>
      
      , <code>
        ISuggestCopyResult
      </code>
      
      , <code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      : <code>
        result
      </code>
      
      , <code>
        to
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        partner
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      , en <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        Placement
      </code>
      
      , sin <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
      , lo que devuelve <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      , <code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      Callbacks en <code>
        DraggableOptions
      </code>
      
      , <code>
        DroppableOptions
      </code>
      
       y <code>
        DnDMonitor
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@^3 @vue-dnd-kit/core@^3
```

<table>
<thead>
  <tr>
    <th>
      v2 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x)
    </th>
    
    <th>
      v3 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.x)
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Importa automáticamente <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeConstraintArea
      </code>
      
      , <code>
        makeAutoScroll
      </code>
      
      , <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      Importa automáticamente <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableItem
      </code>
      
      , <code>
        makeSortableTree
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeDragArea
      </code>
      
      , <code>
        useDnD
      </code>
      
      , <code>
        useDnDMonitor
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Ningún tipo importado automáticamente
    </td>
    
    <td>
      Los tipos principales sí (<code>
        DnDEvent
      </code>
      
      , <code>
        SortableDropEvent
      </code>
      
      , <code>
        OverlayProps
      </code>
      
      …). Los genéricos (<code>
        Key
      </code>
      
      , <code>
        Active
      </code>
      
      , <code>
        Over
      </code>
      
      ) se importan a mano.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Modificadores, funciones de colisión y sensores, a petición: <code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
       y <code>
        DragPreview
      </code>
      
       globales
    </td>
    
    <td>
      Lo mismo, con una opción <code>
        prefix
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview />
      </code>
      
       en el layout, dentro del provider
    </td>
    
    <td>
      Quítalo: el provider renderiza el overlay. <code>
        DragPreview
      </code>
      
       recibe un <code>
        id
      </code>
      
       y va dentro de los componentes de overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      Dependencia peer <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      Dependencia peer <code>
        @vue-dnd-kit/core
      </code>
      
       3; Nuxt 4.
    </td>
  </tr>
</tbody>
</table>

`modules: ['@vue-dnd-kit/nuxt']` en `nuxt.config.ts` se queda como estaba. Consulta
[instalación](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Antes y después

### Un elemento arrastrable y una zona de drop

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- La tarjeta recibe `tabindex`, `role` y los atributos `aria-*` por sí sola. Un asa `<button>` puede
recibir el foco, y los arrastres con teclado empiezan desde ella.
- `groups` pasó a ser `type` en el elemento arrastrable y `accept` en el destino. Los callbacks
salieron del objeto `events`.
- `isOver` sin `isAccepting` es un destino que rechaza el arrastre: un drop ahí vuelve a su sitio.

### Una lista ordenable

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- Renderiza `items`, el borrador: se reordena mientras arrastras. `tasks` recibe el nuevo orden al
soltar, y `defineModel` emite `update:modelValue`.
- Sin índice, sin payload, sin `onDrop`, sin `<TransitionGroup>`: las filas se deslizan solas.
- La fila arrastrada se queda en la lista como el hueco en el que aterrizará. Dale estilo con
`isPlaceholder` o `[data-dnd-placeholder]` en lugar de ocultarla.

### Listas que comparten ítems

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

El drop escribe los dos arrays, el que la tarea dejó y aquel en el que entró. `TaskItem.vue` es el de
la lista ordenable de arriba. Una paleta que reparte copias era `suggestCopy()` y un flag `copyOnly`;
ahora es una lista:

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

Para un store de Pinia u otro estado que no escribes directamente, pasa `items` como getter, llama a
`e.preventDefault()` en `onDrop` y aplica `e.result`: consulta
[listas controladas](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

### Un overlay personalizado

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- El componente recibe el arrastre como props: `items` (cada ítem arrastrado, empezando por el que se
agarró), `over`, `accepted`, `status`, `mode` y `to`. Declara solo las que lees. Para las filas de
una lista, el ítem de la lista es `items[0].item`.
- Pásalo tal cual. Cámbialo con un `shallowRef`, nunca con una `ref` profunda.

El slot del provider cambia de la misma forma, y tu componente ya no se posiciona a sí mismo:

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

Una aparición que envolvía `DragPreview` en un `<Transition>` pasa a ser `overlay-class` con
`@starting-style`: consulta [levantar, inclinar, asentar](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).

### Un drop que confirmas

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

Una lista pregunta de la misma forma, y una promesa te permite abrir un diálogo propio. El overlay
espera donde se soltó hasta que la promesa se resuelve:

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

Una zona que aceptaba solo la parte coincidente de una selección mixta (`groupMatch: 'some'`):

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

Las listas lo hacen sin código: con `acceptMode: 'some'`, aterrizan los ítems que acepta su
`group.put`, y los demás vuelven a su sitio.

## Escollos al actualizar

- **Instala la v3 con su rango.** `^3` en `package.json`: un `npm update` mantiene `^2` en la v2.
- **Renderiza el borrador.** Una lista renderiza los `items` que devuelve `makeSortableList`, no tu
array. Si renderizas tu array, nada se mueve hasta el drop.
- **No ordenes dos veces.** Borra el código de `suggestSort` de las listas: una lista escribe cada
drop en una ref `items` escribible después de su `onDrop`. Para aplicarlo tú, llama a
`e.preventDefault()` y usa `e.result`.
- **false rechaza el drop.** En la v2, un `onDrop` que resolvía `false` mantenía el arrastre en
curso. En la v3, devuelve `'continue'` desde `onBeforeDrop`. Una promesa devuelta desde `onDrop` se
ignora.
- **Las listas solo comparten dentro de un group.** Una lista sin él no intercambia con ninguna otra
lista.
- **Da a las filas el id como clave.** `:key="index"` anima las filas equivocadas. Pasa también ids
desde tus datos: un id por defecto es nuevo en cada instancia del componente.
- **Sin <TransitionGroup>, sin transition en transform.** La biblioteca mueve las filas ella
misma, y los movimientos se animarían dos veces.
- **Deshaz el apaño táctil.** `touch-action: none` en un ítem entero impide que la página se desplace
bajo el dedo; la v3 empieza los arrastres táctiles con una pulsación larga. Mantenlo en un asa que
deba arrastrar enseguida, con `activation: { touch: { distance: 4 } }`.
- **Quita los atributos obsoletos.** La biblioteca pone el `tabindex`, el `role` y los `aria-*` que
necesita y nunca sobrescribe los tuyos, así que un `role` o un `aria-grabbed` que hayan quedado se
mantienen como los dejaste.
- **Vuelve a dar estilo al overlay.** `.dnd-kit-preview` ya no existe: da estilo a lo que hay dentro
de `[data-dnd-overlay='dragging']`, nunca al `transform` de la caja. Dale `width: 100%; height: 100%`
a la raíz de un componente de overlay, y saca `<DragPreview />` de tus layouts.
- **El desplazamiento automático está activado.** Pasa `:auto-scroll="false"` donde la v2 nunca se
desplazaba.
- **Un rectángulo no necesita tecla.** `makeSelectionArea` dibuja con una pulsación simple en su
espacio vacío. Añade un `modifier` para conservar el Ctrl de la v2.
- **Un provider, áreas dentro.** Los ítems no pueden pasar de un provider a otro. Una página que usaba
un provider por región para mantener separadas sus reglas necesita un provider y un `makeDragArea`
por región.
- **Dos argumentos.** `makeDraggable` y `makeDroppable` reciben una ref y un objeto de opciones, sin
payload.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
