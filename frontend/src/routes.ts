const gateway = 'http://localhost:5000';
const pageRoot = '';
export const HttpMethod = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};
export default {

  // 页面路由
  pageRoutes: {
    root: '/',
    projectIndex: pageRoot + '/project',
    projectEdit: pageRoot + '/project/edit/:id',
    projectEditParams: (id: any) => pageRoot + `/project/edit/${id}`,
    projectCreate: pageRoot + '/project/create',
    projectEnvLogIndex: pageRoot + '/project/:projectId/env/:envId/log',
    projectEnvLogInfo: pageRoot + '/project/:projectId/env/:envId/log/:seq',
    projectEnvLogInfoParams: (projectId: any, envId: any, seq?: any) => {
      let value = pageRoot + `/project/${projectId}/env/${envId}/log`;
      if (seq)
        value = pageRoot + `/project/${projectId}/env/${envId}/log/${seq}`;
      return value;
    },
    userIndex: pageRoot + '/user',
    userCreate: pageRoot + '/user/create',
    userEdit: pageRoot + '/user/edit/:id',
    userEditParams: (id: any) => pageRoot + `/user/edit/${id}`,
    userLogin: pageRoot + '/user/login',
    serverIndex: pageRoot + '/server',
    serverCreate: pageRoot + '/server/create',
    serverEdit: pageRoot + '/server/edit/:id',
    serverEditParams: (id: any) => pageRoot + `/server/edit/${id}`,


  },
  // api
  apiRoutes: {
    projectPage: gateway + '/api/projects/page',
    projectInfo: gateway + '/api/projects/info',
    projectSave: gateway + '/api/projects/save',
    projectUpdate: gateway + '/api/projects/update',
    projectDeleted: gateway + '/api/projects/deleted',
    projectBuild: gateway + '/api/projects/build',
    projectSync: gateway + '/api/projects/sync',
    projectInit: gateway + '/api/projects/init',
    projectRefreshBranch: gateway + '/api/projects/refreshBranch',
    envList: { url: gateway + '/api/envs/list', method: HttpMethod.GET },
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
    serverPage: { url: gateway + '/api/servers/page', method: HttpMethod.GET },
    serverUpdate: { url: gateway + '/api/servers/update', method: HttpMethod.PUT },
    serverSave: { url: gateway + '/api/servers/save', method: HttpMethod.POST },
    serverInfo: { url: gateway + '/api/servers/info', method: HttpMethod.GET },
    serverDelete: { url: gateway + '/api/servers/delete', method: HttpMethod.DELETE },
  },
};

