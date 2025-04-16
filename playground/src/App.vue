<script setup>
  // Нет необходимости импортировать компоненты страниц,
  // так как они будут загружаться через роутер
</script>

<template>
  <div class="playground">
    <header>
      <h1>Vue DnD Kit Playground</h1>
      <nav>
        <ul class="nav-links">
          <li>
            <router-link to="/table">Таблица</router-link>
          </li>
          <li>
            <router-link to="/kanban">Канбан</router-link>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>Vue DnD Kit - Библиотека для перетаскивания элементов</p>
    </footer>
  </div>
</template>

<style>
  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
    background-color: #f8fafc;
    color: #334155;
  }

  .playground {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
  }

  header {
    padding: 24px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  h1 {
    margin: 0 0 16px 0;
    font-size: 28px;
    color: #0f172a;
  }

  .nav-links {
    display: flex;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-links a {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 16px;
    color: #64748b;
    transition: all 0.2s;
  }

  .nav-links a:hover {
    background-color: #f1f5f9;
    color: #334155;
  }

  .nav-links a.router-link-active {
    background-color: #e0f2fe;
    color: #0284c7;
    font-weight: 500;
  }

  main {
    flex: 1;
    padding: 24px 0;
  }

  footer {
    padding: 16px 0;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    font-size: 14px;
    color: #64748b;
  }

  /* Сбрасываем стили из исходного файла */
  pre {
    position: static;
    height: auto;
    max-width: none;
  }
</style>
