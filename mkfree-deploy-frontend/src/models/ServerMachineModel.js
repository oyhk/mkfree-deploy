import * as projectService from '../services/ProjectService';
import {addKey, urlPathParams} from '../utils/Utils';
import {route} from '../Constant';
import {message, Button} from 'antd';

export default {

    namespace: 'serverMachineModel',

    state: {},

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            return history.listen((location) => {

            });
        },
    },

    effects: {},

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

};
