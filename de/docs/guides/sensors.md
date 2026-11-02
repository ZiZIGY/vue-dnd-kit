---
title: "Sensoren und programmatisches Ziehen"
description: "Wie aus Eingaben ein Drag wird – die Sensoren für Zeiger und Tastatur, Aktivierungsbedingungen, canDrag, eigene Sensoren und Drags, die du mit @vue-dnd-kit/actions per Skript steuerst."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Ein Sensor macht aus Eingaben Drags. Er sagt dem Provider nur „zieh dieses Element von hier“, dann,
wohin sich die Eingabe bewegt hat und ob abgelegt oder abgebrochen wurde. Den Rest erledigt der
Provider, für jeden Sensor gleich: ein Drag gleichzeitig, deaktivierte Elemente abgelehnt,
Aktivierungsbedingungen, Sortieren, Auto-Scroll, Ansagen, <kbd value="Escape">



</kbd>

 und der ganze
Drop.

## Die eingebauten Sensoren

<table>
<thead>
  <tr>
    <th>
      Sensor
    </th>
    
    <th>
      Eingabe
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerSensor
      </code>
    </td>
    
    <td>
      Maus, Touch und Stift, über Pointer Events. Er fängt den Zeiger ein, verhindert, dass die Seite unter einem Touch-Drag Text markiert oder scrollt, und schluckt den Klick, der auf einen Drag folgt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      <kbd value="Space">
        
      </kbd>
      
       und <kbd value="Enter">
        
      </kbd>
      
       nehmen auf und legen ab, die Pfeiltasten bewegen, <kbd value="Escape">
        
      </kbd>
      
       bricht ab – jeden Drag, auch Drags per Zeiger.
    </td>
  </tr>
</tbody>
</table>

Beide laufen standardmäßig. `sensors` des Providers ersetzt die Liste:

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, joystick.sensor]">
```

Um das Ziehen per Tastatur abzuschalten, nimm lieber `:keyboard="false"`, statt `keyboardSensor`
wegzulassen: Der Tastatur-Sensor ist auch das, was jeden Drag mit <kbd value="Escape">



</kbd>

 abbricht.
Seine Tasten belegst du mit `keyboard.keys` neu (siehe
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility#the-keyboard)).

## Aktivierungsbedingungen

Ein Drücken zieht nicht sofort: Es wartet auf seine Aktivierungsbedingung, sodass ein Klick ein
Klick bleibt und ein Wischen die Seite weiterhin scrollen kann. Schalte die Regeln dieser Liste um
und drück auf eine Zeile:

<example height="34.5rem" hint="Halte eine Zeile, bis sich der Ring schließt, oder schalte die Regel um" name="activation-modes">



</example>

Eine Bedingung hat drei Felder:

<table>
<thead>
  <tr>
    <th>
      Feld
    </th>
    
    <th>
      Der Drag startet …
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        distance
      </code>
    </td>
    
    <td>
      Sobald sich der Zeiger so viele px bewegt hat.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay
      </code>
    </td>
    
    <td>
      Sobald das Drücken so viele ms gedauert hat. Zusammen mit <code>
        distance
      </code>
      
      : was zuerst eintritt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        tolerance
      </code>
    </td>
    
    <td>
      Mit <code>
        delay
      </code>
      
      : wie weit sich der Zeiger in der Zwischenzeit bewegen darf. Darüber hinaus gibt das Drücken auf, damit die Seite scrollen kann. Standard 5 px, wenn es keine <code>
        distance
      </code>
      
       gibt.
    </td>
  </tr>
</tbody>
</table>

Ohne eigene Bedingung hat jede Zeigerart ihren Standard:

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
      Maus
    </td>
    
    <td>
      Nach 4 px Bewegung. Sofort beim Drücken auf ein <code>
        handle
      </code>
      
      , außer es ist eine Bedingung für die Maus gesetzt.
    </td>
  </tr>
  
  <tr>
    <td>
      Stift
    </td>
    
    <td>
      Nach 4 px Bewegung.
    </td>
  </tr>
  
  <tr>
    <td>
      Touch
    </td>
    
    <td>
      Nach 200 ms Drücken. Eine Bewegung um mehr als 5 px vorher bricht es ab, und die Seite scrollt stattdessen.
    </td>
  </tr>
</tbody>
</table>

### Wo du sie setzt

Pro Zeigerart – `mouse`, `touch`, `pen` – auf dem Provider, einem Drag-Bereich oder dem Element.
Für jede Art gewinnt die des Elements, dann die seines Bereichs, dann die des Providers:

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 250, tolerance: 5 } }">
```

```ts
// Inbox.vue: the rules of every drag that starts inside the panel.
makeDragArea(panel, { activation: () => MODES[mode.value].activation });

// One item: a longer press by touch, the area's rule for the mouse.
makeSortableItem(el, { item: () => props.task, activation: { touch: { delay: 400, tolerance: 8 } } });
```

Die Optionen werden gelesen, wenn ein Drücken beginnt, deshalb schaltet ein Getter oder ein Ref
sie live um, wie in der Demo. Drags per Tastatur starten sofort.
[Ein eigener Sensor](#a-sensor-of-your-own) fragt nach seiner eigenen Bedingung oder nach der, die
für eine Zeigerart konfiguriert ist.

### Ein Ring für langes Drücken

Während ein Drücken wartet, ist `useDnD().status` gleich `'activating'`, und `activation.progress`
läuft von 0 bis 1 – nach Zeit mit `delay`, nach zurückgelegter Strecke mit `distance`. Die Demo
zeichnet einen Ring dort, wo das Drücken begann:

```vue [Inbox.vue]
<script setup lang="ts">
const { status, activation } = useDnD();
</script>

<template>
  <svg v-if="status === 'activating'" class="ring" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="17" pathLength="1" :stroke-dasharray="`${activation.progress.value} 1`" />
  </svg>
</template>
```

Gib dem Ring `pointer-events: none`: Er liegt unter dem Zeiger, und der Drag prüft per Hit-Test,
was dort ist. Ein Drücken, das aufgibt – über seine `tolerance` hinaus bewegt oder zu früh
losgelassen –, setzt `status` direkt wieder auf `'idle'`.

### Handles starten sofort

Mit einem `handle` startet nur das Handle einen Drag, und ein Mausdruck darauf zieht sofort: Beim Packen
eines Griffs gibt es nichts zu unterscheiden. Ein Druck, der dort losgelassen wird, wo er begann,
bleibt ein Klick, der Griff kann also bei `click` ein Menü öffnen (der Zeiger wird erst
eingefangen, wenn er sich bewegt). Ein Touch wartet trotzdem auf sein langes Drücken, außer das Handle kann die Seite nicht scrollen. Gib ihm `touch-action: none` und dem
Element eine kurze Strecke:

```ts [Message.vue]
makeSortableItem(el, {
  item: () => props.chat,
  handle: '.grip',
  // The grip has `touch-action: none`: a touch on it can't scroll, so it drags after 4 px.
  activation: { touch: { distance: 4 } },
});
```

Eine Bedingung für die Maus, die auf dem Element, seinem Bereich oder dem Provider gesetzt ist,
gilt auch für Handles. Mach den Griff zu einem `<button>`, wie die Demo: Er bekommt den Fokus,
also startet auch ein Drag per Tastatur von ihm aus.

## Nur manche Drücke

`canDrag` ist eine weitere Schranke auf ziehbaren und sortierbaren Elementen. Es bekommt das
Eingabe-Event und antwortet für dieses Drücken mit `true` oder `false`. Hier brauchen Drags per
Zeiger <kbd value="Shift">



</kbd>

; die Tastatur zieht wie gewohnt:

<example height="28rem" hint="Ziehe eine Zeile mit und ohne Shift; hake eine Box an, wähle einen Owner" name="can-drag">



</example>

```ts [Task.vue]
makeSortableItem(el, {
  item: () => props.task,
  // Never: the row is locked (and says so to screen readers with aria-disabled).
  disabled: () => !!props.task.locked,
  // Per press: pointer drags only with Shift held; the keyboard as usual.
  canDrag: (event) => {
    if (!props.shiftOnly || event instanceof KeyboardEvent || event.shiftKey) return true;
    emit('refused');
    return false;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Gefragt
    </th>
    
    <th>
      Wofür
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Live, und als <code>
        aria-disabled
      </code>
      
       gesetzt
    </td>
    
    <td>
      Elemente, die sich gar nicht bewegen können: gesperrt, schreibgeschützt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        canDrag
      </code>
    </td>
    
    <td>
      Einmal pro Drücken, mit seinem Event
    </td>
    
    <td>
      Regeln zur Eingabe: eine gehaltene Taste, eine Maustaste, eine Zeigerart.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Wo das Drücken landet
    </td>
    
    <td>
      Elemente, die einen Drag nur von einem Teil aus starten.
    </td>
  </tr>
</tbody>
</table>

`canDrag` wird vor der Aktivierungsbedingung gefragt, mit dem `pointerdown` oder `keydown`. Eine
Zeigerart ist eine weitere Regel, die es aufstellen kann:

```ts
// Mouse and pen drag; a touch on the row always scrolls the page.
canDrag: (event) => !(event instanceof PointerEvent && event.pointerType === 'touch'),
```

Interaktive Kinder – Buttons, Eingabefelder, Checkboxen, editierbare Felder – starten nie einen
Drag per Zeiger, deshalb funktionieren sie in einem ziehbaren Element weiter, wie die Checkbox und
das Owner-Menü in der Demo. Mit einem `handle` startet nur das Handle einen.

## Ein eigener Sensor

Ein Gamepad, ein Joystick auf dem Bildschirm, Sprachbefehle: Alles, was auf ein Element zeigen und
sich bewegen kann, kann einen Drag steuern. Dieses Gamepad ist ein Sensor. Halte <kbd value="A">



</kbd>


über einem Helden, um ihn aufzunehmen, steuere mit dem Steuerkreuz, ein erneutes
<kbd value="A">



</kbd>

 legt ab, <kbd value="B">



</kbd>

 bricht ab. Maus und Tastatur funktionieren daneben
weiter:

<example height="30rem" hint="Halte A über einem Helden, dann halte eine Pfeiltaste: Der Held wandert durch die Liste" name="joystick">



</example>

`defineSensor` gibt dem Sensor seinen Namen und ein `setup`, das die Seite des Providers
bekommt, einmal pro Provider:

```ts [joystick.ts]
const sensor = defineSensor({
  name: 'joystick',
  // Once per provider, in the browser. The cleanup runs when the provider unmounts.
  setup(ctx) {
    context = ctx;
    return () => {
      context = null;
      drag = null;
    };
  },
});
```

Ein Drücken fordert mit `activate()` einen Drag beim Provider an. Das Ziel wird wie ein echtes
Drücken geprüft: Es muss ein ziehbares Element dieses Providers sein, nicht deaktiviert und kein
Button darin:

```ts [joystick.ts]
/** A goes down: drops a running drag, or starts a hold over what is under the cursor. */
const press = () => {
  if (drag?.state === 'dragging') return void drag.drop();
  const at = point();
  const target = document.elementFromPoint(at.x, at.y);
  if (!target || !context) return;
  drag = context.activate({
    target, // checked like a real press: a draggable of this provider, not disabled
    point: at,
    type: 'pointer', // follows points: lists sort under it, containers auto-scroll
    activation: { delay: 300 }, // `useDnD().activation.progress` runs meanwhile
    onEnd: (ended) => {
      if (drag === ended) drag = null;
    },
  }); // null: nothing to drag there
};
```

Dann bewegt sich der Drag mit dem Steuerkreuz, und A oder B beenden ihn:

```ts [joystick.ts]
const move = (dx: number, dy: number) => {
  cursor.value = { x: cursor.value.x + dx, y: cursor.value.y + dy }; // clamped in the demo
  drag?.move(point()); // pending: checks the tolerance; dragging: moves
};

const release = () => {
  if (drag?.state === 'pending') drag.cancel(); // A let go before the hold is over
};

const cancel = () => drag?.cancel();
```

Füge den Sensor zu `sensors` des Providers hinzu, wie die Demo, oder lass ihn mit
`useSensor(joystick.sensor)` laufen, solange eine Komponente lebt. Punkte sind in
Viewport-Koordinaten: Die Demo hält ihren Cursor in den Koordinaten der Bühne, damit er mit der
Seite scrollt, und rechnet ihn in `point()` um.

### Was der Sensor bekommt

`setup(context)` bekommt die Seite des Providers:

<table>
<thead>
  <tr>
    <th>
      Member
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
        props
      </code>
    </td>
    
    <td>
      Die Props des Providers (<code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
       …). Lies sie, wenn du sie brauchst: Sie können sich ändern.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      Der Drag-Status des Providers, egal welcher Sensor den Drag führt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag
      </code>
    </td>
    
    <td>
      Der aktuelle Drag des Providers, wartend oder laufend, egal welcher Sensor ihn gestartet hat. <code>
        null
      </code>
      
      , wenn es keinen gibt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activate(options)
      </code>
    </td>
    
    <td>
      Fordert einen Drag an. Gibt ein <code>
        SensorDrag
      </code>
      
       zurück oder <code>
        null
      </code>
      
      , wenn kein Drag starten darf.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Bricht den Drag oder das wartende Drücken des Providers ab.
    </td>
  </tr>
</tbody>
</table>

`activate()` nimmt:

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
        target
      </code>
    </td>
    
    <td>
      Wo die Eingabe gelandet ist: ein Element in einem ziehbaren Element oder die ID eines ziehbaren Elements. Ein Element wird wie ein echtes Drücken geprüft (Handle, kein interaktives Kind); eine ID überspringt die Prüfungen.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        point
      </code>
    </td>
    
    <td>
      Wo der Drag startet, in Viewport-Koordinaten. Standard: die Mitte des ziehbaren Elements.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        type
      </code>
    </td>
    
    <td>
      <code>
        'pointer'
      </code>
      
       (Standard): folgt Punkten, prüft Ziele per Hit-Test, nutzt Auto-Scroll. <code>
        'keyboard'
      </code>
      
      : bewegt sich von Element zu Element, scrollt Ziele ins Bild, gibt am Ende den Fokus zurück.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      Eine Bedingung (<code>
        { delay: 300 }
      </code>
      
      ) oder eine Zeigerart (<code>
        'touch'
      </code>
      
      ), um die dafür konfigurierte zu verwenden. Standard: keine, der Drag startet sofort.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        event
      </code>
    </td>
    
    <td>
      Das Eingabe-Event, das an <code>
        canDrag
      </code>
      
       des Elements geht (ohne Event wird <code>
        canDrag
      </code>
      
       nicht gefragt). Ein Touch-<code>
        pointerType
      </code>
      
       macht daraus einen Touch-Drag (Haptik).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onStart(drag)
      </code>
    </td>
    
    <td>
      Der Drag hat begonnen, nach seiner Aktivierung.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnd(drag)
      </code>
    </td>
    
    <td>
      Der Drag ist vorbei: abgebrochen, abgelegt oder verworfen – von wem auch immer.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onResume(drag)
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       hat <code>
        'continue'
      </code>
      
       geantwortet: Der Drag geht weiter, und <code>
        move
      </code>
      
      , <code>
        drop
      </code>
      
       und <code>
        cancel
      </code>
      
       gelten wieder.
    </td>
  </tr>
</tbody>
</table>

Das `SensorDrag`, das sie zurückgibt:

<table>
<thead>
  <tr>
    <th>
      Member
    </th>
    
    <th>
      Was es tut
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
        type
      </code>
    </td>
    
    <td>
      Die ID des gezogenen Elements und <code>
        'pointer'
      </code>
      
       oder <code>
        'keyboard'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        state
      </code>
    </td>
    
    <td>
      <code>
        'pending'
      </code>
      
       (wartet auf die Aktivierung), <code>
        'dragging'
      </code>
      
      , dann <code>
        'ended'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        started
      </code>
    </td>
    
    <td>
      Der Drag hat begonnen, auch wenn er inzwischen vorbei ist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        move(point)
      </code>
    </td>
    
    <td>
      Die Eingabe hat sich bewegt. Im Wartezustand prüft es die Toleranz; während des Ziehens bewegt es den Drag.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        step(direction)
      </code>
    </td>
    
    <td>
      Drags per Tastatur: ein Pfeilschritt, <code>
        'up' | 'down' | 'left' | 'right'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        place({ list, index })
      </code>
    </td>
    
    <td>
      Setzt das Element an eine Position einer sortierbaren Liste, wie es Bewegungen per Tastatur tun. Löst mit <code>
        false
      </code>
      
       auf, wenn keine Liste es dort annimmt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop()
      </code>
    </td>
    
    <td>
      Legt ab. Löst mit <code>
        true
      </code>
      
       auf, wenn der Drop durchging, sobald er gelandet ist.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Bricht ab: Das Element fliegt zurück, oder ein wartendes Drücken wird verworfen.
    </td>
  </tr>
</tbody>
</table>

Aufrufe, die nicht mehr passen – eine Bewegung nach dem Ende, ein zweites `drop()` –, werden
ignoriert. Vollständige Typen: [Sensoren](https://zizigy.github.io/docs/api/sensors).

<tip>

Um einen eingebauten Sensor zu umhüllen, führe sein `setup` mit einem eigenen Kontext aus. Erzeuge
ihn mit `Object.create(context, { activate: { value: myActivate } })` statt mit einem Spread,
damit die Live-Getter (`status`, `drag`, `props`) weiter funktionieren.

</tip>

## Programmatisches Ziehen

`@vue-dnd-kit/actions` verschiebt Elemente per Code: „Move up“-Buttons, Menüs, Tastenkürzel,
Rückgängig, Onboarding-Touren, Tests. Es baut auf der öffentlichen Sensor-API auf, und seine Drags
sind echte: angesagt und animiert, durch `onBeforeDrop`, `onDrop`, `e.result` und
`preventDefault()`, nach den Regeln des Providers (ein Drag gleichzeitig, deaktivierte Elemente,
`accept` und `group.put`).

<example height="31.5rem" hint="Fahre über einen Track, um seine Pfeile zu sehen, mische oder spiele den Skript-Drag ab" name="actions">



</example>

```bash
npm i @vue-dnd-kit/actions
```

### moveItem: ein Aufruf, eine Bewegung

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';

const { moveItem } = useDnDActions(); // in setup, under a provider

await moveItem('card-1', { index: 0 }); // to the top of its list
await moveItem('card-1', { list: 'done' }); // to the end of another list
await moveItem('card-1', { list: 'done', index: 2 }); // to a place in another list
```

- `list` ist die `id` einer sortierbaren Liste. Ohne sie bleibt das Element in seiner Liste.
- `index` ist die Stelle, an der das Element landet, ohne das Element selbst gezählt und auf die
Liste begrenzt. Ohne ihn kommt das Element ans Ende.
- Es löst mit `true` auf, wenn der Drop durchging, mit `false`, wenn das Element nicht gerendert
oder deaktiviert ist, keine Liste es dort annimmt oder der Drop abgelehnt wurde.
- Aufrufe reihen sich ein: Jeder wartet, bis der Provider frei ist, sodass ein schneller zweiter
Klick nicht verloren geht. Das Mischen in der Demo sind fünf Aufrufe hintereinander.
- Es läuft als Drag per Tastatur, wird also angesagt, und der Fokus bleibt auf dem Element.
- Nur Listen: Positionen in Bäumen haben auch eine Tiefe.

Eine Zeile mit Buttons zum Verschieben findest du unter
[Barrierefreiheit](https://zizigy.github.io/docs/guides/accessibility#moving-without-dragging).

### startDrag: ein Drag per Skript

```ts
const { startDrag } = useDnDActions();

const drag = startDrag('card-1'); // null when it can't start now
if (drag) {
  await drag.moveTo(document.querySelector('#trash')!); // onto an element
  await drag.moveTo({ x: 400, y: 120 }); // to a point, in viewport coordinates
  await drag.moveTo({ list: 'done', index: 2 }); // to a list position
  await drag.drop(); // true when the drop went through; or drag.cancel()
}
```

`moveTo` löst auf, sobald die Bewegung gerendert ist, `drop`, sobald der Drop gelandet ist. „Play
a scripted drag“ in der Demo schiebt den letzten Track in kleinen `moveTo`-Schritten nach oben und
legt ihn dann ganz oben ab. `startDrag(id, { from: { x, y } })` nimmt das Element an einem Punkt
statt in seiner Mitte auf.

### Einen Drag an die Tastatur übergeben

`startDrag(id, { type: 'keyboard' })` hebt das Element als Drag per Tastatur an. Dein Code kann es
mit `await drag.step('down')` bewegen oder das dem Nutzer überlassen: Der Tastatur-Sensor steuert
jeden Drag per Tastatur, egal wer ihn gestartet hat. So entsteht ein Menüpunkt „Move“:

<example height="26rem" hint="Öffne das Menü einer Zeile: Pfeiltasten, oder schick sie in die andere Woche" name="move-menu">



</example>

```ts [Row.vue]
const { moveItem, startDrag } = useDnDActions();

// One move in one call: picked up, put there and dropped, announced and animated.
const toOther = () => moveItem(props.task.id, { list: props.other.id, index: 0 });
// A keyboard drag, handed to the arrow keys: Space or Enter drops, Escape cancels.
const withKeys = () => {
  el.value?.focus();
  startDrag(props.task.id, { type: 'keyboard' });
};
```

Die Pfeiltasten bewegen die Zeile von Slot zu Slot, <kbd value="ArrowLeft">



</kbd>

 und
<kbd value="ArrowRight">



</kbd>

 in die andere Woche (die Listen teilen eine `group`). Wenn der Drag endet,
kehrt der Fokus zur Zeile zurück. Die Tastenhinweise unter dem Board leuchten, solange
`useDnD().active.value?.sensor` gleich `'keyboard'` ist.

### Außerhalb von Komponenten

`useDnDActions()` lässt einen Sensor namens `actions` im Provider darüber laufen. Um einen Provider
aus einem Store oder einer Testumgebung zu steuern, oder unter einem eigenen Namen, erzeuge die
Actions in einem Sensor, den du selbst laufen lässt:

```ts
import { defineSensor } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';

export let tour: DnDActions | undefined;
export const tourSensor = defineSensor({
  name: 'tour',
  setup: (context) => void (tour = createDnDActions(context)),
});
```

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
```

Dann `await tour?.moveItem('card-1', { list: 'done' })` von überall. Beim Server-Rendering wird
nichts gezogen: `moveItem` löst mit `false` auf, und `startDrag` gibt `null` zurück.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
