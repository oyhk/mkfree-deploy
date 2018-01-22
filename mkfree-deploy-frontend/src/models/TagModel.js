import * as tagService from '../services/TagService';
import cookie from 'react-cookie';
import {browserHistory} from 'dva/router';
import {route, models} from '../Constant';
import {addKey, urlPathParams} from '../utils/Utils';

export default {

    namespace: models.tag,

    state: {
        tag: {},
        pageResult: {},
    },
    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {
                if (location.pathname === route.tag.url) {
                    dispatch({type: 'page', payload: {...location.query}});
                    return;
                }
                const edit = urlPathParams(route.tagEdit.url, location.pathname);
                // 编辑页
                if (edit) {
                    const id = edit[1];
                    dispatch({type: 'info', payload: {id}});
                    return;
                }
                if (location.pathname === route.tagAdd.url) {
                    dispatch({type: 'save', payload: {env: {}}});
                }
            });
        },
    },
    effects: {

        *info({payload}, {call, put, select}){
            const tag = yield call(tagService.info, payload);
            yield put({
                type: 'save',
                payload: {
                    tag
                }
            });
        },
        *saved({payload}, {call, put, select}){
            const result = yield call(tagService.save, payload, {desc: '环境添加成功'});
            if (result.code === '1') {
                browserHistory.goBack();
            }
        },
        *update({payload}, {call, put, select}){
            const result = yield call(tagService.update, payload, {desc: '环境修改成功'});
            if (result.code === '1') {
                browserHistory.goBack();
            }
        },
        *enable({payload}, {call, put, select}){
            yield call(tagService.enable, payload, {desc: '环境修改成功'});
            yield put({
                type: 'page',
                payload: {
                    ...payload.location.query
                }
            });
        },
        *page({payload}, {call, put, select}) {
            const pageResult = yield call(tagService.page, payload);
            addKey(pageResult.list);
            yield put({
                type: 'save',
                payload: {
                    pageResult
                }
            });
        },
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },
};
