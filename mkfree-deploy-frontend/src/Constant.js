import {routePath} from './utils/Utils';

const route_prefix = '/deploy';
export const route = {
    signIn: `${route_prefix}/sign_in`,
    project: `${route_prefix}/project`,
    projectEdit: `${route_prefix}/project/edit/:id`,
    projectAdd: `${route_prefix}/project/add`,
    project_edit_path: id => routePath(route.projectEdit, {id})
};
