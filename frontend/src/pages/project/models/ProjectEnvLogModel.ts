import { Effect, Reducer, Subscription } from '@@/plugin-dva/connect';
import pathToRegexp from 'path-to-regexp';
import routes from '@/routes';
import { ProjectEnvLogDto } from '@/models/dto/ProjectEnvLogDto';
import { history } from 'umi';
import * as projectEnvLogService from '@/services/ProjectEnvLogService';
import * as lodash from 'lodash';


/**
 * 项目ModelState
 */
export interface ProjectEnvLogModelState {
  info?: ProjectEnvLogDto;
  currentMenu?: number;
  buildingLogList?: ProjectEnvLogDto[];
  historyLogList?: ProjectEnvLogDto[];
}


interface ProjectModelType {
  namespace: 'projectEnvLog';
  state: ProjectEnvLogModelState;
  effects: {
    info: Effect;
    index: Effect;
  };
  reducers: {
    save: Reducer<ProjectEnvLogModelState>;
  };
  subscriptions: { setup: Subscription };
}


const ProjectModel: ProjectModelType = {
  namespace: 'projectEnvLog',
  state: {},

  effects: {
    /**
     * 日志详情
     * @param payload
     * @param call
     * @param put
     * @param select
     */
    * info({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          info: undefined,
        },
      });


      // 环境日志，菜单数据
      const projectEnvLogList: ProjectEnvLogDto[] = yield call(projectEnvLogService.list, {
        payload: {
          projectId: payload.projectId,
          envId: payload.envId,
        },
      });
      const projectEnvLogListGroupByIsFinish = lodash.groupBy(projectEnvLogList, projectEnvLog => projectEnvLog.isFinish);
      yield put({
        type: 'save',
        payload: {
          buildingLogList: projectEnvLogListGroupByIsFinish['false'],
          historyLogList: projectEnvLogListGroupByIsFinish['true'],
        },
      });
      // 环境日志详情
      const projectEnvLog = yield call(projectEnvLogService.info, { payload: payload });
      if (projectEnvLog.isFinish) {
        yield put({
          type: 'save',
          payload: {
            info: projectEnvLog,
          },
        });
      } else {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        while (true) {
          // 正在构建日志
          const projectEnvLog = yield call(projectEnvLogService.info, { payload: payload });
          yield put({
            type: 'save',
            payload: {
              info: projectEnvLog,
            },
          });
          // 刷新左侧菜单栏
          // 环境日志，菜单数据
          const projectEnvLogList: ProjectEnvLogDto[] = yield call(projectEnvLogService.list, {
            payload: {
              projectId: payload.projectId,
              envId: payload.envId,
            },
          });
          const projectEnvLogListGroupByIsFinish = lodash.groupBy(projectEnvLogList, projectEnvLog => projectEnvLog.isFinish);
          yield put({
            type: 'save',
            payload: {
              buildingLogList: projectEnvLogListGroupByIsFinish['false'],
              historyLogList: projectEnvLogListGroupByIsFinish['true'],
            },
          });

          yield delay(500);
          if (projectEnvLog.isFinish) {
            break;
          }
        }
      }
    },
    /**
     * 日志首页
     * @param payload
     * @param call
     * @param put
     * @param select
     */
    * index({ payload }, { call, put, select }) {
      const projectEnvLogList: ProjectEnvLogDto[] = yield call(projectEnvLogService.list, {
        payload: {
          projectId: payload.projectId,
          envId: payload.envId,
        },
      });
      const projectEnvLogListGroupByIsFinish = lodash.groupBy(projectEnvLogList, projectEnvLog => projectEnvLog.isFinish);
      const buildingLog: ProjectEnvLogDto[] = projectEnvLogListGroupByIsFinish['false'];
      const historyLog: ProjectEnvLogDto[] = projectEnvLogListGroupByIsFinish['true'];
      // 当进入首页时，优先匹配正在构建日志
      if (buildingLog && buildingLog.length > 0) {
        history.replace(routes.pageRoutes.projectEnvLogInfoParams(payload.projectId, payload.envId, buildingLog[0].projectEnvLogSeq));
        yield put({
          type: 'save',
          payload: { currentMenu: buildingLog[0].projectEnvLogSeq },
        });
        return;
      }
      // 当没有正在构建日志，获取历史日志最新构建日志作为跳转
      if (historyLog && historyLog.length > 0) {
        history.replace(routes.pageRoutes.projectEnvLogInfoParams(payload.projectId, payload.envId, historyLog[0].projectEnvLogSeq));
        yield put({
          type: 'save',
          payload: { currentMenu: historyLog[0].projectEnvLogSeq },
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

        // 环境日志首页
        const indexMatch: any = pathToRegexp(routes.pageRoutes.projectEnvLogIndex).exec(pathname);
        if (indexMatch) {
          const indexMatchProjectId = indexMatch[1];
          const indexMatchEnvId = indexMatch[2];
          dispatch({
            type: 'index',
            payload: {
              projectId: indexMatchProjectId,
              envId: indexMatchEnvId,
            },
          });
          return;
        }

        // 环境日志详情页
        const infoMatch: any = pathToRegexp(routes.pageRoutes.projectEnvLogInfo).exec(pathname);
        if (infoMatch) {
          const infoMatchProjectId = infoMatch[1];
          const infoMatchEnvId = infoMatch[2];
          const infoMatchSeq = infoMatch[3];
          dispatch({
            type: 'info',
            payload: {
              projectId: infoMatchProjectId,
              envId: infoMatchEnvId,
              projectEnvLogSeq: infoMatchSeq,
            },
          });
          return;
        }

      });
    },
  },


};

export default ProjectModel;
