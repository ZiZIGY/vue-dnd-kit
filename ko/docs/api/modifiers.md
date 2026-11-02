---
title: "모디파이어와 충돌 감지"
description: "드래그 중인 항목이 갈 위치를 바꾸는 함수와, 그 아래의 대상을 고르는 함수."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="모디파이어를 켜고 끈 뒤 초록색 토큰을 드래그하세요" name="api-modifiers">



</example>

## 모디파이어

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

모디파이어는 드래그의 오프셋을 받아 새 오프셋을 반환합니다. 실행 순서는 프로바이더의 `modifiers`,
드래그 영역의 `modifiers`, draggable 자체(또는 그 리스트)의 `modifiers`, 그다음 영역의
경계(`restrictToArea`), 마지막으로 `axis` 고정입니다. [축, 경계, 그리드](https://zizigy.github.io/docs/guides/constraints)를
참고하세요.

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
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      세로로만 움직입니다. <code>
        axis: 'y'
      </code>
      
       옵션도 같은 일을 하되 마지막에 적용됩니다. 가로로는 페이지가 어떻게 스크롤되든 드래그가 시작된 내용을 따라갑니다(<code>
        containerShift
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      가로로만 움직이고(<code>
        axis: 'x'
      </code>
      
      ), 세로로는 드래그가 시작된 내용을 따라갑니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      오버레이를 창 안에 둡니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      오버레이를 드래그가 시작된 컨테이너 안에 둡니다. 정렬 가능한 리스트, 또는 일반 draggable의 부모 요소입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      오버레이를 요소(ref, getter, 또는 요소 자체) 안에 둡니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      오버레이를 드래그 중인 요소의 첫 번째 스크롤 가능한 조상 안에 둡니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      그리드에 스냅합니다: <code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      . <code>
        x
      </code>
      
      나 <code>
        y
      </code>
      
      를 빼면 한 축만 스냅합니다. <code>
        'container'
      </code>
      
      (기본값)는 박스의 왼쪽 위 모서리를 컨테이너의 왼쪽 위 모서리에서 시작하는 그리드 선에 맞추고, <code>
        'delta'
      </code>
      
      는 오프셋을 반올림해 항목 자체의 정렬을 유지합니다. <code>
        smooth
      </code>
      
      는 오버레이가 셀 사이를 부드럽게 이동하게 합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      집은 위치의 오프셋을 유지하는 대신 오버레이를 포인터 중앙에 맞춥니다.
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## 충돌 감지

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

프로바이더의 `collision`이 대상을 고릅니다. 가장 적합한 후보가 맨 앞에 옵니다.

<table>
<thead>
  <tr>
    <th>
      함수
    </th>
    
    <th>
      고르는 것
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      기본값: 포인터 아래에 있는 것, 없으면 오버레이와 겹치는 것.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      히트 테스트로 찾은 포인터 아래의 대상(z-order, 오버레이, shadow root를 고려합니다).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      오버레이와 겹치는 대상: 우선순위가 높은 것, 그다음 더 깊이 중첩된 것, 그다음 IoU(합집합 대비 교집합)가 큰 것.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      모든 대상을 중심 사이 거리로 비교합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      모든 대상을 모서리 사이 거리의 합으로 비교합니다(칸반 컬럼처럼 쌓인 대상).
    </td>
  </tr>
</tbody>
</table>

<api-table name="CollisionDetection">



</api-table>

<api-table name="CollisionArgs">



</api-table>

<api-table name="CollisionCandidate">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
