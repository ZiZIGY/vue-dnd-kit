---
title: "アクセシビリティ"
description: "キーボードドラッグ、スクリーンリーダーの読み上げ、ARIA 属性は組み込まれています。ここでは、それぞれの働き、任意の言語での文言の書き方、ドラッグせずに移動する手段の提供方法を説明します。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/guides/accessibility"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

このページの内容はすべてデフォルトでオンです。Tab で予定の項目にフォーカスし、:kbd{value="Space"} を押して矢印キーで動かし、もう一度 <kbd value="Space">



</kbd>

 を押してください。元に戻すには <kbd value="Escape">



</kbd>

 を押します。パネルには、スクリーンリーダーに伝えられる内容が、選んだ言語で表示されます。

<example height="28.5rem" hint="Tab で項目へ：Space、矢印キー、Space。言語も切り替えてみましょう" name="a11y-announcer">



</example>

通常あなたに残されているのは、アイテムの読み取りやすいテキストと、まったくドラッグできない人のためにアイテムを移動するボタンです。

## キーボード

<table>
<thead>
  <tr>
    <th>
      キー
    </th>
    
    <th>
      操作
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      フォーカスされたアイテムを持ち上げる。ドロップする。
    </td>
  </tr>
  
  <tr>
    <td>
      矢印キー
    </td>
    
    <td>
      動かす：リストでは枠ごと、ツリーでは行と深さごと、自由なドラッグでは <code>
        keyboard.step
      </code>
      
       ピクセルずつ。
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      ドラッグをキャンセルする——ポインタードラッグも。
    </td>
  </tr>
</tbody>
</table>

- リストでは、同じグループの別のリストの方向へ矢印キーを押すと、アイテムがそちらへ移動します。
- 自由なドラッグでは、:kbd{value="Shift"} でステップが大きくなります。`makeDraggable(el, { keyboardMode: 'droppables' })` にすると、矢印キーは代わりに、そのアイテムを受け入れるターゲットの間をジャンプします。
- キーボードドラッグは、フォーカスされたドラッグ可能な要素またはそのハンドルから始まります——中にあるボタンや入力欄から始まることはないため、それらは自分のキー操作を保ちます。
- キーボードドラッグでは、端での自動スクロールの代わりに、アイテムがスクロールして表示されます。
- ドロップ後、行が別のリストで再描画された場合でも、フォーカスはアイテムに戻ります。

### ほかのキー

```vue
<DnDProvider :keyboard="{ keys: { start: ['KeyD'], drop: ['KeyD', 'Enter'], cancel: ['Escape'] }, step: 10 }">
```

キーの割り当ては `event.code`（`'Space'`、`'KeyD'`）または `event.key`（`'Enter'`）と照合されます。`step` は、自由なドラッグで矢印キーを 1 回押したときに動くピクセル数です（デフォルトは 25）。`:keyboard="false"` でキーボードドラッグはオフになりますが、:kbd{value="Escape"} は引き続きどのドラッグもキャンセルします。キーを変更したら、`screen-reader-instructions` も変更してください。

## ARIA 属性

各ショートカットにフォーカスするか、属性をオフにして、ライブラリが何を設定するかを見てみましょう。1 つをドラッグすると、ボタンの `aria-pressed` が付いたり外れたりします。

<example height="27rem" hint="Tab でショートカットを順に移動し、属性を切り替えてみましょう" name="a11y-attributes">



</example>

すべてのドラッグ可能な要素と並べ替え可能なアイテムには、**自分で設定していない限り**、次の属性が付きます。

<table>
<thead>
  <tr>
    <th>
      属性
    </th>
    
    <th>
      値
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        tabindex
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
      。要素がもともとフォーカス可能でない場合（<code>
        <div>
      </code>
      
       など。<code>
        <a href>
      </code>
      
       や <code>
        <button>
      </code>
      
       は除く）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        role
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
      。ただし、もともとボタンである <code>
        <button>
      </code>
      
       には付けません。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-roledescription
      </code>
    </td>
    
    <td>
      <code>
        draggable
      </code>
      
      。並べ替え可能なアイテムでは <code>
        sortable
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-describedby
      </code>
    </td>
    
    <td>
      プロバイダーの操作説明。既存の id の横に追加されます（ツールチップのものは残ります）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       または <code>
        false
      </code>
      
      ：アイテムが無効かどうか（無効なドラッグエリアによる場合も含む）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        aria-pressed
      </code>
    </td>
    
    <td>
      <code>
        button
      </code>
      
       ロールを持つ要素で、ドラッグ中は <code>
        true
      </code>
      
      。
    </td>
  </tr>
</tbody>
</table>

アイテムに `attributes: false` を指定すると、ライブラリが設定したものがその場で取り除かれます。パネルは属性を読み戻しています。`aria-describedby` はプロバイダーの操作説明を指し、スクリーンリーダーはアイテムの名前の後にそれを読み上げます。

### ドラッグできるリンクとボタン

`aria-roledescription` はロールの名前を置き換えます。スクリーンリーダーは「Inbox, button」ではなく「Inbox, sortable」と読み上げます。ロールが重要な要素には自分で設定してください。ライブラリはそれに手を付けません。

```vue [Shortcut.vue]
<script setup lang="ts">
makeSortableItem(el, {
  item: () => props.shortcut,
  // Enter follows the link: only Space picks it up.
  canDrag: (event) => !('key' in event && event.key === 'Enter'),
});
</script>

<template>
  <a ref="el" :href="shortcut.href" role="link" aria-roledescription="draggable link">
    {{ shortcut.title }}
  </a>
</template>
```

- リンクはそのまま機能します。クリックで開きますが、ドラッグを終えるクリックがリンクに届くことはありません。:kbd{value="Enter"} ではドラッグが始まってしまうので、`canDrag` がそれを断り、ブラウザーがリンクをたどります。
- `<button>` もクリックを保ち、ライブラリは `role` も `tabindex` も付けません。
- アイテムの**中にある**ボタン、リンク、入力欄はポインタードラッグを開始しないので、行は自分の操作を持てます。

### ハンドル：本物のボタンにする

```vue [Track.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ track: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track, handle: '.grip' });
</script>

<template>
  <li ref="el" class="track">
    {{ track.title }}
    <button type="button" class="grip" :aria-label="`Drag ${track.title}`">⠿</button>
  </li>
</template>
```

`handle` を指定すると、属性はハンドルに付き、キーボードドラッグもそこから始まります（上の **Archive** ショートカット）。`<button>` はフォーカス可能で、もともとボタンなので、`tabindex` も `role` も不要です。`aria-label` を付けてください。グリップのアイコンには名前がなく、「Drag Midnight Drive」のほうが「button」より多くを伝えます。

<tip>

キーボードドラッグの間ずっとハンドルがフォーカスを保ち、その行は枠になっています。枠を空にするには、ハンドルに `visibility: hidden` や `display: none` を使わず、`opacity: 0` を使ってください。非表示の要素はフォーカスを失います。ライブラリはドロップ後にフォーカスを戻しますが、その間にスクリーンリーダーが「body」と読み上げることがあります。

</tip>

## 読み上げ

プロバイダーのライブリージョンは、持ち上げ、移動、ドロップ、キャンセルのたびに読み上げます。並べ替え可能なリストはアイテムの位置を伝えます：*「Picked up item t2 at position 2 of 5 in list playlist.」* 移動はドラッグが 500 ms 止まってから読み上げられるので、すばやいポインタードラッグが枠ごとに読み上げられることはありません。デモのパネルは、ポインタードラッグが途中で通過した移動も含め、プロバイダーに渡されたすべてのテキストを記録します。

組み込みのテキストは英語で、`label` を与えない限り、ものを id で呼びます。アイテム、リスト、ツリー、ドロップターゲットはどれも `label` を受け取ります。

```ts
makeSortableList(list, { items: tracks, label: 'Playlist' });
makeSortableItem(el, { item: () => props.track, label: () => props.track.title });
makeDroppable(bin, { label: 'Trash', onDrop });
```

*「Picked up Blue in Green at position 2 of 5 in Playlist.」* ラベルはあなた自身のテキストやモニターにも届きます：`active.label`、`over.label`、`active.items` の各要素、そして context の `position.label` と `partner.label` です。

ほかの言語やほかの言い回しにするには、予定表のようにテキストを自分で書いてください。各テキストはイベントと `context` を受け取ります：組み込みのテキストが読み上げる `position`（`list`、0 から数える `index`、`length`、リストの `label`）と、`count`、`copy`、入れ替えの `partner` です。

```ts [index.vue]
const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

const announcements = computed<Partial<Announcements>>(() => {
  const t = LANGUAGES[lang.value]!;
  return {
    onDragStart: ({ active }, { position }) => position && t.start(titleOf(active.id), position.index + 1, position.length),
    onDragOver: ({ active }, { position }) => position && t.move(titleOf(active.id), position.index + 1, position.length),
    onDragEnd: ({ active }, { position }) => position && t.drop(titleOf(active.id), position.index + 1, position.length),
    onDragCancel: ({ active }, { position }) => position && t.cancel(titleOf(active.id), position.index + 1),
    onDragResume: ({ active }) => t.resume(titleOf(active.id)),
  };
});
```

```vue [index.vue]
<DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
```

<table>
<thead>
  <tr>
    <th>
      <code>
        context
      </code>
    </th>
    
    <th>
      開始時
    </th>
    
    <th>
      移動中
    </th>
    
    <th>
      終了時
    </th>
    
    <th>
      キャンセル時
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        position
      </code>
    </td>
    
    <td>
      持ち上げた位置
    </td>
    
    <td>
      着地する予定の位置。リストの外ではなし
    </td>
    
    <td>
      着地した位置
    </td>
    
    <td>
      戻った位置
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        partner
      </code>
    </td>
    
    <td>
      
    </td>
    
    <td>
      入れ替え：入れ替わる相手のアイテムと、その現在の位置
    </td>
    
    <td>
      同じもの、ドロップ後
    </td>
    
    <td>
      
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        count
      </code>
      
      、<code>
        copy
      </code>
    </td>
    
    <td>
      アイテムの数と、ドラッグがコピーかどうか
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
    
    <td>
      
    </td>
  </tr>
</tbody>
</table>

<table>
<thead>
  <tr>
    <th>
      イベント
    </th>
    
    <th>
      読み上げのタイミング
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
      アイテムが持ち上げられたとき。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragOver
      </code>
    </td>
    
    <td>
      アイテムが別の場所（リストの枠、別のターゲット）へ移動し、ドラッグが 500 ms 止まったとき。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragEnd
      </code>
    </td>
    
    <td>
      ドロップされたとき。新しい順序はすでに書き込まれています。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onDragCancel
      </code>
    </td>
    
    <td>
      ドラッグがキャンセルされたか、ドロップが拒否されたとき：アイテムは元に戻りました。
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
      
       を返したとき：ドラッグが続きます（<a href="/docs/guides/drop-decisions">
        ドロップの判断
      </a>
      
      を参照）。
    </td>
  </tr>
</tbody>
</table>

- テキストはそのイベントの読み上げを置き換えます。`undefined` ならデフォルトのまま、`''` なら何も読み上げません。指定しなかったイベントは、並べ替え可能なリストの位置など、デフォルトのままです。
- `screenReaderInstructions` は、すべてのドラッグ可能な要素が `aria-describedby` で参照するテキストです。どちらの prop もリアクティブで、デモは言語をその場で切り替えています。
- `:announcements="false"` はリージョンを無音にします。独自のリージョンで読み上げる場合などに使います。

<note>

別の言語にする場合は、5 つのテキストすべてと操作説明を指定してください。指定しなかったものは、並べ替え可能なリストの位置も含めて英語で読み上げられます。スクリーンリーダーが正しい音声を選べるよう、ページの `lang` も設定してください。

</note>

## ドラッグせずに移動する

まったくドラッグできない人もいます。WCAG 2.5.7 は、単一のクリックでアイテムを移動する方法を求めています。各行の矢印とチェックを使ってみましょう。ドラッグなしで本を移動でき、フォーカスはその場にとどまります。

<example height="27.5rem" hint="キーボードで矢印ボタンを使うか、グリップをドラッグしてみましょう" name="a11y-move-buttons">



</example>

ボタンはデータを変え、リストが移動を描きます。リストで `animateChanges` をオンにすると、行はドラッグのときと同じようにスライドします（モーションの軽減を求めるユーザーには動きません）。

```ts [ReadingList.vue]
const { items } = makeSortableList(list, { id: 'reading', items: books, animateChanges: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = `${book!.title} moved to position ${to + 1} of ${next.length}.`;
};
```

```vue [ReadingList.vue]
<p class="status" role="status">{{ message }}</p>
```

### フォーカスを保つ

DOM 内で要素を移動するとフォーカスが失われるので、押したばかりのボタンからフォーカスが外れます。行が移動した後でフォーカスを戻してください。

```ts [BookRow.vue]
const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Back on the same button, or on the other one when this one is now disabled.
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};
```

消える行（チェックで本を読了にする）はフォーカスを一緒に持っていきます。次の行か、最後の行へフォーカスを移してください。ドラッグにはこうした処理は不要です。ライブラリは、別のリストで再描画された場合でも、ドロップされたアイテム自体にフォーカスを戻します。

<tip>

`@vue-dnd-kit/actions` を使うと、各ボタンを本物のキーボードドラッグにできます。`moveItem(id, { index })` は読み上げられ、`onBeforeDrop` と `onDrop` を通り、アニメーションし、フォーカスをアイテムに保ちます。[プログラムによるドラッグ](https://zizigy.github.io/docs/guides/sensors#programmatic-drags)を参照してください。

</tip>

## タッチ

タッチドラッグは 200 ms の長押しの後に始まります。その前に 5 px より大きく動くと代わりにページがスクロールするので、リストはスクロールできたままです。どちらもプロバイダーの `activation` で調整でき、`useDnD().activation.progress` から長押しのリングを描けます：[プロバイダー](https://zizigy.github.io/docs/guides/provider#when-a-press-becomes-a-drag)を参照。タッチドラッグは開始時に短く振動します。`:haptics="false"` でオフになります。

## モーションの軽減

`prefers-reduced-motion: reduce` では、ライブラリ自身のアニメーションは実行されません。並べ替え中はアイテムが所定の位置へ一気に移り、ドロップ時にオーバーレイは飛ばず、`animateChanges` の変化はすぐに現れます。独自のアニメーション関数は `reducedMotion: true` とともに引き続き実行されるので、判断はあなた次第です：省くか、短いフェードを残すか。[アニメーション](https://zizigy.github.io/docs/guides/animations)を参照してください。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
