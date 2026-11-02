---
title: "useDnD et moniteurs"
description: "L'état du glissement et ses événements, n'importe où sous le provider — et le provider lui-même, transmis à une autre application Vue."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/api/use-dnd"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="32rem" hint="Sélectionnez des jetons, maintenez le jeton c enfoncé, glissez au-dessus du pavé verrouillé" name="api-use-dnd">



</example>

## useDnD

```ts
function useDnD(): DnDState;
```

```ts
const { status, active, over, selection, cancel } = useDnD();
const dragging = computed(() => status.value === 'dragging');
```

L'état réactif du glissement du provider. `active` et `over` sont vidés dès que le dépôt est décidé,
pendant que l'overlay atterrit encore.

<api-table name="DnDState">



</api-table>

### Sélection

<api-table name="DnDSelection">



</api-table>

## useDnDMonitor

```ts
function useDnDMonitor(monitor: DnDMonitor): void;
```

```ts
useDnDMonitor({
  onDragEnd: (e) => (e.dropped ? save(e) : undefined),
  onBeforeDrop: async (e) => ((await confirm()) ? 'accept' : 'reject'),
});
```

Les événements de chaque glissement sous le provider, pendant toute la durée de vie du composant.
Vos moniteurs sont consultés sur un dépôt (`onBeforeDrop`) avant la cible. Les payloads sont décrits
sur [la page des événements](https://zizigy.github.io/docs/api/events).

<api-table name="DnDMonitor">



</api-table>

<api-table name="KeyboardMoveContext">



</api-table>

## useDnDContext et provideDnDContext

```ts
function useDnDContext(): DnDContext;
function provideDnDContext(app: App, context: DnDContext): void;
```

```ts
// In a component under the provider:
const context = useDnDContext();
// A second Vue app (a widget mounted in a shadow root) joins the same drag:
const widget = createApp(Widget);
provideDnDContext(widget, context);
```

<api-table name="DnDContext">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
