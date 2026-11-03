---
title: "DnDProvider"
description: "그 안에서 렌더링되는 모든 것의 드래그를 관리하는 컴포넌트. 입력, 오버레이, 선택, 자동 스크롤, 라이브 리전을 맡습니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/api/dnd-provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<api-signature name="DnDProvider">



</api-signature>

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider :animation="{ duration: 200 }" @drag-end="save">
    <RouterView />
    <template #overlay="{ items, over, accepted }">
      <!-- optional: a custom overlay for every drag -->
    </template>
  </DnDProvider>
</template>
```

모든 컴포저블은 프로바이더 **안에서** 렌더링되는 컴포넌트에서 실행되어야 합니다. 앱 전체에
프로바이더 하나를 두는 것이 목표입니다. 페이지 일부의 규칙은
[`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area)로 따로 지정합니다. [프로바이더 가이드](https://zizigy.github.io/docs/guides/provider)를
참고하세요.

대부분의 props는 프로바이더가 필요할 때 읽습니다. 하나를 바꾸면 다음 드래그부터 적용됩니다.

<example height="37rem" hint="prop을 바꾼 뒤 작업을 드래그하세요. 마우스로, 길게 눌러서, Alt나 Shift를 누른 채로, 또는 포커스된 작업에서 Space로" name="api-provider-props">



</example>

### 오버레이가 렌더링되는 곳

`overlayTo`는 오버레이를 `body` 밖으로 옮깁니다. 예를 들어 페이지의 다른 모든 것보다 위에 있는 모달
`<dialog>` 안으로 옮깁니다. 스위치를 끄면 드래그하는 행이 다이얼로그 아래로 사라집니다. 언제 필요한지는
[오버레이 가이드](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto)에서 설명합니다.

<example height="22rem" hint="다이얼로그를 열고 컬럼을 드래그하세요. 그다음 스위치를 끄고 다시 드래그해 보세요" name="overlay-dialog">



</example>

## Props

<api-table name="DnDProviderProps">



</api-table>

## 이벤트

<table>
<thead>
  <tr>
    <th>
      이벤트
    </th>
    
    <th>
      페이로드
    </th>
    
    <th>
      시점
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag-start
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      드래그가 시작되었습니다(활성화 이후).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-move
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      드래그 중에 포인터가 움직였습니다(최대 프레임당 한 번).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-over
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      드래그 아래의 대상이 바뀌었습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-end
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
    </td>
    
    <td>
      드롭이 완료되고 기록되었습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-cancel
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      드래그가 취소되었거나 드롭이 거부되었습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-resume
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
      이 <code>
        'continue'
      </code>
      
      로 답했습니다. 드롭은 없었고 드래그가 계속됩니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-settle
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
      
       또는 <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      드래그의 오버레이가 안착했습니다. <code>
        drag-end
      </code>
      
      나 <code>
        drag-cancel
      </code>
      
      이 받은 것과 같습니다.
    </td>
  </tr>
</tbody>
</table>

같은 이벤트와 함께 `onBeforeDrop`도 [`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd)로
프로바이더 아래 어디서든 받을 수 있습니다. 페이로드는 [이벤트 페이지](https://zizigy.github.io/docs/api/events)에 있습니다.

## `#overlay` 슬롯

자체 오버레이 컴포넌트가 없는 모든 드래그에서 포인터를 따라다니는 것을 렌더링합니다
([오버레이 가이드](https://zizigy.github.io/docs/guides/overlay) 참고). 아무것도 렌더링하지 않으면 클론을 사용합니다.

<api-table name="OverlaySlotProps">



</api-table>

## 키보드

<api-table name="KeyboardOptions">



</api-table>

## 자동 스크롤

<api-table name="AutoScrollOptions">



</api-table>

## 햅틱

<api-table name="HapticsOptions">



</api-table>

<api-table name="HapticPattern">



</api-table>

## 안내 문구

<api-table name="Announcements">



</api-table>

<api-table name="AnnouncementContext">



</api-table>

<api-table name="AnnouncedPosition">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
