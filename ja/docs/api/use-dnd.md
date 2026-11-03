---
title: "useDnD とモニター"
description: "ドラッグの状態とイベントを、プロバイダーの下のどこからでも。そしてプロバイダー自体を別の Vue アプリに渡す方法。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="トークンを選択し、トークン c を長押しして、ロックされたパッドの上にドラッグしてみましょう" name="api-use-dnd">



</example>

## useDnD

<api-signature name="useDnD">



</api-signature>

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

プロバイダーのドラッグの、リアクティブな状態です。`active` と `over` は、ドロップが決まった時点で、オーバーレイがまだ着地している間にクリアされます。

<api-table name="DnDState">



</api-table>

### 選択

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

ドロップ（`onBeforeDrop`）については、ターゲットより先にあなたのモニターに問い合わせます。ペイロードは[イベントのページ](https://zizigy.github.io/docs/api/events)にあります。

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext と provideDnDContext

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
