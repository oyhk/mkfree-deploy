import {request, requestData} from '../utils/Request';

export async function page() {
    return requestData('/api/project/page');
}

export async function save(body) {
    return request('/api/project/save', {method: 'POST', body: JSON.stringify(body)});
}

export async function update(body) {
    return request('/api/project/update', {method: 'PUT', body: JSON.stringify(body)});
}


export async function info(id) {
    return requestData(`/api/project/info?id=${id}`);
}

export async function structure(body) {
    return request('/api/project/structure', {method: 'POST', body: JSON.stringify(body)});
}
