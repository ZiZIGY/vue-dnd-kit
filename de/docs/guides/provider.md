---
title: "Der Provider"
description: "DnDProvider ist für jeden Drag darunter zuständig. Er findet das Ziel, startet Drags, scrollt und teilt useDnD und useDnDMonitor alles mit, was passiert."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Ein Provider für die App

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <RouterView />
  </DnDProvider>
</template>
```

Setze einen `DnDProvider` weit oben ein, in `App.vue` oder einem Layout, und vergiss ihn. Jedes
Composable (`makeSortableList`, `makeDraggable`, `useDnD`…) sucht den nächstgelegenen Provider
oberhalb der Komponente, in der es läuft.

<warning>

Ein Composable muss in einer Komponente laufen, die **im Provider gerendert** wird. Rufst du es
in der Komponente auf, deren eigenes Template `<DnDProvider>` enthält, wird
`No <DnDProvider> found above this component` geworfen: `inject` von Vue sieht nur Vorfahren.

</warning>

## Wofür er zuständig ist

<table>
<thead>
  <tr>
    <th>
      Teil
    </th>
    
    <th>
      Was der Provider tut
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Eingabe
    </td>
    
    <td>
      Macht aus Zeiger-, Touch- und Tastatureingaben Drags (<code>
        sensors
      </code>
      
      , <code>
        activation
      </code>
      
      ), immer nur einen gleichzeitig.
    </td>
  </tr>
  
  <tr>
    <td>
      Das Ziel finden
    </td>
    
    <td>
      Prüft per Hit-Test, welche Drop-Ziele unter dem Drag liegen (<code>
        collision
      </code>
      
      ), und teilt es ihnen mit.
    </td>
  </tr>
  
  <tr>
    <td>
      Das Overlay
    </td>
    
    <td>
      Rendert die Box, die dem Zeiger folgt, teleportiert sie nach <code>
        body
      </code>
      
       und lässt sie beim Drop landen.
    </td>
  </tr>
  
  <tr>
    <td>
      Die Auswahl
    </td>
    
    <td>
      Eine Menge ausgewählter IDs, die alle Listen und ziehbaren Elemente darunter teilen.
    </td>
  </tr>
  
  <tr>
    <td>
      Auto-Scroll
    </td>
    
    <td>
      Scrollt Container und das Fenster, wenn sich ein Drag ihren Rändern nähert.
    </td>
  </tr>
  
  <tr>
    <td>
      Die Live-Region
    </td>
    
    <td>
      Sagt Screenreadern an, wenn etwas aufgenommen, bewegt, abgelegt oder abgebrochen wird.
    </td>
  </tr>
</tbody>
</table>

Sonst rendert er nichts: Dein Markup bleibt, wie es ist.

## Optionen im Überblick

Jede Option hat einen Standardwert, der funktioniert, deshalb braucht der Provider meist keine.
Der Provider liest seine Props dann, wenn er sie braucht: Die Demos unten schalten `collision`,
`activation` und `autoScroll` live um.

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Standard
    </th>
    
    <th>
      Was sie festlegt
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        collision
      </code>
    </td>
    
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      Wie das Ziel unter dem Drag gewählt wird. <a href="#finding-the-target">
        Unten
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      Maus 4 px, Touch 200 ms
    </td>
    
    <td>
      Wann ein Drücken zum Drag wird, je nach Zeigerart. <a href="#when-a-press-becomes-a-drag">
        Unten
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      an
    </td>
    
    <td>
      Scrollen an den Rändern: <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       oder <code>
        false
      </code>
      
      . <a href="#auto-scroll">
        Unten
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        haptics
      </code>
    </td>
    
    <td>
      eine kurze Vibration beim Aufnehmen per Touch
    </td>
    
    <td>
      Vibrationen für Touch-Drags, oder <code>
        false
      </code>
      
      . <a href="#haptics-and-the-copy-key">
        Unten
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        copyModifier
      </code>
    </td>
    
    <td>
      <code>
        'Alt'
      </code>
    </td>
    
    <td>
      Taste, die, während des Ziehens gehalten, aus dem Verschieben ein Kopieren macht.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Bewegungsregeln für jeden Drag: siehe <a href="/docs/guides/constraints">
        Achsen, Grenzen und Raster
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animation
      </code>
      
       / <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      an
    </td>
    
    <td>
      Elemente, die beim Sortieren gleiten / das Landen des Overlays: siehe <a href="/docs/guides/animations">
        Animationen
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      aus
    </td>
    
    <td>
      Standard für Listen und Bäume: Datenänderungen animieren, die kein Drag ausgelöst hat.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Space / Enter, Escape
    </td>
    
    <td>
      Tasten und Schrittweite für die Tastatur; <code>
        false
      </code>
      
       schaltet das Ziehen per Tastatur ab. Siehe <a href="/docs/guides/accessibility#the-keyboard">
        Barrierefreiheit
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sensors
      </code>
    </td>
    
    <td>
      Zeiger + Tastatur
    </td>
    
    <td>
      Was Eingaben zu Drags macht: siehe <a href="/docs/guides/sensors">
        Sensoren
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTo
      </code>
    </td>
    
    <td>
      <code>
        'body'
      </code>
    </td>
    
    <td>
      Wohin das Overlay teleportiert wird.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayFit
      </code>
    </td>
    
    <td>
      <code>
        'slot'
      </code>
    </td>
    
    <td>
      Größe des Overlays: die des Slots, in dem es landen wird, oder die der Quelle. Siehe <a href="/docs/guides/overlay">
        Das Overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTransition
      </code>
    </td>
    
    <td>
      eine Überblendung
    </td>
    
    <td>
      Wie das Overlay während des Ziehens von einer Komponente zur anderen wechselt: <code>
        false
      </code>
      
       oder <code>
        <Transition>
      </code>
      
      -Props. Siehe <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        Ziele, die das Overlay ändern
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayClass
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      Klassen für den Inhalt des Overlays (<code>
        [data-dnd-overlay-content]
      </code>
      
      ), das Element, das als Ganzes animiert wird: ein Anheben beim Aufnehmen, ein Ablegen beim Landen. Siehe <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        Das Overlay: anheben, neigen, ablegen
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayPreviews
      </code>
    </td>
    
    <td>
      <code>
        5
      </code>
    </td>
    
    <td>
      Multi-Drag: wie viele gezogene Elemente beim Aufnehmen einen Klon bekommen, oder <code>
        'all'
      </code>
      
      . Siehe <a href="/docs/guides/multi-drag#the-default-overlay">
        das Standard-Overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        announcements
      </code>
    </td>
    
    <td>
      eingebaut
    </td>
    
    <td>
      Texte für Screenreader, oder <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        screenReaderInstructions
      </code>
    </td>
    
    <td>
      eingebaut
    </td>
    
    <td>
      Der Text, auf den jedes ziehbare Element mit <code>
        aria-describedby
      </code>
      
       verweist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defaultStyles
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      Fügt CSS mit Spezifität null für Drag-Zustände ein: siehe <a href="/docs/guides/styling">
        Styling
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Die vollständige Liste mit allen Formen steht in der [DnDProvider-API](https://zizigy.github.io/docs/api/dnd-provider).
Der Provider emittiert außerdem `drag-start`, `drag-move`, `drag-over`, `drag-end`,
`drag-cancel`, `drag-resume` und `drag-settle`, dieselben Events, die `useDnDMonitor` hört.

## Den Drag lesen: `useDnD()`

<example height="27rem" hint="Ziehe eine Aufgabe und beobachte den Zustand" name="provider-state">



</example>

`useDnD()` liefert den Drag als reaktiven Zustand, in jeder Komponente unter dem Provider:

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      Feld
    </th>
    
    <th>
      Was es enthält
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
       (ein Drücken wartet auf seine Aktivierung), <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       (kein Drag läuft, aber ein Overlay landet noch, oder ein asynchrones <code>
        onBeforeDrop
      </code>
      
       entscheidet), <code>
        'selecting'
      </code>
      
       (ein Auswahlrahmen).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      Was gezogen wird: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
       (jede gezogene ID, die gegriffene zuerst), <code>
        items
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        sensor
      </code>
      
      . <code>
        null
      </code>
      
       im Ruhezustand.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Das Ziel unter dem Drag: <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
       und <code>
        accepted
      </code>
      
      . <code>
        null
      </code>
      
       über nichts.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      Der Zeiger in Viewport-Koordinaten, nach den Modifiern.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.progress
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
       bis <code>
        1
      </code>
      
      , während ein Drücken auf seine Aktivierung wartet: Zeichne damit einen Ring.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      Auto-Scroll bewegt gerade etwas.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      Die Auswahl des Providers: <code>
        ids
      </code>
      
      , <code>
        has
      </code>
      
      , <code>
        add
      </code>
      
      , <code>
        delete
      </code>
      
      , <code>
        toggle
      </code>
      
      , <code>
        set
      </code>
      
      , <code>
        clear
      </code>
      
      . Siehe <a href="/docs/guides/multi-drag">
        Multi-Drag und Auswahl
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Bricht den laufenden Drag ab (die Elemente fliegen zurück), ein Drücken, das sich gerade auflädt, oder einen Auswahlrahmen.
    </td>
  </tr>
</tbody>
</table>

```vue [DropHint.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';

const { status, over } = useDnD();
const refused = computed(() => status.value === 'dragging' && over.value?.accepted === false);
</script>

<template>
  <p v-if="refused" role="status">This list doesn't take that.</p>
</template>
```

Sobald über einen Drop entschieden ist, lesen sich `active`, `over` und `pointer` als `null`,
auch während das Overlay noch landet (`status` ist dann `'dropping'`). Eine UI, die daraus
abgeleitet ist, zeigt nie den alten Drag neben den neuen Daten. Während ein asynchrones
`onBeforeDrop` wartet, bleibt der Zustand so, wie er beim Loslassen war.

Der nächste Drag wartet nicht auf eine Landung: Er startet sofort, und `status` ist
`'dragging'`, während das letzte Overlay um ihn herum landet. Ein Drücken auf ein landendes
Overlay fängt es im Flug: Der Drag geht von dort weiter, wo das Overlay gerade ist.
`onDragSettle` sagt dir, wann das Overlay eines Drags angekommen ist.

## Jeden Drag mithören: `useDnDMonitor()`

```ts
import { useDnDMonitor } from '@vue-dnd-kit/core';

useDnDMonitor({
  onDragStart: ({ active }) => {},
  onDragMove: ({ pointer, delta }) => {},
  onDragOver: ({ over }) => {},                  // the target changed
  onBeforeDrop: (e) => 'accept',                 // or 'reject', 'continue', some ids; may be async
  onDragEnd: ({ active, over, dropped, accepted, position }) => {},
  onDragCancel: ({ active }) => {},
  onDragResume: ({ active }) => {},              // onBeforeDrop answered 'continue'
  onDragSettle: ({ active, over }) => {},        // its overlay has landed
});
```

Ein Monitor hört jeden Drag unter seinem Provider, egal wo er startet: Das Panel oben
protokolliert die Drags der Liste, ohne sie zu importieren. Er hört auf, wenn die Komponente,
die ihn aufgerufen hat, unmountet wird.

<table>
<thead>
  <tr>
    <th>
      Event
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
        onDragStart
      </code>
    </td>
    
    <td>
      Ein Drag startet.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      Der Drag bewegt sich.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      Das Ziel unter dem Drag ändert sich.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Der Drag wird losgelassen. Seine Antwort entscheidet über den Drop: siehe <a href="/docs/guides/drop-decisions">
        Über einen Drop entscheiden
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      Der Drop ist durchgegangen. Sortierbare Listen haben ihr <code>
        onDrop
      </code>
      
       schon ausgeführt und die neue Reihenfolge geschrieben. <code>
        dropped
      </code>
      
       ist <code>
        false
      </code>
      
      , wenn der Drag über keinem Ziel endete.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Escape, ein Drop auf ein Ziel, das ihn ablehnt, oder ein <code>
        onBeforeDrop
      </code>
      
      , das <code>
        'reject'
      </code>
      
       geantwortet hat.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragResume
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       hat <code>
        'continue'
      </code>
      
       geantwortet: Nichts wurde abgelegt, und der Drag geht weiter.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      Das Overlay des Drags ist gelandet (oder zurückgeflogen, oder vom nächsten Drag gefangen worden), mit dem Event, das <code>
        onDragEnd
      </code>
      
       oder <code>
        onDragCancel
      </code>
      
       bekommen hat. Inzwischen können andere Drags gestartet sein.
    </td>
  </tr>
</tbody>
</table>

Jedes Event trägt `active`, `over`, `pointer`, `delta` (der Versatz zum Start),
`position` (wo die gezogene Box in `over` sitzt, siehe
[Drag and Drop](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)) und, für Elemente
aus einer sortierbaren Liste, `source`. Die vollständigen Formen stehen in der
[Events-API](https://zizigy.github.io/docs/api/events).

<note>

`onDragEnd` ist der Ort für Arbeit „nach dem Drop“: Speichern, Auswahl leeren, Analytics. Das
eigene `onDrop` einer Liste läuft **vor** ihrem Schreiben, sieht also noch die alte Reihenfolge.

</note>

## Das Ziel finden

Wähle eine Funktion und ziehe dann die Nadel oder die Karte über die Ziele. Die Badges zeigen,
wie die Funktion sie in diesem Frame einordnet; das grüne ist das Ziel.

<example height="33rem" hint="Wechsle die Funktion und ziehe über die verschachtelten, kleinen und überlappenden Ziele" name="collision-lab">



</example>

In jedem Frame eines Drags übergibt der Provider `collision` die Drop-Ziele im Spiel, und sie
gibt deren IDs zurück, das beste zuerst. Fünf Funktionen bringt die Bibliothek mit:

<table>
<thead>
  <tr>
    <th>
      Funktion
    </th>
    
    <th>
      Ordnet ein
    </th>
    
    <th>
      Gut für
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      Was unter dem Zeiger liegt; wenn dort nichts ist, was die gezogene Box überlappt.
    </td>
    
    <td>
      Der Standard: präzise unter dem Zeiger, nachsichtig in den Lücken.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Nur was unter dem Zeiger liegt, das innerste zuerst.
    </td>
    
    <td>
      Präzise Ziele: Eine Lücke legt nirgends ab.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Jedes Ziel, das die gezogene Box überlappt: höhere <code>
        priority
      </code>
      
      , dann tiefere Verschachtelung, dann die größere Überlappung.
    </td>
    
    <td>
      Große Elemente über kleinen Zielen, wenn der Zeiger am Rand des Elements ist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Jedes Ziel, nach dem Abstand vom Mittelpunkt der Box zu ihrem.
    </td>
    
    <td>
      Irgendetwas gewinnt immer, auch weit weg: Raster und Listen aus gleich großen Elementen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Jedes Ziel, nach den Abständen zwischen den vier Ecken.
    </td>
    
    <td>
      Nebeneinanderstehende Spalten (Kanban), Ziele mit sehr unterschiedlicher Höhe.
    </td>
  </tr>
</tbody>
</table>

Unter dem Zeiger respektiert der Hit-Test, was der Nutzer sieht: Von überlappenden Zielen wird
nur das oberste getroffen (`front`, nie `back`, wo sie sich überlappen), und von verschachtelten
kommt das innerste zuerst (`subfolder`, dann `folder`).

### Eine eigene Funktion

```ts [magnet.ts]
import type { CollisionDetection, Coordinates, Rect } from '@vue-dnd-kit/core';

/** How far the point is from the rect: 0 inside it. */
const gap = (rect: Rect, point: Coordinates) =>
  Math.hypot(
    Math.max(rect.left - point.x, 0, point.x - rect.right),
    Math.max(rect.top - point.y, 0, point.y - rect.bottom),
  );

/** What is under the pointer; in a gap, the nearest target within 40px. */
export const magnet: CollisionDetection = ({ hits, pointer, candidates }) => {
  if (hits.length) return hits;
  return candidates
    .filter((candidate) => gap(candidate.rect, pointer) <= 40)
    .sort((a, b) => gap(a.rect, pointer) - gap(b.rect, pointer))
    .map((candidate) => candidate.id);
};
```

<table>
<thead>
  <tr>
    <th>
      Argument
    </th>
    
    <th>
      Was es enthält
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      Der Zeiger, nach den Modifiern.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      Die gezogene Box, wie sie angezeigt wird, <code>
        null
      </code>
      
       ohne Overlay.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      Jedes Ziel im Spiel: <code>
        id
      </code>
      
      , <code>
        rect
      </code>
      
       (sein sichtbarer Teil, von Scroll-Containern beschnitten), <code>
        priority
      </code>
      
      , <code>
        depth
      </code>
      
       (<code>
        0
      </code>
      
       ganz oben, tiefer bei Verschachtelung).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      Die Ziele unter dem Zeiger aus dem Hit-Test, das beste zuerst.
    </td>
  </tr>
</tbody>
</table>

Gib ein leeres Array für „kein Ziel“ zurück. Deaktivierte Ziele, Ziele in den gezogenen
Elementen und Ziele, die von ihren Scroll-Containern verdeckt sind, erreichen die Funktion nie.
Ein Ziel, das den Drag ablehnt, konkurriert trotzdem: Über ihm ist `over.accepted` `false`, und
ein Drop wird abgelehnt (ein Ziel in einem sortierbaren Element tritt stattdessen zur Seite,
damit die Liste darüber sortiert). Die Demo umhüllt die gewählte Funktion, um ihre Rangfolge
festzuhalten: `(args) => (ranked.value = detect(args))`.

<note>

Der Provider dämpft die Wechsel, die die Funktion verlangt. Ein Ziel, das der Drag gerade
verlassen hat, kann erst wieder gewinnen, wenn sich der Zeiger 10 px bewegt hat, damit Grenzen
nicht flackern. Zwischen den Zielen, die in einem Elternelement verschachtelt sind (die Lücken
einer Spalte aus Karten), bleibt das letzte Ziel.

</note>

## Wann ein Drücken zum Drag wird

Ein Drücken zieht nicht sofort. `activation` legt je nach Zeigerart (`mouse`, `touch`, `pen`)
fest, worauf es wartet: eine `distance` in px, ein `delay` in ms (mit einer `tolerance`, nach
der das Drücken aufgibt, damit die Seite scrollen kann) oder was von beiden zuerst eintritt.

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      Zeiger
    </th>
    
    <th>
      Standard
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        mouse
      </code>
      
      , <code>
        pen
      </code>
    </td>
    
    <td>
      <code>
        { distance: 4 }
      </code>
      
      : Ein Klick bleibt ein Klick. Ein Mausdruck auf ein <code>
        handle
      </code>
      
       startet sofort und bleibt ein Klick, wenn sich die Maus nicht bewegt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        touch
      </code>
    </td>
    
    <td>
      <code>
        { delay: 200, tolerance: 5 }
      </code>
      
      : ein langes Drücken, damit Listen unter dem Finger weiter scrollen.
    </td>
  </tr>
</tbody>
</table>

Eine Art, die du weglässt, behält ihren Standard. Die eigene `activation` eines ziehbaren
Elements gewinnt gegen die eines [Drag-Bereichs](https://zizigy.github.io/docs/guides/constraints), und die gewinnt
gegen die des Providers. Während ein Drücken wartet, ist `useDnD().status` `'activating'`, und
`activation.progress` läuft von `0` bis `1`; Escape oder `useDnD().cancel()` bricht es ab.
Probiere die Bedingungen live aus und zeichne aus dem Fortschritt einen Ring fürs lange Drücken,
in [Sensoren und programmatisches Ziehen](https://zizigy.github.io/docs/guides/sensors#activation-constraints).

## Auto-Scroll

Ziehe einen Kanal zum oberen oder unteren Ende der Liste. Die grünen Streifen sind die
Randzonen: Je tiefer du in einer bist, desto schneller scrollt die Liste.

<example height="37.5rem" hint="Ziehe einen Kanal in die grünen Streifen" name="auto-scroll-edges">



</example>

Jedes Element mit `overflow: auto` oder `scroll` scrollt von selbst, ebenso das Fenster. Der
Provider scrollt zuerst den Container unter dem Zeiger, dann dessen Vorfahren, dann das
Fenster.

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Standard
    </th>
    
    <th>
      Was sie festlegt
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        0.2
      </code>
    </td>
    
    <td>
      Die Randzone als Anteil der Containergröße, zwischen 24 und 96 px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        acceleration
      </code>
    </td>
    
    <td>
      <code>
        10
      </code>
    </td>
    
    <td>
      Die Geschwindigkeit ganz am Rand, in px pro Frame. Sie wächst mit dem Quadrat der Tiefe in der Zone, so ist der Anfang langsam und präzise.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSpeed
      </code>
    </td>
    
    <td>
      <code>
        25
      </code>
    </td>
    
    <td>
      Die Höchstgeschwindigkeit. Jenseits des Rands (der Zeiger außerhalb des Containers) wächst die Geschwindigkeit bis zu ihr weiter.
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` schaltet es ab. Eine Richtung scrollt erst, wenn sich der Zeiger in
diese Richtung bewegt hat, damit ein Element, das nahe an einem Rand aufgenommen wird, nicht von
selbst scrollt. Listen, Bäume und [Drag-Bereiche](https://zizigy.github.io/docs/guides/constraints) nehmen ein eigenes
`autoScroll` für ihren Container:

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

Drags per Tastatur scrollen nie automatisch: Sie scrollen stattdessen das Element in den
sichtbaren Bereich. `isAutoScrolling` (aus `useDnD()` oder einem Drag-Bereich) ist `true`,
während etwas scrollt.

## Haptik und die Kopiertaste

Ein Touch-Drag vibriert kurz, wenn er startet. `:haptics="false"` schaltet das ab; ein Objekt
legt jede Vibration fest:

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      Schlüssel
    </th>
    
    <th>
      Vibriert, wenn
    </th>
    
    <th>
      Standard
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        start
      </code>
    </td>
    
    <td>
      Das lange Drücken zum Drag wird.
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (10 ms)
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      Der Drag ein Ziel betritt, das ihn annimmt.
    </td>
    
    <td>
      aus
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      Der Drop durchgeht.
    </td>
    
    <td>
      aus
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      Der Drop abgelehnt wird und die Elemente zurückfliegen.
    </td>
    
    <td>
      aus
    </td>
  </tr>
</tbody>
</table>

Jeder nimmt `true` (das Standardmuster), eine Länge in ms, ein An/Aus-Muster oder `false`. Nur
Drags, die per Touch gestartet wurden, vibrieren, und iOS Safari kann überhaupt nicht vibrieren.

`copyModifier` ist die Taste, die, während eines Drags zwischen Listen gehalten, aus dem
Verschieben ein Kopieren macht: standardmäßig `'Alt'`, jeder `KeyboardEvent.key` oder `null`
für keine. Die Liste, aus der die Elemente kommen, braucht eine `clone`-Funktion; siehe
[Listen mit gemeinsamen Elementen](https://zizigy.github.io/docs/guides/shared-lists).

## Mehrere Provider

Die meisten Apps brauchen genau einen. Setz die Wunschliste unter einen eigenen Provider und
versuche dann, ein Buch hinüberzuschieben: Es kann seinen Provider nicht verlassen, und der
äußere Monitor hört die Wunschliste nicht mehr.

<example height="33.5rem" hint="Schiebe ein Buch hinüber und gib dann der Wunschliste einen eigenen Provider" name="provider-nested">



</example>

```vue
<DnDProvider>
  <Shelf v-model="reading" />
  <DnDProvider>
    <Shelf v-model="wishlist" />
    <EventLog />            <!-- hears the inner provider's drags only -->
  </DnDProvider>
</DnDProvider>
```

- Provider sind unabhängig: Ein Drag wechselt nie von einem zum anderen.
- Verschachtelte Provider sind erlaubt. **Der nächste Besitzer gewinnt**: Ein Element gehört
zum nächstgelegenen Provider darüber, und der äußere Provider ignoriert es.
- Jeder Provider hat seine eigene Auswahl, sein Overlay, seine Live-Region und seine Monitore.

Ein zweiter Provider lohnt sich nur für einen Teil der Seite, der eigene providerweite
Einstellungen braucht (Kollisionserkennung, Tastaturtasten, Ansagen) und dessen Elemente ihn nie
verlassen. Wenn sich Elemente nicht zwischen zwei Teilen deiner Seite verschieben lassen, prüfe,
ob sie nicht unter zwei Providern sitzen.

<tip>

Regeln für einen Teil der Seite (ein Board, das einrastet, ein Feed mit längerem Touch-Drücken,
ein Panel, in dem nichts gezogen wird) brauchen keinen eigenen Provider:

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

Die Elemente des Bereichs bleiben im Provider der App und können sich weiterhin überallhin bewegen. Siehe
[Achsen, Grenzen und Raster](https://zizigy.github.io/docs/guides/constraints).

</tip>

Eine App, die woanders gemountet ist, in einem Shadow Root oder als eigene Vue-App, kann sich
einem bestehenden Provider anschließen: Übergib `useDnDContext()` an
`provideDnDContext(app, context)`, bevor du sie mountest. Hit-Test und Overlay funktionieren
über Shadow Roots hinweg.

## Andere Fenster der App

Eine App kann einen Teil von sich in einem anderen Fenster zeigen: ein Popup, das sie mit
`window.open` öffnet, ein abgelöstes Panel, ein Document-Picture-in-Picture-Fenster. Sie rendert
dort mit einem Teleport, unter demselben Provider. Öffne die Wunschliste in einem Fenster und
sortiere sie dort: Das Overlay ist im Popup.

<example height="26rem" hint="Öffne die Wunschliste in einem Fenster und sortiere sie dann dort" name="provider-windows">



</example>

Nenne das Fenster, wenn du es öffnest:

```ts
const dnd = useDnD();

function detach() {
  const popup = window.open('', 'inspector', 'popup,width=420,height=560')!;
  const release = dnd.addWindow(popup);       // listen there, until it closes
  popup.addEventListener('pagehide', release);
  target.value = popup.document.body;         // <Teleport :to="target">…</Teleport>
}
```

- Drags funktionieren in diesem Fenster wie auf der Seite: Sie starten dort, sortieren und treffen
seine Ziele, scrollen es automatisch und zeigen das Overlay in seinem `<body>`. Seine Frames
führen sie aus, sodass eine Seite, die hinter dem Popup verborgen ist, sie nicht ausbremst.
- Ein Drag per Zeiger oder Tastatur bleibt in dem Fenster, in dem er gestartet ist: Der Browser
schickt die Eingaben eines Fensters nur an dieses Fenster. Elemente mit
[`native`](https://zizigy.github.io/docs/guides/native) wechseln zwischen den Fenstern, getragen vom eigenen Drag and Drop
des Browsers.
- Eine Komponente, die beim Mounten in das Fenster gerendert wird, wird von selbst gefunden. Inhalt,
den ein Teleport später dorthin verschiebt (ein Panel, das sich ablöst), nicht: Dafür ist
`addWindow` da.
- Der Provider injiziert seine Styles in das Fenster und lässt es los, wenn es sich schließt.
- Ein [eigener Sensor](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own) hört in jedem Fenster mit, mit
`context.onWindow((view) => useEventListener(view.document, …))`.

## SSR und Nuxt

Der Provider ist SSR-sicher. Listen und Elemente rendern auf dem Server wie jedes andere
Markup. Das Overlay und die Live-Region werden teleportiert und nur auf dem Client gemountet,
deshalb verursachen sie nie einen Hydration-Mismatch. Standard-IDs kommen von Vues `useId()` und
stimmen zwischen Server und Client überein.

In Nuxt registriert das Modul `DnDProvider` global und importiert die Composables automatisch:
siehe [Installation](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
