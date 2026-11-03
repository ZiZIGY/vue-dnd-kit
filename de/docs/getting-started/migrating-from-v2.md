---
title: "Migration von v2"
description: "Bring eine v2-App auf v3 – was sich geändert hat und warum, das Upgrade, eine Zuordnung jeder v2-API zu ihrem Ersatz in v3, Code vorher und nachher für die häufigen Fälle und die Stolperfallen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 ist eine Neufassung von v2. Das Modell bleibt: ein Provider und Composables, die du auf deinen
eigenen Elementen aufrufst. Aber die meisten Namen und Optionen haben sich geändert, das Sortieren ist
in die Bibliothek gewandert, und der Drop-Handler, den du für jede Liste geschrieben hast, fällt weg.
Diese Seite ordnet jeden Teil von v2 seinem Gegenstück in v3 zu und zeigt dann die häufigen Fälle
vorher und nachher.

## Was sich geändert hat

- **Sortieren ist eingebaut.** In v2 war eine Liste eine Drop-Zone, ihre Zeilen waren ziehbare
Elemente mit einem Payload `[index, items]`, und du hast in `onDrop` mit
`e.helpers.suggestSort()` sortiert. In v3 erledigen das `makeSortableList` und `makeSortableItem`:
Die Liste rendert einen **Entwurf** deines Arrays, der sich während des Ziehens neu ordnet, und der
Drop schreibt das neue Array in dein Ref. Die meisten v2-Drop-Handler werden gelöscht, nicht
portiert.
- **Dinge bewegen sich von selbst.** Zeilen gleiten an ihre neuen Plätze (FLIP), das Overlay landet
beim Drop in seinem Slot und fliegt beim Abbrechen zurück. `<TransitionGroup>` fällt weg.
- **Weiterhin ein Paket.** `@vue-dnd-kit/core` enthält Listen, Bäume, Multi-Drag, Modifier, Sensoren
und die Kollisionsfunktionen. Das Nuxt-Modul bleibt; `@vue-dnd-kit/actions` (programmatisches
Ziehen) und `@vue-dnd-kit/devtools` sind neu und optional.
- **Ein echtes Overlay.** Es wird nach `body` teleportiert und zeigt einen tiefen Klon, so groß wie
der Slot, in dem es landen wird. Overlay-Komponenten bekommen den Drag als Props, statt die Interna
des Providers zu lesen.
- **IDs statt Elemente.** Die Auswahl, die Events und der Zustand des Drags sind nach IDs aus deinen
Daten geschlüsselt. Es gibt keine Maps von DOM-Elementen mehr zu lesen.
- **Typen und Annahmeregeln** ersetzen `groups` für einfache ziehbare Elemente und Ziele. Listen
tauschen Elemente über den Namen ihrer `group` aus.
- **Entscheidungen vor dem Drop.** `onBeforeDrop` nimmt an, lehnt ab, lässt den Drag weiterlaufen
oder nimmt nur einen Teil der Elemente. `onDrop` wendet nur noch an.
- **Sensoren.** Zeiger- und Tastatureingaben sind Sensoren. Die Aktivierung wird pro Zeigerart
festgelegt, und Touch-Drags beginnen mit langem Drücken, sodass Listen unter dem Finger weiter
scrollen.
- **Bereiche.** `makeDragArea` ersetzt `makeConstraintArea` und `makeAutoScroll`, und Auto-Scroll
funktioniert ohne Code in jedem Scroll-Container.
- **Barrierefreiheit ist standardmäßig an**: ARIA-Attribute, ein Fokus, der nach dem Drop
zurückkehrt, und Ansagen für Screenreader.

## Upgrade

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@^3
```

```bash [yarn]
yarn add @vue-dnd-kit/core@^3
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@^3
```

```bash [bun]
bun add @vue-dnd-kit/core@^3
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      Paket
    </th>
    
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.x, optional
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.x, optional
    </td>
  </tr>
</tbody>
</table>

- Eine App, die `"@vue-dnd-kit/core": "^2…"` in ihrer `package.json` hat, bleibt auf v2, bis der
Versionsbereich `^3` sagt.
- Vue **3.5** oder neuer. v2 hatte keine Abhängigkeiten; v3 hat eine, `@vueuse/core` (14 oder 15).
- Browser: Chrome und Edge 104+, Safari 15.4+, Firefox 104+.
- v2 und v3 teilen sich einen Paketnamen, also wechselt eine App in einem Schritt auf v3. Es gibt
keine Kompatibilitätsschicht. Die v2-Dokumentation bleibt über das Versionsmenü oben auf der Seite
erreichbar.

Eine gute Reihenfolge:

1. Aktualisiere die Pakete und benenne die Props des Providers um ([unten](#the-provider)).
2. Mach aus jeder sortierbaren Liste `makeSortableList` und `makeSortableItem`, und lösche ihren
Drop-Handler.
3. Portiere die einfachen ziehbaren Elemente und Drop-Zonen.
4. Portiere eigene Vorschauen auf Overlay-Komponenten oder den Slot `#overlay` des Providers.
5. Ersetze `makeConstraintArea` und `makeAutoScroll` durch `makeDragArea` oder durch nichts.
6. Lösche die v2-Workarounds: `tabindex` und `aria-grabbed` auf ziehbaren Elementen,
`touch-action: none` auf ganzen Elementen, `<TransitionGroup>` um Zeilen, `markRaw` um
Vorschau-Komponenten.

## Alt zu neu

**Keine Entsprechung** in einer Tabelle heißt, dass v3 nichts unter diesem Namen hat; die Zelle sagt,
was du stattdessen verwendest.

### Auf einen Blick

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      <code>
        DnDProvider
      </code>
      
      , mit neuen Props und einem Slot <code>
        #overlay
      </code>
      
      .
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
        makeDraggable
      </code>
      
       für freies Ziehen; <code>
        makeSortableItem
      </code>
      
       für die Zeilen einer Liste.
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
        makeDroppable
      </code>
      
       für einfache Drop-Ziele; <code>
        makeSortableList
      </code>
      
       oder <code>
        makeSortableTree
      </code>
      
       für Listen und Bäume.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      Nichts: Auto-Scroll läuft automatisch. <code>
        makeDragArea
      </code>
      
       oder das <code>
        autoScroll
      </code>
      
       einer Liste stimmen es ab.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      <code>
        useDnD
      </code>
      
       für den Zustand, <code>
        useDnDMonitor
      </code>
      
       für die Events.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
       und <code>
        provideDnDContext(app, context)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      : jetzt der Klon eines gezogenen Elements, für eigene Overlays.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      , <code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      Der Modifier <code>
        snapToGrid
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      , <code>
        suggestSwap
      </code>
      
      , <code>
        suggestCopy
      </code>
      
      , <code>
        suggestRemove
      </code>
    </td>
    
    <td>
      In Listen eingebaut: siehe <a href="#sorting">
        Sortieren
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Der Provider

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      , aus, sofern nicht gesetzt
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      : <strong>
        standardmäßig an
      </strong>
      
      , für das Fenster und jeden Scroll-Container. <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       oder <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      , standardmäßig im Provider gerendert
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      : ein Selektor oder ein Element, standardmäßig <code>
        'body'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Slot <code>
        #preview="{ preview }"
      </code>
    </td>
    
    <td>
      Slot <code>
        #overlay
      </code>
      
      , mit dem Drag als Props: <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        to
      </code>
      
      . Siehe <a href="#the-overlay">
        das Overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      , <code>
        forDrop
      </code>
      
      , <code>
        forCancel
      </code>
      
       (in <code>
        useDnDProvider()
      </code>
      
       gesetzt)
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      : standardmäßig 25 px, für freie Drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      , <code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
      
       Die Pfeiltasten bewegen; <kbd value="Shift">
        
      </kbd>
      
       macht die Schritte eines freien Drags viermal so groß.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
      
       <code>
        collision
      </code>
      
       wählt, wie das Ziel gefunden wird: <code>
        pointerFirst
      </code>
      
       (Standard), <code>
        pointerWithin
      </code>
      
      , <code>
        rectIntersection
      </code>
      
      , <code>
        closestCenter
      </code>
      
      , <code>
        closestCorners
      </code>
      
       oder eine eigene Funktion.
    </td>
  </tr>
  
  <tr>
    <td>
      Ein Provider pro Seite, nie verschachtelt
    </td>
    
    <td>
      Verschachteln funktioniert: Der nächstgelegene Provider verantwortet ein Element. Ein Provider für die ganze App bleibt das Ziel.
    </td>
  </tr>
</tbody>
</table>

Neue Props ohne Gegenstück in v2: `activation`, `modifiers`, `sensors`, `animation`,
`dropAnimation`, `animateChanges`, `haptics`, `copyModifier`, `overlayFit`, `overlayClass`,
`overlayTransition`, `overlayPreviews`, `announcements`, `screenReaderInstructions` und
`defaultStyles`. Der Provider emittiert außerdem `drag-start`, `drag-move`, `drag-over`, `drag-end`,
`drag-cancel`, `drag-resume` und `drag-settle`. Alles davon steht im Leitfaden [Der Provider](https://zizigy.github.io/docs/guides/provider).

### Den Zustand lesen: `useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      : <code>
        'dragging'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'selecting'
      </code>
      
      , <code>
        'pending'
      </code>
      
       oder <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      : <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       oder <code>
        'selecting'
      </code>
      
      . <code>
        'pending'
      </code>
      
       (ein asynchroner Drop) ist <code>
        'dropping'
      </code>
      
      ; <code>
        null
      </code>
      
       ist <code>
        'idle'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      , nach den Modifiern. Jedes Event hat außerdem <code>
        delta
      </code>
      
      , den Versatz seit dem Start.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
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
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
       (Elemente)
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
       (IDs): <code>
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
      
      , <code>
        ids
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      , <code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      : <code>
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
      
      , <code>
        accepted
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay.progress
      </code>
      
      , <code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      , von <code>
        0
      </code>
      
       bis <code>
        1
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      , <code>
        preview.size
      </code>
      
      , <code>
        preview.render
      </code>
      
      , <code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
      
       Die Bibliothek platziert das Overlay und bestimmt seine Größe. Verwende <code>
        overlayTo
      </code>
      
      , den Slot <code>
        #overlay
      </code>
      
       oder Overlay-Komponenten.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      , <code>
        droppableMap
      </code>
      
      , die <code>
        visible…Set
      </code>
      
      s, <code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Neu: <code>
        useDnD().cancel()
      </code>
      
      , <code>
        position
      </code>
      
      , <code>
        isAutoScrolling
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Die Events sind zu `useDnDMonitor` gewandert: siehe [Events und Drop-Entscheidungen](#events-and-drop-decisions).
Die vollständigen Formen stehen in der [useDnD-API](https://zizigy.github.io/docs/api/use-dnd).

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      : kein drittes Argument. Die Zeilen einer Liste verwenden <code>
        makeSortableItem(ref, { item })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      , in virtuellen Listen nötig
    </td>
    
    <td>
      <code>
        id
      </code>
      
      : Übergib sie aus deinen Daten, als Getter. Der Standardwert kommt aus <code>
        useId()
      </code>
      
       und ist für jede Komponenteninstanz neu.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      : ein Wert, ein Ref oder ein Getter. Zurückgelesen als <code>
        active.data
      </code>
      
       und <code>
        active.items[i].data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      , abgeglichen mit dem <code>
        accept
      </code>
      
       der Ziele. Siehe <a href="#groups">
        Gruppen
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      : ein Selektor oder ein Element-Ref.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      : eine Schranke für jedes Drücken.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      <code>
        activation
      </code>
      
       pro Zeigerart: <code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      . Mit <code>
        distance
      </code>
      
       und <code>
        delay
      </code>
      
       zusammen startet der Drag bei dem, was zuerst eintritt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
      
       Eine <code>
        distance
      </code>
      
       pro Zeigerart.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      : Die Komponente bekommt den Drag als Props. Siehe <a href="#the-overlay">
        das Overlay
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
      
       Ein Drop-Ziel auf einem sortierbaren Element zählt in seiner Mitte (25 bis 75 %); Bäume verschachteln mit <code>
        nesting: 'hover'
      </code>
      
      . Siehe <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        In ein sortierbares Element ablegen
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      , <code>
        onSelfDragMove
      </code>
      
      , <code>
        onSelfDragEnd
      </code>
      
      , <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung
      </strong>
      
       am ziehbaren Element: <code>
        useDnDMonitor
      </code>
      
       oder <code>
        watch(isDragging)
      </code>
      
      . Siehe <a href="#events-and-drop-decisions">
        Events
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
       und sein <code>
        onDragStart
      </code>
      
      … für Drags darüber
    </td>
    
    <td>
      Ein <code>
        makeDroppable
      </code>
      
       auf demselben Element: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Gibt <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
       zurück
    </td>
    
    <td>
      Dasselbe.
    </td>
  </tr>
  
  <tr>
    <td>
      Gibt <code>
        isDragOver
      </code>
      
       zurück
    </td>
    
    <td>
      Sortierbare Elemente geben <code>
        indicator
      </code>
      
       (mit <code>
        placeholder: 'indicator'
      </code>
      
      ) und <code>
        isPlaceholder
      </code>
      
       zurück; Ziele geben <code>
        placement
      </code>
      
       zurück.
    </td>
  </tr>
  
  <tr>
    <td>
      Gibt <code>
        isAllowed
      </code>
      
       zurück
    </td>
    
    <td>
      <strong>
        Keine Entsprechung
      </strong>
      
       bei ziehbaren Elementen. Ziele geben <code>
        isAccepting
      </code>
      
       zurück.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Neu: <code>
        label
      </code>
      
      , <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        overlay: false
      </code>
      
       mit dem zurückgegebenen <code>
        transform
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        attributes
      </code>
      
      , <code>
        native
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      . Eine Zone, die eine Liste enthält, ist ein <code>
        makeSortableList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      : <code>
        '*'
      </code>
      
      , ein Typ, eine Liste von Typen oder eine Funktion.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      : eigene Optionen, kein <code>
        events
      </code>
      
      -Objekt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
      , das <code>
        false
      </code>
      
       oder ein Promise zurückgeben konnte
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       entscheidet, <code>
        onDrop
      </code>
      
       wendet an. Siehe <a href="#events-and-drop-decisions">
        Drop-Entscheidungen
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , das die IDs zurückgibt, die bleiben sollen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      , zurückgelesen als <code>
        over.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Gibt <code>
        isAllowed
      </code>
      
       zurück
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Gibt <code>
        isDragOver
      </code>
      
       zurück: <code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
       (ein Boolean) und <code>
        placement
      </code>
      
      : <code>
        { top, right, bottom, left }
      </code>
      
      , die Hälften, in denen der Zeiger ist. Es gibt kein <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Neu: <code>
        id
      </code>
      
      , <code>
        label
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        overOverlay
      </code>
      
      , <code>
        overDropAnimation
      </code>
      
      , <code>
        external
      </code>
      
       (Dateien vom Computer).
    </td>
  </tr>
</tbody>
</table>

### Das Drop-Event

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        IDragEvent
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      : jeweils <code>
        { id, item, data, label, type }
      </code>
      
      , das gegriffene zuerst. Listen bekommen <code>
        e.items
      </code>
      
       und <code>
        e.keys
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      , <code>
        .items
      </code>
    </td>
    
    <td>
      Listen: <code>
        e.from
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      : <code>
        items
      </code>
      
      , <code>
        placement
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      : <code>
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
      
      , <code>
        accepted
      </code>
      
      . Listen: <code>
        e.to
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung
      </strong>
      
      : Listen ermitteln <code>
        e.to.index
      </code>
      
       selbst.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      Listen schreiben den Drop; <code>
        e.result
      </code>
      
       enthält das neue Array jeder Liste, die er ändert.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
       auf der Liste; <code>
        e.partner
      </code>
      
       ist das Element, mit dem getauscht wurde.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       oder die Kopiertaste (<kbd value="Alt">
        
      </kbd>
      
      ), mit dem <code>
        clone
      </code>
      
       der Liste; <code>
        e.mode
      </code>
      
       ist <code>
        'copy'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        e.source.remove()
      </code>
      
       in einem Drop-Ziel oder <code>
        dropOutside: 'remove'
      </code>
      
       der Liste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      , <code>
        removeAt
      </code>
      
      , <code>
        removeIndexes
      </code>
      
      , <code>
        swapAt
      </code>
      
      , <code>
        getInsertSide
      </code>
      
      , <code>
        isAtZoneStart
      </code>
      
      , <code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
      
       Listen brauchen sie nicht; bei einem einfachen Ziel änderst du deine Daten, wie du willst.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Neu: <code>
        e.pointer
      </code>
      
      , <code>
        e.delta
      </code>
      
      , <code>
        e.position
      </code>
      
       (wohin ein auf einem Board abgelegtes Element kommt), <code>
        e.mode
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Sortieren

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Eine <code>
        makeDroppable
      </code>
      
      -Liste mit <code>
        () => items
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Eine <code>
        makeDraggable
      </code>
      
      -Zeile mit <code>
        () => [index, items]
      </code>
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Dein Array rendern
    </td>
    
    <td>
      Die zurückgegebenen <code>
        items
      </code>
      
       rendern: den Entwurf, der sich während des Ziehens neu ordnet.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      , <code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
       (Standard), <code>
        'horizontal'
      </code>
      
       oder <code>
        'grid'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Identitätsprüfungen, um Quell- und Ziel-Array zu finden, dann <code>
        sourceItems
      </code>
      
       und <code>
        targetItems
      </code>
      
       zuweisen
    </td>
    
    <td>
      Nichts: Der Drop schreibt jede Liste, die er ändert.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      Eingebaut. <code>
        animateChanges: true
      </code>
      
       animiert Änderungen, die kein Drag ausgelöst hat (Hinzufügen, Entfernen, Mischen).
    </td>
  </tr>
  
  <tr>
    <td>
      Eine Einfügelinie aus <code>
        isDragOver.top
      </code>
      
      , <code>
        .bottom
      </code>
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
       und <code>
        indicator.side
      </code>
      
       des Elements. Siehe <a href="/docs/guides/sortable-lists#an-insertion-line">
        Eine Einfügelinie
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Eine Palette, die nur kopiert (<code>
        suggestCopy()
      </code>
      
       und ein Flag <code>
        copyOnly
      </code>
      
      )
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      , <code>
        sort: false
      </code>
      
       und <code>
        clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Ein Papierkorb mit <code>
        suggestRemove()
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
       oder <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia oder unveränderliche Daten: das Ergebnis selbst zuweisen
    </td>
    
    <td>
      <code>
        items
      </code>
      
       als Getter, dann <code>
        e.preventDefault()
      </code>
      
       in <code>
        onDrop
      </code>
      
       und <code>
        e.result
      </code>
      
       anwenden. Siehe <a href="/docs/guides/shared-lists#controlled-lists">
        Kontrollierte Listen
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Ein rekursiver Baum: ein Droppable pro Ordner und <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      : ein Container, Zeilen flach mit ihrer Tiefe gerendert. Siehe <a href="/docs/guides/trees">
        Bäume
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Verschachtelte Gruppen mit <code>
        v-model
      </code>
      
       (ein Droppable pro Gruppe)
    </td>
    
    <td>
      Eine Liste in einer Liste, alle in einer <code>
        group
      </code>
      
      , jede mit <code>
        items: defineModel()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Virtuelle Listen: <code>
        id
      </code>
      
       auf jedem ziehbaren Element
    </td>
    
    <td>
      Gib den Entwurf an den Virtualizer, <code>
        id: () => props.item.id
      </code>
      
       auf den Zeilen. Siehe <a href="/docs/guides/virtual-lists">
        Virtuelle Listen
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Der Code vorher und nachher steht [unten](#a-sortable-list). Alles über Listen steht in
[Sortierbare Listen](https://zizigy.github.io/docs/guides/sortable-lists) und [Listen mit gemeinsamen Elementen](https://zizigy.github.io/docs/guides/shared-lists).

### Gruppen

v2 hatte eine Option `groups` für alles. v3 teilt sie in zwei:

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev', 'ops']
      </code>
      
       auf einer Zone
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
       oder eine Funktion: <code>
        ({ active, items, types }) => boolean
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
       oder keine
    </td>
    
    <td>
      <code>
        type
      </code>
      
       oder <code>
        accept
      </code>
      
       weggelassen. Die Regeln von v2 gelten: Ein ziehbares Element ohne Typ passt zu jeder Regel, und ein Ziel ohne <code>
        accept
      </code>
      
       nimmt alles an.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       auf der Zone einer Liste und ihren Zeilen
    </td>
    
    <td>
      <code>
        group: 'board'
      </code>
      
       auf <code>
        makeSortableList
      </code>
      
      . <code>
        group: { name, pull, put }
      </code>
      
       sagt, was hinaus- und hineindarf.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
      
       auf <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Eine Liste ohne `group` ist eine eigene Gruppe und tauscht mit keiner anderen Liste. In v2 nahm eine
Zone ohne Gruppen alles an. Siehe [Welche Drags ein Ziel annimmt](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes).

### Das Overlay

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Eine Vorschau, im Provider gerendert, mit <code>
        previewTo
      </code>
      
       teleportiert
    </td>
    
    <td>
      Immer teleportiert, nach <code>
        body
      </code>
      
       oder nach <code>
        overlayTo
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Ein Klon: dasselbe Tag, sein <code>
        innerHTML
      </code>
      
       und seine Größe
    </td>
    
    <td>
      Ein tiefer Klon: Formularwerte, <code>
        <canvas>
      </code>
      
      -Pixel, geerbte Styles und Tabellenzellen kommen mit. Markiere, was zurückbleibt, mit <code>
        data-dnd-no-clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
      
      , das <code>
        useDnDProvider().entities
      </code>
      
       liest
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      , das <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
       und <code>
        to
      </code>
      
       als Props bekommt. Kein <code>
        markRaw
      </code>
      
      ; nimm ein <code>
        shallowRef
      </code>
      
      , um es zu wechseln.
    </td>
  </tr>
  
  <tr>
    <td>
      Der Slot <code>
        #preview
      </code>
      
      , positioniert anhand von <code>
        preview.position
      </code>
    </td>
    
    <td>
      Der Slot <code>
        #overlay
      </code>
      
      : Die Bibliothek platziert die Box und bestimmt ihre Größe. Rendert er nichts, kommt der Klon zum Einsatz.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      Der Slot <code>
        #overlay
      </code>
      
       oder ein <code>
        shallowRef
      </code>
      
      , als <code>
        overlay
      </code>
      
       übergeben.
    </td>
  </tr>
  
  <tr>
    <td>
      Ein neues Aussehen über einer Zone, aus <code>
        onEnter
      </code>
      
       und <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        overOverlay
      </code>
      
       auf <code>
        makeDroppable
      </code>
      
       oder einer Liste, oder <code>
        over
      </code>
      
       in der Overlay-Komponente lesen. Siehe <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        Ziele, die das Overlay ändern
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      Die <code>
        items
      </code>
      
       der Overlay-Props; <code>
        <DragPreview :id="item.id" />
      </code>
      
       rendert einen Klon.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      Der Modifier <code>
        snapToGrid
      </code>
      
      . Er rastet auch die Stelle ein, an der Ziele gesucht werden, und die <code>
        position
      </code>
      
       des Drops, nicht nur das Bild.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <Transition>
      </code>
      
       oder <code>
        AnimatePresence
      </code>
      
       von motion um <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        overlay-class
      </code>
      
       mit <code>
        @starting-style
      </code>
      
       für das Aufnehmen, <code>
        dropAnimation
      </code>
      
       für das Landen, <code>
        overlayTransition
      </code>
      
       zwischen Komponenten. Siehe <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        Das Overlay: anheben, neigen, ablegen
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      <code>
        [data-dnd-overlay]
      </code>
      
       (<code>
        "dragging"
      </code>
      
      , <code>
        "dropping"
      </code>
      
      ) auf der Box, <code>
        [data-dnd-overlay-content]
      </code>
      
       darin.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.size
      </code>
      
      , von Hand aktuell gehalten
    </td>
    
    <td>
      Die Box nimmt die Größe des Slots an, in dem sie landen wird (<code>
        overlayFit
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      Die Vorschau verschwindet beim Drop
    </td>
    
    <td>
      Sie landet in ihrem Slot oder fliegt beim Abbrechen zurück.
    </td>
  </tr>
</tbody>
</table>

Mehr im Leitfaden [Das Overlay](https://zizigy.github.io/docs/guides/overlay).

### Auswahl und Multi-Drag

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        selected
      </code>
      
      , von <code>
        makeDraggable
      </code>
      
       zurückgegeben
    </td>
    
    <td>
      <code>
        selected
      </code>
      
      , von <code>
        makeDraggable
      </code>
      
       und <code>
        makeSortableItem
      </code>
      
       zurückgegeben.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      , ein Set von Elementen
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      , nach ID geschlüsselt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      : standardmäßig Strg (<code>
        ControlLeft
      </code>
      
      ) gedrückt
    </td>
    
    <td>
      Standardmäßig keine Taste: Ein Druck auf eine leere Stelle des Bereichs zeichnet den Rahmen. <code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       bringt Strg zurück.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier.keys
      </code>
      
       als <code>
        KeyboardEvent.code
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
       (<code>
        'Control'
      </code>
      
      , <code>
        'Shift'
      </code>
      
      ) oder <code>
        .code
      </code>
      
       (<code>
        'ControlLeft'
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      , <code>
        'select'
      </code>
    </td>
    
    <td>
      Dasselbe.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Dasselbe.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort()
      </code>
      
      , das die Auswahl als Block verschiebt
    </td>
    
    <td>
      Listen verschieben sie. <code>
        multiple: 'group'
      </code>
      
       (Standard), <code>
        'gaps'
      </code>
      
       oder <code>
        'stack'
      </code>
      
       sagt, was die anderen Elemente unterwegs tun.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       für gemischte Auswahlen
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       und <code>
        onBeforeDrop
      </code>
      
      , das IDs zurückgibt. Siehe <a href="/docs/guides/multi-drag#taking-only-some">
        Nur einige annehmen
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Mehr in [Multi-Drag und Auswahl](https://zizigy.github.io/docs/guides/multi-drag).

### Achsen, Grenzen und Einrasten

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      , für die Drags, die darin beginnen. <code>
        axis
      </code>
      
       funktioniert auch auf einem ziehbaren Element, einer Liste, einem Baum oder einem Element.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      <code>
        axis
      </code>
      
       weggelassen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
       oder die Modifier <code>
        restrictToParent
      </code>
      
       und <code>
        restrictToElement(el)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Ein Provider pro Region, um Regeln getrennt zu halten
    </td>
    
    <td>
      Ein Provider und ein <code>
        makeDragArea
      </code>
      
       pro Region. Ihre Elemente können sich trotzdem überallhin bewegen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       oder <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      , in <code>
        modifiers
      </code>
      
       auf dem Provider, einem Bereich, einer Liste oder einem ziehbaren Element.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Neu: <code>
        restrictToWindowEdges
      </code>
      
      , <code>
        restrictToFirstScrollableAncestor
      </code>
      
      , <code>
        snapCenterToCursor
      </code>
      
       und eigene Modifier.
    </td>
  </tr>
</tbody>
</table>

Mehr in [Achsen, Grenzen und Raster](https://zizigy.github.io/docs/guides/constraints).

### Auto-Scroll

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      , standardmäßig aus
    </td>
    
    <td>
      Standardmäßig an, für das Fenster und jeden Scroll-Container. <code>
        :auto-scroll="false"
      </code>
      
       schaltet es ab.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      Nichts: Jedes Element mit <code>
        overflow: auto
      </code>
      
       oder <code>
        scroll
      </code>
      
       scrollt. Um eines abzustimmen: <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       oder das <code>
        autoScroll
      </code>
      
       der Liste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        threshold
      </code>
      
       in px oder pro Seite
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      : ein Bruchteil der Containergröße (<code>
        0.2
      </code>
      
      ), zwischen 24 und 96 px. <strong>
        Keine Entsprechung
      </strong>
      
       für Schwellen pro Seite.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        speed
      </code>
      
      , ein Multiplikator
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
       (25 px pro Frame) und <code>
        acceleration
      </code>
      
       (10).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        isAutoScrolling
      </code>
      
      , aus <code>
        makeDragArea
      </code>
      
       oder <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Tastatur und Barrierefreiheit

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex="0"
      </code>
      
       auf jedem ziehbaren Element
    </td>
    
    <td>
      Wird für dich gesetzt, mit <code>
        role
      </code>
      
      , <code>
        aria-roledescription
      </code>
      
      , <code>
        aria-describedby
      </code>
      
      , <code>
        aria-disabled
      </code>
      
       und <code>
        aria-pressed
      </code>
      
      . Deine eigenen Attribute haben Vorrang.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        :aria-grabbed="isDragging"
      </code>
      
       von Hand
    </td>
    
    <td>
      Entferne es: <code>
        aria-pressed
      </code>
      
       folgt dem Drag.
    </td>
  </tr>
  
  <tr>
    <td>
      Tasten in <code>
        useDnDProvider().keyboard.keys
      </code>
      
       gesetzt
    </td>
    
    <td>
      Die Prop <code>
        keyboard
      </code>
      
       des Providers. Tastenbelegungen passen auf <code>
        event.code
      </code>
      
       oder <code>
        event.key
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Die Pfeiltasten bewegen die Vorschau um <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      Freie Drags: <code>
        keyboard.step
      </code>
      
       px. Listen: von Slot zu Slot und in die nächste Liste der Gruppe. <code>
        keyboardMode: 'droppables'
      </code>
      
       springt zwischen Zielen.
    </td>
  </tr>
  
  <tr>
    <td>
      Die Pfeiltasten umbelegen (<code>
        forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      )
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Keine Ansagen
    </td>
    
    <td>
      Eine Live-Region sagt jedes Aufnehmen, Bewegen, Ablegen und Abbrechen an. <code>
        label
      </code>
      
       benennt die Dinge; <code>
        announcements
      </code>
      
       und <code>
        screenReaderInstructions
      </code>
      
       formulieren sie um.
    </td>
  </tr>
</tbody>
</table>

Mehr in [Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility).

### Events und Drop-Entscheidungen

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
       des ziehbaren Elements
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      , mit Prüfung von <code>
        active.ids
      </code>
      
      . Für eine Klasse genügt <code>
        isDragging
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      <code>
        onDragMove
      </code>
      
       des Monitors.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      , abgelegt oder abgebrochen
    </td>
    
    <td>
      <code>
        onDragEnd
      </code>
      
       des Monitors (ein Drop) und <code>
        onDragCancel
      </code>
      
      . <code>
        onDragSettle
      </code>
      
       hört beides, sobald das Overlay gelandet ist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      <code>
        onDragCancel
      </code>
      
       des Monitors.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
       des ziehbaren Elements und sein <code>
        onDragStart
      </code>
      
      … für Drags darüber
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       auf dem Element: <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      . Zeilen einer Liste brauchen nichts.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        onLeave
      </code>
      
       des Droppables
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
       des Droppables
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       entscheidet, dann wendet <code>
        onDrop
      </code>
      
       an. <code>
        onDrop
      </code>
      
       ist synchron, und sein Rückgabewert wird ignoriert.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
      
       des Droppables
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , mit <code>
        acceptMode: 'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Neu: <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
       des Providers sowie <code>
        onDragOver
      </code>
      
      , <code>
        onBeforeDrop
      </code>
      
       und <code>
        onDragResume
      </code>
      
       des Monitors.
    </td>
  </tr>
</tbody>
</table>

Ein v2-`onDrop` konnte einen Wert oder ein Promise darauf zurückgeben, um über den Drop zu
entscheiden. In v3 ist das die Aufgabe von `onBeforeDrop`, auf Listen, Bäumen, Drop-Zielen und
Monitoren:

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        onDrop
      </code>
      
       gibt zurück
    </th>
    
    <th>
      v3 <code>
        onBeforeDrop
      </code>
      
       gibt zurück
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Nichts oder <code>
        true
      </code>
      
      : Der Drop geht durch
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       oder nichts.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      : Dieser Drop wird ausgeschlagen, der Drag bleibt aktiv
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      . <strong>
        <code>
          false
        </code>
        
         lehnt den Drop jetzt ab.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      Ein abgelehntes Promise oder ein Throw: Der Drag wird abgebrochen
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       oder <code>
        false
      </code>
      
      . Ein Throw lehnt ebenfalls ab.
    </td>
  </tr>
  
  <tr>
    <td>
      Ein Promise; währenddessen ist <code>
        state
      </code>
      
       <code>
        'pending'
      </code>
    </td>
    
    <td>
      Ein Promise; währenddessen ist <code>
        status
      </code>
      
       <code>
        'dropping'
      </code>
      
      , und das Overlay wartet mit <code>
        data-dnd-overlay="dropping"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       gibt <code>
        IDragItem[]
      </code>
      
       zurück
    </td>
    
    <td>
      Ein Array von IDs: Nur diese werden abgelegt, die anderen fliegen zurück.
    </td>
  </tr>
</tbody>
</table>

Die Monitore antworten zuerst, dann das Ziel. Danach läuft das `onDrop` des Ziels, eine Liste
schreibt ihre neuen Arrays, und `onDragEnd` folgt. Mehr in
[Über einen Drop entscheiden](https://zizigy.github.io/docs/guides/drop-decisions) und in der [Events-API](https://zizigy.github.io/docs/api/events).

### Typen

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
       (Ziele, Monitore), <code>
        SortableDropEvent
      </code>
      
       (Listen), <code>
        DnDEndEvent
      </code>
      
       (<code>
        onDragEnd
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        Keine Entsprechung.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      , <code>
        ISuggestSwapResult
      </code>
      
      , <code>
        ISuggestCopyResult
      </code>
      
      , <code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      : <code>
        result
      </code>
      
      , <code>
        to
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        partner
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      , in <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        Placement
      </code>
      
      , ohne <code>
        center
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
      , was <code>
        useDnD()
      </code>
      
       zurückgibt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      , <code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      Callbacks in <code>
        DraggableOptions
      </code>
      
      , <code>
        DroppableOptions
      </code>
      
       und <code>
        DnDMonitor
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@^3 @vue-dnd-kit/core@^3
```

<table>
<thead>
  <tr>
    <th>
      v2 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x)
    </th>
    
    <th>
      v3 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.x)
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Importiert automatisch <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeConstraintArea
      </code>
      
      , <code>
        makeAutoScroll
      </code>
      
      , <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      Importiert automatisch <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableItem
      </code>
      
      , <code>
        makeSortableTree
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeDragArea
      </code>
      
      , <code>
        useDnD
      </code>
      
      , <code>
        useDnDMonitor
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Keine Typen automatisch importiert
    </td>
    
    <td>
      Die wichtigsten Typen schon (<code>
        DnDEvent
      </code>
      
      , <code>
        SortableDropEvent
      </code>
      
      , <code>
        OverlayProps
      </code>
      
      …). Generische (<code>
        Key
      </code>
      
      , <code>
        Active
      </code>
      
      , <code>
        Over
      </code>
      
      ) werden von Hand importiert.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      Modifier, Kollisionsfunktionen und Sensoren auf Wunsch: <code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
       und <code>
        DragPreview
      </code>
      
       global
    </td>
    
    <td>
      Dasselbe, mit einer Option <code>
        prefix
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview />
      </code>
      
       im Layout, innerhalb des Providers
    </td>
    
    <td>
      Entferne es: Der Provider rendert das Overlay. <code>
        DragPreview
      </code>
      
       nimmt eine <code>
        id
      </code>
      
       und gehört in Overlay-Komponenten.
    </td>
  </tr>
  
  <tr>
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      Peer <code>
        @vue-dnd-kit/core
      </code>
      
       3; Nuxt 4.
    </td>
  </tr>
</tbody>
</table>

`modules: ['@vue-dnd-kit/nuxt']` in `nuxt.config.ts` bleibt, wie es war. Siehe
[Installation](https://zizigy.github.io/docs/getting-started/installation#nuxt).

## Vorher und nachher

### Ein ziehbares Element und eine Drop-Zone

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- Die Karte bekommt `tabindex`, `role` und die `aria-*`-Attribute von selbst. Ein `<button>` als
Handle ist fokussierbar, und Drags per Tastatur starten von ihm aus.
- Aus `groups` wurde `type` auf dem ziehbaren Element und `accept` auf dem Ziel. Die Callbacks haben
das `events`-Objekt verlassen.
- `isOver` ohne `isAccepting` ist ein Ziel, das den Drag ablehnt: Ein Drop dort fliegt zurück.

### Eine sortierbare Liste

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- Rendere `items`, den Entwurf: Er ordnet sich während des Ziehens neu. `tasks` bekommt beim Drop die
neue Reihenfolge, und `defineModel` emittiert `update:modelValue`.
- Kein Index, kein Payload, kein `onDrop`, kein `<TransitionGroup>`: Die Zeilen gleiten von selbst.
- Die gezogene Zeile bleibt als der Slot, in dem sie landen wird, in der Liste. Style sie mit
`isPlaceholder` oder `[data-dnd-placeholder]`, statt sie zu verstecken.

### Listen mit gemeinsamen Elementen

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

Der Drop schreibt beide Arrays, das, das die Aufgabe verlassen hat, und das, in das sie gekommen ist.
`TaskItem.vue` ist das aus der sortierbaren Liste oben. Eine Palette, die Kopien austeilt, war
`suggestCopy()` und ein Flag `copyOnly`; jetzt ist sie eine Liste:

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

Für einen Pinia-Store oder anderen Zustand, den du nicht direkt schreibst, übergib `items` als
Getter, rufe `e.preventDefault()` in `onDrop` auf und wende `e.result` an: siehe
[Kontrollierte Listen](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

### Ein eigenes Overlay

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- Die Komponente bekommt den Drag als Props: `items` (jedes gezogene Element, das gegriffene zuerst),
`over`, `accepted`, `status`, `mode` und `to`. Deklariere nur die, die du liest. Bei den Zeilen
einer Liste ist das Listenelement `items[0].item`.
- Übergib sie, wie sie ist. Wechsle sie mit einem `shallowRef`, nie mit einem tiefen `ref`.

Der Slot des Providers ändert sich genauso, und deine Komponente positioniert sich nicht mehr selbst:

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

Ein Einblenden, das `DragPreview` in ein `<Transition>` gepackt hat, wird zu `overlay-class` mit
`@starting-style`: siehe [Das Overlay: anheben, neigen, ablegen](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle).

### Ein Drop, den du bestätigst

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

Eine Liste fragt genauso, und mit einem Promise kannst du einen eigenen Dialog öffnen. Das Overlay
wartet dort, wo es losgelassen wurde, bis das Promise erledigt ist:

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

Eine Zone, die nur den passenden Teil einer gemischten Auswahl angenommen hat (`groupMatch: 'some'`):

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

Listen tun das ohne Code: Mit `acceptMode: 'some'` landen die Elemente, die ihr `group.put` annimmt,
und die anderen fliegen zurück.

## Stolperfallen beim Upgrade

- **Installiere v3 mit ihrem Versionsbereich.** `^3` in `package.json`: Ein `npm update` hält `^2`
auf v2.
- **Rendere den Entwurf.** Eine Liste rendert die `items`, die `makeSortableList` zurückgibt, nicht
dein Array. Renderst du dein Array, bewegt sich bis zum Drop nichts.
- **Sortiere nicht doppelt.** Lösche den `suggestSort`-Code aus Listen: Eine Liste schreibt jeden
Drop nach ihrem `onDrop` in ein beschreibbares `items`-Ref. Um ihn selbst anzuwenden, rufe
`e.preventDefault()` auf und verwende `e.result`.
- **false lehnt den Drop ab.** In v2 hielt ein `onDrop`, das `false` auflöste, den Drag am Laufen.
In v3 gibst du `'continue'` aus `onBeforeDrop` zurück. Ein Promise, das `onDrop` zurückgibt, wird
ignoriert.
- **Listen teilen nur innerhalb einer group.** Eine Liste ohne `group` tauscht mit keiner anderen
Liste.
- **Schlüssle Zeilen nach ID.** `:key="index"` animiert die falschen Zeilen. Übergib auch IDs aus
deinen Daten: Eine Standard-ID ist für jede Komponenteninstanz neu.
- **Kein <TransitionGroup>, kein transition auf transform.** Die Bibliothek bewegt die Zeilen
selbst, und Bewegungen würden doppelt animiert.
- **Mach den Touch-Workaround rückgängig.** `touch-action: none` auf einem ganzen Element verhindert,
dass die Seite unter dem Finger scrollt; v3 startet Touch-Drags stattdessen mit langem Drücken.
Behalte es auf einem Handle, das sofort ziehen soll, mit `activation: { touch: { distance: 4 } }`.
- **Entferne veraltete Attribute.** Die Bibliothek setzt `tabindex`, `role` und die `aria-*`, die sie
braucht, und überschreibt deine nie, also bleibt ein übrig gebliebenes `role` oder `aria-grabbed` so,
wie du es hinterlassen hast.
- **Style das Overlay neu.** `.dnd-kit-preview` gibt es nicht mehr: Style, was in
`[data-dnd-overlay='dragging']` steckt, nie das `transform` der Box. Gib der Wurzel einer
Overlay-Komponente `width: 100%; height: 100%`, und nimm `<DragPreview />` aus deinen Layouts.
- **Auto-Scroll ist an.** Übergib `:auto-scroll="false"`, wo v2 nie gescrollt hat.
- **Ein Auswahlrahmen braucht keine Taste.** `makeSelectionArea` zeichnet bei einem einfachen Druck
auf seine leere Fläche. Füge einen `modifier` hinzu, um das Strg von v2 zu behalten.
- **Ein Provider, Bereiche darin.** Elemente können nicht zwischen Providern wechseln. Eine Seite, die
einen Provider pro Region verwendet hat, um deren Regeln zu trennen, braucht einen Provider und ein
`makeDragArea` pro Region.
- **Zwei Argumente.** `makeDraggable` und `makeDroppable` nehmen ein Ref und ein Optionsobjekt, kein
Payload.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
