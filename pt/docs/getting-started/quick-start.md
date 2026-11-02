---
title: "Início rápido"
description: "Uma lista ordenável em três arquivos — um provider, uma lista e as linhas dela."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt/docs/getting-started/quick-start"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Aqui está tudo, funcionando. Arraste uma linha, ou chegue a ela com Tab, pressione
<kbd value="Space">



</kbd>

, mova-a com as setas e pressione <kbd value="Space">



</kbd>

 de novo.

<example name="quick-start" title="Início rápido">



</example>

## Passo a passo

<steps level="3">

### Envolva o app em um provider

`DnDProvider` controla o arraste. Todo composable precisa rodar em um componente **renderizado
dentro** dele — não no componente cujo template o contém.

### Crie uma lista

`makeSortableList` recebe o elemento da lista e o seu array. Ele retorna `items`: um rascunho
que se reordena ao vivo enquanto você arrasta. Renderize o rascunho, não o seu array, e use o id
como key das linhas.

### Crie as linhas

Cada linha chama `makeSortableItem` com o seu elemento e o item que renderiza. A key dela vem de
`item.id`.

</steps>

Quando o drop acontece, `tasks` recebe a nova ordem — é um `ref` comum, então o resto do seu app
vê a mudança como qualquer outra.

<tip>

Usa Pinia, um servidor ou dados imutáveis? Passe um getter em vez de um ref, depois chame
`e.preventDefault()` em `onDrop` e aplique `e.result` você mesmo.

</tip>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
