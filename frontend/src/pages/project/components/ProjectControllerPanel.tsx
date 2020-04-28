import React, { ReactChildren } from 'react';
import { Layout, Menu, Modal, Row, Col, Space, Button } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  BranchesOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  MailOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ProjectModelState } from '@/models/ProjectModel';
import { Dispatch } from '@@/plugin-dva/connect';
import SubMenu from 'antd/es/menu/SubMenu';
import { AppstoreOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons/lib';
import { PageLoading } from '@ant-design/pro-layout';
import { uuid } from '@/utils/utils';

const { Sider, Content } = Layout;

export interface ProjectModalProps {
  projectState?: ProjectModelState;
  dispatch?: Dispatch;
  children?: ReactChildren;
}


const ProjectLogControllerPanel: React.FC<ProjectModalProps> = ({ projectState, dispatch }) => {
  if (!projectState || !dispatch) {
    return <PageLoading/>;
  }
  const projectEnvListMenu = projectState.logModal?.projectEnvList?.map((projectEnv, projectEnvIndex) => {
    return <SubMenu key={projectEnvIndex} title={<span><span>{projectEnv.envName}</span></span>}>
      {projectEnv.projectEnvLogList?.map((projectEnvLog, projectEnvLogIndex) => {
        return <Menu.Item
          key={`${projectEnv.projectId}_${projectEnv.envId}_${projectEnvLog.projectEnvLogSeq}`}>
          {projectEnvLog.isFinish ? '' : <LoadingOutlined/>} #{projectEnvLog.projectEnvLogSeq}
        </Menu.Item>;
      })}
    </SubMenu>;
  });
  return (
    <Modal
      title={
        <Row>
          <Col sm={4}>项目：{projectState?.logModal?.projectName}</Col>
          <Col sm={20} style={{ fontSize: '14px', textAlign: 'right', paddingRight: '30px' }}>
            <Space size='large'>
              <div><span style={{ fontSize: '12px', color: 'rgba(0,0,0,.65)' }}>日志类型：</span><span style={{
                fontSize: '12px',
                color: 'rgba(0,0,0,.65)',
              }}>{projectState?.logModal?.projectEnvLog?.typeDesc}</span></div>
              <div><span style={{ fontSize: '12px', color: 'rgba(0,0,0,.65)' }}>时间：</span><span style={{
                fontSize: '12px',
                color: 'rgba(0,0,0,.65)',
              }}>{projectState?.logModal?.projectEnvLog?.createdAt}</span></div>
              {/*              <div>
                <Button loading type='primary' icon={<ReloadOutlined />}>刷新</Button>
              </div>*/}
            </Space>
          </Col>
        </Row>
      }
      style={{ top: '5vh', maxHeight: '90vh', overflow: 'scroll' }}
      width='80%'
      visible={projectState?.logModal?.visible}
      onCancel={() => {
        if (dispatch) {
          dispatch({
            type: 'project/logModalVisibleChange',
            payload: {
              logModalVisible: false,
            },
          });
        }
      }}
      footer={null}
    >
      <Layout>
        <Sider theme='light' width='20%'
               style={{
                 overflow: 'auto',
                 height: '75vh',
               }}
        >
          <Menu
            defaultOpenKeys={['']}
            mode="inline"
            theme='light'
            onClick={({ item, key, keyPath, domEvent }) => {
              const tempKey = key.split('_');
              const projectId = tempKey[0];
              const envId = tempKey[1];
              const projectEnvLogSeq = tempKey[2];

              dispatch({
                type: 'project/logModalProjectEnvLogText',
                payload: {
                  projectId,
                  envId,
                  projectEnvLogSeq,
                },
              });

            }}
          >
            {projectEnvListMenu}
          </Menu>
        </Sider>
        <Content
          style={{
            overflow: 'auto',
            height: '75vh',
          }}
        >
          <div style={{ wordWrap: 'break-word', padding: '20px 20px 10px 20px' }}
               dangerouslySetInnerHTML={{ __html: projectState?.logModal?.projectEnvLog?.text }}/>
          {
            projectState?.logModal?.projectEnvLog?.isFinish === false
              ? <div style={{ padding: '0px 20px 10px 20px' }}>
                <LoadingOutlined style={{ fontSize: '20px' }}/>
              </div>
              : ''

          }
        </Content>
      </Layout>
    </Modal>
  );
};

export default ProjectLogControllerPanel;
