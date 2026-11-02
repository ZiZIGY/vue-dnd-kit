---
title: "Sensores"
description: "Lo que convierte la entrada en arrastres — los sensores integrados de puntero y de teclado, y la API para escribir los tuyos."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<table>
<thead>
  <tr>
    <th>
      Export
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
        pointerSensor
      </code>
    </td>
    
    <td>
      Ratón, táctil y lápiz mediante Pointer Events. Está en <code>
        sensors
      </code>
      
       por defecto.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      Space/Enter agarran y sueltan, las flechas mueven, Escape cancela. Está en <code>
        sensors
      </code>
      
       por defecto.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defineSensor(sensor)
      </code>
    </td>
    
    <td>
      Tipa un objeto sensor.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useSensor(sensor)
      </code>
    </td>
    
    <td>
      Ejecuta un sensor en un componente bajo el provider, mientras ese componente viva.
    </td>
  </tr>
</tbody>
</table>

Un sensor solo dice «arrastra este ítem desde aquí», luego adónde se ha movido y que se ha soltado o
se ha cancelado; el provider comprueba el resto (qué se puede arrastrar, la activación, un arrastre
a la vez). Consulta [Sensores y arrastres programáticos](https://zizigy.github.io/docs/guides/sensors).

Abajo, un pequeño sensor propio (ejecutado con `useSensor`) arrastra las piezas del tablero desde
su minimapa, junto a los sensores del propio provider.

<example height="28rem" hint="Arrastra un punto del minimapa: su pieza se mueve" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## Activación

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## El arrastre

<api-table name="SensorDrag">



</api-table>

<api-table name="SensorDragState">



</api-table>

<api-table name="SensorStepOptions">



</api-table>

<api-table name="SensorDirection">



</api-table>

<api-table name="SortablePosition">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
