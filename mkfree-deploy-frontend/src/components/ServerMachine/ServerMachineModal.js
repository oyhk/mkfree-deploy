import React, {Component} from 'react';
import {Modal, Form, Input, Select} from 'antd';

import {ENV_DEV,ENV_TEST,ENV_UAT,ENV_PROD} from '../../constants';

const FormItem = Form.Item;
const Option = Select.Option;

class ServerMachineModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            visible: false,
        };
    }

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({
            visible: true,
        });
    };

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    okHandler = () => {
        const {onOk} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                onOk(values);
                this.hideModelHandler();
            }
        });
    };

    render() {
        const {children} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {ip, type, name,port,username,password} = this.props.record;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        return (
            <span>
                <span onClick={this.showModelHandler}>
                  { children }
                </span>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    width={800}
                    onOk={this.okHandler}
                    onCancel={this.hideModelHandler}
                >
                    <Form horizontal onSubmit={this.okHandler}>

                        <FormItem
                            {...formItemLayout}
                            label="IP地址"
                        >
                            {
                                getFieldDecorator('ip', {
                                    initialValue: ip,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="类型"
                        >
                            {
                                getFieldDecorator('type', {
                                    initialValue: type,
                                })(
                                  <Select placeholder="请选择服务器类型">
                                    <Option value={ENV_DEV[0]}>{ENV_DEV[1]}</Option>
                                    <Option value={ENV_TEST[0]}>{ENV_TEST[1]}</Option>
                                    <Option value={ENV_UAT[0]}>{ENV_UAT[1]}</Option>
                                    <Option value={ENV_PROD[0]}>{ENV_PROD[1]}</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: name,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="ssh端口"
                        >
                            {
                                getFieldDecorator('port', {
                                    initialValue: port,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="ssh用户名"
                        >
                            {
                                getFieldDecorator('username', {
                                    initialValue: username,
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                        >
                            {
                                getFieldDecorator('password', {
                                    initialValue: password,
                                })(<Input />)
                            }
                        </FormItem>
                  </Form>
                </Modal>
              </span>
        );
    }
}

export default Form.create()(ServerMachineModal);
