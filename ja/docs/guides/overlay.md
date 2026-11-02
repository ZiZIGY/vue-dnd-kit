---
title: "オーバーレイ"
description: "ドラッグ中にポインターに追従するもの——デフォルトのクローンとそのスタイル、ドラッグに合わせて変わるオーバーレイコンポーネント、複数アイテムの同時表示、サイズ、描画される場所。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/overlay"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

ドラッグ中は、ボックスがポインターに追従します：これが**オーバーレイ**です。ドラッグされた要素自体は、着地する枠として元の場所にとどまります。ドロップすると、オーバーレイはその枠へ飛んでいき、消えます。

オーバーレイはコンポーネントの外、`body` にテレポートされます。デフォルトでは、ドラッグされた要素のクローンを表示します。

<example height="22rem" hint="行に入力してチェックを付け、グリップでドラッグしてみましょう。コピーは値とグラフを保ちます" name="overlay">



</example>

## デフォルトのクローン

クローンは持ち上げた時点、何かが動く前に作られます。要素のディープコピーです。

- フォームの値と `<canvas>` のピクセルはコピーされます。
- リストの外に出ると失われる計算済みスタイルはインライン化されます：継承されたフォントと色、祖先経由で一致するスタイル（`.list li { … }`）、テーブルセルの幅。テーブルの行は専用のテーブルに包まれます。
- `id` と `data-dnd-*` 属性は取り除かれ、クローンは `aria-hidden` になります。
- UI キット（Vuetify、Quasar、PrimeVue、Naive UI）のリップルなどの押下エフェクトは除外されます。

上のテーブルでは、入力した行がそのテキスト、金額、チェック、グラフとともに運ばれます。行は専用のテーブルに入り、そのセルは実際のセルの幅を保ちます。

ほかに運ばれるべきでないものには **data-dnd-no-clone** を付けてください：メニューボタン、ツールチップ、選択マークなど。各行の削除ボタンは残ります。

```vue [ExpenseRow.vue]
<tr ref="el" class="row">
  …
  <td><button type="button" aria-label="Remove" data-dnd-no-clone @click="emit('remove')">×</button></td>
</tr>
```

### 背景は推測されない

クローンは要素をそのまま表示します。自身の背景を持たず、リストが背景を塗っている行（白い `<ul>` の中の `<li>`、`v-list-item`、テーブルの行）では、クローンが**透けて**しまいます。CSS でリストの背景を与えてください。ここではセルに付けています。

```vue [ExpenseRow.vue]
<style scoped>
[data-dnd-overlay] .row td {
  background: color-mix(in srgb, currentColor 4%, Canvas);
}
</style>
```

クローンは要素のクラスと属性を、Vue のスコープ属性も含めて保持するので、このルールは行のスコープ付きスタイルでもグローバルなスタイルシートでも機能します。もう 1 つの方法は、行そのものに背景を付けることです。浮いて見えることを意図したアイコンやタイルは、あえて透明のままにしています。

## ボックスのスタイル

ボックスは `data-dnd-overlay` を持つ要素です。`position: fixed` で最前面（`z-index: 9999`）にあり、`pointer-events: none` かつ `inert` で、その値が何をしているかを示します。

<table>
<thead>
  <tr>
    <th>
      <code>
        data-dnd-overlay
      </code>
    </th>
    
    <th>
      タイミング
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        "dragging"
      </code>
    </td>
    
    <td>
      ポインターに追従しています。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        "dropping"
      </code>
    </td>
    
    <td>
      枠に着地している、元の位置に戻っている、または非同期の <code>
        onBeforeDrop
      </code>
      
       を待っています。
    </td>
  </tr>
</tbody>
</table>

ドラッグ中は持ち上がったように見せ、着地すると元に戻すには：

```css
[data-dnd-overlay='dragging'] .row td {
  box-shadow: 0 14px 20px -16px rgb(0 0 0 / 0.7);
}
```

ボックスは `transform` で動き、サイズは `width` と `height` で受け取ります。ボックスではなく、その中身にスタイルを当ててください。クローンはボックスを満たし、ルートには `width: 100%`、`height: 100%`、`transform: none` が設定されています。回転や拡大には `rotate` と `scale` プロパティを使います。トランジションとキーフレームのどちらでもアニメーションできます。レシピは[アニメーション](https://zizigy.github.io/docs/guides/animations)にあります。

## オーバーレイコンポーネント

クローン以外のものを表示するには、コンポーネントを渡します。それはボックスの中に描画され、ドラッグの情報を props として受け取ります。props はドラッグ中に変わります：ドラッグがどこにあるか、そこが受け入れるか、ドロップがコピーか、そしてドロップそのもの。

<example height="26.5rem" hint="チケットを列の上へドラッグしてみましょう。Done は承認済みのものを受け入れてスタンプを押します。Alt を押すとコピーです" name="overlay-live">



</example>

```vue [TicketOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem, DragMode, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();
const ticket = computed(() => props.items[0]?.item as Ticket);

const state = computed(() => {
  if (props.status === 'dropping') return props.over ? 'landed' : 'back'; // a cancel flies back
  if (!props.over) return 'free';
  return props.accepted ? 'ok' : 'refused';
});
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="ticket-overlay" :data-state="state">
    {{ ticket.title }}
    <span v-if="mode === 'copy'" class="copy">+ copy</span>
  </div>
</template>

<style scoped>
.ticket-overlay { width: 100%; height: 100%; }
.ticket-overlay[data-state='refused'] { background: color-mix(in srgb, #ef4444 8%, Canvas); }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Prop
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
        active
      </code>
    </td>
    
    <td>
      ドラッグ（<code>
        id
      </code>
      
      、<code>
        ids
      </code>
      
      、<code>
        data
      </code>
      
      、<code>
        type
      </code>
      
      …）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        items
      </code>
    </td>
    
    <td>
      ドラッグ中のすべてのアイテム。掴んだものが先頭：<code>
        { id, item, data, type }
      </code>
      
      。並べ替え可能なドラッグでは <code>
        item
      </code>
      
       はリストのアイテムです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      ドラッグの下にあるターゲット。ドロップの着地中は、着地先のターゲット。何もない上と、拒否またはキャンセルされたドラッグが元の位置に戻る間は <code>
        null
      </code>
      
      。並べ替え可能なリストの <code>
        over.id
      </code>
      
       はリストの <code>
        id
      </code>
      
       です：上の列は名前を使っています。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accepted
      </code>
    </td>
    
    <td>
      <code>
        over
      </code>
      
       がドラッグを受け入れるかどうか：受け入れないときはオーバーレイを赤く染めましょう。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      <code>
        'dragging'
      </code>
      
      、着地中は <code>
        'dropping'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        mode
      </code>
    </td>
    
    <td>
      <code>
        'move'
      </code>
      
      、<code>
        'copy'
      </code>
      
      （<code>
        clone
      </code>
      
       を持つリストからのドラッグで Alt を押している、またはパレットからのドラッグ）、<code>
        'swap'
      </code>
      
      、または <code>
        'insert'
      </code>
      
      （通常のドラッグ可能な要素がリストに入る）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        to
      </code>
    </td>
    
    <td>
      今ドロップしたらアイテムが置かれる場所：<code>
        { list, index }
      </code>
      
      、ツリーではさらに <code>
        parentKey
      </code>
      
       と <code>
        depth
      </code>
      
      。どのリストにも置かれない場合は <code>
        null
      </code>
      
      。たとえば通常のターゲットの上です。<a href="#where-the-drop-would-go-to">
        ドロップの行き先
      </a>
      
      を参照。
    </td>
  </tr>
</tbody>
</table>

props の型は `OverlayProps` です。読み取るものだけを宣言してください。コンポーネントはドラッグされるものに渡します。

```ts
import TicketOverlay from './TicketOverlay.vue';

makeSortableList(listRef, { items: tickets, overlay: TicketOverlay });   // every item of the list
makeSortableItem(el, { item: () => props.ticket, overlay: TicketOverlay }); // this item
makeDraggable(el, { id: 'chip', overlay: TicketOverlay });                // a plain draggable
```

コンポーネントはそのまま渡すか、切り替えるなら `shallowRef` に入れて（ドラッグ中でも構いません。オーバーレイはすぐに変わります）、または関数として渡せます。関数は Vue が関数型コンポーネントとして扱います：TSX なら `overlay: (props) => <TicketOverlay {...props} compact />` です。深い `ref` や `reactive` には決して入れないでください。Vue がコンポーネントをリアクティブにして警告を出します。

オーバーレイコンポーネントのルートはボックスを満たすようにしてください（`width: 100%; height: 100%`）。ボックスは枠のサイズを取り、ドロップ時にそれをアニメーションします。ルートに固定サイズを指定すると、代わりにボックスの中でそのサイズが保たれます。

## プロバイダーの `#overlay` スロット

独自のコンポーネントを持たないすべてのドラッグについて、プロバイダーのスロットがオーバーレイを描画します。アプリのルートの隣で一度定義すれば、アプリのすべてのリストとドラッグ可能な要素がそれを使います。ここでは、メモには専用のゴーストを、写真にはクローンを使っています。

<example height="26rem" hint="メモをドラッグしてから、写真をドラッグしてみましょう" name="overlay-slot">



</example>

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, status }">
    <NoteGhost v-if="items[0]?.type.includes('note')" :items="items" :status="status" />
  </template>
</DnDProvider>
```

スロットはオーバーレイコンポーネントと同じ props を受け取ります。何も描画しない場合（上の `v-if`）、ドラッグはクローンにフォールバックします。ドラッグの区別には `type` を使います。並べ替え可能なアイテムの型は、独自に設定していなければ（`makeSortableItem(el, { type })`）グループ名です。

## オーバーレイを変えるターゲット

ドロップターゲットは、自分が受け入れるドラッグが上にある間、オーバーレイに何を表示するかを決められます。`makeDroppable`、リスト、ツリーは `overOverlay` を受け取ります（リストやツリーの `overlay` は自分のアイテム用です）。フォルダーの上では、ドラッグ中のメッセージのチップが、ドロップで行われることの表示に変わります。

<example height="34rem" hint="メッセージを 2 つチェックし、1 つを Archive の上にドラッグして離してみましょう" name="overlay-folders">



</example>

```ts [Folder.vue]
makeDroppable(el, {
  id: () => props.folder.id,
  data: () => props.folder,
  overOverlay: MovePill,
  onDrop: (event) => emit('move', event.active.ids),
});
```

ターゲットのコンポーネントは、ほかのオーバーレイコンポーネントと同じ props（`over` を含む）を受け取り、ドラッグ自身のオーバーレイ（そのコンポーネント、プロバイダーのスロット、またはクローン）をデフォルトスロットとして受け取ります。`MovePill` はスロットを省くので、チップを置き換えます。

```vue [MovePill.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();
// The folder under the drag: its `data`.
const folder = computed(() => props.over?.data as Folder | undefined);
</script>

<template>
  <!-- Fills the box like any overlay component. -->
  <div class="pill-box">
    <span v-if="folder" class="pill">Move {{ items.length }} to {{ folder.name }}</span>
  </div>
</template>
```

`<slot />` を描画すると、ドラッグ自身のオーバーレイを残したまま包めます。上の[オーバーレイコンポーネント](#overlay-components)のボードで Done がしているのがそれです：Done の上では、承認済みのチケットは自身のオーバーレイを保ち、Done がそれにスタンプを押し、ほかの列から来たチケットはドロップされると紙吹雪が舞います。

```ts [Column.vue]
makeSortableList(listRef, {
  items: tickets,
  group: { name: 'release', put },
  overlay: TicketOverlay, // the tickets' own, in every column
  overOverlay: strict ? DoneOverlay : undefined, // Done's, around it
});
```

```vue [DoneOverlay.vue]
<template>
  <div class="done">
    <slot /> <!-- TicketOverlay -->
    <span class="stamp">Shipped</span>
    <span v-if="status === 'dropping' && arrives" class="confetti">…</span>
  </div>
</template>
```

- 表示されるのはターゲットがドラッグを受け入れている間だけで、ドロップがそこに着地する間も残ります。ターゲットを離れると、ドラッグ自身のオーバーレイに戻ります。
- 切り替えはクロスフェードします。その仕方はプロバイダーの `overlayTransition` で決まります：`false` ならすぐに入れ替わり、オブジェクトならコンテンツを囲む `<Transition>` の props です（`name`、`mode`、GSAP や motion 用の JS フック）。`mode: 'out-in'` がないと、一瞬両方が表示されます：`.<name>-leave-active` で去る側に `position: absolute` を付けてください。
- ドロップは紙吹雪を待ちます：着地中のオーバーレイで動いている CSS アニメーションとトランジションは、最後まで再生されます（最長 2 秒）。
- `overlay: false` のドラッグは、どのターゲットの上でもオーバーレイを持ちません。

フォルダーはさらに、ピルを独自の仕方でフォルダーのアイコンの中へ着地させます：ターゲットも `overDropAnimation` を持てます。[アニメーション](https://zizigy.github.io/docs/guides/animations#per-item-and-per-target)を参照。

## ドロップの行き先：`to`

`to` は、今ドロップしたらアイテムがどこに置かれるかをオーバーレイに伝えます。ドロップイベントの `to` が示すのと同じで、リストとその中のインデックス、ツリーではさらに親と深さです。枠が動くと変わります。このサイトメニューのページは、どのセクションの何行目に入るかを表示します。

<example height="27rem" hint="ページをセクションの上にドラッグし、次に横へ動かして深さを変えてみましょう" name="overlay-move-path">



</example>

```vue [MoveOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, DropDestination } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; to: DropDestination | null }>();
const page = computed(() => props.items[0]!.item as MenuNode);
// `parentKey` is the section the page would go into, `null` at the top level.
const where = computed(() => (props.to ? pathOf(menu.value, props.to.parentKey) : null));
</script>

<template>
  <div class="move">
    <div class="row">{{ page.title }}</div>
    <p v-if="to && where" class="where">Move to <b>{{ where }}</b>, row {{ to.index + 1 }}</p>
  </div>
</template>
```

どのターゲットの外でも、`to` は引き続き枠の場所です：デフォルトでは、そこでドロップするとアイテムは枠のある場所に残ります（`dropOutside: 'placeholder'`）。ドロップがアイテムをどのリストにも置かない場合は `null` です：通常のターゲットの上、アイテムを拒否するリストの上、`dropOutside: 'cancel'` または `'remove'` でのターゲットの外です。

## 優先順位

各ドラッグについて、最初に当てはまるものが使われます。

1. ドロップターゲットの `overOverlay`（リストやツリーのものも同じ）。ドラッグがその上にあり、ターゲットがドラッグを受け入れている間。それがなければ表示されたはずのものが、そのデフォルトスロットになります。
2. アイテム自身の `overlay`（`makeSortableItem`、`makeDraggable`）。
3. そのリストまたはツリーの `overlay`。
4. プロバイダーの `#overlay` スロット。ただし何も描画しない場合を除きます。
5. デフォルトのクローン。マルチドラッグでは、クローンの列または山：[マルチドラッグ](https://zizigy.github.io/docs/guides/multi-drag#the-default-overlay)を参照。

ドラッグにそもそもオーバーレイがあるかどうか（`overlay: false`）は、開始時に決まります。どのコンポーネントを表示するかはライブで読み取られます：ドラッグ中に切り替えた ref で入れ替わり、独自のオーバーレイを持つターゲットに入ったり出たりしても入れ替わります。

## `DragPreview`：レイアウト内のクローン

`DragPreview` は、ドラッグ中のアイテム 1 つについて、ライブラリのクローンを描画します。オーバーレイコンポーネントはそれを複数並べたり、1 つに枠を付けたりできます。本をクリックして選んでから、1 冊をドラッグしてみましょう。オーバーレイが実際のクローンを扇状に広げます。

<example height="24rem" hint="選んだ 3 冊のうち 1 冊をドラッグしてみましょう。クリックでほかの本を選べます" name="overlay-fan">



</example>

```vue [FanOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[] }>();
const fan = computed(() =>
  props.items.slice(0, 4).map((entry, index) => ({
    entry,
    angle: index === 0 ? 0 : (index % 2 ? -1 : 1) * Math.ceil(index / 2) * 10,
  })),
);
</script>

<template>
  <div class="fan">
    <div v-for="{ entry, angle } in fan" :key="entry.id" class="card" :style="{ transform: `rotate(${angle}deg)` }">
      <DragPreview :id="entry.id" class="face" :style="{ width: '100%', height: '100%' }">
        <div class="blank" /> <!-- an item without a clone -->
      </DragPreview>
    </div>
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>
```

- クローンが存在するのは、掴んだアイテムと、ドロップ順でその隣にあるほかのアイテム（プロバイダーの `overlayPreviews` の数だけ。デフォルトは 5、`'all'` ならすべて）のうち、持ち上げ時に描画されているものだけです。それ以外のアイテムでは、`DragPreview` はデフォルトスロットを描画します。
- プレビューは持ち上げ時のアイテムのサイズをインラインで持ちます。サイズは、上のように透過的に渡される `style` で変えてください（クラスでは上書きできません）。
- 並べ替え可能なマルチドラッグ（`multiple: 'group'` または `'gaps'`）では、ドロップ時に各プレビューがそれぞれのアイテムの枠に着地します。ラッパーの回転には（`rotate` プロパティではなく）`transform` を使ってください。着地の途中で元に戻されます。アイテムの見た目（角丸、影）は、`class="face"` のようにプレビュー自体に付けてください。ラッパーはボックスの中に残ります。

[マルチドラッグのガイド](https://zizigy.github.io/docs/guides/multi-drag#a-custom-overlay-for-several-items)には、クローンの代わりに件数とタイトルを表示するオーバーレイがあります。

## サイズ：`overlayFit`

サイズの異なるリストの上では、ボックスは着地する枠のサイズを取ります。これはプロバイダーの `overlayFit` で切り替えます。[DnDProvider のページ](https://zizigy.github.io/docs/api/dnd-provider)に、幅の狭いリストと広いリストを使ったデモがあります。

<table>
<thead>
  <tr>
    <th>
      <code>
        overlayFit
      </code>
      
      （プロバイダー）
    </th>
    
    <th>
      ボックス
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'slot'
      </code>
      
      （デフォルト）
    </td>
    
    <td>
      着地する枠のサイズを取り、滑らかに変化します。幅の広いリストの上では広がります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'source'
      </code>
    </td>
    
    <td>
      ドラッグされた要素のサイズを保ちます。
    </td>
  </tr>
</tbody>
</table>

`'slot'` では、ボックスはポインターを中心にサイズが変わり、ポインターはボックスの同じ割合の位置にとどまります。中身が拡大縮小されることはなく、新しいサイズで再レイアウトされるので、そのデモのタスクのような flex の行はどの幅でも正しく見えます。アイテムよりはるかに小さくスタイルされた枠（細いラインなど）では、ボックスはその軸方向には縮みません。

ドロップはどちらの設定でも同じです：ボックスは着地する要素へ飛び、**その要素の**サイズへとアニメーションし、中身は途中で再レイアウトされます。2 つのリストでアイテムの見た目が違う場合（パレットではコンパクトなチップ、ボードでは完全なカード）、元の要素のクローンはターゲットのサイズで再レイアウトされ、そこで潰れたり引き伸ばされたりして見えることがあります。正しく見せる方法は 2 つあります。

- アイテムに**両方のサイズで機能するレイアウト**を与えます。タスクの行のように、または着地しうるすべてのリストで同じサイズにします。
- オーバーレイコンポーネントで**ターゲットの見た目**を描画します。コンポーネントは `over` を受け取るので、上にあるリストの見た目に切り替えられ、どんなサイズでもボックスを満たします。

## 描画先：`overlayTo`

プロバイダーはオーバーレイを `body` にテレポートします。モーダルの `<dialog>`（`showModal()` で開いたもの）はトップレイヤーにあり、`body` 内のすべてより上にあるので、`body` のオーバーレイはその下に隠れてしまいます。`overlayTo` をダイアログ内のセレクターまたは要素に向けてください。[DnDProvider のページ](https://zizigy.github.io/docs/api/dnd-provider#where-the-overlay-renders)に、これがある場合とない場合を試せるダイアログがあります。

```vue [index.vue]
<script setup lang="ts">
const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const open = ref(false);
// While the dialog is open, the overlay renders inside it.
const overlayTo = computed(() => (open.value ? '#columns-dialog' : 'body'));

const show = () => {
  dialog.value?.showModal();
  open.value = true;
};
</script>

<template>
  <DnDProvider :overlay-to="overlayTo">
    <button type="button" @click="show">Edit columns</button>
    <dialog id="columns-dialog" ref="dialog" @close="open = false">
      <ColumnList v-model:columns="columns" />
    </dialog>
  </DnDProvider>
</template>
```

- プロバイダーがオーバーレイを描画するとき（マウント後）、ターゲットはページ内にある必要があります。閉じた `<dialog>` はページ内にあります。隠れているだけです。閉じている間は `body` に戻して、ほかのドラッグのオーバーレイが表示されるようにしてください。
- ボックスは `position: fixed` です。ターゲットやその祖先に `transform`、`filter`、`contain` があると、ビューポートの代わりにそれがボックスの基準になるので、ダイアログには付けないでください。
- クローンのスタイルは表示される場所に合わせて計算されます。shadow root の中では `overlayTo` をその内側に向ければ、クローンは shadow root のスタイルを保ちます。

## オーバーレイなし

`makeDraggable(el, { overlay: false })` にはボックスがまったくありません。要素自体が、返された `transform` によって動きます。

```ts
const { transform } = makeDraggable(el, { overlay: false });
const style = computed(() =>
  transform.value ? { translate: `${transform.value.x}px ${transform.value.y}px` } : undefined,
);
```

[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop#without-an-overlay)を参照してください。ボックスのあるドラッグの着地の仕方は、その `dropAnimation` で決まります：ドロップターゲットのもの（`overDropAnimation`）、アイテムのもの（またはそのリストのもの）、またはプロバイダーのものです。[アニメーション](https://zizigy.github.io/docs/guides/animations#the-drop)を参照。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
