import * as userProjectPermissionService from '../services/UserProjectPermissionService';
import * as envService from '../services/UserProjectPermissionService';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {message} from 'antd';
import {route, user} from '../Constant';
import {addKey, urlPathParams} from '../utils/Utils';

export default {

    namespace: 'UserProjectPermissionModel',

    state: {
        user: {},
        projectPageResult: [],
        projectEnvList: [],
    },
    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {
                const userProjectPermission = urlPathParams(route.userProjectPermission.url, location.pathname);
                // 编辑页
                if (userProjectPermission) {
                    const userId = userProjectPermission[1];

                    location.query.pageNo = location.query.pageNo ? location.query.pageNo : 0;
                    location.query.pageSize = location.query.pageSize ? location.query.pageSize : 50;

                    dispatch({
                        type: 'projectPage',
                        payload: {
                            userId,
                            ...location.query
                        }
                    });
                }
            });
        },
    },
    effects: {
        *projectPage({payload}, {call, put, select}) {
            const envList = yield call(envService.list, {});

            const projectPageResult = yield call(userProjectPermissionService.projectPage, payload);
            addKey(projectPageResult.list);
            yield put({
                type: 'save',
                payload: {
                    projectPageResult,
                    projectEnvList: envList,
                }
            });
        },
        *projectAssign({payload}, {call, put, select}) {
            yield call(userProjectPermissionService.projectAssign, payload, {desc: '分配成功'});
        }
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
};
