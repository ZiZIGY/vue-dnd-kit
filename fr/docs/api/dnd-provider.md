---
title: "DnDProvider"
description: "Le composant qui gère le glissement — les entrées, l'overlay, la sélection, le défilement automatique et la région live — pour tout ce qui est rendu à l'intérieur."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/dnd-provider"
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

Chaque composable doit s'exécuter dans un composant rendu **à l'intérieur** d'un provider. L'objectif
est un seul provider pour toute l'application : des parties de la page reçoivent leurs propres
règles avec [`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area). Voir le [guide du provider](https://zizigy.github.io/docs/guides/provider).

La plupart des props sont lues au moment où le provider en a besoin : changez-en une, et le
glissement suivant l'utilise.

<example height="37rem" hint="Changez une prop, puis faites glisser une tâche : à la souris, en appui long, avec Alt ou Maj, ou avec Espace sur une tâche qui a le focus" name="api-provider-props">



</example>

### Où l'overlay est rendu

`overlayTo` sort l'overlay de `body` : dans un `<dialog>` modal, qui se trouve au-dessus de tout le
reste de la page. Désactivez l'interrupteur, et les lignes que vous faites glisser disparaissent
sous le dialog. Le [guide de l'overlay](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto) explique
quand c'est nécessaire.

<example height="22rem" hint="Ouvrez le dialog et faites glisser une colonne ; puis désactivez l'interrupteur et glissez de nouveau" name="overlay-dialog">



</example>

## Props

<api-table name="DnDProviderProps">



</api-table>

## Événements

<table>
<thead>
  <tr>
    <th>
      Événement
    </th>
    
    <th>
      Payload
    </th>
    
    <th>
      Quand
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
      Un glissement a commencé (après son activation).
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
      Le pointeur a bougé pendant un glissement (au plus une fois par frame).
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
      La cible sous le glissement a changé.
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
      Un dépôt a abouti et a été écrit.
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
      Le glissement a été annulé ou le dépôt refusé.
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
      
       ou <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      L'overlay du glissement a atterri : ce qu'a reçu <code>
        drag-end
      </code>
      
       ou <code>
        drag-cancel
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Les mêmes événements, plus `onBeforeDrop` et `onDragResume`, sont disponibles n'importe où sous le
provider avec [`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd). Leurs payloads sont décrits sur
[la page des événements](https://zizigy.github.io/docs/api/events).

## Slot `#overlay`

Rend ce qui suit le pointeur, pour chaque glissement qui n'a pas son propre composant d'overlay
(voir le [guide de l'overlay](https://zizigy.github.io/docs/guides/overlay)). S'il ne rend rien, le glissement se rabat sur
le clone.

<api-table name="OverlaySlotProps">



</api-table>

## Clavier

<api-table name="KeyboardOptions">



</api-table>

## Défilement automatique

<api-table name="AutoScrollOptions">



</api-table>

## Vibrations

<api-table name="HapticsOptions">



</api-table>

## Annonces

<api-table name="Announcements">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
