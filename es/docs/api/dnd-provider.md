---
title: "DnDProvider"
description: "El componente que gestiona el arrastre — la entrada, el overlay, la selección, el desplazamiento automático y la región viva — para todo lo que se renderiza dentro de él."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/dnd-provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider :animation="{ duration: 200 }" @drag-end="save">
    <RouterView />
    <template #overlay="{ items, over, accepted }">
      <!-- optional: a custom overlay for every drag -->
    </template>
  </DnDProvider>
</template>
```

Todo composable debe ejecutarse en un componente renderizado **dentro** de un provider. El
objetivo es un único provider para toda la app: las partes de la página reciben sus propias reglas
con [`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area). Consulta la [guía del provider](https://zizigy.github.io/docs/guides/provider).

La mayoría de las props se leen cuando el provider las necesita: cambia una y el siguiente
arrastre la usará.

<example height="37rem" hint="Cambia una prop y luego arrastra una tarea: con el ratón, con pulsación larga, con Alt o Mayús, o con Espacio sobre una tarea con el foco" name="api-provider-props">



</example>

### Dónde se renderiza el overlay

`overlayTo` saca el overlay de `body`: a un `<dialog>` modal, que está por encima de todo lo
demás en la página. Desactiva el interruptor y las filas que arrastras desaparecen bajo el dialog.
La [guía del overlay](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto) explica cuándo hace falta.

<example height="22rem" hint="Abre el dialog y arrastra una columna; luego desactiva el interruptor y vuelve a arrastrar" name="overlay-dialog">



</example>

## Props

<api-table name="DnDProviderProps">



</api-table>

## Eventos

<table>
<thead>
  <tr>
    <th>
      Evento
    </th>
    
    <th>
      Payload
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
        drag-start
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      Ha empezado un arrastre (tras su activación).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-move
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      El puntero se ha movido durante un arrastre (como mucho una vez por frame).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-over
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      Ha cambiado el destino bajo el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-end
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
    </td>
    
    <td>
      Un drop se ha completado y se ha escrito.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-cancel
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      El arrastre se ha cancelado o el drop se ha rechazado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-settle
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
      
       o <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      El overlay del arrastre ha aterrizado: lo que recibió <code>
        drag-end
      </code>
      
       o <code>
        drag-cancel
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Los mismos eventos, más `onBeforeDrop` y `onDragResume`, están disponibles en cualquier lugar bajo
el provider con [`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd). Sus payloads están en
[la página de eventos](https://zizigy.github.io/docs/api/events).

## Slot `#overlay`

Renderiza lo que sigue al puntero, para cada arrastre que no tiene un componente de overlay propio
(consulta la [guía del overlay](https://zizigy.github.io/docs/guides/overlay)). Si no renderiza nada, se vuelve al clon.

<api-table name="OverlaySlotProps">



</api-table>

## Teclado

<api-table name="KeyboardOptions">



</api-table>

## Desplazamiento automático

<api-table name="AutoScrollOptions">



</api-table>

## Vibración

<api-table name="HapticsOptions">



</api-table>

## Anuncios

<api-table name="Announcements">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
