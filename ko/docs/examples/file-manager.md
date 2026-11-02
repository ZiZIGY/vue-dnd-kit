---
title: "파일 관리자"
description: "클라우드 드라이브. 그리드 보기와 목록 보기, 선택 사각형, 어디서나 드롭을 받고 위에 머물면 열리는 폴더, Alt로 복사, 실행 취소가 있는 휴지통, 그리고 데스크톱에서 드롭하는 파일."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/examples/file-manager"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="파일을 사각형으로 둘러싸서 폴더에 놓으세요. Alt를 누르면 복사합니다" name="file-manager" title="파일 관리자">



</example>

## 살펴볼 점

- **FileView.vue**: 열린 폴더는 하나의 정렬 가능한 리스트이며, 타일 그리드나 행 목록으로
보입니다. 선택 사각형, 클릭, 키로 선택하고, 드래그는 선택 항목을 가져갑니다.
- **useFolderDrop.ts**: 화면의 모든 폴더가 드롭 대상입니다. 타일, 트리의 행, 즐겨찾기, 경로의
탐색 경로, 휴지통. 드래그를 거부하는 이유를 알려 주고, 파일이 들어오면 꿀꺽 삼킵니다.
- **FilesOverlay.vue**: 포인터를 따라가는 것으로, 모든 오버레이가 받는 props로 만듭니다. 개수가
표시된 실제 타일 더미, Alt로 복사하는 동안의 "+", 그리고 드롭이 할 일.
- **SidebarRow.vue**: 트리의 닫힌 폴더는 드래그가 그 위에 머물면 열리므로, 하위 폴더가 드롭을 받을
수 있습니다. **`Favorites.vue`**는 그 자체로 정렬 가능한 리스트이고, 그 행도 드롭 대상입니다.
- **useDesktopDrop.ts**: 컴퓨터에서 끌어온 파일. 이것은 라이브러리가 아니라 브라우저의 드래그 앤
드롭이며, 라이브러리와 나란히 처리합니다.
- **drive.ts**: 상태와 모든 변경, 실행 취소 포함. **index.vue**: 키를 다시 지정한 프로바이더와
그 안내 문구.

## 리스트 하나, 보기 두 개

그리드와 목록은 같은 정렬 가능한 리스트입니다. 옵션은 getter이며, 드래그가 시작될 때 읽습니다.
전략은 보기를 따르고, 컬럼 기준으로 정렬된 폴더(`sort: false`)는 순서를 바꾸지 않습니다. 그래도
드래그는 그 폴더 안으로 들어갈 수 있습니다.

```ts [FileView.vue]
const { items } = makeSortableList(list, {
  items: drive.entries,   // the open folder, sorted by a column or in your own order
  group: 'files',
  strategy: () => (grid.value ? 'grid' : 'vertical'),
  sort: () => drive.sort.value.key === 'manual',
  multiple: 'gaps',       // the other picked files wait in place, as in Finder
  clone: drive.duplicateOf, // Alt-drag leaves the files and drops "Budget copy.xlsx"
  dropzone: area,         // the empty space takes drops too
  animate: true,          // a new sort, a new folder, files sent to the Trash slide and fade
});
```

- `drive.entries`는 쓰기 가능한 computed입니다. 라이브러리는 각 드롭을 그 `set`을 통해 다시 기록하고,
리스트의 `onDrop`은 그보다 먼저 실행 취소를 위해 드라이브를 저장합니다.
- 창은 폴더마다 새 보기를 만들므로(`FileView`의 `:key`), 폴더를 여는 것은 `animate`가 재생할
리스트 변경이 아닙니다.

## 선택하기

선택은 프로바이더가 관리하고, 사람들이 어떻게 선택할지는 보기가 정합니다. 빈 공간을 누르면 선택
사각형이 그려집니다. 그냥 그리면 선택을 대체하고, Shift, Ctrl, Cmd를 누르고 있으면 사각형이 지나는
타일의 선택이 뒤집힙니다. 전략은 getter이며, 사각형이 시작될 때 읽습니다.

```ts [FileView.vue]
let adding = false;
const { isSelecting, style } = makeSelectionArea(area, {
  strategy: () => (adding ? 'toggle' : 'select'),
});

// On the area, `@pointerdown.capture`: it runs before the band's own listener.
const onPress = (event: PointerEvent) => {
  adding = event.shiftKey || event.ctrlKey || event.metaKey;
};
```

클릭은 Finder를 따릅니다. 클릭하면 하나를 고르고, Ctrl/Cmd-클릭하면 추가하거나 빼고, Shift-클릭하면
마지막으로 고른 것부터의 범위를 고릅니다. 화살표 키는 파일 사이에서 탭 정지점 하나를 옮기고(로빙
`tabindex`이며, 라이브러리는 이를 건드리지 않습니다), Shift+화살표는 선택을 넓히고, Enter는 열고,
F2는 이름을 바꾸고, Delete는 휴지통으로 보내고, 글자를 입력하면 그 이름으로 건너뜁니다. 프로바이더는
Enter를 앱에 돌려줍니다. 파일을 집는 것은 Space뿐입니다.

```vue [index.vue]
<script setup lang="ts">
// Space picks a focused file up and drops it; Enter is left to open folders.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'] } };
</script>

<template>
  <DnDProvider :keyboard="keyboard" :announcements="announcements">
    <FileManager />
  </DnDProvider>
</template>
```

## 폴더는 어디서나 드롭을 받습니다

`useFolderDrop`은 어떤 요소든 파일을 받는 폴더로 만듭니다. 타일은 그리드의 정렬 가능한 항목이기도
합니다. 그래서 대상은 타일의 가운데에서만 유효하고, 가장자리 근처에서는 그리드가 자리를 만듭니다.
`accept`는 파일이 이미 들어 있는 폴더와, 폴더를 자기 자신 안으로 넣는 것을 거부합니다. 거부한 타일
위에서는 다른 타일과 마찬가지로 그리드가 정렬합니다.

```ts [useFolderDrop.ts]
const { id, isOver, isAccepting } = makeDroppable(target, {
  disabled: () => !folder(),
  data: () => drive.placeOf(folder()!),   // { name, trash, why }: the overlay reads it as `over.data`
  accept: ({ active, types }) => types.includes('files') && !drive.whyNot(active.ids, folder()!),
  onDrop: (event) => drive.dropInto(event, folder()!),
});

// The files are in once the overlay has landed in the folder: it gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.dropped && event.over?.id === id.value) gulps.value++;
  },
});
```

`dropInto`는 파일을 옮기거나, `event.mode`가 `'copy'`(`clone`이 있는 리스트 위에서 Alt를 누름)이면
복사합니다. 옮길 때는 `event.source.remove()`를 호출합니다. 그리드가 파일을 내보내고, 그리드의
`onDrop`이 `to.index === -1`로 실행됩니다.

```ts [drive.ts]
const dropInto = (event: DnDEvent, target: FolderEntry) => {
  const dragged = entries.value.filter((entry) => event.active.ids.includes(entry.id));
  const copying = event.mode === 'copy' && !isTrash(target) && !inTrash.value;
  record(`${copying ? 'Copied' : 'Moved'} ${describe(dragged)} to ${isTrash(target) ? 'the Trash' : target.name}`);
  if (copying) return put(target, dragged.map(copyEntry), current.value);
  put(target, dragged, current.value);
  // The grid lets them go: the library writes the open folder without them.
  event.source?.remove();
  selection.delete(...event.active.ids);
};
```

즐겨찾기는 정렬 가능한 항목(`Favorites.vue` 안의, 자체 그룹을 가진 리스트)이면서 동시에 드롭
대상입니다. `FavoriteRow.vue`는 행 컴포넌트를 `makeSortableItem`에 넘기고, `makeSortableItem`은 그
루트 요소를 읽습니다. 그리고 `SidebarRow.vue`가 같은 요소를 폴더로 만듭니다. 드래그한 즐겨찾기는
가장자리 근처에서 정렬되고, 그 위에 드롭한 파일은 그 폴더로 들어갑니다.

### 스프링 로드 폴더

트리의 닫힌 폴더는 Finder처럼 드래그가 그 위에 머물면 열립니다. `isOver`가 잠시 유지되면 행이
펼쳐집니다. 하위 폴더는 드래그 도중에 마운트되어 바로 드롭을 받습니다.

```ts [SidebarRow.vue]
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), 700);
});
```

## 오버레이

`FilesOverlay.vue`는 리스트의 `overlay`입니다. 그리드에서는 고른 타일의 실제 클론인 `DragPreview`를
쌓습니다. 자리에 드롭하면 각 클론이 자기 타일에 안착하고, 폴더에 드롭하면 하나씩 차례로 들어갑니다.
행은 리스트만큼 넓으므로 리스트는 박스를 포인터 가운데에 맞추고(`snapCenterToCursor`), 오버레이는
거기에 작은 칩을 매답니다. 오버레이는 함수이며 Vue는 이를 함수형 컴포넌트로 받아들입니다. 이 함수는
자신이 읽는 props를 넘기고 둘 중 무엇을 그릴지 알려 줍니다.

```ts [FileView.vue]
overlay: ({ items, over, accepted, status, mode }: OverlayProps) =>
  h(FilesOverlay, { items, over, accepted, status, mode, rows: !grid.value }),
modifiers: () => (grid.value ? [] : [snapCenterToCursor]),
```

더미 아래에는 필이 놓으면 무슨 일이 일어날지를 폴더의 `data`를 바탕으로 알려 줍니다. "Move to
Photos", Alt를 누르는 동안에는 "Copy to Photos"(`mode`), `accepted`가 `false`일 때는 빨간색으로 그
이유를 보여 줍니다.

```ts [FilesOverlay.vue]
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
```

프로바이더의 `announcements`도 같은 `data`를 읽으므로, 스크린 리더는 "Over Photos. Drop to move 3
items there"나 "Already in Documents"를 듣습니다. 기본 문구라면 key를 읽었을 자리에서 파일의 이름을
부릅니다.

## 데스크톱의 파일

컴퓨터에서 파일을 창으로 드래그해 보세요. 파일은 포인터 아래의 폴더(타일, 사이드바의 행, 탐색 경로),
없으면 열린 폴더로 업로드되고, 사진은 내용이 보입니다. 라이브러리가 드래그하는 것은 페이지의
요소입니다. 바깥에서 온 파일은 브라우저 자체의 드래그 앤 드롭(`dragover`와 `drop`)으로 들어오므로,
라이브러리와 나란히 처리합니다.

```ts [useDesktopDrop.ts]
const dragover = (event: DragEvent) => {
  if (!carriesFiles(event)) return;
  // Cancelled, a `dragover` says the drop is welcome here.
  event.preventDefault();
  const folder = folderAt(event); // under the pointer: an element with a folder's `data-id`
  // …nothing goes into the Trash…
  drive.uploadTarget.value = folder.id; // that folder opens, as for the library's drags
};
```

## 실행 취소, 휴지통, 그리고 나머지

- 모든 변경은 먼저 드라이브의 복사본을 저장합니다. 토스트의 Undo(또는 Ctrl/Cmd+Z)로 그때로
돌아갑니다. 휴지통은 트리 밖에 있는 폴더입니다. 그 안의 것은 원래 있던 곳을 기억하고, Put Back으로
그곳에 돌아갑니다.
- `ContextMenu.vue`(오른쪽 클릭, Shift+F10, 또는 "⋯" 버튼)는 선택 항목이나 열린 폴더에 대해
동작합니다. 그 자리에서 이름 바꾸기, 복제, 즐겨찾기에 추가, 휴지통으로 이동, 휴지통 비우기.
- 펼치면 창이 스테이지를 채우고, 파일 옆에 정보 창이 열립니다. 휴대폰에서는 사이드바가 서랍이
되며, 탭하면 폴더가 열리고 길게 누르면 파일을 집습니다.

더 읽어 보기: [멀티 드래그와 선택](https://zizigy.github.io/docs/guides/multi-drag) ·
[정렬 가능한 항목 안으로 드롭](https://zizigy.github.io/docs/guides/drag-and-drop#drop-into-a-sortable-item) ·
[`DragPreview`](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) ·
[데이터 변경: `animate`](https://zizigy.github.io/docs/guides/animations#data-changes-animate) ·
[접근성](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
