import {request, requestData} from '../utils/Request';
import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function list(params, remind) {
    return requestData(`${api.tagList.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}
export async function info(params, remind) {
    return requestData(`${api.tagInfo.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function page(params, remind) {
    return requestData(`${api.tagPage.url}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function save(body, remind) {
    return request(api.tagSave.url, {method: api.tagSave.method, body: JSON.stringify(body), remind});
}

export async function enable(body, remind) {
    return request(api.tagEnable.url, {method: api.tagEnable.method, body: JSON.stringify(body), remind});
}


export async function update(body, remind) {
    return request(api.tagUpdate.url, {method: api.tagUpdate.method, body: JSON.stringify(body), remind});
}
