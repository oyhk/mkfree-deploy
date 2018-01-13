import * as installService from '../services/InstallService';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {message} from 'antd';
import {route, user} from '../Constant';
import {addKey, urlPathParams} from '../utils/Utils';

export default {

    namespace: 'installModel',

    state: {
        user: {},
        pageResult: {},
    },
    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {

            });
        },
    },
    effects: {
        *install({payload}, {call, put, select}){
            const result = yield call(installService.install, payload);
            if (result.code === '1') {
                location.replace(route.signIn.url);
            } else if (result.code === '0') {
                message.error(result.desc);
            } else {
                message.warn(result.desc);
            }
        },
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
};
