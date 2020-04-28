import { get, post, put } from '@/utils/request';
import routes from '@/routes';
import { ProjectDto } from '@/models/dto/ProjectDto';

export async function page(dto: ProjectDto) {
  return get({ url: `${routes.apiRoutes.projectPage}?pageNo=${dto.pageNo}&pageSize=10000` });
}

export async function info(dto: ProjectDto) {
  return get({ url: `${routes.apiRoutes.projectInfo}?id=${dto.id}` });
}

export async function save(dto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectSave}`, dto, successCallback, failCallback });
}

export async function update(dto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return put({ url: `${routes.apiRoutes.projectUpdate}`, dto, successCallback, failCallback });
}
export async function deleted(dto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectDeleted}`, dto, successCallback, failCallback });
}

export async function build(dto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectBuild}`, dto, successCallback, failCallback });
}

export async function sync(dto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectSync}`, dto, successCallback, failCallback });
}

export async function init(dto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectInit}`, dto, successCallback, failCallback });
}

export async function refreshBranch(dto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post({ url: `${routes.apiRoutes.projectRefreshBranch}`, dto, successCallback, failCallback });
}
