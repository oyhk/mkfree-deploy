import * as projectService from '../services/projectsCreate';
import {ROUTE_PROJECTS_CREATE,ROUTE_PROJECTS_INFO} from '../constants';

export default {
  namespace: 'projectsCreate',
  state: {
    list: [],
    sList: [],
    total: null,
    pageNo: null,
  },
  reducers: {
    save(state, {payload: {data: list,data: sList, total, pageNo}}) {
      return {...state, list, sList, total, pageNo};
    },
  },
  effects: {
    *fetch({payload: {projectsId = 0}}, {call, put}) {
      const result = yield call(projectService.fetch, {projectsId});
      yield put({
        type: 'save',
        payload: {
          data: result,
        },
      });
    },
    *seaverFetch({payload: {pageNo = 0}}, {call, put}) {
      const result = yield call(projectService.seaverFetch, {pageNo});
      yield put({
        type: 'save',
        payload: {
          data: result.list,
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
      const pageNo = yield select(state => state.projects.pageNo);
      yield put({type: 'fetch', payload: {pageNo}});
    },
    *deploy({payload:values}, {call,put}){
      yield call(projectService.deploy, values);
      yield put({type: 'reload'});
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        //const projectsId = pathname.split('/')[4];
        //if (projectsId) {
        //  dispatch({
        //    type: 'fetch', payload: {
        //      projectsId
        //    }
        //  });
        //}
        if (pathname === ROUTE_PROJECTS_CREATE || pathname.indexOf(ROUTE_PROJECTS_INFO) > -1) {
          dispatch({type: 'seaverFetch', payload: query});
        }
      });
    },
  },
};
