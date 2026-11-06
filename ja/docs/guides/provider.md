---
title: "プロバイダー"
description: "DnDProvider は配下のすべてのドラッグを管理します。ターゲットを見つけ、ドラッグを開始し、スクロールし、起きたことをすべて useDnD と useDnDMonitor に伝えます。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## アプリにプロバイダーを 1 つ

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider>
    <RouterView />
  </DnDProvider>
</template>
```

`DnDProvider` を `App.vue` やレイアウトなど上位の階層に 1 つ置けば、あとは気にする必要はありません。すべてのコンポーザブル（`makeSortableList`、`makeDraggable`、`useDnD`…）は、自分が実行されるコンポーネントより上にある最も近いプロバイダーを探します。

<warning>

コンポーザブルは、プロバイダーの**内側に描画される**コンポーネントで実行する必要があります。自身のテンプレートに `<DnDProvider>` を含むコンポーネントで呼び出すと、`No <DnDProvider> found above this component` がスローされます。Vue の `inject` は祖先しか参照できないためです。

</warning>

## プロバイダーが管理するもの

<table>
<thead>
  <tr>
    <th>
      パーツ
    </th>
    
    <th>
      プロバイダーの役割
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      入力
    </td>
    
    <td>
      ポインター・タッチ・キーボードの入力をドラッグに変換します（<code>
        sensors
      </code>
      
      、<code>
        activation
      </code>
      
      ）。ドラッグは一度に 1 つだけです。
    </td>
  </tr>
  
  <tr>
    <td>
      ターゲットの検出
    </td>
    
    <td>
      ドラッグの下にあるドロップターゲットをヒットテストし（<code>
        collision
      </code>
      
      ）、それらに通知します。
    </td>
  </tr>
  
  <tr>
    <td>
      オーバーレイ
    </td>
    
    <td>
      ポインターに追従するボックスを <code>
        body
      </code>
      
       にテレポートして描画し、ドロップ時に着地させます。
    </td>
  </tr>
  
  <tr>
    <td>
      選択
    </td>
    
    <td>
      選択中の id の集合を 1 つ持ち、配下のすべてのリストとドラッグ可能な要素で共有します。
    </td>
  </tr>
  
  <tr>
    <td>
      自動スクロール
    </td>
    
    <td>
      ドラッグが端に近づくと、コンテナーやウィンドウをスクロールします。
    </td>
  </tr>
  
  <tr>
    <td>
      ライブリージョン
    </td>
    
    <td>
      持ち上げ、移動、ドロップ、キャンセルをスクリーンリーダーに読み上げます。
    </td>
  </tr>
</tbody>
</table>

それ以外は何も描画しません。マークアップはそのままです。

## オプションの概要

どのオプションにもそのまま使えるデフォルトがあるので、プロバイダーには通常何も渡しません。プロバイダーは props を必要になった時点で読み取ります。下のデモでは `collision`、`activation`、`autoScroll` をその場で切り替えています。

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      デフォルト
    </th>
    
    <th>
      設定する内容
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        collision
      </code>
    </td>
    
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      ドラッグの下のターゲットをどう選ぶか。<a href="#finding-the-target">
        後述
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      マウス 4 px、タッチ 200 ms
    </td>
    
    <td>
      押下がいつドラッグになるか。ポインターの種類ごと。<a href="#when-a-press-becomes-a-drag">
        後述
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      オン
    </td>
    
    <td>
      端でのスクロール：<code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       または <code>
        false
      </code>
      
      。<a href="#auto-scroll">
        後述
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        haptics
      </code>
    </td>
    
    <td>
      タッチで持ち上げたときの短い振動
    </td>
    
    <td>
      タッチドラッグの振動、または <code>
        false
      </code>
      
      。<a href="#haptics-and-the-copy-key">
        後述
      </a>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        copyModifier
      </code>
    </td>
    
    <td>
      <code>
        'Alt'
      </code>
    </td>
    
    <td>
      ドラッグ中に押していると、移動がコピーになるキー。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      すべてのドラッグに適用する移動のルール：<a href="/docs/guides/constraints">
        制約
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animation
      </code>
      
       / <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      オン
    </td>
    
    <td>
      並べ替え中にアイテムがスライドする動き / オーバーレイの着地：<a href="/docs/guides/animations">
        アニメーション
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      オフ
    </td>
    
    <td>
      リストとツリーのデフォルト：ドラッグ以外によるデータの変化をアニメーションします。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      Space / Enter、Escape
    </td>
    
    <td>
      キーボードのキーとステップ。<code>
        false
      </code>
      
       でキーボードドラッグをオフにします。<a href="/docs/guides/accessibility#the-keyboard">
        アクセシビリティ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sensors
      </code>
    </td>
    
    <td>
      ポインター + キーボード
    </td>
    
    <td>
      入力をドラッグに変換するもの：<a href="/docs/guides/sensors">
        センサー
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTo
      </code>
    </td>
    
    <td>
      <code>
        'body'
      </code>
    </td>
    
    <td>
      オーバーレイのテレポート先。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayFit
      </code>
    </td>
    
    <td>
      <code>
        'slot'
      </code>
    </td>
    
    <td>
      オーバーレイのサイズ：着地する枠のサイズか、元の要素のサイズか。<a href="/docs/guides/overlay">
        オーバーレイ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayTransition
      </code>
    </td>
    
    <td>
      クロスフェード
    </td>
    
    <td>
      ドラッグ中にオーバーレイがあるコンポーネントから別のコンポーネントへ変わる仕方：<code>
        false
      </code>
      
      、または <code>
        <Transition>
      </code>
      
       の props。<a href="/docs/guides/overlay#targets-that-change-the-overlay">
        オーバーレイを変えるターゲット
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayClass
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      オーバーレイのコンテンツ（<code>
        [data-dnd-overlay-content]
      </code>
      
      ）に付けるクラス。全体としてアニメーションさせる要素です：ドラッグで持ち上げるときに浮かせ、着地するときに落ち着かせます。<a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        オーバーレイ：持ち上げ、傾け、落ち着かせる
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayPreviews
      </code>
    </td>
    
    <td>
      <code>
        5
      </code>
    </td>
    
    <td>
      マルチドラッグ：持ち上げた時点でクローンを作る、ドラッグ中のアイテムの数、または <code>
        'all'
      </code>
      
      。<a href="/docs/guides/multi-drag#the-default-overlay">
        デフォルトのオーバーレイ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        announcements
      </code>
    </td>
    
    <td>
      組み込み
    </td>
    
    <td>
      スクリーンリーダー向けのテキスト、または <code>
        false
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        screenReaderInstructions
      </code>
    </td>
    
    <td>
      組み込み
    </td>
    
    <td>
      すべてのドラッグ可能な要素が <code>
        aria-describedby
      </code>
      
       で参照するテキスト。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defaultStyles
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      ドラッグの状態用に詳細度ゼロの CSS を挿入します：<a href="/docs/guides/styling">
        スタイリング
      </a>
      
      を参照。
    </td>
  </tr>
</tbody>
</table>

すべての型を含む完全な一覧は [DnDProvider API](https://zizigy.github.io/docs/api/dnd-provider) にあります。プロバイダーは `drag-start`、`drag-move`、`drag-over`、`drag-end`、`drag-cancel`、`drag-resume`、`drag-settle` も発行します。`useDnDMonitor` が受け取るのと同じイベントです。

## ドラッグを読み取る：`useDnD()`

<example height="27rem" hint="タスクをドラッグして、状態の変化を見てみましょう" name="provider-state">



</example>

`useDnD()` はドラッグをリアクティブな状態として返します。プロバイダー配下のどのコンポーネントでも使えます。

```ts
import { useDnD } from '@vue-dnd-kit/core';

const { status, active, over, pointer, activation, isAutoScrolling, selection, cancel } = useDnD();
```

<table>
<thead>
  <tr>
    <th>
      フィールド
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
        status
      </code>
    </td>
    
    <td>
      <code>
        'idle'
      </code>
      
      、<code>
        'activating'
      </code>
      
      （押下がアクティベーションを待っている）、<code>
        'dragging'
      </code>
      
      、<code>
        'dropping'
      </code>
      
      （ドラッグは実行されていないが、オーバーレイがまだ着地中、または非同期の <code>
        onBeforeDrop
      </code>
      
       が判断中）、<code>
        'selecting'
      </code>
      
      （範囲選択中）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
    </td>
    
    <td>
      ドラッグされているもの：<code>
        id
      </code>
      
      、<code>
        ids
      </code>
      
      （ドラッグ中のすべての id。掴んだものが先頭）、<code>
        items
      </code>
      
      、<code>
        data
      </code>
      
      、<code>
        type
      </code>
      
      、<code>
        element
      </code>
      
      、<code>
        rect
      </code>
      
      、<code>
        sensor
      </code>
      
      。アイドル時は <code>
        null
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
    </td>
    
    <td>
      ドラッグの下にあるターゲット：<code>
        id
      </code>
      
      、<code>
        data
      </code>
      
      、<code>
        element
      </code>
      
      、<code>
        rect
      </code>
      
      、<code>
        accepted
      </code>
      
      。何もない上では <code>
        null
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer
      </code>
    </td>
    
    <td>
      ビューポート座標でのポインター位置。モディファイア適用後の値です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.progress
      </code>
    </td>
    
    <td>
      押下がアクティベーションを待っている間、<code>
        0
      </code>
      
       から <code>
        1
      </code>
      
       まで進みます。リングを描くのに使えます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoScrolling
      </code>
    </td>
    
    <td>
      自動スクロールが何かを動かしています。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      プロバイダーの選択：<code>
        ids
      </code>
      
      、<code>
        has
      </code>
      
      、<code>
        add
      </code>
      
      、<code>
        delete
      </code>
      
      、<code>
        toggle
      </code>
      
      、<code>
        set
      </code>
      
      、<code>
        clear
      </code>
      
      。<a href="/docs/guides/multi-drag">
        マルチドラッグ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      実行中のドラッグ（アイテムは元の位置に戻ります）、チャージ中の押下、または範囲選択をキャンセルします。
    </td>
  </tr>
</tbody>
</table>

```vue [DropHint.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';

const { status, over } = useDnD();
const refused = computed(() => status.value === 'dragging' && over.value?.accepted === false);
</script>

<template>
  <p v-if="refused" role="status">This list doesn't take that.</p>
</template>
```

ドロップが確定した時点で、オーバーレイがまだ着地中でも（`status` は `'dropping'`）、`active`、`over`、`pointer` は `null` になります。これらから派生した UI が、古いドラッグを新しいデータと並べて表示することはありません。非同期の `onBeforeDrop` を待っている間は、状態は離した時点のまま保たれます。

次のドラッグは着地を待ちません：すぐに始まり、直前のオーバーレイがその周りで着地している間、`status` は `'dragging'` です。着地中のオーバーレイを押すと、飛んでいる途中で捕まえられます：ドラッグはオーバーレイのいる位置から続きます。ドラッグのオーバーレイが落ち着いたことは `onDragSettle` が知らせます。

## すべてのドラッグを監視する：`useDnDMonitor()`

```ts
import { useDnDMonitor } from '@vue-dnd-kit/core';

useDnDMonitor({
  onDragStart: ({ active }) => {},
  onDragMove: ({ pointer, delta }) => {},
  onDragOver: ({ over }) => {},                  // the target changed
  onBeforeDrop: (e) => 'accept',                 // or 'reject', 'continue', some ids; may be async
  onDragEnd: ({ active, over, dropped, accepted, position }) => {},
  onDragCancel: ({ active }) => {},
  onDragResume: ({ active }) => {},              // onBeforeDrop answered 'continue'
  onDragSettle: ({ active, over }) => {},        // its overlay has landed
});
```

モニターは、どこで始まったかに関係なく、プロバイダー配下のすべてのドラッグを受け取ります。上のパネルはリストをインポートせずに、そのリストのドラッグを記録しています。モニターは、呼び出したコンポーネントがアンマウントされると停止します。

<table>
<thead>
  <tr>
    <th>
      イベント
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
        onDragStart
      </code>
    </td>
    
    <td>
      ドラッグが始まったとき。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragMove
      </code>
    </td>
    
    <td>
      ドラッグが動いたとき。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      ドラッグの下のターゲットが変わったとき。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      ドラッグが離されたとき。その答えがドロップを決めます：<a href="/docs/guides/drop-decisions">
        ドロップの判断
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      ドロップが成立したとき。並べ替え可能なリストはすでに自身の <code>
        onDrop
      </code>
      
       を実行し、新しい順序を書き込んでいます。どのターゲットの上でもなく終わった場合、<code>
        dropped
      </code>
      
       は <code>
        false
      </code>
      
       です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      Escape、受け入れないターゲットへのドロップ、または <code>
        onBeforeDrop
      </code>
      
       が <code>
        'reject'
      </code>
      
       を返したとき。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragResume
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       が <code>
        'continue'
      </code>
      
       を返したとき：何もドロップされず、ドラッグが続きます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragSettle
      </code>
    </td>
    
    <td>
      ドラッグのオーバーレイが着地したとき（または元の位置に戻ったとき、次のドラッグに捕まえられたとき）。<code>
        onDragEnd
      </code>
      
       または <code>
        onDragCancel
      </code>
      
       が受け取ったイベントが渡されます。その間にほかのドラッグが始まっていることもあります。
    </td>
  </tr>
</tbody>
</table>

どのイベントも `active`、`over`、`pointer`、`delta`（開始位置からのオフセット）、`position`（ドラッグ中のボックスが `over` の中のどこにあるか。[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped)を参照）を持ち、並べ替え可能なリストのアイテムなら `source` も持ちます。完全な型は [イベント API](https://zizigy.github.io/docs/api/events) にあります。

<note>

「ドロップの後」の処理は `onDragEnd` で行います：保存、選択の解除、アナリティクスなど。リスト自身の `onDrop` は書き込みの**前**に実行されるので、まだ古い順序が見えます。

</note>

## ターゲットの検出

関数を選び、ピンやカードをターゲットの上へドラッグしてみましょう。バッジはそのフレームで関数がターゲットをどう順位付けしたかを示し、緑のものがターゲットです。

<example height="33rem" hint="関数を切り替え、入れ子の・小さい・重なったターゲットの上をドラッグしてみましょう" name="collision-lab">



</example>

ドラッグの各フレームで、プロバイダーは対象となるドロップターゲットを `collision` に渡し、`collision` はそれらの id を良い順に返します。ライブラリには 5 つの関数が付属しています。

<table>
<thead>
  <tr>
    <th>
      関数
    </th>
    
    <th>
      順位付けの対象
    </th>
    
    <th>
      向いている用途
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      ポインターの下にあるもの。何もなければ、ドラッグ中のボックスが重なっているもの。
    </td>
    
    <td>
      デフォルト：ポインターの下では正確で、隙間では寛容です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      ポインターの下にあるものだけ。最も内側のものが先頭。
    </td>
    
    <td>
      正確なターゲット：隙間ではどこにもドロップされません。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      ドラッグ中のボックスが重なっているすべてのターゲット：<code>
        priority
      </code>
      
       が高い順、次にネストが深い順、次に重なりが大きい順。
    </td>
    
    <td>
      小さなターゲットの上の大きなアイテムで、ポインターがアイテムの端にある場合。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      すべてのターゲット。ボックスの中心からターゲットの中心までの距離順。
    </td>
    
    <td>
      遠くても必ずどれかが選ばれます：グリッドや同じサイズのアイテムのリスト。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      すべてのターゲット。4 つの角の間の距離順。
    </td>
    
    <td>
      横に並んだ列（カンバン）や、高さが大きく異なるターゲット。
    </td>
  </tr>
</tbody>
</table>

ポインターの下では、ヒットテストはユーザーに見えているものに従います。重なったターゲットのうちヒットするのは一番上のものだけで（重なった部分では `front` であり、`back` にはなりません）、入れ子のターゲットでは最も内側のものが先頭になります（`subfolder`、次に `folder`）。

### 独自の関数

```ts [magnet.ts]
import type { CollisionDetection, Coordinates, Rect } from '@vue-dnd-kit/core';

/** How far the point is from the rect: 0 inside it. */
const gap = (rect: Rect, point: Coordinates) =>
  Math.hypot(
    Math.max(rect.left - point.x, 0, point.x - rect.right),
    Math.max(rect.top - point.y, 0, point.y - rect.bottom),
  );

/** What is under the pointer; in a gap, the nearest target within 40px. */
export const magnet: CollisionDetection = ({ hits, pointer, candidates }) => {
  if (hits.length) return hits;
  return candidates
    .filter((candidate) => gap(candidate.rect, pointer) <= 40)
    .sort((a, b) => gap(a.rect, pointer) - gap(b.rect, pointer))
    .map((candidate) => candidate.id);
};
```

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
        pointer
      </code>
    </td>
    
    <td>
      ポインター。モディファイア適用後の値です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      表示されている状態のドラッグ中のボックス。オーバーレイがなければ <code>
        null
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        candidates
      </code>
    </td>
    
    <td>
      対象となるすべてのターゲット：<code>
        id
      </code>
      
      、<code>
        rect
      </code>
      
      （スクロールコンテナーで切り取られた、見えている部分）、<code>
        priority
      </code>
      
      、<code>
        depth
      </code>
      
      （最上位で <code>
        0
      </code>
      
      、ネストが深いほど大きい）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hits
      </code>
    </td>
    
    <td>
      ヒットテストで得られた、ポインターの下にあるターゲット。良い順。
    </td>
  </tr>
</tbody>
</table>

「ターゲットなし」にするには空の配列を返します。無効なターゲット、ドラッグ中のアイテムの内側にあるターゲット、スクロールコンテナーに隠れているターゲットは、関数に渡されません。ドラッグを受け入れないターゲットも候補には残ります。その上では `over.accepted` が `false` になり、ドロップは拒否されます（並べ替え可能なアイテムの内側にあるターゲットは代わりに道を譲り、リストがその上で並べ替えられます）。デモでは選んだ関数をラップして順位を記録しています：`(args) => (ranked.value = detect(args))`。

<note>

プロバイダーは、関数が求める切り替えを抑制します。ドラッグが離れたばかりのターゲットは、ポインターが 10 px 動くまで再び選ばれないため、境界でちらつきません。同じ親の中に入れ子になったターゲットの間（カードの列の隙間）では、直前のターゲットが維持されます。

</note>

## 押下がドラッグになるとき

押してもすぐにはドラッグになりません。`activation` は、ポインターの種類（`mouse`、`touch`、`pen`）ごとに何を待つかを設定します：px 単位の `distance`、ms 単位の `delay`（`tolerance` を超えると押下は中止され、ページをスクロールできます）、またはその両方のうち先に満たされたほうです。

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 300, tolerance: 8 } }">
```

<table>
<thead>
  <tr>
    <th>
      ポインター
    </th>
    
    <th>
      デフォルト
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        mouse
      </code>
      
      、<code>
        pen
      </code>
    </td>
    
    <td>
      <code>
        { distance: 4 }
      </code>
      
      ：クリックはクリックのままです。<code>
        handle
      </code>
      
       上でのマウスの押下はすぐに始まり、動かさなければクリックのままです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        touch
      </code>
    </td>
    
    <td>
      <code>
        { delay: 200, tolerance: 5 }
      </code>
      
      ：長押しです。指の下のリストはスクロールできたままになります。
    </td>
  </tr>
</tbody>
</table>

指定しなかった種類はデフォルトのままです。ドラッグ可能な要素自身の `activation` は[ドラッグエリア](https://zizigy.github.io/docs/guides/constraints)のものより優先され、ドラッグエリアのものはプロバイダーのものより優先されます。押下が待っている間、`useDnD().status` は `'activating'` で、`activation.progress` は `0` から `1` まで進みます。Escape または `useDnD().cancel()` で中止できます。制約をその場で試したり、進捗から長押しのリングを描いたりする方法は[センサー](https://zizigy.github.io/docs/guides/sensors#activation-constraints)にあります。

## 自動スクロール

チャンネルをリストの上端や下端に向かってドラッグしてみましょう。緑の帯が端のゾーンで、奥に入るほどリストが速くスクロールします。

<example height="37.5rem" hint="チャンネルを緑の帯にドラッグしてみましょう" name="auto-scroll-edges">



</example>

`overflow: auto` または `scroll` の要素はすべて自動でスクロールし、ウィンドウも同様です。プロバイダーはまずポインターの下のコンテナーをスクロールし、次にその祖先、最後にウィンドウをスクロールします。

<table>
<thead>
  <tr>
    <th>
      オプション
    </th>
    
    <th>
      デフォルト
    </th>
    
    <th>
      設定する内容
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        0.2
      </code>
    </td>
    
    <td>
      端のゾーン。コンテナーのサイズに対する割合で、24〜96 px の範囲です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        acceleration
      </code>
    </td>
    
    <td>
      <code>
        10
      </code>
    </td>
    
    <td>
      一番端での速度（px/フレーム）。ゾーンに入った深さの 2 乗で大きくなるので、出だしはゆっくりで正確です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSpeed
      </code>
    </td>
    
    <td>
      <code>
        25
      </code>
    </td>
    
    <td>
      最高速度。端を越えても（ポインターがコンテナーの外にあっても）、速度はこの値まで上がり続けます。
    </td>
  </tr>
</tbody>
</table>

`:auto-scroll="false"` でオフになります。ある方向へのスクロールは、ポインターがその方向に動いてから始まるので、端の近くで持ち上げたアイテムが勝手にスクロールすることはありません。リスト、ツリー、[ドラッグエリア](https://zizigy.github.io/docs/guides/constraints)は、自身のコンテナー用に独自の `autoScroll` を受け取ります。

```ts
makeSortableList(list, { items: channels, autoScroll: { maxSpeed: 10 } });
```

キーボードドラッグは自動スクロールしません。代わりにアイテムが見える位置までスクロールします。何かがスクロールしている間、`isAutoScrolling`（`useDnD()` またはドラッグエリアから取得）は `true` です。

## 触覚フィードバックとコピーキー

タッチドラッグは開始時に短く振動します。`:haptics="false"` でオフになり、オブジェクトを渡すと振動ごとに設定できます。

```vue
<DnDProvider :haptics="{ start: true, enter: 10, drop: 10, refuse: [20, 40, 20] }">
```

<table>
<thead>
  <tr>
    <th>
      キー
    </th>
    
    <th>
      振動するタイミング
    </th>
    
    <th>
      デフォルト
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        start
      </code>
    </td>
    
    <td>
      長押しがドラッグになったとき。
    </td>
    
    <td>
      <code>
        true
      </code>
      
      （10 ms）
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      ドラッグを受け入れるターゲットに入ったとき。
    </td>
    
    <td>
      オフ
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      ドロップが成立したとき。
    </td>
    
    <td>
      オフ
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        refuse
      </code>
    </td>
    
    <td>
      ドロップが拒否され、アイテムが元の位置に戻るとき。
    </td>
    
    <td>
      オフ
    </td>
  </tr>
</tbody>
</table>

それぞれ `true`（デフォルトのパターン）、ms 単位の長さ、オン/オフのパターン、または `false` を受け取ります。振動するのはタッチで始まったドラッグだけで、iOS Safari はまったく振動できません。

`copyModifier` は、リスト間のドラッグ中に押していると移動がコピーになるキーです。デフォルトは `'Alt'` で、任意の `KeyboardEvent.key`、またはなしにする `null` を指定できます。アイテムの移動元のリストには `clone` 関数が必要です。[アイテムを共有するリスト](https://zizigy.github.io/docs/guides/shared-lists)を参照してください。

## 複数のプロバイダー

ほとんどのアプリに必要なのはちょうど 1 つです。ウィッシュリストを専用のプロバイダーの下に置いてから、本を向こうへ移動してみましょう。本は自分のプロバイダーから出られず、外側のモニターにはウィッシュリストのドラッグが届かなくなります。

<example height="33.5rem" hint="本を向こうへ移動してから、ウィッシュリストに専用のプロバイダーを与えてみましょう" name="provider-nested">



</example>

```vue
<DnDProvider>
  <Shelf v-model="reading" />
  <DnDProvider>
    <Shelf v-model="wishlist" />
    <EventLog />            <!-- hears the inner provider's drags only -->
  </DnDProvider>
</DnDProvider>
```

- プロバイダーは互いに独立しています。ドラッグが一方から他方へ渡ることはありません。
- プロバイダーのネストは可能です。**最も近い所有者が優先されます**：アイテムはその上にある最も近いプロバイダーに属し、外側のプロバイダーはそれを無視します。
- 各プロバイダーは独自の選択、オーバーレイ、ライブリージョン、モニターを持ちます。

2 つ目のプロバイダーが意味を持つのは、ページの一部がプロバイダー全体に関わる独自の設定（衝突判定、キーボードのキー、読み上げ）を必要とし、かつそのアイテムがそこから出ない場合だけです。ページの 2 つの部分の間でアイテムを移動できないときは、それらが 2 つのプロバイダーの下にないか確認してください。

<tip>

ページの一部に対するルール（スナップするボード、タッチの押下が長いフィード、何もドラッグできないパネル）には、専用のプロバイダーは必要ありません。

```ts
makeDragArea(board, { modifiers: [snapToGrid(20)], activation: { touch: { delay: 400 } } });
```

そのアイテムはアプリのプロバイダーに属したままで、どこへでも移動できます。[制約](https://zizigy.github.io/docs/guides/constraints)を参照してください。

</tip>

別の場所にマウントされたアプリ（shadow root の中や、別の Vue アプリ）も、既存のプロバイダーに参加できます。マウントする前に `useDnDContext()` を `provideDnDContext(app, context)` に渡してください。ヒットテストとオーバーレイは shadow root をまたいで動作します。

## アプリのほかのウィンドウ

アプリは自身の一部を別のウィンドウに表示することがあります：`window.open` で開くポップアップ、切り離したパネル、Document Picture-in-Picture ウィンドウです。そこへはテレポートで描画され、同じプロバイダーの下にあります。ウィッシュリストをウィンドウで開き、そこで並べ替えてみましょう：オーバーレイはポップアップの中に表示されます。

<example height="26rem" hint="ウィッシュリストをウィンドウで開いてから、そこで並べ替えてみましょう" name="provider-windows">



</example>

ウィンドウを開くときに、そのウィンドウをプロバイダーに伝えます。

```ts
const dnd = useDnD();

function detach() {
  const popup = window.open('', 'inspector', 'popup,width=420,height=560')!;
  const release = dnd.addWindow(popup);       // listen there, until it closes
  popup.addEventListener('pagehide', release);
  target.value = popup.document.body;         // <Teleport :to="target">…</Teleport>
}
```

- ドラッグはそのウィンドウでもページと同じように動作します：そこで始まり、並べ替え、そのウィンドウのドロップターゲットにヒットし、そのウィンドウを自動スクロールし、その `<body>` にオーバーレイを表示します。ドラッグを動かすのはそのウィンドウのフレームなので、ポップアップの後ろに隠れたページがドラッグを遅くすることはありません。
- ポインターやキーボードのドラッグは、始まったウィンドウに留まります：ブラウザーはウィンドウの入力をそのウィンドウにしか送らないためです。[`native`](https://zizigy.github.io/docs/guides/native) を持つアイテムは、ブラウザー自身のドラッグ＆ドロップに運ばれてウィンドウ間を移動します。
- マウント時にウィンドウへ描画されるコンポーネントは自動的に見つかります。後からテレポートがそこへ移すコンテンツ（切り離されるパネル）は見つかりません：そのために `addWindow` があります。
- プロバイダーはウィンドウに自身のスタイルを注入し、ウィンドウが閉じるとそれを手放します。
- [独自のセンサー](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own)は、`context.onWindow((view) => useEventListener(view.document, …))` ですべてのウィンドウの入力をリッスンします。

## SSR と Nuxt

プロバイダーは SSR で安全に使えます。リストとアイテムは、ほかのマークアップと同じようにサーバーで描画されます。オーバーレイとライブリージョンはテレポートされ、クライアントでのみマウントされるため、ハイドレーションミスマッチを起こしません。デフォルトの id は Vue の `useId()` から生成され、サーバーとクライアントで一致します。

Nuxt では、モジュールが `DnDProvider` をグローバルに登録し、コンポーザブルを自動インポートします。[インストール](https://zizigy.github.io/docs/getting-started/installation#nuxt)を参照してください。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
