---
title: "항목을 공유하는 리스트"
description: "같은 그룹의 리스트는 항목을 옮기고, 복사하고, 맞바꿉니다. 컬럼 전체가 드롭을 받고, pull과 put이 들어오고 나가는 것을 정하며, 팔레트는 복사하고, 제어 리스트는 각 드롭을 실행 취소 기록이 있는 스토어에 적용합니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/guides/shared-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="31rem" hint="리스트 사이에서 스토리를 옮기세요. 드롭 영역을 껐다 켜 보세요" name="sprint-planning">



</example>

## 그룹

`group` 이름이 같은 리스트끼리 항목을 주고받습니다. 기본적으로 각 리스트는 저마다 하나의 그룹입니다.

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import StoryCard from './StoryCard.vue';

type Story = { id: string; title: string; points: number };
const props = defineProps<{ column: { id: string; title: string; stories: Story[] } }>();

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,                     // names the list in drop events
  items: toRef(props.column, 'stories'),   // a writable ref into the reactive column
  group: 'planning',                       // same name: stories move between these lists
});
</script>

<template>
  <section :class="{ over: isOver }">
    <h3>{{ column.title }}</h3>
    <ul ref="list">
      <StoryCard v-for="story in items" :key="story.id" :story="story" />
    </ul>
  </section>
</template>
```

```vue [index.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'backlog', title: 'Backlog', stories: [{ id: 's1', title: 'Saved searches', points: 5 }] },
  { id: 'sprint', title: 'Sprint 14', stories: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

- 여기서는 보통 그렇듯 각 컬럼이 컴포넌트 하나입니다. 컴포넌트 하나가 리스트를 여러 개 만들 수도
있습니다(나란히 놓인 고정된 Todo와 Done). 각 카드는 자신을 감싼 요소의 리스트에 들어갑니다.
- 부모가 반응형 객체를 넘기므로 `toRef(props.column, 'stories')`는 쓰기 가능합니다. 드롭은 스토리가
떠난 배열과 들어간 배열 모두에 기록하고, 두 컬럼의 포인트도 따라 바뀝니다.
- `id`는 드롭 이벤트에서 `from.list`와 `to.list`로 나타나고, 드롭이 바꾸는 모든 리스트의 새 배열인
`e.result`의 키가 됩니다. `id`와 `group`은 한 번만 읽습니다.
- key는 그룹 전체에서 고유해야 합니다.

리스트의 `onDrop`은 그 리스트 **안으로** 들어오는 드롭에 대해 실행됩니다. `backlog`에서 `sprint`로
옮기면 `sprint` 리스트의 `onDrop`이 호출되고, 그 `e.result`에는 두 리스트의 새 배열이 들어
있습니다.

## 컬럼 전체가 드롭 받기: `dropzone`

키가 큰 컬럼 안의 짧은 리스트는 마지막 카드 아래에 빈 공간을 남깁니다. `dropzone`을 쓰면 다른
요소가 리스트 대신 드롭을 받습니다. 여기서는 컬럼 전체입니다. 마지막 스토리 아래에 놓은 스토리는
끝에 안착합니다. 스토리는 `<ul>` 안에 그대로 있고, 드롭을 받는 영역만 커집니다. 데모는 드래그하는
동안 그 영역에 외곽선을 표시합니다. 이를 끄면 리스트 자체만 스토리를 받습니다.

```ts [Column.vue]
const zone = useTemplateRef<HTMLElement>('zone');
const { items } = makeSortableList(list, {
  items: toRef(props.column, 'stories'),
  group: 'planning',
  dropzone: zone,   // or a getter: () => (wholeColumn.value ? zone.value : undefined)
});
```

<tip>

`dropzone`이 없으면 빈 리스트가 드롭을 받으려면 크기가 있어야 합니다. `min-height`를 주세요.

</tip>

## 들어오고 나가는 것: `pull`과 `put`

`group`은 객체도 받습니다. `pull`은 리스트에서 무엇이 나갈 수 있는지, `put`은 무엇이 들어올 수
있는지 정합니다.

<example height="36rem" hint="리스트 사이에서 파일을 드래그하세요. 각 리스트가 받는지, 받지 않는다면 왜인지 알려 줍니다" name="group-rules">



</example>

<table>
<thead>
  <tr>
    <th>
      옵션
    </th>
    
    <th>
      값
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pull
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      (기본값): 항목이 나갈 수 있습니다. <code>
        false
      </code>
      
      : 나갈 수 없습니다. <code>
        'clone'
      </code>
      
      : 복사본이 나가고 항목은 남습니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        put
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      (기본값): 항목이 들어올 수 있습니다. <code>
        false
      </code>
      
      : 아무것도 들어오지 않습니다. 타입 하나 또는 여러 개(<code>
        'image'
      </code>
      
      , <code>
        ['image', 'video']
      </code>
      
      ): 그 타입의 항목이 들어옵니다. 함수: 드래그마다 직접 정합니다.
    </td>
  </tr>
</tbody>
</table>

```ts [index.vue]
// Inbox: gives, takes nothing.
group: { name: 'files', pull: true, put: false }

// Templates: gives copies, takes nothing, keeps its order.
group: { name: 'files', pull: 'clone', put: false }, sort: false

// Images: takes images only.
group: { name: 'files', put: 'image' }
```

타입은 드래그 중인 항목의 `type` 옵션(`makeSortableItem(el, { item, type })`)이며, 타입이 없는
항목은 그룹 이름으로 칩니다. `put`에 타입을 쓰면 드래그 중인 모든 항목이 그중 하나를 가져야
합니다(`acceptMode: 'some'`이면 가진 항목만 들어옵니다).

`put` 함수는 `{ keys, items, types, from, to }`를 받습니다. 드래그 중인 key와 항목, 그 타입,
출발한 리스트(일반 draggable이면 `null`), 그리고 이 리스트입니다. 리스트 안에서의 이동은 항상
허용됩니다. Inbox도 자기 파일의 순서는 바꿀 수 있습니다.

드래그를 거부하는 리스트 위에서는 자리가 드래그를 시작한 곳으로 돌아가므로, 리스트는 드롭했을 때
일어날 일, 즉 아무 일도 없음을 보여 줍니다. 그곳에 드롭하면 취소되고 항목은 원래 자리로
돌아갑니다. 이런 드래그 동안 리스트의 `isAccepting`은 `false`이고, 그 위에서 `isOver`는 여전히
`true`입니다. 데모의 각 리스트는 이렇게 무슨 말을 할지 압니다.

리스트 밖에 있는 별도의 드롭 대상(휴지통 등) 위에서도 자리는 원래 위치로 돌아갑니다. 그곳의 드롭은
대상의 것이며, 대상의 `onDrop`이 항목을 꺼내지 않는 한(`event.source.remove()`) 리스트는 항목을
그대로 둡니다. 리스트 안에 있는 대상(항목 안으로 드롭)과 리스트를 감싼 대상(리스트가 들어 있는
패널)에서는 자리가 그 자리에 그대로 있습니다.

```ts [RuleList.vue]
const { items, isOver, isAccepting } = makeSortableList(el, { … });
const { active } = useDnD();
const verdict = computed(() => (active.value ? (isAccepting.value ? 'takes' : 'refuses') : null));
```

### 개수 제한

파일을 최대 세 개까지 담는 리스트, Shortlist입니다.

```ts [index.vue]
const shortlist = reactive({
  files: [/* … */],
  group: { name: 'files', put: ({ keys }: SortablePutContext) => shortlist.files.length + keys.length <= 3 },
});
```

드래그가 물어볼 때 자기 항목을 읽습니다. 가득 채우면 다음 파일을 거부하고, 헤더에 이유를
표시합니다.

타입이 다른 여러 선택 항목을 드래그할 때 `acceptMode`는 그중 `'all'`(기본값)이 `put`을 통과해야
하는지, `'some'`만 통과하면 되는지 정합니다. `'some'`이면 통과한 항목은 안착하고 나머지는 원래
자리로 돌아갑니다. [멀티 드래그](https://zizigy.github.io/docs/guides/multi-drag#taking-only-some)를 참고하세요.

### 리스트마다 그룹 하나

리스트는 그룹 하나에만 속합니다. `group`은 이름 하나만 받고, 여러 개는 받지 않습니다. 같은 그룹의
리스트는 각 드래그(각자의 초안, 드래그 중인 것, 어느 리스트가 받는지)를 함께 쓰므로, 항목이
그룹 사이를 오가는 일은 없습니다. 항목이 특정 방향으로만 흘러야 한다면 리스트를 한 그룹에 넣고,
드래그가 출발한 리스트인 `from`으로 `put`이 정하게 하세요.

```ts [index.vue]
// Review takes tasks from both teams. A team takes tasks back from Review,
// never from the other team.
const fromReview = ({ from }: SortablePutContext) => from === 'review';

makeSortableList(review, { id: 'review', items: reviewTasks, group: 'tasks' });
makeSortableList(frontend, { id: 'frontend', items: frontendTasks, group: { name: 'tasks', put: fromReview } });
makeSortableList(backend, { id: 'backend', items: backendTasks, group: { name: 'tasks', put: fromReview } });
```

<note>

SortableJS에서 오셨다면: 그쪽의 `put: ['a', 'b']`는 리스트가 항목을 받아 올 그룹의 이름입니다.
여기서 `put`의 배열은 리스트가 받는 항목의 **타입**입니다. 다른 리스트에서 항목을 받으려면 그
리스트들을 한 그룹에 넣고, 위처럼 `from`으로 정하세요.

</note>

## 복사: 팔레트와 Alt 키

<example height="26rem" hint="팔레트에서 드래그하세요. Alt를 누른 채 드래그하면 복사되고, Page 패널 밖에 놓으면 제거됩니다" name="palette">



</example>

```ts [Palette.vue]
makeSortableList(list, {
  items: templates,
  group: { name: 'blocks', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                           // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

```ts [Sheet.vue]
makeSortableList(list, {
  items: blocks,
  group: 'blocks',
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),  // for Alt-drags
  dropOutside: 'remove',                                      // drag off the Page panel to delete
});
```

- `pull: 'clone'`은 리스트에서 나가는 모든 드래그를 복사합니다. 원본은 남고, 복사본이 이동해
안착합니다.
- 드래그하는 동안 <kbd value="Alt">



</kbd>

를 누르고 있어도 `clone` 함수가 있는 리스트라면 어디서든
복사되며, 복사본은 그 함수가 만듭니다. 키는 프로바이더의 `copyModifier`로 바꾸고, `null`로 끕니다.
- 어느 쪽이든 항목이 출발하는 리스트에 `clone`이 있어야 합니다. `clone`은 **새 key**를 가진
복사본을 반환해야 합니다. `clone`이 없으면 아무것도 복사되지 않습니다.
- 드롭 이벤트에는 `mode: 'copy'`가 있고, `e.items`는 복사본입니다. 오버레이 컴포넌트도 `mode`를
받으므로 복사 중에 "+"를 표시할 수 있습니다([오버레이](https://zizigy.github.io/docs/guides/overlay) 참고).

## 리스트 사이에서 자리 맞바꾸기

같은 그룹의 두 리스트가 모두 `behavior: 'swap'`이면 서로 항목을 맞바꿉니다. 드래그 중인 항목이
포인터 아래 항목의 자리를 차지하고, 포인터 아래 항목은 드래그 중인 항목의 리스트로 옮겨갑니다.
그 항목은 자기 리스트에서 나가는 것(`pull: true`)과 다른 리스트로 들어가는 것(`put`)이 허용되어야
합니다. [정렬 가능한 리스트](https://zizigy.github.io/docs/guides/sortable-lists#swap-instead-of-shift)의 당직 순번표는 두
컬럼 사이에서 자리를 맞바꿉니다.

## 일반 draggable

리스트에 `createItem`이 있으면 `makeDraggable`로 드래그한 항목(칩, 템플릿, 트리의 파일)을
받습니다. `group.put`은 이런 항목에 대해서도 `from: null`로 결정합니다.
[일반 draggable을 리스트로](https://zizigy.github.io/docs/guides/drag-and-drop#plain-draggables-into-a-list)를 참고하세요.

## 밖에 드롭하기

드래그가 아무 대상도 없는 곳에서 끝났을 때 일어나는 일은 리스트의 `dropOutside`가 정합니다.

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      항목은
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
      
      (기본값)
    </td>
    
    <td>
      자리가 마지막으로 표시된 곳에 안착합니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      원래 자리로 돌아갑니다. <code>
        placeholder: 'indicator'
      </code>
      
      일 때의 기본값입니다.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      리스트에서 빠집니다. 밖으로 드래그해 삭제합니다. 팔레트 데모의 시트가 이렇게 합니다.
    </td>
  </tr>
</tbody>
</table>

`'remove'`는 먼저 리스트의 `onBeforeDrop`에 묻습니다. 그다음 리스트의 `onDrop`이
`to.index === -1`로 실행되고, `e.result`에는 항목이 빠진 리스트가 들어 있습니다. 드롭을 받는
휴지통도 같은 방식으로 동작합니다. [휴지통 영역](https://zizigy.github.io/docs/guides/drag-and-drop#trash-zones)을
참고하세요.

## 제어 리스트

리스트는 자기 것이 아닌 스토어를 읽을 수 있습니다. Pinia, 서버 상태, 불변 데이터 같은 것입니다.
`items`를 getter(또는 `computed`나 읽기 전용 ref)로 넘기면, 라이브러리는 거기에 절대 기록하지
않습니다. `onDrop`에서 `e.preventDefault()`를 호출하고 `e.result`를 직접 적용하세요.

<example height="26rem" hint="손님을 테이블 사이에서 옮긴 뒤, 한 번에 한 이동씩 실행 취소해 보세요" name="seating-undo">



</example>

```ts [Table.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  items: () => props.seating.state.tables[props.id]!,   // read-only
  group: 'seating',
  onDrop: (e) => {
    e.preventDefault();                                   // no write
    props.seating.apply(e.result, `${e.items[0]?.name} → ${props.title}`);
  },
});
```

```ts [store.ts]
const apply = (result: ReadonlyMap<Key, Guest[]>, label: string) => {
  const before = [...result.keys()].map((id): [Key, Guest[]] => [id, state.tables[id]!]);
  for (const [id, guests] of result) state.tables[id] = guests;
  state.history.unshift({ label, before });
};

const undo = () => {
  const last = state.history.shift();
  for (const [id, guests] of last?.before ?? []) state.tables[id] = guests;
};
```

- `e.result`는 드롭이 바꾸는 각 리스트를 새 배열에 대응시킵니다. 이동 후에는 두 테이블, 순서
변경 후에는 하나입니다. 새 배열이므로 스토어는 실행 취소를 위해 이전 배열을 보관할 수 있습니다.
- 초안은 스토어를 따라갑니다. `onDrop`에서(또는 비동기 `onBeforeDrop`이 끝나기 전에) `result`를
적용하면 오버레이는 새 순서에 안착합니다.
- `preventDefault()`는 `result`에 있는 모든 리스트로의 기록을 건너뜁니다. 어디에도 적용하지 않으면
리스트는 그대로 있고 항목은 원래 자리로 돌아갑니다.
- 개발 빌드에서는 읽기 전용 리스트의 드롭을 라이브러리에 맡기면 경고합니다. 아무것도 바뀌지
않을 것이기 때문입니다.

드롭이 안착하기 전에 서버에 저장하거나 먼저 사용자에게 물어보려면
[드롭 결정하기](https://zizigy.github.io/docs/guides/drop-decisions)를 참고하세요. 모든 리스트 옵션은
[makeSortableList API](https://zizigy.github.io/docs/api/make-sortable-list)에 있습니다.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
