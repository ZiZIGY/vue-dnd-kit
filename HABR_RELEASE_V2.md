# Vue DnD Kit v2: мы переписали drag-and-drop с нуля — и это лучшая DnD-библиотека для Vue 3

Год разработки, сотни часов тестирования, полностью новая архитектура. Встречайте **Vue DnD Kit v2** — библиотеку drag-and-drop для Vue 3, которая меняет правила игры.

---

## Почему мы выбросили v1 и написали всё заново

Первая версия работала. Но чем больше кейсов мы закрывали, тем яснее становилось: архитектура не тянет. Ограниченный API, жёсткие компоненты, невозможность нормально кастомизировать overlay, баги с multi-drag и вложенными зонами. v1 был хорош для простых списков — и только.

**v2 — это другой уровень.** Никаких компромиссов.

---

## Что такое Vue DnD Kit

Это headless drag-and-drop библиотека для Vue 3. «Headless» означает: никакой навязанной разметки, никаких жёстких стилей — только логика и реактивное состояние. Вы сами решаете, как всё выглядит.

```bash
npm install @vue-dnd-kit/core
```

---

## Революционная архитектура: composables вместо компонентов

В v2 нет компонентов `<Draggable>` или `<Droppable>`. Вместо этого — **чистые composables**, которые превращают любой элемент в draggable или droppable.

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const props = defineProps<{ index: number; items: string[] }>();
  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef, {}, () => [props.index, props.items]);
</script>

<template>
  <div ref="itemRef" :class="{ 'opacity-0': isDragging }">
    <slot />
  </div>
</template>
```

Любой HTML-элемент становится draggable за три строки. Никакой обёртки, никакого render-prop hell.

---

## Умные хелперы: забудьте про ручную логику сортировки

Самая болезненная часть DnD — это написание логики перестановки элементов. В v2 это решено на уровне API.

Каждый drop-event содержит объект `helpers` с готовыми операциями:

```ts
function onDrop(e: IDragEvent) {
  // Сортировка — одна строка
  const r = e.helpers.suggestSort('vertical');
  if (r) items.value = r.targetItems as Item[];
}
```

`suggestSort` сам определяет позицию вставки на основе позиции курсора. Никакого `splice`, никаких индексов вручную.

### Полный набор хелперов

| Хелпер | Что делает |
|--------|------------|
| `suggestSort(axis?)` | Сортировка с определением позиции по курсору |
| `suggestSwap()` | Обмен местами двух элементов |
| `suggestCopy(axis?)` | Копирование в целевой список |
| `suggestRemove()` | Удаление из исходного списка |
| `insertAt(items, index, ...els)` | Низкоуровневая вставка |
| `swapAt(items, i, j)` | Низкоуровневый обмен |

```ts
// Перетаскивание между двумя списками
function onDrop(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  if (r.sameList) {
    listA.value = r.targetItems as Item[];
  } else {
    if (r.sourceItems === listA.value) listA.value = r.sourceItems as Item[];
    if (r.targetItems === listB.value) listB.value = r.targetItems as Item[];
  }
}
```

---

## Multi-drag «из коробки»

Выделяете несколько элементов — тащите всё сразу. `makeSelectionArea` создаёт область выделения:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSelectionArea } from '@vue-dnd-kit/core';

  const areaRef = useTemplateRef<HTMLElement>('areaRef');
  const { style } = makeSelectionArea(areaRef);
</script>

<template>
  <div ref="areaRef" class="selection-container">
    <div class="selection-box" :style="style" />
    <slot />
  </div>
</template>
```

`e.draggedItems` в обработчике drop всегда содержит все выделенные элементы. `suggestSort` и `suggestSwap` корректно обрабатывают multi-drag без дополнительного кода.

---

## Дерево, Kanban, вложенные зоны — всё это работает

Ключевой паттерн v2: **целевой массив определяется автоматически**.

Когда вы наводитесь на draggable-элемент внутри droppable-зоны, библиотека предпочитает массив *hoveredDraggable*, а не массив *зоны*. Это позволяет строить деревья и Kanban без специального кода:

```ts
// Дерево: при наведении на узел — вставляем в его children
function onDrop(e: IDragEvent) {
  const r = e.helpers.suggestSort('vertical');
  if (!r) return;

  // r.targetItems уже указывает на нужный массив (children узла или корень)
  applyToTree(r.sourceItems, r.targetItems, r);
}
```

---

## DragPreview: свободная кастомизация drag-overlay

Одна из главных болей DnD-библиотек — ограниченная кастомизация того, что следует за курсором. В v2 это решено элегантно.

`DragPreview` — встроенный компонент с `v-if` внутри. Оберните его в `<Transition>` — и вы получите анимацию входа/выхода:

```vue
<!-- TransitionPreview.vue -->
<script setup lang="ts">
  import { DragPreview } from '@vue-dnd-kit/core';
</script>

<template>
  <Transition name="pop" appear>
    <DragPreview />
  </Transition>
</template>

<style>
  .pop-enter-active {
    transition: opacity 0.15s ease, scale 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .pop-enter-from { opacity: 0; scale: 0.85; }
</style>
```

Используйте `motion-v` для spring-физики:

```vue
<DragPreview v-slot="{ draggingMap }">
  <motion.div
    :initial="{ scale: 0.9, opacity: 0, rotate: -2 }"
    :animate="{ scale: 1.06, opacity: 1, rotate: 1.5 }"
    :transition="{ type: 'spring', stiffness: 480, damping: 26 }"
  >
    <template v-for="[node, draggable] in draggingMap" :key="node">
      <component v-if="draggable.render" :is="draggable.render" />
      <component
        v-else :is="node.tagName"
        v-html="draggable.initialOuterHTML"
        :style="{ width: draggable.initialRect.width + 'px', height: draggable.initialRect.height + 'px' }"
      />
    </template>
  </motion.div>
</DragPreview>
```

Или вообще замените preview на лету — в зависимости от зоны, над которой находится курсор:

```vue
<ReactionZone
  @enter="$event.provider.preview.render.value = markRaw(AlchemyOverlay)"
  @leave="$event.provider.preview.render.value = null"
/>
```

---

## Кастомный preview per-item

Каждый draggable может иметь свой render-компонент:

```ts
import { makeDraggable } from '@vue-dnd-kit/core';
import { markRaw } from 'vue';
import TaskCard from './TaskCard.vue';

makeDraggable(itemRef, {
  render: markRaw(TaskCard),
  data: () => ({ id: props.id, title: props.title, priority: props.priority }),
});
```

`TaskCard` рендерится внутри `DragPreview` и читает данные через `useDnDProvider().entities`:

```vue
<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const { entities } = useDnDProvider();

  const task = computed(() => {
    const [node] = entities.draggingMap.keys();
    return entities.draggableMap.get(node)?.data?.() as Task | null;
  });
</script>

<template>
  <div class="task-card">
    <span class="priority" :class="task?.priority">{{ task?.priority }}</span>
    <p>{{ task?.title }}</p>
  </div>
</template>
```

---

## Ограничения движения: ось и границы

`makeConstraintArea` позволяет ограничить перемещение по оси или удержать preview внутри контейнера:

```vue
<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeConstraintArea } from '@vue-dnd-kit/core';

  const containerRef = useTemplateRef<HTMLElement>('containerRef');

  makeConstraintArea(containerRef, {
    axis: 'y',           // только вертикальное движение
    restrictToArea: true  // preview не выходит за границы
  });
</script>

<template>
  <div ref="containerRef">
    <slot />
  </div>
</template>
```

---

## Автоскролл без настройки

```vue
<DnDProvider :auto-scroll-viewport="true">
  <!-- Viewport скроллится при приближении preview к краям -->
</DnDProvider>
```

Или для конкретного контейнера:

```ts
import { makeAutoScroll } from '@vue-dnd-kit/core';

makeAutoScroll(scrollableRef, {
  threshold: 80,  // начинать за 80px до края
  speed: 1.5,     // скорость
});
```

---

## Async drop: ждём подтверждения

Вернуть промис из `onDrop` — и библиотека перейдёт в состояние `'pending'` до разрешения:

```ts
function onDrop(e: IDragEvent) {
  return new Promise<void>((resolve, reject) => {
    showConfirmDialog({
      message: `Переместить "${e.draggedItems[0].item}"?`,
      onConfirm: () => { applySort(e); resolve(); },
      onCancel: reject,
    });
  });
}
```

Пока ждём — preview остаётся на месте, можно показать лоадер. Отмена — preview возвращается назад.

---

## Keyboard navigation

Полная поддержка клавиатуры встроена. Настраиваемые горячие клавиши:

```ts
const { keyboard } = useDnDProvider();

// Изменить клавиши активации drag
keyboard.keys.forDrag = ['Enter'];
keyboard.keys.forMove = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
keyboard.step = 16; // шаг перемещения в px
```

---

## Производительность

- **Zero dependencies** (кроме Vue 3)
- **Tree-shakeable** — берёте только то, что используете
- **IntersectionObserver** для отслеживания видимых элементов — не опрашиваем DOM в цикле
- Реактивность через Vue's `shallowRef` и `computed` — минимум лишних ре-рендеров
- `will-change: transform` на preview — GPU-ускорение из коробки

---

## Миграция с v1

v2 — это не обновление, это другая библиотека. Composable API несовместим с компонентным API v1. Но миграция прямолинейна: замените `useDraggable` → `makeDraggable`, `useDroppable` → `makeDroppable`, `DnDStore` → `useDnDProvider`.

---

## Итог

**Vue DnD Kit v2** — это:

- ✅ Headless composable API — никакой навязанной разметки
- ✅ Умные хелперы — сортировка, swap, copy одной строкой
- ✅ Multi-drag — выделяй и тащи группами
- ✅ Деревья и Kanban — вложенность работает правильно
- ✅ Полная кастомизация preview — Transition, motion-v, GSAP, что угодно
- ✅ Keyboard navigation — из коробки
- ✅ Async drop — ждём подтверждения
- ✅ Auto-scroll — viewport и контейнеры
- ✅ TypeScript — полная типизация

Документация, примеры и playground: **[vue-dnd-kit.dev](https://zizigy.github.io/vue-dnd-kit/v2/guide/introduction)**

GitHub: **[github.com/zizigy/vue-dnd-kit](https://github.com/zizigy/vue-dnd-kit)**

```bash
npm install @vue-dnd-kit/core
```

Ждём ваших issues, звёзд и pull request'ов 🙂
