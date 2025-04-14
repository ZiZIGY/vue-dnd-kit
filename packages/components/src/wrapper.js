// Импортируем утилиты
import * as classNames from './utils/classNames';

// Импортируем все компоненты
import Draggable from './components/Draggable.vue';
import Droppable from './components/Droppable.vue';
import Kanban from './components/Kanban/Kanban.vue';
import KanbanColumn from './components/Kanban/KanbanColumn.vue';
import KanbanItem from './components/Kanban/KanbanItem.vue';
import Table from './components/Table/Table.vue';
import TableBody from './components/Table/TableBody.vue';
import TableHead from './components/Table/TableHead.vue';

// Объявляем функцию install, которая будет вызвана Vue.use()
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  Vue.component('Draggable', Draggable);
  Vue.component('Droppable', Droppable);
  Vue.component('Kanban', Kanban);
  Vue.component('KanbanColumn', KanbanColumn);
  Vue.component('KanbanItem', KanbanItem);
  Vue.component('Table', Table);
  Vue.component('TableBody', TableBody);
  Vue.component('TableHead', TableHead);
}

// Создаем определение модуля для Vue.use()
const plugin = {
  install,
};

// Автоматическая установка при обнаружении Vue (например, в браузере через тег <script>)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Экспортируем компоненты для использования по отдельности
export {
  Draggable,
  Droppable,
  Kanban,
  KanbanColumn,
  KanbanItem,
  Table,
  TableBody,
  TableHead,
  classNames,
};

// Экспортируем плагин по умолчанию
export default plugin;
