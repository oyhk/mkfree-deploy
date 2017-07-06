/**
 * Created by oyhk on 2017/7/3.
 */

import pathToRegexp from 'path-to-regexp';

/**
 * 返回分页的数据，通过ant design规则添加table 每行的key
 * @param items
 */
export function addKey(items) {
    items.forEach((item, index) => {
        item.key = index;
    });
}

/**
 * 把url转换成 实际url
 * 例如：
 * /user/:id => /user/12
 * @param sourceurl
 * @param targetUrl
 */
export function routePath(sourceUrl, params) {
    return pathToRegexp.compile(sourceUrl)(params);
}

export function urlPathParams(sourceurl, targetUrl) {
    return pathToRegexp(sourceurl, []).exec(targetUrl);
}
