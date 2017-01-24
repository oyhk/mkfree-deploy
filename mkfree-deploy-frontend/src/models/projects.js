import * as projectService from '../services/projects';
import {ROUTE_PROJECTS} from '../constants';

export default {
    namespace: 'projects',
    state: {
        list: [],
        total: null,
        pageNo: null,
    },
    reducers: {
        save(state, {payload: {data: list, total, pageNo}}) {
            return {...state, list, total, pageNo};
        },
    },
    effects: {
        *fetch({payload: {pageNo = 1}}, {call, put}) {
            const result = yield call(projectService.fetch, {pageNo});
            yield put({
                type: 'save',
                payload: {
                    data: result.list,
                    total: result.totalCount,
                    pageNo: result.pageNo,
                },
            });
        },
        *patch({payload: values}, {call, put}) {
            console.log("model-project",values);
            yield call(projectService.update, values);
            yield put({type: 'reload'});
        },
        *remove({payload: values}, {call, put}) {
            console.log("model-project-delete",values);
            yield call(projectService.remove, values);
            yield put({type: 'reload'});
        },
        *create({payload: values}, {call, put}) {

            console.log("model-project",values);

            yield call(projectService.save, values);
            yield put({type: 'reload'});
        },
        *reload(action, {put, select}) {
            const pageNo = yield select(state => state.projects.pageNo);
            yield put({type: 'fetch', payload: {pageNo}});
        },
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === ROUTE_PROJECTS) {
                    dispatch({type: 'fetch', payload: query});
                }
            });
        },
    },
};
