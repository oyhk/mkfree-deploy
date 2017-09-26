import * as userSerivce from '../services/UserService';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {route} from '../Constant';

export default {

    namespace: 'userModel',

    state: {
        pageResult: {},
    },
    subscriptions: {},
    effects: {
        *login({payload}, {call, put, select}) {
            const result = yield call(userSerivce.login, payload, {desc: '登录成功'});
            const userToken = result.data;
            if (result.code === '1') {
                cookie.save('user_token', userToken, {path: '/', maxAge: 30 * 24 * 60 * 60});
                browserHistory.push({pathname: route.project, query: {pageNo: 0, pageSize: 100}});
            }
        }
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
};
