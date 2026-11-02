---
title: "スタイリング"
description: "ドラッグのあらゆる状態にスタイルを——素の CSS 向けの data 属性、クラス向けの ref、受け入れの可否を示すターゲット、ドラッグ中のオーバーレイとページ、デフォルトのスタイル、Tailwind と UI キット。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/styling"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

ライブラリはほとんど何もスタイルを付けません。ドラッグの各状態は 2 つの方法で届きます：素の CSS 向けの `data-dnd-*` 属性と、クラスや条件付きのマークアップ向けにコンポーザブルが返す ref です。スタックに合うほうを、あるいは両方を使ってください。

## data 属性

下の行には状態用のクラスがまったくありません。見た目はすべて属性から来ています。パネルには、ページ上で付いたり外れたりする属性が表示されます。:kbd{value="Ctrl"} か <kbd value="Meta">



</kbd>

 で 2 行を選んでドラッグすると、マルチドラッグのほかのアイテムも現れます。

<example height="25rem" hint="行をドラッグしてから、2 行を Ctrl/⌘ クリックしてドラッグしてみましょう" name="dnd-attributes">



</example>

<table>
<thead>
  <tr>
    <th>
      属性
    </th>
    
    <th>
      付く場所
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
        data-dnd-placeholder
      </code>
    </td>
    
    <td>
      並べ替え可能なアイテム
    </td>
    
    <td>
      ドラッグ中のアイテムが着地する枠であるとき。ドラッグが<a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        アイテムの中のドロップターゲット
      </a>
      
      の上にある間は <code>
        "into"
      </code>
      
      ：ドロップはそちらに入り、枠は位置を保っているだけです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging
      </code>
    </td>
    
    <td>
      並べ替え可能なアイテム
    </td>
    
    <td>
      ドラッグされているが、その場にとどまっているとき：<code>
        'gaps'
      </code>
      
       モードのマルチドラッグのほかのアイテム。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-dragging="pointer"
      </code>
      
       または <code>
        "keyboard"
      </code>
    </td>
    
    <td>
      <code>
        <html>
      </code>
    </td>
    
    <td>
      ドラッグの間ずっと。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay="dragging"
      </code>
      
       または <code>
        "dropping"
      </code>
    </td>
    
    <td>
      オーバーレイのボックス
    </td>
    
    <td>
      常に。着地中と、非同期の <code>
        onBeforeDrop
      </code>
      
       を待っている間は <code>
        dropping
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-overlay-content
      </code>
    </td>
    
    <td>
      オーバーレイのコンテンツ
    </td>
    
    <td>
      常に。ボックスを満たし、表示するものを包む要素。自由にアニメーションできます。プロバイダーの <code>
        overlayClass
      </code>
      
       が付きます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-leaving
      </code>
    </td>
    
    <td>
      <code>
        animateChanges
      </code>
      
       が残すコピー
    </td>
    
    <td>
      去ったアイテムがフェードアウトしている間。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data-dnd-no-clone
      </code>
    </td>
    
    <td>
      <strong>
        あなたが付ける
      </strong>
    </td>
    
    <td>
      要素をオーバーレイのコピーから除外します：ツールチップ、メニュー、バッジ。
    </td>
  </tr>
</tbody>
</table>

```css [TaskRow.vue]
/* The slot a dragged row will land in: a striped gap. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, #42b883 16%, transparent) 0 6px, transparent 6px 12px);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}

/* Selected rows left in place by a multi-drag (`multiple: 'gaps'`). */
.row[data-dnd-dragging] {
  opacity: 0.4;
}

/* The copy in the overlay, while it travels. */
[data-dnd-overlay='dragging'] .row {
  box-shadow: 0 0 0 1.5px #42b883, 0 14px 24px -10px rgb(0 0 0 / 0.55);
}
```

```vue [TaskRow.vue]
<li ref="el" class="row" :aria-selected="selected">
  <span class="title">{{ task.title }}</span>
  <button type="button" data-dnd-no-clone @click.stop="task.done = !task.done">✓</button>
</li>
```

- オーバーレイにある行のコピーは、Vue のスコープ属性も含めてクラスと属性を保つので、`[data-dnd-overlay] .row` は行自身の `<style scoped>` でも機能します。コピーには独自の `data-dnd-*` マークがありません：枠のコピーは枠ではありません。
- 選択には属性がありません。`selected` ref を属性（上の `aria-selected`）に反映させるか、クラスを使ってください。
- 通常のドラッグ可能な要素とドロップターゲット（`makeDraggable`、`makeDroppable`）には `data-dnd-*` の状態属性が付きません。それらの ref でスタイルを付けてください。

## 返される ref

同じ状態が ref としても提供され、さらにリストとターゲットに固有の状態も加わります。下の各行と各リストは、今 true になっている ref を表示し、クラスもそこから来ています。Icebox は緊急のタスクを拒否します。1 つをその上へドラッグしてみましょう。

<example height="24rem" hint="タスクをもう一方のリストへドラッグしてみましょう。Ctrl/⌘ クリックで複数選択できます" name="dnd-refs">



</example>

```vue [RefRow.vue]
<script setup lang="ts">
const { isDragging, isPlaceholder, selected } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row" :class="{ placeholder: isPlaceholder, dragging: isDragging, selected }">…</li>
</template>

<style scoped>
.row.selected { box-shadow: 0 0 0 1.5px #3b82f6; }
.row.placeholder { opacity: 1; box-shadow: inset 0 0 0 1.5px #42b883; }   /* beats the default 40% */
.row.placeholder .title { visibility: hidden; }
</style>
```

```vue [RefList.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(el, { items, group });
</script>

<template>
  <section :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">…</section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      コンポーザブル
    </th>
    
    <th>
      状態
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      、<code>
        isPlaceholder
      </code>
      
      、<code>
        selected
      </code>
      
      、<code>
        indicator
      </code>
      
      、<code>
        index
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
      、<code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      、<code>
        isAccepting
      </code>
      
      、<code>
        indicator
      </code>
      
      、<code>
        activeKey
      </code>
      
      、<code>
        activeIndex
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      、<code>
        selected
      </code>
      
      、<code>
        transform
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      、<code>
        isAccepting
      </code>
      
      、<code>
        placement
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      <code>
        isDragging
      </code>
      
      、<code>
        isAutoScrolling
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD()
      </code>
    </td>
    
    <td>
      <code>
        status
      </code>
      
      、<code>
        active
      </code>
      
      、<code>
        over
      </code>
      
      、<code>
        pointer
      </code>
      
      、<code>
        activation.progress
      </code>
      
      、<code>
        isAutoScrolling
      </code>
    </td>
  </tr>
</tbody>
</table>

- `isPlaceholder`：この要素が、ドラッグ中のアイテムが着地する枠です。`'group'` モードのマルチドラッグでは、一緒に移動するアイテムの枠もプレースホルダーです。
- `isDragging`：アイテムがドラッグの一部です。マルチドラッグでは、ドラッグ中のすべてのアイテムが該当します。
- `isAccepting`：何かがドラッグされていて、このターゲットがそれを受け入れます。ドロップできる場所を強調表示しましょう。
- `isOver`：受け入れるかどうかに関係なく、ドラッグがこのターゲットの上にあります。`isOver && !isAccepting` は拒否です。それを表示しましょう。
- `indicator`：[インジケーターモード](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line)で、ドロップのラインが入る位置。
- `activation.progress`：タッチの長押しや `delay` の間、0 から 1 まで進みます。リングを塗るのに使えます。

## ドロップターゲット：受け入れと拒否

ドラッグ中、ターゲットには 4 つの見た目があります：ドラッグを受け入れる、受け入れてポインターが上にある、拒否する、拒否してポインターが上にある。4 つすべてを表示し、ドラッグ中のアイテムでもそれを伝えましょう。

<example height="23rem" hint="色をパレットの上へドラッグしてみましょう。合うパレットは招き入れ、ほかは受け入れません" name="drop-highlights">



</example>

```ts [Palette.vue]
const { isOver, isAccepting } = makeDroppable(el, { accept: props.tone, onDrop });

const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
```

```css [Palette.vue]
.palette.accepting { border-style: dashed; border-color: #42b883; }          /* an invitation */
.palette.over { border-color: #42b883; background: color-mix(in srgb, #42b883 14%, Canvas); }
.palette.refusing { opacity: 0.45; }                                          /* out of the way */
.palette.refused { border-color: #f43f5e; animation: shake 0.3s; }            /* a drop here is cancelled */
```

ドラッグ中の色見本はプロバイダーの `#overlay` スロットです。スロットは `over` と `accepted` を受け取ります。ドラッグを拒否するターゲットの上では `accepted` は `false` です。

```vue [index.vue]
<template #overlay="{ active, over, accepted }">
  <div
    class="lifted"
    :class="{ yes: over && accepted, no: over && !accepted }"
    :style="{ background: (active.data as { color: string }).color }"
  >
    <span v-if="over" class="badge">{{ accepted ? '+' : '✕' }}</span>
  </div>
</template>
```

オーバーレイの外では、`useDnD().over.value?.accepted` が同じことを伝えます。オーバーレイコンポーネントについて詳しくは[オーバーレイ](https://zizigy.github.io/docs/guides/overlay)を参照してください。

## オーバーレイとページ

ドラッグの残りは 2 つの属性でカバーできます：オーバーレイのボックスの `data-dnd-overlay` と、`<html>` の `data-dnd-dragging`（`"pointer"` または `"keyboard"`）です。メモの上のバーは 2 つ目を読み取り、どのキーが使えるかを表示します。遅い保存をオンにしてみましょう。オーバーレイは `onBeforeDrop` が解決するまで離した場所で `dropping` のままになり、それを表示します。

<example height="27rem" hint="メモをマウスで、次にキーボードでドラッグし、遅い保存をオンにしてみましょう" name="overlay-theme">



</example>

```css [index.vue]
.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle { display: none; }

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard { display: inline; }
```

```css [StickyNote.vue]
[data-dnd-overlay='dragging'] .note {
  box-shadow: 0 0 0 2px #42b883, 0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save. */
[data-dnd-overlay='dropping'] .note { opacity: 0.85; }
[data-dnd-overlay='dropping'] .saving { display: flex; }
```

- `dropping` は、着地と非同期の `onBeforeDrop` の待機の両方をカバーします。待機中、`<html>` はドラッグモードを抜けます。ページのカーソルとテキスト選択が戻るので、確認ダイアログはいつもどおり動作します。
- ボックスの**中身**にスタイルを当ててください。ボックス自体はライブラリが `transform` で動かし、`width` と `height` でサイズを決めます。そのコンテンツ要素 `[data-dnd-overlay-content]` はボックスを満たしていて、自由に使えます：オーバーレイ全体の持ち上げや傾きはここで付けてください（[アニメーション](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)を参照）。
- コピーのルートにはインラインで `transform: none` が付いています。回転や拡大には `rotate` と `scale` を使ってください。トランジションとキーフレームのどちらも動作します：[アニメーション](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)を参照。
- コピーは要素をそのまま表示し、背景を推測しません。リストが背景を塗っている行（白い `<ul>` の中の `<li>`、テーブルの行）には背景が必要です：`[data-dnd-overlay] .row { background: Canvas; }`。
- コピーは、要素が継承していたカスタムプロパティ（テーマの色、`--tw-*`）を持つ `<div>` の中に置かれます。そのためオーバーレイの中でもそれらが適用され、コピー自身のルール（`in-data-[dnd-overlay]:ring-2`）は引き続きそれらに勝ちます。コピーは、ボックス内での深さではなくクラスで選択してください。

## デフォルトのスタイル

プロバイダーは、ドキュメントごとに一度、いくつかのルールを挿入します。それらは `:where()` で囲まれているので詳細度はゼロで、あなたのどんなルールも優先されます。

```css
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
:where(html[data-dnd-dragging]), :where(html[data-dnd-dragging] *) {
  user-select: none !important;
  overflow-anchor: none !important;
}
:where(html[data-dnd-dragging='pointer']), :where(html[data-dnd-dragging='pointer'] *) {
  cursor: var(--dnd-cursor, grabbing) !important;
  -webkit-touch-callout: none !important;
}
```

<table>
<thead>
  <tr>
    <th>
      ルール
    </th>
    
    <th>
      理由
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      枠を 40% に
    </td>
    
    <td>
      CSS がまったくなくてもリストが正しく見えるように。上のデモはすべてこれを上書きしています。
    </td>
  </tr>
  
  <tr>
    <td>
      残されたアイテムを 40% に
    </td>
    
    <td>
      同じく、<code>
        'gaps'
      </code>
      
       モードのマルチドラッグ用。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        user-select
      </code>
      
       なし
    </td>
    
    <td>
      ドラッグが通過したテキストを選択しないように。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overflow-anchor
      </code>
      
       なし
    </td>
    
    <td>
      動いている行を表示し続けるためにページがスクロールしないように。
    </td>
  </tr>
  
  <tr>
    <td>
      ドラッグのカーソル
    </td>
    
    <td>
      ポインタードラッグ中、どこでも。<code>
        grabbing
      </code>
      
       ですが、掴んだ要素が独自のカーソルを持つ場合は別です：リサイズハンドルの <code>
        ns-resize
      </code>
      
      、<code>
        move
      </code>
      
      、画像はドラッグ中ずっと自分のカーソルを保ちます（<code>
        grab
      </code>
      
      、<code>
        pointer
      </code>
      
       などはやはり <code>
        grabbing
      </code>
      
       になります）。ドラッグ可能なアイテムの <code>
        cursor: grab
      </code>
      
       はあなたが付けてください。別のデフォルトにするには <code>
        <html>
      </code>
      
       に <code>
        --dnd-cursor
      </code>
      
       を設定します。
    </td>
  </tr>
  
  <tr>
    <td>
      タッチのコールアウトなし
    </td>
    
    <td>
      iOS が長押しでリンクのメニューを開かないように。
    </td>
  </tr>
</tbody>
</table>

プロバイダーに `:default-styles="false"` を指定すると、これらは挿入されません。ライブラリは引き続き `<html>` にマークを付け、ドラッグ開始時にテキストの選択を解除し、ドラッグが終わるまで新たな選択を防ぎます。なくなるのは CSS だけです。ルールは、それを求める最初のプロバイダーによって一度だけ挿入され、残り続けます。ページのすべてのプロバイダーでオフにしてください。

```vue
<DnDProvider :default-styles="false">
```

## Tailwind CSS

属性はバリアントとして使えます。要素自身には `data-[…]`、祖先には任意のバリアントを使います。

```vue [TaskRow.vue]
<li
  ref="el"
  class="rounded-lg bg-white shadow-sm
         data-[dnd-placeholder]:bg-transparent data-[dnd-placeholder]:opacity-100
         data-[dnd-placeholder]:outline-dashed
         [[data-dnd-overlay=dragging]_&]:shadow-xl"
  :class="{ 'ring-2 ring-emerald-500': selected }"
>
```

```vue [Hint.vue]
<p class="hidden [html[data-dnd-dragging=keyboard]_&]:block">Arrows move · Space drops</p>
```

<note>

ライブラリの見た目（40% の不透明度）は、ほかのどれよりも先に宣言された独自のカスケードレイヤー `vue-dnd-kit` にあります。Tailwind v4 のユーティリティとそれをベースにした UI キットもレイヤーにあり、そのレイヤーは後に来るので、`!` なしで優先されます。レイヤーに属さない CSS はいずれにせよ優先されます。

</note>

Tailwind v4 では、`in-data-[dnd-overlay=dragging]:shadow-xl` が祖先バリアントの短い書き方です。

<warning>

Vue のスコープ付き CSS では、`:global()` はセレクター全体を取ります：`:global(html[data-dnd-dragging]) .hint` は `html[data-dnd-dragging]` だけにコンパイルされ、ページを隠してしまいます。祖先は `:global()` なしで `html[data-dnd-dragging] .hint` と書いてください：Vue がスコープを付けるのは最後の部分だけです。

</warning>

## UI キット

- コンポーザブルは要素だけでなくコンポーネントも受け取ります。キットのカードやリストアイテムに `useTemplateRef` を使えば、ライブラリはそのルート要素を読み取ります。
- キットに対応する props があれば状態をそこに渡し（`:active="selected"`、`:color="isOver ? 'primary' : undefined"`）、残りはクラスとして渡します。
- キットのリストアイテムは、たいてい自身の背景を持たず、リストが背景を塗っています。そのため、オーバーレイ内のコピーは透けてしまいます。背景を与えてください。```css
[data-dnd-overlay] .v-list-item { background: rgb(var(--v-theme-surface)); }
```
- コピーは Vuetify、Quasar、PrimeVue、Naive UI の押下リップルを除外します。そのほか運ばれるべきでないもの（ツールチップやメニューボタン）には `data-dnd-no-clone` を付けてください。

## やってはいけないこと

- 並べ替え可能なアイテムの `transform` や `translate` に CSS の `transition` を付けないでください。ライブラリが自分でアニメーションし、測定中はそうしたトランジションをキャンセルします。
- 並べ替え可能なアイテムを `<TransitionGroup>` で囲まないでください。移動が二重にアニメーションします。リストの `animateChanges` を使ってください。
- [仮想リスト](/docs/guides/virtual-lists)の行の `height`、`margin`、`padding` をアニメーションしないでください。
- ドラッグに関連して追加したトランジションは、`prefers-reduced-motion: reduce` では必ず止めてください。ライブラリは自身のものをすでに止めています。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
