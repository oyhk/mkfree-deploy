export default {
  // 页面路由
  pageRoutes: {
    root: '/',
    projectIndex: '/project',
    projectEdit: '/project/edit/:id',
    projectEditParams: (id: any) => `/project/edit/${id}`,
    projectCreate: '/project/create',
    userLogin: '/user/login'


  },
  // api
  apiRoutes: {
    projectPage: '/api/projects/page',
    projectInfo: '/api/projects/info',
    projectSave: '/api/projects/save',
    projectUpdate: '/api/projects/update',
    projectBuild: '/api/projects/build',
    projectSync: '/api/projects/sync',
    projectInit: '/api/projects/init',
    projectRefreshBranch: '/api/projects/refreshBranch',
    envList: '/api/envs/list',
    serverList: '/api/servers/list',
    userLogin: '/api/users/login',
  },
};

