---
title: "プロジェクトボード"
description: "Linear や Trello のようなプロダクトボード。並べ替えられる列、WIP 制限、Done の前の確認、選択バー付きの複数選択、ドラッグがそのまま使えるフィルター、Undo 付きのゴミ箱、そして Status ボタンが本物のドラッグを再生するカードパネル。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/board"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="40rem" hint="カードと列をドラッグしてみましょう。カードをクリックすると開き、Ctrl/Cmd クリックで選択できます" name="board" title="プロジェクトボード">



</example>

## 注目ポイント

- **Board.vue**：列はそれ自体が横方向の並べ替え可能なリストで（`strategy: 'horizontal'`、`axis: 'x'`）、各列はヘッダーでドラッグする並べ替え可能なアイテムです（`handle`）。展開するとボードは画面いっぱいに広がり、スマートフォンでは横にスクロールします。
- **Column.vue**：すべての列のカードが 1 つの `group` で、列ごとのルールを持ちます：WIP 制限、Done の前の確認、フィルターです。ヘッダーのメーターは、ドラッグで入ってくるカードを点灯させます。
- **Card.vue**：`type: 'card'` の並べ替え可能なアイテムなので、ゴミ箱はカードを受け入れ、列は受け入れません。クリックで開き、Ctrl/Cmd クリックで選択します（`selected`）。キーボードでは Space で持ち上げ、Enter で開き、X で選択します。
- **store.ts**：ボードのデータとルールで、ドラッグ＆ドロップは含みません。オーバーレイからも読めるように、`DnDProvider` の上で提供されています。

## 列のルール

各列は自分のリストに 4 つのルールを渡します。`put` はマルチドラッグのすべてのカードを一度に見ます：カードがすべて制限内に収まれば列はすべてを受け入れ、収まらなければ 1 枚も受け入れません。満杯の列の上では、枠はドラッグが始まった場所に留まり、列は赤くなり、手に持ったカードがその理由を伝えます。`onBeforeDrop` はカードが Done に入る前に確認し、`animateChanges` はドラッグ以外で出入りするカード（フィルター、Add card、Undo）をスライドさせます。

```ts [Column.vue]
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.column.id,
  items: () => props.column.cards.filter(board.matches),
  group: { name: 'cards', put: ({ keys }) => board.fits(props.column, keys) },
  overlay: CardOverlay,
  animateChanges: true,
  onBeforeDrop: (event) => (props.column.confirm && !event.sameList ? board.ask(event.items) : 'accept'),
  onDrop: (event) => {
    event.preventDefault();
    board.apply(event);
  },
});
```

## フィルターと、ボードが適用するドロップ

ツールバーの検索と担当者がカードをフィルターし、どのドラッグも表示されているものに対してそのまま動作します。各リストは自分の列をゲッターでフィルターして読み取るので、ライブラリがそれに書き込むことはありません：`onDrop` は `preventDefault()` を呼び、`e.result`（ドロップで変わったすべての列の、フィルター後の新しいカード）をボードに渡します。ボードはそれらを表示中のカードがあった位置に戻し、フィルターで隠れたカードは元の場所に残ります。

```ts [store.ts]
const merge = (all: Card[], shown: Card[]) => {
  const queue = [...shown];
  const merged: Card[] = [];
  for (const entry of all) {
    if (!matches(entry)) merged.push(entry);
    else if (queue.length) merged.push(queue.shift()!);
  }
  // Cards that came in from another column and found no place left: at the end.
  return [...merged, ...queue];
};
```

## 手に持ったカード

**CardOverlay.vue** はカードの `overlay` です。掴んだカードは浮いて傾き、選択の残りはその下に重なり（ラッパーの `transform` で回転させた `DragPreview` のクローンで作られています）、上に件数が表示されます。カードの下には、離したら何が起きるかを示すヒントが、オーバーレイの `over` と `accepted` から表示されます：*Move 2 cards to In review*、*Complete*、*Delete*、または *In review is full · 2 max*。列にドロップすると、各クローンはそれぞれ自分の枠に着地します。ゴミ箱の上では山が縮み、そこにドロップするとカードが 1 枚ずつ順に入っていきます。

```ts [CardOverlay.vue]
const hint = computed(() => {
  if (props.status !== 'dragging' || !props.over) return null;
  const many = props.items.length > 1 ? ` ${props.items.length} cards` : '';
  if (props.over.id === 'trash') return { tone: 'danger', icon: 'trash', text: `Delete${many}` };
  const column = board.column(props.over.id);
  if (!column) return null;
  if (!props.accepted) return { tone: 'danger', icon: 'limit', text: `${column.title} is full · ${column.limit} max` };
  if (board.find(props.items[0]!.id)?.column.id === column.id) return null;
  if (column.confirm) return { tone: 'done', column, text: `Complete${many}` };
  return { tone: '', column, text: `Move${many} to ${column.title}` };
});
```

ヘッダーでドラッグした列はデフォルトのクローンで、`data-dnd-overlay` が `dragging` の間、`rotate` プロパティで傾きます。

## Done はまず確認する

Done へのドロップでは、`onBeforeDrop` が Promise を返します：**ConfirmDialog.vue** が尋ねている間、カードは離された場所で待ちます。*Move to Done* は `'accept'`、Cancel と Escape は `'reject'`（カードは元の位置に戻ります）、*Keep dragging* は `'continue'` と答えます：カードは再びポインターに追従し、次のクリックでドロップされます。カードが着地すると（`onDragSettle`）、Done でチェックが現れ、スプリントの進捗が進みます。

```ts [Board.vue]
useDnDMonitor({
  onDragSettle: (event) => {
    const target = event.over ? board.column(event.over.id) : undefined;
    if ('dropped' in event && target?.confirm && event.source?.list !== target.id) board.complete(event.accepted);
  },
});
```

## 複数のカード、ゴミ箱、Undo

選択したカードは一緒に移動します：1 枚をドラッグすると、どの列にあっても選択中のカードがすべてついてきます。選択バーはそれらを移動したり、削除したり、選択を解除したりします（Escape でも解除できます）。**Trash.vue** はカードだけを受け入れる通常のドロップターゲットです。Delete ボタンと同じようにカードをボードから削除するので、通知から各カードを元の場所に戻せます。

```ts [Trash.vue]
makeDroppable(el, {
  id: 'trash',
  accept: 'card',
  onDrop: (event) => {
    board.remove(event.active.ids);
    selection.delete(...event.active.ids);
  },
});
```

## ドラッグせずに動かす

カードのパネルには Status ボタンがあり、選択バーには列ごとのボタンがあります。これらは `@vue-dnd-kit/actions` でカードを動かします：`moveItem` はカードの本物のキーボードドラッグを再生し、選択中のカードなら選択全体を連れていきます。あなたのドラッグと同じように読み上げられ、アニメーションし、列の制限と Done の確認もほかのドラッグと同じく適用されます。

```ts [store.ts]
export function useMove() {
  const board = inject(BOARD)!;
  const { moveItem } = useDnDActions();
  return (ids: Key[], target: Column) => {
    if (!board.fits(target, ids)) return board.notify(`${target.title} is full: ${target.limit} cards at most`);
    void moveItem(ids[0]!, { list: target.id });
  };
}
```

## キーボードとスクリーンリーダー

カードを持ち上げるのは Space だけなので、Enter はカードを開くために使えます。操作説明にもそう書かれています。矢印キーはカードを枠ごとに動かし、横方向にはカードを受け入れる次の列へ移します：満杯の列はスキップされ、最後の列を越えると、次の押下でカードはゴミ箱へ進みます。読み上げは id の代わりにカードと列の名前を使います：*「Picked up VDK-45, Haptics on Android tablets. Todo, position 6 of 6.」*、*「In review is full: its limit is 2 cards.」*

```vue [index.vue]
<DnDProvider
  :keyboard="{ keys: { start: ['Space'] } }"
  screen-reader-instructions="Space picks up a card or a column, the arrow keys move it, Space drops it, Escape cancels. Enter opens a card, X selects it."
  :announcements="announcements"
  :haptics="{ enter: true, refuse: true }"
>
```

さらに読む：[アイテムを共有するリスト](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists) · [ドロップの判断](https://zizigy.github.io/docs/guides/drop-decisions) · [マルチドラッグ](https://zizigy.github.io/docs/guides/multi-drag) · [オーバーレイ](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout) · [プログラムによるドラッグ](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) · [アクセシビリティ](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
