---
title: "Canevas de design"
description: "Un éditeur à la Figma — des frames et des calques sur un canevas zoomable, des repères intelligents, un rectangle de sélection, Alt pour dupliquer, et un panneau des calques qui est l'arbre du design."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/examples/design-canvas"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="43rem" hint="Faites glisser un calque dans l'autre frame ; tracez un rectangle, Maj-clic, maintenez Alt pour déposer des copies" name="design-canvas" title="Canevas de design">



</example>

## Ce qu'il faut regarder

- **Shape.vue** et **Artboard.vue** : chaque calque est un élément déplaçable simple, et une
frame se fait glisser par son nom (`handle`), avec ses calques à l'intérieur. Un appui
sélectionne tout de suite, comme dans Figma : la sélection du provider est donc ce qu'un
glissement emmène ; appuyez sur l'un de plusieurs calques sélectionnés et ils bougent tous.
- **useLayerDrop.ts** : le canevas et chaque frame sont des cibles de dépôt qui fonctionnent de la
même façon. Un calque relâché au-dessus d'une frame y entre ; au-dessus du canevas, il en sort.
Maintenez <kbd value="Alt">



</kbd>

 et ce sont des copies qui atterrissent, les calques restant où ils
étaient.
- **LayersPanel.vue** : le panneau est `makeSortableTree` sur le design lui-même. L'ordre des
lignes est l'ordre d'empilement, et déposer une ligne dans une frame y déplace le calque.
- **Canvas.vue** : les repères intelligents sont un modificateur propre à la démo ;
`makeSelectionArea` trace le rectangle de sélection, et `makeDragArea` donne ses règles à chaque
glissement qui commence sur le canevas.
- **editor.ts**, **geometry.ts** et **design.ts** : le design, son historique, la vue et les
calculs de l'aimantation et de l'alignement, sans aucun glisser-déposer.

## Dessiné au zoom

Le canevas zoome sans `scale()` CSS : chaque calque est mis en page à sa taille multipliée par le
zoom, en pixels d'écran. Ce que mesure la bibliothèque est donc ce qui est à l'écran : les cibles
de dépôt, le rectangle de sélection et les clones de l'overlay n'ont besoin de rien de
particulier. Le monde à l'intérieur du canevas n'est déplacé que par le panoramique, avec
`translate()`.

```ts [Shape.vue]
const style = computed(() => {
  const { zoom } = editor.view;
  const { x, y, width, height } = props.shape;
  return { left: `${x * zoom}px`, top: `${y * zoom}px`, width: `${width * zoom}px`, height: `${height * zoom}px` };
});
```

La molette fait défiler et zoomer (<kbd value="Ctrl">



</kbd>

 ou un pincement), tout comme un glissement
avec <kbd value="Space">



</kbd>

, l'outil main et les boutons dans le coin : de simples événements de
pointeur et de molette, comme les poignées de redimensionnement. Espace étant la main, un calque
se saisit avec <kbd value="Enter">



</kbd>

 seul (le `keyboard.keys` du provider).

## Déplacer des calques entre les frames

Un calque est un élément déplaçable simple avec un overlay à lui, `DragGroup.vue`. Il dispose les
calques glissés comme ils sont placés : un `DragPreview` (le clone pris à la saisie) de chacun,
placé d'après le `data` de son calque, là où il est dessiné. Les calques eux-mêmes s'effacent
pendant que leurs clones bougent, sauf si <kbd value="Alt">



</kbd>

 est maintenu.

```ts [Shape.vue]
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.shape.id,
  type: 'layer',
  data: () => editor.dragData(props.shape), // { layer, left, top }
  overlay: DragGroup,
});
```

Au dépôt, `position` est l'endroit où le coin du calque saisi a été relâché dans la cible, en
pixels d'écran. Divisé par le zoom, il dit de combien ce calque s'est déplacé dans le monde, et
chaque calque glissé se déplace d'autant, dans la frame ou sur le canevas :

```ts [useLayerDrop.ts]
const corner = target ? editor.boxOf(target) : { x: -view.x / view.zoom, y: -view.y / view.zoom };
const toWorld = (x: number, y: number) => ({ x: corner.x + x / view.zoom, y: corner.y + y / view.zoom });

const from = editor.boxOf(grabbed); // the layer of `active.id`
const to = toWorld(position.x, position.y);
editor.move(active.ids, { x: to.x - from.x, y: to.y - from.y }, target, editor.altHeld.value);
```

Une frame accepte des calques, pas des frames : un glissement qui transporte une frame passe
au-dessus des autres frames (`disabled`, lu en direct) jusqu'au canevas. Les cibles ont
`dropAnimation: false`, car les calques apparaissent juste là où leurs clones ont été relâchés.
Les outils de la barre d'outils sont aussi des éléments déplaçables simples : déposés sur une
frame, ils y ajoutent leur calque, centré sur le point de dépôt ; cliqués, au milieu de la vue.

```ts [Artboard.vue]
makeDroppable(body, {
  id: () => props.frame.id,
  accept: 'layer',
  disabled: () => !!active.value?.items.some((item) => item.type.includes('frame')),
  dropAnimation: false,
  onDrop: useLayerDrop(() => props.frame),
});
```

## Repères intelligents

`smartGuides` est un modificateur : il reçoit le décalage du glissement, calcule où seraient les
calques glissés dans le monde, et les attire sur le bord ou le centre le plus proche d'un autre
calque à moins de 6 pixels d'écran. L'overlay, la cible en dessous et le dépôt suivent tous. Un
moniteur dessine les lignes roses et les distances d'après le `delta` du glissement, le décalage
après les modificateurs.

```ts [Canvas.vue]
const smartGuides: Modifier = ({ transform, active }) => {
  const moving = editor.boundsOf(active.ids);
  if (!moving) return transform; // a tool from the toolbar
  const { zoom } = view;
  const box = offsetBox(moving, transform.x / zoom, transform.y / zoom);
  const targets = editor.snapTargets(active.ids);
  return {
    x: transform.x + snapBox(box, targets, 'x', SNAP / zoom) * zoom,
    y: transform.y + snapBox(box, targets, 'y', SNAP / zoom) * zoom,
  };
};

// Every drag that starts on the canvas, frames and layers alike, gets the guides.
makeDragArea(viewport, { modifiers: [smartGuides], disabled: panning });
```

Les poignées de redimensionnement s'aimantent sur les mêmes lignes et dessinent les mêmes repères.

## Sélectionner

Un rectangle de sélection tracé sur le canevas vide sélectionne les frames et les calques isolés ;
tracé dans une frame, les calques de la frame. Les deux sont des `makeSelectionArea` : la zone la
plus intérieure prend l'appui, et possède les éléments déplaçables qu'elle contient.
<kbd value="Shift">



</kbd>

 ajoute à la sélection (`strategy: 'toggle'`).

```ts [Artboard.vue]
const { isSelecting, style: band } = makeSelectionArea(body, {
  strategy: () => (editor.shiftHeld.value ? 'toggle' : 'select'),
  disabled: editor.panning,
});
```

L'éditeur ne sélectionne jamais une frame en même temps qu'un calque qu'elle contient : glissé,
le calque bougerait deux fois. Un rectangle capture le pointeur dès qu'il commence : un clic sur
l'espace vide d'une frame n'atteint donc jamais la frame ; `Artboard.vue` sélectionne la frame
quand un appui à cet endroit est relâché là où il a commencé.

## Le panneau des calques

Les items de l'arbre sont le design : des frames avec leurs `children`, la ligne du haut devant.
`canNest` laisse les frames accepter des calques et garde les frames au premier niveau. Les lignes
ont des clés à elles (`row:…`), car les ids des calques appartiennent à leurs éléments
déplaçables sur le canevas ; la sélection est celle du canevas : une ligne s'allume donc avec son
calque.

```ts [LayersPanel.vue]
makeSortableTree(tree, {
  items: editor.layers,
  getKey: (layer) => `row:${layer.id}`,
  canNest: (layer, parent) => parent.kind === 'frame' && layer.kind !== 'frame',
  maxDepth: 1,
  animate: true,
  onDrop: ({ items, from, to }) => {
    // Positions count from the frame's corner: a layer changing frames takes the
    // difference, so it stays where it is on the canvas.
  },
});
```

`onDrop` s'exécute avant que l'arbre ne soit écrit : l'éditeur sait donc encore de quelle frame
vient chaque calque, et sauvegarde le design pour l'annulation. Un calque déplacé dans une frame
qui ne le recouvre pas serait rogné hors de vue : il va plutôt au milieu de la frame. Avec
`animate`, les lignes glissent aussi pour les changements faits sur le canevas et par
l'annulation. Une ligne est typée (`type: 'row'`) : le canevas et les frames, qui acceptent des
calques et des outils, la refusent donc.

## Clavier

Allez sur un calque avec Tab (il est sélectionné), puis <kbd value="Enter">



</kbd>

 le saisit, les flèches
le déplacent de 10 pixels (<kbd value="Shift">



</kbd>

 : 40), et <kbd value="Enter">



</kbd>

 le dépose dans la
frame en dessous. Sans glissement, les flèches décalent la sélection d'un pixel. Un outil se
saisit de la même façon, et ses flèches sautent entre le canevas et les frames
(`keyboard: 'droppables'`). Les autres raccourcis sont listés dans le panneau Design quand rien
n'est sélectionné.

En savoir plus : [Glisser-déposer](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped) ·
[Votre propre modificateur](https://zizigy.github.io/docs/guides/constraints#your-own-modifier) ·
[Des règles pour une partie de la page](https://zizigy.github.io/docs/guides/constraints#rules-for-a-part-of-the-page) ·
[Rectangle de sélection](https://zizigy.github.io/docs/guides/multi-drag#rubber-band-selection) ·
[Arbres](https://zizigy.github.io/docs/guides/trees)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
