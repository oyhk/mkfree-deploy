import * as projectService from '../services/ProjectService';
import {addKey, urlPathParams} from '../utils/Utils';
import {route} from '../Constant';
import {message, Button} from 'antd';

export default {

    namespace: 'projectModel',

    state: {
        project: {}, // 项目信息
        deployTargetFileList: [{}], // 上传文件列表
        projectEnvConfigList: [
            {envText: '开发环境', env: 'DEV'},
            {envText: '测试环境', env: 'TEST'},
            {envText: '预发布环境', env: 'UAT'},
            {envText: '生产环境', env: 'PROD'}
        ], // 项目环境
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
    },

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

};
