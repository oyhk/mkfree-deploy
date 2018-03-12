import * as projectBuildLogService from '../services/ProjectBuildLogService';
import * as projectService from '../services/ProjectService';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {route, models} from '../Constant';
import {addKey, urlPathParams} from '../utils/Utils';

export default {
    namespace: models.projectInfo,

    state: {
        project: {},
        historyBuildLogList: [],
        buildLog: {},
        buildLogDescription: ''


    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen((location) => {

                // 项目信息layout start
                let projectId;
                const buildLog = urlPathParams(route.projectBuildLog, location.pathname);
                const buildLogInfo = urlPathParams(route.projectBuildLogInfo, location.pathname);
                if (buildLog) {
                    projectId = buildLog[1];
                }
                if (buildLogInfo) {
                    projectId = buildLogInfo[1];
                }
                if (projectId) {
                    dispatch({type: 'buildLogList', payload: {projectId}});
                    dispatch({type: 'projectInfo', payload: {projectId}});
                }
                // 项目信息layout end

                // 构建日志页
                if (buildLog) {
                    dispatch({
                        type: 'buildLogCurrent',
                        payload: {
                            projectId
                        }
                    });
                    return;
                }

                // 日志详情页
                if (buildLogInfo) {
                    dispatch({
                        type: 'buildLogInfo',
                        payload: {
                            projectId,
                            seqNo: location.query.seqNo
                        }
                    });
                }


            });
        },
    },
    effects: {
        // 日志列表
        *buildLogList({payload}, {call, put}) {
            const historyBuildLogList = yield call(projectBuildLogService.list, payload, {});
            yield put({
                type: 'save',
                payload: {
                    historyBuildLogList
                }
            });
        },
        // 日志详情
        *buildLogInfo({payload}, {call, put}) {
            const buildLog = yield call(projectBuildLogService.info, payload, {});
            yield put({
                type: 'save',
                payload: {
                    buildLog
                }
            });
        },
        // 项目构建日志
        *buildLogCurrent({payload}, {call, put, select}) {
            const data = yield call(projectService.buildLog, payload.projectId);
            const buildLogDescription = data.log;
            yield put({
                type: 'save',
                payload: {
                    buildLogDescription,
                }
            });
        },
        // 日志信息
        *projectInfo({payload}, {call, put, select}) {

            const {project} = (yield select(state => state.ProjectInfoModel));
            if (!project.id) {
                const project = yield call(projectService.info, payload.projectId, {});
                yield put({
                    type: 'save',
                    payload: {
                        project
                    }
                });
            }
        },
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
};
