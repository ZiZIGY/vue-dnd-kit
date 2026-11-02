---
title: "Decidindo um drop"
description: "Aceite, recuse ou adie um drop — regras durante o arraste ou ao soltar, parte de um multi-drag, um diálogo, um servidor que precisa concordar antes, monitores que vetam e drops fora de qualquer alvo."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/drop-decisions"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Arraste um card para **Done**. O drop espera a sua resposta: mover o card, continuar arrastando
para outro lugar, ou cancelar.

<example height="25rem" hint="Arraste um card para Done" name="drop-confirm">



</example>

## onBeforeDrop

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => (e.items.some((task) => task.locked) ? 'reject' : 'accept'),
});
```

Listas, árvores, alvos de drop (`makeDroppable`) e monitores (`useDnDMonitor`) aceitam um
`onBeforeDrop`. Ele roda quando o arraste é solto, antes de qualquer coisa mudar, e a resposta
dele decide:

<table>
<thead>
  <tr>
    <th>
      Resposta
    </th>
    
    <th>
      O que acontece
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       ou nada
    </td>
    
    <td>
      O drop é concluído.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'reject'
      </code>
      
       ou <code>
        false
      </code>
    </td>
    
    <td>
      Sem drop: os itens voltam ao lugar. Um erro lançado também rejeita.
    </td>
  </tr>
  
  <tr>
    <td>
      Um array de keys
    </td>
    
    <td>
      Só esses itens são soltos; os outros voltam ao lugar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'continue'
      </code>
    </td>
    
    <td>
      Sem drop, e o arraste continua.
    </td>
  </tr>
  
  <tr>
    <td>
      Uma promise de qualquer um desses
    </td>
    
    <td>
      O overlay espera onde foi solto até a promise se resolver.
    </td>
  </tr>
</tbody>
</table>

Listas e árvores passam um `SortableDropEvent`: `keys`, `items`, `from`, `to`, `mode`, `sameList` e
`result`, os novos arrays de cada lista que o drop altera. Alvos de drop e monitores recebem o
`DnDEvent` genérico: `active`, `over`, `position` e `source`. Veja [eventos](https://zizigy.github.io/docs/api/events).

## Uma regra durante o arraste, ou ao soltar

Email e Chat aceitam anexos de no máximo 10 MB. Arraste **demo.mov** sobre cada um: Email o
recusa enquanto você passa por cima, Chat o aceita e o devolve quando você solta.

<example height="27rem" hint="Arraste um arquivo de mais de 10 MB para cada lugar" name="drop-rules">



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
      
       (ou o <code>
        accept
      </code>
      
       de um alvo)
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
      Consultado
    </td>
    
    <td>
      Durante o arraste, assim que ele chega à lista.
    </td>
    
    <td>
      Uma vez, quando o arraste é solto.
    </td>
  </tr>
  
  <tr>
    <td>
      O usuário vê
    </td>
    
    <td>
      A lista recusa na hora: nenhuma posição se abre, <code>
        isAccepting
      </code>
      
       é <code>
        false
      </code>
      
      , <code>
        over.accepted
      </code>
      
       é <code>
        false
      </code>
      
      .
    </td>
    
    <td>
      A posição se abre como sempre; os itens voltam ao lugar ao soltar.
    </td>
  </tr>
  
  <tr>
    <td>
      Sabe
    </td>
    
    <td>
      O que é arrastado: <code>
        keys
      </code>
      
      , <code>
        items
      </code>
      
      , <code>
        types
      </code>
      
      , <code>
        from
      </code>
      
      , <code>
        to
      </code>
      
      .
    </td>
    
    <td>
      O drop inteiro: <code>
        to.index
      </code>
      
      , <code>
        sameList
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        result
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Pode
    </td>
    
    <td>
      Dizer sim ou não.
    </td>
    
    <td>
      Esperar uma promise, aceitar algumas keys, manter o arraste em andamento.
    </td>
  </tr>
</tbody>
</table>

Use `group.put` para o que se sabe só pelos itens (um tipo, uma flag, uma contagem): o usuário
fica sabendo antes de soltar. Use `onBeforeDrop` para o que depende do lugar, da resposta do
usuário ou da do servidor. As regras do próprio alvo vêm primeiro: sobre uma lista ou um alvo que
recusa o arraste, o drop é cancelado e o `onBeforeDrop` dele não é consultado.

### Aceitar alguns dos itens

Algumas regras só podem ser verificadas ao soltar, junto a um servidor. As vagas deste workshop
também são reservadas por outras pessoas: ao soltar, a lista pergunta ao servidor quantas restam
e aceita essa quantidade das pessoas arrastadas para dentro. Marque algumas e arraste-as juntas.

<example height="28.5rem" hint="Marque três pessoas, arraste uma delas para o workshop" name="drop-partial">



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

Em um [multi-drag](https://zizigy.github.io/docs/guides/multi-drag), as keys que você retorna pousam juntas e o resto volta
aos seus lugares. O `onDrop` então as vê em `e.accepted` e `e.rejected`, e o `e.result` dele é o
final. Um array vazio não aceita nada: o drop é recusado.

## Continuar arrastando: 'continue'

`'continue'` cancela o drop, não o arraste. Responda **Keep dragging** no diálogo acima: o item
continua na mão a partir de onde estava, a página volta para o modo de arraste, e o usuário
segue em frente.

- Com um mouse ou uma caneta, o item segue o ponteiro sem nenhum botão pressionado. O próximo
soltar — um clique — solta o item, e esse clique nunca chega à página embaixo.
- Um toque pega o item de novo onde o dedo encosta; levantar o dedo o solta.
- Um arraste por teclado continua: as setas movem o item, <kbd value="Space">



</kbd>

 ou
<kbd value="Enter">



</kbd>

 o soltam.
- <kbd value="Escape">



</kbd>

 o cancela, como qualquer arraste.
- O próximo drop consulta o `onBeforeDrop` de novo.

Os monitores ouvem `onDragResume`, e os leitores de tela anunciam que o item não foi solto e ainda
está se movendo (substitua o texto com o `announcements.onDragResume` do provider).

```ts
useDnDMonitor({
  onDragResume() {
    hint.value = 'Still dragging: click to drop, Esc to cancel';
  },
});
```

## Perguntar ao usuário

`onBeforeDrop` pode retornar uma promise. Abra um diálogo, e resolva a promise com o botão que o
usuário escolher:

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

Enquanto a promise está pendente:

- o overlay espera onde foi solto, marcado com `data-dnd-overlay="dropping"`;
- `useDnD()` mantém o estado que tinha no momento de soltar, e `status` é `'dropping'`;
- a página sai do modo de arraste: o cursor e a seleção de texto voltam, então um diálogo funciona
como sempre;
- nenhum outro arraste pode começar.

<tip>

Um `<dialog>` modal aberto com `showModal()` fica na top layer, acima do overlay que espera.
Transforme o evento `cancel` dele (<kbd value="Escape">



</kbd>

) em `'reject'`, como o exemplo faz.

</tip>

## A ordem dos hooks

Reordene as notas, solte uma na lixeira, depois troque uma resposta e faça de novo. O painel
lista os hooks do último drop na ordem em que rodaram.

<example height="27.5rem" hint="Mova uma nota ou jogue uma na lixeira, depois troque uma resposta para reject ou continue" name="drop-hooks">



</example>

1. O `onBeforeDrop` de cada `useDnDMonitor`, um de cada vez. Um `'reject'` ou um `'continue'`
encerra a consulta; keys restringem o drop.
2. O `onBeforeDrop` do alvo: a lista ou a árvore em que os itens entram, ou o alvo de drop.
3. O `onDrop` só do alvo: uma lista que os itens deixam rumo a outra não é consultada, e o novo
array dela está no `e.result` do alvo. Quando itens são removidos (uma lixeira,
`dropOutside: 'remove'`), o `onDrop` da lista deles roda, com `to.index` igual a `-1`.
4. A gravação padrão: cada lista que o drop altera recebe o seu novo array.
5. O `onDragEnd` do provider (`@drag-end`) e dos monitores. Depois o overlay pousa, e
`onDragSettle` (`@drag-settle`) avisa que pousou.

Um drop recusado pula direto para `onDragCancel` (`@drag-cancel`), e os itens voltam ao lugar. Um
`'continue'` também encerra a consulta, com `onDragResume`: o arraste continua, e o próximo drop
consulta de novo.

Os monitores decidem antes do alvo, então um veto nunca vem depois que uma lista já aplicou um
drop por conta própria. Isso faz de um monitor o lugar para regras sobre todo drop do app:

```ts [Monitor.vue]
const { syncing } = useSync();

// Read-only while syncing: every drop under the provider flies back.
useDnDMonitor({
  onBeforeDrop: () => (syncing.value ? 'reject' : 'accept'),
});
```

## onDrop: avisado antes da gravação

```ts
makeSortableList(listRef, {
  items: tasks,
  onDrop: (e) => {
    // `tasks` still holds the old order, `e.result` the new one.
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

O `onDrop` de uma lista roda assim que o drop é aceito, de forma síncrona, logo antes de a lista
gravá-lo. Para agir depois da gravação, use o `@drag-end` do provider ou
`useDnDMonitor({ onDragEnd })`. Em um alvo de drop simples, o `onDrop` é onde você muda os seus
dados: a biblioteca não move nada por ele.

## Stores e servidores: listas controladas

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

A biblioteca só grava um drop em um ref gravável. Um getter, um `computed` ou um ref `readonly`
nunca é gravado: chame `e.preventDefault()` e aplique `e.result` você mesmo — os novos arrays de
cada lista que o drop altera, por id de lista. `preventDefault()` pula a gravação em todas elas, já
que gravar só em algumas perderia ou duplicaria itens. Os builds de desenvolvimento avisam quando o
drop de uma lista somente leitura fica a cargo da biblioteca.

### Salvar em um servidor primeiro

Mova um card com o servidor **flaky** (uma requisição sim, outra não, falha) ou **down**. O card
espera com um selo enquanto a requisição roda, depois pousa, ou volta ao lugar se ela falhou.

<example height="31.5rem" hint="Mova cards, depois mude o servidor para flaky ou down" name="drop-server">



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

Aplique `e.result` antes de a promise resolver, e o overlay pousa na nova ordem. Quando a
requisição falha, não aplique nada e rejeite: os itens voltam ao lugar, e os monitores ouvem
`onDragCancel`.

O selo vem do slot `#overlay` do provider, que renderiza o overlay de todo arraste. Um
`DragPreview` mostra a cópia de sempre do card, e o selo fica por cima enquanto a requisição roda:

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

## Soltar fora de qualquer alvo

Arraste um app para fora do dock e solte, em cada modo.

<example height="24.5rem" hint="Arraste um app para fora do dock e solte" name="drop-outside">



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
      Um drop fora de qualquer alvo…
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
      Pousa onde o placeholder está: o último lugar que a lista mostrou. O padrão.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      É cancelado: os itens voltam ao lugar. O padrão com <code>
        placeholder: 'indicator'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      Remove os itens da lista deles. O <code>
        onBeforeDrop
      </code>
      
       da lista é consultado primeiro, e o <code>
        onDrop
      </code>
      
       dela recebe <code>
        to.index
      </code>
      
       igual a <code>
        -1
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Ele é lido no drop, então um ref ou um getter pode trocá-lo. Uma lixeira faz o mesmo de propósito:
`makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`. Veja
[arrastar e soltar](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
