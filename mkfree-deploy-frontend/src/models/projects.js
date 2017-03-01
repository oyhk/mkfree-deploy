import * as projectService from "../services/projects";
import {browserHistory} from "dva/router";
import {
    ROUTE_PROJECTS,
    ROUTE_PROJECTS_CREATE,
    ROUTE_PROJECTS_INFO,
    ROUTE_PROJECT_STRUCTURE_LOGS,
    LOGS_LIST
} from "../constants";
export default {
    namespace: 'projects',
    state: {
        list: [],
        pList: [],
        sList: [],
        total: null,
        pageNo: null,
        loading: false,
        visible_more: false,
        recordID: 0,
        envType: ['DEV', '开发'],
        serverMachineList: [],
        structureLogList: [],
        description: ''
    },
    reducers: {
        save(state, action) {
            const {payload}=action;
            return {...state, ...payload};
        },
        Info(state, action) {
            const {payload}=action;
            return {...state, ...payload};
        },
        changeDescription(state, action) {
            const {description}=state;
            let {payload}=action;
            payload.description = description + payload.description;
            return {...state, ...payload};
        },
    },
    effects: {
        *fetch({payload: {pageNo = 1}}, {call, put}) {
            const result = yield call(projectService.fetch, {pageNo});
            yield put({
                type: 'save',
                payload: {
                    list: result.list,
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
        *deploy({payload:values}, {call, put}){
            yield call(projectService.deploy, values);
            yield put({type: 'reload'});
        },
        *projectFetch({payload: {projectsId = 0}}, {call, put}) {
            const result = yield call(projectService.projectFetch, {projectsId});
            yield put({
                type: 'Info',
                payload: {
                    pList: result,
                }
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
        *projectDeploy({payload:values}, {call, put}){
            yield call(projectService.projectDeploy, values);
            yield put({type: 'reload'});
        },
        *projectStructureLogList({payload}, {call, put}){
            const {pathname, projectId}= payload;
            const structureLogList = yield call(projectService.projectStructureLogList, {projectId});
            yield put({type: 'Info', payload: {structureLogList}});
            if (!pathname.split('/')[5]) {
                browserHistory.push(`${pathname}/log/${structureLogList[0].seqNo}`)
            }
        },
        *projectStructureLogInfo({payload}, {call, put}){
            const data = yield call(projectService.projectStructureLogInfo, payload);
            if (data) {
                yield put({type: 'Info', payload: {description: data.description}});
            }
        },
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === ROUTE_PROJECTS) {
                    dispatch({type: 'fetch', payload: query});
                }
                //创建
                dispatch({
                    type: 'Info', payload: {
                        pList: [],
                    }
                });
                //编辑
                if (pathname === ROUTE_PROJECTS_CREATE) {
                    dispatch({type: 'seaverFetch', payload: query});
                }
                
                if (pathname.includes(ROUTE_PROJECTS_INFO)) {
                    dispatch({
                        type: 'projectFetch', payload: {
                            projectsId: pathname.split('/')[4]
                        }
                    });
                    dispatch({type: 'seaverFetch', payload: query});
                }
                
                if (pathname.includes(ROUTE_PROJECT_STRUCTURE_LOGS)) {
                    dispatch({
                        type: 'projectStructureLogList', payload: {
                            projectId: pathname.split('/')[4],
                            pathname
                        }
                    });
                }
                
                if (pathname.includes(ROUTE_PROJECT_STRUCTURE_LOGS) && pathname.includes(LOGS_LIST)) {
                    dispatch({
                        type: 'projectStructureLogInfo', payload: {
                            projectId: pathname.split('/')[4],
                            seqNo: pathname.split('/')[6],
                        }
                    });
                }
            });
        },
    },
};
