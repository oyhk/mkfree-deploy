import {routePath} from './utils/Utils';

export const user = {
    accessToken: 'access_token'
};

const route_prefix = '/deploy';
export const route = {
    signIn: `${route_prefix}/sign_in`,
    project: {url: `${route_prefix}/project`, pageTitle: '项目管理'},
    projectEdit: `${route_prefix}/project/edit/:id`,
    projectDelete: `${route_prefix}/project/delete`,
    projectAdd: `${route_prefix}/project/add`,
    projectBuildLog: `${route_prefix}/project/build_log/:id`,
    projectEditPath: id => routePath(route.projectEdit, {id}),
    projectBuildLogPath: id => routePath(route.projectBuildLog, {id}),

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
    projectInitGit: `${api_prefix}/project/init_git`,
    userLogin: `${api_prefix}/user/login`,
    userPage: `${api_prefix}/user/page`,
    userInfo: `${api_prefix}/user/info`,
    envList: `${api_prefix}/env/list`,
    serverMachinePage: `${api_prefix}/server_machine/page`,
    serverMachineInfo: `${api_prefix}/server_machine/info`,
    serverMachineSave: `${api_prefix}/server_machine/save`,
    serverMachineUpdate: {url: `${api_prefix}/server_machine/update`, method: apiMethod.PUT},
};

