import {request, requestData} from '../utils/Request';
import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function list(params, remind) {
    return requestData(`${api.envList.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}
export async function info(params, remind) {
    return requestData(`${api.envInfo.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function projectPage(params, remind) {
    return requestData(`${api.userProjectPermissionProjectPage.url}?${jsonToUrlParams(params)}`, {method: api.userProjectPermissionProjectPage.method});
}

export async function projectAssign(body, remind) {
    return request(api.userProjectPermissionProjectAssign.url, {method: api.userProjectPermissionProjectAssign.method, body: JSON.stringify(body), remind});
}

export async function update(body, remind) {
    return request(api.envUpdate.url, {method: api.envUpdate.method, body: JSON.stringify(body), remind});
}
