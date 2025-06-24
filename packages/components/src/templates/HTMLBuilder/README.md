# HTML Builder

Универсальный unstyled компонент для построения HTML структур с возможностью drag-and-drop.

## Установка

```bash
npm install @vue-dnd-kit/components
# или
yarn add @vue-dnd-kit/components
```

## Использование

### Простой вариант

Самый простой способ использовать HTML Builder — это импортировать базовый компонент:

```vue
<script setup lang="ts">
  import { HTMLBuilderBase } from '@vue-dnd-kit/components/templates/HTMLBuilder';
</script>

<template>
  <HTMLBuilderBase />
</template>
```

### Расширенный вариант (с кастомизацией)

Вы можете использовать отдельные компоненты и настроить их под свои нужды:

```vue
<script setup lang="ts">
  import {
    HTMLBuilderArea,
    HTMLBuilderComponents,
    HTMLBuilderTree,
    HTMLBuilderConfig,
    type IHTMLBuilderElement,
  } from '@vue-dnd-kit/components/templates/HTMLBuilder';
  import { ref } from 'vue';

  const components = ref<IHTMLBuilderElement[]>([]);

  // Вы можете предзаполнить компоненты или изменить их динамически
</script>

<template>
  <div class="custom-html-builder">
    <HTMLBuilderTree
      :components="components"
      class="custom-tree"
    />
    <HTMLBuilderArea
      :components="components"
      class="custom-area"
    />
    <HTMLBuilderComponents class="custom-components" />
    <HTMLBuilderConfig class="custom-config" />
  </div>
</template>
```

## Стили

По умолчанию подключаются минимальные стили из `styles.css`. Вы можете:

1. Использовать их как есть
2. Переопределить через CSS классы
3. Полностью отключить и использовать свои

Для отключения стандартных стилей:

```vue
<script setup>
  import {
    HTMLBuilderArea,
    HTMLBuilderComponents,
    HTMLBuilderTree,
    HTMLBuilderConfig,
  } from '@vue-dnd-kit/components/templates/HTMLBuilder';

  // Не импортируйте стили: import '@vue-dnd-kit/components/templates/HTMLBuilder/styles.css';
</script>
```

## Компоненты

- **HTMLBuilderBase**: Готовый к использованию компонент с минимальной настройкой
- **HTMLBuilderArea**: Основная область для построения HTML
- **HTMLBuilderComponents**: Панель с доступными компонентами
- **HTMLBuilderTree**: Дерево созданных компонентов
- **HTMLBuilderConfig**: Настройки выбранного компонента
