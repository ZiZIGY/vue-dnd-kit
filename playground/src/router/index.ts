import { createRouter, createWebHistory } from 'vue-router';

import Kanban from '../pages/Kanban.vue';
import SortableList from '../pages/SortableList.vue';
import Table from '../pages/Table.vue';

const routes = [
  {
    path: '/',
    redirect: '/table',
  },
  {
    path: '/table',
    name: 'Table',
    component: Table,
  },
  {
    path: '/kanban',
    name: 'Kanban',
    component: Kanban,
  },
  {
    path: '/sortable-list',
    name: 'SortableList',
    component: SortableList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
