import { createRouter, createWebHistory } from 'vue-router';

import Animation from '../pages/Animation.vue';
import Kanban from '../pages/Kanban.vue';
import LazyDrop from 'src/pages/LazyDrop.vue';
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
  {
    path: '/animation',
    name: 'Animation',
    component: Animation,
  },
  {
    path: '/lazy-drop',
    name: 'LazyDrop',
    component: LazyDrop,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
