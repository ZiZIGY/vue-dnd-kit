# Introduction

Vue DnD Kit v2 is a lightweight drag and drop library for Vue 3. It provides **primitives** (dragging, drop zones, constraints, selection) rather than ready-made UI components, so you can build any scenario with your own components.

## What it is

The library is built around a **provider** (`DnDProvider`) and **composables**: `makeDraggable`, `makeDroppable`, `makeSelectionArea`, `makeConstraintArea`. No external dependencies — Vue only.

- **Draggable elements** — any element can be made draggable.
- **Drop zones** — areas where draggable items can be dropped.
- **Constraint areas** — boundaries that keep dragged elements inside (e.g. a window or container).
- **Selection areas** — box selection to select multiple items (like in a file manager).

**Keyboard** (Enter/Space to start/drop, arrow keys to move, Escape to cancel) and **touch devices** are supported. The library is very light and does not pull in heavy dependencies.

## Why Vue DnD Kit

There are very few flexible, high-quality drag and drop solutions for Vue. Most libraries are **ready-made widgets** (lists, kanban, sortable): fine for common cases, but with almost no customization. It’s hard to get your own layout, your own drop zones, and your own rules and animations.

Vue DnD Kit’s philosophy: you implement **any** scenario yourself by composing primitives. The library does not impose markup, styles, or components — only DnD logic. You build your components and wire them with `makeDraggable`, `makeDroppable`, etc. You get full control: any layout, any constraints, any animations and behavior.

## Comparison with other libraries

| Criteria | Vue DnD Kit v2 | vue.draggable.next | vue-draggable-plus | vue3-dnd |
|----------|----------------|--------------------|--------------------|----------|
| **Focus** | Universal primitives (drag, drop, selection, constraints) | List sorting (Sortable.js) | List sorting (Sortable.js) | Universal DnD (React DnD port) |
| **Dependencies** | Vue only | Vue + Sortable.js | Vue + Sortable.js | Vue + React DnD backends |
| **Customization** | Full: your components, zones, rules | Limited to Sortable options and CSS | More flexible via directives/selectors, still list-oriented | High, no built-in UI, via backends |
| **Drop zones** | ✅ Built-in | ⚠️ Via groups/lists | ⚠️ Via groups/lists | ✅ Via your markup |
| **Constraint area** | ✅ Dedicated primitive | ❌ Sortable options only | ❌ | ✅ Implement manually |
| **Multi-selection** | ✅ Dedicated primitive | ❌ | ❌ | Implement manually |
| **Keyboard** | ✅ Built-in | ❌ | ❌ | Depends on backend |
| **Touch / mobile** | ✅ | ✅ | ✅ | ✅ (touch-backend) |
| **TypeScript** | ✅ | Has types | ✅ | Depends on packages |

**In short:**

- **vue.draggable.next** and **vue-draggable-plus** — good if you mainly need a **sortable list**; they’re simple and light. They’re not built for arbitrary drop zones, constraint boxes, or box selection.
- **vue3-dnd** — universal DnD inspired by React DnD, flexible but requires React DnD backends and more manual setup; no built-in primitives for selection or constraint areas.
- **Vue DnD Kit v2** — universal primitives for Vue 3 with no extra dependencies: drag, drop, selection area, and constraint area in one set, with keyboard and touch support, so you can build any case with your own components.

## What's next

- [Installation](/v2/guide/installation) — install the package.
- [Quick Start](/v2/guide/quick-start) — your first draggable element and drop zone.
- [DnDProvider](/v2/guide/core/dnd-provider), [makeDraggable](/v2/guide/core/make-draggable), [makeDroppable](/v2/guide/core/make-droppable), [makeSelectionArea](/v2/guide/core/make-selection-area), [makeConstraintArea](/v2/guide/core/make-constraint-area) — Core API reference.
