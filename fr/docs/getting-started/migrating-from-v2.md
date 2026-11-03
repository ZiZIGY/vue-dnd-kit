---
title: "Migrer depuis la v2"
description: "Passez une application de la v2 à la v3 — ce qui a changé et pourquoi, la mise à jour, une correspondance de chaque API v2 vers son remplaçant en v3, du code avant et après pour les cas courants, et les pièges."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

La v3 est une réécriture de la v2. Le modèle reste : un provider, et des composables que vous appelez
sur vos propres éléments. Mais la plupart des noms et des options ont changé, le tri est passé dans
la bibliothèque, et le handler de dépôt que vous écriviez pour chaque liste disparaît. Cette page
fait correspondre chaque partie de la v2 à la v3, puis montre les cas courants avant et après.

## Ce qui a changé

- **Le tri est intégré.** En v2, une liste était une zone de dépôt, ses lignes étaient des éléments
déplaçables avec un payload `[index, items]`, et vous triiez dans `onDrop` avec
`e.helpers.suggestSort()`. En v3, `makeSortableList` et `makeSortableItem` s'en chargent : la liste
rend un **brouillon** de votre tableau qui se réordonne pendant le glissement, et le dépôt écrit le
nouveau tableau dans votre ref. La plupart des handlers de dépôt de la v2 sont supprimés, pas
portés.
- **Les choses bougent toutes seules.** Les lignes glissent vers leurs nouvelles places (FLIP),
l'overlay atterrit sur son emplacement au dépôt et revient à sa place à l'annulation.
`<TransitionGroup>` disparaît.
- **Toujours un seul paquet.** `@vue-dnd-kit/core` contient les listes, les arbres, le multi-drag,
les modificateurs, les capteurs et les fonctions de collision. Le module Nuxt reste ;
`@vue-dnd-kit/actions` (glissements programmatiques) et `@vue-dnd-kit/devtools` sont nouveaux et
optionnels.
- **Un vrai overlay.** Il est téléporté dans `body` et montre un clone profond, à la taille de
l'emplacement où il va atterrir. Les composants d'overlay reçoivent le glissement en props au lieu
de lire les rouages internes du provider.
- **Des ids, pas des éléments.** La sélection, les événements et l'état du glissement sont indexés
par des ids issus de vos données. Il n'y a plus de maps d'éléments du DOM à lire.
- **Les types et les règles d'acceptation** remplacent `groups` pour les éléments déplaçables
simples et les cibles. Les listes échangent des items par le nom de leur `group`.
- **Des décisions avant le dépôt.** `onBeforeDrop` accepte, refuse, laisse le glissement continuer
ou ne prend qu'une partie des items. `onDrop` ne fait qu'appliquer.
- **Des capteurs.** Les entrées au pointeur et au clavier sont des capteurs. L'activation se règle
par type de pointeur, et les glissements tactiles commencent par un appui long, si bien que les
listes continuent de défiler sous le doigt.
- **Des zones.** `makeDragArea` remplace `makeConstraintArea` et `makeAutoScroll`, et le défilement
automatique fonctionne dans chaque conteneur défilable sans code.
- **L'accessibilité est activée par défaut** : attributs ARIA, un focus qui revient après le dépôt,
et des annonces pour les lecteurs d'écran.

## Mise à jour

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
      Paquet
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
      1.x, optionnel
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
      3.x, optionnel
    </td>
  </tr>
</tbody>
</table>

- Une application qui a `"@vue-dnd-kit/core": "^2…"` dans son `package.json` reste en v2 tant que la
plage de versions n'indique pas `^3`.
- Vue **3.5** ou plus récent. La v2 n'avait aucune dépendance ; la v3 en a une, `@vueuse/core` (14
ou 15).
- Navigateurs : Chrome et Edge 104+, Safari 15.4+, Firefox 104+.
- La v2 et la v3 partagent un nom de paquet, donc une application passe à la v3 d'un seul coup. Il
n'y a pas de couche de compatibilité. La documentation de la v2 reste disponible depuis le menu
des versions en haut de la page.

Un bon ordre de travail :

1. Mettez à jour les paquets et renommez les props du provider ([plus bas](#the-provider)).
2. Transformez chaque liste triable en `makeSortableList` et `makeSortableItem`, et supprimez son
handler de dépôt.
3. Portez les éléments déplaçables simples et les zones de dépôt.
4. Portez les aperçus personnalisés vers des composants d'overlay ou le slot `#overlay` du provider.
5. Remplacez `makeConstraintArea` et `makeAutoScroll` par `makeDragArea`, ou par rien.
6. Supprimez les contournements de la v2 : `tabindex` et `aria-grabbed` sur les éléments
déplaçables, `touch-action: none` sur des items entiers, `<TransitionGroup>` autour des lignes,
`markRaw` autour des composants d'aperçu.

## De l'ancien au nouveau

**Pas d'équivalent** dans un tableau signifie que la v3 n'a rien de ce nom ; la cellule indique quoi
utiliser à la place.

### En un coup d'œil

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
      
      , avec de nouvelles props et un slot <code>
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
      
       pour le glissement libre ; <code>
        makeSortableItem
      </code>
      
       pour les lignes d'une liste.
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
      
       pour les cibles de dépôt simples ; <code>
        makeSortableList
      </code>
      
       ou <code>
        makeSortableTree
      </code>
      
       pour les listes et les arbres.
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
      Rien : le défilement automatique est automatique. <code>
        makeDragArea
      </code>
      
       ou l'<code>
        autoScroll
      </code>
      
       d'une liste le règlent.
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
      
       pour l'état, <code>
        useDnDMonitor
      </code>
      
       pour les événements.
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
      
       et <code>
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
      
       : désormais le clone d'un item glissé, pour vos propres overlays.
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
      Le modificateur <code>
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
      Intégrés aux listes : voir <a href="#sorting">
        le tri
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Le provider

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
      
      , désactivé sauf si défini
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
       : <strong>
        activé par défaut
      </strong>
      
      , pour la fenêtre et chaque conteneur défilable. <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
      , ou <code>
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
      
      , rendu par défaut à l'intérieur du provider
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
       : un sélecteur ou un élément, <code>
        'body'
      </code>
      
       par défaut.
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
      
      , avec le glissement en props : <code>
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
      
      . Voir <a href="#the-overlay">
        l'overlay
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
      
       (définis sur <code>
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
      
       : 25 px par défaut, pour les glissements libres.
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
        Pas d'équivalent.
      </strong>
      
       Les flèches déplacent ; <kbd value="Shift">
        
      </kbd>
      
       rend les pas d'un glissement libre quatre fois plus grands.
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
        Pas d'équivalent.
      </strong>
      
       <code>
        collision
      </code>
      
       choisit comment la cible est trouvée : <code>
        pointerFirst
      </code>
      
       (par défaut), <code>
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
      
       ou une fonction à vous.
    </td>
  </tr>
  
  <tr>
    <td>
      Un provider par page, jamais imbriqué
    </td>
    
    <td>
      L'imbrication fonctionne : le provider le plus proche gère un item. Un seul provider pour toute l'application reste l'objectif.
    </td>
  </tr>
</tbody>
</table>

Nouvelles props sans équivalent en v2 : `activation`, `modifiers`, `sensors`, `animation`,
`dropAnimation`, `animateChanges`, `haptics`, `copyModifier`, `overlayFit`, `overlayClass`,
`overlayTransition`, `overlayPreviews`, `announcements`, `screenReaderInstructions` et
`defaultStyles`. Le provider émet aussi `drag-start`, `drag-move`, `drag-over`, `drag-end`,
`drag-cancel`, `drag-resume` et `drag-settle`. Tout cela se trouve dans le [guide du provider](https://zizigy.github.io/docs/guides/provider).

### Lire l'état : `useDnD`

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
      
       ou <code>
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
      
       ou <code>
        'selecting'
      </code>
      
      . <code>
        'pending'
      </code>
      
       (un dépôt asynchrone) devient <code>
        'dropping'
      </code>
      
       ; <code>
        null
      </code>
      
       devient <code>
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
      
      , après les modificateurs. Chaque événement a aussi <code>
        delta
      </code>
      
      , le décalage depuis le début.
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
      
       (éléments)
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
       (ids) : <code>
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
      
       à <code>
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
        Pas d'équivalent.
      </strong>
      
       La bibliothèque place et dimensionne l'overlay. Utilisez <code>
        overlayTo
      </code>
      
      , le slot <code>
        #overlay
      </code>
      
       ou des composants d'overlay.
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
      
      , les <code>
        visible…Set
      </code>
      
      , <code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        Pas d'équivalent.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nouveau : <code>
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

Les événements sont passés à `useDnDMonitor` : voir [événements et décisions de dépôt](#events-and-drop-decisions).
Les formes complètes sont dans l'[API de useDnD](https://zizigy.github.io/docs/api/use-dnd).

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
      
       : pas de troisième argument. Les lignes d'une liste utilisent <code>
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
      
      , nécessaire dans les listes virtuelles
    </td>
    
    <td>
      <code>
        id
      </code>
      
       : passez-le depuis vos données, en getter. La valeur par défaut vient de <code>
        useId()
      </code>
      
       et change à chaque instance du composant.
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
      
       : une valeur, une ref ou un getter. Relu sous la forme <code>
        active.data
      </code>
      
       et <code>
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
      
      , comparé à l'<code>
        accept
      </code>
      
       des cibles. Voir <a href="#groups">
        les groupes
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
      
       : un sélecteur ou une ref d'élément.
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
      
       : un filtre pour chaque appui.
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
      
       par type de pointeur : <code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      . Avec <code>
        distance
      </code>
      
       et <code>
        delay
      </code>
      
       ensemble, le glissement commence au premier des deux atteint.
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
        Pas d'équivalent.
      </strong>
      
       Une <code>
        distance
      </code>
      
       par type de pointeur.
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
      
       : le composant reçoit le glissement en props. Voir <a href="#the-overlay">
        l'overlay
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
        Pas d'équivalent.
      </strong>
      
       Une cible de dépôt sur un item triable compte dans son milieu (de 25 à 75 %) ; les arbres imbriquent avec <code>
        nesting: 'hover'
      </code>
      
      . Voir <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        déposer dans un item triable
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
        Pas d'équivalent
      </strong>
      
       sur l'élément déplaçable : <code>
        useDnDMonitor
      </code>
      
      , ou <code>
        watch(isDragging)
      </code>
      
      . Voir <a href="#events-and-drop-decisions">
        les événements
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
      
      , et son <code>
        onDragStart
      </code>
      
      … pour les glissements qui le survolent
    </td>
    
    <td>
      Un <code>
        makeDroppable
      </code>
      
       sur le même élément : <code>
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
      Renvoie <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
    </td>
    
    <td>
      Pareil.
    </td>
  </tr>
  
  <tr>
    <td>
      Renvoie <code>
        isDragOver
      </code>
    </td>
    
    <td>
      Les items triables renvoient <code>
        indicator
      </code>
      
       (avec <code>
        placeholder: 'indicator'
      </code>
      
      ) et <code>
        isPlaceholder
      </code>
      
       ; les cibles renvoient <code>
        placement
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Renvoie <code>
        isAllowed
      </code>
    </td>
    
    <td>
      <strong>
        Pas d'équivalent
      </strong>
      
       sur les éléments déplaçables. Les cibles renvoient <code>
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
      Nouveau : <code>
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
      
       avec le <code>
        transform
      </code>
      
       renvoyé, <code>
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
      
      . Une zone qui contient une liste est un <code>
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
      
      , un type, une liste de types ou une fonction.
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
      
       : des options à part entière, sans objet <code>
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
      
      , qui pouvait renvoyer <code>
        false
      </code>
      
       ou une promesse
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       décide, <code>
        onDrop
      </code>
      
       applique. Voir <a href="#events-and-drop-decisions">
        les décisions de dépôt
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
      
      , qui renvoie les ids à garder.
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
      
      , relu sous la forme <code>
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
      Renvoie <code>
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
      Renvoie <code>
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
      
       (un booléen), et <code>
        placement
      </code>
      
       : <code>
        { top, right, bottom, left }
      </code>
      
      , les moitiés où se trouve le pointeur. Il n'y a pas de <code>
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
      Nouveau : <code>
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
      
       (des fichiers de l'ordinateur).
    </td>
  </tr>
</tbody>
</table>

### L'événement de dépôt

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
      
       pour chacun, en commençant par celui qui a été saisi. Les listes reçoivent <code>
        e.items
      </code>
      
       et <code>
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
      Listes : <code>
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
      
      . Listes : <code>
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
        Pas d'équivalent
      </strong>
      
       : les listes calculent <code>
        e.to.index
      </code>
      
       elles-mêmes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      Les listes écrivent le dépôt ; <code>
        e.result
      </code>
      
       contient le nouveau tableau de chaque liste qu'il modifie.
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
      
       sur la liste ; <code>
        e.partner
      </code>
      
       est l'item avec lequel l'échange a eu lieu.
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
      
       ou la touche de copie (<kbd value="Alt">
        
      </kbd>
      
      ), avec le <code>
        clone
      </code>
      
       de la liste ; <code>
        e.mode
      </code>
      
       vaut <code>
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
      
       dans une cible de dépôt, ou le <code>
        dropOutside: 'remove'
      </code>
      
       de la liste.
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
        Pas d'équivalent.
      </strong>
      
       Les listes n'en ont pas besoin ; pour une cible simple, modifiez vos données comme vous le voulez.
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
      Nouveau : <code>
        e.pointer
      </code>
      
      , <code>
        e.delta
      </code>
      
      , <code>
        e.position
      </code>
      
       (où placer un item déposé sur un tableau), <code>
        e.mode
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Le tri

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
      Une liste <code>
        makeDroppable
      </code>
      
       avec <code>
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
      Une ligne <code>
        makeDraggable
      </code>
      
       avec <code>
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
      Rendre votre tableau
    </td>
    
    <td>
      Rendre les <code>
        items
      </code>
      
       renvoyés : le brouillon qui se réordonne pendant le glissement.
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
      
       (par défaut), <code>
        'horizontal'
      </code>
      
       ou <code>
        'grid'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Des comparaisons d'identité pour trouver les tableaux source et cible, puis l'affectation de <code>
        sourceItems
      </code>
      
       et <code>
        targetItems
      </code>
    </td>
    
    <td>
      Rien : le dépôt écrit chaque liste qu'il modifie.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      Intégré. <code>
        animateChanges: true
      </code>
      
       anime les changements qui ne viennent pas d'un glissement (ajout, suppression, mélange).
    </td>
  </tr>
  
  <tr>
    <td>
      Une ligne d'insertion tirée de <code>
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
      
       et l'<code>
        indicator.side
      </code>
      
       de l'item. Voir <a href="/docs/guides/sortable-lists#an-insertion-line">
        une ligne d'insertion
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
      Une palette qui ne fait que copier (<code>
        suggestCopy()
      </code>
      
       et un drapeau <code>
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
      
       et <code>
        clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Une corbeille avec <code>
        suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
      , ou <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia ou des données immuables : affecter le résultat vous-même
    </td>
    
    <td>
      <code>
        items
      </code>
      
       en getter, puis <code>
        e.preventDefault()
      </code>
      
       dans <code>
        onDrop
      </code>
      
      , et appliquer <code>
        e.result
      </code>
      
      . Voir <a href="/docs/guides/shared-lists#controlled-lists">
        les listes contrôlées
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un arbre récursif : un droppable par dossier et <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
       : un seul conteneur, des lignes rendues à plat avec leur profondeur. Voir <a href="/docs/guides/trees">
        les arbres
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Des groupes imbriqués avec <code>
        v-model
      </code>
      
       (un droppable par groupe)
    </td>
    
    <td>
      Une liste dans une liste, toutes dans un même <code>
        group
      </code>
      
      , chacune avec <code>
        items: defineModel()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Listes virtuelles : <code>
        id
      </code>
      
       sur chaque élément déplaçable
    </td>
    
    <td>
      Donnez le brouillon au virtualiseur, <code>
        id: () => props.item.id
      </code>
      
       sur les lignes. Voir <a href="/docs/guides/virtual-lists">
        les listes virtuelles
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Le code avant et après se trouve [plus bas](#a-sortable-list). Tout sur les listes se trouve dans
[listes triables](https://zizigy.github.io/docs/guides/sortable-lists) et [listes qui partagent des items](https://zizigy.github.io/docs/guides/shared-lists).

### Les groupes

La v2 avait une seule option `groups` pour tout. La v3 la sépare en deux :

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
      
       sur une zone
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
      , ou une fonction : <code>
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
      
      , ou rien
    </td>
    
    <td>
      <code>
        type
      </code>
      
       ou <code>
        accept
      </code>
      
       omis. Les règles de la v2 tiennent : un élément déplaçable sans type correspond à n'importe quelle règle, et une cible sans <code>
        accept
      </code>
      
       accepte tout.
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
      
       sur la zone d'une liste et sur ses lignes
    </td>
    
    <td>
      <code>
        group: 'board'
      </code>
      
       sur <code>
        makeSortableList
      </code>
      
      . <code>
        group: { name, pull, put }
      </code>
      
       dit ce qui peut sortir et entrer.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       sur <code>
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

Une liste sans `group` forme un groupe à elle seule et n'échange avec aucune autre liste. En v2, une
zone sans groupes acceptait tout. Voir [les glissements qu'une cible accepte](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes).

### L'overlay

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
      Un aperçu rendu dans le provider, téléporté avec <code>
        previewTo
      </code>
    </td>
    
    <td>
      Toujours téléporté, dans <code>
        body
      </code>
      
       ou dans <code>
        overlayTo
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un clone : la même balise, son <code>
        innerHTML
      </code>
      
       et sa taille
    </td>
    
    <td>
      Un clone profond : les valeurs des formulaires, les pixels des <code>
        <canvas>
      </code>
      
      , les styles hérités et les cellules de tableau suivent. Marquez ce qui reste en arrière avec <code>
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
      
      , qui lit <code>
        useDnDProvider().entities
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      , qui reçoit <code>
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
      
       et <code>
        to
      </code>
      
       en props. Pas de <code>
        markRaw
      </code>
      
       ; utilisez un <code>
        shallowRef
      </code>
      
       pour le changer.
    </td>
  </tr>
  
  <tr>
    <td>
      Le slot <code>
        #preview
      </code>
      
      , positionné à partir de <code>
        preview.position
      </code>
    </td>
    
    <td>
      Le slot <code>
        #overlay
      </code>
      
       : la bibliothèque place et dimensionne la boîte. S'il ne rend rien, le clone est utilisé.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      Le slot <code>
        #overlay
      </code>
      
      , ou un <code>
        shallowRef
      </code>
      
       passé en <code>
        overlay
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un nouvel aspect au-dessus d'une zone, depuis <code>
        onEnter
      </code>
      
       et <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        overOverlay
      </code>
      
       sur <code>
        makeDroppable
      </code>
      
       ou une liste, ou lire <code>
        over
      </code>
      
       dans le composant d'overlay. Voir <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        cibles qui changent l'overlay
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
      Les <code>
        items
      </code>
      
       des props de l'overlay ; <code>
        <DragPreview :id="item.id" />
      </code>
      
       rend un clone.
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
      Le modificateur <code>
        snapToGrid
      </code>
      
      . Il aligne aussi l'endroit où les cibles sont cherchées et la <code>
        position
      </code>
      
       du dépôt, pas seulement l'image.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <Transition>
      </code>
      
       ou l'<code>
        AnimatePresence
      </code>
      
       de motion autour de <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        overlay-class
      </code>
      
       avec <code>
        @starting-style
      </code>
      
       pour la saisie, <code>
        dropAnimation
      </code>
      
       pour l'atterrissage, <code>
        overlayTransition
      </code>
      
       entre composants. Voir <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        soulever, incliner, reposer
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
      
      ) sur la boîte, <code>
        [data-dnd-overlay-content]
      </code>
      
       à l'intérieur.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.size
      </code>
      
      , tenu à jour à la main
    </td>
    
    <td>
      La boîte prend la taille de l'emplacement où elle va atterrir (<code>
        overlayFit
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      L'aperçu disparaît au dépôt
    </td>
    
    <td>
      Il atterrit sur son emplacement, ou revient à sa place à l'annulation.
    </td>
  </tr>
</tbody>
</table>

Plus de détails dans le [guide de l'overlay](https://zizigy.github.io/docs/guides/overlay).

### Sélection et multi-drag

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
      
      , renvoyé par <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        selected
      </code>
      
      , renvoyé par <code>
        makeDraggable
      </code>
      
       et <code>
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
      
      , un ensemble d'éléments
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      , indexé par id.
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
      
      ) enfoncé par défaut
    </td>
    
    <td>
      Aucune touche par défaut : un appui sur l'espace vide de la zone trace le rectangle. <code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       ramène Ctrl.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier.keys
      </code>
      
       en <code>
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
      
      ) ou <code>
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
      Pareil.
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
      Pareil.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort()
      </code>
      
       qui déplace la sélection en bloc
    </td>
    
    <td>
      Les listes la déplacent. <code>
        multiple: 'group'
      </code>
      
       (par défaut), <code>
        'gaps'
      </code>
      
       ou <code>
        'stack'
      </code>
      
       dit ce que font les autres items en chemin.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       pour les sélections mixtes
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       et <code>
        onBeforeDrop
      </code>
      
       qui renvoie des ids. Voir <a href="/docs/guides/multi-drag#taking-only-some">
        n'en accepter qu'une partie
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Plus de détails dans [multi-drag et sélection](https://zizigy.github.io/docs/guides/multi-drag).

### Axes, limites et alignement

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
      
      , pour les glissements qui commencent à l'intérieur. <code>
        axis
      </code>
      
       fonctionne aussi sur un élément déplaçable, une liste, un arbre ou un item.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      <code>
        axis
      </code>
      
       omis.
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
      
      , ou les modificateurs <code>
        restrictToParent
      </code>
      
       et <code>
        restrictToElement(el)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Un provider par région, pour séparer les règles
    </td>
    
    <td>
      Un provider et un <code>
        makeDragArea
      </code>
      
       par région. Ses items peuvent toujours aller n'importe où.
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
      
       ou <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      , dans les <code>
        modifiers
      </code>
      
       du provider, d'une zone, d'une liste ou d'un élément déplaçable.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Nouveau : <code>
        restrictToWindowEdges
      </code>
      
      , <code>
        restrictToFirstScrollableAncestor
      </code>
      
      , <code>
        snapCenterToCursor
      </code>
      
      , et vos propres modificateurs.
    </td>
  </tr>
</tbody>
</table>

Plus de détails dans [axes, limites et grilles](https://zizigy.github.io/docs/guides/constraints).

### Défilement automatique

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
      
      , désactivé par défaut
    </td>
    
    <td>
      Activé par défaut, pour la fenêtre et chaque conteneur défilable. <code>
        :auto-scroll="false"
      </code>
      
       le désactive.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      Rien : tout élément en <code>
        overflow: auto
      </code>
      
       ou <code>
        scroll
      </code>
      
       défile. Pour en régler un : <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       ou l'<code>
        autoScroll
      </code>
      
       de la liste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        threshold
      </code>
      
       en px, ou par côté
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
       : une fraction de la taille du conteneur (<code>
        0.2
      </code>
      
      ), entre 24 et 96 px. <strong>
        Pas d'équivalent
      </strong>
      
       pour les seuils par côté.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
      
      , un multiplicateur
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
       (25 px par frame) et <code>
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
      
      , depuis <code>
        makeDragArea
      </code>
      
       ou <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Clavier et accessibilité

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
      
       sur chaque élément déplaçable
    </td>
    
    <td>
      Défini pour vous, avec <code>
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
      
       et <code>
        aria-pressed
      </code>
      
      . Vos propres attributs l'emportent.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        :aria-grabbed="isDragging"
      </code>
      
       à la main
    </td>
    
    <td>
      Retirez-le : <code>
        aria-pressed
      </code>
      
       suit le glissement.
    </td>
  </tr>
  
  <tr>
    <td>
      Touches définies sur <code>
        useDnDProvider().keyboard.keys
      </code>
    </td>
    
    <td>
      La prop <code>
        keyboard
      </code>
      
       du provider. Les raccourcis correspondent à <code>
        event.code
      </code>
      
       ou <code>
        event.key
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Les flèches déplacent l'aperçu de <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      Glissements libres : <code>
        keyboard.step
      </code>
      
       px. Listes : d'emplacement en emplacement, et vers la liste suivante du groupe. <code>
        keyboardMode: 'droppables'
      </code>
      
       saute d'une cible à l'autre.
    </td>
  </tr>
  
  <tr>
    <td>
      Réassigner les flèches (<code>
        forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      )
    </td>
    
    <td>
      <strong>
        Pas d'équivalent.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Pas d'annonces
    </td>
    
    <td>
      Une région live annonce chaque saisie, déplacement, dépôt et annulation. <code>
        label
      </code>
      
       nomme les choses ; <code>
        announcements
      </code>
      
       et <code>
        screenReaderInstructions
      </code>
      
       les reformulent.
    </td>
  </tr>
</tbody>
</table>

Plus de détails dans [accessibilité](https://zizigy.github.io/docs/guides/accessibility).

### Événements et décisions de dépôt

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
      
       de l'élément déplaçable
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      , en vérifiant <code>
        active.ids
      </code>
      
      . Pour une classe, <code>
        isDragging
      </code>
      
       suffit.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      L'<code>
        onDragMove
      </code>
      
       du moniteur.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      , déposé ou annulé
    </td>
    
    <td>
      L'<code>
        onDragEnd
      </code>
      
       du moniteur (un dépôt) et <code>
        onDragCancel
      </code>
      
      . <code>
        onDragSettle
      </code>
      
       entend les deux, une fois l'overlay atterri.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      L'<code>
        onDragCancel
      </code>
      
       du moniteur.
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
      
       de l'élément déplaçable, et son <code>
        onDragStart
      </code>
      
      … pour les glissements qui le survolent
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       sur l'élément : <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      . Les lignes d'une liste n'ont besoin de rien.
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
      
       du droppable
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
      
       du droppable
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       décide, puis <code>
        onDrop
      </code>
      
       applique. <code>
        onDrop
      </code>
      
       est synchrone, et ce qu'il renvoie est ignoré.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
      
       du droppable
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , avec <code>
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
      Nouveau : les <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
       du provider, et les <code>
        onDragOver
      </code>
      
      , <code>
        onBeforeDrop
      </code>
      
       et <code>
        onDragResume
      </code>
      
       du moniteur.
    </td>
  </tr>
</tbody>
</table>

Un `onDrop` de la v2 pouvait renvoyer une valeur, ou une promesse de valeur, pour décider du dépôt.
En v3, c'est le rôle d'`onBeforeDrop`, sur les listes, les arbres, les cibles de dépôt et les
moniteurs :

<table>
<thead>
  <tr>
    <th>
      <code>
        onDrop
      </code>
      
       de la v2 renvoie
    </th>
    
    <th>
      <code>
        onBeforeDrop
      </code>
      
       de la v3 renvoie
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Rien, ou <code>
        true
      </code>
      
       : le dépôt aboutit
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       ou rien.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
       : ce dépôt est écarté, le glissement reste actif
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      . <strong>
        <code>
          false
        </code>
        
         refuse désormais le dépôt.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Une promesse rejetée, ou une exception : le glissement est annulé
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       ou <code>
        false
      </code>
      
      . Une exception refuse aussi.
    </td>
  </tr>
  
  <tr>
    <td>
      Une promesse ; pendant ce temps, <code>
        state
      </code>
      
       vaut <code>
        'pending'
      </code>
    </td>
    
    <td>
      Une promesse ; pendant ce temps, <code>
        status
      </code>
      
       vaut <code>
        'dropping'
      </code>
      
       et l'overlay attend avec <code>
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
      
       renvoie <code>
        IDragItem[]
      </code>
    </td>
    
    <td>
      Un tableau d'ids : seuls ceux-là sont déposés, les autres reviennent à leur place.
    </td>
  </tr>
</tbody>
</table>

Les moniteurs répondent d'abord, puis la cible. Ensuite l'`onDrop` de la cible s'exécute, une liste
écrit ses nouveaux tableaux, et `onDragEnd` suit. Plus de détails dans
[décider d'un dépôt](https://zizigy.github.io/docs/guides/drop-decisions) et dans l'[API des événements](https://zizigy.github.io/docs/api/events).

### Types

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
      
       (cibles, moniteurs), <code>
        SortableDropEvent
      </code>
      
       (listes), <code>
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
        Pas d'équivalent.
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
      
      , dans <code>
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
      
      , sans <code>
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
      
      , ce que renvoie <code>
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
      Des callbacks dans <code>
        DraggableOptions
      </code>
      
      , <code>
        DroppableOptions
      </code>
      
       et <code>
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
      Importe automatiquement <code>
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
      Importe automatiquement <code>
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
      Aucun type importé automatiquement
    </td>
    
    <td>
      Les principaux types le sont (<code>
        DnDEvent
      </code>
      
      , <code>
        SortableDropEvent
      </code>
      
      , <code>
        OverlayProps
      </code>
      
      …). Les génériques (<code>
        Key
      </code>
      
      , <code>
        Active
      </code>
      
      , <code>
        Over
      </code>
      
      ) s'importent à la main.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Modificateurs, fonctions de collision et capteurs sur demande : <code>
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
      
       et <code>
        DragPreview
      </code>
      
       globaux
    </td>
    
    <td>
      Pareil, avec une option <code>
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
      
       dans le layout, à l'intérieur du provider
    </td>
    
    <td>
      Retirez-le : le provider rend l'overlay. <code>
        DragPreview
      </code>
      
       prend un <code>
        id
      </code>
      
       et a sa place dans les composants d'overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       3 ; Nuxt 4.
    </td>
  </tr>
</tbody>
</table>

`modules: ['@vue-dnd-kit/nuxt']` dans `nuxt.config.ts` reste tel quel. Voir
[installation](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Avant et après

### Un élément déplaçable et une zone de dépôt

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

- La carte reçoit `tabindex`, `role` et les attributs `aria-*` d'elle-même. Une poignée `<button>`
peut recevoir le focus, et les glissements au clavier partent d'elle.
- `groups` est devenu `type` sur l'élément déplaçable et `accept` sur la cible. Les callbacks ont
quitté l'objet `events`.
- `isOver` sans `isAccepting`, c'est une cible qui refuse le glissement : un dépôt à cet endroit
revient à sa place.

### Une liste triable

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

- Rendez `items`, le brouillon : il se réordonne pendant le glissement. `tasks` reçoit le nouvel
ordre au dépôt, et `defineModel` émet `update:modelValue`.
- Pas d'index, pas de payload, pas d'`onDrop`, pas de `<TransitionGroup>` : les lignes glissent toutes
seules.
- La ligne glissée reste dans la liste, comme l'emplacement où elle va atterrir. Stylez-la avec
`isPlaceholder` ou `[data-dnd-placeholder]` au lieu de la masquer.

### Listes qui partagent des items

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

Le dépôt écrit les deux tableaux, celui que la tâche a quitté et celui où elle est entrée.
`TaskItem.vue` est celui de la liste triable ci-dessus. Une palette qui distribue des copies, c'était
`suggestCopy()` et un drapeau `copyOnly` ; désormais, c'est une liste :

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

Pour un store Pinia ou un autre état que vous n'écrivez pas directement, passez `items` en getter,
appelez `e.preventDefault()` dans `onDrop` et appliquez `e.result` : voir
[les listes contrôlées](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

### Un overlay personnalisé

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

- Le composant reçoit le glissement en props : `items` (chaque item glissé, en commençant par celui
qui a été saisi), `over`, `accepted`, `status`, `mode` et `to`. Ne déclarez que celles que vous
lisez. Pour les lignes d'une liste, l'item de la liste est `items[0].item`.
- Passez-le tel quel. Changez-le avec un `shallowRef`, jamais avec une `ref` profonde.

Le slot du provider change de la même façon, et votre composant ne se positionne plus lui-même :

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

Une apparition qui enveloppait `DragPreview` dans une `<Transition>` devient `overlay-class` avec
`@starting-style` : voir [soulever, incliner, reposer](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).

### Un dépôt que vous confirmez

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

Une liste demande de la même façon, et une promesse vous permet d'ouvrir votre propre boîte de
dialogue. L'overlay attend là où il a été lâché jusqu'à ce que la promesse soit réglée :

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

Une zone qui ne prenait que la partie correspondante d'une sélection mixte (`groupMatch: 'some'`) :

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

Les listes le font sans code : avec `acceptMode: 'some'`, les items que leur `group.put` accepte
atterrissent, et les autres reviennent à leur place.

## Les pièges de la mise à jour

- **Installez la v3 avec sa plage de versions.** `^3` dans `package.json` : un `npm update` garde
`^2` en v2.
- **Rendez le brouillon.** Une liste rend les `items` que renvoie `makeSortableList`, pas votre
tableau. Si vous rendez votre tableau, rien ne bouge avant le dépôt.
- **Ne triez pas deux fois.** Supprimez le code `suggestSort` des listes : une liste écrit chaque
dépôt dans une ref `items` modifiable après son `onDrop`. Pour l'appliquer vous-même, appelez
`e.preventDefault()` et utilisez `e.result`.
- **false refuse le dépôt.** En v2, un `onDrop` qui résolvait `false` laissait le glissement
continuer. En v3, renvoyez `'continue'` depuis `onBeforeDrop`. Une promesse renvoyée par `onDrop`
est ignorée.
- **Les listes ne partagent qu'au sein d'un group.** Une liste sans `group` n'échange avec aucune
autre liste.
- **Indexez les lignes par id.** `:key="index"` anime les mauvaises lignes. Passez aussi des ids
issus de vos données : un id par défaut change à chaque instance du composant.
- **Pas de <TransitionGroup>, pas de transition sur transform.** La bibliothèque déplace les
lignes elle-même, et les déplacements seraient animés deux fois.
- **Défaites le contournement tactile.** `touch-action: none` sur un item entier empêche la page de
défiler sous le doigt ; la v3 démarre plutôt les glissements tactiles par un appui long. Gardez-le
sur une poignée qui doit glisser tout de suite, avec `activation: { touch: { distance: 4 } }`.
- **Retirez les attributs périmés.** La bibliothèque définit le `tabindex`, le `role` et les
`aria-*` dont elle a besoin et n'écrase jamais les vôtres, donc un `role` ou un `aria-grabbed`
restant reste tel que vous l'avez laissé.
- **Refaites le style de l'overlay.** `.dnd-kit-preview` n'existe plus : stylez ce qui se trouve dans
`[data-dnd-overlay='dragging']`, jamais le `transform` de la boîte. Donnez `width: 100%; height: 100%`
à la racine d'un composant d'overlay, et retirez `<DragPreview />` de vos layouts.
- **Le défilement automatique est activé.** Passez `:auto-scroll="false"` là où la v2 ne défilait
jamais.
- **Un rectangle de sélection n'a pas besoin de touche.** `makeSelectionArea` trace à partir d'un
simple appui sur son espace vide. Ajoutez un `modifier` pour garder le Ctrl de la v2.
- **Un provider, des zones à l'intérieur.** Les items ne peuvent pas passer d'un provider à l'autre.
Une page qui utilisait un provider par région pour séparer leurs règles a besoin d'un provider et
d'un `makeDragArea` par région.
- **Deux arguments.** `makeDraggable` et `makeDroppable` prennent une ref et un objet d'options, pas
de payload.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
