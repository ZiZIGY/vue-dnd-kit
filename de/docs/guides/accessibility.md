---
title: "Barrierefreiheit"
description: "Ziehen per Tastatur, Screenreader-Ansagen und ARIA-Attribute sind eingebaut. Hier steht, was sie tun, wie du sie in jeder Sprache formulierst und wie du Verschieben ohne Ziehen anbietest."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Alles auf dieser Seite ist standardmäßig an. Springe mit Tab zu einem Agenda-Eintrag, drücke
<kbd value="Space">



</kbd>

, bewege ihn mit den Pfeiltasten und drücke erneut <kbd value="Space">



</kbd>

 oder
<kbd value="Escape">



</kbd>

, um ihn zurückzustellen. Das Panel zeigt, was einem Screenreader gesagt wird,
in der Sprache, die du wählst.

<example height="28.5rem" hint="Springe mit Tab zu einem Eintrag: Space, Pfeile, Space. Wechsle die Sprache" name="a11y-announcer">



</example>

Was meist dir überlassen bleibt: lesbare Texte für die Elemente und Buttons, die sie für Menschen
bewegen, die gar nicht ziehen können.

## Die Tastatur

<table>
<thead>
  <tr>
    <th>
      Taste
    </th>
    
    <th>
      Aktion
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Das fokussierte Element aufnehmen; es ablegen.
    </td>
  </tr>
  
  <tr>
    <td>
      Pfeiltasten
    </td>
    
    <td>
      Es bewegen: slotweise in Listen, nach Zeilen und Tiefe in Bäumen, um <code>
        keyboard.step
      </code>
      
       Pixel bei freien Drags.
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Den Drag abbrechen – auch Zeiger-Drags.
    </td>
  </tr>
</tbody>
</table>

- In einer Liste bewegt ein Pfeil in Richtung einer anderen Liste derselben Gruppe das Element
dorthin.
- Bei einem freien Drag macht <kbd value="Shift">



</kbd>

 die Schritte größer.
`makeDraggable(el, { keyboardMode: 'droppables' })` lässt die Pfeile stattdessen zwischen den Zielen
springen, die das Element annehmen.
- Ein Drag per Tastatur startet am fokussierten ziehbaren Element oder an seinem Handle – nie an
einem Button oder Feld darin, die behalten also ihre eigenen Tasten.
- Drags per Tastatur scrollen das Element in den sichtbaren Bereich, statt an den Rändern
automatisch zu scrollen.
- Nach dem Drop geht der Fokus zurück auf das Element, auch wenn seine Zeile in einer anderen
Liste neu gerendert wurde.

### Andere Tasten

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

Belegungen werden mit `event.code` (`'Space'`, `'KeyD'`) oder `event.key` (`'Enter'`)
abgeglichen. `step` sind die Pixel pro Pfeildruck bei freien Drags (standardmäßig 25).
`:keyboard="false"` schaltet Drags per Tastatur ab, und <kbd value="Escape">



</kbd>

 bricht trotzdem jeden
Drag ab. Wenn du die Tasten änderst, ändere auch die `screen-reader-instructions`.

## ARIA-Attribute

Fokussiere jeden Shortcut oder schalte die Attribute ab und beobachte, was die Bibliothek setzt.
Ziehe einen, um zu sehen, wie `aria-pressed` am Button kommt und geht.

<example height="27rem" hint="Springe mit Tab durch die Shortcuts; schalte die Attribute um" name="a11y-attributes">



</example>

Jedes ziehbare und sortierbare Element bekommt diese, **sofern du sie nicht selbst setzt**:

<table>
<thead>
  <tr>
    <th>
      Attribut
    </th>
    
    <th>
      Wert
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
      , wenn das Element nicht schon fokussierbar ist (ein <code>
        <div>
      </code>
      
      ; kein <code>
        <a href>
      </code>
      
       oder <code>
        <button>
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        role
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
      , außer an einem <code>
        <button>
      </code>
      
      , der schon einer ist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-roledescription
      </code>
    </td>
    
    <td>
      <code>
        draggable
      </code>
      
       oder bei sortierbaren Elementen <code>
        sortable
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      Die Anweisungen des Providers, ergänzt neben den schon vorhandenen IDs (die eines Tooltips bleibt erhalten).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       oder <code>
        false
      </code>
      
      : ob das Element deaktiviert ist (auch durch einen deaktivierten Drag-Bereich).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      , während es gezogen wird, an Elementen mit der Rolle <code>
        button
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`attributes: false` an einem Element entfernt live, was die Bibliothek gesetzt hatte. Das Panel
liest die Attribute zurück: `aria-describedby` verweist auf die Anweisungen des Providers, die ein
Screenreader nach dem Namen des Elements vorliest.

### Links und Buttons, die ziehen

`aria-roledescription` ersetzt den Namen der Rolle: Ein Screenreader sagt „Inbox, sortable“ statt
„Inbox, button“. Für ein Element, dessen Rolle wichtig ist, setz deine eigene; die Bibliothek lässt
sie in Ruhe:

```vue [Shortcut.vue]
<script setup lang="ts">
makeSortableItem(el, {
  item: () => props.shortcut,
  // Enter follows the link: only Space picks it up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});
</script>

<template>
  <a ref="el" :href="shortcut.href" role="link" aria-roledescription="draggable link">
    {{ shortcut.title }}
  </a>
</template>
```

- Ein Link funktioniert weiter: Ein Klick öffnet ihn, aber der Klick, der einen Drag beendet,
erreicht ihn nie. <kbd value="Enter">



</kbd>

 würde einen Drag starten, also lehnt `canDrag` das ab, und
der Browser folgt dem Link.
- Ein `<button>` behält ebenfalls seinen Klick, und die Bibliothek ergänzt weder `role` noch
`tabindex`.
- Buttons, Links und Felder **in** einem Element starten keine Zeiger-Drags, eine Zeile kann also
ihre eigenen Aktionen enthalten.

### Handles: Mach sie zu echten Buttons

```vue [Track.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ track: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track, handle: '.grip' });
</script>

<template>
  <li ref="el" class="track">
    {{ track.title }}
    <button type="button" class="grip" :aria-label="`Drag ${track.title}`">⠿</button>
  </li>
</template>
```

Mit einem `handle` kommen die Attribute ans Handle, und Drags per Tastatur starten an ihm (der
Shortcut **Archive** oben). Ein `<button>` ist fokussierbar und schon ein Button, er braucht also
weder `tabindex` noch `role`. Gib ihm ein `aria-label`: Ein Griff-Icon hat keinen eigenen Namen,
und „Drag Midnight Drive“ sagt mehr als „button“.

<tip>

Das Handle behält den Fokus während des ganzen Drags per Tastatur, während seine Zeile der Slot
ist. Leere den Slot mit `opacity: 0` statt mit `visibility: hidden` oder `display: none` am
Handle: Ein verborgenes Element verliert den Fokus. Die Bibliothek gibt ihn nach dem Drop zurück,
aber ein Screenreader sagt dazwischen vielleicht „body“.

</tip>

## Ansagen

Eine Live-Region im Provider spricht jedes Aufnehmen, Bewegen, Ablegen und Abbrechen. Sortierbare
Listen sagen, wo das Element ist: *„Picked up item t2 at position 2 of 5 in list playlist.“*
Bewegungen werden gesprochen, sobald der Drag 500 ms geruht hat, damit ein schneller Zeiger-Drag
nicht Slot für Slot vorgelesen wird. Das Panel der Demo protokolliert jeden Text, den der Provider
bekommt, auch die Bewegungen, die ein Zeiger-Drag unterwegs passiert.

Die eingebauten Texte sind englisch und nennen Dinge bei ihren IDs, außer du gibst ihnen ein
`label`. Elemente, Listen, Bäume und Drop-Ziele nehmen alle eines:

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*„Picked up Blue in Green at position 2 of 5 in Playlist.“* Die Labels erreichen auch deine
eigenen Texte und Monitore: `active.label`, `over.label`, jedes von `active.items`, und im
Kontext `position.label` und `partner.label`.

Für eine andere Sprache oder andere Worte schreib die Texte selbst, wie es die Agenda tut. Jeder
Text bekommt das Event und einen `context`: die `position`, die der eingebaute Text sprechen würde
(`list`, `index` ab 0, `length`, das `label` der Liste), sowie `count`, `copy` und den `partner`
eines Tauschs.

```ts [index.vue]
const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

const announcements = computed<Partial<Announcements>>(() => {
  const t = LANGUAGES[lang.value]!;
  return {
    onDragStart: ({ active }, { position }) => position && t.start(titleOf(active.id), position.index + 1, position.length),
    onDragOver: ({ active }, { position }) => position && t.move(titleOf(active.id), position.index + 1, position.length),
    onDragEnd: ({ active }, { position }) => position && t.drop(titleOf(active.id), position.index + 1, position.length),
    onDragCancel: ({ active }, { position }) => position && t.cancel(titleOf(active.id), position.index + 1),
    onDragResume: ({ active }) => t.resume(titleOf(active.id)),
  };
});
```

```vue [index.vue]
<DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
```

<table>
<thead>
  <tr>
    <th>
      <code>
        context
      </code>
    </th>
    
    <th>
      Beim Start
    </th>
    
    <th>
      Beim Bewegen
    </th>
    
    <th>
      Am Ende
    </th>
    
    <th>
      Beim Abbrechen
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      Wo es aufgenommen wurde
    </td>
    
    <td>
      Wo es landen würde; keine außerhalb der Listen
    </td>
    
    <td>
      Wo es gelandet ist
    </td>
    
    <td>
      Wohin es zurückgegangen ist
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        partner
      </code>
    </td>
    
    <td>
      
    </td>
    
    <td>
      Ein Tausch: das Element, mit dem getauscht wurde, und wo es jetzt ist
    </td>
    
    <td>
      Dasselbe, nach dem Drop
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      , <code>
        copy
      </code>
    </td>
    
    <td>
      Wie viele Elemente und ob der Drag kopiert
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      Event
    </th>
    
    <th>
      Gesprochen, wenn
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
      Das Element aufgenommen wird.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      Das Element an einen anderen Ort geht (einen Slot einer Liste, ein anderes Ziel), sobald der Drag 500 ms ruht.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      Es abgelegt wird. Die neue Reihenfolge ist schon geschrieben.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Der Drag abgebrochen oder der Drop abgelehnt wird: Das Element ist zurückgegangen.
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
      
       <code>
        'continue'
      </code>
      
       geantwortet hat: Der Drag geht weiter (siehe <a href="/docs/guides/drop-decisions">
        Über einen Drop entscheiden
      </a>
      
      ).
    </td>
  </tr>
</tbody>
</table>

- Ein Text ersetzt die Ansage des Events; `undefined` behält den Standard; `''` sagt nichts.
Events, die du weglässt, behalten ihre Standards, etwa die Positionen sortierbarer Listen.
- `screenReaderInstructions` ist der Text, auf den jedes ziehbare Element mit `aria-describedby`
verweist. Beide Props sind reaktiv: Die Demo wechselt die Sprache live.
- `:announcements="false"` bringt die Region zum Schweigen, z. B. wenn du über deine eigene
ansagst.

<note>

Gib für eine andere Sprache alle fünf Texte und die Anweisungen an: Jeder, den du weglässt, wird
englisch gesprochen, sortierbare Positionen eingeschlossen. Setz auch das `lang` der Seite, damit
der Screenreader die richtige Stimme wählt.

</note>

## Verschieben ohne Ziehen

Manche Menschen können gar nicht ziehen. WCAG 2.5.7 verlangt eine Möglichkeit, Elemente mit
einzelnen Klicks zu verschieben. Nimm die Pfeile und das Häkchen an jeder Zeile: Sie verschieben
die Bücher ohne Drag, und der Fokus bleibt, wo du bist.

<example height="27.5rem" hint="Bediene die Pfeil-Buttons mit der Tastatur oder ziehe an einem Griff" name="a11y-move-buttons">



</example>

Ein Button ändert die Daten; die Liste zeichnet die Bewegung. Mit `animateChanges` an der Liste gleiten
die Zeilen wie bei einem Drag (und bleiben still für Nutzer, die reduzierte Bewegung wünschen):

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animateChanges: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};
```

```vue [ReadingList.vue]
<p class="status" role="status">{{ message }}</p>
```

### Den Fokus behalten

Ein Element im DOM zu verschieben nimmt ihm den Fokus, also verliert der Button, der gerade
gedrückt wurde, ihn. Gib ihn zurück, sobald sich die Zeile bewegt hat:

```ts [BookRow.vue]
const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Back on the same button, or on the other one when this one is now disabled.
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};
```

Eine Zeile, die verschwindet (das Häkchen markiert ein Buch als gelesen), nimmt den Fokus mit:
Setze ihn auf die nächste Zeile oder die letzte. Drags brauchen nichts davon: Die Bibliothek setzt
den Fokus selbst zurück auf das abgelegte Element, auch wenn es in einer anderen Liste neu
gerendert wird.

<tip>

`@vue-dnd-kit/actions` macht aus jedem Button stattdessen einen echten Drag per Tastatur:
`moveItem(id, { index })` wird angesagt, durchläuft `onBeforeDrop` und `onDrop`, animiert und
behält den Fokus auf dem Element. Siehe
[programmatisches Ziehen](https://zizigy.github.io/docs/guides/sensors#programmatic-drags).

</tip>

## Touch

Touch-Drags starten nach einem langen Drücken von 200 ms. Wer sich vorher mehr als 5 px bewegt,
scrollt stattdessen die Seite, Listen bleiben also scrollbar. Stimme beides mit `activation` des
Providers ab und zeichne aus `useDnD().activation.progress` einen Ring fürs lange Drücken: siehe
[Der Provider](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag). Ein Touch-Drag vibriert kurz,
wenn er startet; `:haptics="false"` schaltet das ab.

## Reduzierte Bewegung

Bei `prefers-reduced-motion: reduce` laufen die eigenen Animationen der Bibliothek nicht: Elemente
springen beim Sortieren an ihre Plätze, das Overlay fliegt beim Drop nicht, und Änderungen durch
`animateChanges` erscheinen sofort. Deine eigenen Animationsfunktionen laufen weiterhin, mit
`reducedMotion: true`, du entscheidest also: sie auslassen oder ein kurzes Ausblenden behalten.
Siehe [Animationen](https://zizigy.github.io/docs/guides/animations).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
