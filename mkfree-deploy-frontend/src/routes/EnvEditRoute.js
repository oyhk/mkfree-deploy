import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';
import {route} from '../Constant';
import EnvFormComponent from '../components/EnvFormComponent';
import styles from './ProjectRoute.less';

const Option = Select.Option;
const FormItem = Form.Item;

function EnvEditRoute({dispatch, location, form, env}) {

    return (
        <EnvFormComponent dispatch={dispatch} title="编辑" env={env} isAdd={false}/>
    );
}

EnvEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {env} = state.EnvModel;
    return {env};
}

export default connect(mapStateToProps)(EnvEditRoute);
