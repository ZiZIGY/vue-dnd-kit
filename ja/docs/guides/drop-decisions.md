---
title: "ドロップの判断"
description: "ドロップを受け入れる、拒否する、保留する——ドラッグ中または離したときのルール、マルチドラッグの一部、ダイアログ、先に同意が必要なサーバー、拒否権を持つモニター、すべてのターゲットの外へのドロップ。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/drop-decisions"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

カードを **Done** へドラッグしてみましょう。ドロップはあなたの答えを待ちます：カードを移動する、別の場所へドラッグし続ける、キャンセルする。

<example height="25rem" hint="カードを Done へドラッグしてみましょう" name="drop-confirm">



</example>

## onBeforeDrop

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => (e.items.some((task) => task.locked) ? 'reject' : 'accept'),
});
```

リスト、ツリー、ドロップターゲット（`makeDroppable`）、モニター（`useDnDMonitor`）は `onBeforeDrop` を受け取ります。これはドラッグが離されたとき、何かが変わる前に実行され、その答えが結果を決めます。

<table>
<thead>
  <tr>
    <th>
      答え
    </th>
    
    <th>
      起きること
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'accept'
      </code>
      
      、<code>
        true
      </code>
      
      、または何も返さない
    </td>
    
    <td>
      ドロップが成立します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'reject'
      </code>
      
       または <code>
        false
      </code>
    </td>
    
    <td>
      ドロップしません：アイテムは元の位置に戻ります。例外がスローされた場合も拒否になります。
    </td>
  </tr>
  
  <tr>
    <td>
      キーの配列
    </td>
    
    <td>
      そのアイテムだけがドロップされ、ほかは元の位置に戻ります。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'continue'
      </code>
    </td>
    
    <td>
      ドロップせず、ドラッグが続きます。
    </td>
  </tr>
  
  <tr>
    <td>
      これらのいずれかの Promise
    </td>
    
    <td>
      Promise が確定するまで、オーバーレイは離した場所で待ちます。
    </td>
  </tr>
</tbody>
</table>

リストとツリーは `SortableDropEvent` を渡します：`keys`、`items`、`from`、`to`、`mode`、`sameList`、そして `result`（ドロップで変わるすべてのリストの新しい配列）です。ドロップターゲットとモニターは汎用の `DnDEvent` を受け取ります：`active`、`over`、`position`、`source`。[イベント](https://zizigy.github.io/docs/api/events)を参照してください。

## ドラッグ中のルールか、離したときのルールか

Email と Chat は、どちらも 10 MB までの添付ファイルを受け入れます。**demo.mov** をそれぞれの上へドラッグしてみましょう。Email はホバー中に拒否し、Chat は受け入れてから、離したときに送り返します。

<example height="27rem" hint="10 MB を超えるファイルを、それぞれの場所へドラッグしてみましょう" name="drop-rules">



</example>

```ts [Column.vue]
// Asked while dragging: a refused drag never enters the list.
group: { name: 'attachments', put: ({ items }) => fits(items as Attachment[]) },

// Asked on release: the drag enters the list, then flies back.
onBeforeDrop: (e) => (fits(e.items) ? 'accept' : 'reject'),
```

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      <code>
        group.put
      </code>
      
      （またはターゲットの <code>
        accept
      </code>
      
      ）
    </th>
    
    <th>
      <code>
        onBeforeDrop
      </code>
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      問い合わせのタイミング
    </td>
    
    <td>
      ドラッグ中、ドラッグがリストに届いた時点で。
    </td>
    
    <td>
      ドラッグが離されたときに 1 回。
    </td>
  </tr>
  
  <tr>
    <td>
      ユーザーに見えるもの
    </td>
    
    <td>
      リストがすぐに拒否します：枠は開かず、<code>
        isAccepting
      </code>
      
       は <code>
        false
      </code>
      
      、<code>
        over.accepted
      </code>
      
       は <code>
        false
      </code>
      
      。
    </td>
    
    <td>
      枠はいつもどおり開き、離したときにアイテムが元の位置に戻ります。
    </td>
  </tr>
  
  <tr>
    <td>
      わかること
    </td>
    
    <td>
      何がドラッグされているか：<code>
        keys
      </code>
      
      、<code>
        items
      </code>
      
      、<code>
        types
      </code>
      
      、<code>
        from
      </code>
      
      、<code>
        to
      </code>
      
      。
    </td>
    
    <td>
      ドロップ全体：<code>
        to.index
      </code>
      
      、<code>
        sameList
      </code>
      
      、<code>
        mode
      </code>
      
      、<code>
        result
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      できること
    </td>
    
    <td>
      はい・いいえを答える。
    </td>
    
    <td>
      Promise を待つ、一部のキーを受け入れる、ドラッグを続けさせる。
    </td>
  </tr>
</tbody>
</table>

アイテムだけでわかること（型、フラグ、件数）には `group.put` を使ってください。ユーザーは離す前にそれを知ることができます。場所、ユーザーの答え、サーバーの答えに依存することには `onBeforeDrop` を使います。ターゲット自身のルールが先に来ます：ドラッグを拒否するリストやターゲットの上では、ドロップはキャンセルされ、その `onBeforeDrop` は問い合わせられません。

### アイテムの一部を受け入れる

ルールによっては、離したときにサーバーに問い合わせないと確認できません。このワークショップの席はほかの人も予約しています：離したとき、リストは残りの席数をサーバーに問い合わせ、ドラッグされてきた人のうちその数だけを受け入れます。何人かにチェックを入れ、まとめてドラッグしてみましょう。

<example height="28.5rem" hint="3 人にチェックを入れ、そのうち 1 人をワークショップへドラッグしてみましょう" name="drop-partial">



</example>

```ts [Column.vue]
makeSortableList(list, {
  items: toRef(props.column, 'people'),
  group: 'workshop',
  // Some keys: those land, the others fly back to where they came from.
  onBeforeDrop: async (e) => {
    const { free } = await seatsLeft(props.column.people.length); // the overlay waits
    return e.keys.slice(0, free);
  },
  onDrop: (e) => {
    selection.delete(...e.accepted); // the ones sent back stay selected
    notice.value = `${e.accepted.length} booked, ${e.rejected.length} back to the waiting list`;
  },
});
```

[マルチドラッグ](https://zizigy.github.io/docs/guides/multi-drag)では、返したキーのアイテムがまとめて着地し、残りは元の場所に戻ります。その後 `onDrop` はそれらを `e.accepted` と `e.rejected` で受け取り、その `e.result` が最終的な結果です。空の配列は何も受け入れないことを意味し、ドロップは拒否されます。

## ドラッグを続ける：'continue'

`'continue'` がキャンセルするのはドロップであって、ドラッグではありません。上のダイアログで **Keep dragging** を選んでみましょう。アイテムはその場所から手に持ったままになり、ページはドラッグモードに戻り、ユーザーはそのまま続けられます。

- マウスやペンでは、ボタンを押さなくてもアイテムがポインターに追従します。次に離したとき——つまりクリック——でドロップされ、そのクリックが下のページに届くことはありません。
- タッチでは、指を置いた場所でアイテムを再び掴み、指を離すとドロップします。
- キーボードドラッグは続きます：矢印キーでアイテムを動かし、:kbd{value="Space"} か <kbd value="Enter">



</kbd>

 でドロップします。
- <kbd value="Escape">



</kbd>

 はほかのドラッグと同じくキャンセルします。
- 次のドロップでは、再び `onBeforeDrop` に問い合わせます。

モニターには `onDragResume` が届き、スクリーンリーダーにはアイテムがドロップされずにまだ動いていることが読み上げられます（テキストはプロバイダーの `announcements.onDragResume` で上書きできます）。

```ts
useDnDMonitor({
  onDragResume() {
    hint.value = 'Still dragging: click to drop, Esc to cancel';
  },
});
```

## ユーザーに確認する

`onBeforeDrop` は Promise を返せます。ダイアログを開き、ユーザーが選んだボタンで Promise を解決してください。

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'release',
  onBeforeDrop: (e) => (props.column.confirm && !e.sameList ? props.ask(e) : 'accept'),
});
```

```ts [Board.vue]
type Answer = 'accept' | 'continue' | 'reject';
const question = shallowRef<{ title: string; resolve: (answer: Answer) => void } | null>(null);

/** Opens the dialog: `onBeforeDrop` waits for the button the user picks. */
const ask = (e: SortableDropEvent<Task>) =>
  new Promise<Answer>((resolve) => {
    question.value = { title: e.items[0]!.title, resolve };
  });
```

Promise が保留中の間：

- オーバーレイは離した場所で待ち、`data-dnd-overlay="dropping"` が付きます。
- `useDnD()` は離した時点の状態を保ち、`status` は `'dropping'` です。
- ページはドラッグモードを抜けます。カーソルとテキスト選択が戻るので、ダイアログはいつもどおり動作します。
- ほかのドラッグは開始できません。

<tip>

`showModal()` で開いたモーダルの `<dialog>` はトップレイヤーにあり、待機中のオーバーレイより上にあります。例のように、その `cancel` イベント（:kbd{value="Escape"}）を `'reject'` に変換してください。

</tip>

## フックの順序

メモを並べ替え、1 つをゴミ箱にドロップしてから、答えを切り替えてもう一度やってみましょう。パネルには直前のドロップのフックが実行順に表示されます。

<example height="27.5rem" hint="メモを動かすかゴミ箱に入れてから、答えの 1 つを reject か continue に切り替えてみましょう" name="drop-hooks">



</example>

1. すべての `useDnDMonitor` の `onBeforeDrop` を順に。`'reject'` か `'continue'` で問い合わせは終わり、キーはドロップを絞り込みます。
2. ターゲットの `onBeforeDrop`：アイテムが入るリストまたはツリー、あるいはドロップターゲット。
3. ターゲットの `onDrop` だけ：アイテムが別のリストへ出ていくリストには問い合わせず、その新しい配列はターゲットの `e.result` に入っています。アイテムが取り除かれる場合（ゴミ箱ゾーン、`dropOutside: 'remove'`）は、そのリストの `onDrop` が `to.index` を `-1` として実行されます。
4. デフォルトの書き込み：ドロップで変わる各リストが新しい配列を受け取ります。
5. プロバイダーの `onDragEnd`（`@drag-end`）とモニターの `onDragEnd`。その後、オーバーレイが着地し、`onDragSettle`（`@drag-settle`）が着地したことを伝えます。

拒否されたドロップは代わりに `onDragCancel`（`@drag-cancel`）へ進み、アイテムは元の位置に戻ります。`'continue'` も問い合わせを終わらせ、`onDragResume` が呼ばれます：ドラッグは続き、次のドロップで再び問い合わせます。

モニターはターゲットより先に判断するので、リストが自身のドロップを適用した後で拒否されることはありません。そのため、アプリのすべてのドロップに関するルールはモニターに置くのが適しています。

```ts [Monitor.vue]
const { syncing } = useSync();

// Read-only while syncing: every drop under the provider flies back.
useDnDMonitor({
  onBeforeDrop: () => (syncing.value ? 'reject' : 'accept'),
});
```

## onDrop：書き込みの前に通知される

```ts
makeSortableList(listRef, {
  items: tasks,
  onDrop: (e) => {
    // `tasks` still holds the old order, `e.result` the new one.
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

リストの `onDrop` は、ドロップが受け入れられると、リストが書き込む直前に同期的に実行されます。書き込みの後に処理するには、プロバイダーの `@drag-end` か `useDnDMonitor({ onDragEnd })` を使ってください。通常のドロップターゲットでは、`onDrop` がデータを変更する場所です。ライブラリはそのために何も動かしません。

## ストアとサーバー：制御されたリスト

```ts
const store = useBoardStore();
const { items } = makeSortableList(listRef, {
  id: 'todo',
  group: 'board',
  items: () => store.lists.todo, // a getter: read-only
  onDrop: (e) => {
    e.preventDefault();
    for (const [listId, next] of e.result) store.setList(listId, next);
  },
});
```

ライブラリがドロップを書き込むのは、書き込み可能な ref だけです。ゲッター、`computed`、`readonly` の ref には書き込みません。`e.preventDefault()` を呼び、`e.result`——ドロップで変わるすべてのリストの新しい配列（リストの id ごと）——を自分で適用してください。`preventDefault()` はそれらすべてへの書き込みをスキップします。一部だけ書き込むと、アイテムが失われたり重複したりするためです。読み取り専用のリストのドロップをライブラリに任せたままにすると、開発ビルドで警告が出ます。

### 先にサーバーへ保存する

サーバーを **flaky**（リクエストが 1 回おきに失敗）か **down** にしてカードを動かしてみましょう。リクエストの間、カードはバッジを付けて待ち、その後着地するか、失敗したら元の位置に戻ります。

<example height="31.5rem" hint="カードを動かしてから、サーバーを flaky か down に切り替えてみましょう" name="drop-server">



</example>

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  // A getter: the library never writes it. The drop is applied below, once saved.
  items: () => board[props.id]!,
  group: 'sprint',
  onBeforeDrop: async (e) => {
    e.preventDefault();
    try {
      await saveMove(e.keys, e.to);
    } catch {
      return 'reject'; // nothing applied: the card flies back
    }
    for (const [id, tasks] of e.result) board[id] = tasks; // lands in its new place
    return 'accept';
  },
});
```

Promise が解決する前に `e.result` を適用すれば、オーバーレイは新しい順序に着地します。リクエストが失敗したら、何も適用せずに拒否してください。アイテムは元の位置に戻り、モニターには `onDragCancel` が届きます。

バッジは、すべてのドラッグのオーバーレイを描画するプロバイダーの `#overlay` スロットから来ています。`DragPreview` がいつものカードのコピーを表示し、リクエストの間はバッジがその上に載ります。

```vue [index.vue]
<DnDProvider>
  <Board />
  <template #overlay="{ active }">
    <div class="carried">
      <DragPreview :id="active.id" />
      <span v-if="saving" class="saving">Saving…</span>
    </div>
  </template>
</DnDProvider>
```

## すべてのターゲットの外へのドロップ

それぞれのモードで、アプリを Dock の外へドラッグして離してみましょう。

<example height="24.5rem" hint="アプリを Dock の外へドラッグして離してみましょう" name="drop-outside">



</example>

```ts [Dock.vue]
const { items } = makeSortableList(dock, {
  items: apps,
  strategy: 'horizontal',
  dropOutside: () => props.dropOutside,
  // Called on the list the items leave, with `to.index` -1, when they are removed.
  onDrop: (e) => {
    if (e.to.index === -1) notice.value = `Removed ${e.items.map((app) => app.name).join(', ')}`;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      すべてのターゲットの外へのドロップは…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
    </td>
    
    <td>
      プレースホルダーのある場所、つまりリストが最後に表示した場所に着地します。デフォルトです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      キャンセルされます：アイテムは元の位置に戻ります。<code>
        placeholder: 'indicator'
      </code>
      
       のときのデフォルトです。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      アイテムをリストから取り除きます。まずリストの <code>
        onBeforeDrop
      </code>
      
       に問い合わせ、その <code>
        onDrop
      </code>
      
       は <code>
        to.index
      </code>
      
       として <code>
        -1
      </code>
      
       を受け取ります。
    </td>
  </tr>
</tbody>
</table>

ドロップ時に読み取られるので、ref やゲッターで切り替えられます。ゴミ箱ゾーンは同じことを意図的に行います：`makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`。[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop)を参照してください。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
