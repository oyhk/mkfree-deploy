export default {
  // 页面路由
  pageRoutes: {
    projectIndex: '/project',
    projectEdit: '/project/edit/:id',
    projectCreate: '/project/create',
  },
  // api
  apiRoutes: {
    projectPage: '/server/api/projects/page',
    projectInfo: '/server/api/projects/info',
    projectSave: '/server/api/projects/save',
    projectUpdate: '/server/api/projects/update',
    envList: '/server/api/envs/list',
    serverList: '/server/api/servers/list',
  },
};
