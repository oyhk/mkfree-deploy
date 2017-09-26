import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Icon} from 'antd';
import signInBg from '../assets/index-bg.jpg';

const FormItem = Form.Item;

function SignInRoute({dispatch, form}) {

    const {getFieldDecorator, getFieldValue} = form;

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: `url(${signInBg}) center / cover no-repeat fixed`
        }}>
            <Row justify="center" type="flex" align="middle" style={{height: '100%'}}>
                <Col xs={20} sm={10} md={8} lg={6}>
                    <div style={{backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px'}}>
                        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>mkfree-deploy</h2>
                        <Form>
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules: [{required: true, message: 'Please input your username!'}],
                                })(
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: 'Please input your Password!'}],
                                })(
                                    <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                           placeholder="Password"/>
                                )}
                            </FormItem>
                            <Button type="primary" style={{width: '100%'}}
                                    onClick={() => {
                                        const username = getFieldValue('username');
                                        const password = getFieldValue('password');

                                        if (!username || !password) {
                                            return;
                                        }
                                        dispatch({
                                            type: 'userModel/login', payload: {username, password}
                                        });
                                    }}
                            >
                                登录
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

SignInRoute.propTypes = {};

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Form.create()(SignInRoute));
