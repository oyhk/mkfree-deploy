import * as projectService from "../services/projects";
import {message} from "antd";
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
        description: '',
        publicBranchList:[],
        projectEnvConfigList: [],
        nextName: ''
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
            const {code, desc} = yield call(projectService.update, values);
            if (code == 1) {
                message.success('修改成功');
            } else {
                message.warning(desc);
            }
        },
        *remove({payload: values}, {call, put}) {
            const {code, desc} =  yield call(projectService.remove, values);
            if (code == 1) {
                browserHistory.push(ROUTE_PROJECTS);
            } else {
                message.warning(desc);
            }
        },
        *create({payload: values}, {call, put}) {
            yield call(projectService.save, values);
            browserHistory.push(`${ROUTE_PROJECTS}`);
        },
        *reload(action, {put, select}) {
            const pageNo = yield select(state => state.projects.pageNo);
            yield put({type: 'fetch', payload: {pageNo}});
        },
        *deploy({payload:values}, {call, put, select}){
            const nextName = yield select(state => state.projects.nextName);
            const {pathname}=values;
            const {code, desc}=yield call(projectService.deploy, values);
            if (code == 1) {
                message.success('发布进行中');
                if (!pathname.includes(ROUTE_PROJECT_STRUCTURE_LOGS)) {
                    // console.log(nextName);
                    browserHistory.push(nextName);
                } else {
                    yield put({
                        type: 'projectStructureLogList',
                        payload: {
                            projectId: pathname.split('/')[4],
                            pathname
                        }
                    });
                }
            } else {
                message.warning(desc);
            }
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
        *projectBranchList({payload}, {call, put}){
            const data = yield call(projectService.projectBranchList, payload);
            if (data) {
                yield put({type: 'Info', payload: {publicBranchList: data}});
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

                if (pathname.includes(ROUTE_PROJECT_STRUCTURE_LOGS) && pathname.includes(ROUTE_PROJECTS_INFO)) {
                    dispatch({
                        type: 'projectFetch', payload: {
                            projectsId: pathname.split('/')[4]
                        }
                    });
                    dispatch({type: 'seaverFetch', payload: query});
                    dispatch({type: 'projectBranchList', payload: {id:pathname.split('/')[4]}});

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
