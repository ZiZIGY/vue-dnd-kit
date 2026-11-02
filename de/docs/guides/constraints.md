---
title: "Achsen, Grenzen und Raster"
description: "Sperre Drags auf eine Achse, halte sie in einer Box, lass sie an einem Raster oder an eigenen Hilfslinien einrasten – für ein Element, eine Liste oder einen ganzen Teil der Seite."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/constraints"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Ein Drag lässt sich auf einer Achse halten, in einer Box halten, an einem Raster einrasten oder
durch eine eigene Regel beugen. Die Regeln sind **Modifier**: Sie passen in jedem Frame den
Versatz des Drags an. Setz sie an einem ziehbaren Element, an einer Liste oder an einem Teil der
Seite, und das Overlay, die Drop-Ziele und der Drop folgen ihnen.

## Eine Achse sperren

Clips auf einer Zeitleiste gleiten entlang ihrer Spur. Schalte die Sperre aus, und sie können auch
die Spur wechseln.

<example height="22rem" hint="Ziehe einen Clip; schalte die Sperre aus und ziehe ihn auf die andere Spur" name="axis-timeline">



</example>

```ts [TimelineClip.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.clip.id,
  axis: () => (props.locked ? 'x' : undefined),
});
```

`axis: 'x'` bewegt nur horizontal, `'y'` nur vertikal. `makeDraggable`, `makeSortableList`,
`makeSortableTree`, `makeSortableItem` und `makeDragArea` nehmen es alle:

```ts
makeSortableList(listRef, { items: tracks, axis: 'y' });
```

- Die Sperre läuft **nach jedem Modifier**, sie hält also, was auch immer diese tun: Ein Einrasten
oder eine Grenze kann das Element nicht von seiner Linie schieben.
- Die Linie liegt im Inhalt, nicht auf dem Bildschirm: Sie bewegt sich mit der Liste (oder dem
Elternelement), in der der Drag gestartet ist. Scrollst du die Seite mitten im Drag, bleibt das
Element in seiner Zeile.
- Die eigene `axis` eines Elements gewinnt gegen die seiner Liste oder seines Baums, und die eines
ziehbaren Elements (oder seiner Liste) gegen die seines Drag-Bereichs.
- Sie wird beim Start eines Drags gelesen, ein Getter kann sie also umschalten, wie oben.
- Ein auf `'y'` gesperrter Baum verschachtelt trotzdem: Die Tiefe kommt dann vom Halten über der
Mitte einer Zeile.

<tip>

Nimm lieber `axis` als die Modifier `restrictToVerticalAxis` und `restrictToHorizontalAxis`. Sie
tun dasselbe, laufen aber als gewöhnliche Modifier mitten in der Kette, und ein Modifier danach
(ein Raster, das auf beiden Achsen einrastet) kann das Element wieder von der Achse bewegen.

</tip>

## Modifier

Ein Modifier passt in jedem Frame den Versatz des Drags an. Sein Ergebnis bewegt das Overlay
**und** ist der Punkt, an dem Ziele gesucht werden, also sortiert eine Liste nach der gesperrten,
begrenzten oder eingerasteten Position, und die `position` des Drops ist dort, wo die Box gelandet
ist.

<table>
<thead>
  <tr>
    <th>
      Modifier
    </th>
    
    <th>
      Was er tut
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Hält das Overlay in dem Container, in dem der Drag gestartet ist: der sortierbaren Liste oder dem Elternelement eines einfachen ziehbaren Elements.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(target)
      </code>
    </td>
    
    <td>
      Hält das Overlay in einem Element: einem Template-Ref, einem Getter oder dem Element selbst.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Hält das Overlay im Fenster.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Hält das Overlay im ersten scrollbaren Vorfahren des gezogenen Elements.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size)
      </code>
    </td>
    
    <td>
      Lässt das Overlay an einem Raster einrasten (unten).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Zentriert das Overlay unter dem Zeiger, statt den Greifversatz zu behalten.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      Bewegt nur vertikal. Nimm lieber <code>
        axis: 'y'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Bewegt nur horizontal. Nimm lieber <code>
        axis: 'x'
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`modifiers` ist eine Option des Providers, der Drag-Bereiche, der Listen und Bäume sowie der
ziehbaren und sortierbaren Elemente. Alle außer der des Providers nehmen auch ein Ref oder einen
Getter, gelesen beim Start des Drags.

### Drinnen halten

Die eigene Ansicht in einem Videocall bleibt auf dem Bildschirm. Schalte die Grenze um und ziehe
sie weit hinaus:

<example height="29rem" hint="Ziehe die eigene Ansicht mit jeder Grenze aus dem Bildschirm" name="bounds-pip">



</example>

```ts [SelfView.vue]
const { isDragging } = makeDraggable(el, {
  id: 'self-view',
  modifiers: () => props.modifiers, // [restrictToParent], [restrictToWindowEdges] or []
});
```

- `restrictToParent` hält sie auf dem Bildschirm, ihrem Elternelement. Bei einem sortierbaren
Element ist das „Elternelement“ seine Liste, wo auch immer die Liste im DOM sitzt.
- `restrictToWindowEdges` lässt sie den Bildschirm verlassen, aber nicht das Fenster. Außerhalb
des Bildschirms abgelegt, ist sie auf keinem Drop-Ziel, also fliegt sie zurück.
- Ohne Grenze geht sie überallhin.

Eine Grenze hält das **Overlay** drinnen, in der Größe, die es hat: Mit `overlayFit: 'slot'` wird
eine Box, die über einer Liste breiterer Elemente wächst, in ihrer neuen Größe drinnen gehalten.

### Am Raster einrasten

Die Knoten eines Flussdiagramms rasten am Raster der Zeichenfläche ein. Schalte die Zellgröße und
das Gleiten um:

<example height="29rem" hint="Ziehe einen Knoten; schalte grid und smooth um" name="snap-canvas">



</example>

```ts [FlowNode.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.node.id,
  modifiers: () => [snapToGrid({ x: props.grid, y: props.grid, smooth: props.smooth })],
});
```

`snapToGrid(24)` rastet beide Achsen auf 24-px-Zellen ein. Ein Objekt legt mehr fest:

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Bedeutung
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        x
      </code>
      
      , <code>
        y
      </code>
    </td>
    
    <td>
      Die Zellgröße in Pixeln, pro Achse. Lass eine weg, um nur die andere einrasten zu lassen: <code>
        { y: 15 }
      </code>
      
       rastet einen Termin auf Viertelstunden ein und lässt ihn frei über die Tage wandern.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      <code>
        'container'
      </code>
      
       (Standard): Die linke obere Ecke des Overlays landet auf Rasterlinien, die von der linken oberen Ecke des Containers aus gezogen sind – der sortierbaren Liste oder dem Elternelement eines einfachen ziehbaren Elements. <code>
        'delta'
      </code>
      
      : Der Versatz selbst wird gerundet, ein Element, das neben dem Raster gestartet ist, bleibt also neben dem Raster und bewegt sich um ganze Zellen von dort, wo es war. Nimm es für frei platzierte Elemente (eine freie Leinwand), die ihre eigene Ausrichtung behalten sollen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        smooth
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       oder <code>
        { duration, easing }
      </code>
      
      : Das Overlay gleitet zwischen den Zellen (standardmäßig 80 ms). Ziele nutzen die eingerastete Position sofort.
    </td>
  </tr>
</tbody>
</table>

Zeichne bei `origin: 'container'` das Raster ab der Border-Box des Containers: Die Zeichenfläche
oben hat ihren Rahmen als `box-shadow`, nicht als `border`, also beginnen ihre Linien direkt an
ihrem Rand.

### Ein eigener Modifier

Boxen auf einer Folie springen auf die Kanten und Mitten der anderen, wenn sie nahe kommen, und
pinkfarbene Hilfslinien zeigen die Linien, auf denen sie sitzen:

<example height="26rem" hint="Ziehe eine Box neben eine andere oder in die Mitte der Folie" name="magnet-guides">



</example>

```ts [Slide.vue]
import type { Modifier } from '@vue-dnd-kit/core';

/** Near a line, the box jumps onto it. */
const magnet: Modifier = ({ transform, overlayRect, containerRect, active }) => {
  if (!containerRect) return transform;
  const id = String(active.id);
  const left = overlayRect.left - containerRect.left;
  const top = overlayRect.top - containerRect.top;
  return {
    x: transform.x + pull(left, overlayRect.width, lines(id, 'x')),
    y: transform.y + pull(top, overlayRect.height, lines(id, 'y')),
  };
};

// In order: the magnet pulls, then the slide's edges hold.
const modifiers = [magnet, restrictToParent];
```

Ein Modifier bekommt `transform`, den Versatz zum Start des Drags, so wie ihn die Modifier davor
hinterlassen haben, und gibt einen neuen zurück. Er bekommt außerdem, was er zur Berechnung
brauchen kann:

<table>
<thead>
  <tr>
    <th>
      Argument
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
        transform
      </code>
    </td>
    
    <td>
      Der bisherige Versatz.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      Die Overlay-Box, um <code>
        transform
      </code>
      
       verschoben, in der Größe, die sie jetzt hat.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeRect
      </code>
    </td>
    
    <td>
      Das gezogene Element beim Start des Drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        containerRect
      </code>
    </td>
    
    <td>
      Der Container, in dem der Drag gestartet ist (die sortierbare Liste oder das Elternelement), dort, wo er jetzt ist: Er folgt dem Scrollen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        windowRect
      </code>
    </td>
    
    <td>
      Das Fenster.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      Der Zeiger beim Start des Drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
      
      , <code>
        over
      </code>
    </td>
    
    <td>
      Der Drag und das Ziel darunter.
    </td>
  </tr>
</tbody>
</table>

Modifier laufen in jedem Frame: Halte sie schnell und frei von Seiteneffekten. Die Hilfslinien
oben werden aus dem `delta` des Drags im `onDragMove` eines Monitors gezeichnet, das der Versatz
nach allen Modifiern ist. Typen unter [Modifier](https://zizigy.github.io/docs/api/modifiers).

## Die Reihenfolge

Modifier von mehreren Stellen laufen nacheinander, jeder auf dem Ergebnis des vorherigen:

1. die `modifiers` des Providers;
2. die `modifiers` des Drag-Bereichs, in dem der Drag gestartet ist;
3. die eigenen `modifiers` des gezogenen Elements oder, wenn es keine hat, die seiner Liste oder
seines Baums;
4. `restrictToArea` des Drag-Bereichs;
5. die `axis`-Sperre.

Innerhalb eines Arrays laufen sie der Reihe nach, setz also Einrasten und Magnete vor Grenzen: Eine
Grenze am Schluss hält die Box drinnen, was auch immer die anderen getan haben. Die Folie oben
führt `[magnet, restrictToParent]` aus; andersherum könnte der Magnet eine Box, die am Rand der
Folie gehalten wird, ein paar Pixel darüber hinausziehen.

Die `modifiers` eines Elements **ersetzen** die seiner Liste; sie kommen nicht hinzu. Die Grenzen
des Bereichs kommen nach dem Einrasten der Schritte 1–3, ein eingerastetes Element bleibt also
trotzdem drinnen, und die Achsensperre kommt ganz zum Schluss.

## Begrenzte Listen behalten ihre Enden

Ein Ebenen-Panel: Zeilen bewegen sich nur hoch und runter und verlassen das Panel nie. Ziehe die
oberste Zeile ganz nach unten:

<example height="26rem" hint="Ziehe Heading nach unten, über den Rand des Panels hinaus" name="bounded-layers">



</example>

```ts [Layers.vue]
const { items } = makeSortableList(list, { items: layers, axis: 'y', modifiers: [restrictToParent] });
```

Eine Grenze hält das Overlay am Rand der Box, während der Zeiger weitergeht. Sobald der Zeiger das
Overlay entlang der Achse der Liste verlassen hat, sortiert die Liste stattdessen nach dem Zeiger,
also bleiben der erste und der letzte Platz erreichbar, wie auch immer du das Element hältst.
Raster sortieren weiter nach dem Overlay: Am Rand gehalten, deckt es die Randzelle schon ab.

## Regeln für einen Teil der Seite

Zwei Bereiche, zwei Regelsätze. Sticker in Layout rasten an dessen Raster ein und können es nicht
verlassen; Sticker in Sketch gehen überallhin, auch in Layout. Ein Drag behält die Regeln des
Bereichs, in dem er gestartet ist, und der Bereich, dessen Regeln gelten, leuchtet auf.

<example height="25rem" hint="Ziehe einen Sticker in Layout, dann einen aus Sketch in Layout" name="drag-areas">



</example>

```vue [DragArea.vue]
<script setup lang="ts">
const area = useTemplateRef<HTMLElement>('area');
const { isDragging } = makeDragArea(area, {
  modifiers: () => (props.strict ? [snapToGrid(24)] : []),
  restrictToArea: () => props.strict,
});
</script>

<template>
  <div ref="area" class="area" :class="{ busy: isDragging }">
    <Sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker" />
  </div>
</template>
```

`makeDragArea` legt Regeln für die Drags fest, die **in seinem Element starten** – einfache
ziehbare Elemente und sortierbare Elemente gleichermaßen, die dann keine eigenen Regeln brauchen.
Behalte einen `DnDProvider` für die ganze App und gib einem Board, einer Zeichenfläche oder einem
Feed einen eigenen Bereich.

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
        axis
      </code>
    </td>
    
    <td>
      Sperrt die Drags auf eine Achse. Die eigene <code>
        axis
      </code>
      
       eines ziehbaren Elements oder die seiner Liste gewinnt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      Laufen nach denen des Providers und vor den eigenen des ziehbaren Elements.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      : Die Drags bleiben im Element des Bereichs.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      Auto-Scroll des Scroll-Containers des Bereichs (das Element oder sein nächster scrollbarer Vorfahr). <code>
        false
      </code>
      
       schaltet ihn dort ab.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      <a href="/docs/guides/sensors#activation-constraints">
        Aktivierung
      </a>
      
       je nach Zeigerart, etwa ein längeres Touch-Drücken in einem scrollenden Feed. Die eigene eines ziehbaren Elements gewinnt; die des Providers kommt zuletzt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Im Bereich startet kein Drag, auch nicht in den Bereichen darin. Seine ziehbaren Elemente melden <code>
        aria-disabled
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Jede Option nimmt einen Wert, ein Ref oder einen Getter, gelesen, wenn ein Drücken oder ein Drag
startet. Der Bereich gibt `isDragging` zurück (ein Drag, der hier gestartet ist, läuft, wie der
leuchtende Rahmen oben zeigt) und `isAutoScrolling` (Auto-Scroll bewegt seinen Container).
Vollständige Referenz: [makeDragArea](https://zizigy.github.io/docs/api/make-drag-area).

### Wie Bereiche zusammenspielen

- Ein Drag folgt dem Bereich, in dem er **gestartet ist**, auch nachdem er ihn verlassen hat. Über
einen Bereich zu fahren ändert nichts, außer an seinem `autoScroll`: Das gilt für jeden Drag,
der seinen Container scrollt.
- Verschachtelte Bereiche verschmelzen nicht: Der nächstgelegene gewinnt. `disabled` ist die
Ausnahme und wird vererbt: Ein abgeschalteter Bereich schaltet auch die Bereiche darin ab.
- Kollisionserkennung, Tastaturtasten und Ansagen bleiben providerweit.

<note>

Warum kein zweiter `DnDProvider` um das Board? Provider sind unabhängig: Ein Drag wechselt nie von
einem zum anderen, die Elemente des Boards könnten es also nie verlassen. Verschachtle einen
Provider nur, wenn ein Teil der Seite eigene providerweite Einstellungen braucht und seine
Elemente darin bleiben. Siehe [Der Provider](https://zizigy.github.io/docs/guides/provider).

</note>

## Dort lassen, wo es abgelegt wird

Die Zeitleiste, der Call, das Flussdiagramm, die Folie und die Bereiche oben lassen jedes Element
dort, wo es abgelegt wurde. Jedes Drag-Event trägt `position`: die linke obere Ecke der gezogenen
Box im Ziel, ab dessen Padding-Kante und mit dessen Scroll – das `left` und `top`, das ein absolut
positioniertes Element genau dorthin setzt. Es kommt nach den Modifiern, also landet ein
eingerasteter Knoten auf dem Raster.

```ts [Flowchart.vue]
makeDroppable(canvas, { id: 'canvas' });
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const node = nodes.value.find((item) => item.id === active.id);
    if (!node || over?.id !== 'canvas' || !position) return;
    node.x = Math.round(position.x);
    node.y = Math.round(position.y);
  },
});
```

Mehr zu freiem Ziehen und Drop-Zielen unter [Drag and Drop](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
