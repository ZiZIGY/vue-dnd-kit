---
title: "폼 빌더"
description: "Nuxt UI로 만든 폼 빌더. 팔레트에서 드래그한 필드를 행 안에 나란히 놓고, 패널에서 편집하고, 검증이 있는 라이브 미리보기에서 입력한 뒤, Vue 코드로 내보냅니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/examples/form-builder"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="44rem" hint="필드를 폼으로 드래그하세요. 다른 필드 옆에 놓으면 컬럼이 됩니다" name="form-builder" title="폼 빌더">



</example>

여기 있는 모든 컨트롤은 Nuxt UI 컴포넌트입니다. 폼의 필드(`UInput`, `USelect`, `URadioGroup`,
`UInputRating`, `UFileUpload`…), 그 주변의 패널, 미리보기의 `UForm`. 이들을 옮기는 것은 Vue DnD
Kit입니다. 데모를 전체 화면으로 펼치면 팔레트, 폼, 설정이 나란히 놓입니다.

## 살펴볼 점

- **PaletteGroup.vue**: 팔레트의 각 섹션은 복사본만 내주는 정렬 가능한 리스트입니다.
`group: { name: 'fields', pull: 'clone', put: false }`와 `sort: false`. 그 항목은 폼의 것과 같은
필드이므로, 행으로 드래그한 복사본은 다른 것과 똑같은 필드가 됩니다. `clone`이 복사본에 고유한 key를
줍니다. 클릭(또는 <kbd value="Enter">



</kbd>

)하면 드래그 없이 필드를 추가합니다.
- **FormRow.vue**: 행은 칸반 컬럼처럼 두 가지 역할을 동시에 합니다. 그립으로 드래그하는 폼의 행
리스트의 항목이면서, 팔레트와 같은 그룹에 속한 최대 세 개 필드의 리스트입니다. 그 `put`은 네 번째
필드를 거부합니다. 꽉 찬 행 위에서는 손에 든 필드가 빨갛게 변하며 이유를 알려 주고, 그곳에 드롭하면
취소됩니다.
- **NewRowZone.vue**: 두 행 사이의 틈이나 마지막 행 아래에 필드를 드롭하면, 그 필드는 자기만의 행을
얻습니다. 그런 자리도 리스트입니다. 같은 그룹의 빈 리스트이며, 그 id가 새 행이 들어갈 곳을
알려 줍니다.
- **FieldCard.vue**: 행은 인디케이터 모드(`placeholder: 'indicator'`)이므로 필드를 드래그하는 동안
아무것도 움직이지 않습니다. 필드 옆의 선이 어디로 갈지 보여 줍니다. 좁은 빌더에서는 행의 필드가
세로로 쌓이고, 선은 그 위나 아래에 그려집니다.
- **Trash.vue**: 폼의 필드를 드래그하는 동안 팔레트는 휴지통이 됩니다. 폼의 필드만 받고
(`accept: 'fields'`, 그 그룹 이름) `event.source.remove()`로 제거하는 일반 드롭 대상입니다.
- **OptionList.vue**: 드롭다운이나 객관식의 선택지는 설정 패널 안에서 그 자체로 정렬 가능한
리스트이며, 텍스트를 계속 편집할 수 있도록 그립으로 드래그합니다.
- **form.ts**: 폼과, 폼을 바꾸는 유일한 코드. 리스트는 폼을 읽기만 하고 기록하지 않으므로, 실행
취소와 다시 실행이 드롭을 포함한 모든 변경을 봅니다.

## 필드 행은 리스트 안의 리스트입니다

폼의 행과 각 행의 필드는 `rows`와 `fields`라는 두 그룹의 리스트입니다. 드래그는 자기 그룹의
리스트에만 들어갑니다. 어떻게 중첩되어 있든 필드가 행 사이에 안착하는 일은 없고, 행이 다른 행 안에
들어가는 일도 없습니다.

```ts [FormRow.vue]
// The row is an item of the form's rows, dragged by its grip...
makeSortableItem(el, { item: () => props.row, handle: grip });

// ...and a list of up to three fields side by side, in the group of the palette.
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: rowList(props.row.id),
  items: () => props.row.fields,
  group: { name: 'fields', put: ({ keys }) => props.row.fields.length + keys.length <= MAX_COLUMNS },
  strategy: () => (props.stacked ? 'vertical' : 'horizontal'),
  placeholder: 'indicator',
  overlay: FieldOverlay,
  clone: cloneField, // Alt-drag copies a field
  animate: true,
  onDrop: form.drop,
});
```

새 행에는 드롭할 자리가 필요합니다. 각 행은 자기 위의 틈에 띠를 하나 두고, 마지막 행 아래의 공간도
그런 자리 하나입니다. 항목을 절대 보여 주지 않는 `fields` 그룹의 빈 리스트입니다. 띠 위에서는
리스트가 `isOver`가 되고, 띠가 선을 그립니다. 띠는 무언가를 드래그하는 동안에만
(`html[data-dnd-dragging]`) 포인터를 받으므로 클릭을 방해하지 않습니다.

```vue [NewRowZone.vue]
<script setup lang="ts">
const NONE: readonly Field[] = [];
const { isOver, isAccepting } = makeSortableList(el, {
  id: newRowList(props.before), // 'new:<row id>', or 'new:end'
  items: () => NONE,
  group: 'fields',
  placeholder: 'indicator',
  // A band across the page: up and down are the keys that cross it, to the next list.
  strategy: 'horizontal',
  onDrop: form.drop,
});
</script>

<template>
  <div
    ref="el"
    class="pointer-events-none absolute inset-x-0 -top-[18px] z-10 h-6 in-data-[dnd-dragging]:pointer-events-auto"
  >
    <span class="… bg-primary" :class="isOver ? 'opacity-100' : 'opacity-0'" />
  </div>
</template>
```

키보드도 띠를 찾습니다. 키보드 드래그는 리스트와 교차하는 방향의 화살표 키로, 페이지에서의 위치에
따라 리스트에서 리스트로 갑니다. 가로 방향인 행에는 위아래 키로, 역시 가로 방향인 띠에도 위아래 키로
갑니다. 그래서 <kbd value="ArrowUp">



</kbd>

과 <kbd value="ArrowDown">



</kbd>

은 행과 그 사이의 틈을 번갈아
방문합니다.

## 스토어 하나, 실행 취소 하나: 기록하지 않는 리스트

빌더의 모든 리스트는 getter에서 항목을 받으므로 라이브러리가 기록하지 않습니다
([제어 리스트](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists)). 그 `onDrop`은 `form.drop`입니다. 기록을
취소하고 `event.result`(드롭이 바꾸는 모든 리스트의 새 배열)를 폼에 넘깁니다. 리스트 id가 각 배열이
무엇인지 알려 줍니다. 행의 필드, 행의 순서, 또는 만들 행입니다.

```ts [form.ts]
function apply(result: ReadonlyMap<Key, unknown[]>) {
  commit(() => {
    const created: [before: string, fields: Field[]][] = [];
    for (const [list, items] of result) {
      const [type, id] = String(list).split(':') as [string, string];
      if (list === ROWS) state.rows = items as Row[];
      else if (type === 'row') state.rows.find((row) => row.id === id)!.fields = items as Field[];
      else if (type === 'new' && items.length) created.push([id, items as Field[]]);
    }
    for (const [before, items] of created) {
      const index = state.rows.findIndex((row) => row.id === before);
      state.rows.splice(index < 0 ? state.rows.length : index, 0, row(...items));
    }
  });
}

/** `onDrop` of every list: applies the drop, and selects a field that was just added. */
function drop(event: SortableDropEvent<unknown>) {
  event.preventDefault();
  apply(event.result);
  if (event.mode === 'copy') selectedId.value = (event.items[0] as Field).id;
  forgetGone();
}
```

`commit`은 실행 취소를 위해 폼의 스냅숏을 저장하고, 변경을 적용하고, 이동으로 비게 된 행을
제거합니다. 이 모든 것이 드롭이 안착하기 전에 일어나므로, 오버레이는 필드가 실제로 있는 곳으로
날아갑니다. 휴지통도 같은 길을 갑니다. `event.source.remove()`는 필드를 뺀 상태로 행의 `onDrop`을
실행합니다(`to.index`는 `-1`). 설정에서의 입력도 `commit`을 거치며, 한 설정에 대한 키 입력은 key를
공유합니다. 한 글자씩 입력한 레이블은 실행 취소의 한 단계입니다.

## 손에 든 필드

팔레트와 행은 오버레이 컴포넌트 하나를 공유합니다. 이 컴포넌트는 드래그 중인 것의 라이브러리
복사본(`DragPreview`: 팔레트에서는 칩, 폼에서는 Nuxt UI 컨트롤을 포함한 필드 전체)을 틀 안에 보여
주고, 드롭이 할 일을 배지로 알려 줍니다. 복사(<kbd value="Alt">



</kbd>

), 휴지통 위에서는 삭제, 꽉 찬 행
위에서는 아무 일도 없음.

```vue [FieldOverlay.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();

const entry = computed(() => props.items[0]!);
const state = computed(() => {
  if (props.status === 'dropping') return 'landing';
  if (props.over?.id === TRASH) return 'delete';
  // A row that refuses the field: it is full.
  if (props.over && !props.accepted) return 'full';
  // Palette fields are copies too, but they say nothing: adding is what they do.
  if (props.mode === 'copy' && !entry.value.type.includes('new-field')) return 'copy';
  return 'move';
});
</script>

<template>
  <!-- LOOKS: lifted and tilted, red when refused, smaller over the trash, flat as it lands. -->
  <div class="relative size-full rounded-md bg-default ring-2 …" :class="LOOKS[state]">
    <DragPreview :id="entry.id" class="rounded-md" :style="{ width: '100%', height: '100%' }" />
    <UBadge v-if="badge" :label="badge.label" :icon="badge.icon" :color="badge.color" size="sm" />
  </div>
</template>
```

팔레트의 항목에는 고유한 `type`인 `'new-field'`가 있습니다. 오버레이는 이것으로 항목을 구별하고,
`'fields'`를 받는 휴지통은 이 항목을 받지 않습니다.

## Nuxt UI와 함께

이 문서는 `@nuxt/ui` 모듈을 쓰는 Nuxt 앱이며, Nuxt의 컴포넌트 자동 임포트는 예제에도 적용됩니다. 이
파일들은 Nuxt UI 프로젝트처럼 `<UInput>`, `<UFormField>`, `<UTabs>`를 임포트 없이 씁니다. Nuxt UI의
Vite 플러그인을 쓰는 Vue 앱도 똑같이 자동 임포트합니다. 플러그인이 없다면 각각 임포트하세요.
`import UButton from '@nuxt/ui/components/Button.vue'`. 타입은 `@nuxt/ui`에서 가져옵니다
(`import type { FormSubmitEvent } from '@nuxt/ui'`).

- **만드는 동안 필드는 그림입니다.** `FieldView.vue`는 캔버스와 미리보기에서 필드를 똑같이
렌더링합니다. 컨트롤을 `UFormField`로 감싼 모습입니다. 캔버스에서는 `inert` 요소 안에 있으므로
입력 필드를 누르면 입력 대신 드래그가 시작되고, <kbd value="Tab">



</kbd>

은 입력 필드를 건너뜁니다.
카드의 툴바(툴팁이 달린 버튼의 `UFieldGroup`)는 `data-dnd-no-clone`으로 오버레이 복사본에서
빠집니다.
- **상태는 Tailwind 변형입니다.** 라이브러리는 상태를 속성으로 표시하고, Tailwind는 이를 변형으로
읽습니다. 옮기는 중인 필드에는 `data-[dnd-placeholder]:outline-dashed`, 손에 든 행에는
`in-data-[dnd-overlay]:bg-default`, 띠에는 `in-data-[dnd-dragging]:pointer-events-auto`. 색상은
Nuxt UI의 시맨틱 색상(`bg-default`, `ring-primary`, `text-error`)이므로 라이트 모드와 다크 모드에
더 필요한 것이 없습니다.
- **미리보기는 실제 UForm입니다.** `schema.ts`가 필드로 Zod 스키마를 만들고, `UForm`이 그 스키마로
답을 검증합니다. `name`이 각 `UFormField`를 그 규칙에 연결하고, 메시지는 필드 아래에 나타납니다.
폼을 제출하면 무엇이 전송되는지 볼 수 있습니다.
- **내보내기**는 같은 폼을 별도의 컴포넌트로 작성합니다. Nuxt UI 컨트롤, Zod 스키마, `reactive`
상태, 그리고 휴대폰에서는 세로로 쌓이는 그리드로서의 행입니다.
- **레이아웃은 창이 아니라 빌더의 너비를 따릅니다**(`useElementSize`). 전체 화면에서는 패널 세 개,
페이지에서는 설정이 팔레트 자리를 차지하고, 더 좁으면 팔레트는 폼 위의 칩 줄이 되고 설정은 폼 위에
겹치는 시트가 됩니다. 나머지는 컨테이너 쿼리(`@lg:`)가 처리합니다.

<note>

StackBlitz 버튼은 Nuxt UI가 없는 일반 Vite 프로젝트에서 파일을 엽니다. 이 예제를 실행하려면 폴더를
`@nuxt/ui` 모듈과 `zod`가 있는 Nuxt 앱에 복사하고, 페이지에서 `index.vue`를 렌더링하세요.

</note>

## 키보드와 스크린 리더

Tab으로 필드에 가서 <kbd value="Space">



</kbd>

를 눌러 집으세요. <kbd value="ArrowLeft">



</kbd>

와
<kbd value="ArrowRight">



</kbd>

는 행을 따라 옮기고, <kbd value="ArrowUp">



</kbd>

과 <kbd value="ArrowDown">



</kbd>

은
다른 행과 그 사이의 틈(새 행)으로 옮기며, <kbd value="Space">



</kbd>

는 드롭하고, <kbd value="Escape">



</kbd>

는
되돌립니다. 프로바이더는 드래그에 Space만 쓰므로
(`keyboard: { keys: { start: ['Space'], drop: ['Space'] } }`), <kbd value="Enter">



</kbd>

는 필드의 설정을
여는 데 쓸 수 있습니다. <kbd value="Delete">



</kbd>

는 필드를 제거하고, <kbd value="Ctrl">



</kbd>

 <kbd value="D">



</kbd>

는
복제하고, <kbd value="Ctrl">



</kbd>

 <kbd value="Z">



</kbd>

는 실행 취소합니다.

프로바이더의 `announcements`는 빌더의 말로 읽어 줍니다. "Work email: row 2, column 2 of 2", "New date
field: a new row above row 3". `form.describe`가 라이브러리가 주는 위치(리스트 id와 인덱스)를 그런
말로 바꿉니다.

더 읽어 보기: [항목을 공유하는 리스트](https://zizigy.github.io/docs/guides/shared-lists) ·
[삽입선](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line) ·
[오버레이](https://zizigy.github.io/docs/guides/overlay) ·
[스타일링: Tailwind와 UI 키트](https://zizigy.github.io/docs/guides/styling#tailwind-css) ·
[접근성](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
