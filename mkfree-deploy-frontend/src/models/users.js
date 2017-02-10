import * as usersService from "../services/users";
import {
  ROUTE_ADMIN_USERS,
  ROUTE_USERS,
  ROUTE_ADMIN_USERS_INFO,
  ROUTE_ADMIN_USERS_CREATE,
  ROUTE_PROJECTS
} from "../constants";
import cookie from "react-cookie";
import {browserHistory} from "dva/router";


export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    pageNo: null,
    //用户信息的元素
    id: '',
    username: '',
    loading: false,
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
    *userLogin({payload: values, callBack}, {call, put}) {
      const result=yield call(usersService.userLogin, values);
      callBack(result)
    },
    *loginUserToken({payload, callBack}, {call, put}) {
      const {code}=yield call(usersService.loginUserToken, payload);
      if (code == 1) {
        browserHistory.push(ROUTE_PROJECTS)
      }
    },
    *userUpdate({payload: values}, {call, put}) {
      yield call(usersService.userUpdate, values);
      yield put({type: 'reload'});
    },
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
          username: result.username,
          password: result.password,
          listData: result.userProjectPermissionList,
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
      return history.listen(({pathname, query}) => {
        if (pathname === ROUTE_ADMIN_USERS) {
          dispatch({
            type: 'fetch',
            payload: query
          });
        } else if (pathname.includes(ROUTE_ADMIN_USERS_INFO)) {
          dispatch({
            type: 'changeState',
            payload: {
              listData: [],
            }
          });
          const id = pathname.split('/')[4];
          dispatch({
            type: 'userInfo',
            payload: {
              id
            }
          });
        } else if (pathname === ROUTE_ADMIN_USERS_CREATE) {
          dispatch({
            type: 'changeState',
            payload: {
              listData: [],
            }
          });
          dispatch({
            type: 'projectPage',
          });
        }
        if(pathname ===ROUTE_USERS){
          dispatch({type: 'loginUserToken', payload: {userToken: cookie.load('user_token')}});
        }
      });
    },
  },
};
