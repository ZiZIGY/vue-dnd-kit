---
title: "Introdução"
description: "Vue DnD Kit é arrastar e soltar para Vue 3 — listas ordenáveis, quadros kanban, árvores, multi-drag e zonas de drop, com animações e acessibilidade de fábrica."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/getting-started/introduction"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Vue DnD Kit é arrastar e soltar para Vue 3. Listas ordenáveis, quadros kanban, árvores, multi-drag,
cópia e zonas de drop — com animações, teclado e anúncios para leitores de tela de fábrica, na sua
própria marcação.

<example height="27rem" hint="Mova paradas entre os dias; os chips abaixo mostram os outros gestos" name="at-a-glance" title="Visão geral">



</example>

Nada disso é código da própria demo: as listas se reordenam ao vivo, as colunas trocam paradas
(um `group`), uma seleção se move junto (`selected`), <kbd value="Alt">



</kbd>

 transforma um movimento em
cópia (`clone`), e o teclado faz tudo isso de posição em posição. A demo renderiza as paradas e
passa algumas opções.

## O que é

Um conjunto de **composables** e um componente **provider**. Você renderiza os seus próprios
elementos e passa os template refs deles para os composables; a biblioteca cuida do resto: entrada
por ponteiro, toque e teclado, encontrar o alvo, reordenar, animar, rolar automaticamente e contar
aos leitores de tela o que aconteceu.

```vue [Day.vue]
<script setup lang="ts">
const listRef = useTemplateRef<HTMLElement>('list');
// `items` is the draft: it reorders while you drag. On drop, `day.stops` gets the new order.
const { items } = makeSortableList(listRef, { items: toRef(props.day, 'stops'), group: 'trip' });
</script>

<template>
  <ul ref="list">
    <StopCard v-for="stop in items" :key="stop.id" :stop="stop" />
  </ul>
</template>
```

Ela não renderiza nada próprio, exceto um **overlay** flutuante — por padrão, um clone do elemento
que está sendo arrastado. Sua marcação e seus estilos continuam sendo seus: a biblioteca adiciona
atributos ARIA e alguns atributos `data-dnd-*` para estilizar os estados de um arraste.

## O que você ganha

- **Listas e grades ordenáveis** que se reordenam ao vivo enquanto você arrasta, na vertical, na
horizontal ou em grade.
- **Listas que compartilham itens**: quadros kanban, paletas que distribuem cópias, trocas de
lugar, regras para o que vai aonde.
- **Árvores** com aninhamento por um arraste para o lado ou passando sobre uma linha, limites de
profundidade e regras.
- **Multi-drag** com a sua própria seleção (Ctrl/Cmd-clique, um retângulo de seleção): o bloco se
move junto.
- **Zonas de drop** com regras do que aceitam, e drops que você confirma, recusa ou aplica você
mesmo.
- **Animações por padrão**: os itens deslizam para os novos lugares, o drop pousa na sua posição,
um cancelamento volta ao lugar.
- **Acessibilidade**: arraste por teclado de posição em posição, anúncios ao vivo, atributos ARIA.
- **Listas virtuais** com TanStack Virtual ou VueUse: milhares de linhas.
- **Sensores e ações**: os seus próprios dispositivos de entrada, e arrastes comandados pelo código.
- **DevTools**: uma aba com um mapa ao vivo de cada lista, um joystick e um log de cada arraste.

## Como ela é diferente

- **Seus dados continuam seus até o drop.** Você renderiza um *rascunho* do seu array. Enquanto
você arrasta, só o rascunho se move; no drop, a biblioteca grava a nova ordem no seu ref, ou
entrega `e.result` para você aplicar (stores, servidores, desfazer).
- **Sem componentes wrapper.** As linhas são os seus elementos, com um ref e uma chamada, então os
componentes de um UI kit (Nuxt UI, Vuetify, o seu próprio) são arrastados como estão.
- **Animada por padrão, sem atrapalhar.** Reordenações, pousos e cancelamentos são animados de
fábrica; desligue, ajuste, ou entregue as animações ao GSAP ou ao motion.
- **O teclado não é um remendo.** Todo arraste pode ser feito com <kbd value="Space">



</kbd>

 e as setas,
os movimentos são anunciados, e o foco volta para onde estava.
- **Um provider para o app inteiro.** Áreas dão a partes da página as suas próprias regras (um
eixo, limites, uma grade, uma pressão mais longa), então recursos aninhados não precisam de
providers aninhados.
- **A entrada é plugável.** Ponteiro e teclado são sensores; escreva o seu para um gamepad ou um
comando de voz, ou mova itens pelo código com `@vue-dnd-kit/actions`.

## Como as peças se encaixam

<table>
<thead>
  <tr>
    <th>
      Peça
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
        DnDProvider
      </code>
    </td>
    
    <td>
      Controla o arraste: entrada, o overlay, a seleção, a rolagem automática, os anúncios.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableList
      </code>
      
       / <code>
        makeSortableItem
      </code>
    </td>
    
    <td>
      Uma lista que se reordena, e as linhas dela.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSortableTree
      </code>
    </td>
    
    <td>
      Uma árvore, renderizada de forma plana com profundidades.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDraggable
      </code>
      
       / <code>
        makeDroppable
      </code>
    </td>
    
    <td>
      Arraste livre e zonas de drop.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeDragArea
      </code>
    </td>
    
    <td>
      Regras para uma parte da página: eixo, limites, encaixe, rolagem automática, ativação.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        makeSelectionArea
      </code>
    </td>
    
    <td>
      Seleção por retângulo.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useDnD
      </code>
      
       / <code>
        useDnDMonitor
      </code>
    </td>
    
    <td>
      O estado do arraste e seus eventos, em qualquer lugar sob o provider.
    </td>
  </tr>
</tbody>
</table>

<tip>

Vindo da v2? A API mudou: `useDnDProvider` virou `useDnD`, e `makeConstraintArea` e
`makeAutoScroll` viraram `makeDragArea`. Listas ordenáveis agora vêm embutidas. Veja
[migrando da v2](https://zizigy.github.io/docs/getting-started/migrating-from-v2).

</tip>

## Requisitos

- Vue **3.5** ou mais recente.
- Navegadores modernos: Chrome e Edge 104+, Safari 15.4+, Firefox 104+.
- Funciona com SSR e Nuxt: o overlay e a live region são montados no cliente.

Próximo passo: [instale a biblioteca](https://zizigy.github.io/docs/getting-started/installation) e depois crie uma
primeira lista no [Início rápido](https://zizigy.github.io/docs/getting-started/quick-start).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
