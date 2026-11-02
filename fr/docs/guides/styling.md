---
title: "Style"
description: "Chaque état d'un glissement, stylisé — des attributs data pour le CSS simple, des refs pour les classes, des cibles qui disent oui ou non, l'overlay et la page pendant le glissement, les styles par défaut, Tailwind et les kits d'UI."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/styling"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

La bibliothèque ne stylise presque rien. Chaque état d'un glissement vous parvient de deux
façons : sous forme d'attribut `data-dnd-*`, pour le CSS simple, et sous forme de ref renvoyée
par le composable, pour les classes et le balisage conditionnel. Utilisez celle qui convient à
votre stack, ou les deux.

## Les attributs data

Les lignes ci-dessous n'ont aucune classe d'état : chaque aspect vient d'un attribut. Le panneau
liste les attributs de la page à mesure qu'ils apparaissent et disparaissent. Sélectionnez deux
lignes avec <kbd value="Ctrl">



</kbd>

 ou <kbd value="Meta">



</kbd>

 et faites-les glisser : les autres d'un
multi-drag apparaissent aussi.

<example height="25rem" hint="Faites glisser une ligne, puis Ctrl/⌘-cliquez-en deux et faites-les glisser" name="dnd-attributes">



</example>

<table>
<thead>
  <tr>
    <th>
      Attribut
    </th>
    
    <th>
      Sur
    </th>
    
    <th>
      Quand
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        data-dnd-placeholder
      </code>
    </td>
    
    <td>
      un item triable
    </td>
    
    <td>
      C'est l'emplacement où un item glissé va atterrir. <code>
        "into"
      </code>
      
       pendant que le glissement est au-dessus d'une <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        cible de dépôt dans un item
      </a>
      
       : le dépôt va là, et l'emplacement ne fait que garder sa place.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging
      </code>
    </td>
    
    <td>
      un item triable
    </td>
    
    <td>
      Il est glissé mais reste en place : les autres items d'un multi-drag en mode <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging="pointer"
      </code>
      
       ou <code>
        "keyboard"
      </code>
    </td>
    
    <td>
      <code>
        <html>
      </code>
    </td>
    
    <td>
      Pendant tout le glissement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay="dragging"
      </code>
      
       ou <code>
        "dropping"
      </code>
    </td>
    
    <td>
      la boîte de l'overlay
    </td>
    
    <td>
      Toujours. <code>
        dropping
      </code>
      
       pendant qu'elle atterrit, et pendant qu'un <code>
        onBeforeDrop
      </code>
      
       asynchrone attend.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay-content
      </code>
    </td>
    
    <td>
      le contenu de l'overlay
    </td>
    
    <td>
      Toujours : l'élément qui remplit la boîte et contient ce qu'elle montre. C'est à vous de l'animer ; il reçoit l'<code>
        overlayClass
      </code>
      
       du provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-leaving
      </code>
    </td>
    
    <td>
      une copie laissée par <code>
        animateChanges
      </code>
    </td>
    
    <td>
      Pendant qu'un item parti disparaît en fondu.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-no-clone
      </code>
    </td>
    
    <td>
      <strong>
        posé par vous
      </strong>
    </td>
    
    <td>
      Exclut l'élément de la copie de l'overlay : une infobulle, un menu, un badge.
    </td>
  </tr>
</tbody>
</table>

```css [TaskRow.vue]
/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
}

/* The copy in the overlay, while it travels. */
[data-dnd-overlay='dragging'] .row {
  box-shadow: 0 0 0 1.5px #42b883, 0 14px 24px -10px rgb(0 0 0 / 0.55);
}
```

```vue [TaskRow.vue]
<li ref="el" class="row" :aria-selected="selected">
  <span class="title">{{ task.title }}</span>
  <button type="button" data-dnd-no-clone @click.stop="task.done = !task.done">✓</button>
</li>
```

- La copie d'une ligne dans l'overlay garde ses classes et ses attributs, y compris l'attribut de
scope de Vue : `[data-dnd-overlay] .row` fonctionne donc dans le propre `<style scoped>` de la
ligne. La copie n'a pas de marques `data-dnd-*` à elle : une copie de l'emplacement n'est pas un
emplacement.
- La sélection n'a pas d'attribut. Reportez la ref `selected` dans un attribut (`aria-selected`
ci-dessus), ou utilisez une classe.
- Les éléments déplaçables simples et les cibles de dépôt (`makeDraggable`, `makeDroppable`) ne
reçoivent pas d'attributs d'état `data-dnd-*` : stylisez-les avec leurs refs.

## Les refs renvoyées

Les mêmes états sous forme de refs, plus ceux des listes et des cibles. Chaque ligne et chaque
liste ci-dessous affiche les refs qui sont vraies à cet instant, et ses classes en découlent.
L'Icebox refuse les tâches urgentes : faites-en glisser une au-dessus.

<example height="24rem" hint="Faites glisser une tâche vers l'autre liste ; Ctrl/⌘-clic en sélectionne plusieurs" name="dnd-refs">



</example>

```vue [RefRow.vue]
<script setup lang="ts">
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }">…</li>
</template>

<style scoped>
.row.selected { box-shadow: 0 0 0 1.5px #3b82f6; }
.row.placeholder { opacity: 1; box-shadow: inset 0 0 0 1.5px #42b883; }   /* beats the default 40% */
.row.placeholder .title { visibility: hidden; }
</style>
```

```vue [RefList.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(el, { items, group });
</script>

<template>
  <section :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">…</section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Composable
    </th>
    
    <th>
      État
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isPlaceholder
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        index
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        activeKey
      </code>
      
      , <code>
        activeIndex
      </code>
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
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        transform
      </code>
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
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        placement
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD()
      </code>
    </td>
    
    <td>
      <code>
        status
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        pointer
      </code>
      
      , <code>
        activation.progress
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
</tbody>
</table>

- `isPlaceholder` : cet élément est l'emplacement où un item glissé va atterrir. Dans un
multi-drag en mode `'group'`, les emplacements des items qui voyagent avec lui sont aussi des
placeholders.
- `isDragging` : l'item fait partie du glissement ; chaque item glissé dans un multi-drag.
- `isAccepting` : quelque chose est en cours de glissement, et cette cible l'accepte. Mettez en
valeur les endroits où un dépôt est possible.
- `isOver` : le glissement est au-dessus de cette cible, qu'elle l'accepte ou non.
`isOver && !isAccepting` est un refus : montrez-le.
- `indicator` : l'endroit où va la ligne de dépôt en
[mode indicateur](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line).
- `activation.progress` : de 0 à 1 pendant un appui long tactile ou un `delay`. Remplissez un
anneau avec.

## Cibles de dépôt : oui et non

Une cible a quatre aspects pendant un glissement : elle accepte le glissement, elle l'accepte et
le pointeur est dessus, elle le refuse, elle le refuse et le pointeur est dessus. Montrez les
quatre, et dites-le aussi sur l'item glissé.

<example height="23rem" hint="Faites glisser une couleur au-dessus des palettes : la bonne l'invite, les autres non" name="drop-highlights">



</example>

```ts [Palette.vue]
const { isOver, isAccepting } = makeDroppable(el, { accept: props.tone, onDrop });

const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
```

```css [Palette.vue]
.palette.accepting { border-style: dashed; border-color: #42b883; }          /* an invitation */
.palette.over { border-color: #42b883; background: color-mix(in srgb, #42b883 14%, Canvas); }
.palette.refusing { opacity: 0.45; }                                          /* out of the way */
.palette.refused { border-color: #f43f5e; animation: shake 0.3s; }            /* a drop here is cancelled */
```

La pastille glissée est le slot `#overlay` du provider. Il reçoit `over` et `accepted` :
`accepted` vaut `false` au-dessus d'une cible qui refuse le glissement.

```vue [index.vue]
<template #overlay="{ active, over, accepted }">
  <div
    class="lifted"
    :class="{ yes: over && accepted, no: over && !accepted }"
    :style="{ background: (active.data as { color: string }).color }"
  >
    <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
  </div>
</template>
```

En dehors de l'overlay, `useDnD().over.value?.accepted` dit la même chose. Plus de détails sur
les composants d'overlay dans [l'overlay](https://zizigy.github.io/docs/guides/overlay).

## L'overlay et la page

Deux attributs couvrent le reste d'un glissement : `data-dnd-overlay` sur la boîte de l'overlay,
et `data-dnd-dragging` sur `<html>`, `"pointer"` ou `"keyboard"`. La barre au-dessus des notes lit
le second, et indique quelles touches fonctionnent. Activez l'enregistrement lent : l'overlay
reste en `dropping` là où vous avez relâché, jusqu'à ce que `onBeforeDrop` se résolve, et le
montre.

<example height="27rem" hint="Faites glisser une note à la souris, puis au clavier ; activez l'enregistrement lent" name="overlay-theme">



</example>

```css [index.vue]
.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle { display: none; }

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard { display: inline; }
```

```css [StickyNote.vue]
[data-dnd-overlay='dragging'] .note {
  box-shadow: 0 0 0 2px #42b883, 0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save. */
[data-dnd-overlay='dropping'] .note { opacity: 0.85; }
[data-dnd-overlay='dropping'] .saving { display: flex; }
```

- `dropping` couvre l'atterrissage et l'attente d'un `onBeforeDrop` asynchrone. Pendant cette
attente, `<html>` est sorti du mode glissement : le curseur et la sélection de texte de la page
sont revenus, et une boîte de dialogue de confirmation fonctionne donc normalement.
- Stylisez ce qui est **à l'intérieur** de la boîte. La bibliothèque déplace la boîte elle-même
avec `transform` et la dimensionne avec `width` et `height`. Son élément de contenu,
`[data-dnd-overlay-content]`, la remplit et vous appartient : soulevez et inclinez-y l'overlay
entier (voir les [animations](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)).
- La racine de la copie a `transform: none` en ligne : faites-la tourner ou grandir avec `rotate`
et `scale`. Les transitions comme les keyframes s'y exécutent : voir les
[animations](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).
- La copie montre l'élément tel qu'il est et ne devine aucun fond. Une ligne que la liste peint
(un `<li>` dans un `<ul>` blanc, une ligne de tableau) en a besoin :
`[data-dnd-overlay] .row { background: Canvas; }`.
- La copie se trouve dans un `<div>` qui porte les propriétés personnalisées dont l'élément
héritait (couleurs du thème, `--tw-*`) : elles s'appliquent donc toujours dans l'overlay, et les
règles propres à la copie (`in-data-[dnd-overlay]:ring-2`) l'emportent toujours sur elles.
Sélectionnez la copie par sa classe, pas par sa profondeur dans la boîte.

## Styles par défaut

Le provider injecte quelques règles, une fois par document. Elles sont enveloppées dans
`:where()` : leur spécificité est donc nulle et la moindre de vos règles l'emporte :

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
:where(html[data-dnd-dragging]), :where(html[data-dnd-dragging] *) {
  user-select: none !important;
  overflow-anchor: none !important;
}
:where(html[data-dnd-dragging='pointer']), :where(html[data-dnd-dragging='pointer'] *) {
  cursor: var(--dnd-cursor, grabbing) !important;
  -webkit-touch-callout: none !important;
}
```

<table>
<thead>
  <tr>
    <th>
      Règle
    </th>
    
    <th>
      Pourquoi
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      L'emplacement à 40 %
    </td>
    
    <td>
      Pour qu'une liste ait l'air correcte sans aucun CSS. Chaque démo ci-dessus la remplace.
    </td>
  </tr>
  
  <tr>
    <td>
      Les items laissés en place à 40 %
    </td>
    
    <td>
      La même chose, pour un multi-drag en mode <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pas de <code>
        user-select
      </code>
    </td>
    
    <td>
      Un glissement ne sélectionne pas le texte qu'il survole.
    </td>
  </tr>
  
  <tr>
    <td>
      Pas d'<code>
        overflow-anchor
      </code>
    </td>
    
    <td>
      La page ne défile pas pour garder une ligne en mouvement visible.
    </td>
  </tr>
  
  <tr>
    <td>
      Le curseur du glissement
    </td>
    
    <td>
      Pendant un glissement au pointeur, partout. <code>
        grabbing
      </code>
      
      , sauf si l'élément saisi a un curseur à lui : le <code>
        ns-resize
      </code>
      
       d'une poignée de redimensionnement, un <code>
        move
      </code>
      
      , une image gardent le leur pendant tout le glissement (<code>
        grab
      </code>
      
      , <code>
        pointer
      </code>
      
       et consorts deviennent quand même <code>
        grabbing
      </code>
      
      ). <code>
        cursor: grab
      </code>
      
       sur les items déplaçables, c'est à vous de l'ajouter. Posez <code>
        --dnd-cursor
      </code>
      
       sur <code>
        <html>
      </code>
      
       pour un autre curseur par défaut.
    </td>
  </tr>
  
  <tr>
    <td>
      Pas de menu contextuel tactile
    </td>
    
    <td>
      iOS n'ouvre pas le menu des liens sous un appui long.
    </td>
  </tr>
</tbody>
</table>

`:default-styles="false"` sur le provider les omet. La bibliothèque marque toujours `<html>`, et
efface toujours la sélection quand un glissement commence et empêche d'en créer une nouvelle jusqu'à sa fin :
seul le CSS disparaît. Les règles sont injectées une fois, par le premier provider qui les
demande, et restent : désactivez-les sur chaque provider de la page.

```vue
<DnDProvider :default-styles="false">
```

## Tailwind CSS

Les attributs fonctionnent comme des variantes : `data-[…]` pour l'élément lui-même, une
variante arbitraire pour un ancêtre.

```vue [TaskRow.vue]
<li
  ref="el"
  class="rounded-lg bg-white shadow-sm
         data-[dnd-placeholder]:bg-transparent data-[dnd-placeholder]:opacity-100
         data-[dnd-placeholder]:outline-dashed
         [[data-dnd-overlay=dragging]_&]:shadow-xl"
  :class="{ 'ring-2 ring-emerald-500': selected }"
>
```

```vue [Hint.vue]
<p class="hidden [html[data-dnd-dragging=keyboard]_&]:block">Arrows move · Space drops</p>
```

<note>

Les styles de la bibliothèque (les opacités à 40 %) se trouvent dans une cascade layer à eux,
`vue-dnd-kit`, déclarée avant toutes les autres. Les utilitaires de Tailwind v4 et les kits d'UI
construits dessus vivent aussi dans des layers, qui viennent après : ils l'emportent donc sans
`!`. Le CSS hors layer l'emporte de toute façon.

</note>

Dans Tailwind v4, `in-data-[dnd-overlay=dragging]:shadow-xl` est une façon plus courte d'écrire
la variante d'ancêtre.

<warning>

Dans le CSS scoped de Vue, `:global()` prend tout le sélecteur : `:global(html[data-dnd-dragging]) .hint`
se compile en `html[data-dnd-dragging]` seul, et masque la page. Écrivez l'ancêtre sans lui,
`html[data-dnd-dragging] .hint` : Vue ne scope que la dernière partie.

</warning>

## Kits d'UI

- Les composables acceptent un composant aussi bien qu'un élément : `useTemplateRef` sur une
carte ou un élément de liste d'un kit fonctionne, et la bibliothèque lit son élément racine.
- Passez l'état aux props propres du kit quand il en a (`:active="selected"`,
`:color="isOver ? 'primary' : undefined"`), et le reste sous forme de classes.
- Les éléments de liste d'un kit n'ont souvent pas de fond à eux : c'est la liste qui le peint.
Leur copie dans l'overlay est alors transparente. Donnez-lui-en un :```css
[data-dnd-overlay] .v-list-item { background: rgb(var(--v-theme-surface)); }
```
- La copie laisse de côté les ondulations d'appui de Vuetify, Quasar, PrimeVue et Naive UI.
Marquez tout ce qui ne doit pas voyager, une infobulle ou un bouton de menu, avec
`data-dnd-no-clone`.

## À éviter

- Ne mettez pas de `transition` CSS sur le `transform` ou le `translate` des items triables : la
bibliothèque les anime elle-même, et annule ces transitions pendant qu'elle mesure.
- N'enveloppez pas les items triables dans un `<TransitionGroup>` : les déplacements
s'animeraient deux fois. Utilisez l'`animateChanges` de la liste.
- N'animez pas la `height`, la `margin` ou le `padding` des lignes d'une
[liste virtuelle](/docs/guides/virtual-lists).
- En revanche, arrêtez sous `prefers-reduced-motion: reduce` les transitions que vous ajoutez
autour des glissements. La bibliothèque arrête déjà les siennes.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
