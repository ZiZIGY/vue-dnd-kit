---
title: "Dateien und andere Apps"
description: "Das eigene Drag and Drop des Browsers als Drags der Bibliothek – Dateien, Links und Text aus anderen Apps in Drop-Ziele und Listen, die ihnen Platz machen, Elemente, die aus der Seite gezogen werden, und zwischen Fenstern deiner App."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/native"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Die Drags der Bibliothek leben innerhalb der Seite. Der Browser hat ein eigenes Drag and Drop,
das die Ränder der Seite überschreitet: Dateien vom Desktop, ein Link aus einem anderen Tab, Text
aus einer anderen App und deine Elemente, die in all diese hinausgezogen werden. Die Bibliothek
führt auch diese Drags aus, als Drags des Providers: Ziele leuchten auf, Listen machen Platz, die
Events und die Screenreader-Texte sind die üblichen.

<example height="34rem" hint="Lege Bilder, Links oder Text aus anderen Apps ab; zieh eine Karte hinaus oder in diese Seite in einem zweiten Fenster" name="moodboard">



</example>

## Von außerhalb der Seite

Ein Ziel nimmt solche Drags mit `external` an, das sagt, was es annimmt. Ziele ohne diese Option
ignorieren sie.

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
      Nimmt an
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
      Dateien: <code>
        true
      </code>
      
       jede, MIME-Typen und Dateiendungen, wie <code>
        <input accept>
      </code>
      
       sie liest (<code>
        'image/*, .md'
      </code>
      
      ), oder eine Funktion, die Datei für Datei gefragt wird. Ordner nie.
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
      
      : eine Datei auf einmal. Ein Drag mit mehreren wird abgelehnt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        links
      </code>
    </td>
    
    <td>
      Links (<code>
        text/uri-list
      </code>
      
      ): eine Adresse aus einem anderen Tab, ein Link aus einer Seite.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        text
      </code>
    </td>
    
    <td>
      Reiner Text: eine Auswahl aus einer anderen App.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      Andere MIME-Typen, genau so, wie andere Apps sie anbieten.
    </td>
  </tr>
</tbody>
</table>

`makeDroppable` nimmt dieselbe Option: Eine Zone, die ein Avatarbild annimmt, findest du unter
[Drag and Drop](https://zizigy.github.io/docs/guides/drag-and-drop#files-from-the-computer).

### Was der Drag trägt

Der Browser behält die Daten eines Drags für sich, bis er abgelegt wird. Solange er gehalten
wird, erfährt die Seite nur, welche Arten von Daten er trägt. `active.external` und
`e.external` sagen, was bekannt ist:

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      Während er gehalten wird
    </th>
    
    <th>
      Beim Drop
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
      Die MIME-Typen, die er anbietet: <code>
        Files
      </code>
      
      , <code>
        text/uri-list
      </code>
      
      …
    </td>
    
    <td>
      Dieselben
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fileTypes
      </code>
    </td>
    
    <td>
      Ein MIME-Typ pro Datei
    </td>
    
    <td>
      Dieselben
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Leer
    </td>
    
    <td>
      Die Dateien, die das Ziel annimmt, als <code>
        File
      </code>
      
      s
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
      Leer
    </td>
    
    <td>
      Seine Links, sein Text, sein HTML
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
      Die Daten jedes Typs, den er anbietet
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ready
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

### In eine Liste

Eine Liste macht ihm Platz wie einem einfachen ziehbaren Element: mit `createItem`, das
zweimal gefragt wird: während der Drag gehalten wird, nach dem Element, das zeigt, wo er
hinkommt, und beim Drop, mit den Daten, nach dem, was eingefügt wird. Ein Array von Elementen
wird komplett an dieser Stelle eingefügt: eine Karte pro Bild.

```ts [cards.ts]
export const fromOutside = (active: Active): Card | Card[] | undefined => {
  const { external } = active;
  if (!external) return undefined;
  // While it is held: a tile that says what is coming.
  if (!external.ready) return { id: 'incoming', kind: 'incoming', label: incoming(external) };
  // At the drop: a card each.
  if (external.files.length) {
    return external.files.map((file) => ({ id: uid(), kind: 'image', src: URL.createObjectURL(file), name: file.name }));
  }
  if (external.urls.length) return external.urls.map((url) => ({ id: uid(), kind: 'link', url, title: host(url) }));
  const text = external.text.trim();
  return text ? { id: uid(), kind: 'note', text } : undefined;
};
```

- Die Kachel für das Ankommende ist eine Zeile deiner Liste wie jede andere: Die Liste rendert
sie, die Zeilen um sie herum weichen ihr aus, `onDrop` bekommt die echten.
- Auch Bäume nehmen solche Drags an, einen Knoten auf einmal: Ein Ordnerknoten mit einem Kind
pro Datei fasst mehrere.
- Das Drop-Event hat `e.external` mit den Daten, im `onDrop` der Liste wie in dem der Monitore.

## Aus der Seite hinaus

Mit `native` ist ein Maus-Drag eines Elements der eigene Drag des Browsers, sodass er die Seite
verlassen kann: auf den Desktop, in einen Editor, einen Chat, einen anderen Tab.

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

- `data` gibt anderen Apps das Element als MIME-Typen und Text: `text/plain`, `text/uri-list`,
`text/html`. Wird beim Start des Drags gelesen. Ohne `data` trägt `native: true` das `label`
als Text.
- Auf der Seite funktioniert der Drag wie jeder andere: Ziele, Listen, die Platz machen, der
Drop. Der Browser zeichnet das gezogene Bild statt des Overlays, und das Element bleibt an
seinem Platz (`transform` bleibt `null` mit `overlay: false`).
- Drags des Elements per Touch und Tastatur bleiben die der Bibliothek: Der Browser hat für sie
keinen eigenen Drag.
- `effect` (`effectAllowed`) sagt, was der Ort, an dem es abgelegt wird, tun darf: standardmäßig
`'copyMove'`. Ein Drop woanders beendet den Drag mit `droppedOutside`, `'move'`, `'copy'`
oder `'link'`, in `onDragEnd`. Ein Verschieben nimmt die Elemente aus ihrer Liste; eine
Kopie lässt sie dort.

`makeDraggable` nimmt `native` genauso.

## Zwischen Fenstern

Ein Element mit `native` trägt auch sich selbst: Die Listen seiner Gruppe in einem anderen
Fenster deiner App nehmen es an, als käme es aus einer ihrer eigenen Listen. Öffne das Moodboard
in einem zweiten Fenster und zieh eine Karte hinüber.

- Während der Drag gehalten wird, hat das andere Fenster das Element schon: Seine Liste zeigt es
an seinem Platz.
- Beim Drop kommt es hinein, und hier verlässt es seine Liste (der Drop war ein Verschieben).
Halte <kbd value="Ctrl">



</kbd>

 (<kbd value="Option">



</kbd>

 auf dem Mac) gedrückt, um es stattdessen zu
kopieren.
- Eine Liste mit `createItem` wird auch nach solchen Elementen gefragt, mit gesetztem
`active.external.group` und den Elementen in `active.items[].item`: Gib sie zurück oder Kopien
mit Schlüsseln dieses Fensters. Ohne `createItem` kommen sie so hinein, wie sie sind.
- Elemente reisen als JSON: Datumswerte werden zu Strings, Funktionen fallen weg.

## Einschränkungen

- Die Daten kommen erst mit dem Drop, nie vorher: Plane das Element, das sich zeigt, während ein
Drag gehalten wird, ohne sie.
- Dateien zu ziehen ist etwas für Maus- und Trackpad-Nutzer. Biete neben der Zone auch ein
`<input type="file">` an.
- Ein Provider der Seite nimmt Drags von außen an: der erste, der ein Ziel für sie hat.
- In Firefox erfährt ein Element, das während des Drags in eine andere Liste verschoben und dann
in einem anderen Fenster abgelegt wurde, nichts von diesem Drop: Es bleibt hier, wo es war.
- Ein Element, dessen JSON 16 KB überschreitet, kommt trotzdem in ein anderes Fenster, aber
dieses Fenster zeigt es erst beim Drop.

Die API steht unter [makeDroppable](https://zizigy.github.io/docs/api/make-droppable#from-outside-the-page) und
[makeDraggable](https://zizigy.github.io/docs/api/make-draggable#out-of-the-page).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
