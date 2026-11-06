---
title: "Tableau de bord"
description: "Des widgets sur une grille — déplacés par leur en-tête, redimensionnés par leur coin une cellule à la fois, dans des lignes aussi hautes que leur contenu, avec moins de colonnes sur les écrans étroits."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/examples/dashboard"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="38rem" hint="Faites glisser un widget par son en-tête, redimensionnez-le par son coin, écrivez dans les notes" name="dashboard" title="Tableau de bord">



</example>

## Ce qu'il faut regarder

- **Dashboard.vue** : la grille est une seule liste triable avec `strategy: 'grid'`, qui trie des
widgets de tailles différentes. Elle compte ses colonnes d'après sa propre largeur
(`useElementSize`) : quatre, trois ou deux. Ses lignes font au moins 92 px de haut et grandissent
avec leur contenu, et `grid-auto-flow: dense` comble les trous qu'un redimensionnement laisse.
- **Widget.vue** : un widget se déplace par son en-tête (`handle`), si bien que son contenu reste
libre : les tâches se cochent, les notes prennent du texte. Son coin est un élément déplaçable à
part entière, et le redimensionne.
- **WidgetBody.vue** : ce qu'affichent les widgets. Écrivez dans les notes : la ligne grandit avec
le texte, et les widgets à côté avec la ligne. Rien ne les mesure : c'est la mise en page propre à
la grille, et la bibliothèque lit les tailles telles qu'elles sont quand un glissement commence.
- **widgets.ts** : les widgets, leurs tailles en cellules et les nombres de la grille.

Agrandissez la démo : la grille passe à quatre colonnes, et un widget rétréci sur un petit écran
retrouve la largeur qu'il avait.

## Redimensionner : le coin est un élément déplaçable

Le coin se trouve à l'intérieur du widget, et un appui fait glisser l'élément déplaçable le plus
proche : le coin, pas le widget. Il n'a pas d'overlay et ne bouge jamais. C'est le widget qui grandit.

```ts [Widget.vue]
makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  activation: { touch: { distance: 4 } }, // a finger resizes at once, not after a long press
  attributes: false,                       // no tab stop: Shift + arrows on the header resize
});
```

La taille suit le pointeur : la distance qu'il a parcourue depuis l'appui, en cellules entières. La
grille affiche cette taille tant que le coin est tenu, et ses autres widgets font de la place.

```ts [Widget.vue]
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});
```

Le dépôt la conserve : un moniteur entend l'`onDragEnd` du coin. <kbd value="Escape">



</kbd>

 annule le
glissement à la place, et le widget reprend sa propre taille.

```ts [Widget.vue]
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});
```

## La grille reste en dehors du redimensionnement

Un coin n'est pas un widget, et la grille le refuserait : un dépôt sur une cible qui refuse un
glissement est une annulation. Donc, pendant qu'on fait glisser un coin, la grille est `disabled`,
et le dépôt du coin ne tombe sur aucune cible.

```ts [Dashboard.vue]
const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  strategy: 'grid',
  label: 'Dashboard',
  disabled: () => !!active.value?.type.includes('resize'),
});
```

## Des tailles qui s'adaptent

Un widget garde la taille qu'on lui a donnée. Avec moins de colonnes, il n'est jamais plus large que
la grille (`Math.min(w, columns)`), et il retrouve sa largeur quand la grille a de nouveau de la
place. Les lignes ont une hauteur minimale, pas une hauteur : le contenu décide, et les widgets
d'une ligne s'étirent tous jusqu'au plus haut.

## Le clavier

Atteignez l'en-tête d'un widget avec Tab et appuyez sur <kbd value="Space">



</kbd>

 pour saisir le widget.
Les flèches le déplacent parmi les autres, <kbd value="Space">



</kbd>

 le dépose, <kbd value="Escape">



</kbd>

 le
remet à sa place. L'en-tête ayant le focus, <kbd value="Shift">



</kbd>

 et les flèches redimensionnent le
widget une cellule à la fois, et les lecteurs d'écran entendent sa nouvelle taille.

En savoir plus : [Stratégies](https://zizigy.github.io/docs/guides/sortable-lists#strategies) ·
[Poignées](https://zizigy.github.io/docs/guides/sortable-lists#handles) ·
[Sans overlay](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[useDnDMonitor()](https://zizigy.github.io/docs/guides/provider#listen-to-every-drag-usedndmonitor) ·
[Calendrier de la semaine](https://zizigy.github.io/docs/examples/calendar)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
