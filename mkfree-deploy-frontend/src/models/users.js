import * as usersService from '../services/users';
import {ROUTE_ADMIN_USERS} from '../constants';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    pageNo: null,
    //用户信息的元素
    id: '',
    username: '',
    password: '',
    visible: false,
  },
  reducers: {
    save(state, {payload: {data: list, total, pageNo}}) {
      return {...state, list, total, pageNo};
    },
    changeState(state, action) {
      const {payload}=action
      return {...state, ...payload};
    },
  },
  effects: {
    *fetch({payload: {pageNo = 1}}, {call, put}) {
      const result = yield call(usersService.fetch, {pageNo});
      yield put({
        type: 'save',
        payload: {
          data: result.list,
          total: result.totalCount,
          pageNo: result.pageNo,
        },
      });
    },
    *reload(action, {put, select}) {
      const pageNo = yield select(state => state.users.pageNo);
      yield put({type: 'fetch', payload: {pageNo}});
    },
    *remove({payload: id}, {call, put}) {
      yield call(usersService.remove, id);
      yield put({type: 'reload'});
    },
    *patch({payload: {id, values}}, {call, put}) {
      yield call(usersService.patch, id, values);
      yield put({type: 'reload'});
    },
    *create({payload: values}, {call, put}) {
      yield call(usersService.create, values);
      yield put({type: 'reload'});
    },
    *userSave({payload: values}, {call, put}) {
      yield call(usersService.userSave, values);
      yield put({type: 'reload'});
    },
    *userUpdate({payload: values}, {call, put}) {
      yield call(usersService.userUpdate, values);
      yield put({type: 'reload'});
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === ROUTE_ADMIN_USERS) {
          dispatch({type: 'fetch', payload: query});
        }
      });
    },
  },
};
