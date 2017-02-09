/**
 * Created by wangzimin on 2017/2/8.
 */
import * as usersService from '../services/users';
import { ROUTE_ADMIN_USERS_INFO } from '../constants';

export default {
  namespace: 'userInfo',
  state: {
    id: '',
    username: '',
    password: '',
    result: [],
  },
  reducers: {
    changeState(state, action) {
      const { payload } = action;
      return {...state, ...payload};
    },
  },
  effects: {
    *userSave({payload: values}, {call, put}) {
      yield call(usersService.userSave, values);
    },
    *userUpdate({payload: values}, {call, put}) {
      yield call(usersService.userUpdate, values);
    },
    *userProjectPermissionUpdate({payload: values}, {call, put}) {
      yield call(usersService.userProjectPermissionUpdate, values);
    },
    *projectPermissionList({payload: values}, {call, put}) {
      const result = yield call(usersService.projectPermissionList, values);
      yield put({
        type: 'changeState',
        payload: {
          result: result.list,
        }
      });
    },
    *projectPage({payload: values}, {call, put}) {
      const result = yield call(usersService.projectPage, values);
      yield put({
        type: 'changeState',
        payload: {
          result: result.list,
        }
      });
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname}) => {
        const userId = pathname.split('/')[4];
        if (pathname.includes(ROUTE_ADMIN_USERS_INFO) && userId !== 'create') {
          dispatch({
            type: 'projectPermissionList',
            payload: {
              userId
            }
          });
        } else {
          // dispatch({
          //   type: 'projectPage',
          //   payload: {
          //     pageNo: 0,
          //     pageSize: 100
          //   }
          // });
        }
      });
    },
  },
};
