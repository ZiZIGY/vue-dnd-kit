---
title: "Block-Editor"
description: "Eine Seite wie in Notion – Blöcke, die an ihren Handles gezogen und seitwärts verschachtelt werden, ein Auswahlrahmen, der mehrere auf einmal bewegt, neue Blöcke, die aus einem „/“-Menü oder einer Seitenleiste gezogen werden, Kopien mit Alt und Undo für all das."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/examples/block-editor"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="Ziehe ⋮⋮, um einen Block zu verschieben, seitwärts, um ihn zu verschachteln; tippe / für neue Blöcke" name="block-editor" title="Block-Editor">



</example>

Jeder Block hat ein Handle (⋮⋮) und ein „+“ am Rand. Tippe in einen beliebigen Block: Enter
beginnt den nächsten, Tab verschachtelt ihn, „/“ öffnet das Menü der neuen Blöcke, und Markdown
funktioniert („## “, „- “, „<span>



</span>

 “). Zieh einen Rahmen am Rand, um mehrere Blöcke auszuwählen, und
ziehe sie dann gemeinsam. Klappe den Rahmen auf: Auf einem breiten Bildschirm bekommen die Blöcke
zum Hinzufügen und die Gliederung der Seite eigene Seitenleisten.

## Worauf du achten solltest

- **Page.vue**: Die Seite ist ein sortierbarer Baum, mit `placeholder: 'indicator'`: Die Seite
bleibt beim Ziehen still, und eine Linie zeigt, wo und auf welcher Ebene die Blöcke landen. Das
Blatt um die Blöcke ist seine `dropzone`, ein Drop unter dem letzten Block landet also am Ende.
- **BlockRow.vue**: ein Block. Nur sein Handle zieht (`handle`), der Text bleibt also
bearbeitbar und auswählbar. Das Handle ist ein Button: Ein Klick wählt den Block aus und öffnet
sein Menü, Space nimmt den Block für die Tastatur auf.
- **BlockText.vue** und **Editable.vue**: einfacher `contenteditable`-Text mit den Tasten eines
Editors. Getipptes geht aus dem DOM ins Modell; das Modell geht nur dann zurück ins DOM, wenn
etwas anderes es geändert hat (Undo, ein Zusammenführen), der Cursor springt also nie.
- **editor.ts**: das Dokument und jede Bearbeitung daran, ganz ohne Drag and Drop: teilen,
zusammenführen, einrücken, duplizieren, umwandeln, und ein Verlauf, der Drops und Tippen
gleichermaßen zurücknimmt.

## Verschachteln durch seitliches Ziehen

```ts [Page.vue]
const { items } = makeSortableTree(root, {
  id: 'page',
  items: editor.blocks,
  group: 'blocks',
  placeholder: 'indicator',
  nesting: 'offset',        // sideways: every 24px is a level
  indentation: INDENT,
  maxDepth: MAX_DEPTH,
  canNest: (_block, parent) => !!KINDS[parent.kind].nests,
  collapsed: editor.collapsed,
  clone: copyBlock,         // Alt-drag copies a block with what is nested in it
  createItem: (active) => createBlock((active.data as { kind: BlockKind }).kind),
  animate: true,
  overOverlay: BlockGhost,
  dropzone: sheet,
  onDrop, // see Undo, below
});
```

`nesting: 'offset'` nimmt die Ebene nur aus dem seitlichen Versatz des Drags: Das Darüberhalten
über der Mitte eines Absatzes legt nicht in ihn ab, wie in einem Dokument-Editor. `canNest` sagt,
welche Blöcke verschachtelte Blöcke annehmen (Absätze, Listen, To-dos, Toggles, Zitate, Callouts;
keine Überschriften, kein Code, keine Bilder), und wenn der Block darüber ablehnt, bleibt die Linie
auf der tiefsten Ebene, die passt. Ein geschlossener Toggle (`collapsed`) nimmt trotzdem Blöcke
an: Eine Linie eine Ebene tiefer darunter legt sie hinein, als erste.

Jede Zeile zeichnet die Linie aus ihrem `indicator`, aus der Ebene, auf der der Drop landet.
Nummerierte Listen zählen aus `items`, also folgen „2.“ und „a.“ jedem Drop und jedem Tab.
`animate: true` lässt auch die Änderungen gleiten und verblassen, die kein Drag macht: Enter, Tab,
Delete, Undo, ein sich öffnender Toggle.

```ts [BlockRow.vue]
const { indicator, selected } = makeSortableItem(el, {
  id: () => props.node.key,
  handle: '.handle',
  // A mouse press on a handle drags at once; after 4px instead, a click stays a click.
  activation: { mouse: { distance: 4 } },
  // Enter opens the block's menu; Space picks the block up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});

const line = computed(() => {
  const at = indicator.value;
  if (!at || at.side === 'inside') return null;
  return { side: at.side, left: `${((at.depth ?? 0) - props.node.depth) * props.indent}px` };
});
```

## Mehrere auswählen

Die Seite ist ein Auswahlbereich: Ein Rahmen, der von ihren Rändern aus gezogen wird, wählt die
Blöcke aus, die er berührt. `strategy: 'select'` sorgt dafür, dass ein Klick auf den leeren Rand
die Auswahl aufhebt, und `accept` beschränkt den Rahmen auf Blöcke. Ein Klick auf ein Handle wählt
seinen Block aus, Shift-Klick eine Reihe von Blöcken, Strg/Cmd-Klick einen weiteren; Escape in
einem Text wählt seinen Block aus. Dann:

```ts [Page.vue]
const { isSelecting, style } = makeSelectionArea(scroller, {
  strategy: 'select',
  accept: 'blocks',                     // the rows' type: their group's name
  disabled: () => menu.value !== null,  // a press closes the menu first
});
```

Ziehe einen ausgewählten Block, und die anderen kommen mit: Der Baum bewegt sie als eine Reihe,
jeden mit dem, was in ihm verschachtelt ist, in Lesereihenfolge. Delete entfernt sie, Strg/Cmd+D
dupliziert sie, und das Menü des Handles wandelt sie in eine andere Art um. Die Pfeile gehen von
Handle zu Handle, Shift fügt zur Auswahl hinzu.

## Neue Blöcke aus einem Menü

„+“ am Rand und „/“ in einem Block öffnen dasselbe Menü. Ein Klick fügt den Block darunter ein;
jede Option ist außerdem ein einfaches ziehbares Element, das `createItem` des Baums dort, wo es
abgelegt wird, in einen neuen Block verwandelt. Die Seitenleiste breiter Bildschirme listet
dieselben Optionen, und dort nimmt Space eine für die Tastatur auf: Ein Pfeil in Richtung der
Seite holt sie hinein.

```ts [InsertOption.vue]
makeDraggable(el, {
  id: () => `new-${props.kind}${props.option ? '-option' : ''}`,
  type: 'new-block',
  data: () => ({ kind: props.kind }),
  attributes: () => !props.option, // in the menu, an option of its listbox
});
```

Während eine Option unterwegs ist, blendet sich das Menü aus, damit die Seite zeigt, wohin sie
geht, und es schließt sich, sobald der neue Block gelandet ist:

```ts [Page.vue]
useDnDMonitor({
  onDragStart: ({ active }) => (lifted.value = !!popover.value?.contains(active.element)),
  onDragSettle: () => {
    if (!lifted.value) return;
    lifted.value = false;
    menu.value = null;
  },
});
```

## Was der Drop tun wird

**BlockGhost.vue** ist das `overOverlay` des Baums: Solange ein Drag über der Seite ist, umhüllt
es das eigene Overlay des Drags (`<slot />`, den Klon der Blöcke oder der Option) mit einer Anzahl
und einer Notiz. `to.parentKey` nennt den Block, in den der Drop ginge, und `mode` sagt, wann er
kopiert.

```vue [BlockGhost.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; mode: DragMode; to: DropDestination | null }>();

// A new block: a kind dragged from the menu or the sidebar, by its `type`.
const adding = computed(() => props.items[0]?.type.includes('new-block'));

const note = computed(() => {
  const verb = props.mode === 'copy' ? 'Copy' : adding.value ? 'Add' : null;
  const parent = props.to?.parentKey == null ? undefined : editor.get(String(props.to.parentKey));
  if (!parent) return verb; // a plain move at the page's top level needs no words
  return `${verb ? `${verb} into` : 'Into'} “${parent.text}”`; // "Copy into “Open questions”"
});
</script>

<template>
  <div class="ghost">
    <slot />
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
    <span v-if="note" class="note">{{ note }}</span>
  </div>
</template>
```

## Undo

Der Baum schreibt jeden Drop in `editor.blocks`, ein beschreibbares Ref. Sein `onDrop` läuft
direkt vor diesem Schreiben, hält also die Seite fest, wie sie war, und Undo nimmt den Drop
zurück. Jede andere Bearbeitung hält sich genauso fest; die Tastenanschläge in einem Block ergeben
einen einzigen Schritt.

```ts [Page.vue]
onDrop: (event) => {
  editor.record(); // the library writes the drop after this: Undo takes it back
  const first = event.items[0]!.id;
  if (event.mode === 'insert') editor.focus(first, 'start');
  else editor.focusHandle(first);
},
```

```ts [editor.ts]
/** Called before every change: the state it changes goes on the undo stack. */
const record = () => {
  past.value = [...past.value.slice(-99), capture()];
  future.value = [];
  typing = null;
};
```

Der Verlauf hält Kopien der Blöcke mit ihren IDs, ein Block behält also über Undo und Redo hinweg
seine Zeile und seine Auswahl. Nach einem Drop bekommt ein neuer Block den Cursor, und ein
verschobener gibt den Fokus an sein Handle: Seine Zeile ist in der Seite gewandert, wodurch der
Fokus verloren geht, und die Tastenkürzel funktionieren vom Handle aus weiter.

## Tastatur und Screenreader

Escape in einem Text wählt den Block aus und fokussiert sein Handle. Von dort nimmt Space ihn
auf, die Pfeile bewegen die Linie (links und rechts: eine Ebene hinaus oder hinein), Space legt
ihn ab; Enter öffnet sein Menü, Delete entfernt ihn. Die `announcements` des Providers nennen
Blöcke nach ihrer Art und ihrem Text („Picked up to-do list “Freeze the API”“), und die
Statuszeile der oberen Leiste spricht, was die Buttons und Tastenkürzel tun.

Mehr dazu: [Bäume](https://zizigy.github.io/docs/guides/trees) ·
[Multi-Drag und Auswahl](https://zizigy.github.io/docs/guides/multi-drag#rubber-band-selection) ·
[Einfache ziehbare Elemente in eine Liste](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list) ·
[Ziele, die das Overlay ändern](https://zizigy.github.io/docs/guides/overlay#targets-that-change-the-overlay) ·
[Wann ein Drücken zum Drag wird](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag) ·
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
