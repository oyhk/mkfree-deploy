import React from 'react';
import {connect} from 'dva';
import {addKey, urlPathParams} from '../utils/Utils';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Input} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';
import cookie from 'react-cookie';

const {TextArea} = Input;


function ProjectBuildLogRoute({dispatch, location, buildLog, project}) {

    if (project.id) {
        const username = cookie.load('username');
        const domain = localStorage.getItem('domain');

        const ws = new WebSocket(`ws://${domain}:8091/api/websocket?username=${username}&type=buildLog&projectId=${project.id}`);
        ws.onopen = () => {
        };
        ws.onmessage = (evt) => {
            document.getElementById('build_log').value += evt.data;
        };
    }
    const pageTitle = document.title;
    if (pageTitle !== `${project.name} 构建日志`) {
        document.title = `${project.name} 构建日志`;
    }
    return (
        <div style={{height: '100%'}}>
            <h3 style={{paddingBottom: '10px'}}>{project.name} 构建日志</h3>
            <TextArea id="build_log" readOnly style={{overflowY: 'scroll', height: 'inherit'}}/>
        </div>
    );
}

ProjectBuildLogRoute.propTypes = {};

function mapStateToProps(state) {
    const {historyBuildLogList, project} = state.ProjectInfoModel;
    return {historyBuildLogList, project};
}

export default connect(mapStateToProps)(ProjectBuildLogRoute);
