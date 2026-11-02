---
title: "useDnD и мониторы"
description: "Состояние драга и его события в любом месте под провайдером — и сам провайдер, переданный другому Vue-приложению."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="Выделите токены, зажмите токен c, перетащите над заблокированной площадкой" name="api-use-dnd">



</example>

## useDnD

```ts
function useDnD(): DnDState;
```

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

Состояние драга провайдера, реактивное. `active` и `over` очищаются, как только бросок решён,
пока оверлей ещё приземляется.

<api-table name="DnDState">



</api-table>

### Выделение

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

События каждого драга под провайдером, пока живёт компонент. Ваши мониторы спрашиваются о
броске (`onBeforeDrop`) раньше цели. Данные событий — на [странице событий](https://zizigy.github.io/docs/api/events).

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext и provideDnDContext

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
