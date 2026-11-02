---
title: "マルチドラッグと選択"
description: "クリックや範囲選択で複数のアイテムを選び、まとめてドラッグします——1 つのかたまりとして、隙間を残して、またはオーバーレイに重ねて——ドロップ時にその一部だけを受け入れ、独自のオーバーレイで表示することもできます。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/multi-drag"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

ファイルをいくつか選んでから、その 1 つをドラッグしてみましょう。ほかのファイルも一緒についてきます。`multiple` を切り替えると途中での動きが、レイアウトを切り替えるとグリッドのオーバーレイが見られます。

<example height="35rem" hint="ファイルをクリック、Ctrl/Cmd クリック、Shift クリックしてから 1 つをドラッグし、モードを切り替えてみましょう" name="multi-modes">



</example>

## 選択

各プロバイダーは 1 つの選択を持ちます：id のリアクティブな集合です。**選択されている**アイテムをドラッグすると、選択中のすべてのアイテムがドラッグされ、掴んだものが先頭になります。選択されていないアイテムをドラッグすると、そのアイテムだけがドラッグされます。

ライブラリはユーザーがどう選択するかを決めません。クリックのルールはあなたが決めます。また、ライブラリが自分で選択を解除することもなく、選択はアンマウントを越えて保たれます。仮想リストが再利用する行などがその例です。

### クリック：Ctrl/Cmd と Shift

並べ替え可能なアイテムとドラッグ可能な要素はすべて `selected` を返します。これは選択にバインドされた書き込み可能な ref です。クラスやチェックボックス（`v-model="selected"`）にバインドするか、クリックハンドラーで設定します。

```vue [FileItem.vue]
<script setup lang="ts">
const { selected } = makeSortableItem(el, { item: () => props.file });
</script>

<template>
  <li ref="el" class="file" :class="{ selected }" @click="emit('pick', $event)">…</li>
</template>
```

デモではリストがルールを持っています。クリックで 1 つのファイルを選択し、Ctrl/Cmd クリックで 1 つを追加または除外し、Shift クリックで最後にクリックしたファイルからの範囲を選択します。

```ts [Files.vue]
const { selection } = useDnD();
let anchor: string | null = null;

const pick = (id: string, event: MouseEvent) => {
  const ids = items.value.map((file) => file.id);
  if (event.shiftKey && anchor) {
    const [a, b] = [ids.indexOf(anchor), ids.indexOf(id)];
    selection.set(ids.slice(Math.min(a, b), Math.max(a, b) + 1));
    return;
  }
  if (event.ctrlKey || event.metaKey) selection.toggle(id);
  else selection.set([id]);
  anchor = id;
};
```

ドラッグを終えるクリックは `@click` に届かないので、ドロップで選択が意図せず変わることはありません。アイテムの操作には `pointerup` ではなく `@click` を使ってください。

### どこからでも：`useDnD().selection`

```ts
import { useDnD, useDnDMonitor } from '@vue-dnd-kit/core';

const { selection } = useDnD();

selection.has('a');               // is it selected?
selection.add('a', 'b');          // select
selection.delete('a');            // deselect
selection.toggle('a');            // flip it, or force it: toggle('a', true)
selection.set(['a', 'c']);        // exactly these
selection.clear();
selection.ids;                    // a reactive ReadonlySet<Key>

// Clear it after every drop, if your UI wants that:
useDnDMonitor({ onDragEnd: () => selection.clear() });
```

選択は id でキー付けされるので、複数のリストのアイテムや、通常のドラッグ可能な要素も含められます。ドラッグは、プロバイダー配下の選択中のアイテムをすべて運びます。

## 範囲選択

`makeSelectionArea` は要素を選択エリアにします。空いている場所を押すと選択枠が描かれ、それが横切ったアイテムが選択されます。このデスクトップで、いくつかのアイコンを囲むように枠を描いてから、その 1 つをドラッグしてみましょう。

<example height="29rem" hint="空いているデスクトップに枠を描いてから、選択したアイコンをドラッグしてみましょう" name="multi-select">



</example>

```vue [Desktop.vue]
<script setup lang="ts">
const desktop = useTemplateRef<HTMLElement>('desktop');
const { isSelecting, style } = makeSelectionArea(desktop);
</script>

<template>
  <!-- The area needs a position: the band is placed inside it. -->
  <div ref="desktop" class="desktop">
    <DesktopIcon v-for="icon in icons" :key="icon.id" :icon="icon" />
    <div v-if="isSelecting" class="band" :style="style" />
  </div>
</template>

<style scoped>
.desktop { position: relative; height: 236px; }
.band { border: 1px solid #42b883; background: color-mix(in srgb, #42b883 15%, transparent); }
</style>
```

- 選択枠はあなたが描画します。`style` がエリアのコンテンツを基準に配置します。
- エリアには **static 以外の position**（`relative` で十分）が必要です。そうでないと選択枠が別の場所に表示されます。
- 選択枠はエリア自体からしか始まらないので、エリアは大きくしてください。ぴったり包むラッパーではなく、アイテムの周りに余白のあるパネル全体にします。
- アイテムの上で押すとドラッグになります。ボタン、入力欄、エリアのスクロールバーは自身の押下を保持します。
- エリアやページがスクロールしても、選択枠はコンテンツに固定されたままです。:kbd{value="Escape"} でキャンセルし、選択を元に戻します。
- 選択枠を描いている間、`useDnD().status` は `'selecting'` です。デスクトップの下の行はこれを読み取っています。

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
        strategy
      </code>
    </td>
    
    <td>
      <code>
        'toggle'
      </code>
      
      （デフォルト）：選択枠が横切ったアイテムの選択状態が反転します。<code>
        'select'
      </code>
      
      ：選択枠の内側のアイテムだけが選択された状態になるので、空いている場所をクリックするとエリアのアイテムの選択が解除されます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifier
      </code>
    </td>
    
    <td>
      枠を描くために押している必要があるキー：<code>
        { keys: ['Shift'], method: 'every' }
      </code>
      
      （または <code>
        'some'
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        accept
      </code>
    </td>
    
    <td>
      選択枠が選択するドラッグ可能な要素。<code>
        type
      </code>
      
       と照合する <a href="/docs/guides/drag-and-drop#which-drags-a-target-takes">
        accept ルール
      </a>
      
      です。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      選択枠なし。オンにすると、描画中の選択枠はキャンセルされます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onSelected(ids)
      </code>
    </td>
    
    <td>
      選択枠が終わったときに、選択とともに呼ばれます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selection
      </code>
    </td>
    
    <td>
      プロバイダーの選択の代わりに使う、独自の <code>
        Ref<Set<Key>>
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

`strategy`、`modifier`、`disabled` は値、ref、ゲッターを受け取り、押下で選択枠が始まるときに読み取られます。エリアが入れ子の場合は、最も内側のエリアが押下を受け取ります。[makeSelectionArea API](https://zizigy.github.io/docs/api/make-selection-area) のページでは、これらをライブで切り替えられます。

### 並んだまま動かす

アイコンは通常のドラッグ可能な要素（`makeDraggable`）で、それぞれ自分のアイコンを `data` に持っています。オーバーレイはデモ独自のコンポーネントです：ドラッグされた各アイコンの `DragPreview` を、掴んだアイコンを中心に、デスクトップ上の並びのとおりに配置します。アイコンはその場で待ち、`isDragging` で薄く表示されます。`isDragging` はコピーが着地するまで `true` のままです。

```vue [Formation.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[] }>();

const placed = computed(() => {
  const grabbed = props.items[0]!.data as Icon;
  return props.items.map(({ id, data }) => {
    const icon = data as Icon;
    return { id, left: `${icon.x - grabbed.x}px`, top: `${icon.y - grabbed.y}px` };
  });
});
</script>

<template>
  <div class="formation">
    <DragPreview v-for="{ id, left, top } in placed" :id="id" :key="id" class="copy" :style="{ left, top }" />
  </div>
</template>
```

```ts [DesktopIcon.vue]
const { isDragging, selected } = makeDraggable(el, { id, data: () => props.icon, overlay: Formation });
```

ドロップはデスクトップが受け取ります。その `position` は、掴んだアイコンが離された位置をデスクトップの座標で表したものです：そのアイコンはそこへ移り、ほかのアイコンも同じだけ動きます。その後、各コピーは新しい位置にある自分のアイコンへ着地します。デスクトップの外でドロップすると、コピーはアイコンへ戻ります。

```ts [Desktop.vue]
makeDroppable(desktop, {
  id: 'desktop',
  onDrop: ({ active, position }) => {
    const grabbed = icons.value.find((icon) => icon.id === active.id)!;
    const shift = { x: position!.x - grabbed.x, y: position!.y - grabbed.y };
    for (const icon of icons.value) {
      if (!active.ids.includes(icon.id)) continue;
      icon.x += shift.x; // the demo also keeps each icon on the desktop
      icon.y += shift.y;
    }
  },
});
```

持ち上げ時にクローンが作られるのは、デフォルトでは最大 5 アイテムです：プロバイダーの `overlay-previews="all"` で、選択中のすべてのアイコンのクローンが作られます。

### フォルダーへ

このウィンドウでは、選択枠でファイルを選び、フォルダーがそれを受け取ります。オーバーレイはデフォルトのもので、選んだファイルの山です。フォルダーにドロップすると、ファイルが 1 つずつ順に入っていき、掴んだファイルが最後に入って、フォルダーがごくりと飲み込みます。キャンセルすると、それぞれが自分のファイルへ戻ります。フォルダーをクリックすると開き、パスの Home へファイルをドラッグして戻せます。

<example height="33rem" hint="いくつかのファイルを選択枠で囲み、フォルダーの上へドラッグしてみましょう" name="multi-finder">



</example>

```vue [index.vue]
<!-- Every picked file gets a clone at pickup: they all go in. -->
<DnDProvider overlay-previews="all">
  <Finder />
</DnDProvider>
```

```ts [FolderTile.vue]
makeDroppable(el, {
  id: () => props.folder.id,
  accept: 'file',
  onDrop: (event) => emit('move', event.active.ids),
});

// The files are in: the folder gulps.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.over?.id === props.folder.id) gulps.value++;
  },
});
```

必要なのはこれだけです：ファイルはドロップとともにウィンドウから消えるので、着地できる場所はフォルダーしかありません。そしてデフォルトのドロップアニメーションは、マルチドラッグをゾーンへ 1 アイテムずつ順に送り込みます。`overlayPreviews` は、持ち上げた時点でクローンを作るアイテムの数を決めます（デフォルトは 5）。すべてのクローンが飛びます：ゾーンの中へ、自分の位置へ、または自分のアイテムへ戻ります。

フォルダーはボタンです。選択枠はボタンや入力欄の上では決して始まらないので、クリックでフォルダーが開きます。

## ほかのアイテムの動き：`multiple`

マルチドラッグが始まったリストが、実行中にほかの選択中アイテムがどう動くかを決めます。このページの最初のデモで切り替えてみましょう。

```ts
makeSortableList(listRef, { items: files, multiple: 'gaps' });
```

<table>
<thead>
  <tr>
    <th>
      <code>
        multiple
      </code>
    </th>
    
    <th>
      ドラッグ中
    </th>
    
    <th>
      オーバーレイ
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'group'
      </code>
      
      （デフォルト）
    </td>
    
    <td>
      ほかのアイテムは元の場所を離れ、掴んだアイテムと一緒に 1 つの枠のかたまりとして移動するので、リストにはすでにドロップの結果が表示されます。
    </td>
    
    <td>
      リストに沿って並んだ、ドラッグ中アイテムの列（最大 <code>
        overlayPreviews
      </code>
      
       個）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'gaps'
      </code>
    </td>
    
    <td>
      ほかのアイテムはドロップまでその場にとどまり、<code>
        data-dnd-dragging
      </code>
      
       が付きます。
    </td>
    
    <td>
      同じ列。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'stack'
      </code>
    </td>
    
    <td>
      ほかのアイテムはオーバーレイへ飛び込みます。
    </td>
    
    <td>
      掴んだアイテムと件数。
    </td>
  </tr>
</tbody>
</table>

ドロップすると、アイテムは元の順序のまま、まとめてターゲットのインデックスに着地します。`'group'` と `'gaps'` では、オーバーレイの各アイテムがそれぞれの枠へ飛んでいきます。このオプションはドラッグ開始時に読み取られるので、ref やゲッターで切り替えられます。

リストではないドロップターゲット（ゴミ箱やプレイリストなど）の上や、ドラッグを拒否するリストの上では、`'group'` のかたまりはばらけます：そこでのドロップが残すとおり、各アイテムが再び自分の位置に表示され、リストの上に来るとかたまりはまた作られます。

`'gaps'` で残されたアイテムのスタイルを設定します。デフォルトでは薄く表示されます。

```css
.file[data-dnd-dragging] {
  opacity: 0.35;
}
```

### デフォルトのオーバーレイ

`'group'` と `'gaps'` では、オーバーレイは着地する順に並んだドラッグ中アイテムの列です。掴んだアイテムがポインターの下にあり、ほかのアイテムはドロップ順にその前後に並びます（横方向のリストでは行）。表示する数は、プロバイダーの `overlayPreviews` で決まります（デフォルトは 5、`'all'` なら描画されているすべて）。それを超えるアイテムは、その位置で数として示されます：表示されたものより前に着地するアイテムは列の先頭に `+N`、後に着地するアイテムは末尾に `+N` です。

グリッドでは、セル全体の列はページを覆ってしまうので、オーバーレイは山になります：最大 3 つのアイテムが掴んだアイテムの後ろに扇状に広がり、合計数が上に表示されます。デモを Grid に切り替えると見られます。

通常のドラッグ可能な要素（`makeDraggable`）も、上のファイルのように山になります。オーバーレイの各クローンはそれぞれ自分で着地します：リストへのドロップ後は自分の位置へ、ドロップがアイテムを置いた場所にあるそのアイテムへ（キャンセル後は元の位置へ）、そしてアイテムがページから消える場合はドロップ先のゾーンへ 1 つずつ順に入り、ボックスは最後に入ります。

## 一部だけを受け入れる

リストの `onBeforeDrop` は、マルチドラッグの一部を受け入れることができます。受け入れるキーを返すと、ほかのアイテムは元の場所に戻ります。`onBeforeDrop` は非同期にでき、問い合わせることもできます：答えが来るまで、オーバーレイは離された場所で待ちます。ここでは Scheduled はカバー画像のある投稿を求めます。カバーのない投稿を含めてドロップすると、足りないカバーを追加してすべて受け入れるか、準備のできた投稿だけを受け入れるか、何も受け入れないかを尋ねます。

<example height="28.5rem" hint="選んだ 3 つの下書きを Scheduled へドラッグしてから、答えてみましょう" name="multi-transfer">



</example>

```ts [PostList.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  items: posts,
  group: 'blog',
  onBeforeDrop: async (event) => {
    const missing = event.items.filter((post) => post.cover === null);
    if (!props.ask || event.sameList || !missing.length) return true;
    const choice = await props.ask(missing, event.items.length - missing.length); // the question under the lists
    if (choice === 'cover') missing.forEach((post) => (post.cover = pickCover()));
    if (choice === 'ready') return event.keys.filter((_, index) => event.items[index]!.cover !== null);
    return choice === 'cover'; // all of them, or none: they fly back
  },
});
```

- `event.keys` はドラッグ中のキーで、`event.items[i]` は `event.keys[i]` のアイテムです。
- 答えの後、`onDrop` は `accepted` と `rejected` を受け取り、`event.result` には部分的なドロップの後のリストが入ります。
- ドロップが待っている間も、リストはドラッグ中のすべての投稿を着地する位置に表示し続けます：決めるのは答えです。問い合わせの要らないルールなら、`group.put` がホバー中に判断します（下の[型が混在する場合](#mixed-types)を参照）。詳しくは[ドロップの判断](https://zizigy.github.io/docs/guides/drop-decisions)にあります。

### 上限

このボードでは、In progress と Review にカードの上限があります。満杯の列は何も受け取りません。その `group.put` が拒否し、その上ではカードの山が赤くなります。選んだカードの一部が入る余地のある列は、入るだけ受け取り、残りは元の位置に戻ります。そのことは、ドロップの前にその列のオーバーレイが示します。

<example height="31rem" hint="To do のカードを 3 枚チェックし、1 枚を Review の上へ、次に In progress の上へドラッグしてみましょう" name="multi-wip">



</example>

```ts [WipColumn.vue]
const room = (keys: Key[]) => limit - column.cards.filter((card) => !keys.includes(card.id)).length;

makeSortableList(list, {
  items: cards,
  group: { name: 'board', put: ({ keys, from, to }) => from === to || room(keys) > 0 },
  multiple: 'stack',
  overlay: CardPile, // red where `accepted` is false
  overOverlay: fit,
  onBeforeDrop: (event) => {
    if (event.sameList) return true;
    const free = room(event.keys);
    return free >= event.keys.length || event.keys.slice(0, free);
  },
});
```

`fit` は関数で、Vue は関数を関数型コンポーネントとして扱います。`fit` は列だけが知っている情報、つまり列の空きを `FitBadge` に渡し、カードの山をバッジのスロットとしてそのまま渡します。

```ts
const fit: FunctionalComponent<OverlayProps> = (overlay, { slots }) =>
  h(FitBadge, { count: overlay.items.length, room: room(overlay.items.map((item) => item.id)), limit }, slots);
```

### 型が混在する場合

リストは、ドロップの前に型によって一部のアイテムを拒否することもできます。`acceptMode: 'some'` では、`group.put` がアイテムごとに個別に問い合わされます。少なくとも 1 つが合致すればリストはドラッグを受け入れ、残りはドロップ時に元の位置に戻ります。`'all'`（デフォルト）では、すべてのアイテムが合致する必要があります。

```ts
makeSortableList(gallery, {
  items: photos,
  group: { name: 'files', put: ({ types }) => types.includes('image') },
  acceptMode: 'some',
});
```

通常のドロップターゲットも `acceptMode` を受け取ります。[アイテムを共有するリスト](https://zizigy.github.io/docs/guides/shared-lists#limits)と[ドラッグ＆ドロップ](https://zizigy.github.io/docs/guides/drag-and-drop#which-drags-a-target-takes)を参照してください。

## 複数アイテム用の独自のオーバーレイ

オーバーレイコンポーネントとプロバイダーの `#overlay` スロットは `items` を受け取ります：ドラッグ中のすべてのアイテムで、掴んだものが先頭です。アイテムそのものの代わりに要約を表示しましょう。ここでは件数、最初の件名、ドロップで何が起きるかを示しています。

<example height="26rem" hint="チェックしたメールを Archive か Trash へドラッグするか、1 通だけドラッグしてみましょう" name="multi-summary">



</example>

```vue [MailOverlay.vue]
<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; over: Over | null }>();

const first = computed(() => props.items[0]?.item as Mail);
const count = computed(() => props.items.length);
// What the drop does, from the `data` of the zone under it.
const zone = computed(() => props.over?.data as { verb: string; danger?: boolean } | undefined);
const action = computed(() => {
  const noun = count.value === 1 ? 'conversation' : 'conversations';
  return `${zone.value?.verb ?? 'Move'} ${count.value} ${noun}`;
});
</script>

<template>
  <!-- The box keeps the row's size; the summary hangs off its middle, by the pointer. -->
  <div class="box">
    <div class="summary" :class="{ stack: count > 1, danger: zone?.danger }">
      <span class="count">{{ count }}</span>
      <strong>{{ action }}</strong>
      <small>{{ first.subject }}{{ count > 1 ? ` and ${count - 1} more` : '' }}</small>
    </div>
  </div>
</template>

<style scoped>
.box { position: relative; width: 100%; height: 100%; }
.summary { position: absolute; top: calc(50% + 10px); left: calc(50% + 10px); width: 230px; }
</style>
```

```ts [Mailbox.vue]
// The box is centered on the pointer, so the summary hangs off the pointer and leaves
// the zone under it in sight.
const { items } = makeSortableList(list, { items: mails, overlay: MailOverlay, modifiers: [snapCenterToCursor] });

// A zone takes the mails out of the inbox; its `data` tells the overlay what it does.
makeDroppable(archive, {
  id: 'Archive',
  data: { verb: 'Archive' },
  onDrop: (event) => {
    event.source?.remove();
    selection.clear();
  },
});
```

代わりに実際のアイテムを並べるには、上の[デスクトップ](#moving-them-as-they-lie)のように、`DragPreview` でそれらのクローンを描画します。[オーバーレイのガイド](https://zizigy.github.io/docs/guides/overlay#dragpreview-the-clone-in-your-layout)では本の山を扇状に広げています。クローンは持ち上げ時に、掴んだアイテムと、ドロップ順でその隣にあるほかのアイテムについて、`overlayPreviews` の数だけ作られます。それ以外のアイテムでは、`DragPreview` はデフォルトスロットを描画します。ドロップ時、各プレビューはそれぞれ自分のアイテムへ着地します。

## ツリー

ツリーでは、選択されたノードはそれぞれのサブツリーとともに、ドキュメント順に 1 つのかたまりとして動きます。選択されたノードの中にある選択されたノードは、親のサブツリーに乗って一緒に動きます。[ツリー](https://zizigy.github.io/docs/guides/trees)を参照してください。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
