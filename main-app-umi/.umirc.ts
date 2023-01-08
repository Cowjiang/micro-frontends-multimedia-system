import { defineConfig } from '@umijs/max';

export default defineConfig({
  locale: { antd: true },
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: {

  },
  routes: [
    {
      title: '主应用首页',
      path: '/index',
      component: './index',
    },
    {
      title: '登录页',
      path: '/login',
      component: './login',
    },
    {
      path: '/',
      redirect: '/index'
    }
  ],
  npmClient: 'pnpm',
  tailwindcss: {}
});
