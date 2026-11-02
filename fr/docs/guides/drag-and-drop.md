---
title: "Glisser-déposer"
description: "Le glissement libre avec makeDraggable et les cibles de dépôt avec makeDroppable — des cibles typées qui acceptent certains glissements et en refusent d'autres, un plan d'appartement, des corbeilles, des dossiers dans une liste, et des éléments simples qu'une liste accueille."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/drag-and-drop"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Utilisez `makeDraggable` et `makeDroppable` pour tout ce qui n'est pas une liste triable : des
déchets dans des poubelles, des meubles sur un plan, des fichiers dans des dossiers, une
corbeille, un échiquier.

<example height="29rem" hint="Triez les déchets dans les poubelles ; aucune poubelle n'accepte la pile" name="recycling">



</example>

## Un élément déplaçable

```vue [WasteItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ waste: { id: string; name: string; type: string } }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,      // read back as `active.id`
  type: () => props.waste.type,  // matched by the targets' `accept`
  data: () => props.waste,       // anything: `active.data`
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">{{ waste.name }}</div>
</template>
```

Passez l'id issu de vos données, sous forme de getter. L'id par défaut vient de `useId()` et
change pour chaque instance du composant : il ne signifie donc rien pour le reste de votre
application. Les options sont lues au moment où elles sont nécessaires : un getter ou une ref
les garde à jour.

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Ce qu'elle fait
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
        data
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      Qui est glissé, ce qu'il transporte, et ce que compare l'<code>
        accept
      </code>
      
       des cibles.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Un sélecteur ou un élément à l'intérieur : lui seul démarre un glissement. Voir les <a href="/docs/guides/sortable-lists#handles">
        poignées
      </a>
      
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
      Aucun glissement ne démarre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlay
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (par défaut) : une copie suit le pointeur. Un composant : votre propre aperçu. <code>
        false
      </code>
      
       : l'élément se déplace lui-même (<a href="#without-an-overlay">
        plus bas
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
    
    <td>
      Verrouiller le glissement sur <code>
        'x'
      </code>
      
       ou <code>
        'y'
      </code>
      
      , l'aligner sur une grille, le garder dans des limites : voir les <a href="/docs/guides/constraints">
        contraintes
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Comment les flèches le déplacent : au pixel (par défaut) ou de cible en cible (<a href="#keyboard">
        plus bas
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
      
      , <code>
        canDrag
      </code>
    </td>
    
    <td>
      Quand un appui devient un glissement : voir les <a href="/docs/guides/sensors">
        capteurs
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        attributes
      </code>
    </td>
    
    <td>
      <code>
        role
      </code>
      
      , <code>
        tabindex
      </code>
      
       et <code>
        aria-*
      </code>
      
       pour le clavier et les lecteurs d'écran (<code>
        true
      </code>
      
       par défaut).
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Renvoie
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
        isDragging
      </code>
    </td>
    
    <td>
      Cet élément est en cours de glissement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Modifiable, lié à la <a href="/docs/guides/multi-drag">
        sélection
      </a>
      
       du provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      Le décalage du glissement, pour <code>
        overlay: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
    </td>
    
    <td>
      L'id utilisé.
    </td>
  </tr>
</tbody>
</table>

Les boutons, les champs et les autres enfants interactifs ne démarrent pas de glissement au
pointeur : ils continuent donc de fonctionner à l'intérieur d'un élément déplaçable. Toutes les
options se trouvent dans l'[API de makeDraggable](https://zizigy.github.io/docs/api/make-draggable).

## Une cible de dépôt

```vue [Bin.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[] }>();
const emit = defineEmits<{ drop: [id: Key] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,   // 'glass', ['paper', 'cardboard'], a function…
  onDrop: (event) => emit('drop', event.active.id),
});
</script>

<template>
  <section ref="el" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" />
  </section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Renvoie
    </th>
    
    <th>
      <code>
        true
      </code>
      
       quand
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isOver
      </code>
    </td>
    
    <td>
      Le glissement est au-dessus de cette cible, qu'elle l'accepte ou non.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAccepting
      </code>
    </td>
    
    <td>
      Quelque chose est en cours de glissement et cette cible l'accepte : mettez en valeur les cibles valides.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placement
      </code>
    </td>
    
    <td>
      Pas un booléen : <code>
        { top, right, bottom, left }
      </code>
      
      , les moitiés de la cible où se trouve le pointeur, ou <code>
        null
      </code>
      
       quand elle n'est pas survolée. Utilisez-le pour « avant / après cette carte ».
    </td>
  </tr>
</tbody>
</table>

`isOver` sans `isAccepting` signifie que le glissement est au-dessus d'une cible qui le refuse.
Montrez-le, comme le font les poubelles ci-dessus : un dépôt à cet endroit est annulé et l'item
revient à sa place. Les poubelles qui ne peuvent pas accepter l'item s'estompent pendant son
trajet ; d'autres idées dans le [style](https://zizigy.github.io/docs/guides/styling#drop-targets-yes-and-no).

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Ce qu'elle fait
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
        data
      </code>
    </td>
    
    <td>
      Relus sous la forme <code>
        over.id
      </code>
      
       et <code>
        over.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
    
    <td>
      Les glissements qu'elle accepte (<a href="#which-drags-a-target-takes">
        section suivante
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Elle n'accepte rien, et les glissements passent au-dessus d'elle.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        priority
      </code>
    </td>
    
    <td>
      La plus haute l'emporte quand des cibles se chevauchent sans être imbriquées (0 par défaut).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
    </td>
    
    <td>
      Le glissement est entré ou sorti.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , <code>
        onDrop
      </code>
    </td>
    
    <td>
      Décider du dépôt, puis l'appliquer (<a href="#the-drop">
        plus bas
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Les glissements qu'une cible accepte

Le `type` d'un élément déplaçable est comparé à l'`accept` d'une cible :

<table>
<thead>
  <tr>
    <th>
      <code>
        accept
      </code>
    </th>
    
    <th>
      Accepte
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      omis ou <code>
        '*'
      </code>
    </td>
    
    <td>
      Tout.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'glass'
      </code>
    </td>
    
    <td>
      Les éléments déplaçables de type <code>
        glass
      </code>
      
      , et ceux sans type.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ['paper', 'cardboard']
      </code>
    </td>
    
    <td>
      L'un ou l'autre type, et ceux sans type.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ({ active, items, types }) => boolean
      </code>
    </td>
    
    <td>
      Ce que dit votre fonction.
    </td>
  </tr>
</tbody>
</table>

Un élément déplaçable sans `type` passe toute règle sous forme de chaîne. `type` peut aussi être
un tableau (`['paper', 'large']`) : un seul type correspondant suffit. Une fonction décide selon
n'importe quel aspect du glissement. Le composteur ci-dessus lit les données des items, pas leur
type :

```ts [waste.ts]
{
  id: 'compost',
  accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
}
```

`accept` est lu en direct, pendant que le glissement cherche sa cible : passez une ref pour le
changer.

Quand plusieurs items sont glissés à la fois, `acceptMode` indique combien doivent convenir :
`'all'` (par défaut) ou `'some'`. Avec `'some'`, renvoyez depuis `onBeforeDrop` les ids à garder,
et les autres reviennent à leur place. Voir les [décisions de dépôt](https://zizigy.github.io/docs/guides/drop-decisions).

## Le dépôt

L'`onDrop` d'une simple cible de dépôt est l'endroit où **vous** modifiez vos données. La
bibliothèque ne déplace rien d'elle-même :

```vue [index.vue]
<script setup lang="ts">
/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
</template>
```

<table>
<thead>
  <tr>
    <th>
      Champ de l'événement
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
        active
      </code>
    </td>
    
    <td>
      Le glissement : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
       (chacun <code>
        { id, data, type, item }
      </code>
      
      ), <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Cette cible : <code>
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
        pointer
      </code>
      
      , <code>
        delta
      </code>
    </td>
    
    <td>
      Où se trouve le pointeur, et de combien il s'est déplacé depuis le début.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Où se trouve la boîte glissée dans cette cible (<a href="#leave-it-where-it-was-dropped">
        section suivante
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        source
      </code>
    </td>
    
    <td>
      Renseigné quand les items viennent d'une liste triable : <code>
        { list, remove() }
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`active.ids` contient tous les ids glissés, en commençant par celui qui a été saisi. L'ordre est
`onBeforeDrop` (décider), `onDrop` (appliquer), puis le `drag-end` du provider. Pour entendre
tous les glissements de la page au même endroit, utilisez `useDnDMonitor` (voir
[le provider](https://zizigy.github.io/docs/guides/provider)). Pour demander avant un dépôt, prolonger le glissement ou
n'accepter que certains items, voir les [décisions de dépôt](https://zizigy.github.io/docs/guides/drop-decisions).

## Le laisser là où il a été déposé

Un plan d'appartement, un canevas, un tableau : l'item reste là où vous le lâchez. Chaque
événement transporte `position`, le `left` / `top` qui place un item positionné en absolu là où
il a été déposé.

<example height="28rem" hint="Faites glisser des meubles dans la pièce, déplacez-les, ou remettez-les en place" name="room-planner">



</example>

```ts [Planner.vue]
const room = useTemplateRef<HTMLElement>('room');
makeDroppable(room, {
  id: 'room',
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    // Clamped, so a piece let go half outside stays inside the walls.
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});
```

```vue [Piece.vue]
<div ref="el" class="piece" :style="{ left: `${piece.x}px`, top: `${piece.y}px` }">…</div>
```

`position` est le coin supérieur gauche de la boîte glissée dans `over`, mesuré depuis le bord
de son padding, défilement compris : la bordure de la pièce, ses murs, ne compte pas. Il vaut
`null` au-dessus de rien.

<tip>

Ne calculez pas l'emplacement à partir de `active.rect` et `delta` : cela ignore la bordure et le
défilement de la cible. Les grilles, les limites et le verrouillage d'axe pour ce genre de
tableaux se trouvent dans les [contraintes](https://zizigy.github.io/docs/guides/constraints).

</tip>

## Sans overlay

Par défaut, une copie de l'élément suit le pointeur, et l'élément reste en place : c'est ainsi
que fonctionnent les meubles en réserve. Avec `overlay: false`, il n'y a pas de copie, et
l'élément se déplace lui-même grâce au `transform` que renvoie le glissement : ce sont les
meubles dans la pièce.

```ts [Piece.vue]
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),   // a value or a ref, read when the drag starts
});

const style = computed(() => ({
  left: `${props.piece.x}px`,
  top: `${props.piece.y}px`,
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
```

- `position` est alors le coin de l'élément lui-même : le gestionnaire de dépôt reste le même.
- L'élément est sous le pointeur pendant qu'il bouge ; pour trouver la cible, la bibliothèque
regarde à travers lui. Placez-le au-dessus de ses voisins pendant le glissement (`z-index`).
- Il défile avec la page, l'overlay non : `transform` retranche ce dont son conteneur s'est
déplacé depuis le début du glissement, si bien qu'il reste sous le pointeur quand la page défile.
- Il se déplace à l'intérieur de son propre conteneur : un parent en `overflow: hidden` le
rogne, et son contexte d'empilement décide de ce au-dessus de quoi il passe. L'overlay n'a
aucun de ces deux problèmes.

Pour un aperçu personnalisé à la place de la copie, voir [l'overlay](https://zizigy.github.io/docs/guides/overlay).

## Corbeilles

Un glissement qui commence dans une liste triable transporte `e.source`. Appelez `remove()` et la
liste retire les items :

<example height="34rem" hint="Faites glisser une notification vers Done ou Delete, puis annulez" name="triage">



</example>

```ts [Triage.vue]
const triage = (bin: 'done' | 'deleted') => (e: DnDEvent) => {
  bins[bin].push(...e.active.items.map((entry) => entry.item as Notice));
  e.source?.remove();
};

makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });
```

- `e.active.items[i].item` est l'item de la liste lui-même. Gardez-le, et une annulation le remet
là où il était.
- L'`onDrop` propre à la liste s'exécute alors avec `to.index === -1`, et `e.result` contient la
liste sans les items.
- L'overlay rétrécit dans la zone, puisque l'item n'est plus affiché nulle part.
- Une liste peut aussi retirer ce qui est déposé en dehors de tout : voir
[`dropOutside`](https://zizigy.github.io/docs/guides/shared-lists#dropping-outside).

<note>

Au clavier, les flèches déplacent l'item d'une liste entre les emplacements de sa liste et les
listes de son groupe ; au-delà de la fin des listes, l'appui suivant l'emmène jusqu'à la cible de dépôt
dans cette direction, ici la corbeille, et la flèche opposée l'en ramène. Un bouton, un menu ou la touche `Delete`
reste plus rapide pour beaucoup de gens : proposez-en un aussi.

</note>

## Déposer dans un item triable

Une ligne d'une liste triable peut aussi être une cible de dépôt : un dossier qui accepte des
favoris, un groupe qui accepte des tâches. Placez un droppable sur l'élément de l'item :

<example height="28rem" hint="Déposez un lien au milieu d'un dossier ; près de ses bords, la liste se trie. Ouvrez un dossier pour en sortir des liens" name="bookmarks">



</example>

```ts [FolderRow.vue]
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link)); // Bookmarks adds them
    e.source?.remove();   // take them out of the list they came from
  },
});
```

Un dossier ouvert montre ses liens sous la forme d'une liste du même groupe, qui n'accepte que
des liens : ils s'y trient, et on peut les faire glisser hors du dossier, vers le premier niveau
ou dans un autre dossier.

Là où la liste trierait le glissement, une telle cible ne compte qu'au **milieu** de son item (de
25 à 75 % le long de l'axe de la liste). Là, le dépôt va dans l'item, et la liste ne bouge pas.
Près des bords, la liste se trie comme d'habitude.

- Une cible dont l'`accept` refuse le glissement est ignorée : la liste se trie au-dessus de
l'item comme au-dessus de n'importe quel autre. Les dossiers n'acceptent que des liens : un
dossier glissé se trie donc en passant les autres.
- Une cible ne reçoit jamais son propre glissement.
- Au clavier, une flèche s'arrête d'abord sur le dossier ; l'appui suivant dans la même direction
le dépasse.
- L'item n'est plus affiché après le dépôt : l'overlay rétrécit donc dans le dossier au lieu de
revenir à sa place.
- Au-dessus du dossier, la liste garde l'emplacement de la ligne glissée là où il était : rien
ne bouge sous le pointeur. L'emplacement reçoit alors `data-dnd-placeholder="into"` : le dépôt
n'y va pas, masquez-le donc si vous le souhaitez (`[data-dnd-placeholder='into'] { opacity: 0 }`).

Le [gestionnaire de fichiers](https://zizigy.github.io/docs/examples/file-manager) fait la même chose dans une grille,
avec des dossiers imbriqués.

## Des éléments déplaçables simples dans une liste

Une liste triable accueille les items glissés avec `makeDraggable` quand elle sait en faire un
item :

<example height="26rem" hint="Faites glisser un bloc dans l'agenda ; les horaires suivent le glissement" name="day-planner">



</example>

```ts [Agenda.vue]
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});
```

Pendant que l'élément déplaçable est au-dessus de la liste, l'item créé se trouve dans le
brouillon et votre template le rend comme n'importe quelle autre ligne : les horaires de l'agenda
le comptent déjà. Il devient réel au dépôt (`mode: 'insert'`, `from.list === null`), et l'overlay
atterrit dessus.

- Renvoyez `undefined` pour refuser. Les listes sans `createItem` ignorent les éléments
déplaçables simples.
- Donnez au nouvel item une clé à lui : le bloc reste dans la palette.
- Au clavier, une flèche vers la liste y fait entrer l'élément déplaçable, à sa hauteur, et les
flèches suivantes le déplacent d'emplacement en emplacement.

## Des fichiers depuis l'ordinateur

Les fichiers glissés depuis le bureau ou un gestionnaire de fichiers ne sont pas des glissements
de la bibliothèque : c'est le navigateur qui les transporte. Une cible de dépôt les accepte avec
`external`, et le dépôt les apporte dans `e.external` :

<example height="22rem" hint="Faites glisser des images ou des PDF depuis votre ordinateur sur les zones" name="file-drop">



</example>

```ts [AvatarDrop.vue]
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});
```

- `files` se lit comme `<input accept>` : des types MIME (`image/*`, `application/pdf`) et des
extensions (`.md`). `true` accepte n'importe quel fichier, une fonction décide fichier par
fichier. `links` et `text` acceptent ce que glissent les autres applications et onglets,
`types` n'importe quel autre type MIME.
- Le glissement se déroule comme un glissement du provider : `isOver`, `isAccepting`, les
événements et les annonces fonctionnent comme pour n'importe quel autre. Les cibles sans
`external` l'ignorent. Il n'y a pas d'overlay : le navigateur dessine l'image glissée.
- Tant que les fichiers sont tenus au-dessus de la page, le navigateur ne donne que leurs types
(`e.external.fileTypes`). Leurs noms, tailles et contenus arrivent avec le dépôt, et les
extensions sont vérifiées à ce moment-là. Les dossiers sont ignorés ; avec `multiple: false`,
un glissement de plusieurs fichiers est refusé.

Les listes acceptent aussi des fichiers, des liens et du texte, et leur font de la place pendant
qu'ils sont tenus. Les items peuvent aussi quitter la page, vers une autre application ou une
autre de vos fenêtres : voir [fichiers et autres applications](https://zizigy.github.io/docs/guides/native).

<tip>

Les personnes qui utilisent le clavier ou un lecteur d'écran ne peuvent pas faire glisser de
fichiers. Proposez un `<input type="file">` à côté de la zone, comme le fait la démo avec Browse.

</tip>

## Clavier

Un élément déplaçable qui a le focus est saisi avec <kbd value="Space">



</kbd>

 ou <kbd value="Enter">



</kbd>

,
déposé avec les mêmes touches, et <kbd value="Escape">



</kbd>

 annule. Entre les deux, les flèches le
déplacent :

<table>
<thead>
  <tr>
    <th>
      <code>
        keyboard
      </code>
    </th>
    
    <th>
      Une flèche
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'pixels'
      </code>
      
       (par défaut)
    </td>
    
    <td>
      Le déplace de 25 px, le <code>
        keyboard.step
      </code>
      
       du provider. Avec <kbd value="Shift">
        
      </kbd>
      
      , quatre fois plus loin. Les meubles se déplacent ainsi.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'droppables'
      </code>
    </td>
    
    <td>
      Saute vers la cible la plus proche dans cette direction qui l'accepte. Les déchets sautent de poubelle en poubelle, et ignorent celles qui les refusent.
    </td>
  </tr>
</tbody>
</table>

```ts
makeDraggable(el, { id: () => props.waste.id, type: () => props.waste.type, keyboard: 'droppables' });
```

Les touches peuvent être réassignées sur le provider. Plus de détails dans
l'[accessibilité](https://zizigy.github.io/docs/guides/accessibility).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
