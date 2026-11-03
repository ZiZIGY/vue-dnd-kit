---
title: "v2에서 마이그레이션"
description: "v2 앱을 v3로 옮깁니다. 무엇이 왜 바뀌었는지, 업그레이드 방법, 모든 v2 API와 그 v3 대체 항목의 대응표, 흔한 경우의 전후 코드, 그리고 주의할 점."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3는 v2를 새로 작성한 것입니다. 모델은 그대로입니다. 프로바이더 하나와, 직접 만든 요소에 호출하는
컴포저블입니다. 하지만 대부분의 이름과 옵션이 바뀌었고, 정렬은 라이브러리 안으로 들어왔으며, 리스트마다
작성하던 드롭 핸들러는 사라집니다. 이 페이지는 v2의 각 부분을 v3에 대응시킨 뒤, 흔한 경우를 전후로
보여 줍니다.

## 바뀐 점

- **정렬이 기본으로 들어 있습니다.** v2에서 리스트는 드롭 영역이었고, 그 행은 `[index, items]`
페이로드를 가진 draggable이었으며, `onDrop`에서 `e.helpers.suggestSort()`로 정렬했습니다. v3에서는
`makeSortableList`와 `makeSortableItem`이 이를 처리합니다. 리스트는 원본 배열의 **초안**을
렌더링하고, 초안은 드래그하는 동안 순서가 바뀌며, 드롭하면 새 배열이 ref에 기록됩니다. v2의 드롭
핸들러는 대부분 옮기는 것이 아니라 삭제합니다.
- **알아서 움직입니다.** 행은 새 자리로 미끄러지고(FLIP), 오버레이는 드롭하면 자기 자리에 안착하며
취소하면 원래 자리로 돌아갑니다. `<TransitionGroup>`은 필요 없습니다.
- **여전히 패키지 하나입니다.** `@vue-dnd-kit/core`에 리스트, 트리, 멀티 드래그, 모디파이어, 센서,
충돌 감지 함수가 들어 있습니다. Nuxt 모듈은 그대로이며, `@vue-dnd-kit/actions`(프로그래밍 방식
드래그)와 `@vue-dnd-kit/devtools`는 새로 생긴 선택 패키지입니다.
- **진짜 오버레이.** `body`로 텔레포트되고, 안착할 자리의 크기에 맞춘 깊은 클론을 보여 줍니다.
오버레이 컴포넌트는 프로바이더 내부를 읽는 대신 드래그를 props로 받습니다.
- **요소가 아니라 id.** 선택, 이벤트, 드래그 상태는 데이터의 id를 key로 씁니다. 읽어야 할 DOM 요소
맵은 없습니다.
- **타입과 accept 규칙**이 일반 draggable과 드롭 대상의 `groups`를 대신합니다. 리스트는 `group`
이름으로 항목을 주고받습니다.
- **드롭 전에 결정합니다.** `onBeforeDrop`이 받을지, 거부할지, 드래그를 계속할지, 항목 일부만 받을지
정합니다. `onDrop`은 적용만 합니다.
- **센서.** 포인터와 키보드 입력은 센서입니다. 활성화는 포인터 종류별로 정하고, 터치 드래그는 길게
누르기로 시작하므로 손가락 아래에서도 리스트가 계속 스크롤됩니다.
- **영역.** `makeDragArea`가 `makeConstraintArea`와 `makeAutoScroll`을 대신하며, 자동 스크롤은 코드
없이 모든 스크롤 컨테이너에서 동작합니다.
- **접근성이 기본으로 켜져 있습니다.** ARIA 속성, 드롭 후 돌아오는 포커스, 스크린 리더 안내 문구.

## 업그레이드

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@^3
```

```bash [yarn]
yarn add @vue-dnd-kit/core@^3
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@^3
```

```bash [bun]
bun add @vue-dnd-kit/core@^3
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      패키지
    </th>
    
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.x, 선택
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.x, 선택
    </td>
  </tr>
</tbody>
</table>

- `package.json`에 `"@vue-dnd-kit/core": "^2…"`가 있는 앱은 범위가 `^3`이 될 때까지 v2에
머뭅니다.
- Vue **3.5** 이상. v2에는 의존성이 없었고, v3에는 `@vueuse/core`(14 또는 15) 하나가 있습니다.
- 브라우저: Chrome과 Edge 104+, Safari 15.4+, Firefox 104+.
- v2와 v3는 패키지 이름이 같으므로, 앱은 한 번에 v3로 옮겨 갑니다. 호환 레이어는 없습니다. v2
문서는 페이지 위쪽의 버전 메뉴에서 계속 볼 수 있습니다.

권장하는 작업 순서:

1. 패키지를 업그레이드하고 프로바이더의 props 이름을 바꾸세요([아래](#the-provider)).
2. 정렬 가능한 리스트를 각각 `makeSortableList`와 `makeSortableItem`으로 바꾸고, 그 드롭 핸들러를
삭제하세요.
3. 일반 draggable과 드롭 영역을 옮기세요.
4. 커스텀 미리보기를 오버레이 컴포넌트나 프로바이더의 `#overlay` 슬롯으로 옮기세요.
5. `makeConstraintArea`와 `makeAutoScroll`을 `makeDragArea`로 바꾸거나, 아무것도 쓰지 마세요.
6. v2를 위한 우회책을 삭제하세요. draggable의 `tabindex`와 `aria-grabbed`, 항목 전체의
`touch-action: none`, 행을 감싼 `<TransitionGroup>`, 미리보기 컴포넌트를 감싼 `markRaw`.

## 이전과 이후

표의 **대응 없음**은 v3에 그런 이름이 없다는 뜻입니다. 대신 무엇을 쓸지는 셀에 적혀 있습니다.

### 한눈에 보기

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      <code>
        DnDProvider
      </code>
      
      . 새 props와 <code>
        #overlay
      </code>
      
       슬롯이 있습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      자유로운 드래그에는 <code>
        makeDraggable
      </code>
      
      , 리스트의 행에는 <code>
        makeSortableItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      일반 드롭 대상에는 <code>
        makeDroppable
      </code>
      
      , 리스트와 트리에는 <code>
        makeSortableList
      </code>
      
       또는 <code>
        makeSortableTree
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      필요 없음: 자동 스크롤은 자동입니다. <code>
        makeDragArea
      </code>
      
      나 리스트의 <code>
        autoScroll
      </code>
      
      로 조정합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      상태는 <code>
        useDnD
      </code>
      
      , 이벤트는 <code>
        useDnDMonitor
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
      와 <code>
        provideDnDContext(app, context)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      : 이제 드래그 중인 항목 하나의 클론이며, 직접 만드는 오버레이에 씁니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      , <code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid
      </code>
      
       모디파이어.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      , <code>
        suggestSwap
      </code>
      
      , <code>
        suggestCopy
      </code>
      
      , <code>
        suggestRemove
      </code>
    </td>
    
    <td>
      리스트에 기본으로 들어 있습니다. <a href="#sorting">
        정렬
      </a>
      
      을 참고하세요.
    </td>
  </tr>
</tbody>
</table>

### 프로바이더

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      , 설정하지 않으면 꺼짐
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      : <strong>
        기본으로 켜짐
      </strong>
      
      , 창과 모든 스크롤 컨테이너에 적용됩니다. <code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       또는 <code>
        false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      , 기본으로 프로바이더 안에 렌더링
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      : 선택자나 요소, 기본값은 <code>
        'body'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #preview="{ preview }"
      </code>
      
       슬롯
    </td>
    
    <td>
      드래그를 props로 받는 <code>
        #overlay
      </code>
      
       슬롯: <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        to
      </code>
      
      . <a href="#the-overlay">
        오버레이
      </a>
      
      를 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      , <code>
        forDrop
      </code>
      
      , <code>
        forCancel
      </code>
      
      (<code>
        useDnDProvider()
      </code>
      
      에서 설정)
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      : 기본값 25 px, 자유로운 드래그용.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      , <code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
      
       화살표 키로 움직이고, <kbd value="Shift">
        
      </kbd>
      
      를 누르면 자유로운 드래그의 이동 단위가 네 배가 됩니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
      
       <code>
        collision
      </code>
      
      이 대상을 찾는 방법을 고릅니다. <code>
        pointerFirst
      </code>
      
      (기본값), <code>
        pointerWithin
      </code>
      
      , <code>
        rectIntersection
      </code>
      
      , <code>
        closestCenter
      </code>
      
      , <code>
        closestCorners
      </code>
      
      , 또는 직접 만든 함수.
    </td>
  </tr>
  
  <tr>
    <td>
      페이지마다 프로바이더 하나, 중첩 불가
    </td>
    
    <td>
      중첩할 수 있습니다. 항목은 가장 가까운 프로바이더가 관리합니다. 앱 전체에 프로바이더 하나가 여전히 목표입니다.
    </td>
  </tr>
</tbody>
</table>

v2에 대응하는 것이 없는 새 props: `activation`, `modifiers`, `sensors`, `animation`,
`dropAnimation`, `animateChanges`, `haptics`, `copyModifier`, `overlayFit`, `overlayClass`,
`overlayTransition`, `overlayPreviews`, `announcements`, `screenReaderInstructions`,
`defaultStyles`. 프로바이더는 `drag-start`, `drag-move`, `drag-over`, `drag-end`, `drag-cancel`,
`drag-resume`, `drag-settle`도 내보냅니다. 모두 [프로바이더 가이드](https://zizigy.github.io/docs/guides/provider)에 있습니다.

### 상태 읽기: `useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      : <code>
        'dragging'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'selecting'
      </code>
      
      , <code>
        'pending'
      </code>
      
       또는 <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      : <code>
        'idle'
      </code>
      
      , <code>
        'activating'
      </code>
      
      , <code>
        'dragging'
      </code>
      
      , <code>
        'dropping'
      </code>
      
       또는 <code>
        'selecting'
      </code>
      
      . <code>
        'pending'
      </code>
      
      (비동기 드롭)은 <code>
        'dropping'
      </code>
      
      이고, <code>
        null
      </code>
      
      은 <code>
        'idle'
      </code>
      
      입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      , 모디파이어를 적용한 값. 모든 이벤트에는 시작점으로부터의 오프셋인 <code>
        delta
      </code>
      
      도 있습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        ids
      </code>
      
      , <code>
        items
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        type
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      (요소)
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      (id): <code>
        has
      </code>
      
      , <code>
        add
      </code>
      
      , <code>
        delete
      </code>
      
      , <code>
        toggle
      </code>
      
      , <code>
        set
      </code>
      
      , <code>
        clear
      </code>
      
      , <code>
        ids
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      , <code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        accepted
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay.progress
      </code>
      
      , <code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      , <code>
        0
      </code>
      
      부터 <code>
        1
      </code>
      
      까지.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      , <code>
        preview.size
      </code>
      
      , <code>
        preview.render
      </code>
      
      , <code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
      
       오버레이의 위치와 크기는 라이브러리가 정합니다. <code>
        overlayTo
      </code>
      
      , <code>
        #overlay
      </code>
      
       슬롯, 또는 오버레이 컴포넌트를 쓰세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      , <code>
        droppableMap
      </code>
      
      , <code>
        visible…Set
      </code>
      
      들, <code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      새로 추가: <code>
        useDnD().cancel()
      </code>
      
      , <code>
        position
      </code>
      
      , <code>
        isAutoScrolling
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

이벤트는 `useDnDMonitor`로 옮겨 갔습니다. [이벤트와 드롭 결정](#events-and-drop-decisions)을
참고하세요. 전체 구조는 [useDnD API](https://zizigy.github.io/docs/api/use-dnd)에 있습니다.

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      : 세 번째 인자는 없습니다. 리스트의 행은 <code>
        makeSortableItem(ref, { item })
      </code>
      
      을 씁니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      , 가상 리스트에서 필요
    </td>
    
    <td>
      <code>
        id
      </code>
      
      : 데이터에서 getter로 넘기세요. 기본값은 <code>
        useId()
      </code>
      
      에서 오며 컴포넌트 인스턴스마다 새로 만들어집니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      : 값, ref, 또는 getter. <code>
        active.data
      </code>
      
      와 <code>
        active.items[i].data
      </code>
      
      로 다시 읽습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      , 대상의 <code>
        accept
      </code>
      
      와 비교됩니다. <a href="#groups">
        그룹
      </a>
      
      을 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      : 선택자나 요소 ref.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      : 누를 때마다 확인하는 조건.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      포인터 종류별 <code>
        activation
      </code>
      
      : <code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      . <code>
        distance
      </code>
      
      와 <code>
        delay
      </code>
      
      를 둘 다 주면 먼저 충족되는 쪽에서 드래그가 시작됩니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
      
       포인터 종류마다 <code>
        distance
      </code>
      
       하나.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      : 컴포넌트가 드래그를 props로 받습니다. <a href="#the-overlay">
        오버레이
      </a>
      
      를 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
      
       정렬 가능한 항목 위의 드롭 대상은 그 가운데(25~75%)에서 판정됩니다. 트리는 <code>
        nesting: 'hover'
      </code>
      
      로 중첩합니다. <a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        정렬 가능한 항목 안으로 드롭
      </a>
      
      을 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      , <code>
        onSelfDragMove
      </code>
      
      , <code>
        onSelfDragEnd
      </code>
      
      , <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      draggable에는 <strong>
        대응 없음
      </strong>
      
      : <code>
        useDnDMonitor
      </code>
      
      나 <code>
        watch(isDragging)
      </code>
      
      을 쓰세요. <a href="#events-and-drop-decisions">
        이벤트
      </a>
      
      를 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
      , 그리고 그 위를 지나는 드래그에 대한 <code>
        onDragStart
      </code>
      
      …
    </td>
    
    <td>
      같은 요소에 <code>
        makeDroppable
      </code>
      
      : <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
      
      , <code>
        selected
      </code>
      
       반환
    </td>
    
    <td>
      같습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragOver
      </code>
      
       반환
    </td>
    
    <td>
      정렬 가능한 항목은 <code>
        indicator
      </code>
      
      (<code>
        placeholder: 'indicator'
      </code>
      
      일 때)와 <code>
        isPlaceholder
      </code>
      
      를 반환하고, 드롭 대상은 <code>
        placement
      </code>
      
      를 반환합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAllowed
      </code>
      
       반환
    </td>
    
    <td>
      draggable에는 <strong>
        대응 없음
      </strong>
      
      . 드롭 대상은 <code>
        isAccepting
      </code>
      
      을 반환합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      새로 추가: <code>
        label
      </code>
      
      , <code>
        axis
      </code>
      
      , <code>
        modifiers
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , 반환된 <code>
        transform
      </code>
      
      과 함께 쓰는 <code>
        overlay: false
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        attributes
      </code>
      
      , <code>
        native
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      . 리스트를 담은 영역은 <code>
        makeSortableList
      </code>
      
      입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      : <code>
        '*'
      </code>
      
      , 타입 하나, 타입 목록, 또는 함수.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      , <code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      : 각각 독립된 옵션이며 <code>
        events
      </code>
      
       객체는 없습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      나 Promise를 반환할 수 있던 <code>
        events.onDrop
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      이 결정하고 <code>
        onDrop
      </code>
      
      이 적용합니다. <a href="#events-and-drop-decisions">
        드롭 결정
      </a>
      
      을 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      남길 id를 반환하는 <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      , <code>
        over.data
      </code>
      
      로 다시 읽습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAllowed
      </code>
      
       반환
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragOver
      </code>
      
       반환: <code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      (불리언)와 <code>
        placement
      </code>
      
      : <code>
        { top, right, bottom, left }
      </code>
      
      , 포인터가 있는 쪽 절반. <code>
        center
      </code>
      
      는 없습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      새로 추가: <code>
        id
      </code>
      
      , <code>
        label
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        overOverlay
      </code>
      
      , <code>
        overDropAnimation
      </code>
      
      , <code>
        external
      </code>
      
      (컴퓨터의 파일).
    </td>
  </tr>
</tbody>
</table>

### 드롭 이벤트

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        IDragEvent
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      : 각각 <code>
        { id, item, data, label, type }
      </code>
      
      이며, 집은 항목이 맨 앞입니다. 리스트는 <code>
        e.items
      </code>
      
      와 <code>
        e.keys
      </code>
      
      도 받습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      , <code>
        .items
      </code>
    </td>
    
    <td>
      리스트: <code>
        e.from
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      : <code>
        items
      </code>
      
      , <code>
        placement
      </code>
      
      , <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      : <code>
        id
      </code>
      
      , <code>
        data
      </code>
      
      , <code>
        element
      </code>
      
      , <code>
        rect
      </code>
      
      , <code>
        accepted
      </code>
      
      . 리스트: <code>
        e.to
      </code>
      
      , <code>
        { list, index }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음
      </strong>
      
      : 리스트가 <code>
        e.to.index
      </code>
      
      를 직접 계산합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      리스트가 드롭을 기록합니다. <code>
        e.result
      </code>
      
      에는 드롭이 바꾸는 모든 리스트의 새 배열이 들어 있습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      리스트에 <code>
        behavior: 'swap'
      </code>
      
      . <code>
        e.partner
      </code>
      
      는 자리를 맞바꾼 항목입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       또는 복사 키(<kbd value="Alt">
        
      </kbd>
      
      )와 리스트의 <code>
        clone
      </code>
      
      . <code>
        e.mode
      </code>
      
      는 <code>
        'copy'
      </code>
      
      입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      드롭 대상에서 <code>
        e.source.remove()
      </code>
      
      , 또는 리스트의 <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      , <code>
        removeAt
      </code>
      
      , <code>
        removeIndexes
      </code>
      
      , <code>
        swapAt
      </code>
      
      , <code>
        getInsertSide
      </code>
      
      , <code>
        isAtZoneStart
      </code>
      
      , <code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
      
       리스트에는 필요 없고, 일반 드롭 대상에서는 데이터를 원하는 대로 바꾸세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      새로 추가: <code>
        e.pointer
      </code>
      
      , <code>
        e.delta
      </code>
      
      , <code>
        e.position
      </code>
      
      (보드에 드롭한 항목을 놓을 위치), <code>
        e.mode
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### 정렬

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        () => items
      </code>
      
      를 넘긴 <code>
        makeDroppable
      </code>
      
       리스트
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        () => [index, items]
      </code>
      
      를 넘긴 <code>
        makeDraggable
      </code>
      
       행
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      원본 배열을 렌더링
    </td>
    
    <td>
      반환된 <code>
        items
      </code>
      
      를 렌더링: 드래그하는 동안 순서가 바뀌는 초안입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      , <code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
      (기본값), <code>
        'horizontal'
      </code>
      
       또는 <code>
        'grid'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      참조 비교로 출발 배열과 도착 배열을 찾은 뒤 <code>
        sourceItems
      </code>
      
      와 <code>
        targetItems
      </code>
      
      를 대입
    </td>
    
    <td>
      필요 없음: 드롭이 바뀌는 모든 리스트에 기록합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      기본으로 들어 있습니다. <code>
        animateChanges: true
      </code>
      
      는 드래그가 아닌 변경(추가, 삭제, 섞기)을 애니메이션합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragOver.top
      </code>
      
      , <code>
        .bottom
      </code>
      
      으로 그리는 삽입선
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
      와 항목의 <code>
        indicator.side
      </code>
      
      . <a href="/docs/guides/sortable-lists#an-insertion-line">
        삽입선
      </a>
      
      을 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      복사 전용 팔레트(<code>
        suggestCopy()
      </code>
      
      와 <code>
        copyOnly
      </code>
      
       플래그)
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      , <code>
        sort: false
      </code>
      
      , <code>
        clone
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestRemove()
      </code>
      
      를 쓰는 휴지통 영역
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
      , 또는 <code>
        dropOutside: 'remove'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia나 불변 데이터: 결과를 직접 대입
    </td>
    
    <td>
      <code>
        items
      </code>
      
      를 getter로 두고, <code>
        onDrop
      </code>
      
      에서 <code>
        e.preventDefault()
      </code>
      
      를 호출한 뒤 <code>
        e.result
      </code>
      
      를 적용합니다. <a href="/docs/guides/shared-lists#controlled-lists">
        제어 리스트
      </a>
      
      를 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      재귀 트리: 폴더마다 droppable 하나와 <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      : 컨테이너 하나, 행은 깊이와 함께 평평하게 렌더링됩니다. <a href="/docs/guides/trees">
        트리
      </a>
      
      를 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        v-model
      </code>
      
      을 쓰는 중첩 그룹(그룹마다 droppable 하나)
    </td>
    
    <td>
      리스트 안의 리스트. 모두 같은 <code>
        group
      </code>
      
      에 두고, 각각 <code>
        items: defineModel()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      가상 리스트: 모든 draggable에 <code>
        id
      </code>
    </td>
    
    <td>
      초안을 가상화 도구에 넘기고, 행에 <code>
        id: () => props.item.id
      </code>
      
      . <a href="/docs/guides/virtual-lists">
        가상 리스트
      </a>
      
      를 참고하세요.
    </td>
  </tr>
</tbody>
</table>

전후 코드는 [아래](#a-sortable-list)에 있습니다. 리스트에 관한 모든 것은
[정렬 가능한 리스트](https://zizigy.github.io/docs/guides/sortable-lists)와 [항목을 공유하는 리스트](https://zizigy.github.io/docs/guides/shared-lists)에
있습니다.

### 그룹

v2에는 모든 것에 쓰는 `groups` 옵션 하나가 있었습니다. v3는 이를 둘로 나눕니다.

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      영역의 <code>
        groups: ['dev', 'ops']
      </code>
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
      , 또는 함수: <code>
        ({ active, items, types }) => boolean
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
      , 또는 지정 안 함
    </td>
    
    <td>
      <code>
        type
      </code>
      
      이나 <code>
        accept
      </code>
      
      를 생략합니다. v2의 규칙은 그대로입니다. 타입이 없는 draggable은 어떤 규칙에도 맞고, <code>
        accept
      </code>
      
      가 없는 대상은 모든 것을 받습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      , <code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      , <code>
        'some'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      리스트 영역과 그 행의 <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList
      </code>
      
      의 <code>
        group: 'board'
      </code>
      
      . <code>
        group: { name, pull, put }
      </code>
      
      은 무엇이 나가고 들어올 수 있는지 정합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      의 <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`group`이 없는 리스트는 그 자체로 하나의 그룹이며 다른 어떤 리스트와도 항목을 주고받지 않습니다. v2에서는
groups가 없는 영역이 모든 것을 받았습니다.
[대상이 받는 드래그](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes)를 참고하세요.

### 오버레이

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      프로바이더 안에 렌더링되고 <code>
        previewTo
      </code>
      
      로 텔레포트되는 미리보기
    </td>
    
    <td>
      항상 텔레포트됩니다. <code>
        body
      </code>
      
       또는 <code>
        overlayTo
      </code>
      
      로.
    </td>
  </tr>
  
  <tr>
    <td>
      클론: 같은 태그, 그 <code>
        innerHTML
      </code>
      
      , 그 크기
    </td>
    
    <td>
      깊은 클론: 폼 값, <code>
        <canvas>
      </code>
      
       픽셀, 상속된 스타일, 테이블 셀도 함께 옵니다. 남겨 둘 것은 <code>
        data-dnd-no-clone
      </code>
      
      으로 표시하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().entities
      </code>
      
      를 읽는 <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        items
      </code>
      
      , <code>
        active
      </code>
      
      , <code>
        over
      </code>
      
      , <code>
        accepted
      </code>
      
      , <code>
        status
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        to
      </code>
      
      를 props로 받는 <code>
        overlay: Preview
      </code>
      
      . <code>
        markRaw
      </code>
      
      는 필요 없으며, 바꿔 끼우려면 <code>
        shallowRef
      </code>
      
      를 쓰세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      으로 위치를 정하는 <code>
        #preview
      </code>
      
       슬롯
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       슬롯: 박스의 위치와 크기는 라이브러리가 정합니다. 아무것도 렌더링하지 않으면 클론을 씁니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       슬롯, 또는 <code>
        overlay
      </code>
      
      로 넘긴 <code>
        shallowRef
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnter
      </code>
      
      와 <code>
        onLeave
      </code>
      
      로 바꾸는, 영역 위에서의 새 모습
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
      이나 리스트의 <code>
        overOverlay
      </code>
      
      , 또는 오버레이 컴포넌트에서 <code>
        over
      </code>
      
      를 읽으세요. <a href="/docs/guides/overlay#targets-that-change-the-overlay">
        오버레이를 바꾸는 대상
      </a>
      
      을 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      오버레이 props의 <code>
        items
      </code>
      
      . <code>
        <DragPreview :id="item.id" />
      </code>
      
      는 클론 하나를 렌더링합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid
      </code>
      
       모디파이어. 그림만이 아니라 대상을 찾는 위치와 드롭의 <code>
        position
      </code>
      
      도 스냅합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
      
      를 감싼 <code>
        <Transition>
      </code>
      
      이나 motion의 <code>
        AnimatePresence
      </code>
    </td>
    
    <td>
      집을 때는 <code>
        @starting-style
      </code>
      
      을 쓴 <code>
        overlay-class
      </code>
      
      , 안착에는 <code>
        dropAnimation
      </code>
      
      , 컴포넌트 사이에는 <code>
        overlayTransition
      </code>
      
      . <a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        들어 올리고, 기울이고, 내려놓기
      </a>
      
      를 참고하세요.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      박스의 <code>
        [data-dnd-overlay]
      </code>
      
      (<code>
        "dragging"
      </code>
      
      , <code>
        "dropping"
      </code>
      
      ), 그 안의 <code>
        [data-dnd-overlay-content]
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      직접 갱신하던 <code>
        preview.size
      </code>
    </td>
    
    <td>
      박스가 안착할 자리의 크기를 따릅니다(<code>
        overlayFit
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      드롭하면 미리보기가 사라짐
    </td>
    
    <td>
      자기 자리에 안착하거나, 취소하면 원래 자리로 돌아갑니다.
    </td>
  </tr>
</tbody>
</table>

자세한 내용은 [오버레이 가이드](https://zizigy.github.io/docs/guides/overlay)에 있습니다.

### 선택과 멀티 드래그

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
      이 반환하는 <code>
        selected
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable
      </code>
      
      과 <code>
        makeSortableItem
      </code>
      
      이 반환하는 <code>
        selected
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      , 요소의 집합
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      , id가 key.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      : 기본으로 Ctrl(<code>
        ControlLeft
      </code>
      
      )을 누른 채
    </td>
    
    <td>
      기본으로 키가 필요 없습니다. 영역의 빈 공간을 누르면 사각형을 그립니다. <code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
      로 Ctrl을 되살릴 수 있습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        KeyboardEvent.code
      </code>
      
      로 쓰는 <code>
        modifier.keys
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
      (<code>
        'Control'
      </code>
      
      , <code>
        'Shift'
      </code>
      
      ) 또는 <code>
        .code
      </code>
      
      (<code>
        'ControlLeft'
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      , <code>
        'select'
      </code>
    </td>
    
    <td>
      같습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      같습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      선택을 한꺼번에 옮기는 <code>
        suggestSort()
      </code>
    </td>
    
    <td>
      리스트가 옮깁니다. <code>
        multiple: 'group'
      </code>
      
      (기본값), <code>
        'gaps'
      </code>
      
       또는 <code>
        'stack'
      </code>
      
      이 다른 항목이 도중에 어떻게 할지 정합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      섞인 선택을 위한 <code>
        onValidate
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
      과 id를 반환하는 <code>
        onBeforeDrop
      </code>
      
      . <a href="/docs/guides/multi-drag#taking-only-some">
        일부만 받기
      </a>
      
      를 참고하세요.
    </td>
  </tr>
</tbody>
</table>

자세한 내용은 [멀티 드래그와 선택](https://zizigy.github.io/docs/guides/multi-drag)에 있습니다.

### 축, 경계, 스냅

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      , 그 안에서 시작하는 드래그에 적용됩니다. <code>
        axis
      </code>
      
      는 draggable, 리스트, 트리, 항목에도 쓸 수 있습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      <code>
        axis
      </code>
      
      를 생략합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
      , 또는 모디파이어 <code>
        restrictToParent
      </code>
      
      와 <code>
        restrictToElement(el)
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      규칙을 나누기 위한 구역별 프로바이더
    </td>
    
    <td>
      프로바이더 하나와 구역마다 <code>
        makeDragArea
      </code>
      
      . 그 항목은 여전히 어디로든 움직일 수 있습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      , <code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       또는 <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
      를 프로바이더, 영역, 리스트, draggable의 <code>
        modifiers
      </code>
      
      에.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      새로 추가: <code>
        restrictToWindowEdges
      </code>
      
      , <code>
        restrictToFirstScrollableAncestor
      </code>
      
      , <code>
        snapCenterToCursor
      </code>
      
      , 그리고 직접 만든 모디파이어.
    </td>
  </tr>
</tbody>
</table>

자세한 내용은 [축, 경계, 그리드](https://zizigy.github.io/docs/guides/constraints)에 있습니다.

### 자동 스크롤

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      , 기본으로 꺼짐
    </td>
    
    <td>
      기본으로 켜짐, 창과 모든 스크롤 컨테이너에 적용됩니다. <code>
        :auto-scroll="false"
      </code>
      
      로 끕니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      필요 없음: <code>
        overflow: auto
      </code>
      
      나 <code>
        scroll
      </code>
      
      인 요소는 모두 스크롤됩니다. 하나를 조정하려면 <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       또는 리스트의 <code>
        autoScroll
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      px 단위, 또는 변마다 정하는 <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      : 컨테이너 크기에 대한 비율(<code>
        0.2
      </code>
      
      ), 24~96 px 사이. 변마다 정하는 임계값은 <strong>
        대응 없음
      </strong>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      배수인 <code>
        speed
      </code>
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
      (프레임당 25 px)와 <code>
        acceleration
      </code>
      
      (10).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      나 <code>
        useDnD()
      </code>
      
      의 <code>
        isAutoScrolling
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

### 키보드와 접근성

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      모든 draggable의 <code>
        tabindex="0"
      </code>
    </td>
    
    <td>
      자동으로 설정되며 <code>
        role
      </code>
      
      , <code>
        aria-roledescription
      </code>
      
      , <code>
        aria-describedby
      </code>
      
      , <code>
        aria-disabled
      </code>
      
      , <code>
        aria-pressed
      </code>
      
      도 붙습니다. 직접 지정한 속성이 우선합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      직접 쓴 <code>
        :aria-grabbed="isDragging"
      </code>
    </td>
    
    <td>
      지우세요. <code>
        aria-pressed
      </code>
      
      가 드래그를 따라갑니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().keyboard.keys
      </code>
      
      에 지정한 키
    </td>
    
    <td>
      프로바이더의 <code>
        keyboard
      </code>
      
       prop. 바인딩은 <code>
        event.code
      </code>
      
      나 <code>
        event.key
      </code>
      
      와 비교됩니다.
    </td>
  </tr>
  
  <tr>
    <td>
      화살표 키가 미리보기를 <code>
        keyboard.step
      </code>
      
      만큼 이동
    </td>
    
    <td>
      자유로운 드래그: <code>
        keyboard.step
      </code>
      
       px씩. 리스트: 자리 단위로, 그리고 그룹의 다음 리스트로. <code>
        keyboardMode: 'droppables'
      </code>
      
      는 대상 사이를 건너뜁니다.
    </td>
  </tr>
  
  <tr>
    <td>
      화살표 키 다시 지정(<code>
        forMove
      </code>
      
      , <code>
        forMoveFaster
      </code>
      
      )
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      안내 문구 없음
    </td>
    
    <td>
      라이브 리전이 집기, 이동, 드롭, 취소를 모두 안내합니다. <code>
        label
      </code>
      
      이 이름을 붙이고, <code>
        announcements
      </code>
      
      와 <code>
        screenReaderInstructions
      </code>
      
      가 문구를 바꿉니다.
    </td>
  </tr>
</tbody>
</table>

자세한 내용은 [접근성](https://zizigy.github.io/docs/guides/accessibility)에 있습니다.

### 이벤트와 드롭 결정

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      draggable의 <code>
        events.onSelfDragStart
      </code>
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
      에서 <code>
        active.ids
      </code>
      
      를 확인합니다. 클래스만 바꾼다면 <code>
        isDragging
      </code>
      
      으로 충분합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      모니터의 <code>
        onDragMove
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      , 드롭이든 취소든
    </td>
    
    <td>
      모니터의 <code>
        onDragEnd
      </code>
      
      (드롭)와 <code>
        onDragCancel
      </code>
      
      . <code>
        onDragSettle
      </code>
      
      은 오버레이가 안착한 뒤 둘 다 받습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      모니터의 <code>
        onDragCancel
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      draggable의 <code>
        onHover
      </code>
      
      , <code>
        onLeave
      </code>
      
      , 그리고 그 위를 지나는 드래그에 대한 <code>
        onDragStart
      </code>
      
      …
    </td>
    
    <td>
      그 요소에 <code>
        makeDroppable
      </code>
      
      : <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      . 리스트의 행에는 아무것도 필요 없습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      droppable의 <code>
        events.onEnter
      </code>
      
      , <code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      , <code>
        onDragLeave
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      droppable의 <code>
        events.onDrop
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      이 결정하고, 그다음 <code>
        onDrop
      </code>
      
      이 적용합니다. <code>
        onDrop
      </code>
      
      은 동기이며, 반환값은 무시됩니다.
    </td>
  </tr>
  
  <tr>
    <td>
      droppable의 <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
      과 함께 쓰는 <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      새로 추가: 프로바이더의 <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
      , 그리고 모니터의 <code>
        onDragOver
      </code>
      
      , <code>
        onBeforeDrop
      </code>
      
      , <code>
        onDragResume
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

v2의 `onDrop`은 값이나 값의 Promise를 반환해 드롭을 결정할 수 있었습니다. v3에서는 그것이 리스트,
트리, 드롭 대상, 모니터에 있는 `onBeforeDrop`의 일입니다.

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        onDrop
      </code>
      
      의 반환값
    </th>
    
    <th>
      v3 <code>
        onBeforeDrop
      </code>
      
      의 반환값
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      아무것도 없음, 또는 <code>
        true
      </code>
      
      : 드롭이 진행됨
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
      , 또는 아무것도 없음.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      : 이 드롭은 거절되고 드래그는 계속됨
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      . <strong>
        이제 <code>
          false
        </code>
        
        는 드롭을 거부합니다.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      거부된 Promise나 예외: 드래그가 취소됨
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       또는 <code>
        false
      </code>
      
      . 예외도 거부합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      Promise. 그동안 <code>
        state
      </code>
      
      는 <code>
        'pending'
      </code>
    </td>
    
    <td>
      Promise. 그동안 <code>
        status
      </code>
      
      는 <code>
        'dropping'
      </code>
      
      이고, 오버레이는 <code>
        data-dnd-overlay="dropping"
      </code>
      
       상태로 기다립니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
      가 <code>
        IDragItem[]
      </code>
      
      을 반환
    </td>
    
    <td>
      id 배열: 그 항목만 드롭되고 나머지는 원래 자리로 돌아갑니다.
    </td>
  </tr>
</tbody>
</table>

먼저 모니터가 답하고, 그다음 대상이 답합니다. 그 뒤 대상의 `onDrop`이 실행되고, 리스트가 새 배열을
기록하며, `onDragEnd`가 이어집니다. 자세한 내용은 [드롭 결정하기](https://zizigy.github.io/docs/guides/drop-decisions)와
[이벤트 API](https://zizigy.github.io/docs/api/events)에 있습니다.

### 타입

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      (드롭 대상, 모니터), <code>
        SortableDropEvent
      </code>
      
      (리스트), <code>
        DnDEndEvent
      </code>
      
      (<code>
        onDragEnd
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        대응 없음.
      </strong>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      , <code>
        ISuggestSwapResult
      </code>
      
      , <code>
        ISuggestCopyResult
      </code>
      
      , <code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      : <code>
        result
      </code>
      
      , <code>
        to
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        partner
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       안의 <code>
        DnDEvent
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        center
      </code>
      
      가 없는 <code>
        Placement
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
      , <code>
        useDnD()
      </code>
      
      가 반환하는 것.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      , <code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      <code>
        DraggableOptions
      </code>
      
      , <code>
        DroppableOptions
      </code>
      
      , <code>
        DnDMonitor
      </code>
      
      의 콜백.
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@^3 @vue-dnd-kit/core@^3
```

<table>
<thead>
  <tr>
    <th>
      v2 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x)
    </th>
    
    <th>
      v3 (<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.x)
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeConstraintArea
      </code>
      
      , <code>
        makeAutoScroll
      </code>
      
      , <code>
        useDnDProvider
      </code>
      
       자동 임포트
    </td>
    
    <td>
      <code>
        makeDraggable
      </code>
      
      , <code>
        makeDroppable
      </code>
      
      , <code>
        makeSortableList
      </code>
      
      , <code>
        makeSortableItem
      </code>
      
      , <code>
        makeSortableTree
      </code>
      
      , <code>
        makeSelectionArea
      </code>
      
      , <code>
        makeDragArea
      </code>
      
      , <code>
        useDnD
      </code>
      
      , <code>
        useDnDMonitor
      </code>
      
       자동 임포트.
    </td>
  </tr>
  
  <tr>
    <td>
      타입은 자동 임포트되지 않음
    </td>
    
    <td>
      주요 타입은 자동 임포트됩니다(<code>
        DnDEvent
      </code>
      
      , <code>
        SortableDropEvent
      </code>
      
      , <code>
        OverlayProps
      </code>
      
      …). 범용 타입(<code>
        Key
      </code>
      
      , <code>
        Active
      </code>
      
      , <code>
        Over
      </code>
      
      )은 직접 임포트합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      모디파이어, 충돌 감지 함수, 센서는 요청할 때만: <code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
      와 <code>
        DragPreview
      </code>
      
      가 전역
    </td>
    
    <td>
      같으며, <code>
        prefix
      </code>
      
       옵션이 있습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      레이아웃의 프로바이더 안에 둔 <code>
        <DragPreview />
      </code>
    </td>
    
    <td>
      지우세요. 오버레이는 프로바이더가 렌더링합니다. <code>
        DragPreview
      </code>
      
      는 <code>
        id
      </code>
      
      를 받으며 오버레이 컴포넌트 안에서 씁니다.
    </td>
  </tr>
  
  <tr>
    <td>
      peer 의존성 <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      peer 의존성 <code>
        @vue-dnd-kit/core
      </code>
      
       3, Nuxt 4.
    </td>
  </tr>
</tbody>
</table>

`nuxt.config.ts`의 `modules: ['@vue-dnd-kit/nuxt']`는 그대로입니다.
[설치](https://zizigy.github.io/docs/getting-started/installation#nuxt)를 참고하세요.

## 전과 후

### draggable과 드롭 영역

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- 카드는 `tabindex`, `role`, `aria-*` 속성을 스스로 받습니다. `<button>` 핸들은 포커스를 받을 수
있고, 키보드 드래그는 거기서 시작합니다.
- `groups`는 draggable에서는 `type`, 대상에서는 `accept`가 되었습니다. 콜백은 `events` 객체에서
나왔습니다.
- `isAccepting` 없이 `isOver`만 참이면 드래그를 거부하는 대상입니다. 거기에 드롭하면 원래 자리로
돌아갑니다.

### 정렬 가능한 리스트

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- 초안인 `items`를 렌더링하세요. 드래그하는 동안 순서가 바뀝니다. 드롭하면 `tasks`가 새 순서를 받고,
`defineModel`이 `update:modelValue`를 내보냅니다.
- 인덱스도, 페이로드도, `onDrop`도, `<TransitionGroup>`도 없습니다. 행은 알아서 미끄러집니다.
- 드래그 중인 행은 안착할 자리로서 리스트에 남습니다. 숨기지 말고 `isPlaceholder`나
`[data-dnd-placeholder]`로 스타일을 지정하세요.

### 항목을 공유하는 리스트

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

드롭은 두 배열 모두에 기록합니다. 작업이 떠난 배열과 들어간 배열입니다. `TaskItem.vue`는 위의 정렬
가능한 리스트에 있는 것과 같습니다. 복사본을 나눠 주는 팔레트는 `suggestCopy()`와 `copyOnly` 플래그로
만들었지만, 이제는 리스트입니다.

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

Pinia 스토어나 직접 기록하지 않는 다른 상태라면 `items`를 getter로 넘기고, `onDrop`에서
`e.preventDefault()`를 호출한 뒤 `e.result`를 적용하세요.
[제어 리스트](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists)를 참고하세요.

### 커스텀 오버레이

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- 컴포넌트는 드래그를 props로 받습니다. `items`(드래그 중인 모든 항목, 집은 항목이 맨 앞), `over`,
`accepted`, `status`, `mode`, `to`. 읽는 것만 선언하세요. 리스트의 행이라면 리스트 항목은
`items[0].item`입니다.
- 그대로 넘기세요. 바꿔 끼울 때는 `shallowRef`를 쓰고, 깊은 `ref`는 절대 쓰지 마세요.

프로바이더의 슬롯도 같은 식으로 바뀌며, 컴포넌트가 더 이상 스스로 위치를 정하지 않습니다.

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

`DragPreview`를 `<Transition>`으로 감싸던 팝인 효과는 `@starting-style`을 쓴 `overlay-class`가
됩니다. [들어 올리고, 기울이고, 내려놓기](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)를
참고하세요.

### 확인을 받는 드롭

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

리스트도 같은 방식으로 묻고, Promise를 쓰면 직접 만든 다이얼로그를 열 수 있습니다. Promise가 끝날
때까지 오버레이는 놓은 자리에서 기다립니다.

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

섞인 선택에서 맞는 부분만 받던 영역(`groupMatch: 'some'`):

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

리스트는 코드 없이 이렇게 합니다. `acceptMode: 'some'`이면 `group.put`이 받는 항목은 안착하고,
나머지는 원래 자리로 돌아갑니다.

## 업그레이드할 때 주의할 점

- **범위를 지정해 v3를 설치하세요.** `package.json`에 `^3`. `npm update`는 `^2`를 v2에 그대로
둡니다.
- **초안을 렌더링하세요.** 리스트는 원본 배열이 아니라 `makeSortableList`가 반환하는 `items`를
렌더링합니다. 원본 배열을 렌더링하면 드롭할 때까지 아무것도 움직이지 않습니다.
- **두 번 정렬하지 마세요.** 리스트에서 `suggestSort` 코드를 지우세요. 리스트는 `onDrop` 뒤에 각
드롭을 쓰기 가능한 `items` ref에 기록합니다. 직접 적용하려면 `e.preventDefault()`를 호출하고
`e.result`를 쓰세요.
- **false는 드롭을 거부합니다.** v2에서는 `false`로 resolve된 `onDrop`이 드래그를 계속했습니다.
v3에서는 `onBeforeDrop`에서 `'continue'`를 반환하세요. `onDrop`에서 반환한 Promise는 무시됩니다.
- **리스트는 같은 group 안에서만 공유합니다.** `group`이 없는 리스트는 다른 어떤 리스트와도
주고받지 않습니다.
- **행의 key는 id로 하세요.** `:key="index"`는 엉뚱한 행을 애니메이션합니다. id도 데이터에서
넘기세요. 기본 id는 컴포넌트 인스턴스마다 새로 만들어집니다.
- **<TransitionGroup>도, transform에 대한 transition도 쓰지 마세요.** 라이브러리가 행을 직접
움직이므로 움직임이 두 번 애니메이션됩니다.
- **터치 우회책을 되돌리세요.** 항목 전체에 건 `touch-action: none`은 손가락 아래에서 페이지가
스크롤되지 않게 막습니다. v3는 대신 길게 누르기로 터치 드래그를 시작합니다. 바로 드래그해야 하는
핸들에는 `activation: { touch: { distance: 4 } }`와 함께 남겨 두세요.
- **오래된 속성을 지우세요.** 라이브러리는 `tabindex`, `role`, 필요한 `aria-*`를 설정하고 직접
지정한 속성은 절대 덮어쓰지 않으므로, 남아 있는 `role`이나 `aria-grabbed`는 남겨 둔 그대로
유지됩니다.
- **오버레이 스타일을 다시 지정하세요.** `.dnd-kit-preview`는 없어졌습니다.
`[data-dnd-overlay='dragging']` 안에 있는 것에 스타일을 지정하고, 박스의 `transform`은 절대
건드리지 마세요. 오버레이 컴포넌트의 루트에 `width: 100%; height: 100%`를 주고, 레이아웃에서
`<DragPreview />`를 빼세요.
- **자동 스크롤은 켜져 있습니다.** v2에서 스크롤되지 않던 곳에는 `:auto-scroll="false"`를 넘기세요.
- **선택 사각형에는 키가 필요 없습니다.** `makeSelectionArea`는 빈 공간을 그냥 누르기만 해도 그립니다.
v2의 Ctrl을 유지하려면 `modifier`를 추가하세요.
- **프로바이더는 하나, 영역은 그 안에.** 항목은 프로바이더를 넘나들 수 없습니다. 규칙을 나누려고
구역마다 프로바이더를 쓰던 페이지에는 프로바이더 하나와 구역마다 `makeDragArea`가 필요합니다.
- **인자는 두 개입니다.** `makeDraggable`과 `makeDroppable`은 ref와 옵션 객체를 받으며, 페이로드는
없습니다.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
