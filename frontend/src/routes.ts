export default {
  // 页面路由
  pageRoutes: {
    root: '/',
    projectIndex: '/project',
    projectEdit: '/project/edit/:id',
    projectEditParams: (id: any) => `/project/edit/${id}`,
    projectCreate: '/project/create',
    projectEnvLogIndex: '/project/:projectId/env/:envId/log',
    projectEnvLogInfo: '/project/:projectId/env/:envId/log/:seq',
    projectEnvLogInfoParams: (projectId: any, envId: any, seq?: any) => {
      let value = `/project/${projectId}/env/${envId}/log`;
      if (seq)
        value = `/project/${projectId}/env/${envId}/log/${seq}`;
      return value;
    },
    userIndex: '/user',
    userCreate: '/user/create',
    userEdit: '/user/edit/:id',
    userEditParams: (id: any) => `/user/edit/${id}`,
    userLogin: '/user/login',


  },
  // api
  apiRoutes: {
    projectPage: '/api/projects/page',
    projectInfo: '/api/projects/info',
    projectSave: '/api/projects/save',
    projectUpdate: '/api/projects/update',
    projectDeleted: '/api/projects/deleted',
    projectBuild: '/api/projects/build',
    projectSync: '/api/projects/sync',
    projectInit: '/api/projects/init',
    projectRefreshBranch: '/api/projects/refreshBranch',
    envList: '/api/envs/list',
    serverList: '/api/servers/list',
    projectEnvList: '/api/projectEnvs/list',
    projectEnvInfo: '/api/projectEnvs/info',
    projectEnvPluginInfo: '/api/projectEnvPlugins/info',
    projectEnvLogList: '/api/projectEnvLogs/list',
    projectEnvLogInfo: '/api/projectEnvLogs/info',
    userLogin: '/api/users/login',
  },
};

