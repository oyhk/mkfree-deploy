import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col} from 'antd';

function SignInRoute({dispatch}) {
    return (
        <div>
            登录界面
        </div>
    );
}

SignInRoute.propTypes = {};

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(SignInRoute);
