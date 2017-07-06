import * as projectService from '../services/ProjectService';
import {addKey} from '../utils/Utils';

export default {

    namespace: 'userModel',

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
    },

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

};
