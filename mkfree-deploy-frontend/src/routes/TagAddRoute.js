import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';
import {route} from '../Constant';
import TagFormComponent from '../components/TagFormComponent';
import styles from './ProjectRoute.less';

const Option = Select.Option;
const FormItem = Form.Item;

function TagAddRoute({dispatch, location, tag}) {
    return (
        <TagFormComponent dispatch={dispatch} title="创建" isAdd tag={tag}/>
    );
}

TagAddRoute.propTypes = {};

function mapStateToProps(state) {
    const {tag} = state.TagModel;
    return {tag};
}

export default connect(mapStateToProps)(TagAddRoute);
