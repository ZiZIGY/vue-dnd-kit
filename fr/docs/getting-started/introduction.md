---
title: "Introduction"
description: "Vue DnD Kit, c'est le glisser-déposer pour Vue 3 — listes triables, tableaux kanban, arbres, multi-drag et zones de dépôt, animés et accessibles d'emblée."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/getting-started/introduction"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Vue DnD Kit, c'est le glisser-déposer pour Vue 3. Listes triables, tableaux kanban, arbres,
multi-drag, copie et zones de dépôt — animés, utilisables au clavier et annoncés aux lecteurs
d'écran d'emblée, dans votre propre balisage.

<example height="27rem" hint="Déplacez des étapes d'un jour à l'autre ; les pastilles en dessous nomment les autres gestes" name="at-a-glance" title="En un coup d'œil">



</example>

Rien de tout cela n'est du code propre à la démo : les listes se réordonnent en direct, les
colonnes s'échangent des étapes (un seul `group`), une sélection se déplace d'un bloc
(`selected`), <kbd value="Alt">



</kbd>

 transforme un déplacement en copie (`clone`), et le clavier fait
tout cela d'emplacement en emplacement. La démo rend les étapes et passe quelques options.

## De quoi s'agit-il ?

Un ensemble de **composables** et un seul composant **provider**. Vous rendez vos propres
éléments et passez leurs refs de template aux composables ; la bibliothèque s'occupe du reste :
les entrées au pointeur, tactiles et au clavier, la recherche de la cible, le réordonnancement,
les animations, le défilement automatique et les annonces aux lecteurs d'écran.

```vue [Day.vue]
<script setup lang="ts">
const listRef = useTemplateRef<HTMLElement>('list');
// `items` is the draft: it reorders while you drag. On drop, `day.stops` gets the new order.
const { items } = makeSortableList(listRef, { items: toRef(props.day, 'stops'), group: 'trip' });
</script>

<template>
  <ul ref="list">
    <StopCard v-for="stop in items" :key="stop.id" :stop="stop" />
  </ul>
</template>
```

Elle ne rend rien d'elle-même, sauf un **overlay** flottant — par défaut, un clone de l'élément
en cours de glissement. Votre balisage et vos styles restent les vôtres : la bibliothèque ajoute
des attributs ARIA, et quelques attributs `data-dnd-*` pour styliser les états d'un glissement.

## Ce que vous obtenez

- **Des listes et des grilles triables**, qui se réordonnent en direct pendant le glissement, à
la verticale, à l'horizontale ou en grille.
- **Des listes qui partagent des items** : tableaux kanban, palettes qui distribuent des copies,
échanges, règles sur ce qui va où.
- **Des arbres**, avec imbrication par un glissement de côté ou par survol d'une ligne, limites de
profondeur et règles.
- **Le multi-drag**, avec votre propre sélection (Ctrl/Cmd-clic, rectangle de sélection) : le
bloc se déplace d'un seul tenant.
- **Des zones de dépôt** avec des règles d'acceptation, et des dépôts que vous confirmez, refusez
ou appliquez vous-même.
- **Des animations par défaut** : les items glissent vers leur nouvelle place, le dépôt atterrit
sur son emplacement, une annulation revient à sa place.
- **L'accessibilité** : glissement au clavier par emplacements, annonces en direct, attributs ARIA.
- **Des listes virtuelles** avec TanStack Virtual ou VueUse : des milliers de lignes.
- **Capteurs et actions** : vos propres périphériques d'entrée, et des glissements scriptés depuis
le code.
- **DevTools** : un onglet avec une carte en direct de chaque liste, un joystick et un journal de
chaque glissement.

## Ce qui le distingue

- **Vos données restent les vôtres jusqu'au dépôt.** Vous rendez un *brouillon* de votre
tableau. Pendant le glissement, seul le brouillon bouge ; au dépôt, la bibliothèque écrit le
nouvel ordre dans votre ref, ou vous remet `e.result` pour que vous l'appliquiez vous-même
(stores, serveurs, annulation).
- **Aucun composant d'enveloppe.** Les lignes sont vos éléments, avec une ref et un seul appel :
les composants d'un kit d'UI (Nuxt UI, Vuetify, le vôtre) glissent donc tels quels.
- **Animé par défaut, sans jamais vous gêner.** Les réordonnancements, les atterrissages et les
annulations s'animent d'emblée ; désactivez-les, réglez-les, ou confiez-les à GSAP ou à motion.
- **Le clavier n'est pas une pensée après coup.** Chaque glissement peut se faire avec
<kbd value="Space">



</kbd>

 et les flèches, les déplacements sont annoncés, et le focus revient là où il
était.
- **Un seul provider pour toute l'application.** Les zones donnent à des parties de la page leurs
propres règles (un axe, des limites, une grille, un appui plus long) : des fonctionnalités
imbriquées n'ont donc pas besoin de providers imbriqués.
- **Les entrées sont modulaires.** Le pointeur et le clavier sont des capteurs ; écrivez le vôtre
pour une manette ou une commande vocale, ou déplacez des items depuis le code avec
`@vue-dnd-kit/actions`.

## Comment tout s'articule

<table>
<thead>
  <tr>
    <th>
      Élément
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
        DnDProvider
      </code>
    </td>
    
    <td>
      Gère le glissement : les entrées, l'overlay, la sélection, le défilement automatique, les annonces.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
       / <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      Une liste qui se réordonne, et ses lignes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      Un arbre, rendu à plat avec des profondeurs.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
       / <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      Le glissement libre et les zones de dépôt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      Des règles pour une partie de la page : axe, limites, alignement sur une grille, défilement automatique, activation.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      La sélection par rectangle.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD
      </code>
      
       / <code>
        useDnDMonitor
      </code>
    </td>
    
    <td>
      L'état du glissement et ses événements, n'importe où sous le provider.
    </td>
  </tr>
</tbody>
</table>

<tip>

Vous venez de la v2 ? L'API a changé : `useDnDProvider` est devenu `useDnD`, et
`makeConstraintArea` et `makeAutoScroll` sont devenus `makeDragArea`. Les listes triables sont
désormais intégrées. Voir [migrer depuis la v2](https://zizigy.github.io/docs/getting-started/migrating-from-v2).

</tip>

## Prérequis

- Vue **3.5** ou plus récent.
- Navigateurs modernes : Chrome et Edge 104+, Safari 15.4+, Firefox 104+.
- Compatible avec le SSR et Nuxt : l'overlay et la région live se montent côté client.

Ensuite : [installez-le](https://zizigy.github.io/docs/getting-started/installation), puis créez une première liste dans
le [Démarrage rapide](https://zizigy.github.io/docs/getting-started/quick-start).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
