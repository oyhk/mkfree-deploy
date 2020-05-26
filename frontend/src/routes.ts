import * as querystring from 'querystring';

const gateway = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/' : '/';
const pageRoot = '';
export const HttpMethod = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
};
export default {

  // 页面路由
  pageRoutes: {
    root: '/',
    installIndex: pageRoot + '/install',
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
    // 版本计划
    planIndex: pageRoot + '/plan',
    planCreate: pageRoot + '/plan/create',


    userIndex: pageRoot + '/user',
    userCreate: pageRoot + '/user/create',
    userEdit: pageRoot + '/user/edit/:id',
    userEditParams: (id: any) => pageRoot + `/user/edit/${id}`,
    userLogin: pageRoot + '/user/login',

    serverIndex: pageRoot + '/server',
    serverCreate: pageRoot + '/server/create',
    serverEdit: pageRoot + '/server/edit/:id',
    serverEditParams: (id: any) => pageRoot + `/server/edit/${id}`,

    envIndex: pageRoot + '/env',
    envCreate: pageRoot + '/env/create',
    envEdit: pageRoot + '/env/edit/:id',
    envEditParams: (id: any) => pageRoot + `/env/edit/${id}`,

  },
  // API
  apiRoutes: {

    systemInstall: {
      url: gateway + 'api/systems/install',
      method: HttpMethod.post,
    },
    systemInstalled: {
      url: gateway + 'api/systems/installed',
      method: HttpMethod.get,
    },

    projectPage: gateway + 'api/projects/page',
    projectInfo: gateway + 'api/projects/info',
    projectSave: gateway + 'api/projects/save',
    projectUpdate: gateway + 'api/projects/update',
    projectDeleted: gateway + 'api/projects/deleted',
    projectBuild: gateway + 'api/projects/build',
    projectSync: gateway + 'api/projects/sync',
    projectInit: gateway + 'api/projects/init',
    projectRefreshBranch: gateway + 'api/projects/refreshBranch',

    envList: { url: gateway + 'api/envs/list', method: HttpMethod.get },

    serverList: { url: gateway + 'api/servers/list', method: HttpMethod.get },

    projectEnvList: gateway + 'api/projectEnvs/list',
    projectEnvInfo: gateway + 'api/projectEnvs/info',
    projectEnvPluginInfo: gateway + 'api/projectEnvPlugins/info',
    projectEnvLogList: gateway + 'api/projectEnvLogs/list',
    projectEnvLogInfo: gateway + 'api/projectEnvLogs/info',

    userLogin: { url: gateway + 'api/users/login', method: HttpMethod.post },
    userPage: gateway + 'api/users/page',
    userSave: gateway + 'api/users/save',
    userInfo: gateway + 'api/users/info',
    userDelete: {
      url: gateway + 'api/users/delete',
      method: HttpMethod.delete,
    },
    userUpdate: gateway + 'api/users/update',

    serverPage: { url: gateway + 'api/servers/page', method: HttpMethod.get },
    serverUpdate: { url: gateway + 'api/servers/update', method: HttpMethod.put },
    serverSave: { url: gateway + 'api/servers/save', method: HttpMethod.post },
    serverInfo: { url: gateway + 'api/servers/info', method: HttpMethod.get },
    serverDelete: { url: gateway + 'api/servers/delete', method: HttpMethod.delete },

    envPage: (searchParams?: any) => {
      return { url: `${gateway}api/envs/page?${querystring.stringify(searchParams)}`, method: HttpMethod.get };
    },

    planProjectList: (searchParams?: any) => {
      return { url: `${gateway}api/plans/project-list?${querystring.stringify(searchParams)}`, method: HttpMethod.get };
    },
    planSave: (payload: any) => {
      return { url: `${gateway}api/plans/save`, method: HttpMethod.post, data: payload };
    },


    envUpdate: { url: gateway + 'api/envs/update', method: HttpMethod.put },
    envSave: { url: gateway + 'api/envs/save', method: HttpMethod.post },
    envInfo: { url: gateway + 'api/envs/info', method: HttpMethod.get },
    envDelete: { url: gateway + 'api/envs/delete', method: HttpMethod.delete },
  },
};

