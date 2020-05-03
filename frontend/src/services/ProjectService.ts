import { get, post, put } from '@/utils/MKRequest';
import routes from '@/routes';
import { ProjectDto } from '@/services/dto/ProjectDto';

export async function page(payload: ProjectDto) {
  return get({ url: `${routes.apiRoutes.projectPage}?pageNo=0&pageSize=10000` });
}

export async function info(payload: ProjectDto) {
  return get({ url: `${routes.apiRoutes.projectInfo}?id=${payload.id}` });
}

export async function save(payload: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectSave}`, payload: payload, successCallback, failCallback });
}

export async function update(payload: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return put({ url: `${routes.apiRoutes.projectUpdate}`, payload: payload, successCallback, failCallback });
}
export async function deleted(payload: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectDeleted}`, payload: payload, successCallback, failCallback });
}

export async function build(payload: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectBuild}`, payload: payload, successCallback, failCallback });
}

export async function sync(payload: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectSync}`, payload: payload, successCallback, failCallback });
}

export async function init(payload: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectInit}`, payload: payload, successCallback, failCallback });
}

export async function refreshBranch(payload: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectRefreshBranch}`, payload: payload, successCallback, failCallback });
}
