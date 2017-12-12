import * as userSerivce from '../services/UserService';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {route, user} from '../Constant';
import {addKey, urlPathParams} from '../utils/Utils';

export default {

    namespace: 'userModel',

    state: {
        user: {},
        pageResult: {},
    },
    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {
                if (location.pathname === route.user.url) {
                    dispatch({type: 'page', payload: {...location.query}});
                    return;
                }
                const edit = urlPathParams(route.userEdit.url, location.pathname);
                // 编辑页
                if (edit) {
                    const id = edit[1];
                    dispatch({type: 'info', payload: {id}});
                }
            });
        },
    },
    effects: {

        *info({payload}, {call, put, select}){
            const user = yield call(userSerivce.info, payload);
            yield put({
                type: 'save',
                payload: {
                    user
                }
            });
        },
        *page({payload}, {call, put, select}) {
            const pageResult = yield call(userSerivce.page, payload);
            addKey(pageResult.list);
            yield put({
                type: 'save',
                payload: {
                    pageResult
                }
            });
        },
        *login({payload}, {call, put, select}) {
            const result = yield call(userSerivce.login, payload, {desc: '登录成功'});
            const userToken = result.data;
            if (result.code === '1') {
                cookie.save(user.accessToken, userToken, {path: '/', maxAge: 30 * 24 * 60 * 60});
                browserHistory.push({pathname: route.project.url, query: {pageNo: 0, pageSize: 100}});
            }
        }
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
};
