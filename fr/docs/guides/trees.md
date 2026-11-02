---
title: "Arbres"
description: "Plans, menus, organigrammes et backlogs avec makeSortableTree — rendus à plat avec des profondeurs, imbriqués en glissant de côté ou en survolant une ligne, avec des règles, des nœuds repliés, une ligne d'insertion et des listes dans le même groupe."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/trees"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Un arbre est une liste triable dont les lignes ont des profondeurs. Faites glisser une section à
gauche ou à droite pour changer son niveau, ou maintenez-la au-dessus du milieu d'une autre
section pour la déposer à l'intérieur. Les numéros suivent le glissement.

<example height="45.5rem" hint="Faites glisser une section de côté, ou changez le mode d'imbrication" name="tree-outline">



</example>

## Rendu à plat

`makeSortableTree` prend vos données imbriquées et renvoie les nœuds visibles sous forme de
**liste à plat**, dans l'ordre, chacun avec sa `depth`. Vous rendez cette liste et indentez les
lignes vous-même. Chaque ligne reste une sœur dans un seul conteneur : les lignes glissent et
s'animent donc comme celles d'une liste.

```vue [Outline.vue]
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree } from '@vue-dnd-kit/core';
import Heading from './Heading.vue';

interface Section { id: string; title: string; children?: Section[] }

const outline = ref<Section[]>([
  { id: 'start', title: 'Getting started', children: [{ id: 'install', title: 'Installation' }] },
  { id: 'faq', title: 'FAQ' },
]);

const root = useTemplateRef<HTMLElement>('root');
const { items, projected } = makeSortableTree(root, {
  items: outline,     // the root nodes: a writable ref takes every drop
  indentation: 24,    // px per level: match the rows' indentation
  maxDepth: 2,
});
</script>

<template>
  <ol ref="root">
    <Heading v-for="node in items" :key="node.key" :node="node" />
  </ol>
</template>
```

```vue [Heading.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';

const props = defineProps<{ node: FlatNode<{ id: string; title: string }> }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <li ref="el" :style="{ marginInlineStart: `${node.depth * 24}px` }">{{ node.item.title }}</li>
</template>
```

Les lignes utilisent `makeSortableItem`, comme celles d'une liste. Indentez-les avec une marge,
pas avec un padding : c'est alors la ligne elle-même qui se déplace avec sa profondeur.
L'overlay prend la largeur de l'emplacement et atterrit à son niveau, et un changement de
profondeur glisse comme n'importe quel autre déplacement. Un padding n'indenterait que ce qui se
trouve dans la ligne, et l'overlay, une copie de la ligne prise à la saisie, garderait le niveau
où le glissement a commencé. `items` contient des `FlatNode` :

<table>
<thead>
  <tr>
    <th>
      Champ de <code>
        FlatNode
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
        key
      </code>
    </td>
    
    <td>
      La clé du nœud (<code>
        getKey
      </code>
      
      , <code>
        node.id
      </code>
      
       par défaut). Utilisez-la pour <code>
        :key
      </code>
      
       et l'<code>
        id
      </code>
      
       de la ligne.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        item
      </code>
    </td>
    
    <td>
      Votre nœud.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
       pour les racines. La profondeur du nœud glissé est celle où il <strong>
        atterrirait
      </strong>
      
       : son emplacement s'indente donc en direct.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        parentKey
      </code>
    </td>
    
    <td>
      La clé du parent, <code>
        null
      </code>
      
       pour les racines.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      L'index parmi ses frères.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hasChildren
      </code>
      
      , <code>
        collapsed
      </code>
    </td>
    
    <td>
      Pour un bouton de dépliage.
    </td>
  </tr>
</tbody>
</table>

Comme `items` est le brouillon, tout ce que vous calculez à partir de lui suit le glissement : la
démo numérote ses sections à partir de `items`, si bien que « 2.1 » devient « 3.1 » pendant le
déplacement. `projected` est l'endroit où atterrirait le nœud glissé, `{ depth, parentKey }`, ou
`null` tant qu'il n'est pas au-dessus de cet arbre.

Les enfants sont lus dans `node.children` et écrits à cet endroit. Des données d'une autre forme
prennent `getChildren` et `setChildren` ; l'[organigramme](#rules) ci-dessous les garde dans
`members` :

```ts
makeSortableTree(root, {
  items: org,
  getChildren: (member) => member.members,
  setChildren: (member, members) => { member.members = members; },
});
```

## Imbrication

Un glissement change la profondeur de deux façons, toutes deux activées par défaut :

<table>
<thead>
  <tr>
    <th>
      <code>
        nesting
      </code>
    </th>
    
    <th>
      La profondeur vient…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'offset'
      </code>
    </td>
    
    <td>
      Du glissement de côté : chaque tranche de <code>
        indentation
      </code>
      
       pixels vers la gauche ou la droite fait monter ou descendre d'un niveau, autant que le permettent les lignes autour de l'emplacement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'hover'
      </code>
    </td>
    
    <td>
      Du maintien du glissement au-dessus du milieu d'une ligne : le dépôt va à l'intérieur, comme premier enfant.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'both'
      </code>
    </td>
    
    <td>
      De l'un ou de l'autre. La valeur par défaut.
    </td>
  </tr>
</tbody>
</table>

Réglez `indentation` sur ce que vos lignes ajoutent par niveau (`24` par défaut), pour que
l'emplacement suive le pointeur : dans la démo, passez à `40` et glissez de côté. Avec `'hover'`
seul, un glissement de côté garde le niveau, et seul le milieu d'une ligne imbrique. Les deux
options acceptent une ref ou un getter et s'appliquent au glissement suivant.

Avec `axis: 'y'` (ou `restrictToVerticalAxis`), le glissement ne peut pas aller de côté, mais
les lignes s'imbriquent toujours par survol.

## Règles

Engineering accepte des personnes et des équipes ; Leadership est verrouillé ; rien ne descend
plus bas qu'une équipe dans une équipe. Ouvrez et fermez les équipes : les lignes qu'elles
affichent et masquent glissent pour entrer et sortir.

<example height="41rem" hint="Déplacez des personnes d'une équipe à l'autre ; essayez Leadership et un troisième niveau" name="tree-org">



</example>

```ts [OrgTree.vue]
const { items } = makeSortableTree(root, {
  items: org,
  getChildren: (member) => member.members,
  setChildren: (member, members) => { member.members = members; },
  // Only teams take members, and a locked team takes no one.
  canNest: (_member, team) => team.kind === 'team' && !team.locked,
  maxDepth: 2,
  collapsed,
  animate: true,
});
```

```ts [OrgRow.vue]
// A locked row doesn't drag (and says so with `aria-disabled`).
makeSortableItem(el, { id: () => props.node.key, disabled: () => !!props.node.item.locked });
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Limite
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        canNest(node, parent)
      </code>
    </td>
    
    <td>
      Si <code>
        node
      </code>
      
       peut aller sous <code>
        parent
      </code>
      
      . Un multi-drag pose la question pour chaque nœud glissé. Les racines sont toujours autorisées.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxDepth
      </code>
    </td>
    
    <td>
      La profondeur maximale autorisée, les racines étant à <code>
        0
      </code>
      
      . Les descendants du nœud glissé comptent : une équipe avec des membres ne descend pas plus bas que <code>
        maxDepth - 1
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
      Sur une ligne : elle ne glisse pas. Sur l'arbre : rien n'en part par glissement et rien n'y est déposé.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        group.put
      </code>
    </td>
    
    <td>
      Si l'arbre accepte ou non des items venant d'autres listes et arbres.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Tout le reste, décidé au dépôt : voir les <a href="/docs/guides/drop-decisions">
        décisions de dépôt
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Quand une règle refuse une profondeur, l'emplacement prend la profondeur la plus grande qui
passe : faites glisser Noor sous Raj et vers la droite, et l'emplacement reste au premier
niveau, puisque Leadership est verrouillé et que Raj est une personne. Là où aucune profondeur
ne passe, l'emplacement ne s'y déplace pas. Les copies et les nœuds issus de `createItem`
suivent aussi `canNest` et `maxDepth`.

### Nœuds repliés

`collapsed` est un `Set` de clés dont les enfants sont masqués, sous forme de ref ou de getter.
Leurs enfants ne sont pas dans `items` ; `node.collapsed` et `node.hasChildren` pilotent le
bouton :

```ts
const collapsed = ref(new Set<Key>());
const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
```

Un nœud glissé emporte tout son sous-arbre, replié ou non. Avec `animate: true`, les lignes
qu'un nœud affiche ou masque quand il s'ouvre ou se ferme s'animent à l'entrée et à la sortie,
tout comme les changements de données qui ne viennent pas d'un glissement.

## Une ligne d'insertion

Faites glisser un modèle depuis la gauche dans le menu, ou déplacez un item : le menu reste
immobile et une ligne montre où va le dépôt, en partant du niveau où il atterrit. Au-dessus du
milieu d'une page ou d'un groupe, c'est la ligne survolée qui s'éclaire à la place.

<example height="31rem" hint="Faites glisser un modèle dans le menu, ou déplacez un item de côté" name="tree-menu">



</example>

Avec `placeholder: 'indicator'`, l'arbre ne bouge pas pendant le glissement. Chaque ligne lit son
`indicator` et dessine le trait :

```vue [MenuRow.vue]
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';

const props = defineProps<{ node: FlatNode<MenuItem>; indent: number }>();
const el = useTemplateRef<HTMLElement>('el');
const { indicator } = makeSortableItem(el, { id: () => props.node.key });

// 'inside': the drop goes into this row. Otherwise a line before or after it.
const inside = computed(() => indicator.value?.side === 'inside');
const line = computed(() => {
  const value = indicator.value;
  if (!value || value.side === 'inside') return null;
  // From the level the drop lands at, measured from this row's own level.
  return { side: value.side, left: `${((value.depth ?? 0) - props.node.depth) * props.indent}px` };
});
</script>

<template>
  <div ref="el" class="item" :class="{ inside }" :style="{ marginLeft: `${node.depth * indent}px` }">
    {{ node.item.title }}
    <span v-if="line" class="line" :class="line.side" :style="{ left: line.left }" />
  </div>
</template>

<style scoped>
.item { position: relative; }
.item.inside { box-shadow: 0 0 0 1.5px #42b883; }
.line { position: absolute; right: 0; height: 2px; background: #42b883; }
.line.before { top: -3px; }
.line.after { bottom: -3px; }
</style>
```

Dans les arbres, `indicator` ajoute `depth` et `parentKey` : le niveau et le parent que
reçoivent les nœuds déposés. Glisser de côté déplace le trait d'un niveau à l'autre, et le
clavier le déplace aussi. Dans ce mode, un dépôt en dehors de l'arbre annule.

Les modèles sont des éléments déplaçables simples (`makeDraggable`) avec des `data`. L'arbre en
fait de nouveaux nœuds avec `createItem`, à la position et à la profondeur du trait :

```ts [MenuTree.vue]
let created = 0;
makeSortableTree(root, {
  items: menu,
  placeholder: 'indicator',
  maxDepth: 1,
  canNest: (_item, parent) => parent.kind !== 'link',
  createItem: (active) => {
    const template = active.data as { title: string; kind: MenuItem['kind'] };
    return { id: `new-${++created}`, title: `New ${template.title.toLowerCase()}`, kind: template.kind };
  },
});
```

La barre au-dessus du menu rend `menu`, les données enregistrées, et non `items` : elle ne
change qu'au dépôt.

## Arbres et listes dans un même groupe

Une story déplacée dans le backlog garde ses tâches, hors de vue, et les ramène dans la roadmap.
Maintenez <kbd value="Alt">



</kbd>

 en glissant hors de la roadmap pour copier à la place.

<example height="29.5rem" hint="Déplacez Saved cards vers le backlog et retour ; Alt copie" name="tree-backlog">



</example>

Un arbre et une liste qui ont le même `group` s'échangent des nœuds, comme deux listes. Un nœud
garde son sous-arbre où qu'il aille : la liste ne l'affiche simplement pas. Le même composant de
ligne sert aux deux, puisque `makeSortableItem({ item })` prend sa clé auprès de la liste ou de
l'arbre auquel appartient la ligne.

Les copies fonctionnent comme dans les listes (`clone`, `pull: 'clone'`, la touche de copie),
mais `clone` doit renvoyer la copie **avec tout son sous-arbre**, et chaque nœud qu'elle contient
a besoin d'une nouvelle clé :

```ts [Roadmap.vue]
let copies = 0;
const copy = (work: Work): Work => ({ ...work, id: `${work.id}-copy-${++copies}`, children: work.children?.map(copy) });

makeSortableTree(root, {
  items: roadmap,
  group: 'work',
  canNest: (work, parent) => RANK[parent.kind] < RANK[work.kind],
  maxDepth: 2,
  clone: copy,
});
```

Voir les [listes qui partagent des items](https://zizigy.github.io/docs/guides/shared-lists) pour les groupes, la copie
et `createItem`.

## Le dépôt

L'événement de dépôt de l'arbre est celui d'une liste, avec `parentKey` ajouté à `from` et `to` :

```ts
makeSortableTree(root, {
  items: outline,
  onDrop: (e) => {
    console.log(e.keys, e.from.parentKey, '→', e.to.parentKey, e.to.index);
  },
});
```

`to.index` est la position parmi les nouveaux frères, comptée après que le nœud a quitté son
ancienne place. Au dépôt, la bibliothèque donne aux nœuds modifiés leurs nouveaux enfants
(`setChildren`) et écrit un nouveau tableau de racines dans votre ref.

`e.result.get(treeId)` est le nouvel arbre sous forme de nouveau tableau de racines : les nœuds
sur les chemins modifiés sont des copies, les sous-arbres intacts sont partagés, et vos nœuds
restent tels quels. Pour un store ou des données immuables, passez un getter, appelez
`e.preventDefault()` et enregistrez `e.result` (voir les
[décisions de dépôt](https://zizigy.github.io/docs/guides/drop-decisions#stores-and-servers-controlled-lists)). Les
copies sont faites avec `withChildren(node, children)`, par défaut `{ ...node }` avec les
nouveaux enfants ; passez la vôtre pour des instances de classe.

## Clavier et multi-drag

Donnez le focus à une ligne, appuyez sur <kbd value="Space">



</kbd>

, puis :

<table>
<thead>
  <tr>
    <th>
      Touche
    </th>
    
    <th>
      Déplace le nœud
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="ArrowUp">
        
      </kbd>
      
       / <kbd value="ArrowDown">
        
      </kbd>
    </td>
    
    <td>
      Vers l'emplacement au-dessus ou en dessous, une ligne à la fois.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="ArrowRight">
        
      </kbd>
    </td>
    
    <td>
      Un niveau plus bas, sous la ligne du dessus, là où les règles le permettent.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="ArrowLeft">
        
      </kbd>
    </td>
    
    <td>
      Un niveau plus haut, hors de son parent.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Le dépose / le remet en place.
    </td>
  </tr>
</tbody>
</table>

En mode indicateur, les flèches déplacent le trait à la place. Depuis une liste ou un modèle à
côté de l'arbre, une flèche vers l'arbre y fait entrer l'item, au niveau de la ligne devant
laquelle il va.

Les nœuds sélectionnés se déplacent ensemble en un seul bloc, chacun avec son sous-arbre, dans
l'ordre du document. Un nœud sélectionné à l'intérieur d'un autre nœud sélectionné voyage dans
le sous-arbre de son parent. Voir le [multi-drag](https://zizigy.github.io/docs/guides/multi-drag).

Toutes les options se trouvent dans l'[API de makeSortableTree](https://zizigy.github.io/docs/api/make-sortable-tree).
Pour les arbres de milliers de lignes, voir les [listes virtuelles](https://zizigy.github.io/docs/guides/virtual-lists).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
