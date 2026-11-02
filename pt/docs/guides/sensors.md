---
title: "Sensores e arrastes programáticos"
description: "Como a entrada vira um arraste — os sensores de ponteiro e de teclado, restrições de ativação, canDrag, sensores seus e arrastes que você roteiriza com @vue-dnd-kit/actions."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Um sensor transforma a entrada em arrastes. Ele só diz ao provider "arraste este item a partir
daqui", depois para onde a entrada se moveu, e se ela soltou ou cancelou. O provider faz o resto,
do mesmo jeito para todo sensor: um arraste por vez, itens desativados recusados, restrições de
ativação, ordenação, rolagem automática, anúncios, <kbd value="Escape">



</kbd>

 e todo o drop.

## Os sensores embutidos

<table>
<thead>
  <tr>
    <th>
      Sensor
    </th>
    
    <th>
      Entrada
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerSensor
      </code>
    </td>
    
    <td>
      Mouse, toque e caneta, por Pointer Events. Ele captura o ponteiro, impede que a página selecione texto ou role sob um arraste por toque, e engole o clique que vem depois de um arraste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      <kbd value="Space">
        
      </kbd>
      
       e <kbd value="Enter">
        
      </kbd>
      
       pegam e soltam, as setas movem, <kbd value="Escape">
        
      </kbd>
      
       cancela — qualquer arraste, arrastes por ponteiro também.
    </td>
  </tr>
</tbody>
</table>

Os dois rodam por padrão. A prop `sensors` do provider substitui a lista:

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, joystick.sensor]">
```

Para desligar os arrastes por teclado, prefira `:keyboard="false"` a deixar `keyboardSensor` de
fora: o sensor de teclado também é o que cancela qualquer arraste com <kbd value="Escape">



</kbd>

. As
teclas dele são redefinidas com `keyboard.keys` (veja
[Acessibilidade](https://zizigy.github.io/docs/guides/accessibility#the-keyboard)).

## Restrições de ativação

Uma pressão não arrasta na hora: ela espera a sua restrição de ativação, para que um clique
continue sendo um clique e um deslizar do dedo ainda possa rolar a página. Troque as regras desta
lista e pressione uma linha:

<example height="34.5rem" hint="Segure uma linha até o anel fechar, ou troque a regra" name="activation-modes">



</example>

Uma restrição tem três campos:

<table>
<thead>
  <tr>
    <th>
      Campo
    </th>
    
    <th>
      O arraste começa…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        distance
      </code>
    </td>
    
    <td>
      Assim que o ponteiro se moveu essa quantidade de px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay
      </code>
    </td>
    
    <td>
      Assim que a pressão durou essa quantidade de ms. Junto com <code>
        distance
      </code>
      
      , o que vier primeiro.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        tolerance
      </code>
    </td>
    
    <td>
      Com <code>
        delay
      </code>
      
      : quanto o ponteiro pode se mover enquanto isso. Além disso, a pressão desiste, para que a página possa rolar. Padrão de 5 px quando não há <code>
        distance
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Sem uma sua, cada tipo de ponteiro tem o seu padrão:

<table>
<thead>
  <tr>
    <th>
      Ponteiro
    </th>
    
    <th>
      Padrão
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Mouse
    </td>
    
    <td>
      Depois de mover 4 px. Na hora quando pressionado em um <code>
        handle
      </code>
      
      , a menos que uma restrição de mouse esteja definida.
    </td>
  </tr>
  
  <tr>
    <td>
      Caneta
    </td>
    
    <td>
      Depois de mover 4 px.
    </td>
  </tr>
  
  <tr>
    <td>
      Toque
    </td>
    
    <td>
      Depois de uma pressão de 200 ms. Mover mais de 5 px antes disso faz desistir, e a página rola.
    </td>
  </tr>
</tbody>
</table>

### Onde defini-las

Por tipo de ponteiro — `mouse`, `touch`, `pen` — no provider, em uma área de arraste ou no item.
Para cada tipo, vence a do próprio item, depois a da área dele, depois a do provider:

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 250, tolerance: 5 } }">
```

```ts
// Inbox.vue: the rules of every drag that starts inside the panel.
makeDragArea(panel, { activation: () => MODES[mode.value].activation });

// One item: a longer press by touch, the area's rule for the mouse.
makeSortableItem(el, { item: () => props.task, activation: { touch: { delay: 400, tolerance: 8 } } });
```

As opções são lidas quando uma pressão começa, então um getter ou um ref as troca ao vivo, como
faz a demo. Arrastes por teclado começam na hora. [Um sensor seu](#a-sensor-of-your-own) pede a sua
própria restrição, ou a configurada para um tipo de ponteiro.

### Um anel de toque longo

Enquanto uma pressão espera, `useDnD().status` é `'activating'` e `activation.progress` vai de 0 a
1 — pelo tempo com `delay`, pela distância percorrida com `distance`. A demo desenha um anel onde
a pressão começou:

```vue [Inbox.vue]
<script setup lang="ts">
const { status, activation } = useDnD();
</script>

<template>
  <svg v-if="status === 'activating'" class="ring" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="17" pathLength="1" :stroke-dasharray="`${activation.progress.value} 1`" />
  </svg>
</template>
```

Dê ao anel `pointer-events: none`: ele fica sob o ponteiro, e o arraste testa o que está ali. Uma
pressão que desiste — moveu-se além da `tolerance`, ou foi solta cedo demais — leva `status`
direto de volta a `'idle'`.

### Handles começam na hora

Com um `handle`, só o handle inicia um arraste, e uma pressão do mouse nele arrasta na hora: pegar
uma alça não deixa nada a distinguir. Uma pressão solta onde começou continua sendo um clique,
então a alça pode abrir um menu no `click` (o ponteiro só é capturado quando se move). Um toque ainda espera o seu toque longo, a menos que o
handle não possa rolar a página. Dê a ele `touch-action: none` e ao item uma distância curta:

```ts [Message.vue]
makeSortableItem(el, {
  item: () => props.chat,
  handle: '.grip',
  // The grip has `touch-action: none`: a touch on it can't scroll, so it drags after 4 px.
  activation: { touch: { distance: 4 } },
});
```

Uma restrição de mouse definida no item, na área dele ou no provider vale para os handles também.
Faça da alça um `<button>`, como faz a demo: ela recebe o foco, então um arraste por teclado
também começa por ela.

## Só algumas pressões

`canDrag` é mais uma barreira em draggables e itens ordenáveis. Ele recebe o evento de entrada e
responde `true` ou `false` para esta pressão. Aqui, arrastes por ponteiro precisam de
<kbd value="Shift">



</kbd>

; o teclado arrasta como sempre:

<example height="28rem" hint="Arraste uma linha com e sem Shift; marque uma caixa, escolha um responsável" name="can-drag">



</example>

```ts [Task.vue]
makeSortableItem(el, {
  item: () => props.task,
  // Never: the row is locked (and says so to screen readers with aria-disabled).
  disabled: () => !!props.task.locked,
  // Per press: pointer drags only with Shift held; the keyboard as usual.
  canDrag: (event) => {
    if (!props.shiftOnly || event instanceof KeyboardEvent || event.shiftKey) return true;
    emit('refused');
    return false;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      Opção
    </th>
    
    <th>
      Consultada
    </th>
    
    <th>
      Use para
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      Ao vivo, e definida como <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      Itens que não podem se mover de jeito nenhum: trancados, somente leitura.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        canDrag
      </code>
    </td>
    
    <td>
      Uma vez por pressão, com o evento dela
    </td>
    
    <td>
      Regras sobre a entrada: uma tecla segurada, um botão, um tipo de ponteiro.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Onde a pressão cai
    </td>
    
    <td>
      Itens que iniciam um arraste só a partir de uma parte.
    </td>
  </tr>
</tbody>
</table>

`canDrag` é consultado antes da restrição de ativação, com o `pointerdown` ou o `keydown`. Um tipo
de ponteiro é mais uma regra que ele pode criar:

```ts
// Mouse and pen drag; a touch on the row always scrolls the page.
canDrag: (event) => !(event instanceof PointerEvent && event.pointerType === 'touch'),
```

Filhos interativos — botões, inputs, checkboxes, campos editáveis — nunca iniciam um arraste por
ponteiro, então continuam funcionando dentro de um draggable, como o checkbox e o menu de
responsável da demo. Com um `handle`, só o handle inicia um.

## Um sensor seu

Um gamepad, um joystick na tela, comandos de voz: qualquer coisa que consiga apontar para um item e
se mover pode conduzir um arraste. Este gamepad é um sensor. Segure <kbd value="A">



</kbd>

 sobre um herói
para pegá-lo, conduza com o direcional, <kbd value="A">



</kbd>

 de novo solta, <kbd value="B">



</kbd>

 cancela. O
mouse e o teclado continuam funcionando ao lado dele:

<example height="30rem" hint="Segure A sobre um herói, depois segure uma seta: o herói se move pela lista" name="joystick">



</example>

`defineSensor` dá ao sensor o seu nome e um `setup` que recebe o lado do provider, uma vez por
provider:

```ts [joystick.ts]
const sensor = defineSensor({
  name: 'joystick',
  // Once per provider, in the browser. The cleanup runs when the provider unmounts.
  setup(ctx) {
    context = ctx;
    return () => {
      context = null;
      drag = null;
    };
  },
});
```

Uma pressão pede um arraste ao provider com `activate()`. O alvo é verificado como uma pressão
real: ele precisa ser um draggable deste provider, não desativado, e não um botão dentro de um:

```ts [joystick.ts]
/** A goes down: drops a running drag, or starts a hold over what is under the cursor. */
const press = () => {
  if (drag?.state === 'dragging') return void drag.drop();
  const at = point();
  const target = document.elementFromPoint(at.x, at.y);
  if (!target || !context) return;
  drag = context.activate({
    target, // checked like a real press: a draggable of this provider, not disabled
    point: at,
    type: 'pointer', // follows points: lists sort under it, containers auto-scroll
    activation: { delay: 300 }, // `useDnD().activation.progress` runs meanwhile
    onEnd: (ended) => {
      if (drag === ended) drag = null;
    },
  }); // null: nothing to drag there
};
```

Depois o arraste se move com o direcional, e A ou B o encerram:

```ts [joystick.ts]
const move = (dx: number, dy: number) => {
  cursor.value = { x: cursor.value.x + dx, y: cursor.value.y + dy }; // clamped in the demo
  drag?.move(point()); // pending: checks the tolerance; dragging: moves
};

const release = () => {
  if (drag?.state === 'pending') drag.cancel(); // A let go before the hold is over
};

const cancel = () => drag?.cancel();
```

Adicione o sensor aos `sensors` do provider, como faz a demo, ou rode-o enquanto um componente
existir com `useSensor(joystick.sensor)`. Os pontos ficam em coordenadas da viewport: a demo
guarda o cursor nas coordenadas do palco, para que ele role com a página, e o converte em
`point()`.

### O que o sensor recebe

`setup(context)` recebe o lado do provider:

<table>
<thead>
  <tr>
    <th>
      Membro
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
        props
      </code>
    </td>
    
    <td>
      As props do provider (<code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      …). Leia-as quando precisar: elas podem mudar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      O status do arraste do provider, seja qual for o sensor que conduz o arraste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag
      </code>
    </td>
    
    <td>
      O arraste atual do provider, pendente ou em andamento, seja qual for o sensor que o iniciou. <code>
        null
      </code>
      
       quando não há nenhum.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activate(options)
      </code>
    </td>
    
    <td>
      Pede um arraste. Retorna um <code>
        SensorDrag
      </code>
      
      , ou <code>
        null
      </code>
      
       quando nenhum arraste pode começar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancela o arraste ou a pressão pendente do provider.
    </td>
  </tr>
</tbody>
</table>

`activate()` recebe:

<table>
<thead>
  <tr>
    <th>
      Opção
    </th>
    
    <th>
      Significado
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        target
      </code>
    </td>
    
    <td>
      Onde a entrada caiu: um elemento dentro de um draggable, ou o id de um draggable. Um elemento é verificado como uma pressão real (handle, nenhum filho interativo); um id pula as verificações.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        point
      </code>
    </td>
    
    <td>
      Onde o arraste começa, em coordenadas da viewport. Padrão: o centro do draggable.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        type
      </code>
    </td>
    
    <td>
      <code>
        'pointer'
      </code>
      
       (padrão): segue pontos, testa os alvos sob o ponteiro, rola automaticamente. <code>
        'keyboard'
      </code>
      
      : move por itens, revela os alvos, devolve o foco no fim.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      Uma restrição (<code>
        { delay: 300 }
      </code>
      
      ), ou um tipo de ponteiro (<code>
        'touch'
      </code>
      
      ) para usar a configurada. Padrão: nenhuma, o arraste começa na hora.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        event
      </code>
    </td>
    
    <td>
      O evento de entrada, passado ao <code>
        canDrag
      </code>
      
       do item (sem ele, <code>
        canDrag
      </code>
      
       não é consultado). Um <code>
        pointerType
      </code>
      
       de toque faz dele um arraste por toque (vibração).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onStart(drag)
      </code>
    </td>
    
    <td>
      O arraste começou, depois da ativação.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnd(drag)
      </code>
    </td>
    
    <td>
      O arraste acabou: abortado, solto ou cancelado — por quem quer que seja.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onResume(drag)
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       respondeu <code>
        'continue'
      </code>
      
      : o arraste continua, e <code>
        move
      </code>
      
      , <code>
        drop
      </code>
      
       e <code>
        cancel
      </code>
      
       voltam a valer.
    </td>
  </tr>
</tbody>
</table>

O `SensorDrag` que ele retorna:

<table>
<thead>
  <tr>
    <th>
      Membro
    </th>
    
    <th>
      O que faz
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        id
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      O id do item arrastado, e <code>
        'pointer'
      </code>
      
       ou <code>
        'keyboard'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        state
      </code>
    </td>
    
    <td>
      <code>
        'pending'
      </code>
      
       (esperando a ativação), <code>
        'dragging'
      </code>
      
      , depois <code>
        'ended'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        started
      </code>
    </td>
    
    <td>
      O arraste começou, mesmo que já tenha terminado desde então.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        move(point)
      </code>
    </td>
    
    <td>
      A entrada se moveu. Enquanto pendente, verifica a tolerância; durante o arraste, move o arraste.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        step(direction)
      </code>
    </td>
    
    <td>
      Arrastes por teclado: um passo de seta, <code>
        'up' | 'down' | 'left' | 'right'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        place({ list, index })
      </code>
    </td>
    
    <td>
      Coloca o item em uma posição de uma lista ordenável, como fazem os movimentos por teclado. Resolve <code>
        false
      </code>
      
       quando nenhuma lista o aceita ali.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop()
      </code>
    </td>
    
    <td>
      Solta. Resolve <code>
        true
      </code>
      
       quando o drop foi concluído, depois que ele pousou.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancela: o item volta ao lugar, ou uma pressão pendente é abandonada.
    </td>
  </tr>
</tbody>
</table>

Chamadas que não se aplicam mais — um movimento depois do fim, um segundo `drop()` — são
ignoradas. Tipos completos: [Sensores](https://zizigy.github.io/docs/api/sensors).

<tip>

Para envolver um sensor embutido, rode o `setup` dele com um contexto seu. Crie-o com
`Object.create(context, { activate: { value: myActivate } })` em vez de um spread, para que os
getters ao vivo (`status`, `drag`, `props`) continuem funcionando.

</tip>

## Arrastes programáticos

`@vue-dnd-kit/actions` move itens pelo código: botões "Mover para cima", menus, atalhos de
teclado, desfazer, tours de onboarding, testes. Ele é construído sobre a API pública de sensores, e
os arrastes dele são de verdade: anunciados e animados, passando por `onBeforeDrop`, `onDrop`,
`e.result` e `preventDefault()`, sob as regras do provider (um arraste por vez, itens desativados,
`accept` e `group.put`).

<example height="31.5rem" hint="Passe o mouse sobre uma faixa para ver as setas, embaralhe, ou toque o arraste roteirizado" name="actions">



</example>

```bash
npm i @vue-dnd-kit/actions
```

### moveItem: uma chamada, um movimento

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';

const { moveItem } = useDnDActions(); // in setup, under a provider

await moveItem('card-1', { index: 0 }); // to the top of its list
await moveItem('card-1', { list: 'done' }); // to the end of another list
await moveItem('card-1', { list: 'done', index: 2 }); // to a place in another list
```

- `list` é o `id` de uma lista ordenável. Sem ele, o item fica na sua lista.
- `index` é onde o item termina, contado sem o próprio item, e limitado ao tamanho da lista. Sem
ele, o item vai para o fim.
- Resolve `true` quando o drop foi concluído, `false` quando o item não está renderizado ou está
desativado, nenhuma lista o aceita ali, ou o drop foi recusado.
- As chamadas entram em fila: cada uma espera até o provider ficar ocioso, então um segundo clique
rápido não se perde. O embaralhamento da demo são cinco chamadas seguidas.
- Ele roda como um arraste por teclado, então é anunciado e o foco fica no item.
- Só listas: posições em árvores também têm uma profundidade.

Veja [Acessibilidade](https://zizigy.github.io/docs/guides/accessibility#moving-without-dragging) para uma linha com botões
de mover.

### startDrag: um arraste roteirizado

```ts
const { startDrag } = useDnDActions();

const drag = startDrag('card-1'); // null when it can't start now
if (drag) {
  await drag.moveTo(document.querySelector('#trash')!); // onto an element
  await drag.moveTo({ x: 400, y: 120 }); // to a point, in viewport coordinates
  await drag.moveTo({ list: 'done', index: 2 }); // to a list position
  await drag.drop(); // true when the drop went through; or drag.cancel()
}
```

`moveTo` resolve depois que o movimento foi renderizado, `drop` depois que o drop pousou. O "Play a
scripted drag" da demo desliza a última faixa para cima em pequenos passos de `moveTo`, depois a
solta no topo. `startDrag(id, { from: { x, y } })` pega o item em um ponto em vez de no centro.

### Passar um arraste para o teclado

`startDrag(id, { type: 'keyboard' })` ergue o item como um arraste por teclado. O seu código pode
movê-lo com `await drag.step('down')`, ou deixá-lo para o usuário: o sensor de teclado conduz todo
arraste por teclado, seja quem for que o iniciou. Isso dá um item de menu "Mover":

<example height="26rem" hint="Abra o menu de uma linha: setas, ou envie-a para a outra semana" name="move-menu">



</example>

```ts [Row.vue]
const { moveItem, startDrag } = useDnDActions();

// One move in one call: picked up, put there and dropped, announced and animated.
const toOther = () => moveItem(props.task.id, { list: props.other.id, index: 0 });
// A keyboard drag, handed to the arrow keys: Space or Enter drops, Escape cancels.
const withKeys = () => {
  el.value?.focus();
  startDrag(props.task.id, { type: 'keyboard' });
};
```

As setas movem a linha de posição em posição, <kbd value="ArrowLeft">



</kbd>

 e <kbd value="ArrowRight">



</kbd>


para a outra semana (as listas compartilham um `group`). Quando o arraste termina, o foco volta
para a linha. As dicas de teclas embaixo do quadro se acendem enquanto
`useDnD().active.value?.sensor` é `'keyboard'`.

### Fora de componentes

`useDnDActions()` roda um sensor, chamado `actions`, no provider acima. Para conduzir um provider a
partir de uma store ou de um harness de testes, ou sob um nome seu, crie as ações em um sensor que
você mesmo roda:

```ts
import { defineSensor } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';

export let tour: DnDActions | undefined;
export const tourSensor = defineSensor({
  name: 'tour',
  setup: (context) => void (tour = createDnDActions(context)),
});
```

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
```

Depois, `await tour?.moveItem('card-1', { list: 'done' })` de qualquer lugar. Durante a
renderização no servidor nada é arrastado: `moveItem` resolve `false` e `startDrag` retorna `null`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
