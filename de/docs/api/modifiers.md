---
title: "Modifier und Kollisionserkennung"
description: "Funktionen, die ändern, wohin das gezogene Element geht, und solche, die das Ziel darunter wählen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Schalte Modifier um, dann ziehe den grünen Token" name="api-modifiers">



</example>

## Modifier

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Ein Modifier nimmt den Versatz des Drags entgegen und gibt einen neuen zurück. Sie laufen in
dieser Reihenfolge: die `modifiers` des Providers, die eines Drag-Bereichs, die eigenen des
ziehbaren Elements (oder die seiner Liste), dann die Grenzen des Bereichs (`restrictToArea`) und
zuletzt die `axis`-Sperre. Siehe [Achsen, Grenzen und Raster](https://zizigy.github.io/docs/guides/constraints).

<table>
<thead>
  <tr>
    <th>
      Modifier
    </th>
    
    <th>
      Was er macht
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
      Bewegung nur vertikal. Die Option <code>
        axis: 'y'
      </code>
      
       tut dasselbe, aber zuletzt. Horizontal bleibt es beim Inhalt, in dem es gestartet ist (<code>
        containerShift
      </code>
      
      ), wie auch immer die Seite scrollt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Bewegung nur horizontal (<code>
        axis: 'x'
      </code>
      
      ); vertikal bleibt es beim Inhalt, in dem es gestartet ist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Hält das Overlay innerhalb des Fensters.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Hält das Overlay innerhalb des Containers, in dem der Drag begonnen hat: der sortierbaren Liste oder des Elternelements eines einfachen ziehbaren Elements.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      Hält das Overlay innerhalb eines Elements (ein Ref, ein Getter oder das Element selbst).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Hält das Overlay innerhalb des ersten scrollbaren Vorfahren des gezogenen Elements.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      Rastet an einem Raster ein: <code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      . Lass <code>
        x
      </code>
      
       oder <code>
        y
      </code>
      
       weg, um nur auf einer Achse einzurasten. <code>
        'container'
      </code>
      
       (Standard) legt die linke obere Ecke der Box auf Rasterlinien, die an der linken oberen Ecke des Containers beginnen; <code>
        'delta'
      </code>
      
       rundet den Versatz und behält die eigene Ausrichtung des Elements. <code>
        smooth
      </code>
      
       lässt das Overlay zwischen den Zellen gleiten.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Zentriert das Overlay unter dem Zeiger, statt den Greifversatz beizubehalten.
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Kollisionserkennung

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

Die Option `collision` des Providers wählt das Ziel; der beste Kandidat kommt zuerst.

<table>
<thead>
  <tr>
    <th>
      Funktion
    </th>
    
    <th>
      Was sie wählt
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
      Standard: was unter dem Zeiger liegt, sonst das, was das Overlay überlappt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Ziele unter dem Zeiger, per Hit-Testing (z-Reihenfolge, Overlays und Shadow Roots werden berücksichtigt).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Ziele, die das Overlay überlappen: höhere Priorität, dann tiefere Verschachtelung, dann Intersection over Union.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Jedes Ziel, nach dem Abstand zwischen den Mittelpunkten.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Jedes Ziel, nach der Summe der Abstände zwischen den Ecken (übereinanderliegende Ziele wie Kanban-Spalten).
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
