import * as usersService from "../services/users";
import {
    ROUTE_USERS,
    ROUTE_USERS_SIGN_IN,
    ROUTE_USERS_INFO,
    ROUTE_USERS_CREATE,
    ROUTE_PROJECTS,
    COOKIE_OPTIONS
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
            const {payload} = action;
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
            const result = yield call(usersService.userLogin, values);
            callBack(result);
        },
        *loginUserToken({payload, callBack}, {call, put}) {
            const {code}=yield call(usersService.loginUserToken, payload);
            if (code == 1) {
                browserHistory.push(ROUTE_PROJECTS)
            } else {
                cookie.remove('user_token', COOKIE_OPTIONS);
                cookie.remove('username', COOKIE_OPTIONS);
            }
        },
        *userSave({payload: values, callBack}, {call, put}) {
            const result = yield call(usersService.userSave, values);
            callBack(result);
        },
        *userUpdate({payload: values, callBack}, {call, put}) {
            const result = yield call(usersService.userUpdate, values);
            callBack(result);
        },
        *userDelete({payload: values, callBack}, {call, put}) {
            const result = yield call(usersService.userDelete, values);
            callBack(result);
        },
        *userInfo({payload: values, callBack}, {call, put}) {
            const result = yield call(usersService.userInfo, values);
            yield put({
                type: 'changeState',
                payload: {
                    result: result,
                    username: result.username,
                    password: result.password,
                    listData: result.userProjectPermissionList,
                },
            });
            callBack(result);

        },
        *projectPage({payload: values}, {call, put, select}) {
            const result = yield call(usersService.projectPage, values);
            let listDataProject = [];

            if (result.list.length > 0) {
                result.list.map((dt) => {
                    listDataProject.push({
                        projectId: dt.id,
                        projectName: dt.name,
                        projectEnv: [],
                    });
                });
            }

            const listData = yield select(state => state.users.listData);
            if (listData && listData.length > 0) {
                listDataProject.map((dt1, index1)=> {
                    listData.map((dt2)=> {
                        dt2.projectId === dt1.projectId ? listDataProject[index1].projectEnv = dt2.projectEnv : [];
                    });
                });
            }

            yield put({
                type: 'changeState',
                payload: {
                    result,
                    listDataProject,
                }
            });
        },
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                const userToken = cookie.load('user_token');
                if (pathname === ROUTE_USERS) {
                    dispatch({
                        type: 'fetch',
                        payload: query
                    });
                } else if (pathname.includes(ROUTE_USERS_INFO)) {
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
                        },
                        callBack: ()=> {
                            dispatch({
                                type: 'projectPage',
                                payload: {
                                    pageSize: 100,
                                }
                            });
                        }
                    });
                } else if (pathname === ROUTE_USERS_CREATE) {
                    dispatch({
                        type: 'changeState',
                        payload: {
                            listData: [],
                        }
                    });
                    dispatch({
                        type: 'projectPage',
                        payload: {
                            pageSize: 100,
                        }
                    });
                }
                if (pathname === ROUTE_USERS_SIGN_IN && userToken) {
                    dispatch({type: 'loginUserToken', payload: {userToken}});
                }
            });
        },
    },
};
