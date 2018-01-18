import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Menu, Dropdown, Icon, Popconfirm, Badge, Tag, Checkbox} from 'antd';
import {route} from '../Constant';
import {addKey, urlPathParams} from '../utils/Utils';
import styles from './ProjectRoute.less';

const CheckboxGroup = Checkbox.Group;

function UserProjectPermissionRoute({dispatch, location, projectPageResult, projectEnvList}) {


    const userProjectPermission = urlPathParams(route.userProjectPermission.url, location.pathname);
    let userId;
    // 编辑页
    if (userProjectPermission) {
        userId = userProjectPermission[1];
    }

    const columns = [{
        title: '项目id',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '项目环境',
        dataIndex: 'projectEnvConfig',
        key: 'projectEnvConfig',
        render: (value, record, columnIndex) => {
            const envList = [];
            projectEnvList.forEach((item) => {
                envList.push({label: item.name, value: item.id});
            });

            return <CheckboxGroup options={envList}
                                  defaultValue={record && record.envIdList ? record.envIdList : []}
                                  onChange={(checkedValue) => {
                                      dispatch({
                                          type: 'UserProjectPermissionModel/projectAssign',
                                          payload: {
                                              userId,
                                              projectId: record.id,
                                              envIdList: checkedValue
                                          }
                                      });
                                  }}
            />;


        }
    }];
    return (
        <Table dataSource={projectPageResult.list}
               columns={columns}
               pagination={{
                   defaultPageSize: 50,
                   current: projectPageResult.pageNo + 1,
                   defaultCurrent: projectPageResult.pageNo + 1,
                   total: projectPageResult.totalCount,
                   onChange: (page, pageSize) => {
                       browserHistory.push(`${location.pathname}?pageNo=${page}&pageSize=${pageSize}`);
                   }
               }}/>
    );
}

UserProjectPermissionRoute.propTypes = {};

function mapStateToProps(state) {
    const {projectPageResult, projectEnvList} = state.UserProjectPermissionModel;
    return {projectPageResult, projectEnvList};
}

export default connect(mapStateToProps)(UserProjectPermissionRoute);
