---
title: "Modificadores y colisión"
description: "Las funciones que cambian adónde va el ítem arrastrado, y las que eligen el destino que tiene debajo."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Activa o desactiva modificadores y luego arrastra la ficha verde" name="api-modifiers">



</example>

## Modificadores

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Un modificador recibe el desplazamiento del arrastre y devuelve uno nuevo. Se ejecutan en orden:
los `modifiers` del provider, los de un área de arrastre, los propios del elemento arrastrable (o
los de su lista), luego los límites del área (`restrictToArea`) y, al final, el bloqueo de `axis`.
Consulta [Ejes, límites y cuadrículas](https://zizigy.github.io/docs/guides/constraints).

<table>
<thead>
  <tr>
    <th>
      Modificador
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
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      Solo mueve en vertical. La opción <code>
        axis: 'y'
      </code>
      
       hace lo mismo, al final. En horizontal se queda con el contenido en el que empezó (<code>
        containerShift
      </code>
      
      ), se desplace como se desplace la página.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Solo mueve en horizontal (<code>
        axis: 'x'
      </code>
      
      ), y en vertical se queda con el contenido en el que empezó.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro de la ventana.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro del contenedor donde empezó el arrastre: la lista ordenable, o el elemento padre de un elemento arrastrable simple.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro de un elemento (una ref, un getter o el elemento).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro del primer ancestro desplazable del elemento arrastrado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      Ajusta a una cuadrícula: <code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      . Omite <code>
        x
      </code>
      
       o <code>
        y
      </code>
      
       para ajustar un solo eje. <code>
        'container'
      </code>
      
       (por defecto) pone la esquina superior izquierda de la caja sobre líneas de cuadrícula trazadas desde la esquina superior izquierda del contenedor; <code>
        'delta'
      </code>
      
       redondea el desplazamiento, conservando la alineación propia del ítem. <code>
        smooth
      </code>
      
       desliza el overlay entre celdas.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Centra el overlay bajo el puntero en lugar de mantener el desplazamiento del agarre.
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Detección de colisiones

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

La `collision` del provider elige el destino; el mejor candidato va primero.

<table>
<thead>
  <tr>
    <th>
      Función
    </th>
    
    <th>
      Qué elige
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
      Por defecto: lo que está bajo el puntero o, si no hay nada, lo que solapa el overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Los destinos bajo el puntero, mediante prueba de colisión (respetando el orden z, los overlays y los shadow roots).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Los destinos que solapan el overlay: mayor prioridad, luego anidamiento más profundo, luego intersección sobre unión.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Todos los destinos, por distancia entre centros.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Todos los destinos, por la suma de las distancias entre esquinas (destinos apilados, como las columnas de un kanban).
    </td>
  </tr>
</tbody>
</table>

<api-table name="CollisionDetection">



</api-table>

<api-table name="CollisionArgs">



</api-table>

<api-table name="CollisionCandidate">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
