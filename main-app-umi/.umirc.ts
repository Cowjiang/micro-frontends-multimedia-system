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
      component: './index',
      title: '首页'
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '',
      component: '@/pages/login/index',
      routes: [
        {path: '/login', component: '@/pages/login/index', title: '账户登录'},
        {path: '/register', component: '@/pages/login/index', title: '新用户注册'}
      ]
    }
  ],
  npmClient: 'pnpm',
  tailwindcss: {}
});
