---
title: "Démarrage rapide"
description: "Une liste triable en trois fichiers — un provider, une liste et ses lignes."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/getting-started/quick-start"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Voici le tout, en fonctionnement. Faites glisser une ligne, ou atteignez-en une avec Tab,
appuyez sur <kbd value="Space">



</kbd>

, déplacez-la avec les flèches et appuyez de nouveau sur
<kbd value="Space">



</kbd>

.

<example name="quick-start" title="Démarrage rapide">



</example>

## Pas à pas

<steps level="3">

### Enveloppez l'application dans un provider

`DnDProvider` gère le glissement. Chaque composable doit s'exécuter dans un composant **rendu à
l'intérieur** de celui-ci — et non dans le composant dont le template le contient.

### Créez une liste

`makeSortableList` prend l'élément de la liste et votre tableau. Il renvoie `items` : un
brouillon qui se réordonne en direct pendant le glissement. Rendez le brouillon, pas votre
tableau, et utilisez l'id des lignes comme clé.

### Créez les lignes

Chaque ligne appelle `makeSortableItem` avec son élément et l'item qu'elle rend. Sa clé vient
de `item.id`.

</steps>

Au dépôt, `tasks` reçoit le nouvel ordre — c'est une `ref` ordinaire, le reste de votre
application voit donc le changement comme n'importe quel autre.

<tip>

Vous utilisez Pinia, un serveur ou des données immuables ? Passez un getter au lieu d'une ref,
puis appelez `e.preventDefault()` dans `onDrop` et appliquez `e.result` vous-même.

</tip>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
