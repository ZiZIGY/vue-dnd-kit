---
title: "Das Overlay"
description: "Was dem Zeiger beim Ziehen folgt – der Standard-Klon und wie du ihn stylst, Overlay-Komponenten, die sich beim Ziehen ändern, mehrere Elemente auf einmal, seine Größe und wo es gerendert wird."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/overlay"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Während du ziehst, folgt eine Box dem Zeiger: das **Overlay**. Das gezogene Element selbst
bleibt, wo es war, als der Slot, in dem es landen wird. Beim Drop fliegt das Overlay zu diesem
Slot und verschwindet.

Das Overlay wird nach `body` teleportiert, außerhalb deiner Komponenten. Standardmäßig zeigt es
einen Klon des gezogenen Elements.

<example height="22rem" hint="Tippe etwas in eine Zeile, hake sie an und ziehe sie dann an ihrem Griff: Die Kopie behält die Werte und das Diagramm" name="overlay">



</example>

## Der Standard-Klon

Der Klon wird beim Aufnehmen angelegt, bevor sich irgendetwas bewegt. Er ist eine tiefe Kopie des
Elements:

- Formularwerte und die Pixel von `<canvas>` werden kopiert.
- Die berechneten Stile, die das Element außerhalb seiner Liste verlieren würde, werden inline
gesetzt: geerbte Schriften und Farben, Stile, die über Vorfahren greifen (`.list li { … }`),
Breiten von Tabellenzellen. Eine Tabellenzeile kommt in eine eigene Tabelle verpackt.
- `id`s und `data-dnd-*`-Attribute werden entfernt, und der Klon ist `aria-hidden`.
- Ripples und andere Druckeffekte von UI-Kits (Vuetify, Quasar, PrimeVue, Naive UI) werden
weggelassen.

In der Tabelle oben reist eine Zeile, in die du etwas getippt hast, mit ihrem Text, ihrem Betrag,
ihrem Haken und ihrem Diagramm mit, in einer eigenen Tabelle, deren Zellen die Breiten der echten
behalten.

Markiere alles andere, was nicht mitreisen soll, mit **data-dnd-no-clone**: einen Menü-Button,
einen Tooltip, eine Auswahlmarkierung. Der Entfernen-Button jeder Zeile bleibt zurück:

```vue [ExpenseRow.vue]
<tr ref="el" class="row">
  …
  <td><button type="button" aria-label="Remove" data-dnd-no-clone @click="emit('remove')">×</button></td>
</tr>
```

### Hintergründe werden nicht erraten

Der Klon zeigt das Element, wie es ist. Eine Zeile, die keinen eigenen Hintergrund hat, weil ihre
Liste ihn malt (ein `<li>` in einem weißen `<ul>`, ein `v-list-item`, eine Tabellenzeile), ergibt
einen **durchsichtigen** Klon. Gib ihr in CSS den Hintergrund der Liste, hier an den Zellen:

```vue [ExpenseRow.vue]
<style scoped>
[data-dnd-overlay] .row td {
  background: color-mix(in srgb, currentColor 4%, Canvas);
}
</style>
```

Der Klon behält die Klassen und Attribute des Elements, Vues Scope-Attribut eingeschlossen, die
Regel funktioniert also im scoped Style der Zeile genauso wie in einem globalen Stylesheet. Der
andere Ausweg ist ein Hintergrund an der Zeile selbst. Icons und Kacheln, die schweben sollen,
bleiben absichtlich transparent.

## Die Box stylen

Die Box ist das Element mit `data-dnd-overlay`. Sie ist `position: fixed`, ganz oben
(`z-index: 9999`), `pointer-events: none` und `inert`, und ihr Wert sagt, was sie gerade tut:

<table>
<thead>
  <tr>
    <th>
      <code>
        data-dnd-overlay
      </code>
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
        "dragging"
      </code>
    </td>
    
    <td>
      Sie folgt dem Zeiger.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        "dropping"
      </code>
    </td>
    
    <td>
      Sie landet auf ihrem Slot, fliegt zurück oder wartet auf ein asynchrones <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Ein angehobener Look beim Ziehen, der beim Landen verschwindet:

```css
[data-dnd-overlay='dragging'] .row td {
  box-shadow: 0 14px 20px -16px rgb(0 0 0 / 0.7);
}
```

Die Box bewegt sich mit `transform` und bekommt ihre Größe als `width` und `height`: Style, was in
ihr ist, nicht die Box. Der Klon füllt sie aus, mit `width: 100%`, `height: 100%` und
`transform: none` an seiner Wurzel: Dreh oder vergrößere ihn mit den Eigenschaften `rotate` und `scale`, die
Transitions und Keyframes beide animieren. Rezepte unter [Animationen](https://zizigy.github.io/docs/guides/animations).

## Overlay-Komponenten

Um etwas anderes als den Klon zu zeigen, übergib eine Komponente. Sie rendert in der Box und
bekommt den Drag als Props, die sich beim Ziehen ändern: wo der Drag ist, ob dieser Ort ihn
annimmt, ob der Drop kopiert, und den Drop selbst.

<example height="26.5rem" hint="Ziehe ein Ticket über die Spalten: Done nimmt freigegebene an und stempelt sie; halte Alt zum Kopieren" name="overlay-live">



</example>

```vue [TicketOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem, DragMode, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();
const ticket = computed(() => props.items[0]?.item as Ticket);

const state = computed(() => {
  if (props.status === 'dropping') return props.over ? 'landed' : 'back'; // a cancel flies back
  if (!props.over) return 'free';
  return props.accepted ? 'ok' : 'refused';
});
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="ticket-overlay" :data-state="state">
    {{ ticket.title }}
    <span v-if="mode === 'copy'" class="copy">+ copy</span>
  </div>
</template>

<style scoped>
.ticket-overlay { width: 100%; height: 100%; }
.ticket-overlay[data-state='refused'] { background: color-mix(in srgb, #ef4444 8%, Canvas); }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Was sie enthält
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      Der Drag (<code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , …).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        items
      </code>
    </td>
    
    <td>
      Jedes gezogene Element, das gegriffene zuerst: <code>
        { id, item, data, type }
      </code>
      
      . <code>
        item
      </code>
      
       ist bei sortierbaren Drags das Listenelement.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Das Ziel unter dem Drag; während ein Drop landet, das Ziel, auf dem er landet. <code>
        null
      </code>
      
       über nichts und während ein abgelehnter oder abgebrochener Drag zurückfliegt. Das <code>
        over.id
      </code>
      
       einer sortierbaren Liste ist die <code>
        id
      </code>
      
       der Liste: Die Spalten oben nutzen ihre Namen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accepted
      </code>
    </td>
    
    <td>
      Ob <code>
        over
      </code>
      
       den Drag annimmt: Färbe das Overlay rot, wenn nicht.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'dragging'
      </code>
      
      , dann <code>
        'dropping'
      </code>
      
      , während es landet.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        mode
      </code>
    </td>
    
    <td>
      <code>
        'move'
      </code>
      
      , <code>
        'copy'
      </code>
      
       (Alt gehalten bei einem Drag aus einer Liste mit <code>
        clone
      </code>
      
       oder ein Drag aus einer Palette), <code>
        'swap'
      </code>
      
       oder <code>
        'insert'
      </code>
      
       (ein einfaches ziehbares Element, das in eine Liste kommt).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        to
      </code>
    </td>
    
    <td>
      Wohin ein Drop die Elemente jetzt legen würde: <code>
        { list, index }
      </code>
      
      , in einem Baum auch <code>
        parentKey
      </code>
      
       und <code>
        depth
      </code>
      
      . <code>
        null
      </code>
      
      , wenn er sie in keine Liste legen würde, z. B. über einem einfachen Ziel. Siehe <a href="#where-the-drop-would-go-to">
        Wohin der Drop ginge
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Die Props sind `OverlayProps`; deklariere nur die, die du liest. Übergib die Komponente an das,
was gezogen wird:

```ts
import TicketOverlay from './TicketOverlay.vue';

makeSortableList(listRef, { items: tickets, overlay: TicketOverlay });   // every item of the list
makeSortableItem(el, { item: () => props.ticket, overlay: TicketOverlay }); // this item
makeDraggable(el, { id: 'chip', overlay: TicketOverlay });                // a plain draggable
```

Eine Komponente kann direkt übergeben werden, in einem `shallowRef`, um sie umzuschalten (auch
mitten im Drag: Das Overlay wechselt sofort), oder als Funktion, die Vue als funktionale
Komponente nimmt: `overlay: (props) => <TicketOverlay {...props} compact />` in TSX. Leg sie nie
in ein tiefes `ref` oder `reactive`: Vue würde die Komponente reaktiv machen und warnen.

Die Wurzel einer Overlay-Komponente sollte die Box ausfüllen (`width: 100%; height: 100%`): Die
Box nimmt die Größe des Slots an und animiert sie beim Drop. Eine feste Größe an der Wurzel
behält stattdessen diese Größe innerhalb der Box.

## Der `#overlay`-Slot des Providers

Für jeden Drag ohne eigene Komponente rendert der Slot des Providers das Overlay. Definiere ihn
einmal, neben der Wurzel deiner App, und jede Liste und jedes ziehbare Element der App bekommt
ihn. Hier bekommen Notizen einen eigenen Geist, und Fotos fallen auf den Klon zurück:

<example height="26rem" hint="Ziehe eine Notiz, dann ein Foto" name="overlay-slot">



</example>

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, status }">
    <NoteGhost v-if="items[0]?.type.includes('note')" :items="items" :status="status" />
  </template>
</DnDProvider>
```

Der Slot bekommt dieselben Props wie eine Overlay-Komponente. Wenn er nichts rendert (das `v-if`
oben), fällt der Drag auf den Klon zurück. Unterscheide Drags anhand von `type`: Der Typ eines
sortierbaren Elements ist der Name seiner Gruppe, sofern es nicht seinen eigenen setzt
(`makeSortableItem(el, { type })`).

## Ziele, die das Overlay ändern

Ein Drop-Ziel kann bestimmen, was das Overlay zeigt, während ein Drag, den es annimmt, über ihm
ist. `makeDroppable` nimmt ein `overlay`; Listen und Bäume nehmen ein `overOverlay`, denn ihr
`overlay` ist für ihre eigenen Elemente da. Über einem Ordner wird der Chip der gezogenen
Nachrichten zu dem, was der Drop tun wird:

<example height="34rem" hint="Hake zwei Nachrichten an, ziehe eine über Archive und lass los" name="overlay-folders">



</example>

```ts [Folder.vue]
makeDroppable(el, {
  id: () => props.folder.id,
  data: () => props.folder,
  overlay: MovePill,
  onDrop: (event) => emit('move', event.active.ids),
});
```

Die Komponente des Ziels bekommt dieselben Props wie jede Overlay-Komponente, darunter `over`, und
das eigene Overlay des Drags (seine Komponente, den Slot des Providers oder den Klon) als ihren
Standard-Slot. `MovePill` lässt den Slot weg und ersetzt so den Chip:

```vue [MovePill.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();
// The folder under the drag: its `data`.
const folder = computed(() => props.over?.data as Folder | undefined);
</script>

<template>
  <!-- Fills the box like any overlay component. -->
  <div class="pill-box">
    <span v-if="folder" class="pill">Move {{ items.length }} to {{ folder.name }}</span>
  </div>
</template>
```

Rendere `<slot />`, um das eigene Overlay des Drags zu behalten und einzuhüllen. Das tut Done im
Board der [Overlay-Komponenten](#overlay-components) oben: Über Done behält ein freigegebenes
Ticket sein eigenes Overlay, Done stempelt es, und ein Ticket aus einer anderen Spalte bekommt
Konfetti, wenn es abgelegt wird.

```ts [Column.vue]
makeSortableList(listRef, {
  items: tickets,
  group: { name: 'release', put },
  overlay: TicketOverlay, // the tickets' own, in every column
  overOverlay: strict ? DoneOverlay : undefined, // Done's, around it
});
```

```vue [DoneOverlay.vue]
<template>
  <div class="done">
    <slot /> <!-- TicketOverlay -->
    <span class="stamp">Shipped</span>
    <span v-if="status === 'dropping' && arrives" class="confetti">…</span>
  </div>
</template>
```

- Sie erscheint nur, solange das Ziel den Drag annimmt, und bleibt, während der Drop darauf
landet. Verlässt der Drag das Ziel, kommt sein eigenes Overlay zurück.
- Der Wechsel wird überblendet. Die `overlayTransition` des Providers legt fest, wie: `false`
tauscht sofort, ein Objekt sind die Props einer `<Transition>` um den Inhalt (`name`, `mode`,
JS-Hooks für GSAP oder motion). Ohne `mode: 'out-in'` sind beide kurz zu sehen: Gib der
ausgehenden `position: absolute` in `.<name>-leave-active`.
- Der Drop wartet auf das Konfetti: CSS-Animationen und -Transitions, die im Overlay laufen,
während es landet, spielen bis zu ihrem Ende, höchstens zwei Sekunden lang.
- Ein Drag mit `overlay: false` hat über keinem Ziel ein Overlay.

Die Ordner lassen die Pille außerdem auf ihre eigene Art landen, in das Symbol des Ordners: Auch
ein Ziel kann eine `dropAnimation` haben. Siehe
[Animationen](https://zizigy.github.io/docs/guides/animations#per-item-and-per-target).

## Wohin der Drop ginge: `to`

`to` sagt einem Overlay, wohin ein Drop die Elemente jetzt legen würde, so wie es das `to` des
Drop-Events tun wird: die Liste und den Index darin, in einem Baum den Elternknoten und die Tiefe.
Es ändert sich, während der Slot wandert. Eine Seite dieses Website-Menüs sagt, in welchen
Abschnitt sie käme und in welche Zeile:

<example height="27rem" hint="Ziehe eine Seite über die Abschnitte, dann seitwärts, um ihre Tiefe zu ändern" name="overlay-move-path">



</example>

```vue [MoveOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, DropDestination } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; to: DropDestination | null }>();
const page = computed(() => props.items[0]!.item as MenuNode);
// `parentKey` is the section the page would go into, `null` at the top level.
const where = computed(() => (props.to ? pathOf(menu.value, props.to.parentKey) : null));
</script>

<template>
  <div class="move">
    <div class="row">{{ page.title }}</div>
    <p v-if="to && where" class="where">Move to <b>{{ where }}</b>, row {{ to.index + 1 }}</p>
  </div>
</template>
```

Außerhalb aller Ziele ist `to` weiterhin der Platz des Slots: Standardmäßig lässt ein Drop dort
die Elemente, wo der Slot ist (`dropOutside: 'placeholder'`). Es ist `null`, wenn der Drop sie in
keine Liste legen würde: über einem einfachen Ziel, über einer Liste, die sie ablehnt, außerhalb
mit `dropOutside: 'cancel'` oder `'remove'`.

## Was gewinnt

Für jeden Drag das Erste, was zutrifft:

1. Das `overlay` des Drop-Ziels (das `overOverlay` einer Liste oder eines Baums), solange der Drag
darüber ist und es ihn annimmt. Was sonst zu sehen wäre, ist sein Standard-Slot.
2. Das eigene `overlay` des Elements (`makeSortableItem`, `makeDraggable`).
3. Das `overlay` seiner Liste oder seines Baums.
4. Der `#overlay`-Slot des Providers, sofern er etwas rendert.
5. Der Standard-Klon. Bei einem Multi-Drag eine Spalte oder ein Stapel aus Klonen: siehe
[Multi-Drag und Auswahl](https://zizigy.github.io/docs/guides/multi-drag#the-default-overlay).

Ob ein Drag überhaupt ein Overlay hat (`overlay: false`), wird beim Start entschieden. Welche
Komponente zu sehen ist, wird live gelesen: Ein mitten im Drag umgeschaltetes Ref tauscht sie, und
ebenso das Betreten oder Verlassen eines Ziels mit eigenem Overlay.

## `DragPreview`: der Klon in deinem Layout

`DragPreview` rendert den Klon der Bibliothek von einem gezogenen Element. Eine
Overlay-Komponente kann mehrere davon anordnen oder einen Rahmen um einen legen. Klicke Bücher an,
um sie auszuwählen, und ziehe dann eines: Das Overlay fächert die echten Klone auf.

<example height="24rem" hint="Ziehe eines der drei ausgewählten Bücher; klicke Bücher an, um andere auszuwählen" name="overlay-fan">



</example>

```vue [FanOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[] }>();
const fan = computed(() =>
  props.items.slice(0, 4).map((entry, index) => ({
    entry,
    angle: index === 0 ? 0 : (index % 2 ? -1 : 1) * Math.ceil(index / 2) * 10,
  })),
);
</script>

<template>
  <div class="fan">
    <div v-for="{ entry, angle } in fan" :key="entry.id" class="card" :style="{ transform: `rotate(${angle}deg)` }">
      <DragPreview :id="entry.id" class="face" :style="{ width: '100%', height: '100%' }">
        <div class="blank" /> <!-- an item without a clone -->
      </DragPreview>
    </div>
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>
```

- Klone gibt es für das gegriffene Element und die anderen daneben in Drop-Reihenfolge, so viele
wie `overlayPreviews` des Providers (standardmäßig 5, `'all'` für alle), sofern sie beim
Aufnehmen gerendert sind. Für jedes andere Element rendert `DragPreview` seinen
Standard-Slot.
- Eine Vorschau hat die Größe ihres Elements beim Aufnehmen, inline gesetzt. Bestimme ihre Größe
mit `style`, das durchgereicht wird (eine Klasse kann es nicht überschreiben), wie oben.
- Bei einem sortierbaren Multi-Drag (`multiple: 'group'` oder `'gaps'`) landet jede Vorschau beim
Drop auf dem Slot ihres eigenen Elements. Dreh ihre Wrapper mit `transform` (nicht mit der
Eigenschaft `rotate`): Das Landen macht es unterwegs rückgängig. Leg den Look des Elements
(Ecken, Schatten) auf die Vorschau selbst, wie es `class="face"` tut: Die Wrapper bleiben in
der Box.

Der [Multi-Drag-Leitfaden](https://zizigy.github.io/docs/guides/multi-drag#a-custom-overlay-for-several-items) hat ein
Overlay, das statt der Klone eine Anzahl und die Titel zeigt.

## Größe: `overlayFit`

Über einer Liste anderer Größe nimmt die Box die Größe des Slots an, in dem sie landen wird.
`overlayFit` des Providers schaltet das um; die [DnDProvider-Seite](https://zizigy.github.io/docs/api/dnd-provider) hat
eine Demo mit einer schmalen und einer breiten Liste.

<table>
<thead>
  <tr>
    <th>
      <code>
        overlayFit
      </code>
      
       (Provider)
    </th>
    
    <th>
      Die Box
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'slot'
      </code>
      
       (Standard)
    </td>
    
    <td>
      Nimmt die Größe des Slots an, in dem sie landen wird, und gleitet dorthin. Über der breiten Liste wird sie breiter.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'source'
      </code>
    </td>
    
    <td>
      Behält die Größe des gezogenen Elements.
    </td>
  </tr>
</tbody>
</table>

Mit `'slot'` ändert die Box ihre Größe um den Zeiger herum, der beim selben Anteil der Box bleibt.
Der Inhalt wird nie skaliert: Er wird in der neuen Größe neu angeordnet, also sieht eine
Flex-Zeile wie die Aufgaben dieser Demo in jeder Breite richtig aus. Ein Slot, der viel kleiner als das
Element gestylt ist, etwa eine dünne Linie, lässt die Box entlang dieser Achse nicht schrumpfen.

Ein Drop macht mit beiden Einstellungen dasselbe: Die Box fliegt zum Element, auf dem sie landet,
und animiert zu **dessen** Größe, und der Inhalt ordnet sich unterwegs neu an. Wenn ein Element in
zwei Listen unterschiedlich aussieht (ein kompakter Chip in einer Palette, eine volle Karte auf
einem Board), ordnet sich der Klon der Quelle in der Größe des Ziels neu an und kann dort
gequetscht oder gestreckt aussehen. Zwei Wege, es richtig zu halten:

- Gib dem Element ein **Layout, das in beiden Größen funktioniert**, wie es die Aufgabenzeilen
tun, oder dieselbe Größe in jeder Liste, in der es landen kann.
- Rendere den **Look des Ziels** in einer Overlay-Komponente. Sie bekommt `over`, kann also auf
den Look der Liste umschalten, über der sie ist, und füllt die Box in jeder Größe.

## Wo es gerendert wird: `overlayTo`

Der Provider teleportiert das Overlay nach `body`. Ein modales `<dialog>` (mit `showModal()`
geöffnet) liegt im Top Layer, über allem in `body`, ein Overlay dort wäre also darunter verborgen.
Richte `overlayTo` auf einen Selektor oder ein Element im Dialog. Die
[DnDProvider-Seite](https://zizigy.github.io/docs/api/dnd-provider#where-the-overlay-renders) hat einen Dialog, um es mit
und ohne auszuprobieren:

```vue [index.vue]
<script setup lang="ts">
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const open = ref(false);
// While the dialog is open, the overlay renders inside it.
const overlayTo = computed(() => (open.value ? '#columns-dialog' : 'body'));

const show = () => {
  dialog.value?.showModal();
  open.value = true;
};
</script>

<template>
  <DnDProvider :overlay-to="overlayTo">
    <button type="button" @click="show">Edit columns</button>
    <dialog id="columns-dialog" ref="dialog" @close="open = false">
      <ColumnList v-model:columns="columns" />
    </dialog>
  </DnDProvider>
</template>
```

- Das Ziel muss in der Seite sein, wenn der Provider das Overlay rendert, nachdem er gemountet
ist. Ein geschlossenes `<dialog>` ist es: Es ist nur verborgen. Schalte zurück auf `body`,
solange es geschlossen ist, damit das Overlay anderer Drags sichtbar ist.
- Die Box ist `position: fixed`. Ein `transform`, `filter` oder `contain` am Ziel oder an seinen
Vorfahren macht dieses statt des Viewports zum Bezugsrahmen der Box, halte sie also vom Dialog
fern.
- Die Stile des Klons werden für den Ort berechnet, an dem er gezeigt wird: Richte in einem
Shadow Root `overlayTo` darauf, und der Klon behält die Stile des Shadow Roots.

## Kein Overlay

`makeDraggable(el, { overlay: false })` hat gar keine Box: Das Element selbst bewegt sich, über
das zurückgegebene `transform`.

```ts
const { transform } = makeDraggable(el, { overlay: false });
const style = computed(() =>
  transform.value ? { translate: `${transform.value.x}px ${transform.value.y}px` } : undefined,
);
```

Siehe [Drag and Drop](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay). Wie ein Drag mit Box landet,
bestimmt seine `dropAnimation`: die des Drop-Ziels, die des Elements (oder seiner Liste) oder die
des Providers. Siehe [Animationen](https://zizigy.github.io/docs/guides/animations#the-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
