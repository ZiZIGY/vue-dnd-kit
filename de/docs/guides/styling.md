---
title: "Styling"
description: "Jeder Zustand eines Drags, gestylt – Data-Attribute für reines CSS, Refs für Klassen, Ziele, die Ja oder Nein sagen, das Overlay und die Seite während des Ziehens, die Standard-Styles, Tailwind und UI-Kits."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/styling"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Die Bibliothek stylt fast nichts. Jeder Zustand eines Drags erreicht dich auf zwei Wegen: als
`data-dnd-*`-Attribut für reines CSS und als Ref, das das Composable zurückgibt, für Klassen und
bedingtes Markup. Nimm, was zu deinem Stack passt, oder beides.

## Die Data-Attribute

Die Zeilen unten haben überhaupt keine Zustandsklassen: Jedes Aussehen kommt von einem Attribut.
Das Panel listet die Attribute auf der Seite, während sie kommen und gehen. Wähle zwei Zeilen mit
<kbd value="Ctrl">



</kbd>

 oder <kbd value="Meta">



</kbd>

 aus und ziehe sie: Die übrigen Elemente eines
Multi-Drags tauchen dann auch auf.

<example height="25rem" hint="Ziehe eine Zeile, dann klicke zwei mit Strg/⌘ an und ziehe sie" name="dnd-attributes">



</example>

<table>
<thead>
  <tr>
    <th>
      Attribut
    </th>
    
    <th>
      Auf
    </th>
    
    <th>
      Wann
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        data-dnd-placeholder
      </code>
    </td>
    
    <td>
      einem sortierbaren Element
    </td>
    
    <td>
      Es ist der Slot, in dem ein gezogenes Element landen wird. <code>
        "into"
      </code>
      
      , solange der Drag über einem <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        Drop-Ziel in einem Element
      </a>
      
       ist: Der Drop geht dorthin, und der Slot hält nur seinen Platz.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging
      </code>
    </td>
    
    <td>
      einem sortierbaren Element
    </td>
    
    <td>
      Es wird gezogen, bleibt aber an seinem Platz: die übrigen Elemente eines Multi-Drags im Modus <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging="pointer"
      </code>
      
       oder <code>
        "keyboard"
      </code>
    </td>
    
    <td>
      <code>
        <html>
      </code>
    </td>
    
    <td>
      Während des ganzen Drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay="dragging"
      </code>
      
       oder <code>
        "dropping"
      </code>
    </td>
    
    <td>
      der Overlay-Box
    </td>
    
    <td>
      Immer. <code>
        dropping
      </code>
      
      , während sie landet und während ein asynchrones <code>
        onBeforeDrop
      </code>
      
       wartet.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay-content
      </code>
    </td>
    
    <td>
      dem Inhalt des Overlays
    </td>
    
    <td>
      Immer: das Element, das die Box ausfüllt und hält, was sie zeigt. Du animierst es; es bekommt das <code>
        overlayClass
      </code>
      
       des Providers.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-leaving
      </code>
    </td>
    
    <td>
      einer Kopie, die <code>
        animate
      </code>
      
       hinterlässt
    </td>
    
    <td>
      Während ein entferntes Element ausgeblendet wird.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-no-clone
      </code>
    </td>
    
    <td>
      <strong>
        von dir gesetzt
      </strong>
    </td>
    
    <td>
      Lässt das Element in der Kopie des Overlays weg: einen Tooltip, ein Menü, ein Badge.
    </td>
  </tr>
</tbody>
</table>

```css [TaskRow.vue]
/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
}

/* The copy in the overlay, while it travels. */
[data-dnd-overlay='dragging'] .row {
  box-shadow: 0 0 0 1.5px #42b883, 0 14px 24px -10px rgb(0 0 0 / 0.55);
}
```

```vue [TaskRow.vue]
<li ref="el" class="row" :aria-selected="selected">
  <span class="title">{{ task.title }}</span>
  <button type="button" data-dnd-no-clone @click.stop="task.done = !task.done">✓</button>
</li>
```

- Die Kopie einer Zeile im Overlay behält ihre Klassen und Attribute, das Scope-Attribut von Vue
eingeschlossen, deshalb funktioniert `[data-dnd-overlay] .row` im eigenen `<style scoped>` der
Zeile. Die Kopie hat keine eigenen `data-dnd-*`-Markierungen: Die Kopie eines Slots ist kein
Slot.
- Die Auswahl hat kein Attribut. Spiegle das Ref `selected` in eines (`aria-selected` oben) oder
nimm eine Klasse.
- Einfache ziehbare Elemente und Drop-Ziele (`makeDraggable`, `makeDroppable`) bekommen keine
`data-dnd-*`-Zustandsattribute: Style sie über ihre Refs.

## Die zurückgegebenen Refs

Dieselben Zustände als Refs, plus die, die Listen und Ziele haben. Jede Zeile und jede Liste unten
zeigt die Refs an, die gerade wahr sind, und ihre Klassen kommen aus ihnen. Die Icebox lehnt
dringende Aufgaben ab: Ziehe eine darüber.

<example height="24rem" hint="Ziehe eine Aufgabe in die andere Liste; Strg/⌘-Klick wählt mehrere aus" name="dnd-refs">



</example>

```vue [RefRow.vue]
<script setup lang="ts">
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }">…</li>
</template>

<style scoped>
.row.selected { box-shadow: 0 0 0 1.5px #3b82f6; }
.row.placeholder { opacity: 1; box-shadow: inset 0 0 0 1.5px #42b883; }   /* beats the default 40% */
.row.placeholder .title { visibility: hidden; }
</style>
```

```vue [RefList.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(el, { items, group });
</script>

<template>
  <section :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">…</section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Composable
    </th>
    
    <th>
      Zustand
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isPlaceholder
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        index
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        indicator
      </code>
      
      , <code>
        activeKey
      </code>
      
      , <code>
        activeIndex
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
      , <code>
        transform
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      , <code>
        isAccepting
      </code>
      
      , <code>
        placement
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD()
      </code>
    </td>
    
    <td>
      <code>
        status
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        pointer
      </code>
      
      , <code>
        activation.progress
      </code>
      
      , <code>
        isAutoScrolling
      </code>
    </td>
  </tr>
</tbody>
</table>

- `isPlaceholder`: Dieses Element ist der Slot, in dem ein gezogenes Element landen wird. Bei
einem Multi-Drag im Modus `'group'` sind auch die Slots der mitreisenden Elemente Platzhalter.
- `isDragging`: Das Element gehört zum Drag: jedes gezogene Element bei einem Multi-Drag.
- `isAccepting`: Etwas wird gezogen, und dieses Ziel nimmt es an. Lass die Stellen aufleuchten, an
denen ein Drop möglich ist.
- `isOver`: Der Drag ist über diesem Ziel, ob es ihn annimmt oder nicht. `isOver && !isAccepting`
ist eine Ablehnung: Zeig sie.
- `indicator`: wo die Drop-Linie im [Indikator-Modus](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line)
hinkommt.
- `activation.progress`: von 0 bis 1, solange ein langes Drücken per Touch oder ein `delay` läuft.
Füll damit einen Ring.

## Drop-Ziele: Ja und Nein

Ein Ziel hat während eines Drags vier Zustände: Es nimmt den Drag an; es nimmt ihn an, und der
Zeiger ist darauf; es lehnt ihn ab; es lehnt ihn ab, und der Zeiger ist darauf. Zeig alle vier und
sag es auch am gezogenen Element.

<example height="23rem" hint="Ziehe eine Farbe über die Paletten: Die passende lädt sie ein, die anderen nicht" name="drop-highlights">



</example>

```ts [Palette.vue]
const { isOver, isAccepting } = makeDroppable(el, { accept: props.tone, onDrop });

const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
```

```css [Palette.vue]
.palette.accepting { border-style: dashed; border-color: #42b883; }          /* an invitation */
.palette.over { border-color: #42b883; background: color-mix(in srgb, #42b883 14%, Canvas); }
.palette.refusing { opacity: 0.45; }                                          /* out of the way */
.palette.refused { border-color: #f43f5e; animation: shake 0.3s; }            /* a drop here is cancelled */
```

Das gezogene Farbmuster ist der `#overlay`-Slot des Providers. Er bekommt `over` und `accepted`:
`accepted` ist `false` über einem Ziel, das den Drag ablehnt.

```vue [index.vue]
<template #overlay="{ active, over, accepted }">
  <div
    class="lifted"
    :class="{ yes: over && accepted, no: over && !accepted }"
    :style="{ background: (active.data as { color: string }).color }"
  >
    <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
  </div>
</template>
```

Außerhalb des Overlays sagt `useDnD().over.value?.accepted` dasselbe. Mehr zu
Overlay-Komponenten unter [Das Overlay](https://zizigy.github.io/docs/guides/overlay).

## Das Overlay und die Seite

Zwei Attribute decken den Rest eines Drags ab: `data-dnd-overlay` auf der Overlay-Box und
`data-dnd-dragging` auf `<html>`, `"pointer"` oder `"keyboard"`. Die Leiste über den Notizen liest
das zweite und sagt, welche Tasten funktionieren. Schalte das langsame Speichern ein: Das Overlay
bleibt `dropping`, wo du losgelassen hast, bis `onBeforeDrop` aufgelöst ist, und zeigt das an.

<example height="27rem" hint="Ziehe eine Notiz mit der Maus, dann per Tastatur; schalte das langsame Speichern ein" name="overlay-theme">



</example>

```css [index.vue]
.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle { display: none; }

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard { display: inline; }
```

```css [StickyNote.vue]
[data-dnd-overlay='dragging'] .note {
  box-shadow: 0 0 0 2px #42b883, 0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save. */
[data-dnd-overlay='dropping'] .note { opacity: 0.85; }
[data-dnd-overlay='dropping'] .saving { display: flex; }
```

- `dropping` umfasst das Landen und das Warten auf ein asynchrones `onBeforeDrop`. Während es
wartet, ist `<html>` nicht mehr im Drag-Modus: Der Cursor der Seite und die Textauswahl sind
zurück, sodass ein Bestätigungsdialog wie gewohnt funktioniert.
- Style, was **in** der Box ist. Die Box selbst bewegt die Bibliothek mit `transform` und gibt ihr
die Größe mit `width` und `height`. Ihr Inhaltselement, `[data-dnd-overlay-content]`, füllt sie
aus und gehört dir: Hebe und neige dort das ganze Overlay (siehe
[Animationen](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)).
- Die Wurzel der Kopie hat inline `transform: none`: Dreh oder vergrößere sie mit `rotate` und
`scale`. Transitions und Keyframes laufen beide darauf: siehe
[Animationen](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).
- Die Kopie zeigt das Element, wie es ist, und rät keinen Hintergrund. Eine Zeile, die die Liste
malt (ein `<li>` in einem weißen `<ul>`, eine Tabellenzeile), braucht einen:
`[data-dnd-overlay] .row { background: Canvas; }`.
- Die Kopie sitzt in einem `<div>`, das die Custom Properties trägt, die das Element geerbt hat
(Theme-Farben, `--tw-*`), sie gelten im Overlay also weiter, und die eigenen Regeln der Kopie
(`in-data-[dnd-overlay]:ring-2`) schlagen sie weiterhin. Wähle die Kopie über ihre Klasse aus,
nicht über ihre Tiefe in der Box.

## Standard-Styles

Der Provider fügt einmal pro Dokument ein paar Regeln ein. Sie stehen in `:where()`, deshalb ist
ihre Spezifität null, und jede deiner Regeln gewinnt:

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
:where(html[data-dnd-dragging]), :where(html[data-dnd-dragging] *) {
  user-select: none !important;
  overflow-anchor: none !important;
}
:where(html[data-dnd-dragging='pointer']), :where(html[data-dnd-dragging='pointer'] *) {
  cursor: var(--dnd-cursor, grabbing) !important;
  -webkit-touch-callout: none !important;
}
```

<table>
<thead>
  <tr>
    <th>
      Regel
    </th>
    
    <th>
      Warum
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Der Slot bei 40 %
    </td>
    
    <td>
      Damit eine Liste ganz ohne CSS richtig aussieht. Jede Demo oben überschreibt das.
    </td>
  </tr>
  
  <tr>
    <td>
      Zurückgelassene Elemente bei 40 %
    </td>
    
    <td>
      Dasselbe für einen Multi-Drag im Modus <code>
        'gaps'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Kein <code>
        user-select
      </code>
    </td>
    
    <td>
      Ein Drag markiert nicht den Text, über den er fährt.
    </td>
  </tr>
  
  <tr>
    <td>
      Kein <code>
        overflow-anchor
      </code>
    </td>
    
    <td>
      Die Seite scrollt nicht, um eine sich bewegende Zeile im Blick zu behalten.
    </td>
  </tr>
  
  <tr>
    <td>
      Der Cursor des Drags
    </td>
    
    <td>
      Während eines Drags per Zeiger, überall. <code>
        grabbing
      </code>
      
      , außer das gegriffene Element hat einen eigenen Cursor: Das <code>
        ns-resize
      </code>
      
       eines Resize-Handles, ein <code>
        move
      </code>
      
      , ein Bild behalten ihren für den ganzen Drag (<code>
        grab
      </code>
      
      , <code>
        pointer
      </code>
      
       und ähnliche werden trotzdem zu <code>
        grabbing
      </code>
      
      ). <code>
        cursor: grab
      </code>
      
       auf ziehbaren Elementen ergänzt du selbst. Setze <code>
        --dnd-cursor
      </code>
      
       auf <code>
        <html>
      </code>
      
       für einen anderen Standard.
    </td>
  </tr>
  
  <tr>
    <td>
      Kein Touch-Callout
    </td>
    
    <td>
      iOS öffnet bei langem Drücken nicht das Link-Menü.
    </td>
  </tr>
</tbody>
</table>

`:default-styles="false"` auf dem Provider lässt sie weg. Die Bibliothek markiert `<html>`
trotzdem, hebt beim Start eines Drags weiterhin die Textauswahl auf und verhindert bis zu seinem Ende neue: Nur das
CSS ist weg. Die Regeln werden einmal eingefügt, vom ersten Provider, der sie will, und bleiben:
Schalte sie auf jedem Provider der Seite ab.

```vue
<DnDProvider :default-styles="false">
```

## Tailwind CSS

Die Attribute funktionieren als Varianten: `data-[…]` für das Element selbst, eine beliebige
Variante für einen Vorfahren.

```vue [TaskRow.vue]
<li
  ref="el"
  class="rounded-lg bg-white shadow-sm
         data-[dnd-placeholder]:bg-transparent data-[dnd-placeholder]:opacity-100
         data-[dnd-placeholder]:outline-dashed
         [[data-dnd-overlay=dragging]_&]:shadow-xl"
  :class="{ 'ring-2 ring-emerald-500': selected }"
>
```

```vue [Hint.vue]
<p class="hidden [html[data-dnd-dragging=keyboard]_&]:block">Arrows move · Space drops</p>
```

<note>

Das Aussehen der Bibliothek (die Deckkraft von 40 %) liegt in einer eigenen Kaskadenebene,
`vue-dnd-kit`, die vor allen anderen deklariert ist. Die Utilities von Tailwind v4 und die darauf
aufbauenden UI-Kits liegen ebenfalls in Ebenen, und deren Ebenen kommen später, sodass sie ohne
`!` gewinnen. CSS ohne Ebene gewinnt sowieso.

</note>

In Tailwind v4 ist `in-data-[dnd-overlay=dragging]:shadow-xl` eine kürzere Schreibweise für die
Vorfahren-Variante.

<warning>

In Vues scoped CSS nimmt `:global()` den ganzen Selektor: `:global(html[data-dnd-dragging]) .hint`
wird zu `html[data-dnd-dragging]` allein kompiliert und blendet die Seite aus. Schreib den
Vorfahren ohne es, `html[data-dnd-dragging] .hint`: Vue scopet nur den letzten Teil.

</warning>

## UI-Kits

- Die Composables nehmen neben einem Element auch eine Komponente: `useTemplateRef` auf einer
Karte oder einem Listenelement eines Kits funktioniert, und die Bibliothek liest sein
Wurzelelement.
- Gib Zustände an die eigenen Props des Kits weiter, wo es welche hat (`:active="selected"`,
`:color="isOver ? 'primary' : undefined"`), und den Rest als Klassen.
- Die Listenelemente eines Kits haben oft keinen eigenen Hintergrund: Die Liste malt ihn. Ihre
Kopie im Overlay ist dann durchsichtig. Gib ihr einen:```css
[data-dnd-overlay] .v-list-item { background: rgb(var(--v-theme-surface)); }
```
- Die Kopie lässt die Ripple-Effekte beim Drücken von Vuetify, Quasar, PrimeVue und Naive UI weg.
Markiere alles andere, was nicht mitreisen soll, einen Tooltip oder einen Menü-Button, mit
`data-dnd-no-clone`.

## Was du lassen solltest

- Setz kein CSS-`transition` auf `transform` oder `translate` sortierbarer Elemente: Die
Bibliothek animiert sie selbst und bricht solche Transitions ab, während sie misst.
- Umschließe sortierbare Elemente nicht mit `<TransitionGroup>`: Bewegungen würden doppelt
animiert. Nimm `animate` der Liste.
- Animiere nicht `height`, `margin` oder `padding` von Zeilen in einer
[virtuellen Liste](/docs/guides/virtual-lists).
- Schalte dagegen die Transitions, die du rund um Drags ergänzt, bei
`prefers-reduced-motion: reduce` ab. Ihre eigenen schaltet die Bibliothek schon ab.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
