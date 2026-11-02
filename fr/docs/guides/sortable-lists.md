---
title: "Listes triables"
description: "Des listes, des barres d'onglets et des grilles qui se réordonnent pendant le glissement — makeSortableList rend un brouillon, makeSortableItem crée les lignes, et le dépôt écrit le nouvel ordre dans votre ref. Poignées, ligne d'insertion, échanges."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/sortable-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="25rem" hint="Faites glisser un calque par sa poignée : le panneau bouge tout de suite, le plan de travail au dépôt" name="layers-panel">



</example>

## Une liste et ses lignes

Une liste triable demande deux composants : la liste, et sa ligne.

```vue [LayersPanel.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

const layers = defineModel<Layer[]>({ required: true });
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: layers });
</script>

<template>
  <ul ref="list">
    <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
  </ul>
</template>
```

```vue [LayerRow.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ layer: Layer }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.layer });
</script>

<template>
  <li ref="el">{{ layer.name }}</li>
</template>
```

La ligne s'enregistre auprès de la liste dans laquelle elle est rendue. Un composant peut créer
plusieurs listes (deux colonnes, une liste dans une liste) : chaque ligne rejoint celle dont
l'élément la contient, la plus intérieure pour des listes imbriquées.

## Le brouillon

`makeSortableList` renvoie `items`, un **brouillon** de votre tableau. Pendant le glissement, le
brouillon se réordonne en direct : la ligne glissée prend son nouvel emplacement, et les autres
s'écartent. Votre tableau ne change pas avant le dépôt. La bibliothèque y écrit alors le nouvel
ordre.

Le panneau des calques ci-dessus montre les deux : le panneau rend `items` et bouge pendant le
glissement ; le plan de travail lit `layers`, le tableau lui-même, et ne réempile qu'au moment où
vous relâchez.

- Rendez `items`, pas votre tableau. Si vous rendez votre tableau, rien ne bouge avant le dépôt.
- L'écriture a lieu après l'`onDrop` de la liste. Dans `onDrop`, votre tableau contient encore
l'ancien ordre et `e.result` le nouveau.
- `layers` est une ref ordinaire (ici un `defineModel`, et l'écriture émet
`update:modelValue`) : le reste de votre application voit donc le changement comme n'importe
quel autre.

```ts
makeSortableList(list, {
  items: layers,
  onDrop: (e) => {
    console.log(e.from.index, '→', e.to.index, e.result.get(e.to.list));
  },
});
```

<tip>

Un store, un état serveur ou des données immuables ? Passez un getter ou un `computed` au lieu
d'une ref. La bibliothèque n'écrit pas dans une source en lecture seule : appelez
`e.preventDefault()` et appliquez `e.result` vous-même. Voir les
[listes contrôlées](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

</tip>

## Clés

Les lignes sont identifiées par leurs données, jamais par l'index ni par un id automatique. Par
défaut, la clé est `item.id`, ou l'item lui-même pour les chaînes et les nombres.

```ts
// LayersPanel.vue: your items have another key
makeSortableList(list, { items: layers, getKey: (layer) => layer.uuid });

// LayerRow.vue: `item` is keyed with the list's getKey…
makeSortableItem(el, { item: () => props.layer });
// …or pass the key yourself
makeSortableItem(el, { id: () => props.layer.uuid });
```

- Utilisez la même clé dans `v-for` : `:key="layer.uuid"`. Avec `:key="index"`, ce ne sont pas
les bonnes lignes qui s'animent, et leur état saute d'une ligne à l'autre.
- Les clés doivent être uniques parmi toutes les listes qui s'échangent des items.
- Passez `item` et `id` sous forme de getters, pour qu'une ligne reste synchronisée quand ses
props changent.

## Poignées

Par défaut, toute la ligne démarre un glissement, sauf les boutons, les champs et les autres
contrôles qu'elle contient : l'œil et le cadenas d'un calque restent de simples boutons. Passez
`handle` pour ne faire glisser que par une partie :

```vue [LayerRow.vue]
<script setup lang="ts">
makeSortableItem(el, { item: () => props.layer, handle: '.grip' });
</script>

<template>
  <li ref="el">
    <button type="button" class="grip" :aria-label="`Move ${layer.name}`">⠿</button>
    {{ layer.name }}
  </li>
</template>
```

- `handle` est un sélecteur à l'intérieur de l'item, ou une ref d'élément.
- Un glissement à la souris démarre tout de suite depuis la poignée, sans les 4 px habituels. Un
appui qui ne bouge pas reste un clic : la poignée peut ouvrir un menu sur `click`.
- La poignée reçoit les attributs du glissement (`role`, `tabindex`, `aria-*`), et les
glissements au clavier démarrent depuis elle.

Faites de la poignée un `<button type="button">` avec un `aria-label` : il peut recevoir le focus
tel quel, et les lecteurs d'écran annoncent son libellé. Un simple `<span>` avec une icône
fonctionne aussi (la bibliothèque lui donne `tabindex="0"` et `role="button"`), mais il n'a pas
de nom explicite.

<note>

Les glissements tactiles démarrent après un appui long de 200 ms, pour que la page puisse encore
défiler. Pour glisser tout de suite depuis une poignée, donnez `touch-action: none` à la poignée
et `activation: { touch: { distance: 4 } }` à l'item.

</note>

## Stratégies

`strategy` indique comment la liste est disposée, pour que les lignes fassent de la place
correctement :

<table>
<thead>
  <tr>
    <th>
      <code>
        strategy
      </code>
    </th>
    
    <th>
      Pour
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'vertical'
      </code>
      
       (par défaut)
    </td>
    
    <td>
      Une colonne de lignes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'horizontal'
      </code>
    </td>
    
    <td>
      Une seule rangée : onglets, chips, frise chronologique.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'grid'
      </code>
    </td>
    
    <td>
      Les grilles CSS et les rangées flex qui passent à la ligne, y compris avec des items de tailles différentes.
    </td>
  </tr>
</tbody>
</table>

Une rangée d'onglets est une liste horizontale :

<example height="23rem" hint="Faites glisser les onglets ; fermez-en un, ou ouvrez-en un nouveau" name="browser-tabs">



</example>

```ts [Browser.vue]
const { items } = makeSortableList(strip, {
  items: tabs,
  strategy: 'horizontal',
  axis: 'x',        // the tabs stay on their row
  animate: true,    // the buttons open and close tabs: slide the others then too
});
```

Le bouton de fermeture de l'onglet continue de fonctionner à l'intérieur de l'onglet déplaçable,
et un clic qui termine un glissement ne sélectionne pas d'onglet. Les lignes glissent d'elles-mêmes
pendant le glissement ; `animate` ajoute la même chose pour les changements qui ne viennent pas
d'un glissement, ici les boutons (voir les [animations](https://zizigy.github.io/docs/guides/animations)).

Une grille se trie en deux dimensions, avec des tuiles de toutes tailles :

<example height="31rem" hint="Faites glisser une photo, la grande aussi" name="photo-grid">



</example>

```ts [PhotoGrid.vue]
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });
```

```css
.grid { display: grid; grid-template-columns: repeat(4, 76px); grid-auto-rows: 76px; grid-auto-flow: dense; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
```

`grid-auto-flow: dense` garde la grille compacte quand une grande tuile se déplace. Sans cela, la
grille laisse des trous là où une tuile ne tient plus, et s'agrandit d'une rangée.

## Verrouiller l'axe

```ts
makeSortableList(list, { items: layers, axis: 'y' });
```

`axis: 'y'` garde le glissement sur l'axe vertical, `'x'` sur l'axe horizontal : les calques et
les onglets ci-dessus l'utilisent. L'`axis` propre à un item l'emporte sur celui de sa liste.
Pour garder aussi le glissement à l'intérieur de la liste, ajoutez le modificateur
`restrictToParent`. Plus de détails dans les [contraintes](https://zizigy.github.io/docs/guides/constraints).

## Styliser l'emplacement

La ligne glissée reste dans la liste comme l'emplacement où elle va atterrir, et reçoit
`data-dnd-placeholder`. Le style par défaut l'estompe à 40 %, avec une spécificité nulle : la
moindre de vos règles l'emporte donc :

```css [LayerRow.vue]
.layer[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.layer[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}
```

`makeSortableItem` renvoie le même état sous forme de refs, et quelques autres :

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
        isPlaceholder
      </code>
    </td>
    
    <td>
      Cette ligne est l'emplacement où un item glissé va atterrir.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      Cette ligne est en cours de glissement (chaque ligne glissée, en multi-drag).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      Son index dans le brouillon : il change pendant le glissement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Modifiable, lié à la sélection du provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        indicator
      </code>
    </td>
    
    <td>
      En <a href="#an-insertion-line">
        mode indicateur
      </a>
      
      , l'endroit où va la ligne.
    </td>
  </tr>
</tbody>
</table>

La liste renvoie `isOver` et `isAccepting` pour sa propre mise en valeur, ainsi que `activeKey`
et `activeIndex`, l'item glissé et sa place dans le brouillon de cette liste. Tous les états,
avec des démos en direct, se trouvent dans le [style](https://zizigy.github.io/docs/guides/styling).

## Désactiver

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Ce qu'elle empêche
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       sur un item
    </td>
    
    <td>
      Cet item ne peut pas être glissé. Les autres passent toujours devant lui : verrouillez un calque ci-dessus, puis faites-en glisser un autre par-dessus.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       sur la liste
    </td>
    
    <td>
      Aucun glissement n'en sort, aucun dépôt n'y entre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sort: false
      </code>
      
       sur la liste
    </td>
    
    <td>
      Ses items ne peuvent pas être réordonnés à l'intérieur, mais peuvent toujours en sortir : une palette, voir les <a href="/docs/guides/shared-lists#what-goes-in-and-out-pull-and-put">
        listes qui partagent des items
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Toutes acceptent un getter ou une ref, et s'appliquent au glissement suivant :

```ts [LayerRow.vue]
makeSortableItem(el, { item: () => props.layer, handle: '.grip', disabled: () => props.layer.locked });
```

Une ligne qui doit rester en premier ou en dernier, quoi que fassent les autres, n'est pas du
tout un item : rendez-la en dehors de la liste. Le calque Background du panneau se trouve sous le
`<ul>`.

## N'afficher qu'une partie des items

Un champ de recherche, une étiquette : `filter` affiche les items pour lesquels il renvoie `true`,
et un glissement trie parmi ceux-là. Les autres restent dans votre tableau, à leur place :

<example height="27rem" hint="Choisissez une étiquette ou cherchez, puis faites glisser une tâche : le tableau garde les tâches masquées à leur place" name="filtered-list">



</example>

```ts [Backlog.vue]
const query = ref('');
const tag = ref<Tag | null>(null);

const { items } = makeSortableList(list, {
  items: tasks,
  filter: (task) => (!tag.value || task.tag === tag.value) && task.title.includes(query.value),
});
```

- `items` contient les items qui correspondent : rendez-le comme d'habitude. Le filtre est
réactif : taper dans le champ de recherche met la liste à jour aussitôt.
- Le dépôt écrit le tableau entier. Chaque item masqué reste juste après l'item affiché qu'il
suivait ; quand c'est celui-là qui a bougé, il reste après le plus proche avant lui qui n'a pas
bougé.
- `e.to.index` et l'`activeIndex` de la liste comptent les items affichés. `e.result` contient le
tableau entier, items masqués compris.

<note>

Un `computed` qui filtre votre tableau et qui est passé en `items` fonctionne aussi, mais il est
en lecture seule : il vous faudrait appliquer `e.result` vous-même et calculer où vont les items
masqués. `filter` fait les deux.

</note>

## Une ligne d'insertion

Avec `placeholder: 'indicator'`, la liste reste immobile pendant le glissement, et une ligne
montre où va le dépôt. C'est vous qui dessinez la ligne :

<example height="27rem" hint="Faites glisser un ticket : une ligne montre où il va" name="issue-table">



</example>

```ts [IssueTable.vue]
const { items, indicator } = makeSortableList(body, { items: issues, placeholder: 'indicator' });
```

```vue [IssueRow.vue]
<script setup lang="ts">
const { indicator } = makeSortableItem(el, { item: () => props.issue });
</script>

<template>
  <div ref="el" class="row" :class="indicator && `drop-${indicator.side}`">…</div>
</template>

<style scoped>
.row.drop-before::before { content: ''; position: absolute; top: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
.row.drop-after::before { content: ''; position: absolute; bottom: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Champ d'<code>
        indicator
      </code>
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
        list
      </code>
    </td>
    
    <td>
      La liste dans laquelle va le dépôt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      L'index d'insertion dans la liste telle qu'elle est rendue.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        key
      </code>
    </td>
    
    <td>
      L'item auquel la ligne est rattachée ; <code>
        null
      </code>
      
       dans une liste vide (dessinez-la alors dans la liste).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        side
      </code>
    </td>
    
    <td>
      <code>
        'before'
      </code>
      
       ou <code>
        'after'
      </code>
      
       cet item ; <code>
        'swap'
      </code>
      
       dans une liste qui <a href="#swap-instead-of-shift">
        échange
      </a>
      
      . Les arbres ajoutent <code>
        'inside'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
      
      , <code>
        parentKey
      </code>
    </td>
    
    <td>
      Arbres uniquement : là où atterrit le dépôt. Voir les <a href="/docs/guides/trees#an-insertion-line">
        arbres
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

- L'`indicator` de la liste est renseigné tant que la ligne est dans cette liste (le tableau
l'affiche), et celui d'un item tant que la ligne est rattachée à cet item.
- La ligne glissée reste là où elle était, marquée comme placeholder : estompez-la.
- Le clavier déplace aussi la ligne.
- Un dépôt en dehors de toute cible annule dans ce mode (`dropOutside: 'cancel'`), puisque la
liste n'a jamais montré d'autre ordre.
- L'overlay couvre une partie de la ligne en dessous. Rendez-le un peu transparent, et la ligne
apparaît à travers : `[data-dnd-overlay] .row { opacity: 0.85 }`.

## Échanger au lieu de décaler

Avec `behavior: 'swap'`, l'item glissé échange sa place avec celui qui est en dessous, et les
autres ne bougent pas :

<example height="29rem" hint="Échangez deux personnes, d'une colonne à l'autre aussi ; essayez On drop" name="on-call">



</example>

```ts [Rotation.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'rotation',
  behavior: 'swap',
  placeholder: () => props.placeholder,   // 'item' (live) or 'indicator' (on drop)
  onDrop: (e) => {
    if (e.partner) emit('swap', `${e.items[0]?.name} ⇄ ${e.partner.item.name}`);
  },
});
```

- **En direct** (`placeholder: 'item'`, par défaut) : l'échange s'affiche pendant le glissement.
Revenir en arrière, ou sortir de la liste, l'annule.
- **Au dépôt** (`placeholder: 'indicator'`) : rien ne bouge avant le dépôt. L'indicateur marque
l'item avec lequel le dépôt fait l'échange, `side: 'swap'` : entourez cet item au lieu de
dessiner une ligne. Les flèches déplacent la marque d'item en item ; de retour sur l'item
glissé, il n'y en a aucune.

```vue [PersonCell.vue]
<li ref="el" :class="{ target: indicator?.side === 'swap' }">…</li>
```

L'événement de dépôt a `mode: 'swap'` et `partner`, l'item avec lequel il a échangé : sa `key`,
son `item`, et ses propres `from` et `to`. Deux listes d'un même groupe font des échanges entre
elles quand elles ont toutes deux `behavior: 'swap'`, comme les deux colonnes. L'item survolé
passe alors dans l'autre liste : il doit donc avoir le droit de sortir (`group.pull`) et d'entrer
(`group.put`) ; voir les [listes qui partagent des items](https://zizigy.github.io/docs/guides/shared-lists). Un
multi-drag trie au lieu d'échanger.

## Clavier

Donnez le focus à une ligne, ou à sa poignée, et appuyez sur <kbd value="Space">



</kbd>

 ou
<kbd value="Enter">



</kbd>

 pour la saisir. Les flèches le long de la liste la déplacent d'un
emplacement, dans les grilles haut et bas passent à la rangée suivante, et les flèches en travers
de la liste la déplacent vers la liste suivante de son groupe. Au-delà de la fin d'une liste, la
flèche continue dans la liste suivante dans cette direction (des listes empilées les unes au-dessus
des autres), sinon sur une cible de dépôt à cet endroit, une corbeille. Appuyez de nouveau sur
<kbd value="Space">



</kbd>

 ou <kbd value="Enter">



</kbd>

 pour la déposer, sur <kbd value="Escape">



</kbd>

 pour la
remettre en place. Chaque démo de cette page fonctionne ainsi. Les textes pour les lecteurs
d'écran se trouvent dans l'[accessibilité](https://zizigy.github.io/docs/guides/accessibility).

## Animations

Les lignes glissent vers leurs nouvelles places pendant le glissement, et la ligne déposée
atterrit sur son emplacement. La liste elle-même grandit ou rétrécit jusqu'à sa nouvelle taille
quand des lignes arrivent et partent (`animateSize`). C'est activé par défaut et ne demande
aucun code. N'enveloppez pas
les lignes dans un `<TransitionGroup>` : les déplacements s'animeraient deux fois. Ne mettez pas
non plus de `transition` CSS sur le `transform` des lignes. Pour les changements qui ne viennent
pas d'un glissement (ajout, suppression, mélange), activez l'option `animate` de la liste, comme
le font les onglets. Voir les [animations](https://zizigy.github.io/docs/guides/animations).

La liste complète des options se trouve dans l'API de [makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list)
et de [makeSortableItem](https://zizigy.github.io/docs/api/make-sortable-item).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
