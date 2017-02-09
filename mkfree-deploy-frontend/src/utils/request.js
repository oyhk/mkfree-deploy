import fetch from "dva/fetch";


const apiDomains = {
  dev: 'http://192.168.1.210:8090',
  prod: ''//当为空时，api就是相对路径
};

const userTokenHash = {
  local: 'dev_',
  dev: 'dev_',
  uat: 'uat_',
  prod: ''
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}


class Headers {
  constructor(env) {
    this.apiDomains = apiDomains[env];
    this._cookies = {};
    this._getCookies();
    this._prefix = userTokenHash[env];
    this.headers = {};
  }
  
  _getCookies() {
    document.cookie.split('; ').forEach((cookie) => {
      this._cookies[cookie.split('=')[0]] = cookie.split('=')[1];
    });
    return this._cookies;
  }
  
  getHeaders() {
    this.headers = {
      [this._prefix + 'user_token']: this._cookies[this._prefix + 'user_token'],
      domain: window.location.hostname,
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
export default async function request(url, options = {}) {
  const env = process.env.NODE_ENV || 'dev';
  let Header = new Headers(env);
  options.headers = Header.getHeaders();
  
  url = `${apiDomains[env]}${url}`;
  const response = await fetch(url, options);
  checkStatus(response);
  const result = await response.json();
  if (result.code != 1) {
    throw new Error(`请求 url : ${url},返回结果 : ${result.desc}`);
  }
  return result.data;
}
