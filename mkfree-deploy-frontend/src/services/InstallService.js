import {request, requestData} from '../utils/Request';
import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function install(body, remind) {
    return request(api.install.url, {method: api.install.method, body: JSON.stringify(body), remind});
}
