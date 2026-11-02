---
title: "Bäume"
description: "Gliederungen, Menüs, Organigramme und Backlogs mit makeSortableTree – flach mit Tiefen gerendert, verschachtelt durch seitliches Ziehen oder Halten über einer Zeile, mit Regeln, eingeklappten Knoten, einer Einfügelinie und Listen in derselben Gruppe."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/trees"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Ein Baum ist eine sortierbare Liste, deren Zeilen Tiefen haben. Ziehe einen Abschnitt nach links
oder rechts, um seine Ebene zu ändern, oder halte ihn über der Mitte eines anderen Abschnitts, um
ihn darin abzulegen. Die Nummern folgen dem Drag.

<example height="45.5rem" hint="Ziehe einen Abschnitt seitwärts oder wechsle den Verschachtelungsmodus" name="tree-outline">



</example>

## Flach gerendert

`makeSortableTree` nimmt deine verschachtelten Daten und gibt die sichtbaren Knoten als
**flache Liste** zurück, in Reihenfolge, jeden mit seiner `depth`. Du renderst diese Liste und
rückst die Zeilen selbst ein. Jede Zeile bleibt ein Geschwister in einem Container, also gleiten
und animieren die Zeilen wie die Zeilen einer Liste.

```vue [Outline.vue]
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree } from '@vue-dnd-kit/core';
import Heading from './Heading.vue';

interface Section { id: string; title: string; children?: Section[] }

const outline = ref<Section[]>([
  { id: 'start', title: 'Getting started', children: [{ id: 'install', title: 'Installation' }] },
  { id: 'faq', title: 'FAQ' },
]);

const root = useTemplateRef<HTMLElement>('root');
const { items, projected } = makeSortableTree(root, {
  items: outline,     // the root nodes: a writable ref takes every drop
  indentation: 24,    // px per level: match the rows' indentation
  maxDepth: 2,
});
</script>

<template>
  <ol ref="root">
    <Heading v-for="node in items" :key="node.key" :node="node" />
  </ol>
</template>
```

```vue [Heading.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';

const props = defineProps<{ node: FlatNode<{ id: string; title: string }> }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <li ref="el" :style="{ marginInlineStart: `${node.depth * 24}px` }">{{ node.item.title }}</li>
</template>
```

Zeilen nutzen `makeSortableItem`, wie die Zeilen einer Liste. Rücke sie mit einem Margin ein,
nicht mit einem Padding: Dann bewegt sich die Zeile selbst mit ihrer Tiefe. Das Overlay
übernimmt die Breite des Slots und landet auf seiner Ebene, und ein Wechsel der Tiefe gleitet
wie jede andere Bewegung. Ein Padding würde nur einrücken, was in der Zeile steht, und das
Overlay, eine Kopie der Zeile beim Aufnehmen, bliebe auf der Ebene, auf der der Drag begann.
`items` enthält `FlatNode`s:

<table>
<thead>
  <tr>
    <th>
      Feld von <code>
        FlatNode
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
        key
      </code>
    </td>
    
    <td>
      Der Schlüssel des Knotens (<code>
        getKey
      </code>
      
      , Standard <code>
        node.id
      </code>
      
      ). Nimm ihn für <code>
        :key
      </code>
      
       und die <code>
        id
      </code>
      
       der Zeile.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        item
      </code>
    </td>
    
    <td>
      Dein Knoten.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
       für Wurzeln. Die Tiefe des gezogenen Knotens ist die, auf der er landen <strong>
        würde
      </strong>
      
      , also rückt sein Slot live ein.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        parentKey
      </code>
    </td>
    
    <td>
      Der Schlüssel des Elternknotens, <code>
        null
      </code>
      
       für Wurzeln.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      Der Index unter seinen Geschwistern.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hasChildren
      </code>
      
      , <code>
        collapsed
      </code>
    </td>
    
    <td>
      Für einen Aufklapp-Button.
    </td>
  </tr>
</tbody>
</table>

Da `items` der Entwurf ist, folgt alles, was du daraus berechnest, dem Drag: Die Demo nummeriert
ihre Abschnitte aus `items`, also wird „2.1“ zu „3.1“, während du ziehst. `projected` ist, wo der
gezogene Knoten landen würde, `{ depth, parentKey }`, oder `null`, solange er nicht über diesem
Baum ist.

Kinder werden aus `node.children` gelesen und dorthin geschrieben. Daten mit einer anderen Form
nehmen `getChildren` und `setChildren`; das [Organigramm](#rules) unten hält sie in `members`:

```ts
makeSortableTree(root, {
  items: org,
  getChildren: (member) => member.members,
  setChildren: (member, members) => { member.members = members; },
});
```

## Verschachteln

Ein Drag ändert die Tiefe auf zwei Arten, beide standardmäßig an:

<table>
<thead>
  <tr>
    <th>
      <code>
        nesting
      </code>
    </th>
    
    <th>
      Die Tiefe kommt aus …
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'offset'
      </code>
    </td>
    
    <td>
      Seitlichem Ziehen: Alle <code>
        indentation
      </code>
      
       Pixel nach links oder rechts sind eine Ebene höher oder tiefer, so weit es die Zeilen um den Slot herum zulassen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'hover'
      </code>
    </td>
    
    <td>
      Halten des Drags über der Mitte einer Zeile: Der Drop geht in sie hinein, als ihr erstes Kind.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'both'
      </code>
    </td>
    
    <td>
      Beidem. Der Standard.
    </td>
  </tr>
</tbody>
</table>

Setze `indentation` auf das, was deine Zeilen pro Ebene einrücken (standardmäßig `24`), damit der
Slot dem Zeiger folgt: Schalte in der Demo auf `40` und ziehe seitwärts. Mit `'hover'` allein
behält ein seitlicher Drag die Ebene, und nur die Mitte einer Zeile verschachtelt. Beide Optionen
nehmen ein Ref oder einen Getter und gelten ab dem nächsten Drag.

Mit `axis: 'y'` (oder `restrictToVerticalAxis`) kann sich der Drag nicht seitwärts bewegen, aber
Zeilen verschachteln sich trotzdem durch Halten.

## Regeln

Engineering nimmt Personen und Teams an; Leadership ist gesperrt; nichts geht tiefer als ein Team
in einem Team. Klappe die Teams auf und zu: Die Zeilen, die sie zeigen und verbergen, gleiten
herein und hinaus.

<example height="41rem" hint="Verschiebe Personen zwischen Teams; probiere Leadership und eine dritte Ebene" name="tree-org">



</example>

```ts [OrgTree.vue]
const { items } = makeSortableTree(root, {
  items: org,
  getChildren: (member) => member.members,
  setChildren: (member, members) => { member.members = members; },
  // Only teams take members, and a locked team takes no one.
  canNest: (_member, team) => team.kind === 'team' && !team.locked,
  maxDepth: 2,
  collapsed,
  animate: true,
});
```

```ts [OrgRow.vue]
// A locked row doesn't drag (and says so with `aria-disabled`).
makeSortableItem(el, { id: () => props.node.key, disabled: () => !!props.node.item.locked });
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Begrenzt
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        canNest(node, parent)
      </code>
    </td>
    
    <td>
      Ob <code>
        node
      </code>
      
       unter <code>
        parent
      </code>
      
       darf. Ein Multi-Drag fragt für jeden gezogenen Knoten. Wurzeln sind immer erlaubt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxDepth
      </code>
    </td>
    
    <td>
      Die tiefste erlaubte Tiefe, Wurzeln sind <code>
        0
      </code>
      
      . Die Nachkommen des gezogenen Knotens zählen mit: Ein Team mit Mitgliedern geht nicht tiefer als <code>
        maxDepth - 1
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
      An einer Zeile: Sie lässt sich nicht ziehen. Am Baum: Nichts wird aus ihm gezogen oder in ihn abgelegt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        group.put
      </code>
    </td>
    
    <td>
      Ob der Baum überhaupt Elemente aus anderen Listen und Bäumen annimmt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Alles andere, beim Drop entschieden: siehe <a href="/docs/guides/drop-decisions">
        Über einen Drop entscheiden
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Wenn eine Regel eine Tiefe ablehnt, nimmt der Slot die tiefste Tiefe, die durchgeht: Ziehe Noor
unter Raj und nach rechts, und der Slot bleibt auf der obersten Ebene, da Leadership gesperrt und
Raj eine Person ist. Wo keine Tiefe durchgeht, bewegt sich der Slot nicht dorthin. Kopien und
Knoten aus `createItem` folgen ebenfalls `canNest` und `maxDepth`.

### Eingeklappte Knoten

`collapsed` ist ein `Set` von Schlüsseln, deren Kinder verborgen sind, als Ref oder Getter. Ihre
Kinder sind nicht in `items`; `node.collapsed` und `node.hasChildren` steuern den Button:

```ts
const collapsed = ref(new Set<Key>());
const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
```

Ein gezogener Knoten nimmt seinen ganzen Teilbaum mit, eingeklappt oder nicht. Mit
`animate: true` animieren die Zeilen, die ein Knoten beim Auf- oder Zuklappen zeigt oder
verbirgt, herein und hinaus, ebenso Änderungen an den Daten, die kein Drag gemacht hat.

## Eine Einfügelinie

Ziehe eine Vorlage von links ins Menü oder verschiebe einen Eintrag: Das Menü bleibt still, und
eine Linie zeigt, wohin der Drop geht, beginnend auf der Ebene, auf der er landet. Über der Mitte
einer Seite oder Gruppe leuchtet stattdessen die Zeile auf.

<example height="31rem" hint="Ziehe eine Vorlage ins Menü oder verschiebe einen Eintrag seitwärts" name="tree-menu">



</example>

Mit `placeholder: 'indicator'` bewegt sich der Baum beim Ziehen nicht. Jede Zeile liest ihr
`indicator` und zeichnet die Linie:

```vue [MenuRow.vue]
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';

const props = defineProps<{ node: FlatNode<MenuItem>; indent: number }>();
const el = useTemplateRef<HTMLElement>('el');
const { indicator } = makeSortableItem(el, { id: () => props.node.key });

// 'inside': the drop goes into this row. Otherwise a line before or after it.
const inside = computed(() => indicator.value?.side === 'inside');
const line = computed(() => {
  const value = indicator.value;
  if (!value || value.side === 'inside') return null;
  // From the level the drop lands at, measured from this row's own level.
  return { side: value.side, left: `${((value.depth ?? 0) - props.node.depth) * props.indent}px` };
});
</script>

<template>
  <div ref="el" class="item" :class="{ inside }" :style="{ marginLeft: `${node.depth * indent}px` }">
    {{ node.item.title }}
    <span v-if="line" class="line" :class="line.side" :style="{ left: line.left }" />
  </div>
</template>

<style scoped>
.item { position: relative; }
.item.inside { box-shadow: 0 0 0 1.5px #42b883; }
.line { position: absolute; right: 0; height: 2px; background: #42b883; }
.line.before { top: -3px; }
.line.after { bottom: -3px; }
</style>
```

`indicator` ergänzt in Bäumen `depth` und `parentKey`: die Ebene und den Elternknoten, die die
abgelegten Knoten bekommen. Seitliches Ziehen bewegt die Linie zwischen Ebenen, und die Tastatur
bewegt die Linie ebenfalls. In diesem Modus bricht ein Drop außerhalb des Baums ab.

Die Vorlagen sind einfache ziehbare Elemente (`makeDraggable`) mit `data`. Der Baum macht aus
ihnen mit `createItem` neue Knoten, an Position und Tiefe der Linie:

```ts [MenuTree.vue]
let created = 0;
makeSortableTree(root, {
  items: menu,
  placeholder: 'indicator',
  maxDepth: 1,
  canNest: (_item, parent) => parent.kind !== 'link',
  createItem: (active) => {
    const template = active.data as { title: string; kind: MenuItem['kind'] };
    return { id: `new-${++created}`, title: `New ${template.title.toLowerCase()}`, kind: template.kind };
  },
});
```

Die Leiste über dem Menü rendert `menu`, die gespeicherten Daten, nicht `items`: Sie ändert sich
nur beim Drop.

## Bäume und Listen in einer Gruppe

Eine Story, die ins Backlog verschoben wird, behält ihre Aufgaben, unsichtbar, und bringt sie
zurück in die Roadmap. Halte beim Ziehen aus der Roadmap <kbd value="Alt">



</kbd>

 gedrückt, um
stattdessen zu kopieren.

<example height="29.5rem" hint="Verschiebe Saved cards ins Backlog und zurück; Alt kopiert" name="tree-backlog">



</example>

Ein Baum und eine Liste mit derselben `group` tauschen Knoten aus, wie es zwei Listen tun. Ein
Knoten behält seinen Teilbaum, wohin er auch geht: Die Liste zeigt ihn nur nicht. Dieselbe
Zeilenkomponente dient beiden, da `makeSortableItem({ item })` über die Liste oder den Baum
identifiziert wird, dem die Zeile gehört.

Kopien funktionieren wie in Listen (`clone`, `pull: 'clone'`, die Kopiertaste), aber `clone` muss
die Kopie **mit ihrem ganzen Teilbaum** zurückgeben, und jeder Knoten darin braucht einen neuen
Schlüssel:

```ts [Roadmap.vue]
let copies = 0;
const copy = (work: Work): Work => ({ ...work, id: `${work.id}-copy-${++copies}`, children: work.children?.map(copy) });

makeSortableTree(root, {
  items: roadmap,
  group: 'work',
  canNest: (work, parent) => RANK[parent.kind] < RANK[work.kind],
  maxDepth: 2,
  clone: copy,
});
```

Siehe [Listen mit gemeinsamen Elementen](https://zizigy.github.io/docs/guides/shared-lists) zu Gruppen, Kopieren und
`createItem`.

## Der Drop

Das Drop-Event des Baums ist das einer Liste, mit `parentKey` in `from` und `to`:

```ts
makeSortableTree(root, {
  items: outline,
  onDrop: (e) => {
    console.log(e.keys, e.from.parentKey, '→', e.to.parentKey, e.to.index);
  },
});
```

`to.index` ist die Position unter den neuen Geschwistern, gezählt, nachdem der Knoten seinen
alten Platz verlassen hat. Beim Drop gibt die Bibliothek den geänderten Knoten ihre neuen Kinder
(`setChildren`) und schreibt ein neues Wurzel-Array in dein Ref.

`e.result.get(treeId)` ist der neue Baum als neues Wurzel-Array: Die Knoten auf den geänderten
Pfaden sind Kopien, unberührte Teilbäume werden geteilt, und deine Knoten bleiben, wie sie sind.
Für einen Store oder unveränderliche Daten übergib einen Getter, ruf `e.preventDefault()` auf und
speichere `e.result` (siehe
[Über einen Drop entscheiden](https://zizigy.github.io/docs/guides/drop-decisions#stores-and-servers-controlled-lists)).
Kopien werden mit `withChildren(node, children)` erzeugt, standardmäßig `{ ...node }` mit den
neuen Kindern; übergib für Klasseninstanzen deine eigene Funktion.

## Tastatur und Multi-Drag

Fokussiere eine Zeile, drücke <kbd value="Space">



</kbd>

 und dann:

<table>
<thead>
  <tr>
    <th>
      Taste
    </th>
    
    <th>
      Bewegt den Knoten
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="ArrowUp">
        
      </kbd>
      
       / <kbd value="ArrowDown">
        
      </kbd>
    </td>
    
    <td>
      In den Slot darüber oder darunter, Zeile für Zeile.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="ArrowRight">
        
      </kbd>
    </td>
    
    <td>
      Eine Ebene tiefer, unter die Zeile darüber, wo die Regeln es erlauben.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="ArrowLeft">
        
      </kbd>
    </td>
    
    <td>
      Eine Ebene höher, aus seinem Elternknoten heraus.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Legt ihn ab / stellt ihn zurück.
    </td>
  </tr>
</tbody>
</table>

Im Indikator-Modus bewegen die Pfeiltasten stattdessen die Linie. Aus einer Liste oder einer
Vorlage neben dem Baum nimmt ein Pfeil in Richtung des Baums das Element auf, auf gleicher Höhe
mit der Zeile, vor die es kommt.

Ausgewählte Knoten bewegen sich gemeinsam als ein Block, jeder mit seinem Teilbaum, in
Dokumentreihenfolge. Ein ausgewählter Knoten innerhalb eines anderen ausgewählten fährt im
Teilbaum seines Elternknotens mit. Siehe [Multi-Drag und Auswahl](https://zizigy.github.io/docs/guides/multi-drag).

Alle Optionen stehen in der [makeSortableTree-API](https://zizigy.github.io/docs/api/make-sortable-tree). Für Bäume mit
Tausenden von Zeilen siehe [Virtuelle Listen](https://zizigy.github.io/docs/guides/virtual-lists).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
