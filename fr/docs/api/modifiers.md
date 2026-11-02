---
title: "Modificateurs et collision"
description: "Les fonctions qui changent l'endroit où va l'item glissé, et celles qui choisissent la cible en dessous."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Activez ou désactivez des modificateurs, puis faites glisser le jeton vert" name="api-modifiers">



</example>

## Modificateurs

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Un modificateur prend le décalage du glissement et en renvoie un nouveau. Ils s'exécutent dans
l'ordre : les `modifiers` du provider, ceux d'une zone de glissement, ceux propres à l'élément
déplaçable (ou ceux de sa liste), puis les limites de la zone (`restrictToArea`), et le verrouillage
d'`axis` en dernier. Voir [Axes, limites et grilles](https://zizigy.github.io/docs/guides/constraints).

<table>
<thead>
  <tr>
    <th>
      Modificateur
    </th>
    
    <th>
      Ce qu'il fait
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
      Ne déplace que verticalement. L'option <code>
        axis: 'y'
      </code>
      
       fait la même chose, en dernier. Horizontalement, il reste avec le contenu dans lequel il a commencé (<code>
        containerShift
      </code>
      
      ), quel que soit le défilement de la page.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Ne déplace qu'horizontalement (<code>
        axis: 'x'
      </code>
      
      ), et verticalement reste avec le contenu dans lequel il a commencé.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Garde l'overlay à l'intérieur de la fenêtre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Garde l'overlay à l'intérieur du conteneur où le glissement a commencé : la liste triable, ou l'élément parent d'un élément déplaçable simple.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      Garde l'overlay à l'intérieur d'un élément (une ref, un getter ou l'élément).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Garde l'overlay à l'intérieur du premier ancêtre défilable de l'élément glissé.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      Aligne sur une grille : <code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      . Omettez <code>
        x
      </code>
      
       ou <code>
        y
      </code>
      
       pour n'aligner qu'un seul axe. <code>
        'container'
      </code>
      
       (par défaut) place le coin supérieur gauche de la boîte sur des lignes de grille tracées depuis le coin supérieur gauche du conteneur ; <code>
        'delta'
      </code>
      
       arrondit le décalage, en gardant l'alignement propre à l'item. <code>
        smooth
      </code>
      
       fait glisser l'overlay d'une cellule à l'autre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Centre l'overlay sous le pointeur au lieu de garder le décalage de la saisie.
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Détection de collision

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

La `collision` du provider choisit la cible ; le meilleur candidat vient en premier.

<table>
<thead>
  <tr>
    <th>
      Fonction
    </th>
    
    <th>
      Ce qu'elle choisit
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
      Par défaut : ce qui est sous le pointeur, sinon ce que l'overlay chevauche.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Les cibles sous le pointeur, par test de collision (ordre d'empilement, overlays et shadow roots respectés).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Les cibles qui chevauchent l'overlay : priorité la plus haute, puis imbrication la plus profonde, puis rapport intersection sur union.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Toutes les cibles, par distance entre les centres.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Toutes les cibles, par somme des distances entre les coins (cibles empilées comme les colonnes d'un kanban).
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
