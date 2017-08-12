import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';
import ProjectFormComponent from '../components/ProjectFormComponent';

function ProjectEditRoute({dispatch, project, deployTargetFileList, projectEnvConfigList,branchList}) {
    return (
        <ProjectFormComponent dispatch={dispatch} project={project} deployTargetFileList={deployTargetFileList}
                              projectEnvConfigList={projectEnvConfigList} isAdd={false} branchList={branchList}/>
    );
}

ProjectEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {project, branchList,deployTargetFileList, projectEnvConfigList} = state.projectModel;
    return {project,branchList, deployTargetFileList, projectEnvConfigList};
}

export default connect(mapStateToProps)(ProjectEditRoute);
