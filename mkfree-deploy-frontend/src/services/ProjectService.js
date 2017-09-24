import {request, requestData} from '../utils/Request';
import {api} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';

export async function page(params, remind) {
    return requestData(`${api.projectPage}?${jsonToUrlParams(params)}`);
}

export async function save(body, remind) {
    return request('/api/project/save', {method: 'POST', body: JSON.stringify(body)});
}
export async function deleted(body, remind) {
    return request('/api/project/delete', {method: 'DELETE', body: JSON.stringify(body), remind});
}

export async function initGit(id, remind) {
    return requestData(`${api.projectInitGit}?id=${id}`,{remind});
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
