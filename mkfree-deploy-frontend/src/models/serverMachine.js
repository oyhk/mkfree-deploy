import * as projectService from '../services/serverMachine';
import {ROUTE_ServerMachine} from '../constants';

export default {
  namespace: 'serverMachine',
  state: {
    list: [],
    total: null,
    pageNo: null,
  },
  reducers: {
    save(state, {payload: {data: list, total, pageNo}}) {
      return {...state, list, total, pageNo};
    },
  },
  effects: {
    *fetch({payload: {pageNo = 1}}, {call, put}) {
      const result = yield call(projectService.fetch, {pageNo});
      yield put({
        type: 'save',
        payload: {
          data: result.list,
          total: result.totalCount,
          pageNo: result.pageNo,
        },
      });
    },
    *patch({payload: values}, {call, put}) {
      yield call(projectService.update, values);
      yield put({type: 'reload'});
    },
    *remove({payload: values}, {call, put}) {
      yield call(projectService.remove, values);
      yield put({type: 'reload'});
    },
    *create({payload: values}, {call, put}) {
      yield call(projectService.save, values);
      yield put({type: 'reload'});
    },
    *reload(action, {put, select}) {
      const pageNo = yield select(state => state.serverMachine.pageNo);
      yield put({type: 'fetch', payload: {pageNo}});
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === ROUTE_ServerMachine) {
          dispatch({type: 'fetch', payload: query});
        }
      });
    },
  },
};
