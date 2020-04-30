import { Effect, Reducer, Subscription } from '@@/plugin-dva/connect';
import * as userService from '@/services/UserService';
import * as projectEnvPluginService from '@/services/ProjectEnvPluginService';
import { history, useSelector } from 'umi';
import * as pluginEurekaService from '@/services/plugin/PluginEurekaService';
import routes from '@/routes';
import { ProjectEnvPluginDto } from '@/services/dto/ProjectEnvPluginDto';
import { Base64 } from 'js-base64';
import { PluginEurekaApplication } from '@/services/plugin/PluginEurekaDto';


/**
 * 用户ModelState
 */
export interface PluginEurekaModelState {
  visible: boolean;
  project?: {
    id: number,
    name: string
  };
  env?: {
    id: number,
    name: string
  };
  eureka?: PluginEurekaApplication;
}


interface PluginEurekaModelType {
  namespace: string;
  state: PluginEurekaModelState;
  effects: {
    index: Effect,
    close: Effect,
  };
  reducers: {
    save: Reducer<PluginEurekaModelState>;
  };
  subscriptions: { setup: Subscription };
}

const PluginEurekaModel: PluginEurekaModelType = {
  namespace: 'pluginEureka',
  state: {
    visible: false,
  },
  effects: {
    * index({ payload }, { call, put }) {

      console.log('index', payload);

      const projectEnvPlugin: ProjectEnvPluginDto = yield call(projectEnvPluginService.info, {
        payload: {
          projectId: payload.projectId,
          envId: payload.envId,
        },
      });

      const pluginEurekaApplication: PluginEurekaApplication = yield call(pluginEurekaService.list, {
        url: `${projectEnvPlugin.eurekaUrl}/eureka/apps/${payload.projectName}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${Base64.encode(projectEnvPlugin.eurekaUsername + ':' + projectEnvPlugin.eurekaPassword)}`,
        },
      });
      pluginEurekaApplication.application.instance = pluginEurekaApplication?.application?.instance?.sort((one, two) => (one.instanceId < two.instanceId ? -1 : 1));
      console.log(pluginEurekaApplication);

      yield put({
        type: 'save',
        payload: {
          visible: true,
          project: {
            id: payload.projectId,
            name: payload.projectName,
          },
          env: {
            id: payload.envId,
            name: payload.envName,
          },
          eureka: pluginEurekaApplication,
        },
      });
    },
    * close({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          visible: false,
          project: undefined,
          env: undefined,
        },
      });
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
      });
    },
  },
};
export default PluginEurekaModel;
