import { createRouter, createWebHistory } from 'vue-router';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
