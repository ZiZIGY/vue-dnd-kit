---
title: "Vue DnD Kit — drag and drop for Vue"
description: "Vue 3를 위한 정렬 가능한 리스트, 칸반 보드, 트리, 멀티 드래그. 애니메이션, 키보드 지원, 접근성을 기본으로 갖추었습니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko"
meta:
  "og:description": "Vue 3를 위한 정렬 가능한 리스트, 칸반 보드, 트리, 멀티 드래그. 애니메이션, 키보드 지원, 접근성을 기본으로 갖추었습니다."
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — Vue 3를 위한 드래그 앤 드롭Vue 3 · TypeScript · SSR

01칸반

**카드를 주고받는 보드**

02트리

**살짝 밀어서 중첩**

03멀티 드래그

**여러 항목을 한 번에**

04정렬

**스스로 정렬되는 리스트**

05애니메이션

**기본으로 움직입니다**

06A11y

space←↑↓→

**키보드도 일급 시민**

07가상화

**만 개의 행**

카드를 드래그하거나, Tab으로 카드에 이동해 화살표 키를 사용하세요

# Vue를 위한<br>드래그 앤 드롭.

Vue 3를 위한 정렬 가능한 리스트, 칸반 보드, 트리, 멀티 드래그. 애니메이션, 키보드 지원, 접근성을 기본으로 갖추었습니다.

npm i @vue-dnd-kit/core

[시작하기](https://zizigy.github.io/vue-dnd-kit/ko/docs/getting-started/introduction)

무료 오픈 소스. MIT 라이선스.

00작동 방식

## 컴포넌트가 아니라<br>컴포저블.

마크업도 스타일도 그대로입니다. 템플릿 ref를 컴포저블에 넘기면 요소가 드래그되고, 정렬되고, 드롭됩니다. 애니메이션, 키보드, 스크린 리더 대응은 라이브러리가 처리합니다.

- 01 `**makeSortableList**`드래그하는 동안 순서가 바뀌는 리스트, 그리드, 칸반 컬럼. 그룹 안에서 항목을 주고받습니다.
- 02 `**makeSortableTree**`평평하게 렌더링되는 중첩 데이터. 옆으로 살짝 밀어 깊이를 바꾸고, 폴더 안에 드롭하고, 가상화도 지원합니다.
- 03 `**makeDraggable · makeDroppable**`그 밖의 모든 것: 보드, 캔버스, 업로드. 무엇이 어디로 갈지는 직접 정합니다.

01드래그 앤 드롭

## 드래그 앤 드롭

draggable, 드롭 대상, 그리고 무엇이 어디로 갈지 정하는 규칙. 대상은 드래그를 받아들일 때 강조되고, 받지 않는 것은 거부합니다. 드롭이 무엇을 할지는 직접 정합니다.

[문서](https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/drag-and-drop)

Live 파일을 폴더로 분류하세요 X ---- · Y ----

데모 불러오는 중…

02정렬

## 리스트와 그리드

배열의 초안을 렌더링하면 드래그하는 동안 실시간으로 순서가 바뀝니다. 드롭하면 새 순서가 ref에 기록됩니다. 세로, 가로, 어떤 크기의 그리드든 됩니다.

[문서](https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/sortable-lists)

Live 앱을 재배치하거나 하나를 독으로 옮기세요 X ---- · Y ----

데모 불러오는 중…

03칸반

## 칸반 보드

한 그룹의 리스트끼리 항목을 주고받습니다. 팔레트에서 복사하고, 일반 draggable을 받아들이고, 밀어내는 대신 맞바꿀 수 있습니다. 받는 리스트는 위에 올리는 동안 자리를 내줍니다.

[문서](https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/shared-lists)

Live 컬럼 사이로 카드를 옮기세요 X ---- · Y ----

데모 불러오는 중…

04트리

## 트리

깊이와 함께 평평하게 렌더링되므로 가상화할 수 있습니다. 옆으로 드래그해 단계를 바꾸거나 폴더 위에 머물러 안에 드롭하세요. 깊이를 제한하고 무엇이 어디에 중첩될지 정할 수 있습니다.

[문서](https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/trees)

Live 옆으로 드래그해 깊이를 바꾸세요 X ---- · Y ----

데모 불러오는 중…

05멀티 드래그

## 멀티 드래그

Ctrl/Cmd-클릭하거나 사각형을 그려 선택한 뒤 하나를 드래그하세요. 선택 전체가 함께 이동해 순서대로 안착합니다. 리스트를 넘나들어도 마찬가지입니다.

[문서](https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/multi-drag)

Live Ctrl/Cmd-클릭하거나 사각형을 그린 뒤 드래그하세요 X ---- · Y ----

06제약

## 축, 경계, 그리드

드래그 영역은 그 안에서 드래그되는 모든 것의 규칙을 정합니다. 축을 고정하고, 가장자리 안에 가두고, 그리드에 스냅하세요. 앱이 실행되는 동안 바꿀 수도 있습니다.

[문서](https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/constraints)

Live 규칙을 바꾼 뒤 도형을 드래그하세요 X ---- · Y ----

데모 불러오는 중…

07그리고 더

## 실제 앱에 바로 쓸 수 있습니다.

01

### 애니메이션

정렬 중의 FLIP, 제자리에 안착하는 드롭, 애니메이션되는 데이터 변경. 원한다면 GSAP이나 motion을 쓰세요.

02

### 접근성

자리 단위로 움직이는 키보드 드래그, 실시간 안내, 직접 지정한 값을 덮어쓰지 않는 ARIA 속성.

03

### 가상 리스트

TanStack Virtual과 VueUse: 수천 개의 행도 여전히 정렬되고, 여전히 애니메이션됩니다.

04

### 제어 모드

Pinia, 서버, 불변 데이터: 기본 기록을 건너뛰고 결과를 직접 적용하세요.

08에코시스템

## 작은 코어, 몇 가지 날카로운 도구.

드래그는 코어만으로 됩니다. 나머지는 필요할 때 추가하세요.

01

@vue-dnd-kit/devtools

### DevTools

Vue DevTools와 Nuxt DevTools의 탭: 실시간 미니맵, 무엇이든 드래그하는 조이스틱, 앱 실행 중에 편집하는 옵션.

02

@vue-dnd-kit/actions

### 프로그래밍 방식 드래그

“위로 이동”, “Done으로 이동”, 가이드 투어, 테스트. 코드에서 실행하는 진짜 드래그로, 안내되고 애니메이션됩니다.

03

@vue-dnd-kit/nuxt

### Nuxt 모듈

자동 임포트되는 컴포저블, 전역 컴포넌트, SSR에 안전한 기본값.

04

npx skills add

### AI 에이전트용

Claude Code와 다른 어시스턴트에게 라이브러리의 작동 방식을 가르치는 에이전트 스킬.

npx skills add ZiZIGY/vue-dnd-kit

**01**

1,243

세 가지 브라우저에서 실행하는 E2E 테스트

**02**

469

단위 테스트

**03**

21KB

draggable과 드롭 영역, gzip 기준

**04**

9

이 문서의 언어 수

## 어디서부터 시작할지 고르세요.

[**01**<h3>**가이드 읽기**</h3>설치부터 첫 정렬 가능한 리스트까지 5분.](https://zizigy.github.io/vue-dnd-kit/ko/docs/getting-started/introduction) [**02**<h3>**예제 둘러보기**</h3>코드와 함께 보는 라이브 데모. 바로 복사하거나 StackBlitz에서 열 수 있습니다.](https://zizigy.github.io/vue-dnd-kit/ko/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/ko#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"ko-KR","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/ko","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/ko#webpage","@type":"WebPage","description":"Vue 3를 위한 정렬 가능한 리스트, 칸반 보드, 트리, 멀티 드래그. 애니메이션, 키보드 지원, 접근성을 기본으로 갖추었습니다.","url":"https://zizigy.github.io/vue-dnd-kit/ko","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/ko#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/ko"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
