import React from 'react';
import {connect} from 'dva';
import {Table, Pagination, Popconfirm, Button} from 'antd';
import {Link, browserHistory, routerRedux} from 'dva/router';
import styles from './Projects.css';

import {
    PAGE_SIZE,
    ROUTE_PROJECTS,
    ROUTE_PROJECTS_CREATE,
    ROUTE_PROJECTS_INFO,
    ENV_DEV,
    ENV_TEST,
    ENV_UAT,
    ENV_PROD
} from '../constants';
import ProjectModal from '../components/Projects/ProjectModal';


function StructureLogs({dispatch}) {


    function websocket() {
        var socket = new SockJS('/websocket/init');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/log/log1', function (greeting) {
                console.log(JSON.parse(greeting.body).content);
            });
        });
    }

    return (

        <div className={styles.normal}>
            <button onClick={websocket}>
                websocket
            </button>
        </div>
    );
}

export default connect()(StructureLogs);
