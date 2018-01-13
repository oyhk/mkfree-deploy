import {request, requestData} from '../utils/Request';
import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function login(body, remind) {
    return request(api.userLogin, {method: apiMethod.POST, body: JSON.stringify(body), remind});
}
export async function info(params, remind) {
    return requestData(`${api.userInfo}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function page(params, remind) {
    return requestData(`${api.userPage}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}
