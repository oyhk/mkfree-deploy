import React from 'react';
import {connect} from 'dva';
import {Button, Table, Row, Col, Form, Input, Icon} from 'antd';
import signInBg from '../assets/index-bg.jpg';

const FormItem = Form.Item;

function InstallRoute({dispatch, form}) {

    const {getFieldDecorator, getFieldValue, validateFields} = form;

    function login() {
        const projectPath = getFieldValue('projectPath');
        const buildPath = getFieldValue('buildPath');
        const username = getFieldValue('username');
        const password = getFieldValue('password');
        const domain = getFieldValue('domain');

        if (!username || !password || !projectPath || !buildPath || !domain) {
            validateFields();
            return;
        }
        dispatch({
            type: 'installModel/install', payload: {username, password, projectPath, buildPath, domain}
        });
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: `url(${require('../assets/index-bg.jpg')}) center / cover no-repeat fixed`
        }}>
            <Row justify="center" type="flex" align="middle" style={{height: '100%'}}>
                <Col xs={20} sm={10} md={8} lg={6}>
                    <div style={{backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px'}}>
                        <h1 style={{textAlign: 'center', marginBottom: '30px'}}>mkfree-deploy 欢迎您！</h1>
                        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>系统安装</h2>
                        <Form>
                            <h4 style={{marginBottom: '10px'}}>基本信息：</h4>
                            <FormItem>
                                {getFieldDecorator('projectPath', {
                                    rules: [{required: true, message: 'Please input projectPath!'}],
                                })(
                                    <Input prefix={<Icon type="tool" style={{fontSize: 13}}/>}
                                           placeholder="项目路径，用于存放git clone项目文件"
                                           onPressEnter={login}/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('buildPath', {
                                    rules: [{required: true, message: 'Please input buildPath!'}],
                                })(
                                    <Input prefix={<Icon type="tool" style={{fontSize: 13}}/>}
                                           placeholder="构建路径，用于存放项目构建后文件"
                                           onPressEnter={login}/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('domain', {
                                    rules: [{required: true, message: 'Please input domain!'}],
                                })(
                                    <Input prefix={<Icon type="tool" style={{fontSize: 13}}/>}
                                           placeholder="安装域名或者ip"
                                           onPressEnter={login}/>
                                )}
                            </FormItem>
                            <h4 style={{marginBottom: '10px'}}>超级管理员信息：</h4>
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules: [{required: true, message: 'Please input admin username!'}],
                                })(
                                    <Input prefix={<Icon type="user" style={{fontSize: 13}}/>}
                                           placeholder="超级管理员，用户名"
                                           onPressEnter={login}/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: 'Please input admin password!'}],
                                })(
                                    <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                           placeholder="超级管理员，密码"
                                           onPressEnter={login}/>
                                )}
                            </FormItem>
                            <Button type="primary" style={{width: '100%'}} onClick={login}>安装</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

InstallRoute.propTypes = {};

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(Form.create()(InstallRoute));
