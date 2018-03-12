import React from 'react';
import {connect} from 'dva';
import {addKey, urlPathParams} from '../utils/Utils';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Input} from 'antd';
import {route} from '../Constant';
import styles from './ProjectRoute.less';
import cookie from 'react-cookie';

const {TextArea} = Input;


function ProjectBuildLogHistoryRoute({dispatch, location, buildLog, project}) {

    const pageTitle = document.title;
    if (pageTitle !== `${project.name} 历史日志`) {
        document.title = `${project.name} 历史日志`;
    }
    return (
        <div style={{height: '100%'}}>
            <Row type="flex" style={{paddingBottom: '10px'}}>
                <Col span={6}>
                    <h3>{project.name} 历史日志</h3>
                </Col>
                <Col span={3} style={{textAlign: 'right'}}>
                    <span>同步类型：{buildLog.buildTypeText}</span>
                </Col>
                <Col span={5} style={{textAlign: 'right'}}>
                    <span>服务器：{buildLog.serverMachineName}</span>
                </Col>
                <Col span={6} style={{textAlign: 'right'}}>
                    <span>版本：{buildLog.buildVersion}</span>
                </Col>
                <Col span={4} style={{textAlign: 'right'}}>
                    <span>构建时间：{buildLog.createdAt}</span>
                </Col>
            </Row>
            <TextArea readOnly value={buildLog.description} style={{overflowY: 'scroll', height: 'inherit'}}/>
        </div>
    );
}

ProjectBuildLogHistoryRoute.propTypes = {};

function mapStateToProps(state) {
    const {project, buildLog} = state.ProjectInfoModel;
    return {project, buildLog};
}

export default connect(mapStateToProps)(ProjectBuildLogHistoryRoute);
