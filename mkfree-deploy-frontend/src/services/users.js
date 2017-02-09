import request from '../utils/request';
import qs from 'qs';

export function fetch({pageNo=0}) {
    return request(`/api/user/page?pageNo=${pageNo}`);
}

export function userSave(values) {
  return request('/api/user/save', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function userUpdate(values) {
  return request('/api/user/update', {
    method: 'PUT',
    body: JSON.stringify(values),
  });
}

export function projectPage(values) {
  return request(`/api/project/page?${qs.stringify(values)}`);
}

export function userProjectPermissionUpdate(values) {
  return request('/api/user/project/permission/update', {
    method: 'PUT',
    body: JSON.stringify(values),
  });
}

export function projectPermissionList(values) {
  return request(`/api/user/project/permission/list?${qs.stringify(values)}`);
}
