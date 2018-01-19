import React from 'react';
import {connect} from 'dva';
import {addKey, urlPathParams} from '../utils/Utils';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';


function ProjectBuildLogRoute({dispatch, location, buildLog, project}) {
    const pageTitle = document.title;
    if (pageTitle !== `${project.name} 构建日志`) {
        document.title = `${project.name} 构建日志`;
    }
    return (
        <div>
            <h3>{project.name} 构建日志</h3>
            <div dangerouslySetInnerHTML={{__html: buildLog}}/>
        </div>
    );
}

ProjectBuildLogRoute.propTypes = {};

function mapStateToProps(state) {
    const {buildLog, project} = state.projectModel;
    return {buildLog, project};
}

export default connect(mapStateToProps)(ProjectBuildLogRoute);
