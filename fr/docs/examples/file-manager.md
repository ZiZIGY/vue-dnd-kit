---
title: "Gestionnaire de fichiers"
description: "Un drive dans le cloud — vues en grille et en liste, un rectangle de sélection, des dossiers qui acceptent les dépôts partout et s'ouvrent au survol, Alt pour copier, une corbeille avec Undo, et des fichiers déposés depuis votre bureau."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/examples/file-manager"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Tracez un rectangle autour de fichiers, déposez-les sur un dossier ; Alt copie" name="file-manager" title="Gestionnaire de fichiers">



</example>

## Ce qu'il faut regarder

- **FileView.vue** : le dossier ouvert est une seule liste triable, affichée en grille de tuiles
ou en liste de lignes. Le rectangle de sélection, les clics et les touches sélectionnent ; un
glissement emmène la sélection.
- **useFolderDrop.ts** : chaque dossier à l'écran est une cible de dépôt : les tuiles, les lignes
de l'arborescence, les favoris, les éléments du chemin, la corbeille. Il dit pourquoi il refuse
un glissement, et avale les fichiers quand ils sont entrés.
- **FilesOverlay.vue** : ce qui suit le pointeur, construit à partir des props que reçoit tout
overlay : une pile des vraies tuiles avec un compteur, un « + » pendant qu'Alt copie, et ce que
ferait le dépôt.
- **SidebarRow.vue** : un dossier fermé de l'arborescence s'ouvre quand un glissement s'attarde
dessus, pour que ses sous-dossiers puissent accepter le dépôt. **Favorites.vue** est une liste
triable à part entière, dont les lignes sont aussi des cibles de dépôt.
- **useDesktopDrop.ts** : les fichiers glissés depuis votre ordinateur. C'est le glisser-déposer
du navigateur, pas celui de la bibliothèque, géré à côté.
- **drive.ts** : l'état et chaque changement, avec Undo. **index.vue** : le provider, avec les
touches réassignées et ses annonces.

## Une liste, deux vues

La grille et la liste sont la même liste triable. Ses options sont des getters, lus quand un
glissement commence : la stratégie suit la vue, et un dossier trié par une colonne
(`sort: false`) ne se réordonne pas. Les glissements entrent quand même dans ses dossiers.

```ts [FileView.vue]
const { items } = makeSortableList(list, {
  items: drive.entries,   // the open folder, sorted by a column or in your own order
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  sort: () => drive.sort.value.key === 'manual',
  multiple: 'gaps',       // the other picked files wait in place, as in Finder
  clone: drive.duplicateOf, // Alt-drag leaves the files and drops "Budget copy.xlsx"
  dropzone: area,         // the empty space takes drops too
  animateChanges: true,   // a new sort, a new folder, files sent to the Trash slide and fade
});
```

- `drive.entries` est un computed modifiable : la bibliothèque réécrit chaque dépôt via son `set`,
et l'`onDrop` de la liste sauvegarde d'abord le drive, pour Undo.
- La fenêtre crée une nouvelle vue pour chaque dossier (`:key` sur `FileView`) : en ouvrir un
n'est donc pas un changement de la liste qu'`animateChanges` jouerait.

## Sélectionner

Le provider garde la sélection ; la vue décide comment on la fait. Un appui sur l'espace vide
trace un rectangle : seul, il remplace la sélection ; avec Maj, Ctrl ou Cmd maintenu, il bascule
les tuiles qu'il traverse. La stratégie est un getter, lu quand un rectangle commence :

```ts [FileView.vue]
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});

// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
};
```

Les clics suivent le Finder : un clic en choisit un, Ctrl/Cmd-clic l'ajoute ou le retire, Maj-clic
prend la série depuis le dernier. Les flèches déplacent un seul arrêt de tabulation à travers les
fichiers (un `tabindex` itinérant, auquel la bibliothèque ne touche pas), Maj+flèches étendent,
Entrée ouvre, F2 renomme, Suppr envoie à la corbeille, taper saute à un nom. Le provider rend
Entrée à l'application : seul Espace saisit un fichier.

```vue [index.vue]
<script setup lang="ts">
// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };
</script>

<template>
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
```

## Les dossiers acceptent les dépôts partout

`useFolderDrop` fait de n'importe quel élément un dossier qui accepte des fichiers. Une tuile est
aussi un item triable de la grille : là, la cible ne compte qu'au milieu de la tuile, et près de
ses bords la grille fait de la place. `accept` refuse le dossier où se trouvent les fichiers, et un
dossier dans lui-même ; une tuile refusée laisse la grille se trier au-dessus d'elle comme
au-dessus de n'importe quelle autre.

```ts [useFolderDrop.ts]
const { id, isOver, isAccepting } = makeDroppable(target, {
  disabled: () => !folder(),
  data: () => drive.placeOf(folder()!),   // { name, trash, why }: the overlay reads it as `over.data`
  accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
  onDrop: (event) => drive.dropInto(event, folder()!),
});

// The files are in once the overlay has landed in the folder: it gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
  },
});
```

`dropInto` déplace les fichiers, ou les copie quand `event.mode` vaut `'copy'` (Alt maintenu
au-dessus d'une liste dotée de `clone`). Un déplacement appelle `event.source.remove()` : la grille
lâche les fichiers, et son `onDrop` s'exécute avec `to.index === -1`.

```ts [drive.ts]
const dropInto = (event: DnDEvent, target: FolderEntry) => {
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
  record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
  if (copying) return put(target, dragged.map(copyEntry), current.value);
  put(target, dragged, current.value);
  // The grid lets them go: the library writes the open folder without them.
  event.source?.remove();
  selection.delete(...event.active.ids);
};
```

Un favori est à la fois un item triable (dans `Favorites.vue`, une liste de son propre groupe) et
une cible de dépôt : `FavoriteRow.vue` passe le composant de ligne à `makeSortableItem`, qui lit son
élément racine, et `SidebarRow.vue` fait du même élément un dossier. Près de ses bords, un favori
glissé se trie ; les fichiers déposés dessus entrent dans son dossier.

### Dossiers à ouverture automatique

Un dossier fermé de l'arborescence s'ouvre quand un glissement s'attarde dessus, comme dans le
Finder : `isOver` tient un instant, et la ligne se déplie. Ses sous-dossiers se montent en plein
glissement et acceptent les dépôts aussitôt.

```ts [SidebarRow.vue]
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), 700);
});
```

## L'overlay

`FilesOverlay.vue` est l'`overlay` de la liste. Depuis la grille, il empile des `DragPreview`, les
vrais clones des tuiles choisies : déposé sur un emplacement, chacun atterrit sur sa propre tuile ;
déposés dans un dossier, ils y entrent l'un après l'autre. Une ligne est aussi large que la liste :
la liste centre donc la boîte sur le pointeur (`snapCenterToCursor`) et l'overlay y accroche une
petite pastille. L'overlay est une fonction, que Vue prend comme un composant fonctionnel : il
transmet les props qu'il lit et dit lequel des deux dessiner.

```ts [FileView.vue]
overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
  h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
```

Sous la pile, une pilule dit ce que ferait le relâchement, d'après le `data` du dossier : "Move to
Photos", "Copy to Photos" pendant qu'Alt est maintenu (`mode`), ou en rouge pourquoi non, là où
`accepted` vaut `false`.

```ts [FilesOverlay.vue]
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
```

Les `announcements` du provider lisent le même `data` : un lecteur d'écran entend donc "Over
Photos. Drop to move 3 items there", ou "Already in Documents". Elles nomment les fichiers, là où
les textes intégrés diraient leurs clés.

## Des fichiers depuis votre bureau

Faites glisser des fichiers depuis votre ordinateur sur la fenêtre : ils sont téléversés dans le
dossier sous le pointeur (une tuile, une ligne de la barre latérale, un élément du chemin), sinon
dans le dossier ouvert, et les photos s'affichent. La bibliothèque fait glisser des éléments de la
page ; les fichiers venus de l'extérieur arrivent avec le glisser-déposer propre au navigateur,
`dragover` et `drop`, géré à côté :

```ts [useDesktopDrop.ts]
const dragover = (event: DragEvent) => {
  if (!carriesFiles(event)) return;
  // Cancelled, a `dragover` says the drop is welcome here.
  event.preventDefault();
  const folder = folderAt(event); // under the pointer: an element with a folder's `data-id`
  // …nothing goes into the Trash…
  drive.uploadTarget.value = folder.id; // that folder opens, as for the library's drags
};
```

## Undo, la corbeille, et le reste

- Chaque changement sauvegarde d'abord une copie du drive ; l'Undo du toast (ou Ctrl/Cmd+Z) y
revient. La corbeille est un dossier hors de l'arborescence : ce qu'elle contient se souvient
d'où il vient, et Put Back l'y remet.
- `ContextMenu.vue` (un clic droit, Maj+F10 ou le bouton « ⋯ ») agit sur la sélection, ou sur le
dossier ouvert : Rename sur place, Duplicate, Add to Favorites, Move to Trash, Empty Trash.
- La fenêtre remplit la scène quand vous l'agrandissez, et le panneau d'infos s'ouvre à côté des
fichiers. Sur un téléphone, la barre latérale est un tiroir ; un toucher ouvre un dossier et un
appui long saisit un fichier.

En savoir plus : [Multi-drag et sélection](https://zizigy.github.io/docs/guides/multi-drag) ·
[Déposer dans un item triable](https://zizigy.github.io/docs/guides/drag-and-drop#drop-into-a-sortable-item) ·
[`DragPreview`](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[Changements de données : `animateChanges`](https://zizigy.github.io/docs/guides/animations#data-changes-animatechanges) ·
[Accessibilité](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
