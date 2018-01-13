import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';
import {route} from '../Constant';
import EnvFormComponent from '../components/EnvFormComponen';
import styles from './ProjectRoute.less';

const Option = Select.Option;
const FormItem = Form.Item;

function EnvEditRoute({dispatch, location, env}) {

    return (
        <EnvFormComponent dispatch={dispatch} title="创建" isAdd env={env}/>
    );
}

EnvEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {env} = state.envModel;
    return {env};
}

export default connect(mapStateToProps)(EnvEditRoute);
