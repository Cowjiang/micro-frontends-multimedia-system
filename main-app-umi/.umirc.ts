import { defineConfig } from '@umijs/max';

export default defineConfig({
  locale: {antd: true},
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: {},
  routes: [
    {
      path: '/index',
      component: './index'
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '',
      component: '@/pages/login/index',
      routes: [
        {path: '/login', component: '@/pages/login/index'},
        {path: '/register', component: '@/pages/login/index'}
      ]
    },
  ],
  npmClient: 'pnpm',
  tailwindcss: {}
});
