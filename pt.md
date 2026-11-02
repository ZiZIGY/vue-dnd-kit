---
title: "Vue DnD Kit — drag and drop for Vue"
description: "Listas ordenáveis, quadros kanban, árvores e multi-drag para Vue 3 — com animações, suporte a teclado e acessibilidade de fábrica."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/pt"
meta:
  "og:description": "Listas ordenáveis, quadros kanban, árvores e multi-drag para Vue 3 — com animações, suporte a teclado e acessibilidade de fábrica."
  "og:title": "Vue DnD Kit — drag and drop for Vue"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

v3 — Arrastar e soltar para Vue 3Vue 3 · TypeScript · SSR

01Kanban

**Quadros que trocam cards**

02Árvores

**Aninhamento com um empurrãozinho**

03Multi-drag

**Muitos itens, um movimento**

04Ordenável

**Listas que se ordenam sozinhas**

05Animado

**Movimento por padrão**

06A11y

space←↑↓→

**Teclado de primeira classe**

07Virtual

**Dez mil linhas**

Arraste os cards — ou chegue a um com Tab e use as setas

# Arrastar e soltar,<br>feito para Vue.

Listas ordenáveis, quadros kanban, árvores e multi-drag para Vue 3 — com animações, suporte a teclado e acessibilidade de fábrica.

npm i @vue-dnd-kit/core

[Começar](https://zizigy.github.io/vue-dnd-kit/pt/docs/getting-started/introduction)

Gratuito e open source. Licença MIT.

00Como funciona

## Composables,<br>não componentes.

Sua marcação, seus estilos. Passe um template ref a um composable e o elemento é arrastado, ordenado e solto — com a animação, o teclado e o leitor de tela já resolvidos para você.

- 01 `**makeSortableList**`Listas, grades e colunas de kanban que se reordenam enquanto você arrasta — e trocam itens dentro de um grupo.
- 02 `**makeSortableTree**`Dados aninhados, renderizados de forma plana: profundidade com um empurrãozinho para o lado, drops dentro de pastas, virtualização.
- 03 `**makeDraggable · makeDroppable**`Todo o resto: quadros, canvas, uploads — as suas próprias regras para o que vai aonde.

01Arrastar e soltar

## Arrastar e soltar

Um draggable, um alvo de drop e uma regra para o que vai aonde. Os alvos se destacam quando aceitam o arraste e recusam o que não aceitam; o que um drop faz fica por sua conta.

[Documentação](https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/drag-and-drop)

Live Separe os arquivos nas pastas X ---- · Y ----

Carregando a demo…

02Ordenável

## Listas e grades

Renderize um rascunho do seu array e ele se reordena ao vivo enquanto você arrasta. No drop, a nova ordem é gravada no seu ref. Vertical, horizontal ou uma grade de qualquer tamanho.

[Documentação](https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/sortable-lists)

Live Reorganize os apps ou leve um para o dock X ---- · Y ----

Carregando a demo…

03Kanban

## Quadros kanban

Listas de um mesmo grupo trocam itens. Copie de uma paleta, receba draggables simples ou troque de lugar em vez de deslocar — a lista que recebe abre espaço enquanto você passa por cima.

[Documentação](https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/shared-lists)

Live Mova cards entre as colunas X ---- · Y ----

Carregando a demo…

04Árvores

## Árvores

Renderizadas de forma plana com profundidades, então podem ser virtualizadas. Arraste para o lado para mudar o nível ou pare sobre uma pasta para soltar dentro dela; limite a profundidade e decida o que se aninha onde.

[Documentação](https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/trees)

Live Arraste para o lado para mudar a profundidade X ---- · Y ----

Carregando a demo…

05Multi-drag

## Multi-drag

Selecione com Ctrl/Cmd-clique ou desenhe um retângulo, depois arraste um item: a seleção inteira viaja junto e pousa em ordem, até entre listas.

[Documentação](https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/multi-drag)

Live Ctrl/Cmd-clique ou desenhe um retângulo, depois arraste X ---- · Y ----

06Restrições

## Eixos, limites e grades

Uma área de arraste define as regras para tudo o que é arrastado dentro dela: trave um eixo, mantenha os arrastes dentro das bordas, encaixe numa grade — e mude tudo isso com o app rodando.

[Documentação](https://zizigy.github.io/vue-dnd-kit/pt/docs/guides/constraints)

Live Troque as regras, depois arraste uma forma X ---- · Y ----

Carregando a demo…

07E mais

## Pronto para apps de verdade.

01

### Animado

FLIP durante a ordenação, um drop que pousa na sua posição, mudanças de dados animadas. Traga GSAP ou motion se quiser.

02

### Acessível

Arrastes por teclado de posição em posição, anúncios ao vivo e atributos ARIA que nunca sobrescrevem os seus.

03

### Listas virtuais

TanStack Virtual e VueUse: milhares de linhas, ainda ordenáveis, ainda animadas.

04

### Controlado

Pinia, um servidor ou dados imutáveis: pule a gravação padrão e aplique o resultado você mesmo.

08Ecossistema

## Um núcleo pequeno, algumas ferramentas afiadas.

Tudo se arrasta com o núcleo. Adicione o resto quando precisar.

01

@vue-dnd-kit/devtools

### DevTools

Uma aba no Vue DevTools e no Nuxt DevTools: um minimapa ao vivo, um joystick que arrasta qualquer coisa, opções que você edita com o app rodando.

02

@vue-dnd-kit/actions

### Arrastes programáticos

“Mover para cima”, “mover para Concluído”, tours guiados e testes — arrastes de verdade, anunciados e animados, a partir do código.

03

@vue-dnd-kit/nuxt

### Módulo Nuxt

Composables importados automaticamente, componentes globais e padrões seguros para SSR.

04

npx skills add

### Para agentes de IA

Uma agent skill que ensina ao Claude Code e a outros assistentes como a biblioteca funciona.

npx skills add ZiZIGY/vue-dnd-kit

**01**

1.243

Testes end-to-end em três navegadores

**02**

469

Testes unitários

**03**

21KB

Draggables e zonas de drop, com gzip

**04**

9

Idiomas desta documentação

## Escolha por onde começar.

[**01**<h3>**Leia o guia**</h3>Da instalação à sua primeira lista ordenável em cinco minutos.](https://zizigy.github.io/vue-dnd-kit/pt/docs/getting-started/introduction) [**02**<h3>**Veja os exemplos**</h3>Demos ao vivo com o código, prontas para copiar ou abrir no StackBlitz.](https://zizigy.github.io/vue-dnd-kit/pt/docs/examples)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/pt#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"pt-BR","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/pt","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/pt#webpage","@type":"WebPage","description":"Listas ordenáveis, quadros kanban, árvores e multi-drag para Vue 3 — com animações, suporte a teclado e acessibilidade de fábrica.","url":"https://zizigy.github.io/vue-dnd-kit/pt","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/pt#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/pt"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
