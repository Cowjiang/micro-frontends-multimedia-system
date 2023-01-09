import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '@/views/login/index.vue';
import Default from '@/layouts/default/Default.vue';
import Index from '@/views/index/index.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => Default,
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
        redirect: '/login'
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/index',
    component: Index
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
