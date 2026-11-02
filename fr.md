---
title: "Vue DnD Kit — drag and drop for Vue"
description: "Listes triables, tableaux kanban, arbres et multi-drag pour Vue 3 — animés, utilisables au clavier et accessibles d'emblée."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr"
meta:
  "og:description": "Listes triables, tableaux kanban, arbres et multi-drag pour Vue 3 — animés, utilisables au clavier et accessibles d'emblée."
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — Le glisser-déposer pour Vue 3Vue 3 · TypeScript · SSR

01Kanban

**Des tableaux qui s'échangent des cartes**

02Arbres

**Imbriquer d'un léger décalage**

03Multi-drag

**Plusieurs items, un seul geste**

04Tri

**Des listes qui se trient toutes seules**

05Animé

**Le mouvement par défaut**

06A11y

space←↑↓→

**Le clavier, citoyen de première classe**

07Virtuel

**Dix mille lignes**

Faites glisser les cartes — ou atteignez-en une avec Tab et utilisez les flèches

# Le glisser-déposer,<br>pensé pour Vue.

Listes triables, tableaux kanban, arbres et multi-drag pour Vue 3 — animés, utilisables au clavier et accessibles d'emblée.

npm i @vue-dnd-kit/core

[Commencer](https://zizigy.github.io/vue-dnd-kit/fr/docs/getting-started/introduction)

Libre et open source. Sous licence MIT.

00Comment ça marche

## Des composables,<br>pas des composants.

Votre balisage, vos styles. Passez une ref de template à un composable, et l'élément glisse, se trie et se dépose — l'animation, le clavier et le lecteur d'écran étant pris en charge pour vous.

- 01 `**makeSortableList**`Listes, grilles et colonnes de kanban qui se réordonnent pendant le glissement — et s'échangent des items au sein d'un groupe.
- 02 `**makeSortableTree**`Des données imbriquées, rendues à plat : la profondeur par un léger décalage de côté, des dépôts dans les dossiers, la virtualisation.
- 03 `**makeDraggable · makeDroppable**`Tout le reste : tableaux, canevas, envois de fichiers — vos propres règles pour décider de ce qui va où.

01Glisser-déposer

## Glisser-déposer

Un élément déplaçable, une cible de dépôt et une règle pour décider de ce qui va où. Les cibles s'illuminent quand elles acceptent le glissement et refusent ce qu'elles n'acceptent pas ; ce que fait un dépôt, c'est vous qui le décidez.

[Documentation](https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/drag-and-drop)

Live Rangez les fichiers dans les dossiers X ---- · Y ----

Chargement de la démo…

02Tri

## Listes et grilles

Rendez un brouillon de votre tableau, et il se réordonne en direct pendant le glissement. Au dépôt, le nouvel ordre est écrit dans votre ref. Vertical, horizontal ou en grille de n'importe quelle taille.

[Documentation](https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/sortable-lists)

Live Réorganisez les applications ou placez-en une dans le dock X ---- · Y ----

Chargement de la démo…

03Kanban

## Tableaux kanban

Les listes d'un même groupe s'échangent des items. Copiez depuis une palette, accueillez des éléments déplaçables simples, ou échangez au lieu de décaler — la liste qui reçoit fait de la place pendant le survol.

[Documentation](https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/shared-lists)

Live Déplacez les cartes d'une colonne à l'autre X ---- · Y ----

Chargement de la démo…

04Arbres

## Arbres

Rendus à plat avec des profondeurs, ils se virtualisent. Faites glisser de côté pour changer de niveau, ou survolez un dossier pour déposer à l'intérieur ; limitez la profondeur et décidez de ce qui s'imbrique où.

[Documentation](https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/trees)

Live Faites glisser de côté pour changer la profondeur X ---- · Y ----

Chargement de la démo…

05Multi-drag

## Multi-drag

Sélectionnez par Ctrl/Cmd-clic ou tracez un rectangle, puis faites glisser un élément : toute la sélection se déplace ensemble et atterrit dans l'ordre, même d'une liste à l'autre.

[Documentation](https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/multi-drag)

Live Ctrl/Cmd-clic ou tracez un rectangle, puis faites glisser X ---- · Y ----

06Contraintes

## Axes, limites et grilles

Une zone de glissement fixe les règles de tout ce qui y est glissé : verrouillez un axe, gardez les glissements dans ses bords, alignez sur une grille — et changez ces règles pendant que l'application tourne.

[Documentation](https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/constraints)

Live Changez les règles, puis faites glisser une forme X ---- · Y ----

Chargement de la démo…

07Et plus encore

## Prêt pour de vraies applications.

01

### Animé

Du FLIP pendant le tri, un dépôt qui atterrit sur son emplacement, des changements de données animés. Utilisez GSAP ou motion si vous le souhaitez.

02

### Accessible

Glissement au clavier par emplacements, annonces en direct et attributs ARIA qui n'écrasent jamais les vôtres.

03

### Listes virtuelles

TanStack Virtual et VueUse : des milliers de lignes, toujours triables, toujours animées.

04

### Contrôlé

Pinia, un serveur ou des données immuables : sautez l'écriture par défaut et appliquez le résultat vous-même.

08Écosystème

## Un cœur léger, quelques outils affûtés.

Tout glisse avec le cœur. Ajoutez le reste quand vous en avez besoin.

01

@vue-dnd-kit/devtools

### DevTools

Un onglet dans Vue DevTools et Nuxt DevTools : une mini-carte en direct, un joystick qui fait glisser n'importe quoi, des options modifiables pendant que l'application tourne.

02

@vue-dnd-kit/actions

### Glissements programmatiques

« Monter », « déplacer vers Done », visites guidées et tests — de vrais glissements, annoncés et animés, depuis le code.

03

@vue-dnd-kit/nuxt

### Module Nuxt

Composables importés automatiquement, composants globaux et valeurs par défaut compatibles SSR.

04

npx skills add

### Pour les agents IA

Un skill pour agents qui apprend à Claude Code et à d'autres assistants comment fonctionne la bibliothèque.

npx skills add ZiZIGY/vue-dnd-kit

**01**

1 243

Tests de bout en bout dans trois navigateurs

**02**

469

Tests unitaires

**03**

21KB

Éléments déplaçables et zones de dépôt, gzippés

**04**

9

Langues de cette documentation

## Choisissez par où commencer.

[**01**<h3>**Lire le guide**</h3>De l'installation à votre première liste triable en cinq minutes.](https://zizigy.github.io/vue-dnd-kit/fr/docs/getting-started/introduction) [**02**<h3>**Parcourir les exemples**</h3>Des démos en direct avec leur code, prêtes à copier ou à ouvrir dans StackBlitz.](https://zizigy.github.io/vue-dnd-kit/fr/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/fr#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"fr-FR","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/fr","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/fr#webpage","@type":"WebPage","description":"Listes triables, tableaux kanban, arbres et multi-drag pour Vue 3 — animés, utilisables au clavier et accessibles d'emblée.","url":"https://zizigy.github.io/vue-dnd-kit/fr","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/fr#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/fr"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
