---
title: "Accessibilité"
description: "Les glissements au clavier, les annonces pour lecteurs d'écran et les attributs ARIA sont intégrés. Voici ce qu'ils font, comment les formuler dans n'importe quelle langue, et comment proposer des déplacements sans glisser."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Tout ce qui figure sur cette page est activé par défaut. Atteignez un point de l'agenda avec Tab,
appuyez sur <kbd value="Space">



</kbd>

, déplacez-le avec les flèches et appuyez de nouveau sur
<kbd value="Space">



</kbd>

, ou sur <kbd value="Escape">



</kbd>

 pour le remettre en place. Le panneau montre ce
qui est dit à un lecteur d'écran, dans la langue que vous choisissez.

<example height="28.5rem" hint="Atteignez un item avec Tab : Space, flèches, Space. Changez de langue" name="a11y-announcer">



</example>

Ce qui vous revient généralement : des textes lisibles pour les items, et des boutons qui les
déplacent pour les personnes qui ne peuvent pas glisser du tout.

## Le clavier

<table>
<thead>
  <tr>
    <th>
      Touche
    </th>
    
    <th>
      Action
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Saisir l'item qui a le focus ; le déposer.
    </td>
  </tr>
  
  <tr>
    <td>
      Flèches
    </td>
    
    <td>
      Le déplacer : d'emplacement en emplacement dans les listes, par lignes et par profondeur dans les arbres, de <code>
        keyboard.step
      </code>
      
       pixels dans les glissements libres.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Annuler le glissement — y compris les glissements au pointeur.
    </td>
  </tr>
</tbody>
</table>

- Dans une liste, une flèche vers une autre liste du même groupe y déplace l'item.
- Dans un glissement libre, <kbd value="Shift">



</kbd>

 agrandit les pas.
`makeDraggable(el, { keyboardMode: 'droppables' })` fait plutôt sauter les flèches d'une cible qui
accepte l'item à l'autre.
- Un glissement au clavier démarre depuis l'élément déplaçable qui a le focus, ou depuis sa
poignée — jamais depuis un bouton ou un champ qu'il contient, qui gardent ainsi leurs propres
touches.
- Les glissements au clavier font défiler l'item pour le rendre visible au lieu de déclencher le
défilement automatique aux bords.
- Après le dépôt, le focus revient à l'item, même quand sa ligne a été rendue de nouveau dans une
autre liste.

### D'autres touches

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

Les associations correspondent à `event.code` (`'Space'`, `'KeyD'`) ou à `event.key`
(`'Enter'`). `step` est le nombre de pixels par appui sur une flèche dans les glissements libres
(25 par défaut). `:keyboard="false"` désactive les glissements au clavier, et <kbd value="Escape">



</kbd>


annule toujours n'importe quel glissement. Quand vous changez les touches, changez aussi
`screen-reader-instructions`.

## Attributs ARIA

Donnez le focus à chaque raccourci, ou désactivez les attributs, et observez ce que pose la
bibliothèque. Faites-en glisser un pour voir `aria-pressed` apparaître et disparaître sur le
bouton.

<example height="27rem" hint="Parcourez les raccourcis avec Tab ; basculez les attributs" name="a11y-attributes">



</example>

Chaque élément déplaçable et chaque item triable reçoit ces attributs, **sauf si vous les
définissez vous-même** :

<table>
<thead>
  <tr>
    <th>
      Attribut
    </th>
    
    <th>
      Valeur
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
      , quand l'élément ne peut pas déjà recevoir le focus (un <code>
        <div>
      </code>
      
       ; pas un <code>
        <a href>
      </code>
      
       ni un <code>
        <button>
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        role
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
      , sauf sur un <code>
        <button>
      </code>
      
      , qui en est déjà un.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-roledescription
      </code>
    </td>
    
    <td>
      <code>
        draggable
      </code>
      
      , ou <code>
        sortable
      </code>
      
       sur les items triables.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      Les instructions du provider, ajoutées à côté des ids déjà présents (celui d'une infobulle est conservé).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       ou <code>
        false
      </code>
      
       : si l'item est désactivé (y compris par une zone de glissement désactivée).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       pendant qu'il est glissé, sur les éléments qui ont le rôle <code>
        button
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`attributes: false` sur un item retire en direct ce que la bibliothèque avait posé. Le panneau
relit les attributs : `aria-describedby` pointe vers les instructions du provider, qu'un lecteur
d'écran lit après le nom de l'item.

### Liens et boutons qui glissent

`aria-roledescription` remplace le nom du rôle : un lecteur d'écran dit « Inbox, sortable » au
lieu de « Inbox, button ». Pour un élément dont le rôle compte, définissez le vôtre ; la
bibliothèque n'y touche pas :

```vue [Shortcut.vue]
<script setup lang="ts">
makeSortableItem(el, {
  item: () => props.shortcut,
  // Enter follows the link: only Space picks it up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});
</script>

<template>
  <a ref="el" :href="shortcut.href" role="link" aria-roledescription="draggable link">
    {{ shortcut.title }}
  </a>
</template>
```

- Un lien continue de fonctionner : un clic l'ouvre, mais le clic qui termine un glissement ne
l'atteint jamais. <kbd value="Enter">



</kbd>

 démarrerait un glissement : `canDrag` le refuse donc, et
le navigateur suit le lien.
- Un `<button>` garde aussi son clic, et la bibliothèque n'ajoute ni `role` ni `tabindex`.
- Les boutons, les liens et les champs **à l'intérieur** d'un item ne démarrent pas de
glissement au pointeur : une ligne peut donc avoir ses propres actions.

### Poignées : faites-en de vrais boutons

```vue [Track.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ track: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track, handle: '.grip' });
</script>

<template>
  <li ref="el" class="track">
    {{ track.title }}
    <button type="button" class="grip" :aria-label="`Drag ${track.title}`">⠿</button>
  </li>
</template>
```

Avec une `handle`, les attributs vont sur la poignée, et les glissements au clavier démarrent
depuis elle (le raccourci **Archive** ci-dessus). Un `<button>` peut recevoir le focus et est déjà
un bouton : il n'a besoin ni de `tabindex` ni de `role`. Donnez-lui un `aria-label` : une icône
de poignée n'a pas de nom à elle, et « Drag Midnight Drive » en dit plus que « button ».

<tip>

La poignée garde le focus pendant tout le glissement au clavier, tandis que sa ligne sert
d'emplacement. Videz l'emplacement avec `opacity: 0` plutôt qu'avec `visibility: hidden` ou
`display: none` sur la poignée : un élément masqué perd le focus. La bibliothèque le rend après
le dépôt, mais un lecteur d'écran peut dire « body » entre-temps.

</tip>

## Annonces

Une région live dans le provider énonce chaque saisie, déplacement, dépôt et annulation. Les
listes triables disent où se trouve l'item : *« Picked up item t2 at position 2 of 5 in list
playlist. »* Les déplacements sont énoncés une fois que le glissement est resté immobile 500 ms :
un glissement rapide au pointeur n'est donc pas lu emplacement par emplacement. Le panneau de la
démo journalise chaque texte donné au provider, y compris les déplacements par lesquels passe un
glissement au pointeur en chemin.

Les textes intégrés sont en anglais, et désignent les choses par leurs ids, sauf si vous leur
donnez un `label`. Les items, les listes, les arbres et les cibles de dépôt en acceptent tous un :

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*"Picked up Blue in Green at position 2 of 5 in Playlist."* Les labels arrivent aussi dans vos
propres textes et vos moniteurs : `active.label`, `over.label`, chacun des `active.items`, et dans
le contexte `position.label` et `partner.label`.

Pour une autre langue, ou d'autres mots, écrivez les textes vous-même, comme le fait l'agenda.
Chaque texte reçoit l'événement et un `context` : la `position` que le texte intégré énoncerait
(`list`, `index` à partir de 0, `length`, le `label` de la liste), ainsi que `count`, `copy` et
le `partner` d'un échange.

```ts [index.vue]
const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

const announcements = computed<Partial<Announcements>>(() => {
  const t = LANGUAGES[lang.value]!;
  return {
    onDragStart: ({ active }, { position }) => position && t.start(titleOf(active.id), position.index + 1, position.length),
    onDragOver: ({ active }, { position }) => position && t.move(titleOf(active.id), position.index + 1, position.length),
    onDragEnd: ({ active }, { position }) => position && t.drop(titleOf(active.id), position.index + 1, position.length),
    onDragCancel: ({ active }, { position }) => position && t.cancel(titleOf(active.id), position.index + 1),
    onDragResume: ({ active }) => t.resume(titleOf(active.id)),
  };
});
```

```vue [index.vue]
<DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
```

<table>
<thead>
  <tr>
    <th>
      <code>
        context
      </code>
    </th>
    
    <th>
      Au début
    </th>
    
    <th>
      Pendant le déplacement
    </th>
    
    <th>
      À la fin
    </th>
    
    <th>
      À l'annulation
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Là où il a été saisi
    </td>
    
    <td>
      Là où il atterrirait ; aucune en dehors des listes
    </td>
    
    <td>
      Là où il a atterri
    </td>
    
    <td>
      Là où il est revenu
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        partner
      </code>
    </td>
    
    <td>
      
    </td>
    
    <td>
      Un échange : l'item échangé, et où il se trouve maintenant
    </td>
    
    <td>
      La même chose, après le dépôt
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      , <code>
        copy
      </code>
    </td>
    
    <td>
      Combien d'items, et si le glissement copie
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Événement
    </th>
    
    <th>
      Énoncé quand
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
      L'item est saisi.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      L'item passe à un autre endroit (un emplacement d'une liste, une autre cible), une fois que le glissement est resté immobile 500 ms.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      Il est déposé. Le nouvel ordre est déjà écrit.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Le glissement est annulé, ou le dépôt refusé : l'item est revenu.
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
      
       : le glissement continue (voir les <a href="/docs/guides/drop-decisions">
        décisions de dépôt
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

- Un texte remplace l'annonce de l'événement ; `undefined` garde celle par défaut ; `''` ne dit
rien. Les événements que vous omettez gardent leurs valeurs par défaut, comme les positions des
listes triables.
- `screenReaderInstructions` est le texte vers lequel chaque élément déplaçable pointe avec
`aria-describedby`. Les deux props sont réactives : la démo change de langue en direct.
- `:announcements="false"` rend la région muette, par exemple quand vous annoncez via la vôtre.

<note>

Pour une autre langue, donnez les cinq textes et les instructions : chacun de ceux que vous
omettez est énoncé en anglais, positions triables comprises. Définissez aussi le `lang` de la
page, pour que le lecteur d'écran choisisse la bonne voix.

</note>

## Déplacer sans glisser

Certaines personnes ne peuvent pas glisser du tout. Le critère WCAG 2.5.7 demande un moyen de
déplacer les items par de simples clics. Utilisez les flèches et la coche de chaque ligne : elles
déplacent les livres sans glissement, et le focus reste là où vous êtes.

<example height="27.5rem" hint="Utilisez les boutons fléchés au clavier, ou faites glisser une poignée" name="a11y-move-buttons">



</example>

Un bouton change les données ; la liste dessine le déplacement. Avec `animateChanges` sur la liste, les
lignes glissent comme pendant un glissement (et restent immobiles pour les utilisateurs qui
demandent un mouvement réduit) :

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animateChanges: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};
```

```vue [ReadingList.vue]
<p class="status" role="status">{{ message }}</p>
```

### Garder le focus

Déplacer un élément dans le DOM lui retire le focus : le bouton qui vient d'être pressé le perd
donc. Rendez-le une fois que la ligne a bougé :

```ts [BookRow.vue]
const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Back on the same button, or on the other one when this one is now disabled.
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};
```

Une ligne qui disparaît (la coche marque un livre comme lu) emporte le focus avec elle :
déplacez-le vers la ligne suivante, ou vers la dernière. Les glissements n'ont besoin de rien de
tout cela : la bibliothèque remet elle-même le focus sur l'item déposé, même quand il est rendu
de nouveau dans une autre liste.

<tip>

`@vue-dnd-kit/actions` transforme plutôt chaque bouton en vrai glissement au clavier :
`moveItem(id, { index })` est annoncé, passe par `onBeforeDrop` et `onDrop`, s'anime, et garde
le focus sur l'item. Voir les [glissements programmatiques](https://zizigy.github.io/docs/guides/sensors#programmatic-drags).

</tip>

## Tactile

Les glissements tactiles démarrent après un appui long de 200 ms. Bouger de plus de 5 px avant
cela fait défiler la page à la place : les listes restent donc défilables. Réglez les deux avec
l'`activation` du provider, et dessinez un anneau d'appui long à partir de
`useDnD().activation.progress` : voir [le provider](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag).
Un glissement tactile vibre brièvement quand il commence ; `:haptics="false"` le désactive.

## Mouvement réduit

Avec `prefers-reduced-motion: reduce`, les animations propres à la bibliothèque ne s'exécutent
pas : les items sautent à leur place pendant le tri, l'overlay ne vole pas au dépôt, et les
changements d'`animateChanges` apparaissent d'un coup. Vos propres fonctions d'animation s'exécutent
toujours, avec `reducedMotion: true` : c'est donc vous qui décidez, les sauter ou garder un bref
fondu. Voir les [animations](https://zizigy.github.io/docs/guides/animations).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
