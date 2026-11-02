---
title: "Vue DnD Kit — drag and drop for Vue"
description: "Listas ordenables, tableros kanban, árboles y multi-drag para Vue 3 — con animaciones, listos para el teclado y accesibles de serie."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es"
meta:
  "og:description": "Listas ordenables, tableros kanban, árboles y multi-drag para Vue 3 — con animaciones, listos para el teclado y accesibles de serie."
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — Arrastrar y soltar para Vue 3Vue 3 · TypeScript · SSR

01Kanban

**Tableros que intercambian tarjetas**

02Árboles

**Anidar con un leve gesto**

03Multi-drag

**Muchos ítems, un solo movimiento**

04Ordenable

**Listas que se ordenan solas**

05Animado

**Movimiento por defecto**

06A11y

space←↑↓→

**El teclado, de primera clase**

07Virtual

**Diez mil filas**

Arrastra las tarjetas — o llega a una con Tab y usa las flechas

# Arrastrar y soltar,<br>hecho para Vue.

Listas ordenables, tableros kanban, árboles y multi-drag para Vue 3 — con animaciones, listos para el teclado y accesibles de serie.

npm i @vue-dnd-kit/core

[Empezar](https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/introduction)

Libre y de código abierto. Con licencia MIT.

00Cómo funciona

## Composables,<br>no componentes.

Tu marcado, tus estilos. Pasa una ref de plantilla a un composable y el elemento se arrastra, se ordena y se suelta — con la animación, el teclado y el lector de pantalla ya resueltos.

- 01 `**makeSortableList**`Listas, cuadrículas y columnas de kanban que se reordenan mientras arrastras — e intercambian ítems dentro de un grupo.
- 02 `**makeSortableTree**`Datos anidados, renderizados en plano: profundidad con un leve gesto lateral, drops dentro de carpetas, virtualización.
- 03 `**makeDraggable · makeDroppable**`Todo lo demás: tableros, lienzos, subidas de archivos — tus propias reglas sobre qué va dónde.

01Arrastrar y soltar

## Arrastrar y soltar

Un elemento arrastrable, un destino de drop y una regla sobre qué va dónde. Los destinos se iluminan cuando aceptan el arrastre y rechazan lo que no aceptan; lo que hace un drop lo decides tú.

[Documentación](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/drag-and-drop)

Live Ordena los archivos en las carpetas X ---- · Y ----

Cargando la demo…

02Ordenable

## Listas y cuadrículas

Renderiza un borrador de tu array y se reordenará en vivo mientras arrastras. Al soltar, el nuevo orden se escribe en tu ref. Vertical, horizontal o una cuadrícula de cualquier tamaño.

[Documentación](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/sortable-lists)

Live Reordena las apps o pasa una al dock X ---- · Y ----

Cargando la demo…

03Kanban

## Tableros kanban

Las listas de un mismo grupo intercambian ítems. Copia desde una paleta, acepta elementos arrastrables simples o intercambia en lugar de desplazar — la lista que recibe hace sitio mientras pasas por encima.

[Documentación](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/shared-lists)

Live Mueve las tarjetas entre las columnas X ---- · Y ----

Cargando la demo…

04Árboles

## Árboles

Se renderizan en plano con profundidades, así que se pueden virtualizar. Arrastra hacia un lado para cambiar de nivel o pasa sobre una carpeta para soltar dentro; limita la profundidad y decide qué se anida dónde.

[Documentación](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/trees)

Live Arrastra hacia un lado para cambiar la profundidad X ---- · Y ----

Cargando la demo…

05Multi-drag

## Multi-drag

Selecciona con Ctrl/Cmd-clic o dibuja un rectángulo, y luego arrastra uno: toda la selección viaja junta y aterriza en orden, incluso entre listas.

[Documentación](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/multi-drag)

Live Ctrl/Cmd-clic o dibuja un rectángulo, y luego arrastra X ---- · Y ----

06Restricciones

## Ejes, límites y cuadrículas

Un área de arrastre fija las reglas de todo lo que se arrastra dentro de ella: bloquea un eje, mantén los arrastres dentro de sus bordes, ajusta a una cuadrícula — y cámbialas mientras la app se ejecuta.

[Documentación](https://zizigy.github.io/vue-dnd-kit/es/docs/guides/constraints)

Live Cambia las reglas y luego arrastra una forma X ---- · Y ----

Cargando la demo…

07Y más

## Listo para apps reales.

01

### Animado

FLIP al ordenar, un drop que aterriza en su hueco, cambios de datos animados. Usa GSAP o motion si quieres.

02

### Accesible

Arrastre con teclado por huecos, anuncios en vivo y atributos ARIA que nunca sobrescriben los tuyos.

03

### Listas virtuales

TanStack Virtual y VueUse: miles de filas, igual de ordenables, igual de animadas.

04

### Controlado

Pinia, un servidor o datos inmutables: omite la escritura por defecto y aplica tú el resultado.

08Ecosistema

## Un núcleo pequeño y unas pocas herramientas afiladas.

Todo se arrastra con el núcleo. Añade el resto cuando lo necesites.

01

@vue-dnd-kit/devtools

### DevTools

Una pestaña en Vue DevTools y Nuxt DevTools: un minimapa en vivo, un joystick que arrastra cualquier cosa y opciones que editas mientras la app se ejecuta.

02

@vue-dnd-kit/actions

### Arrastres programáticos

«Subir», «mover a Done», recorridos guiados y tests — arrastres reales, anunciados y animados, desde el código.

03

@vue-dnd-kit/nuxt

### Módulo de Nuxt

Composables importados automáticamente, componentes globales y valores por defecto seguros para SSR.

04

npx skills add

### Para agentes de IA

Un skill para agentes que enseña a Claude Code y a otros asistentes cómo funciona la biblioteca.

npx skills add ZiZIGY/vue-dnd-kit

**01**

1243

Tests end-to-end en tres navegadores

**02**

469

Tests unitarios

**03**

21KB

Elementos arrastrables y zonas de drop, con gzip

**04**

9

Idiomas de esta documentación

## Elige por dónde empezar.

[**01**<h3>**Lee la guía**</h3>De la instalación a tu primera lista ordenable en cinco minutos.](https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/introduction) [**02**<h3>**Explora los ejemplos**</h3>Demos en vivo con su código, listas para copiar o abrir en StackBlitz.](https://zizigy.github.io/vue-dnd-kit/es/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/es#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"es-ES","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/es","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/es#webpage","@type":"WebPage","description":"Listas ordenables, tableros kanban, árboles y multi-drag para Vue 3 — con animaciones, listos para el teclado y accesibles de serie.","url":"https://zizigy.github.io/vue-dnd-kit/es","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/es#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/es"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
