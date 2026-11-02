---
title: "フォームビルダー"
description: "Nuxt UI で作ったフォームビルダー。パレットからドラッグしたフィールドを行の中に横に並べ、パネルで編集し、検証付きのライブプレビューで入力して、Vue のコードとして書き出します。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/examples/form-builder"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="44rem" hint="フィールドをフォームへドラッグしてみましょう。別のフィールドの横に置くと列になります" name="form-builder" title="フォームビルダー">



</example>

ここにあるコントロールはすべて Nuxt UI のコンポーネントです：フォームのフィールド（`UInput`、`USelect`、`URadioGroup`、`UInputRating`、`UFileUpload`…）、その周りのパネル、プレビューの `UForm`。それらを動かすのが Vue DnD Kit です。デモを全画面に展開すると、パレット、フォーム、設定が横に並びます。

## 注目ポイント

- **PaletteGroup.vue**：パレットの各セクションは、コピーを送り出すだけの並べ替え可能なリストです：`group: { name: 'fields', pull: 'clone', put: false }` と `sort: false`。そのアイテムはフォームのものと同じフィールドなので、行にドラッグしたコピーはほかと変わらないフィールドになります。`clone` はそれに独自のキーを与えます。クリック（または <kbd value="Enter">



</kbd>

）でドラッグせずにフィールドを追加します。
- **FormRow.vue**：行は、カンバンの列と同じく 2 つの役割を同時に持ちます：グリップでドラッグするフォームの行リストのアイテムであり、パレットと同じグループに属する最大 3 つのフィールドのリストでもあります。その `put` は 4 つ目を拒否します：満杯の行の上では手に持ったフィールドが赤くなって理由を伝え、そこでのドロップはキャンセルされます。
- **NewRowZone.vue**：2 つの行の間の隙間か、最後の行の下にフィールドをドロップすると、そのフィールドは自分の行を得ます。それらの場所もリストです：同じグループの空のリストで、その id が新しい行の入る場所を示します。
- **FieldCard.vue**：行はインジケーターモード（`placeholder: 'indicator'`）なので、フィールドをドラッグしている間も何も動きません：フィールドの横のラインが行き先を示します。幅の狭いビルダーでは行のフィールドが縦に積み重なり、ラインはその上か下に表示されます。
- **Trash.vue**：フォームのフィールドをドラッグしている間、パレットはゴミ箱になります：フォームのフィールドだけを受け入れ（`accept: 'fields'`、そのグループ名）、`event.source.remove()` で取り除く通常のドロップターゲットです。
- **OptionList.vue**：ドロップダウンや選択肢の項目は、設定パネルの中でそれ自体が並べ替え可能なリストです。テキストを編集できるままにするため、グリップでドラッグします。
- **form.ts**：フォームと、それを変更する唯一のコード。リストはフォームを読むだけで書き込まないので、Undo と Redo はドロップも含めたすべての変更を把握します。

## フィールドの行はリストの中のリスト

フォームの行と各行のフィールドは、`rows` と `fields` という 2 つのグループのリストです。ドラッグが入るのは自分のグループのリストだけです：どうネストしていても、フィールドが行の間に着地することはなく、行がほかの行の中に入ることもありません。

```ts [FormRow.vue]
// The row is an item of the form's rows, dragged by its grip...
makeSortableItem(el, { item: () => props.row, handle: grip });

// ...and a list of up to three fields side by side, in the group of the palette.
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: rowList(props.row.id),
  items: () => props.row.fields,
  group: { name: 'fields', put: ({ keys }) => props.row.fields.length + keys.length <= MAX_COLUMNS },
  strategy: () => (props.stacked ? 'vertical' : 'horizontal'),
  placeholder: 'indicator',
  overlay: FieldOverlay,
  clone: cloneField, // Alt-drag copies a field
  animateChanges: true,
  onDrop: form.drop,
});
```

新しい行には、ドロップする場所が必要です。各行は自分の上の隙間に帯を持ち、最後の行の下の空間ももう 1 つのそのような場所です：アイテムを決して表示しない、`fields` グループの空のリストです。帯の上ではリストが `isOver` になり、帯がラインを描きます。帯がポインターを受け取るのは何かがドラッグされている間（`html[data-dnd-dragging]`）だけなので、クリックの邪魔になることはありません。

```vue [NewRowZone.vue]
<script setup lang="ts">
const NONE: readonly Field[] = [];
const { isOver, isAccepting } = makeSortableList(el, {
  id: newRowList(props.before), // 'new:<row id>', or 'new:end'
  items: () => NONE,
  group: 'fields',
  placeholder: 'indicator',
  // A band across the page: up and down are the keys that cross it, to the next list.
  strategy: 'horizontal',
  onDrop: form.drop,
});
</script>

<template>
  <div
    ref="el"
    class="pointer-events-none absolute inset-x-0 -top-[18px] z-10 h-6 in-data-[dnd-dragging]:pointer-events-auto"
  >
    <span class="… bg-primary" :class="isOver ? 'opacity-100' : 'opacity-0'" />
  </div>
</template>
```

キーボードも帯を見つけます。キーボードドラッグは、リストを横切る方向の矢印キーで、ページ上の位置に従ってリストからリストへ移ります：横方向である行には上下キーで、同じく横方向である帯にも上下キーで移ります。そのため <kbd value="ArrowUp">



</kbd>

 と <kbd value="ArrowDown">



</kbd>

 は、行とその間の隙間を交互に訪れます。

## 1 つのストア、1 つの Undo：書き込まないリスト

ビルダーのすべてのリストはアイテムをゲッターから受け取るので、ライブラリがそれに書き込むことはありません（[制御されたリスト](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists)）。その `onDrop` は `form.drop` です：書き込みをキャンセルし、`event.result`（ドロップで変わるすべてのリストの新しい配列）をフォームに渡します。リストの id が、各配列が何であるかを示します：行のフィールド、行の順序、または作成する行です。

```ts [form.ts]
function apply(result: ReadonlyMap<Key, unknown[]>) {
  commit(() => {
    const created: [before: string, fields: Field[]][] = [];
    for (const [list, items] of result) {
      const [type, id] = String(list).split(':') as [string, string];
      if (list === ROWS) state.rows = items as Row[];
      else if (type === 'row') state.rows.find((row) => row.id === id)!.fields = items as Field[];
      else if (type === 'new' && items.length) created.push([id, items as Field[]]);
    }
    for (const [before, items] of created) {
      const index = state.rows.findIndex((row) => row.id === before);
      state.rows.splice(index < 0 ? state.rows.length : index, 0, row(...items));
    }
  });
}

/** `onDrop` of every list: applies the drop, and selects a field that was just added. */
function drop(event: SortableDropEvent<unknown>) {
  event.preventDefault();
  apply(event.result);
  if (event.mode === 'copy') selectedId.value = (event.items[0] as Field).id;
  forgetGone();
}
```

`commit` は Undo 用にフォームのスナップショットを保存し、変更を行い、移動で空になった行を取り除きます。これらはすべてドロップが着地する前に行われるので、オーバーレイはフィールドが実際にある場所へ飛びます。ゴミ箱も同じ道を通ります：`event.source.remove()` は、フィールドを取り除いた状態で行の `onDrop` を実行します（`to.index` は `-1`）。設定での入力も `commit` を通り、1 つの設定へのキー入力はキーを共有します：1 文字ずつ入力したラベルは、Undo の 1 ステップになります。

## 手に持ったフィールド

パレットと行は 1 つのオーバーレイコンポーネントを共有します。それはドラッグされているもののライブラリによるコピー（`DragPreview`：パレットからならチップ、フォームからなら Nuxt UI のコントロールを含むフィールド全体）を枠に入れて表示し、ドロップで何が起きるかをバッジで示します：コピー（:kbd{value="Alt"}）、ゴミ箱の上では削除、満杯の行の上では何も起きないこと。

```vue [FieldOverlay.vue]
<script setup lang="ts">
const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();

const entry = computed(() => props.items[0]!);
const state = computed(() => {
  if (props.status === 'dropping') return 'landing';
  if (props.over?.id === TRASH) return 'delete';
  // A row that refuses the field: it is full.
  if (props.over && !props.accepted) return 'full';
  // Palette fields are copies too, but they say nothing: adding is what they do.
  if (props.mode === 'copy' && !entry.value.type.includes('new-field')) return 'copy';
  return 'move';
});
</script>

<template>
  <!-- LOOKS: lifted and tilted, red when refused, smaller over the trash, flat as it lands. -->
  <div class="relative size-full rounded-md bg-default ring-2 …" :class="LOOKS[state]">
    <DragPreview :id="entry.id" class="rounded-md" :style="{ width: '100%', height: '100%' }" />
    <UBadge v-if="badge" :label="badge.label" :icon="badge.icon" :color="badge.color" size="sm" />
  </div>
</template>
```

パレットのアイテムは独自の `type`、`'new-field'` を持っています：オーバーレイはそれで区別し、`'fields'` を受け入れるゴミ箱はそれを受け入れません。

## Nuxt UI と組み合わせる

このドキュメントは `@nuxt/ui` モジュールを使った Nuxt アプリで、Nuxt のコンポーネント自動インポートはサンプルにも及びます：これらのファイルは、Nuxt UI のプロジェクトと同じく、`<UInput>`、`<UFormField>`、`<UTabs>` をインポートせずに使っています。Nuxt UI の Vite プラグインを使う Vue アプリでも同じように自動インポートされます。使わない場合は、それぞれをインポートしてください：`import UButton from '@nuxt/ui/components/Button.vue'`。型は `@nuxt/ui` から取得します（`import type { FormSubmitEvent } from '@nuxt/ui'`）。

- **組み立て中、フィールドは絵です。** `FieldView.vue` はキャンバスでもプレビューでも同じようにフィールドを描画します：コントロールを `UFormField` で囲んだものです。キャンバスでは `inert` な要素の中にあるので、入力欄を押すと入力ではなくドラッグが始まり、:kbd{value="Tab"} は入力欄をスキップします。カードのツールバー（ツールチップ付きボタンの `UFieldGroup`）は、`data-dnd-no-clone` でオーバーレイのコピーから除外されます。
- **状態は Tailwind のバリアントです。** ライブラリは状態を属性でマークし、Tailwind はそれをバリアントとして読みます：移動中のフィールドには `data-[dnd-placeholder]:outline-dashed`、手に持った行には `in-data-[dnd-overlay]:bg-default`、帯には `in-data-[dnd-dragging]:pointer-events-auto`。色は Nuxt UI のセマンティックカラー（`bg-default`、`ring-primary`、`text-error`）なので、ライトモードとダークモードにはほかに何も要りません。
- **プレビューは本物の UForm です。** `schema.ts` がフィールドから Zod スキーマを作り、`UForm` がそれで回答を検証します：`name` が各 `UFormField` をそのルールに結び付け、メッセージはフィールドの下に表示されます。フォームを送信すると、何が送られるかを確認できます。
- **書き出し**は、同じフォームを独立したコンポーネントとして書き出します：Nuxt UI のコントロール、Zod スキーマ、`reactive` な状態、そしてスマートフォンでは縦に積み重なるグリッドとしての行です。
- **レイアウトはウィンドウではなくビルダーの幅に従います**（`useElementSize`）：全画面では 3 つのパネル、ページ上では設定がパレットの場所を取り、さらに狭いとパレットはフォームの上のチップの列に、設定はフォームの上に重なるシートになります。残りはコンテナークエリ（`@lg:`）が担います。

<note>

StackBlitz ボタンは、Nuxt UI のドキュメントが Vue 向けに説明しているとおりに Nuxt UI を設定した Vite プロジェクト（`@nuxt/ui/vite` プラグイン、Tailwind CSS、サンプルを囲む `UApp`）でファイルを開きます。`@nuxt/ui` モジュールを入れた Nuxt アプリでは、フォルダーをコピーしてページで `index.vue` を描画してください。フォームには `zod` も必要です。

</note>

## キーボードとスクリーンリーダー

Tab でフィールドに移り、:kbd{value="Space"} を押して持ち上げます。:kbd{value="ArrowLeft"} と <kbd value="ArrowRight">



</kbd>

 で行に沿って動かし、:kbd{value="ArrowUp"} と <kbd value="ArrowDown">



</kbd>

 でほかの行やその間の隙間（新しい行）へ動かし、:kbd{value="Space"} でドロップし、:kbd{value="Escape"} で元に戻します。プロバイダーがドラッグに使うのは Space だけなので（`keyboard: { keys: { start: ['Space'], drop: ['Space'] } }`）、:kbd{value="Enter"} はフィールドの設定を開くために使えます。:kbd{value="Delete"} でフィールドを削除し、:kbd{value="Ctrl"} <kbd value="D">



</kbd>

 で複製し、:kbd{value="Ctrl"} <kbd value="Z">



</kbd>

 で元に戻します。

プロバイダーの `announcements` はビルダーの言葉で読み上げます：「Work email: row 2, column 2 of 2」、「New date field: a new row above row 3」。`form.describe` が、ライブラリから渡される位置（リストの id とインデックス）をそれらの言葉に変えます。

さらに読む：[アイテムを共有するリスト](https://zizigy.github.io/docs/guides/shared-lists) · [挿入ライン](https://zizigy.github.io/docs/guides/sortable-lists#an-insertion-line) · [オーバーレイ](https://zizigy.github.io/docs/guides/overlay) · [スタイリング：Tailwind と UI キット](https://zizigy.github.io/docs/guides/styling#tailwind-css) · [アクセシビリティ](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
