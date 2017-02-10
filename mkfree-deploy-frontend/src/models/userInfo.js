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
    result: {},
    listData: [],
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
    *userInfo({payload: values}, {call, put}) {
      const result = yield call(usersService.userInfo, values);
      yield put({
        type: 'changeState',
        payload: {
          result: result,
          username: result.data.username,
          password: result.data.password,
        }
      });
    },
    *projectPage({payload: values}, {call, put}) {
      const result = yield call(usersService.projectPage, values);
      let listData = [];

      if (result.list.length > 0) {
        result.list.map((dt)=> {
          listData.push({
            projectId: dt.id,
            projectName: dt.name,
            projectEnv: [],
          })
        });
      }

      yield put({
        type: 'changeState',
        payload: {
          result,
          listData,
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
            type: 'userInfo',
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
