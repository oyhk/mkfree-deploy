import * as projectService from '../services/ProjectService';
// eslint-disable-next-line import/no-duplicates
import {addKey, urlPathParams} from '../utils/Utils';
import {route} from '../Constant';

export default {

    namespace: 'projectModel',

    state: {
        project: {}, // 项目信息
        pageResult: {},
    },

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {
                // 项目管理
                if (location.pathname === route.project) {
                    dispatch({type: 'page', payload: {}});
                    return;
                }
                const edit = urlPathParams(route.projectEdit, location.pathname);
                // 编辑页
                if (edit) {
                    const id = edit[1];
                    dispatch({type: 'info', payload: {id}});
                }
            });
        },
    },

    effects: {
        *fetch({payload}, {call, put}) {  // eslint-disable-line
            yield put({type: 'save'});
        },

        *page({payload}, {call, put}) {
            const result = yield call(projectService.page);

            addKey(result.list);

            yield put({
                type: 'save',
                payload: {
                    pageResult: result
                }
            });
        },
        *info({payload}, {call, put}) {
            const result = yield call(projectService.info, payload.id);
            yield put({
                type: 'save',
                payload: {
                    project: result
                }
            });

        },
        *structure({payload}, {call, put, select}) {
            const result = yield call(projectService.structure, payload);
        }
    },

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

};
