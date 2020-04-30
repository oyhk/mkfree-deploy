import { Effect, Reducer, Subscription } from '@@/plugin-dva/connect';
import * as userService from '@/services/UserService';
import { history, useSelector } from 'umi';
import routes from '@/routes';

/**
 * 用户ModelState
 */
export interface UserModelState {
  loading: boolean;
}


interface UserModelType {
  namespace: string;
  state: UserModelState;
  effects: {
    login: Effect,
    logout: Effect,
  };
  reducers: {
    save: Reducer<UserModelState>;
  };
  subscriptions: { setup: Subscription };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    loading: false,
  },
  effects: {
    * login({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      const apiResult = yield call(userService.login, { payload: payload, isAll: true });
      if (apiResult.code === 1) {
        localStorage.setItem('access_token', apiResult.result.accessToken);
        localStorage.setItem('username', apiResult.result.username);
        history.push(routes.pageRoutes.projectIndex);
      } else {
        yield put({
          type: 'save',
          payload: {
            loading: false,
          },
        });
      }
    },
    * logout({ payload }, { call, put }) {
      localStorage.removeItem('access_token');
      history.replace(routes.pageRoutes.userLogin);
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
        if (pathname === routes.pageRoutes.userLogin) {
          dispatch({
            type: 'save',
            payload: {
              loading: false,
            },
          });
          return;
        }
      });
    },
  },
};
export default UserModel;
