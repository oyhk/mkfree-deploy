import {routePath} from './utils/Utils';

const route_prefix = '/deploy';
export const route = {
    signIn: `${route_prefix}/sign_in`,
    project: `${route_prefix}/project`,
    projectEdit: `${route_prefix}/project/edit/:id`,
    projectDelete: `${route_prefix}/project/delete`,
    projectAdd: `${route_prefix}/project/add`,
    projectBuildLog: `${route_prefix}/project/build_log/:id`,
    project_edit_path: id => routePath(route.projectEdit, {id}),
    project_build_log_path: id => routePath(route.projectBuildLog, {id}),
};
