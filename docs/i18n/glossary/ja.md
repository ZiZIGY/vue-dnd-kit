# 用語集：日本語（ja）

## 文体と表記

- です・ます調で書きます。Vue の日本語ドキュメントと同じく、読者への呼びかけは基本的に省略し、必要なときは「あなた」を使います。指示は「〜します」「〜してください」。
- 英語と同じく短く直接的な文にします。足さない、削らない、「改善」しない。
- 和文と英数字・インラインコードの間には半角スペースを入れます：`DnDProvider の中で`、`` `items` を返します ``、`200 ms`。全角の句読点・括弧の前後には入れません：`` `id`（文字列）``。
- 和文中の句読点は「、」「。」、括弧は全角の（）、コロンは全角の「：」、引用は「」を使います。
- 段落やリスト項目の途中で改行しません（和文での改行はスペースとして表示されるため）。
- 太字の内側の先頭・末尾に記号を置きません。コードを太字にするときは前後に半角スペースを入れます：``**`data-dnd-no-clone`** を付ける``。
- コード、API 名、オプション、イベント、ファイル名、パッケージ名は原文のまま `code` で書きます。
- frontmatter の値をバッククォートで始めない。半角の `: ` を使わない。

## 用語

| English | 日本語 | 備考 |
| --- | --- | --- |
| drag and drop | ドラッグ＆ドロップ | 見出し・総称 |
| a drag（1 回の操作） | ドラッグ | 「ドラッグの開始時」「現在のドラッグ」 |
| to drag | ドラッグする | |
| drop（名詞）/ to drop | ドロップ / ドロップする | |
| to let go, release | 離す | |
| drop target | ドロップターゲット | リスト、ツリー、ドロップゾーンはすべてドロップターゲット |
| drop zone, droppable | ドロップゾーン | API は `makeDroppable` |
| draggable（名詞） | ドラッグ可能な要素 | 「通常のドラッグ可能な要素」 |
| item | アイテム | データ・リストの項目。DOM は「要素」 |
| element | 要素 | DOM 要素 |
| row / card / tile | 行 / カード / タイル | |
| overlay | オーバーレイ | ポインターに追従するボックス |
| clone | クローン | デフォルトのオーバーレイ |
| placeholder | プレースホルダー | `data-dnd-placeholder` |
| slot（アイテムが着地する場所） | 位置、着地位置、枠 | 「スロット」は Vue のスロット（`#overlay` スロット、デフォルトスロット）専用 |
| to land（オーバーレイ） | 着地する | |
| to fly back | 元の位置に戻る | |
| sortable list / sortable item | 並べ替え可能なリスト / 並べ替え可能なアイテム | |
| to reorder / sorting | 並べ替える / 並べ替え | |
| draft | ドラフト | ドラッグ中に描画する `items` |
| handle | ハンドル | `handle` |
| multi-drag | マルチドラッグ | |
| selection | 選択、選択中のアイテム | プロバイダーが持つ選択中 id の集合 |
| rubber band, band | 範囲選択、選択枠 | |
| grabbed item / active item | 掴んだアイテム / アクティブなアイテム | |
| pickup, to pick up | 持ち上げ、持ち上げる | |
| provider | プロバイダー | `DnDProvider` |
| composable | コンポーザブル | Vue の日本語ドキュメントに合わせる |
| template ref | テンプレート参照 | |
| ref / getter / computed | ref / ゲッター / computed | |
| props / prop | props / prop | |
| slot（Vue） | スロット | |
| sensor | センサー | |
| modifier | モディファイア | |
| collision detection | 衝突判定 | `collision` |
| hit-testing | ヒットテスト | |
| auto-scroll | 自動スクロール | |
| drag area / selection area | ドラッグエリア / 選択エリア | `makeDragArea` / `makeSelectionArea` |
| tree / node / root / subtree | ツリー / ノード / ルート / サブツリー | |
| depth / to nest / folder | 深さ / ネストする / フォルダー | |
| parent / children / siblings | 親 / 子 / 兄弟 | |
| collapsed / expanded | 折りたたまれた / 展開された | |
| group | グループ | 「同じグループのリスト」 |
| copy / palette | コピー / パレット | パレット：コピーを送り出すだけのリスト |
| swap / shift | 入れ替え / ずらし | |
| accept / refuse, reject | 受け入れる / 拒否する | |
| cancel | キャンセル | |
| kanban board | カンバンボード | |
| trash zone / trash can | ゴミ箱ゾーン / ゴミ箱 | |
| indicator / insertion line | インジケーター / 挿入ライン | |
| strategy | ストラテジー | |
| activation (constraint) | アクティベーション（制約） | |
| long press | 長押し | |
| pointer / mouse / touch / pen | ポインター / マウス / タッチ / ペン | |
| keyboard drag | キーボードドラッグ | |
| screen reader | スクリーンリーダー | |
| live region | ライブリージョン | |
| announcement | 読み上げ | `announcements`：スクリーンリーダー向けのテキスト |
| haptics | 触覚フィードバック | 振動 |
| monitor | モニター | `useDnDMonitor` |
| hook | フック | `onBeforeDrop`、`onDrop` |
| controlled list | 制御されたリスト | |
| the default write | デフォルトの書き込み | |
| virtual list / virtualizer | 仮想リスト / 仮想化ライブラリ | |
| axis / bounds / snap to a grid | 軸 / 境界 / グリッドへのスナップ | |
| viewport | ビューポート | |
| event / callback / handler | イベント / コールバック / ハンドラー | |
| option | オプション | |
| store | ストア | Pinia |
| hydration mismatch | ハイドレーションミスマッチ | Vue の日本語ドキュメントに合わせる |
| development build / production build | 開発ビルド / 本番ビルド | |
