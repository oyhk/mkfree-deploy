import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';
import ProjectFormComponent from '../components/ProjectFormComponent';
const FormItem = Form.Item;


function ProjectEditRoute({dispatch, project, deployTargetFileList, projectEnvConfigList, form}) {
    const {getFieldDecorator, getFieldValue} = form;

    function update() {
        const newProject = {
            id: project.id,
            name: getFieldValue('name'),
            gitUrl: getFieldValue('gitUrl'),
            remotePath: getFieldValue('remotePath'),
            moduleName: getFieldValue('moduleName'),
        };

        const newDeployTargetFileList = [];
        deployTargetFileList.forEach((item, index) => {
            newDeployTargetFileList.push({
                localFilePath: getFieldValue(`localFilePath${index}`),
                remoteFilePath: getFieldValue(`remoteFilePath${index}`),
                isEnable: getFieldValue(`isEnable${index}`) ? 'YES' : 'NO'
            });
        });

        const newProjectEnvConfigList = [];
        projectEnvConfigList.forEach((item, index) => {

            newProjectEnvConfigList.push({
                env: item.env,
                publicBranch: getFieldValue(`publicBranch${index}`),
                serverMachineIpList: `${getFieldValue(`serverMachineIpList${index}`)}`.split(','),
                structureBeforeList: `${getFieldValue(`structureBeforeList${index}`)}`.split(';'),
                structureAfterList: `${getFieldValue(`structureAfterList${index}`)}`.split(';'),
            });
        });

        dispatch({
            type: 'projectModel/update',
            payload: {
                ...newProject,
                deployTargetFileList: newDeployTargetFileList,
                projectEnvConfigList: newProjectEnvConfigList
            }
        });
    }


    return (
        <div>
            <ProjectFormComponent dispatch={dispatch} getFieldDecorator={getFieldDecorator} project={project}
                                  deployTargetFileList={deployTargetFileList}
                                  projectEnvConfigList={projectEnvConfigList}/>
            <FormItem style={{marginTop: '20px'}} wrapperCol={{span: 1, offset: 23}}>
                <Button type="primary" onClick={update}>提交</Button>
            </FormItem>
        </div>
    );
}

ProjectEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {project, deployTargetFileList, projectEnvConfigList} = state.projectModel;
    return {project, deployTargetFileList, projectEnvConfigList};
}

export default Form.create()(connect(mapStateToProps)(ProjectEditRoute));
