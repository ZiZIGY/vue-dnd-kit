---
title: "DevTools"
description: "Ein Vue-DnD-Kit-Tab in den Vue DevTools und den Nuxt DevTools – eine Live-Minikarte, ein Joystick, der wirklich zieht, Optionen live bearbeiten und ein Log jedes Drags."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/guides/devtools"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`@vue-dnd-kit/devtools` fügt den Vue DevTools (`vite-plugin-vue-devtools`) und den Nuxt DevTools
einen Tab **Vue DnD Kit** hinzu. Er zeigt jede Liste, jeden Baum und jedes Drop-Ziel der Seite auf
einer Live-Minikarte, zieht jedes Element mit einem Joystick, bearbeitet Optionen, während die App
läuft, und protokolliert, was jeder Drag getan hat. Er funktioniert nur in der Entwicklung: Nichts
davon gelangt in einen Produktions-Build.

Der Tab ist eine eigene Seite, die dein Dev-Server neben deiner App ausliefert, deshalb kann er
nicht in dieser Dokumentation laufen. Drei Schritte richten ihn ein.

## Installation

### 1. Die Pakete hinzufügen

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

`@vue-dnd-kit/actions` ist eine Peer-Dependency: Die Bewegungen des Tabs laufen darüber. npm 7+
und pnpm installieren es von selbst; mit Yarn 1 füge es hinzu.

### 2. Das Plugin hinzufügen

<code-group>

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vueDnDKitDevtools } from '@vue-dnd-kit/devtools/vite';

export default defineConfig({
  // Next to the Vue DevTools plugin: the tab joins its sidebar.
  plugins: [vueDevTools(), vueDnDKitDevtools(), vue()],
});
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // With @vue-dnd-kit/devtools installed, the tab appears in development.
  modules: ['@vue-dnd-kit/nuxt'],
});
```

</code-group>

Mit Vite tut das Plugin auf dem Dev-Server (`vite serve`) drei Dinge: Es liefert den Tab unter
`/__vue-dnd-kit-devtools/` aus (unterhalb deiner `base`), fügt ihn den Vue DevTools hinzu und
sorgt dafür, dass die Seite ihm berichtet, bevor deine App startet. Kein `app.use()` nötig, und
Builds bleiben unberührt.

Mit Nuxt findet das Modul `@vue-dnd-kit/nuxt` das Paket, liefert den Tab aus, fügt ihn den Nuxt
DevTools hinzu und installiert den Teil auf der Seite mit einem Client-Plugin.
`vueDndKit: { devtools: false }` schaltet das ab.

### 3. Die App in der Entwicklung starten

Starte den Dev-Server wie gewohnt (`vite`, `nuxt dev`) und öffne die App: Der Tab ist bereit. Jeder
Provider der Seite erscheint darin, egal in welcher App er rendert.

### Ohne die Plugins

Für einen eigenen Dev-Server oder eine Seite, die Vite nicht aus einer `index.html` ausliefert
(SSR-Setups), installiere den Teil auf der Seite selbst:

```ts [main.ts]
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

Oder importiere `@vue-dnd-kit/devtools/auto` als Erstes in der Einstiegsdatei. Nimm
`vueDnDKitDevtools({ inject: false })`, wenn das Plugin den Tab ausliefern soll, du den Teil auf der
Seite aber selbst installierst; `serveTab()` aus `@vue-dnd-kit/devtools/vite` ist die Middleware,
die den Tab ausliefert.

<note>

In einem Produktions-Build schrumpfen `app.use(DnDDevtools)` und der `auto`-Import auf fast
nichts: Jeder Einstiegspunkt prüft zuerst `process.env.NODE_ENV`, und Bundler werfen den Rest weg.
Auf dem Server tun sie nichts.

</note>

## Öffnen

- **Vue DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

 oder der Vue-Button
unten auf der Seite, dann der Tab **Vue DnD Kit**.
- **Nuxt DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

 oder der
Nuxt-Button, dann **Vue DnD Kit** (in der Seitenleiste oder ihrem Überlaufmenü).
- **Ein eigenes Fenster**: Öffne `http://localhost:5173/__vue-dnd-kit-devtools/` auf deinem
Dev-Server oder nutze den ⧉-Button des Tabs. Praktisch auf einem zweiten Bildschirm. Sind mehrere
Seiten offen, wählt ein Select oben die, die beobachtet wird.

<warning>

Halte den Tab in einem eigenen Fenster, nicht in einem Hintergrund-Tab desselben Browserfensters:
Die Seite muss sichtbar bleiben, und eine verborgene Seite bricht Drags ab.

</warning>

## Der Tab im Überblick

<table>
<thead>
  <tr>
    <th>
      Teil
    </th>
    
    <th>
      Was er enthält
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Obere Leiste
    </td>
    
    <td>
      Was der Drag gerade tut (<code>
        dragging card-3 → done (accepts)
      </code>
      
      ), die beobachtete Seite, <strong>
        ⌖ Pick
      </strong>
      
      , die Anzahl bearbeiteter Optionen mit einem Reset, ⧉ (ein eigenes Fenster) und das Theme.
    </td>
  </tr>
  
  <tr>
    <td>
      Links: die Registry
    </td>
    
    <td>
      Jeder Provider als Baum: seine Listen, Bäume, Drop-Ziele und ziehbaren Elemente. <strong>
        ☰
      </strong>
      
       blendet sie ein oder aus.
    </td>
  </tr>
  
  <tr>
    <td>
      Mitte: <strong>
        Map
      </strong>
      
       und <strong>
        Log
      </strong>
    </td>
    
    <td>
      Die Live-Minikarte der Seite oder das Log der Drags.
    </td>
  </tr>
  
  <tr>
    <td>
      Rechts: <strong>
        Drive
      </strong>
      
      , <strong>
        Options
      </strong>
      
      , <strong>
        State
      </strong>
    </td>
    
    <td>
      Der Joystick und die Buttons zum Verschieben, die Optionen des gewählten Knotens und was der Provider darüber weiß.
    </td>
  </tr>
</tbody>
</table>

Wähle einen Knoten in der Registry oder ein Element auf der Karte, und die rechte Seite folgt ihm.

## Die Minikarte

Eine Live-Karte pro Liste, Baum und Drop-Ziel, mit Kopien ihrer Elemente dort, wo sie sind –
dieselben Klone, die das Overlay zeigen würde, mit dem CSS der Seite. Während eines Drags markiert
sie:

- die Listen und Ziele, die den Drag **annehmen** (blau) oder **ablehnen** (rot);
- den Platzhalter und das Ziel unter dem Zeiger;
- den Zeiger, die Box des Overlays und die Einfügelinie von Listen mit `placeholder: 'indicator'`.

Ein Klick wählt ein Element und hebt es auf der Seite hervor; ein Doppelklick scrollt die Seite
dorthin. Nutze die Karte, wenn ein Drop nicht dort landet, wo du es erwartest: Sie zeigt auf einen
Blick, welche Listen den Drag annehmen.

## Drive: der Joystick

Wähle ein Element – auf der Karte, in der Registry oder mit **⌖ Pick**, das das nächste Drücken auf
ein ziehbares Element der Seite abfängt, statt es wirken zu lassen – und drück den Knauf des
Joysticks. Das Element wird aufgenommen und bewegt sich in diese Richtung, umso schneller, je
weiter der Knauf von der Mitte entfernt ist. Lass los, und es hält an; **Drop** und **Cancel**
beenden den Drag.

Es ist ein echter Drag per Zeiger von einem Sensor namens `devtools`, gebaut mit der öffentlichen
[Sensor-API](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own): Listen sortieren sich darunter, Container
scrollen an ihren Rändern, und `onBeforeDrop` und `onDrop` laufen wie bei jedem Drag. Deaktivierte
Elemente werden nicht aufgenommen. Auch ein Drag per Tastatur, den die Seite gestartet hat, lässt
sich steuern.

Elemente sortierbarer Listen bekommen zusätzlich Buttons: nach oben, nach unten, an den Anfang, ans
Ende, in eine andere Liste der Gruppe. Jeder ist ein Drag per Tastatur mit
[`moveItem`](https://zizigy.github.io/docs/guides/sensors#programmatic-drags). Unter dem Joystick eine große Kopie dessen,
was das Overlay zeigt.

<table>
<thead>
  <tr>
    <th>
      Taste im Tab
    </th>
    
    <th>
      Wirkung
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Pfeiltasten oder <kbd value="W">
        
      </kbd>
      
       <kbd value="A">
        
      </kbd>
      
       <kbd value="S">
        
      </kbd>
      
       <kbd value="D">
        
      </kbd>
    </td>
    
    <td>
      Den Knauf in diese Richtung drücken, halb; mit <kbd value="Shift">
        
      </kbd>
      
       ganz
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="G">
        
      </kbd>
    </td>
    
    <td>
      Das gewählte Element aufnehmen
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Ablegen
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Abbrechen
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="P">
        
      </kbd>
    </td>
    
    <td>
      Auf der Seite auswählen
    </td>
  </tr>
</tbody>
</table>

## Options

Jede Option, die kein Callback ist, lässt sich bearbeiten, während die App läuft. Wähle den Knoten
und öffne **Options**:

<table>
<thead>
  <tr>
    <th>
      Knoten
    </th>
    
    <th>
      Optionen
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Provider
    </td>
    
    <td>
      <code>
        overlayFit
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        collision
      </code>
      
      , <code>
        modifiers
      </code>
      
       (die der Bibliothek, nach Namen), <code>
        animation
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        animateChanges
      </code>
      
      , <code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      , <code>
        haptics
      </code>
      
      , <code>
        copyModifier
      </code>
      
       …
    </td>
  </tr>
  
  <tr>
    <td>
      Liste
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        strategy
      </code>
      
      , <code>
        placeholder
      </code>
      
      , <code>
        behavior
      </code>
      
      , <code>
        multiple
      </code>
      
      , <code>
        sort
      </code>
      
      , <code>
        dropOutside
      </code>
      
      , <code>
        acceptMode
      </code>
      
      , <code>
        animation
      </code>
      
      , <code>
        animateChanges
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Baum
    </td>
    
    <td>
      <code>
        placeholder
      </code>
      
      , <code>
        indentation
      </code>
      
      , <code>
        nesting
      </code>
      
      , <code>
        maxDepth
      </code>
      
       …
    </td>
  </tr>
  
  <tr>
    <td>
      Drop-Ziel
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Element
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        activation
      </code>
    </td>
  </tr>
</tbody>
</table>

Eine Änderung gilt sofort, nur für diese Seite, und wird nie in deinen Code geschrieben: Die
Bibliothek liest den neuen Wert dort, wo sie die Option liest. Sie gilt, bis du sie zurücksetzt (↺
pro Option oder der Reset in der oberen Leiste), der Provider unmountet oder die Seite neu lädt.
Neben einer bearbeiteten Option steht der Wert aus deinem Code. Elemente, die gemountet werden,
während eine Änderung gesetzt ist – Zeilen einer virtuellen Liste –, bekommen sie auch.

## State

Was jeder Provider über den gewählten Knoten weiß:

- die **Drag-Sitzung**: Status, die aktiven IDs, Elemente und der Sensor, das Ziel und ob es
annimmt, der Zeiger, das Overlay, die Sitzung der sortierbaren Gruppe und die Einfügelinie;
- eine **Liste**: ihre Reihenfolge und ihr Entwurf; ein **Baum**: seine Zeilen;
- ein **Element**: sein Typ, seine Daten und seine Position; ein **Drop-Ziel**: seine Regeln.

Elemente mounten und unmounten ohne Events: Die Registry holt das innerhalb einer Sekunde auf.

## Log

Ein Band pro Drag, der Reihe nach:

<table>
<thead>
  <tr>
    <th>
      Eintrag
    </th>
    
    <th>
      Was er sagt
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag start
      </code>
    </td>
    
    <td>
      Die IDs, der Sensor und ob per Touch, die Liste, aus der er kommt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
      
      , <code>
        left
      </code>
    </td>
    
    <td>
      Jedes Ziel, das betreten und verlassen wurde, und ob es annimmt.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        release
      </code>
    </td>
    
    <td>
      Das Ziel, über dem losgelassen wurde, während <code>
        onBeforeDrop
      </code>
      
       entscheidet.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      Das Urteil: angenommen, teilweise angenommen, von einem Hook abgelehnt, vom <code>
        accept
      </code>
      
       des Ziels abgelehnt, und wie lange die Hooks gebraucht haben.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      Das Ziel; bei sortierbaren Listen die Bewegung, <code>
        e.result
      </code>
      
       und ob <code>
        preventDefault()
      </code>
      
       aufgerufen wurde.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel
      </code>
    </td>
    
    <td>
      Warum: abgebrochen (Escape, <code>
        cancel()
      </code>
      
      ), von einem Hook abgelehnt oder vom <code>
        accept
      </code>
      
       des Ziels abgelehnt.
    </td>
  </tr>
</tbody>
</table>

Außerdem `auto-scroll on` und `off`, die `announcement`-Texte (standardmäßig ausgeblendet) und,
außerhalb von Drags, `animate` (Änderungen an den Elementen einer Liste, die kein Drag gemacht
hat). Klick auf einen Eintrag, um seine Daten zu sehen. Ein Tab, der später geöffnet wird, bekommt
die bisherigen Drags.

## Einen Drop Schritt für Schritt debuggen

Eine Karte will nicht in eine Spalte. Mit offenem Tab:

1. **Reproduziere es** von Hand oder mit **Drive**, damit deine Hände für den Tab frei bleiben.
2. **Beobachte die Karte**, während die Karte über der Spalte ist. Rot heißt, die Liste lehnt die
Karte ab: Sieh dir ihre `group` (`put`) oder das `accept` des Ziels an. Blau heißt, sie nimmt
an, und das Problem kommt später.
3. **Lies das Log** dieses Drags. `onBeforeDrop` sagt, wer Nein gesagt hat – ein Hook oder das
`accept` des Ziels. Ging der Drop durch, aber deine Daten haben sich nicht geändert, sagt der
Eintrag `drop`, ob `preventDefault()` aufgerufen wurde und was in `e.result` stand: Eine
kontrollierte Liste muss es selbst anwenden.
4. **Probier einen Fix live** in **Options** aus – ein lockereres `acceptMode`, eine andere
`collision`, `placeholder: 'indicator'` – und schreib dann den, der funktioniert, in deinen
Code.

## Wie es funktioniert

Provider berichten an einen Hook, den der Teil auf der Seite installiert. Bis ein Tab die Seite
beobachtet, werden sie nur erfasst; dann hört die Seite zu wie jeder Monitor und schickt dem Tab,
was er zeigt – alle 40 ms während eines Drags, sonst zweimal pro Sekunde – und hört auf, sobald
einige Sekunden lang kein Tab mehr zugesehen hat. Der Tab spricht mit der Seite über einen
`BroadcastChannel` des Origins der Seite. Er ändert nichts außer dem, worum du bittest: die Drags,
die Auswahl und die überschriebenen Optionen.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
