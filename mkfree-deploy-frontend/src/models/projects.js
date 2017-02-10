import * as projectService from '../services/projects';
import {ROUTE_PROJECTS} from '../constants';

export default {
    namespace: 'projects',
    state: {
        list: [],
        sList: [],
        total: null,
        pageNo: null,
    },
    reducers: {
        save(state, {payload: {data: list,data: sList, total, pageNo}}) {
            return {...state, list, sList, total, pageNo};
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
            yield call(projectService.update, values);
            yield put({type: 'reload'});
        },
        *remove({payload: values}, {call, put}) {
            yield call(projectService.remove, values);
            yield put({type: 'reload'});
        },
        *create({payload: values}, {call, put}) {
            yield call(projectService.save, values);
            yield put({type: 'reload'});
        },
        *reload(action, {put, select}) {
            const pageNo = yield select(state => state.projects.pageNo);
            yield put({type: 'fetch', payload: {pageNo}});
        },
        *deploy({payload:values},{call,put}){
            yield call(projectService.deploy, values);
            yield put({type: 'reload'});
        },
    
    
        *projectFetch({payload: {projectsId = 0}}, {call, put}) {
            const result = yield call(projectService.projectFetch, {projectsId});
            yield put({
                type: 'save',
                payload: {
                    data: result,
                },
            });
        },
        *seaverFetch({payload: {pageNo = 0}}, {call, put}) {
            const result = yield call(projectService.seaverFetch, {pageNo});
            yield put({
                type: 'save',
                payload: {
                    data: result.list,
                },
            });
        },
        *projectUpdate({payload: values}, {call, put}) {
            yield call(projectService.projectUpdate, values);
            yield put({type: 'reload'});
        },
        *projectRemove({payload: values}, {call, put}) {
            yield call(projectService.projectRemove, values);
            yield put({type: 'reload'});
        },
        *projectSave({payload: values}, {call, put}) {
            yield call(projectService.projectSave, values);
            yield put({type: 'reload'});
        },
        *reload(action, {put, select}) {
            const pageNo = yield select(state => state.projects.pageNo);
            yield put({type: 'fetch', payload: {pageNo}});
        },
        *projectDeploy({payload:values}, {call,put}){
            yield call(projectService.projectDeploy, values);
            yield put({type: 'reload'});
        }
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
