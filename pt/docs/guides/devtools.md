---
title: "DevTools"
description: "Uma aba Vue DnD Kit no Vue DevTools e no Nuxt DevTools — um minimapa ao vivo, um joystick que arrasta de verdade, edição de opções ao vivo e um log de cada arraste."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/devtools"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`@vue-dnd-kit/devtools` adiciona uma aba **Vue DnD Kit** ao Vue DevTools (`vite-plugin-vue-devtools`)
e ao Nuxt DevTools. Ela mostra todas as listas, árvores e alvos de drop da página em um minimapa ao
vivo, arrasta qualquer item com um joystick, edita opções enquanto o app roda e registra o que cada
arraste fez. Ela só funciona em desenvolvimento: nada dela chega a um build de produção.

A aba é uma página própria, servida pelo seu servidor de desenvolvimento ao lado do seu app, então
ela não pode rodar dentro desta documentação. Três passos a configuram.

## Instalação

### 1. Adicione os pacotes

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

`@vue-dnd-kit/actions` é uma peer dependency: os movimentos da aba passam por ele. O npm 7+ e o
pnpm o instalam sozinhos; com o Yarn 1, adicione-o.

### 2. Adicione o plugin

<code-group>

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vueDnDKitDevtools } from '@vue-dnd-kit/devtools/vite';

export default defineConfig({
  // Next to the Vue DevTools plugin: the tab joins its sidebar.
  plugins: [vueDevTools(), vueDnDKitDevtools(), vue()],
});
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // With @vue-dnd-kit/devtools installed, the tab appears in development.
  modules: ['@vue-dnd-kit/nuxt'],
});
```

</code-group>

Com o Vite, o plugin faz três coisas no servidor de desenvolvimento (`vite serve`): serve a aba em
`/__vue-dnd-kit-devtools/` (sob a sua `base`), a adiciona ao Vue DevTools e faz a página se
reportar a ela antes de o seu app começar. Nenhum `app.use()` é necessário, e os builds não são
afetados.

Com o Nuxt, o módulo `@vue-dnd-kit/nuxt` encontra o pacote, serve a aba, a adiciona ao Nuxt
DevTools e instala o lado da página com um plugin de cliente. `vueDndKit: { devtools: false }` a
desliga.

### 3. Rode o app em desenvolvimento

Inicie o servidor de desenvolvimento como sempre (`vite`, `nuxt dev`) e abra o app: a aba está
pronta. Todo provider da página aparece nela, seja qual for o app em que ele é renderizado.

### Sem os plugins

Para um servidor de desenvolvimento seu, ou uma página que o Vite não serve a partir de um
`index.html` (configurações de SSR), instale o lado da página você mesmo:

```ts [main.ts]
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

Ou importe `@vue-dnd-kit/devtools/auto` primeiro no arquivo de entrada. Use
`vueDnDKitDevtools({ inject: false })` quando o plugin deve servir a aba, mas você instala o lado da
página você mesmo; `serveTab()` de `@vue-dnd-kit/devtools/vite` é o middleware que serve a aba.

<note>

Em um build de produção, `app.use(DnDDevtools)` e o import `auto` encolhem para quase nada: todo
ponto de entrada verifica `process.env.NODE_ENV` primeiro, e os bundlers descartam o resto. No
servidor, eles não fazem nada.

</note>

## Abrir a aba

- **Vue DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, ou o botão do Vue no
rodapé da página, depois a aba **Vue DnD Kit**.
- **Nuxt DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, ou o botão do Nuxt,
depois **Vue DnD Kit** (na barra lateral ou no menu de itens extras dela).
- **Uma janela própria**: abra `http://localhost:5173/__vue-dnd-kit-devtools/` no seu servidor de
desenvolvimento, ou o botão ⧉ da aba. Prático em um segundo monitor. Com várias páginas abertas,
um seletor no topo escolhe qual observar.

<warning>

Mantenha a aba em uma janela própria, não em uma aba de navegador em segundo plano da mesma janela:
a página precisa continuar visível, e uma página escondida cancela os arrastes.

</warning>

## A aba em resumo

<table>
<thead>
  <tr>
    <th>
      Parte
    </th>
    
    <th>
      O que contém
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Barra superior
    </td>
    
    <td>
      O que o arraste está fazendo agora (<code>
        dragging card-3 → done (accepts)
      </code>
      
      ), a página observada, <strong>
        ⌖ Pick
      </strong>
      
      , a contagem de opções editadas com um reset, ⧉ (uma janela própria) e o tema.
    </td>
  </tr>
  
  <tr>
    <td>
      Esquerda: o registro
    </td>
    
    <td>
      Todo provider como uma árvore: as listas, árvores, alvos de drop e draggables dele. <strong>
        ☰
      </strong>
      
       o mostra ou esconde.
    </td>
  </tr>
  
  <tr>
    <td>
      Meio: <strong>
        Map
      </strong>
      
       e <strong>
        Log
      </strong>
    </td>
    
    <td>
      O minimapa ao vivo da página, ou o log dos arrastes.
    </td>
  </tr>
  
  <tr>
    <td>
      Direita: <strong>
        Drive
      </strong>
      
      , <strong>
        Options
      </strong>
      
      , <strong>
        State
      </strong>
    </td>
    
    <td>
      O joystick e os botões de mover, as opções do nó escolhido, e o que o provider sabe sobre ele.
    </td>
  </tr>
</tbody>
</table>

Escolha um nó no registro ou um item no mapa, e o lado direito o acompanha.

## O minimapa

Um card ao vivo por lista, árvore e alvo de drop, com cópias dos itens deles onde estão — os mesmos
clones que o overlay mostraria, com o CSS da página. Durante um arraste, ele marca:

- as listas e os alvos que **aceitam** o arraste (azul) ou o **recusam** (vermelho);
- o placeholder, e o alvo sob o ponteiro;
- o ponteiro, a caixa do overlay e a linha de inserção das listas com `placeholder: 'indicator'`.

Um clique escolhe um item e o destaca na página; um clique duplo rola a página até ele. Use o mapa
quando um drop não vai para onde você espera: ele mostra de relance quais listas aceitam o arraste.

## Drive: o joystick

Escolha um item — no mapa, no registro ou com **⌖ Pick**, que captura a próxima pressão em um
draggable da página em vez de deixá-la agir — e empurre a alavanca do joystick. O item é pego e se
move naquela direção, mais rápido quanto mais longe a alavanca estiver do centro. Solte e ele
para; **Drop** e **Cancel** encerram o arraste.

É um arraste por ponteiro de verdade de um sensor chamado `devtools`, feito com a
[API pública de sensores](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own): as listas ordenam sob ele, os
contêineres rolam automaticamente nas bordas, e `onBeforeDrop` e `onDrop` rodam como em qualquer
arraste. Itens desativados não são pegos. Um arraste por teclado iniciado pela página também pode
ser conduzido.

Os itens de listas ordenáveis também ganham botões: para cima, para baixo, para o início, para o
fim, para outra lista do grupo. Cada um é um arraste por teclado de
[`moveItem`](https://zizigy.github.io/docs/guides/sensors#programmatic-drags). Embaixo do joystick, uma cópia grande do que o
overlay mostra.

<table>
<thead>
  <tr>
    <th>
      Tecla, na aba
    </th>
    
    <th>
      Faz
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Setas ou <kbd value="W">
        
      </kbd>
      
       <kbd value="A">
        
      </kbd>
      
       <kbd value="S">
        
      </kbd>
      
       <kbd value="D">
        
      </kbd>
    </td>
    
    <td>
      Empurra a alavanca naquela direção, até a metade; com <kbd value="Shift">
        
      </kbd>
      
      , até o fim
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="G">
        
      </kbd>
    </td>
    
    <td>
      Pega o item escolhido
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Solta
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Cancela
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="P">
        
      </kbd>
    </td>
    
    <td>
      Escolhe na página
    </td>
  </tr>
</tbody>
</table>

## Opções

Toda opção que não é um callback pode ser editada enquanto o app roda. Escolha o nó e abra
**Options**:

<table>
<thead>
  <tr>
    <th>
      Nó
    </th>
    
    <th>
      Opções
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Provider
    </td>
    
    <td>
      <code>
        overlayFit
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        collision
      </code>
      
      , <code>
        modifiers
      </code>
      
       (os da biblioteca, pelo nome), <code>
        animation
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        animateChanges
      </code>
      
      , <code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      , <code>
        haptics
      </code>
      
      , <code>
        copyModifier
      </code>
      
      …
    </td>
  </tr>
  
  <tr>
    <td>
      Lista
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        strategy
      </code>
      
      , <code>
        placeholder
      </code>
      
      , <code>
        behavior
      </code>
      
      , <code>
        multiple
      </code>
      
      , <code>
        sort
      </code>
      
      , <code>
        dropOutside
      </code>
      
      , <code>
        acceptMode
      </code>
      
      , <code>
        animation
      </code>
      
      , <code>
        animateChanges
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Árvore
    </td>
    
    <td>
      <code>
        placeholder
      </code>
      
      , <code>
        indentation
      </code>
      
      , <code>
        nesting
      </code>
      
      , <code>
        maxDepth
      </code>
      
      …
    </td>
  </tr>
  
  <tr>
    <td>
      Alvo de drop
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Item
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        activation
      </code>
    </td>
  </tr>
</tbody>
</table>

Uma edição vale na hora, só para esta página, e nunca é gravada no seu código: a biblioteca lê o
novo valor onde lê a opção. Ela dura até você resetá-la (↺ por opção, ou o reset da barra
superior), o provider ser desmontado ou a página recarregar. Uma opção editada mostra ao lado o
valor do seu código. Os itens montados enquanto uma edição está ativa — linhas de uma lista
virtual — também a recebem.

## Estado

O que cada provider sabe, para o nó que você escolheu:

- a **sessão de arraste**: o status, os ids, os itens e o sensor ativos, o alvo e se ele aceita, o
ponteiro, o overlay, a sessão do grupo ordenável e a linha de inserção;
- uma **lista**: a ordem dela e o rascunho; uma **árvore**: as linhas dela;
- um **item**: o tipo, os dados e a posição dele; um **alvo de drop**: as regras dele.

Os itens são montados e desmontados sem eventos: o registro se atualiza em até um segundo.

## Log

Uma faixa por arraste, em ordem:

<table>
<thead>
  <tr>
    <th>
      Entrada
    </th>
    
    <th>
      O que diz
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag start
      </code>
    </td>
    
    <td>
      Os ids, o sensor e se foi por toque, a lista de onde vem.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
      
      , <code>
        left
      </code>
    </td>
    
    <td>
      Cada alvo em que entrou e de que saiu, e se ele aceita.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        release
      </code>
    </td>
    
    <td>
      O alvo sobre o qual foi solto, enquanto o <code>
        onBeforeDrop
      </code>
      
       decide.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      O veredito: aceito, alguns aceitos, rejeitado por um hook, recusado pelo <code>
        accept
      </code>
      
       do alvo, e quanto tempo os hooks levaram.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      O alvo; para listas ordenáveis, o movimento, <code>
        e.result
      </code>
      
      , e se <code>
        preventDefault()
      </code>
      
       foi chamado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel
      </code>
    </td>
    
    <td>
      O motivo: cancelado (Escape, <code>
        cancel()
      </code>
      
      ), rejeitado por um hook, ou recusado pelo <code>
        accept
      </code>
      
       do alvo.
    </td>
  </tr>
</tbody>
</table>

Também `auto-scroll on` e `off`, os textos de `announcement` (escondidos por padrão) e, fora dos
arrastes, `animate` (mudanças nos itens de uma lista que nenhum arraste fez). Clique em uma entrada
para ver os dados dela. Uma aba aberta depois recebe os arrastes até então.

## Depurar um drop, passo a passo

Um card não entra em uma coluna. Com a aba aberta:

1. **Reproduza** à mão, ou com **Drive**, para que as suas mãos fiquem livres para a aba.
2. **Observe o mapa** enquanto o card está sobre a coluna. Vermelho significa que a lista recusa o
card: veja o `group` dela (`put`) ou o `accept` do alvo. Azul significa que ela aceita, e o
problema vem depois.
3. **Leia o log** desse arraste. `onBeforeDrop` diz quem disse não — um hook, ou o `accept` do
alvo. Se o drop foi concluído mas os seus dados não mudaram, a entrada `drop` diz se
`preventDefault()` foi chamado e o que `e.result` continha: uma lista controlada precisa
aplicá-lo ela mesma.
4. **Teste uma correção ao vivo** em **Options** — um `acceptMode` mais flexível, outra
`collision`, `placeholder: 'indicator'` — e depois escreva no seu código a que funcionar.

## Como funciona

Os providers se reportam a um hook que o lado da página instala. Até uma aba observar a página,
eles só são registrados; depois disso, a página escuta como qualquer monitor e envia à aba o que
ela mostra — a cada 40 ms durante um arraste, duas vezes por segundo no resto do tempo — e para
assim que nenhuma aba a observa por alguns segundos. A aba conversa com a página por um
`BroadcastChannel` da origem da página. Ela não muda nada além do que você pede: os arrastes, a
seleção e as substituições de opções.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
