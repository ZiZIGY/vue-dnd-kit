---
title: "軸、境界、グリッド"
description: "ドラッグを 1 つの軸に固定し、ボックスの中に収め、グリッドや独自のガイドにスナップします——1 つのアイテム、1 つのリスト、ページの一部全体に対して。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/constraints"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

ドラッグは 1 つの軸に固定したり、ボックスの中に収めたり、グリッドにスナップしたり、独自のルールで曲げたりできます。こうしたルールが**モディファイア**で、毎フレーム、ドラッグのオフセットを調整します。1 つのドラッグ可能な要素、リスト、ページの一部のいずれかに設定すると、オーバーレイ、ドロップターゲット、ドロップのすべてがそれに従います。

## 軸を固定する

タイムライン上のクリップはトラックに沿ってスライドします。固定をオフにすると、トラックを移ることもできます。

<example height="22rem" hint="クリップをドラッグし、固定をオフにしてもう一方のトラックへドラッグしてみましょう" name="axis-timeline">



</example>

```ts [TimelineClip.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.clip.id,
  axis: () => (props.locked ? 'x' : undefined),
});
```

`axis: 'x'` は横方向だけ、`'y'` は縦方向だけに動きます。`makeDraggable`、`makeSortableList`、`makeSortableTree`、`makeSortableItem`、`makeDragArea` のいずれもこれを受け取ります。

```ts
makeSortableList(listRef, { items: tracks, axis: 'y' });
```

- 固定は**すべてのモディファイアの後**に実行されるので、モディファイアが何をしても保たれます。スナップや境界がアイテムを線から押し出すことはありません。
- 線は画面上ではなくコンテンツの中にあり、ドラッグを開始したリスト（または親要素）と一緒に動きます。ドラッグの途中でページをスクロールしても、アイテムは自分の行にとどまります。
- アイテム自身の `axis` はリストやツリーのものより優先され、ドラッグ可能な要素（またはそのリスト）のものはドラッグエリアのものより優先されます。
- ドラッグ開始時に読み取られるので、上のようにゲッターで切り替えられます。
- `'y'` に固定したツリーでもネストはできます。そのときの深さは、行の中央へのホバーで決まります。

<tip>

`restrictToVerticalAxis` や `restrictToHorizontalAxis` モディファイアより `axis` を使ってください。同じことをしますが、通常のモディファイアとしてチェーンの途中で実行されるため、その後のモディファイア（両軸をスナップするグリッド）がアイテムを軸から外すことがあります。

</tip>

## モディファイア

モディファイアは毎フレーム、ドラッグのオフセットを調整します。その結果はオーバーレイを動かす**と同時に**、ターゲットを探す点にもなります。そのため、リストは固定・制限・スナップされた位置で並べ替えられ、ドロップの `position` はボックスが最終的に置かれた場所になります。

<table>
<thead>
  <tr>
    <th>
      モディファイア
    </th>
    
    <th>
      役割
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      オーバーレイを、ドラッグが始まったコンテナー（並べ替え可能なリスト、または通常のドラッグ可能な要素の親要素）の中に収めます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(target)
      </code>
    </td>
    
    <td>
      オーバーレイを要素の中に収めます：テンプレート参照、ゲッター、または要素そのもの。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      オーバーレイをウィンドウの中に収めます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      オーバーレイを、ドラッグされた要素の最初のスクロール可能な祖先の中に収めます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size)
      </code>
    </td>
    
    <td>
      オーバーレイをグリッドにスナップします（後述）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      掴んだ位置のオフセットを保つ代わりに、オーバーレイをポインターの下の中央に置きます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      縦方向だけに動きます。<code>
        axis: 'y'
      </code>
      
       を推奨します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      横方向だけに動きます。<code>
        axis: 'x'
      </code>
      
       を推奨します。
    </td>
  </tr>
</tbody>
</table>

`modifiers` は、プロバイダー、ドラッグエリア、リストとツリー、ドラッグ可能な要素と並べ替え可能なアイテムのオプションです。プロバイダー以外はすべて ref やゲッターも受け取り、ドラッグ開始時に読み取られます。

### 内側に収める

ビデオ通話のセルフビューは画面の中にとどまります。境界を切り替えて、遠くへドラッグしてみましょう。

<example height="29rem" hint="それぞれの境界で、セルフビューを画面の外へドラッグしてみましょう" name="bounds-pip">



</example>

```ts [SelfView.vue]
const { isDragging } = makeDraggable(el, {
  id: 'self-view',
  modifiers: () => props.modifiers, // [restrictToParent], [restrictToWindowEdges] or []
});
```

- `restrictToParent` は、親要素である画面の上に保ちます。並べ替え可能なアイテムの場合、「親」は DOM のどこにあってもそのリストです。
- `restrictToWindowEdges` は画面の外には出られますが、ウィンドウの外には出られません。画面の外でドロップすると、ドロップターゲットの上ではないので元の位置に戻ります。
- 境界がなければ、どこへでも行けます。

境界は**オーバーレイ**を、そのときのサイズで内側に収めます。`overlayFit: 'slot'` では、幅の広いアイテムのリストの上で大きくなったボックスは、新しいサイズで内側に収められます。

### グリッドにスナップする

フローチャートのノードはキャンバスのグリッドにスナップします。セルのサイズと滑らかな移動を切り替えてみましょう。

<example height="29rem" hint="ノードをドラッグし、グリッドと smooth を切り替えてみましょう" name="snap-canvas">



</example>

```ts [FlowNode.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.node.id,
  modifiers: () => [snapToGrid({ x: props.grid, y: props.grid, smooth: props.smooth })],
});
```

`snapToGrid(24)` は両軸を 24 px のセルにスナップします。オブジェクトを渡すと、さらに設定できます。

<table>
<thead>
  <tr>
    <th>
      オプション
    </th>
    
    <th>
      意味
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        x
      </code>
      
      、<code>
        y
      </code>
    </td>
    
    <td>
      軸ごとのセルのサイズ（ピクセル）。片方を省くと、もう片方だけがスナップします：<code>
        { y: 15 }
      </code>
      
       はイベントを 15 分単位にスナップし、日をまたぐ方向には自由に動かせます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      <code>
        'container'
      </code>
      
      （デフォルト）：オーバーレイの左上の角が、コンテナー（並べ替え可能なリスト、または通常のドラッグ可能な要素の親）の左上から引いたグリッド線の上に着地します。<code>
        'delta'
      </code>
      
      ：オフセット自体を丸めるので、グリッドから外れた位置で始まったアイテムは外れたまま、元の位置からセル単位で動きます。どこにでも置かれ（自由なキャンバス）、それぞれの揃え方を保つべきアイテムに選んでください。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        smooth
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       または <code>
        { duration, easing }
      </code>
      
      ：オーバーレイがセルの間を滑らかに移動します（デフォルト 80 ms）。ターゲットはスナップされた位置をすぐに使います。
    </td>
  </tr>
</tbody>
</table>

`origin: 'container'` では、グリッドをコンテナーのボーダーボックスから描いてください。上のキャンバスは枠を `border` ではなく `box-shadow` で描いているので、グリッド線はちょうど端から始まります。

### 独自のモディファイア

スライド上のボックスは、ほかのボックスに近づくとその端や中心にぴたりと合い、ピンクのガイドが揃った線を示します。

<example height="26rem" hint="ボックスを別のボックスの横か、スライドの中央へドラッグしてみましょう" name="magnet-guides">



</example>

```ts [Slide.vue]
import type { Modifier } from '@vue-dnd-kit/core';

/** Near a line, the box jumps onto it. */
const magnet: Modifier = ({ transform, overlayRect, containerRect, active }) => {
  if (!containerRect) return transform;
  const id = String(active.id);
  const left = overlayRect.left - containerRect.left;
  const top = overlayRect.top - containerRect.top;
  return {
    x: transform.x + pull(left, overlayRect.width, lines(id, 'x')),
    y: transform.y + pull(top, overlayRect.height, lines(id, 'y')),
  };
};

// In order: the magnet pulls, then the slide's edges hold.
const modifiers = [magnet, restrictToParent];
```

モディファイアは `transform`（それより前のモディファイアが残した、ドラッグ開始からのオフセット）を受け取り、新しいオフセットを返します。計算に必要になりうる情報も受け取ります。

<table>
<thead>
  <tr>
    <th>
      引数
    </th>
    
    <th>
      内容
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      ここまでのオフセット。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      <code>
        transform
      </code>
      
       で動かしたオーバーレイのボックス。現在のサイズです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeRect
      </code>
    </td>
    
    <td>
      ドラッグ開始時のドラッグされた要素。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        containerRect
      </code>
    </td>
    
    <td>
      ドラッグが始まったコンテナー（並べ替え可能なリスト、または親要素）の現在の位置。スクロールに追従します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        windowRect
      </code>
    </td>
    
    <td>
      ウィンドウ。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      ドラッグ開始時のポインター。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
      
      、<code>
        over
      </code>
    </td>
    
    <td>
      ドラッグと、その下にあるターゲット。
    </td>
  </tr>
</tbody>
</table>

モディファイアは毎フレーム実行されます。高速で副作用のないものにしてください。上のガイドは、モニターの `onDragMove` でドラッグの `delta`（すべてのモディファイア適用後のオフセット）から描いています。型は[モディファイア](https://zizigy.github.io/docs/api/modifiers)にあります。

## 順序

複数の場所のモディファイアは順番に実行され、それぞれが前の結果から計算します。

1. プロバイダーの `modifiers`
2. ドラッグが始まったドラッグエリアの `modifiers`
3. ドラッグされたアイテム自身の `modifiers`、なければそのリストまたはツリーのもの
4. ドラッグエリアの `restrictToArea`
5. `axis` の固定

1 つの配列の中では順番に実行されるので、スナップやマグネットは境界より前に置いてください。最後の境界は、ほかが何をしてもボックスを内側に収めます。上のスライドは `[magnet, restrictToParent]` を実行しています。逆順だと、マグネットがスライドの端で止められたボックスを数ピクセル外へ引っ張ってしまうことがあります。

アイテムの `modifiers` はリストのものを**置き換え**ます。追加されるのではありません。エリアの境界はステップ 1〜3 のスナップの後に来るので、スナップされたアイテムも内側にとどまり、軸の固定はすべての最後に来ます。

## 境界のあるリストでも両端に届く

レイヤーパネル：行は上下にしか動かず、パネルから出ることはありません。一番上の行を一番下までドラッグしてみましょう。

<example height="26rem" hint="Heading をパネルの端を越えて一番下へドラッグしてみましょう" name="bounded-layers">



</example>

```ts [Layers.vue]
const { items } = makeSortableList(list, { items: layers, axis: 'y', modifiers: [restrictToParent] });
```

ポインターが動き続けても、境界はオーバーレイをボックスの端で止めます。ポインターがリストの軸方向でオーバーレイから出ると、リストは代わりにポインターで並べ替えるので、アイテムをどう掴んでいても先頭と末尾の位置に届きます。グリッドはオーバーレイで並べ替え続けます。端で止められた時点で、すでに端のセルを覆っているためです。

## ページの一部に対するルール

2 つのエリア、2 組のルール。Layout のステッカーはグリッドにスナップし、そこから出られません。Sketch のステッカーはどこへでも、Layout の中へも行けます。ドラッグは始まったエリアのルールを保ち、ルールが有効になっているエリアが強調表示されます。

<example height="25rem" hint="Layout でステッカーをドラッグしてから、Sketch のステッカーを Layout へドラッグしてみましょう" name="drag-areas">



</example>

```vue [DragArea.vue]
<script setup lang="ts">
const area = useTemplateRef<HTMLElement>('area');
const { isDragging } = makeDragArea(area, {
  modifiers: () => (props.strict ? [snapToGrid(24)] : []),
  restrictToArea: () => props.strict,
});
</script>

<template>
  <div ref="area" class="area" :class="{ busy: isDragging }">
    <Sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker" />
  </div>
</template>
```

`makeDragArea` は、その要素の**内側で始まる**ドラッグのルールを設定します——通常のドラッグ可能な要素にも並べ替え可能なアイテムにも適用され、それらは独自のルールを持つ必要がなくなります。アプリ全体で `DnDProvider` は 1 つにし、ボード、キャンバス、フィードにはそれぞれエリアを与えてください。

<table>
<thead>
  <tr>
    <th>
      オプション
    </th>
    
    <th>
      役割
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        axis
      </code>
    </td>
    
    <td>
      ドラッグを 1 つの軸に固定します。ドラッグ可能な要素自身の <code>
        axis
      </code>
      
      、またはそのリストのものが優先されます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      プロバイダーのものの後、ドラッグ可能な要素自身のものの前に実行されます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      ：ドラッグはエリアの要素の内側にとどまります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      エリアのスクロールコンテナー（要素自身、または最も近いスクロール可能な祖先）の自動スクロール。<code>
        false
      </code>
      
       でそこでの自動スクロールをオフにします。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      ポインターの種類ごとの<a href="/docs/guides/sensors#activation-constraints">
        アクティベーション
      </a>
      
      。スクロールするフィードでタッチの押下を長くする場合など。ドラッグ可能な要素自身のものが優先され、プロバイダーのものは最後です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      エリアの中でも、その中のエリアでもドラッグが始まりません。そのドラッグ可能な要素は <code>
        aria-disabled
      </code>
      
       を示します。
    </td>
  </tr>
</tbody>
</table>

どのオプションも値、ref、ゲッターを受け取り、押下やドラッグの開始時に読み取られます。エリアは `isDragging`（ここで始まったドラッグが実行中。上で枠が光っているのがそれです）と `isAutoScrolling`（自動スクロールがコンテナーを動かしている）を返します。完全なリファレンス：[makeDragArea](https://zizigy.github.io/docs/api/make-drag-area)。

### エリアの組み合わせ方

- ドラッグは、そこから出た後も、**始まった**エリアに従います。エリアの上を通っても何も変わりません。ただし `autoScroll` は例外で、そのコンテナーをスクロールするすべてのドラッグに適用されます。
- 入れ子のエリアはマージされず、最も近いものが優先されます。例外は `disabled` で、これは継承されます。オフになったエリアは、その中のエリアもオフにします。
- 衝突判定、キーボードのキー、読み上げはプロバイダー全体のままです。

<note>

ボードを 2 つ目の `DnDProvider` で囲まないのはなぜでしょうか？ プロバイダーは互いに独立していて、ドラッグが一方から他方へ渡ることはないので、ボードのアイテムはそこから出られなくなります。プロバイダーをネストするのは、ページの一部がプロバイダー全体に関わる独自の設定を必要とし、かつそのアイテムがその中にとどまる場合だけにしてください。[プロバイダー](https://zizigy.github.io/docs/guides/provider)を参照。

</note>

## ドロップした場所に置く

上のタイムライン、通話、フローチャート、スライド、エリアはどれも、各アイテムをドロップした場所に置いています。どのドラッグイベントも `position` を持ちます：ターゲットの中でのドラッグ中のボックスの左上の角で、パディングの端から測り、スクロール量を加えたもの——絶対配置したアイテムをちょうどそこに置くための `left` と `top` です。モディファイアの後に計算されるので、スナップされたノードはグリッド上に着地します。

```ts [Flowchart.vue]
makeDroppable(canvas, { id: 'canvas' });
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const node = nodes.value.find((item) => item.id === active.id);
    if (!node || over?.id !== 'canvas' || !position) return;
    node.x = Math.round(position.x);
    node.y = Math.round(position.y);
  },
});
```

自由なドラッグとドロップターゲットについて詳しくは[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop)を参照してください。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
