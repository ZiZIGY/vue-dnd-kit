---
title: "Einführung"
description: "Vue DnD Kit ist Drag and Drop für Vue 3 – sortierbare Listen, Kanban-Boards, Bäume, Multi-Drag und Drop-Zonen, von Haus aus animiert und barrierefrei."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/introduction"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Vue DnD Kit ist Drag and Drop für Vue 3. Sortierbare Listen, Kanban-Boards, Bäume, Multi-Drag,
Kopieren und Drop-Zonen – von Haus aus animiert, per Tastatur bedienbar und für Screenreader
angesagt, in deinem eigenen Markup.

<example height="27rem" hint="Verschiebe Stopps zwischen den Tagen; die Chips unten nennen die anderen Gesten" name="at-a-glance" title="Auf einen Blick">



</example>

Nichts davon ist eigener Code der Demo: Die Listen ordnen sich live neu, die Spalten tauschen
Stopps (eine `group`), eine Auswahl wandert gemeinsam (`selected`), <kbd value="Alt">



</kbd>

 macht aus
dem Verschieben ein Kopieren (`clone`), und die Tastatur kann das alles von Slot zu Slot. Die
Demo rendert die Stopps und übergibt ein paar Optionen.

## Was es ist

Eine Sammlung von **Composables** und eine **Provider**-Komponente. Du renderst deine eigenen
Elemente und übergibst ihre Template-Refs an die Composables; um den Rest kümmert sich die
Bibliothek: Eingaben per Zeiger, Touch und Tastatur, die Suche nach dem Ziel, das Neuordnen,
Animationen, Auto-Scroll und die Mitteilung an Screenreader, was passiert ist.

```vue [Day.vue]
<script setup lang="ts">
const listRef = useTemplateRef<HTMLElement>('list');
// `items` is the draft: it reorders while you drag. On drop, `day.stops` gets the new order.
const { items } = makeSortableList(listRef, { items: toRef(props.day, 'stops'), group: 'trip' });
</script>

<template>
  <ul ref="list">
    <StopCard v-for="stop in items" :key="stop.id" :stop="stop" />
  </ul>
</template>
```

Selbst rendert sie nichts außer einem schwebenden **Overlay** – standardmäßig einem Klon des
gezogenen Elements. Dein Markup und deine Styles bleiben deine: Die Bibliothek ergänzt
ARIA-Attribute und ein paar `data-dnd-*`-Attribute, um die Zustände eines Drags zu stylen.

## Was du bekommst

- **Sortierbare Listen und Raster**, die sich schon während des Ziehens neu ordnen – vertikal,
horizontal oder im Raster.
- **Listen mit gemeinsamen Elementen**: Kanban-Boards, Paletten, die Kopien ausgeben, Tauschen,
Regeln dafür, was wohin darf.
- **Bäume** mit Verschachtelung per Ziehen zur Seite oder per Hovern über einer Zeile,
Tiefenbegrenzung und Regeln.
- **Multi-Drag** mit deiner eigenen Auswahl (Strg/Cmd-Klick, ein Auswahlrahmen): Der Block bewegt
sich gemeinsam.
- **Drop-Zonen** mit Annahmeregeln, und Drops, die du bestätigst, ablehnst oder selbst anwendest.
- **Animationen von Haus aus**: Elemente gleiten an ihre neuen Plätze, der Drop landet in seinem
Slot, ein Abbruch fliegt zurück.
- **Barrierefreiheit**: Ziehen per Tastatur von Slot zu Slot, Live-Ansagen, ARIA-Attribute.
- **Virtuelle Listen** mit TanStack Virtual oder VueUse: Tausende Zeilen.
- **Sensoren und Actions**: deine eigenen Eingabegeräte und Drags, die per Code gesteuert werden.
- **DevTools**: ein Tab mit einer Live-Karte jeder Liste, einem Joystick und einem Log jedes Drags.

## Was es anders macht

- **Deine Daten bleiben bis zum Drop deine.** Du renderst einen *Entwurf* deines Arrays. Während
des Ziehens bewegt sich nur der Entwurf; beim Drop schreibt die Bibliothek die neue Reihenfolge
in dein Ref oder gibt dir `e.result`, damit du es selbst anwendest (Stores, Server, Rückgängig).
- **Keine Wrapper-Komponenten.** Zeilen sind deine Elemente, mit einem Ref und einem Aufruf,
sodass die Komponenten eines UI-Kits (Nuxt UI, Vuetify, dein eigenes) so gezogen werden, wie
sie sind.
- **Von Haus aus animiert, aber nie im Weg.** Neuordnen, Landen und Abbrechen sind von Anfang an
animiert; schalte es ab, passe es an oder übergib es an GSAP oder motion.
- **Die Tastatur ist kein Nachgedanke.** Jeder Drag geht mit <kbd value="Space">



</kbd>

 und den
Pfeiltasten, Bewegungen werden angesagt, und der Fokus kehrt dorthin zurück, wo er war.
- **Ein Provider für die ganze App.** Bereiche geben Teilen der Seite eigene Regeln (eine Achse,
Grenzen, ein Raster, ein längeres Drücken), sodass verschachtelte Features keine
verschachtelten Provider brauchen.
- **Die Eingabe ist austauschbar.** Zeiger und Tastatur sind Sensoren; schreib deinen eigenen für
ein Gamepad oder einen Sprachbefehl, oder verschiebe Elemente per Code mit
`@vue-dnd-kit/actions`.

## Wie alles zusammenpasst

<table>
<thead>
  <tr>
    <th>
      Baustein
    </th>
    
    <th>
      Was er macht
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
      Verantwortet den Drag: Eingabe, Overlay, Auswahl, Auto-Scroll, Ansagen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
       / <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      Eine Liste, die sich neu ordnet, und ihre Zeilen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      Ein Baum, flach gerendert mit Tiefen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
       / <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      Freies Ziehen und Drop-Zonen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      Regeln für einen Teil der Seite: Achse, Grenzen, Einrasten, Auto-Scroll, Aktivierung.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      Auswahl per Auswahlrahmen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD
      </code>
      
       / <code>
        useDnDMonitor
      </code>
    </td>
    
    <td>
      Der Zustand des Drags und seine Events, überall unterhalb des Providers.
    </td>
  </tr>
</tbody>
</table>

<tip>

Kommst du von v2? Die API hat sich geändert: Aus `useDnDProvider` wurde `useDnD`, aus
`makeConstraintArea` und `makeAutoScroll` wurde `makeDragArea`. Sortierbare Listen sind jetzt
eingebaut.

</tip>

## Voraussetzungen

- Vue **3.5** oder neuer.
- Moderne Browser: Chrome und Edge 104+, Safari 15.4+, Firefox 104+.
- Funktioniert mit SSR und Nuxt: Das Overlay und die Live-Region werden auf dem Client gemountet.

Weiter: [Installiere es](https://zizigy.github.io/docs/getting-started/installation) und baue dann im
[Schnellstart](https://zizigy.github.io/docs/getting-started/quick-start) eine erste Liste.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
