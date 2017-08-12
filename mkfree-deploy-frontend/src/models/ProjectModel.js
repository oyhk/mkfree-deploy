import * as projectService from '../services/ProjectService';
import {addKey, urlPathParams} from '../utils/Utils';
import {route} from '../Constant';
import {message, Button} from 'antd';

export default {

    namespace: 'projectModel',

    state: {
        project: {}, // 项目信息
        deployTargetFileList: [{}], // 上传文件列表
        projectEnvConfigList: [], // 项目环境
        pageResult: {},
        branchList: [], // 分支列表
    },

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {
                // 项目管理
                if (location.pathname === route.project) {
                    dispatch({type: 'page', payload: {...location.query}});
                    return;
                }
                const edit = urlPathParams(route.projectEdit, location.pathname);
                // 编辑页
                if (edit) {
                    const id = edit[1];
                    dispatch({type: 'info', payload: {id}});
                    dispatch({type: 'branchList', payload: {id}});
                }

                // 新增页
                if (location.pathname === route.projectAdd) {
                    dispatch({
                        type: 'initAdd',
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
            const result = yield call(projectService.page, payload);

            addKey(result.list);

            yield put({
                type: 'save',
                payload: {
                    pageResult: result
                }
            });
        },
        *update({payload}, {call, put}) {
            yield call(projectService.update, payload);
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

        *structure({payload}, {call, put, select}) {
            yield call(projectService.structure, payload);
        },
        *sync({payload}, {call, put, select}) {
            yield call(projectService.sync, payload);
        },
        // 项目分支列表
        *branchList({payload}, {call, put, select}) {
            const branchList = yield call(projectService.branchList, payload.id);
            yield put({
                type: 'save',
                payload: {
                    branchList
                }
            });

        },

        // 保存
        *saved({payload}, {call, put, select}) {
            yield call(projectService.save, payload);
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
                    project: {},
                    projectEnvConfigList: envList,
                    deployTargetFileList: [{}],
                    branchList: ['master'],
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
