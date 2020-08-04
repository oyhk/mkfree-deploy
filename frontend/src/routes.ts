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
    planProjectSort: pageRoot + '/plan/project-sort',
    planCreate: pageRoot + '/plan/create',
    planInfo: pageRoot + '/plan/:id',
    planInfoParams: (id: any) => pageRoot + `/plan/${id}`,
    planEdit: pageRoot + '/plan/edit/:id',
    planEditParams: (id: any) => pageRoot + `/plan/edit/${id}`,


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

    // 插件 Eureka
    pluginEurekaIndex: pageRoot + '/plugin/eureka',
    pluginEurekaEnvIndex: pageRoot + '/plugin/eureka/envId/:id',
    pluginEurekaEnvIndexParams: (envId: any) => pageRoot + `/plugin/eureka/envId/${envId}`,
    pluginEurekaEnvSetting: pageRoot + '/plugin/eureka/env-setting',

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
    projectPage: (searchParams?: any) => ({
      url: `${gateway}api/projects/page?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),
    projectInfo: (searchParams?: any) => ({
      url: `${gateway}api/projects/info?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),
    projectSave: gateway + 'api/projects/save',
    projectUpdate: gateway + 'api/projects/update',
    projectDeleted: gateway + 'api/projects/deleted',
    projectBuild: (payload?: any) => ({
      url: `${gateway}api/projects/build`,
      method: HttpMethod.post,
      data: payload,
    }),
    projectSync: (payload?: any) => ({
      url: `${gateway}api/projects/sync`,
      method: HttpMethod.post,
      data: payload,
    }),
    projectInit: (payload?: any) => ({
      url: `${gateway}api/projects/init`,
      method: HttpMethod.post,
      data: payload,
    }),

    projectRefreshBranch: (payload?: any) => ({
      url: `${gateway}api/projects/refreshBranch`,
      method: HttpMethod.post,
      data: payload,
    }),

    envList: (searchParams?: any) => ({
      url: `${gateway}api/envs/list?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),

    serverList: { url: gateway + 'api/servers/list', method: HttpMethod.get },

    projectEnvList: (searchParams?: any) => ({ url: `${gateway}api/projectEnvs/list?${querystring.stringify(searchParams)}`, method: HttpMethod.get }),
    projectEnvInfo: gateway + 'api/projectEnvs/info',
    projectEnvPluginInfo: (searchParams?: any) => ({
      url: `${gateway}api/projectEnvPlugins/info?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),
    projectEnvPluginList: (searchParams?: any) => ({
      url: `${gateway}api/projectEnvPlugins/list?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),
    projectEnvLogList:(searchParams?: any)=>({url: `${gateway}api/projectEnvLogs/list?${querystring.stringify(searchParams)}`}),
    projectEnvLogInfo:(searchParams?: any)=>({url: `${gateway}api/projectEnvLogs/info?${querystring.stringify(searchParams)}`}),

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

    // 插件环境配置
    pluginEnvSettingInfo: (searchParams?: any) => ({
      url: `${gateway}api/pluginEnvSetting/info?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),
    pluginEnvSettingList: (searchParams?: any) => ({
      url: `${gateway}api/pluginEnvSetting/list?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),
    pluginEnvSettingSave: (payload?: any) => ({
      url: `${gateway}api/pluginEnvSetting/save`,
      method: HttpMethod.post,
      data: payload,
    }),

    envPage: (searchParams?: any) => {
      return { url: `${gateway}api/envs/page?${querystring.stringify(searchParams)}`, method: HttpMethod.get };
    },
    planPage: (searchParams?: any) => {
      return { url: `${gateway}api/plans/page?${querystring.stringify(searchParams)}`, method: HttpMethod.get };
    },
    planProjectSortList: (searchParams?: any) => {
      return {
        url: `${gateway}api/plans/project-sort-list?${querystring.stringify(searchParams)}`,
        method: HttpMethod.get,
      };
    },
    planProjectSortSetting: (payload?: any) => ({
      url: `${gateway}api/plans/project-sort-setting`,
      method: HttpMethod.post,
      data: payload,
    }),
    planInfo: (searchParams?: any) => ({
      url: `${gateway}api/plans/info?${querystring.stringify(searchParams)}`,
      method: HttpMethod.get,
    }),
    planSave: (payload?: any) => {
      return { url: `${gateway}api/plans/save`, method: HttpMethod.post, data: payload };
    },
    planUpdate: (payload?: any) => {
      return { url: `${gateway}api/plans/update`, method: HttpMethod.put, data: payload };
    },
    planDelete: (payload: any) => ({ url: gateway + 'api/envs/delete', method: HttpMethod.delete, data: payload }),

    envUpdate: { url: gateway + 'api/envs/update', method: HttpMethod.put },
    envSave: { url: gateway + 'api/envs/save', method: HttpMethod.post },
    envInfo: { url: gateway + 'api/envs/info', method: HttpMethod.get },
    envDelete: { url: gateway + 'api/envs/delete', method: HttpMethod.delete },
  },
};

