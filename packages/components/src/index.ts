// Экспортируем утилиты
import * as classNames from './utils/classNames';

// Экспортируем компоненты по отдельности
import Draggable from './components/Draggable.vue';
import Droppable from './components/Droppable.vue';
import Kanban from './components/Kanban/Kanban.vue';
import KanbanColumn from './components/Kanban/KanbanColumn.vue';
import KanbanItem from './components/Kanban/KanbanItem.vue';
import Table from './components/Table/Table.vue';
import TableBody from './components/Table/TableBody.vue';
import TableHead from './components/Table/TableHead.vue';

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
