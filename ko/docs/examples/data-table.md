---
title: "데이터 테이블"
description: "작업 2,000개를 담은 Nuxt UI 테이블. 가상화되고 검색할 수 있으며, 행을 그립으로 드래그해 정렬합니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/examples/data-table"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="34rem" hint="작업을 그립으로 드래그하세요. 검색한 뒤 드래그해도 숨겨진 작업은 제자리를 지킵니다" name="ui-table" title="데이터 테이블">



</example>

Nuxt UI의 `UTable`이 테이블과 그 행, 그 가상화 도구를 렌더링합니다. DOM에는 화면에 보이는 행만
있습니다. 정렬은 Vue DnD Kit이 맡습니다. 테이블은 라이브러리가 제공하는 그대로이며, 슬롯과 `ui`
클래스도 그대로입니다. 다시 작성한 부분은 없습니다.

## 살펴볼 점

- **TaskTable.vue**: 정렬 가능한 리스트는 테이블의 `<tbody>`이며, `UTable`이 노출하는 `tableRef`로
찾습니다. 테이블은 리스트의 초안을 `data`로 받으므로 드래그하는 동안 행이 움직이고,
`get-row-id`는 리스트와 마찬가지로 작업별로 행의 key를 정합니다. `axis: 'y'`는 드래그를 그
컬럼 안에, `restrictToFirstScrollableAncestor`는 테이블 안에 둡니다. 테이블의 스크롤 요소가 행을
감싼 첫 번째 스크롤 가능한 요소이기 때문입니다. 데모를 펼치면 테이블이 화면을 가득 채웁니다.
- **RowGrip.vue**: 행은 `UTable`이 렌더링하므로, 직접 만든 컴포넌트 중 행인 것은 없습니다. 첫
번째 셀의 그립(`#grip-cell` 슬롯)이 자신을 감싼 행을 항목으로 만들고, 그 핸들이 됩니다.
- **검색**은 리스트의 `filter`입니다. 테이블은 일치하는 작업을 보여 주고, 드롭하면 배열 전체가
기록되며 숨겨진 작업은 원래 있던 자리에 남습니다.
- **tasks.ts**: `shallowRef`에 담긴 작업 2,000개. 라이브러리는 그 안을 들여다보지 않습니다.

## 테이블이 렌더링하는 행

그립은 행을 반환하는 getter로 `makeSortableItem`을 호출합니다. 렌더링된 뒤의, 그립을 감싼
`<tr>`입니다. 핸들이므로 포커스와 ARIA 속성은 그립이 받고, 행의 나머지 부분은 클릭과 텍스트
선택에 자유롭게 쓸 수 있습니다.

```ts [RowGrip.vue]
const grip = useTemplateRef<HTMLElement>('grip');
makeSortableItem(() => grip.value?.closest('tr') ?? null, {
  id: () => props.task.id,
  handle: grip,
  label: () => props.task.title,
});
```

```vue [TaskTable.vue]
<UTable ref="table" :data="items" :get-row-id="(task: Task) => task.id" …>
  <template #grip-cell="{ row }">
    <RowGrip :task="row.original" />
  </template>
</UTable>
```

오버레이는 라이브러리가 만든 행의 복사본으로, 셀 너비를 유지한 별도의 테이블 안에 있습니다.
테이블 행은 그림자를 그리지 않으므로, 프로바이더의 `overlay-class`가 오버레이의 내용에 그림자를
주고, 테이블의 배경과 링도 더합니다. 행이 옮겨지는 동안에는 행의 `ui` 클래스가 그 자리에 색을
입힙니다(`data-[dnd-placeholder]:bg-primary/5`).

```vue [index.vue]
<DnDProvider overlay-class="overflow-hidden rounded-md bg-default shadow-xl ring ring-accented">
  <TaskTable />
</DnDProvider>
```

## 가상화된 행

`virtualize`는 테이블에 TanStack Virtual을 붙입니다. 화면에 보이는 행과 그 주변의 8개 행
(`overscan`)이 두 스페이서 행 사이에 렌더링됩니다.

```vue [TaskTable.vue]
<UTable
  :data="items"
  :watch-options="{ deep: false }"
  :virtualize="{ estimateSize: 45, overscan: 8, onChange: () => captureLayout() }"
  class="min-h-0 flex-1"
/>
```

- `estimateSize`는 첫 추정값입니다. 가상화 도구는 각 행이 렌더링될 때 그 행을 측정합니다. 측정하면
그 아래 행들이 움직이고, `onChange`가 리스트의 `captureLayout()`을 호출하므로 드래그 중에는
라이브러리가 그 움직임을 튀게 두지 않고 애니메이션합니다.
- 테이블이 스크롤 요소이며, 손에 든 행은 그 안에 머뭅니다. 위나 아래 가장자리 근처에서는 드래그가
테이블을 스크롤하고, 새 행은 화면에 들어올 때 렌더링됩니다.
- 초안은 이동할 때마다 새 배열이 되므로, 테이블이 그 안을 감시할 필요가 없습니다(`deep: false`).
- 들고 있는 행에서 멀리 스크롤하면, 그 행은 렌더링 범위를 벗어나 언마운트됩니다. 드래그는
계속됩니다. 오버레이가 여전히 그 행을 보여 주고, 행은 초안이 정한 자리에 안착합니다. 직접 만든
가상 리스트라면 `rangeExtractor`로 그 행을 마운트된 채로 둘 수 있습니다
([가상 리스트](https://zizigy.github.io/docs/guides/virtual-lists#tanstack-virtual) 참고). 테이블은 행을 스페이서 행
사이에 배치하는데, 그곳에서는 다른 행에서 멀리 떨어져 렌더링된 행이 다른 행들을 밀어내므로 이
테이블은 그 행을 놓아 줍니다.

## 검색한 다음 드래그

```ts [TaskTable.vue]
const { items, captureLayout } = makeSortableList(() => table.value?.tableRef?.tBodies[0] ?? null, {
  items: tasks,
  filter: (task) => {
    const text = query.value.trim().toLowerCase();
    return !text || `${task.id} ${task.title} ${task.assignee}`.toLowerCase().includes(text);
  },
  axis: 'y',
  modifiers: [restrictToFirstScrollableAncestor],
  label: 'Tasks',
});
```

"Mia"를 검색하고 Mia의 작업 하나를 다른 작업 위로 옮긴 뒤 검색을 지워 보세요. Mia의 작업은 새
순서로 놓이고, 다른 작업은 모두 원래 자리에 있습니다. 드롭의 `e.to.index`는 보이는 행을 기준으로 셉니다.
`e.result`에는 배열 전체가 들어 있습니다.

<tip>

**다른 UI 라이브러리.** Nuxt UI는 일반 요소를 렌더링하고, 기반이 되는 Reka UI 프리미티브처럼
클래스와 속성을 그대로 전달합니다. 필요한 것은 ref, 슬롯, 클래스뿐입니다. 다른 라이브러리에서도
테이블이 행을 직접 렌더링하며, 같은 방법이 통합니다.

- **행.** 행 전체를 렌더링하는 슬롯(Vuetify의 `#item`, Quasar의 `#body`)은 행의 요소를 줍니다.
그것을 항목으로 만드세요. 셀만 받을 수 있다면(PrimeVue `Column`의 `#body`, Element Plus 컬럼의
기본 슬롯, Naive UI의 `render`) 그중 한 셀에 그립을 두고, 여기서처럼 그 `closest('tr')`을 항목으로
만드세요.
- **리스트.** 테이블 루트 요소 안의 `<tbody>`입니다. 테이블에 단 템플릿 ref는 컴포넌트를 주고, 그
`$el`은 요소를 줍니다.
- **key와 데이터.** 행의 key를 직접 정한 id로 하고(`item-value`, `row-key`, `dataKey`), 리스트의
초안을 테이블의 데이터로 넘기세요.
- **테이블 자체의 순서 변경은 끄기.** 테이블 자체의 행 순서 변경과 컬럼 정렬은 쓰지 마세요. 순서는
리스트가 정합니다.
- **가상 테이블**은 행을 스페이서 사이나 절대 위치 박스에 배치합니다. 둘 다 동작하며, 드래그는 그
행이 언마운트되어도 이어집니다.

</tip>

<note>

StackBlitz 버튼은 Nuxt UI 문서가 Vue용으로 설명하는 대로 Nuxt UI를 설정한 Vite 프로젝트에서 파일을
엽니다. `@nuxt/ui/vite` 플러그인, Tailwind CSS, 예제를 감싸는 `UApp`이 들어 있습니다. `@nuxt/ui` 모듈이
있는 Nuxt 앱에서는 폴더를 복사하고 페이지에서 `index.vue`를 렌더링하세요.

</note>

## 키보드와 스크린 리더

Tab으로 작업의 그립에 가서 <kbd value="Space">



</kbd>

를 눌러 행을 집으세요. <kbd value="ArrowUp">



</kbd>

과
<kbd value="ArrowDown">



</kbd>

은 행을 옮기고, <kbd value="Space">



</kbd>

는 드롭하고, <kbd value="Escape">



</kbd>

는
되돌립니다. 행에는 `label`이 있고 리스트에도 있습니다. 스크린 리더는 key가 아니라 "Fix the login
form dropped at position 3 of 2000 in Tasks."를 듣습니다.

더 읽어 보기: [가상 리스트](https://zizigy.github.io/docs/guides/virtual-lists) ·
[항목 일부만 보여 주기](https://zizigy.github.io/docs/guides/sortable-lists#show-some-of-the-items) ·
[스타일링: Tailwind와 UI 키트](https://zizigy.github.io/docs/guides/styling#tailwind-css) ·
[접근성](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
