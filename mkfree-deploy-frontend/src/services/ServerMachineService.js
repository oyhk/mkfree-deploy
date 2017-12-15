import {request, requestData} from '../utils/Request';
import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function info(params, remind) {
    return requestData(`${api.serverMachineInfo}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function page(params, remind) {
    return requestData(`${api.serverMachinePage}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}

export async function save(body, remind) {
    return request(`${api.serverMachineSave}`, {method: 'POST', body: JSON.stringify(body)});
}
export async function update(body, remind) {
    return request(`${api.serverMachineUpdate.url}`, {
        method: api.serverMachineUpdate.method,
        body: JSON.stringify(body)
    });
}
