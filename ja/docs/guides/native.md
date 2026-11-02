---
title: "ファイルとほかのアプリ"
description: "ブラウザー自身のドラッグ＆ドロップを、ライブラリのドラッグとして——ほかのアプリからのファイル、リンク、テキストをドロップターゲットや場所を空けるリストへ、ページの外へドラッグされるアイテム、そしてアプリのウィンドウ間で。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/native"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

ライブラリのドラッグはページの中で起こります。ブラウザーには、ページの端を越える独自のドラッグ＆ドロップがあります：デスクトップからのファイル、別のタブからのリンク、別のアプリからのテキスト、そしてそのすべてへドラッグして出ていくあなたのアイテム。ライブラリはこうしたドラッグも、プロバイダーのドラッグとして実行します：ターゲットは強調表示され、リストは場所を空け、イベントもスクリーンリーダー向けのテキストもいつもどおりです。

<example height="34rem" hint="ほかのアプリから画像、リンク、テキストをドロップしてみましょう。カードを外へドラッグしたり、2 つ目のウィンドウで開いたこのページへドラッグしたりもできます" name="moodboard">



</example>

## ページの外から

ターゲットは `external` でこうしたドラッグを受け取り、何を受け取るかを指定します。これを持たないターゲットは、こうしたドラッグを無視します。

```ts [Board.vue]
const { items } = makeSortableList(grid, {
  items: cards,
  group: 'moodboard',
  strategy: 'grid',
  external: { files: 'image/*', links: true, text: true },
  createItem: fromOutside,
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        external
      </code>
    </th>
    
    <th>
      受け取るもの
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      ファイル：<code>
        true
      </code>
      
       ならすべて。<code>
        <input accept>
      </code>
      
       と同じ書き方の MIME タイプと拡張子（<code>
        'image/*, .md'
      </code>
      
      ）、またはファイルごとに呼ばれる関数。フォルダーは決して受け取りません。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        multiple
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
      
      ：一度に 1 ファイル。複数のドラッグは拒否されます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        links
      </code>
    </td>
    
    <td>
      リンク（<code>
        text/uri-list
      </code>
      
      ）：別のタブからのアドレス、ページ内のリンク。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        text
      </code>
    </td>
    
    <td>
      プレーンテキスト：別のアプリで選択したテキスト。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      そのほかの MIME タイプ。ほかのアプリが提供するとおりに指定します。
    </td>
  </tr>
</tbody>
</table>

`makeDroppable` も同じオプションを受け付けます：アバター画像を受け取るゾーンは[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop#files-from-the-computer)にあります。

### ドラッグが運ぶもの

ブラウザーは、ドロップされるまでドラッグのデータを渡しません。ドラッグ中にページにわかるのは、どんな種類のデータを運んでいるかだけです。`active.external` と `e.external` は、わかっていることを伝えます。

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      ドラッグ中
    </th>
    
    <th>
      ドロップ時
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      提供している MIME タイプ：<code>
        Files
      </code>
      
      、<code>
        text/uri-list
      </code>
      
      …
    </td>
    
    <td>
      同じ
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fileTypes
      </code>
    </td>
    
    <td>
      ファイルごとに 1 つの MIME タイプ
    </td>
    
    <td>
      同じ
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      空
    </td>
    
    <td>
      ターゲットが受け取るファイル（<code>
        File
      </code>
      
       として）
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        urls
      </code>
      
      、<code>
        text
      </code>
      
      、<code>
        html
      </code>
    </td>
    
    <td>
      空
    </td>
    
    <td>
      リンク、テキスト、HTML
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        getData(type)
      </code>
    </td>
    
    <td>
      <code>
        ''
      </code>
    </td>
    
    <td>
      提供している任意のタイプのデータ
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ready
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
  </tr>
</tbody>
</table>

### リストへ

リストは、通常のドラッグ可能な要素と同じく `createItem` で場所を空けます。`createItem` は 2 回呼ばれます：ドラッグ中には行き先を示すアイテムのために、ドロップ時にはデータとともに、中に入れるもののために。アイテムの配列を返すと、すべてがその位置に挿入されます：画像 1 枚につき 1 枚のカードです。

```ts [cards.ts]
export const fromOutside = (active: Active): Card | Card[] | undefined => {
  const { external } = active;
  if (!external) return undefined;
  // While it is held: a tile that says what is coming.
  if (!external.ready) return { id: 'incoming', kind: 'incoming', label: incoming(external) };
  // At the drop: a card each.
  if (external.files.length) {
    return external.files.map((file) => ({ id: uid(), kind: 'image', src: URL.createObjectURL(file), name: file.name }));
  }
  if (external.urls.length) return external.urls.map((url) => ({ id: uid(), kind: 'link', url, title: host(url) }));
  const text = external.text.trim();
  return text ? { id: uid(), kind: 'note', text } : undefined;
};
```

- 届く途中のタイルは、ほかと同じくリストの 1 行です：リストがそれを描画し、周りの行はスライドして道を空け、`onDrop` は本物のアイテムを受け取ります。
- ツリーもこうしたドラッグを受け取りますが、一度に 1 ノードです：ファイルごとに子を持つフォルダーノードなら、複数のファイルを保持できます。
- ドロップイベントには、データの入った `e.external` があります。リストの `onDrop` でも、モニターでも同じです。

## ページの外へ

`native` を指定すると、アイテムのマウスドラッグはブラウザー自身のドラッグになるので、ページの外へ出られます：デスクトップへ、エディターへ、チャットへ、別のタブへ。

```ts [Tile.vue]
makeSortableItem(el, {
  item: () => props.card,
  native: { data: () => toOutside(props.card) },
});
```

```ts [cards.ts]
case 'link':
  return { 'text/uri-list': card.url, 'text/plain': card.url };
case 'note':
  return { 'text/plain': card.text };
```

- `data` は、アイテムを MIME タイプとテキストとしてほかのアプリに渡します：`text/plain`、`text/uri-list`、`text/html`。ドラッグの開始時に読み取られます。これがない場合、`native: true` は `label` をテキストとして運びます。
- ページ上では、ドラッグはほかと同じように動きます：ターゲット、場所を空けるリスト、ドロップ。オーバーレイの代わりにブラウザーがドラッグ中の画像を描き、要素はその場に残ります（`overlay: false` でも `transform` は `null` のままです）。
- アイテムのタッチドラッグとキーボードドラッグは、ライブラリのドラッグのままです：ブラウザーにはそれら用の独自のドラッグがありません。
- `effect`（`effectAllowed`）は、ドロップ先が何をしてよいかを示します：デフォルトは `'copyMove'`。ほかの場所でドロップされると、ドラッグは `droppedOutside` が `'move'`、`'copy'`、`'link'` のいずれかになって終わり、それを `onDragEnd` で受け取れます。移動ならアイテムはリストから取り除かれ、コピーなら残ります。

`makeDraggable` も同じように `native` を受け付けます。

## ウィンドウ間

`native` を持つアイテムは、自分自身も運びます：あなたのアプリの別のウィンドウにある同じグループのリストは、自分のリストの 1 つから来たかのようにそれを受け入れます。ムードボードを 2 つ目のウィンドウで開き、カードをドラッグして移してみてください。

- ドラッグ中から、もう一方のウィンドウはすでにアイテムを持っています：そのリストは行き先の位置にアイテムを表示します。
- ドロップでアイテムはそちらに入り、こちらではリストから出ていきます（ドロップは移動だったためです）。代わりにコピーするには、:kbd{value="Ctrl"}（Mac では <kbd value="Option">



</kbd>

）を押したままにします。
- `createItem` を持つリストは、こうしたアイテムについても呼ばれます。そのとき `active.external.group` が設定され、アイテムは `active.items[].item` に入っています：それらを返すか、そのウィンドウのキーを持つコピーを返してください。`createItem` がなければ、アイテムはそのまま入ります。
- アイテムは JSON として運ばれます：日付は文字列になり、関数は省かれます。

## 制限

- データはドロップのときにだけ届き、それより前には決して届きません：ドラッグ中に表示するアイテムは、データなしで成り立つように設計してください。
- ファイルのドラッグは、マウスやトラックパッドを使う人のためのものです。ゾーンの隣に `<input type="file">` も用意してください。
- ページの外からのドラッグを受け取るプロバイダーは、ページに 1 つだけです：それらのためのターゲットを持つ最初のプロバイダーです。
- Firefox では、ドラッグ中に別のリストへ移されたあと、別のウィンドウでドロップされたアイテムは、そのドロップを知ることができません：こちらでは元の場所に残ります。
- JSON が 16 KB を超えるアイテムも別のウィンドウへ行けますが、そのウィンドウはドロップ時にしかアイテムを表示しません。

API は [makeDroppable](https://zizigy.github.io/docs/api/make-droppable#from-outside-the-page) と [makeDraggable](https://zizigy.github.io/docs/api/make-draggable#out-of-the-page) にあります。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
