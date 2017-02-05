import React, {Component} from 'react';
import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

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
        const {ip, name,port,username,password} = this.props.record;
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
