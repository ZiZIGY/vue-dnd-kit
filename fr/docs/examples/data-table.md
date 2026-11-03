---
title: "Tableau de données"
description: "Un tableau Nuxt UI de 2 000 tâches, virtualisé et avec recherche, trié en faisant glisser ses lignes par leurs poignées."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/examples/data-table"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="34rem" hint="Faites glisser une tâche par sa poignée ; cherchez, puis faites glisser : les tâches masquées gardent leur place" name="ui-table" title="Tableau de données">



</example>

Le `UTable` de Nuxt UI rend le tableau, ses lignes et son virtualiseur : seules les lignes à l'écran
sont dans le DOM. Vue DnD Kit les trie. Le tableau est celui de la bibliothèque tel quel, avec ses
slots et ses classes `ui` ; rien n'en est réécrit.

## Ce qu'il faut regarder

- **TaskTable.vue** : la liste triable est le `<tbody>` du tableau, trouvé grâce au `tableRef`
qu'expose `UTable`. Le tableau reçoit le brouillon de la liste comme `data`, si bien que les lignes
bougent pendant que vous faites glisser, et `get-row-id` leur donne la tâche pour clé, comme le
fait la liste. `axis: 'y'` garde le glissement dans sa colonne, et
`restrictToFirstScrollableAncestor` à l'intérieur du tableau : son conteneur défilable est le
premier élément défilable autour des lignes. Agrandissez la démo : le tableau remplit l'écran.
- **RowGrip.vue** : `UTable` rend les lignes, donc aucun de vos composants n'est une ligne. La
poignée de la première cellule (le slot `#grip-cell`) fait de la ligne qui l'entoure l'item, et
en est la poignée (`handle`).
- **La recherche** est le `filter` de la liste : le tableau affiche les tâches qui correspondent, et
un dépôt réécrit tout le tableau des tâches, les tâches masquées là où elles étaient.
- **tasks.ts** : 2 000 tâches dans un `shallowRef` : la bibliothèque ne regarde jamais à
l'intérieur.

## Une ligne que le tableau rend

La poignée appelle `makeSortableItem` avec un getter pour la ligne : le `<tr>` qui l'entoure, une
fois rendu. En tant que `handle`, la poignée reçoit le focus et les attributs ARIA, et le reste de la
ligne reste libre pour les clics et la sélection de texte.

```ts [RowGrip.vue]
const grip = useTemplateRef<HTMLElement>('grip');
makeSortableItem(() => grip.value?.closest('tr') ?? null, {
  id: () => props.task.id,
  handle: grip,
  label: () => props.task.title,
});
```

```vue [TaskTable.vue]
<UTable ref="table" :data="items" :get-row-id="(task: Task) => task.id" …>
  <template #grip-cell="{ row }">
    <RowGrip :task="row.original" />
  </template>
</UTable>
```

L'overlay est la copie de la ligne faite par la bibliothèque, dans un tableau à elle avec les
largeurs des cellules. Une ligne de tableau ne dessine pas d'ombre, donc l'`overlay-class` du
provider en donne une au contenu de l'overlay, avec le fond du tableau et un anneau. Les classes
`ui` de la ligne teintent son emplacement pendant qu'elle voyage
(`data-[dnd-placeholder]:bg-primary/5`).

```vue [index.vue]
<DnDProvider overlay-class="overflow-hidden rounded-md bg-default shadow-xl ring ring-accented">
  <TaskTable />
</DnDProvider>
```

## Lignes virtualisées

`virtualize` donne au tableau TanStack Virtual : les lignes à l'écran et 8 de plus autour d'elles
(`overscan`) sont rendues, entre deux lignes d'espacement.

```vue [TaskTable.vue]
<UTable
  :data="items"
  :watch-options="{ deep: false }"
  :virtualize="{ estimateSize: 45, overscan: 8, onChange: () => captureLayout() }"
  class="min-h-0 flex-1"
/>
```

- `estimateSize` est une première estimation : le virtualiseur mesure chaque ligne quand il la rend.
Une mesure déplace les lignes en dessous, et `onChange` appelle le `captureLayout()` de la liste,
si bien que la bibliothèque anime ce déplacement pendant un glissement au lieu de le laisser
sauter.
- Le tableau est le conteneur défilable, et la ligne en main reste à l'intérieur : près de son bord
haut ou bas, un glissement le fait défiler, et de nouvelles lignes sont rendues à mesure qu'elles
apparaissent.
- Le brouillon est un nouveau tableau après chaque déplacement, donc `UTable` n'a pas besoin d'en
observer le contenu (`deep: false`).
- Faites défiler loin de la ligne que vous tenez : elle sort de la plage rendue et est démontée. Le
glissement continue : l'overlay l'affiche toujours, et elle atterrit là où le brouillon la place.
Une liste virtuelle à vous peut la garder montée avec `rangeExtractor` (voir
[Listes virtuelles](https://zizigy.github.io/docs/guides/virtual-lists#tanstack-virtual)). Un tableau dispose ses lignes
entre des lignes d'espacement, où une ligne rendue loin des autres les écarterait, donc celui-ci la
laisse partir.

## Chercher, puis faire glisser

```ts [TaskTable.vue]
const { items, captureLayout } = makeSortableList(() => table.value?.tableRef?.tBodies[0] ?? null, {
  items: tasks,
  filter: (task) => {
    const text = query.value.trim().toLowerCase();
    return !text || `${task.id} ${task.title} ${task.assignee}`.toLowerCase().includes(text);
  },
  axis: 'y',
  modifiers: [restrictToFirstScrollableAncestor],
  label: 'Tasks',
});
```

Cherchez « Mia », déplacez l'une de ses tâches au-dessus d'une autre, puis videz la recherche : ses
tâches sont dans le nouvel ordre, et toutes les autres tâches sont là où elles étaient. Le
`e.to.index` du dépôt compte les lignes affichées ; `e.result` contient tout le tableau des tâches.

<tip>

**Autres bibliothèques d'UI.** Nuxt UI rend des éléments simples et transmet vos classes et vos
attributs, comme le font les primitives Reka UI sur lesquelles il repose : une ref, un slot et une
classe suffisent. Dans d'autres bibliothèques, un tableau rend lui aussi ses lignes, et la même
recette fonctionne :

- **La ligne.** Un slot qui rend la ligne entière (`#item` de Vuetify, `#body` de Quasar) vous donne
son élément : faites-en l'item. Là où vous n'obtenez que des cellules (le `#body` d'une `Column`
PrimeVue, le slot par défaut d'une colonne Element Plus, le `render` de Naive UI), placez une
poignée dans l'une d'elles et faites de son `closest('tr')` l'item, comme ici.
- **La liste.** Le `<tbody>` dans l'élément racine du tableau : une ref de template sur le tableau
vous donne le composant, et son `$el` l'élément.
- **Les clés et les données.** Donnez aux lignes votre id pour clé (`item-value`, `row-key`,
`dataKey`) et passez au tableau le brouillon de la liste comme données.
- **Son propre tri désactivé.** Laissez de côté le réordonnancement des lignes propre au tableau et
son tri par colonne : l'ordre est celui de la liste.
- **Les tableaux virtuels** placent leurs lignes entre des espaceurs ou dans des boîtes absolues :
les deux fonctionnent, et un glissement survit au démontage de sa ligne.

</tip>

<note>

Le bouton StackBlitz ouvre les fichiers dans un projet Vite configuré pour Nuxt UI, comme sa
documentation le fait pour Vue : le plugin `@nuxt/ui/vite`, Tailwind CSS et `UApp` autour de
l'exemple. Dans une application Nuxt avec le module `@nuxt/ui`, copiez le dossier et rendez
`index.vue` dans une page.

</note>

## Clavier et lecteurs d'écran

Atteignez la poignée d'une tâche avec Tab et appuyez sur <kbd value="Space">



</kbd>

 pour saisir la ligne.
<kbd value="ArrowUp">



</kbd>

 et <kbd value="ArrowDown">



</kbd>

 la déplacent, <kbd value="Space">



</kbd>

 la dépose,
<kbd value="Escape">



</kbd>

 la remet à sa place. Les lignes ont un `label`, et la liste aussi : les
lecteurs d'écran entendent « Fix the login form dropped at position 3 of 2000 in Tasks. », pas des
clés.

En savoir plus : [Listes virtuelles](https://zizigy.github.io/docs/guides/virtual-lists) ·
[N'afficher qu'une partie des items](https://zizigy.github.io/docs/guides/sortable-lists#show-some-of-the-items) ·
[Style : Tailwind et kits d'UI](https://zizigy.github.io/docs/guides/styling#tailwind-css) ·
[Accessibilité](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
