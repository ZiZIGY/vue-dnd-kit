---
title: "주간 캘린더"
description: "주간 일정표. 일정을 요일과 15분 단위로 옮기고, 가장자리로 늘리고, 빈 시간에 그리고, 종일 일정으로 만들고, 작업 목록에서 계획하며, 실행 취소할 수 있습니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/examples/calendar"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="44rem" hint="일정을 옮기거나 늘리거나, 빈 시간에 새로 그려 보세요" name="calendar" title="주간 캘린더">



</example>

## 살펴볼 점

- **EventBlock.vue**: 시간대에 있는 일정은 일반 draggable이며, 그 오버레이인
**`EventOverlay.vue`**가 안착할 곳을 알려 줍니다. "Wed 10:30 – 11:15". 겹치는 일정은 나란히
놓입니다(`placement.ts`의 `layoutDay`).
- **Edge.vue**: 일정의 위쪽과 아래쪽 가장자리는 각각 별도의 draggable입니다. 하나를 드래그하면
일정이 15분씩 늘어납니다.
- **DayColumn.vue**: 각 요일의 시간대는 드롭 대상이고, 일정 아래에도 draggable이 있습니다. 빈
시간을 누르고 드래그하면 새 일정이 그려지고, 이어서 제목을 입력합니다.
- **AllDayCell.vue와 Tasks.vue: 일정을 요일의 종일 칸에 드롭하면 시간이 없어지고, 작업
목록에 드롭하면 요일이 없어집니다. 작업(EventChip.vue**)은 주간으로 드래그할 수 있으며 길이를
유지합니다.
- **Week.vue**: 시간대의 드래그 영역과 그 자체 모디파이어, 키보드 이동, 현재 시간 선.
- **calendar.ts**: 일정과 실행 취소 기록. 모든 변경은 함수 하나를 거치고, 토스트가 되돌릴지
묻습니다.

예제를 펼쳐 보세요. 공간이 충분하면 사이드 패널에 월 달력, 보이거나 숨길 캘린더, 목록 형태의 작업이
나타납니다. 휴대폰에서는 주간이 3일이 되고, 길게 눌러 드래그합니다.

## 모든 드롭에 하나의 답

드롭이 무엇을 할지는 네 곳에서 묻습니다. 오버레이의 레이블, 작업이 그 아래 요일에 보여 주는 고스트,
스크린 리더가 듣는 내용, 그리고 드롭 자체입니다. 모두 `placeOf`를 호출하므로 결과가 엇갈리지
않습니다. 각 드롭 대상은 자신이 무엇인지를 `data`에 담고, `position`은 드래그 중인 박스가 대상 안의
어디에 있는지 나타냅니다. 박스의 위쪽이 시간입니다.

```ts [placement.ts]
export function placeOf(event: CalendarEvent, over: Over | null, position: Coordinates | null): Place | null {
  const target = over?.accepted ? (over.data as Target) : null;
  if (!target) return null;
  if (target.kind === 'tasks') return { day: null, start: null };
  if (target.kind === 'all-day') return { day: target.day, start: null };
  if (!position) return null;
  return { day: target.day, start: clamp(minutesAt(position.y), 0, DAY_MINUTES - event.duration) };
}
```

오버레이는 `useDnD().position`에서 이를 실시간으로 읽고, 안착하는 동안에는 마지막 답을 유지합니다.

```ts [EventOverlay.vue]
const { position } = useDnD();
const place = shallowRef(placeOf(event.value, props.over, position.value));
watchEffect(() => {
  if (props.status === 'dragging') place.value = placeOf(event.value, props.over, position.value);
});
```

일정은 어디에 있든 id, `data`, 오버레이를 유지합니다. 시간대의 블록이든, 종일 칸이나 작업 목록의
칩이든 마찬가지입니다. 다른 곳에 드롭되면 다른 컴포넌트가 렌더링하지만, 오버레이는 그래도 새 요소
위에 안착합니다.

## 시간대 자체의 모디파이어

`makeDragArea`는 시간대에서 시작하는 드래그(일정, 가장자리, 빈 시간)에 자체 모디파이어를 줍니다.
요일 위에서 박스는 포인터가 지나간 만큼 하루 단위로 움직이므로, 다른 일정 옆의 일정도 그날 안에서
자기 위치를 유지합니다. 박스의 위쪽은 드래그가 시작된 요일의 15분 단위에 스냅됩니다.
`containerRect`는 그 요일의 현재 위치입니다. 스크롤을 따라가므로, 드래그 중에 시간대가 자동
스크롤되어도 스냅이 유지됩니다.

```ts [Week.vue]
const snapToWeek: Modifier = ({ transform, overlayRect, containerRect, origin }) => {
  const days = grid.value?.getBoundingClientRect();
  if (!days || !containerRect) return transform;
  const width = days.width / props.days.length;
  const column = (x: number) => Math.floor((x - days.left) / width);
  const pointer = origin.x + transform.x;
  const x = pointer < days.left || pointer >= days.right ? transform.x : (column(pointer) - column(origin.x)) * width;
  const top = overlayRect.top - containerRect.top;
  return { x, y: transform.y + Math.round(top / STEP_PX) * STEP_PX - top };
};

makeDragArea(grid, { modifiers: [snapToWeek], autoScroll: { threshold: 0.12 } });
```

영역의 `autoScroll`은 시간대 위를 지나는 모든 드래그에 대해, 시간대를 스크롤하는 가장자리 구역을
좁힙니다. 바로 위의 종일 행에 쉽게 닿도록 하기 위해서입니다. 작업과 종일 일정은 영역 밖에서 시작하므로
자유롭게 움직이고, 그 아래 요일에는 안착할 곳에 고스트가 보입니다.

## 늘리기: 가장자리는 draggable입니다

가장자리는 일정 요소 안에 있고, 누르면 가장 가까운 draggable, 즉 가장자리가 드래그됩니다.
가장자리에는 오버레이가 없고, 위아래로만 움직이며, 보이는 시간대 안에 머뭅니다.

```ts [Edge.vue]
makeDraggable(el, {
  id: () => `${props.event.id}-${props.edge}`,
  type: 'edge',
  data: (): DragData => ({ kind: 'edge', event: props.event, edge: props.edge }),
  overlay: false,
  axis: 'y',
  modifiers: [restrictToFirstScrollableAncestor],
  attributes: false, // no tab stop: Shift + arrows change the end of a focused event
});
```

가장자리 자체는 움직이지 않습니다. 대신 일정이 그날 안에서 가장자리가 있는 위치부터 늘어나며, 이
위치는 드롭이 읽는 것과 똑같이 `position`에서 읽습니다.

```ts [EventBlock.vue]
const time = computed(() =>
  resizing.value && position.value
    ? resizeTo(props.event, resizing.value, position.value)
    : { start: props.event.start!, duration: props.event.duration },
);
```

## 빈 시간에 그리기

일정 아래에는 요일마다 레인이 있고, 레인은 오버레이가 없는 draggable입니다. 레인은 절대 움직이지
않습니다. 그 박스가 간 거리(`position`)가 곧 누른 곳에서 포인터가 간 거리이며, 영역이 이를 15분
단위로 스냅합니다. 요일은 그려지는 새 일정을 보여 주고, 드롭하면 일정이 만들어집니다.

```ts [DayColumn.vue]
makeDraggable(lane, {
  id: () => `new-${props.day}`,
  type: 'new',
  data: (): DragData => ({ kind: 'new', day: props.day, from: from.value }),
  overlay: false,
  axis: 'y',
  attributes: false, // the New event button is the keyboard's way
});
```

요일의 `accept`는 함수입니다. 모든 일정을 받고, 가장자리와 레인은 자기 것만 받습니다. 종일 칸과 작업
목록은 문자열 `'event'`를 받으므로, `edge`와 `new` 타입은 코드 한 줄 없이 그곳에서 거부됩니다. 드롭은
핸들러 하나입니다.

```ts [DayColumn.vue]
onDrop: ({ active, over, position }) => {
  const data = active.data as DragData;
  if (!position) return;
  if (data.kind === 'event') {
    const place = placeOf(data.event, over, position);
    if (place) calendar.place(data.event.id, place);
  } else if (data.kind === 'edge') {
    calendar.resize(data.event.id, resizeTo(data.event, data.edge, position));
  } else {
    const { start, duration } = rangeOf(data.from, data.from + position.y);
    calendar.create(props.day, start, duration);
  }
},
```

## 키보드

Tab으로 일정에 가서 Space로 집으세요. 주간의 모니터가 화살표 키에 `getKeyboardCoordinates`로 답하며,
다음 15분(Shift를 누르면 1시간)이나 다음 요일을 돌려줍니다. 키보드 드래그는 자동 스크롤하지 않으므로,
보이는 시간대의 끝 근처에서는 화살표 키가 대신 시간대를 스크롤합니다. 작업과 종일 일정은 시간대 위에
올 때까지 대상에서 대상으로 건너뜁니다(`keyboard: 'droppables'`).

```ts [Week.vue]
useDnDMonitor({
  getKeyboardCoordinates: (key, { pointer, direction }) => {
    // …only over the hours
    const dy = direction.y * STEP_PX * (key.shiftKey ? 4 : 1);
    const next = { x: pointer.x + direction.x * (grid.value.offsetWidth / props.days.length), y: pointer.y + dy };
    if (canScroll && (next.y < view.top + HOUR_PX || next.y > view.bottom - HOUR_PX)) {
      hours.scrollTop += dy;
      return { x: next.x, y: pointer.y };
    }
    return next;
  },
});
```

`index.vue`에 있는 프로바이더의 `announcements`는 무엇을 집었는지와 어떻게 옮기는지 알려 줍니다.
주간은 화살표 키로 바뀐 시간을 읽어 주고("Tuesday, 10:30 to 11:15"), 토스트는 드롭이 무엇을
바꿨는지 알려 줍니다. 포커스된 일정에서 Delete를 누르면 삭제되고, Ctrl+Z는 어떤 변경이든 되돌립니다.

더 읽어 보기: [직접 만든 모디파이어](https://zizigy.github.io/docs/guides/constraints#your-own-modifier) ·
[페이지 일부를 위한 규칙](https://zizigy.github.io/docs/guides/constraints#rules-for-a-part-of-the-page) ·
[놓은 자리에 그대로 두기](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped) ·
[오버레이 없이](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) ·
[오버레이 컴포넌트](https://zizigy.github.io/docs/guides/overlay#overlay-components) ·
[접근성](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
