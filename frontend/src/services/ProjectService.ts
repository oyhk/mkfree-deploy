import { get, post, put } from '@/utils/request';
import routes from '@/routes';
import { ProjectDto } from '@/models/dto/ProjectDto';

export async function page(projectDto: ProjectDto) {
  return get(`${routes.apiRoutes.projectPage}?pageNo=${projectDto.pageNo}&pageSize=10000`);
}

export async function info(projectDto: ProjectDto) {
  return get(`${routes.apiRoutes.projectInfo}?id=${projectDto.id}`);
}

export async function save(projectDto: ProjectDto) {
  return post(`${routes.apiRoutes.projectSave}`, projectDto);
}
export async function update(projectDto: ProjectDto) {
  return put(`${routes.apiRoutes.projectUpdate}`, projectDto);
}
