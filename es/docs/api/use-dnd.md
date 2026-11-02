---
title: "useDnD y monitores"
description: "El estado del arrastre y sus eventos, en cualquier lugar bajo el provider — y el propio provider, pasado a otra app de Vue."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="Selecciona fichas, mantén pulsada la ficha c y arrastra sobre el panel bloqueado" name="api-use-dnd">



</example>

## useDnD

```ts
function useDnD(): DnDState;
```

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

El estado del arrastre del provider, reactivo. `active` y `over` se vacían en cuanto se decide el
drop, mientras el overlay todavía aterriza.

<api-table name="DnDState">



</api-table>

### Selección

<api-table name="DnDSelection">



</api-table>

## useDnDMonitor

```ts
function useDnDMonitor(monitor: DnDMonitor): void;
```

```ts
useDnDMonitor({
  onDragEnd: (e) => (e.dropped ? save(e) : undefined),
  onBeforeDrop: async (e) => ((await confirm()) ? 'accept' : 'reject'),
});
```

Los eventos de todos los arrastres bajo el provider, mientras viva el componente. A tus monitores se
les consulta sobre un drop (`onBeforeDrop`) antes que al destino. Los payloads están en
[la página de eventos](https://zizigy.github.io/docs/api/events).

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext y provideDnDContext

```ts
function useDnDContext(): DnDContext;
function provideDnDContext(app: App, context: DnDContext): void;
```

```ts
// In a component under the provider:
const context = useDnDContext();
// A second Vue app (a widget mounted in a shadow root) joins the same drag:
const widget = createApp(Widget);
provideDnDContext(widget, context);
```

<api-table name="DnDContext">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
