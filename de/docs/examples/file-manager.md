---
title: "Dateimanager"
description: "Ein Cloud-Speicher – Raster- und Listenansicht, ein Auswahlrahmen, Ordner, die überall Drops annehmen und sich beim Darüberhalten öffnen, Alt zum Kopieren, ein Papierkorb mit Undo und Dateien, die vom Desktop hereingezogen werden."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/examples/file-manager"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Zieh einen Rahmen um Dateien und lege sie auf einem Ordner ab; Alt kopiert" name="file-manager" title="Dateimanager">



</example>

## Worauf du achten solltest

- **FileView.vue**: Der geöffnete Ordner ist eine sortierbare Liste, gezeigt als Raster aus
Kacheln oder als Liste aus Zeilen. Der Auswahlrahmen, die Klicks und die Tasten wählen aus; ein
Drag nimmt die Auswahl mit.
- **useFolderDrop.ts**: Jeder Ordner auf dem Bildschirm ist ein Drop-Ziel: Kacheln, Zeilen des
Baums, Favoriten, die Krümel des Pfads, der Papierkorb. Er sagt, warum er einen Drag ablehnt,
und schluckt, wenn die Dateien drin sind.
- **FilesOverlay.vue**: was dem Zeiger folgt, gebaut aus den Props, die jedes Overlay bekommt:
ein Stapel der echten Kacheln mit einer Anzahl, ein „+“, solange Alt kopiert, und was der Drop
tun würde.
- **SidebarRow.vue**: Ein geschlossener Ordner des Baums öffnet sich, wenn ein Drag auf ihm
ruht, damit seine Unterordner den Drop annehmen können. **Favorites.vue** ist eine eigene
sortierbare Liste, deren Zeilen ebenfalls Drop-Ziele sind.
- **useDesktopDrop.ts**: Dateien, die von deinem Computer hereingezogen werden. Das ist das Drag
and Drop des Browsers, nicht das der Bibliothek, daneben behandelt.
- **drive.ts**: der Zustand und jede Änderung, mit Undo. **index.vue**: der Provider, mit
umbelegten Tasten und seinen Ansagen.

## Eine Liste, zwei Ansichten

Das Raster und die Liste sind dieselbe sortierbare Liste. Ihre Optionen sind Getter, gelesen,
wenn ein Drag startet: Die Strategie folgt der Ansicht, und ein nach einer Spalte sortierter
Ordner (`sort: false`) ordnet sich nicht neu. Drags in seine Ordner gehen trotzdem.

```ts [FileView.vue]
const { items } = makeSortableList(list, {
  items: drive.entries,   // the open folder, sorted by a column or in your own order
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  sort: () => drive.sort.value.key === 'manual',
  multiple: 'gaps',       // the other picked files wait in place, as in Finder
  clone: drive.duplicateOf, // Alt-drag leaves the files and drops "Budget copy.xlsx"
  dropzone: area,         // the empty space takes drops too
  animateChanges: true,   // a new sort, a new folder, files sent to the Trash slide and fade
});
```

- `drive.entries` ist ein beschreibbares Computed: Die Bibliothek schreibt jeden Drop über sein
`set` zurück, und das `onDrop` der Liste sichert den Speicher vorher für Undo.
- Das Fenster erzeugt für jeden Ordner eine neue Ansicht (`:key` auf `FileView`), das Öffnen
eines Ordners ist also keine Änderung der Liste, die `animateChanges` abspielen würde.

## Auswählen

Der Provider hält die Auswahl; die Ansicht entscheidet, wie Leute sie treffen. Ein Drücken auf die
leere Fläche zieht einen Rahmen: Allein ersetzt er die Auswahl, mit gehaltenem Shift, Strg oder
Cmd kehrt er die Kacheln um, die er kreuzt. Die Strategie ist ein Getter, gelesen, wenn ein Rahmen
startet:

```ts [FileView.vue]
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});

// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
};
```

Die Klicks folgen dem Finder: Ein Klick wählt eine Datei aus, Strg/Cmd-Klick fügt eine hinzu
oder entfernt sie, Shift-Klick nimmt die Reihe ab der zuletzt geklickten. Die Pfeile bewegen
einen einzigen Tab-Stopp durch die Dateien (ein wanderndes `tabindex`, das die Bibliothek in Ruhe
lässt), Shift+Pfeile erweitern, Enter öffnet, F2 benennt um, Delete schickt in den Papierkorb,
Tippen springt zu einem Namen. Der Provider gibt Enter an die App zurück: Nur Space nimmt eine
Datei auf.

```vue [index.vue]
<script setup lang="ts">
// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };
</script>

<template>
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
```

## Ordner nehmen überall Drops an

`useFolderDrop` macht jedes Element zu einem Ordner, der Dateien annimmt. Eine Kachel ist
außerdem ein sortierbares Element des Rasters: Dort zählt das Ziel nur in der Mitte der Kachel,
und nahe an ihren Rändern macht das Raster Platz. `accept` lehnt den Ordner ab, in dem die Dateien
schon liegen, und einen Ordner in sich selbst; eine abgelehnte Kachel lässt das Raster über sie
hinweg sortieren wie über jede andere.

```ts [useFolderDrop.ts]
const { id, isOver, isAccepting } = makeDroppable(target, {
  disabled: () => !folder(),
  data: () => drive.placeOf(folder()!),   // { name, trash, why }: the overlay reads it as `over.data`
  accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
  onDrop: (event) => drive.dropInto(event, folder()!),
});

// The files are in once the overlay has landed in the folder: it gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
  },
});
```

`dropInto` verschiebt die Dateien oder kopiert sie, wenn `event.mode` `'copy'` ist (Alt gehalten
über einer Liste mit `clone`). Ein Verschieben ruft `event.source.remove()` auf: Das Raster lässt
die Dateien gehen, und sein `onDrop` läuft mit `to.index === -1`.

```ts [drive.ts]
const dropInto = (event: DnDEvent, target: FolderEntry) => {
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
  record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
  if (copying) return put(target, dragged.map(copyEntry), current.value);
  put(target, dragged, current.value);
  // The grid lets them go: the library writes the open folder without them.
  event.source?.remove();
  selection.delete(...event.active.ids);
};
```

Ein Favorit ist zugleich ein sortierbares Element (in `Favorites.vue`, einer Liste mit eigener
Gruppe) und ein Drop-Ziel: `FavoriteRow.vue` gibt die Zeilenkomponente an `makeSortableItem`, das
ihr Wurzelelement liest, und `SidebarRow.vue` macht dasselbe Element zu einem Ordner. Nahe an
seinen Rändern sortiert sich ein gezogener Favorit; darauf abgelegte Dateien gehen in seinen
Ordner.

### Ordner, die beim Darüberhalten aufspringen

Ein geschlossener Ordner des Baums öffnet sich, wenn ein Drag auf ihm ruht, wie im Finder:
`isOver` hält einen Moment an, und die Zeile klappt auf. Ihre Unterordner werden mitten im Drag
gemountet und nehmen sofort Drops an.

```ts [SidebarRow.vue]
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), 700);
});
```

## Das Overlay

`FilesOverlay.vue` ist das `overlay` der Liste. Aus dem Raster stapelt es `DragPreview`s, die
echten Klone der gewählten Kacheln: Auf einem Slot abgelegt, landet jeder auf seiner eigenen
Kachel; in einen Ordner abgelegt, gehen sie einer nach dem anderen hinein. Eine Zeile ist so breit
wie die Liste, also zentriert die Liste die Box unter dem Zeiger (`snapCenterToCursor`), und das
Overlay hängt einen kleinen Chip daran. Das Overlay ist eine Funktion, die Vue als funktionale
Komponente nimmt: Sie reicht die Props weiter, die sie liest, und sagt, welche der beiden
Darstellungen gezeichnet wird.

```ts [FileView.vue]
overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
  h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
```

Unter dem Stapel sagt eine Pille, was das Loslassen tun würde, aus dem `data` des Ordners: „Move
to Photos“, „Copy to Photos“, solange Alt gehalten wird (`mode`), oder in Rot, warum nicht, wo
`accepted` `false` ist.

```ts [FilesOverlay.vue]
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
```

Die `announcements` des Providers lesen dasselbe `data`, ein Screenreader hört also „Over Photos.
Drop to move 3 items there“ oder „Already in Documents“. Sie nennen die Dateien, wo die
eingebauten Texte ihre Schlüssel sagen würden.

## Dateien von deinem Desktop

Ziehe Dateien von deinem Computer auf das Fenster: Sie werden in den Ordner unter dem Zeiger
hochgeladen (eine Kachel, eine Zeile der Seitenleiste, ein Krümel), sonst in den geöffneten, und
Fotos zeigen sich selbst. Die Bibliothek zieht Elemente der Seite; Dateien von außen kommen mit
dem eigenen Drag and Drop des Browsers, `dragover` und `drop`, daneben behandelt:

```ts [useDesktopDrop.ts]
const dragover = (event: DragEvent) => {
  if (!carriesFiles(event)) return;
  // Cancelled, a `dragover` says the drop is welcome here.
  event.preventDefault();
  const folder = folderAt(event); // under the pointer: an element with a folder's `data-id`
  // …nothing goes into the Trash…
  drive.uploadTarget.value = folder.id; // that folder opens, as for the library's drags
};
```

## Undo, der Papierkorb und der Rest

- Jede Änderung sichert zuerst eine Kopie des Speichers; Undo in der Meldung (oder Strg/Cmd+Z)
geht zu ihr zurück. Der Papierkorb ist ein Ordner außerhalb des Baums: Was darin liegt, weiß
noch, woher es kam, und Put Back bringt es dorthin.
- `ContextMenu.vue` (ein Rechtsklick, Shift+F10 oder der Button „⋯“) wirkt auf die Auswahl oder
auf den geöffneten Ordner: Rename direkt an Ort und Stelle, Duplicate, Add to Favorites, Move to
Trash, Empty Trash.
- Das Fenster füllt die Bühne, wenn du es aufklappst, und das Info-Panel öffnet sich neben den
Dateien. Auf einem Handy ist die Seitenleiste eine Schublade; ein Tippen öffnet einen Ordner,
und ein langes Drücken nimmt eine Datei auf.

Mehr dazu: [Multi-Drag und Auswahl](https://zizigy.github.io/docs/guides/multi-drag) ·
[In ein sortierbares Element ablegen](https://zizigy.github.io/docs/guides/drag-and-drop#drop-into-a-sortable-item) ·
[`DragPreview`](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[Datenänderungen: `animateChanges`](https://zizigy.github.io/docs/guides/animations#data-changes-animatechanges) ·
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
