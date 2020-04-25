import { Effect, Reducer, Subscription } from '@@/plugin-dva/connect';
import * as userService from '@/services/UserService';
import { history } from 'umi';
import routes from '@/routes';

/**
 * 项目ModelState
 */
export interface UserModelState {
}


interface UserModelType {
  namespace: string;
  state: UserModelState;
  effects: {
    login: Effect
  };
  reducers: {
    save: Reducer;
  };
  subscriptions: { setup: Subscription };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {},
  effects: {
    * login({ payload }, { call, put }) {
      const apiResult = yield call(userService.login, { dto: payload, isAll: true });
      console.log(apiResult);
      if (apiResult.code === 1) {
        localStorage.setItem('access_token', apiResult.result.accessToken);
        history.push(routes.pageRoutes.projectIndex);
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

      });
    },
  },
};
export default UserModel;
