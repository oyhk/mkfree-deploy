import request from '../utils/request';

export function fetch({pageNo = 0}) {
    return request(`/api/project/page?pageNo=${pageNo}`);
}

export function save(values) {
    return request('/api/project/save', {
        method: 'POST',
        body: JSON.stringify(values),
    });
}

export function update(values) {
    return request('/api/project/update', {
        method: 'PATCH',
        body: JSON.stringify(values),
    });
}


export function remove(id) {
    return request('/api/project/delete', {
        method: 'DELETE',
        body: JSON.stringify({id:id}),
    });
}

export function deploy(body) {
    return request('/api/project/structure', {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

