---
title: "Über einen Drop entscheiden"
description: "Nimm einen Drop an, lehne ihn ab oder schiebe ihn auf – Regeln beim Ziehen oder beim Loslassen, ein Teil eines Multi-Drags, ein Dialog, ein Server, der zuerst zustimmen muss, Monitore mit Vetorecht und Drops außerhalb aller Ziele."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/drop-decisions"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Ziehe eine Karte nach **Done**. Der Drop wartet auf deine Antwort: die Karte verschieben, sie
woandershin weiterziehen oder abbrechen.

<example height="25rem" hint="Ziehe eine Karte nach Done" name="drop-confirm">



</example>

## onBeforeDrop

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => (e.items.some((task) => task.locked) ? 'reject' : 'accept'),
});
```

Listen, Bäume, Drop-Ziele (`makeDroppable`) und Monitore (`useDnDMonitor`) nehmen ein
`onBeforeDrop`. Es läuft, wenn der Drag losgelassen wird, bevor sich irgendetwas ändert, und seine
Antwort entscheidet:

<table>
<thead>
  <tr>
    <th>
      Antwort
    </th>
    
    <th>
      Was passiert
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
      
       oder nichts
    </td>
    
    <td>
      Der Drop geht durch.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'reject'
      </code>
      
       oder <code>
        false
      </code>
    </td>
    
    <td>
      Kein Drop: Die Elemente fliegen zurück. Ein geworfener Fehler lehnt ebenfalls ab.
    </td>
  </tr>
  
  <tr>
    <td>
      Ein Array von Schlüsseln
    </td>
    
    <td>
      Nur diese Elemente werden abgelegt; die anderen fliegen zurück.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'continue'
      </code>
    </td>
    
    <td>
      Kein Drop, und der Drag geht weiter.
    </td>
  </tr>
  
  <tr>
    <td>
      Ein Promise auf eines davon
    </td>
    
    <td>
      Das Overlay wartet dort, wo es losgelassen wurde, bis das Promise erfüllt ist.
    </td>
  </tr>
</tbody>
</table>

Listen und Bäume übergeben ein `SortableDropEvent`: `keys`, `items`, `from`, `to`, `mode`,
`sameList` und `result`, die neuen Arrays jeder Liste, die der Drop ändert. Drop-Ziele und
Monitore bekommen das allgemeine `DnDEvent`: `active`, `over`, `position` und `source`. Siehe
[Events](https://zizigy.github.io/docs/api/events).

## Eine Regel beim Ziehen oder beim Loslassen

Email und Chat nehmen beide Anhänge bis höchstens 10 MB an. Ziehe **demo.mov** über beide:
Email lehnt die Datei schon beim Überfahren ab, Chat nimmt sie an und schickt sie zurück, wenn du
loslässt.

<example height="27rem" hint="Ziehe eine Datei über 10 MB an jeden Ort" name="drop-rules">



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
      
       (oder das <code>
        accept
      </code>
      
       eines Ziels)
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
      Gefragt
    </td>
    
    <td>
      Beim Ziehen, sobald der Drag die Liste erreicht.
    </td>
    
    <td>
      Einmal, wenn der Drag losgelassen wird.
    </td>
  </tr>
  
  <tr>
    <td>
      Der Nutzer sieht
    </td>
    
    <td>
      Die Liste lehnt sofort ab: Kein Slot öffnet sich, <code>
        isAccepting
      </code>
      
       ist <code>
        false
      </code>
      
      , <code>
        over.accepted
      </code>
      
       ist <code>
        false
      </code>
      
      .
    </td>
    
    <td>
      Der Slot öffnet sich wie gewohnt; die Elemente fliegen beim Loslassen zurück.
    </td>
  </tr>
  
  <tr>
    <td>
      Weiß
    </td>
    
    <td>
      Was gezogen wird: <code>
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
      Den ganzen Drop: <code>
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
      Kann
    </td>
    
    <td>
      Ja oder Nein sagen.
    </td>
    
    <td>
      Auf ein Promise warten, einige Schlüssel annehmen, den Drag weiterlaufen lassen.
    </td>
  </tr>
</tbody>
</table>

Nimm `group.put` für das, was allein aus den Elementen bekannt ist (ein Typ, ein Flag, eine
Anzahl): Der Nutzer erfährt es, bevor er loslässt. Nimm `onBeforeDrop` für das, was vom Ort, von
der Antwort des Nutzers oder der des Servers abhängt. Die eigenen Regeln des Ziels kommen zuerst:
Über einer Liste oder einem Ziel, das den Drag ablehnt, wird der Drop abgebrochen, und sein
`onBeforeDrop` wird nicht gefragt.

### Einige der Elemente annehmen

Manche Regeln lassen sich erst beim Loslassen prüfen, bei einem Server. Plätze in diesem Workshop
buchen auch andere: Beim Loslassen fragt die Liste den Server, wie viele noch frei sind, und nimmt
so viele der hereingezogenen Personen an. Hake ein paar an und ziehe sie gemeinsam hinein.

<example height="28.5rem" hint="Hake drei Personen an und ziehe eine davon in den Workshop" name="drop-partial">



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

Bei einem [Multi-Drag](https://zizigy.github.io/docs/guides/multi-drag) landen die Schlüssel, die du zurückgibst,
gemeinsam, und der Rest fliegt an seine Plätze zurück. `onDrop` sieht sie dann in `e.accepted` und
`e.rejected`, und sein `e.result` ist das endgültige. Ein leeres Array nimmt nichts an: Der Drop
wird abgelehnt.

## Weiterziehen: 'continue'

`'continue'` bricht den Drop ab, nicht den Drag. Antworte im Dialog oben mit **Keep dragging**:
Das Element bleibt von dort aus, wo es war, in der Hand, die Seite geht zurück in den
Drag-Modus, und der Nutzer macht weiter.

- Mit einer Maus oder einem Stift folgt das Element dem Zeiger, ohne dass eine Taste gehalten
wird. Das nächste Loslassen – ein Klick – legt es ab, und dieser Klick erreicht die Seite
darunter nie.
- Ein Touch nimmt das Element dort wieder auf, wo der Finger aufsetzt; Anheben des Fingers legt es
ab.
- Ein Drag per Tastatur geht weiter: Die Pfeiltasten bewegen das Element, <kbd value="Space">



</kbd>

 oder
<kbd value="Enter">



</kbd>

 legen es ab.
- <kbd value="Escape">



</kbd>

 bricht ihn ab, wie jeden Drag.
- Der nächste Drop fragt `onBeforeDrop` erneut.

Monitore hören `onDragResume`, und Screenreader hören, dass das Element nicht abgelegt wurde und
sich noch bewegt (überschreibe den Text mit `announcements.onDragResume` des Providers).

```ts
useDnDMonitor({
  onDragResume() {
    hint.value = 'Still dragging: click to drop, Esc to cancel';
  },
});
```

## Den Nutzer fragen

`onBeforeDrop` darf ein Promise zurückgeben. Öffne einen Dialog und erfülle das Promise mit dem
Button, den der Nutzer wählt:

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

Solange das Promise aussteht:

- wartet das Overlay dort, wo es losgelassen wurde, markiert mit `data-dnd-overlay="dropping"`;
- behält `useDnD()` den Zustand vom Loslassen, und `status` ist `'dropping'`;
- ist die Seite aus dem Drag-Modus: Cursor und Textauswahl sind zurück, ein Dialog funktioniert
also wie gewohnt;
- kann kein anderer Drag starten.

<tip>

Ein modales `<dialog>`, das mit `showModal()` geöffnet wird, liegt im Top Layer, über dem wartenden
Overlay. Mach aus seinem `cancel`-Event (<kbd value="Escape">



</kbd>

) ein `'reject'`, wie es das Beispiel
tut.

</tip>

## Die Reihenfolge der Hooks

Ordne die Notizen um, wirf eine in den Papierkorb, stelle dann eine Antwort um und mach es noch
einmal. Das Panel listet die Hooks des letzten Drops in der Reihenfolge auf, in der sie liefen.

<example height="27.5rem" hint="Verschiebe eine Notiz oder wirf eine weg und stelle dann eine Antwort auf reject oder continue um" name="drop-hooks">



</example>

1. `onBeforeDrop` jedes `useDnDMonitor`, der Reihe nach. Ein `'reject'` oder ein `'continue'`
beendet das Fragen; Schlüssel grenzen den Drop ein.
2. `onBeforeDrop` des Ziels: die Liste oder der Baum, in die die Elemente gehen, oder das
Drop-Ziel.
3. `onDrop` nur des Ziels: Eine Liste, die Elemente in eine andere verlassen, wird nicht gefragt,
und ihr neues Array steht im `e.result` des Ziels. Wenn Elemente entfernt werden (eine
Papierkorb-Zone, `dropOutside: 'remove'`), läuft das `onDrop` ihrer Liste, mit `to.index` von
`-1`.
4. Das Standard-Schreiben: Jede Liste, die der Drop ändert, übernimmt ihr neues Array.
5. `onDragEnd` des Providers (`@drag-end`) und der Monitore. Dann landet das Overlay, und
`onDragSettle` (`@drag-settle`) meldet, dass es gelandet ist.

Ein abgelehnter Drop springt stattdessen zu `onDragCancel` (`@drag-cancel`), und die Elemente
fliegen zurück. Ein `'continue'` beendet das Fragen ebenfalls, mit `onDragResume`: Der Drag geht
weiter, und sein nächster Drop fragt erneut.

Monitore entscheiden vor dem Ziel, ein Veto kommt also nie, nachdem eine Liste schon einen eigenen
Drop angewendet hat. Das macht einen Monitor zum Ort für Regeln über jeden Drop der App:

```ts [Monitor.vue]
const { syncing } = useSync();

// Read-only while syncing: every drop under the provider flies back.
useDnDMonitor({
  onBeforeDrop: () => (syncing.value ? 'reject' : 'accept'),
});
```

## onDrop: vor dem Schreiben informiert

```ts
makeSortableList(listRef, {
  items: tasks,
  onDrop: (e) => {
    // `tasks` still holds the old order, `e.result` the new one.
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

Das `onDrop` einer Liste läuft, sobald der Drop angenommen ist, synchron, direkt bevor die Liste
ihn schreibt. Um nach dem Schreiben zu handeln, nimm `@drag-end` des Providers oder
`useDnDMonitor({ onDragEnd })`. An einem einfachen Drop-Ziel ist `onDrop` der Ort, an dem du deine
Daten änderst: Die Bibliothek verschiebt dafür nichts.

## Stores und Server: kontrollierte Listen

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

Die Bibliothek schreibt einen Drop nur in ein beschreibbares Ref. Ein Getter, ein `computed` oder
ein `readonly`-Ref wird nie beschrieben: Ruf `e.preventDefault()` auf und wende `e.result` selbst
an – die neuen Arrays jeder Liste, die der Drop ändert, nach Listen-ID. `preventDefault()`
überspringt das Schreiben in alle davon, denn nur einige zu schreiben würde Elemente verlieren
oder verdoppeln. Entwicklungs-Builds warnen, wenn der Drop einer schreibgeschützten Liste der
Bibliothek überlassen wird.

### Zuerst auf einem Server speichern

Verschiebe eine Karte, während der Server **flaky** (jede zweite Anfrage schlägt fehl) oder
**down** ist. Die Karte wartet mit einem Badge, während die Anfrage läuft, und landet dann oder
fliegt zurück, wenn sie fehlgeschlagen ist.

<example height="31.5rem" hint="Verschiebe Karten und schalte dann den Server auf flaky oder down" name="drop-server">



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

Wende `e.result` an, bevor das Promise sich auflöst, und das Overlay landet in der neuen
Reihenfolge. Wenn die Anfrage fehlschlägt, wende nichts an und lehne ab: Die Elemente fliegen
zurück, und Monitore hören `onDragCancel`.

Das Badge kommt aus dem `#overlay`-Slot des Providers, der das Overlay jedes Drags rendert. Ein
`DragPreview` zeigt die übliche Kopie der Karte, und das Badge sitzt obendrauf, während die
Anfrage läuft:

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

## Außerhalb aller Ziele ablegen

Ziehe eine App aus dem Dock und lass sie los, in jedem Modus.

<example height="24.5rem" hint="Ziehe eine App aus dem Dock und lass sie los" name="drop-outside">



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
      Ein Drop außerhalb aller Ziele …
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
      Landet dort, wo der Platzhalter ist: am letzten Platz, den die Liste gezeigt hat. Der Standard.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Wird abgebrochen: Die Elemente fliegen zurück. Der Standard bei <code>
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
      Entfernt die Elemente aus ihrer Liste. Das <code>
        onBeforeDrop
      </code>
      
       der Liste wird zuerst gefragt, und ihr <code>
        onDrop
      </code>
      
       bekommt <code>
        to.index
      </code>
      
       von <code>
        -1
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Es wird beim Drop gelesen, ein Ref oder ein Getter kann es also umschalten. Eine Papierkorb-Zone
macht absichtlich dasselbe: `makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`. Siehe
[Drag and Drop](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
