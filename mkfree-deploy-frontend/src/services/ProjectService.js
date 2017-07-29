import {request, requestData} from '../utils/Request';
import {jsonToUrlParams} from '../utils/Utils';

export async function page(params) {
    return requestData(`/api/project/page?${jsonToUrlParams(params)}`);
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

export async function envList() {
    return requestData('/api/project/env_list');
}

export async function structure(body) {
    return request('/api/project/structure', {method: 'POST', body: JSON.stringify(body)});
}

export async function sync(body) {
    return request('/api/project/sync', {method: 'POST', body: JSON.stringify(body)});
}
