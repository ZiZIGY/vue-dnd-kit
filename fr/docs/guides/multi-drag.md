---
title: "Multi-drag et sélection"
description: "Sélectionnez plusieurs items par clics ou par un rectangle de sélection et faites-les glisser ensemble — en bloc, en laissant des trous, ou empilés dans l'overlay —, n'en acceptez qu'une partie au dépôt, et montrez-les dans votre propre overlay."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/multi-drag"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Sélectionnez quelques fichiers, puis faites glisser l'un d'eux : les autres suivent. Changez
`multiple` pour voir ce qu'ils font en chemin, et la disposition pour voir l'overlay d'une
grille.

<example height="35rem" hint="Cliquez, Ctrl/Cmd-cliquez ou Maj-cliquez des fichiers, puis faites-en glisser un ; changez de mode" name="multi-modes">



</example>

## La sélection

Chaque provider garde une sélection : un ensemble réactif d'ids. Faire glisser un item
**sélectionné** fait glisser tous les items sélectionnés, en commençant par celui qui a été
saisi. Faire glisser un item qui n'est pas sélectionné ne fait glisser que cet item.

La bibliothèque ne décide pas de la façon dont on sélectionne : les règles de clic sont les
vôtres. Elle ne vide jamais non plus la sélection d'elle-même, et la sélection survit aux
démontages, comme ceux des lignes qu'une liste virtuelle recycle.

### Clics : Ctrl/Cmd et Maj

Chaque item triable et chaque élément déplaçable renvoie `selected`, une ref modifiable liée à
la sélection. Liez-la à une classe, à une case à cocher (`v-model="selected"`), ou modifiez-la
dans un gestionnaire de clic :

```vue [FileItem.vue]
<script setup lang="ts">
const { selected } = makeSortableItem(el, { item: () => props.file });
</script>

<template>
  <li ref="el" class="file" :class="{ selected }" @click="emit('pick', $event)">…</li>
</template>
```

La liste de la démo définit les règles : un clic sélectionne un fichier, Ctrl/Cmd-clic en ajoute
ou en retire un, Maj-clic sélectionne la série depuis le dernier fichier cliqué :

```ts [Files.vue]
const { selection } = useDnD();
let anchor: string | null = null;

const pick = (id: string, event: MouseEvent) => {
  const ids = items.value.map((file) => file.id);
  if (event.shiftKey && anchor) {
    const [a, b] = [ids.indexOf(anchor), ids.indexOf(id)];
    selection.set(ids.slice(Math.min(a, b), Math.max(a, b) + 1));
    return;
  }
  if (event.ctrlKey || event.metaKey) selection.toggle(id);
  else selection.set([id]);
  anchor = id;
};
```

Le clic qui termine un glissement n'atteint pas `@click` : un dépôt ne change donc jamais la
sélection par accident. Utilisez `@click`, et non `pointerup`, pour les actions sur les items.

### De n'importe où : `useDnD().selection`

```ts
import { useDnD, useDnDMonitor } from '@vue-dnd-kit/core';

const { selection } = useDnD();

selection.has('a');               // is it selected?
selection.add('a', 'b');          // select
selection.delete('a');            // deselect
selection.toggle('a');            // flip it, or force it: toggle('a', true)
selection.set(['a', 'c']);        // exactly these
selection.clear();
selection.ids;                    // a reactive ReadonlySet<Key>

// Clear it after every drop, if your UI wants that:
useDnDMonitor({ onDragEnd: () => selection.clear() });
```

La sélection est indexée par id : elle peut donc contenir des items de plusieurs listes, ainsi
que des éléments déplaçables simples. Un glissement emporte tous les items sélectionnés sous le
provider.

## Rectangle de sélection

`makeSelectionArea` fait d'un élément une zone où un appui sur l'espace vide dessine un
rectangle, et où les items qu'il traverse sont sélectionnés. Sur ce bureau, tracez un rectangle
autour de quelques icônes, puis faites glisser l'une d'elles :

<example height="29rem" hint="Tracez un rectangle sur le bureau vide, puis faites glisser une icône sélectionnée" name="multi-select">



</example>

```vue [Desktop.vue]
<script setup lang="ts">
const desktop = useTemplateRef<HTMLElement>('desktop');
const { isSelecting, style } = makeSelectionArea(desktop);
</script>

<template>
  <!-- The area needs a position: the band is placed inside it. -->
  <div ref="desktop" class="desktop">
    <DesktopIcon v-for="icon in icons" :key="icon.id" :icon="icon" />
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>

<style scoped>
.desktop { position: relative; height: 236px; }
.band { border: 1px solid #42b883; background: color-mix(in srgb, #42b883 15%, transparent); }
</style>
```

- C'est vous qui rendez le rectangle : `style` le positionne, par rapport au contenu de la zone.
- La zone a besoin d'une **position non statique** (`relative` suffit), sinon le rectangle
atterrit ailleurs.
- Un rectangle ne démarre que depuis la zone elle-même : rendez donc la zone grande, tout le
panneau, avec de l'espace autour des items, et non une enveloppe ajustée.
- Un appui sur un item le fait glisser. Les boutons, les champs et la barre de défilement de la
zone gardent leurs appuis.
- Le rectangle reste ancré au contenu pendant que la zone ou la page défile.
<kbd value="Escape">



</kbd>

 l'annule et restaure la sélection.
- `useDnD().status` vaut `'selecting'` pendant qu'un rectangle est tracé : la ligne sous le
bureau le lit.

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
        strategy
      </code>
    </td>
    
    <td>
      <code>
        'toggle'
      </code>
      
       (par défaut) : les items que traverse le rectangle basculent. <code>
        'select'
      </code>
      
       : seuls les items à l'intérieur du rectangle finissent sélectionnés, si bien qu'un clic sur l'espace vide désélectionne les items de la zone.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier
      </code>
    </td>
    
    <td>
      Les touches à maintenir pour tracer : <code>
        { keys: ['Shift'], method: 'every' }
      </code>
      
       (ou <code>
        'some'
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
    </td>
    
    <td>
      Les éléments déplaçables que le rectangle sélectionne, une <a href="/docs/guides/drag-and-drop#which-drags-a-target-takes">
        règle d'acceptation
      </a>
      
       comparée à leur <code>
        type
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
      Pas de rectangle ; l'activer annule celui en cours.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelected(ids)
      </code>
    </td>
    
    <td>
      Appelée quand un rectangle se termine, avec la sélection.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy
      </code>
      
      , <code>
        modifier
      </code>
      
       et <code>
        disabled
      </code>
      
       acceptent une valeur, une ref ou un getter, lus quand un
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      appui démarre un rectangle. Avec des zones dans des zones, la plus intérieure prend l'appui. La
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      page de l'<a href="/docs/api/make-selection-area">
        API de makeSelectionArea
      </a>
      
       les change en direct.
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

### Les déplacer tels qu'ils sont disposés

Les icônes sont des éléments déplaçables simples (`makeDraggable`), chacune avec son icône en
`data`. Leur overlay est un composant propre à la démo : il dispose un `DragPreview` de chaque
icône glissée comme les icônes sont disposées sur le bureau, autour de celle qui a été saisie.
Les icônes attendent à leur place, estompées par `isDragging`, qui reste `true` jusqu'à ce que
leurs copies aient atterri.

```vue [Formation.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[] }>();

const placed = computed(() => {
  const grabbed = props.items[0]!.data as Icon;
  return props.items.map(({ id, data }) => {
    const icon = data as Icon;
    return { id, left: `${icon.x - grabbed.x}px`, top: `${icon.y - grabbed.y}px` };
  });
});
</script>

<template>
  <div class="formation">
    <DragPreview v-for="{ id, left, top } in placed" :id="id" :key="id" class="copy" :style="{ left, top }" />
  </div>
</template>
```

```ts [DesktopIcon.vue]
const { isDragging, selected } = makeDraggable(el, { id, data: () => props.icon, overlay: Formation });
```

Le bureau reçoit le dépôt. Sa `position` est l'endroit où l'icône saisie a été relâchée, dans
les coordonnées du bureau : l'icône va là, et les autres se déplacent d'autant. Chaque copie
atterrit ensuite sur sa propre icône, à sa nouvelle place. Déposées hors du bureau, les copies
reviennent vers les icônes.

```ts [Desktop.vue]
makeDroppable(desktop, {
  id: 'desktop',
  onDrop: ({ active, position }) => {
    const grabbed = icons.value.find((icon) => icon.id === active.id)!;
    const shift = { x: position!.x - grabbed.x, y: position!.y - grabbed.y };
    for (const icon of icons.value) {
      if (!active.ids.includes(icon.id)) continue;
      icon.x += shift.x; // the demo also keeps each icon on the desktop
      icon.y += shift.y;
    }
  },
});
```

Par défaut, un clone est pris à la saisie pour 5 items au plus : `overlay-previews="all"` sur le
provider en prend un pour chaque icône sélectionnée.

### Dans un dossier

Dans cette fenêtre, le rectangle sélectionne des fichiers, et les dossiers les acceptent.
L'overlay est celui par défaut : une pile des fichiers choisis. Déposés dans un dossier, ils y
entrent l'un après l'autre, celui qui a été saisi en dernier, et le dossier les avale. En cas
d'annulation, chacun revient en volant vers son fichier. Cliquez sur un dossier pour l'ouvrir, et
faites glisser des fichiers vers Home dans le chemin pour les y ramener.

<example height="33rem" hint="Tracez un rectangle autour de quelques fichiers, faites-les glisser sur un dossier" name="multi-finder">



</example>

```vue [index.vue]
<!-- Every picked file gets a clone at pickup: they all go in. -->
<DnDProvider overlay-previews="all">
  <Finder />
</DnDProvider>
```

```ts [FolderTile.vue]
makeDroppable(el, {
  id: () => props.folder.id,
  accept: 'file',
  onDrop: (event) => emit('move', event.active.ids),
});

// The files are in: the folder gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.over?.id === props.folder.id) gulps.value++;
  },
});
```

C'est tout ce qu'il faut : les fichiers quittent la fenêtre avec le dépôt, ils n'ont donc nulle
part où atterrir sauf dans le dossier, et l'animation de dépôt par défaut envoie un multi-drag
dans une zone un item après l'autre. `overlayPreviews` indique combien d'items reçoivent un clone
à la saisie (5 par défaut). Chaque clone vole : dans la zone, vers son emplacement, ou de retour
vers son item.

Le dossier est un bouton : un rectangle ne démarre jamais sur les boutons et les champs, donc un
clic l'ouvre.

## Comment bougent les autres items : `multiple`

La liste où commence un multi-drag décide de ce que font les autres items sélectionnés pendant
qu'il se déroule. Changez-le dans la première démo de cette page :

```ts
makeSortableList(listRef, { items: files, multiple: 'gaps' });
```

<table>
<thead>
  <tr>
    <th>
      <code>
        multiple
      </code>
    </th>
    
    <th>
      Pendant le glissement
    </th>
    
    <th>
      L'overlay
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'group'
      </code>
      
       (par défaut)
    </td>
    
    <td>
      Les autres items quittent leur place et voyagent avec celui qui a été saisi en un seul bloc d'emplacements : la liste montre déjà le résultat du dépôt.
    </td>
    
    <td>
      Une colonne des items glissés, dans le sens de la liste (jusqu'à <code>
        overlayPreviews
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'gaps'
      </code>
    </td>
    
    <td>
      Les autres restent où ils sont, marqués <code>
        data-dnd-dragging
      </code>
      
      , jusqu'au dépôt.
    </td>
    
    <td>
      La même colonne.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'stack'
      </code>
    </td>
    
    <td>
      Les autres s'envolent dans l'overlay.
    </td>
    
    <td>
      L'item saisi avec un compteur.
    </td>
  </tr>
</tbody>
</table>

Au dépôt, les items atterrissent ensemble à l'index cible, dans l'ordre qu'ils avaient. En
`'group'` et en `'gaps'`, chaque item de l'overlay vole vers son propre emplacement. L'option est
lue quand un glissement commence : une ref ou un getter permet donc de la changer.

Au-dessus d'une cible de dépôt qui n'est pas une liste, comme une corbeille ou une playlist, ou
au-dessus d'une liste qui refuse le glissement, un bloc `'group'` se défait : chaque item
s'affiche de nouveau à sa propre place, comme l'y laisserait un dépôt à cet endroit, et le bloc
se reforme dès qu'une liste est survolée.

Stylisez les items laissés en place en `'gaps'`, estompés par défaut :

```css
.file[data-dnd-dragging] {
  opacity: 0.35;
}
```

### L'overlay par défaut

En `'group'` et en `'gaps'`, l'overlay est une colonne des items glissés tels qu'ils vont
atterrir : celui qui a été saisi sous le pointeur, les autres avant et après lui dans l'ordre du
dépôt (une rangée dans les listes horizontales). Il en affiche autant que l'indique l'option
`overlayPreviews` du provider (5 par défaut, `'all'` pour tous ceux qui sont rendus). Ceux qui
dépassent sont comptés là où ils se trouvent : `+N` au début de la colonne pour les items qui
atterrissent avant ceux qui sont affichés, `+N` à la fin pour ceux d'après.

Dans les grilles, une colonne de cellules entières couvrirait la page : l'overlay est donc une
pile, jusqu'à trois items déployés en éventail derrière celui qui a été saisi, avec le total
par-dessus. Passez la démo en Grid pour le voir.

Les éléments déplaçables simples (`makeDraggable`) forment aussi une pile, comme les fichiers
ci-dessus. Chaque clone de l'overlay atterrit de lui-même : sur son emplacement après un dépôt
dans une liste, sur son item là où le dépôt l'a laissé (de retour à sa place après une
annulation), et dans la zone où entre un dépôt quand les items ont quitté la page, l'un après
l'autre, la boîte en dernier.

## N'en accepter qu'une partie

L'`onBeforeDrop` d'une liste peut accepter une partie d'un multi-drag : renvoyez les clés
qu'elle accepte, et les autres reviennent d'où elles viennent. Il peut être asynchrone, et poser
une question : l'overlay attend là où il a été relâché jusqu'à ce que la réponse arrive. Ici,
Scheduled veut des posts avec une couverture. Si l'un d'eux n'en a pas au dépôt, la liste demande
s'il faut ajouter les couvertures manquantes et tout prendre, ne prendre que les posts prêts, ou
aucun :

<example height="28.5rem" hint="Faites glisser les trois brouillons choisis dans Scheduled, puis répondez" name="multi-transfer">



</example>

```ts [PostList.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  items: posts,
  group: 'blog',
  onBeforeDrop: async (event) => {
    const missing = event.items.filter((post) => post.cover === null);
    if (!props.ask || event.sameList || !missing.length) return true;
    const choice = await props.ask(missing, event.items.length - missing.length); // the question under the lists
    if (choice === 'cover') missing.forEach((post) => (post.cover = pickCover()));
    if (choice === 'ready') return event.keys.filter((_, index) => event.items[index]!.cover !== null);
    return choice === 'cover'; // all of them, or none: they fly back
  },
});
```

- `event.keys` sont les clés glissées, et `event.items[i]` est l'item de `event.keys[i]`.
- Après la réponse, `onDrop` reçoit `accepted` et `rejected`, et `event.result` contient les
listes telles que les laisse le dépôt partiel.
- Pendant que le dépôt attend, les listes continuent de montrer chaque post glissé là où il
atterrirait : c'est la réponse qui décide. Pour une règle qui n'a pas besoin de question,
`group.put` décide pendant le survol (voir les [types mélangés](#mixed-types) plus bas). Plus de
détails dans les [décisions de dépôt](https://zizigy.github.io/docs/guides/drop-decisions).

### Une limite

Sur ce tableau, In progress et Review ont une limite de cartes. Une colonne pleine n'accepte rien :
son `group.put` refuse, et la pile devient rouge au-dessus d'elle. Une colonne qui a de la place
pour une partie des cartes choisies en accepte autant qu'il en tient, et les autres reviennent à
leur place. L'overlay de la colonne l'indique avant le dépôt.

<example height="31rem" hint="Cochez trois cartes dans To do, faites-en glisser une au-dessus de Review, puis de In progress" name="multi-wip">



</example>

```ts [WipColumn.vue]
const room = (keys: Key[]) => limit - column.cards.filter((card) => !keys.includes(card.id)).length;

makeSortableList(list, {
  items: cards,
  group: { name: 'board', put: ({ keys, from, to }) => from === to || room(keys) > 0 },
  multiple: 'stack',
  overlay: CardPile, // red where `accepted` is false
  overOverlay: fit,
  onBeforeDrop: (event) => {
    if (event.sameList) return true;
    const free = room(event.keys);
    return free >= event.keys.length || event.keys.slice(0, free);
  },
});
```

`fit` est une fonction, que Vue prend comme un composant fonctionnel. Elle passe à `FitBadge` ce
que seule la colonne sait, sa place libre, et transmet la pile comme slot du badge.

```ts
const fit: FunctionalComponent<OverlayProps> = (overlay, { slots }) =>
  h(FitBadge, { count: overlay.items.length, room: room(overlay.items.map((item) => item.id)), limit }, slots);
```

### Types mélangés

Une liste peut aussi refuser certains items selon leur type, avant le dépôt. Avec
`acceptMode: 'some'`, `group.put` est interrogé pour chaque item séparément : la liste accepte le
glissement dès qu'au moins un item convient, et les autres reviennent à leur place au dépôt.
Avec `'all'` (la valeur par défaut), chaque item doit convenir.

```ts
makeSortableList(gallery, {
  items: photos,
  group: { name: 'files', put: ({ types }) => types.includes('image') },
  acceptMode: 'some',
});
```

Les simples cibles de dépôt acceptent aussi `acceptMode`. Voir les
[listes qui partagent des items](https://zizigy.github.io/docs/guides/shared-lists#limits) et le
[glisser-déposer](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes).

## Un overlay personnalisé pour plusieurs items

Les composants d'overlay et le slot `#overlay` du provider reçoivent `items` : tous les items
glissés, en commençant par celui qui a été saisi. Montrez un résumé plutôt que les items
eux-mêmes : ici un compteur, le premier sujet, et ce que fera le dépôt.

<example height="26rem" hint="Faites glisser les mails cochés vers Archive ou Trash, ou faites-en glisser un seul" name="multi-summary">



</example>

```vue [MailOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();

const first = computed(() => props.items[0]?.item as Mail);
const count = computed(() => props.items.length);
// What the drop does, from the `data` of the zone under it.
const zone = computed(() => props.over?.data as { verb: string; danger?: boolean } | undefined);
const action = computed(() => {
  const noun = count.value === 1 ? 'conversation' : 'conversations';
  return `${zone.value?.verb ?? 'Move'} ${count.value} ${noun}`;
});
</script>

<template>
  <!-- The box keeps the row's size; the summary hangs off its middle, by the pointer. -->
  <div class="box">
    <div class="summary" :class="{ stack: count > 1, danger: zone?.danger }">
      <span class="count">{{ count }}</span>
      <strong>{{ action }}</strong>
      <small>{{ first.subject }}{{ count > 1 ? ` and ${count - 1} more` : '' }}</small>
    </div>
  </div>
</template>

<style scoped>
.box { position: relative; width: 100%; height: 100%; }
.summary { position: absolute; top: calc(50% + 10px); left: calc(50% + 10px); width: 230px; }
</style>
```

```ts [Mailbox.vue]
// The box is centered on the pointer, so the summary hangs off the pointer and leaves
// the zone under it in sight.
const { items } = makeSortableList(list, { items: mails, overlay: MailOverlay, modifiers: [snapCenterToCursor] });

// A zone takes the mails out of the inbox; its `data` tells the overlay what it does.
makeDroppable(archive, {
  id: 'Archive',
  data: { verb: 'Archive' },
  onDrop: (event) => {
    event.source?.remove();
    selection.clear();
  },
});
```

Pour disposer les vrais items à la place, rendez leurs clones avec `DragPreview`, comme le fait
le [bureau](#moving-them-as-they-lie) ci-dessus ; le
[guide de l'overlay](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) déploie une pile
de livres en éventail. Les clones sont pris à la saisie pour l'item saisi et les autres à
côté de lui dans l'ordre du dépôt, autant que l'indique `overlayPreviews` ; pour tout autre item,
`DragPreview` rend son slot par défaut. Au dépôt, chaque aperçu atterrit sur son propre item.

## Arbres

Dans un arbre, les nœuds sélectionnés se déplacent en un seul bloc, chacun avec son sous-arbre,
dans l'ordre du document. Un nœud sélectionné à l'intérieur d'un autre nœud sélectionné voyage
dans le sous-arbre de son parent. Voir les [arbres](https://zizigy.github.io/docs/guides/trees).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
