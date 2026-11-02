---
title: "축, 경계, 그리드"
description: "드래그를 한 축에 고정하고, 박스 안에 가두고, 그리드나 직접 만든 가이드에 스냅합니다. 항목 하나, 리스트 하나, 또는 페이지의 한 부분 전체에 적용할 수 있습니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/constraints"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

드래그는 한 축에 묶어 두거나, 박스 안에 가두거나, 그리드에 스냅하거나, 직접 만든 규칙으로 휘게 할
수 있습니다. 이런 규칙이 **모디파이어**입니다. 모디파이어는 매 프레임 드래그의 오프셋을 조정합니다.
draggable 하나, 리스트, 또는 페이지의 한 부분에 설정하면 오버레이, 드롭 대상, 드롭 모두가 이를
따릅니다.

## 축 고정

타임라인의 클립은 자기 트랙을 따라 미끄러집니다. 고정을 끄면 트랙도 바꿀 수 있습니다.

<example height="22rem" hint="클립을 드래그하세요. 고정을 끄고 다른 트랙으로 드래그해 보세요" name="axis-timeline">



</example>

```ts [TimelineClip.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.clip.id,
  axis: () => (props.locked ? 'x' : undefined),
});
```

`axis: 'x'`는 가로로만, `'y'`는 세로로만 움직입니다. `makeDraggable`, `makeSortableList`,
`makeSortableTree`, `makeSortableItem`, `makeDragArea` 모두 이 옵션을 받습니다.

```ts
makeSortableList(listRef, { items: tracks, axis: 'y' });
```

- 고정은 **모든 모디파이어 다음에** 실행되므로, 모디파이어가 무엇을 하든 유지됩니다. 스냅이나
경계가 항목을 선 밖으로 밀어낼 수 없습니다.
- 선은 화면이 아니라 내용 안에 있습니다. 드래그가 시작된 리스트(또는 부모)와 함께 움직입니다. 드래그
도중에 페이지를 스크롤해도 항목은 자기 행에 머뭅니다.
- 항목 자체의 `axis`가 리스트나 트리의 것보다 우선하고, draggable(또는 그 리스트)의 것이 드래그
영역의 것보다 우선합니다.
- 드래그가 시작될 때 읽으므로, 위처럼 getter로 켜고 끌 수 있습니다.
- `'y'`로 고정한 트리도 여전히 중첩됩니다. 이때 깊이는 행 가운데에 머무르는 방식으로 정해집니다.

<tip>

`restrictToVerticalAxis`와 `restrictToHorizontalAxis` 모디파이어보다 `axis`를 쓰세요. 하는 일은
같지만, 일반 모디파이어라서 체인 중간에 실행되고, 그 뒤의 모디파이어(두 축을 모두 스냅하는 그리드)가
항목을 다시 축 밖으로 옮길 수 있습니다.

</tip>

## 모디파이어

모디파이어는 매 프레임 드래그의 오프셋을 조정합니다. 그 결과가 오버레이를 움직이고 **동시에** 대상을
찾는 지점이 되므로, 리스트는 고정되거나 경계에 걸리거나 스냅된 위치를 기준으로 정렬하고, 드롭의
`position`은 박스가 최종적으로 놓인 곳입니다.

<table>
<thead>
  <tr>
    <th>
      모디파이어
    </th>
    
    <th>
      하는 일
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      드래그가 시작된 컨테이너 안에 오버레이를 가둡니다. 정렬 가능한 리스트, 또는 일반 draggable의 부모 요소입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(target)
      </code>
    </td>
    
    <td>
      요소 안에 오버레이를 가둡니다. 템플릿 ref, getter, 또는 요소 자체.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      창 안에 오버레이를 가둡니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      드래그 중인 요소의 첫 번째 스크롤 가능한 조상 안에 오버레이를 가둡니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size)
      </code>
    </td>
    
    <td>
      오버레이를 그리드에 스냅합니다(아래 참고).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      집은 지점의 오프셋을 유지하는 대신 오버레이를 포인터 아래 가운데에 둡니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      세로로만 움직입니다. <code>
        axis: 'y'
      </code>
      
      를 쓰세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      가로로만 움직입니다. <code>
        axis: 'x'
      </code>
      
      를 쓰세요.
    </td>
  </tr>
</tbody>
</table>

`modifiers`는 프로바이더, 드래그 영역, 리스트와 트리, draggable과 정렬 가능한 항목의 옵션입니다.
프로바이더를 제외한 모두가 ref나 getter도 받으며, 드래그가 시작될 때 읽습니다.

### 안에 가두기

화상 통화의 내 화면은 화면 안에 머뭅니다. 경계를 바꿔 가며 멀리 밖으로 드래그해 보세요.

<example height="29rem" hint="경계마다 내 화면을 화면 밖으로 드래그해 보세요" name="bounds-pip">



</example>

```ts [SelfView.vue]
const { isDragging } = makeDraggable(el, {
  id: 'self-view',
  modifiers: () => props.modifiers, // [restrictToParent], [restrictToWindowEdges] or []
});
```

- `restrictToParent`는 부모 요소인 화면 안에 붙잡아 둡니다. 정렬 가능한 항목의 "부모"는 리스트가
DOM 어디에 있든 그 리스트입니다.
- `restrictToWindowEdges`는 화면은 벗어나게 하지만 창은 벗어나지 못하게 합니다. 화면 밖에 드롭하면
드롭 대상 위가 아니므로 원래 자리로 돌아갑니다.
- 경계가 없으면 어디로든 갑니다.

경계는 **오버레이**를 현재 크기 그대로 안에 가둡니다. `overlayFit: 'slot'`에서 더 넓은 항목의 리스트
위에서 커진 박스는 새 크기로 안에 갇힙니다.

### 그리드에 스냅

플로차트의 노드는 캔버스 그리드에 스냅됩니다. 셀 크기와 부드러운 이동을 바꿔 보세요.

<example height="29rem" hint="노드를 드래그하세요. 그리드와 smooth를 바꿔 보세요" name="snap-canvas">



</example>

```ts [FlowNode.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.node.id,
  modifiers: () => [snapToGrid({ x: props.grid, y: props.grid, smooth: props.smooth })],
});
```

`snapToGrid(24)`는 두 축을 24 px 셀에 스냅합니다. 객체로 더 설정할 수 있습니다.

<table>
<thead>
  <tr>
    <th>
      옵션
    </th>
    
    <th>
      의미
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        x
      </code>
      
      , <code>
        y
      </code>
    </td>
    
    <td>
      축별 셀 크기(픽셀). 하나를 빼면 다른 축만 스냅합니다. <code>
        { y: 15 }
      </code>
      
      는 일정을 15분 단위로 스냅하고, 요일 사이로는 자유롭게 움직이게 합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      <code>
        'container'
      </code>
      
      (기본값): 오버레이의 왼쪽 위 모서리가 컨테이너(정렬 가능한 리스트, 또는 일반 draggable의 부모)의 왼쪽 위에서 그린 그리드 선에 안착합니다. <code>
        'delta'
      </code>
      
      : 오프셋 자체를 반올림하므로, 그리드 밖에서 시작한 항목은 계속 그리드 밖에 있으며, 원래 위치에서 셀 단위로 움직입니다. 아무 곳에나 놓이면서(자유 캔버스) 각자의 정렬을 유지해야 하는 항목에 쓰세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        smooth
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       또는 <code>
        { duration, easing }
      </code>
      
      : 오버레이가 셀 사이를 부드럽게 이동합니다(기본 80 ms). 대상은 스냅된 위치를 즉시 씁니다.
    </td>
  </tr>
</tbody>
</table>

`origin: 'container'`에서는 그리드를 컨테이너의 border box부터 그리세요. 위 캔버스의 테두리는
`border`가 아니라 `box-shadow`이므로, 그리드 선이 가장자리에서 바로 시작합니다.

### 직접 만든 모디파이어

슬라이드의 박스는 다른 박스에 가까워지면 그 가장자리와 중심으로 달라붙고, 분홍색 가이드가 붙은 선을
보여 줍니다.

<example height="26rem" hint="박스를 다른 박스 옆이나 슬라이드 가운데로 드래그하세요" name="magnet-guides">



</example>

```ts [Slide.vue]
import type { Modifier } from '@vue-dnd-kit/core';

/** Near a line, the box jumps onto it. */
const magnet: Modifier = ({ transform, overlayRect, containerRect, active }) => {
  if (!containerRect) return transform;
  const id = String(active.id);
  const left = overlayRect.left - containerRect.left;
  const top = overlayRect.top - containerRect.top;
  return {
    x: transform.x + pull(left, overlayRect.width, lines(id, 'x')),
    y: transform.y + pull(top, overlayRect.height, lines(id, 'y')),
  };
};

// In order: the magnet pulls, then the slide's edges hold.
const modifiers = [magnet, restrictToParent];
```

모디파이어는 앞선 모디파이어가 남긴 드래그 시작점으로부터의 오프셋인 `transform`을 받아 새 오프셋을
반환합니다. 계산에 필요할 만한 것도 함께 받습니다.

<table>
<thead>
  <tr>
    <th>
      인자
    </th>
    
    <th>
      의미
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      지금까지의 오프셋.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      <code>
        transform
      </code>
      
      만큼 옮긴 오버레이 박스. 지금의 크기 그대로입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeRect
      </code>
    </td>
    
    <td>
      드래그가 시작될 때의 드래그 중인 요소.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        containerRect
      </code>
    </td>
    
    <td>
      드래그가 시작된 컨테이너(정렬 가능한 리스트, 또는 부모 요소)의 현재 위치. 스크롤을 따라갑니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        windowRect
      </code>
    </td>
    
    <td>
      창.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      드래그가 시작될 때의 포인터.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
      
      , <code>
        over
      </code>
    </td>
    
    <td>
      드래그와 그 아래의 대상.
    </td>
  </tr>
</tbody>
</table>

모디파이어는 매 프레임 실행되므로 빠르고 부수 효과가 없게 하세요. 위의 가이드는 모니터의
`onDragMove`에서 드래그의 `delta`, 즉 모든 모디파이어를 적용한 뒤의 오프셋으로 그립니다. 타입은
[모디파이어](https://zizigy.github.io/docs/api/modifiers)에 있습니다.

## 순서

여러 곳의 모디파이어가 차례로 실행되며, 각각은 앞의 결과에서 출발합니다.

1. 프로바이더의 `modifiers`
2. 드래그가 시작된 드래그 영역의 `modifiers`
3. 드래그 중인 항목 자체의 `modifiers`, 없으면 그 리스트나 트리의 것
4. 드래그 영역의 `restrictToArea`
5. `axis` 고정

배열 하나 안에서는 순서대로 실행되므로, 스냅과 자석은 경계보다 앞에 두세요. 경계를 마지막에 두면
다른 것이 무엇을 했든 박스를 안에 가둡니다. 위 슬라이드는 `[magnet, restrictToParent]`를 실행합니다.
순서를 반대로 하면 자석이 슬라이드 가장자리에 붙잡힌 박스를 몇 픽셀 밖으로 끌어낼 수 있습니다.

항목의 `modifiers`는 리스트의 것을 **대체합니다**. 더해지지 않습니다. 영역의 경계는 1–3단계의 스냅
다음에 오므로 스냅된 항목도 안에 머물고, 축 고정은 가장 마지막에 옵니다.

## 경계가 있는 리스트도 양 끝에 닿습니다

레이어 패널입니다. 행은 위아래로만 움직이고 패널을 벗어나지 않습니다. 맨 위 행을 맨 아래까지
드래그해 보세요.

<example height="26rem" hint="Heading을 패널 가장자리 너머 맨 아래까지 드래그하세요" name="bounded-layers">



</example>

```ts [Layers.vue]
const { items } = makeSortableList(list, { items: layers, axis: 'y', modifiers: [restrictToParent] });
```

포인터가 계속 움직여도 경계는 오버레이를 박스 가장자리에 붙잡아 둡니다. 포인터가 리스트 축을 따라
오버레이를 벗어나면 리스트는 대신 포인터를 기준으로 정렬하므로, 항목을 어떻게 잡든 첫 자리와 마지막
자리에 닿을 수 있습니다. 그리드는 계속 오버레이를 기준으로 정렬합니다. 가장자리에 붙잡힌
오버레이가 이미 가장자리 셀을 덮기 때문입니다.

## 페이지 일부를 위한 규칙

두 영역, 두 규칙입니다. Layout의 스티커는 그리드에 스냅되고 밖으로 나갈 수 없습니다. Sketch의
스티커는 Layout까지 어디로든 갑니다. 드래그는 시작된 영역의 규칙을 유지하며, 규칙이 적용 중인
영역이 강조됩니다.

<example height="25rem" hint="Layout의 스티커를 드래그한 뒤, Sketch의 스티커를 Layout으로 드래그하세요" name="drag-areas">



</example>

```vue [DragArea.vue]
<script setup lang="ts">
const area = useTemplateRef<HTMLElement>('area');
const { isDragging } = makeDragArea(area, {
  modifiers: () => (props.strict ? [snapToGrid(24)] : []),
  restrictToArea: () => props.strict,
});
</script>

<template>
  <div ref="area" class="area" :class="{ busy: isDragging }">
    <Sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker" />
  </div>
</template>
```

`makeDragArea`는 요소 **안에서 시작하는** 드래그의 규칙을 정합니다. 일반 draggable이든 정렬 가능한
항목이든 마찬가지이며, 그러면 항목 자체에는 규칙이 필요 없습니다. 앱 전체에는 `DnDProvider`를 하나만
두고, 보드, 캔버스, 피드에는 각자의 영역을 주세요.

<table>
<thead>
  <tr>
    <th>
      옵션
    </th>
    
    <th>
      하는 일
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        axis
      </code>
    </td>
    
    <td>
      드래그를 한 축에 고정합니다. draggable 자체의 <code>
        axis
      </code>
      
      나 그 리스트의 것이 우선합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      프로바이더의 것 다음, draggable 자체의 것 전에 실행됩니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      : 드래그가 영역의 요소 안에 머뭅니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      영역의 스크롤 컨테이너(요소, 또는 가장 가까운 스크롤 가능한 조상)의 자동 스크롤. <code>
        false
      </code>
      
      면 그곳에서 끕니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      포인터 종류별 <a href="/docs/guides/sensors#activation-constraints">
        활성화
      </a>
      
      . 스크롤되는 피드에서 터치를 더 길게 누르게 하는 식입니다. draggable 자체의 것이 우선하고, 프로바이더의 것이 마지막입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      영역 안에서도, 그 안의 영역에서도 드래그가 시작되지 않습니다. 영역의 draggable은 <code>
        aria-disabled
      </code>
      
      를 알립니다.
    </td>
  </tr>
</tbody>
</table>

모든 옵션은 값, ref, getter를 받으며, 누르기나 드래그가 시작될 때 읽습니다. 영역은
`isDragging`(여기서 시작한 드래그가 진행 중. 위의 강조된 테두리가 이를 보여 줍니다)과
`isAutoScrolling`(자동 스크롤이 컨테이너를 움직이는 중)을 반환합니다. 전체 레퍼런스는
[makeDragArea](https://zizigy.github.io/docs/api/make-drag-area)에 있습니다.

### 영역의 결합

- 드래그는 영역을 떠난 뒤에도 **시작된** 영역을 따릅니다. 영역 위를 지나가도 아무것도 바뀌지
않습니다. 단, `autoScroll`은 예외로, 그 컨테이너를 스크롤하는 모든 드래그에 적용됩니다.
- 중첩된 영역은 합쳐지지 않습니다. 가장 가까운 영역이 우선합니다. `disabled`는 예외로 상속됩니다.
꺼진 영역은 그 안의 영역도 끕니다.
- 충돌 감지, 키보드 키, 안내 문구는 프로바이더 전체에 적용됩니다.

<note>

보드를 두 번째 `DnDProvider`로 감싸면 어떨까요? 프로바이더는 서로 독립적입니다. 드래그는 한
프로바이더에서 다른 프로바이더로 넘어가지 않으므로, 보드의 항목은 보드를 벗어날 수 없게 됩니다.
프로바이더는 페이지의 한 부분이 프로바이더 전체에 걸친 설정을 따로 가져야 하고 그 항목이 그 안에
머물 때만 중첩하세요. [프로바이더](https://zizigy.github.io/docs/guides/provider)를 참고하세요.

</note>

## 놓은 자리에 그대로 두기

위의 타임라인, 통화 화면, 플로차트, 슬라이드, 영역은 모두 각 항목을 놓은 자리에 둡니다. 모든 드래그
이벤트에는 `position`이 들어 있습니다. 대상 안에서 드래그 중인 박스의 왼쪽 위 모서리로, 대상의 패딩
가장자리부터 재고 스크롤 양을 더한 값입니다. 절대 위치로 배치한 항목을 바로 그 자리에 두는
`left`와 `top`입니다. 모디파이어 다음에 계산되므로 스냅된 노드는 그리드에 안착합니다.

```ts [Flowchart.vue]
makeDroppable(canvas, { id: 'canvas' });
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const node = nodes.value.find((item) => item.id === active.id);
    if (!node || over?.id !== 'canvas' || !position) return;
    node.x = Math.round(position.x);
    node.y = Math.round(position.y);
  },
});
```

자유로운 드래그와 드롭 대상에 대해서는 [드래그 앤 드롭](https://zizigy.github.io/docs/guides/drag-and-drop)을 참고하세요.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
