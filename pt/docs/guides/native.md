---
title: "Arquivos e outros apps"
description: "O arrastar e soltar do próprio navegador, como arrastes da biblioteca — arquivos, links e texto de outros apps para alvos de drop e listas que abrem espaço para eles, itens arrastados para fora da página, e entre janelas do seu app."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/native"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Os arrastes da biblioteca vivem dentro da página. O navegador tem um arrastar e soltar próprio que
atravessa as bordas da página: arquivos da área de trabalho, um link de outra aba, texto de outro
app, e itens seus arrastados para todos esses lugares. A biblioteca também roda esses arrastes,
como arrastes do provider: os alvos se acendem, as listas abrem espaço, os eventos e os textos do
leitor de tela são os de sempre.

<example height="34rem" hint="Solte imagens, links ou texto de outros apps; arraste um card para fora, ou para esta página em uma segunda janela" name="moodboard">



</example>

## De fora da página

Um alvo aceita esses arrastes com `external`, dizendo o que aceita. Alvos sem ele os ignoram.

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
      Aceita
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
      Arquivos: <code>
        true
      </code>
      
       qualquer um, tipos MIME e extensões como <code>
        <input accept>
      </code>
      
       os lê (<code>
        'image/*, .md'
      </code>
      
      ), ou uma função consultada arquivo por arquivo. Pastas, nunca.
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
      
      : um arquivo por vez. Um arraste de vários é recusado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        links
      </code>
    </td>
    
    <td>
      Links (<code>
        text/uri-list
      </code>
      
      ): um endereço de outra aba, um link de uma página.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        text
      </code>
    </td>
    
    <td>
      Texto simples: uma seleção de outro app.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      Outros tipos MIME, exatamente como outros apps os oferecem.
    </td>
  </tr>
</tbody>
</table>

`makeDroppable` aceita a mesma opção: uma zona que aceita uma imagem de avatar está em
[arrastar e soltar](https://zizigy.github.io/docs/guides/drag-and-drop#files-from-the-computer).

### O que o arraste carrega

O navegador guarda os dados de um arraste para si até o drop. Enquanto o arraste continua, a página
só fica sabendo que tipos de dados ele carrega. `active.external` e `e.external` dizem o que se
sabe:

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      Durante o arraste
    </th>
    
    <th>
      No drop
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
      Os tipos MIME que ele oferece: <code>
        Files
      </code>
      
      , <code>
        text/uri-list
      </code>
      
      …
    </td>
    
    <td>
      Os mesmos
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fileTypes
      </code>
    </td>
    
    <td>
      Um tipo MIME por arquivo
    </td>
    
    <td>
      Os mesmos
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Vazio
    </td>
    
    <td>
      Os arquivos que o alvo aceita, como objetos <code>
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
      Vazio
    </td>
    
    <td>
      Os seus links, o seu texto, o seu HTML
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
      Os dados de qualquer tipo que ele oferece
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

### Em uma lista

Uma lista abre espaço para ele como para um draggable simples: com `createItem`, que é consultado
duas vezes: durante o arraste, pelo item que mostra para onde ele vai, e no drop, com os
dados, pelo que entra. Um array de itens insere todos naquele lugar: um card por imagem.

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

- O bloco que está chegando é uma linha da sua lista como qualquer outra: a lista o renderiza, as
linhas em volta deslizam para sair do caminho dele, e `onDrop` recebe os itens reais.
- Árvores também aceitam esses arrastes, um nó por vez: um nó de pasta com um filho por arquivo
guarda vários.
- O evento de drop tem `e.external` com os dados, no `onDrop` da lista como no dos monitores.

## Para fora da página

Com `native`, um arraste de um item com o mouse é o arraste do próprio navegador, então ele pode
sair da página: para a área de trabalho, para um editor, um chat, outra aba.

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

- `data` entrega o item a outros apps como tipos MIME e texto: `text/plain`, `text/uri-list`,
`text/html`. É lido quando o arraste começa. Sem ele, `native: true` carrega o `label` como
texto.
- Na página, o arraste funciona como qualquer outro: alvos, listas que abrem espaço, o drop. O
navegador desenha a imagem arrastada em vez do overlay, e o elemento fica no lugar (`transform`
continua `null` com `overlay: false`).
- Arrastes do item por toque e por teclado continuam sendo da biblioteca: o navegador não tem um
arraste próprio para eles.
- `effect` (`effectAllowed`) diz o que o lugar onde ele é solto pode fazer: `'copyMove'` por
padrão. Um drop em outro lugar termina o arraste com `droppedOutside`, `'move'`, `'copy'` ou
`'link'`, em `onDragEnd`. Uma movimentação tira os itens da lista deles; uma cópia os mantém.

`makeDraggable` aceita `native` da mesma forma.

## Entre janelas

Um item com `native` também carrega a si mesmo: as listas do grupo dele em outra janela do seu app
o aceitam como se viesse de uma das próprias listas delas. Abra o moodboard em uma segunda janela e
arraste um card de uma para a outra.

- Enquanto o arraste continua, a outra janela já tem o item: a lista dela o mostra na posição.
- No drop, ele entra, e aqui ele sai da sua lista (o drop foi uma movimentação). Segure
<kbd value="Ctrl">



</kbd>

 (<kbd value="Option">



</kbd>

 no Mac) para copiá-lo em vez disso.
- Uma lista com `createItem` também é consultada para esses itens, com `active.external.group`
definido e os itens em `active.items[].item`: retorne-os, ou cópias com keys daquela janela. Sem
`createItem`, eles entram como estão.
- Os itens viajam como JSON: datas viram strings, funções ficam de fora.

## Limites

- Os dados chegam só com o drop, nunca antes: planeje o item que aparece durante o arraste sem
eles.
- Arrastar arquivos é para quem usa mouse e trackpad. Ofereça também um `<input type="file">` ao
lado da zona.
- Um único provider da página aceita arrastes de fora: o primeiro que tiver um alvo para eles.
- No Firefox, um item movido para outra lista durante o arraste e depois solto em outra janela não
fica sabendo desse drop: aqui ele continua onde estava.
- Um item cujo JSON passa de 16 KB ainda vai para outra janela, mas essa janela só o mostra no
drop.

A API está em [makeDroppable](https://zizigy.github.io/docs/api/make-droppable#from-outside-the-page) e
[makeDraggable](https://zizigy.github.io/docs/api/make-draggable#out-of-the-page).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
