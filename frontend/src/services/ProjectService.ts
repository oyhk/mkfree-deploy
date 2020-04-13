import { get, post, put } from '@/utils/request';
import routes from '@/routes';
import { ProjectDto } from '@/models/dto/ProjectDto';

export async function page(projectDto: ProjectDto, successCallback?: Function) {
  return get(`${routes.apiRoutes.projectPage}?pageNo=${projectDto.pageNo}&pageSize=10000`, successCallback);
}

export async function info(projectDto: ProjectDto, successCallback?: Function) {
  return get(`${routes.apiRoutes.projectInfo}?id=${projectDto.id}`, successCallback);
}

export async function save(projectDto: ProjectDto, successCallback?: Function) {
  return post(`${routes.apiRoutes.projectSave}`, projectDto, successCallback);
}

export async function update(projectDto: ProjectDto, successCallback?: Function, failCallback?: Function) {
  return put(`${routes.apiRoutes.projectUpdate}`, projectDto, successCallback, failCallback);
}
