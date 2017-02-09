import request from '../utils/request';

export function fetch({pageNo = 0}) {
  return request(`/api/server_machine/page?pageNo=${pageNo}`);
}

export function save(values) {
  return request('/api/server_machine/save', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function update(values) {
  return request('/api/server_machine/update', {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}


export function remove(id) {
  return request('/api/server_machine/delete', {
    method: 'DELETE',
    body: JSON.stringify({id: id}),
  });
}

export function deploy(body) {
  return request('/api/server_machine/structure', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

