import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Switch} from 'antd';
import ProjectFormComponent from '../components/ProjectFormComponent';


const FormItem = Form.Item;


const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 19},
};

function ProjectAddRoute({dispatch, project, deployTargetFileList, projectEnvConfigList, form}) {
    const {getFieldDecorator, getFieldValue} = form;

    function save() {


        const newProject = {
            name: getFieldValue('name'),
            gitUrl: getFieldValue('gitUrl'),
            remotePath: getFieldValue('remotePath'),
            moduleName: getFieldValue('moduleName'),
        };

        const newDeployTargetFileList = [];
        deployTargetFileList.forEach((item, index) => {
            newDeployTargetFileList.push({
                localFilePath: getFieldValue(`localFilePath${index}`),
                remotePath: getFieldValue(`remoteFilePath${index}`),
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
            type: 'projectModel/saved',
            payload: {
                ...newProject,
                deployTargetFileList: newDeployTargetFileList,
                projectEnvConfigList: newProjectEnvConfigList
            }
        });
    }


    return (
        <div>
            <ProjectFormComponent dispatch={dispatch} getFieldDecorator={getFieldDecorator} project={project} deployTargetFileList={deployTargetFileList} projectEnvConfigList={projectEnvConfigList} />
            <FormItem style={{marginTop: '20px'}} wrapperCol={{span: 1, offset: 23}}>
                <Button type="primary" onClick={save}>提交</Button>
            </FormItem>
        </div>
    );
}

ProjectAddRoute.propTypes = {};

function mapStateToProps(state) {
    const {project, deployTargetFileList, projectEnvConfigList} = state.projectModel;
    return {project, deployTargetFileList, projectEnvConfigList};
}

export default Form.create()(connect(mapStateToProps)(ProjectAddRoute));
