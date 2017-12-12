import fetch from 'dva/fetch';
import {message} from 'antd';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {route, user} from '../Constant';


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

export function requestData(url, options = {}) {
    /**
     * 返回一个 RestResult.data
     * @param url
     * @param options
     * @returns {Promise.<TResult>}
     */
    url = `${API_HOST}${url}`;

    options.headers = {
        access_token: cookie.load(user.accessToken),
        'Content-Type': 'application/json'
    };
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((result) => {
            if (result.code === '0') {
                message.error(result.desc);
            } else if (result.code === '1' && options.remind) {
                message.success(options.remind.desc);
            } else if (result.code === '105' || result.code === '104') {
                message.warn('登录信息过期，请重新登录');
                browserHistory.replace(route.signIn);
            } else if (options.remind) {
                message.warn(result.desc);
            }

            return result.data;
        })
        .catch(err => ({err}));
}


/**
 * 返回一个 RestResult
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(url, options = {}) {

    url = `${API_HOST}${url}`;

    options.headers = {
        access_token: cookie.load(user.accessToken),
        'Content-Type': 'application/json'
    };

    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((result) => {
            if (result.code === '0') {
                message.error(result.desc);
            } else if (result.code === '1' && options.remind) {
                message.success(options.remind.desc);
            } else if (result.code === '105' || result.code === '104') {
                message.warn('登录信息过期，请重新登录');
                browserHistory.replace(route.signIn);
            }

            return result;
        })
        .catch(err => ({err}));
}
