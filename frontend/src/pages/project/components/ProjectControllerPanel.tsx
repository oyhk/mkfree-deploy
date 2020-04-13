import React, { ReactChildren } from 'react';
import { Layout, Menu, Modal, Row } from 'antd';
import { useIntl } from 'umi';
import {
  ArrowLeftOutlined,
  EditOutlined,
  BranchesOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { ProjectModelState } from '@/models/ProjectModel';
import { Dispatch } from '@@/plugin-dva/connect';

const { Sider, Content } = Layout;

export interface ProjectModalProps {
  projectState?: ProjectModelState;
  dispatch?: Dispatch;
  children: ReactChildren;
}

const ProjectInfoControllerPanel: React.FC<ProjectModalProps> = ({ projectState, dispatch }) => {
  return (
    <Modal
      title={useIntl().formatMessage({ id: 'project.logModal.title' })}
      style={{ top: '1vh', maxHeight: '99vh', overflow: 'scroll' }}
      width="98%"
      visible={projectState?.logModalVisible}
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
        <Sider
          theme="light"
          width="20%"
          style={{
            overflow: 'auto',
            height: '89vh',
          }}
        >
          <Row style={{ height: '30vh' }}>
            <Menu theme="light" mode="inline" defaultSelectedKeys={['2']}>
              <Menu.Item key="1">
                <ArrowLeftOutlined />
                <span className="nav-text">返回面板</span>
              </Menu.Item>
              <Menu.Item key="2">
                <InfoCircleOutlined />
                <span className="nav-text">信息</span>
              </Menu.Item>
              <Menu.Item key="3">
                <EditOutlined />
                <span className="nav-text">编辑</span>
              </Menu.Item>
              <Menu.Item key="4">
                <BranchesOutlined />
                <span className="nav-text">分支</span>
              </Menu.Item>
              <Menu.Item key="5">
                <FolderOpenOutlined />
                <span className="nav-text">工作空间</span>
              </Menu.Item>
            </Menu>
          </Row>
          <Row style={{ height: '59vh', background: '#235234' }}>sdfsdfsdfsfsf</Row>
        </Sider>
        <Content
          style={{
            overflow: 'auto',
            height: '89vh',
          }}
        >
          {}
        </Content>
      </Layout>
    </Modal>
  );
};

export default ProjectInfoControllerPanel;
