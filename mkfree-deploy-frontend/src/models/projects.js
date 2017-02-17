import * as projectService from '../services/projects';

import {browserHistory } from 'dva/router';

import {ROUTE_PROJECTS,ROUTE_PROJECTS_CREATE,ROUTE_PROJECTS_INFO} from '../constants';

export default {
    namespace: 'projects',
    state: {
        list: [],
        pList: [],
        sList: [],
        total: null,
        pageNo: null,
    },
    reducers: {
        save(state, {payload: {data: list,data: sList, total, pageNo}}) {
            return {...state, list, sList, total, pageNo};
        },
        // Info(state,{payload:{pList , sList}}){
        //     return {...state ,pList , sList}
        // },
        Info(state, action) {
            const {payload}=action;
            return {...state, ...payload};
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
            browserHistory.push(`${ROUTE_PROJECTS}`);
        },
        *remove({payload: values}, {call, put}) {
            yield call(projectService.remove, values);
            yield put({type: 'reload'});
        },
        *create({payload: values}, {call, put}) {
            yield call(projectService.save, values);
            browserHistory.push(`${ROUTE_PROJECTS}`);
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
                type: 'Info',
                payload: {
                    pList: result,
                },
            });
        },
        *seaverFetch({payload: {pageNo = 0}}, {call, put}) {
            const result = yield call(projectService.seaverFetch, {pageNo});
            yield put({
                type: 'Info',
                payload: {
                    sList: result.list,
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
                //创建
                dispatch({type: 'Info', payload: {
                    pList:[],
                }});
                if (pathname === ROUTE_PROJECTS_CREATE) {


                    dispatch({type: 'seaverFetch', payload: query});
                }
                //编辑
                if (pathname.includes(ROUTE_PROJECTS_INFO)) {

                    dispatch({type: 'projectFetch', payload: {
                        projectsId:pathname.split('/')[3]}
                    });
                    dispatch({type: 'seaverFetch', payload: query});
                }
            });
        },
    },
};
