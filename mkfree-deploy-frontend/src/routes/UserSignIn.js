import React, {Component, PropTypes} from 'react';
import {Button, Row, Col} from 'antd';
import {connect} from 'dva';
import {Link} from 'dva/router';
import LoginForm from '../components/LoginForm';

import styles from './IndexPage.css';

function UserSignIn() {
    return (
        <div>
            <Row type="flex" justify="center" align="middle">
                <Col xs={20} sm={8} md={8} lg={8}>
                    <LoginForm />
                </Col>
            </Row>

        </div>
    );
}

UserSignIn.propTypes = {};

export default connect()(UserSignIn);
