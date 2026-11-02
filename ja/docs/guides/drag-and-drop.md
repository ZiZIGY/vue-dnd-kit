---
title: "ドラッグ＆ドロップ"
description: "makeDraggable による自由なドラッグと makeDroppable によるドロップターゲット——一部のドラッグを受け入れて他を拒否する型付きのターゲット、間取り図、ゴミ箱ゾーン、リスト内のフォルダー、リストが受け入れる通常のアイテム。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/drag-and-drop"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

並べ替え可能なリストではないものには、すべて `makeDraggable` と `makeDroppable` を使います：ゴミを分別箱へ、家具を間取り図の上へ、ファイルをフォルダーへ、ゴミ箱、チェス盤。

<example height="29rem" hint="ゴミを分別箱に振り分けてみましょう。電池を受け入れる箱はありません" name="recycling">



</example>

## ドラッグ可能な要素

```vue [WasteItem.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ waste: { id: string; name: string; type: string } }>();
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,      // read back as `active.id`
  type: () => props.waste.type,  // matched by the targets' `accept`
  data: () => props.waste,       // anything: `active.data`
});
</script>

<template>
  <div ref="el" :class="{ dragging: isDragging }">{{ waste.name }}</div>
</template>
```

id はデータから、ゲッターとして渡します。デフォルトの id は `useId()` から生成され、コンポーネントのインスタンスごとに新しくなるため、アプリの他の部分にとっては意味を持ちません。オプションは必要になった時点で読み取られるので、ゲッターや ref を使えば常に最新の値になります。

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
        id
      </code>
      
      、<code>
        data
      </code>
      
      、<code>
        type
      </code>
    </td>
    
    <td>
      何がドラッグされるか、何を運ぶか、ターゲットの <code>
        accept
      </code>
      
       が何と照合するか。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      内側のセレクターまたは要素：それだけがドラッグを開始します。<a href="/docs/guides/sortable-lists#handles">
        ハンドル
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      ドラッグを開始しません。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlay
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      （デフォルト）：コピーがポインターに追従します。コンポーネント：独自のプレビュー。<code>
        false
      </code>
      
      ：要素自体が動きます（<a href="#without-an-overlay">
        後述
      </a>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        axis
      </code>
      
      、<code>
        modifiers
      </code>
    </td>
    
    <td>
      ドラッグを <code>
        'x'
      </code>
      
       または <code>
        'y'
      </code>
      
       に固定する、スナップする、境界内に収める：<a href="/docs/guides/constraints">
        制約
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboard
      </code>
    </td>
    
    <td>
      矢印キーでの動かし方：ピクセル単位（デフォルト）か、ターゲットからターゲットへ（<a href="#keyboard">
        後述
      </a>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
      
      、<code>
        canDrag
      </code>
    </td>
    
    <td>
      押下がいつドラッグになるか：<a href="/docs/guides/sensors">
        センサー
      </a>
      
      を参照。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        attributes
      </code>
    </td>
    
    <td>
      キーボードとスクリーンリーダー向けの <code>
        role
      </code>
      
      、<code>
        tabindex
      </code>
      
      、<code>
        aria-*
      </code>
      
      （デフォルト <code>
        true
      </code>
      
      ）。
    </td>
  </tr>
</tbody>
</table>

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
        isDragging
      </code>
    </td>
    
    <td>
      この要素がドラッグされています。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      書き込み可能で、プロバイダーの<a href="/docs/guides/multi-drag">
        選択
      </a>
      
      にバインドされています。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      ドラッグのオフセット。<code>
        overlay: false
      </code>
      
       用です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        id
      </code>
    </td>
    
    <td>
      使用中の id。
    </td>
  </tr>
</tbody>
</table>

ボタン、入力欄、その他の操作可能な子要素はポインタードラッグを開始しないので、ドラッグ可能な要素の中でもそのまま動作します。すべてのオプションは [makeDraggable API](https://zizigy.github.io/docs/api/make-draggable) にあります。

## ドロップターゲット

```vue [Bin.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[] }>();
const emit = defineEmits<{ drop: [id: Key] }>();
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,   // 'glass', ['paper', 'cardboard'], a function…
  onDrop: (event) => emit('drop', event.active.id),
});
</script>

<template>
  <section ref="el" :class="{ accepting: isAccepting, over: isOver && isAccepting, refused: isOver && !isAccepting }">
    <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" />
  </section>
</template>
```

<table>
<thead>
  <tr>
    <th>
      戻り値
    </th>
    
    <th>
      <code>
        true
      </code>
      
       になる条件
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isOver
      </code>
    </td>
    
    <td>
      ドラッグがこのターゲットの上にある。受け入れるかどうかは問いません。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAccepting
      </code>
    </td>
    
    <td>
      何かがドラッグされていて、このターゲットがそれを受け入れる：有効なターゲットを強調表示するのに使います。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placement
      </code>
    </td>
    
    <td>
      真偽値ではありません：<code>
        { top, right, bottom, left }
      </code>
      
      、ポインターがターゲットのどの半分にあるか。ホバーされていなければ <code>
        null
      </code>
      
      。「このカードの前 / 後」に使います。
    </td>
  </tr>
</tbody>
</table>

`isAccepting` なしの `isOver` は、ドラッグが受け入れないターゲットの上にあることを意味します。上の分別箱のように、それを表示しましょう。そこでのドロップはキャンセルされ、アイテムは元の位置に戻ります。アイテムを運んでいる間、受け入れられない箱は薄くなります。ほかの見せ方は[スタイリング](https://zizigy.github.io/docs/guides/styling#drop-targets-yes-and-no)にあります。

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
        id
      </code>
      
      、<code>
        data
      </code>
    </td>
    
    <td>
      <code>
        over.id
      </code>
      
       と <code>
        over.data
      </code>
      
       として読み取れます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
      
      、<code>
        acceptMode
      </code>
    </td>
    
    <td>
      どのドラッグを受け入れるか（<a href="#which-drags-a-target-takes">
        次のセクション
      </a>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      何も受け入れず、ドラッグはその上を通り過ぎます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        priority
      </code>
    </td>
    
    <td>
      ネストせずに重なったターゲットでは、値が大きいほうが優先されます（デフォルト 0）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnter
      </code>
      
      、<code>
        onDragLeave
      </code>
    </td>
    
    <td>
      ドラッグが入った、または出た。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
      
      、<code>
        onDrop
      </code>
    </td>
    
    <td>
      ドロップを判断し、適用します（<a href="#the-drop">
        後述
      </a>
      
      ）。
    </td>
  </tr>
</tbody>
</table>

## ターゲットが受け入れるドラッグ

ドラッグ可能な要素の `type` は、ターゲットの `accept` と照合されます。

<table>
<thead>
  <tr>
    <th>
      <code>
        accept
      </code>
    </th>
    
    <th>
      受け入れるもの
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      省略または <code>
        '*'
      </code>
    </td>
    
    <td>
      すべて。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'glass'
      </code>
    </td>
    
    <td>
      <code>
        glass
      </code>
      
       型のドラッグ可能な要素と、型のないもの。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ['paper', 'cardboard']
      </code>
    </td>
    
    <td>
      どちらかの型と、型のないもの。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ({ active, items, types }) => boolean
      </code>
    </td>
    
    <td>
      関数が決めたもの。
    </td>
  </tr>
</tbody>
</table>

`type` のないドラッグ可能な要素は、どの文字列のルールにも合致します。`type` は配列にもできます（`['paper', 'large']`）：1 つでも合致すれば十分です。関数なら、ドラッグに関するどんな情報でも判断に使えます。上のコンポスト箱は、アイテムの型ではなくデータを読み取っています。

```ts [waste.ts]
{
  id: 'compost',
  accept: ({ items }) => items.every((item) => (item.data as Waste).compostable),
}
```

`accept` は、ドラッグがターゲットを探している間にその場で読み取られます。ref を渡せば変更できます。

複数のアイテムを同時にドラッグする場合、`acceptMode` はいくつ合致する必要があるかを指定します：`'all'`（デフォルト）または `'some'`。`'some'` では、残すアイテムの id を `onBeforeDrop` から返すと、それ以外は元の位置に戻ります。[ドロップの判断](https://zizigy.github.io/docs/guides/drop-decisions)を参照してください。

## ドロップ

通常のドロップターゲットの `onDrop` は、**あなた**がデータを変更する場所です。ライブラリが自分で何かを動かすことはありません。

```vue [index.vue]
<script setup lang="ts">
/** Where each item is: the tray or a bin. */
const place = reactive<Record<string, string>>(Object.fromEntries(WASTE.map((waste) => [waste.id, 'tray'])));
const itemsIn = (bin: string) => WASTE.filter((waste) => place[waste.id] === bin);
const drop = (bin: string, id: Key) => (place[String(id)] = bin);
</script>

<template>
  <Bin v-for="bin in BINS" :key="bin.id" :bin="bin" :items="itemsIn(bin.id)" @drop="drop(bin.id, $event)" />
</template>
```

<table>
<thead>
  <tr>
    <th>
      イベントのフィールド
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
      ドラッグ：<code>
        id
      </code>
      
      、<code>
        ids
      </code>
      
      、<code>
        items
      </code>
      
      （それぞれ <code>
        { id, data, type, item }
      </code>
      
      ）、<code>
        data
      </code>
      
      、<code>
        type
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
      このターゲット：<code>
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
        pointer
      </code>
      
      、<code>
        delta
      </code>
    </td>
    
    <td>
      ポインターの位置と、開始位置からの移動量。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      ドラッグ中のボックスがこのターゲットの中のどこにあるか（<a href="#leave-it-where-it-was-dropped">
        次のセクション
      </a>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        source
      </code>
    </td>
    
    <td>
      アイテムが並べ替え可能なリストから来た場合に設定されます：<code>
        { list, remove() }
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

`active.ids` にはドラッグ中のすべての id が入り、掴んだものが先頭です。順序は `onBeforeDrop`（判断）、`onDrop`（適用）、そしてプロバイダーの `drag-end` です。ページのすべてのドラッグを 1 か所で受け取るには `useDnDMonitor` を使います（[プロバイダー](https://zizigy.github.io/docs/guides/provider)を参照）。ドロップの前に確認する、ドラッグを続ける、一部のアイテムだけを受け入れるには、[ドロップの判断](https://zizigy.github.io/docs/guides/drop-decisions)を参照してください。

## ドロップした場所に置く

間取り図、キャンバス、ボード：アイテムは離した場所にとどまります。どのイベントも `position` を持ちます。これは、絶対配置したアイテムをドロップした位置に置くための `left` / `top` です。

<example height="28rem" hint="家具を部屋にドラッグし、動かしたり、元に戻したりしてみましょう" name="room-planner">



</example>

```ts [Planner.vue]
const room = useTemplateRef<HTMLElement>('room');
makeDroppable(room, {
  id: 'room',
  onDrop: ({ active, position }) => {
    const piece = find(active.id);
    if (!piece || !position || !room.value) return;
    // Clamped, so a piece let go half outside stays inside the walls.
    piece.x = clamp(position.x, room.value.clientWidth - piece.width);
    piece.y = clamp(position.y, room.value.clientHeight - piece.height);
    piece.place = 'room';
  },
});
```

```vue [Piece.vue]
<div ref="el" class="piece" :style="{ left: `${piece.x}px`, top: `${piece.y}px` }">…</div>
```

`position` は `over` の中でのドラッグ中のボックスの左上の角で、パディングの端から測り、スクロール量を加えた値です。部屋のボーダー、つまり壁は含まれません。何もない上では `null` です。

<tip>

`active.rect` と `delta` から位置を計算しないでください。ターゲットのボーダーとスクロールが抜け落ちます。こうしたボード向けのグリッド、境界、軸の固定は[制約](https://zizigy.github.io/docs/guides/constraints)にあります。

</tip>

## オーバーレイなし

デフォルトでは要素のコピーがポインターに追従し、要素自体はその場にとどまります：倉庫にある家具がそうです。`overlay: false` ではコピーがなく、ドラッグが返す `transform` で要素自体が動きます：部屋の中の家具がそうです。

```ts [Piece.vue]
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),   // a value or a ref, read when the drag starts
});

const style = computed(() => ({
  left: `${props.piece.x}px`,
  top: `${props.piece.y}px`,
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
```

- このとき `position` は要素自身の角になるので、ドロップのハンドラーはそのままで構いません。
- 動いている間、要素はポインターの下にあります。ターゲットを探すとき、ライブラリはそれを透過して見ます。ドラッグ中は隣の要素より上に表示してください（`z-index`）。
- 要素はページと一緒にスクロールしますが、オーバーレイはしません。`transform` はドラッグ開始以降にコンテナーが動いた分を差し引くので、ページがスクロールしても要素はポインターの下にとどまります。
- 要素は自身のコンテナーの中で動きます。`overflow: hidden` の親に切り取られ、どの要素の上を通るかはスタッキングコンテキストで決まります。オーバーレイにはどちらの問題もありません。

コピーの代わりに独自のプレビューを使うには、[オーバーレイ](https://zizigy.github.io/docs/guides/overlay)を参照してください。

## ゴミ箱ゾーン

並べ替え可能なリストから始まったドラッグは `e.source` を持ちます。`remove()` を呼ぶと、リストはそのアイテムを取り除きます。

<example height="34rem" hint="通知を Done か Delete にドラッグしてから、元に戻してみましょう" name="triage">



</example>

```ts [Triage.vue]
const triage = (bin: 'done' | 'deleted') => (e: DnDEvent) => {
  bins[bin].push(...e.active.items.map((entry) => entry.item as Notice));
  e.source?.remove();
};

makeDroppable(doneZone, { id: 'done', onDrop: triage('done') });
makeDroppable(trashZone, { id: 'trash', onDrop: triage('deleted') });
```

- `e.active.items[i].item` はリストのアイテムそのものです。保持しておけば、元に戻すときに元の位置へ戻せます。
- その後、リスト自身の `onDrop` が `to.index === -1` で実行され、`e.result` にはアイテムを除いたリストが入ります。
- アイテムがもうどこにも表示されないので、オーバーレイはゾーンの中へ縮んでいきます。
- リストは、すべての外にドロップされたものを取り除くこともできます：[`dropOutside`](https://zizigy.github.io/docs/guides/shared-lists#dropping-outside) を参照。

<note>

キーボードでは、矢印キーはリストのアイテムをそのリストの枠と同じグループのリストの間で動かします。リストの端を越えると、次の押下でその方向にあるドロップターゲット（ここではゴミ箱）へアイテムを運び、逆向きの矢印キーで元に戻せます。それでも、多くの人にとってはボタン、メニュー、`Delete` キーのほうが速いので、そのいずれかも用意してください。

</note>

## 並べ替え可能なアイテムへのドロップ

並べ替え可能なリストの行もドロップターゲットにできます：ブックマークを受け入れるフォルダーや、タスクを受け入れるグループなどです。アイテムの要素にドロップ可能な設定を追加します。

<example height="28rem" hint="リンクをフォルダーの中央にドロップしてみましょう。端の近くでは並べ替えになります。フォルダーを開くとリンクを外へドラッグできます" name="bookmarks">



</example>

```ts [FolderRow.vue]
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.folder, type: 'folder' });

const { isOver } = makeDroppable(el, {
  accept: 'link',
  onDrop: (e) => {
    emit('add', e.active.items.map((entry) => entry.item as Link)); // Bookmarks adds them
    e.source?.remove();   // take them out of the list they came from
  },
});
```

開いたフォルダーは、リンクを同じグループのリストとして表示します。このリストはリンクだけを受け入れます：リンクはそこで並べ替えられ、トップレベルやほかのフォルダーへドラッグして戻せます。

リストがそのドラッグを並べ替えようとしている間、このようなターゲットが有効になるのはアイテムの**中央**（リストの軸方向で 25〜75%）だけです。そこでのドロップはアイテムの中に入り、リストは動きません。端の近くでは、リストはいつもどおり並べ替えます。

- `accept` がドラッグを拒否するターゲットはスキップされます。リストはそのアイテムの上でも、ほかのアイテムと同じように並べ替えます。フォルダーはリンクしか受け入れないので、ドラッグしたフォルダーは、ほかのフォルダーを越えて並べ替えられます。
- ターゲットが自分自身のドラッグを受け取ることはありません。
- キーボードでは、矢印キーはまずフォルダーで止まり、同じ方向にもう一度押すとそれを越えて進みます。
- ドロップ後はアイテムが表示されなくなるので、オーバーレイは元の位置に戻る代わりにフォルダーの中へ縮んでいきます。
- フォルダーの上では、リストはドラッグした行の位置を元の場所に保つので、ポインターの下で何もずれません。このときその位置には `data-dnd-placeholder="into"` が付きます：ドロップはそこには入らないので、必要なら隠してください（`[data-dnd-placeholder='into'] { opacity: 0 }`）。

[ファイルマネージャー](https://zizigy.github.io/docs/examples/file-manager)は同じことをグリッドで、入れ子のフォルダーとともに行っています。

## 通常のドラッグ可能な要素をリストへ

並べ替え可能なリストは、`makeDraggable` でドラッグされた要素からアイテムを作る方法を知っていれば、それを受け入れます。

<example height="26rem" hint="ブロックを予定表にドラッグしてみましょう。時刻がドラッグに合わせて変わります" name="day-planner">



</example>

```ts [Agenda.vue]
const { items } = makeSortableList(list, {
  items: agenda,
  createItem: (active) => ({ ...(active.data as Block), id: `entry-${++created}` }),
});
```

ドラッグ可能な要素がリストの上にある間、作成されたアイテムはドラフトの中にあり、ほかの行と同じようにテンプレートで描画されます。予定表の時刻はすでにそれを数に入れています。ドロップすると実際のアイテムになり（`mode: 'insert'`、`from.list === null`）、オーバーレイはその上に着地します。

- 拒否するには `undefined` を返します。`createItem` のないリストは通常のドラッグ可能な要素を無視します。
- 新しいアイテムには独自のキーを与えてください。ブロックはパレットに残ります。
- キーボードでは、リストに向かう矢印キーでドラッグ可能な要素がその高さでリストに取り込まれ、その後の矢印キーで枠ごとに動きます。

## コンピューターからのファイル

デスクトップやファイルマネージャーからドラッグされてきたファイルは、ライブラリのドラッグではありません：運んでいるのはブラウザーです。ドロップターゲットは `external` でそれを受け取り、ドロップすると `e.external` に入って届きます。

<example height="22rem" hint="コンピューターから画像や PDF ファイルをゾーンにドラッグしてみましょう" name="file-drop">



</example>

```ts [AvatarDrop.vue]
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});
```

- `files` は `<input accept>` と同じ書き方です：MIME タイプ（`image/*`、`application/pdf`）と拡張子（`.md`）。`true` はすべてのファイルを受け取り、関数ならファイルごとに判断します。`links` と `text` はほかのアプリやタブからドラッグされたものを、`types` はそのほかの MIME タイプを受け取ります。
- このドラッグはプロバイダーのドラッグとして動きます：`isOver`、`isAccepting`、イベント、読み上げは、ほかのドラッグと同じように働きます。`external` のないターゲットはこれを無視します。オーバーレイはありません：ドラッグ中の画像はブラウザーが描きます。
- ファイルがページの上にある間、ブラウザーが教えるのはタイプだけです（`e.external.fileTypes`）。名前、サイズ、内容はドロップとともに届き、拡張子もそのときに確認されます。フォルダーは除外されます。`multiple: false` では、複数ファイルのドラッグは拒否されます。

リストもファイル、リンク、テキストを受け取り、ドラッグ中にそれらのための場所を空けます。アイテムはページの外へ、ほかのアプリやあなたのアプリの別のウィンドウへ出ていくこともできます：[ファイルとほかのアプリ](https://zizigy.github.io/docs/guides/native)を参照してください。

<tip>

キーボードやスクリーンリーダーのユーザーはファイルをドラッグできません。デモの Browse のように、ゾーンの隣に `<input type="file">` を用意してください。

</tip>

## キーボード

フォーカスされたドラッグ可能な要素は <kbd value="Space">



</kbd>

 または <kbd value="Enter">



</kbd>

 で持ち上げ、同じキーでドロップし、:kbd{value="Escape"} でキャンセルします。その間は矢印キーで動かします。

<table>
<thead>
  <tr>
    <th>
      <code>
        keyboard
      </code>
    </th>
    
    <th>
      矢印キー 1 回で
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'pixels'
      </code>
      
      （デフォルト）
    </td>
    
    <td>
      25 px（プロバイダーの <code>
        keyboard.step
      </code>
      
      ）動きます。:kbd{value="Shift"} を押すと 4 倍の距離です。家具はこのように動きます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'droppables'
      </code>
    </td>
    
    <td>
      その方向で受け入れてくれる最も近いターゲットへジャンプします。ゴミは箱から箱へジャンプし、拒否する箱は飛ばします。
    </td>
  </tr>
</tbody>
</table>

```ts
makeDraggable(el, { id: () => props.waste.id, type: () => props.waste.type, keyboard: 'droppables' });
```

キーはプロバイダーで割り当て直せます。詳しくは[アクセシビリティ](https://zizigy.github.io/docs/guides/accessibility)を参照してください。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
