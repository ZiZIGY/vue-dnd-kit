---
title: "Décider d'un dépôt"
description: "Accepter, refuser ou différer un dépôt — des règles pendant le glissement ou au relâchement, une partie d'un multi-drag, une boîte de dialogue, un serveur qui doit d'abord être d'accord, des moniteurs qui opposent leur veto, et les dépôts en dehors de toute cible."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/drop-decisions"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Faites glisser une carte dans **Done**. Le dépôt attend votre réponse : déplacer la carte,
continuer à la faire glisser ailleurs, ou annuler.

<example height="25rem" hint="Faites glisser une carte dans Done" name="drop-confirm">



</example>

## onBeforeDrop

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => (e.items.some((task) => task.locked) ? 'reject' : 'accept'),
});
```

Les listes, les arbres, les cibles de dépôt (`makeDroppable`) et les moniteurs (`useDnDMonitor`)
acceptent un `onBeforeDrop`. Il s'exécute quand le glissement est relâché, avant que quoi que ce
soit ne change, et sa réponse décide :

<table>
<thead>
  <tr>
    <th>
      Réponse
    </th>
    
    <th>
      Ce qui se passe
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       ou rien
    </td>
    
    <td>
      Le dépôt aboutit.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'reject'
      </code>
      
       ou <code>
        false
      </code>
    </td>
    
    <td>
      Pas de dépôt : les items reviennent à leur place. Une erreur levée refuse aussi.
    </td>
  </tr>
  
  <tr>
    <td>
      Un tableau de clés
    </td>
    
    <td>
      Seuls ces items sont déposés ; les autres reviennent à leur place.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'continue'
      </code>
    </td>
    
    <td>
      Pas de dépôt, et le glissement continue.
    </td>
  </tr>
  
  <tr>
    <td>
      Une promesse de l'une de ces réponses
    </td>
    
    <td>
      L'overlay attend là où il a été relâché jusqu'à ce que la promesse soit réglée.
    </td>
  </tr>
</tbody>
</table>

Les listes et les arbres passent un `SortableDropEvent` : `keys`, `items`, `from`, `to`, `mode`,
`sameList` et `result`, les nouveaux tableaux de chaque liste que le dépôt modifie. Les cibles
de dépôt et les moniteurs reçoivent le `DnDEvent` générique : `active`, `over`, `position` et
`source`. Voir les [événements](https://zizigy.github.io/docs/api/events).

## Une règle pendant le glissement, ou au relâchement

Email et Chat acceptent tous deux des pièces jointes de 10 Mo au plus. Faites glisser
**demo.mov** au-dessus de chacun : Email la refuse pendant le survol, Chat l'accepte et la
renvoie quand vous relâchez.

<example height="27rem" hint="Faites glisser un fichier de plus de 10 Mo vers chaque endroit" name="drop-rules">



</example>

```ts [Column.vue]
// Asked while dragging: a refused drag never enters the list.
group: { name: 'attachments', put: ({ items }) => fits(items as Attachment[]) },

// Asked on release: the drag enters the list, then flies back.
onBeforeDrop: (e) => (fits(e.items) ? 'accept' : 'reject'),
```

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      <code>
        group.put
      </code>
      
       (ou l'<code>
        accept
      </code>
      
       d'une cible)
    </th>
    
    <th>
      <code>
        onBeforeDrop
      </code>
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Interrogé
    </td>
    
    <td>
      Pendant le glissement, dès que le glissement atteint la liste.
    </td>
    
    <td>
      Une fois, quand le glissement est relâché.
    </td>
  </tr>
  
  <tr>
    <td>
      L'utilisateur voit
    </td>
    
    <td>
      La liste refuse tout de suite : aucun emplacement ne s'ouvre, <code>
        isAccepting
      </code>
      
       vaut <code>
        false
      </code>
      
      , <code>
        over.accepted
      </code>
      
       vaut <code>
        false
      </code>
      
      .
    </td>
    
    <td>
      L'emplacement s'ouvre comme d'habitude ; les items reviennent à leur place au relâchement.
    </td>
  </tr>
  
  <tr>
    <td>
      Connaît
    </td>
    
    <td>
      Ce qui est glissé : <code>
        keys
      </code>
      
      , <code>
        items
      </code>
      
      , <code>
        types
      </code>
      
      , <code>
        from
      </code>
      
      , <code>
        to
      </code>
      
      .
    </td>
    
    <td>
      Tout le dépôt : <code>
        to.index
      </code>
      
      , <code>
        sameList
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        result
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Peut
    </td>
    
    <td>
      Dire oui ou non.
    </td>
    
    <td>
      Attendre une promesse, accepter certaines clés, prolonger le glissement.
    </td>
  </tr>
</tbody>
</table>

Utilisez `group.put` pour ce qui se sait à partir des items seuls (un type, un indicateur, un
nombre) : l'utilisateur l'apprend avant de relâcher. Utilisez `onBeforeDrop` pour ce qui dépend
de l'endroit, de la réponse de l'utilisateur ou de celle du serveur. Les règles propres à la
cible passent en premier : au-dessus d'une liste ou d'une cible qui refuse le glissement, le
dépôt est annulé et son `onBeforeDrop` n'est pas interrogé.

### Accepter une partie des items

Certaines règles ne peuvent être vérifiées qu'au relâchement, auprès d'un serveur. Les places de
cet atelier sont aussi réservées par d'autres : au relâchement, la liste demande au serveur
combien il en reste, et accepte autant de personnes parmi celles qui ont été glissées. Cochez-en
quelques-unes, et faites-les glisser ensemble.

<example height="28.5rem" hint="Cochez trois personnes, faites-en glisser une dans l'atelier" name="drop-partial">



</example>

```ts [Column.vue]
makeSortableList(list, {
  items: toRef(props.column, 'people'),
  group: 'workshop',
  // Some keys: those land, the others fly back to where they came from.
  onBeforeDrop: async (e) => {
    const { free } = await seatsLeft(props.column.people.length); // the overlay waits
    return e.keys.slice(0, free);
  },
  onDrop: (e) => {
    selection.delete(...e.accepted); // the ones sent back stay selected
    notice.value = `${e.accepted.length} booked, ${e.rejected.length} back to the waiting list`;
  },
});
```

Dans un [multi-drag](https://zizigy.github.io/docs/guides/multi-drag), les clés que vous renvoyez atterrissent ensemble
et les autres reviennent à leur place. `onDrop` les voit ensuite dans `e.accepted` et
`e.rejected`, et son `e.result` est le résultat final. Un tableau vide n'accepte rien : le dépôt
est refusé.

## Continuer à glisser : 'continue'

`'continue'` annule le dépôt, pas le glissement. Répondez **Keep dragging** dans la boîte de
dialogue ci-dessus : l'item reste en main depuis l'endroit où il était, la page repasse en mode
glissement, et l'utilisateur continue.

- À la souris ou au stylet, l'item suit le pointeur sans bouton enfoncé. Le relâchement suivant
— un clic — le dépose, et ce clic n'atteint jamais la page en dessous.
- Au toucher, l'item est repris là où le doigt se pose ; lever le doigt le dépose.
- Un glissement au clavier continue : les flèches déplacent l'item, <kbd value="Space">



</kbd>

 ou
<kbd value="Enter">



</kbd>

 le déposent.
- <kbd value="Escape">



</kbd>

 l'annule, comme n'importe quel glissement.
- Le dépôt suivant interroge de nouveau `onBeforeDrop`.

Les moniteurs entendent `onDragResume`, et les lecteurs d'écran annoncent que l'item n'a pas été
déposé et qu'il est toujours en mouvement (remplacez le texte avec
`announcements.onDragResume` du provider).

```ts
useDnDMonitor({
  onDragResume() {
    hint.value = 'Still dragging: click to drop, Esc to cancel';
  },
});
```

## Demander à l'utilisateur

`onBeforeDrop` peut renvoyer une promesse. Ouvrez une boîte de dialogue, et résolvez la promesse
avec le bouton que choisit l'utilisateur :

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'release',
  onBeforeDrop: (e) => (props.column.confirm && !e.sameList ? props.ask(e) : 'accept'),
});
```

```ts [Board.vue]
type Answer = 'accept' | 'continue' | 'reject';
const question = shallowRef<{ title: string; resolve: (answer: Answer) => void } | null>(null);

/** Opens the dialog: `onBeforeDrop` waits for the button the user picks. */
const ask = (e: SortableDropEvent<Task>) =>
  new Promise<Answer>((resolve) => {
    question.value = { title: e.items[0]!.title, resolve };
  });
```

Tant que la promesse est en attente :

- l'overlay attend là où il a été relâché, marqué `data-dnd-overlay="dropping"` ;
- `useDnD()` garde l'état qu'il avait au relâchement, et `status` vaut `'dropping'` ;
- la page est sortie du mode glissement : le curseur et la sélection de texte sont revenus, et
une boîte de dialogue fonctionne donc normalement ;
- aucun autre glissement ne peut commencer.

<tip>

Un `<dialog>` modal ouvert avec `showModal()` se trouve dans la top layer, au-dessus de l'overlay
en attente. Transformez son événement `cancel` (<kbd value="Escape">



</kbd>

) en `'reject'`, comme le
fait l'exemple.

</tip>

## L'ordre des hooks

Réordonnez les notes, déposez-en une dans la corbeille, puis changez une réponse et
recommencez. Le panneau liste les hooks du dernier dépôt dans l'ordre où ils se sont exécutés.

<example height="27.5rem" hint="Déplacez une note ou jetez-en une, puis passez une réponse à reject ou continue" name="drop-hooks">



</example>

1. L'`onBeforeDrop` de chaque `useDnDMonitor`, tour à tour. Un `'reject'` ou un `'continue'`
met fin aux questions ; des clés restreignent le dépôt.
2. L'`onBeforeDrop` de la cible : la liste ou l'arbre où vont les items, ou la cible de dépôt.
3. L'`onDrop` de la cible uniquement : une liste que des items quittent pour une autre n'est pas
interrogée, et son nouveau tableau se trouve dans l'`e.result` de la cible. Quand des items
sont retirés (une corbeille, `dropOutside: 'remove'`), l'`onDrop` de leur liste s'exécute,
avec un `to.index` de `-1`.
4. L'écriture par défaut : chaque liste que le dépôt modifie reçoit son nouveau tableau.
5. L'`onDragEnd` du provider (`@drag-end`) et des moniteurs. Puis l'overlay atterrit, et
`onDragSettle` (`@drag-settle`) l'annonce.

Un dépôt refusé passe directement à `onDragCancel` (`@drag-cancel`), et les items reviennent à
leur place. Un `'continue'` met aussi fin aux questions, avec `onDragResume` : le glissement
continue, et son prochain dépôt pose de nouveau les questions.

Les moniteurs décident avant la cible : un veto ne vient donc jamais après qu'une liste a déjà
appliqué un dépôt de son côté. Cela fait d'un moniteur l'endroit idéal pour des règles portant
sur chaque dépôt de l'application :

```ts [Monitor.vue]
const { syncing } = useSync();

// Read-only while syncing: every drop under the provider flies back.
useDnDMonitor({
  onBeforeDrop: () => (syncing.value ? 'reject' : 'accept'),
});
```

## onDrop : prévenu avant l'écriture

```ts
makeSortableList(listRef, {
  items: tasks,
  onDrop: (e) => {
    // `tasks` still holds the old order, `e.result` the new one.
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

L'`onDrop` d'une liste s'exécute une fois le dépôt accepté, de façon synchrone, juste avant que
la liste ne l'écrive. Pour agir après l'écriture, utilisez le `@drag-end` du provider ou
`useDnDMonitor({ onDragEnd })`. Sur une simple cible de dépôt, `onDrop` est l'endroit où vous
modifiez vos données : la bibliothèque ne déplace rien pour elle.

## Stores et serveurs : listes contrôlées

```ts
const store = useBoardStore();
const { items } = makeSortableList(listRef, {
  id: 'todo',
  group: 'board',
  items: () => store.lists.todo, // a getter: read-only
  onDrop: (e) => {
    e.preventDefault();
    for (const [listId, next] of e.result) store.setList(listId, next);
  },
});
```

La bibliothèque n'écrit un dépôt que dans une ref modifiable. Un getter, un `computed` ou une
ref `readonly` ne sont jamais écrits : appelez `e.preventDefault()` et appliquez `e.result`
vous-même — les nouveaux tableaux de chaque liste que le dépôt modifie, par id de liste.
`preventDefault()` saute l'écriture dans toutes ces listes, car n'en écrire que certaines
perdrait ou dupliquerait des items. Les builds de développement avertissent quand le dépôt d'une
liste en lecture seule est laissé à la bibliothèque.

### Enregistrer d'abord sur un serveur

Déplacez une carte avec le serveur **flaky** (une requête sur deux échoue) ou **down**. La carte
attend avec un badge pendant que la requête s'exécute, puis atterrit, ou revient à sa place si
elle a échoué.

<example height="31.5rem" hint="Déplacez des cartes, puis passez le serveur en flaky ou down" name="drop-server">



</example>

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  // A getter: the library never writes it. The drop is applied below, once saved.
  items: () => board[props.id]!,
  group: 'sprint',
  onBeforeDrop: async (e) => {
    e.preventDefault();
    try {
      await saveMove(e.keys, e.to);
    } catch {
      return 'reject'; // nothing applied: the card flies back
    }
    for (const [id, tasks] of e.result) board[id] = tasks; // lands in its new place
    return 'accept';
  },
});
```

Appliquez `e.result` avant que la promesse ne se résolve, et l'overlay atterrit dans le nouvel
ordre. Quand la requête échoue, n'appliquez rien et refusez : les items reviennent à leur place,
et les moniteurs entendent `onDragCancel`.

Le badge vient du slot `#overlay` du provider, qui rend l'overlay de chaque glissement. Un
`DragPreview` affiche la copie habituelle de la carte, et le badge se place par-dessus pendant
que la requête s'exécute :

```vue [index.vue]
<DnDProvider>
  <Board />
  <template #overlay="{ active }">
    <div class="carried">
      <DragPreview :id="active.id" />
      <span v-if="saving" class="saving">Saving…</span>
    </div>
  </template>
</DnDProvider>
```

## Déposer en dehors de toute cible

Faites glisser une application hors du dock et relâchez, dans chaque mode.

<example height="24.5rem" hint="Faites glisser une application hors du dock et relâchez" name="drop-outside">



</example>

```ts [Dock.vue]
const { items } = makeSortableList(dock, {
  items: apps,
  strategy: 'horizontal',
  dropOutside: () => props.dropOutside,
  // Called on the list the items leave, with `to.index` -1, when they are removed.
  onDrop: (e) => {
    if (e.to.index === -1) notice.value = `Removed ${e.items.map((app) => app.name).join(', ')}`;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      Un dépôt en dehors de toute cible…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
    </td>
    
    <td>
      Atterrit là où se trouve le placeholder : la dernière place que la liste a montrée. La valeur par défaut.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Est annulé : les items reviennent à leur place. La valeur par défaut avec <code>
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
      Retire les items de leur liste. L'<code>
        onBeforeDrop
      </code>
      
       de la liste est interrogé d'abord, et son <code>
        onDrop
      </code>
      
       reçoit un <code>
        to.index
      </code>
      
       de <code>
        -1
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Il est lu au dépôt : une ref ou un getter peut donc le changer. Une corbeille fait la même chose
volontairement : `makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`. Voir le
[glisser-déposer](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
