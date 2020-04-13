export default {
  // 页面路由
  pageRoutes: {
    projectIndex: '/project',
    projectEdit: '/project/edit/:id',
  },
  // api
  apiRoutes: {
    projectPage: '/api/projects/page',
    projectInfo: '/api/projects/info',
    projectSave: '/api/projects/save',
    projectUpdate: '/api/projects/update',
    envList: '/api/envs/list',
    serverList: '/api/servers/list',
  },
};

