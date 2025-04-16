import { createRouter, createWebHistory } from 'vue-router';

import BigKanban from '../pages/BigKanban.vue';
import Kanban from '../pages/Kanban.vue';
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
    path: '/big-kanban',
    name: 'BigKanban',
    component: BigKanban,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
