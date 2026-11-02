---
title: "애니메이션"
description: "애니메이션의 옵션과 훅. 정렬, 드롭, 그리고 드래그가 아닌 변경."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

프로바이더의 `animation`(정렬 중 레이아웃 이동), `dropAnimation`(오버레이 안착), `animateChanges`(드래그가
아닌 데이터 변경)는 `false`, 옵션, 또는 직접 만든 함수를 받습니다. GSAP이나 motion에 쓸 수 있습니다.
리스트와 트리는 `animation`과 `animateChanges`를 재정의할 수 있고, draggable, 항목, 리스트는
자기만의 `dropAnimation`을, 드롭 대상은 `overDropAnimation`을 가질 수 있습니다. [애니메이션](https://zizigy.github.io/docs/guides/animations)을 참고하세요.

```vue
<DnDProvider :animation="{ duration: 180, easing: 'ease-out' }" :drop-animation="false" />
```

아래의 각 레인은 독립된 프로바이더이며, `animation`, `dropAnimation`, `animateChanges`에 같은 종류의
값을 줍니다(`animateChanges`는 `move`에서 함수를 받습니다).

<example height="27rem" hint="섞거나, 각 레인에서 행을 드래그하세요" name="api-animation-shapes">



</example>

## 옵션

<api-table name="AnimationOptions">



</api-table>

## 정렬

<api-table name="LayoutAnimation">



</api-table>

<api-table name="LayoutAnimationContext">



</api-table>

## 드롭

<api-table name="DropAnimation">



</api-table>

<api-table name="DropAnimationContext">



</api-table>

## 데이터 변경

<api-table name="AutoAnimation">



</api-table>

<api-table name="AutoAnimationOptions">



</api-table>

<api-table name="EnterAnimation">



</api-table>

<api-table name="EnterAnimationContext">



</api-table>

<api-table name="LeaveAnimation">



</api-table>

<api-table name="LeaveAnimationContext">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
