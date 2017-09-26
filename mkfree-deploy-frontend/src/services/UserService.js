import {request, requestData} from '../utils/Request';
import {api} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';


export async function login(body, remind) {
    return request(api.userLogin, {method: 'POST', body: JSON.stringify(body), remind});
}
