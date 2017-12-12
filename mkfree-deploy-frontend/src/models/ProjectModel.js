import * as projectService from '../services/ProjectService';
import {addKey, urlPathParams} from '../utils/Utils';
import {route} from '../Constant';
import {message, Button} from 'antd';
import {browserHistory} from 'dva/router';

export default {

    namespace: 'projectModel',

    state: {
        project: {}, // 项目信息
        deployTargetFileList: [{}], // 上传文件列表
        projectEnvConfigList: [], // 项目环境
        pageResult: {},
        buildLog: undefined, // 构建日志
    },

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {
                // 项目管理
                if (location.pathname === route.project.url) {

                    dispatch({type: 'page', payload: {...location.query}});
                    return;
                }
                const edit = urlPathParams(route.projectEdit, location.pathname);
                // 编辑页
                if (edit) {
                    const id = edit[1];
                    dispatch({type: 'info', payload: {id}});
                }

                // 新增页
                if (location.pathname === route.projectAdd) {
                    dispatch({
                        type: 'initAdd',
                    });
                }

                const urlBuildLog = urlPathParams(route.projectBuildLog, location.pathname);
                if (urlBuildLog) {
                    const id = urlBuildLog[1];
                    dispatch({
                        type: 'buildLog',
                        payload: {
                            id,
                        }
                    });
                }
            });
        },
    },

    effects: {
        *fetch({payload}, {call, put}) {  // eslint-disable-line
            yield put({type: 'save'});
        },

        *page({payload}, {call, put}) {
            let result = yield call(projectService.page, payload);

            if (!result) {
                result = {};
                result.list = [];
            }

            addKey(result.list);

            yield put({
                type: 'save',
                payload: {
                    pageResult: result
                }
            });
        },

        *initGit({payload}, {call, put, select}){
            yield call(projectService.initGit, payload.id, {desc: '初始化成功'});
        },
        *update({payload}, {call, put}) {
            yield call(projectService.update, payload, {desc: '修改成功'});
            browserHistory.goBack();
        },
        *info({payload}, {call, put}) {
            const result = yield call(projectService.info, payload.id);
            yield put({
                type: 'save',
                payload: {
                    project: result,
                    deployTargetFileList: result.deployTargetFileList,
                    projectEnvConfigList: result.projectEnvConfigList,
                }
            });

        },
        // 删除一个项目
        *deleted({payload}, {call, put, select}){
            yield call(projectService.deleted, payload, {desc: '删除成功'});
            browserHistory.push(`${route.project.url}?pageSize=100`);
        },
        *structure({payload}, {call, put, select}) {
            yield call(projectService.structure, payload, {desc: '发布成功'});
        },
        // 项目构建日志
        *buildLog({payload}, {call, put, select}) {
            const buildLog = yield call(projectService.buildLog, payload.id);
            yield put({
                type: 'save',
                payload: {
                    buildLog
                }
            });

            if (!buildLog || buildLog.indexOf('################ exec shell end ##################') === -1) {
                setTimeout(() => {
                    window.location.reload();
                }, 5000);

            }
            window.scroll(0, 10000000);

        },
        *sync({payload}, {call, put, select}) {
            yield call(projectService.sync, payload);
        },
        // 项目分支列表
        *branchRefresh({payload}, {call, put, select}) {
            const branchList = yield call(projectService.branchRefresh, payload.id, {desc: '刷新分支成功'});
            browserHistory.replace({pathname: route.project, query: payload.query});
        },
        // 保存
        *saved({payload}, {call, put, select}) {
            yield call(projectService.save, payload, {desc: '添加成功'});
            browserHistory.goBack();
        },
        // 添加一项 deployTargetFile
        *addDeployTargetFile({payload}, {call, put, select}) {
            const {deployTargetFileList} = (yield select(state => state.projectModel));
            yield put({
                type: 'save',
                payload: {
                    deployTargetFileList: deployTargetFileList.concat([{}])
                }
            });
        },

        // 删除一项 deployTargetFile
        *deleteDeployTargetFile({payload}, {call, put, select}) {
            const {deployTargetFileList} = (yield select(state => state.projectModel));
            yield put({
                type: 'save',
                payload: {
                    deployTargetFileList: deployTargetFileList.concat([{}])
                }
            });
        },
        *initAdd({payload}, {call, put, select}) {
            const envList = yield call(projectService.envList);
            yield put({
                type: 'save',
                payload: {
                    project: {
                        branchList: '["master"]',
                    },
                    projectEnvConfigList: envList,
                    deployTargetFileList: [{}],

                }
            });
        }
    },

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

};
