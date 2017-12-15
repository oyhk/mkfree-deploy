import {request, requestData} from '../utils/Request';
import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function list(params, remind) {
    return requestData(`${api.envList}?${jsonToUrlParams(params)}`, {method: apiMethod.GET});
}
