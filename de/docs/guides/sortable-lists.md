---
title: "Sortierbare Listen"
description: "Listen, Tab-Leisten und Raster, die sich beim Ziehen neu ordnen – makeSortableList rendert einen Entwurf, makeSortableItem macht die Zeilen, und der Drop schreibt die neue Reihenfolge in dein Ref. Handles, eine Drop-Linie, Tauschen."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/sortable-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="25rem" hint="Ziehe eine Ebene am Griff: Das Panel bewegt sich sofort, die Zeichenfläche beim Drop" name="layers-panel">



</example>

## Eine Liste und ihre Zeilen

Eine sortierbare Liste braucht zwei Komponenten: die Liste und ihre Zeile.

```vue [LayersPanel.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

const layers = defineModel<Layer[]>({ required: true });
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: layers });
</script>

<template>
  <ul ref="list">
    <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
  </ul>
</template>
```

```vue [LayerRow.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ layer: Layer }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.layer });
</script>

<template>
  <li ref="el">{{ layer.name }}</li>
</template>
```

Die Zeile registriert sich bei der Liste, in der sie gerendert wird. Eine Komponente kann
mehrere Listen anlegen (zwei Spalten, eine Liste in einer Liste): Jede Zeile gehört zu der,
deren Element sie enthält, bei Listen in Listen zur innersten.

## Der Entwurf

`makeSortableList` gibt `items` zurück, einen **Entwurf** deines Arrays. Während du ziehst,
ordnet sich der Entwurf live neu: Die gezogene Zeile nimmt ihren neuen Slot ein, und die
anderen gleiten aus dem Weg. Dein Array ändert sich bis zum Drop nicht. Dann schreibt die
Bibliothek die neue Reihenfolge hinein.

Das Ebenen-Panel oben zeigt beides: Das Panel rendert `items` und bewegt sich, während du
ziehst; die Zeichenfläche liest `layers`, das Array selbst, und stapelt sich erst um, wenn du
loslässt.

- Rendere `items`, nicht dein Array. Renderst du dein Array, bewegt sich bis zum Drop nichts.
- Das Schreiben passiert nach dem `onDrop` der Liste. In `onDrop` enthält dein Array noch die
alte Reihenfolge und `e.result` die neue.
- `layers` ist ein normales Ref (hier ein `defineModel`, und das Schreiben emittiert
`update:modelValue`), der Rest deiner App sieht die Änderung also wie jede andere.

```ts
makeSortableList(list, {
  items: layers,
  onDrop: (e) => {
    console.log(e.from.index, '→', e.to.index, e.result.get(e.to.list));
  },
});
```

<tip>

Ein Store, Serverzustand oder unveränderliche Daten? Übergib einen Getter oder ein `computed`
statt eines Refs. In eine schreibgeschützte Quelle schreibt die Bibliothek nicht: Ruf
`e.preventDefault()` auf und wende `e.result` selbst an. Siehe
[kontrollierte Listen](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

</tip>

## Schlüssel

Zeilen werden über ihre Daten identifiziert, nie über den Index oder eine automatische ID.
Standardmäßig ist der Schlüssel `item.id`, bei Strings und Zahlen das Element selbst.

```ts
// LayersPanel.vue: your items have another key
makeSortableList(list, { items: layers, getKey: (layer) => layer.uuid });

// LayerRow.vue: `item` is keyed with the list's getKey…
makeSortableItem(el, { item: () => props.layer });
// …or pass the key yourself
makeSortableItem(el, { id: () => props.layer.uuid });
```

- Nimm denselben Schlüssel im `v-for`: `:key="layer.uuid"`. Mit `:key="index"` animieren die
falschen Zeilen, und ihr Zustand springt zwischen den Zeilen.
- Schlüssel müssen über alle Listen hinweg eindeutig sein, die Elemente austauschen.
- Übergib `item` und `id` als Getter, damit eine Zeile synchron bleibt, wenn sich ihre Props
ändern.

## Handles

Standardmäßig startet die ganze Zeile einen Drag, außer den Buttons, Eingabefeldern und anderen
Bedienelementen darin: Das Auge und das Schloss einer Ebene bleiben einfache Buttons. Übergib
`handle`, um nur an einem Teil zu ziehen:

```vue [LayerRow.vue]
<script setup lang="ts">
makeSortableItem(el, { item: () => props.layer, handle: '.grip' });
</script>

<template>
  <li ref="el">
    <button type="button" class="grip" :aria-label="`Move ${layer.name}`">⠿</button>
    {{ layer.name }}
  </li>
</template>
```

- `handle` ist ein Selektor innerhalb des Elements oder ein Element-Ref.
- Ein Maus-Drag startet am Handle sofort, ohne die üblichen 4 px. Ein Druck ohne Bewegung
bleibt ein Klick: Das Handle kann bei `click` ein Menü öffnen.
- Das Handle bekommt die Attribute des Drags (`role`, `tabindex`, `aria-*`), und Drags per
Tastatur starten an ihm.

Mach das Handle zu einem `<button type="button">` mit einem `aria-label`: Es ist von sich aus
fokussierbar, und Screenreader sagen sein Label an. Ein nacktes `<span>` mit einem Icon
funktioniert auch (die Bibliothek gibt ihm `tabindex="0"` und `role="button"`), hat aber keinen
aussagekräftigen Namen.

<note>

Touch-Drags starten nach einem langen Drücken von 200 ms, damit die Seite weiter scrollen kann.
Um am Handle sofort zu ziehen, gib dem Handle `touch-action: none` und dem Element
`activation: { touch: { distance: 4 } }`.

</note>

## Strategien

`strategy` sagt, wie die Liste angeordnet ist, damit die Zeilen richtig Platz machen:

<table>
<thead>
  <tr>
    <th>
      <code>
        strategy
      </code>
    </th>
    
    <th>
      Für
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'vertical'
      </code>
      
       (Standard)
    </td>
    
    <td>
      Eine Spalte aus Zeilen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'horizontal'
      </code>
    </td>
    
    <td>
      Eine einzelne Zeile: Tabs, Chips, eine Zeitleiste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'grid'
      </code>
    </td>
    
    <td>
      CSS-Grids und umbrechende Flex-Zeilen, auch mit Elementen unterschiedlicher Größe.
    </td>
  </tr>
</tbody>
</table>

Eine Reihe von Tabs ist eine horizontale Liste:

<example height="23rem" hint="Ziehe die Tabs; schließe einen oder öffne einen neuen" name="browser-tabs">



</example>

```ts [Browser.vue]
const { items } = makeSortableList(strip, {
  items: tabs,
  strategy: 'horizontal',
  axis: 'x',        // the tabs stay on their row
  animateChanges: true, // the buttons open and close tabs: slide the others then too
});
```

Der Schließen-Button des Tabs funktioniert im ziehbaren Tab weiter, und ein Klick, der einen
Drag beendet, wählt keinen Tab aus. Zeilen gleiten beim Ziehen von selbst; `animateChanges` ergänzt
dasselbe für Änderungen, die kein Drag gemacht hat, hier die der Buttons (siehe
[Animationen](https://zizigy.github.io/docs/guides/animations)).

Ein Raster sortiert in zwei Dimensionen, mit Kacheln jeder Größe:

<example height="31rem" hint="Ziehe ein Foto, auch das große" name="photo-grid">



</example>

```ts [PhotoGrid.vue]
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });
```

```css
.grid { display: grid; grid-template-columns: repeat(4, 76px); grid-auto-rows: 76px; grid-auto-flow: dense; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
```

`grid-auto-flow: dense` hält das Raster dicht gepackt, wenn sich eine große Kachel bewegt. Ohne
das lässt das Raster Löcher, wo eine Kachel nicht mehr passt, und wächst um eine Zeile.

## Die Achse sperren

```ts
makeSortableList(list, { items: layers, axis: 'y' });
```

`axis: 'y'` hält den Drag auf der vertikalen Achse, `'x'` auf der horizontalen: Die Ebenen und
die Tabs oben nutzen das. Die eigene `axis` eines Elements gewinnt gegen die seiner Liste. Um
den Drag zusätzlich in der Liste zu halten, füge den Modifier `restrictToParent` hinzu. Mehr
unter [Achsen, Grenzen und Raster](https://zizigy.github.io/docs/guides/constraints).

## Den Slot stylen

Die gezogene Zeile bleibt als der Slot, in dem sie landen wird, in der Liste und bekommt
`data-dnd-placeholder`. Der Standardstil blendet sie auf 40 % ab, mit Spezifität null, also
gewinnt jede deiner Regeln:

```css [LayerRow.vue]
.layer[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.layer[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}
```

`makeSortableItem` gibt denselben Zustand als Refs zurück, plus ein paar weitere:

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
        isPlaceholder
      </code>
    </td>
    
    <td>
      Diese Zeile ist der Slot, in dem ein gezogenes Element landen wird.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      Diese Zeile wird gezogen (bei einem Multi-Drag jede gezogene Zeile).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      Ihr Index im Entwurf: Er ändert sich während des Ziehens.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Beschreibbar, an die Auswahl des Providers gebunden.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        indicator
      </code>
    </td>
    
    <td>
      Im <a href="#an-insertion-line">
        Indikator-Modus
      </a>
      
      , wo die Linie hinkommt.
    </td>
  </tr>
</tbody>
</table>

Die Liste gibt `isOver` und `isAccepting` für ihre eigene Hervorhebung zurück, außerdem
`activeKey` und `activeIndex`, das gezogene Element und seinen Platz im Entwurf dieser Liste.
Jeder Zustand, mit Live-Demos, steht unter [Styling](https://zizigy.github.io/docs/guides/styling).

## Dinge abschalten

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Was sie stoppt
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       an einem Element
    </td>
    
    <td>
      Dieses Element lässt sich nicht ziehen. Die anderen bewegen sich trotzdem an ihm vorbei: Sperre oben eine Ebene und ziehe dann eine andere darüber.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       an der Liste
    </td>
    
    <td>
      Keine Drags heraus, keine Drops hinein.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sort: false
      </code>
      
       an der Liste
    </td>
    
    <td>
      Ihre Elemente lassen sich darin nicht neu ordnen, können sie aber verlassen: eine Palette, siehe <a href="/docs/guides/shared-lists#what-goes-in-and-out-pull-and-put">
        Listen mit gemeinsamen Elementen
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Alle nehmen einen Getter oder ein Ref und gelten ab dem nächsten Drag:

```ts [LayerRow.vue]
makeSortableItem(el, { item: () => props.layer, handle: '.grip', disabled: () => props.layer.locked });
```

Eine Zeile, die immer erste oder letzte bleiben muss, egal was die anderen tun, ist gar kein
Element: Rendere sie außerhalb der Liste. Die Ebene „Background“ des Panels sitzt unterhalb
des `<ul>`.

## Nur einen Teil der Elemente zeigen

Ein Suchfeld, ein Tag: `filter` zeigt die Elemente, für die es `true` zurückgibt, und ein Drag
sortiert unter diesen. Die anderen bleiben in deinem Array, an ihren Plätzen:

<example height="27rem" hint="Wähle einen Tag oder suche, dann ziehe eine Aufgabe: Das Array behält die ausgeblendeten an ihrem Platz" name="filtered-list">



</example>

```ts [Backlog.vue]
const query = ref('');
const tag = ref<Tag | null>(null);

const { items } = makeSortableList(list, {
  items: tasks,
  filter: (task) => (!tag.value || task.tag === tag.value) && task.title.includes(query.value),
});
```

- `items` enthält die passenden Elemente: Rendere es wie gewohnt. Der Filter ist reaktiv:
Tippen im Suchfeld aktualisiert die Liste sofort.
- Der Drop schreibt das ganze Array. Jedes ausgeblendete Element bleibt direkt hinter dem
gezeigten Element, dem es folgte; ist genau dieses das bewegte, bleibt es hinter dem nächsten
davor, das sich nicht bewegt hat.
- `e.to.index` und `activeIndex` der Liste zählen die gezeigten Elemente. `e.result` enthält
das ganze Array, die ausgeblendeten Elemente eingeschlossen.

<note>

Ein `computed`, das dein Array filtert und als `items` übergeben wird, funktioniert auch, ist
aber nur lesbar: Du müsstest `e.result` selbst anwenden und selbst ausrechnen, wohin die
ausgeblendeten Elemente gehören. `filter` erledigt beides.

</note>

## Eine Einfügelinie

Mit `placeholder: 'indicator'` bleibt die Liste beim Ziehen still, und eine Linie zeigt, wohin
der Drop geht. Die Linie zeichnest du:

<example height="27rem" hint="Ziehe ein Issue: Eine Linie zeigt, wohin es kommt" name="issue-table">



</example>

```ts [IssueTable.vue]
const { items, indicator } = makeSortableList(body, { items: issues, placeholder: 'indicator' });
```

```vue [IssueRow.vue]
<script setup lang="ts">
const { indicator } = makeSortableItem(el, { item: () => props.issue });
</script>

<template>
  <div ref="el" class="row" :class="indicator && `drop-${indicator.side}`">…</div>
</template>

<style scoped>
.row.drop-before::before { content: ''; position: absolute; top: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
.row.drop-after::before { content: ''; position: absolute; bottom: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Feld von <code>
        indicator
      </code>
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
        list
      </code>
    </td>
    
    <td>
      Die Liste, in die der Drop geht.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      Der Einfügeindex in der Liste, wie sie gerendert ist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        key
      </code>
    </td>
    
    <td>
      Das Element, an dem die Linie hängt; <code>
        null
      </code>
      
       in einer leeren Liste (zeichne sie dann in der Liste).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        side
      </code>
    </td>
    
    <td>
      <code>
        'before'
      </code>
      
       oder <code>
        'after'
      </code>
      
       dieses Elements; <code>
        'swap'
      </code>
      
       in einer Liste, die <a href="#swap-instead-of-shift">
        tauscht
      </a>
      
      . Bäume ergänzen <code>
        'inside'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
      
      , <code>
        parentKey
      </code>
    </td>
    
    <td>
      Nur Bäume: wo der Drop landet. Siehe <a href="/docs/guides/trees#an-insertion-line">
        Bäume
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

- Das `indicator` der Liste ist gesetzt, solange die Linie in dieser Liste ist (die Tabelle gibt
es aus), und das `indicator` eines Elements, solange die Linie an diesem Element hängt.
- Die gezogene Zeile bleibt, wo sie war, als Platzhalter markiert: Blende sie ab.
- Die Tastatur bewegt die Linie ebenfalls.
- Ein Drop außerhalb aller Ziele bricht in diesem Modus ab (`dropOutside: 'cancel'`), da die
Liste nie eine andere Reihenfolge gezeigt hat.
- Das Overlay verdeckt einen Teil der Zeile darunter. Mach es ein wenig durchsichtig, dann
scheint die Linie durch: `[data-dnd-overlay] .row { opacity: 0.85 }`.

## Tauschen statt verschieben

Mit `behavior: 'swap'` tauscht das gezogene Element den Platz mit dem darunter, und die anderen
bleiben, wo sie sind:

<example height="29rem" hint="Tausche zwei Personen, auch über die Spalten hinweg; probiere On drop" name="on-call">



</example>

```ts [Rotation.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'rotation',
  behavior: 'swap',
  placeholder: () => props.placeholder,   // 'item' (live) or 'indicator' (on drop)
  onDrop: (e) => {
    if (e.partner) emit('swap', `${e.items[0]?.name} ⇄ ${e.partner.item.name}`);
  },
});
```

- **Live** (`placeholder: 'item'`, Standard): Der Tausch ist beim Ziehen zu sehen. Zurückziehen
oder die Liste verlassen macht ihn rückgängig.
- **Beim Drop** (`placeholder: 'indicator'`): Bis zum Drop bewegt sich nichts. Der Indikator
markiert das Element, mit dem der Drop tauscht, `side: 'swap'`: Umrande dieses Element, statt
eine Linie zu zeichnen. Die Pfeiltasten bewegen die Markierung von Element zu Element; zurück
auf dem gezogenen Element gibt es keine.

```vue [PersonCell.vue]
<li ref="el" :class="{ target: indicator?.side === 'swap' }">…</li>
```

Das Drop-Event hat `mode: 'swap'` und `partner`, das Element, mit dem getauscht wurde: seinen
`key`, `item` und sein eigenes `from` und `to`. Zwei Listen einer Gruppe tauschen untereinander,
wenn beide `behavior: 'swap'` haben, wie die zwei Spalten. Das überfahrene Element wandert dann
in die andere Liste, es muss also hinaus (`group.pull`) und hinein (`group.put`) dürfen: siehe
[Listen mit gemeinsamen Elementen](https://zizigy.github.io/docs/guides/shared-lists). Ein Multi-Drag sortiert, statt zu
tauschen.

## Tastatur

Fokussiere eine Zeile oder ihr Handle und drücke <kbd value="Space">



</kbd>

 oder <kbd value="Enter">



</kbd>

,
um sie aufzunehmen. Die Pfeile entlang der Liste bewegen sie um einen Slot, in Rastern gehen
hoch und runter in die nächste Zeile, und die Pfeile quer zur Liste bewegen sie in die nächste
Liste ihrer Gruppe. Hinter dem Ende einer Liste geht der Pfeil weiter in die nächste Liste in
dieser Richtung (Listen übereinander), sonst auf ein Drop-Ziel dort, etwa eine Papierkorb-Zone.
Drücke erneut <kbd value="Space">



</kbd>

 oder <kbd value="Enter">



</kbd>

 zum Ablegen,
<kbd value="Escape">



</kbd>

, um sie zurückzustellen. Jede Demo auf dieser Seite funktioniert so. Die
Screenreader-Texte stehen unter [Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility).

## Animationen

Zeilen gleiten beim Ziehen an ihre neuen Plätze, und die abgelegte Zeile landet auf ihrem Slot.
Die Liste selbst wächst oder schrumpft auf ihre neue Größe, wenn Zeilen hinzukommen und gehen
(`animateSize`). Das ist standardmäßig an und braucht keinen Code. Umschließe Zeilen nicht mit
`<TransitionGroup>`: Bewegungen würden doppelt animiert. Setz auch keine CSS-`transition` auf das
`transform` der Zeilen. Für Änderungen, die kein Drag gemacht hat (Hinzufügen, Entfernen,
Mischen), schalte die Option `animateChanges` der Liste ein, wie es die Tabs tun. Siehe
[Animationen](https://zizigy.github.io/docs/guides/animations).

Die vollständige Liste der Optionen steht in der API von
[makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list) und
[makeSortableItem](https://zizigy.github.io/docs/api/make-sortable-item).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
