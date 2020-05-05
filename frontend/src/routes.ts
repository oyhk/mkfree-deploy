const gateway = 'http://localhost:5000';
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
    projectPage: gateway  + '/api/projects/page',
    projectInfo: gateway + '/api/projects/info',
    projectSave: gateway + '/api/projects/save',
    projectUpdate: gateway + '/api/projects/update',
    projectDeleted: gateway + '/api/projects/deleted',
    projectBuild: gateway + '/api/projects/build',
    projectSync: gateway + '/api/projects/sync',
    projectInit: gateway + '/api/projects/init',
    projectRefreshBranch: gateway + '/api/projects/refreshBranch',
    envList: gateway + '/api/envs/list',
    serverList: gateway + '/api/servers/list',
    projectEnvList: gateway + '/api/projectEnvs/list',
    projectEnvInfo: gateway + '/api/projectEnvs/info',
    projectEnvPluginInfo: gateway + '/api/projectEnvPlugins/info',
    projectEnvLogList: gateway + '/api/projectEnvLogs/list',
    projectEnvLogInfo: gateway + '/api/projectEnvLogs/info',
    userLogin: gateway + '/api/users/login',
    userPage: gateway + '/api/users/page',
    userSave: gateway + '/api/users/save',
    userInfo: gateway + '/api/users/info',
    userDelete: gateway + '/api/users/delete',
    userUpdate: gateway + '/api/users/update',
  },
};

