---
title: "Formular-Builder"
description: "Ein Formular-Builder mit Nuxt UI – Felder, die aus einer Palette gezogen, in Zeilen nebeneinandergesetzt, in einem Panel bearbeitet, dann in einer Live-Vorschau mit Validierung ausgefüllt und als Vue-Code exportiert werden."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/examples/form-builder"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="44rem" hint="Ziehe ein Feld ins Formular, neben ein anderes für Spalten" name="form-builder" title="Formular-Builder">



</example>

Jedes Bedienelement hier ist eine Nuxt-UI-Komponente: die Felder des Formulars (`UInput`,
`USelect`, `URadioGroup`, `UInputRating`, `UFileUpload`…), die Panels drumherum, das `UForm` der
Vorschau. Vue DnD Kit bewegt sie. Klappe die Demo auf Vollbild auf: Dann stehen die Palette, das
Formular und die Einstellungen nebeneinander.

## Worauf du achten solltest

- **PaletteGroup.vue**: Ein Abschnitt der Palette ist eine sortierbare Liste, die nur Kopien
hergibt: `group: { name: 'fields', pull: 'clone', put: false }` und `sort: false`. Ihre Elemente
sind Felder wie die des Formulars, eine in eine Zeile gezogene Kopie ist also ein Feld wie die
anderen; `clone` gibt ihr einen eigenen Schlüssel. Ein Klick (oder <kbd value="Enter">



</kbd>

) fügt das
Feld ohne Drag hinzu.
- **FormRow.vue**: Eine Zeile ist zwei Dinge zugleich, wie eine Kanban-Spalte: ein Element der
Zeilenliste des Formulars, an seinem Griff gezogen, und eine Liste von bis zu drei Feldern in der
Gruppe der Palette. Ihr `put` lehnt ein viertes ab: Über einer vollen Zeile wird das Feld in der
Hand rot und sagt, warum, und ein Drop dort wird abgebrochen.
- **NewRowZone.vue**: Lege ein Feld in der Lücke zwischen zwei Zeilen ab oder unter der letzten,
und es bekommt eine eigene Zeile. Diese Stellen sind auch Listen: leere Listen derselben Gruppe,
deren IDs sagen, wohin die neue Zeile kommt.
- **FieldCard.vue**: Die Zeilen sind im Indikator-Modus (`placeholder: 'indicator'`), also
bewegt sich nichts, während ein Feld gezogen wird: Eine Linie neben einem Feld zeigt, wohin es
kommt. In einem schmalen Builder stapeln sich die Felder einer Zeile, und die Linie steht über
oder unter ihnen.
- **Trash.vue**: Während ein Feld des Formulars gezogen wird, wird die Palette zum Papierkorb:
ein einfaches Drop-Ziel, das nur die Felder des Formulars annimmt (`accept: 'fields'`, der Name
ihrer Gruppe) und sie mit `event.source.remove()` entfernt.
- **OptionList.vue**: Die Optionen eines Dropdowns oder einer Mehrfachauswahl sind eine eigene
sortierbare Liste im Einstellungs-Panel, an ihren Griffen gezogen, damit ihr Text bearbeitbar
bleibt.
- **form.ts**: das Formular und der einzige Code, der es ändert. Die Listen lesen es und
schreiben es nie, also sehen Undo und Redo jede Änderung, Drops eingeschlossen.

## Eine Zeile aus Feldern ist eine Liste in einer Liste

Die Zeilen des Formulars und die Felder jeder Zeile sind Listen zweier Gruppen, `rows` und
`fields`. Ein Drag betritt immer nur die Listen seiner eigenen Gruppe: Ein Feld landet nie zwischen
den Zeilen und eine Zeile nie in einer anderen Zeile, wie auch immer sie verschachtelt sind.

```ts [FormRow.vue]
// The row is an item of the form's rows, dragged by its grip...
makeSortableItem(el, { item: () => props.row, handle: grip });

// ...and a list of up to three fields side by side, in the group of the palette.
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: rowList(props.row.id),
  items: () => props.row.fields,
  group: { name: 'fields', put: ({ keys }) => props.row.fields.length + keys.length <= MAX_COLUMNS },
  strategy: () => (props.stacked ? 'vertical' : 'horizontal'),
  placeholder: 'indicator',
  overlay: FieldOverlay,
  clone: cloneField, // Alt-drag copies a field
  animate: true,
  onDrop: form.drop,
});
```

Eine neue Zeile braucht einen Ort, an dem sie abgelegt werden kann. Jede Zeile hält ein Band über
der Lücke über ihr, und der Platz unter der letzten Zeile ist ein weiterer solcher Ort: eine leere
Liste der Gruppe `fields`, die nie ein Element zeigt. Über einem Band ist die Liste `isOver`, und
das Band zeichnet seine Linie. Die Bänder nehmen den Zeiger nur an, solange etwas gezogen wird
(`html[data-dnd-dragging]`), sie stehen einem Klick also nie im Weg:

```vue [NewRowZone.vue]
<script setup lang="ts">
const NONE: readonly Field[] = [];
const { isOver, isAccepting } = makeSortableList(el, {
  id: newRowList(props.before), // 'new:<row id>', or 'new:end'
  items: () => NONE,
  group: 'fields',
  placeholder: 'indicator',
  // A band across the page: up and down are the keys that cross it, to the next list.
  strategy: 'horizontal',
  onDrop: form.drop,
});
</script>

<template>
  <div
    ref="el"
    class="pointer-events-none absolute inset-x-0 -top-[18px] z-10 h-6 in-data-[dnd-dragging]:pointer-events-auto"
  >
    <span class="… bg-primary" :class="isOver ? 'opacity-100' : 'opacity-0'" />
  </div>
</template>
```

Auch die Tastatur findet die Bänder. Ein Drag per Tastatur geht von Liste zu Liste nach ihren
Plätzen auf der Seite, mit den Pfeilen quer zu einer Liste: hoch und runter für die Zeilen, die
horizontal sind, und für die Bänder, ebenfalls horizontal. Also besuchen <kbd value="ArrowUp">



</kbd>

 und
<kbd value="ArrowDown">



</kbd>

 abwechselnd die Zeilen und die Lücken dazwischen.

## Ein Store, ein Undo: Listen, die nie schreiben

Jede Liste des Builders bekommt ihre Elemente aus einem Getter, die Bibliothek schreibt sie also
nie (eine [kontrollierte Liste](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists)). Ihr `onDrop` ist
`form.drop`: Es bricht das Schreiben ab und gibt `event.result`, die neuen Arrays jeder Liste, die
der Drop ändert, an das Formular. Die IDs der Listen sagen, was jedes Array ist: die Felder einer
Zeile, die Reihenfolge der Zeilen oder eine Zeile, die angelegt werden soll.

```ts [form.ts]
function apply(result: ReadonlyMap<Key, unknown[]>) {
  commit(() => {
    const created: [before: string, fields: Field[]][] = [];
    for (const [list, items] of result) {
      const [type, id] = String(list).split(':') as [string, string];
      if (list === ROWS) state.rows = items as Row[];
      else if (type === 'row') state.rows.find((row) => row.id === id)!.fields = items as Field[];
      else if (type === 'new' && items.length) created.push([id, items as Field[]]);
    }
    for (const [before, items] of created) {
      const index = state.rows.findIndex((row) => row.id === before);
      state.rows.splice(index < 0 ? state.rows.length : index, 0, row(...items));
    }
  });
}

/** `onDrop` of every list: applies the drop, and selects a field that was just added. */
function drop(event: SortableDropEvent<unknown>) {
  event.preventDefault();
  apply(event.result);
  if (event.mode === 'copy') selectedId.value = (event.items[0] as Field).id;
  forgetGone();
}
```

`commit` sichert einen Schnappschuss des Formulars für Undo, nimmt die Änderung vor und entfernt
die Zeilen, die ein Verschieben leer zurückgelassen hat, alles bevor der Drop landet, sodass das
Overlay dorthin fliegt, wo das Feld wirklich ist. Der Papierkorb nimmt denselben Weg:
`event.source.remove()` führt das `onDrop` der Zeile mit dem herausgenommenen Feld aus (`to.index`
ist `-1`). Tippen in den Einstellungen geht ebenfalls durch `commit`, und Tastenanschläge in einer
Einstellung teilen sich einen Schlüssel: Eine Buchstabe für Buchstabe getippte Beschriftung ist ein
einziger Schritt von Undo.

## Das Feld in der Hand

Die Palette und die Zeilen teilen sich eine Overlay-Komponente. Sie zeigt die Kopie der
Bibliothek von dem, was gezogen wird (`DragPreview`: ein Chip aus der Palette, das ganze Feld aus
dem Formular, sein Nuxt-UI-Bedienelement eingeschlossen), in einem Rahmen, mit einem Badge für
das, was ein Drop tun würde: kopieren (<kbd value="Alt">



</kbd>

), löschen über dem Papierkorb, nichts über
einer vollen Zeile.

```vue [FieldOverlay.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();

const entry = computed(() => props.items[0]!);
const state = computed(() => {
  if (props.status === 'dropping') return 'landing';
  if (props.over?.id === TRASH) return 'delete';
  // A row that refuses the field: it is full.
  if (props.over && !props.accepted) return 'full';
  // Palette fields are copies too, but they say nothing: adding is what they do.
  if (props.mode === 'copy' && !entry.value.type.includes('new-field')) return 'copy';
  return 'move';
});
</script>

<template>
  <!-- LOOKS: lifted and tilted, red when refused, smaller over the trash, flat as it lands. -->
  <div class="relative size-full rounded-md bg-default ring-2 …" :class="LOOKS[state]">
    <DragPreview :id="entry.id" class="rounded-md" :style="{ width: '100%', height: '100%' }" />
    <UBadge v-if="badge" :label="badge.label" :icon="badge.icon" :color="badge.color" size="sm" />
  </div>
</template>
```

Die Elemente der Palette haben einen eigenen `type`, `'new-field'`: Das Overlay unterscheidet sie
daran, und der Papierkorb, der `'fields'` annimmt, nimmt sie nicht.

## Mit Nuxt UI

Die Dokumentation ist eine Nuxt-App mit dem Modul `@nuxt/ui`, und der Komponenten-Auto-Import von
Nuxt reicht auch in die Beispiele: Diese Dateien verwenden `<UInput>`, `<UFormField>` oder
`<UTabs>`, ohne sie zu importieren, wie es ein Nuxt-UI-Projekt tut. Eine Vue-App mit dem
Vite-Plugin von Nuxt UI importiert sie genauso automatisch; ohne es importiere jede einzeln:
`import UButton from '@nuxt/ui/components/Button.vue'`. Die Typen kommen aus `@nuxt/ui`
(`import type { FormSubmitEvent } from '@nuxt/ui'`).

- **Während du baust, sind Felder Bilder.** `FieldView.vue` rendert ein Feld auf der Leinwand und
in der Vorschau gleich: ein `UFormField` um sein Bedienelement. Auf der Leinwand sitzt es in
einem `inert`-Element, ein Drücken auf ein Eingabefeld startet also einen Drag statt zu tippen,
und <kbd value="Tab">



</kbd>

 überspringt die Eingabefelder. Die Werkzeugleiste der Karte (eine
`UFieldGroup` aus Buttons mit Tooltips) bleibt mit `data-dnd-no-clone` aus der Kopie des
Overlays heraus.
- **Zustände sind Tailwind-Varianten.** Die Bibliothek markiert ihre Zustände mit Attributen, die
Tailwind als Varianten liest: `data-[dnd-placeholder]:outline-dashed` am Feld, das verschoben
wird, `in-data-[dnd-overlay]:bg-default` an einer Zeile in der Hand,
`in-data-[dnd-dragging]:pointer-events-auto` an den Bändern. Die Farben sind die semantischen von
Nuxt UI (`bg-default`, `ring-primary`, `text-error`): Heller und dunkler Modus brauchen nichts
weiter.
- **Die Vorschau ist ein echtes UForm.** `schema.ts` erzeugt aus den Feldern ein Zod-Schema, und
`UForm` validiert die Antworten damit: `name` verbindet jedes `UFormField` mit seiner Regel, und
die Meldungen erscheinen unter den Feldern. Sende das Formular ab, um zu sehen, was es übermittelt.
- **Der Export** schreibt dasselbe Formular als eigene Komponente: Nuxt-UI-Bedienelemente, ein
Zod-Schema, ein `reactive`-Zustand und die Zeilen als Raster, die sich auf Handys stapeln.
- **Das Layout folgt der Breite des Builders** (`useElementSize`), nicht der des Fensters: drei
Panels im Vollbild; auf der Seite nehmen die Einstellungen den Platz der Palette ein; schmaler
wird die Palette zu einem Streifen aus Chips über dem Formular und die Einstellungen zu einem
Blatt darüber. Container Queries (`@lg:`) erledigen den Rest.

<note>

Der StackBlitz-Button öffnet die Dateien in einem einfachen Vite-Projekt, das kein Nuxt UI hat. Um
dieses Beispiel auszuführen, kopiere den Ordner in eine Nuxt-App mit dem Modul `@nuxt/ui` und
`zod` und rendere `index.vue` auf einer Seite.

</note>

## Tastatur und Screenreader

Springe mit Tab zu einem Feld und drücke <kbd value="Space">



</kbd>

, um es aufzunehmen.
<kbd value="ArrowLeft">



</kbd>

 und <kbd value="ArrowRight">



</kbd>

 bewegen es entlang seiner Zeile,
<kbd value="ArrowUp">



</kbd>

 und <kbd value="ArrowDown">



</kbd>

 zu den anderen Zeilen und zu den Lücken
dazwischen (eine neue Zeile), <kbd value="Space">



</kbd>

 legt es ab, <kbd value="Escape">



</kbd>

 stellt es
zurück. Der Provider nimmt für Drags nur Space (`keyboard: { keys: { start: ['Space'], drop: ['Space'] } }`), was <kbd value="Enter">



</kbd>

 frei lässt, um die Einstellungen eines Feldes zu öffnen.
<kbd value="Delete">



</kbd>

 entfernt ein Feld, <kbd value="Ctrl">



</kbd>

 <kbd value="D">



</kbd>

 dupliziert es,
<kbd value="Ctrl">



</kbd>

 <kbd value="Z">



</kbd>

 macht rückgängig.

Die `announcements` des Providers sprechen die Worte des Builders: „Work email: row 2, column 2 of
2“, „New date field: a new row above row 3“. `form.describe` macht aus der Position, die die
Bibliothek liefert (eine Listen-ID und ein Index), diese Worte.

Mehr dazu: [Listen mit gemeinsamen Elementen](https://zizigy.github.io/docs/guides/shared-lists) ·
[Eine Einfügelinie](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line) ·
[Das Overlay](https://zizigy.github.io/docs/guides/overlay) ·
[Styling: Tailwind und UI-Kits](https://zizigy.github.io/docs/guides/styling#tailwind-css) ·
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
