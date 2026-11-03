---
title: "v2 からの移行"
description: "v2 のアプリを v3 へ移行します。何がなぜ変わったか、アップグレードの手順、v2 のすべての API と v3 での置き換え先の対応表、よくあるケースの移行前後のコード、そして注意点。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/getting-started/migrating-from-v2"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 は v2 を書き直したものです。モデルは同じです：1 つのプロバイダーと、自分の要素に対して呼び出すコンポーザブル。ただし、ほとんどの名前とオプションが変わり、並べ替えはライブラリの中に移り、リストごとに書いていたドロップハンドラーは不要になります。このページでは、v2 の各部分を v3 に対応付け、よくあるケースを移行前と移行後で示します。

## 変更点

- **並べ替えは組み込み**です。v2 ではリストはドロップゾーンで、その行は `[index, items]` のペイロードを持つドラッグ可能な要素であり、`onDrop` の中で `e.helpers.suggestSort()` を使って並べ替えていました。v3 では `makeSortableList` と `makeSortableItem` がそれを行います：リストは配列の**ドラフト**を描画し、それがドラッグ中に並べ替わり、ドロップすると新しい配列が ref に書き込まれます。v2 のドロップハンドラーのほとんどは、移植するのではなく削除します。
- **ものは自分で動きます**。行は新しい位置へスライドし（FLIP）、オーバーレイはドロップで自分の位置に着地し、キャンセルで元の位置に戻ります。`<TransitionGroup>` は不要になります。
- **パッケージは今も 1 つ**です。`@vue-dnd-kit/core` にリスト、ツリー、マルチドラッグ、モディファイア、センサー、衝突判定の関数が入っています。Nuxt モジュールは引き続きあり、`@vue-dnd-kit/actions`（プログラムによるドラッグ）と `@vue-dnd-kit/devtools` は新しいオプションのパッケージです。
- **本物のオーバーレイ**です。`body` にテレポートされ、着地する位置と同じサイズのディープクローンを表示します。オーバーレイコンポーネントは、プロバイダーの内部を読む代わりに、ドラッグを props として受け取ります。
- **要素ではなく id**です。選択、イベント、ドラッグの状態は、データの id をキーにしています。読むべき DOM 要素のマップはありません。
- **型と accept ルール**が、通常のドラッグ可能な要素とドロップターゲットの `groups` に代わります。リストは `group` の名前でアイテムをやり取りします。
- **判断はドロップの前に**行います。`onBeforeDrop` が受け入れる、拒否する、ドラッグを続ける、またはアイテムの一部だけを受け取るかを決めます。`onDrop` は適用するだけです。
- **センサー**。ポインターとキーボードの入力はセンサーです。アクティベーションはポインターの種類ごとに設定し、タッチのドラッグは長押しで始まるので、指の下でもリストはスクロールし続けます。
- **エリア**。`makeDragArea` が `makeConstraintArea` と `makeAutoScroll` に代わり、自動スクロールはコードなしですべてのスクロールコンテナーで動きます。
- **アクセシビリティはデフォルトでオン**です：ARIA 属性、ドロップ後に戻ってくるフォーカス、スクリーンリーダーへの読み上げ。

## アップグレード

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core@^3
```

```bash [yarn]
yarn add @vue-dnd-kit/core@^3
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core@^3
```

```bash [bun]
bun add @vue-dnd-kit/core@^3
```

</code-group>

<table>
<thead>
  <tr>
    <th>
      パッケージ
    </th>
    
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/core
      </code>
    </td>
    
    <td>
      2.4.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/nuxt
      </code>
    </td>
    
    <td>
      1.x
    </td>
    
    <td>
      3.x
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      1.x、オプション
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      —
    </td>
    
    <td>
      3.x、オプション
    </td>
  </tr>
</tbody>
</table>

- `package.json` に `"@vue-dnd-kit/core": "^2…"` と書かれたアプリは、範囲を `^3` にするまで v2 のままです。
- Vue **3.5** 以降。v2 には依存関係がありませんでしたが、v3 には `@vueuse/core`（14 または 15）が 1 つあります。
- ブラウザー：Chrome と Edge 104+、Safari 15.4+、Firefox 104+。
- v2 と v3 は同じパッケージ名なので、アプリは一度に v3 へ移行します。互換レイヤーはありません。v2 のドキュメントは、ページ上部のバージョンメニューから引き続き見られます。

おすすめの作業順：

1. パッケージをアップグレードし、プロバイダーの props の名前を変えます（[後述](#the-provider)）。
2. 並べ替え可能なリストをそれぞれ `makeSortableList` と `makeSortableItem` に変え、そのドロップハンドラーを削除します。
3. 通常のドラッグ可能な要素とドロップゾーンを移植します。
4. カスタムプレビューを、オーバーレイコンポーネントかプロバイダーの `#overlay` スロットに移植します。
5. `makeConstraintArea` と `makeAutoScroll` を `makeDragArea` に置き換えるか、何も使わないようにします。
6. v2 のための回避策を削除します：ドラッグ可能な要素の `tabindex` と `aria-grabbed`、アイテム全体の `touch-action: none`、行を囲む `<TransitionGroup>`、プレビューコンポーネントを囲む `markRaw`。

## 新旧の対応

表の中の**対応なし**は、v3 にその名前のものがないことを意味します。代わりに何を使うかはセルに書いてあります。

### ひと目で

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
    </td>
    
    <td>
      <code>
        DnDProvider
      </code>
      
      。新しい props と <code>
        #overlay
      </code>
      
       スロットがあります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
    </td>
    
    <td>
      自由なドラッグには <code>
        makeDraggable
      </code>
      
      、リストの行には <code>
        makeSortableItem
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      通常のドロップターゲットには <code>
        makeDroppable
      </code>
      
      、リストとツリーには <code>
        makeSortableList
      </code>
      
       または <code>
        makeSortableTree
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      <code>
        makeSelectionArea
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeConstraintArea
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll
      </code>
    </td>
    
    <td>
      不要：自動スクロールは自動です。<code>
        makeDragArea
      </code>
      
       かリストの <code>
        autoScroll
      </code>
      
       で調整します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider
      </code>
    </td>
    
    <td>
      状態には <code>
        useDnD
      </code>
      
      、イベントには <code>
        useDnDMonitor
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        injectionKey
      </code>
    </td>
    
    <td>
      <code>
        useDnDContext()
      </code>
      
       と <code>
        provideDnDContext(app, context)
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
    </td>
    
    <td>
      <code>
        DragPreview
      </code>
      
      ：今はドラッグ中のアイテム 1 つのクローンで、自作のオーバーレイ用です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSnappedOverlayPosition
      </code>
      
      、<code>
        <DragPreview :grid>
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid
      </code>
      
       モディファイア。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort
      </code>
      
      、<code>
        suggestSwap
      </code>
      
      、<code>
        suggestCopy
      </code>
      
      、<code>
        suggestRemove
      </code>
    </td>
    
    <td>
      リストに組み込み：<a href="#sorting">
        並べ替え
      </a>
      
      を参照。
    </td>
  </tr>
</tbody>
</table>

### プロバイダー

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        autoScrollViewport
      </code>
      
      、設定しなければオフ
    </td>
    
    <td>
      <code>
        autoScroll
      </code>
      
      ：<strong>
        デフォルトでオン
      </strong>
      
      。ウィンドウとすべてのスクロールコンテナーが対象です。<code>
        { threshold, maxSpeed, acceleration }
      </code>
      
       または <code>
        false
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previewTo
      </code>
      
      、デフォルトではプロバイダーの中に描画
    </td>
    
    <td>
      <code>
        overlayTo
      </code>
      
      ：セレクターまたは要素。デフォルトは <code>
        'body'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        #preview="{ preview }"
      </code>
      
       スロット
    </td>
    
    <td>
      ドラッグを props として受け取る <code>
        #overlay
      </code>
      
       スロット：<code>
        items
      </code>
      
      、<code>
        active
      </code>
      
      、<code>
        over
      </code>
      
      、<code>
        accepted
      </code>
      
      、<code>
        status
      </code>
      
      、<code>
        mode
      </code>
      
      、<code>
        to
      </code>
      
      。<a href="#the-overlay">
        オーバーレイ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forDrag
      </code>
      
      、<code>
        forDrop
      </code>
      
      、<code>
        forCancel
      </code>
      
      （<code>
        useDnDProvider()
      </code>
      
       で設定）
    </td>
    
    <td>
      <code>
        :keyboard="{ keys: { start, drop, cancel } }"
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.step
      </code>
    </td>
    
    <td>
      <code>
        :keyboard="{ step }"
      </code>
      
      ：デフォルトは 25 px で、自由なドラッグ用です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard.keys.forMove
      </code>
      
      、<code>
        forMoveFaster
      </code>
      
      、<code>
        keyboard.moveFaster
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。矢印キーで動かします。:kbd{value="Shift"} で自由なドラッグのステップが 4 倍になります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        collision.throttle
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。<code>
        collision
      </code>
      
       でターゲットの見つけ方を選びます：<code>
        pointerFirst
      </code>
      
      （デフォルト）、<code>
        pointerWithin
      </code>
      
      、<code>
        rectIntersection
      </code>
      
      、<code>
        closestCenter
      </code>
      
      、<code>
        closestCorners
      </code>
      
      、または自作の関数。
    </td>
  </tr>
  
  <tr>
    <td>
      ページに 1 つのプロバイダー、ネストは不可
    </td>
    
    <td>
      ネストできます：アイテムは最も近いプロバイダーのものです。アプリ全体で 1 つのプロバイダーが今も目標です。
    </td>
  </tr>
</tbody>
</table>

v2 に対応するものがない新しい props：`activation`、`modifiers`、`sensors`、`animation`、`dropAnimation`、`animateChanges`、`haptics`、`copyModifier`、`overlayFit`、`overlayClass`、`overlayTransition`、`overlayPreviews`、`announcements`、`screenReaderInstructions`、`defaultStyles`。プロバイダーは `drag-start`、`drag-move`、`drag-over`、`drag-end`、`drag-cancel`、`drag-resume`、`drag-settle` も発行します。すべて[プロバイダーのガイド](https://zizigy.github.io/docs/guides/provider)にあります。

### 状態を読む：`useDnD`

<table>
<thead>
  <tr>
    <th>
      <code>
        useDnDProvider()
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        state
      </code>
      
      ：<code>
        'dragging'
      </code>
      
      、<code>
        'activating'
      </code>
      
      、<code>
        'selecting'
      </code>
      
      、<code>
        'pending'
      </code>
      
       または <code>
        null
      </code>
    </td>
    
    <td>
      <code>
        useDnD().status
      </code>
      
      ：<code>
        'idle'
      </code>
      
      、<code>
        'activating'
      </code>
      
      、<code>
        'dragging'
      </code>
      
      、<code>
        'dropping'
      </code>
      
       または <code>
        'selecting'
      </code>
      
      。<code>
        'pending'
      </code>
      
      （非同期のドロップ）は <code>
        'dropping'
      </code>
      
       に、<code>
        null
      </code>
      
       は <code>
        'idle'
      </code>
      
       になります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointer.value.current
      </code>
    </td>
    
    <td>
      <code>
        useDnD().pointer
      </code>
      
      、モディファイア適用後の値。どのイベントにも、開始位置からのオフセットである <code>
        delta
      </code>
      
       があります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggingMap
      </code>
    </td>
    
    <td>
      <code>
        useDnD().active
      </code>
      
      ：<code>
        id
      </code>
      
      、<code>
        ids
      </code>
      
      、<code>
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
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      （要素）
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      （id）：<code>
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
      
      、<code>
        ids
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hovered.droppable
      </code>
      
      、<code>
        hovered.draggable
      </code>
    </td>
    
    <td>
      <code>
        useDnD().over
      </code>
      
      ：<code>
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
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay.progress
      </code>
      
      、<code>
        distanceProgress
      </code>
    </td>
    
    <td>
      <code>
        useDnD().activation.progress
      </code>
      
      、<code>
        0
      </code>
      
       から <code>
        1
      </code>
      
       まで。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
      、<code>
        preview.size
      </code>
      
      、<code>
        preview.render
      </code>
      
      、<code>
        preview.to
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。オーバーレイの配置とサイズはライブラリが決めます。<code>
        overlayTo
      </code>
      
      、<code>
        #overlay
      </code>
      
       スロット、またはオーバーレイコンポーネントを使います。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.draggableMap
      </code>
      
      、<code>
        droppableMap
      </code>
      
      、<code>
        visible…Set
      </code>
      
       の各セット、<code>
        scrollPosition
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新規：<code>
        useDnD().cancel()
      </code>
      
      、<code>
        position
      </code>
      
      、<code>
        isAutoScrolling
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

イベントは `useDnDMonitor` に移りました：[イベントとドロップの判断](#events-and-drop-decisions)を参照。完全な型は [useDnD の API](https://zizigy.github.io/docs/api/use-dnd) にあります。

### `makeDraggable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(ref, options, payload)
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(ref, options)
      </code>
      
      ：第 3 引数はありません。リストの行は <code>
        makeSortableItem(ref, { item })
      </code>
      
       を使います。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
      
      、仮想リストで必要
    </td>
    
    <td>
      <code>
        id
      </code>
      
      ：データから、ゲッターとして渡します。デフォルトは <code>
        useId()
      </code>
      
       から作られ、コンポーネントのインスタンスごとに新しくなります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data: () => card
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      ：値、ref、またはゲッター。<code>
        active.data
      </code>
      
       と <code>
        active.items[i].data
      </code>
      
       で読み戻します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: ['dev']
      </code>
    </td>
    
    <td>
      <code>
        type: 'dev'
      </code>
      
      。ターゲットの <code>
        accept
      </code>
      
       と照合されます。<a href="#groups">
        グループ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dragHandle: '.handle'
      </code>
    </td>
    
    <td>
      <code>
        handle
      </code>
      
      ：セレクターまたは要素の ref。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier: { keys, method }
      </code>
    </td>
    
    <td>
      <code>
        canDrag: (event) => event.altKey
      </code>
      
      ：押すたびに通るゲートです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation: { distance, delay }
      </code>
    </td>
    
    <td>
      ポインターの種類ごとの <code>
        activation
      </code>
      
      ：<code>
        { mouse: { distance }, touch: { delay, tolerance }, pen }
      </code>
      
      。<code>
        distance
      </code>
      
       と <code>
        delay
      </code>
      
       の両方があると、先に満たされた方でドラッグが始まります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation.distance: { x, y, condition }
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。ポインターの種類ごとに <code>
        distance
      </code>
      
       は 1 つです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      ：コンポーネントはドラッグを props として受け取ります。<a href="#the-overlay">
        オーバーレイ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placementMargins
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。並べ替え可能なアイテム上のドロップターゲットは、その中央（25〜75%）で判定されます。ツリーは <code>
        nesting: 'hover'
      </code>
      
       でネストします。<a href="/docs/guides/drag-and-drop#drop-into-a-sortable-item">
        並べ替え可能なアイテムへのドロップ
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelfDragStart
      </code>
      
      、<code>
        onSelfDragMove
      </code>
      
      、<code>
        onSelfDragEnd
      </code>
      
      、<code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      ドラッグ可能な要素には<strong>
        対応なし
      </strong>
      
      ：<code>
        useDnDMonitor
      </code>
      
       か <code>
        watch(isDragging)
      </code>
      
       を使います。<a href="#events-and-drop-decisions">
        イベント
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onHover
      </code>
      
      、<code>
        onLeave
      </code>
      
      、そしてその上を通るドラッグの <code>
        onDragStart
      </code>
      
      …
    </td>
    
    <td>
      同じ要素に <code>
        makeDroppable
      </code>
      
      ：<code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
      
      、<code>
        selected
      </code>
      
       を返す
    </td>
    
    <td>
      同じです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragOver
      </code>
      
       を返す
    </td>
    
    <td>
      並べ替え可能なアイテムは <code>
        indicator
      </code>
      
      （<code>
        placeholder: 'indicator'
      </code>
      
       のとき）と <code>
        isPlaceholder
      </code>
      
       を返し、ドロップターゲットは <code>
        placement
      </code>
      
       を返します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAllowed
      </code>
      
       を返す
    </td>
    
    <td>
      ドラッグ可能な要素には<strong>
        対応なし
      </strong>
      
      。ドロップターゲットは <code>
        isAccepting
      </code>
      
       を返します。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新規：<code>
        label
      </code>
      
      、<code>
        axis
      </code>
      
      、<code>
        modifiers
      </code>
      
      、<code>
        keyboardMode
      </code>
      
      、返される <code>
        transform
      </code>
      
       と組み合わせる <code>
        overlay: false
      </code>
      
      、<code>
        dropAnimation
      </code>
      
      、<code>
        attributes
      </code>
      
      、<code>
        native
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

### `makeDroppable`

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDroppable(ref, options, () => items)
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(ref, options)
      </code>
      
      。リストを持つゾーンは <code>
        makeSortableList
      </code>
      
       です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      ：<code>
        '*'
      </code>
      
      、型、型のリスト、または関数。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      、<code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      、<code>
        'some'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onEnter
      </code>
      
      、<code>
        events.onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      ：それぞれ独立したオプションで、<code>
        events
      </code>
      
       オブジェクトはありません。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onDrop
      </code>
      
      。<code>
        false
      </code>
      
       や Promise を返せた
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       が判断し、<code>
        onDrop
      </code>
      
       が適用します。<a href="#events-and-drop-decisions">
        ドロップの判断
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      残す id を返す <code>
        onBeforeDrop
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        data
      </code>
      
      。<code>
        over.data
      </code>
      
       で読み戻します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAllowed
      </code>
      
       を返す
    </td>
    
    <td>
      <code>
        isAccepting
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragOver
      </code>
      
       を返す：<code>
        { top, right, bottom, left, center }
      </code>
    </td>
    
    <td>
      <code>
        isOver
      </code>
      
      （真偽値）と <code>
        placement
      </code>
      
      ：<code>
        { top, right, bottom, left }
      </code>
      
      、ポインターがある側の半分。<code>
        center
      </code>
      
       はありません。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新規：<code>
        id
      </code>
      
      、<code>
        label
      </code>
      
      、<code>
        priority
      </code>
      
      、<code>
        overOverlay
      </code>
      
      、<code>
        overDropAnimation
      </code>
      
      、<code>
        external
      </code>
      
      （コンピューターからのファイル）。
    </td>
  </tr>
</tbody>
</table>

### ドロップイベント

<table>
<thead>
  <tr>
    <th>
      v2 <code>
        IDragEvent
      </code>
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        e.draggedItems
      </code>
    </td>
    
    <td>
      <code>
        e.active.items
      </code>
      
      ：それぞれ <code>
        { id, item, data, label, type }
      </code>
      
       で、掴んだアイテムが先頭です。リストは <code>
        e.items
      </code>
      
       と <code>
        e.keys
      </code>
      
       も受け取ります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[0].data
      </code>
    </td>
    
    <td>
      <code>
        e.active.data
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.draggedItems[i].index
      </code>
      
      、<code>
        .items
      </code>
    </td>
    
    <td>
      リスト：<code>
        e.from
      </code>
      
      、<code>
        { list, index }
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.dropZone
      </code>
      
      ：<code>
        items
      </code>
      
      、<code>
        placement
      </code>
      
      、<code>
        data
      </code>
    </td>
    
    <td>
      <code>
        e.over
      </code>
      
      ：<code>
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
      
      。リスト：<code>
        e.to
      </code>
      
      、<code>
        { list, index }
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.hoveredDraggable
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      ：リストは <code>
        e.to.index
      </code>
      
       を自分で求めます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSort()
      </code>
    </td>
    
    <td>
      リストがドロップを書き込みます。<code>
        e.result
      </code>
      
       には、そのドロップで変わったすべてのリストの新しい配列が入ります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestSwap()
      </code>
    </td>
    
    <td>
      リストに <code>
        behavior: 'swap'
      </code>
      
      。<code>
        e.partner
      </code>
      
       は入れ替えた相手のアイテムです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestCopy()
      </code>
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone' }
      </code>
      
       またはコピーキー（:kbd{value="Alt"}）と、リストの <code>
        clone
      </code>
      
      。<code>
        e.mode
      </code>
      
       は <code>
        'copy'
      </code>
      
       です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.suggestRemove()
      </code>
    </td>
    
    <td>
      ドロップターゲットでの <code>
        e.source.remove()
      </code>
      
      、またはリストの <code>
        dropOutside: 'remove'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        result.sameList
      </code>
    </td>
    
    <td>
      <code>
        e.sameList
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.helpers.insertAt
      </code>
      
      、<code>
        removeAt
      </code>
      
      、<code>
        removeIndexes
      </code>
      
      、<code>
        swapAt
      </code>
      
      、<code>
        getInsertSide
      </code>
      
      、<code>
        isAtZoneStart
      </code>
      
      、<code>
        isAtZoneEnd
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。リストには不要です。通常のドロップターゲットでは、データを好きなように変更してください。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        e.provider
      </code>
    </td>
    
    <td>
      <code>
        useDnD()
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新規：<code>
        e.pointer
      </code>
      
      、<code>
        e.delta
      </code>
      
      、<code>
        e.position
      </code>
      
      （ボードにドロップしたアイテムをどこに置くか）、<code>
        e.mode
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

### 並べ替え

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        () => items
      </code>
      
       を渡した <code>
        makeDroppable
      </code>
      
       のリスト
    </td>
    
    <td>
      <code>
        makeSortableList(listRef, { items })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        () => [index, items]
      </code>
      
       を渡した <code>
        makeDraggable
      </code>
      
       の行
    </td>
    
    <td>
      <code>
        makeSortableItem(el, { item: () => props.task })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      自分の配列を描画
    </td>
    
    <td>
      返された <code>
        items
      </code>
      
       を描画：ドラッグ中に並べ替わるドラフトです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSort('vertical')
      </code>
      
      、<code>
        suggestSort('horizontal')
      </code>
    </td>
    
    <td>
      <code>
        strategy: 'vertical'
      </code>
      
      （デフォルト）、<code>
        'horizontal'
      </code>
      
      、または <code>
        'grid'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      参照の比較で元の配列と先の配列を見つけ、<code>
        sourceItems
      </code>
      
       と <code>
        targetItems
      </code>
      
       を代入
    </td>
    
    <td>
      不要：ドロップが、変わったすべてのリストに書き込みます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <TransitionGroup>
      </code>
    </td>
    
    <td>
      組み込み。<code>
        animateChanges: true
      </code>
      
       で、ドラッグ以外による変化（追加、削除、シャッフル）をアニメーションします。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragOver.top
      </code>
      
      、<code>
        .bottom
      </code>
      
       による挿入ライン
    </td>
    
    <td>
      <code>
        placeholder: 'indicator'
      </code>
      
       とアイテムの <code>
        indicator.side
      </code>
      
      。<a href="/docs/guides/sortable-lists#an-insertion-line">
        挿入ライン
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestSwap()
      </code>
    </td>
    
    <td>
      <code>
        behavior: 'swap'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      コピー専用のパレット（<code>
        suggestCopy()
      </code>
      
       と <code>
        copyOnly
      </code>
      
       フラグ）
    </td>
    
    <td>
      <code>
        group: { name, pull: 'clone', put: false }
      </code>
      
      、<code>
        sort: false
      </code>
      
      、<code>
        clone
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        suggestRemove()
      </code>
      
       を使うゴミ箱ゾーン
    </td>
    
    <td>
      <code>
        makeDroppable(trash, { onDrop: (e) => e.source?.remove() })
      </code>
      
      、または <code>
        dropOutside: 'remove'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      Pinia やイミュータブルなデータ：結果を自分で代入
    </td>
    
    <td>
      <code>
        items
      </code>
      
       をゲッターにして、<code>
        onDrop
      </code>
      
       で <code>
        e.preventDefault()
      </code>
      
       を呼び、<code>
        e.result
      </code>
      
       を適用します。<a href="/docs/guides/shared-lists#controlled-lists">
        制御されたリスト
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      再帰的なツリー：フォルダーごとの droppable と <code>
        applyToTree
      </code>
    </td>
    
    <td>
      <code>
        makeSortableTree
      </code>
      
      ：コンテナーは 1 つで、行は深さとともにフラットに描画されます。<a href="/docs/guides/trees">
        ツリー
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        v-model
      </code>
      
       を使ったネストしたグループ（グループごとに droppable）
    </td>
    
    <td>
      リストの中のリスト。すべて同じ <code>
        group
      </code>
      
       で、それぞれ <code>
        items: defineModel()
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      仮想リスト：すべてのドラッグ可能な要素に <code>
        id
      </code>
    </td>
    
    <td>
      ドラフトを仮想化ライブラリに渡し、行に <code>
        id: () => props.item.id
      </code>
      
      。<a href="/docs/guides/virtual-lists">
        仮想リスト
      </a>
      
      を参照。
    </td>
  </tr>
</tbody>
</table>

移行前後のコードは[後述](#a-sortable-list)します。リストのすべては[並べ替え可能なリスト](https://zizigy.github.io/docs/guides/sortable-lists)と[アイテムを共有するリスト](https://zizigy.github.io/docs/guides/shared-lists)にあります。

### グループ

v2 にはすべてに使う `groups` オプションが 1 つありました。v3 はそれを 2 つに分けます：

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable(el, { type: 'dev' })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDroppable(el, { groups: ['dev'] })
      </code>
    </td>
    
    <td>
      <code>
        makeDroppable(el, { accept: 'dev' })
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      ゾーンの <code>
        groups: ['dev', 'ops']
      </code>
    </td>
    
    <td>
      <code>
        accept: ['dev', 'ops']
      </code>
      
      、または関数：<code>
        ({ active, items, types }) => boolean
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups: []
      </code>
      
      、または指定なし
    </td>
    
    <td>
      <code>
        type
      </code>
      
       や <code>
        accept
      </code>
      
       を省きます。v2 のルールはそのままです：型のないドラッグ可能な要素はどのルールにも合い、<code>
        accept
      </code>
      
       のないターゲットはすべてを受け入れます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groupMatch: 'every'
      </code>
      
      、<code>
        'some'
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'all'
      </code>
      
      、<code>
        'some'
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      リストのゾーンとその行の <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        makeSortableList
      </code>
      
       の <code>
        group: 'board'
      </code>
      
      。<code>
        group: { name, pull, put }
      </code>
      
       で、何が出ていけて何が入れるかを指定します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
       の <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

`group` のないリストはそれだけで 1 つのグループになり、ほかのどのリストともアイテムをやり取りしません。v2 では、groups のないゾーンはすべてを受け入れていました。[ターゲットが受け入れるドラッグ](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes)を参照してください。

### オーバーレイ

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      プロバイダーの中に描画され、<code>
        previewTo
      </code>
      
       でテレポートされるプレビュー
    </td>
    
    <td>
      常にテレポートされます。行き先は <code>
        body
      </code>
      
       か <code>
        overlayTo
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      クローン：同じタグ、その <code>
        innerHTML
      </code>
      
      、そのサイズ
    </td>
    
    <td>
      ディープクローン：フォームの値、<code>
        <canvas>
      </code>
      
       のピクセル、継承されたスタイル、表のセルも一緒に来ます。残すものには <code>
        data-dnd-no-clone
      </code>
      
       を付けます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        render: markRaw(Preview)
      </code>
      
      。<code>
        useDnDProvider().entities
      </code>
      
       を読む
    </td>
    
    <td>
      <code>
        overlay: Preview
      </code>
      
      。<code>
        items
      </code>
      
      、<code>
        active
      </code>
      
      、<code>
        over
      </code>
      
      、<code>
        accepted
      </code>
      
      、<code>
        status
      </code>
      
      、<code>
        mode
      </code>
      
      、<code>
        to
      </code>
      
       を props として受け取ります。<code>
        markRaw
      </code>
      
       は不要で、切り替えるには <code>
        shallowRef
      </code>
      
       を使います。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        preview.position
      </code>
      
       で位置を決める <code>
        #preview
      </code>
      
       スロット
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       スロット：ボックスの配置とサイズはライブラリが決めます。何も描画しなければクローンにフォールバックします。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().preview.render.value = …
      </code>
    </td>
    
    <td>
      <code>
        #overlay
      </code>
      
       スロット、または <code>
        overlay
      </code>
      
       として渡す <code>
        shallowRef
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnter
      </code>
      
       と <code>
        onLeave
      </code>
      
       による、ゾーンの上での見た目の変更
    </td>
    
    <td>
      <code>
        makeDroppable
      </code>
      
       やリストの <code>
        overOverlay
      </code>
      
      、またはオーバーレイコンポーネントで <code>
        over
      </code>
      
       を読みます。<a href="/docs/guides/overlay#targets-that-change-the-overlay">
        オーバーレイを変えるターゲット
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview v-slot="{ draggingMap }">
      </code>
    </td>
    
    <td>
      オーバーレイの props の <code>
        items
      </code>
      
      。<code>
        <DragPreview :id="item.id" />
      </code>
      
       はクローンを 1 つ描画します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid>
      </code>
      
      、<code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid
      </code>
      
       モディファイア。見た目だけでなく、ターゲットを探す位置とドロップの <code>
        position
      </code>
      
       もスナップします。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DragPreview
      </code>
      
       を囲む <code>
        <Transition>
      </code>
      
       や motion の <code>
        AnimatePresence
      </code>
    </td>
    
    <td>
      持ち上げには <code>
        @starting-style
      </code>
      
       付きの <code>
        overlay-class
      </code>
      
      、着地には <code>
        dropAnimation
      </code>
      
      、コンポーネント間には <code>
        overlayTransition
      </code>
      
      。<a href="/docs/guides/animations#the-overlay-lift-tilt-settle">
        持ち上げ、傾け、落ち着かせる
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        .dnd-kit-preview
      </code>
    </td>
    
    <td>
      ボックスの <code>
        [data-dnd-overlay]
      </code>
      
      （<code>
        "dragging"
      </code>
      
      、<code>
        "dropping"
      </code>
      
      ）と、その中の <code>
        [data-dnd-overlay-content]
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      手作業で更新する <code>
        preview.size
      </code>
    </td>
    
    <td>
      ボックスは着地する位置のサイズになります（<code>
        overlayFit
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      ドロップでプレビューが消える
    </td>
    
    <td>
      自分の位置に着地するか、キャンセルで元の位置に戻ります。
    </td>
  </tr>
</tbody>
</table>

詳しくは[オーバーレイのガイド](https://zizigy.github.io/docs/guides/overlay)にあります。

### 選択とマルチドラッグ

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
       が返す <code>
        selected
      </code>
    </td>
    
    <td>
      <code>
        makeDraggable
      </code>
      
       と <code>
        makeSortableItem
      </code>
      
       が返す <code>
        selected
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        entities.selectedSet
      </code>
      
      、要素のセット
    </td>
    
    <td>
      <code>
        useDnD().selection
      </code>
      
      、id がキー。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
      
      ：デフォルトで Ctrl（<code>
        ControlLeft
      </code>
      
      ）を押したまま
    </td>
    
    <td>
      デフォルトではキー不要：エリアの空いている場所を押すと選択枠を描きます。<code>
        modifier: { keys: ['Control'], method: 'every' }
      </code>
      
       で Ctrl に戻せます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        KeyboardEvent.code
      </code>
      
       としての <code>
        modifier.keys
      </code>
    </td>
    
    <td>
      <code>
        KeyboardEvent.key
      </code>
      
      （<code>
        'Control'
      </code>
      
      、<code>
        'Shift'
      </code>
      
      ）または <code>
        .code
      </code>
      
      （<code>
        'ControlLeft'
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        strategy: 'toggle'
      </code>
      
      、<code>
        'select'
      </code>
    </td>
    
    <td>
      同じです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        groups
      </code>
    </td>
    
    <td>
      <code>
        accept
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        events.onSelected(elements)
      </code>
    </td>
    
    <td>
      <code>
        onSelected(ids)
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      同じです。
    </td>
  </tr>
  
  <tr>
    <td>
      選択をまとめて動かす <code>
        suggestSort()
      </code>
    </td>
    
    <td>
      リストが動かします。<code>
        multiple: 'group'
      </code>
      
      （デフォルト）、<code>
        'gaps'
      </code>
      
      、<code>
        'stack'
      </code>
      
       で、ほかのアイテムが途中でどうするかを決めます。
    </td>
  </tr>
  
  <tr>
    <td>
      混在した選択のための <code>
        onValidate
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       と、id を返す <code>
        onBeforeDrop
      </code>
      
      。<a href="/docs/guides/multi-drag#taking-only-some">
        一部だけを受け入れる
      </a>
      
      を参照。
    </td>
  </tr>
</tbody>
</table>

詳しくは[マルチドラッグと選択](https://zizigy.github.io/docs/guides/multi-drag)にあります。

### 軸、境界、スナップ

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeConstraintArea(el, { axis: 'x' })
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { axis: 'x' })
      </code>
      
      。その中で始まるドラッグに効きます。<code>
        axis
      </code>
      
       はドラッグ可能な要素、リスト、ツリー、アイテムにも使えます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis: 'both'
      </code>
    </td>
    
    <td>
      <code>
        axis
      </code>
      
       を省きます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea: true
      </code>
    </td>
    
    <td>
      <code>
        makeDragArea(el, { restrictToArea: true })
      </code>
      
      、またはモディファイアの <code>
        restrictToParent
      </code>
      
       と <code>
        restrictToElement(el)
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      ルールを分けるための、領域ごとのプロバイダー
    </td>
    
    <td>
      プロバイダーは 1 つで、領域ごとに <code>
        makeDragArea
      </code>
      
      。そのアイテムはどこへでも動けます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <DragPreview :grid="20">
      </code>
      
      、<code>
        makeSnappedOverlayPosition
      </code>
    </td>
    
    <td>
      <code>
        snapToGrid(20)
      </code>
      
       または <code>
        snapToGrid({ x, y, origin, smooth })
      </code>
      
       を、プロバイダー、エリア、リスト、ドラッグ可能な要素の <code>
        modifiers
      </code>
      
       に入れます。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新規：<code>
        restrictToWindowEdges
      </code>
      
      、<code>
        restrictToFirstScrollableAncestor
      </code>
      
      、<code>
        snapCenterToCursor
      </code>
      
      、そして自作のモディファイア。
    </td>
  </tr>
</tbody>
</table>

詳しくは[軸、境界、グリッド](https://zizigy.github.io/docs/guides/constraints)にあります。

### 自動スクロール

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <DnDProvider :autoScrollViewport="true">
      </code>
      
      、デフォルトでオフ
    </td>
    
    <td>
      デフォルトでオン。ウィンドウとすべてのスクロールコンテナーが対象です。<code>
        :auto-scroll="false"
      </code>
      
       でオフにします。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeAutoScroll(el, { threshold, speed })
      </code>
    </td>
    
    <td>
      不要：<code>
        overflow: auto
      </code>
      
       や <code>
        scroll
      </code>
      
       の要素はどれもスクロールします。個別に調整するには <code>
        makeDragArea(el, { autoScroll: { … } })
      </code>
      
       またはリストの <code>
        autoScroll
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      px 単位、または辺ごとの <code>
        threshold
      </code>
    </td>
    
    <td>
      <code>
        threshold
      </code>
      
      ：コンテナーのサイズに対する割合（<code>
        0.2
      </code>
      
      ）で、24〜96 px の範囲。辺ごとのしきい値は<strong>
        対応なし
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      倍率の <code>
        speed
      </code>
    </td>
    
    <td>
      <code>
        maxSpeed
      </code>
      
      （1 フレームあたり 25 px）と <code>
        acceleration
      </code>
      
      （10）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled: true
      </code>
    </td>
    
    <td>
      <code>
        autoScroll: false
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isScrolling
      </code>
    </td>
    
    <td>
      <code>
        isAutoScrolling
      </code>
      
      。<code>
        makeDragArea
      </code>
      
       または <code>
        useDnD()
      </code>
      
       から。
    </td>
  </tr>
</tbody>
</table>

### キーボードとアクセシビリティ

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      すべてのドラッグ可能な要素に <code>
        tabindex="0"
      </code>
    </td>
    
    <td>
      自動で設定され、<code>
        role
      </code>
      
      、<code>
        aria-roledescription
      </code>
      
      、<code>
        aria-describedby
      </code>
      
      、<code>
        aria-disabled
      </code>
      
      、<code>
        aria-pressed
      </code>
      
       も付きます。自分で付けた属性が優先されます。
    </td>
  </tr>
  
  <tr>
    <td>
      手書きの <code>
        :aria-grabbed="isDragging"
      </code>
    </td>
    
    <td>
      削除します：<code>
        aria-pressed
      </code>
      
       がドラッグに追従します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnDProvider().keyboard.keys
      </code>
      
       で設定したキー
    </td>
    
    <td>
      プロバイダーの <code>
        keyboard
      </code>
      
       prop。割り当ては <code>
        event.code
      </code>
      
       または <code>
        event.key
      </code>
      
       と照合されます。
    </td>
  </tr>
  
  <tr>
    <td>
      矢印キーでプレビューを <code>
        keyboard.step
      </code>
      
       ずつ動かす
    </td>
    
    <td>
      自由なドラッグ：<code>
        keyboard.step
      </code>
      
       px ずつ。リスト：位置ごとに、そしてグループの次のリストへ。<code>
        keyboardMode: 'droppables'
      </code>
      
       はターゲット間をジャンプします。
    </td>
  </tr>
  
  <tr>
    <td>
      矢印キーの再割り当て（<code>
        forMove
      </code>
      
      、<code>
        forMoveFaster
      </code>
      
      ）
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      読み上げなし
    </td>
    
    <td>
      ライブリージョンが、持ち上げ、移動、ドロップ、キャンセルのたびに読み上げます。<code>
        label
      </code>
      
       が名前を付け、<code>
        announcements
      </code>
      
       と <code>
        screenReaderInstructions
      </code>
      
       が言い回しを変えます。
    </td>
  </tr>
</tbody>
</table>

詳しくは[アクセシビリティ](https://zizigy.github.io/docs/guides/accessibility)にあります。

### イベントとドロップの判断

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      ドラッグ可能な要素の <code>
        events.onSelfDragStart
      </code>
    </td>
    
    <td>
      <code>
        useDnDMonitor({ onDragStart })
      </code>
      
       で <code>
        active.ids
      </code>
      
       を確認します。クラスを付けるだけなら <code>
        isDragging
      </code>
      
       で十分です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragMove
      </code>
    </td>
    
    <td>
      モニターの <code>
        onDragMove
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragEnd
      </code>
      
      、ドロップでもキャンセルでも
    </td>
    
    <td>
      モニターの <code>
        onDragEnd
      </code>
      
      （ドロップ）と <code>
        onDragCancel
      </code>
      
      。<code>
        onDragSettle
      </code>
      
       はオーバーレイが着地した後に両方を受け取ります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelfDragCancel
      </code>
    </td>
    
    <td>
      モニターの <code>
        onDragCancel
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      ドラッグ可能な要素の <code>
        onHover
      </code>
      
      、<code>
        onLeave
      </code>
      
      、そしてその上を通るドラッグの <code>
        onDragStart
      </code>
      
      …
    </td>
    
    <td>
      その要素に <code>
        makeDroppable
      </code>
      
      ：<code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      。リストの行には何も要りません。
    </td>
  </tr>
  
  <tr>
    <td>
      droppable の <code>
        events.onEnter
      </code>
      
      、<code>
        onLeave
      </code>
    </td>
    
    <td>
      <code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      droppable の <code>
        events.onDrop
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       が判断し、次に <code>
        onDrop
      </code>
      
       が適用します。<code>
        onDrop
      </code>
      
       は同期で、戻り値は無視されます。
    </td>
  </tr>
  
  <tr>
    <td>
      droppable の <code>
        events.onValidate
      </code>
    </td>
    
    <td>
      <code>
        acceptMode: 'some'
      </code>
      
       と組み合わせた <code>
        onBeforeDrop
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      新規：プロバイダーの <code>
        @drag-start
      </code>
      
       … <code>
        @drag-settle
      </code>
      
      、そしてモニターの <code>
        onDragOver
      </code>
      
      、<code>
        onBeforeDrop
      </code>
      
      、<code>
        onDragResume
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

v2 の `onDrop` は、値やその Promise を返してドロップを決められました。v3 ではそれは `onBeforeDrop` の役目で、リスト、ツリー、ドロップターゲット、モニターにあります：

<table>
<thead>
  <tr>
    <th>
      v2 の <code>
        onDrop
      </code>
      
       の戻り値
    </th>
    
    <th>
      v3 の <code>
        onBeforeDrop
      </code>
      
       の戻り値
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      何も返さない、または <code>
        true
      </code>
      
      ：ドロップが成立する
    </td>
    
    <td>
      <code>
        'accept'
      </code>
      
      、<code>
        true
      </code>
      
      、または何も返さない。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        false
      </code>
      
      ：このドロップは見送られ、ドラッグは続く
    </td>
    
    <td>
      <code>
        'continue'
      </code>
      
      。<strong>
        今は <code>
          false
        </code>
        
         でドロップが拒否されます
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      reject された Promise や例外：ドラッグがキャンセルされる
    </td>
    
    <td>
      <code>
        'reject'
      </code>
      
       または <code>
        false
      </code>
      
      。例外も拒否になります。
    </td>
  </tr>
  
  <tr>
    <td>
      Promise。その間 <code>
        state
      </code>
      
       は <code>
        'pending'
      </code>
    </td>
    
    <td>
      Promise。その間 <code>
        status
      </code>
      
       は <code>
        'dropping'
      </code>
      
       で、オーバーレイは <code>
        data-dnd-overlay="dropping"
      </code>
      
       の状態で待ちます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onValidate
      </code>
      
       が <code>
        IDragItem[]
      </code>
      
       を返す
    </td>
    
    <td>
      id の配列：それらだけがドロップされ、ほかは元の位置に戻ります。
    </td>
  </tr>
</tbody>
</table>

まずモニターが答え、次にターゲットが答えます。そのあとターゲットの `onDrop` が実行され、リストが新しい配列を書き込み、`onDragEnd` が続きます。詳しくは[ドロップの判断](https://zizigy.github.io/docs/guides/drop-decisions)と[イベントの API](https://zizigy.github.io/docs/api/events) にあります。

### 型

<table>
<thead>
  <tr>
    <th>
      v2
    </th>
    
    <th>
      v3
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        IDragEvent
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
      
      （ドロップターゲット、モニター）、<code>
        SortableDropEvent
      </code>
      
      （リスト）、<code>
        DnDEndEvent
      </code>
      
      （<code>
        onDragEnd
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragItem
      </code>
    </td>
    
    <td>
      <code>
        DragItem
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropZoneContext
      </code>
    </td>
    
    <td>
      <code>
        Over
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IHoveredDraggableContext
      </code>
    </td>
    
    <td>
      <strong>
        対応なし
      </strong>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ISuggestSortResult
      </code>
      
      、<code>
        ISuggestSwapResult
      </code>
      
      、<code>
        ISuggestCopyResult
      </code>
      
      、<code>
        ISuggestRemoveResult
      </code>
    </td>
    
    <td>
      <code>
        SortableDropEvent
      </code>
      
      ：<code>
        result
      </code>
      
      、<code>
        to
      </code>
      
      、<code>
        mode
      </code>
      
      、<code>
        partner
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDropValidateEvent
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       の中の <code>
        DnDEvent
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IPlacement
      </code>
    </td>
    
    <td>
      <code>
        center
      </code>
      
       のない <code>
        Placement
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ICoordinates
      </code>
    </td>
    
    <td>
      <code>
        Coordinates
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDragActivationOptions
      </code>
    </td>
    
    <td>
      <code>
        ActivationOptions
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IAutoScrollOptions
      </code>
    </td>
    
    <td>
      <code>
        AutoScrollOptions
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        TDnDState
      </code>
    </td>
    
    <td>
      <code>
        DnDStatus
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDnDProviderExternal
      </code>
    </td>
    
    <td>
      <code>
        DnDState
      </code>
      
      。<code>
        useDnD()
      </code>
      
       が返すものです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        IDraggableEvents
      </code>
      
      、<code>
        IDroppableEvents
      </code>
    </td>
    
    <td>
      <code>
        DraggableOptions
      </code>
      
      、<code>
        DroppableOptions
      </code>
      
      、<code>
        DnDMonitor
      </code>
      
       の中のコールバック。
    </td>
  </tr>
</tbody>
</table>

### Nuxt

```bash
npm i @vue-dnd-kit/nuxt@^3 @vue-dnd-kit/core@^3
```

<table>
<thead>
  <tr>
    <th>
      v2（<code>
        @vue-dnd-kit/nuxt
      </code>
      
       1.x）
    </th>
    
    <th>
      v3（<code>
        @vue-dnd-kit/nuxt
      </code>
      
       3.x）
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
      、<code>
        makeDroppable
      </code>
      
      、<code>
        makeSelectionArea
      </code>
      
      、<code>
        makeConstraintArea
      </code>
      
      、<code>
        makeAutoScroll
      </code>
      
      、<code>
        useDnDProvider
      </code>
      
       を自動インポート
    </td>
    
    <td>
      <code>
        makeDraggable
      </code>
      
      、<code>
        makeDroppable
      </code>
      
      、<code>
        makeSortableList
      </code>
      
      、<code>
        makeSortableItem
      </code>
      
      、<code>
        makeSortableTree
      </code>
      
      、<code>
        makeSelectionArea
      </code>
      
      、<code>
        makeDragArea
      </code>
      
      、<code>
        useDnD
      </code>
      
      、<code>
        useDnDMonitor
      </code>
      
       を自動インポート。
    </td>
  </tr>
  
  <tr>
    <td>
      型は自動インポートされない
    </td>
    
    <td>
      主な型は自動インポートされます（<code>
        DnDEvent
      </code>
      
      、<code>
        SortableDropEvent
      </code>
      
      、<code>
        OverlayProps
      </code>
      
      …）。汎用的な型（<code>
        Key
      </code>
      
      、<code>
        Active
      </code>
      
      、<code>
        Over
      </code>
      
      ）は手動でインポートします。
    </td>
  </tr>
  
  <tr>
    <td>
      —
    </td>
    
    <td>
      モディファイア、衝突判定の関数、センサーは必要に応じて：<code>
        vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        DnDProvider
      </code>
      
       と <code>
        DragPreview
      </code>
      
       がグローバル
    </td>
    
    <td>
      同じです。<code>
        prefix
      </code>
      
       オプションがあります。
    </td>
  </tr>
  
  <tr>
    <td>
      レイアウトの、プロバイダーの中の <code>
        <DragPreview />
      </code>
    </td>
    
    <td>
      削除します：オーバーレイはプロバイダーが描画します。<code>
        DragPreview
      </code>
      
       は <code>
        id
      </code>
      
       を受け取り、オーバーレイコンポーネントの中で使います。
    </td>
  </tr>
  
  <tr>
    <td>
      peer 依存 <code>
        @vue-dnd-kit/core
      </code>
      
       2
    </td>
    
    <td>
      peer 依存 <code>
        @vue-dnd-kit/core
      </code>
      
       3、Nuxt 4。
    </td>
  </tr>
</tbody>
</table>

`nuxt.config.ts` の `modules: ['@vue-dnd-kit/nuxt']` はそのままです。[インストール](https://zizigy.github.io/docs/getting-started/installation#nuxt)を参照してください。

## 移行前と移行後

### ドラッグ可能な要素とドロップゾーン

**v2**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  groups: ['task'],
  dragHandle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" tabindex="0" :class="{ dragging: isDragging }">
    <span class="handle">⋮⋮</span>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragOver, isAllowed } = makeDroppable(el, {
  groups: ['task'],
  events: {
    onDrop: (e) => emit('drop', e.draggedItems.map((item) => item.data as Card)),
  },
});
</script>

<template>
  <div ref="el" :class="{ over: isDragOver && isAllowed }"><slot /></div>
</template>
```

**v3**

```vue [Card.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ card: Card }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.card.id,   // read back as `active.id`
  type: 'task',              // matched by the targets' `accept`
  handle: '.handle',
  data: () => props.card,
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">
    <button type="button" class="handle" :aria-label="`Move ${card.title}`">⋮⋮</button>
    {{ card.title }}
  </div>
</template>
```

```vue [Zone.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const emit = defineEmits<{ drop: [cards: Card[]] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  accept: 'task',
  onDrop: (e) => emit('drop', e.active.items.map((item) => item.data as Card)),
});
</script>

<template>
  <div ref="el" :class="{ over: isOver && isAccepting }"><slot /></div>
</template>
```

- カードは `tabindex`、`role`、`aria-*` 属性を自動で受け取ります。`<button>` のハンドルはフォーカスでき、キーボードドラッグはそこから始まります。
- `groups` は、ドラッグ可能な要素では `type` に、ターゲットでは `accept` になりました。コールバックは `events` オブジェクトから外に出ました。
- `isAccepting` のない `isOver` は、そのドラッグを拒否するターゲットです：そこにドロップすると元の位置に戻ります。

### 並べ替え可能なリスト

**v2**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type IDragEvent } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

makeDroppable(
  el,
  {
    events: {
      onDrop(e: IDragEvent) {
        const r = e.helpers.suggestSort('vertical');
        if (r) tasks.value = r.targetItems as Task[];
      },
    },
  },
  () => tasks.value,
);
</script>

<template>
  <div ref="el">
    <TransitionGroup name="list">
      <TaskItem v-for="(task, index) in tasks" :key="task.id" :task="task" :index="index" :tasks="tasks" />
    </TransitionGroup>
  </div>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task; index: number; tasks: Task[] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, { id: props.task.id }, () => [props.index, props.tasks]);
</script>

<template>
  <div ref="el" :class="{ 'is-dragging': isDragging }">{{ task.title }}</div>
</template>
```

**v3**

```vue [TaskList.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const tasks = defineModel<Task[]>({ required: true });
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, { items: tasks });
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [TaskItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');

const { isPlaceholder } = makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" :class="{ slot: isPlaceholder }">{{ task.title }}</li>
</template>
```

- ドラフトである `items` を描画します：ドラッグ中に並べ替わります。ドロップすると `tasks` が新しい順序を受け取り、`defineModel` が `update:modelValue` を発行します。
- インデックスも、ペイロードも、`onDrop` も、`<TransitionGroup>` も要りません：行は自分でスライドします。
- ドラッグ中の行は、着地する位置としてリストの中に残ります。隠すのではなく、`isPlaceholder` か `[data-dnd-placeholder]` でスタイルを付けてください。

### アイテムを共有するリスト

**v2**

```ts [Board.vue]
// Each column's makeDroppable calls this from its onDrop, with its array as the payload.
function applySort(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  const src = e.draggedItems[0]?.items;
  const tgt = e.hoveredDraggable?.items ?? e.dropZone?.items;

  if (src === todo.value) todo.value = r.sourceItems as Task[];
  else if (src === done.value) done.value = r.sourceItems as Task[];

  if (!r.sameList) {
    if (tgt === todo.value) todo.value = r.targetItems as Task[];
    else if (tgt === done.value) done.value = r.targetItems as Task[];
  }
}
```

**v3**

```vue [Column.vue]
<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskItem from './TaskItem.vue';

const props = defineProps<{ column: { id: string; tasks: Task[] } }>();
const el = useTemplateRef<HTMLElement>('el');

const { items } = makeSortableList(el, {
  id: props.column.id,                   // `from.list` and `to.list` in drop events
  items: toRef(props.column, 'tasks'),   // writable: the parent passes a reactive column
  group: 'board',                        // same name: tasks move between these lists
});
</script>

<template>
  <ul ref="el">
    <TaskItem v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>
```

```vue [Board.vue]
<script setup lang="ts">
import { reactive } from 'vue';
import Column from './Column.vue';

const columns = reactive([
  { id: 'todo', tasks: [{ id: 't1', title: 'Write the docs' }] },
  { id: 'done', tasks: [] },
]);
</script>

<template>
  <Column v-for="column in columns" :key="column.id" :column="column" />
</template>
```

ドロップは両方の配列に書き込みます：タスクが出ていった配列と、入った配列です。`TaskItem.vue` は上の並べ替え可能なリストのものと同じです。コピーを配るパレットは `suggestCopy()` と `copyOnly` フラグで作っていましたが、今はリストです：

```ts [Palette.vue]
makeSortableList(el, {
  items: blocks,
  group: { name: 'board', pull: 'clone', put: false },  // copies go out, nothing comes in
  sort: false,                                          // its own order stays
  clone: (block) => ({ ...block, id: crypto.randomUUID() }),
});
```

Pinia のストアや、直接書き込まないほかの状態では、`items` をゲッターで渡し、`onDrop` で `e.preventDefault()` を呼んで `e.result` を適用します：[制御されたリスト](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists)を参照してください。

### カスタムオーバーレイ

**v2**

```ts [TaskItem.vue]
makeDraggable(el, {
  render: markRaw(TaskOverlay),
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import { useDnDProvider } from '@vue-dnd-kit/core';

const { entities } = useDnDProvider();
const task = computed(() => {
  const [node] = entities.draggingMap.keys();
  return node ? (entities.draggableMap.get(node)?.data?.() as Task) : null;
});
</script>

<template>
  <div class="task-preview">{{ task?.title }}</div>
</template>
```

**v3**

```ts [TaskItem.vue]
makeDraggable(el, {
  id: () => props.task.id,
  overlay: TaskOverlay,
  data: () => props.task,
});
```

```vue [TaskOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean }>();
const task = computed(() => props.items[0]!.data as Task);
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the slot. -->
  <div class="task-preview" :class="{ refused: over && !accepted }">
    {{ task.title }}
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.task-preview { width: 100%; height: 100%; }
</style>
```

- コンポーネントはドラッグを props として受け取ります：`items`（ドラッグ中のすべてのアイテム、掴んだものが先頭）、`over`、`accepted`、`status`、`mode`、`to`。読むものだけを宣言してください。リストの行では、リストのアイテムは `items[0].item` です。
- そのまま渡します。切り替えるには `shallowRef` を使い、深い `ref` は決して使いません。

プロバイダーのスロットも同じように変わり、コンポーネントが自分で位置を決めることはなくなります：

**v2**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #preview>
    <MyOverlay />  <!-- moved itself with useDnDProvider().preview.position -->
  </template>
</DnDProvider>
```

**v3**

```vue [App.vue]
<DnDProvider>
  <RouterView />
  <template #overlay="{ items, over, accepted }">
    <MyOverlay :items="items" :over="over" :accepted="accepted" />
  </template>
</DnDProvider>
```

`DragPreview` を `<Transition>` で囲んでいたポップインは、`@starting-style` 付きの `overlay-class` になります：[持ち上げ、傾け、落ち着かせる](https://zizigy.github.io/docs/guides/animations#the-overlay-lift-tilt-settle)を参照してください。

### 確認してからのドロップ

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  events: {
    onDrop: (e) =>
      new Promise<void | boolean>((resolve) => {
        if (!window.confirm('Drop here?')) return resolve(false); // keep dragging
        place(e.draggedItems);
        resolve();
      }),
  },
});
```

**v3**

```ts [Zone.vue]
makeDroppable(el, {
  onBeforeDrop: () => (window.confirm('Drop here?') ? 'accept' : 'continue'),
  onDrop: (e) => place(e.active.items),
});
```

リストも同じように尋ね、Promise を使えば自作のダイアログを開けます。Promise が確定するまで、オーバーレイは離した場所で待ちます：

```ts [Column.vue]
makeSortableList(el, {
  items: toRef(props.column, 'tasks'),
  group: 'board',
  // `ask` opens a dialog and resolves 'accept', 'continue' or 'reject'.
  onBeforeDrop: (e) => (e.sameList ? 'accept' : ask(e)),
});
```

混在した選択のうち、一致する部分だけを受け取っていたゾーン（`groupMatch: 'some'`）：

**v2**

```ts [Zone.vue]
makeDroppable(el, {
  groups: ['frontend'],
  groupMatch: 'some',
  events: {
    onDrop: (e) => place(e.draggedItems), // only the items of the group arrive
  },
});
```

**v3**

```ts [Zone.vue]
import type { DragItem } from '@vue-dnd-kit/core';

const fits = (item: DragItem) => item.type.length === 0 || item.type.includes('frontend');

makeDroppable(el, {
  accept: 'frontend',
  acceptMode: 'some',
  onBeforeDrop: (e) => e.active.items.filter(fits).map((item) => item.id), // the others fly back
  onDrop: (e) => place(e.active.items.filter(fits)), // `active.items` still lists every dragged item
});
```

リストはこれをコードなしで行います：`acceptMode: 'some'` にすると、`group.put` が受け入れるアイテムは着地し、ほかは元の位置に戻ります。

## アップグレードの注意点

- **v3 は範囲を指定してインストールします**。`package.json` に `^3`：`npm update` では `^2` は v2 のままです。
- **ドラフトを描画します**。リストが描画するのは `makeSortableList` が返す `items` で、自分の配列ではありません。自分の配列を描画すると、ドロップするまで何も動きません。
- **二重に並べ替えません**。リストから `suggestSort` のコードを削除してください：リストは `onDrop` の後に、書き込み可能な `items` の ref に各ドロップを書き込みます。自分で適用するには、`e.preventDefault()` を呼んで `e.result` を使います。
- **false はドロップを拒否します**。v2 では、`false` で解決した `onDrop` はドラッグを続けました。v3 では `onBeforeDrop` から `'continue'` を返します。`onDrop` から返した Promise は無視されます。
- **リストが共有するのは同じ group の中だけです**。`group` のないリストは、ほかのどのリストともやり取りしません。
- **行のキーは id にします**。`:key="index"` では違う行がアニメーションします。id もデータから渡してください：デフォルトの id はコンポーネントのインスタンスごとに新しくなります。
- **<TransitionGroup> も、transform への transition も使いません**。ライブラリが自分で行を動かすので、動きが二重にアニメーションしてしまいます。
- **タッチの回避策を元に戻します**。アイテム全体の `touch-action: none` は、指の下でページがスクロールするのを妨げます。v3 は代わりに長押しでタッチのドラッグを始めます。すぐにドラッグしたいハンドルには、`activation: { touch: { distance: 4 } }` と一緒に残してください。
- **古い属性を削除します**。ライブラリは `tabindex`、`role`、必要な `aria-*` を設定し、自分で付けた属性は決して上書きしません。そのため、残った `role` や `aria-grabbed` は残したままになります。
- **オーバーレイのスタイルを付け直します**。`.dnd-kit-preview` はなくなりました：`[data-dnd-overlay='dragging']` の中身にスタイルを付け、ボックスの `transform` には決して触れません。オーバーレイコンポーネントのルートには `width: 100%; height: 100%` を指定し、レイアウトから `<DragPreview />` を取り除きます。
- **自動スクロールはオンです**。v2 でスクロールしなかった場所には `:auto-scroll="false"` を渡します。
- **選択枠にキーは要りません**。`makeSelectionArea` は、空いている場所を普通に押すだけで描画します。v2 の Ctrl を残すには `modifier` を追加します。
- **プロバイダーは 1 つ、エリアはその中に**。アイテムはプロバイダーをまたげません。ルールを分けるために領域ごとにプロバイダーを使っていたページでは、プロバイダーを 1 つにし、領域ごとに `makeDragArea` を使います。
- **引数は 2 つです**。`makeDraggable` と `makeDroppable` は ref とオプションのオブジェクトを受け取り、ペイロードはありません。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
