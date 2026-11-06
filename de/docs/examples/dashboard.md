---
title: "Dashboard"
description: "Widgets auf einem Raster – an ihrer Kopfzeile verschoben, an ihrer Ecke Zelle für Zelle in der Größe geändert, in Zeilen so hoch wie ihr Inhalt, mit weniger Spalten auf schmalen Bildschirmen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/examples/dashboard"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="38rem" hint="Ziehe ein Widget an seiner Kopfzeile, ändere seine Größe an seiner Ecke, tippe in die Notizen" name="dashboard" title="Dashboard">



</example>

## Worauf du achten solltest

- **Dashboard.vue**: Das Raster ist eine einzige sortierbare Liste mit `strategy: 'grid'`, die
Widgets unterschiedlicher Größe sortiert. Es zählt seine Spalten anhand seiner eigenen Breite
(`useElementSize`): vier, drei oder zwei. Seine Zeilen sind mindestens 92 px hoch und wachsen mit
ihrem Inhalt, und `grid-auto-flow: dense` füllt die Lücken, die eine Größenänderung hinterlässt.
- **Widget.vue**: Ein Widget bewegt sich an seiner Kopfzeile (`handle`), so bleibt sein Inhalt
frei: Die Aufgaben lassen sich abhaken, die Notizen nehmen Text an. Seine Ecke ist ein eigenes
ziehbares Element und ändert seine Größe.
- **WidgetBody.vue**: was die Widgets zeigen. Tippe in die Notizen: Die Zeile wächst mit dem Text
und die Widgets daneben mit der Zeile. Nichts misst sie: Es ist das eigene Layout des Rasters, und
die Bibliothek liest die Größen so, wie sie sind, wenn ein Drag startet.
- **widgets.ts**: die Widgets, ihre Größen in Zellen und die Zahlen des Rasters.

Klappe die Demo auf: Das Raster bekommt vier Spalten, und ein Widget, das auf einem kleinen
Bildschirm schmaler wurde, ist wieder so breit wie vorher.

## Größe ändern: Die Ecke ist ein ziehbares Element

Die Ecke liegt im Widget, und ein Drücken zieht das nächstgelegene ziehbare Element: die Ecke, nicht
das Widget. Sie hat kein Overlay und bewegt sich nie. Stattdessen wächst das Widget.

```ts [Widget.vue]
makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  activation: { touch: { distance: 4 } }, // a finger resizes at once, not after a long press
  attributes: false,                       // no tab stop: Shift + arrows on the header resize
});
```

Die Größe folgt dem Zeiger: wie weit er seit dem Drücken gekommen ist, in ganzen Zellen. Das Raster
zeigt diese Größe, solange die Ecke gehalten wird, und seine anderen Widgets machen Platz.

```ts [Widget.vue]
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});
```

Der Drop behält sie: Ein Monitor hört das `onDragEnd` der Ecke. <kbd value="Escape">



</kbd>

 bricht den
Drag stattdessen ab, und das Widget kehrt zu seiner eigenen Größe zurück.

```ts [Widget.vue]
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});
```

## Das Raster setzt beim Größenändern aus

Eine Ecke ist kein Widget, und das Raster würde sie ablehnen: Der Drop auf ein Ziel, das einen Drag
ablehnt, ist ein Abbruch. Also ist das Raster `disabled`, solange eine Ecke gezogen wird, und der
Drop der Ecke landet auf gar keinem Ziel.

```ts [Dashboard.vue]
const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  strategy: 'grid',
  label: 'Dashboard',
  disabled: () => !!active.value?.type.includes('resize'),
});
```

## Größen, die sich anpassen

Ein Widget behält die Größe, die es bekommen hat. Bei weniger Spalten ist es nie breiter als das
Raster (`Math.min(w, columns)`), und es bekommt seine Breite zurück, wenn das Raster wieder Platz
hat. Die Zeilen haben eine Mindesthöhe, keine Höhe: Der Inhalt entscheidet, und die Widgets einer
Zeile strecken sich alle auf die Höhe des höchsten.

## Die Tastatur

Springe mit Tab zur Kopfzeile eines Widgets und drücke <kbd value="Space">



</kbd>

, um das Widget
aufzunehmen. Die Pfeiltasten bewegen es zwischen den anderen, <kbd value="Space">



</kbd>

 legt es ab,
<kbd value="Escape">



</kbd>

 bringt es zurück. Mit fokussierter Kopfzeile ändern <kbd value="Shift">



</kbd>

 und
die Pfeiltasten die Größe des Widgets Zelle für Zelle, und Screenreader hören seine neue Größe.

Mehr dazu: [Strategien](https://zizigy.github.io/docs/guides/sortable-lists#strategies) ·
[Handles](https://zizigy.github.io/docs/guides/sortable-lists#handles) ·
[Ohne Overlay](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[useDnDMonitor()](https://zizigy.github.io/docs/guides/provider#listen-to-every-drag-usedndmonitor) ·
[Wochenkalender](https://zizigy.github.io/docs/examples/calendar)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
