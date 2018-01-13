import React from 'react';
import {connect} from 'dva';
import {addKey, urlPathParams} from '../utils/Utils';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';


function ProjectBuildLogRoute({dispatch, location, buildLog}) {

    return (
        <div dangerouslySetInnerHTML={{__html: buildLog}}/>
    );
}

ProjectBuildLogRoute.propTypes = {};

function mapStateToProps(state) {
    const {buildLog} = state.projectModel;
    return {buildLog};
}

export default connect(mapStateToProps)(ProjectBuildLogRoute);
