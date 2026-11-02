---
title: "useDnD e monitores"
description: "O estado do arraste e seus eventos, em qualquer lugar sob o provider — e o próprio provider, entregue a outro app Vue."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="Selecione fichas, segure a ficha c, arraste sobre o painel travado" name="api-use-dnd">



</example>

## useDnD

```ts
function useDnD(): DnDState;
```

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

O estado do arraste do provider, reativo. `active` e `over` são limpos assim que o drop é
decidido, enquanto o overlay ainda pousa.

<api-table name="DnDState">



</api-table>

### Seleção

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

Eventos de todo arraste sob o provider, enquanto o componente viver. Os seus monitores são
consultados sobre um drop (`onBeforeDrop`) antes do alvo. Os payloads estão na
[página de eventos](https://zizigy.github.io/docs/api/events).

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext e provideDnDContext

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
