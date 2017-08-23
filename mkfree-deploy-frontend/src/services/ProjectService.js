import {request, requestData} from '../utils/Request';
import {jsonToUrlParams} from '../utils/Utils';

export async function page(params, remind) {
    return requestData(`/api/project/page?${jsonToUrlParams(params)}`);
}

export async function save(body, remind) {
    return request('/api/project/save', {method: 'POST', body: JSON.stringify(body)});
}

export async function update(body, remind) {
    return request('/api/project/update', {method: 'PUT', body: JSON.stringify(body), remind});
}


export async function info(id, remind) {
    return requestData(`/api/project/info?id=${id}`);
}

export async function buildLog(id, remind) {
    return requestData(`/api/project/build_log?id=${id}`);
}

export async function branchRefresh(id, remind) {
    return requestData(`/api/project/branch_refresh?id=${id}`, {remind});
}

export async function envList(remind) {
    return requestData('/api/project/env_list');
}

export async function structure(body, remind) {
    return request('/api/project/structure', {method: 'POST', body: JSON.stringify(body), remind});
}

export async function sync(body, remind) {
    return request('/api/project/sync', {method: 'POST', body: JSON.stringify(body)});
}
