import * as projectService from '../services/ProjectService';
import {addKey} from '../utils/TableUtils';

export default {

    namespace: 'projectModel',

    state: {
        pageResult: {},
    },

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            dispatch({type: 'page', payload: {}});
        },
    },

    effects: {
        *fetch({payload}, {call, put}) {  // eslint-disable-line
            yield put({type: 'save'});
        },

        *page({payload}, {call, put}) {
            const result = yield call(projectService.page);

            addKey(result.list);

            yield put({
                type: 'save',
                payload: {
                    pageResult: result
                }
            });
        },
        *structure({payload}, {call, put, select}) {
            const result = yield call(projectService.structure, payload);
        }
    },

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

};
