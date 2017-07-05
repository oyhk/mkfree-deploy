import fetch from "dva/fetch";
import cookie from "react-cookie";
import {ROUTE_PREFIX, ROUTE_USERS_SIGN_IN} from "../constants";
import {browserHistory} from "dva/router";


const apiDomains = {
    dev: `http://192.168.1.210:8091`,
    // dev: 'http://192.168.3.133:8090', // HK 电脑
    prod: ''//当为空时，api就是相对路径
};

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


class Headers {
    constructor() {
        this.headers = {};
    }

    getHeaders() {
        this.headers = {
            user_token: cookie.load('user_token'),
            'Content-Type': 'application/json'
        };

        return this.headers;
    }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export async function requestResult(url, options = {}) {
    const env = process.env.NODE_ENV || 'dev';
    let Header = new Headers();
    options.headers = Header.getHeaders();

    url = `${apiDomains[env]}${url}`;

    const response = await fetch(url, options);
    checkStatus(response);
    const result = await response.json();

    if (result.code == 105 || result.code == 104) {
        browserHistory.push(ROUTE_USERS_SIGN_IN)
    }

    return result;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export async function request(url, options = {}) {
    let Header = new Headers();
    options.headers = Header.getHeaders();
    const env = process.env.NODE_ENV || 'dev';
    url = `${apiDomains[env]}${url}`;
    const response = await fetch(url, options);
    checkStatus(response);
    const result = await response.json();
    if (result.code != 1) {
        if (result.code == 105 || result.code == 104) {
            browserHistory.push(ROUTE_USERS_SIGN_IN)
        }
        throw new Error(`请求 url : ${url},返回结果 : ${result.desc}`);
    }
    return result.data;
}

