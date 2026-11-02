---
title: "Listas ordenáveis"
description: "Listas, barras de abas e grades que se reordenam enquanto você arrasta — makeSortableList renderiza um rascunho, makeSortableItem cria as linhas, e o drop grava a nova ordem no seu ref. Handles, uma linha de drop, trocas."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/sortable-lists"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="25rem" hint="Arraste uma camada pela alça: o painel se move agora, a prancheta no drop" name="layers-panel">



</example>

## Uma lista e as linhas dela

Uma lista ordenável precisa de dois componentes: a lista e a linha dela.

```vue [LayersPanel.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';

const layers = defineModel<Layer[]>({ required: true });
const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: layers });
</script>

<template>
  <ul ref="list">
    <LayerRow v-for="layer in items" :key="layer.id" :layer="layer" />
  </ul>
</template>
```

```vue [LayerRow.vue]
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ layer: Layer }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.layer });
</script>

<template>
  <li ref="el">{{ layer.name }}</li>
</template>
```

A linha se registra na lista em que é renderizada. Um componente pode criar várias listas (duas
colunas, uma lista dentro de outra): cada linha entra naquela cujo elemento a contém, a mais
interna no caso de listas dentro de listas.

## O rascunho

`makeSortableList` retorna `items`, um **rascunho** do seu array. Enquanto você arrasta, o
rascunho se reordena ao vivo: a linha arrastada ocupa a nova posição, e as outras saem do
caminho. O seu array não muda até o drop. Aí a biblioteca grava a nova ordem nele.

O painel de camadas acima mostra os dois: o painel renderiza `items` e se move enquanto você
arrasta; a prancheta lê `layers`, o próprio array, e só reempilha quando você solta.

- Renderize `items`, não o seu array. Renderizando o seu array, nada se move até o drop.
- A gravação acontece depois do `onDrop` da lista. No `onDrop`, o seu array ainda tem a ordem
antiga e `e.result`, a nova.
- `layers` é um ref comum (aqui um `defineModel`, e a gravação emite `update:modelValue`), então
o resto do seu app vê a mudança como qualquer outra.

```ts
makeSortableList(list, {
  items: layers,
  onDrop: (e) => {
    console.log(e.from.index, '→', e.to.index, e.result.get(e.to.list));
  },
});
```

<tip>

Uma store, estado do servidor ou dados imutáveis? Passe um getter ou um `computed` em vez de um
ref. A biblioteca não grava em uma fonte somente leitura: chame `e.preventDefault()` e aplique
`e.result` você mesmo. Veja [listas controladas](https://zizigy.github.io/docs/guides/shared-lists#controlled-lists).

</tip>

## Keys

As linhas são identificadas pelos dados, nunca pelo índice ou por um id automático. Por padrão,
a key é `item.id`, ou o próprio item para strings e números.

```ts
// LayersPanel.vue: your items have another key
makeSortableList(list, { items: layers, getKey: (layer) => layer.uuid });

// LayerRow.vue: `item` is keyed with the list's getKey…
makeSortableItem(el, { item: () => props.layer });
// …or pass the key yourself
makeSortableItem(el, { id: () => props.layer.uuid });
```

- Use a mesma key no `v-for`: `:key="layer.uuid"`. Com `:key="index"` as linhas erradas são
animadas e o estado delas pula de uma linha para outra.
- As keys precisam ser únicas entre todas as listas que trocam itens.
- Passe `item` e `id` como getters, para que uma linha continue sincronizada quando as props dela
mudam.

## Handles

Por padrão, a linha inteira inicia um arraste, exceto os botões, inputs e outros controles dentro
dela: o olho e o cadeado de uma camada continuam sendo botões comuns. Passe `handle` para
arrastar por uma parte só:

```vue [LayerRow.vue]
<script setup lang="ts">
makeSortableItem(el, { item: () => props.layer, handle: '.grip' });
</script>

<template>
  <li ref="el">
    <button type="button" class="grip" :aria-label="`Move ${layer.name}`">⠿</button>
    {{ layer.name }}
  </li>
</template>
```

- `handle` é um seletor dentro do item, ou um ref de elemento.
- Um arraste com o mouse começa pelo handle na hora, sem os 4 px de sempre. Uma pressão que
não se move continua sendo um clique: o handle pode abrir um menu no `click`.
- O handle recebe os atributos do arraste (`role`, `tabindex`, `aria-*`), e os arrastes por
teclado começam por ele.

Faça do handle um `<button type="button">` com um `aria-label`: ele já é focável, e os leitores de
tela anunciam o rótulo. Um `<span>` simples com um ícone também funciona (a biblioteca dá a ele
`tabindex="0"` e `role="button"`), mas não tem um nome significativo.

<note>

Arrastes por toque começam depois de um toque longo de 200 ms, para que a página ainda possa
rolar. Para arrastar na hora a partir de um handle, dê ao handle `touch-action: none` e ao item
`activation: { touch: { distance: 4 } }`.

</note>

## Estratégias

`strategy` diz como a lista está organizada, para que as linhas abram espaço do jeito certo:

<table>
<thead>
  <tr>
    <th>
      <code>
        strategy
      </code>
    </th>
    
    <th>
      Para
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'vertical'
      </code>
      
       (padrão)
    </td>
    
    <td>
      Uma coluna de linhas.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'horizontal'
      </code>
    </td>
    
    <td>
      Uma única fileira: abas, chips, uma linha do tempo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'grid'
      </code>
    </td>
    
    <td>
      Grids CSS e fileiras flex que quebram linha, também com itens de tamanhos diferentes.
    </td>
  </tr>
</tbody>
</table>

Uma fileira de abas é uma lista horizontal:

<example height="23rem" hint="Arraste as abas; feche uma ou abra uma nova" name="browser-tabs">



</example>

```ts [Browser.vue]
const { items } = makeSortableList(strip, {
  items: tabs,
  strategy: 'horizontal',
  axis: 'x',        // the tabs stay on their row
  animate: true,    // the buttons open and close tabs: slide the others then too
});
```

O botão de fechar da aba continua funcionando dentro da aba arrastável, e um clique que termina
um arraste não seleciona uma aba. As linhas deslizam sozinhas enquanto você arrasta; `animate`
faz o mesmo para mudanças que nenhum arraste fez, aqui os botões (veja
[animações](https://zizigy.github.io/docs/guides/animations)).

Uma grade ordena em duas dimensões, com blocos de qualquer tamanho:

<example height="31rem" hint="Arraste uma foto, a grande também" name="photo-grid">



</example>

```ts [PhotoGrid.vue]
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });
```

```css
.grid { display: grid; grid-template-columns: repeat(4, 76px); grid-auto-rows: 76px; grid-auto-flow: dense; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
```

`grid-auto-flow: dense` mantém a grade compacta quando um bloco grande se move. Sem isso, a grade
deixa buracos onde um bloco não cabe mais, e ganha uma linha.

## Travar o eixo

```ts
makeSortableList(list, { items: layers, axis: 'y' });
```

`axis: 'y'` mantém o arraste no eixo vertical, `'x'` no horizontal: as camadas e as abas acima
usam isso. O `axis` do próprio item vence o da lista. Para manter o arraste também dentro da
lista, adicione o modificador `restrictToParent`. Mais em [restrições](https://zizigy.github.io/docs/guides/constraints).

## Estilizar a posição

A linha arrastada fica na lista como a posição em que vai pousar, e recebe
`data-dnd-placeholder`. O estilo padrão a esmaece para 40%, com especificidade zero, então
qualquer regra sua vence:

```css [LayerRow.vue]
.layer[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.layer[data-dnd-placeholder] > * {
  visibility: hidden;   /* an empty slot of the row's exact size */
}
```

`makeSortableItem` retorna o mesmo estado como refs, e mais alguns:

<table>
<thead>
  <tr>
    <th>
      Retorna
    </th>
    
    <th>
      O que é
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isPlaceholder
      </code>
    </td>
    
    <td>
      Esta linha é a posição em que um item arrastado vai pousar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDragging
      </code>
    </td>
    
    <td>
      Esta linha está sendo arrastada (todas as linhas arrastadas, em um multi-drag).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      O índice dela no rascunho: muda enquanto você arrasta.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selected
      </code>
    </td>
    
    <td>
      Gravável, ligado à seleção do provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        indicator
      </code>
    </td>
    
    <td>
      No <a href="#an-insertion-line">
        modo indicador
      </a>
      
      , onde a linha de inserção fica.
    </td>
  </tr>
</tbody>
</table>

A lista retorna `isOver` e `isAccepting` para o seu próprio destaque, e `activeKey` e
`activeIndex`, o item arrastado e o lugar dele no rascunho desta lista. Todos os estados, com
demos ao vivo, estão em [estilização](https://zizigy.github.io/docs/guides/styling).

## Desligar coisas

<table>
<thead>
  <tr>
    <th>
      Opção
    </th>
    
    <th>
      O que ela impede
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       em um item
    </td>
    
    <td>
      Este item não pode ser arrastado. Os outros ainda passam por ele: tranque uma camada acima, depois arraste outra por cima dela.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
      
       na lista
    </td>
    
    <td>
      Nenhum arraste sai dela, nenhum drop entra nela.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sort: false
      </code>
      
       na lista
    </td>
    
    <td>
      Os itens dela não podem ser reordenados dentro dela, mas ainda podem sair: uma paleta, veja <a href="/docs/guides/shared-lists#what-goes-in-and-out-pull-and-put">
        listas que compartilham itens
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

Todas recebem um getter ou um ref, e valem para o próximo arraste:

```ts [LayerRow.vue]
makeSortableItem(el, { item: () => props.layer, handle: '.grip', disabled: () => props.layer.locked });
```

Uma linha que precisa ficar em primeiro ou em último, não importa o que as outras façam, não é um
item: renderize-a fora da lista. A camada Background do painel fica abaixo do `<ul>`.

## Mostrar parte dos itens

Uma caixa de busca, uma tag: `filter` mostra os itens para os quais retorna `true`, e um arraste
ordena entre eles. Os outros ficam no seu array, nos seus lugares:

<example height="27rem" hint="Escolha uma tag ou busque, depois arraste uma tarefa: o array mantém as ocultas no lugar" name="filtered-list">



</example>

```ts [Backlog.vue]
const query = ref('');
const tag = ref<Tag | null>(null);

const { items } = makeSortableList(list, {
  items: tasks,
  filter: (task) => (!tag.value || task.tag === tag.value) && task.title.includes(query.value),
});
```

- `items` contém os itens que passam no filtro: renderize-o como sempre. O filtro é reativo:
digitar na caixa de busca atualiza a lista na hora.
- O drop escreve o array inteiro. Cada item oculto fica logo depois do item visível que ele
seguia; quando esse é o que se moveu, ele fica depois do mais próximo antes dele que não se
moveu.
- `e.to.index` e o `activeIndex` da lista contam os itens visíveis. `e.result` contém o array
inteiro, itens ocultos incluídos.

<note>

Um `computed` que filtra o seu array e é passado como `items` também funciona, mas é somente
leitura: você aplicaria `e.result` por conta própria e calcularia para onde vão os itens ocultos.
`filter` faz as duas coisas.

</note>

## Uma linha de inserção

Com `placeholder: 'indicator'`, a lista fica parada enquanto você arrasta, e uma linha mostra
para onde vai o drop. Você desenha a linha:

<example height="27rem" hint="Arraste uma issue: uma linha mostra para onde ela vai" name="issue-table">



</example>

```ts [IssueTable.vue]
const { items, indicator } = makeSortableList(body, { items: issues, placeholder: 'indicator' });
```

```vue [IssueRow.vue]
<script setup lang="ts">
const { indicator } = makeSortableItem(el, { item: () => props.issue });
</script>

<template>
  <div ref="el" class="row" :class="indicator && `drop-${indicator.side}`">…</div>
</template>

<style scoped>
.row.drop-before::before { content: ''; position: absolute; top: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
.row.drop-after::before { content: ''; position: absolute; bottom: -1.5px; left: 6px; right: 6px; height: 2px; background: #42b883; }
</style>
```

<table>
<thead>
  <tr>
    <th>
      Campo de <code>
        indicator
      </code>
    </th>
    
    <th>
      O que contém
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        list
      </code>
    </td>
    
    <td>
      A lista em que o drop entra.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        index
      </code>
    </td>
    
    <td>
      O índice de inserção na lista como ela está renderizada.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        key
      </code>
    </td>
    
    <td>
      O item ao qual a linha está presa; <code>
        null
      </code>
      
       em uma lista vazia (nesse caso, desenhe-a na lista).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        side
      </code>
    </td>
    
    <td>
      <code>
        'before'
      </code>
      
       ou <code>
        'after'
      </code>
      
       desse item; <code>
        'swap'
      </code>
      
       em uma lista que <a href="#swap-instead-of-shift">
        troca de lugar
      </a>
      
      . Árvores acrescentam <code>
        'inside'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        depth
      </code>
      
      , <code>
        parentKey
      </code>
    </td>
    
    <td>
      Só em árvores: onde o drop pousa. Veja <a href="/docs/guides/trees#an-insertion-line">
        árvores
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

- O `indicator` da lista é definido enquanto a linha está naquela lista (a tabela o mostra), e o
`indicator` de um item enquanto a linha está presa àquele item.
- A linha arrastada fica onde estava, marcada como placeholder: esmaeça-a.
- O teclado também move a linha de inserção.
- Um drop fora de qualquer alvo cancela neste modo (`dropOutside: 'cancel'`), já que a lista
nunca mostrou outra ordem.
- O overlay cobre parte da linha embaixo dele. Deixe-o um pouco transparente, e a linha de
inserção aparece através dele: `[data-dnd-overlay] .row { opacity: 0.85 }`.

## Trocar de lugar em vez de deslocar

Com `behavior: 'swap'`, o item arrastado troca de lugar com o que está embaixo dele, e os outros
ficam onde estão:

<example height="29rem" hint="Troque duas pessoas de lugar, entre as colunas também; experimente On drop" name="on-call">



</example>

```ts [Rotation.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'rotation',
  behavior: 'swap',
  placeholder: () => props.placeholder,   // 'item' (live) or 'indicator' (on drop)
  onDrop: (e) => {
    if (e.partner) emit('swap', `${e.items[0]?.name} ⇄ ${e.partner.item.name}`);
  },
});
```

- **Ao vivo** (`placeholder: 'item'`, padrão): a troca aparece enquanto você arrasta. Voltar, ou
sair da lista, a desfaz.
- **No drop** (`placeholder: 'indicator'`): nada se move até o drop. O indicador marca o item com
o qual o drop troca, `side: 'swap'`: contorne esse item em vez de desenhar uma linha. As setas
movem a marca de item em item; de volta ao item arrastado, não há marca.

```vue [PersonCell.vue]
<li ref="el" :class="{ target: indicator?.side === 'swap' }">…</li>
```

O evento de drop tem `mode: 'swap'` e `partner`, o item com o qual houve a troca: a `key` dele, o
`item`, e o `from` e o `to` dele. Duas listas de um mesmo grupo trocam entre si quando ambas têm
`behavior: 'swap'`, como as duas colunas. O item sob o ponteiro então vai para a outra lista,
então ele precisa ter permissão para sair (`group.pull`) e para entrar (`group.put`): veja
[listas que compartilham itens](https://zizigy.github.io/docs/guides/shared-lists). Um multi-drag ordena em vez de trocar.

## Teclado

Foque uma linha, ou o handle dela, e pressione <kbd value="Space">



</kbd>

 ou <kbd value="Enter">



</kbd>

 para
pegá-la. As setas ao longo da lista a movem uma posição; em grades, para cima e para baixo vão
para a fileira seguinte, e as setas no sentido transversal à lista a levam para a próxima lista do
grupo. Depois do fim de uma lista, a seta segue para a próxima lista naquela direção (listas
empilhadas uma acima da outra) ou, se não houver, para um alvo de drop ali, como uma lixeira.
Pressione <kbd value="Space">



</kbd>

 ou <kbd value="Enter">



</kbd>

 de novo para soltar,
<kbd value="Escape">



</kbd>

 para devolvê-la. Todas as demos desta página funcionam assim. Os textos para
leitores de tela estão em [acessibilidade](https://zizigy.github.io/docs/guides/accessibility).

## Animações

As linhas deslizam para os novos lugares enquanto você arrasta, e a linha solta pousa na sua
posição. A própria lista cresce ou encolhe até o novo tamanho quando linhas entram e saem
(`animateSize`). Isso vem ligado por padrão e não precisa de código. Não envolva as linhas em
`<TransitionGroup>`: os movimentos seriam animados duas vezes. Também não coloque um `transition`
CSS no `transform` das linhas. Para mudanças que nenhum arraste fez (adicionar, remover,
embaralhar), ligue a opção `animate` da lista, como as abas fazem. Veja
[animações](https://zizigy.github.io/docs/guides/animations).

A lista completa de opções está na API do [makeSortableList](https://zizigy.github.io/docs/api/make-sortable-list) e do
[makeSortableItem](https://zizigy.github.io/docs/api/make-sortable-item).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
