---
title: "Fichiers et autres applications"
description: "Le glisser-déposer propre au navigateur, sous forme de glissements de la bibliothèque — des fichiers, des liens et du texte venus d'autres applications dans des cibles de dépôt et des listes qui leur font de la place, des items glissés hors de la page, et entre les fenêtres de votre application."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/guides/native"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Les glissements de la bibliothèque vivent dans la page. Le navigateur a son propre
glisser-déposer, qui franchit les bords de la page : des fichiers depuis le bureau, un lien depuis
un autre onglet, du texte depuis une autre application, et vos items glissés vers tous ces
endroits. La bibliothèque prend aussi en charge ces glissements, comme des glissements du
provider : les cibles s'allument, les listes font de la place, les événements et les textes pour
les lecteurs d'écran sont les mêmes que d'habitude.

<example height="34rem" hint="Déposez des images, des liens ou du texte venus d'autres applications. Sortez une carte de la page, ou glissez-la dans cette page ouverte dans une seconde fenêtre" name="moodboard">



</example>

## Depuis l'extérieur de la page

Une cible accepte ces glissements avec `external`, qui dit ce qu'elle accepte. Les cibles sans
cette option les ignorent.

```ts [Board.vue]
const { items } = makeSortableList(grid, {
  items: cards,
  group: 'moodboard',
  strategy: 'grid',
  external: { files: 'image/*', links: true, text: true },
  createItem: fromOutside,
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        external
      </code>
    </th>
    
    <th>
      Accepte
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Des fichiers : <code>
        true
      </code>
      
       n'importe lesquels, des types MIME et des extensions tels que <code>
        <input accept>
      </code>
      
       les lit (<code>
        'image/*, .md'
      </code>
      
      ), ou une fonction interrogée fichier par fichier. Jamais les dossiers.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        multiple
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
      
       : un fichier à la fois. Un glissement de plusieurs fichiers est refusé.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        links
      </code>
    </td>
    
    <td>
      Des liens (<code>
        text/uri-list
      </code>
      
      ) : une adresse depuis un autre onglet, un lien d'une page.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        text
      </code>
    </td>
    
    <td>
      Du texte brut : une sélection depuis une autre application.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      D'autres types MIME, exactement tels que les autres applications les proposent.
    </td>
  </tr>
</tbody>
</table>

`makeDroppable` accepte la même option : une zone qui accepte une image d'avatar se trouve dans
[glisser-déposer](https://zizigy.github.io/docs/guides/drag-and-drop#files-from-the-computer).

### Ce que transporte le glissement

Le navigateur garde pour lui les données d'un glissement jusqu'au dépôt. Tant que le glissement
est tenu, la page apprend seulement quels types de données il transporte. `active.external` et
`e.external` disent ce qui est connu :

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      Pendant le glissement
    </th>
    
    <th>
      Au dépôt
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      Les types MIME qu'il propose : <code>
        Files
      </code>
      
      , <code>
        text/uri-list
      </code>
      
      …
    </td>
    
    <td>
      Les mêmes
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fileTypes
      </code>
    </td>
    
    <td>
      Un type MIME par fichier
    </td>
    
    <td>
      Les mêmes
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Vide
    </td>
    
    <td>
      Les fichiers que la cible accepte, en <code>
        File
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        urls
      </code>
      
      , <code>
        text
      </code>
      
      , <code>
        html
      </code>
    </td>
    
    <td>
      Vide
    </td>
    
    <td>
      Ses liens, son texte, son HTML
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        getData(type)
      </code>
    </td>
    
    <td>
      <code>
        ''
      </code>
    </td>
    
    <td>
      Les données de n'importe quel type qu'il propose
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dropped
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
  </tr>
</tbody>
</table>

### Dans une liste

Une liste lui fait de la place comme à un élément déplaçable simple : avec `createItem`, qui
est appelé deux fois : pendant le glissement, pour l'item qui montre où il va, et au
dépôt, avec les données, pour ce qui est inséré. Un tableau d'items est inséré en entier à cet
endroit : une carte par image.

```ts [cards.ts]
export const fromOutside = (active: Active): Card | Card[] | undefined => {
  const { external } = active;
  if (!external) return undefined;
  // While it is held: a tile that says what is coming.
  if (!external.dropped) return { id: 'incoming', kind: 'incoming', label: incoming(external) };
  // At the drop: a card each.
  if (external.files.length) {
    return external.files.map((file) => ({ id: uid(), kind: 'image', src: URL.createObjectURL(file), name: file.name }));
  }
  if (external.urls.length) return external.urls.map((url) => ({ id: uid(), kind: 'link', url, title: host(url) }));
  const text = external.text.trim();
  return text ? { id: uid(), kind: 'note', text } : undefined;
};
```

- La tuile d'arrivée est une ligne de votre liste comme une autre : la liste la rend, les lignes
autour s'écartent de son chemin, `onDrop` reçoit les vrais items.
- Les arbres acceptent aussi ces glissements, un nœud à la fois : un nœud dossier avec un enfant
par fichier en contient plusieurs.
- L'événement de dépôt a `e.external` avec les données, dans le `onDrop` de la liste comme dans
celui des moniteurs.

## Hors de la page

Avec `native`, un glissement d'item à la souris est le glissement propre au navigateur : il peut
donc quitter la page, vers le bureau, un éditeur, un chat, un autre onglet.

```ts [Tile.vue]
makeSortableItem(el, {
  item: () => props.card,
  native: { data: () => toOutside(props.card) },
});
```

```ts [cards.ts]
case 'link':
  return { 'text/uri-list': card.url, 'text/plain': card.url };
case 'note':
  return { 'text/plain': card.text };
```

- `data` donne l'item aux autres applications sous forme de types MIME et de texte :
`text/plain`, `text/uri-list`, `text/html`. Lu au début du glissement. Sans elle,
`native: true` transporte le `label` comme texte.
- Sur la page, le glissement fonctionne comme n'importe quel autre : cibles, listes qui font de
la place, dépôt. Le navigateur dessine l'image glissée à la place de l'overlay, et l'élément
reste en place (`transform` reste `null` avec `overlay: false`).
- Les glissements de l'item au toucher et au clavier restent ceux de la bibliothèque : le
navigateur n'a pas de glissement à lui pour eux.
- `effect` (`effectAllowed`) dit ce que l'endroit où il est déposé a le droit de faire :
`'copyMove'` par défaut. Un dépôt ailleurs termine le glissement avec `droppedOutside`,
`'move'`, `'copy'` ou `'link'`, dans `onDragEnd`. Un déplacement retire les items de leur
liste ; une copie les laisse.

`makeDraggable` accepte `native` de la même façon.

## Entre fenêtres

Un item avec `native` se transporte aussi lui-même : les listes de son groupe dans une autre
fenêtre de votre application l'acceptent comme s'il venait de l'une de leurs propres listes.
Ouvrez le moodboard dans une seconde fenêtre et faites-y glisser une carte.

- Pendant le glissement, l'autre fenêtre a déjà l'item : sa liste le montre en place.
- Au dépôt, il y entre, et ici il quitte sa liste (le dépôt était un déplacement). Maintenez
<kbd value="Ctrl">



</kbd>

 (<kbd value="Option">



</kbd>

 sur Mac) pour le copier à la place.
- Une liste avec `createItem` est aussi interrogée pour ces items, avec `active.external.group`
défini et les items dans `active.items[].item` : renvoyez-les, ou des copies avec des clés de
cette fenêtre. Sans `createItem`, ils entrent tels quels.
- Les items voyagent en JSON : les dates deviennent des chaînes, les fonctions sont omises.

## Limites

- Les données n'arrivent qu'avec le dépôt, jamais avant : prévoyez sans elles l'item qui
s'affiche pendant qu'un glissement est tenu.
- Faire glisser des fichiers, c'est pour les utilisateurs de souris et de pavé tactile. Proposez
aussi un `<input type="file">` à côté de la zone.
- Un seul provider de la page accepte les glissements venus de l'extérieur : le premier qui a une
cible pour eux.
- Dans Firefox, un item déplacé dans une autre liste pendant le glissement puis déposé dans une
autre fenêtre n'est pas informé de ce dépôt : ici, il reste où il était.
- Un item dont le JSON dépasse 16 Ko va quand même dans une autre fenêtre, mais cette fenêtre ne
le montre qu'au dépôt.

L'API est dans [makeDroppable](https://zizigy.github.io/docs/api/make-droppable#from-outside-the-page) et
[makeDraggable](https://zizigy.github.io/docs/api/make-draggable#out-of-the-page).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
