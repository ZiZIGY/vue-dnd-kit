---
title: "Datentabelle"
description: "Eine Nuxt-UI-Tabelle mit 2.000 Aufgaben, virtualisiert und durchsuchbar, sortiert durch Ziehen ihrer Zeilen an den Griffen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/examples/data-table"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="34rem" hint="Ziehe eine Aufgabe an ihrem Griff; suche, dann ziehe: Die ausgeblendeten Aufgaben behalten ihre Plätze" name="ui-table" title="Datentabelle">



</example>

`UTable` aus Nuxt UI rendert die Tabelle, ihre Zeilen und ihren Virtualizer: Nur die Zeilen auf dem
Bildschirm sind im DOM. Vue DnD Kit sortiert sie. Die Tabelle ist die der Bibliothek, so wie sie
kommt, mit ihren Slots und ihren `ui`-Klassen; nichts daran wird neu geschrieben.

## Worauf du achten solltest

- **TaskTable.vue**: Die sortierbare Liste ist das `<tbody>` der Tabelle, gefunden über die
`tableRef`, die `UTable` bereitstellt. Die Tabelle bekommt den Entwurf der Liste als `data`, also
bewegen sich die Zeilen, während du ziehst, und `get-row-id` gibt ihnen die Aufgabe als Schlüssel,
wie es die Liste tut. `axis: 'y'` hält den Drag in seiner Spalte und
`restrictToFirstScrollableAncestor` in der Tabelle: Ihr Scroll-Container ist das erste scrollbare
Element um die Zeilen. Klappe die Demo auf: Die Tabelle füllt den Bildschirm.
- **RowGrip.vue**: `UTable` rendert die Zeilen, also ist keine deiner Komponenten eine Zeile. Der
Griff in der ersten Zelle (der Slot `#grip-cell`) macht die Zeile um ihn herum zum sortierbaren
Element und ist ihr Handle.
- **Die Suche** ist der `filter` der Liste: Die Tabelle zeigt die passenden Aufgaben, und ein Drop
schreibt das ganze Array zurück, die ausgeblendeten Aufgaben dort, wo sie waren.
- **tasks.ts**: 2.000 Aufgaben in einem `shallowRef`: Die Bibliothek schaut nie in sie hinein.

## Eine Zeile, die die Tabelle rendert

Der Griff ruft `makeSortableItem` mit einem Getter für die Zeile auf: das `<tr>` um ihn herum, sobald
es gerendert ist. Als Handle bekommt der Griff den Fokus und die ARIA-Attribute, und der Rest der
Zeile bleibt frei für Klicks und Textauswahl.

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

Das Overlay ist die Kopie der Zeile, die die Bibliothek anlegt, in einer eigenen Tabelle mit den
Breiten der Zellen. Eine Tabellenzeile zeichnet keinen Schatten, also gibt die `overlay-class` des
Providers dem Inhalt des Overlays einen, mit dem Hintergrund der Tabelle und einem Ring. Die
`ui`-Klassen der Zeile färben ihren Platz, während sie unterwegs ist
(`data-[dnd-placeholder]:bg-primary/5`).

```vue [index.vue]
<DnDProvider overlay-class="overflow-hidden rounded-md bg-default shadow-xl ring ring-accented">
  <TaskTable />
</DnDProvider>
```

## Virtualisierte Zeilen

`virtualize` gibt der Tabelle TanStack Virtual: Die Zeilen auf dem Bildschirm und 8 weitere um sie
herum (`overscan`) werden gerendert, zwischen zwei Platzhalterzeilen.

```vue [TaskTable.vue]
<UTable
  :data="items"
  :watch-options="{ deep: false }"
  :virtualize="{ estimateSize: 45, overscan: 8, onChange: () => captureLayout() }"
  class="min-h-0 flex-1"
/>
```

- `estimateSize` ist eine erste Schätzung: Der Virtualizer misst jede Zeile, wenn er sie rendert.
Eine Messung verschiebt die Zeilen darunter, und `onChange` ruft `captureLayout()` der Liste auf,
sodass die Bibliothek diese Verschiebung während eines Drags animiert, statt sie springen zu
lassen.
- Die Tabelle ist der Scroll-Container, und die Zeile in der Hand bleibt in ihr: Nahe ihrem oberen
oder unteren Rand scrollt ein Drag sie, und neue Zeilen werden gerendert, sobald sie ins Bild
kommen.
- Der Entwurf ist nach jeder Bewegung ein neues Array, also muss die Tabelle nicht in ihn
hineinschauen (`deep: false`).
- Scrolle weit weg von der Zeile, die du hältst, und sie verlässt den gerenderten Bereich und wird
ausgehängt. Der Drag geht weiter: Das Overlay zeigt sie weiterhin, und sie landet dort, wo der
Entwurf sie hinsetzt. Eine eigene virtuelle Liste kann sie mit `rangeExtractor` eingehängt halten
(siehe [Virtuelle Listen](https://zizigy.github.io/docs/guides/virtual-lists#tanstack-virtual)). Eine Tabelle legt ihre
Zeilen zwischen Platzhalterzeilen an, wo eine weit entfernt von den anderen gerenderte Zeile sie
beiseiteschieben würde, also lässt diese sie gehen.

## Suchen, dann ziehen

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

Suche nach „Mia“, schiebe eine ihrer Aufgaben über eine andere und leere dann die Suche: Ihre
Aufgaben stehen in der neuen Reihenfolge, und jede andere Aufgabe ist dort, wo sie war. `e.to.index`
des Drops zählt die angezeigten Zeilen; `e.result` enthält das ganze Array.

<tip>

**Andere UI-Bibliotheken.** Nuxt UI rendert einfache Elemente und reicht deine Klassen und Attribute
weiter, wie es die Reka-UI-Primitives tun, auf denen es aufbaut: Ein Ref, ein Slot und eine Klasse
sind alles, was es braucht. In anderen Bibliotheken rendert eine Tabelle ihre Zeilen ebenfalls, und
dasselbe Rezept funktioniert:

- **Die Zeile.** Ein Slot, der die ganze Zeile rendert (`#item` in Vuetify, `#body` in Quasar), gibt
dir ihr Element: Mach es zum sortierbaren Element. Wo du nur Zellen bekommst (der `#body` einer
PrimeVue-`Column`, der Default-Slot einer Element-Plus-Spalte, `render` in Naive UI), setze einen
Griff in eine davon und mach dessen `closest('tr')` zum sortierbaren Element, wie hier.
- **Die Liste.** Das `<tbody>` im Wurzelelement der Tabelle: Ein Template-Ref auf der Tabelle gibt
dir die Komponente und ihr `$el` das Element.
- **Die Schlüssel und die Daten.** Gib den Zeilen deine ID als Schlüssel (`item-value`, `row-key`,
`dataKey`) und der Tabelle den Entwurf der Liste als Daten.
- **Ihre eigene Sortierung aus.** Lass das eingebaute Umsortieren von Zeilen der Tabelle und ihre
Spaltensortierung weg: Die Reihenfolge ist die der Liste.
- **Virtuelle Tabellen** platzieren ihre Zeilen zwischen Platzhaltern oder in absolut positionierten
Boxen: Beides funktioniert, und ein Drag übersteht, dass seine Zeile ausgehängt wird.

</tip>

<note>

Der StackBlitz-Button öffnet die Dateien in einem Vite-Projekt, das für Nuxt UI eingerichtet ist, so
wie es dessen Dokumentation für Vue macht: das Plugin `@nuxt/ui/vite`, Tailwind CSS und `UApp` um
das Beispiel. In einer Nuxt-App mit dem Modul `@nuxt/ui` kopierst du den Ordner und renderst
`index.vue` auf einer Seite.

</note>

## Tastatur und Screenreader

Springe mit Tab zum Griff einer Aufgabe und drücke <kbd value="Space">



</kbd>

, um die Zeile aufzunehmen.
<kbd value="ArrowUp">



</kbd>

 und <kbd value="ArrowDown">



</kbd>

 bewegen sie, <kbd value="Space">



</kbd>

 legt sie ab,
<kbd value="Escape">



</kbd>

 bringt sie zurück. Die Zeilen haben ein `label` und die Liste auch:
Screenreader hören „Fix the login form dropped at position 3 of 2000 in Tasks.“, keine Schlüssel.

Mehr dazu: [Virtuelle Listen](https://zizigy.github.io/docs/guides/virtual-lists) ·
[Nur einen Teil der Elemente zeigen](https://zizigy.github.io/docs/guides/sortable-lists#show-some-of-the-items) ·
[Styling: Tailwind und UI-Kits](https://zizigy.github.io/docs/guides/styling#tailwind-css) ·
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
