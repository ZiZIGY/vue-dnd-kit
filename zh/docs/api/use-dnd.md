---
title: "useDnD 与监听器"
description: "拖拽状态及其事件，在 provider 之下的任何地方都可使用——还可以把 provider 本身交给另一个 Vue 应用。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="选中几个标签，长按标签 c，拖到锁定的区域上方" name="api-use-dnd">



</example>

## useDnD

<api-signature name="useDnD">



</api-signature>

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

provider 拖拽的响应式状态。一旦放置结果确定，`active` 和 `over` 就会被清空，此时浮层仍在落位。`addWindow(popup)` 让 provider 在应用的另一个窗口中工作（见 [provider 指南](https://zizigy.github.io/docs/guides/provider#other-windows-of-the-app)）。

<api-table name="DnDState">



</api-table>

### 选中集合

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

关于一次放置（`onBeforeDrop`），会先询问你的监听器，再询问目标。载荷见[事件页面](https://zizigy.github.io/docs/api/events)。

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext 与 provideDnDContext

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
