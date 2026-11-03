---
title: "useDnD와 모니터"
description: "프로바이더 아래 어디서든 쓰는 드래그 상태와 이벤트. 그리고 다른 Vue 앱에 넘겨주는 프로바이더 자체."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="토큰을 선택하고, 토큰 c를 길게 누른 뒤, 잠긴 패드 위로 드래그하세요" name="api-use-dnd">



</example>

## useDnD

<api-signature name="useDnD">



</api-signature>

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

프로바이더 드래그의 반응형 상태입니다. `active`와 `over`는 드롭이 결정되는 즉시 비워지며, 그동안
오버레이는 아직 안착하는 중입니다.

<api-table name="DnDState">



</api-table>

### 선택

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

드롭에 대해서는(`onBeforeDrop`) 대상보다 모니터에 먼저 묻습니다. 페이로드는
[이벤트 페이지](https://zizigy.github.io/docs/api/events)에 있습니다.

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext와 provideDnDContext

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
