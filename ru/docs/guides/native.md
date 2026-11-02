---
title: "Файлы и другие приложения"
description: "Собственный drag and drop браузера как драги библиотеки — файлы, ссылки и текст из других приложений в цели и списки, которые освобождают для них место, элементы, вытащенные за пределы страницы, и перетаскивание между окнами вашего приложения."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/native"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Драги библиотеки живут внутри страницы. У браузера есть собственный drag and drop, который
пересекает границы страницы: файлы с рабочего стола, ссылка из другой вкладки, текст из другого
приложения и ваши элементы, вытащенные во все эти места. Библиотека ведёт и такие драги — как
драги провайдера: цели подсвечиваются, списки освобождают место, события и тексты для
скринридеров — обычные.

<example height="34rem" hint="Бросайте изображения, ссылки или текст из других приложений; вытащите карточку наружу или в эту страницу во втором окне" name="moodboard">



</example>

## Извне страницы

Цель принимает такие драги с `external`, где сказано, что она принимает. Цели без него их
игнорируют.

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
      Принимает
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
      Файлы: <code>
        true
      </code>
      
       — любые; MIME-типы и расширения, как их читает <code>
        <input accept>
      </code>
      
       (<code>
        'image/*, .md'
      </code>
      
      ); или функция, которую спрашивают о каждом файле. Папки — никогда.
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
      
      : по одному файлу. Драг нескольких отклоняется.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        links
      </code>
    </td>
    
    <td>
      Ссылки (<code>
        text/uri-list
      </code>
      
      ): адрес из другой вкладки, ссылка со страницы.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        text
      </code>
    </td>
    
    <td>
      Обычный текст: выделение из другого приложения.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      Другие MIME-типы, ровно так, как их предлагают другие приложения.
    </td>
  </tr>
</tbody>
</table>

`makeDroppable` принимает ту же опцию: зона, которая принимает изображение для аватара, есть в
руководстве [drag and drop](https://zizigy.github.io/docs/guides/drag-and-drop#files-from-the-computer).

### Что несёт драг

Браузер держит данные драга при себе, пока его не бросят. Пока драг удерживают, страница
узнаёт только, какие виды данных он несёт. `active.external` и `e.external` говорят, что
известно:

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      Пока драг удерживают
    </th>
    
    <th>
      При броске
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
      MIME-типы, которые он предлагает: <code>
        Files
      </code>
      
      , <code>
        text/uri-list
      </code>
      
      …
    </td>
    
    <td>
      Те же
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fileTypes
      </code>
    </td>
    
    <td>
      По одному MIME-типу на файл
    </td>
    
    <td>
      Те же
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Пусто
    </td>
    
    <td>
      Файлы, которые принимает цель, как <code>
        File
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        urls
      </code>
      
      , <code>
        text
      </code>
      
      , <code>
        html
      </code>
    </td>
    
    <td>
      Пусто
    </td>
    
    <td>
      Его ссылки, его текст, его HTML
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
      Данные любого типа, который он предлагает
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dropped
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

### В список

Список освобождает для него место, как для обычного перетаскиваемого элемента, — с
`createItem`, которого спрашивают дважды: пока драг удерживают — об элементе, который показывает,
куда он попадёт, и при броске, с данными, — о том, что вставляется. Массив элементов
вставляется весь на это место: по карточке на каждое изображение.

```ts [cards.ts]
export const fromOutside = (active: Active): Card | Card[] | undefined => {
  const { external } = active;
  if (!external) return undefined;
  // While it is held: a tile that says what is coming.
  if (!external.dropped) return { id: 'incoming', kind: 'incoming', label: incoming(external) };
  // At the drop: a card each.
  if (external.files.length) {
    return external.files.map((file) => ({ id: uid(), kind: 'image', src: URL.createObjectURL(file), name: file.name }));
  }
  if (external.urls.length) return external.urls.map((url) => ({ id: uid(), kind: 'link', url, title: host(url) }));
  const text = external.text.trim();
  return text ? { id: uid(), kind: 'note', text } : undefined;
};
```

- Плитка входящего драга — строка вашего списка, как любая другая: список рендерит её,
соседние строки отъезжают с её пути, а `onDrop` получает настоящие элементы.
- Деревья тоже принимают такие драги, по одному узлу: узел-папка с потомком на каждый файл
вмещает несколько.
- В событии броска есть `e.external` с данными — и в `onDrop` списка, и в мониторах.

## За пределы страницы

С `native` драг элемента мышью — это собственный драг браузера, поэтому он может покинуть
страницу: на рабочий стол, в редактор, в чат, в другую вкладку.

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

- `data` отдаёт элемент другим приложениям в виде MIME-типов и текста: `text/plain`,
`text/uri-list`, `text/html`. Читается, когда драг начинается. Без неё `native: true` несёт
`label` как текст.
- На странице драг работает как любой другой: цели, списки, которые освобождают место, бросок.
Браузер рисует перетаскиваемое изображение вместо оверлея, а элемент остаётся на месте
(`transform` остаётся `null` при `overlay: false`).
- Драги элемента касанием и с клавиатуры остаются драгами библиотеки: своего драга для них у
браузера нет.
- `effect` (`effectAllowed`) говорит, что может сделать место, куда его бросили: по умолчанию
`'copyMove'`. Бросок в другом месте завершает драг с `droppedOutside` — `'move'`, `'copy'`
или `'link'` — в `onDragEnd`. Перемещение забирает элементы из их списка; копирование
оставляет их.

`makeDraggable` принимает `native` так же.

## Между окнами

Элемент с `native` несёт ещё и самого себя: списки его группы в другом окне вашего приложения
принимают его так, будто он пришёл из одного из их собственных списков. Откройте мудборд во
втором окне и перетащите туда карточку.

- Пока драг удерживают, в другом окне элемент уже есть: его список показывает его на месте.
- При броске он попадает туда, а здесь покидает свой список (бросок был перемещением). Зажмите
<kbd value="Ctrl">



</kbd>

 (<kbd value="Option">



</kbd>

 на Mac), чтобы вместо этого скопировать его.
- Список с `createItem` спрашивают и о таких элементах — с заданным `active.external.group` и
элементами в `active.items[].item`: верните их или копии с ключами этого окна. Без
`createItem` они попадают в список как есть.
- Элементы передаются как JSON: даты становятся строками, функции отбрасываются.

## Ограничения

- Данные приходят только с броском, никогда раньше: продумайте элемент, который показывается,
пока драг удерживают, без них.
- Перетаскивание файлов — для пользователей мыши и тачпада. Поставьте рядом с зоной ещё и
`<input type="file">`.
- Драги извне принимает один провайдер на странице: первый, у которого есть для них цель.
- В Firefox элемент, который во время драга перенесли в другой список, а потом бросили в
другом окне, не узнаёт об этом броске: здесь он остаётся там, где был.
- Элемент, чей JSON больше 16 КБ, всё равно попадает в другое окно, но это окно показывает его
только при броске.

API — в [makeDroppable](https://zizigy.github.io/docs/api/make-droppable#from-outside-the-page) и
[makeDraggable](https://zizigy.github.io/docs/api/make-draggable#out-of-the-page).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
