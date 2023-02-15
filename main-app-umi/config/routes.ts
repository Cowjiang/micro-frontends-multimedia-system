import ProjectMemberConfigPage from '@/pages/Project/ProjectMemberConfig';

const routes = [
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
  },
  {
    path: '/project',
    routes: [
      {path: '/project/new', component: '@/pages/Project/NewProject/index', title: '新建项目'},
      {path: '/project/:id/member/config', component: '@/pages/Project/ProjectMemberConfig/index', title: '项目人员设置'},
    ]
  }
]

export default routes;
