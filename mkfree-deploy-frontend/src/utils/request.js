import fetch from 'dva/fetch';

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options = {}) {
    options.headers = {
        'Content-Type': 'application/json'
    };
    url = `http://localhost:8090${url}`;
    const response = await fetch(url, options);
    checkStatus(response);
    const result = await response.json();
    if(result.code != 1){
        throw new Error(`请求 url : ${url},返回结果 : ${result.desc}`);
    }
    return result.data;
}
