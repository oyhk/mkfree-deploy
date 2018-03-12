import {routePath} from './utils/Utils';

export const user = {
    accessToken: 'access_token',
    username: 'username'
};

export const models = {
    tag: 'TagModel',
    env: 'EnvModel',
    install: 'InstallModel',
    project: 'ProjectModel',
    projectInfo: 'ProjectInfoModel',
    user: 'UserModel',
    userProjectPermission: 'UserProjectPermissionModel',
    serverMachine: 'ServerMachineModel',
};


const route_prefix = '/deploy';
export const route = {
    signIn: {url: `${route_prefix}/sign_in`, pageTitle: '登录'},
    install: {url: `${route_prefix}/install`, pageTitle: '系统安装'},
    project: {url: `${route_prefix}/project`, pageTitle: '项目管理'},
    projectInfo: `${route_prefix}/project/info`,
    projectEdit: `${route_prefix}/project/edit/:id`,
    projectEditPath: id => routePath(route.projectEdit, {id}),
    projectDelete: `${route_prefix}/project/delete`,
    projectAdd: `${route_prefix}/project/add`,
    projectBuildLog: `${route_prefix}/project/:id/build_log`,
    projectBuildLogInfo: `${route_prefix}/project/:id/build_log/info`,
    projectBuildLogPath: id => routePath(route.projectBuildLog, {id}),
    projectBuildLogInfoPath: id => routePath(route.projectBuildLogInfo, {id}),

    env: {url: `${route_prefix}/env`, pageTitle: '环境管理'},
    envAdd: {url: `${route_prefix}/env/add`, pageTitle: '环境添加'},
    envEdit: {url: `${route_prefix}/env/edit/:id`, pageTitle: '环境编辑'},
    envEditPath: id => routePath(route.envEdit.url, {id}),

    tag: {url: `${route_prefix}/tag`, pageTitle: '标签管理'},
    tagAdd: {url: `${route_prefix}/tag/add`, pageTitle: '标签添加'},
    tagEdit: {url: `${route_prefix}/tag/edit/:id`, pageTitle: '标签编辑'},
    tagEditPath: id => routePath(route.tagEdit.url, {id}),


    userProjectPermission: {url: `${route_prefix}/user_project_permission/:userId`, pageTitle: '用户权限管理'},
    userProjectPermissionPath: userId => routePath(route.userProjectPermission.url, {userId}),

    user: {url: `${route_prefix}/user`, pageTitle: '用户管理'},
    userEdit: {url: `${route_prefix}/user/edit/:id`, pageTitle: '用户编辑'},
    userEditPath: id => routePath(route.userEdit.url, {id}),

    serverMachine: {url: `${route_prefix}/server_machine`, pageTitle: '服务器管理'},
    serverMachineAdd: {url: `${route_prefix}/server_machine/add`, pageTitle: '服务器添加'},
    serverMachineEdit: {url: `${route_prefix}/server_machine/edit/:id`, pageTitle: '服务器编辑'},
    serverMachineEditPath: id => routePath(route.serverMachineEdit.url, {id})
};
export const apiMethod = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
};


const api_prefix = '/api';
export const api = {
    projectPage: `${api_prefix}/project/page`,
    projectPageAntDesignTable: {url: `${api_prefix}/project/page`, method: apiMethod.GET},
    projectInitGit: `${api_prefix}/project/init_git`,

    projectBuildLogList: {url: `${api_prefix}/project_build_log/list`, method: apiMethod.GET},
    projectBuildLogInfo: {url: `${api_prefix}/project_build_log/info`, method: apiMethod.GET},

    envConfig: {url: `${api_prefix}/project/env_config_list`, method: apiMethod.GET},

    userProjectPermissionProjectPage: {
        url: `${api_prefix}/user_project_permission/project_page`,
        method: apiMethod.GET
    },
    userProjectPermissionProjectAssign: {
        url: `${api_prefix}/user_project_permission/project_assign`,
        method: apiMethod.POST
    },


    install: {url: `${api_prefix}/install`, method: apiMethod.POST},
    userLogin: `${api_prefix}/user/login`,
    userPage: `${api_prefix}/user/page`,
    userInfo: `${api_prefix}/user/info`,

    envList: {url: `${api_prefix}/env/list`, method: apiMethod.GET},
    envPage: {url: `${api_prefix}/env/page`, method: apiMethod.GET},
    envInfo: {url: `${api_prefix}/env/info`, method: apiMethod.GET},
    envSave: {url: `${api_prefix}/env/save`, method: apiMethod.POST},
    envUpdate: {url: `${api_prefix}/env/update`, method: apiMethod.PUT},

    tagList: {url: `${api_prefix}/tag/list`, method: apiMethod.GET},
    tagPage: {url: `${api_prefix}/tag/page`, method: apiMethod.GET},
    tagInfo: {url: `${api_prefix}/tag/info`, method: apiMethod.GET},
    tagSave: {url: `${api_prefix}/tag/save`, method: apiMethod.POST},
    tagUpdate: {url: `${api_prefix}/tag/update`, method: apiMethod.PUT},
    tagEnable: {url: `${api_prefix}/tag/enable`, method: apiMethod.PUT},

    serverMachinePage: `${api_prefix}/server_machine/page`,
    serverMachineList: {url: `${api_prefix}/server_machine/list`, method: apiMethod.GET},
    serverMachineInfo: `${api_prefix}/server_machine/info`,
    serverMachineSave: `${api_prefix}/server_machine/save`,
    serverMachineUpdate: {url: `${api_prefix}/server_machine/update`, method: apiMethod.PUT},
};

