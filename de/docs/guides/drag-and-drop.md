---
title: "Drag and Drop"
description: "Freies Ziehen mit makeDraggable und Drop-Ziele mit makeDroppable – typisierte Ziele, die manche Drags annehmen und andere ablehnen, ein Grundriss, Papierkorb-Zonen, Ordner in einer Liste und einfache Elemente, die eine Liste aufnimmt."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/drag-and-drop"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Nimm `makeDraggable` und `makeDroppable` für alles, was keine sortierbare Liste ist: Müll in
Tonnen, Möbel auf einem Grundriss, Dateien in Ordner, ein Papierkorb, ein Schachbrett.

<example height="29rem" hint="Sortiere den Müll in die Tonnen; die Batterie nimmt keine Tonne" name="recycling">



</example>

## Ein ziehbares Element

```vue [WasteItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ waste: { id: string; name: string; type: string } }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,      // read back as `active.id`
  type: () => props.waste.type,  // matched by the targets' `accept`
  data: () => props.waste,       // anything: `active.data`
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">{{ waste.name }}</div>
</template>
```

Übergib die ID aus deinen Daten, als Getter. Die Standard-ID kommt von `useId()` und ist für
jede Komponenteninstanz neu, sie bedeutet dem Rest deiner App also nichts. Optionen werden
gelesen, wenn sie gebraucht werden, ein Getter oder ein Ref hält sie also aktuell.

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Was sie tut
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      Wer gezogen wird, was er mitträgt und womit das <code>
        accept
      </code>
      
       der Ziele abgeglichen wird.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Ein Selektor oder ein Element darin: Nur dieses startet einen Drag. Siehe <a href="/docs/guides/sortable-lists#handles">
        Handles
      </a>
      
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
      Es startet kein Drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlay
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       (Standard): Eine Kopie folgt dem Zeiger. Eine Komponente: deine eigene Vorschau. <code>
        false
      </code>
      
      : Das Element bewegt sich selbst (<a href="#without-an-overlay">
        unten
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
    
    <td>
      Den Drag auf <code>
        'x'
      </code>
      
       oder <code>
        'y'
      </code>
      
       sperren, einrasten lassen, in Grenzen halten: siehe <a href="/docs/guides/constraints">
        Achsen, Grenzen und Raster
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Wie die Pfeiltasten es bewegen: pixelweise (Standard) oder von Ziel zu Ziel (<a href="#keyboard">
        unten
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
      
      , <code>
        canDrag
      </code>
    </td>
    
    <td>
      Wann ein Drücken zum Drag wird: siehe <a href="/docs/guides/sensors">
        Sensoren
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        attributes
      </code>
    </td>
    
    <td>
      <code>
        role
      </code>
      
      , <code>
        tabindex
      </code>
      
       und <code>
        aria-*
      </code>
      
       für Tastaturen und Screenreader (Standard <code>
        true
      </code>
      
      ).
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Rückgabe
    </th>
    
    <th>
      Was es ist
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      Dieses Element wird gezogen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Beschreibbar, an die <a href="/docs/guides/multi-drag">
        Auswahl
      </a>
      
       des Providers gebunden.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      Der Versatz des Drags, für <code>
        overlay: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
    </td>
    
    <td>
      Die verwendete ID.
    </td>
  </tr>
</tbody>
</table>

Buttons, Eingabefelder und andere interaktive Kinder starten keinen Zeiger-Drag, sie
funktionieren in einem ziehbaren Element also weiter. Alle Optionen stehen in der
[makeDraggable-API](https://zizigy.github.io/docs/api/make-draggable).

## Ein Drop-Ziel

```vue [Bin.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[] }>();
const emit = defineEmits<{ drop: [id: Key] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,   // 'glass', ['paper', 'cardboard'], a function…
  onDrop: (event) => emit('drop', event.active.id),
});
</script>

<template>
  <section ref="el" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" />
  </section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      Rückgabe
    </th>
    
    <th>
      <code>
        true
      </code>
      
      , wenn
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isOver
      </code>
    </td>
    
    <td>
      Der Drag über diesem Ziel ist, egal ob es ihn annimmt oder nicht.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAccepting
      </code>
    </td>
    
    <td>
      Gerade etwas gezogen wird und dieses Ziel es annimmt: Heb die gültigen Ziele hervor.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placement
      </code>
    </td>
    
    <td>
      Kein Boolean: <code>
        { top, right, bottom, left }
      </code>
      
      , die Hälften des Ziels, in denen der Zeiger ist, oder <code>
        null
      </code>
      
      , wenn es nicht überfahren wird. Nimm es für „vor / nach dieser Karte“.
    </td>
  </tr>
</tbody>
</table>

`isOver` ohne `isAccepting` heißt, dass der Drag über einem Ziel ist, das ihn ablehnt. Zeig
das, wie es die Tonnen oben tun: Ein Drop dort wird abgebrochen, und das Element fliegt zurück.
Die Tonnen, die das Element nicht nehmen können, verblassen, während es unterwegs ist; weitere
Looks unter [Styling](https://zizigy.github.io/docs/guides/styling#drop-targets-yes-and-no).

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Was sie tut
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      Zurückgelesen als <code>
        over.id
      </code>
      
       und <code>
        over.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
    
    <td>
      Welche Drags es annimmt (<a href="#which-drags-a-target-takes">
        nächster Abschnitt
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Es nimmt nichts an, und Drags gleiten darüber hinweg.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        priority
      </code>
    </td>
    
    <td>
      Höher gewinnt, wenn sich Ziele ohne Verschachtelung überlappen (Standard 0).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
    </td>
    
    <td>
      Der Drag kam herein oder ging hinaus.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
      
      , <code>
        onDrop
      </code>
    </td>
    
    <td>
      Über den Drop entscheiden, dann ihn anwenden (<a href="#the-drop">
        unten
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

## Welche Drags ein Ziel annimmt

Der `type` eines ziehbaren Elements wird mit dem `accept` eines Ziels abgeglichen:

<table>
<thead>
  <tr>
    <th>
      <code>
        accept
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
      weggelassen oder <code>
        '*'
      </code>
    </td>
    
    <td>
      Alles.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'glass'
      </code>
    </td>
    
    <td>
      Ziehbare Elemente vom Typ <code>
        glass
      </code>
      
       und solche ohne Typ.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ['paper', 'cardboard']
      </code>
    </td>
    
    <td>
      Beide Typen und solche ohne Typ.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ({ active, items, types }) => boolean
      </code>
    </td>
    
    <td>
      Was deine Funktion sagt.
    </td>
  </tr>
</tbody>
</table>

Ein ziehbares Element ohne `type` passt zu jeder String-Regel. `type` kann auch ein Array sein
(`['paper', 'large']`): Ein passender Typ genügt. Eine Funktion entscheidet anhand von allem, was
den Drag betrifft. Die Kompost-Tonne oben liest die Daten der Elemente, nicht ihren Typ:

```ts [waste.ts]
{
  id: 'compost',
  accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
}
```

`accept` wird live gelesen, während der Drag sein Ziel sucht: Übergib ein Ref, um es zu ändern.

Wenn mehrere Elemente auf einmal gezogen werden, sagt `acceptMode`, wie viele passen müssen:
`'all'` (Standard) oder `'some'`. Gib bei `'some'` aus `onBeforeDrop` die IDs zurück, die
bleiben sollen, und die anderen fliegen zurück. Siehe
[Über einen Drop entscheiden](https://zizigy.github.io/docs/guides/drop-decisions).

## Der Drop

`onDrop` eines einfachen Drop-Ziels ist der Ort, an dem **du** deine Daten änderst. Die
Bibliothek verschiebt von selbst nichts:

```vue [index.vue]
<script setup lang="ts">
/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
</template>
```

<table>
<thead>
  <tr>
    <th>
      Feld des Events
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
        active
      </code>
    </td>
    
    <td>
      Der Drag: <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
       (je <code>
        { id, data, type, item }
      </code>
      
      ), <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      Dieses Ziel: <code>
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
        pointer
      </code>
      
      , <code>
        delta
      </code>
    </td>
    
    <td>
      Wo der Zeiger ist und wie weit er sich seit dem Start bewegt hat.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Wo die gezogene Box in diesem Ziel sitzt (<a href="#leave-it-where-it-was-dropped">
        nächster Abschnitt
      </a>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        source
      </code>
    </td>
    
    <td>
      Gesetzt, wenn die Elemente aus einer sortierbaren Liste kommen: <code>
        { list, remove() }
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`active.ids` enthält jede gezogene ID, die gegriffene zuerst. Die Reihenfolge ist
`onBeforeDrop` (entscheiden), `onDrop` (anwenden), dann `drag-end` des Providers. Um jeden Drag
der Seite an einer Stelle zu hören, nimm `useDnDMonitor` (siehe
[Der Provider](https://zizigy.github.io/docs/guides/provider)). Um vor einem Drop nachzufragen, den Drag weiterlaufen zu
lassen oder nur einige Elemente anzunehmen, siehe
[Über einen Drop entscheiden](https://zizigy.github.io/docs/guides/drop-decisions).

## Dort lassen, wo es abgelegt wurde

Ein Grundriss, eine Zeichenfläche, ein Board: Das Element bleibt dort, wo du loslässt. Jedes
Event trägt `position`, das `left` / `top`, das ein absolut positioniertes Element dorthin setzt,
wo es abgelegt wurde.

<example height="28rem" hint="Ziehe Möbel in den Raum, verschiebe sie darin oder stell sie zurück" name="room-planner">



</example>

```ts [Planner.vue]
const room = useTemplateRef<HTMLElement>('room');
makeDroppable(room, {
  id: 'room',
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    // Clamped, so a piece let go half outside stays inside the walls.
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});
```

```vue [Piece.vue]
<div ref="el" class="piece" :style="{ left: `${piece.x}px`, top: `${piece.y}px` }">…</div>
```

`position` ist die linke obere Ecke der gezogenen Box in `over`, gemessen ab der
Padding-Kante des Ziels, plus dessen Scroll: Der Rahmen des Raums, seine Wände, zählt nicht. Über nichts
ist es `null`.

<tip>

Berechne die Stelle nicht aus `active.rect` und `delta`: Damit fehlen Rahmen und Scroll des
Ziels. Raster, Grenzen und Achsensperren für solche Boards stehen in
[Achsen, Grenzen und Raster](https://zizigy.github.io/docs/guides/constraints).

</tip>

## Ohne Overlay

Standardmäßig folgt eine Kopie des Elements dem Zeiger, und das Element bleibt an seinem Platz:
So funktionieren die Möbel im Lager. Mit `overlay: false` gibt es keine Kopie, und das Element
bewegt sich selbst um das `transform`, das der Drag zurückgibt: die Möbel im Raum.

```ts [Piece.vue]
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),   // a value or a ref, read when the drag starts
});

const style = computed(() => ({
  left: `${props.piece.x}px`,
  top: `${props.piece.y}px`,
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
```

- `position` ist dann die eigene Ecke des Elements, der Drop-Handler bleibt also derselbe.
- Das Element liegt beim Bewegen unter dem Zeiger; beim Suchen des Ziels schaut die Bibliothek
hindurch. Heb es während des Ziehens über seine Nachbarn (`z-index`).
- Es scrollt mit der Seite, das Overlay nicht: `transform` zieht ab, was sich sein Container seit
dem Start des Drags bewegt hat, so bleibt es unter dem Zeiger, wenn die Seite scrollt.
- Es bewegt sich in seinem eigenen Container: Ein Elternelement mit `overflow: hidden`
beschneidet es, und sein Stapelkontext entscheidet, worüber es hinweggleitet. Das Overlay hat
keines der beiden Probleme.

Für eine eigene Vorschau statt der Kopie siehe [Das Overlay](https://zizigy.github.io/docs/guides/overlay).

## Papierkorb-Zonen

Ein Drag, der in einer sortierbaren Liste startet, trägt `e.source`. Ruf `remove()` auf, und die
Liste entfernt die Elemente:

<example height="34rem" hint="Ziehe eine Benachrichtigung auf Done oder Delete und mach es dann rückgängig" name="triage">



</example>

```ts [Triage.vue]
const triage = (bin: 'done' | 'deleted') => (e: DnDEvent) => {
  bins[bin].push(...e.active.items.map((entry) => entry.item as Notice));
  e.source?.remove();
};

makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });
```

- `e.active.items[i].item` ist das Element der Liste selbst. Behalte es, und ein Rückgängig
stellt es dorthin zurück, wo es war.
- Das eigene `onDrop` der Liste läuft dann mit `to.index === -1`, und `e.result` enthält die
Liste ohne die Elemente.
- Das Overlay schrumpft in die Zone hinein, da das Element nirgends mehr angezeigt wird.
- Eine Liste kann auch entfernen, was außerhalb von allem abgelegt wird: siehe
[`dropOutside`](https://zizigy.github.io/docs/guides/shared-lists#dropping-outside).

<note>

Mit der Tastatur bewegen die Pfeiltasten ein Listenelement zwischen den Slots seiner Liste und
den Listen seiner Gruppe; hinter dem Ende der Listen bringt der nächste Druck es weiter zum Drop-Ziel
in dieser Richtung, hier dem Papierkorb, und der Pfeil in die Gegenrichtung holt es zurück. Ein Button, ein Menü oder die Taste `Delete` ist
für viele trotzdem schneller: Biete auch so etwas an.

</note>

## In ein sortierbares Element ablegen

Eine Zeile einer sortierbaren Liste kann auch ein Drop-Ziel sein: ein Ordner, der Lesezeichen
annimmt, eine Gruppe, die Aufgaben annimmt. Setz ein Droppable auf das Element:

<example height="28rem" hint="Lege einen Link auf die Mitte eines Ordners; nahe an seinen Rändern wird sortiert. Öffne einen Ordner, um Links herauszuziehen" name="bookmarks">



</example>

```ts [FolderRow.vue]
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link)); // Bookmarks adds them
    e.source?.remove();   // take them out of the list they came from
  },
});
```

Ein geöffneter Ordner zeigt seine Links als Liste derselben Gruppe, die nur Links annimmt: Dort
werden sie sortiert, und man kann sie zurück auf die oberste Ebene oder in einen anderen Ordner
ziehen.

Solange die Liste den Drag sortieren würde, zählt ein solches Ziel nur in der **Mitte** seines
Elements (25 bis 75 % entlang der Achse der Liste). Dort geht der Drop in das Element, und die
Liste bewegt sich nicht. Nahe an den Rändern sortiert die Liste wie gewohnt.

- Ein Ziel, dessen `accept` den Drag ablehnt, wird übersprungen: Die Liste sortiert über das
Element hinweg wie über jedes andere. Die Ordner nehmen nur Links an, also sortiert sich ein
gezogener Ordner an den anderen vorbei.
- Ein Ziel erhält nie seinen eigenen Drag.
- Mit der Tastatur hält ein Pfeil zuerst auf dem Ordner an; der nächste Druck in dieselbe
Richtung geht an ihm vorbei.
- Das Element wird nach dem Drop nicht mehr angezeigt, also schrumpft das Overlay in den Ordner
hinein, statt zurückzufliegen.
- Über dem Ordner lässt die Liste den Slot der gezogenen Zeile, wo er war, damit sich unter dem
Zeiger nichts verschiebt. Der Slot bekommt dann `data-dnd-placeholder="into"`: Der Drop geht
nicht dorthin, also blende ihn ruhig aus (`[data-dnd-placeholder='into'] { opacity: 0 }`).

Der [Dateimanager](https://zizigy.github.io/docs/examples/file-manager) macht dasselbe in einem Raster, mit
verschachtelten Ordnern.

## Einfache ziehbare Elemente in eine Liste

Eine sortierbare Liste nimmt Elemente auf, die mit `makeDraggable` gezogen werden, wenn sie weiß,
wie sie daraus ein Element macht:

<example height="26rem" hint="Ziehe einen Block in die Agenda; die Uhrzeiten folgen dem Drag" name="day-planner">



</example>

```ts [Agenda.vue]
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});
```

Solange das ziehbare Element über der Liste ist, sitzt das erzeugte Element im Entwurf und wird
von deinem Template gerendert wie jede andere Zeile: Die Uhrzeiten der Agenda zählen es schon
mit. Beim Drop wird es echt (`mode: 'insert'`, `from.list === null`), und das Overlay landet
darauf.

- Gib `undefined` zurück, um abzulehnen. Listen ohne `createItem` ignorieren einfache ziehbare
Elemente.
- Gib dem neuen Element einen eigenen Schlüssel: Der Block bleibt in der Palette.
- Mit der Tastatur nimmt ein Pfeil in Richtung der Liste das ziehbare Element auf, auf seiner
Höhe, und die nächsten Pfeile bewegen es slotweise.

## Dateien vom Computer

Dateien, die vom Desktop oder aus einem Dateimanager hereingezogen werden, sind keine Drags der
Bibliothek: Der Browser trägt sie. Ein Drop-Ziel nimmt sie mit `external` an, und der Drop
bringt sie in `e.external`:

<example height="22rem" hint="Ziehe Bild- oder PDF-Dateien von deinem Computer auf die Zonen" name="file-drop">



</example>

```ts [AvatarDrop.vue]
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});
```

- `files` liest sich wie `<input accept>`: MIME-Typen (`image/*`, `application/pdf`) und
Dateiendungen (`.md`). `true` nimmt jede Datei an, eine Funktion entscheidet Datei für Datei.
`links` und `text` nehmen an, was andere Apps und Tabs ziehen, `types` jeden anderen MIME-Typ.
- Der Drag läuft als Drag des Providers: `isOver`, `isAccepting`, die Events und die Ansagen
funktionieren wie bei jedem anderen. Ziele ohne `external` ignorieren ihn. Es gibt kein
Overlay: Der Browser zeichnet das gezogene Bild.
- Solange die Dateien über der Seite gehalten werden, nennt der Browser nur ihre Typen
(`e.external.fileTypes`). Ihre Namen, Größen und Inhalte kommen mit dem Drop, und erst dann
werden Dateiendungen geprüft. Ordner werden ausgelassen; mit `multiple: false` wird ein Drag
mehrerer Dateien abgelehnt.

Listen nehmen ebenfalls Dateien, Links und Text an und machen ihnen Platz, solange sie gehalten
werden. Elemente können die Seite auch verlassen, in eine andere App oder ein anderes Fenster von
dir: siehe [Dateien und andere Apps](https://zizigy.github.io/docs/guides/native).

<tip>

Wer mit Tastatur oder Screenreader arbeitet, kann keine Dateien ziehen. Biete neben der Zone ein
`<input type="file">` an, wie die Demo mit Browse.

</tip>

## Tastatur

Ein fokussiertes ziehbares Element wird mit <kbd value="Space">



</kbd>

 oder <kbd value="Enter">



</kbd>


aufgenommen, mit denselben Tasten abgelegt, und <kbd value="Escape">



</kbd>

 bricht ab. Dazwischen
bewegen es die Pfeiltasten:

<table>
<thead>
  <tr>
    <th>
      <code>
        keyboard
      </code>
    </th>
    
    <th>
      Ein Pfeil
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'pixels'
      </code>
      
       (Standard)
    </td>
    
    <td>
      Bewegt es um 25 px, den <code>
        keyboard.step
      </code>
      
       des Providers. Mit <kbd value="Shift">
        
      </kbd>
      
       viermal so weit. So bewegen sich die Möbel.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'droppables'
      </code>
    </td>
    
    <td>
      Springt zum nächstgelegenen Ziel in dieser Richtung, das es annimmt. Der Müll springt von Tonne zu Tonne und überspringt die Tonnen, die ihn ablehnen.
    </td>
  </tr>
</tbody>
</table>

```ts
makeDraggable(el, { id: () => props.waste.id, type: () => props.waste.type, keyboard: 'droppables' });
```

Die Tasten lassen sich am Provider neu belegen. Mehr unter
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
