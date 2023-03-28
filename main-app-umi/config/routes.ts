const routes = [
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
    path: '/dev',
    component: './Dev',
    title: 'Development'
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
    path: '/project',
    component: '@/pages/Project',
    title: '项目概览',
    routes: [
      {path: '/project/edit/new', component: '@/pages/Project/ProjectEdit', title: '新建项目'},
      {path: '/project/edit/:id', component: '@/pages/Project/ProjectEdit', title: '编辑项目'},
      {path: '/project/:id/detail', component: '@/pages/Project/ProjectDetail', title: '项目详情'},
      {path: '/project/list', component: '@/pages/Project/ProjectList', title: '项目列表'},
      {path: '/project/:id/member/list', component: '@/pages/Project/ProjectMembers', title: '项目人员'},
      {path: '/project/:id/member/config', component: '@/pages/Project/ProjectMemberConfig', title: '项目人员设置'},
      {path: '/project/:id/draft/list', component: '@/pages/Project/Draft/DraftList', title: '稿件列表'},
      {path: '/project/:id/draft/new', component: '@/pages/Project/Draft/NewDraft', title: '新建稿件'},
      {path: '/project/:projectId/draft/:editAction/:draftType', component: '@/pages/Project/Draft/DraftEdit', title: '新建稿件'},
      {path: '/project/:projectId/draft/:editAction/:draftType/:draftId', component: '@/pages/Project/Draft/DraftEdit', title: '修改稿件'},
      {path: '/project/:projectId/draft/detail/:draftType/:draftId', component: '@/pages/Project/Draft/DraftDetail', title: '稿件详情'},
      {path: '/project/:projectId/draft/comment/:draftType/:draftId', component: '@/pages/Project/Draft/DraftComment', title: '稿件审批'},
    ]
  },
  {
    path: '/department',
    title: '部门概览',
    component: '@/pages/Department',
    routes: [
      {path: '/department/:id/detail', component: '@/pages/Department/DepartmentDetail', title: '部门详情'},
      {path: '/department/:id/members', component: '@/pages/Department/DepartmentMembers', title: '部门成员'},
      {path: '/department/:id/roles/config', component: '@/pages/Department/DepartmentRolesConfig', title: '部门角色设置'},
    ]
  },
  {
    path: '/resource',
    title: '资源素材库',
    component: '@/pages/Resource',
    routes: [
      {path: '/resource/list/:targetType/:prefix', component: '@/pages/Resource/ResourceList', title: '资源列表'},
    ]
  },
  {
    path: '/settings',
    title: '设置中心',
    component: '@/pages/Settings',
    routes: [
      {path: '/settings/personal', component: '@/pages/Settings', title: '个人设置'},
      {path: '/settings/general', component: '@/pages/Settings', title: '通用设置'},
    ]
  },
  {
    path: '/admin',
    routes: [
      {path: '/admin', component: '@/pages/Admin', title: '后台管理', access: ['canSeeAdmin', 'canSeeDev']},
      {path: '/admin/:item', component: '@/pages/Admin', title: '后台管理', access: ['canSeeAdmin', 'canSeeDev'],}
    ]
  },
  {
    path: '/test',
    routes: [
      {path: '/test/h5-simulator', component: '@/pages/Test/H5Simulator/index', title: 'H5模拟器测试'},
      {path: '/test/rich-editor', component: '@/pages/Test/RichEditor/index', title: '富文本测试'},
    ]
  },
  {
    path: '/404',
    title: '404 Not Found',
    component: '@/pages/404'
  },
  {
    path: '/403',
    title: '403 Forbidden',
    component: '@/pages/403'
  },
  {
    path: '/*',
    component: '@/pages/404'
  },
]

export default routes;
