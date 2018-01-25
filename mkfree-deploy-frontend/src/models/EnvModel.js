import * as envService from '../services/EnvService';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {route, models} from '../Constant';
import {addKey, urlPathParams} from '../utils/Utils';

export default {

    namespace: models.env,

    state: {
        env: {},
        pageResult: {},
    },
    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {
                if (location.pathname === route.env.url) {
                    dispatch({type: 'page', payload: {...location.query}});
                    return;
                }
                const edit = urlPathParams(route.envEdit.url, location.pathname);
                // 编辑页
                if (edit) {
                    const id = edit[1];
                    dispatch({type: 'info', payload: {id}});
                    return;
                }
                if (location.pathname === route.envAdd.url) {
                    dispatch({type: 'save', payload: {env: {}}});
                }
            });
        },
    },
    effects: {
        *info({payload}, {call, put, select}){
            const env = yield call(envService.info, payload);
            yield put({
                type: 'save',
                payload: {
                    env
                }
            });
        },
        *saved({payload}, {call, put, select}){
            yield call(envService.save, payload, {desc: '环境添加成功'});
            browserHistory.goBack();
        },
        *update({payload}, {call, put, select}){
            yield call(envService.update, payload, {desc: '环境修改成功'});
            browserHistory.goBack();
        },
        *page({payload}, {call, put, select}) {
            const pageResult = yield call(envService.page, payload);
            addKey(pageResult.list);
            yield put({
                type: 'save',
                payload: {
                    pageResult
                }
            });
        },
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
};
