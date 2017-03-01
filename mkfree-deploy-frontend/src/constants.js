export const PAGE_SIZE = 20;
export const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 30 * 24 * 60 * 60
};


export const ENV_DEV = ['DEV', '开发'];
export const ENV_TEST = ['TEST', '测试'];
export const ENV_UAT = ['UAT', '仿真测试'];
export const ENV_PROD = ['PROD', '生产'];


/*** 路由变量 start*****/

export const ROUTE_PREFIX = '/deploy';

export const ROUTE_USERS_SIGN_IN = ROUTE_PREFIX + '/users/sign_in';
export const ROUTE_PROJECTS = ROUTE_PREFIX + '/projects';

export const ROUTE_PROJECTS_CREATE = ROUTE_PREFIX + '/projects/create';
export const ROUTE_PROJECTS_INFO = ROUTE_PREFIX + '/projects/info';
export const ROUTE_ServerMachine = ROUTE_PREFIX + '/server_machine';

export const ROUTE_USERS = ROUTE_PREFIX + '/users';
export const ROUTE_USERS_INFO = ROUTE_PREFIX + '/users/info';
export const ROUTE_USERS_CREATE = ROUTE_PREFIX + '/users/create';

export const ROUTE_PROJECT_STRUCTURE_LOGS = ROUTE_PREFIX + '/project_structure_log';
export const LOGS_LIST = 'log';
export const ROUTE_PROJECT_STRUCTURE_LOGS_INFO = ROUTE_PREFIX + '/project_structure_log/info';


/*** 路由变量 end*****/

