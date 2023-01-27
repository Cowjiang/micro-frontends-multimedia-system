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
      path: '/*',
      redirect: '/index'
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: './index',
      title: '首页'
    },
    {
      path: '/auth',
      component: '@/pages/auth/index',
      routes: [
        {path: '/auth/login', component: '@/pages/auth/index', title: '账户登录'},
        {path: '/auth/register', component: '@/pages/auth/index', title: '新用户注册'}
      ]
    },
    {
      path: '/simulatorTest',
      component: '@/pages/simulatorTest/index',
      title: 'H5模拟器测试'
    }
  ],
  npmClient: 'pnpm',
  tailwindcss: {}
});
