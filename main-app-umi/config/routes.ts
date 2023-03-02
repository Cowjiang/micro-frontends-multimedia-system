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
    component: '@/pages/Project/index',
    title: '项目概览',
    routes: [
      {path: '/project/edit/new', component: '@/pages/Project/ProjectEdit/index', title: '新建项目'},
      {path: '/project/edit/:id', component: '@/pages/Project/ProjectEdit/index', title: '编辑项目'},
      {path: '/project/:id/detail', component: '@/pages/Project/ProjectDetail/index', title: '项目详情'},
      {path: '/project/list', component: '@/pages/Project/ProjectList/index', title: '项目列表'},
      {path: '/project/:id/member/list', component: '@/pages/Project/ProjectMembers/index', title: '项目人员'},
      {path: '/project/:id/member/config', component: '@/pages/Project/ProjectMemberConfig/index', title: '项目人员设置'},
      {path: '/project/:id/draft/list', component: '@/pages/Project/Draft/DraftList/index', title: '稿件列表'},
      {path: '/project/:id/draft/new', component: '@/pages/Project/Draft/NewDraft/index', title: '新建稿件'},
    ]
  },
  {
    path: '/department',
    title: '部门概览',
    routes: [
      {path: '/department/:id/detail', component: '@/pages/Department/DepartmentDetail', title: '部门详情'},
      {path: '/department/:id/members', component: '@/pages/Department/DepartmentMembers', title: '部门成员'},
      {path: '/department/:id/roles/config', component: '@/pages/Department/DepartmentRolesConfig', title: '部门角色设置'},
    ]
  },
  {
    path: '/settings',
    title: '设置中心',
    component: '@/pages/Settings/index'
  },
]

export default routes;
