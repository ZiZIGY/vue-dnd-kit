---
title: "ダッシュボード"
description: "グリッド上のウィジェット。ヘッダーで動かし、角で 1 セルずつサイズを変え、行の高さは中身に合わせて決まり、狭い画面では列が少なくなります。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/dashboard"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="38rem" hint="ウィジェットをヘッダーでドラッグし、角でサイズを変え、メモに入力してみましょう" name="dashboard" title="ダッシュボード">



</example>

## 注目ポイント

- **Dashboard.vue**：グリッドは `strategy: 'grid'` を使う 1 つの並べ替え可能なリストで、このストラテジーはサイズの異なるウィジェットを並べ替えます。列の数は自身の幅（`useElementSize`）から数えます：4 列、3 列、2 列のいずれかです。行の高さは最低 92 px で、中身に合わせて伸び、`grid-auto-flow: dense` がサイズ変更で空いた穴を埋めます。
- **Widget.vue**：ウィジェットはヘッダー（`handle`）で動くので、中身は自由に使えます：タスクにはチェックを入れられ、メモには入力できます。角はそれ自体がドラッグ可能な要素で、ウィジェットのサイズを変えます。
- **WidgetBody.vue**：ウィジェットに表示される内容です。メモに入力してみましょう：行はテキストに合わせて伸び、隣のウィジェットも行に合わせて伸びます。何もそれらを測ってはいません：これはグリッド自身のレイアウトで、ライブラリはドラッグが始まった時点のサイズをそのまま読み取ります。
- **widgets.ts**：ウィジェット、そのセル単位のサイズ、グリッドの数値。

サンプルを展開してみましょう：グリッドが 4 列になり、小さな画面で幅が狭くなったウィジェットは元の幅に戻ります。

## サイズ変更：角はドラッグ可能な要素

角はウィジェットの中にあり、押下は最も近いドラッグ可能な要素、つまりウィジェットではなく角をドラッグします。角はオーバーレイを持たず、決して動きません。代わりにウィジェットが大きくなります。

```ts [Widget.vue]
makeDraggable(corner, {
  id: cornerId,
  type: 'resize',
  overlay: false,
  activation: { touch: { distance: 4 } }, // a finger resizes at once, not after a long press
  attributes: false,                       // no tab stop: Shift + arrows on the header resize
});
```

サイズはポインターに追従します：押下からポインターが動いた距離を、セル単位で数えたものです。角を押さえている間、グリッドはそのサイズを表示し、ほかのウィジェットが場所を空けます。

```ts [Widget.vue]
const preview = computed<Size | null>(() => {
  const start = from.value;
  if (!resizing.value || !start || !pointer.value) return null;
  return {
    w: clamp(cellsIn(pixels(own.value.w, props.cell) + pointer.value.x - start.x, props.cell), 1, props.columns),
    h: clamp(cellsIn(pixels(own.value.h, ROW) + pointer.value.y - start.y, ROW), 1, MAX_ROWS),
  };
});
```

ドロップでそのサイズが保たれます：モニターが角の `onDragEnd` を受け取ります。:kbd{value="Escape"} を押すと代わりにドラッグがキャンセルされ、ウィジェットは元のサイズに戻ります。

```ts [Widget.vue]
useDnDMonitor({
  onDragEnd: ({ active: dropped }) => {
    if (dropped.id === cornerId() && preview.value) emit('resize', preview.value);
  },
});
```

## グリッドはサイズ変更に加わらない

角はウィジェットではないので、グリッドはそれを拒否してしまいます：ドラッグを拒否するターゲットへのドロップはキャンセルです。そのため角をドラッグしている間、グリッドは `disabled` になり、角のドロップはどのターゲットの上にも落ちません。

```ts [Dashboard.vue]
const { active } = useDnD();
const { items } = makeSortableList(grid, {
  items: widgets,
  strategy: 'grid',
  label: 'Dashboard',
  disabled: () => !!active.value?.type.includes('resize'),
});
```

## 適応するサイズ

ウィジェットは与えられたサイズを保ちます。列が少ないときもグリッドより広くなることはなく（`Math.min(w, columns)`）、グリッドに再び余裕ができると元の幅に戻ります。行が持つのは最小の高さで、高さそのものではありません：高さは中身が決め、行の中のウィジェットはすべていちばん高いものに合わせて伸びます。

## キーボード

Tab でウィジェットのヘッダーに移り、:kbd{value="Space"} を押してウィジェットを持ち上げます。矢印キーでほかのウィジェットの間を動かし、:kbd{value="Space"} でドロップし、:kbd{value="Escape"} で元に戻します。ヘッダーにフォーカスがあるときは、:kbd{value="Shift"} と矢印キーでウィジェットのサイズを 1 セルずつ変えられ、スクリーンリーダーは新しいサイズを聞きます。

さらに読む：[ストラテジー](https://zizigy.github.io/docs/guides/sortable-lists#strategies) · [ハンドル](https://zizigy.github.io/docs/guides/sortable-lists#handles) · [オーバーレイなし](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay) · [useDnDMonitor()](https://zizigy.github.io/docs/guides/provider#listen-to-every-drag-usedndmonitor) · [週間カレンダー](https://zizigy.github.io/docs/examples/calendar)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
