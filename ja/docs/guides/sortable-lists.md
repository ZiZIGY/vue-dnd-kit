---
title: "並べ替え可能なリスト"
description: "ドラッグ中に並べ替わるリスト、タブバー、グリッド——makeSortableList がドラフトを描画し、makeSortableItem が行を作り、ドロップで新しい順序が ref に書き込まれます。ハンドル、挿入ライン、入れ替えも。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/sortable-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="25rem" hint="グリップでレイヤーをドラッグしてみましょう。パネルはすぐに、アートボードはドロップ時に動きます" name="layers-panel">



</example>

## リストとその行

並べ替え可能なリストには 2 つのコンポーネントが必要です：リストと、その行です。

```vue [LayersPanel.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

const layers = defineModel<Layer[]>({ required: true });
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: layers });
</script>

<template>
  <ul ref="list">
    <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
  </ul>
</template>
```

```vue [LayerRow.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ layer: Layer }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.layer });
</script>

<template>
  <li ref="el">{{ layer.name }}</li>
</template>
```

行は、それが描画されているリストに登録されます。1 つのコンポーネントで複数のリストを作ることもできます（2 つの列、リストの中のリスト）：各行は自分を含む要素のリストに加わり、リストの中のリストでは最も内側のリストに加わります。

## ドラフト

`makeSortableList` は `items` を返します。これは配列の**ドラフト**です。ドラッグ中、ドラフトはその場で並べ替わります：ドラッグ中の行が新しい枠に入り、ほかの行は道を空けるようにスライドします。配列自体はドロップまで変わりません。ドロップ時に、ライブラリが新しい順序を書き込みます。

上のレイヤーパネルは両方を示しています。パネルは `items` を描画していて、ドラッグ中に動きます。アートボードは配列そのものである `layers` を読み取っていて、離したときにだけ重なり順が変わります。

- 配列ではなく `items` を描画してください。配列を描画すると、ドロップまで何も動きません。
- 書き込みはリストの `onDrop` の後に行われます。`onDrop` の中では、配列はまだ古い順序で、`e.result` が新しい順序です。
- `layers` は普通の ref です（ここでは `defineModel` で、書き込みで `update:modelValue` が発行されます）。そのため、アプリの他の部分もほかの変更と同じようにこの変更を受け取ります。

```ts
makeSortableList(list, {
  items: layers,
  onDrop: (e) => {
    console.log(e.from.index, '→', e.to.index, e.result.get(e.to.list));
  },
});
```

<tip>

ストア、サーバーの状態、イミュータブルなデータを使う場合は、ref の代わりにゲッターか `computed` を渡します。ライブラリは読み取り専用のソースには書き込みません。`e.preventDefault()` を呼び、`e.result` を自分で適用してください。[制御されたリスト](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists)を参照。

</tip>

## キー

行はデータでキー付けされ、インデックスや自動生成の id は使いません。デフォルトのキーは `item.id` で、文字列や数値の場合はアイテムそのものです。

```ts
// LayersPanel.vue: your items have another key
makeSortableList(list, { items: layers, getKey: (layer) => layer.uuid });

// LayerRow.vue: `item` is keyed with the list's getKey…
makeSortableItem(el, { item: () => props.layer });
// …or pass the key yourself
makeSortableItem(el, { id: () => props.layer.uuid });
```

- `v-for` でも同じキーを使ってください：`:key="layer.uuid"`。`:key="index"` では違う行がアニメーションし、行の状態がほかの行へ移ってしまいます。
- キーは、アイテムをやり取りするすべてのリストの中で一意である必要があります。
- `item` と `id` はゲッターとして渡してください。props が変わっても行が同期した状態を保てます。

## ハンドル

デフォルトでは行全体でドラッグを開始できますが、行の中のボタン、入力欄、その他のコントロールは除きます。レイヤーの目とロックのアイコンは普通のボタンのままです。一部分だけでドラッグするには `handle` を渡します。

```vue [LayerRow.vue]
<script setup lang="ts">
makeSortableItem(el, { item: () => props.layer, handle: '.grip' });
</script>

<template>
  <li ref="el">
    <button type="button" class="grip" :aria-label="`Move ${layer.name}`">⠿</button>
    {{ layer.name }}
  </li>
</template>
```

- `handle` はアイテム内のセレクター、または要素の ref です。
- マウスのドラッグはハンドルからすぐに始まり、通常の 4 px を待ちません。動かさない押下はクリックのままです：ハンドルは `click` でメニューを開くこともできます。
- ハンドルにはドラッグの属性（`role`、`tabindex`、`aria-*`）が付き、キーボードドラッグもそこから始まります。

ハンドルは `aria-label` 付きの `<button type="button">` にしてください。そのままでフォーカスでき、スクリーンリーダーがラベルを読み上げます。アイコンだけの `<span>` でも動作します（ライブラリが `tabindex="0"` と `role="button"` を付けます）が、意味のある名前がありません。

<note>

タッチドラッグは 200 ms の長押しの後に始まるので、ページはスクロールできたままです。ハンドルからすぐにドラッグするには、ハンドルに `touch-action: none` を、アイテムに `activation: { touch: { distance: 4 } }` を指定します。

</note>

## ストラテジー

`strategy` はリストのレイアウトを伝え、行が正しい方向に場所を空けるようにします。

<table>
<thead>
  <tr>
    <th>
      <code>
        strategy
      </code>
    </th>
    
    <th>
      用途
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'vertical'
      </code>
      
      （デフォルト）
    </td>
    
    <td>
      行の縦並び。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'horizontal'
      </code>
    </td>
    
    <td>
      1 行の横並び：タブ、チップ、タイムライン。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'grid'
      </code>
    </td>
    
    <td>
      CSS グリッドや折り返す flex の行。サイズの異なるアイテムにも対応します。
    </td>
  </tr>
</tbody>
</table>

タブの並びは横方向のリストです。

<example height="23rem" hint="タブをドラッグしたり、閉じたり、新しく開いたりしてみましょう" name="browser-tabs">



</example>

```ts [Browser.vue]
const { items } = makeSortableList(strip, {
  items: tabs,
  strategy: 'horizontal',
  axis: 'x',        // the tabs stay on their row
  animateChanges: true, // the buttons open and close tabs: slide the others then too
});
```

タブの閉じるボタンはドラッグ可能なタブの中でも動作し、ドラッグを終えるクリックがタブを選択することはありません。ドラッグ中、行は自動でスライドします。`animateChanges` はドラッグ以外による変化、ここではボタンによる変化にも同じ動きを加えます（[アニメーション](https://zizigy.github.io/docs/guides/animations)を参照）。

グリッドは 2 次元で並べ替わり、タイルのサイズは自由です。

<example height="31rem" hint="写真をドラッグしてみましょう。大きいものも動かせます" name="photo-grid">



</example>

```ts [PhotoGrid.vue]
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });
```

```css
.grid { display: grid; grid-template-columns: repeat(4, 76px); grid-auto-rows: 76px; grid-auto-flow: dense; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
```

`grid-auto-flow: dense` は、大きなタイルが動いてもグリッドを詰まった状態に保ちます。これがないと、タイルが収まらなくなった場所に穴が空き、グリッドが 1 行伸びます。

## 軸を固定する

```ts
makeSortableList(list, { items: layers, axis: 'y' });
```

`axis: 'y'` はドラッグを縦軸に、`'x'` は横軸に固定します。上のレイヤーとタブで使っています。アイテム自身の `axis` はリストのものより優先されます。ドラッグをリストの中に収めるには、`restrictToParent` モディファイアも追加します。詳しくは[制約](https://zizigy.github.io/docs/guides/constraints)を参照してください。

## 枠のスタイル

ドラッグ中の行は、着地する枠としてリストの中に残り、`data-dnd-placeholder` が付きます。デフォルトのスタイルは不透明度を 40% にするもので、詳細度がゼロなので、あなたのどんなルールも優先されます。

```css [LayerRow.vue]
.layer[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.layer[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}
```

`makeSortableItem` は同じ状態を ref として返し、さらにいくつか追加します。

<table>
<thead>
  <tr>
    <th>
      戻り値
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
        isPlaceholder
      </code>
    </td>
    
    <td>
      この行が、ドラッグ中のアイテムが着地する枠です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      この行がドラッグされています（マルチドラッグでは、ドラッグ中のすべての行）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      ドラフト内でのインデックス：ドラッグ中に変わります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      書き込み可能で、プロバイダーの選択にバインドされています。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        indicator
      </code>
    </td>
    
    <td>
      <a href="#an-insertion-line">
        インジケーターモード
      </a>
      
      で、ラインが入る位置。
    </td>
  </tr>
</tbody>
</table>

リストは自身の強調表示用に `isOver` と `isAccepting` を返し、さらに `activeKey` と `activeIndex`（ドラッグ中のアイテムと、このリストのドラフト内での位置）も返します。すべての状態とそのライブデモは[スタイリング](https://zizigy.github.io/docs/guides/styling)にあります。

## 機能をオフにする

<table>
<thead>
  <tr>
    <th>
      オプション
    </th>
    
    <th>
      止めるもの
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      アイテムの <code>
        disabled
      </code>
    </td>
    
    <td>
      このアイテムはドラッグできません。ほかのアイテムはその横を通って動けます。上のレイヤーをロックして、別のレイヤーをその上へドラッグしてみましょう。
    </td>
  </tr>
  
  <tr>
    <td>
      リストの <code>
        disabled
      </code>
    </td>
    
    <td>
      そこからドラッグできず、そこへドロップもできません。
    </td>
  </tr>
  
  <tr>
    <td>
      リストの <code>
        sort: false
      </code>
    </td>
    
    <td>
      アイテムはリスト内で並べ替えられませんが、リストから出ることはできます：パレット。<a href="/docs/guides/shared-lists#what-goes-in-and-out-pull-and-put">
        アイテムを共有するリスト
      </a>
      
      を参照。
    </td>
  </tr>
</tbody>
</table>

いずれもゲッターまたは ref を受け取り、次のドラッグから適用されます。

```ts [LayerRow.vue]
makeSortableItem(el, { item: () => props.layer, handle: '.grip', disabled: () => props.layer.locked });
```

ほかがどうであれ必ず先頭や末尾にある行は、そもそもアイテムではありません。リストの外に描画してください。パネルの Background レイヤーは `<ul>` の下にあります。

## アイテムの一部を表示する

検索ボックスやタグなど：`filter` は `true` を返したアイテムを表示し、ドラッグはその中で並べ替えます。ほかのアイテムは配列の中に、元の位置のまま残ります。

<example height="27rem" hint="タグを選ぶか検索してから、タスクをドラッグしてみましょう。配列は隠れたタスクを元の位置に保ちます" name="filtered-list">



</example>

```ts [Backlog.vue]
const query = ref('');
const tag = ref<Tag | null>(null);

const { items } = makeSortableList(list, {
  items: tasks,
  filter: (task) => (!tag.value || task.tag === tag.value) && task.title.includes(query.value),
});
```

- `items` には条件に合うアイテムが入ります：いつもどおり描画してください。フィルターはリアクティブです：検索ボックスに入力すると、リストはすぐに更新されます。
- ドロップは配列全体を書き込みます。隠れた各アイテムは、直前にあった表示中のアイテムのすぐ後ろに残ります。そのアイテムが移動したアイテムだった場合は、その前にある移動していない最も近いアイテムの後ろに残ります。
- `e.to.index` とリストの `activeIndex` は、表示中のアイテムで数えます。`e.result` には、隠れたアイテムも含めた配列全体が入ります。

<note>

配列をフィルターする `computed` を `items` として渡すこともできますが、それは読み取り専用です：`e.result` を自分で適用し、隠れたアイテムをどこに置くかを自分で計算することになります。`filter` はその両方を行います。

</note>

## 挿入ライン

`placeholder: 'indicator'` では、ドラッグ中もリストは動かず、ドロップ先をラインが示します。ラインはあなたが描きます。

<example height="27rem" hint="issue をドラッグしてみましょう。行き先をラインが示します" name="issue-table">



</example>

```ts [IssueTable.vue]
const { items, indicator } = makeSortableList(body, { items: issues, placeholder: 'indicator' });
```

```vue [IssueRow.vue]
<script setup lang="ts">
const { indicator } = makeSortableItem(el, { item: () => props.issue });
</script>

<template>
  <div ref="el" class="row" :class="indicator && `drop-${indicator.side}`">…</div>
</template>

<style scoped>
.row.drop-before::before { content: ''; position: absolute; top: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
.row.drop-after::before { content: ''; position: absolute; bottom: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
</style>
```

<table>
<thead>
  <tr>
    <th>
      <code>
        indicator
      </code>
      
       のフィールド
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
        list
      </code>
    </td>
    
    <td>
      ドロップ先のリスト。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      描画されているリストでの挿入インデックス。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        key
      </code>
    </td>
    
    <td>
      ラインが付くアイテム。空のリストでは <code>
        null
      </code>
      
      （そのときはリストに描きます）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        side
      </code>
    </td>
    
    <td>
      そのアイテムの <code>
        'before'
      </code>
      
       または <code>
        'after'
      </code>
      
      。<a href="#swap-instead-of-shift">
        入れ替え
      </a>
      
      のリストでは <code>
        'swap'
      </code>
      
      。ツリーでは <code>
        'inside'
      </code>
      
       が加わります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
      
      、<code>
        parentKey
      </code>
    </td>
    
    <td>
      ツリーのみ：ドロップの着地先。<a href="/docs/guides/trees#an-insertion-line">
        ツリー
      </a>
      
      を参照。
    </td>
  </tr>
</tbody>
</table>

- リストの `indicator` はラインがそのリストにある間（テーブルがそれを表示しています）、アイテムの `indicator` はラインがそのアイテムに付いている間、値を持ちます。
- ドラッグ中の行は元の位置にとどまり、プレースホルダーとしてマークされます。薄く表示してください。
- キーボードでもラインが動きます。
- このモードでは、すべてのターゲットの外へのドロップはキャンセルになります（`dropOutside: 'cancel'`）。リストは別の順序を一度も表示していないためです。
- オーバーレイはその下の行の一部を覆います。少し透けるようにすると、ラインが透けて見えます：`[data-dnd-overlay] .row { opacity: 0.85 }`。

## ずらす代わりに入れ替える

`behavior: 'swap'` では、ドラッグ中のアイテムがその下のアイテムと場所を入れ替え、ほかのアイテムは動きません。

<example height="29rem" hint="2 人を入れ替えてみましょう。列をまたいでも可能です。On drop も試してみましょう" name="on-call">



</example>

```ts [Rotation.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'rotation',
  behavior: 'swap',
  placeholder: () => props.placeholder,   // 'item' (live) or 'indicator' (on drop)
  onDrop: (e) => {
    if (e.partner) emit('swap', `${e.items[0]?.name} ⇄ ${e.partner.item.name}`);
  },
});
```

- **ライブ**（`placeholder: 'item'`、デフォルト）：ドラッグ中に入れ替えが表示されます。戻したり、リストの外に出たりすると元に戻ります。
- **ドロップ時**（`placeholder: 'indicator'`）：ドロップまで何も動きません。インジケーターはドロップで入れ替わるアイテムを `side: 'swap'` で示します。ラインを描く代わりに、そのアイテムを枠線で囲みましょう。矢印キーでその印がアイテムからアイテムへ移り、ドラッグ中のアイテムに戻ると印はなくなります。

```vue [PersonCell.vue]
<li ref="el" :class="{ target: indicator?.side === 'swap' }">…</li>
```

ドロップイベントは `mode: 'swap'` と、入れ替わった相手のアイテムである `partner`（その `key`、`item`、自身の `from` と `to`）を持ちます。同じグループの 2 つのリストは、どちらも `behavior: 'swap'` であれば、2 つの列のように互いの間で入れ替えができます。このときホバーされたアイテムはもう一方のリストへ移るので、出ること（`group.pull`）と入ること（`group.put`）が許可されている必要があります：[アイテムを共有するリスト](https://zizigy.github.io/docs/guides/shared-lists)を参照。マルチドラッグは入れ替えではなく並べ替えになります。

## キーボード

行またはそのハンドルにフォーカスし、:kbd{value="Space"} か <kbd value="Enter">



</kbd>

 を押して持ち上げます。リストに沿った矢印キーで 1 枠ずつ動き、グリッドでは上下キーで次の行へ、リストを横切る方向の矢印キーで同じグループの次のリストへ移ります。リストの端を越えると、矢印キーはその方向にある次のリストへ進み（上下に積み重なったリスト）、なければそこにあるドロップターゲット（ゴミ箱ゾーン）へ進みます。もう一度 <kbd value="Space">



</kbd>

 か <kbd value="Enter">



</kbd>

 を押すとドロップし、:kbd{value="Escape"} で元に戻します。このページのすべてのデモがこのように動作します。スクリーンリーダー向けのテキストは[アクセシビリティ](https://zizigy.github.io/docs/guides/accessibility)にあります。

## アニメーション

ドラッグ中、行は新しい位置へスライドし、ドロップした行は自分の枠に着地します。行が入ったり出たりすると、リスト自体も新しいサイズへと大きくなったり小さくなったりします（`animateSize`）。これはデフォルトでオンで、コードは不要です。行を `<TransitionGroup>` で囲まないでください。移動が二重にアニメーションします。行の `transform` に CSS の `transition` を付けるのも避けてください。ドラッグ以外による変化（追加、削除、シャッフル）には、タブのようにリストの `animateChanges` オプションをオンにします。[アニメーション](https://zizigy.github.io/docs/guides/animations)を参照してください。

オプションの完全な一覧は [makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list) と [makeSortableItem](https://zizigy.github.io/docs/api/make-sortable-item) の API にあります。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
