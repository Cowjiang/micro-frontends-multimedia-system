import { defineConfig } from '@umijs/max';

export default defineConfig({
  locale: {antd: true},
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: {},
  exportStatic: {},
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
      component: './Index',
      title: '首页'
    },
    {
      path: '/auth',
      component: '@/pages/Auth/index',
      routes: [
        {path: '/auth/login', component: '@/pages/Auth/index', title: '账户登录'},
        {path: '/auth/register', component: '@/pages/Auth/index', title: '新用户注册'}
      ]
    },
    {
      path: '/test',
      routes: [
        {path: '/test/h5-simulator', component: '@/pages/Test/H5Simulator/index', title: 'H5模拟器测试'},
        {path: '/test/rich-editor', component: '@/pages/Test/RichEditor/index', title: '富文本测试'}
      ]
    }
  ],
  npmClient: 'pnpm',
  tailwindcss: {}
});
