import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';
import ProjectFormComponent from '../components/ProjectFormComponent';

function ProjectAddRoute({dispatch, project, deployTargetFileList, projectEnvConfigList, branchList,serverMachineList}) {
    return <ProjectFormComponent dispatch={dispatch} project={project} deployTargetFileList={deployTargetFileList} serverMachineList={serverMachineList}
                                 projectEnvConfigList={projectEnvConfigList} isAdd branchList={branchList}/>;
}

ProjectAddRoute.propTypes = {};

function mapStateToProps(state) {
    const {project, deployTargetFileList, projectEnvConfigList,serverMachineList} = state.projectModel;
    return {project, deployTargetFileList, projectEnvConfigList,serverMachineList};
}

export default connect(mapStateToProps)(ProjectAddRoute);
