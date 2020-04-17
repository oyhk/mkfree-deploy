import { get, post, put } from '@/utils/request';
import routes from '@/routes';
import { ProjectDto } from '@/models/dto/ProjectDto';

export async function page(projectDto: ProjectDto) {
  return get(`${routes.apiRoutes.projectPage}?pageNo=${projectDto.pageNo}&pageSize=10000`);
}

export async function info(projectDto: ProjectDto) {
  return get(`${routes.apiRoutes.projectInfo}?id=${projectDto.id}`);
}

export async function save(projectDto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post(`${routes.apiRoutes.projectSave}`, projectDto, successCallback, failCallback);
}

export async function update(projectDto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return put(`${routes.apiRoutes.projectUpdate}`, projectDto, successCallback, failCallback);
}

export async function build(projectDto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post(`${routes.apiRoutes.projectBuild}`, projectDto, successCallback, failCallback);
}
export async function init(projectDto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return post(`${routes.apiRoutes.projectInit}`, projectDto, successCallback, failCallback);
}
