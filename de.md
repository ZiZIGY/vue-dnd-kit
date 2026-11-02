---
title: "Vue DnD Kit — drag and drop for Vue"
description: "Sortierbare Listen, Kanban-Boards, Bäume und Multi-Drag für Vue 3 – animiert, mit Tastatursteuerung und von Haus aus barrierefrei."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de"
meta:
  "og:description": "Sortierbare Listen, Kanban-Boards, Bäume und Multi-Drag für Vue 3 – animiert, mit Tastatursteuerung und von Haus aus barrierefrei."
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — Drag and Drop für Vue 3Vue 3 · TypeScript · SSR

01Kanban

**Boards, die Karten tauschen**

02Bäume

**Verschachteln mit einem Schubs**

03Multi-Drag

**Viele Elemente, ein Zug**

04Sortierbar

**Listen, die sich selbst sortieren**

05Animiert

**Bewegung von Haus aus**

06A11y

space←↑↓→

**Tastatur gleichberechtigt**

07Virtuell

**Zehntausend Zeilen**

Ziehe die Karten – oder springe mit Tab zu einer und nutze die Pfeiltasten

# Drag and Drop,<br>gemacht für Vue.

Sortierbare Listen, Kanban-Boards, Bäume und Multi-Drag für Vue 3 – animiert, mit Tastatursteuerung und von Haus aus barrierefrei.

npm i @vue-dnd-kit/core

[Loslegen](https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/introduction)

Kostenlos und Open Source. MIT-Lizenz.

00So funktioniert es

## Composables,<br>keine Komponenten.

Dein Markup, deine Styles. Übergib einem Composable ein Template-Ref, und das Element lässt sich ziehen, sortieren und ablegen – die Arbeit für Animation, Tastatur und Screenreader ist schon für dich erledigt.

- 01 `**makeSortableList**`Listen, Raster und Kanban-Spalten, die sich beim Ziehen neu ordnen – und innerhalb einer Gruppe Elemente austauschen.
- 02 `**makeSortableTree**`Verschachtelte Daten, flach gerendert: Tiefe durch einen Schubs zur Seite, Drops in Ordner, Virtualisierung.
- 03 `**makeDraggable · makeDroppable**`Alles andere: Boards, Canvases, Uploads – deine eigenen Regeln dafür, was wohin darf.

01Drag & Drop

## Drag and Drop

Ein ziehbares Element, ein Drop-Ziel und eine Regel dafür, was wohin darf. Ziele leuchten auf, wenn sie den Drag annehmen, und lehnen ab, was sie nicht wollen; was ein Drop bewirkt, entscheidest du.

[Dokumentation](https://zizigy.github.io/vue-dnd-kit/de/docs/guides/drag-and-drop)

Live Sortiere die Dateien in die Ordner X ---- · Y ----

Demo wird geladen…

02Sortierbar

## Listen und Raster

Rendere einen Entwurf deines Arrays, und er ordnet sich schon während des Ziehens neu. Beim Drop wird die neue Reihenfolge in dein Ref geschrieben. Vertikal, horizontal oder als Raster beliebiger Größe.

[Dokumentation](https://zizigy.github.io/vue-dnd-kit/de/docs/guides/sortable-lists)

Live Ordne die Apps neu oder ziehe eine ins Dock X ---- · Y ----

Demo wird geladen…

03Kanban

## Kanban-Boards

Listen einer Gruppe tauschen Elemente aus. Kopiere aus einer Palette, nimm einfache ziehbare Elemente auf oder tausche statt zu verschieben – die empfangende Liste macht Platz, während du darüber hoverst.

[Dokumentation](https://zizigy.github.io/vue-dnd-kit/de/docs/guides/shared-lists)

Live Verschiebe Karten zwischen den Spalten X ---- · Y ----

Demo wird geladen…

04Bäume

## Bäume

Flach mit Tiefen gerendert, deshalb lassen sie sich virtualisieren. Ziehe seitwärts, um die Ebene zu ändern, oder hovere über einem Ordner, um darin abzulegen; begrenze die Tiefe und entscheide, was wo verschachtelt wird.

[Dokumentation](https://zizigy.github.io/vue-dnd-kit/de/docs/guides/trees)

Live Ziehe seitwärts, um die Tiefe zu ändern X ---- · Y ----

Demo wird geladen…

05Multi-Drag

## Multi-Drag

Wähle mit Strg/Cmd-Klick aus oder ziehe einen Rahmen auf, dann ziehe eines: Die ganze Auswahl bewegt sich gemeinsam und landet in ihrer Reihenfolge, sogar über Listen hinweg.

[Dokumentation](https://zizigy.github.io/vue-dnd-kit/de/docs/guides/multi-drag)

Live Klicke mit Strg/Cmd oder ziehe einen Rahmen auf, dann ziehe X ---- · Y ----

06Einschränkungen

## Achsen, Grenzen und Raster

Ein Drag-Bereich legt die Regeln für alles fest, was darin gezogen wird: eine Achse sperren, Drags innerhalb seiner Ränder halten, am Raster einrasten – und das alles ändern, während die App läuft.

[Dokumentation](https://zizigy.github.io/vue-dnd-kit/de/docs/guides/constraints)

Live Stelle die Regeln um, dann ziehe eine Form X ---- · Y ----

Demo wird geladen…

07Und mehr

## Bereit für echte Apps.

01

### Animiert

FLIP beim Sortieren, ein Drop, der in seinem Slot landet, Datenänderungen, die animiert werden. Bring GSAP oder motion mit, wenn du magst.

02

### Barrierefrei

Ziehen per Tastatur von Slot zu Slot, Live-Ansagen und ARIA-Attribute, die deine nie überschreiben.

03

### Virtuelle Listen

TanStack Virtual und VueUse: Tausende Zeilen, weiterhin sortierbar, weiterhin animiert.

04

### Kontrolliert

Pinia, ein Server oder unveränderliche Daten: Überspringe das Standard-Schreiben und wende das Ergebnis selbst an.

08Ökosystem

## Ein kleiner Kern, ein paar scharfe Werkzeuge.

Mit dem Kern lässt sich alles ziehen. Füge den Rest hinzu, wenn du ihn brauchst.

01

@vue-dnd-kit/devtools

### DevTools

Ein Tab in den Vue DevTools und den Nuxt DevTools: eine Live-Minimap, ein Joystick, der alles ziehen kann, und Optionen, die du bearbeitest, während die App läuft.

02

@vue-dnd-kit/actions

### Programmatische Drags

„Nach oben“, „nach Done verschieben“, geführte Touren und Tests – echte Drags, angesagt und animiert, aus dem Code.

03

@vue-dnd-kit/nuxt

### Nuxt-Modul

Automatisch importierte Composables, globale Komponenten und SSR-sichere Standardwerte.

04

npx skills add

### Für KI-Agenten

Ein Agent-Skill, der Claude Code und anderen Assistenten beibringt, wie die Bibliothek funktioniert.

npx skills add ZiZIGY/vue-dnd-kit

**01**

1.243

End-to-End-Tests in drei Browsern

**02**

469

Unit-Tests

**03**

21KB

Ziehbare Elemente und Drop-Zonen, gzip-komprimiert

**04**

9

Sprachen dieser Dokumentation

## Wähle, wo du anfängst.

[**01**<h3>**Leitfaden lesen**</h3>Von der Installation zu deiner ersten sortierbaren Liste in fünf Minuten.](https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/introduction) [**02**<h3>**Beispiele ansehen**</h3>Live-Demos mit ihrem Code, bereit zum Kopieren oder zum Öffnen in StackBlitz.](https://zizigy.github.io/vue-dnd-kit/de/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/de#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"de-DE","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/de","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/de#webpage","@type":"WebPage","description":"Sortierbare Listen, Kanban-Boards, Bäume und Multi-Drag für Vue 3 – animiert, mit Tastatursteuerung und von Haus aus barrierefrei.","url":"https://zizigy.github.io/vue-dnd-kit/de","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/de#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/de"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
