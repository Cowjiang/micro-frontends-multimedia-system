import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '@/views/login/index.vue';
import Chat from '@/views/chat/index.vue';
import Default from '@/layouts/default/Default.vue';

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
    path: '/register',
    component: Login
  },
  {
    path: '/chat',
    redirect: '/chat/home'
  },
  {
    path: '/chat/:navItem',
    name: 'index',
    component: Chat
  },
  {
    path: '/chat/home/friend',
    redirect: '/index/home/friend/all'
  },
  {
    path: '/chat/home/friend/:friendType',
    name: 'friend',
    component: Chat
  },
  {
    path: '/chat/home/chat/:chatType/:id',
    name: 'chat',
    component: Chat
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
