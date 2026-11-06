---
title: "Capteurs et glissements programmatiques"
description: "Comment une entrée devient un glissement — les capteurs pointeur et clavier, les contraintes d'activation, canDrag, vos propres capteurs, et les glissements que vous scriptez avec @vue-dnd-kit/actions."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Un capteur transforme des entrées en glissements. Il dit seulement au provider « fais glisser cet
item depuis ici », puis où l'entrée s'est déplacée, et si elle a déposé ou annulé. Le provider
fait le reste, de la même façon pour chaque capteur : un glissement à la fois, refus des items
désactivés, contraintes d'activation, tri, défilement automatique, annonces, <kbd value="Escape">



</kbd>


et tout le dépôt.

## Les capteurs intégrés

<table>
<thead>
  <tr>
    <th>
      Capteur
    </th>
    
    <th>
      Entrée
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
      Souris, toucher et stylet, via les Pointer Events. Il capture le pointeur, empêche la page de sélectionner du texte ou de défiler sous un glissement tactile, et avale le clic qui suit un glissement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      <kbd value="Space">
        
      </kbd>
      
       et <kbd value="Enter">
        
      </kbd>
      
       saisissent et déposent, les flèches déplacent, <kbd value="Escape">
        
      </kbd>
      
       annule — n'importe quel glissement, y compris au pointeur.
    </td>
  </tr>
</tbody>
</table>

Les deux tournent par défaut. Les `sensors` du provider remplacent la liste :

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, joystick.sensor]">
```

Pour désactiver les glissements au clavier, préférez `:keyboard="false"` au retrait de
`keyboardSensor` : le capteur clavier est aussi ce qui annule n'importe quel glissement avec
<kbd value="Escape">



</kbd>

. Ses touches se réassignent avec `keyboard.keys` (voir
l'[accessibilité](https://zizigy.github.io/docs/guides/accessibility#the-keyboard)).

## Contraintes d'activation

Un appui ne glisse pas tout de suite : il attend sa contrainte d'activation, pour qu'un clic reste
un clic et qu'un balayage puisse toujours faire défiler la page. Changez les règles de cette liste
et appuyez sur une ligne :

<example height="34.5rem" hint="Maintenez une ligne jusqu'à ce que l'anneau se ferme, ou changez de règle" name="activation-modes">



</example>

Une contrainte a trois champs :

<table>
<thead>
  <tr>
    <th>
      Champ
    </th>
    
    <th>
      Le glissement démarre…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        distance
      </code>
    </td>
    
    <td>
      Une fois que le pointeur s'est déplacé de ce nombre de px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay
      </code>
    </td>
    
    <td>
      Une fois que l'appui a duré ce nombre de ms. Avec <code>
        distance
      </code>
      
       aussi, au premier des deux.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        tolerance
      </code>
    </td>
    
    <td>
      Avec <code>
        delay
      </code>
      
       : jusqu'où le pointeur peut bouger entre-temps. Au-delà, l'appui abandonne, pour que la page puisse défiler. 5 px par défaut quand il n'y a pas de <code>
        distance
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Sans contrainte à vous, chaque type de pointeur a la sienne par défaut :

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
      Souris
    </td>
    
    <td>
      Après un déplacement de 4 px. Tout de suite quand l'appui est sur une poignée (<code>
        handle
      </code>
      
      ), sauf si une contrainte souris est définie.
    </td>
  </tr>
  
  <tr>
    <td>
      Stylet
    </td>
    
    <td>
      Après un déplacement de 4 px.
    </td>
  </tr>
  
  <tr>
    <td>
      Toucher
    </td>
    
    <td>
      Après un appui de 200 ms. Bouger de plus de 5 px avant cela abandonne, et la page défile à la place.
    </td>
  </tr>
</tbody>
</table>

### Où les définir

Par type de pointeur — `mouse`, `touch`, `pen` — sur le provider, une zone de glissement ou
l'item. Pour chaque type, celle de l'item l'emporte, puis celle de sa zone, puis celle du
provider :

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 250, tolerance: 5 } }">
```

```ts
// Inbox.vue: the rules of every drag that starts inside the panel.
makeDragArea(panel, { activation: () => MODES[mode.value].activation });

// One item: a longer press by touch, the area's rule for the mouse.
makeSortableItem(el, { item: () => props.task, activation: { touch: { delay: 400, tolerance: 8 } } });
```

Les options sont lues quand un appui commence : un getter ou une ref les change donc en direct,
comme le fait la démo. Les glissements au clavier démarrent tout de suite.
[Votre propre capteur](#a-sensor-of-your-own) demande sa propre contrainte, ou celle configurée
pour un type de pointeur.

### Un anneau d'appui long

Pendant qu'un appui attend, `useDnD().status` vaut `'activating'` et `activation.progress` va de
0 à 1 — selon le temps avec `delay`, selon la distance parcourue avec `distance`. La démo dessine
un anneau là où l'appui a commencé :

```vue [Inbox.vue]
<script setup lang="ts">
const { status, activation } = useDnD();
</script>

<template>
  <svg v-if="status === 'activating'" class="ring" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="17" pathLength="1" :stroke-dasharray="`${activation.progress.value} 1`" />
  </svg>
</template>
```

Donnez à l'anneau `pointer-events: none` : il se trouve sous le pointeur, et le glissement teste
les collisions avec ce qui s'y trouve. Un appui qui abandonne — déplacé au-delà de sa
`tolerance`, ou relâché trop tôt — ramène `status` directement à `'idle'`.

### Les poignées démarrent tout de suite

Avec une `handle`, seule la poignée démarre un glissement, et un appui de souris dessus glisse
tout de suite : saisir une poignée ne laisse rien à distinguer. Un appui relâché là où il a
commencé reste un clic : la poignée peut donc ouvrir un menu sur `click` (le pointeur n'est
capturé qu'une fois qu'il bouge). Un toucher attend toujours son appui long, sauf si la poignée
ne peut pas faire défiler la page. Donnez-lui
`touch-action: none` et une courte distance à l'item :

```ts [Message.vue]
makeSortableItem(el, {
  item: () => props.chat,
  handle: '.grip',
  // The grip has `touch-action: none`: a touch on it can't scroll, so it drags after 4 px.
  activation: { touch: { distance: 4 } },
});
```

Une contrainte souris définie sur l'item, sa zone ou le provider s'applique aussi aux poignées.
Faites de la poignée un `<button>`, comme le fait la démo : elle prend le focus, et un glissement
au clavier démarre donc aussi depuis elle.

## Seulement certains appuis

`canDrag` est un filtre de plus sur les éléments déplaçables et les items triables. Il reçoit
l'événement d'entrée et répond `true` ou `false` pour cet appui. Ici, les glissements au pointeur
demandent <kbd value="Shift">



</kbd>

 ; le clavier glisse comme d'habitude :

<example height="28rem" hint="Faites glisser une ligne avec et sans Maj ; cochez une case, choisissez un responsable" name="can-drag">



</example>

```ts [Task.vue]
makeSortableItem(el, {
  item: () => props.task,
  // Never: the row is locked (and says so to screen readers with aria-disabled).
  disabled: () => !!props.task.locked,
  // Per press: pointer drags only with Shift held; the keyboard as usual.
  canDrag: (event) => {
    if (!props.shiftOnly || event instanceof KeyboardEvent || event.shiftKey) return true;
    emit('refused');
    return false;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Interrogée
    </th>
    
    <th>
      Utilisez-la pour
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      En direct, et posée en <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      Les items qui ne peuvent pas bouger du tout : verrouillés, en lecture seule.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        canDrag
      </code>
    </td>
    
    <td>
      Une fois par appui, avec son événement
    </td>
    
    <td>
      Les règles qui portent sur l'entrée : une touche maintenue, un bouton, un type de pointeur.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Là où l'appui se pose
    </td>
    
    <td>
      Les items qui ne démarrent un glissement que depuis une partie.
    </td>
  </tr>
</tbody>
</table>

`canDrag` est interrogé avant la contrainte d'activation, avec le `pointerdown` ou le `keydown`.
Un type de pointeur est une règle de plus qu'il peut poser :

```ts
// Mouse and pen drag; a touch on the row always scrolls the page.
canDrag: (event) => !(event instanceof PointerEvent && event.pointerType === 'touch'),
```

Les enfants interactifs — boutons, champs, cases à cocher, champs éditables — ne démarrent jamais
de glissement au pointeur : ils continuent donc de fonctionner à l'intérieur d'un élément
déplaçable, comme la case à cocher et le menu du responsable dans la démo. Avec une `handle`,
seule la poignée en démarre un.

## Votre propre capteur

Une manette, un joystick à l'écran, des commandes vocales : tout ce qui peut désigner un item et
bouger peut piloter un glissement. Cette manette est un capteur. Maintenez <kbd value="A">



</kbd>


au-dessus d'un héros pour le saisir, dirigez avec la croix, <kbd value="A">



</kbd>

 de nouveau le dépose,
<kbd value="B">



</kbd>

 annule. La souris et le clavier fonctionnent toujours à côté :

<example height="30rem" hint="Maintenez A au-dessus d'un héros, puis maintenez une flèche : le héros traverse la liste" name="joystick">



</example>

`defineSensor` donne au capteur son nom et un `setup` qui reçoit le côté du provider, une fois par
provider :

```ts [joystick.ts]
const sensor = defineSensor({
  name: 'joystick',
  // Once per provider, in the browser. The cleanup runs when the provider unmounts.
  setup(ctx) {
    context = ctx;
    return () => {
      context = null;
      drag = null;
    };
  },
});
```

Un appui demande un glissement au provider avec `activate()`. La cible est vérifiée comme pour un
vrai appui : ce doit être un élément déplaçable de ce provider, non désactivé, et pas un bouton à
l'intérieur de l'un d'eux :

```ts [joystick.ts]
/** A goes down: drops a running drag, or starts a hold over what is under the cursor. */
const press = () => {
  if (drag?.state === 'dragging') return void drag.drop();
  const at = point();
  const target = document.elementFromPoint(at.x, at.y);
  if (!target || !context) return;
  drag = context.activate({
    target, // checked like a real press: a draggable of this provider, not disabled
    point: at,
    type: 'pointer', // follows points: lists sort under it, containers auto-scroll
    activation: { delay: 300 }, // `useDnD().activation.progress` runs meanwhile
    onEnd: (ended) => {
      if (drag === ended) drag = null;
    },
  }); // null: nothing to drag there
};
```

Ensuite, le glissement bouge avec la croix, et A ou B le terminent :

```ts [joystick.ts]
const move = (dx: number, dy: number) => {
  cursor.value = { x: cursor.value.x + dx, y: cursor.value.y + dy }; // clamped in the demo
  drag?.move(point()); // pending: checks the tolerance; dragging: moves
};

const release = () => {
  if (drag?.state === 'pending') drag.cancel(); // A let go before the hold is over
};

const cancel = () => drag?.cancel();
```

Ajoutez le capteur aux `sensors` du provider, comme le fait la démo, ou faites-le tourner tant
qu'un composant existe avec `useSensor(joystick.sensor)`. Les points sont en coordonnées du
viewport : la démo garde son curseur dans les coordonnées de la scène, pour qu'il défile avec la
page, et le convertit dans `point()`.

### Ce que reçoit le capteur

`setup(context)` reçoit le côté du provider :

<table>
<thead>
  <tr>
    <th>
      Membre
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
        props
      </code>
    </td>
    
    <td>
      Les props du provider (<code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      …). Lisez-les au moment où vous en avez besoin : elles peuvent changer.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      Le statut de glissement du provider, quel que soit le capteur qui mène le glissement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag
      </code>
    </td>
    
    <td>
      Le glissement en cours du provider, en attente ou actif, quel que soit le capteur qui l'a démarré. <code>
        null
      </code>
      
       quand il n'y en a pas.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activate(options)
      </code>
    </td>
    
    <td>
      Demande un glissement. Renvoie un <code>
        SensorDrag
      </code>
      
      , ou <code>
        null
      </code>
      
       quand aucun glissement ne peut démarrer.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Annule le glissement ou l'appui en attente du provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onWindow(setup)
      </code>
    </td>
    
    <td>
      Exécute <code>
        setup(view)
      </code>
      
       dans la fenêtre de la page et dans chaque <a href="/docs/guides/provider#other-windows-of-the-app">
        autre fenêtre de l'application
      </a>
      
       dès qu'elle s'ajoute. Écoutez-y les entrées ; c'est nettoyé quand cette fenêtre se ferme.
    </td>
  </tr>
</tbody>
</table>

`activate()` accepte :

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Signification
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        target
      </code>
    </td>
    
    <td>
      Là où l'entrée s'est posée : un élément à l'intérieur d'un élément déplaçable, ou l'id d'un élément déplaçable. Un élément est vérifié comme un vrai appui (poignée, pas d'enfant interactif) ; un id saute les vérifications.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        point
      </code>
    </td>
    
    <td>
      Là où le glissement commence, en coordonnées du viewport. Par défaut : le centre de l'élément déplaçable.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        type
      </code>
    </td>
    
    <td>
      <code>
        'pointer'
      </code>
      
       (par défaut) : suit des points, teste les collisions avec les cibles, défile automatiquement. <code>
        'keyboard'
      </code>
      
       : se déplace d'item en item, rend les cibles visibles, rend le focus à la fin.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      Une contrainte (<code>
        { delay: 300 }
      </code>
      
      ), ou un type de pointeur (<code>
        'touch'
      </code>
      
      ) pour utiliser celle qui est configurée. Par défaut : aucune, le glissement démarre tout de suite.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        event
      </code>
    </td>
    
    <td>
      L'événement d'entrée, transmis au <code>
        canDrag
      </code>
      
       de l'item (sans lui, <code>
        canDrag
      </code>
      
       n'est pas interrogé). Un <code>
        pointerType
      </code>
      
       tactile en fait un glissement tactile (vibrations).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onStart(drag)
      </code>
    </td>
    
    <td>
      Le glissement a démarré, après son activation.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnd(drag)
      </code>
    </td>
    
    <td>
      Le glissement est terminé : interrompu, déposé ou annulé — par qui que ce soit.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onResume(drag)
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       a répondu <code>
        'continue'
      </code>
      
       : le glissement continue, et <code>
        move
      </code>
      
      , <code>
        drop
      </code>
      
       et <code>
        cancel
      </code>
      
       s'appliquent de nouveau.
    </td>
  </tr>
</tbody>
</table>

Le `SensorDrag` qu'elle renvoie :

<table>
<thead>
  <tr>
    <th>
      Membre
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
        id
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      L'id de l'item glissé, et <code>
        'pointer'
      </code>
      
       ou <code>
        'keyboard'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        state
      </code>
    </td>
    
    <td>
      <code>
        'pending'
      </code>
      
       (en attente de l'activation), <code>
        'dragging'
      </code>
      
      , puis <code>
        'ended'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        started
      </code>
    </td>
    
    <td>
      Le glissement a démarré, même s'il s'est terminé depuis.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        move(point)
      </code>
    </td>
    
    <td>
      L'entrée s'est déplacée. En attente, vérifie la tolérance ; pendant le glissement, déplace le glissement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        step(direction)
      </code>
    </td>
    
    <td>
      Glissements au clavier : un pas de flèche, <code>
        'up' | 'down' | 'left' | 'right'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        place({ list, index })
      </code>
    </td>
    
    <td>
      Place l'item à une position d'une liste triable, comme le font les déplacements au clavier. Se résout à <code>
        false
      </code>
      
       quand aucune liste ne l'accepte à cet endroit.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop()
      </code>
    </td>
    
    <td>
      Dépose. Se résout à <code>
        true
      </code>
      
       quand le dépôt a abouti, une fois qu'il a atterri.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Annule : l'item revient à sa place, ou un appui en attente est abandonné.
    </td>
  </tr>
</tbody>
</table>

Les appels qui ne s'appliquent plus — un déplacement après la fin, un second `drop()` — sont
ignorés. Les types complets : [Capteurs](https://zizigy.github.io/docs/api/sensors).

<tip>

Pour envelopper un capteur intégré, exécutez son `setup` avec un contexte à vous. Créez-le avec
`Object.create(context, { activate: { value: myActivate } })` plutôt qu'avec une décomposition,
pour que les getters en direct (`status`, `drag`, `props`) continuent de fonctionner.

</tip>

## Glissements programmatiques

`@vue-dnd-kit/actions` déplace des items depuis le code : boutons « Monter », menus, raccourcis
clavier, annulation, visites guidées, tests. Il est construit sur l'API publique des capteurs, et
ses glissements sont de vrais glissements : annoncés et animés, passant par `onBeforeDrop`,
`onDrop`, `e.result` et `preventDefault()`, sous les règles du provider (un glissement à la fois,
items désactivés, `accept` et `group.put`).

<example height="31.5rem" hint="Survolez une piste pour voir ses flèches, mélangez, ou lancez le glissement scripté" name="actions">



</example>

```bash
npm i @vue-dnd-kit/actions
```

### moveItem : un appel, un déplacement

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';

const { moveItem } = useDnDActions(); // in setup, under a provider

await moveItem('card-1', { index: 0 }); // to the top of its list
await moveItem('card-1', { list: 'done' }); // to the end of another list
await moveItem('card-1', { list: 'done', index: 2 }); // to a place in another list
```

- `list` est l'`id` d'une liste triable. Sans lui, l'item reste dans sa liste.
- `index` est l'endroit où l'item finit, compté sans l'item lui-même, et ramené dans les limites
de la liste. Sans lui, l'item va à la fin.
- Il se résout à `true` quand le dépôt a abouti, à `false` quand l'item n'est pas rendu ou est
désactivé, qu'aucune liste ne l'accepte à cet endroit, ou que le dépôt a été refusé.
- Les appels sont mis en file : chacun attend que le provider soit au repos, pour qu'un second
clic rapide ne soit pas perdu. Le mélange de la démo, ce sont cinq appels d'affilée.
- Il s'exécute comme un glissement au clavier : il est donc annoncé et le focus reste sur l'item.
- Listes uniquement : les positions dans un arbre ont aussi une profondeur.

Voir l'[accessibilité](https://zizigy.github.io/docs/guides/accessibility#moving-without-dragging) pour une ligne avec des
boutons de déplacement.

### startDrag : un glissement scripté

```ts
const { startDrag } = useDnDActions();

const drag = startDrag('card-1'); // null when it can't start now
if (drag) {
  await drag.moveTo(document.querySelector('#trash')!); // onto an element
  await drag.moveTo({ x: 400, y: 120 }); // to a point, in viewport coordinates
  await drag.moveTo({ list: 'done', index: 2 }); // to a list position
  await drag.drop(); // true when the drop went through; or drag.cancel()
}
```

`moveTo` se résout une fois le déplacement rendu, `drop` une fois le dépôt atterri. Le bouton
« Play a scripted drag » de la démo fait remonter la dernière piste par petits pas de `moveTo`,
puis la dépose en haut. `startDrag(id, { from: { x, y } })` saisit l'item à un point donné au lieu
de son centre.

### Confier un glissement au clavier

`startDrag(id, { type: 'keyboard' })` soulève l'item comme un glissement au clavier. Votre code
peut le déplacer avec `await drag.step('down')`, ou le laisser à l'utilisateur : le capteur
clavier pilote chaque glissement au clavier, peu importe qui l'a démarré. Cela donne un élément
de menu « Déplacer » :

<example height="26rem" hint="Ouvrez le menu d'une ligne : flèches du clavier, ou envoyez-la vers l'autre semaine" name="move-menu">



</example>

```ts [Row.vue]
const { moveItem, startDrag } = useDnDActions();

// One move in one call: picked up, put there and dropped, announced and animated.
const toOther = () => moveItem(props.task.id, { list: props.other.id, index: 0 });
// A keyboard drag, handed to the arrow keys: Space or Enter drops, Escape cancels.
const withKeys = () => {
  el.value?.focus();
  startDrag(props.task.id, { type: 'keyboard' });
};
```

Les flèches déplacent la ligne d'emplacement en emplacement, <kbd value="ArrowLeft">



</kbd>

 et
<kbd value="ArrowRight">



</kbd>

 vers l'autre semaine (les listes partagent un `group`). Quand le
glissement se termine, le focus revient sur la ligne. Les indications de touches sous le tableau
s'éclairent tant que `useDnD().active.value?.sensor` vaut `'keyboard'`.

### En dehors des composants

`useDnDActions()` fait tourner un capteur, nommé `actions`, dans le provider au-dessus. Pour
piloter un provider depuis un store ou un harnais de test, ou sous un nom à vous, créez les
actions dans un capteur que vous faites tourner vous-même :

```ts
import { defineSensor } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';

export let tour: DnDActions | undefined;
export const tourSensor = defineSensor({
  name: 'tour',
  setup: (context) => void (tour = createDnDActions(context)),
});
```

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
```

Ensuite, `await tour?.moveItem('card-1', { list: 'done' })` depuis n'importe où. Pendant le rendu
serveur, rien ne glisse : `moveItem` se résout à `false` et `startDrag` renvoie `null`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
