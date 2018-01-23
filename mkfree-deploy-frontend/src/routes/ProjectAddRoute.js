import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';
import ProjectFormComponent from '../components/ProjectFormComponent';

function ProjectAddRoute({dispatch, project, deployTargetFileList, projectEnvConfigList, branchList, serverMachineList, tagList}) {
    return <ProjectFormComponent dispatch={dispatch} project={project} deployTargetFileList={deployTargetFileList}
                                 serverMachineList={serverMachineList} tagList={tagList}
                                 projectEnvConfigList={projectEnvConfigList} isAdd branchList={branchList}/>;
}

ProjectAddRoute.propTypes = {};

function mapStateToProps(state) {
    const {project, deployTargetFileList, projectEnvConfigList, serverMachineList, tagList} = state.projectModel;
    return {project, deployTargetFileList, projectEnvConfigList, serverMachineList, tagList};
}

export default connect(mapStateToProps)(ProjectAddRoute);
