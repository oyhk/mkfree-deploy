import fetch from 'dva/fetch';
import {message} from 'antd';

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
    const url1 = `${API_HOST}${url}`;

    options.headers = {
        user_token: 'e15fc3c18fecfd8e3937c2b8c8677b4a',
        'Content-Type': 'application/json'
    };
    return fetch(url1, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((result) => {
            if (result.code === '0') {
                message.error(result.desc);
            } else if (result.code === '1') {
                message.success(result.desc);
            } else {
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
    const url1 = `${API_HOST}${url}`;

    options.headers = {
        user_token: 'e15fc3c18fecfd8e3937c2b8c8677b4a',
        'Content-Type': 'application/json'
    };

    return fetch(url1, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((result) => {
            if (result.code === '0') {
                message.error(result.desc);
            } else if (result.code === '1') {
                message.success(result.desc);
            } else {
                message.warn(result.desc);
            }

            return result;
        })
        .catch(err => ({err}));
}
