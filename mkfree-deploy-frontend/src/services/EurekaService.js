import {api, apiMethod} from '../Constant';
import {jsonToUrlParams} from '../utils/Utils';
import fetch from 'dva/fetch';
import cookie from 'react-cookie';

import {message} from 'antd';
import {browserHistory} from 'dva/router';


export async function app(payload, remind) {
    const url = `http://eurekaprod.tech.yiwoaikeji.com/eureka/apps/${payload.eurekaAppName}`;
    return request(url, {method: apiMethod.GET});
}

export async function appStatus(payload, remind) {
    const url = `http://eurekaprod.tech.yiwoaikeji.com/eureka/apps/${payload.app}/${payload.instanceId}/status?value=${payload.value}`;
    return request(url, {method: apiMethod.PUT});
}


/**
 * 返回一个 RestResult
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function request(url, options = {}) {
    options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    return fetch(url, options)
        .then(checkStatus)
        .then((response) => {
            return parseJSON(response);
        })
        .then((result) => {
            return result;
        })
        .catch(err => ({err}));
}

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}
