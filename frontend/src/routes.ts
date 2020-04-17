export default {
  // 页面路由
  pageRoutes: {
    projectIndex: '/project',
    projectEdit: '/project/edit/:id',
    projectEditParams: (id: any) => `/project/edit/${id}`,
    projectCreate: '/project/create',
  },
  // api
  apiRoutes: {
    projectPage: '/api/projects/page',
    projectInfo: '/api/projects/info',
    projectSave: '/api/projects/save',
    projectUpdate: '/api/projects/update',
    projectBuild: '/api/projects/build',
    projectInit: '/api/projects/init',
    envList: '/api/envs/list',
    serverList: '/api/servers/list',
  },
};

