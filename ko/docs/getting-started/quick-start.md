---
title: "빠른 시작"
description: "파일 세 개로 만드는 정렬 가능한 리스트 — 프로바이더, 리스트, 그리고 그 행."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/getting-started/quick-start"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

전체가 실제로 동작하는 모습입니다. 행을 드래그하거나, Tab으로 행에 이동해 <kbd value="Space">



</kbd>

를
누르고, 화살표 키로 옮긴 다음 <kbd value="Space">



</kbd>

를 다시 누르세요.

<example name="quick-start" title="빠른 시작">



</example>

## 단계별로

<steps level="3">

### 앱을 프로바이더로 감싸기

`DnDProvider`가 드래그를 관리합니다. 모든 컴포저블은 프로바이더 **안에서 렌더링되는** 컴포넌트에서
실행되어야 합니다. 템플릿에 프로바이더를 직접 포함한 컴포넌트에서는 안 됩니다.

### 리스트 만들기

`makeSortableList`는 리스트 요소와 배열을 받습니다. 반환값 `items`는 드래그하는 동안 실시간으로
순서가 바뀌는 초안입니다. 원본 배열이 아니라 초안을 렌더링하고, 행의 key는 id로 지정하세요.

### 행 만들기

각 행은 자신의 요소와 렌더링하는 항목을 넘겨 `makeSortableItem`을 호출합니다. 행의 key는
`item.id`에서 가져옵니다.

</steps>

드롭이 끝나면 `tasks`에 새 순서가 들어갑니다. 평범한 `ref`이므로 앱의 다른 부분도 다른 변경과
똑같이 이 변화를 봅니다.

<tip>

Pinia, 서버, 불변 데이터를 사용한다면 ref 대신 getter를 넘기고, `onDrop`에서 `e.preventDefault()`를
호출한 뒤 `e.result`를 직접 적용하세요.

</tip>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
