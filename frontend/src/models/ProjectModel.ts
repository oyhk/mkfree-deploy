import { Effect, Reducer, Subscription } from '@@/plugin-dva/connect';
import * as projectService from '@/services/ProjectService';
import * as envService from '@/services/EnvService';
import * as serverService from '@/services/ServerService';
import * as projectEnvService from '@/services/ProjectEnvService';
import * as projectEnvLogService from '@/services/ProjectEnvLogService';
import { PageResult } from '@/services/PageResult';
import pathToRegexp from 'path-to-regexp';
import routes from '@/routes';
import { EnvDto } from '@/models/dto/EnvDto';
import { ProjectDto } from '@/models/dto/ProjectDto';
import { ProjectEnvDto } from '@/models/dto/ProjectEnvDto';
import { ProjectEnvServerDto } from '@/models/dto/ProjectEnvServerDto';
import { ServerDto } from '@/models/dto/ServerDto';
import { notification } from 'antd';
import { history } from 'umi';
import { ProjectEnvLogDto } from '@/models/dto/ProjectEnvLogDto';
import { Simulate } from 'react-dom/test-utils';

/**
 * 项目日志弹框
 */
export interface ProjectLogModel {
  visible: boolean,
  projectEnvList: ProjectEnvDto[],
  // 项目环境日志内容
  projectEnvLog: ProjectEnvLogDto,
  projectName: string,
}


/**
 * 项目ModelState
 */
export interface ProjectModelState {

  logModal?: ProjectLogModel;

  page?: PageResult<ProjectDto>;

  project?: ProjectDto;

  envList?: EnvDto[];
  serverList?: ServerDto[];

  // projectForm 里面功能
  projectFormEurekaEnable?: boolean;

}


interface ProjectModelType {
  namespace: 'project';
  state: ProjectModelState;
  effects: {
    index: Effect;
    edit: Effect;
    editProjectEnvDel: Effect;
    saved: Effect;
    create: Effect;
    update: Effect;
    build: Effect;
    init: Effect;
    sync: Effect;
    refreshBranch: Effect;
    logModalVisibleChange: Effect;
    logModalProjectEnvLogText: Effect;
    projectFormPluginEnableChange: Effect;

  };
  reducers: {
    save: Reducer<ProjectDto>;
  };
  subscriptions: { setup: Subscription };
}


const ProjectModel: ProjectModelType = {
  namespace: 'project',
  state: {
    page: {} as PageResult<ProjectDto>,
  },

  effects: {
    * index({ payload }, { call, put }) {
      const projectPage = yield call(projectService.page, { pageNo: payload.pageNo });
      yield put({
        type: 'save',
        payload: {
          page: projectPage,
        },
      });
    },
    * create({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          project: null,
        },
      });

      const project = { projectEnvList: [] } as unknown as ProjectDto;
      const envList = yield call(envService.list, {});
      const serverList = yield call(serverService.list, {});
      yield put({
        type: 'save',
        payload: {
          project,
          envList,
          serverList,
        },
      });
    },
    * saved({ payload }, { call, put }) {
      yield call(projectService.save, payload, () => {
        notification.success({
          message: `项目：${payload.name}`,
          description: '添加成功',
        });
        history.replace(routes.pageRoutes.projectIndex);
      });
    },

    * edit({ payload }, { call, put }) {

      yield put({
        type: 'save',
        payload: {
          project: null,
        },
      });

      const project = yield call(projectService.info, { id: payload.id });
      const envList = yield call(envService.list, {});
      const serverList = yield call(serverService.list, {});

      project.projectEnvList.forEach((projectEnv: ProjectEnvDto) => {

        if (projectEnv.projectEnvServerList) {
          // 用于选中服务器的标识，由于api返回没有这个字段，前端需要选中，
          // 前端返回的serverIp，isServerIp统一设置为true
          projectEnv.projectEnvServerList.forEach(projectEnvServer => {
            // eslint-disable-next-line no-param-reassign
            projectEnvServer.isSelectServerIp = true;
          });
          const projectEnvServerIpList = projectEnv?.projectEnvServerList.map((projectEnvServer) => projectEnvServer.serverIp);
          serverList.filter((server: ServerDto) => projectEnvServerIpList.indexOf(server.ip) === -1).forEach((server: ServerDto) => {
            // eslint-disable-next-line no-unused-expressions
            projectEnv?.projectEnvServerList?.push({
              envId: server.envId,
              envName: server.envName,
              serverIp: server.ip,
              serverName: server.name,
            } as ProjectEnvServerDto);
          });
        }
      });


      yield put({
        type: 'save',
        payload: {
          project,
          envList,
          serverList,
        },
      });
    },
    * editProjectEnvDel({ payload }, { call, put, select }) {
      const projectDto = yield select((state: { project: { project: ProjectDto; }; }) => state.project?.project);
      projectDto.projectEnvList = projectDto.projectEnvList.filter((projectEnvDto: ProjectEnvDto) => projectEnvDto.envId !== payload.envId);

      yield put({
        type: 'save',
        payload: {
          project: projectDto,
        },
      });
    },

    * update({ payload }, { call, put }) {
      yield call(projectService.update, payload, () => {
        notification.success({
          message: `项目：${payload.name}`,
          description: '修改成功',
        });
        history.replace(routes.pageRoutes.projectIndex);
      });
    },
    /**
     * 项目构建
     * @param payload
     * @param call
     * @param put
     */

    * build({ payload }, { call, put }) {
      yield call(projectService.build, payload, () => {
        notification.success({
          message: `项目：${payload.name}`,
          description: '同步操作成功，请稍后...',
        });
      });
    },
    /**
     * 项目同步
     * @param payload
     * @param call
     * @param put
     */
    * sync({ payload }, { call, put }) {
      yield call(projectService.sync, payload, () => {
        notification.success({
          message: `项目：${payload.name}`,
          description: '构建操作成功，请稍后...',
        });
      });
    },
    * refreshBranch({ payload }, { call, put }) {
      yield call(projectService.refreshBranch, payload, () => {
        notification.success({
          message: `项目：${payload.name}`,
          description: '刷新分支操作成功，请稍后...',
        });
      });
    },
    /**
     * 项目初始化
     * @param payload
     * @param call
     * @param put
     */
    * init({ payload }, { call, put }) {
      yield call(projectService.init, payload, () => {
        notification.success({
          message: `项目：${payload.name}`,
          description: '初始化操作成功，请稍后...',
        });
      });
    },
    /**
     * 项目环境服务器日志
     * @param payload
     * @param call
     * @param put
     */
    * logModalVisibleChange({ payload }, { call, put }) {

      if (payload.logModalVisible) {
        const projectEnvList: ProjectEnvDto[] = yield call(projectEnvService.list, { dto: { projectId: payload.projectId } });
        for (const projectEnv of projectEnvList) {
          projectEnv.projectEnvLogList = yield call(projectEnvLogService.list, {
            dto: {
              projectId: projectEnv.projectId,
              envId: projectEnv.envId,
            },
          });
        }
        yield put({
          type: 'save',
          payload: {
            logModal: {
              visible: payload.logModalVisible,
              projectEnvList: projectEnvList,
              projectName: payload.projectName,
            } as ProjectLogModel,
            logModalProjectName: payload.projectName,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            logModal: {
              visible: payload.logModalVisible,
            } as ProjectLogModel,
          },
        });
      }
    },
    /**
     * 项目环境日志
     * @param payload
     * @param call
     * @param put
     */
    * logModalProjectEnvLogText({ payload }, { call, put, select }) {
      const projectEnvLog = yield call(projectEnvLogService.info, { dto: payload });
      console.log('projectEnvLog', projectEnvLog);
      const logModal = yield select((state: any) => state.project?.logModal);
      logModal.projectEnvLog = projectEnvLog;
      yield put({
        type: 'save',
        payload: {
          logModal,
        },
      });
    },
    * projectFormPluginEnableChange({ payload }, { call, put, select }) {
      if (payload.projectPlugin.pluginName === 'Eureka') {
        yield put({
          type: 'save',
          payload: {
            projectFormEurekaEnable:payload.isEnable
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {


        // 列表页订阅
        if (pathname === routes.pageRoutes.projectIndex) {
          dispatch({
            type: 'index',
            payload: {
              pageNo: 0,
            },
          });
          return;
        }

        if (pathname === routes.pageRoutes.projectCreate) {
          dispatch({ type: 'create' });
          return;
        }

        const editMatch: any = pathToRegexp(routes.pageRoutes.projectEdit).exec(pathname);
        if (!editMatch) {
          return;
        }
        const id = editMatch[1];
        if (id) {
          dispatch({
            type: 'edit',
            payload: {
              id,
            },
          });
        }


      });
    },
  },
};

export default ProjectModel;
