import {request, requestData} from '../utils/Request';
import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function list(params, remind) {
    return requestData(`${api.envList.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}
export async function info(params, remind) {
    return requestData(`${api.envInfo.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function page(params, remind) {
    return requestData(`${api.envPage.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function save(body, remind) {
    return request(api.envSave.url, {method: api.envSave.method, body: JSON.stringify(body), remind});
}

export async function update(body, remind) {
    return request(api.envUpdate.url, {method: api.envUpdate.method, body: JSON.stringify(body), remind});
}
