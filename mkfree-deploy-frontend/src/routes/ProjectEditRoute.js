import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';
import ProjectFormComponent from '../components/ProjectFormComponent';

function ProjectEditRoute({dispatch, project, deployTargetFileList, projectEnvConfigList, serverMachineList}) {
    return (
        <ProjectFormComponent dispatch={dispatch} project={project} deployTargetFileList={deployTargetFileList}
                              serverMachineList={serverMachineList}
                              projectEnvConfigList={projectEnvConfigList} isAdd={false}/>
    );
}

ProjectEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {project, deployTargetFileList, projectEnvConfigList, serverMachineList} = state.projectModel;
    return {project, deployTargetFileList, projectEnvConfigList,serverMachineList};
}

export default connect(mapStateToProps)(ProjectEditRoute);
