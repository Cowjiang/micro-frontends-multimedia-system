import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '@/views/login/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
