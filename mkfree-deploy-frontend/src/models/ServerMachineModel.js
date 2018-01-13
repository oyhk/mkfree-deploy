import * as serverMachineService from '../services/ServerMachineService';
import * as envService from '../services/EnvService';
import {addKey, urlPathParams} from '../utils/Utils';
import {route} from '../Constant';
import {browserHistory} from 'dva/router';
import {message, Button} from 'antd';

export default {

    namespace: 'serverMachineModel',

    state: {
        serverMachine: {},
        pageResult: {},
        envList: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen((location) => {
                if (location.pathname === route.serverMachine.url) {
                    dispatch({type: 'page', payload: {...location.query}});
                    return;
                }
                if (location.pathname === route.serverMachineAdd.url) {
                    dispatch({type: 'envList', payload: {}});
                    return;
                }

                const edit = urlPathParams(route.serverMachineEdit.url, location.pathname);
                // 编辑页
                if (edit) {
                    const id = edit[1];
                    dispatch({type: 'info', payload: {id}});
                    dispatch({type: 'envList', payload: {}});
                }
            });
        },
    },

    effects: {
        *envList({payload}, {call, put, select}){
            const envList = yield call(envService.list, payload);
            yield put({
                type: 'save',
                payload: {
                    envList
                }
            });
        },

        *info({payload}, {call, put, select}) {
            const serverMachine = yield call(serverMachineService.info, payload);
            yield put({
                type: 'save',
                payload: {serverMachine}
            });
        },
        *saved({payload}, {call, put, select}) {
            const result = yield call(serverMachineService.save, payload, {desc: '添加成功'});
            if (result.code !== '1') {
                message.warn(result.desc);
                return;
            }
            browserHistory.goBack();
        },
        *update({payload}, {call, put, select}){
            const result = yield call(serverMachineService.update, payload, {desc: '修改成功'});
            if (result.code !== '1') {
                message.warn(result.desc);
                return;
            }
            browserHistory.goBack();
        },
        *page({payload}, {call, put, select}) {
            const pageResult = yield call(serverMachineService.page, payload);
            addKey(pageResult.list);
            yield put({
                type: 'save',
                payload: {pageResult}
            });
        }
    },

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

};
