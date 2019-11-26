import React from 'react';
import {connect} from 'dva';
import {addKey, urlPathParams} from '../utils/Utils';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Input} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';
import cookie from 'react-cookie';

const {TextArea} = Input;


function ProjectBuildLogRoute({dispatch, location, buildLogDescription, project}) {

    if (project.id) {
        const username = cookie.load('username');
        const domain = localStorage.getItem('domain');
        const textArea = document.getElementById('build_log');
        // 首先设置初始化值
        if (buildLogDescription) {
            textArea.value = buildLogDescription;
        }


        const ws = new WebSocket(`ws://${domain}:9998/api/websocket?username=${username}&type=buildLog&projectId=${project.id}&timestamp=${new Date().getTime()}`);

        ws.onopen = () => {
        };
        ws.onmessage = (evt) => {
            textArea.value += evt.data;
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
    const {historyBuildLogList, project, buildLogDescription} = state.ProjectInfoModel;
    return {historyBuildLogList, project, buildLogDescription};
}

export default connect(mapStateToProps)(ProjectBuildLogRoute);
