# Playground

Dev-среда для проверки пакетов **core** и **utilities** без публикации.

## Запуск

Из **корня репозитория**:

```bash
yarn install
yarn playground
```

Скрипт один раз соберёт `packages/core` и `packages/utilities`, затем параллельно запустит:

- **core** — `vite build --watch`
- **utilities** — `vite build --watch`
- **playground** — `vite` (dev-сервер)

При изменении кода в пакетах они пересобираются; обнови страницу в браузере, чтобы подтянуть новый бандл.

## Отдельные команды

- `yarn playground:build` — один раз собрать core и utilities
- `yarn playground:watch:core` — только watch core
- `yarn playground:watch:utilities` — только watch utilities
- `yarn playground:dev` — только dev playground (пакеты должны быть уже собраны)

## Алиасы

В `playground/vite.config.ts` заданы алиасы на собранные пакеты:

- `@vue-dnd-kit/core` → `packages/core/dist/vue-dnd-kit-core.es.js`
- `@vue-dnd-kit/utilities` → `packages/utilities/dist/vue-dnd-kit-utilities.es.js`

Используются именно dist-файлы, чтобы при пересборке по watch подхватывались актуальные версии.
