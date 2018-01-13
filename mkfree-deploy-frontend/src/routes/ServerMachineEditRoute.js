import React from 'react';
import {connect} from 'dva';
import {Link, browserHistory} from 'dva/router';
import {Button, Table, Row, Col, Icon, Form, Input, Switch, Select} from 'antd';
import {route} from '../Constant';
import ServerMachineFormComponent from '../components/ServerMachineFormComponent';

const Option = Select.Option;
const FormItem = Form.Item;

function ServerMachineEditRoute({dispatch, location, serverMachine, envList}) {

    return (
        <ServerMachineFormComponent dispatch={dispatch} serverMachine={serverMachine} envList={envList}/>
    );
}

ServerMachineEditRoute.propTypes = {};

function mapStateToProps(state) {
    const {serverMachine, envList} = state.serverMachineModel;
    return {serverMachine, envList};
}

export default connect(mapStateToProps)(ServerMachineEditRoute);
