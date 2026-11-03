---
title: "Listes qui partagent des items"
description: "Les listes d'un même groupe déplacent, copient et échangent des items — toute la colonne accepte les dépôts, pull et put décident de ce qui entre et sort, les palettes copient, et les listes contrôlées appliquent chaque dépôt à un store avec un historique d'annulation."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/shared-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="31rem" hint="Déplacez des stories d'une liste à l'autre ; désactivez puis réactivez la zone de dépôt" name="sprint-planning">



</example>

## Un groupe

Les listes qui portent le même nom de `group` s'échangent des items. Par défaut, chaque liste est
un groupe à elle seule.

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import StoryCard from './StoryCard.vue';

type Story = { id: string; title: string; points: number };
const props = defineProps<{ column: { id: string; title: string; stories: Story[] } }>();

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,                     // names the list in drop events
  items: toRef(props.column, 'stories'),   // a writable ref into the reactive column
  group: 'planning',                       // same name: stories move between these lists
});
</script>

<template>
  <section :class="{ over: isOver }">
    <h3>{{ column.title }}</h3>
    <ul ref="list">
      <StoryCard v-for="story in items" :key="story.id" :story="story" />
    </ul>
  </section>
</template>
```

```vue [index.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'backlog', title: 'Backlog', stories: [{ id: 's1', title: 'Saved searches', points: 5 }] },
  { id: 'sprint', title: 'Sprint 14', stories: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

- Chaque colonne est ici un composant, comme le sont souvent les colonnes. Un composant peut aussi
créer plusieurs listes, un Todo et un Done fixes côte à côte : chaque carte rejoint la liste dont
l'élément la contient.
- `toRef(props.column, 'stories')` est modifiable parce que le parent passe un objet réactif. Le
dépôt écrit les deux tableaux, celui que la story a quitté et celui dans lequel elle est
entrée, et les points des deux colonnes suivent.
- `id` apparaît dans les événements de dépôt sous la forme `from.list` et `to.list`, et sert de
clé à `e.result`, les nouveaux tableaux de chaque liste que le dépôt modifie. `id` et `group`
sont lus une seule fois.
- Les clés doivent être uniques dans tout le groupe.

L'`onDrop` d'une liste s'exécute pour les dépôts **dans** cette liste. Un déplacement de
`backlog` vers `sprint` appelle l'`onDrop` de la liste `sprint`, et son `e.result` contient les
nouveaux tableaux des deux listes.

## Toute la colonne accepte les dépôts : `dropzone`

Une liste courte dans une colonne haute laisse un espace vide sous la dernière carte. Avec
`dropzone`, un autre élément accepte les dépôts pour la liste : ici, toute la colonne. Une story
relâchée sous la dernière atterrit à la fin. Les stories restent dans le `<ul>` ; seule la zone
qui accepte les dépôts s'agrandit. La démo entoure cette zone pendant le glissement :
désactivez-la, et seule la liste elle-même accepte la story.

```ts [Column.vue]
const zone = useTemplateRef<HTMLElement>('zone');
const { items } = makeSortableList(list, {
  items: toRef(props.column, 'stories'),
  group: 'planning',
  dropzone: zone,   // or a getter: () => (wholeColumn.value ? zone.value : undefined)
});
```

<tip>

Sans `dropzone`, une liste vide a toujours besoin d'une taille pour accepter les dépôts :
donnez-lui une `min-height`.

</tip>

## Ce qui entre et ce qui sort : `pull` et `put`

`group` accepte aussi un objet. `pull` indique ce qui peut quitter une liste, `put` ce qui peut y
entrer :

<example height="36rem" hint="Faites glisser des fichiers d'une liste à l'autre : chacune dit si elle les accepte, et sinon pourquoi" name="group-rules">



</example>

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Valeurs
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pull
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (par défaut) : les items peuvent sortir. <code>
        false
      </code>
      
       : ils ne le peuvent pas. <code>
        'clone'
      </code>
      
       : des copies sortent, les items restent.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        put
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (par défaut) : les items peuvent entrer. <code>
        false
      </code>
      
       : rien n'entre. Un type ou plusieurs (<code>
        'image'
      </code>
      
      , <code>
        ['image', 'video']
      </code>
      
      ) : les items de ces types entrent. Une fonction : vous décidez pour chaque glissement.
    </td>
  </tr>
</tbody>
</table>

```ts [index.vue]
// Inbox: gives, takes nothing.
group: { name: 'files', pull: true, put: false }

// Templates: gives copies, takes nothing, keeps its order.
group: { name: 'files', pull: 'clone', put: false }, sort: false

// Images: takes images only.
group: { name: 'files', put: 'image' }
```

Les types sont les options `type` des items glissés (`makeSortableItem(el, { item, type })`) ;
les items qui n'en ont pas comptent comme le nom du groupe. Avec des types dans `put`, chaque
item glissé doit avoir l'un d'eux (avec `acceptMode: 'some'`, ceux qui en ont un entrent).

Une fonction `put` reçoit `{ keys, items, types, from, to }` : les clés et les items glissés,
leurs types, la liste d'où ils viennent (`null` pour les éléments déplaçables simples) et cette
liste. Les déplacements à l'intérieur d'une liste sont toujours autorisés : l'Inbox trie
toujours ses propres fichiers.

Au-dessus d'une liste qui refuse le glissement, l'emplacement revient là où le glissement a
commencé : les listes montrent ainsi ce que ferait un dépôt, c'est-à-dire rien. Un dépôt à cet
endroit est annulé et l'item revient à sa place. L'`isAccepting` de la liste vaut `false`
pendant un tel glissement, et `isOver` reste `true` au-dessus d'elle : c'est ainsi que chaque
liste de la démo sait quoi dire.

L'emplacement rentre aussi chez lui au-dessus d'une cible de dépôt à part, hors des listes, comme
une corbeille : le dépôt à cet endroit revient à la cible, et les listes gardent l'item, sauf si
son `onDrop` le retire (`event.source.remove()`). Les cibles à l'intérieur des listes (un dépôt
dans un item) et autour d'elles (un panneau qui contient les listes) laissent l'emplacement où il
est.

```ts [RuleList.vue]
const { items, isOver, isAccepting } = makeSortableList(el, { … });
const { active } = useDnD();
const verdict = computed(() => (active.value ? (isAccepting.value ? 'takes' : 'refuses') : null));
```

### Limites

Une liste qui contient au plus trois fichiers, la Shortlist :

```ts [index.vue]
const shortlist = reactive({
  files: [/* … */],
  group: { name: 'files', put: ({ keys }: SortablePutContext) => shortlist.files.length + keys.length <= 3 },
});
```

Elle lit ses propres items quand un glissement le lui demande. Remplissez-la, et elle refuse le
fichier suivant, avec la raison dans son en-tête.

Quand plusieurs items sélectionnés de types différents sont glissés, `acceptMode` indique si
`'all'` (par défaut) ou `'some'` d'entre eux doivent passer `put`. Avec `'some'`, ceux qui
passent atterrissent et les autres reviennent à leur place. Voir le
[multi-drag](https://zizigy.github.io/docs/guides/multi-drag#taking-only-some).

### Un groupe par liste

Une liste appartient à un seul groupe : `group` prend un nom, jamais plusieurs. Les listes d'un
groupe partagent chaque glissement (leurs brouillons, ce qui est glissé, lesquelles l'acceptent),
donc les items ne passent jamais d'un groupe à l'autre. Quand les items ne doivent aller que dans
certains sens, mettez les listes dans un même groupe et laissez `put` décider selon `from`, la
liste d'où vient le glissement :

```ts [index.vue]
// Review takes tasks from both teams. A team takes tasks back from Review,
// never from the other team.
const fromReview = ({ from }: SortablePutContext) => from === 'review';

makeSortableList(review, { id: 'review', items: reviewTasks, group: 'tasks' });
makeSortableList(frontend, { id: 'frontend', items: frontendTasks, group: { name: 'tasks', put: fromReview } });
makeSortableList(backend, { id: 'backend', items: backendTasks, group: { name: 'tasks', put: fromReview } });
```

<note>

Si vous venez de SortableJS : là-bas, `put: ['a', 'b']` nomme les groupes dont une liste prend
des items. Ici, un tableau dans `put` énumère les **types** des items qu'une liste accepte. Pour
prendre des items d'autres listes, mettez-les dans un même groupe et décidez selon `from`, comme
ci-dessus.

</note>

## Copier : palettes et touche Alt

<example height="26rem" hint="Faites glisser depuis la palette ; glisser avec Alt copie ; déposez hors du panneau Page pour supprimer" name="palette">



</example>

```ts [Palette.vue]
makeSortableList(list, {
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                           // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

```ts [Sheet.vue]
makeSortableList(list, {
  items: blocks,
  group: 'blocks',
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),  // for Alt-drags
  dropOutside: 'remove',                                      // drag off the Page panel to delete
});
```

- `pull: 'clone'` copie chaque glissement qui sort de la liste. L'original reste, et la copie
voyage et atterrit.
- Maintenir <kbd value="Alt">



</kbd>

 pendant le glissement copie aussi, depuis n'importe quelle liste qui a
une fonction `clone` : c'est elle qui fait la copie. Changez la touche avec le `copyModifier` du
provider, ou désactivez-la avec `null`.
- Dans les deux cas, la liste d'où vient l'item a besoin de `clone`. Elle doit renvoyer la copie
avec une **nouvelle clé**. Sans `clone`, rien n'est copié.
- L'événement de dépôt a `mode: 'copy'`, et `e.items` sont les copies. Un composant d'overlay
reçoit aussi `mode`, pour afficher un « + » pendant la copie (voir [l'overlay](https://zizigy.github.io/docs/guides/overlay)).

## Échanger entre des listes

Deux listes d'un même groupe qui ont toutes deux `behavior: 'swap'` s'échangent des items :
l'item glissé prend la place de l'item survolé, et l'item survolé passe dans la liste de l'item
glissé. Il doit avoir le droit de sortir de sa liste (`pull: true`) et d'entrer dans l'autre
(`put`). Le planning d'astreinte des [listes triables](https://zizigy.github.io/docs/guides/sortable-lists#swap-instead-of-shift)
fait des échanges entre ses deux colonnes.

## Éléments déplaçables simples

Une liste accueille les items glissés avec `makeDraggable` (une puce, un modèle, un fichier issu
d'un arbre) quand elle a `createItem`. `group.put` décide aussi pour eux, avec `from: null`. Voir
[des éléments déplaçables simples dans une liste](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list).

## Déposer à l'extérieur

Ce qui se passe quand un glissement se termine au-dessus d'aucune cible dépend du `dropOutside`
de la liste :

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      Les items
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
      
       (par défaut)
    </td>
    
    <td>
      Atterrissent là où l'emplacement a été affiché en dernier.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Reviennent à leur place. La valeur par défaut avec <code>
        placeholder: 'indicator'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      Quittent leur liste : glisser au-dehors supprime. La page de la démo de palette le fait.
    </td>
  </tr>
</tbody>
</table>

`'remove'` demande d'abord à l'`onBeforeDrop` de la liste. Ensuite, l'`onDrop` de la liste
s'exécute avec `to.index === -1`, et `e.result` contient la liste sans les items. Une corbeille
qui accepte les dépôts fonctionne de la même façon : voir les
[corbeilles](https://zizigy.github.io/docs/guides/drag-and-drop#trash-zones).

## Listes contrôlées

Les listes peuvent lire un store qui ne leur appartient pas : Pinia, un état serveur, des données
immuables. Passez `items` sous forme de getter (ou de `computed`, ou de ref en lecture seule) :
la bibliothèque n'y écrit jamais. Appelez `e.preventDefault()` dans `onDrop` et appliquez
`e.result` vous-même :

<example height="26rem" hint="Déplacez des invités d'une table à l'autre, puis annulez, un déplacement à la fois" name="seating-undo">



</example>

```ts [Table.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  items: () => props.seating.state.tables[props.id]!,   // read-only
  group: 'seating',
  onDrop: (e) => {
    e.preventDefault();                                   // no write
    props.seating.apply(e.result, `${e.items[0]?.name} → ${props.title}`);
  },
});
```

```ts [store.ts]
const apply = (result: ReadonlyMap<Key, Guest[]>, label: string) => {
  const before = [...result.keys()].map((id): [Key, Guest[]] => [id, state.tables[id]!]);
  for (const [id, guests] of result) state.tables[id] = guests;
  state.history.unshift({ label, before });
};

const undo = () => {
  const last = state.history.shift();
  for (const [id, guests] of last?.before ?? []) state.tables[id] = guests;
};
```

- `e.result` associe chaque liste que le dépôt modifie à son nouveau tableau : les deux tables
après un déplacement, une seule après un réordonnancement. Ce sont de nouveaux tableaux : le
store peut donc garder les anciens pour l'annulation.
- Le brouillon suit le store : appliquez `result` dans `onDrop` (ou avant qu'un `onBeforeDrop`
asynchrone ne se résolve), et l'overlay atterrit dans le nouvel ordre.
- `preventDefault()` saute l'écriture dans chaque liste de `result`. S'il n'est appliqué nulle
part, les listes restent telles qu'elles étaient et les items reviennent à leur place.
- Les builds de développement avertissent quand le dépôt d'une liste en lecture seule est laissé
à la bibliothèque : rien ne changerait.

Pour enregistrer sur un serveur avant que le dépôt n'atterrisse, ou pour demander d'abord à
l'utilisateur, voir les [décisions de dépôt](https://zizigy.github.io/docs/guides/drop-decisions). Toutes les options des
listes se trouvent dans l'[API de makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
