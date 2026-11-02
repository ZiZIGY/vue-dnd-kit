---
title: "Capteurs"
description: "Ce qui transforme les entrées en glissements — les capteurs pointeur et clavier intégrés, et l'API pour écrire les vôtres."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/sensors"
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
      Ce que c'est
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
      Souris, toucher et stylet via les Pointer Events. Présent par défaut dans <code>
        sensors
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      Space/Enter saisissent et déposent, les flèches déplacent, Escape annule. Présent par défaut dans <code>
        sensors
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defineSensor(sensor)
      </code>
    </td>
    
    <td>
      Type un objet capteur.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useSensor(sensor)
      </code>
    </td>
    
    <td>
      Fait tourner un capteur dans un composant sous le provider, pendant toute la durée de vie de ce composant.
    </td>
  </tr>
</tbody>
</table>

Un capteur dit seulement « fais glisser cet item depuis ici », puis où il s'est déplacé et qu'il a
déposé ou a été annulé ; le provider vérifie le reste (ce qui peut être glissé, l'activation, un
glissement à la fois). Voir [Capteurs et glissements programmatiques](https://zizigy.github.io/docs/guides/sensors).

Ci-dessous, un petit capteur personnalisé (lancé avec `useSensor`) fait glisser les pièces du
plateau depuis sa mini-carte, à côté des capteurs propres au provider.

<example height="28rem" hint="Faites glisser un point sur la mini-carte : sa pièce bouge" name="api-sensor-minimap">



</example>

## Capteur

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## Activation

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## Le glissement

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
