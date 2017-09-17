import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';
import ProjectFormComponent from '../components/ProjectFormComponent';

function ProjectEditRoute({dispatch, project, deployTargetFileList, projectEnvConfigList}) {
    return (
        <ProjectFormComponent dispatch={dispatch} project={project} deployTargetFileList={deployTargetFileList}
                              projectEnvConfigList={projectEnvConfigList} isAdd={false}/>
    );
}

ProjectEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {project,deployTargetFileList, projectEnvConfigList} = state.projectModel;
    return {project, deployTargetFileList, projectEnvConfigList};
}

export default connect(mapStateToProps)(ProjectEditRoute);
