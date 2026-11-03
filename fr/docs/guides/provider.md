---
title: "Le provider"
description: "DnDProvider gère chaque glissement sous lui. Il trouve la cible, démarre les glissements, fait défiler, et informe useDnD et useDnDMonitor de tout ce qui se passe."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Un seul provider pour l'application

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

Placez un `DnDProvider` tout en haut, dans `App.vue` ou un layout, et n'y pensez plus. Chaque
composable (`makeSortableList`, `makeDraggable`, `useDnD`…) cherche le provider le plus proche
au-dessus du composant dans lequel il s'exécute.

<warning>

Un composable doit s'exécuter dans un composant **rendu à l'intérieur** du provider. L'appeler
dans le composant dont le propre template contient `<DnDProvider>` lève
`No <DnDProvider> found above this component` : l'`inject` de Vue ne voit que les ancêtres.

</warning>

## Ce qu'il gère

<table>
<thead>
  <tr>
    <th>
      Partie
    </th>
    
    <th>
      Ce que fait le provider
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Entrées
    </td>
    
    <td>
      Transforme les entrées au pointeur, tactiles et au clavier en glissements (<code>
        sensors
      </code>
      
      , <code>
        activation
      </code>
      
      ), un glissement à la fois.
    </td>
  </tr>
  
  <tr>
    <td>
      Recherche de la cible
    </td>
    
    <td>
      Teste les collisions avec les cibles de dépôt sous le glissement (<code>
        collision
      </code>
      
      ) et les en informe.
    </td>
  </tr>
  
  <tr>
    <td>
      L'overlay
    </td>
    
    <td>
      Rend la boîte qui suit le pointeur, téléportée dans <code>
        body
      </code>
      
      , et la fait atterrir au dépôt.
    </td>
  </tr>
  
  <tr>
    <td>
      La sélection
    </td>
    
    <td>
      Un seul ensemble d'ids sélectionnés, partagé par toutes les listes et tous les éléments déplaçables sous lui.
    </td>
  </tr>
  
  <tr>
    <td>
      Défilement automatique
    </td>
    
    <td>
      Fait défiler les conteneurs et la fenêtre quand un glissement approche de leurs bords.
    </td>
  </tr>
  
  <tr>
    <td>
      La région live
    </td>
    
    <td>
      Annonce aux lecteurs d'écran les saisies, déplacements, dépôts et annulations.
    </td>
  </tr>
</tbody>
</table>

Il ne rend rien d'autre : votre balisage reste tel quel.

## Les options en un coup d'œil

Chaque option a une valeur par défaut qui fonctionne, le provider n'en reçoit donc généralement
aucune. Le provider lit ses props au moment où il en a besoin : les démos ci-dessous changent
`collision`, `activation` et `autoScroll` en direct.

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Par défaut
    </th>
    
    <th>
      Ce qu'elle règle
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
      Comment la cible sous le glissement est choisie. <a href="#finding-the-target">
        Plus bas
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
      souris 4 px, toucher 200 ms
    </td>
    
    <td>
      Quand un appui devient un glissement, selon le type de pointeur. <a href="#when-a-press-becomes-a-drag">
        Plus bas
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
      activé
    </td>
    
    <td>
      Défilement aux bords : <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       ou <code>
        false
      </code>
      
      . <a href="#auto-scroll">
        Plus bas
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
      une courte vibration à la saisie tactile
    </td>
    
    <td>
      Les vibrations des glissements tactiles, ou <code>
        false
      </code>
      
      . <a href="#haptics-and-the-copy-key">
        Plus bas
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
      La touche qui, maintenue pendant le glissement, transforme un déplacement en copie.
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
      Des règles de mouvement pour chaque glissement : voir les <a href="/docs/guides/constraints">
        contraintes
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
      activée
    </td>
    
    <td>
      Les items qui glissent pendant le tri / l'atterrissage de l'overlay : voir les <a href="/docs/guides/animations">
        animations
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
      désactivée
    </td>
    
    <td>
      Valeur par défaut des listes et des arbres : animer les changements de données qui ne viennent pas d'un glissement.
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
      Touches et pas du clavier ; <code>
        false
      </code>
      
       désactive les glissements au clavier. Voir l'<a href="/docs/guides/accessibility#the-keyboard">
        accessibilité
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
      pointeur + clavier
    </td>
    
    <td>
      Ce qui transforme les entrées en glissements : voir les <a href="/docs/guides/sensors">
        capteurs
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
      Où l'overlay est téléporté.
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
      La taille de l'overlay : celle de l'emplacement où il va atterrir, ou celle de la source. Voir l'<a href="/docs/guides/overlay">
        overlay
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
      un fondu enchaîné
    </td>
    
    <td>
      La façon dont l'overlay passe d'un composant à un autre en plein glissement : <code>
        false
      </code>
      
      , ou des props de <code>
        <Transition>
      </code>
      
      . Voir les <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        cibles qui changent l'overlay
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
      Les classes du contenu de l'overlay (<code>
        [data-dnd-overlay-content]
      </code>
      
      ), l'élément à animer d'un bloc : un soulèvement à la saisie, une remise à plat à l'atterrissage. Voir <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        l'overlay : soulever, incliner, reposer
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
      Multi-drag : combien d'items glissés reçoivent un clone à la saisie, ou <code>
        'all'
      </code>
      
      . Voir l'<a href="/docs/guides/multi-drag#the-default-overlay">
        overlay par défaut
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
      intégrées
    </td>
    
    <td>
      Les textes pour les lecteurs d'écran, ou <code>
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
      intégré
    </td>
    
    <td>
      Le texte vers lequel chaque élément déplaçable pointe avec <code>
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
      Injecte un CSS de spécificité nulle pour les états de glissement : voir le <a href="/docs/guides/styling">
        style
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

La liste complète, avec toutes les formes, se trouve dans l'[API de DnDProvider](https://zizigy.github.io/docs/api/dnd-provider).
Le provider émet aussi `drag-start`, `drag-move`, `drag-over`, `drag-end`, `drag-cancel`,
`drag-resume` et `drag-settle`, les mêmes événements que ceux qu'entend `useDnDMonitor`.

## Lire le glissement : `useDnD()`

<example height="27rem" hint="Faites glisser une tâche et observez l'état" name="provider-state">



</example>

`useDnD()` renvoie le glissement sous forme d'état réactif, dans n'importe quel composant sous le
provider :

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      Champ
    </th>
    
    <th>
      Ce qu'il contient
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
      
       (un appui qui attend son activation), <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       (aucun glissement en cours, mais un overlay atterrit encore, ou un <code>
        onBeforeDrop
      </code>
      
       asynchrone décide), <code>
        'selecting'
      </code>
      
       (un rectangle de sélection).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      Ce qui est glissé : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
       (tous les ids glissés, en commençant par celui qui a été saisi), <code>
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
      
       au repos.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      La cible sous le glissement : <code>
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
      
       et <code>
        accepted
      </code>
      
      . <code>
        null
      </code>
      
       au-dessus de rien.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      Le pointeur en coordonnées du viewport, après les modificateurs.
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
      
       à <code>
        1
      </code>
      
       pendant qu'un appui attend son activation : dessinez un anneau avec.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      Le défilement automatique fait défiler quelque chose.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      La sélection du provider : <code>
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
      
      . Voir le <a href="/docs/guides/multi-drag">
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
      Annule le glissement en cours (les items reviennent à leur place), un appui en attente ou un rectangle de sélection.
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

Dès qu'un dépôt est décidé, `active`, `over` et `pointer` valent `null`, même pendant que
l'overlay atterrit encore (`status` vaut `'dropping'`). Une UI dérivée de ces valeurs n'affiche
jamais l'ancien glissement à côté des nouvelles données. Pendant qu'un `onBeforeDrop` asynchrone
attend, l'état reste tel qu'il était au relâchement.

Le glissement suivant n'attend pas la fin d'un atterrissage : il démarre aussitôt, et `status`
vaut `'dragging'` pendant que le dernier overlay atterrit autour de lui. Un appui sur un overlay
en train d'atterrir le rattrape en plein vol : le glissement reprend là où se trouve l'overlay.
`onDragSettle` indique quand l'overlay d'un glissement est arrivé à destination.

## Écouter chaque glissement : `useDnDMonitor()`

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

Un moniteur entend chaque glissement sous son provider, où qu'il commence : le panneau ci-dessus
journalise les glissements de la liste sans l'importer. Il s'arrête quand le composant qui l'a
appelé est démonté.

<table>
<thead>
  <tr>
    <th>
      Événement
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
        onDragStart
      </code>
    </td>
    
    <td>
      Un glissement commence.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      Le glissement bouge.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      La cible sous le glissement change.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Le glissement est relâché. Sa réponse décide du dépôt : voir les <a href="/docs/guides/drop-decisions">
        décisions de dépôt
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
      Le dépôt a abouti. Les listes triables ont déjà exécuté leur <code>
        onDrop
      </code>
      
       et écrit le nouvel ordre. <code>
        dropped
      </code>
      
       vaut <code>
        false
      </code>
      
       quand le glissement s'est terminé au-dessus d'aucune cible.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Escape, un dépôt sur une cible qui le refuse, ou un <code>
        onBeforeDrop
      </code>
      
       qui a répondu <code>
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
      
       a répondu <code>
        'continue'
      </code>
      
       : rien n'a été déposé, et le glissement continue.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      L'overlay du glissement a atterri (ou est revenu à sa place, ou a été rattrapé par le glissement suivant), avec l'événement qu'a reçu <code>
        onDragEnd
      </code>
      
       ou <code>
        onDragCancel
      </code>
      
      . D'autres glissements ont pu démarrer entre-temps.
    </td>
  </tr>
</tbody>
</table>

Chaque événement transporte `active`, `over`, `pointer`, `delta` (le décalage depuis le début),
`position` (où se trouve la boîte glissée dans `over`, voir
[glisser-déposer](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)) et, pour les items
d'une liste triable, `source`. Les formes complètes se trouvent dans l'[API des événements](https://zizigy.github.io/docs/api/events).

<note>

`onDragEnd` est l'endroit pour le travail « après le dépôt » : sauvegarde, effacement de la
sélection, analytics. Le `onDrop` propre à une liste s'exécute **avant** son écriture, il voit
donc encore l'ancien ordre.

</note>

## Trouver la cible

Choisissez une fonction, puis faites glisser l'épingle ou la carte au-dessus des cibles. Les
badges montrent comment la fonction les classe sur cette frame ; la verte est la cible.

<example height="33rem" hint="Changez de fonction, glissez au-dessus des cibles imbriquées, petites et superposées" name="collision-lab">



</example>

À chaque frame d'un glissement, le provider donne à `collision` les cibles de dépôt en jeu, et
elle renvoie leurs ids, la meilleure en premier. Cinq fonctions sont fournies avec la bibliothèque :

<table>
<thead>
  <tr>
    <th>
      Fonction
    </th>
    
    <th>
      Classe
    </th>
    
    <th>
      Idéale pour
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
      Ce qui est sous le pointeur ; quand il n'y a rien, ce que chevauche la boîte glissée.
    </td>
    
    <td>
      La valeur par défaut : précise sous le pointeur, tolérante dans les interstices.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Uniquement ce qui est sous le pointeur, la plus intérieure en premier.
    </td>
    
    <td>
      Des cibles précises : un interstice ne dépose nulle part.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Chaque cible que chevauche la boîte glissée : la <code>
        priority
      </code>
      
       la plus haute, puis l'imbrication la plus profonde, puis le plus grand chevauchement.
    </td>
    
    <td>
      De gros items au-dessus de petites cibles, quand le pointeur est au bord de l'item.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Chaque cible, selon la distance entre le centre de la boîte et le leur.
    </td>
    
    <td>
      Quelque chose gagne toujours, même de loin : grilles et listes d'items de même taille.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Chaque cible, selon les distances entre les quatre coins.
    </td>
    
    <td>
      Des colonnes côte à côte (kanban), des cibles de hauteurs très différentes.
    </td>
  </tr>
</tbody>
</table>

Sous le pointeur, le test de collision respecte ce que voit l'utilisateur : parmi des cibles
superposées, seule celle du dessus est touchée (`front`, jamais `back` là où elles se
chevauchent), et parmi des cibles imbriquées, la plus intérieure vient en premier (`subfolder`,
puis `folder`).

### Votre propre fonction

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
      Argument
    </th>
    
    <th>
      Ce qu'il contient
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
      Le pointeur, après les modificateurs.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      La boîte glissée telle qu'elle est affichée, <code>
        null
      </code>
      
       sans overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      Chaque cible en jeu : <code>
        id
      </code>
      
      , <code>
        rect
      </code>
      
       (sa partie visible, rognée par les conteneurs défilants), <code>
        priority
      </code>
      
      , <code>
        depth
      </code>
      
       (<code>
        0
      </code>
      
       au sommet, plus profond quand elle est imbriquée).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      Les cibles sous le pointeur, issues du test de collision, la meilleure en premier.
    </td>
  </tr>
</tbody>
</table>

Renvoyez un tableau vide pour « aucune cible ». Les cibles désactivées, les cibles à l'intérieur
des items glissés et les cibles masquées par leurs conteneurs défilants n'atteignent jamais la
fonction. Une cible qui refuse le glissement reste en compétition : au-dessus d'elle,
`over.accepted` vaut `false` et un dépôt est refusé (une cible à l'intérieur d'un item triable
s'efface plutôt, pour que la liste se trie au-dessus d'elle). La démo enveloppe la fonction
choisie pour enregistrer son classement : `(args) => (ranked.value = detect(args))`.

<note>

Le provider amortit les changements que demande la fonction. Une cible que le glissement vient
de quitter ne peut pas regagner avant que le pointeur ait bougé de 10 px, pour que les frontières
ne clignotent pas. Entre les cibles imbriquées dans un parent (les interstices d'une colonne de
cartes), la dernière cible reste.

</note>

## Quand un appui devient un glissement

Un appui ne glisse pas tout de suite. `activation` règle, pour chaque type de pointeur (`mouse`,
`touch`, `pen`), ce qu'il attend : une `distance` en px, un `delay` en ms (avec une `tolerance`
au-delà de laquelle l'appui abandonne, pour que la page puisse défiler), ou la première des deux.

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      Pointeur
    </th>
    
    <th>
      Par défaut
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
      
       : un clic reste un clic. Un appui de souris sur une poignée (<code>
        handle
      </code>
      
      ) démarre tout de suite, et reste un clic s'il ne bouge pas.
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
      
       : un appui long, pour que les listes continuent de défiler sous le doigt.
    </td>
  </tr>
</tbody>
</table>

Un type que vous omettez garde sa valeur par défaut. L'`activation` propre à un élément
déplaçable l'emporte sur celle d'une [zone de glissement](https://zizigy.github.io/docs/guides/constraints), qui
l'emporte sur celle du provider. Pendant qu'un appui attend, `useDnD().status` vaut
`'activating'` et `activation.progress` va de `0` à `1` ; Escape ou `useDnD().cancel()`
l'abandonne. Essayez les contraintes en direct, et dessinez un anneau d'appui long à partir de la
progression, dans les [capteurs](https://zizigy.github.io/docs/guides/sensors#activation-constraints).

## Défilement automatique

Faites glisser un canal vers le haut ou le bas de la liste. Les bandes vertes sont les zones de
bord : plus vous y entrez profondément, plus la liste défile vite.

<example height="37.5rem" hint="Faites glisser un canal dans les bandes vertes" name="auto-scroll-edges">



</example>

Tout élément avec `overflow: auto` ou `scroll` défile tout seul, et la fenêtre aussi. Le provider
fait d'abord défiler le conteneur sous le pointeur, puis ses ancêtres, puis la fenêtre.

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Par défaut
    </th>
    
    <th>
      Ce qu'elle règle
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
      La zone de bord, en fraction de la taille du conteneur, entre 24 et 96 px.
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
      La vitesse tout au bord, en px par frame. Elle croît avec le carré de la profondeur dans la zone : le départ est donc lent et précis.
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
      La vitesse maximale. Au-delà du bord (le pointeur hors du conteneur), la vitesse continue de croître jusqu'à elle.
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` le désactive. Une direction ne défile qu'une fois que le pointeur a bougé
dans ce sens : un item saisi près d'un bord ne défile donc pas tout seul. Les listes, les arbres
et les [zones de glissement](https://zizigy.github.io/docs/guides/constraints) prennent leur propre `autoScroll` pour leur
conteneur :

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

Les glissements au clavier ne déclenchent jamais le défilement automatique : ils font défiler
l'item pour le rendre visible. `isAutoScrolling` (de `useDnD()`, ou d'une zone de glissement)
vaut `true` pendant que quelque chose défile.

## Vibrations et touche de copie

Un glissement tactile vibre brièvement quand il commence. `:haptics="false"` le désactive ; un
objet règle chaque vibration :

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      Clé
    </th>
    
    <th>
      Vibre quand
    </th>
    
    <th>
      Par défaut
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
      L'appui long devient un glissement.
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
      Le glissement entre dans une cible qui l'accepte.
    </td>
    
    <td>
      désactivé
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      Le dépôt aboutit.
    </td>
    
    <td>
      désactivé
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      Le dépôt est refusé et les items reviennent à leur place.
    </td>
    
    <td>
      désactivé
    </td>
  </tr>
</tbody>
</table>

Chacune prend `true` (le motif par défaut), une durée en ms, un motif marche/arrêt, ou `false`.
Seuls les glissements commencés au toucher vibrent, et Safari sur iOS ne peut pas vibrer du tout.

`copyModifier` est la touche qui, maintenue pendant un glissement entre des listes, transforme le
déplacement en copie : `'Alt'` par défaut, n'importe quelle `KeyboardEvent.key`, ou `null` pour
aucune. La liste d'où viennent les items a besoin d'une fonction `clone` ; voir les
[listes qui partagent des items](https://zizigy.github.io/docs/guides/shared-lists).

## Plusieurs providers

La plupart des applications en ont besoin d'un seul. Placez la liste de souhaits sous son propre
provider, puis essayez d'y déplacer un livre : il ne peut pas quitter son provider, et le
moniteur extérieur n'entend plus la liste de souhaits.

<example height="33.5rem" hint="Déplacez un livre de l'autre côté, puis donnez son propre provider à la liste de souhaits" name="provider-nested">



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

- Les providers sont indépendants : un glissement ne passe jamais de l'un à l'autre.
- Les providers imbriqués sont autorisés. **Le propriétaire le plus proche l'emporte** : un item
appartient au provider le plus proche au-dessus de lui, et le provider extérieur l'ignore.
- Chaque provider a sa propre sélection, son propre overlay, sa propre région live et ses propres
moniteurs.

Un second provider n'a de sens que pour une partie de la page qui a besoin de ses propres
réglages à l'échelle du provider (collision, touches du clavier, annonces) et dont les items n'en
sortent jamais. Si des items ne peuvent pas passer d'une partie de votre page à une autre,
vérifiez qu'ils ne se trouvent pas sous deux providers.

<tip>

Des règles pour une partie de la page (un tableau qui s'aligne sur une grille, un fil avec un
appui tactile plus long, un panneau où rien ne glisse) ne nécessitent pas leur propre provider :

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

Ses items restent dans le provider de l'application et peuvent toujours aller n'importe où. Voir
les [contraintes](https://zizigy.github.io/docs/guides/constraints).

</tip>

Une application montée ailleurs, dans un shadow root ou comme application Vue séparée, peut
rejoindre un provider existant : passez `useDnDContext()` à `provideDnDContext(app, context)`
avant de la monter. Le test de collision et l'overlay fonctionnent à travers les shadow roots.

## SSR et Nuxt

Le provider est compatible SSR. Les listes et les items sont rendus sur le serveur comme
n'importe quel autre balisage. L'overlay et la région live sont téléportés et se montent
uniquement côté client : ils ne provoquent donc jamais d'erreur d'hydratation. Les ids par
défaut viennent du `useId()` de Vue et sont identiques sur le serveur et le client.

Dans Nuxt, le module enregistre `DnDProvider` globalement et importe automatiquement les
composables : voir l'[installation](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
