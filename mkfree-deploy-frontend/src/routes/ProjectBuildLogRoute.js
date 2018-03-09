import React from 'react';
import {connect} from 'dva';
import {addKey, urlPathParams} from '../utils/Utils';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';
import cookie from 'react-cookie';


function ProjectBuildLogRoute({dispatch, location, buildLog, project}) {

    if (project.id) {
        const username = cookie.load('username');

        const ws = new WebSocket(`ws://localhost:8091/api/websocket?username=${username}&type=buildLog&projectId=${project.id}`);
        ws.onopen = () => {
        };
        ws.onmessage = (evt) => {
            document.getElementById('build_log').innerHTML += evt.data;
        };
    }
    const pageTitle = document.title;
    if (pageTitle !== `${project.name} 构建日志`) {
        document.title = `${project.name} 构建日志`;
    }
    return (
        <div>
            <h3>{project.name} 构建日志</h3>
            <div id="build_log" dangerouslySetInnerHTML={{__html: buildLog}}/>
        </div>
    );
}

ProjectBuildLogRoute.propTypes = {};

function mapStateToProps(state) {
    const {buildLog, project} = state.projectModel;
    return {buildLog, project};
}

export default connect(mapStateToProps)(ProjectBuildLogRoute);
