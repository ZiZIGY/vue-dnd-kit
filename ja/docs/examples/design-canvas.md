---
title: "デザインキャンバス"
description: "Figma 風のエディター。ズームできるキャンバス上のフレームとレイヤー、スマートガイド、範囲選択、Alt で複製、そしてデザインのツリーそのものであるレイヤーパネル。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/design-canvas"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="43rem" hint="レイヤーをもう一方のフレームへドラッグしてみましょう。枠を描いたり Shift クリックしたり、Alt を押してコピーをドロップしたりできます" name="design-canvas" title="デザインキャンバス">



</example>

## 注目ポイント

- **Shape.vue** と **Artboard.vue**：すべてのレイヤーは通常のドラッグ可能な要素で、フレームは名前の部分（`handle`）でドラッグし、中のレイヤーも一緒に動きます。Figma と同じく押した瞬間に選択されるので、ドラッグが運ぶのはプロバイダーの選択です：選択中の複数のレイヤーの 1 つを押すと、すべてが動きます。
- **useLayerDrop.ts**：キャンバスとすべてのフレームは、同じように動作するドロップターゲットです。フレームの上で離したレイヤーはそのフレームの中へ移り、キャンバスの上で離すとフレームの外へ出ます。:kbd{value="Alt"} を押していると、代わりにコピーが着地し、レイヤーは元の場所に残ります。
- **LayersPanel.vue**：パネルは、デザインそのものに対する `makeSortableTree` です。行の順序は重なり順で、行をフレームの中にドロップするとレイヤーがそのフレームへ移ります。
- **Canvas.vue**：スマートガイドはデモ独自のモディファイアです。`makeSelectionArea` が範囲選択の枠を描き、`makeDragArea` がキャンバスで始まるすべてのドラッグにルールを与えます。
- **editor.ts**、**geometry.ts**、**design.ts**：デザイン、その履歴、表示、そしてスナップと整列の計算で、ドラッグ＆ドロップは含みません。

## ズームに合わせて描く

キャンバスは CSS の `scale()` を使わずにズームします：すべてのレイヤーは、サイズにズーム倍率を掛けた大きさで、画面のピクセル単位でレイアウトされます。そのため、ライブラリが測定するものは画面に表示されているものと同じになり、ドロップターゲット、範囲選択の枠、オーバーレイ内のクローンに特別な処理は要りません。キャンバス内の世界は、パンだけで `translate()` によって動かされます。

```ts [Shape.vue]
const style = computed(() => {
  const { zoom } = editor.view;
  const { x, y, width, height } = props.shape;
  return { left: `${x * zoom}px`, top: `${y * zoom}px`, width: `${width * zoom}px`, height: `${height * zoom}px` };
});
```

ホイールでパンとズーム（:kbd{value="Ctrl"} またはピンチ）ができ、:kbd{value="Space"} を押しながらのドラッグ、ハンドツール、隅のボタンでも同じことができます：これらはリサイズハンドルと同じく、ただのポインターイベントとホイールイベントです。Space がハンドツールなので、レイヤーを持ち上げるのは <kbd value="Enter">



</kbd>

 だけです（プロバイダーの `keyboard.keys`）。

## フレーム間でレイヤーを動かす

レイヤーは、独自のオーバーレイ `DragGroup.vue` を持つ通常のドラッグ可能な要素です。オーバーレイはドラッグされたレイヤーを並んだとおりに配置します：各レイヤーの `DragPreview`（持ち上げ時に作られたクローン）を、レイヤーの `data` から、それが描かれている位置に置きます。クローンが動いている間、:kbd{value="Alt"} を押していなければレイヤー自体は姿を消します。

```ts [Shape.vue]
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.shape.id,
  type: 'layer',
  data: () => editor.dragData(props.shape), // { layer, left, top }
  overlay: DragGroup,
});
```

ドロップ時、`position` は、掴んだレイヤーの角がターゲットの中で離された位置を画面のピクセルで表したものです。これをズーム倍率で割ると、そのレイヤーが世界の中でどれだけ動いたかがわかり、ドラッグされたすべてのレイヤーが同じだけ、フレームの中へ、またはキャンバスの上へ動きます。

```ts [useLayerDrop.ts]
const corner = target ? editor.boxOf(target) : { x: -view.x / view.zoom, y: -view.y / view.zoom };
const toWorld = (x: number, y: number) => ({ x: corner.x + x / view.zoom, y: corner.y + y / view.zoom });

const from = editor.boxOf(grabbed); // the layer of `active.id`
const to = toWorld(position.x, position.y);
editor.move(active.ids, { x: to.x - from.x, y: to.y - from.y }, target, editor.altHeld.value);
```

フレームが受け入れるのはレイヤーで、フレームは受け入れません：フレームを運ぶドラッグは、ほかのフレーム（`disabled` で、ライブで読み取られます）を素通りしてキャンバスへ向かいます。レイヤーはクローンが離された場所にそのまま現れるので、ターゲットは `dropAnimation: false` です。ツールバーのツールも通常のドラッグ可能な要素です：フレームにドロップすると、ドロップ位置を中心にそのレイヤーをフレームに追加し、クリックすると表示の中央に追加します。

```ts [Artboard.vue]
makeDroppable(body, {
  id: () => props.frame.id,
  accept: 'layer',
  disabled: () => !!active.value?.items.some((item) => item.type.includes('frame')),
  dropAnimation: false,
  onDrop: useLayerDrop(() => props.frame),
});
```

## スマートガイド

`smartGuides` はモディファイアです：ドラッグのオフセットを受け取り、ドラッグされたレイヤーが世界の中のどこに来るかを計算し、画面上 6 ピクセル以内にあるほかのレイヤーの最も近い辺か中心へ引き寄せます。オーバーレイ、その下のターゲット、ドロップはすべてそれに従います。モニターが、ドラッグの `delta`（モディファイア適用後のオフセット）からピンクのラインと距離を描きます。

```ts [Canvas.vue]
const smartGuides: Modifier = ({ transform, active }) => {
  const moving = editor.boundsOf(active.ids);
  if (!moving) return transform; // a tool from the toolbar
  const { zoom } = view;
  const box = offsetBox(moving, transform.x / zoom, transform.y / zoom);
  const targets = editor.snapTargets(active.ids);
  return {
    x: transform.x + snapBox(box, targets, 'x', SNAP / zoom) * zoom,
    y: transform.y + snapBox(box, targets, 'y', SNAP / zoom) * zoom,
  };
};

// Every drag that starts on the canvas, frames and layers alike, gets the guides.
makeDragArea(viewport, { modifiers: [smartGuides], disabled: panning });
```

リサイズハンドルも同じラインにスナップし、同じガイドを描きます。

## 選択

空いたキャンバスに描いた選択枠はフレームと、フレームに属さないレイヤーを選択します。フレームの中に描くと、そのフレームのレイヤーを選択します。どちらも `makeSelectionArea` です：最も内側のエリアが押下を受け取り、その中のドラッグ可能な要素を担当します。:kbd{value="Shift"} で選択に追加します（`strategy: 'toggle'`）。

```ts [Artboard.vue]
const { isSelecting, style: band } = makeSelectionArea(body, {
  strategy: () => (editor.shiftHeld.value ? 'toggle' : 'select'),
  disabled: editor.panning,
});
```

エディターは、フレームとその中のレイヤーを同時に選択することはありません：ドラッグすると、そのレイヤーが 2 回動いてしまうからです。選択枠は始まるときにポインターをキャプチャするので、フレームの空いた場所のクリックはフレームに届きません：`Artboard.vue` は、そこで押した位置のまま離されたときにフレームを選択します。

## レイヤーパネル

ツリーのアイテムはデザインそのものです：`children` を持つフレームで、一番上の行が最前面です。`canNest` はフレームがレイヤーを受け入れられるようにし、フレームをトップレベルに留めます。レイヤーの id はキャンバス上のドラッグ可能な要素のものなので、行は独自のキー（`row:…`）を持ちます。選択はキャンバスのものなので、行はそのレイヤーと一緒に強調表示されます。

```ts [LayersPanel.vue]
makeSortableTree(tree, {
  items: editor.layers,
  getKey: (layer) => `row:${layer.id}`,
  canNest: (layer, parent) => parent.kind === 'frame' && layer.kind !== 'frame',
  maxDepth: 1,
  animate: true,
  onDrop: ({ items, from, to }) => {
    // Positions count from the frame's corner: a layer changing frames takes the
    // difference, so it stays where it is on the canvas.
  },
});
```

`onDrop` はツリーが書き込まれる前に実行されるので、エディターは各レイヤーがどのフレームから来たかをまだ知っており、元に戻すためにデザインを保存します。そのレイヤーを覆わないフレームへ移したレイヤーは、切り取られて見えなくなってしまうので、代わりにフレームの中央へ移ります。`animate` によって、キャンバスでの変更や元に戻す操作でも行がスライドします。行には型があるので（`type: 'row'`）、レイヤーとツールを受け入れるキャンバスとフレームは行を拒否します。

## キーボード

Tab でレイヤーに移り（そのレイヤーが選択されます）、:kbd{value="Enter"} で持ち上げ、矢印キーで 10 ピクセル（:kbd{value="Shift"} で 40）動かし、:kbd{value="Enter"} でその下のフレームにドロップします。ドラッグしていないときは、矢印キーで選択を 1 ピクセルずつ動かします。ツールも同じように持ち上げ、その矢印キーはキャンバスとフレームの間をジャンプします（`keyboard: 'droppables'`）。そのほかのショートカットは、何も選択されていないときに Design パネルに一覧があります。

さらに読む：[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped) · [独自のモディファイア](https://zizigy.github.io/docs/guides/constraints#your-own-modifier) · [ページの一部に対するルール](https://zizigy.github.io/docs/guides/constraints#rules-for-a-part-of-the-page) · [範囲選択](https://zizigy.github.io/docs/guides/multi-drag#rubber-band-selection) · [ツリー](https://zizigy.github.io/docs/guides/trees)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
