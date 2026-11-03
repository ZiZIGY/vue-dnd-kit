---
title: "useDnD und Monitore"
description: "Der Zustand des Drags und seine Events, überall unterhalb des Providers – und der Provider selbst, übergeben an eine andere Vue-App."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="Wähle Tokens aus, halte das Token c gedrückt, ziehe über das gesperrte Pad" name="api-use-dnd">



</example>

## useDnD

<api-signature name="useDnD">



</api-signature>

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

Der Zustand des Drags im Provider, reaktiv. `active` und `over` werden geleert, sobald über den
Drop entschieden ist, während das Overlay noch landet.

<api-table name="DnDState">



</api-table>

### Auswahl

<api-table name="DnDSelection">



</api-table>

## useDnDMonitor

<api-signature name="useDnDMonitor">



</api-signature>

```ts
useDnDMonitor({
  onDragEnd: (e) => (e.dropped ? save(e) : undefined),
  onBeforeDrop: async (e) => ((await confirm()) ? 'accept' : 'reject'),
});
```

Deine Monitore werden vor dem Ziel zu einem Drop befragt (`onBeforeDrop`). Die Payloads findest
du unter [Events](https://zizigy.github.io/docs/api/events).

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext und provideDnDContext

<api-signature name="useDnDContext">



</api-signature>

<api-signature name="provideDnDContext">



</api-signature>

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
